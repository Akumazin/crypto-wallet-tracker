import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { watcher } from './watcher.js';
import { SUPPORTED_CHAINS } from './chains.js';
import { isValidAddress, fetchLiveBalance } from './blockchain.js';
import { TOKENS_CATALOG } from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket Server on /ws path
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[WebSocket] Novo cliente conectado: ${ip}`);
  watcher.addWsClient(ws);
});

app.use(cors());
app.use(express.json());

// Serve static client files if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Log incoming requests
app.use((req, res, next) => {
  if (req.path !== '/api/events' && req.path !== '/ws') {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// 1. Get supported chains metadata with backup RPCs
app.get('/api/chains', (req, res) => {
  res.json({ success: true, chains: SUPPORTED_CHAINS });
});

// 2. Real-time SSE Stream (Fallback)
app.get('/api/events', (req, res) => {
  watcher.subscribe(req, res);
});

// 3. Wallets CRUD
app.get('/api/wallets', (req, res) => {
  const wallets = db.getWallets();
  res.json({ success: true, count: wallets.length, wallets });
});

app.post('/api/wallets', async (req, res) => {
  try {
    const { address, label, network, tags, color, notes } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, message: "Endereço da carteira é obrigatório." });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({ success: false, message: "Endereço EVM inválido. Deve começar com 0x e conter 40 caracteres hexadecimais." });
    }

    const existing = db.getWalletByAddress(address);
    if (existing) {
      return res.status(400).json({ success: false, message: `Esta carteira já está cadastrada como "${existing.label}".` });
    }

    // Try fetching live balance on the chosen network with fallback RPCs
    const net = (network || 'ethereum').toLowerCase();
    const liveBal = await fetchLiveBalance(net, address);

    const newWallet = db.addWallet({
      address,
      label: label || `Wallet ${address.slice(0, 6)}`,
      network: net,
      tags: tags || ["Trader"],
      color: color || SUPPORTED_CHAINS[net]?.color || "#627EEA",
      balanceUsd: liveBal.balanceUsd || 0,
      notes: notes || ""
    });

    // Notify connected WebSocket clients
    watcher.broadcast({
      type: 'WALLET_ADDED',
      wallet: newWallet
    });

    // Trigger initial sample transaction for this new wallet
    setTimeout(() => {
      watcher.simulateRandomActivity(newWallet);
    }, 1200);

    res.status(201).json({ success: true, wallet: newWallet });
  } catch (err) {
    console.error("Erro ao adicionar carteira:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/wallets/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.updateWallet(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Carteira não encontrada." });
  }

  watcher.broadcast({
    type: 'WALLET_UPDATED',
    wallet: updated
  });

  res.json({ success: true, wallet: updated });
});

app.delete('/api/wallets/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteWallet(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Carteira não encontrada." });
  }

  watcher.broadcast({
    type: 'WALLET_DELETED',
    walletId: id
  });

  res.json({ success: true, message: "Carteira removida com sucesso." });
});

// 4. Transactions List & Filter
app.get('/api/transactions', (req, res) => {
  const { walletId, network, type, search } = req.query;
  const transactions = db.getTransactions({ walletId, network, type, search });
  res.json({ success: true, count: transactions.length, transactions });
});

// 5. Trigger Instant Simulation (Manual Test for user)
app.post('/api/transactions/simulate', (req, res) => {
  const { walletId, type } = req.body;
  const targetWallet = walletId ? db.getWalletById(walletId) : null;
  const tx = watcher.simulateRandomActivity(targetWallet, type);

  if (!tx) {
    return res.status(400).json({ success: false, message: "Nenhuma carteira ativa disponível para simulação." });
  }

  res.json({ success: true, transaction: tx });
});

// 6. Aggregated NFT Hub
app.get('/api/nfts', (req, res) => {
  const txs = db.getTransactions();
  const nftTxs = txs.filter(t => t.nftCollection && (t.type === 'NFT_MINT' || t.type === 'NFT_BUY' || t.type === 'NFT_SELL'));
  
  res.json({
    success: true,
    count: nftTxs.length,
    recentNftActivity: nftTxs
  });
});

// 7. Aggregated Token Radar
app.get('/api/tokens', (req, res) => {
  const txs = db.getTransactions();
  const tokenStats = {};

  txs.forEach(t => {
    const symbol = t.tokenSymbol || 'ETH';
    if (!tokenStats[symbol]) {
      tokenStats[symbol] = {
        symbol,
        name: t.tokenName || symbol,
        logo: t.tokenLogo || null,
        network: t.network,
        volumeUsd: 0,
        txCount: 0,
        swapsCount: 0
      };
    }
    tokenStats[symbol].volumeUsd += (t.valueUsd || 0);
    tokenStats[symbol].txCount += 1;
    if (t.type === 'TOKEN_SWAP') {
      tokenStats[symbol].swapsCount += 1;
    }
  });

  const tokensList = Object.values(tokenStats).sort((a, b) => b.volumeUsd - a.volumeUsd);
  res.json({ success: true, tokens: tokensList, catalog: TOKENS_CATALOG });
});

// 8. Overview Stats KPI
app.get('/api/stats', (req, res) => {
  const wallets = db.getWallets();
  const transactions = db.getTransactions();

  const totalBalanceUsd = wallets.reduce((acc, w) => acc + (w.balanceUsd || 0), 0);
  const total24hVolumeUsd = transactions.reduce((acc, t) => acc + (t.valueUsd || 0), 0);
  const totalNftMints = transactions.filter(t => t.type === 'NFT_MINT').length;
  const totalTokenSwaps = transactions.filter(t => t.type === 'TOKEN_SWAP').length;

  res.json({
    success: true,
    stats: {
      totalWallets: wallets.length,
      activeWallets: wallets.filter(w => w.isActive).length,
      totalNetWorthUsd: totalBalanceUsd,
      volume24hUsd: total24hVolumeUsd,
      totalTransactions: transactions.length,
      nftMintsCount: totalNftMints,
      tokenSwapsCount: totalTokenSwaps
    }
  });
});

// 9. Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: db.getSettings() });
});

app.put('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  if (req.body.simulationIntervalSec !== undefined) {
    watcher.restart();
  }
  res.json({ success: true, settings: updated });
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Start Server with WebSocket attachment
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ AlphaTracker Server (HTTP + WebSocket) rodando na porta ${PORT}`);
  console.log(`🌐 9 Redes ativas com Multi-RPC Failover e WSS`);
  console.log(`🔌 WebSocket Endpoint: ws://localhost:${PORT}/ws`);
  console.log(`======================================================\n`);
  watcher.start();
});
