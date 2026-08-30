import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Repeat, 
  Layers, 
  TrendingUp, 
  Fuel, 
  Clock 
} from 'lucide-react';

export default function WalletDetailModal({ 
  walletId, 
  wallets, 
  transactions, 
  chains, 
  onClose,
  onSimulateTx
}) {
  const [copied, setCopied] = useState(false);

  if (!walletId) return null;

  const wallet = wallets.find(w => w.id === walletId);
  if (!wallet) return null;

  const chain = chains[wallet.network?.toLowerCase()] || chains.ethereum || {};
  const walletTxs = transactions.filter(t => t.walletId === walletId);

  const totalVolume = walletTxs.reduce((acc, t) => acc + (t.valueUsd || 0), 0);
  const nftCount = walletTxs.filter(t => t.nftCollection).length;
  const swapCount = walletTxs.filter(t => t.type === 'TOKEN_SWAP').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-dark-900 border border-slate-800 shadow-2xl p-6 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shadow-lg"
              style={{ backgroundColor: wallet.color || chain.color || '#627EEA' }}
            >
              {wallet.label?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">
                  {wallet.label}
                </h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${chain.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {chain.name}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-mono text-slate-400">{wallet.address}</span>
                <button
                  onClick={handleCopy}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`${chain.explorerUrl}/address/${wallet.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-brand-cyan transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-500">Saldo Estimado</div>
            <div className="text-base font-extrabold text-white font-mono mt-0.5">
              ${Number(wallet.balanceUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-500">Volume Total</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
              ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800/80">
            <div className="text-[10px] uppercase font-mono text-slate-500">NFTs & Swaps</div>
            <div className="text-base font-extrabold text-purple-300 font-mono mt-0.5">
              {nftCount} NFTs / {swapCount} Swaps
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center justify-between py-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Histórico On-Chain ({walletTxs.length} Transações)
          </h3>
          <button
            onClick={() => onSimulateTx && onSimulateTx(wallet)}
            className="px-3 py-1 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold rounded-xl transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Simular Ação Nesta Carteira</span>
          </button>
        </div>

        {/* Scrollable Transaction List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mt-2">
          {walletTxs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhuma transação registrada para esta carteira ainda.
            </div>
          ) : (
            walletTxs.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  {tx.nftImage ? (
                    <img src={tx.nftImage} alt="NFT" className="w-9 h-9 rounded-lg object-cover border border-purple-500/40" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white text-[10px]">
                      {tx.type === 'TOKEN_SWAP' ? <Repeat className="w-4 h-4 text-cyan-400" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-white">
                      {tx.type.replace('_', ' ')}
                      {tx.nftCollection && <span className="text-purple-300 ml-1.5">({tx.nftCollection} {tx.nftTokenId})</span>}
                      {tx.swapToToken && <span className="text-cyan-300 ml-1.5 font-mono">({tx.swapFromToken} ➔ {tx.swapToToken})</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {new Date(tx.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-white font-mono">
                    ${tx.valueUsd?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {tx.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
