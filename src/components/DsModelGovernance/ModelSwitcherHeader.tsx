import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Percent, 
  Sparkles, 
  Download, 
  ChevronDown, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  Database,
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import { ModelType, modelMetadataMap } from './dsMockData';

export interface DsFilterState {
  superSbu: string;
  category: string;
  brand: string;
  customer: string;
  timeframe: string;
}

interface ModelSwitcherHeaderProps {
  activeModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  filters: DsFilterState;
  onFilterChange: (filters: DsFilterState) => void;
  onExportAuditReport: () => void;
  isCustomGovernanceActive: boolean;
}

export default function ModelSwitcherHeader({
  activeModel,
  onSelectModel,
  filters,
  onFilterChange,
  onExportAuditReport,
  isCustomGovernanceActive
}: ModelSwitcherHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const modelTabs: { id: ModelType; title: string; subtitle: string; icon: React.ReactNode; badge: string }[] = [
    {
      id: 'transference',
      title: '1. Demand Transference Model',
      subtitle: 'Powers Assortment Planner',
      icon: <Layers size={16} />,
      badge: 'Assortment & Substitution'
    },
    {
      id: 'elasticity',
      title: '2. Pricing Elasticity Model',
      subtitle: 'Powers Strategic Pricing Simulator',
      icon: <Percent size={16} />,
      badge: 'Price Sensitivities (ε)'
    },
    {
      id: 'promo_lift',
      title: '3. Promo Lift Model',
      subtitle: 'Powers Trade Promotions Simulator',
      icon: <Sparkles size={16} />,
      badge: 'Causal Lift & Cannibalization'
    }
  ];

  const handleDropdownToggle = (key: string) => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  const handleResetFilters = () => {
    onFilterChange({
      superSbu: 'Tools & Outdoor',
      category: 'Power Tools',
      brand: 'DeWalt',
      customer: 'The Home Depot',
      timeframe: 'FY2026'
    });
    setOpenDropdown(null);
  };

  const currentMeta = modelMetadataMap[activeModel];

  return (
    <div className="space-y-4 mb-6">
      {/* TOP TITLE & BREADCRUMB STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">FOUNDATIONS</span>
            <span>/</span>
            <span className="text-slate-500">MODEL GOVERNANCE</span>
            <span>/</span>
            <span className="text-amber-600 font-medium">SBD MODEL RISK COMPLIANCE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-[#FFC20E] rounded-md shadow-sm">
              <Cpu size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                Model Governance
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  Explainability & AI Controls
                </span>
                {isCustomGovernanceActive ? (
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                    Active Rule Overrides
                  </span>
                ) : (
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                    Raw ML Baseline
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Explainable AI telemetry, causal driver SHAP attributions, backtest validation, and human-in-the-loop governance limits for Stanley Black & Decker.
              </p>
            </div>
          </div>
        </div>

        {/* TOP QUICK ACTIONS */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-xs">
            <Database size={13} className="text-sky-600" />
            <span className="font-medium text-slate-800">Snowflake Feature Store:</span>
            <span className="text-slate-500 font-mono text-[11px]">v2026.10_PROD</span>
          </div>

          <button
            onClick={onExportAuditReport}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-black text-[#FFC20E] font-bold text-xs uppercase tracking-wider rounded transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Download complete model governance documentation and validation certificate"
          >
            <FileText size={15} className="text-[#FFC20E]" />
            <span>Export Model Audit Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 1. PRIMARY MODEL SWITCHER TABS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modelTabs.map((tab) => {
          const isActive = activeModel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectModel(tab.id)}
              className={`p-3.5 rounded-lg border text-left transition-all relative overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-md'
                  : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFC20E]" />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded ${
                      isActive ? 'bg-slate-900 text-[#FFC20E]' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold leading-tight ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>
                      {tab.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>{tab.subtitle}</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    isActive
                      ? 'bg-slate-900 text-[#FFC20E]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. CONTEXT FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Filter size={14} className="text-slate-500" />
            <span>Governance Scope:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Super SBU Filter */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('superSbu')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors cursor-pointer"
              >
                <span className="text-slate-500 text-[11px]">Super SBU:</span>
                <span className="font-semibold">{filters.superSbu}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openDropdown === 'superSbu' && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-xs">
                  {['Tools & Outdoor', 'Industrial & Infrastructure', 'Fastening & Commercial'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        onFilterChange({ ...filters, superSbu: opt });
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors ${
                        filters.superSbu === opt ? 'font-bold text-slate-900 bg-amber-50/60' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('category')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors cursor-pointer"
              >
                <span className="text-slate-500 text-[11px]">Category:</span>
                <span className="font-semibold">{filters.category}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openDropdown === 'category' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-xs">
                  {['Power Tools', 'Hand Tools & Accessories', 'Outdoor Power Equipment', 'Storage & Workbenches'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        onFilterChange({ ...filters, category: opt });
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors ${
                        filters.category === opt ? 'font-bold text-slate-900 bg-amber-50/60' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('brand')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors cursor-pointer"
              >
                <span className="text-slate-500 text-[11px]">Brand:</span>
                <span className="font-semibold">{filters.brand}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openDropdown === 'brand' && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-xs">
                  {['DeWalt', 'Craftsman', 'Stanley', 'Irwin', 'All SBD Brands'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        onFilterChange({ ...filters, brand: opt });
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors ${
                        filters.brand === opt ? 'font-bold text-slate-900 bg-amber-50/60' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Filter */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('customer')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors cursor-pointer"
              >
                <Building2 size={13} className="text-amber-600" />
                <span className="text-slate-500 text-[11px]">Customer:</span>
                <span className="font-semibold">{filters.customer}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openDropdown === 'customer' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-xs">
                  {['The Home Depot', 'Lowe\'s Companies', 'Menards', 'Amazon Commercial', 'Ace Hardware'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        onFilterChange({ ...filters, customer: opt });
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors ${
                        filters.customer === opt ? 'font-bold text-slate-900 bg-amber-50/60' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timeframe Filter */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('timeframe')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-800 transition-colors cursor-pointer"
              >
                <Calendar size={13} className="text-slate-500" />
                <span className="text-slate-500 text-[11px]">Horizon:</span>
                <span className="font-semibold">{filters.timeframe}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openDropdown === 'timeframe' && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 text-xs">
                  {['FY2026', 'L52W Actuals', 'YTD 2026', 'Q4 2026 Pro Plan'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        onFilterChange({ ...filters, timeframe: opt });
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors ${
                        filters.timeframe === opt ? 'font-bold text-slate-900 bg-amber-50/60' : 'text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset Filters to Default"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ACTIVE MODEL SUMMARY STRIP */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Target ML Context:</span>
            <span>{currentMeta.targetSkuContext}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Algorithm: {currentMeta.algorithm}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Sample: {currentMeta.sampleSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
