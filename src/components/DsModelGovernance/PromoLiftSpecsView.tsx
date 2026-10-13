import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Tag,
  DollarSign,
  Layers,
  Percent
} from 'lucide-react';
import { 
  weeklyPromoValidationData, 
  promoValidationPeriodText, 
  promoAverageError,
  promoModelFit,
  promoDriversData,
  promoMechanicEffectivenessRows,
  promoResponseCurveData,
  promoResponseMandatoryCaption,
  promoLiftOverTimeData,
  promoPerformanceTrendData,
  promoCoefficientAcrossRunsRows,
  promoInputDriftRows,
  PromoMechanicEffectivenessRow
} from './promoSpecsData';

interface PromoLiftSpecsViewProps {
  categoryFilter?: string;
  customerFilter?: string;
}

export default function PromoLiftSpecsView({
  categoryFilter = 'Power Tools',
  customerFilter = 'The Home Depot'
}: PromoLiftSpecsViewProps) {
  // View 4 interactive discount depth selection: default index 4 (25% Off)
  const [selectedDiscountIndex, setSelectedDiscountIndex] = useState<number>(4);
  // View 3 interactive mechanic row selection
  const [selectedMechanicRow, setSelectedMechanicRow] = useState<PromoMechanicEffectivenessRow | null>(promoMechanicEffectivenessRows[0]);
  // View 2 filter
  const [driverFilter, setDriverFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const selectedPoint = promoResponseCurveData[selectedDiscountIndex] || promoResponseCurveData[4];

  const filteredDrivers = promoDriversData.filter(d => {
    if (driverFilter === 'positive') return d.coefficientSign === '+';
    if (driverFilter === 'negative') return d.coefficientSign === '-';
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* SECTION 1: CORE MODEL VIEWS (PROMO LIFT MODEL)                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC20E]" />
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Promo Lift Model — Core Analytical Views
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved Data Science model representations answering promotional validation fit, driver hierarchy, mechanic effectiveness, and Bayesian discount response curves.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono font-semibold border border-slate-200">
              Scope: {customerFilter} · {categoryFilter}
            </span>
          </div>
        </div>

        {/* 2X2 GRID: CORE VIEWS 1 TO 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* --------------------------------------------------------------------- */}
          {/* VIEW 1: MODEL VALIDATION                                              */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              {/* Header & Question */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      SNo 1
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Model Validation
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    <strong className="text-slate-800 font-semibold">What it answers:</strong> How well does the model represent historical promotional demand in the validation period?
                  </p>
                </div>

                {/* Two Simple Validation Metrics Cards */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-right">
                    <div className="text-[9px] text-amber-900 uppercase font-extrabold tracking-wider">
                      Average Error
                    </div>
                    <div className="text-sm font-black text-slate-900 leading-tight mt-0.5">
                      {promoAverageError}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-extrabold tracking-wider">
                      Model Fit
                    </div>
                    <div className="text-sm font-black text-slate-900 leading-tight mt-0.5 font-mono">
                      {promoModelFit.split(' ')[0]} {promoModelFit.split(' ')[1]} {promoModelFit.split(' ')[2]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Period Text Box (Explicitly requested in spec) */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-700 flex items-center gap-2">
                <Calendar size={14} className="text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 font-mono text-[11px]">
                  {promoValidationPeriodText}
                </span>
              </div>

              {/* Actual vs Predicted Promotional Sales Line Chart */}
              <div className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyPromoValidationData} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const act = payload.find(p => p.dataKey === 'actualPromoSales')?.value;
                            const pred = payload.find(p => p.dataKey === 'predictedPromoSales')?.value;
                            const item = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">
                                  {label} {item.eventName ? `· ${item.eventName}` : 'Promotional Sales'}
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Actual Promo Sales:</span>
                                  <span className="font-mono font-bold">${Number(act).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#FFC20E]">Predicted Promo Sales:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">${Number(pred).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 text-[11px]">
                                  <span className="text-slate-400">Error:</span>
                                  <span className="font-bold text-emerald-400">{item.errorPct}% MAPE</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        formatter={(val) => val === 'actualPromoSales' ? 'Actual Promotional Sales ($)' : 'Predicted Promotional Sales ($)'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actualPromoSales" 
                        stroke="#334155" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedPromoSales" 
                        stroke="#FFC20E" 
                        strokeWidth={2.5} 
                        strokeDasharray="4 3"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Actual vs Predicted sales line chart</span>
              <span className="text-emerald-700 font-medium">Model Validation: Certified Goodness-of-Fit</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 2: KEY DRIVERS OF PROMOTION RESPONSE                              */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      SNo 2
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Key Drivers of Promotion Response
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    <strong className="text-slate-800 font-semibold">What it answers:</strong> Which modeled factors most influence incremental promotional demand?
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[10px] font-semibold shrink-0">
                  <button
                    onClick={() => setDriverFilter('all')}
                    className={`px-2 py-0.5 rounded ${driverFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setDriverFilter('positive')}
                    className={`px-2 py-0.5 rounded ${driverFilter === 'positive' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    (+) Only
                  </button>
                  <button
                    onClick={() => setDriverFilter('negative')}
                    className={`px-2 py-0.5 rounded ${driverFilter === 'negative' ? 'bg-white text-rose-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    (-) Only
                  </button>
                </div>
              </div>

              {/* Horizontal Ranked Bar Chart */}
              <div className="space-y-2.5 pt-1">
                {filteredDrivers.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <span className="w-4 text-center font-mono font-bold text-slate-400 text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          {item.driver}
                        </span>
                        <span className={`text-[10px] font-mono font-black px-1 rounded ${
                          item.coefficientSign === '-' ? 'text-rose-600 bg-rose-50' : 'text-emerald-700 bg-emerald-50'
                        }`}>
                          ({item.coefficientSign})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-[11px] shrink-0">
                        {item.contributionPct}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.coefficientSign === '-'
                            ? 'bg-gradient-to-r from-rose-400 to-rose-500'
                            : 'bg-gradient-to-r from-amber-400 to-[#FFC20E]'
                        }`}
                        style={{ width: `${(item.contributionPct / 32) * 100}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-500 pl-5.5 leading-tight">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Horizontal Ranked Driver Chart</span>
              <span className="text-slate-700 font-medium">Decomposition: Total Incremental Variance Explained</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 3: PROMOTION EFFECTIVENESS BY MECHANIC                           */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 3
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Promotion Effectiveness by Mechanic
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Which promotion mechanics deliver higher incremental lift?
                </p>
              </div>

              {/* Compact Mechanic Effectiveness Table with Value & Bar Indicators */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-1.5">Promotion Mechanic</th>
                      <th className="pb-1.5 text-right">Average Lift</th>
                      <th className="pb-1.5 text-center w-28">Lift Indicator</th>
                      <th className="pb-1.5 text-right">Observed Events</th>
                      <th className="pb-1.5 text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {promoMechanicEffectivenessRows.map((row, idx) => {
                      const isSelected = selectedMechanicRow?.mechanic === row.mechanic;
                      return (
                        <tr 
                          key={idx}
                          onClick={() => setSelectedMechanicRow(row)}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-50/80' : 'hover:bg-slate-50/70'}`}
                        >
                          <td className="py-2 font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-transparent'}`} />
                            {row.mechanic}
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-emerald-700 text-xs">
                            +{row.averageLiftPct.toFixed(1)}%
                          </td>
                          <td className="py-2 px-2">
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                style={{ width: `${Math.min(100, (row.averageLiftPct / 120) * 100)}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-2 text-right font-mono text-slate-600 text-[11px]">
                            {row.observedPromotions} promos
                          </td>
                          <td className="py-2 text-right">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                              row.marginImpact === 'High Margin'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : row.marginImpact === 'Volume Driver'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {row.marginImpact}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Selected Mechanic Detail Box */}
              {selectedMechanicRow && (
                <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-md p-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">{selectedMechanicRow.mechanic}</span>
                    <span className="text-slate-500 ml-1.5 font-mono">({selectedMechanicRow.sampleEvent})</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-emerald-700">Lift: +{selectedMechanicRow.averageLiftPct}% {selectedMechanicRow.confidenceBand}</span>
                    <span className="text-[10px] text-slate-500">{selectedMechanicRow.observedPromotions} historical observations</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Compact Table with Lift Indicators</span>
              <span className="text-slate-700 font-medium">Model: Causal Event-Level Fixed Effects</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 4: PROMOTION RESPONSE CURVE                                      */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 4
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Promotion Response Curve
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How is demand expected to change as discount depth increases?
                </p>
              </div>

              {/* Price Response Interactive Controls / Inspection */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Baseline Reference Volume</span>
                  <span className="font-bold text-slate-800">14,200 Regular Weekly Units · 0% Promo</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">At Selected {selectedPoint.discountLabel}</span>
                  <span className="font-mono font-bold text-amber-900">
                    +{selectedPoint.predictedIncrementalLiftPct}% Lift ({selectedPoint.predictedVolumeUnits.toLocaleString()} units · ${Number(selectedPoint.predictedGrossSalesDollar / 1000).toFixed(0)}k)
                  </span>
                </div>
              </div>

              {/* Interactive Discount Depth Selection Buttons Strip */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-1.5 scrollbar-thin">
                {promoResponseCurveData.map((pt, idx) => {
                  const isCurrent = idx === selectedDiscountIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDiscountIndex(idx)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold shrink-0 transition-all ${
                        isCurrent 
                          ? 'bg-[#FFC20E] text-slate-950 shadow-2xs ring-1 ring-amber-400' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {pt.discountLabel}
                    </button>
                  );
                })}
              </div>

              {/* Promotion Response Curve Chart */}
              <div className="pt-1">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promoResponseCurveData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="discountLabel" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[0, 240]}
                        tickFormatter={(val) => `+${val}%`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">Discount Depth: {data.discountLabel}</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Predicted Incremental Lift:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">+{data.predictedIncrementalLiftPct}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Expected Total Units:</span>
                                  <span className="font-mono">{data.predictedVolumeUnits.toLocaleString()} units</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Gross Sales Revenue:</span>
                                  <span className="font-mono text-emerald-400">${data.predictedGrossSalesDollar.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 text-[10px] text-slate-400">
                                  <span>95% Credible Interval:</span>
                                  <span>+{data.ciLowerLiftPct}% to +{data.ciUpperLiftPct}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                        formatter={() => 'Predicted Incremental Lift % (Relative to Baseline)'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedIncrementalLiftPct" 
                        stroke="#FFC20E" 
                        strokeWidth={3} 
                        dot={{ r: 3, fill: '#FFC20E' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Exact Mandatory Caption Line (Requested in Screenshot) */}
              <div className="mt-2 text-[11px] text-slate-600 bg-amber-50/60 border border-amber-200/80 rounded px-2.5 py-1.5 italic">
                {promoResponseMandatoryCaption}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Discount Depth vs Incremental Lift Curve</span>
              <span className="text-slate-700 font-medium">Model: Fitted Bayesian Hierarchical Response</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: MODEL MONITORING VIEWS                                         */}
      {/* (Tag: 'Model Monitoring: Future capability / Not accounted in current scope') */}
      {/* ========================================================================= */}
      <div className="pt-6 space-y-4">
        
        {/* PROMINENT MANDATORY SECTION TAG (Exact string from screenshot) */}
        <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-200 text-slate-700 rounded-md shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 bg-slate-200 px-2.5 py-0.5 rounded border border-slate-300">
                  Tag: Model Monitoring: Future capability / Not accounted in current scope
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Promotional Lift Surveillance & Coefficient Trajectory
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 max-w-4xl">
                Tracks stability of estimated promotional lifts across successive model runs, monitors out-of-time error trajectory, and compares key promotional econometric coefficients.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
            Roadmap / Monitoring Scope
          </span>
        </div>

        {/* 4 MONITORING VIEWS IN 2X2 GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 1: PROMOTION LIFT OVER TIME                           */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 1 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Promotion Lift Over Time
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How are estimated promotion lifts changing across model refreshes / runs?
                </p>
              </div>

              {/* Trend Chart: Average lift for promotion mechanics tracked across runs */}
              <div className="pt-2">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promoLiftOverTimeData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="modelRun" 
                        tick={{ fontSize: 9, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[60, 125]}
                        tickFormatter={(val) => `+${val}%`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} ({data.refreshDate})</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-amber-300">Combo Bundle Lift:</span>
                                  <span className="font-mono font-bold">+{data.bundleLiftPct}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-blue-300">Free Battery BOGO Lift:</span>
                                  <span className="font-mono font-bold">+{data.freeBatteryLiftPct}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-emerald-300">TPR 20%+ Lift:</span>
                                  <span className="font-mono font-bold">+{data.tprLiftPct}%</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 text-[10px] text-slate-400">
                                  <span>Average Scope Lift:</span>
                                  <span className="font-bold text-white">+{data.averageLiftPct}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        name="Bundle Kit Special Buy"
                        dataKey="bundleLiftPct" 
                        stroke="#FFC20E" 
                        strokeWidth={2.5} 
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        name="Free Battery BOGO"
                        dataKey="freeBatteryLiftPct" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        name="TPR 20%+ Off"
                        dataKey="tprLiftPct" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Trend Chart</span>
              <span className="text-emerald-700 font-semibold">Stable: Mechanics Maintain Consistent Lift</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 2: MODEL PERFORMANCE OVER TIME                        */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 2 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Model Performance Over Time
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Is model validation performance stable across successive model refreshes?
                </p>
              </div>

              {/* Trend Chart: Average Error tracked by model run */}
              <div className="pt-2">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promoPerformanceTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="modelRun" 
                        tick={{ fontSize: 9, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[3.5, 7.5]}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const err = payload.find(p => p.dataKey === 'averageErrorPct')?.value;
                            const target = payload.find(p => p.dataKey === 'targetThresholdPct')?.value;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} Validation Error</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Average Promo Error:</span>
                                  <span className="font-mono font-bold text-emerald-400">{err}% MAPE</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">Target Threshold:</span>
                                  <span className="font-mono text-slate-400">{target}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                        formatter={(val) => val === 'averageErrorPct' ? 'Average Error Metric (%)' : 'Max Error Threshold (6.5%)'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="averageErrorPct" 
                        stroke="#059669" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, fill: '#059669' }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="targetThresholdPct" 
                        stroke="#94a3b8" 
                        strokeWidth={1.5} 
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Trend Chart</span>
              <span className="text-emerald-700 font-semibold">Error improving: 5.8% → 4.6% MAPE</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 3: KEY COEFFICIENTS ACROSS RUNS (COMPARISON TABLE)    */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 3 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Key Coefficients Across Runs
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How are important model coefficients changing from one model run to the next?
                </p>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-1.5">Driver / Parameter</th>
                      <th className="pb-1.5 text-right">Run 1</th>
                      <th className="pb-1.5 text-right">Run 2</th>
                      <th className="pb-1.5 text-right font-bold text-slate-800">Current</th>
                      <th className="pb-1.5 text-right">Change Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {promoCoefficientAcrossRunsRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 font-semibold text-slate-800 text-[11px]">
                          {row.parameter}
                        </td>
                        <td className="py-2 text-right font-mono text-slate-500 text-[11px]">
                          {row.run1}
                        </td>
                        <td className="py-2 text-right font-mono text-slate-500 text-[11px]">
                          {row.run2}
                        </td>
                        <td className="py-2 text-right font-mono font-bold text-slate-900 text-[11px]">
                          {row.runCurrent}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                            row.statusType === 'stable'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : row.statusType === 'increase'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {row.changeIndicator}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Comparison Table Across Runs</span>
              <span className="text-slate-700 font-medium">Econometric Parameter Tracking</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 4: INPUT & PROMO FEATURE DRIFT (PSI COMPARISON TABLE)  */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 4 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Input / Data Drift
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Have important model inputs shifted materially from the data used to build the model?
                </p>
              </div>

              {/* Compact Drift / Distribution Comparison Table */}
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-2">Important Model Input</th>
                      <th className="pb-2 text-right">Training Baseline</th>
                      <th className="pb-2 text-right">Current Scoring</th>
                      <th className="pb-2 text-center w-20">PSI Score</th>
                      <th className="pb-2 text-right">Drift Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {promoInputDriftRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-800 text-xs">
                          {row.inputFeature}
                          <span className="block text-[10px] text-slate-400 font-normal">{row.category}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-500">
                          {row.baselineMean}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                          {row.currentScoring}
                        </td>
                        <td className="py-2.5 text-center font-mono font-semibold text-slate-700">
                          {row.psiScore.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${
                            row.driftStatus.includes('No Drift')
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : row.driftStatus.includes('Low Drift')
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {row.driftStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Compact Drift Comparison</span>
              <span className="text-slate-700 font-medium">Population Stability Index (PSI)</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
