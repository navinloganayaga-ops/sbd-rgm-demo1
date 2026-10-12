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
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold uppercase tracking-wider">
            <Sparkles size={15} />
            <span>Promo Lift Model Engine</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-0.5">
            5-Way Causal Lift Decomposition & Frequency Decay Saturation Curve
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Distinguishes true incremental commercial volume from cannibalized sales, forward buying, and post-promo dips across retail circulars.
          </p>
        </div>

        {/* PROMO MECHANIC SELECTOR */}
        <div className="bg-slate-50 border border-slate-200 p-2 rounded-md shrink-0">
          <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
            Promo Mechanic Drill-Down:
          </label>
          <select
            value={selectedMechanicIndex}
            onChange={(e) => setSelectedMechanicIndex(parseInt(e.target.value))}
            className="bg-white text-slate-800 font-semibold text-xs px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
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
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Baseline Volume
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {selectedItem.baseline.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Expected sales without promotion
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Pure Incremental</span>
            <Sparkles size={12} className="text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              +{selectedItem.pureIncremental.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            True new market volume lift
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Cannibalization</span>
            <AlertTriangle size={12} className="text-rose-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-rose-700 font-mono">
              {selectedItem.cannibalization.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Adjacent SBD SKU overlap
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Forward Buy Penalty
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-700 font-mono">
              {selectedItem.forwardBuy.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Pulled from future weeks
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Net Incremental</span>
            <CheckCircle2 size={12} className="text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              +{selectedItem.netIncremental.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Campaign ROI: <strong className="text-slate-700">{selectedItem.roi}</strong>
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
                          <div className="bg-white text-slate-800 p-3 rounded-md shadow-lg border border-slate-200 text-xs font-sans min-w-[240px]">
                            <div className="font-semibold text-slate-900 pb-1 border-b border-slate-100 flex justify-between items-center">
                              <span>{label}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                                ROI {item.roi}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Baseline Volume:</span>
                                <span className="font-mono text-slate-800">{item.baseline.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-emerald-700 font-medium">
                                <span>+ Pure Incremental:</span>
                                <span className="font-mono">+{item.pureIncremental.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-rose-700">
                                <span>- Cannibalization:</span>
                                <span className="font-mono">{item.cannibalization.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-amber-700">
                                <span>- Forward Buy Penalty:</span>
                                <span className="font-mono">{item.forwardBuy.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sky-700">
                                <span>+ Halo Effect (Accessories):</span>
                                <span className="font-mono">+{item.haloEffect.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between pt-1.5 border-t border-slate-100 font-bold text-slate-900">
                                <span>Net Incremental Gain:</span>
                                <span className="font-mono text-emerald-800">+{item.netIncremental.toLocaleString()}</span>
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
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-white text-slate-800 p-2.5 rounded-md shadow-md border border-slate-200 text-xs font-sans">
                            <div className="font-semibold text-slate-900">Week {item.week} Flight</div>
                            <div className="mt-1 text-[11px] space-y-0.5">
                              <div>Efficiency: <strong className="font-mono text-emerald-700">{item.efficiencyPct}%</strong></div>
                              <div>Lift Multiplier: <strong className="font-mono text-slate-700">{item.liftMultiplier}x</strong></div>
                              <div className="text-[10px] text-slate-500 mt-1">{item.annotation}</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '50% Cutoff', fill: '#DC2626', fontSize: 9, position: 'right' }} />
                  <Line 
                    type="monotone" 
                    dataKey="efficiencyPct" 
                    stroke="#D97706" 
                    strokeWidth={2}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.warningZone) {
                        return <circle key={payload.week} cx={cx} cy={cy} r={4.5} fill="#EF4444" stroke="#FFF" strokeWidth={1.5} />;
                      }
                      return <circle key={payload.week} cx={cx} cy={cy} r={3.5} fill="#D97706" stroke="#FFF" strokeWidth={1.5} />;
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
