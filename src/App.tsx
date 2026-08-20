import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import Sidebar, { NavItem } from './components/Sidebar';
import PortfolioTransferenceModule from './components/PortfolioTransferenceModule';
import AgenticCommerceHub from './components/AgenticCommerceHub';
import StrategicPricingModule from './components/StrategicPricingModule';
import TradePromotionsModule from './components/TradePromotionsModule';
import { FilterState } from './components/GlobalFilterBar';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('strategic_pricing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Shared Global Filter State
  const [filters, setFilters] = useState<FilterState>({
    superSbu: 'All',
    sbu: 'All',
    bu: ['Power Tools Group', 'Hand Tools & Accessories'],
    division: 'All',
    category: 'All',
    portfolio: 'All',
    brand: 'DeWalt',
    demandGroup: 'All',
    customer: 'Home Depot',
    timing: 'Q4 2026'
  });

  const handleGlobalFilterApply = () => {
    // Handle global filter apply
  };

  const handleGlobalRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col justify-between font-sans antialiased select-none">
      
      {/* MAIN DUAL-PANE SHELL LAYOUT */}
      <div className="flex flex-1 min-h-[calc(100vh)]">
        
        {/* LEFT DUAL-PANE SIDEBAR */}
        <Sidebar 
          activeNav={activeNav} 
          onSelectNav={setActiveNav} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* RIGHT MAIN CONTENT AREA CANVAS */}
        <div className="flex-1 flex flex-col bg-[#F8F9FA] min-w-0 overflow-y-auto">
          
          {/* TOP BANNER SHOWCASE */}
          <header className="bg-slate-900 text-white border-b border-slate-800 py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 font-sans">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FFC20E] text-black font-bold text-[10px] px-1.5 py-0.5 rounded-sm tracking-widest uppercase">
                  Enterprise RGM Platform
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  Stanley Black & Decker Commercial AI Suite
                </span>
              </div>
              <h1 className="text-sm md:text-lg font-black text-white tracking-tight mt-1">
                Prescriptive Revenue Growth Management & Agentic AI Engine
              </h1>
            </div>
            <button
              onClick={handleGlobalRefresh}
              disabled={isSyncing}
              className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-black font-bold text-[11px] tracking-wider uppercase px-4 py-2.5 rounded-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95 shrink-0 font-sans"
            >
              <RefreshCw size={14} className={`text-black ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Models...' : 'Global Re-Sync Models'}</span>
            </button>
          </header>

          {/* DYNAMIC MODULE VIEWPORT */}
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {activeNav === 'strategic_pricing' && <StrategicPricingModule />}
            {activeNav === 'trade_promotions' && <TradePromotionsModule filterState={filters} onFilterChange={setFilters} onFilterApply={handleGlobalFilterApply} />}
            {activeNav === 'assortment_planner' && <PortfolioTransferenceModule />}
            {activeNav === 'agentic_engine' && <AgenticCommerceHub filterState={filters} onFilterChange={setFilters} onFilterApply={handleGlobalFilterApply} />}
          </main>

        </div>
      </div>
    </div>
  );
}
