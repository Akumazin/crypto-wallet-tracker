import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Sparkles, Check, AlertCircle } from 'lucide-react';

const PRESET_WALLETS = [
  {
    label: "Blur / OpenSea Whale",
    address: "0x828479A9D3864197e42ba79b5c3080ff9821ef9a",
    network: "ethereum",
    tags: "NFT Whale, Bluechips",
    color: "#627EEA",
    notes: "Grande negociador de coleções no Blur e OpenSea."
  },
  {
    label: "Base Memecoin Hunter",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    network: "base",
    tags: "Smart Money, Base L2, Memes",
    color: "#0052FF",
    notes: "Caçador de novas memecoins na Base."
  },
  {
    label: "HyperEVM HYPE Staker",
    address: "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF",
    network: "hyperevm",
    tags: "HYPE, Perps, Hyperliquid",
    color: "#2EE59D",
    notes: "Carteira focada no ecossistema Hyperliquid / HyperEVM."
  },
  {
    label: "Monad Parallel Dev",
    address: "0x1111111254fb6c44bac0bed2854e76f90643097d",
    network: "monad",
    tags: "Monad, Early Alpha",
    color: "#836EF9",
    notes: "Pioneiro nos primeiros contratos da Monad."
  },
  {
    label: "ApeChain Legend",
    address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
    network: "ape",
    tags: "ApeChain, Yuga, Gaming",
    color: "#0054F7",
    notes: "Detentor e negociador de ativos ApeChain."
  }
];

const COLORS = [
  "#627EEA", // Ethereum Blue
  "#0052FF", // Base Blue
  "#2EE59D", // HyperEVM Emerald
  "#836EF9", // Monad Purple
  "#7B3FE4", // Ink Violet
  "#0054F7", // Ape Blue
  "#F0B90B", // BNB Yellow
  "#28A0F0", // Arbitrum Cyan
  "#00C805", // Robinhood Green
  "#EC4899", // Pink
];

export default function AddWalletModal({ isOpen, onClose, onAddWallet, chains }) {
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [network, setNetwork] = useState('ethereum');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState('#627EEA');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (p) => {
    setAddress(p.address);
    setLabel(p.label);
    setNetwork(p.network);
    setTags(p.tags);
    setColor(p.color);
    setNotes(p.notes);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Por favor, informe o endereço da carteira.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
      setError('Endereço inválido! Deve ser um endereço EVM válido começando com 0x e 40 caracteres hexadecimais.');
      return;
    }

    setLoading(true);
    try {
      const tagArray = tags
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : ["Trader"];

      const res = await onAddWallet({
        address: address.trim(),
        label: label.trim() || `Carteira ${address.slice(0, 6)}`,
        network,
        tags: tagArray,
        color,
        notes: notes.trim()
      });

      if (res?.success) {
        onClose();
        // Reset form
        setAddress('');
        setLabel('');
        setTags('');
        setNotes('');
      } else {
        setError(res?.message || 'Erro ao adicionar carteira.');
      }
    } catch (err) {
      setError(err.message || 'Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-dark-900 border border-slate-800 shadow-2xl p-6 overflow-hidden my-8">
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Adicionar Carteira para Rastrear
              </h2>
              <p className="text-xs text-slate-400">
                Monitore transações, mints de NFTs e swaps em tempo real.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets Quick Fill Bar */}
        <div className="mt-4 p-3 rounded-2xl bg-dark-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-brand-cyan" />
              <span>Preenchimento Rápido (Exemplos Populares):</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_WALLETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-dark-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center space-x-1"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Address Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Endereço da Carteira (EVM / 0x...) *
            </label>
            <input
              type="text"
              required
              placeholder="0x71C... ou 0xd8dA6BF..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan transition-all"
            />
          </div>

          {/* Label & Network Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Apelido / Nome Amigável
              </label>
              <input
                type="text"
                placeholder="Ex: Baleia 01 / Smart Trader"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Rede Principal
              </label>
              <select
                value={network}
                onChange={(e) => {
                  setNetwork(e.target.value);
                  const chain = chains[e.target.value];
                  if (chain?.color) setColor(chain.color);
                }}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-cyan transition-all"
              >
                {Object.entries(chains).map(([key, chain]) => (
                  <option key={key} value={key}>
                    {chain.name} ({chain.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="NFT Whale, DEX Sniper, Memes"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cor de Identificação
              </label>
              <div className="flex items-center space-x-2 py-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-dark-900' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Observações / Estratégia (Opcional)
            </label>
            <textarea
              rows="2"
              placeholder="Ex: Essa carteira costuma comprar memecoins no início..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-dark-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan transition-all"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-dark-950 hover:bg-slate-800 border border-slate-800 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-dark-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
            >
              {loading ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Cadastrar Carteira</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
