import React, { useState } from 'react';
import { 
  Sparkles, 
  Repeat, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Flame,
  Clock,
  Fuel,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

export default function TransactionFeed({ 
  transactions, 
  wallets, 
  chains, 
  selectedNetwork, 
  onSelectWalletDetail 
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState(null);
  const [hideSpam, setHideSpam] = useState(true);

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    // Anti-spam / Anti-scam filter
    if (hideSpam && tx.isSpam) {
      return false;
    }
    // Network filter
    if (selectedNetwork !== 'all' && tx.network?.toLowerCase() !== selectedNetwork.toLowerCase()) {
      return false;
    }
    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'NFT' && !tx.type.startsWith('NFT')) return false;
      if (filterType === 'SWAP' && tx.type !== 'TOKEN_SWAP') return false;
      if (filterType === 'TRANSFER' && tx.type !== 'TOKEN_TRANSFER') return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLabel = tx.walletLabel?.toLowerCase().includes(q);
      const matchAddress = tx.walletAddress?.toLowerCase().includes(q);
      const matchHash = tx.txHash?.toLowerCase().includes(q);
      const matchNft = tx.nftCollection?.toLowerCase().includes(q);
      const matchToken = tx.tokenSymbol?.toLowerCase().includes(q);
      const matchNotes = tx.notes?.toLowerCase().includes(q);
      return matchLabel || matchAddress || matchHash || matchNft || matchToken || matchNotes;
    }
    return true;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'NFT_MINT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>NFT MINT</span>
          </span>
        );
      case 'NFT_BUY':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>NFT BUY</span>
          </span>
        );
      case 'NFT_SELL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>NFT SELL</span>
          </span>
        );
      case 'TOKEN_SWAP':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40">
            <Repeat className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEX SWAP</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            <span>TRANSFER</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-dark-900 border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por carteira, coleção NFT, token ou txHash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-all"
          />
        </div>

        {/* Anti-Spam Indicator & Type Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {/* Anti-Spam Toggle */}
          <button
            onClick={() => setHideSpam(!hideSpam)}
            title="Bloquear airdrops não solicitados, phishing e tokens scam"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hideSpam 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Spam & Scam: {hideSpam ? 'ATIVO' : 'DESATIVADO'}</span>
          </button>

          {/* Type Filter Buttons */}
          {[
            { id: 'all', label: 'Todas' },
            { id: 'NFT', label: 'NFTs' },
            { id: 'SWAP', label: 'Swaps DEX' },
            { id: 'TRANSFER', label: 'Transferências' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                filterType === f.id
                  ? 'bg-brand-cyan text-dark-950 font-bold shadow-md shadow-brand-cyan/20'
                  : 'bg-dark-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-dark-900/60 border border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400 mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Nenhuma transação encontrada</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Filtro Anti-Spam e Anti-Scam ativo. Apenas Mints reais, Swaps em DEX e compras verificadas são exibidos.
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const chain = chains[tx.network?.toLowerCase()] || chains.ethereum || {};
            const timeAgo = new Date(tx.timestamp).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            });

            // OpenSea link (fallback to generated url)
            const openSeaUrl = tx.openSeaUrl || (tx.type?.startsWith('NFT') ? `https://opensea.io/assets/${tx.network || 'ethereum'}/${tx.contractAddress || '0x000'}/${tx.nftTokenId?.replace('#', '') || '1'}` : null);
            const openSeaCollectionUrl = tx.openSeaCollectionUrl || (tx.nftCollection ? `https://opensea.io/collection/${tx.nftCollection.toLowerCase().replace(/\s+/g, '-')}` : null);

            return (
              <div
                key={tx.id}
                className="group relative overflow-hidden rounded-2xl bg-dark-900/90 hover:bg-dark-850 border border-slate-800/90 hover:border-slate-700 p-4 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left Column: Type + Wallet + Network Badge */}
                  <div className="flex items-start sm:items-center space-x-3.5">
                    {/* Chain Avatar or NFT Preview */}
                    {tx.nftImage ? (
                      <a 
                        href={openSeaUrl || '#'}
                        target="_blank" 
                        rel="noreferrer"
                        className="relative w-12 h-12 rounded-xl overflow-hidden border border-purple-500/40 shrink-0 bg-dark-950 block hover:ring-2 hover:ring-purple-400 transition-all"
                        title="Ver no OpenSea"
                      >
                        <img 
                          src={tx.nftImage} 
                          alt={tx.nftCollection || "NFT"} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <span 
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-950" 
                          style={{ backgroundColor: chain.color || '#627EEA' }}
                          title={chain.name}
                        />
                      </a>
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-slate-800"
                        style={{ backgroundColor: `${chain.color || '#627EEA'}15` }}
                      >
                        {tx.tokenLogo ? (
                          <img src={tx.tokenLogo} alt={tx.tokenSymbol} className="w-7 h-7 rounded-full" />
                        ) : (
                          <div 
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: chain.color || '#627EEA' }}
                          />
                        )}
                      </div>
                    )}

                    {/* Main Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(tx.type)}

                        {/* Network Badge */}
                        <span 
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${chain.badgeColor || 'bg-slate-800 text-slate-300'}`}
                        >
                          {chain.name || tx.network}
                        </span>

                        {/* Wallet Label Button */}
                        <button
                          onClick={() => onSelectWalletDetail && onSelectWalletDetail(tx.walletId)}
                          className="text-xs font-bold text-white hover:text-brand-cyan hover:underline transition-colors"
                        >
                          {tx.walletLabel || `${tx.walletAddress?.slice(0, 6)}...${tx.walletAddress?.slice(-4)}`}
                        </button>
                      </div>

                      {/* Subtitle description / Action details */}
                      <div className="mt-1.5 text-xs text-slate-300 flex flex-wrap items-center gap-2">
                        {tx.type.startsWith('NFT') ? (
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <a
                              href={openSeaCollectionUrl || openSeaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-purple-300 hover:text-purple-200 hover:underline flex items-center space-x-1"
                              title="Abrir Coleção no OpenSea"
                            >
                              <span>{tx.nftCollection}</span>
                              <span className="text-slate-400 font-mono">{tx.nftTokenId}</span>
                            </a>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono font-bold">
                              OPENSEA
                            </span>
                          </div>
                        ) : tx.type === 'TOKEN_SWAP' ? (
                          <div className="flex items-center space-x-1.5 font-mono text-cyan-300">
                            <span className="text-slate-400">{tx.swapFromToken}</span>
                            <span className="text-brand-cyan font-bold">➔</span>
                            <span className="font-bold text-white">{tx.swapToToken}</span>
                          </div>
                        ) : (
                          <span className="font-mono text-slate-300">
                            {tx.valueToken} {tx.tokenSymbol} <span className="text-slate-500">({tx.tokenName})</span>
                          </span>
                        )}

                        {tx.notes && (
                          <span className="text-[11px] text-slate-500 italic hidden md:inline">
                            • {tx.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Values, Gas, Hash, OpenSea, Timestamp */}
                  <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 sm:gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
                    {/* Value in USD */}
                    <div className="text-left lg:text-right">
                      <div className="text-sm font-extrabold text-white font-mono">
                        ${Number(tx.valueUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center lg:justify-end space-x-1">
                        <Fuel className="w-3 h-3 text-slate-500" />
                        <span>{tx.gasFee || '0.001 ETH'}</span>
                      </div>
                    </div>

                    {/* Meta & Action Links */}
                    <div className="flex items-center space-x-1.5">
                      <div className="text-right hidden sm:block mr-1">
                        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{timeAgo}</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                          {tx.status || 'CONFIRMED'}
                        </div>
                      </div>

                      {/* Direct OpenSea Button for NFTs */}
                      {tx.type.startsWith('NFT') && (
                        <a
                          href={openSeaUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Ver Item no OpenSea"
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all"
                        >
                          <span>OpenSea</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {/* Copy Hash */}
                      <button
                        onClick={() => handleCopy(tx.txHash)}
                        title="Copiar Hash da Transação"
                        className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                      >
                        {copiedHash === tx.txHash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Explorer Link */}
                      <a
                        href={`${chain.explorerUrl || 'https://etherscan.io'}/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`Ver no Explorador (${chain.name})`}
                        className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-brand-cyan border border-slate-800 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
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
