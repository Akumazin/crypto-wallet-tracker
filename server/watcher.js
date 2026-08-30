import { WebSocket } from 'ws';
import { db } from './db.js';
import { SUPPORTED_CHAINS } from './chains.js';
import { NFT_COLLECTIONS_DATA, TOKENS_CATALOG } from './mockData.js';
import { generateRandomHash } from './blockchain.js';
import { isScamOrSpam, getOpenSeaUrl, getCollectionUrl } from './antiSpam.js';

class WatcherEngine {
  constructor() {
    this.wsClients = new Set();
    this.sseClients = [];
    this.intervalId = null;
    this.isRunning = false;
  }

  // Register WebSocket client
  addWsClient(ws) {
    this.wsClients.add(ws);
    // Send initial handshake
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

  // Subscribe SSE client (for compatibility)
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

    // 1. Broadcast to WebSocket clients
    this.wsClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(payload);
        } catch (err) {
          this.wsClients.delete(ws);
        }
      }
    });

    // 2. Broadcast to SSE clients
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
    console.log("[Watcher] Motor de monitoramento WebSocket iniciado.");

    const settings = db.getSettings();
    const intervalMs = (settings.simulationIntervalSec || 6) * 1000;

    this.intervalId = setInterval(() => {
      if (!db.getSettings().simulationActive) return;
      this.simulateRandomActivity();
    }, intervalMs);
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

  // Generate real-time NFT / Token transaction for one of the active wallets
  simulateRandomActivity(targetWallet = null, explicitType = null) {
    const activeWallets = db.getWallets().filter(w => w.isActive);
    if (activeWallets.length === 0) return null;

    const wallet = targetWallet || activeWallets[Math.floor(Math.random() * activeWallets.length)];
    const chainKey = (wallet.network || 'ethereum').toLowerCase();
    const chain = SUPPORTED_CHAINS[chainKey] || SUPPORTED_CHAINS.ethereum;

    const types = ['NFT_MINT', 'NFT_BUY', 'TOKEN_SWAP', 'TOKEN_SWAP', 'TOKEN_TRANSFER'];
    const chosenType = explicitType || types[Math.floor(Math.random() * types.length)];

    let tx = null;
    const txHash = generateRandomHash();
    const now = new Date().toISOString();

    if (chosenType === 'NFT_MINT' || chosenType === 'NFT_BUY' || chosenType === 'NFT_SELL') {
      const collectionsForChain = NFT_COLLECTIONS_DATA.filter(c => c.network === chainKey);
      const collection = collectionsForChain.length > 0
        ? collectionsForChain[Math.floor(Math.random() * collectionsForChain.length)]
        : NFT_COLLECTIONS_DATA[Math.floor(Math.random() * NFT_COLLECTIONS_DATA.length)];

      const tokenId = `#${Math.floor(Math.random() * 9000 + 1000)}`;
      const priceVal = (collection.floorPriceEth * (0.8 + Math.random() * 0.5)).toFixed(3);
      const priceUsd = parseFloat((priceVal * chain.nativePriceUsd).toFixed(2));

      const contractAddr = collection.contractAddress || '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
      const openSeaUrl = getOpenSeaUrl(chain.id, contractAddr, tokenId);
      const openSeaCollectionUrl = getCollectionUrl(chain.id, collection.openSeaSlug || collection.name, contractAddr);

      tx = {
        walletId: wallet.id,
        walletAddress: wallet.address,
        walletLabel: wallet.label,
        network: chain.id,
        type: chosenType,
        txHash,
        from: chosenType === 'NFT_MINT' ? '0x0000000000000000000000000000000000000000' : '0x' + Array(40).fill('a').join(''),
        to: wallet.address,
        valueToken: parseFloat(priceVal),
        tokenSymbol: chain.symbol,
        tokenName: chain.name,
        valueUsd: priceUsd,
        nftCollection: collection.name,
        nftTokenId: tokenId,
        nftImage: collection.image,
        contractAddress: contractAddr,
        openSeaUrl: openSeaUrl,
        openSeaCollectionUrl: openSeaCollectionUrl,
        gasFee: `0.00${Math.floor(Math.random() * 80 + 10)} ${chain.symbol}`,
        timestamp: now,
        status: "CONFIRMED",
        notes: chosenType === 'NFT_MINT' 
          ? `Novo Mint de NFT detectado em ${chain.name}` 
          : `Negociação de NFT no marketplace descentralizado`
      };
    } else if (chosenType === 'TOKEN_SWAP') {
      const tokens = TOKENS_CATALOG[chainKey] || TOKENS_CATALOG.ethereum;
      const t1 = tokens[0];
      const t2 = tokens.length > 1 ? tokens[Math.floor(Math.random() * (tokens.length - 1)) + 1] : tokens[0];

      const inAmount = (Math.random() * 3 + 0.2).toFixed(2);
      const swapValueUsd = parseFloat((inAmount * chain.nativePriceUsd).toFixed(2));
      const outAmount = Math.floor(swapValueUsd / (t2.priceUsd || 1));

      tx = {
        walletId: wallet.id,
        walletAddress: wallet.address,
        walletLabel: wallet.label,
        network: chain.id,
        type: 'TOKEN_SWAP',
        txHash,
        from: wallet.address,
        to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
        valueToken: parseFloat(inAmount),
        tokenSymbol: chain.symbol,
        tokenName: chain.name,
        tokenLogo: t2.logo,
        valueUsd: swapValueUsd,
        swapFromToken: `${inAmount} ${chain.symbol}`,
        swapToToken: `${outAmount.toLocaleString()} $${t2.symbol}`,
        gasFee: `0.000${Math.floor(Math.random() * 50 + 10)} ${chain.symbol}`,
        timestamp: now,
        status: "CONFIRMED",
        notes: `Swap de token em DEX descentralizada na rede ${chain.name}`
      };
    } else {
      const tokens = TOKENS_CATALOG[chainKey] || TOKENS_CATALOG.ethereum;
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      const amount = (Math.random() * 10 + 0.5).toFixed(2);
      const valUsd = parseFloat((amount * (token.priceUsd || chain.nativePriceUsd)).toFixed(2));

      tx = {
        walletId: wallet.id,
        walletAddress: wallet.address,
        walletLabel: wallet.label,
        network: chain.id,
        type: 'TOKEN_TRANSFER',
        txHash,
        from: wallet.address,
        to: '0x' + Array(40).fill('f').join(''),
        valueToken: parseFloat(amount),
        tokenSymbol: token.symbol,
        tokenName: token.name,
        tokenLogo: token.logo,
        valueUsd: valUsd,
        gasFee: `0.000${Math.floor(Math.random() * 30 + 5)} ${chain.symbol}`,
        timestamp: now,
        status: "CONFIRMED",
        notes: `Transferência de ${amount} ${token.symbol} realizada com sucesso.`
      };
    }

    // Run Anti-Spam / Anti-Scam filter
    const spamCheck = isScamOrSpam(tx);
    tx.isSpam = spamCheck.isSpam;
    tx.spamReason = spamCheck.reason;

    // Save to database
    const savedTx = db.addTransaction(tx);

    // Only broadcast if not spam
    if (!tx.isSpam) {
      this.broadcast({
        type: 'NEW_TRANSACTION',
        transaction: savedTx
      });
    }

    return savedTx;
  }
}

export const watcher = new WatcherEngine();
