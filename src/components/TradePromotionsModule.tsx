import React, { useState } from 'react';
import PromoPlanner from './PromoPlanner';
import PromoOptimizerModule from './PromoOptimizerModule';
import { FilterState } from './GlobalFilterBar';

interface TradePromotionsModuleProps {
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onFilterApply: () => void;
}

export default function TradePromotionsModule({ filterState, onFilterChange, onFilterApply }: TradePromotionsModuleProps) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'optimizer'>('simulator');

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">
      {/* Sub-navigation Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-1.5 text-sm font-bold rounded-sm transition-colors ${
              activeTab === 'simulator' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Simulator
          </button>
          <button 
            onClick={() => setActiveTab('optimizer')}
            className={`px-4 py-1.5 text-sm font-bold rounded-sm transition-colors ${
              activeTab === 'optimizer' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Optimizer
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'simulator' && <PromoPlanner filterState={filterState} onFilterChange={onFilterChange} onFilterApply={onFilterApply} />}
        {activeTab === 'optimizer' && <PromoOptimizerModule filterState={filterState} onFilterChange={onFilterChange} onFilterApply={onFilterApply} />}
      </div>
    </div>
  );
}
