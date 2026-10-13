import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
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
  Percent, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  DollarSign,
  Filter
} from 'lucide-react';
import { 
  weeklyPricingValidationData, 
  pricingValidationPeriodText, 
  pricingAverageError,
  pricingModelFit,
  overallScopeElasticity,
  overallScopeLabel,
  hierarchyElasticityRows,
  demandDriversData,
  priceResponseCurveData,
  referencePriceDollar,
  referenceDemandUnits,
  priceResponseMandatoryCaption,
  elasticityOverTimeData,
  pricingPerformanceTrendData,
  coefficientAcrossRunsRows,
  pricingInputDriftRows,
  HierarchyElasticityRow
} from './pricingSpecsData';

interface PricingModelSpecsViewProps {
  categoryFilter?: string;
  customerFilter?: string;
}

export default function PricingModelSpecsView({
  categoryFilter = 'Power Tools',
  customerFilter = 'The Home Depot'
}: PricingModelSpecsViewProps) {
  // View 4 interactive price selection: default is index 5 (0% Ref)
  const [selectedPricePointIndex, setSelectedPricePointIndex] = useState<number>(5);
  // View 2 interactive row selection
  const [selectedHierarchyRow, setSelectedHierarchyRow] = useState<HierarchyElasticityRow | null>(hierarchyElasticityRows[0]);
  // View 3 filter
  const [driverFilter, setDriverFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const selectedPoint = priceResponseCurveData[selectedPricePointIndex] || priceResponseCurveData[5];

  const filteredDrivers = demandDriversData.filter(d => {
    if (driverFilter === 'positive') return d.coefficientSign === '+';
    if (driverFilter === 'negative') return d.coefficientSign === '-';
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* SECTION 1: CORE MODEL VIEWS (PRICING ELASTICITY MODEL)                    */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC20E]" />
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Pricing Elasticity Model — Core Analytical Views
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved Data Science model representations answering validation fit, own-price elasticity hierarchy, demand driver decomposition, and Bayesian price response curves.
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
                    <strong className="text-slate-800 font-semibold">What it answers:</strong> How well does the model represent historical sales in the validation period?
                  </p>
                </div>

                {/* Two Simple Validation Metrics Cards (Average Error & Model Fit) */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-right">
                    <div className="text-[9px] text-amber-900 uppercase font-extrabold tracking-wider">
                      Average Error
                    </div>
                    <div className="text-sm font-black text-slate-900 leading-tight mt-0.5">
                      {pricingAverageError}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-extrabold tracking-wider">
                      Model Fit
                    </div>
                    <div className="text-sm font-black text-slate-900 leading-tight mt-0.5 font-mono">
                      {pricingModelFit.split(' ')[0]} {pricingModelFit.split(' ')[1]} {pricingModelFit.split(' ')[2]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Period Text Box (Explicitly requested in spec) */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-700 flex items-center gap-2">
                <Calendar size={14} className="text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 font-mono text-[11px]">
                  {pricingValidationPeriodText}
                </span>
              </div>

              {/* Actual vs Predicted Sales Line Chart */}
              <div className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyPricingValidationData} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
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
                            const act = payload.find(p => p.dataKey === 'actualSales')?.value;
                            const pred = payload.find(p => p.dataKey === 'predictedSales')?.value;
                            const err = payload[0].payload.errorPct;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} Sales Revenue</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Actual Sales:</span>
                                  <span className="font-mono font-bold">${Number(act).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#FFC20E]">Predicted Sales:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">${Number(pred).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 text-[11px]">
                                  <span className="text-slate-400">Error:</span>
                                  <span className="font-bold text-emerald-400">{err}% MAPE</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        formatter={(val) => val === 'actualSales' ? 'Actual Weekly Sales ($)' : 'Predicted Weekly Sales ($)'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actualSales" 
                        stroke="#334155" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedSales" 
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
          {/* VIEW 2: AVERAGE OWN-PRICE ELASTICITY (COMPACT TABLE)                  */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 2
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Average Own-Price Elasticity
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How price-sensitive are the products represented by the selected business scope?
                </p>
              </div>

              {/* Scope-Level Elasticity Highlight Banner */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-3 mb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                    Selected Scope Overall Elasticity
                  </span>
                  <span className="text-xs text-slate-600 font-medium block">
                    {overallScopeLabel}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-xl text-slate-900">
                    ε = {overallScopeElasticity}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded block mt-0.5">
                    Elastic Response
                  </span>
                </div>
              </div>

              {/* Compact Product-Group Hierarchy Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-1.5">Product Group / Hierarchy</th>
                      <th className="pb-1.5">Sample SKUs</th>
                      <th className="pb-1.5 text-right">Own Elasticity (ε)</th>
                      <th className="pb-1.5 text-right">Price Sensitivity</th>
                      <th className="pb-1.5 text-right">Vol Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {hierarchyElasticityRows.map((row, idx) => {
                      const isSelected = selectedHierarchyRow?.hierarchyLevel === row.hierarchyLevel;
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => setSelectedHierarchyRow(row)}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-50/80' : 'hover:bg-slate-50/70'}`}
                        >
                          <td className="py-1.5 font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-transparent'}`} />
                            {row.hierarchyLevel}
                          </td>
                          <td className="py-1.5 text-[10px] text-slate-500 font-mono">
                            {row.sampleSkus}
                          </td>
                          <td className="py-1.5 text-right font-mono font-bold text-slate-900">
                            {row.elasticity.toFixed(2)}
                          </td>
                          <td className="py-1.5 text-right">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                              row.classification === 'Highly Elastic'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : row.classification === 'Elastic'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : row.classification === 'Inelastic (Necessity)'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {row.priceSensitivity}
                            </span>
                          </td>
                          <td className="py-1.5 text-right text-[11px] font-mono text-slate-500">
                            {row.shareOfVolume}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Focused Selected Product Group Breakdown */}
              {selectedHierarchyRow && (
                <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-md p-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">{selectedHierarchyRow.hierarchyLevel}</span>
                    <span className="text-slate-500 ml-1.5">({selectedHierarchyRow.sampleSkus})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">ε = {selectedHierarchyRow.elasticity}</span>
                    <span className="text-[10px] text-slate-500">Vol: {selectedHierarchyRow.shareOfVolume}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Compact Hierarchy Summary Table</span>
              <span className="text-slate-700 font-medium">Model Estimation: Log-Log Elasticity Engine</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 3: KEY DRIVERS OF DEMAND (HORIZONTAL BAR / RANKED DRIVERS)        */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      SNo 3
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Key Drivers of Demand
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    <strong className="text-slate-800 font-semibold">What it answers:</strong> Which modeled factors have the strongest influence on demand in the selected pricing scope?
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
                        style={{ width: `${(item.contributionPct / 35) * 100}%` }}
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
              <span className="text-slate-700 font-medium">Decomposition: Total Variance Explained</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 4: PRICE RESPONSE CURVE (HIERARCHICAL BAYESIAN S-CURVE)          */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 4
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Price Response Curve
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How does the model expect demand to change as price moves up or down from the current/reference price?
                </p>
              </div>

              {/* Price Response Interactive Controls / Inspection */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Reference Anchor SKU</span>
                  <span className="font-bold text-slate-800">DeWalt 20V Compact Drill (Ref: ${referencePriceDollar.toFixed(2)})</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">At Selected {selectedPoint.priceChangeLabel}</span>
                  <span className="font-mono font-bold text-amber-900">
                    ${selectedPoint.priceDollar.toFixed(2)} → Index {selectedPoint.demandIndex} ({selectedPoint.predictedDemandUnits.toLocaleString()} units)
                  </span>
                </div>
              </div>

              {/* Interactive Price Point Selection Buttons Strip */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-1.5 scrollbar-thin">
                {priceResponseCurveData.map((pt, idx) => {
                  const isCurrent = idx === selectedPricePointIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPricePointIndex(idx)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold shrink-0 transition-all ${
                        isCurrent 
                          ? 'bg-[#FFC20E] text-slate-950 shadow-2xs ring-1 ring-amber-400' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {pt.priceChangeLabel}
                    </button>
                  );
                })}
              </div>

              {/* Price Response Curve Chart */}
              <div className="pt-1">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceResponseCurveData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="priceChangeLabel" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[40, 180]}
                        tickFormatter={(val) => `${val}`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">Price Move: {data.priceChangeLabel}</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">New Shelf Price:</span>
                                  <span className="font-mono font-bold">${data.priceDollar.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#FFC20E]">Predicted Demand Index:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">{data.demandIndex} (Ref = 100)</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Expected Weekly Units:</span>
                                  <span className="font-mono">{data.predictedDemandUnits.toLocaleString()} units</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 text-[10px] text-slate-400">
                                  <span>95% Credible Interval:</span>
                                  <span>Index {data.ciLowerIndex} - {data.ciUpperIndex}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                        formatter={() => 'Predicted Demand Index (Reference = 100)'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="demandIndex" 
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
                {priceResponseMandatoryCaption}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Price Change vs Predicted Demand Curve</span>
              <span className="text-slate-700 font-medium">Model: Hierarchical Bayesian Curve</span>
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
                  Pricing Elasticity Surveillance & Coefficient Trajectory
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 max-w-4xl">
                Tracks stability of estimated price elasticity across successive model runs, monitors out-of-time error trajectory, and compares key econometric coefficients.
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
          {/* MONITORING VIEW 1: PRICE ELASTICITY OVER TIME                         */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 1 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Price Elasticity Over Time
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How does estimated price sensitivity change across model refreshes / runs?
                </p>
              </div>

              {/* Trend Chart of Average Own-Price Elasticity */}
              <div className="pt-2">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={elasticityOverTimeData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="modelRun" 
                        tick={{ fontSize: 9, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[-1.9, -1.5]}
                        tickFormatter={(val) => `${val.toFixed(2)}`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} ({data.refreshDate})</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Estimated Elasticity:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">ε = {data.averageElasticity.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 text-[10px] text-slate-400">
                                  90% Band: {data.confidenceLower.toFixed(2)} to {data.confidenceUpper.toFixed(2)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                        formatter={() => 'Average Own-Price Elasticity (ε)'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="averageElasticity" 
                        stroke="#FFC20E" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, fill: '#FFC20E' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Trend Chart by Run</span>
              <span className="text-emerald-700 font-semibold">Stable: ε = -1.68 ± 0.03</span>
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

              {/* Trend Chart: Average Error metric tracked by run */}
              <div className="pt-2">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pricingPerformanceTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="modelRun" 
                        tick={{ fontSize: 9, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[3.0, 7.0]}
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
                                  <span className="text-slate-300">Average Error:</span>
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
                        formatter={(val) => val === 'averageErrorPct' ? 'Average Error Metric (%)' : 'Max Error Threshold (6.0%)'}
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
              <span className="text-emerald-700 font-semibold">Error improving: 5.4% → 4.0%</span>
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
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How are the important model coefficients changing from one model run to the next?
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
                    {coefficientAcrossRunsRows.map((row, idx) => (
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
          {/* MONITORING VIEW 4: INPUT / DATA DRIFT (PSI COMPARISON TABLE)           */}
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
                    {pricingInputDriftRows.map((row, idx) => (
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
