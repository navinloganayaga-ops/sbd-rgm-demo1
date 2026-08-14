import React, { useState } from 'react';
import { 
  ChevronRight, 
  BarChart3, 
  Filter, 
  Download, 
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Bot,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import NpiModal from './NpiModal';

export default function PortfolioTransferenceModule() {
  const [activeTab, setActiveTab] = useState<'health' | 'workspace' | 'simulation' | 'governance'>('health');
  
  // Health Dashboard States
  const [gsvHurdle, setGsvHurdle] = useState(2000000);
  const [marginHurdle, setMarginHurdle] = useState(35);
  
  // Workspace States
  const [viewMode, setViewMode] = useState<'bare' | 'combo'>('bare');
  const [selectedSkus, setSelectedSkus] = useState<string[]>(['DW-20V-091', 'ST-HT-882']);
  const [showNpiModal, setShowNpiModal] = useState(false);
  const [isNpiAdded, setIsNpiAdded] = useState(false);

  // Scatter Plot Data (Sample)
  const scatterData = [
    { name: 'DeWalt 20V MAX Drill Driver', gsv: 45, margin: 48, fill: '#1e3a8a' }, // Strong Core
    { name: 'DeWalt 20V Combo 2-Tool', gsv: 38, margin: 28, fill: '#bfdbfe' }, // Improve Margin
    { name: 'Craftsman Precision Set', gsv: 1.8, margin: 45, fill: '#fbcfe8' }, // Increase GSV
    { name: 'Legacy 12V Cordless Bare Tool', gsv: 1.2, margin: 22, fill: '#a855f7' }, // Assess for Rationalization
    { name: 'DeWalt 20V MAX 3/8" Right Angle', gsv: 1.2, margin: 24.5, fill: '#a855f7' }, 
    { name: 'Stanley 16oz Fiberglass Hammer', gsv: 1.1, margin: 28.0, fill: '#a855f7' },
  ];

  // Waterfall Chart Data
  const waterfallData = [
    { name: 'Baseline GSV', value: 1400, fill: '#94a3b8' },
    { name: 'Delisted Rev', value: -2.3, fill: '#e11d48' },
    { name: 'Retained Rev', value: 1.7, fill: '#059669' },
    { name: 'Gross NPI Rev', value: 2.5, fill: '#3b82f6' },
    { name: 'Cannibalized Rev', value: -0.7, fill: '#f59e0b' },
    { name: 'Net GSV Impact', value: 1401.2, fill: '#0f172a' }
  ];

  const handleSkuToggle = (sku: string) => {
    if (selectedSkus.includes(sku)) {
      setSelectedSkus(selectedSkus.filter(s => s !== sku));
    } else {
      setSelectedSkus([...selectedSkus, sku]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      
      {/* 1. MODULE HEADER & GLOBAL FILTER BAR */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-6 py-4">
          <div className="text-[10px] font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-2 uppercase">
            <span>Channel Owner Home</span>
            <ChevronRight size={12} />
            <span className="text-[#FFC20E]">Portfolio RGM</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Portfolio Mix & NPI Transference Engine 
                <span className="bg-slate-900 text-[#FFC20E] text-xs px-2 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <Bot size={14} /> AI Assortment Solver
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">SKU rationalization, New Product Introduction (NPI), and demand transference modeling to maximize category margin.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-slate-50 transition-colors">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </div>
        
        {/* SBD Filter Bar */}
        <div className="px-6 py-3 bg-slate-100/50 border-t border-slate-200 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase">Filters:</span>
          </div>
          <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-slate-500 font-medium">
            <option>SUPER SBU: All</option>
          </select>
          <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-slate-500 font-medium">
            <option>CATEGORY: Power Tools</option>
          </select>
          <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-slate-500 font-medium">
            <option>BRAND: DeWalt</option>
          </select>
          <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-slate-500 font-medium">
            <option>PLATFORM: 20V MAX</option>
          </select>
          <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-slate-500 font-medium">
            <option>CUSTOMER: Home Depot</option>
          </select>
          <select className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-slate-500 font-medium">
            <option>TIMING: FY2026</option>
          </select>
          <button className="bg-slate-900 text-[#FFC20E] px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="px-6 border-b border-slate-200 bg-white shrink-0">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('health')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'health' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            01. Portfolio Health & Quadrants
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'workspace' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            02. Assortment Workspace (Delist & NPI)
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'simulation' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            03. AI Transference & Cannibalization
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'governance' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            04. Scenario Governance & Summary
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* TAB 1: PORTFOLIO HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* SBD Metric Scorecards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total SKUs in Scope</div>
                  <div className="text-2xl font-black text-slate-900">412 <span className="text-sm font-medium text-slate-500">Active SKUs</span></div>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total GSV</div>
                  <div className="text-2xl font-black text-slate-900">$1.4B</div>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Average Margin (MAC %)</div>
                  <div className="text-2xl font-black text-emerald-600">42.4%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded shadow-sm">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Candidates for Rationalization</div>
                  <div className="text-2xl font-black text-[#FFC20E]">38 SKUs</div>
                  <div className="text-xs font-semibold text-rose-400 mt-1">$48.2M GSV at Risk</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Threshold Simulator Panel */}
                <div className="md:col-span-4 bg-white border border-slate-200 rounded p-5 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                      <SlidersHorizontal size={18} className="text-slate-400" />
                      "What-If" Threshold Simulator
                    </h3>
                    <p className="text-xs text-slate-500">Adjust financial hurdles to identify tail SKUs.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-bold text-slate-700">GSV Hurdle Threshold ($)</label>
                        <span className="text-sm font-bold text-slate-900">${(gsvHurdle / 1000000).toFixed(1)}M</span>
                      </div>
                      <input 
                        type="range" 
                        min="500000" 
                        max="5000000" 
                        step="100000" 
                        value={gsvHurdle} 
                        onChange={(e) => setGsvHurdle(Number(e.target.value))}
                        className="w-full accent-slate-900 cursor-pointer" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-bold text-slate-700">Margin (MAC %) Threshold</label>
                        <span className="text-sm font-bold text-slate-900">{marginHurdle}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="15" 
                        max="50" 
                        step="1" 
                        value={marginHurdle} 
                        onChange={(e) => setMarginHurdle(Number(e.target.value))}
                        className="w-full accent-slate-900 cursor-pointer" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded p-4 text-sm">
                      <div className="font-bold text-slate-900 mb-2">Simulated Outcome:</div>
                      <ul className="space-y-2">
                        <li className="flex justify-between"><span className="text-slate-600">SKUs below GSV Hurdle:</span> <span className="font-semibold text-slate-900">84</span></li>
                        <li className="flex justify-between"><span className="text-slate-600">SKUs below Margin Hurdle:</span> <span className="font-semibold text-slate-900">112</span></li>
                        <li className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-800 font-bold">Below Both (Candidates):</span> <span className="font-bold text-rose-600">38</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4-Quadrant Scatter Plot / Grid */}
                <div className="md:col-span-8 bg-white border border-slate-200 rounded shadow-sm flex flex-col">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm">Portfolio Segmentation Matrix</h3>
                  </div>
                  <div className="p-6 flex-1 flex flex-col items-center justify-center relative">
                    
                    {/* Visual 2x2 Grid Background */}
                    <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
                      <div className="bg-blue-300 border-b-2 border-r-2 border-white rounded-tl-lg"></div>
                      <div className="bg-blue-800 border-b-2 border-l-2 border-white rounded-tr-lg"></div>
                      <div className="bg-purple-500 border-t-2 border-r-2 border-white rounded-bl-lg"></div>
                      <div className="bg-pink-400 border-t-2 border-l-2 border-white rounded-br-lg"></div>
                    </div>
                    
                    {/* Axis Labels */}
                    <div className="absolute left-0 inset-y-0 flex items-center justify-center pointer-events-none">
                      <span className="transform -rotate-90 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap -ml-10">Margin (MAC %) ➔</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">GSV ($) ➔</span>
                    </div>

                    <div className="w-full h-80 z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
                          <XAxis type="number" dataKey="gsv" name="GSV" axisLine={false} tickLine={false} tick={false} domain={[0, 60]} />
                          <YAxis type="number" dataKey="margin" name="Margin" axisLine={false} tickLine={false} tick={false} domain={[0, 60]} />
                          <ZAxis type="number" range={[60, 400]} />
                          <Tooltip cursor={{strokeDasharray: '3 3'}} content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white border border-slate-200 shadow-lg rounded p-3 text-sm">
                                  <div className="font-bold text-slate-900">{data.name}</div>
                                  <div className="text-slate-600 mt-1">GSV: ${data.gsv}M</div>
                                  <div className="text-slate-600">Margin: {data.margin}%</div>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Scatter name="SKUs" data={scatterData} fill="#8884d8">
                            {scatterData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Scatter>
                          
                          {/* Quadrant Labels inside chart */}
                          <text x="25%" y="15%" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">Improve Margin</text>
                          <text x="75%" y="15%" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">Strong Core</text>
                          <text x="25%" y="85%" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">Assess for Rationalization</text>
                          <text x="75%" y="85%" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">Increase GSV</text>
                          
                          {/* Center Crosshair */}
                          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
                          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ASSORTMENT WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Hierarchy View Toggle */}
                    <div className="flex bg-slate-200/50 p-1 rounded-md border border-slate-200">
                      <button 
                        onClick={() => setViewMode('bare')}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${viewMode === 'bare' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Bare Tool / Accessory View
                      </button>
                      <button 
                        onClick={() => setViewMode('combo')}
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${viewMode === 'combo' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Combo Kit / Multi-Pack View
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search SKUs..." 
                        className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded text-sm text-slate-700 focus:outline-none focus:border-slate-500 w-64"
                      />
                    </div>
                    
                    <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                      <SlidersHorizontal size={14} /> Columns
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                      <Download size={16} /> Import Unbiased Delist Recommendations
                    </button>
                    <button 
                      onClick={() => setShowNpiModal(true)}
                      className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                    >
                      <Sparkles size={16} /> Introduce Innovation (NPI Ghost SKU)
                    </button>
                  </div>
                </div>

                {/* SBD SKU Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 w-12 text-center">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        </th>
                        <th className="p-4">SKU Number</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">GSV ($)</th>
                        <th className="p-4 text-right">MAC %</th>
                        <th className="p-4">Portfolio Quadrant</th>
                        <th className="p-4">Action Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className={selectedSkus.includes('DW-20V-091') ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={selectedSkus.includes('DW-20V-091')} onChange={() => handleSkuToggle('DW-20V-091')} className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        </td>
                        <td className="p-4 font-bold text-slate-900">DW-20V-091</td>
                        <td className="p-4 font-medium text-slate-700">DeWalt 20V 3/8" Right Angle Drill (Legacy)</td>
                        <td className="p-4 text-right font-medium text-slate-900">$1.2M</td>
                        <td className="p-4 text-right font-medium text-slate-900">24.5%</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                            <AlertTriangle size={12} /> Assess for Rationalization
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                            <button className="px-3 py-1 font-semibold rounded text-slate-500 hover:text-slate-700">Keep</button>
                            <button className="px-3 py-1 font-semibold rounded text-slate-500 hover:text-slate-700">Delist</button>
                            <button className="px-3 py-1 font-semibold rounded bg-white text-slate-900 shadow-sm border border-slate-200">Swap with NPI</button>
                          </div>
                        </td>
                      </tr>
                      
                      {isNpiAdded && (
                        <tr className="bg-emerald-50/50">
                          <td className="p-4 text-center">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                          </td>
                          <td className="p-4 font-bold text-emerald-700 flex items-center gap-1.5"><Sparkles size={14}/> GHOST-NPI-01</td>
                          <td className="p-4 font-medium text-slate-900">DeWalt 20V Atomic Compact Right Angle Drill</td>
                          <td className="p-4 text-right font-medium text-slate-500">$0</td>
                          <td className="p-4 text-right font-medium text-emerald-700">41.0%</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Zap size={12} /> New Innovation
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                              <button className="px-3 py-1 font-semibold rounded bg-white text-slate-900 shadow-sm border border-slate-200">Introduce</button>
                              <button 
                                onClick={() => setIsNpiAdded(false)}
                                className="px-3 py-1 font-semibold rounded text-slate-500 hover:text-slate-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      <tr className={selectedSkus.includes('ST-HT-882') ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={selectedSkus.includes('ST-HT-882')} onChange={() => handleSkuToggle('ST-HT-882')} className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        </td>
                        <td className="p-4 font-bold text-slate-900">ST-HT-882</td>
                        <td className="p-4 font-medium text-slate-700">Stanley 16oz Fiberglass Hammer</td>
                        <td className="p-4 text-right font-medium text-slate-900">$1.1M</td>
                        <td className="p-4 text-right font-medium text-slate-900">28.0%</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                            <AlertTriangle size={12} /> Assess for Rationalization
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                            <button className="px-3 py-1 font-semibold rounded text-slate-500 hover:text-slate-700">Keep</button>
                            <button className="px-3 py-1 font-semibold rounded bg-white text-slate-900 shadow-sm border border-slate-200">Delist</button>
                            <button className="px-3 py-1 font-semibold rounded text-slate-500 hover:text-slate-700">Swap</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Dynamic Action Bar */}
                {selectedSkus.length > 0 && (
                  <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                      <div className="font-medium text-slate-300">
                        <span className="font-bold text-white">1 SKU Delisted | 1 NPI Introduced</span> 
                      </div>
                      <div className="h-6 w-px bg-slate-700"></div>
                      <div className="font-medium text-slate-300">
                        Net Baseline Impact: <span className="font-bold text-amber-400">Pending Simulation</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('simulation')}
                      className="bg-[#FFC20E] text-slate-900 px-6 py-2 rounded font-bold shadow-sm hover:bg-[#eab308] transition-colors flex items-center gap-2"
                    >
                      Run Transference Engine <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSFERENCE SIMULATION */}
          {activeTab === 'simulation' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Dual-Impact Scorecard Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FFC20E]/10 border border-[#FFC20E]/30 rounded p-6 shadow-sm flex items-start gap-4">
                  <div className="bg-[#FFC20E] p-3 rounded-lg text-slate-900 shrink-0 mt-1">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">PORTFOLIO RETENTION RATE: 74.2%</h2>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      <span className="font-bold">AI Predictive Insight:</span> 74.2% of lost unit volume from delisted DeWalt bare tools will successfully transfer to higher-margin 20V Combo Kits. 25.8% walk-away sales loss.
                    </p>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded p-6 shadow-sm flex items-start gap-4">
                  <div className="bg-emerald-500 p-3 rounded-lg text-white shrink-0 mt-1">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">NPI INCREMENTALITY: 42.0%</h2>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      <span className="font-bold">Cannibalization Model:</span> 42.0% of new volume is purely incremental vs base. 58.0% comes from cannibalizing existing similar models within the portfolio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module A: Demand Transference Mapping Table */}
                <div className="border border-slate-200 rounded shadow-sm bg-white overflow-hidden flex flex-col">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1.5"><AlertTriangle size={14} /> Delisted Source SKU</div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        DeWalt 20V MAX 3/8" Right Angle Drill
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <ArrowRight size={16} className="text-emerald-500" />
                      Where the demand shifts (Destination SKUs)
                    </h3>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Destination SKU</th>
                            <th className="p-3">Share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-900">Atomic Compact Drill (NPI)</td>
                            <td className="p-3 font-bold text-emerald-700">74.2%</td>
                          </tr>
                          <tr className="bg-rose-50/30">
                            <td className="p-3 font-medium text-slate-600 italic">Competitor Walk-Away</td>
                            <td className="p-3 font-bold text-rose-600">25.8%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Module B: Cannibalization Mapping */}
                <div className="border border-slate-200 rounded shadow-sm bg-white overflow-hidden flex flex-col">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Zap size={14} /> NPI Target SKU</div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        DeWalt 20V Atomic Compact Right Angle Drill
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">$2.5M</div>
                      <div className="text-xs text-slate-500">Projected Year 1 GSV</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <ArrowRight size={16} className="text-amber-500 rotate-180" />
                      Where NPI volume comes from (Cannibalization)
                    </h3>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Source Volume</th>
                            <th className="p-3">Share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-900">Cannibalized from Legacy Drill (Swap Target)</td>
                            <td className="p-3 font-bold text-amber-600">58.0%</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-900">Cannibalized from 12V Max Drill</td>
                            <td className="p-3 font-bold text-amber-600">12.0%</td>
                          </tr>
                          <tr className="bg-emerald-50/30">
                            <td className="p-3 font-medium text-slate-900">Pure Incremental Growth</td>
                            <td className="p-3 font-bold text-emerald-600">30.0%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Rationale & Governance Inputs */}
              <div className="p-6 bg-white border border-slate-200 rounded shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Decision Governance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Action Decision</label>
                      <select className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500">
                        <option>Rationalize (Delist)</option>
                        <option>Keep</option>
                        <option>Fix / Reprice</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reason Code</label>
                      <select className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500">
                        <option>Platform Consolidation to 20V</option>
                        <option>Cost Dilution</option>
                        <option>Hold Space for Innovation</option>
                        <option>Low Market Velocity</option>
                        <option>Supply Chain Complexity</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Strategic Notes / Execution Remarks</label>
                      <textarea 
                        rows={2}
                        className="w-full bg-white border border-slate-300 rounded p-3 text-sm text-slate-900 focus:outline-none focus:border-slate-500"
                        placeholder="e.g., Approved by Category Manager for Q1 reset at Home Depot..."
                      >Approved by Category Manager for Q1 reset at Home Depot. Align with supply chain on phase-out dates.</textarea>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => setActiveTab('governance')}
                      className="bg-slate-900 text-white px-6 py-2 rounded font-bold shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      Check Scenario Summary <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
            </div>
          )}

          {/* TAB 4: SCENARIO GOVERNANCE */}
          {activeTab === 'governance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Main Content Area (2/3 width) */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Financial Impact Waterfall Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-5 flex flex-col">
                    <h3 className="font-bold text-slate-900 text-base mb-4">Financial Impact Bridge (GSV & Margin)</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                           <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `$${val}M`} axisLine={false} tickLine={false} />
                           <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: any) => [`$${value}M`, 'Value']} />
                           <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                             {waterfallData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.fill} />
                             ))}
                           </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-800">Net Margin Impact: +180 bps Margin Expansion</span>
                    </div>
                  </div>

                  {/* Central Scenario Database Table */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">Scenario Database & Approvals</h3>
                      <button className="text-sm font-bold text-blue-600 hover:text-blue-700">+ New Scenario</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Scenario ID</th>
                            <th className="p-4">Scenario Name</th>
                            <th className="p-4">Retailer</th>
                            <th className="p-4">SKUs Delisted</th>
                            <th className="p-4">NPIs Added</th>
                            <th className="p-4">Net Incremental Margin</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-500">SCN-8842</td>
                            <td className="p-4 font-bold text-slate-900">FY26 Q1 DeWalt Drill Consolidation</td>
                            <td className="p-4 text-slate-700">Home Depot</td>
                            <td className="p-4 text-slate-700">2 SKUs</td>
                            <td className="p-4 text-slate-700">1 NPI</td>
                            <td className="p-4 font-medium text-emerald-600">+180 bps</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                                Assigned for Review
                              </span>
                            </td>
                            <td className="p-4 text-right font-medium space-x-3">
                              <button className="text-slate-500 hover:text-slate-700">View</button>
                              <button className="text-blue-600 hover:text-blue-700">Approve</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-500">SCN-8841</td>
                            <td className="p-4 font-bold text-slate-900">Craftsman Hand Tool Rationalization</td>
                            <td className="p-4 text-slate-700">Lowe's</td>
                            <td className="p-4 text-slate-700">14 SKUs</td>
                            <td className="p-4 text-slate-700">0 NPIs</td>
                            <td className="p-4 font-medium text-emerald-600">+85 bps</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                                Published
                              </span>
                            </td>
                            <td className="p-4 text-right font-medium space-x-3">
                              <button className="text-slate-500 hover:text-slate-700">View</button>
                              <button className="text-emerald-600 hover:text-emerald-700">Sign-Off</button>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-500">SCN-8839</td>
                            <td className="p-4 font-bold text-slate-900">Stanley Measure Tapes Q4</td>
                            <td className="p-4 text-slate-700">Amazon</td>
                            <td className="p-4 text-slate-700">4 SKUs</td>
                            <td className="p-4 text-slate-700">2 NPIs</td>
                            <td className="p-4 font-medium text-emerald-600">+110 bps</td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                                <CheckCircle2 size={12} /> Approved
                              </span>
                            </td>
                            <td className="p-4 text-right font-medium space-x-3">
                              <button className="text-slate-500 hover:text-slate-700">View</button>
                              <button className="text-slate-500 hover:text-slate-700 line-through">Push to SAP</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* SBD Collaboration Panel (Right Column) */}
                <div className="md:col-span-1">
                  <div className="bg-white border border-slate-200 rounded shadow-sm flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                      <MessageSquare size={16} className="text-slate-500" />
                      <h3 className="font-bold text-slate-900 text-sm">Cross-Functional Sign-Off</h3>
                    </div>
                    <div className="p-4 flex-1 space-y-4 overflow-y-auto bg-slate-50/50">
                      
                      {/* Comment 1 */}
                      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm relative">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-xs text-slate-900">Finance Team</div>
                          <div className="text-[10px] text-slate-400">2 hrs ago</div>
                        </div>
                        <p className="text-sm text-slate-700">Approved Net Margin expansion of 180 bps. Looks good for Q1 execution.</p>
                      </div>

                      {/* Comment 2 */}
                      <div className="bg-rose-50 p-3 border border-rose-100 rounded-lg shadow-sm relative">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-xs text-rose-800">Supply Chain</div>
                          <div className="text-[10px] text-slate-400">1 hr ago</div>
                        </div>
                        <p className="text-sm text-rose-700 font-medium"><AlertTriangle size={14} className="inline mr-1" />Warning: Ensure factory phase-out date for DW-20V-091 is set to Nov 30 to avoid excess component inventory.</p>
                      </div>

                    </div>
                    <div className="p-4 border-t border-slate-200 bg-white">
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700 focus:outline-none focus:border-slate-400 mb-2" 
                        placeholder="Add a comment or approval note..."
                        rows={2}
                      ></textarea>
                      <button className="w-full bg-slate-900 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
      {/* Modals */}
      <NpiModal 
        isOpen={showNpiModal} 
        onClose={() => setShowNpiModal(false)} 
        onAdd={() => setIsNpiAdded(true)} 
      />
    </div>
  );
}
