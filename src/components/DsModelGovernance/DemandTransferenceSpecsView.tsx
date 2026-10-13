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
  Layers, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  weeklyValidationData, 
  validationPeriodText, 
  validationErrorPct,
  variableImportanceData,
  transferCompositionData,
  donorProductGroups,
  receiverProductGroups,
  demandTransferMatrixGrid,
  transferStabilityData,
  relationshipStabilityRows,
  modelPerformanceTrendData,
  inputDriftRows
} from './transferenceSpecsData';

interface DemandTransferenceSpecsViewProps {
  categoryFilter?: string;
  customerFilter?: string;
}

export default function DemandTransferenceSpecsView({
  categoryFilter = 'Power Tools',
  customerFilter = 'The Home Depot'
}: DemandTransferenceSpecsViewProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; val: number } | null>(null);

  // Helper for heatmap cell background intensity
  const getHeatmapColor = (pct: number) => {
    if (pct >= 50) return 'bg-amber-500 text-slate-950 font-black';
    if (pct >= 35) return 'bg-amber-400 text-slate-950 font-bold';
    if (pct >= 20) return 'bg-amber-300 text-slate-900 font-bold';
    if (pct >= 10) return 'bg-amber-200/80 text-slate-900 font-semibold';
    if (pct >= 5) return 'bg-amber-100 text-slate-800 font-medium';
    return 'bg-slate-50 text-slate-500 font-normal';
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* SECTION 1: CORE MODEL VIEWS (DEMAND TRANSFERENCE MODEL)                   */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC20E]" />
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Demand Transference Model (VTM) — Core Analytical Views
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved Data Science model representations answering core validation, driver hierarchy, aggregate displacement, and category transfer dynamics.
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
                    <strong className="text-slate-800 font-semibold">What it answers:</strong> How well does the underlying model represent historical demand during the validation period?
                  </p>
                </div>

                {/* Error % Metric Card */}
                <div className="bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 text-right shrink-0">
                  <div className="text-[10px] text-amber-900 uppercase font-extrabold tracking-wider">
                    Error %
                  </div>
                  <div className="text-lg font-black text-slate-900 leading-none mt-0.5">
                    {validationErrorPct}%
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Within Target (&lt; 5.0%)
                  </div>
                </div>
              </div>

              {/* Validation Period Text Box (Explicitly requested in spec) */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-700 flex items-center gap-2">
                <Calendar size={14} className="text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 font-mono text-[11px]">
                  {validationPeriodText}
                </span>
              </div>

              {/* Actual vs Predicted Weekly Demand Line Chart */}
              <div className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyValidationData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const act = payload.find(p => p.dataKey === 'actualDemand')?.value;
                            const pred = payload.find(p => p.dataKey === 'predictedDemand')?.value;
                            const err = payload[0].payload.errorPct;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} Weekly Demand</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Actual Demand:</span>
                                  <span className="font-mono font-bold">{Number(act).toLocaleString()} units</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#FFC20E]">Predicted Demand:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">{Number(pred).toLocaleString()} units</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 text-[11px]">
                                  <span className="text-slate-400">Weekly Error %:</span>
                                  <span className="font-bold text-emerald-400">{err}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        formatter={(val) => val === 'actualDemand' ? 'Actual Weekly Demand' : 'Predicted Weekly Demand'}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actualDemand" 
                        stroke="#334155" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedDemand" 
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
              <span>Metric: Simple Out-of-Time Error %</span>
              <span className="text-slate-700 font-medium">Model Backtest Status: Certified</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 2: VARIABLE IMPORTANCE                                           */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 2
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Variable Importance
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Which variables are most influential in the VTM model within the selected scope?
                </p>
              </div>

              {/* Horizontal Bar Chart of Relative Variable Importance */}
              <div className="space-y-2 pt-1">
                {variableImportanceData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {item.variable}
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-[11px]">
                        {item.importancePct}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-[#FFC20E] rounded-full transition-all duration-300"
                        style={{ width: `${(item.importancePct / 35) * 100}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-500 leading-tight">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Horizontal Bar Chart</span>
              <span className="text-slate-700 font-medium">VTM Core Feature Store</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 3: TRANSFER COMPOSITION (100% STACKED BAR)                       */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 3
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Transfer Composition
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> At an aggregate level, how does displaced demand split within the selected scope?
                </p>
              </div>

              {/* 100% Stacked Bar Visual */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Aggregate Displaced Demand Split</span>
                  <span>100% Total Volume</span>
                </div>

                {/* The 100% Stacked Bar */}
                <div className="w-full h-8 rounded-lg overflow-hidden flex border border-slate-300 shadow-2xs">
                  {/* SBD Retention */}
                  <div 
                    style={{ width: `${transferCompositionData.sbdRetentionPct}%` }}
                    className="bg-[#FFC20E] text-slate-950 flex items-center justify-center font-black text-xs transition-all hover:opacity-90"
                    title={`SBD Retention: ${transferCompositionData.sbdRetentionPct}%`}
                  >
                    {transferCompositionData.sbdRetentionPct}%
                  </div>

                  {/* Competitor Transfer */}
                  <div 
                    style={{ width: `${transferCompositionData.competitorTransferPct}%` }}
                    className="bg-rose-500 text-white flex items-center justify-center font-black text-xs transition-all hover:opacity-90"
                    title={`Competitor Transfer: ${transferCompositionData.competitorTransferPct}%`}
                  >
                    {transferCompositionData.competitorTransferPct}%
                  </div>

                  {/* Walk-away */}
                  <div 
                    style={{ width: `${transferCompositionData.walkAwayPct}%` }}
                    className="bg-slate-500 text-white flex items-center justify-center font-bold text-xs transition-all hover:opacity-90"
                    title={`Walk-away: ${transferCompositionData.walkAwayPct}%`}
                  >
                    {transferCompositionData.walkAwayPct}%
                  </div>
                </div>

                {/* Legend & Breakdown Metric Chips */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#FFC20E]" />
                      <span>SBD Retention</span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {transferCompositionData.sbdRetentionPct}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      ~{transferCompositionData.sbdRetentionUnits.toLocaleString()} units absorbed by DeWalt / Craftsman
                    </div>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-950">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                      <span>Competitor Transfer</span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {transferCompositionData.competitorTransferPct}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      ~{transferCompositionData.competitorUnits.toLocaleString()} units leak to Milwaukee / Ryobi
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" />
                      <span>Walk-away</span>
                    </div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {transferCompositionData.walkAwayPct}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      ~{transferCompositionData.walkAwayUnits.toLocaleString()} units defer purchase / exit category
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope description text as specified */}
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="truncate pr-2">{transferCompositionData.scopeSummary}</span>
              <span className="font-semibold text-slate-700 shrink-0">100% Stacked Bar</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 4: DEMAND TRANSFER MATRIX (HEATMAP / MATRIX)                     */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    SNo 4
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Demand Transfer Matrix
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> How does displaced demand move between major product groups within the selected scope?
                </p>
              </div>

              <div className="text-[11px] text-slate-500 mb-2">
                Rows = donor / source product group; Columns = receiver product group; Cell = % of displaced demand estimated to transfer.
              </div>

              {/* Heatmap Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded">
                  <thead>
                    <tr className="bg-slate-100/80 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
                      <th className="p-2 border-r border-slate-200 min-w-32">Source / Donor Group</th>
                      {receiverProductGroups.map((rec, rIdx) => (
                        <th key={rIdx} className="p-2 text-center border-r border-slate-200 last:border-r-0 min-w-16">
                          {rec}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {donorProductGroups.map((donor, dIdx) => (
                      <tr key={dIdx} className="hover:bg-slate-50/50">
                        <td className="p-2 font-sans font-semibold text-slate-800 border-r border-slate-200 text-xs">
                          {donor}
                        </td>
                        {receiverProductGroups.map((_, rIdx) => {
                          const val = demandTransferMatrixGrid[dIdx]?.[rIdx] || 0;
                          return (
                            <td 
                              key={rIdx}
                              onMouseEnter={() => setHoveredCell({ row: dIdx, col: rIdx, val })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={`p-2 text-center border-r border-slate-200 last:border-r-0 transition-colors cursor-default ${getHeatmapColor(val)}`}
                              title={`${donor} → ${receiverProductGroups[rIdx]}: ${val}% transfer`}
                            >
                              {val}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Hover Cell Inspector */}
              {hoveredCell && (
                <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 flex items-center justify-between animate-in fade-in duration-100">
                  <span>
                    Displacement from <strong>{donorProductGroups[hoveredCell.row]}</strong> → <strong>{receiverProductGroups[hoveredCell.col]}</strong>:
                  </span>
                  <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {hoveredCell.val}% of displaced volume transferred
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Product-Group Heatmap Matrix</span>
              <span className="text-slate-700 font-medium">Cell: % Displaced Volume</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: MODEL MONITORING VIEWS                                         */}
      {/* (Tag: 'Model Monitoring: Future capability / Not accounted in current scope') */}
      {/* ========================================================================= */}
      <div className="pt-6 space-y-4">
        
        {/* PROMINENT MANDATORY SECTION TAG (Exact string from user prompt) */}
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
                  VTM Model Lifecycle Surveillance & Drift Roadmap
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 max-w-4xl">
                The four monitoring views below track stability across scheduled model refreshes, rank persistence of substitution pairs, validation error trajectory, and feature store input drift.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
            Roadmap / Monitoring Scope
          </span>
        </div>

        {/* 2X2 GRID: MONITORING VIEWS 1 TO 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 1: TRANSFER STABILITY OVER TIME                        */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 1 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Transfer Stability Over Time
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Are SBD retention, competitor transfer and walk-away patterns changing materially across model refreshes?
                </p>
              </div>

              {/* Line Chart by Model Version / Refresh Date */}
              <div className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transferStabilityData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="version" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[10, 70]}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} ({data.refreshDate})</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-[#FFC20E]">SBD Retention:</span>
                                  <span className="font-mono font-bold text-[#FFC20E]">{data.sbdRetentionPct}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-rose-400">Competitor Transfer:</span>
                                  <span className="font-mono font-bold text-rose-400">{data.competitorTransferPct}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Walk-away:</span>
                                  <span className="font-mono font-bold text-slate-300">{data.walkAwayPct}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        formatter={(val) => {
                          if (val === 'sbdRetentionPct') return 'SBD Retention %';
                          if (val === 'competitorTransferPct') return 'Competitor Transfer %';
                          return 'Walk-away %';
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sbdRetentionPct" 
                        stroke="#FFC20E" 
                        strokeWidth={2.5} 
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="competitorTransferPct" 
                        stroke="#f43f5e" 
                        strokeWidth={2} 
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="walkAwayPct" 
                        stroke="#64748b" 
                        strokeWidth={2} 
                        strokeDasharray="3 3"
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Line chart by model version</span>
              <span className="text-emerald-700 font-semibold">Status: Regime Stable (&lt;1.2% variation)</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 2: RELATIONSHIP STABILITY (RANK-CHANGE TABLE)         */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 2 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Relationship Stability
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Are the strongest substitution relationships changing materially across model refreshes?
                </p>
              </div>

              {/* Rank-Change Table */}
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-2">Substitution Relationship</th>
                      <th className="pb-2 text-center w-16">Current</th>
                      <th className="pb-2 text-center w-16">Previous</th>
                      <th className="pb-2 text-center w-28">Rank Change</th>
                      <th className="pb-2 text-right w-16">Transfer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {relationshipStabilityRows.map((rel, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 pr-2">
                          <div className="font-semibold text-slate-800 text-[11px] truncate max-w-xs">
                            {rel.relationship}
                          </div>
                        </td>
                        <td className="py-2 text-center font-mono font-bold text-slate-900 text-xs">
                          #{rel.currentRank}
                        </td>
                        <td className="py-2 text-center font-mono text-slate-500 text-xs">
                          #{rel.previousRank}
                        </td>
                        <td className="py-2 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                            rel.rankChange === 'up' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : rel.rankChange === 'down'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {rel.rankChange === 'up' && <ArrowUpRight size={11} className="text-emerald-700" />}
                            {rel.rankChange === 'down' && <ArrowDownRight size={11} className="text-amber-700" />}
                            {rel.rankChange === 'same' && <Minus size={11} className="text-slate-500" />}
                            <span>{rel.rankChangeLabel}</span>
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono font-bold text-slate-900">
                          {rel.transferRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Representation: Rank-Change Table</span>
              <span className="text-slate-700 font-medium">Top 6 Macro Relationships</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 3: MODEL PERFORMANCE OVER TIME                        */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    SNo 3 (Monitoring)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Model Performance Over Time
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  <strong className="text-slate-800 font-semibold">What it answers:</strong> Is the model's validation performance stable across future model refreshes?
                </p>
              </div>

              {/* Trend Chart: Average Error by model version / refresh period */}
              <div className="pt-2">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={modelPerformanceTrendData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="version" 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        domain={[2.5, 7.0]}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const err = payload.find(p => p.dataKey === 'averageErrorPct')?.value;
                            const target = payload.find(p => p.dataKey === 'targetThresholdPct')?.value;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-amber-400">{label} Performance</div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-300">Average Validation Error:</span>
                                  <span className="font-mono font-bold text-emerald-400">{err}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-slate-400">Target Maximum Threshold:</span>
                                  <span className="font-mono text-slate-400">{target}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        formatter={(val) => val === 'averageErrorPct' ? 'Average Validation Error %' : 'Max Error Threshold (6.0%)'}
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
              <span className="text-emerald-700 font-semibold">Current Error: 3.6% (Consistent Improvement)</span>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* MONITORING VIEW 4: INPUT / DATA DRIFT                                  */}
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
                    {inputDriftRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-800 text-xs">
                          {row.inputName}
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-500">
                          {row.baselineMean}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                          {row.currentMean}
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
