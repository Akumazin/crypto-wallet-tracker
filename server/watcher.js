import { db } from './db.js';
import { SUPPORTED_CHAINS } from './chains.js';
import { NFT_COLLECTIONS_DATA, TOKENS_CATALOG } from './mockData.js';
import { generateRandomHash } from './blockchain.js';

class WatcherEngine {
  constructor() {
    this.clients = [];
    this.intervalId = null;
    this.isRunning = false;
  }

  // Subscribe SSE client
  subscribe(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    this.clients.push(res);

    req.on('close', () => {
      this.clients = this.clients.filter(client => client !== res);
    });
  }

  // Broadcast event to all SSE clients
  broadcast(event) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    this.clients.forEach(client => {
      try {
        client.write(payload);
      } catch (err) {
        // client closed
      }
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("[Watcher] Motor de monitoramento de carteiras iniciado.");

    const settings = db.getSettings();
    const intervalMs = (settings.simulationIntervalSec || 8) * 1000;

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

    // Pick transaction type: NFT_MINT, NFT_BUY, NFT_SELL, TOKEN_SWAP, TOKEN_TRANSFER
    const types = ['NFT_MINT', 'NFT_BUY', 'TOKEN_SWAP', 'TOKEN_SWAP', 'TOKEN_TRANSFER'];
    const chosenType = explicitType || types[Math.floor(Math.random() * types.length)];

    let tx = null;
    const txHash = generateRandomHash();
    const now = new Date().toISOString();

    if (chosenType === 'NFT_MINT' || chosenType === 'NFT_BUY' || chosenType === 'NFT_SELL') {
      // Find collection for this network or general
      const collectionsForChain = NFT_COLLECTIONS_DATA.filter(c => c.network === chainKey);
      const collection = collectionsForChain.length > 0
        ? collectionsForChain[Math.floor(Math.random() * collectionsForChain.length)]
        : NFT_COLLECTIONS_DATA[Math.floor(Math.random() * NFT_COLLECTIONS_DATA.length)];

      const tokenId = `#${Math.floor(Math.random() * 9000 + 1000)}`;
      const priceVal = (collection.floorPriceEth * (0.8 + Math.random() * 0.5)).toFixed(3);
      const priceUsd = parseFloat((priceVal * chain.nativePriceUsd).toFixed(2));

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
        gasFee: `0.00${Math.floor(Math.random() * 80 + 10)} ${chain.symbol}`,
        timestamp: now,
        status: "CONFIRMED",
        notes: chosenType === 'NFT_MINT' 
          ? `Novo Mint de NFT detectado em ${chain.name}` 
          : `Negociação de NFT no marketplace descentralizado`
      };
    } else if (chosenType === 'TOKEN_SWAP') {
      const tokens = TOKENS_CATALOG[chainKey] || TOKENS_CATALOG.ethereum;
      const t1 = tokens[0]; // Native or major
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
        to: '0x1111111254fb6c44bac0bed2854e76f90643097d', // DEX Router
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
      // TOKEN TRANSFER
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

    // Save to database
    const savedTx = db.addTransaction(tx);

    // Broadcast real-time event
    this.broadcast({
      type: 'NEW_TRANSACTION',
      transaction: savedTx
    });

    return savedTx;
  }
}

export const watcher = new WatcherEngine();
