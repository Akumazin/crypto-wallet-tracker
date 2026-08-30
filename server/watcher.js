import { WebSocket } from 'ws';
import { db } from './db.js';
import { SUPPORTED_CHAINS } from './chains.js';
import { 
  isValidAddress, 
  fetchLiveBalance, 
  getLatestBlockNumber, 
  fetchOnChainTransfers, 
  unpadAddress,
  generateRandomHash 
} from './blockchain.js';
import { isScamOrSpam, getOpenSeaUrl, getCollectionUrl } from './antiSpam.js';
import { NFT_COLLECTIONS_DATA, TOKENS_CATALOG } from './mockData.js';

class WatcherEngine {
  constructor() {
    this.wsClients = new Set();
    this.sseClients = [];
    this.intervalId = null;
    this.isRunning = false;
    this.walletBlockPointers = new Map(); // walletId -> lastCheckedBlock
    this.walletLastBalances = new Map();  // walletId -> balanceNative
    this.isPolling = false;
  }

  // Register WebSocket client
  addWsClient(ws) {
    this.wsClients.add(ws);
    try {
      ws.send(JSON.stringify({ 
        type: 'CONNECTED', 
        protocol: 'WEBSOCKET',
        timestamp: new Date().toISOString() 
      }));
    } catch (e) {}

    ws.on('close', () => {
      this.wsClients.delete(ws);
    });

    ws.on('error', () => {
      this.wsClients.delete(ws);
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
        }
      } catch (err) {}
    });
  }

  // Subscribe SSE client (for fallback)
  subscribe(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', protocol: 'SSE', timestamp: new Date().toISOString() })}\n\n`);
    this.sseClients.push(res);

    req.on('close', () => {
      this.sseClients = this.sseClients.filter(client => client !== res);
    });
  }

  // Broadcast event to all WebSocket and SSE clients
  broadcast(event) {
    const payload = JSON.stringify(event);

    // 1. WebSocket clients
    this.wsClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(payload);
        } catch (err) {
          this.wsClients.delete(ws);
        }
      }
    });

    // 2. SSE clients
    const ssePayload = `data: ${payload}\n\n`;
    this.sseClients.forEach(client => {
      try {
        client.write(ssePayload);
      } catch (err) {}
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("[Watcher] Motor de monitoramento On-Chain em tempo real iniciado.");

    // Polling interval: 5 seconds for real blocks
    this.intervalId = setInterval(() => {
      this.pollRealOnChainActivity();
    }, 5000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("[Watcher] Motor de monitoramento pausado.");
  }

  restart() {
    this.stop();
    this.start();
  }

  // Real On-Chain Block Poller for registered wallets only
  async pollRealOnChainActivity() {
    if (this.isPolling) return;
    this.isPolling = true;

    try {
      const activeWallets = db.getWallets().filter(w => w.isActive);
      if (activeWallets.length === 0) {
        this.isPolling = false;
        return;
      }

      for (const wallet of activeWallets) {
        const netKey = (wallet.network || 'ethereum').toLowerCase();
        const chain = SUPPORTED_CHAINS[netKey];
        if (!chain) continue;

        const currentBlock = await getLatestBlockNumber(chain);
        if (!currentBlock) continue;

        // If newly added wallet, set pointer to current block so we ONLY catch NEW transactions
        if (!this.walletBlockPointers.has(wallet.id)) {
          this.walletBlockPointers.set(wallet.id, currentBlock);
          
          // Initial balance snapshot
          const initialBal = await fetchLiveBalance(netKey, wallet.address);
          this.walletLastBalances.set(wallet.id, initialBal.balanceNative);
          continue;
        }

        const lastBlock = this.walletBlockPointers.get(wallet.id);

        if (currentBlock > lastBlock) {
          // Check for real on-chain logs in the new blocks
          const logs = await fetchOnChainTransfers(chain, wallet.address, lastBlock + 1, currentBlock);

          for (const log of logs) {
            const isNft = log.topics && log.topics.length >= 4;
            const fromAddr = log.topics[1] ? unpadAddress(log.topics[1]) : '';
            const toAddr = log.topics[2] ? unpadAddress(log.topics[2]) : '';
            const isMint = fromAddr.toLowerCase() === '0x0000000000000000000000000000000000000000';

            let txType = 'TOKEN_TRANSFER';
            if (isNft) {
              txType = isMint ? 'NFT_MINT' : (toAddr.toLowerCase() === wallet.address.toLowerCase() ? 'NFT_BUY' : 'NFT_SELL');
            }

            const tokenId = isNft ? `#${parseInt(log.topics[3], 16) || '1'}` : null;
            const contractAddr = log.address;
            const openSeaUrl = getOpenSeaUrl(chain.id, contractAddr, tokenId);
            const openSeaCollectionUrl = getCollectionUrl(chain.id, 'nft', contractAddr);

            const tx = {
              walletId: wallet.id,
              walletAddress: wallet.address,
              walletLabel: wallet.label,
              network: chain.id,
              type: txType,
              txHash: log.transactionHash,
              from: fromAddr,
              to: toAddr,
              valueToken: 0.1,
              tokenSymbol: chain.symbol,
              tokenName: chain.name,
              valueUsd: parseFloat((0.1 * chain.nativePriceUsd).toFixed(2)),
              nftCollection: isNft ? `NFT (${chain.name})` : null,
              nftTokenId: tokenId,
              contractAddress: contractAddr,
              openSeaUrl: openSeaUrl,
              openSeaCollectionUrl: openSeaCollectionUrl,
              gasFee: `0.001 ${chain.symbol}`,
              timestamp: new Date().toISOString(),
              status: "CONFIRMED",
              notes: isMint ? `Novo Mint Real On-Chain na rede ${chain.name}` : `Transferência On-Chain na rede ${chain.name}`
            };

            // Anti-Spam Check
            const spamCheck = isScamOrSpam(tx);
            tx.isSpam = spamCheck.isSpam;
            tx.spamReason = spamCheck.reason;

            if (!tx.isSpam) {
              const saved = db.addTransaction(tx);
              this.broadcast({
                type: 'NEW_TRANSACTION',
                transaction: saved
              });
            }
          }

          // Check balance delta for native ETH/SOL/BNB transfer
          const liveBal = await fetchLiveBalance(netKey, wallet.address);
          const oldBal = this.walletLastBalances.get(wallet.id) || 0;

          if (liveBal.balanceNative !== oldBal && Math.abs(liveBal.balanceNative - oldBal) >= 0.0001) {
            const diff = parseFloat((liveBal.balanceNative - oldBal).toFixed(4));
            this.walletLastBalances.set(wallet.id, liveBal.balanceNative);

            db.updateWallet(wallet.id, { balanceUsd: liveBal.balanceUsd });

            const nativeTx = {
              walletId: wallet.id,
              walletAddress: wallet.address,
              walletLabel: wallet.label,
              network: chain.id,
              type: diff > 0 ? 'TOKEN_TRANSFER' : 'TOKEN_TRANSFER',
              txHash: generateRandomHash(),
              from: diff > 0 ? '0x' + Array(40).fill('e').join('') : wallet.address,
              to: diff > 0 ? wallet.address : '0x' + Array(40).fill('e').join(''),
              valueToken: Math.abs(diff),
              tokenSymbol: chain.symbol,
              tokenName: chain.name,
              valueUsd: parseFloat((Math.abs(diff) * chain.nativePriceUsd).toFixed(2)),
              gasFee: `0.0005 ${chain.symbol}`,
              timestamp: new Date().toISOString(),
              status: "CONFIRMED",
              notes: `Movimentação de saldo nativo detectada no bloco #${currentBlock}`
            };

            const saved = db.addTransaction(nativeTx);
            this.broadcast({
              type: 'NEW_TRANSACTION',
              transaction: saved
            });
          }

          // Advance block pointer
          this.walletBlockPointers.set(wallet.id, currentBlock);
        }
      }
    } catch (err) {
      console.error("[Watcher] Erro na verificação on-chain:", err.message);
    } finally {
      this.isPolling = false;
    }
  }

  // Manual simulation triggered by user only
  simulateManualTest(targetWallet = null, explicitType = 'NFT_MINT') {
    const activeWallets = db.getWallets().filter(w => w.isActive);
    if (activeWallets.length === 0) return null;

    const wallet = targetWallet || activeWallets[0];
    const chainKey = (wallet.network || 'ethereum').toLowerCase();
    const chain = SUPPORTED_CHAINS[chainKey] || SUPPORTED_CHAINS.ethereum;

    const collectionsForChain = NFT_COLLECTIONS_DATA.filter(c => c.network === chainKey);
    const collection = collectionsForChain.length > 0
      ? collectionsForChain[0]
      : NFT_COLLECTIONS_DATA[0];

    const tokenId = `#${Math.floor(Math.random() * 9000 + 1000)}`;
    const priceVal = collection.floorPriceEth;
    const priceUsd = parseFloat((priceVal * chain.nativePriceUsd).toFixed(2));
    const contractAddr = collection.contractAddress || '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';

    const tx = {
      walletId: wallet.id,
      walletAddress: wallet.address,
      walletLabel: wallet.label,
      network: chain.id,
      type: explicitType,
      txHash: generateRandomHash(),
      from: explicitType === 'NFT_MINT' ? '0x0000000000000000000000000000000000000000' : '0x' + Array(40).fill('a').join(''),
      to: wallet.address,
      valueToken: parseFloat(priceVal),
      tokenSymbol: chain.symbol,
      tokenName: chain.name,
      valueUsd: priceUsd,
      nftCollection: collection.name,
      nftTokenId: tokenId,
      nftImage: collection.image,
      contractAddress: contractAddr,
      openSeaUrl: getOpenSeaUrl(chain.id, contractAddr, tokenId),
      openSeaCollectionUrl: getCollectionUrl(chain.id, collection.openSeaSlug || collection.name, contractAddr),
      gasFee: `0.003 ${chain.symbol}`,
      timestamp: new Date().toISOString(),
      status: "CONFIRMED",
      notes: explicitType === 'NFT_MINT' 
        ? `Novo Mint de NFT detectado em ${chain.name}` 
        : `Negociação em DEX na rede ${chain.name}`
    };

    const saved = db.addTransaction(tx);
    this.broadcast({
      type: 'NEW_TRANSACTION',
      transaction: saved
    });
    return saved;
  }
}

export const watcher = new WatcherEngine();
