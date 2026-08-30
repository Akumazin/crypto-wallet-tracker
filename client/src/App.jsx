import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TransactionFeed from './components/TransactionFeed';
import NFTGallery from './components/NFTGallery';
import TokenTracker from './components/TokenTracker';
import WalletManager from './components/WalletManager';
import AnalyticsCharts from './components/AnalyticsCharts';
import AddWalletModal from './components/AddWalletModal';
import WalletDetailModal from './components/WalletDetailModal';
import LiveToast from './components/LiveToast';
import { 
  fetchChains, 
  fetchWallets, 
  fetchTransactions, 
  fetchStats, 
  fetchNFTs, 
  fetchTokens, 
  fetchSettings, 
  addWallet as apiAddWallet, 
  updateWallet as apiUpdateWallet, 
  deleteWallet as apiDeleteWallet, 
  simulateTransaction, 
  updateSettings as apiUpdateSettings, 
  subscribeToEvents 
} from './services/api';
import { WebSocketClient } from './services/websocket';
import { soundManager } from './services/audio';
import confetti from 'canvas-confetti';

export default function App() {
  const [chains, setChains] = useState({});
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [tokensData, setTokensData] = useState(null);
  const [settings, setSettings] = useState({ simulationActive: true, soundEnabled: true });
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [activeTab, setActiveTab] = useState('feed');
  const [isConnected, setIsConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWalletDetailId, setSelectedWalletDetailId] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initial Data Load
  const loadInitialData = async () => {
    try {
      const [chainsRes, walletsRes, txRes, statsRes, tokensRes, settingsRes] = await Promise.all([
        fetchChains(),
        fetchWallets(),
        fetchTransactions(),
        fetchStats(),
        fetchTokens(),
        fetchSettings()
      ]);

      if (chainsRes.success) setChains(chainsRes.chains);
      if (walletsRes.success) setWallets(walletsRes.wallets);
      if (txRes.success) setTransactions(txRes.transactions);
      if (statsRes.success) setStats(statsRes.stats);
      if (tokensRes.success) setTokensData(tokensRes);
      if (settingsRes.success) {
        setSettings(settingsRes.settings);
        setSoundEnabled(settingsRes.settings.soundEnabled ?? true);
        soundManager.setEnabled(settingsRes.settings.soundEnabled ?? true);
      }
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
    }
  };

  useEffect(() => {
    loadInitialData();

    const handleIncomingEvent = (event) => {
      if (event.type === 'NEW_TRANSACTION') {
        const tx = event.transaction;

        setTransactions(prev => [tx, ...prev.slice(0, 499)]);

        if (tx.type === 'NFT_MINT') {
          soundManager.playNftMintSound();
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.85 }
          });
        } else {
          soundManager.playTxPing();
        }

        const alertItem = {
          id: `alert-${Date.now()}-${Math.random()}`,
          transaction: tx
        };
        setLiveAlerts(prev => [alertItem, ...prev.slice(0, 3)]);

        setTimeout(() => {
          setLiveAlerts(prev => prev.filter(a => a.id !== alertItem.id));
        }, 6000);

        fetchStats().then(res => res.success && setStats(res.stats));
        fetchTokens().then(res => res.success && setTokensData(res));
      } else if (event.type === 'WALLET_ADDED') {
        setWallets(prev => [event.wallet, ...prev]);
        fetchStats().then(res => res.success && setStats(res.stats));
      } else if (event.type === 'WALLET_UPDATED') {
        setWallets(prev => prev.map(w => w.id === event.wallet.id ? event.wallet : w));
      } else if (event.type === 'WALLET_DELETED') {
        setWallets(prev => prev.filter(w => w.id !== event.walletId));
        fetchStats().then(res => res.success && setStats(res.stats));
      }
    };

    // Primary: WebSocket Connection
    const wsClient = new WebSocketClient(
      handleIncomingEvent,
      (status) => setIsConnected(status)
    );
    wsClient.connect();

    // Fallback: SSE connection if WebSocket fails
    const unsubscribeSse = subscribeToEvents(
      (event) => {
        setIsConnected(true);
        handleIncomingEvent(event);
      },
      () => {}
    );

    return () => {
      wsClient.close();
      unsubscribeSse();
    };
  }, []);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setEnabled(nextVal);
    apiUpdateSettings({ soundEnabled: nextVal });
  };

  const handleToggleSimulation = async () => {
    const nextVal = !settings.simulationActive;
    setSettings(prev => ({ ...prev, simulationActive: nextVal }));
    await apiUpdateSettings({ simulationActive: nextVal });
  };

  const handleAddWallet = async (walletData) => {
    const res = await apiAddWallet(walletData);
    if (res.success) {
      loadInitialData();
    }
    return res;
  };

  const handleToggleWalletActive = async (id, isActive) => {
    await apiUpdateWallet(id, { isActive });
  };

  const handleDeleteWallet = async (id) => {
    if (window.confirm("Deseja realmente remover esta carteira do monitoramento?")) {
      await apiDeleteWallet(id);
    }
  };

  const handleQuickSimulate = async (type = 'NFT_MINT') => {
    setIsSimulating(true);
    try {
      await simulateTransaction({ type });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSimulating(false), 800);
    }
  };

  const handleSimulateTokenSwap = async (network, symbol) => {
    setIsSimulating(true);
    try {
      await simulateTransaction({ type: 'TOKEN_SWAP' });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSimulating(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        chains={chains}
        selectedNetwork={selectedNetwork}
        onSelectNetwork={setSelectedNetwork}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isConnected={isConnected}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        settings={settings}
        onToggleSimulation={handleToggleSimulation}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metrics */}
        <StatsOverview 
          stats={stats} 
          onQuickSimulate={handleQuickSimulate}
          isSimulating={isSimulating}
        />

        {/* Content based on Active Tab */}
        {activeTab === 'feed' && (
          <TransactionFeed
            transactions={transactions}
            wallets={wallets}
            chains={chains}
            selectedNetwork={selectedNetwork}
            onSelectWalletDetail={(id) => setSelectedWalletDetailId(id)}
          />
        )}

        {activeTab === 'nfts' && (
          <NFTGallery
            transactions={transactions}
            chains={chains}
            selectedNetwork={selectedNetwork}
            onSelectWalletDetail={(id) => setSelectedWalletDetailId(id)}
          />
        )}

        {activeTab === 'tokens' && (
          <TokenTracker
            tokens={tokensData}
            chains={chains}
            selectedNetwork={selectedNetwork}
            onSimulateTokenSwap={handleSimulateTokenSwap}
          />
        )}

        {activeTab === 'wallets' && (
          <WalletManager
            wallets={wallets}
            chains={chains}
            selectedNetwork={selectedNetwork}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onToggleActive={handleToggleWalletActive}
            onDeleteWallet={handleDeleteWallet}
            onSelectWalletDetail={(id) => setSelectedWalletDetailId(id)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsCharts
            transactions={transactions}
            wallets={wallets}
            chains={chains}
          />
        )}
      </main>

      {/* Modals & Popups */}
      <AddWalletModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWallet={handleAddWallet}
        chains={chains}
      />

      <WalletDetailModal
        walletId={selectedWalletDetailId}
        wallets={wallets}
        transactions={transactions}
        chains={chains}
        onClose={() => setSelectedWalletDetailId(null)}
        onSimulateTx={(w) => simulateTransaction({ walletId: w.id })}
      />

      {/* Real-time Toast Notifications */}
      <LiveToast
        alerts={liveAlerts}
        onDismiss={(id) => setLiveAlerts(prev => prev.filter(a => a.id !== id))}
        chains={chains}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 font-mono">
        <p>Crypto & NFT Multi-Chain Wallet Tracker • Monitorando Ethereum, Robinhood, HyperEVM, BNB, Base, Arbitrum, Monad, Ink & ApeChain</p>
      </footer>
    </div>
  );
}
