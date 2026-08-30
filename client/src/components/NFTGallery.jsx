import React, { useState } from 'react';
import { Sparkles, ExternalLink, ShieldCheck, Tag, Eye, Filter } from 'lucide-react';

export default function NFTGallery({ transactions, chains, selectedNetwork, onSelectWalletDetail }) {
  const [collectionFilter, setCollectionFilter] = useState('all');

  // Filter only NFT transactions (Mints, Buys, Sells)
  const nftItems = transactions.filter(t => 
    t.nftCollection && (t.type === 'NFT_MINT' || t.type === 'NFT_BUY' || t.type === 'NFT_SELL')
  ).filter(t => {
    if (selectedNetwork !== 'all' && t.network?.toLowerCase() !== selectedNetwork.toLowerCase()) {
      return false;
    }
    if (collectionFilter !== 'all' && t.nftCollection !== collectionFilter) {
      return false;
    }
    return true;
  });

  // Extract unique collections for filter dropdown
  const uniqueCollections = Array.from(new Set(
    transactions.filter(t => t.nftCollection).map(t => t.nftCollection)
  ));

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Galeria de NFTs & Mints Recentes</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">
                  {nftItems.length} NFTs
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Acompanhe as artes digitais, avatares e mints executados pelas carteiras monitoradas.
              </p>
            </div>
          </div>
        </div>

        {/* Collection Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
          >
            <option value="all">Todas as Coleções ({uniqueCollections.length})</option>
            {uniqueCollections.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of NFTs */}
      {nftItems.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl bg-dark-900/60 border border-slate-800">
          <Sparkles className="w-12 h-12 mx-auto text-purple-400/40 mb-3" />
          <h3 className="text-base font-semibold text-white">Nenhum NFT encontrado nesta seleção</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Alterne o filtro de rede no topo ou aguarde novas atividades de mint de NFTs pelas carteiras.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {nftItems.map((nft) => {
            const chain = chains[nft.network?.toLowerCase()] || chains.ethereum || {};
            const isMint = nft.type === 'NFT_MINT';

            return (
              <div
                key={nft.id}
                className="group relative overflow-hidden rounded-2xl bg-dark-900 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col"
              >
                {/* NFT Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-dark-950">
                  <img
                    src={nft.nftImage || "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80"}
                    alt={nft.nftCollection}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span 
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                        isMint 
                          ? 'bg-purple-900/80 text-purple-200 border-purple-400/40' 
                          : 'bg-indigo-900/80 text-indigo-200 border-indigo-400/40'
                      }`}
                    >
                      {isMint ? '⚡ MINT' : '💎 TRADE'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span 
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md border ${chain.badgeColor || 'bg-slate-900/80 text-slate-200'}`}
                    >
                      {chain.name}
                    </span>
                  </div>

                  {/* Bottom Image Gradient & Token ID */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent p-3 flex items-end justify-between">
                    <span className="text-xs font-mono font-bold text-white bg-dark-950/80 px-2 py-0.5 rounded border border-white/10">
                      {nft.nftTokenId}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-dark-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                      ${nft.valueUsd?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* NFT Details Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base truncate group-hover:text-purple-300 transition-colors">
                      {nft.nftCollection}
                    </h3>
                    
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                      <span>Rastreado por:</span>
                      <button
                        onClick={() => onSelectWalletDetail && onSelectWalletDetail(nft.walletId)}
                        className="font-semibold text-slate-200 hover:text-brand-cyan hover:underline truncate max-w-[140px]"
                      >
                        {nft.walletLabel}
                      </button>
                    </div>
                  </div>

                  {/* Price and Action Link */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-500">Valor Estimado</div>
                      <div className="text-xs font-bold text-white font-mono">
                        {nft.valueToken} {chain.symbol}
                      </div>
                    </div>

                    <a
                      href={`${chain.explorerUrl}/tx/${nft.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-dark-950 hover:bg-purple-600/20 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 text-xs font-medium transition-all"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
