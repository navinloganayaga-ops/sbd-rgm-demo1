import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Info, 
  TrendingDown, 
  Layers, 
  Calendar, 
  AlertTriangle,
  CheckCircle2,
  PieChart,
  BarChart2,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine, 
  ReferenceArea 
} from 'recharts';
import { promoDecompositionData, promoDecayData, PromoDecompositionItem } from './dsMockData';

export default function PromoLiftDeepDive() {
  const [selectedMechanicIndex, setSelectedMechanicIndex] = useState<number>(2); // Default 'Buy Bare Tool + Free 5Ah Bat'

  const selectedItem: PromoDecompositionItem = promoDecompositionData[selectedMechanicIndex] || promoDecompositionData[2];

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION HEADER CALLOUT */}
      <div className="bg-slate-900 text-white p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FFC20E] font-bold uppercase tracking-wider">
            <Sparkles size={15} />
            <span>Promo Lift Model Engine · Trade Promotions Optimization</span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            5-Way Causal Lift Decomposition & Frequency Decay Saturation Curve
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Distinguishes true incremental commercial volume from cannibalized sister-SKU sales, forward pantry-loading, and post-promo dips across major retail circular mechanics.
          </p>
        </div>

        {/* PROMO MECHANIC SELECTOR */}
        <div className="bg-slate-800/90 border border-slate-700 p-2 rounded-md shrink-0">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Active Promo Mechanic Drill-Down:
          </label>
          <select
            value={selectedMechanicIndex}
            onChange={(e) => setSelectedMechanicIndex(parseInt(e.target.value))}
            className="bg-slate-900 text-[#FFC20E] font-bold text-xs px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-[#FFC20E] cursor-pointer"
          >
            {promoDecompositionData.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.mechanic} (ROI: {item.roi})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* METRIC CHIPS FOR SELECTED PROMO MECHANIC */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Baseline Volume
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {selectedItem.baseline.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Expected sales without promotion
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-lg p-3 shadow-2xs bg-emerald-50/20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
            <span>Pure Incremental</span>
            <Sparkles size={12} className="text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              +{selectedItem.pureIncremental.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">
            True new market volume lift
          </div>
        </div>

        <div className="bg-white border border-rose-200 rounded-lg p-3 shadow-2xs bg-rose-50/20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
            <span>Cannibalization</span>
            <AlertTriangle size={12} className="text-rose-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-rose-700 font-mono">
              {selectedItem.cannibalization.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            Stolen from adjacent SBD SKUs
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Forward Buy Penalty
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800 font-mono">
              {selectedItem.forwardBuy.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Pulled from future weeks
          </div>
        </div>

        <div className="bg-white border border-slate-900 rounded-lg p-3 shadow-2xs bg-slate-900 text-white">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#FFC20E] flex items-center justify-between">
            <span>Net Incremental</span>
            <CheckCircle2 size={12} className="text-[#FFC20E]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">
              +{selectedItem.netIncremental.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-[#FFC20E] mt-0.5">
            Campaign ROI: {selectedItem.roi}
          </div>
        </div>
      </div>

      {/* DUAL SUBPANEL: STACKED LIFT DECOMPOSITION & FREQUENCY DECAY CURVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT (7 COLS): STACKED LIFT DECOMPOSITION BAR CHART */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Stacked Promo Lift Decomposition (5 Core Drivers)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Baseline + Pure Incremental Lift - Cannibalization - Forward Buy + Halo Effect
                </p>
              </div>
            </div>

            {/* STACKED BAR CHART */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={promoDecompositionData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  onClick={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      setSelectedMechanicIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="mechanic" 
                    tick={{ fontSize: 9, fill: '#334155', fontWeight: 600 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ReferenceLine y={0} stroke="#94A3B8" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as PromoDecompositionItem;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-md shadow-xl border border-slate-700 text-xs font-sans min-w-[240px]">
                            <div className="font-bold text-[#FFC20E] pb-1 border-b border-slate-800 flex justify-between items-center">
                              <span>{label}</span>
                              <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                                ROI {item.roi}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Baseline Volume:</span>
                                <span className="font-mono">{item.baseline.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-emerald-400 font-semibold">
                                <span>+ Pure Incremental:</span>
                                <span className="font-mono">+{item.pureIncremental.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-rose-400">
                                <span>- Cannibalization:</span>
                                <span className="font-mono">{item.cannibalization.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-amber-400">
                                <span>- Forward Buy Penalty:</span>
                                <span className="font-mono">{item.forwardBuy.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sky-400">
                                <span>+ Halo Effect (Accessories):</span>
                                <span className="font-mono">+{item.haloEffect.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold text-white">
                                <span>Net Incremental Gain:</span>
                                <span className="font-mono text-[#FFC20E]">+{item.netIncremental.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconSize={10}
                  />
                  <Bar dataKey="baseline" name="Baseline" fill="#94A3B8" stackId="a" />
                  <Bar dataKey="pureIncremental" name="Pure Incremental" fill="#10B981" stackId="a" />
                  <Bar dataKey="haloEffect" name="Halo Effect" fill="#38BDF8" stackId="a" />
                  <Bar dataKey="cannibalization" name="Cannibalization" fill="#F43F5E" stackId="b" />
                  <Bar dataKey="forwardBuy" name="Forward Buy" fill="#FB923C" stackId="b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-[11px] text-slate-600 flex items-center justify-between">
            <span><strong>Model Recommendation:</strong> "Buy Bare Tool + Free 5Ah Battery" generates highest net margin lift (+36.8k units) with lowest forward-buy pantry loading.</span>
          </div>
        </div>

        {/* RIGHT (5 COLS): PROMO FREQUENCY DECAY CURVE */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Promo Frequency Decay Curve
                </h4>
                <p className="text-[11px] text-slate-500">
                  Efficiency drop-off across consecutive promotional flight weeks
                </p>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                Wear-out at Week 4
              </span>
            </div>

            {/* DECAY LINE CHART */}
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={promoDecayData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    tickFormatter={(v) => `Week ${v}`}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis 
                    domain={[0, 110]} 
                    unit="%" 
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs font-sans">
                            <div className="font-bold text-[#FFC20E]">Week {item.week} Flight</div>
                            <div className="mt-1 text-[11px]">
                              <div>Efficiency: <strong className="font-mono text-emerald-400">{item.efficiencyPct}%</strong></div>
                              <div>Lift Multiplier: <strong className="font-mono">{item.liftMultiplier}x</strong></div>
                              <div className="text-[10px] text-slate-300 mt-1 italic">{item.annotation}</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '50% Cutoff Threshold', fill: '#DC2626', fontSize: 9, position: 'right' }} />
                  <Line 
                    type="monotone" 
                    dataKey="efficiencyPct" 
                    stroke="#D97706" 
                    strokeWidth={2.5}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.warningZone) {
                        return <circle key={payload.week} cx={cx} cy={cy} r={5} fill="#EF4444" stroke="#FFF" strokeWidth={2} />;
                      }
                      return <circle key={payload.week} cx={cx} cy={cy} r={4} fill="#FFC20E" stroke="#000" strokeWidth={1.5} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* DECAY TABLE / SUMMARY */}
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-xs p-2 bg-emerald-50/60 rounded border border-emerald-100">
                <span className="font-semibold text-emerald-900">Weeks 1-2 (Prime Window)</span>
                <span className="font-mono font-bold text-emerald-700">81% - 100% Efficiency</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-amber-50/60 rounded border border-amber-100">
                <span className="font-semibold text-amber-900">Week 3 (Inflection Point)</span>
                <span className="font-mono font-bold text-amber-700">59% Efficiency</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-rose-50/60 rounded border border-rose-100">
                <span className="font-semibold text-rose-900">Weeks 4-6 (Severe Saturation)</span>
                <span className="font-mono font-bold text-rose-700">&lt; 37% (Forward-buy drag)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <strong>Rule Applied:</strong> System alerts trade promotion planner if flight duration exceeds 21 days without a 4-week reset gap.
          </div>
        </div>

      </div>
    </div>
  );
}
