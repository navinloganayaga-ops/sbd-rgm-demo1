import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { ModelType, shapDriversMap, ShapDriver } from './dsMockData';

interface ShapImportancePanelProps {
  activeModel: ModelType;
}

export default function ShapImportancePanel({ activeModel }: ShapImportancePanelProps) {
  const drivers = shapDriversMap[activeModel];
  const [selectedDriver, setSelectedDriver] = useState<ShapDriver | null>(drivers[0] || null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Filter drivers if requested
  const filteredDrivers = activeCategoryFilter === 'All'
    ? drivers
    : drivers.filter(d => d.category === activeCategoryFilter);

  // Categories available for current model
  const categories = ['All', ...Array.from(new Set(drivers.map(d => d.category)))];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col h-full font-sans">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
            <BarChart3 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Global Feature Importance (SHAP Values)
            </h2>
            <p className="text-[11px] text-slate-500">
              Shapley marginal contribution to predicted volume & price shifts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
            <span>Positive Driver (+)</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs" />
            <span>Negative Driver (-)</span>
          </span>
        </div>
      </div>

      {/* FILTER PILLS FOR FEATURE CATEGORIES */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              activeCategoryFilter === cat
                ? 'bg-slate-900 text-[#FFC20E] font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* HORIZONTAL SHAP BAR CHART */}
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={filteredDrivers}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                setSelectedDriver(state.activePayload[0].payload as ShapDriver);
              }
            }}
          >
            <XAxis 
              type="number" 
              domain={[-0.5, 0.6]} 
              tick={{ fontSize: 10, fill: '#64748B' }}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
            />
            <YAxis 
              type="category" 
              dataKey="feature" 
              width={160}
              tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={1.5} />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ShapDriver;
                  const isPositive = item.shapValue > 0;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-md shadow-xl border border-slate-700 max-w-xs text-xs font-sans">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 gap-2">
                        <span className="font-bold text-[#FFC20E] leading-tight">{item.feature}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isPositive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {item.impactPercent}
                        </span>
                      </div>
                      <div className="mt-2 text-[11px] leading-relaxed text-slate-200">
                        {item.businessDescription}
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                        <span>Category: {item.category}</span>
                        <span className="font-mono text-[#FFC20E]">SHAP: {item.shapValue > 0 ? `+${item.shapValue}` : item.shapValue}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="shapValue" radius={[0, 3, 3, 0]}>
              {filteredDrivers.map((entry) => (
                <Cell 
                  key={entry.id} 
                  fill={entry.shapValue > 0 ? '#10B981' : '#F43F5E'} 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SELECTED FEATURE DRILL-DOWN BUSINESS EXPLANATION CARD */}
      {selectedDriver && (
        <div className="mt-3 bg-amber-50/70 border border-amber-200/80 rounded-md p-3 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span className={`w-2 h-2 rounded-full ${selectedDriver.shapValue > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>Driver Insight: {selectedDriver.feature}</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              selectedDriver.shapValue > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Impact: {selectedDriver.impactPercent}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-700">
            {selectedDriver.businessDescription}
          </p>
          <div className="mt-2 pt-1 border-t border-amber-200/50 flex items-center justify-between text-[10px] text-slate-500">
            <span>Statistical Significance: <strong className="text-slate-700">{selectedDriver.confidence}</strong></span>
            <span className="text-amber-800 font-semibold cursor-pointer hover:underline" onClick={() => setSelectedDriver(null)}>
              Dismiss Detail
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
