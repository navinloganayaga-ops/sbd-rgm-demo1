import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Layers, 
  Info,
  Maximize2
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
  Legend 
} from 'recharts';
import { ModelType, modelMetadataMap, backtestDataMap } from './dsMockData';

interface ModelHealthScorecardProps {
  activeModel: ModelType;
}

export default function ModelHealthScorecard({ activeModel }: ModelHealthScorecardProps) {
  const [timeRange, setTimeRange] = useState<'L12M' | 'L6M'>('L12M');
  const meta = modelMetadataMap[activeModel];
  const fullData = backtestDataMap[activeModel];
  
  const displayData = timeRange === 'L6M' ? fullData.slice(6) : fullData;

  // Calculate dynamic average residual
  const avgResidual = (
    displayData.reduce((acc, curr) => acc + Math.abs(curr.residualPct), 0) / displayData.length
  ).toFixed(2);

  const getMetricUnitsLabel = () => {
    if (activeModel === 'transference') return 'Units (k)';
    if (activeModel === 'elasticity') return 'Sales ($M)';
    return 'Promo Lift Units (k)';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col h-full font-sans">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
            <Activity size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Model Health & Backtest Scorecard
            </h2>
            <p className="text-[11px] text-slate-500">
              Statistical validation vs out-of-time historical holdout data
            </p>
          </div>
        </div>

        {/* TIME RANGE TOGGLE */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
          <button
            onClick={() => setTimeRange('L12M')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              timeRange === 'L12M'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            L12M Holdout
          </button>
          <button
            onClick={() => setTimeRange('L6M')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              timeRange === 'L6M'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            L6M Recent
          </button>
        </div>
      </div>

      {/* EXECUTIVE METRIC CHIPS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {/* Metric 1: MAPE */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>MAPE (Holdout)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {meta.mape}%
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
              Optimal &lt; 5%
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Avg Residual: ±{avgResidual}%
          </div>
        </div>

        {/* Metric 2: R^2 Score */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>R² Goodness-of-Fit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {meta.r2}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
              High Fit
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Explained Variance: {(meta.r2 * 100).toFixed(1)}%
          </div>
        </div>

        {/* Metric 3: Model Recency */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Model Recency</span>
            <Clock size={11} className="text-slate-400" />
          </div>
          <div className="mt-1">
            <span className="text-xs font-bold text-slate-800 line-clamp-1">
              Weekly Batch #W41
            </span>
            <span className="text-[10px] text-slate-500 block">
              Refreshed 2d ago
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            Snowflake Prod Sync
          </div>
        </div>

        {/* Metric 4: Data Drift Status */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Feature Drift</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Healthy
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              PSI {meta.psiScore}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Threshold: PSI &lt; 0.10
          </div>
        </div>
      </div>

      {/* BACKTEST VISUALIZATION: DUAL LINE + 95% CONFIDENCE BAND */}
      <div className="flex-1 flex flex-col min-h-[260px]">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Actual vs. Predicted Backtest ({getMetricUnitsLabel()})
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              95% Confidence Bounds
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-900 rounded-xs" />
              <span className="text-slate-600 font-medium">Actual Historical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#FFC20E] border border-amber-600" />
              <span className="text-slate-600 font-medium">Model Predicted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-200/50 border border-amber-300 rounded-xs" />
              <span className="text-slate-500 font-medium">95% Conf Band</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC20E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FFC20E" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10, fill: '#64748B' }} 
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748B' }} 
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-lg border border-slate-700 text-xs font-sans min-w-[200px]">
                        <div className="font-bold text-[#FFC20E] pb-1 border-b border-slate-800 flex justify-between items-center">
                          <span>{label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Residual: {data.residualPct > 0 ? `+${data.residualPct}` : data.residualPct}%
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Actual Historical:</span>
                            <span className="font-bold font-mono text-white">{data.actual}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#FFC20E]">Model Predicted:</span>
                            <span className="font-bold font-mono text-[#FFC20E]">{data.predicted}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                            <span>95% Conf Range:</span>
                            <span className="font-mono">{data.lowerBound} – {data.upperBound}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Shaded 95% Confidence Bounds */}
              <Area 
                type="monotone" 
                dataKey="upperBound" 
                stroke="transparent" 
                fill="url(#confidenceGradient)" 
                isAnimationActive={false}
              />
              {/* Actual Historical Line */}
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#0F172A" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#0F172A' }}
                activeDot={{ r: 5, fill: '#0F172A', stroke: '#FFF', strokeWidth: 2 }}
                name="Actual Historical"
              />
              {/* Model Predicted Line */}
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#D97706" 
                strokeWidth={2} 
                strokeDasharray="4 2"
                dot={{ r: 3, fill: '#FFC20E', stroke: '#D97706' }}
                activeDot={{ r: 5, fill: '#FFC20E', stroke: '#000', strokeWidth: 2 }}
                name="Model Predicted"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM METRIC SUMMARY KICKER */}
        <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Zero critical deviations detected across holdout test window.</span>
          </span>
          <span className="font-semibold text-slate-700">
            Holdout Accuracy: {(100 - meta.mape).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
