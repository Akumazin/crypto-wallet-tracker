import React from 'react';
import { 
  Radar, 
  Plus, 
  Volume2, 
  VolumeX, 
  Radio, 
  Zap, 
  Sliders, 
  Layers, 
  Sparkles,
  Play,
  Pause
} from 'lucide-react';

export default function Navbar({ 
  chains, 
  selectedNetwork, 
  onSelectNetwork, 
  onOpenAddModal, 
  isConnected, 
  soundEnabled, 
  onToggleSound, 
  settings, 
  onToggleSimulation,
  activeTab,
  onSelectTab
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple via-brand-cyan to-brand-green p-[2px]">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Radar className="w-5 h-5 text-brand-cyan animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-cyan bg-clip-text text-transparent">
                  AlphaTracker
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-purple/20 text-brand-purple border border-brand-purple/30 rounded-full">
                  NFT & Tokens
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`}></span>
                <span>{isConnected ? 'WEBSOCKET LIVE (9 REDES)' : 'RECONECTANDO...'}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-dark-900 border border-slate-800/80 rounded-xl">
            {[
              { id: 'feed', label: 'Feed ao Vivo', icon: Radio },
              { id: 'nfts', label: 'Galeria NFTs', icon: Sparkles },
              { id: 'tokens', label: 'Radar de Tokens', icon: Zap },
              { id: 'wallets', label: 'Carteiras', icon: Layers },
              { id: 'analytics', label: 'Analytics', icon: Sliders }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Simulation Toggle */}
            <button
              onClick={onToggleSimulation}
              title={settings?.simulationActive ? "Pausar Simulação" : "Iniciar Simulação"}
              className={`p-2 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-all ${
                settings?.simulationActive 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              {settings?.simulationActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px]">Auto-Monitor: ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px]">Auto-Monitor: PAUSED</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "Silenciar Alertas Sonoros" : "Ativar Alertas Sonoros"}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled 
                  ? 'bg-dark-850 border-slate-700 text-cyan-400 hover:border-cyan-500/50' 
                  : 'bg-dark-900 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Add Wallet Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-dark-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Adicionar Carteira</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto space-x-1">
          {[
            { id: 'feed', label: 'Feed', icon: Radio },
            { id: 'nfts', label: 'NFTs', icon: Sparkles },
            { id: 'tokens', label: 'Tokens', icon: Zap },
            { id: 'wallets', label: 'Carteiras', icon: Layers },
            { id: 'analytics', label: 'Analytics', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Network Multi-Chain Pills Bar */}
        <div className="py-2.5 border-t border-slate-800/40 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap uppercase tracking-wider pl-1">
            Redes:
          </span>
          <button
            onClick={() => onSelectNetwork('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedNetwork === 'all'
                ? 'bg-white text-dark-950 font-bold shadow-md shadow-white/20'
                : 'bg-dark-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Todas (9)
          </button>

          {Object.entries(chains).map(([key, chain]) => {
            const isSelected = selectedNetwork === key;
            return (
              <button
                key={key}
                onClick={() => onSelectNetwork(key)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  isSelected 
                    ? `${chain.bgColor} border-current font-semibold shadow-sm` 
                    : 'bg-dark-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: chain.color }}
                />
                <span>{chain.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
