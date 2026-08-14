import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, Layers } from 'lucide-react';
import Sidebar, { NavItem } from './components/Sidebar';
import PromoEventsView from './components/PromoEventsView';
import PromoPlanner from './components/PromoPlanner';
import PromoOptimizerModule from './components/PromoOptimizerModule';
import PortfolioTransferenceModule from './components/PortfolioTransferenceModule';
import AgenticCommerceHub from './components/AgenticCommerceHub';
import ScenarioHub from './components/ScenarioHub';
import { FilterState } from './components/GlobalFilterBar';
import EnablersFooter from './components/EnablersFooter';
import LegendSubFooter from './components/LegendSubFooter';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('portfolio_transference');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const [logs, setLogs] = useState<string[]>([
    `[22:20:01] System: Databricks RGM Data Pipeline synchronized. 12,400 SKU elasticities loaded.`,
    `[22:20:02] Engine: Prescriptive & Agentic AI cores active (Crux, Meridian, Beacon, Keystone).`,
    `[22:20:03] Active Context: Brand: ${filters.brand} | Retailer: ${filters.customer} | Horizon: ${filters.timing}`
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${message}`]);
  };

  const handleGlobalFilterApply = () => {
    addLog(`Filter update applied: Brand=${filters.brand}, Customer=${filters.customer}, Timing=${filters.timing}`);
  };

  const handleGlobalRefresh = () => {
    setIsSyncing(true);
    addLog("Global Refresh: Synchronizing Databricks elasticities & re-calibrating AI decision models...");
    setTimeout(() => {
      setIsSyncing(false);
      addLog("Global Refresh Complete: All 4 Agentic AI cores synchronized with current filter context.");
    }, 1200);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col justify-between font-sans antialiased select-none">
      
      {/* MAIN DUAL-PANE SHELL LAYOUT */}
      <div className="flex flex-1 min-h-[calc(100vh-120px)]">
        
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
            {activeNav === 'scenario_hub' && (
              <ScenarioHub 
                filterState={filters} 
                onFilterChange={setFilters} 
                onFilterApply={handleGlobalFilterApply} 
              />
            )}

            {activeNav === 'promo_events' && (
              <PromoEventsView 
                filterState={filters} 
                onFilterChange={setFilters} 
                onFilterApply={handleGlobalFilterApply} 
              />
            )}

            {activeNav === 'promo_planner' && (
              <PromoPlanner 
                filterState={filters} 
                onFilterChange={setFilters} 
                onFilterApply={handleGlobalFilterApply} 
              />
            )}

            {activeNav === 'promo_optimizer' && (
              <PromoOptimizerModule 
                filterState={filters} 
                onFilterChange={setFilters} 
                onFilterApply={handleGlobalFilterApply} 
              />
            )}

            {activeNav === 'portfolio_transference' && (
              <PortfolioTransferenceModule 
              />
            )}

            {activeNav === 'agentic_engine' && (
              <AgenticCommerceHub 
                filterState={filters} 
                onFilterChange={setFilters} 
                onFilterApply={handleGlobalFilterApply} 
              />
            )}
          </main>

        </div>

      </div>

      {/* FOOTER ACTIVITY FEED COMMAND LINE */}
      <section className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs shrink-0 font-sans">
        <div className="flex items-center gap-2 text-[#FFC20E] font-black shrink-0">
          <Terminal size={16} className="animate-pulse" />
          <span className="uppercase text-[11px] tracking-widest font-bold">AI Operations Command Feed</span>
          <span className="bg-[#FFC20E]/10 border border-[#FFC20E]/30 text-[#FFC20E] text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-bold">
            Live
          </span>
        </div>

        <div className="flex-1 bg-black/60 border border-slate-800 rounded-sm p-2 h-12 overflow-y-auto custom-scrollbar font-sans text-[11px] text-slate-300 leading-relaxed shadow-inner" ref={logContainerRef}>
          {logs.map((log, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-slate-600 font-bold">&gt;</span>
              <span className={log.includes('Filter') ? 'text-[#FFC20E]' : log.includes('Complete') ? 'text-emerald-400' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDATION ENABLERS FOOTER */}
      <EnablersFooter />

      {/* LEGEND SUB-FOOTER */}
      <LegendSubFooter />

    </div>
  );
}
