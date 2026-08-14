import React from 'react';
import { 
  Calendar, 
  Sliders, 
  Bot, 
  BarChart3, 
  Database, 
  AlertCircle, 
  FlaskConical, 
  ChevronRight,
  PanelLeftClose,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export type NavItem = 
  | 'promo_events'
  | 'review_hub'
  | 'competitor_insights'
  | 'data_sources'
  | 'data_exceptions'
  | 'sku_lab'
  | 'scenario_hub'
  | 'promo_planner'
  | 'promo_optimizer'
  | 'portfolio_transference'
  | 'agentic_engine';

interface SidebarProps {
  activeNav: NavItem;
  onSelectNav: (item: NavItem) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ 
  activeNav, 
  onSelectNav,
  isCollapsed = false,
  onToggleCollapse 
}: SidebarProps) {

  return (
    <aside className={`bg-[#181818] border-r border-neutral-800/80 text-neutral-300 flex flex-col shrink-0 transition-all duration-300 select-none ${isCollapsed ? 'w-16' : 'w-64'} font-sans`}>
      
      {/* BRAND BLOCK HEADER */}
      <div className="p-3 border-b border-neutral-800 bg-black flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Signature Stanley Black & Decker Badge */}
          <div className="bg-[#FFC20E] text-black font-black px-2 py-1 tracking-tighter text-xs uppercase flex flex-col justify-center leading-none rounded-sm shrink-0">
            <span className="font-extrabold text-[11px] leading-3 tracking-tighter">STANLEY</span>
            <span className="font-black text-[9px] leading-3 tracking-tight">Black&Decker</span>
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider truncate">
                RGM Platform
              </span>
              <span className="text-[9px] text-neutral-500 font-medium tracking-wide truncate">
                Tools | Outdoor | Industrial
              </span>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse} 
            className="text-neutral-500 hover:text-white p-1 rounded-sm transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <PanelLeftClose size={16} className={isCollapsed ? 'rotate-180' : ''} />
          </button>
        )}
      </div>

      {/* NAVIGATION SECTIONS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-6 px-2 text-sm">
        
        {/* SECTION 1: RGM - PROMO EFFECTIVENESS */}
        <div>
          {!isCollapsed ? (
            <div className="px-2 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-between">
              <span>RGM • Promo Effectiveness</span>
            </div>
          ) : (
            <div className="h-px bg-neutral-800 my-2" />
          )}

          <div className="space-y-0.5">
            <button
              onClick={() => onSelectNav('promo_events')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                activeNav === 'promo_events'
                  ? 'bg-neutral-800 text-white font-semibold border-l-2 border-[#FFC20E]'
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white font-medium'
              }`}
            >
              <BarChart3 size={15} className={activeNav === 'promo_events' ? 'text-[#FFC20E]' : 'text-neutral-400'} />
              {!isCollapsed && <span className="truncate">Promo Events</span>}
            </button>

            <button
              disabled
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-neutral-500 cursor-not-allowed opacity-60 font-medium"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Calendar size={15} className="text-neutral-600" />
                {!isCollapsed && <span className="truncate">Review Hub</span>}
              </div>
              {!isCollapsed && <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-500 px-1 py-0.5 rounded-sm uppercase tracking-wider font-bold">Static</span>}
            </button>

            <button
              disabled
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-neutral-500 cursor-not-allowed opacity-60 font-medium"
            >
              <div className="flex items-center gap-2.5 truncate">
                <BarChart3 size={15} className="text-neutral-600" />
                {!isCollapsed && <span className="truncate">Competitor Insights</span>}
              </div>
              {!isCollapsed && <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-500 px-1 py-0.5 rounded-sm uppercase tracking-wider font-bold">Static</span>}
            </button>
          </div>
        </div>

        {/* SECTION 2: FOUNDATIONS */}
        <div>
          {!isCollapsed ? (
            <div className="px-2 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Foundations
            </div>
          ) : (
            <div className="h-px bg-neutral-800 my-2" />
          )}

          <div className="space-y-0.5">
            <button
              disabled
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-neutral-500 cursor-not-allowed opacity-60 font-medium"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Database size={15} className="text-neutral-600" />
                {!isCollapsed && <span className="truncate">Data Sources</span>}
              </div>
              {!isCollapsed && <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-500 px-1 py-0.5 rounded-sm uppercase tracking-wider font-bold">Static</span>}
            </button>

            <button
              disabled
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-neutral-500 cursor-not-allowed opacity-60 font-medium"
            >
              <div className="flex items-center gap-2.5 truncate">
                <AlertCircle size={15} className="text-neutral-600" />
                {!isCollapsed && <span className="truncate">Data Quality / Exceptions</span>}
              </div>
              {!isCollapsed && <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-500 px-1 py-0.5 rounded-sm uppercase tracking-wider font-bold">Static</span>}
            </button>
          </div>
        </div>

        {/* SECTION 3: LAB */}
        <div>
          {!isCollapsed ? (
            <div className="px-2 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Lab
            </div>
          ) : (
            <div className="h-px bg-neutral-800 my-2" />
          )}

          <div className="space-y-0.5">
            <button
              disabled
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-neutral-500 cursor-not-allowed opacity-60 font-medium"
            >
              <div className="flex items-center gap-2.5 truncate">
                <FlaskConical size={15} className="text-neutral-600" />
                {!isCollapsed && <span className="truncate">SKU UX Lab</span>}
              </div>
              {!isCollapsed && <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-500 px-1 py-0.5 rounded-sm uppercase tracking-wider font-bold">Static</span>}
            </button>
          </div>
        </div>

        {/* SECTION 4: PRESCRIPTIVE & AGENTIC (NEW & WORKING) */}
        <div>
          {!isCollapsed ? (
            <div className="px-2 mb-2 text-[10px] font-bold text-[#FFC20E] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFC20E] animate-pulse" />
              <span>Prescriptive & Agentic</span>
            </div>
          ) : (
            <div className="h-px bg-[#FFC20E]/40 my-2" />
          )}

          <div className="space-y-0.5">
            {/* 1. Scenario Hub */}
            <button
              onClick={() => onSelectNav('scenario_hub')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                activeNav === 'scenario_hub'
                  ? 'bg-neutral-800 text-white font-semibold border-l-2 border-[#FFC20E]'
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <LayoutDashboard size={15} className={activeNav === 'scenario_hub' ? 'text-[#FFC20E]' : 'text-neutral-400'} />
                {!isCollapsed && <span className="truncate">Scenario Hub & Dashboard</span>}
              </div>
              {!isCollapsed && <ChevronRight size={13} className="text-neutral-500" />}
            </button>

            {/* 2. Promo Planner */}
            <button
              onClick={() => onSelectNav('promo_planner')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                activeNav === 'promo_planner'
                  ? 'bg-neutral-800 text-white font-semibold border-l-2 border-[#FFC20E]'
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Calendar size={15} className={activeNav === 'promo_planner' ? 'text-[#FFC20E]' : 'text-neutral-400'} />
                {!isCollapsed && <span className="truncate">Promo Planner</span>}
              </div>
              {!isCollapsed && <ChevronRight size={13} className="text-neutral-500" />}
            </button>

            {/* 2. Promo Optimizer */}
            <button
              onClick={() => onSelectNav('promo_optimizer')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                activeNav === 'promo_optimizer'
                  ? 'bg-neutral-800 text-white font-semibold border-l-2 border-[#FFC20E]'
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Sliders size={15} className={activeNav === 'promo_optimizer' ? 'text-[#FFC20E]' : 'text-neutral-400'} />
                {!isCollapsed && <span className="truncate">Promo Optimizer</span>}
              </div>
              {!isCollapsed && <ChevronRight size={13} className="text-neutral-500" />}
            </button>

            {/* 3. Portfolio Transference */}
            <button
              onClick={() => onSelectNav('portfolio_transference')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                activeNav === 'portfolio_transference'
                  ? 'bg-neutral-800 text-white font-semibold border-l-2 border-[#FFC20E]'
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <LayoutDashboard size={15} className={activeNav === 'portfolio_transference' ? 'text-[#FFC20E]' : 'text-neutral-400'} />
                {!isCollapsed && <span className="truncate">Portfolio Transference</span>}
              </div>
              {!isCollapsed && <ChevronRight size={13} className="text-neutral-500" />}
            </button>

            {/* 4. Agentic AI Engine */}
            <button
              onClick={() => onSelectNav('agentic_engine')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                activeNav === 'agentic_engine'
                  ? 'bg-neutral-800 text-white font-semibold border-l-2 border-[#FFC20E]'
                  : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Bot size={15} className={activeNav === 'agentic_engine' ? 'text-[#FFC20E]' : 'text-neutral-400'} />
                {!isCollapsed && <span className="truncate">Agentic AI Engine</span>}
              </div>
              {!isCollapsed && <Sparkles size={12} className="text-[#FFC20E]" />}
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER USER / STATUS BLOCK */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/60 text-[10px] text-neutral-400 flex items-center justify-between font-sans">
        {!isCollapsed && (
          <div>
            <div className="text-neutral-300 font-bold">Channel Owner Home</div>
            <div className="text-neutral-500 text-[10px] font-medium">SBD Global Commercial RGM</div>
          </div>
        )}
        <div className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
      </div>

    </aside>
  );
}
