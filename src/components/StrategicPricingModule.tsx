import React, { useState } from 'react';
import { 
  Upload, Download, Save, RefreshCw, BarChart3, TrendingUp, AlertCircle, Sparkles, Filter, ChevronRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ComposedChart, Line
} from 'recharts';

import MultiSelect from './MultiSelect';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';

type TabType = 'simulator' | 'optimizer';

export const productOptions = [
  { id: '1', label: 'DeWalt 20V MAX Cordless Drill Kit', subtitle: 'SKU: DCD771C2', price: 159.00, vol: '124.5K' },
  { id: '2', label: 'Stanley FatMax 25ft Tape Measure 2-Pack', subtitle: 'SKU: FMHT33338', price: 24.99, vol: '85.2K' },
  { id: '3', label: 'Craftsman 135-Pc Mechanics Tool Set', subtitle: 'SKU: CMMT99206', price: 99.00, vol: '42.0K' },
  { id: '4', label: 'BLACK+DECKER Mouse Detail Sander', subtitle: 'SKU: BDEMS600', price: 34.00, vol: '56.1K' },
  { id: '5', label: 'DeWalt 20V MAX Circular Saw', subtitle: 'SKU: DCS391B', price: 129.00, vol: '90.3K' },
  { id: '6', label: 'PORTER-CABLE Compact Router', subtitle: 'SKU: PCE6430', price: 119.99, vol: '31.4K' }
];

const mockSkus = [
  { id: '1', sku: 'DCD771C2', desc: 'DeWalt 20V MAX Cordless Drill Kit', listPrice: 159.00, proposedIncrease: 10, newPrice: 174.90, cogsInc: 5, status: 'Base' },
  { id: '2', sku: 'FMHT33338', desc: 'Stanley FatMax 25ft Tape Measure', listPrice: 24.99, proposedIncrease: 0, newPrice: 24.99, cogsInc: 0, status: 'Base' },
  { id: '3', sku: 'CMMT99206', desc: 'Craftsman 135-Pc Mechanics Tool Set', listPrice: 99.00, proposedIncrease: 15, newPrice: 113.85, cogsInc: 8, status: 'Base' },
  { id: '4', sku: 'BDEMS600', desc: 'BLACK+DECKER Mouse Detail Sander', listPrice: 34.00, proposedIncrease: 5, newPrice: 35.70, cogsInc: 2, status: 'Base' },
  { id: '5', sku: 'DCS391B', desc: 'DeWalt 20V MAX Circular Saw', listPrice: 129.00, proposedIncrease: 8, newPrice: 139.32, cogsInc: 3, status: 'Base' },
  { id: '6', sku: 'PCE6430', desc: 'PORTER-CABLE Compact Router', listPrice: 119.99, proposedIncrease: 0, newPrice: 119.99, cogsInc: 0, status: 'Base' }
];

export default function StrategicPricingModule() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [selectedSkus, setSelectedSkus] = useState<string[]>(['1', '2', '3']);
  const [skus, setSkus] = useState(mockSkus);
  const [isSimulated, setIsSimulated] = useState(false);
  const [scenarioName, setScenarioName] = useState('FY26 Price Realization (Home Depot)');

  // Local filter state for this module
  const [filterState, setFilterState] = useState<FilterState>({
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

  const handlePriceChange = (id: string, increaseStr: string) => {
    const increase = parseFloat(increaseStr) || 0;
    setSkus(skus.map(s => {
      if (s.id === id) {
        return {
          ...s,
          proposedIncrease: increase,
          newPrice: s.listPrice * (1 + increase / 100),
          status: 'Modified'
        };
      }
      return s;
    }));
    setIsSimulated(false);
  };

  const simulate = () => {
    // Reset output block
    setIsSimulated(false);
    setTimeout(() => {
      setSkus(skus.map(s => ({ ...s, status: s.proposedIncrease > 0 ? 'Modified' : 'Base' })));
      setIsSimulated(true);
      setCurrentPhase(3);
    }, 800);
  };

  const waterfallData = [
    { name: 'Base GSV', value: 420 },
    { name: 'Price Impact', value: 25 },
    { name: 'Volume Impact', value: -12 },
    { name: 'Mix Impact', value: -3 },
    { name: 'Simulated GSV', value: 430 }
  ];

  
  const renderPhaseIndicators = () => (
    <div className="bg-white border border-slate-200 rounded-sm p-3 mb-4">
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => setCurrentPhase(1)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 1 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 1 ? 'bg-[#FFC20E] text-slate-900' : 'bg-emerald-600 text-white'}`}>
            {currentPhase > 1 ? '✓' : '1'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 1 ? 'text-slate-400' : 'text-emerald-700'}`}>Step 1</div>
            <div className="text-sm font-bold tracking-tight">Scenario Setup</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 1 ? 'text-[#FFC20E]' : 'text-emerald-600'} />
        </button>
        <button onClick={() => setCurrentPhase(2)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 2 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 2 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            {currentPhase > 2 ? '✓' : '2'}
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 2 ? 'text-slate-400' : currentPhase > 2 ? 'text-emerald-700' : 'text-slate-500'}`}>Step 2</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Set Price Increase' : 'Optimization Parameters'}</div>
          </div>
          <ChevronRight size={16} className={currentPhase === 2 ? 'text-[#FFC20E]' : currentPhase > 2 ? 'text-emerald-600' : 'text-slate-400'} />
        </button>
        <button onClick={() => setCurrentPhase(3)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 3 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 3 ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-300 text-slate-700'}`}>
            3
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 3 ? 'text-slate-400' : 'text-slate-500'}`}>Step 3</div>
            <div className="text-sm font-bold tracking-tight">{activeTab === 'simulator' ? 'Financial Outputs' : 'Optimized Output'}</div>
          </div>
          <Sparkles size={16} className={currentPhase === 3 ? 'text-[#FFC20E]' : 'text-slate-400'} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans">
      <div className="bg-white flex flex-col shrink-0">
        <div className="px-6 pt-5 pb-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('simulator'); setCurrentPhase(1); setIsSimulated(false); }}
              className={`px-5 py-2.5 text-sm font-bold rounded flex items-center justify-center transition-colors ${
                activeTab === 'simulator' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Simulator
            </button>
            <button 
              onClick={() => { setActiveTab('optimizer'); setCurrentPhase(1); setIsSimulated(false); }}
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
              {activeTab === 'simulator' ? 'Strategic Pricing Simulator' : 'Strategic Pricing Optimizer'}
            </h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border uppercase tracking-wide ${
              activeTab === 'simulator' 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}>
              {activeTab === 'simulator' ? 'Interactive Module' : 'Algorithmic Engine'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Scenario:</span>
            <input 
              type="text" 
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="text-sm font-bold text-slate-900 border-b border-dashed border-slate-300 focus:outline-none focus:border-slate-500 bg-transparent px-1 min-w-[300px]"
            />
          </div>
        </div>

        <div className="px-6 pb-4">
          <GlobalFilterBar 
            filters={filterState} 
            onFilterChange={setFilterState} 
            onApply={() => console.log('Filters Applied', filterState)} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {renderPhaseIndicators()}


        {currentPhase === 1 && (
          <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col p-6 animate-in fade-in duration-300">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4 mb-4">
              <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">1</span>
              Scenario Setup
            </h3>
            
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scenario Name</label>
                  <input 
                    type="text" 
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="w-full font-bold text-slate-900 border border-slate-300 rounded p-2 focus:outline-none focus:border-slate-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Retailer Channel</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-500">
                    <option>Home Depot</option>
                    <option>Lowe's</option>
                    <option>Amazon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Participating Product Lines</label>
                <p className="text-xs text-slate-500 -mt-1 mb-3">Select SKUs to include in this pricing scenario. Only selected items will be available in the next step.</p>
                <div className="max-w-xl">
                  <MultiSelect 
                    options={productOptions}
                    selectedIds={selectedSkus}
                    onChange={setSelectedSkus}
                    placeholder="Select participating SKUs..."
                  />
                </div>
                {selectedSkus.length > 0 && (
                  <div className="mt-4 border border-slate-200 rounded overflow-hidden max-w-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3 text-right">Base Price</th>
                          <th className="p-3 text-right">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedSkus.map(id => {
                          const opt = productOptions.find(o => o.id === id);
                          if (!opt) return null;
                          return (
                            <tr key={id}>
                              <td className="p-3">
                                <div className="font-semibold text-slate-900">{opt.label}</div>
                                <div className="text-[10px] text-slate-500">{opt.subtitle}</div>
                              </td>
                              <td className="p-3 text-right font-medium text-slate-700">${opt.price?.toFixed(2)}</td>
                              <td className="p-3 text-right font-medium text-slate-700">{opt.vol}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                <Save size={16} /> Save Scenario
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                 Compare Scenarios
              </button>
              <button 
                onClick={() => setCurrentPhase(2)}
                className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                disabled={selectedSkus.length === 0}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {currentPhase === 2 && (<>
            {/* Input Table */}
            <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">1</span>
                  Set Price Increase
                </h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">
                    <Download size={14} /> Download Template
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">
                    <Upload size={14} /> Upload File
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">SKU Number</th>
                      <th className="p-4">Product Description</th>
                      <th className="p-4 text-right">Base List Price</th>
                      
                      <th className="p-4 text-center">Proposed Inc %</th>
                      <th className="p-4 text-right">New List Price</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {skus.filter(sku => selectedSkus.includes(sku.id)).map(sku => (
                      <tr key={sku.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900">{sku.sku}</td>
                        <td className="p-4 font-medium text-slate-700">{sku.desc}</td>
                        <td className="p-4 text-right font-medium text-slate-500">${sku.listPrice.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className="text-slate-600 font-medium">{sku.cogsInc}%</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            <input 
                              type="number" 
                              value={sku.proposedIncrease}
                              onChange={(e) => handlePriceChange(sku.id, e.target.value)}
                              className="w-20 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded p-1 focus:outline-none focus:border-slate-500"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900">${sku.newPrice.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          {sku.status === 'Modified' ? (
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" title="Modified"></span>
                          ) : (
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" title="Base"></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Simulate Scenario
                </button>
              </div>
            </div>
            </>)}
            {/* Output Deep Dive (Visible after simulation) */}
            {currentPhase === 3 && isSimulated && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Simulated GSV</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">$430.0M</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +2.4%</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trade Margin (MAC)</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">41.5%</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +120 bps</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sales Volume (Units)</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">1.28M</span>
                      <span className="text-sm font-bold text-rose-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1 rotate-180"/> -1.2%</span>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Waterfall Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Price/Volume/Mix GSV Impact</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }} tickFormatter={(val) => `$${val}M`} />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                          />
                          <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={60}>
                            {waterfallData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : entry.name.includes('Simulated') ? '#0f172a' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Customer Profit Pool Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Customer Level KPI Comparison</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={[
                          { name: 'Home Depot', base: 45, sim: 48 },
                          { name: 'Lowe\'s', base: 32, sim: 33.5 },
                          { name: 'Amazon', base: 28, sim: 27 },
                          { name: 'Ace Hrdwr', base: 15, sim: 16 },
                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }} />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                          <Bar dataKey="base" name="Base Net Spread" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={40} />
                          <Bar dataKey="sim" name="Simulated Net Spread" fill="#0ea5e9" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                    <Save size={16} /> Save Scenario
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
                    Publish Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'optimizer' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {currentPhase === 2 && (<>
            {/* Optimizer Configuration */}
            <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col p-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4 mb-4">
                <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">1</span>
                Optimization Parameters
              </h3>
              
              <div className="mb-6 max-w-sm">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Objective Function</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-500">
                  <option>Maximize MAC (Margin)</option>
                  <option>Maximize GSV (Revenue)</option>
                  <option>Maintain Retailer Margin</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">SKU Number</th>
                      <th className="p-4">Product Description</th>
                      <th className="p-4 text-right">Base List Price</th>
                      <th className="p-4 text-center">Max Price Increase %</th>
                      <th className="p-4 text-center">Max Volume Drop %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {skus.filter(sku => selectedSkus.includes(sku.id)).map(sku => (
                      <tr key={'opt-'+sku.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900">{sku.sku}</td>
                        <td className="p-4 font-medium text-slate-700">{sku.desc}</td>
                        <td className="p-4 text-right font-medium text-slate-500">${sku.listPrice.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <input 
                              type="number" 
                              defaultValue={15} 
                              className="w-20 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded p-1 focus:outline-none focus:border-slate-500"
                            /> <span className="text-slate-500 font-bold">%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1">
                            <input 
                              type="number" 
                              defaultValue={10} 
                              className="w-20 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded p-1 focus:outline-none focus:border-slate-500"
                            /> <span className="text-slate-500 font-bold">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Run Optimizer Engine
                </button>
              </div>
            </div>
            </>)}
            {/* Empty State Table / Simulated State */}
            {currentPhase === 3 && (
              !isSimulated ? (
              <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col p-8 text-center">
                <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Optimize</h3>
                <p className="text-sm font-medium text-slate-500 max-w-md mx-auto mb-6">
                  Configure your objective and targets above, then run the optimizer to generate the optimal SKU-level price increases across the portfolio.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-emerald-800 font-bold flex items-center gap-2">
                  <Sparkles size={18} />
                  Optimizer successfully generated target price increases to maximize MAC within constraints.
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Optimized GSV</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">$455.2M</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +4.8%</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trade Margin (MAC)</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">42.8%</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1"/> +210 bps</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded shadow-sm flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sales Volume (Units)</span>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-3xl font-black text-slate-900">1.25M</span>
                      <span className="text-sm font-bold text-rose-600 flex items-center mb-1"><TrendingUp size={14} className="mr-1 rotate-180"/> -1.8%</span>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Waterfall Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Price/Volume/Mix GSV Impact</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }} tickFormatter={(val) => `$${val}M`} />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                          />
                          <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={60}>
                            {waterfallData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : entry.name.includes('Simulated') ? '#0f172a' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Customer Profit Pool Chart */}
                  <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Customer Level KPI Comparison</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={[
                          { name: 'Home Depot', base: 45, sim: 51 },
                          { name: 'Lowe\'s', base: 32, sim: 36 },
                          { name: 'Amazon', base: 28, sim: 29 },
                          { name: 'Ace Hrdwr', base: 15, sim: 17 },
                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: '#64748B' }} />
                          <Tooltip 
                            cursor={{ fill: '#F8F9FA' }}
                            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                          <Bar dataKey="base" name="Base Net Spread" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={40} />
                          <Bar dataKey="sim" name="Optimized Net Spread" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                {/* Output table for Optimizer */}
                <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-4">SKU Number</th>
                          <th className="p-4">Product Description</th>
                          <th className="p-4 text-right">Base List Price</th>
                          
                          <th className="p-4 text-center">Optimized Inc %</th>
                          <th className="p-4 text-right">New List Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {skus.filter(sku => selectedSkus.includes(sku.id)).map(sku => {
                          const optimizedInc = sku.proposedIncrease > 0 ? sku.proposedIncrease : Math.floor(Math.random() * 8) + 2;
                          const newOptPrice = sku.listPrice * (1 + optimizedInc / 100);
                          return (
                          <tr key={sku.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold text-slate-900">{sku.sku}</td>
                            <td className="p-4 font-medium text-slate-700">{sku.desc}</td>
                            <td className="p-4 text-right font-medium text-slate-500">${sku.listPrice.toFixed(2)}</td>

                            <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/30">
                              {optimizedInc}%
                            </td>
                            <td className="p-4 text-right font-bold text-slate-900">${newOptPrice.toFixed(2)}</td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                    <Save size={16} /> Save Scenario
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
                    Publish Changes
                  </button>
                </div>
              </div>
            )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
