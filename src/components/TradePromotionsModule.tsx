import React, { useState } from 'react';
import PromoPlanner from './PromoPlanner';
import PromoOptimizerModule from './PromoOptimizerModule';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';

interface TradePromotionsModuleProps {
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onFilterApply: () => void;
}

export default function TradePromotionsModule({ filterState, onFilterChange, onFilterApply }: TradePromotionsModuleProps) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'optimizer'>('simulator');

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">
      <div className="bg-white flex flex-col shrink-0">
        <div className="px-6 pt-5 pb-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('simulator')}
              className={`px-5 py-2.5 text-sm font-bold rounded flex items-center justify-center transition-colors ${
                activeTab === 'simulator' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Simulator
            </button>
            <button 
              onClick={() => setActiveTab('optimizer')}
              className={`px-5 py-2.5 text-sm font-bold rounded flex items-center justify-center transition-colors ${
                activeTab === 'optimizer' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white border border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Optimizer
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
            Channel Owner Home / Prescriptive RGM
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'simulator' ? 'Promo Planner' : 'Promo Optimizer'}
            </h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border uppercase tracking-wide ${
              activeTab === 'simulator' 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}>
              {activeTab === 'simulator' ? 'Interactive Module' : 'Algorithmic Engine'}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 max-w-4xl leading-relaxed">
            {activeTab === 'simulator' 
              ? 'Interactive 3-step workflow wizard for constructing week-by-week promotional calendars and simulating top & bottom line financial outputs.'
              : 'Linear programming & elasticity optimization solver that generates profit-maximizing promotional schedules subject to budget, gap, and depth constraints.'}
          </p>
        </div>

        <div className="px-6 pb-4">
          <GlobalFilterBar 
            filters={filterState} 
            onFilterChange={onFilterChange} 
            onApply={onFilterApply} 
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6 pt-4">
        {activeTab === 'simulator' && <PromoPlanner filterState={filterState} onFilterChange={onFilterChange} onFilterApply={onFilterApply} />}
        {activeTab === 'optimizer' && <PromoOptimizerModule filterState={filterState} onFilterChange={onFilterChange} onFilterApply={onFilterApply} />}
      </div>
    </div>
  );
}
