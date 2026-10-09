import React, { useState } from 'react';
import { 
  Percent, 
  HelpCircle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  DollarSign, 
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceDot, 
  ReferenceLine 
} from 'recharts';
import { elasticityPoints, crossPriceMatrix, ElasticityCurvePoint, CrossPriceRow } from './dsMockData';

export default function ElasticityDeepDive() {
  const [selectedPriceIndex, setSelectedPriceIndex] = useState<number>(7); // Default at $199
  const [competitorShockPercent, setCompetitorShockPercent] = useState<5 | 10>(5);

  const currentPoint = elasticityPoints[selectedPriceIndex] || elasticityPoints[7];

  // Optimal points
  const revMaxPoint = elasticityPoints.reduce((max, p) => p.revenueM > max.revenueM ? p : max, elasticityPoints[0]);
  const marginMaxPoint = elasticityPoints.reduce((max, p) => (p.revenueM * (p.grossMarginPct / 100)) > (max.revenueM * (max.grossMarginPct / 100)) ? p : max, elasticityPoints[0]);

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION HEADER CALLOUT */}
      <div className="bg-slate-900 text-white p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FFC20E] font-bold uppercase tracking-wider">
            <Percent size={15} />
            <span>Pricing Elasticity Model Engine · Strategic Price Realization</span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            Non-Linear Elasticity (ε) S-Curve & Cross-Price Competitive Shock Matrix
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Simulates demand curve kinks across psychological price cliffs ($149, $199, $249) and calculates cross-brand volume migration under Milwaukee and Ryobi price actions.
          </p>
        </div>

        {/* QUICK PRICE INSPECTOR SLIDER IN HEADER */}
        <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-md min-w-[240px]">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1">
            <span>Inspect List Price Point:</span>
            <span className="text-[#FFC20E] font-mono text-xs">${currentPoint.price}</span>
          </div>
          <input
            type="range"
            min={0}
            max={elasticityPoints.length - 1}
            value={selectedPriceIndex}
            onChange={(e) => setSelectedPriceIndex(parseInt(e.target.value))}
            className="w-full accent-[#FFC20E] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
            <span>$129 (Promo)</span>
            <span>$199 (Current)</span>
            <span>$249 (Premium)</span>
          </div>
        </div>
      </div>

      {/* METRIC CHIPS FOR SELECTED PRICE POINT */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Selected Price
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${currentPoint.price}
            </span>
            {currentPoint.isCurrentPrice && (
              <span className="text-[10px] bg-slate-900 text-[#FFC20E] font-bold px-1.5 py-0.5 rounded">
                Current
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {currentPoint.kinkLabel ? `Kink: ${currentPoint.kinkLabel}` : 'Linear Region'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Own Elasticity (ε)
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black font-mono ${
              Math.abs(currentPoint.elasticity) > 2.0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {currentPoint.elasticity}
            </span>
            <span className="text-[10px] font-semibold text-slate-600">
              {Math.abs(currentPoint.elasticity) > 1.0 ? 'Elastic' : 'Inelastic'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            1% ΔP = {currentPoint.elasticity}% ΔVol
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Predicted Demand Volume
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {currentPoint.volumeUnits}k
            </span>
            <span className="text-xs text-slate-500">units/yr</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            95% Range: {currentPoint.lowerConfidence}k - {currentPoint.upperConfidence}k
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Estimated Gross Revenue
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${currentPoint.revenueM}M
            </span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
            Peak Rev Price: ${revMaxPoint.price} (${revMaxPoint.revenueM}M)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Gross Margin %
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {currentPoint.grossMarginPct}%
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Margin Dollars: ${(currentPoint.revenueM * (currentPoint.grossMarginPct / 100)).toFixed(2)}M
          </div>
        </div>
      </div>

      {/* DUAL SUBPANEL: S-CURVE & CROSS-PRICE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT (7 COLS): INTERACTIVE ELASTICITY S-CURVE */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Non-Linear Elasticity S-Curve with Confidence Bounds</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Price ($) vs. Predicted Demand Volume (Units k) showing psychological kink cliffs
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <span className="w-2.5 h-0.5 bg-slate-900" />
                  <span>Demand Curve</span>
                </span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <span className="w-2 h-2 bg-[#FFC20E] border border-amber-500 rounded-full" />
                  <span>Kink Point</span>
                </span>
              </div>
            </div>

            {/* S-CURVE CHART */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={elasticityPoints}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                  onClick={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      setSelectedPriceIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="elasticityConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="price" 
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    tickFormatter={(v) => `$${v}`}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis 
                    dataKey="volumeUnits" 
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    unit="k"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const pt = payload[0].payload as ElasticityCurvePoint;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-xl border border-slate-700 text-xs font-sans min-w-[210px]">
                            <div className="font-bold text-[#FFC20E] pb-1 border-b border-slate-800 flex justify-between items-center">
                              <span>Price: ${pt.price}</span>
                              <span className="text-[10px] text-slate-300 font-mono font-bold">ε = {pt.elasticity}</span>
                            </div>
                            <div className="mt-2 space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Volume:</span>
                                <span className="font-mono font-bold text-white">{pt.volumeUnits}k units</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Gross Rev:</span>
                                <span className="font-mono font-bold text-[#FFC20E]">${pt.revenueM}M</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Gross Margin:</span>
                                <span className="font-mono font-bold text-emerald-400">{pt.grossMarginPct}%</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                                <span>95% Bounds:</span>
                                <span className="font-mono">{pt.lowerConfidence}k – {pt.upperConfidence}k</span>
                              </div>
                              {pt.kinkLabel && (
                                <div className="text-[10px] text-amber-300 font-bold bg-amber-950/80 p-1 rounded mt-1">
                                  ⚠️ {pt.kinkLabel}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  
                  {/* Shaded confidence bound area */}
                  <Area
                    type="monotone"
                    dataKey="upperConfidence"
                    stroke="transparent"
                    fill="url(#elasticityConfidence)"
                    isAnimationActive={false}
                  />
                  
                  {/* Main Demand S-Curve */}
                  <Line 
                    type="monotone" 
                    dataKey="volumeUnits" 
                    stroke="#0F172A" 
                    strokeWidth={2.5}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.isCurrentPrice) {
                        return <circle key={payload.price} cx={cx} cy={cy} r={6} fill="#FFC20E" stroke="#000" strokeWidth={2} />;
                      }
                      if (payload.isKinkPoint) {
                        return <circle key={payload.price} cx={cx} cy={cy} r={5} fill="#EF4444" stroke="#FFF" strokeWidth={2} />;
                      }
                      return <circle key={payload.price} cx={cx} cy={cy} r={3} fill="#64748B" />;
                    }}
                  />

                  {/* Vertical barrier reference lines for Kink Points */}
                  <ReferenceLine x={149} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '$149 Kink', fill: '#DC2626', fontSize: 9, position: 'top' }} />
                  <ReferenceLine x={199} stroke="#D97706" strokeDasharray="3 3" label={{ value: '$199 Core Kink', fill: '#B45309', fontSize: 9, position: 'top' }} />
                  <ReferenceLine x={249} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '$249 Barrier', fill: '#DC2626', fontSize: 9, position: 'top' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-[11px] text-slate-600 flex items-center justify-between">
            <span><strong>Model Insight:</strong> Crossing the $199 price point increases elasticity from ε = -1.62 to ε = -2.35, triggering non-linear volume collapse.</span>
            <span className="font-semibold text-slate-800">Recommend hold at $199</span>
          </div>
        </div>

        {/* RIGHT (5 COLS): CROSS-PRICE ELASTICITY MATRIX */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Cross-Price Elasticity Matrix
                </h4>
                <p className="text-[11px] text-slate-500">
                  Estimated volume & revenue shift if competitor changes price
                </p>
              </div>

              {/* TOGGLE FOR COMPETITOR SHOCK (+/- 5% VS +/- 10%) */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
                <button
                  onClick={() => setCompetitorShockPercent(5)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    competitorShockPercent === 5 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  ±5% Shock
                </button>
                <button
                  onClick={() => setCompetitorShockPercent(10)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    competitorShockPercent === 10 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  ±10% Shock
                </button>
              </div>
            </div>

            {/* CROSS-PRICE TABLE */}
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Competitor</th>
                    <th className="py-2.5 px-2 text-right">Cross ε</th>
                    <th className="py-2.5 px-2 text-right">If Comp +{competitorShockPercent}%</th>
                    <th className="py-2.5 px-2 text-right">If Comp -{competitorShockPercent}%</th>
                    <th className="py-2.5 px-2 text-center">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {crossPriceMatrix.map((row, idx) => {
                    const mult = competitorShockPercent === 10 ? 2 : 1;
                    const shiftPlusPct = (row.impactPlus5Pct.dewaltVolumeShiftPct * mult).toFixed(1);
                    const shiftMinusPct = (row.impactMinus5Pct.dewaltVolumeShiftPct * mult).toFixed(1);
                    const revShiftPlus = (row.impactPlus5Pct.dewaltRevenueShift * mult / 1000).toFixed(0);
                    const revShiftMinus = (row.impactMinus5Pct.dewaltRevenueShift * mult / 1000).toFixed(0);

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{row.competitor}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{row.keySku}</div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900">
                          +{row.crossElasticity}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="font-mono font-bold text-emerald-700">
                            +{shiftPlusPct}%
                          </span>
                          <span className="block text-[9px] text-slate-500 font-mono">
                            +${revShiftPlus}k
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="font-mono font-bold text-rose-700">
                            {shiftMinusPct}%
                          </span>
                          <span className="block text-[9px] text-slate-500 font-mono">
                            -${Math.abs(Number(revShiftMinus))}k
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            row.substitutionRisk === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : row.substitutionRisk === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {row.substitutionRisk}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-md text-[11px] text-amber-900">
            <strong>Key Finding:</strong> Milwaukee Tool shows highest cross-price elasticity (+0.68). A $10 drop in Milwaukee M18 immediately pulls 3.4% volume away from DeWalt DCD996B.
          </div>
        </div>

      </div>
    </div>
  );
}
