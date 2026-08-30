import React from 'react';
import { Zap, TrendingUp, Repeat, ArrowUpRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TokenTracker({ tokens, chains, selectedNetwork, onSimulateTokenSwap }) {
  const tokenList = tokens?.tokens || [];
  const catalog = tokens?.catalog || {};

  // Filter by selected network
  const filteredTokens = tokenList.filter(t => {
    if (selectedNetwork !== 'all' && t.network?.toLowerCase() !== selectedNetwork.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Radar de Tokens & Smart Money</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
                {filteredTokens.length} Ativos
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Tokens e Memecoins mais acumulados e negociados pelas carteiras inteligentes monitoradas.
            </p>
          </div>
        </div>
      </div>

      {/* Tokens Table & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTokens.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 rounded-2xl bg-dark-900/60 border border-slate-800">
            <Zap className="w-12 h-12 mx-auto text-cyan-400/40 mb-3" />
            <h3 className="text-base font-semibold text-white">Nenhum token registrado nesta rede</h3>
            <p className="text-xs text-slate-400 mt-1">
              Troque a rede no seletor acima para explorar outras blockchains.
            </p>
          </div>
        ) : (
          filteredTokens.map((token, idx) => {
            const chain = chains[token.network?.toLowerCase()] || chains.ethereum || {};

            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl bg-dark-900 hover:bg-dark-850 border border-slate-800 hover:border-cyan-500/40 p-5 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {token.logo ? (
                      <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-xl bg-dark-950 p-1 border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                        {token.symbol?.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-white text-base">
                        ${token.symbol}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {token.name}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${chain.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {chain.name}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800/80">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500">Volume Smart Money</div>
                    <div className="text-sm font-extrabold text-white font-mono">
                      ${Number(token.volumeUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500">Swaps / Trades</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono flex items-center space-x-1">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>{token.swapsCount || token.txCount} trades</span>
                    </div>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400 font-mono">
                    Status: <span className="text-emerald-400 font-semibold">Ativo em DEX</span>
                  </span>

                  <button
                    onClick={() => onSimulateTokenSwap && onSimulateTokenSwap(token.network, token.symbol)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all"
                  >
                    <span>Simular Swap</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
