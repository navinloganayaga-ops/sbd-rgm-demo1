import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Check, Filter } from 'lucide-react';

export interface FilterState {
  superSbu: string;
  sbu: string;
  bu: string[];
  division: string;
  category: string;
  portfolio: string;
  brand: string;
  demandGroup: string;
  customer: string;
  timing: string;
}

interface GlobalFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onApply: () => void;
}

export default function GlobalFilterBar({ filters, onFilterChange, onApply }: GlobalFilterBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [appliedToast, setAppliedToast] = useState<boolean>(false);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const handleApplyClick = () => {
    setActiveDropdown(null);
    onApply();
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  const handleReset = () => {
    onFilterChange({
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
    setActiveDropdown(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-4 mb-4 shadow-sm relative font-sans">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500" />
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Global RGM Context Filters
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        
        {/* SUPER SBU */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('superSbu')}
            className={`border rounded px-3 py-1.5 flex items-center gap-2 transition-colors ${
              filters.superSbu !== 'All' ? 'border-slate-800 font-bold bg-slate-50' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-slate-500 text-xs font-semibold">Super SBU:</span>
            <span className="font-bold text-slate-900">{filters.superSbu}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {activeDropdown === 'superSbu' && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded shadow-lg z-50 p-1">
              {['All', 'Global Tools & Storage', 'Industrial & Automotive', 'Outdoor Infrastructure'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange({ ...filters, superSbu: opt });
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-slate-700">{opt}</span>
                  {filters.superSbu === opt && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SBU */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sbu')}
            className={`border rounded px-3 py-1.5 flex items-center gap-2 transition-colors ${
              filters.sbu !== 'All' ? 'border-slate-800 font-bold bg-slate-50' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-slate-500 text-xs font-semibold">SBU:</span>
            <span className="font-bold text-slate-900">{filters.sbu}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {activeDropdown === 'sbu' && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded shadow-lg z-50 p-1">
              {['All', 'Power Tools', 'Hand Tools & Storage', 'Outdoor Power Equipment'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange({ ...filters, sbu: opt });
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-slate-700">{opt}</span>
                  {filters.sbu === opt && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BU */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('bu')}
            className="border border-slate-300 rounded px-3 py-1.5 flex items-center gap-2 transition-colors bg-white hover:bg-slate-50 text-slate-700"
          >
            <span className="text-slate-500 text-xs font-semibold">BU:</span>
            <span className="font-bold text-slate-900">{filters.bu.length} selected</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {activeDropdown === 'bu' && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded shadow-lg z-50 p-2 space-y-1">
              {['Power Tools Group (PTG)', 'Hand Tools & Accessories (HTAS)', 'Outdoor Equipment', 'Storage & Workspace'].map(opt => {
                const isChecked = filters.bu.includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const newBu = isChecked 
                          ? filters.bu.filter(b => b !== opt)
                          : [...filters.bu, opt];
                        onFilterChange({ ...filters, bu: newBu });
                      }}
                      className="rounded text-slate-900 accent-slate-900 w-4 h-4"
                    />
                    <span className="text-slate-700 font-semibold">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* CATEGORY */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('category')}
            className={`border rounded px-3 py-1.5 flex items-center gap-2 transition-colors ${
              filters.category !== 'All' ? 'border-slate-800 font-bold bg-slate-50' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-slate-500 text-xs font-semibold">Category:</span>
            <span className="font-bold text-slate-900">{filters.category}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {activeDropdown === 'category' && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded shadow-lg z-50 p-1">
              {['All', 'Cordless Power Tools', 'Hand Tools & Tapes', 'Mechanics Sets', 'Jobsite Storage'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange({ ...filters, category: opt });
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-slate-700">{opt}</span>
                  {filters.category === opt && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BRAND */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('brand')}
            className="border border-slate-800 rounded px-3 py-1.5 flex items-center gap-2 transition-colors bg-yellow-50 text-slate-900 hover:bg-yellow-100"
          >
            <span className="text-slate-600 text-xs font-semibold">Brand:</span>
            <span className="font-bold text-slate-900">{filters.brand}</span>
            <ChevronDown size={14} className="text-slate-700" />
          </button>

          {activeDropdown === 'brand' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-lg z-50 p-1">
              {['DeWalt', 'Stanley', 'Craftsman', 'Irwin', 'Lenox', 'Mac Tools'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange({ ...filters, brand: opt });
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-slate-700">{opt}</span>
                  {filters.brand === opt && <Check size={16} className="text-slate-900" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CUSTOMER */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('customer')}
            className="border border-slate-300 rounded px-3 py-1.5 flex items-center gap-2 transition-colors bg-white hover:bg-slate-50 text-slate-700"
          >
            <span className="text-slate-500 text-xs font-semibold">Customer:</span>
            <span className="font-bold text-slate-900">{filters.customer}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {activeDropdown === 'customer' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-lg z-50 p-1">
              {['Home Depot', 'Lowe\'s', 'Amazon', 'Ace Hardware', 'Menards', 'Grainger'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange({ ...filters, customer: opt });
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-slate-700">{opt}</span>
                  {filters.customer === opt && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TIMING */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('timing')}
            className="border border-slate-300 rounded px-3 py-1.5 flex items-center gap-2 transition-colors bg-white hover:bg-slate-50 text-slate-700"
          >
            <span className="text-slate-500 text-xs font-semibold">Timing:</span>
            <span className="font-bold text-slate-900">{filters.timing}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {activeDropdown === 'timing' && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-lg z-50 p-1">
              {['Q4 2026', 'Q1 2026', 'Full Year 2026', '26-Week Horizon'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    onFilterChange({ ...filters, timing: opt });
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-slate-700">{opt}</span>
                  {filters.timing === opt && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={handleApplyClick}
          className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-1.5 rounded-sm transition-colors ml-auto shadow-sm"
        >
          Apply Filters
        </button>

      </div>

      {/* Applied Toast */}
      {appliedToast && (
        <div className="absolute bottom-4 right-6 bg-slate-900 text-white font-bold text-sm px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-bounce">
          <Check size={16} className="text-emerald-400" />
          <span>Filters Synced: {filters.brand} | {filters.customer} | {filters.timing}</span>
        </div>
      )}
    </div>
  );
}
