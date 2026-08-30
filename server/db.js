import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_WALLETS, INITIAL_TRANSACTIONS } from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db_store.json');

class Database {
  constructor() {
    this.wallets = [];
    this.transactions = [];
    this.settings = {
      simulationActive: true,
      simulationIntervalSec: 6,
      minAlertUsd: 50,
      soundEnabled: true,
      autoScrollFeed: true
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.wallets = parsed.wallets || [];
        this.transactions = parsed.transactions || [];
        this.settings = { ...this.settings, ...(parsed.settings || {}) };
      } else {
        this.wallets = [];
        this.transactions = [];
        this.save();
      }
    } catch (e) {
      console.error("Erro ao carregar banco de dados:", e);
      this.wallets = [];
      this.transactions = [];
    }
  }

  save() {
    try {
      const payload = {
        wallets: this.wallets,
        transactions: this.transactions,
        settings: this.settings,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.error("Erro ao salvar dados:", e);
    }
  }

  getWallets() {
    return this.wallets;
  }

  getWalletById(id) {
    return this.wallets.find(w => w.id === id);
  }

  getWalletByAddress(address) {
    return this.wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
  }

  addWallet(walletData) {
    const newWallet = {
      id: walletData.id || `w-${Date.now()}`,
      address: walletData.address.trim(),
      label: walletData.label?.trim() || "Nova Carteira",
      network: walletData.network || "ethereum",
      tags: Array.isArray(walletData.tags) ? walletData.tags : (walletData.tags ? walletData.tags.split(',').map(t => t.trim()) : ["Monitored"]),
      color: walletData.color || "#627EEA",
      isActive: walletData.isActive !== false,
      createdAt: new Date().toISOString(),
      balanceUsd: walletData.balanceUsd || 15000.0,
      notes: walletData.notes || "Carteira adicionada para monitoramento contínuo."
    };

    this.wallets.unshift(newWallet);
    this.save();
    return newWallet;
  }

  updateWallet(id, updates) {
    const idx = this.wallets.findIndex(w => w.id === id);
    if (idx === -1) return null;

    this.wallets[idx] = {
      ...this.wallets[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.wallets[idx];
  }

  deleteWallet(id) {
    const idx = this.wallets.findIndex(w => w.id === id);
    if (idx === -1) return false;
    this.wallets.splice(idx, 1);
    this.save();
    return true;
  }

  getTransactions(filter = {}) {
    let result = [...this.transactions];

    if (filter.walletId) {
      result = result.filter(t => t.walletId === filter.walletId);
    }
    if (filter.network && filter.network !== 'all') {
      result = result.filter(t => t.network.toLowerCase() === filter.network.toLowerCase());
    }
    if (filter.type && filter.type !== 'all') {
      result = result.filter(t => t.type === filter.type);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(t => 
        t.walletLabel?.toLowerCase().includes(q) ||
        t.walletAddress?.toLowerCase().includes(q) ||
        t.txHash?.toLowerCase().includes(q) ||
        t.nftCollection?.toLowerCase().includes(q) ||
        t.tokenSymbol?.toLowerCase().includes(q) ||
        t.tokenName?.toLowerCase().includes(q)
      );
    }

    // Sort by timestamp descending
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return result;
  }

  addTransaction(txData) {
    const newTx = {
      id: txData.id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      walletId: txData.walletId,
      walletAddress: txData.walletAddress,
      walletLabel: txData.walletLabel || "Carteira Rastreada",
      network: txData.network || "ethereum",
      type: txData.type || "TOKEN_TRANSFER",
      txHash: txData.txHash,
      from: txData.from,
      to: txData.to,
      valueToken: txData.valueToken || 0,
      tokenSymbol: txData.tokenSymbol || "ETH",
      tokenName: txData.tokenName || "Ethereum",
      tokenLogo: txData.tokenLogo || null,
      valueUsd: txData.valueUsd || 0,
      nftCollection: txData.nftCollection || null,
      nftTokenId: txData.nftTokenId || null,
      nftImage: txData.nftImage || null,
      swapFromToken: txData.swapFromToken || null,
      swapToToken: txData.swapToToken || null,
      gasFee: txData.gasFee || "0.001 ETH ($2.85)",
      timestamp: txData.timestamp || new Date().toISOString(),
      status: txData.status || "CONFIRMED",
      notes: txData.notes || ""
    };

    this.transactions.unshift(newTx);
    // Keep max 500 recent transactions
    if (this.transactions.length > 500) {
      this.transactions = this.transactions.slice(0, 500);
    }

    this.save();
    return newTx;
  }

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save();
    return this.settings;
  }
}

export const db = new Database();
