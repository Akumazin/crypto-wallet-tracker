import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  Power, 
  Edit3, 
  Eye, 
  Search, 
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function WalletManager({ 
  wallets, 
  chains, 
  selectedNetwork, 
  onOpenAddModal, 
  onToggleActive, 
  onDeleteWallet,
  onSelectWalletDetail
}) {
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [search, setSearch] = useState('');

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredWallets = wallets.filter(w => {
    if (selectedNetwork !== 'all' && w.network?.toLowerCase() !== selectedNetwork.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return w.label?.toLowerCase().includes(q) || 
             w.address?.toLowerCase().includes(q) ||
             w.tags?.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Carteiras Monitoradas</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full">
                  {filteredWallets.length} Carteiras
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gerencie endereços on-chain, apelidos, tags e status de monitoramento.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar carteira ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-all"
            />
          </div>

          {/* Add Wallet CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-brand-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-dark-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Adicionar</span>
          </button>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWallets.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 rounded-2xl bg-dark-900/60 border border-slate-800">
            <Layers className="w-12 h-12 mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-white">Nenhuma carteira encontrada</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Clique no botão "+ Adicionar" acima para cadastrar a primeira carteira para rastrear.
            </p>
          </div>
        ) : (
          filteredWallets.map((wallet) => {
            const chain = chains[wallet.network?.toLowerCase()] || chains.ethereum || {};
            const formattedAddr = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;

            return (
              <div
                key={wallet.id}
                className={`relative overflow-hidden rounded-2xl bg-dark-900/90 border transition-all duration-300 p-5 flex flex-col justify-between space-y-4 ${
                  wallet.isActive 
                    ? 'border-slate-800 hover:border-slate-700' 
                    : 'border-slate-800/40 opacity-60 bg-dark-950'
                }`}
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                        style={{ backgroundColor: wallet.color || chain.color || '#627EEA' }}
                      >
                        {wallet.label?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base truncate max-w-[160px]">
                          {wallet.label}
                        </h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-xs font-mono text-slate-400">{formattedAddr}</span>
                          <button
                            onClick={() => handleCopy(wallet.address)}
                            className="text-slate-500 hover:text-white transition-colors"
                            title="Copiar endereço completo"
                          >
                            {copiedAddress === wallet.address ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${chain.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {chain.name}
                    </span>
                  </div>

                  {/* Tags */}
                  {wallet.tags && wallet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {wallet.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {wallet.notes && (
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 italic">
                      "{wallet.notes}"
                    </p>
                  )}
                </div>

                {/* Balance and Footer Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500">Saldo Estimado</div>
                    <div className="text-sm font-extrabold text-white font-mono">
                      ${Number(wallet.balanceUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* View Details Deep-Dive */}
                    <button
                      onClick={() => onSelectWalletDetail && onSelectWalletDetail(wallet.id)}
                      title="Ver histórico desta carteira"
                      className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-brand-cyan border border-slate-800 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Active / Pause */}
                    <button
                      onClick={() => onToggleActive(wallet.id, !wallet.isActive)}
                      title={wallet.isActive ? "Pausar monitoramento" : "Ativar monitoramento"}
                      className={`p-2 rounded-xl border transition-all ${
                        wallet.isActive 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {/* Explorer */}
                    <a
                      href={`${chain.explorerUrl}/address/${wallet.address}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Abrir no Explorador de Blocos"
                      className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteWallet(wallet.id)}
                      title="Remover Carteira"
                      className="p-2 rounded-xl bg-dark-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
