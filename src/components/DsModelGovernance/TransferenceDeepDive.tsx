import React, { useState } from 'react';
import { 
  Layers, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Zap,
  TrendingDown,
  TrendingUp,
  Percent
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { donorSkusData, decisionHierarchyWaterfall, DonorSkuData } from './dsMockData';

export default function TransferenceDeepDive() {
  const [selectedDonorId, setSelectedDonorId] = useState<string>(donorSkusData[0].id);

  const selectedDonor: DonorSkuData = donorSkusData.find(d => d.id === selectedDonorId) || donorSkusData[0];

  // Retention calculation: Intra-Brand + Sister Brand vs External Leakage
  const sbdRetentionPct = (
    selectedDonor.destinations
      .filter(d => d.type === 'Intra-Brand (DeWalt)' || d.type === 'Sister Brand (Craftsman)')
      .reduce((acc, curr) => acc + curr.transferPct, 0)
  ).toFixed(1);

  const competitorLeakagePct = (
    selectedDonor.destinations
      .filter(d => d.type.includes('Competitor'))
      .reduce((acc, curr) => acc + curr.transferPct, 0)
  ).toFixed(1);

  const walkAwayPct = (
    selectedDonor.destinations.find(d => d.type === 'Walk-Away Loss')?.transferPct || 0
  ).toFixed(1);

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION HEADER & CONTEXT CALLOUT */}
      <div className="bg-slate-900 text-white p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FFC20E] font-bold uppercase tracking-wider">
            <Layers size={15} />
            <span>Demand Transference Model Engine · Assortment Rationalization</span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            Cross-SKU Substitution Matrix & Contractor Choice Architecture
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Simulates where unit volume and revenue will migrate if a core SKU is delisted, rationalized, or experiences an out-of-stock event at Home Depot or Lowe's.
          </p>
        </div>

        {/* DONOR SKU SELECTOR */}
        <div className="bg-slate-800/90 border border-slate-700 p-2 rounded-md shrink-0">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Simulate Rationalizing Primary SKU:
          </label>
          <select
            value={selectedDonorId}
            onChange={(e) => setSelectedDonorId(e.target.value)}
            className="bg-slate-900 text-[#FFC20E] font-bold text-xs px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-[#FFC20E] cursor-pointer"
          >
            {donorSkusData.map((d) => (
              <option key={d.id} value={d.id}>
                {d.sku} · {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* METRIC HIGHLIGHTS FOR SELECTED DONOR SKU */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Donor Annual Baseline
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 font-mono">
              {selectedDonor.baselineVolumeUnits.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            List Price: ${selectedDonor.listPrice.toFixed(2)} · ${(selectedDonor.baselineVolumeUnits * selectedDonor.listPrice / 1000000).toFixed(2)}M GSV
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-lg p-3.5 shadow-2xs bg-emerald-50/20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
            <span>SBD Internal Retention</span>
            <CheckCircle2 size={13} className="text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-700 font-mono">
              {sbdRetentionPct}%
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1 py-0.2 rounded">
              High Enclosure
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Volume retained in DeWalt & Craftsman
          </div>
        </div>

        <div className="bg-white border border-rose-200 rounded-lg p-3.5 shadow-2xs bg-rose-50/20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
            <span>Competitor Leakage</span>
            <AlertTriangle size={13} className="text-rose-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-rose-700 font-mono">
              {competitorLeakagePct}%
            </span>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-100 px-1 py-0.2 rounded">
              External Loss
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Leaks to Milwaukee & Ryobi platforms
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Walk-Away Category Loss
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-800 font-mono">
              {walkAwayPct}%
            </span>
            <span className="text-xs text-slate-500">No purchase</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Buyer leaves retailer without buying
          </div>
        </div>
      </div>

      {/* DUAL SUBPANEL: TRANSFERENCE MATRIX HEATMAP & DECISION HIERARCHY WATERFALL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (7 COLS): TRANSFERENCE MATRIX HEATMAP & DESTINATION BREAKDOWN */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Transference Heatmap: Volume Migration Grid</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Calculated substitution destinations for <strong className="text-slate-800">{selectedDonor.sku} ({selectedDonor.name})</strong>
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Sum: 100.0%
              </span>
            </div>

            {/* VISUAL TRANSFERENCE FLOW BAR */}
            <div className="mb-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Proportional Volume Migration:
              </div>
              <div className="h-4 w-full rounded-md overflow-hidden flex shadow-inner">
                {selectedDonor.destinations.map((dest, i) => (
                  <div
                    key={i}
                    style={{ width: `${dest.transferPct}%`, backgroundColor: dest.color }}
                    className="h-full relative group transition-all hover:opacity-90"
                    title={`${dest.targetSku}: ${dest.transferPct}%`}
                  />
                ))}
              </div>
            </div>

            {/* INTERACTIVE DESTINATION TABLE */}
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Destination SKU</th>
                    <th className="py-2.5 px-2">Brand / Type</th>
                    <th className="py-2.5 px-3 text-right">Transfer %</th>
                    <th className="py-2.5 px-3 text-right">Volume Retained</th>
                    <th className="py-2.5 px-3 text-right">Est. Dollar Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {selectedDonor.destinations.map((dest, index) => {
                    const isIntra = dest.type.includes('DeWalt');
                    const isSister = dest.type.includes('Craftsman');
                    const isCompetitor = dest.type.includes('Competitor');
                    const isLoss = dest.type.includes('Walk-Away');

                    return (
                      <tr 
                        key={index} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isIntra ? 'bg-amber-50/20' : isSister ? 'bg-red-50/10' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-medium text-slate-900 flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: dest.color }}
                          />
                          <span className="truncate max-w-[220px]" title={dest.targetSku}>
                            {dest.targetSku}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isIntra 
                              ? 'bg-[#FFC20E]/20 text-black font-bold' 
                              : isSister
                              ? 'bg-rose-100 text-rose-800'
                              : isCompetitor
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {dest.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {dest.transferPct.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          {dest.volumeRetainedUnits.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ${(dest.dollarTransfer / 1000000).toFixed(2)}M
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-[11px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#FFC20E]" />
              <span><strong>Recommendation:</strong> Delisting {selectedDonor.sku} yields net ${(selectedDonor.destinations[0].dollarTransfer / 1000000).toFixed(2)}M capture to sister SKU with low cannibalization risk.</span>
            </span>
          </div>
        </div>

        {/* RIGHT (5 COLS): DECISION HIERARCHY WATERFALL */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Contractor Decision Hierarchy</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Customer choice architecture weights driving substitution behavior
              </p>
            </div>

            {/* WATERFALL BAR CHART */}
            <div className="w-full h-48 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={decisionHierarchyWaterfall}
                  layout="vertical"
                  margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis 
                    type="number" 
                    domain={[0, 50]} 
                    unit="%" 
                    tick={{ fontSize: 10, fill: '#64748B' }} 
                  />
                  <YAxis 
                    type="category" 
                    dataKey="level" 
                    width={130}
                    tick={{ fontSize: 9, fill: '#1E293B', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs font-sans max-w-xs">
                            <div className="font-bold text-[#FFC20E]">{item.level}</div>
                            <div className="text-xs font-mono font-bold mt-1">Weight: {item.weight}% (Cumulative: {item.cumulative}%)</div>
                            <div className="text-[11px] text-slate-300 mt-1">{item.detail}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                    <Cell fill="#FFC20E" />
                    <Cell fill="#0F172A" />
                    <Cell fill="#3B82F6" />
                    <Cell fill="#64748B" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* BREAKDOWN CARDS */}
            <div className="space-y-2">
              {decisionHierarchyWaterfall.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-md text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.level}</span>
                    <span className="font-mono font-bold text-slate-900 text-[11px] bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                      {item.deltaLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            Source: SBD Brand Equity Tracker + POS Consumer Intercept Data (N=4,820 Contractor Interviews).
          </div>
        </div>

      </div>
    </div>
  );
}
