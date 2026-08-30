import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Sliders, PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';

const COLORS = ['#627EEA', '#0052FF', '#2EE59D', '#836EF9', '#7B3FE4', '#0054F7', '#F0B90B', '#28A0F0', '#00C805'];

export default function AnalyticsCharts({ transactions, wallets, chains }) {
  // 1. Data by Chain Volume
  const chainVolumeMap = {};
  Object.keys(chains).forEach(k => {
    chainVolumeMap[k] = { name: chains[k].name, volume: 0, color: chains[k].color || '#627EEA' };
  });

  transactions.forEach(t => {
    const net = t.network?.toLowerCase();
    if (chainVolumeMap[net]) {
      chainVolumeMap[net].volume += (t.valueUsd || 0);
    }
  });

  const chainData = Object.values(chainVolumeMap).filter(c => c.volume > 0 || true);

  // 2. Data by Type
  const typeMap = {
    'NFT Mints': 0,
    'NFT Trades': 0,
    'DEX Swaps': 0,
    'Transferências': 0
  };

  transactions.forEach(t => {
    if (t.type === 'NFT_MINT') typeMap['NFT Mints'] += 1;
    else if (t.type === 'NFT_BUY' || t.type === 'NFT_SELL') typeMap['NFT Trades'] += 1;
    else if (t.type === 'TOKEN_SWAP') typeMap['DEX Swaps'] += 1;
    else typeMap['Transferências'] += 1;
  });

  const typeData = [
    { name: 'NFT Mints', value: typeMap['NFT Mints'], color: '#836EF9' },
    { name: 'NFT Trades', value: typeMap['NFT Trades'], color: '#EC4899' },
    { name: 'DEX Swaps', value: typeMap['DEX Swaps'], color: '#00F2FE' },
    { name: 'Transferências', value: typeMap['Transferências'], color: '#2EE59D' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Analytics & Inteligência On-Chain
          </h2>
          <p className="text-xs text-slate-400">
            Métricas agregadas de volume, operações e fluxo em todas as 9 blockchains monitoradas.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Volume by Chain */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-brand-cyan" />
              <span>Volume Movimentado por Rede ($ USD)</span>
            </h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chainData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  angle={-30} 
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0f17', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Volume']}
                />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {chainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Activity Types */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <span>Distribuição por Tipo de Operação</span>
            </h3>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0f17', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val, name) => [`${val} eventos`, name]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} 
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
