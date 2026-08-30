import React, { useEffect, useState } from 'react';
import { Sparkles, Repeat, ArrowUpRight, X, ExternalLink } from 'lucide-react';

export default function LiveToast({ alerts, onDismiss, chains }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {alerts.map((alert) => {
        const tx = alert.transaction;
        const chain = chains[tx?.network?.toLowerCase()] || chains.ethereum || {};
        const isMint = tx?.type === 'NFT_MINT';

        return (
          <div
            key={alert.id}
            className="pointer-events-auto transform transition-all duration-300 animate-slide-up rounded-2xl bg-dark-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-3.5 flex items-start space-x-3 text-xs"
            style={{ borderColor: isMint ? '#836EF9' : '#00F2FE' }}
          >
            {/* Icon / Image */}
            {tx.nftImage ? (
              <img 
                src={tx.nftImage} 
                alt="NFT" 
                className="w-10 h-10 rounded-xl object-cover border border-purple-500/50 shrink-0" 
              />
            ) : (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isMint ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                {isMint ? <Sparkles className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{isMint ? '⚡ NOVO MINT DETECTADO' : '🔥 NOVA TRANSAÇÃO'}</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                  {chain.name}
                </span>
              </div>

              <div className="font-semibold text-white mt-0.5 truncate">
                {tx.walletLabel}
              </div>

              <div className="text-slate-300 text-[11px] truncate mt-0.5">
                {tx.nftCollection ? `${tx.nftCollection} (${tx.nftTokenId})` : tx.swapToToken ? `${tx.swapFromToken} ➔ ${tx.swapToToken}` : `${tx.valueToken} ${tx.tokenSymbol}`}
              </div>

              <div className="text-[10px] text-emerald-400 font-mono font-bold mt-1">
                +${tx.valueUsd?.toLocaleString()} USD
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(alert.id)}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
