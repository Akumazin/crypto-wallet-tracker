import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Sparkles, 
  Repeat, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export default function StatsOverview({ stats, onQuickSimulate, isSimulating }) {
  const cards = [
    {
      title: "Patrimônio Rastreável",
      value: stats ? `$${Number(stats.totalNetWorthUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      subtext: `${stats?.activeWallets || 0} carteiras ativas`,
      icon: Wallet,
      gradient: "from-blue-500/20 to-cyan-500/5",
      border: "border-blue-500/30",
      textColor: "text-brand-cyan"
    },
    {
      title: "Volume 24h Rastreio",
      value: stats ? `$${Number(stats.volume24hUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      subtext: `${stats?.totalTransactions || 0} transações registradas`,
      icon: TrendingUp,
      gradient: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/30",
      textColor: "text-emerald-400"
    },
    {
      title: "NFT Mints Detectados",
      value: stats ? `${stats.nftMintsCount || 0}` : "0",
      subtext: "Coleções e Mints em tempo real",
      icon: Sparkles,
      gradient: "from-purple-500/20 to-pink-500/5",
      border: "border-purple-500/30",
      textColor: "text-purple-400"
    },
    {
      title: "Swaps DEX & Memecoins",
      value: stats ? `${stats.tokenSwapsCount || 0}` : "0",
      subtext: "Compras/Vendas em Uniswap, Aero, etc.",
      icon: Repeat,
      gradient: "from-amber-500/20 to-orange-500/5",
      border: "border-amber-500/30",
      textColor: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Monitoramento Ativo em 9 Redes On-Chain
            </h2>
            <p className="text-xs text-slate-400">
              Ethereum, Robinhood, HyperEVM, BNB, Base, Arbitrum, Monad, Ink & ApeChain.
            </p>
          </div>
        </div>

        {/* Quick Simulation Buttons for Immediate Demo */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => onQuickSimulate('NFT_MINT')}
            disabled={isSimulating}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 text-xs font-semibold rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Simular Mint NFT</span>
          </button>

          <button
            onClick={() => onQuickSimulate('TOKEN_SWAP')}
            disabled={isSimulating}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold rounded-xl transition-all"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>+ Simular Swap DEX</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} bg-dark-900/80 p-5 border ${card.border} transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-dark-950/60 border border-slate-800 ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className={`text-2xl font-extrabold tracking-tight ${card.textColor} font-mono`}>
                  {card.value}
                </div>
                <div className="mt-1 flex items-center space-x-1 text-xs text-slate-400">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  <span>{card.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
