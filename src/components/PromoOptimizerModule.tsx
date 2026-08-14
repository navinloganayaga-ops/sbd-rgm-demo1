import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  RefreshCw, 
  AlertCircle,
  AlertTriangle,
  Zap,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Share
} from 'lucide-react';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';

interface PromoOptimizerModuleProps {
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  onFilterApply: () => void;
}

export default function PromoOptimizerModule({ filterState, onFilterChange, onFilterApply }: PromoOptimizerModuleProps) {
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);

  // Phase 1 State
  const [targetRetailer, setTargetRetailer] = useState('Home Depot');
  const [targetProductFamily, setTargetProductFamily] = useState('DeWalt 20V MAX Ecosystem');
  const [planningHorizon, setPlanningHorizon] = useState('Q3 & Q4 - 26 Weeks');
  const [elasticityModel, setElasticityModel] = useState('Integrated Price-Promo Demand Response Model v3.1');

  // Phase 2 State - Constraints
  const [primaryObjective, setPrimaryObjective] = useState('defend');
  const [primaryWeight, setPrimaryWeight] = useState(80);
  const [secondaryObjective, setSecondaryObjective] = useState('margin');
  const [secondaryWeight, setSecondaryWeight] = useState(20);
  const [constraintTab, setConstraintTab] = useState<'mandatory' | 'optional' | 'guidebook'>('mandatory');
  const [totalBudget, setTotalBudget] = useState(280000); 
  const [minRoi, setMinRoi] = useState('2.8');
  const [maxRetailerMargin, setMaxRetailerMargin] = useState('28');
  const [targetVolumeGrowth, setTargetVolumeGrowth] = useState(5);
  const [maxDiscountDepth, setMaxDiscountDepth] = useState(25);
  const [maxPromoWeeksQuarter, setMaxPromoWeeksQuarter] = useState(4);
  const [minCooldownGap, setMinCooldownGap] = useState(3);
  const [competitorGap, setCompetitorGap] = useState(10);
  const [preemptiveCounter, setPreemptiveCounter] = useState(true);

  // Phase 3 State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);
  const [sensitivity, setSensitivity] = useState(0);

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setCurrentPhase(3);
    setTimeout(() => {
      setIsOptimizing(false);
      setHasOptimized(true);
    }, 1500);
  };

  // Sample Optimized Schedule Data
  const calendarSchedule = [
    { week: 'W39', tactic: 'No Promo', discount: '0%', action: '' },
    { week: 'W40', tactic: 'No Promo', discount: '0%', action: '' },
    { week: 'W41', tactic: 'TPR Deal', discount: '15%', action: '' },
    { week: 'W42', tactic: 'No Promo', discount: '0%', action: '' },
    { week: 'W43', tactic: 'No Promo', discount: '0%', action: '' },
    { week: 'W44', tactic: 'Circular Ad', discount: '15%', action: 'Defensive Strike' },
    { week: 'W45', tactic: 'No Promo', discount: '0%', action: 'Milwaukee TPR (Simulated)' },
    { week: 'W46', tactic: 'No Promo', discount: '0%', action: '' },
    { week: 'W47', tactic: 'Feature & Display', discount: '25%', action: '' },
    { week: 'W48', tactic: 'Feature & Display', discount: '25%', action: '' },
    { week: 'W49', tactic: 'No Promo', discount: '0%', action: '' },
    { week: 'W50', tactic: 'No Promo', discount: '0%', action: '' }
  ];

  const renderPhaseIndicators = () => (
    <div className="bg-white border border-slate-200 rounded-sm p-3 mb-4">
      <div className="grid grid-cols-3 gap-2">
        
        <button onClick={() => setCurrentPhase(1)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 1 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 1 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            {currentPhase > 1 ? '✓' : '1'}
          </div>
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 1 ? 'text-slate-400' : 'text-emerald-700'}`}>Phase 1</div>
            <div className="text-sm font-bold tracking-tight">Target & Scope</div>
          </div>
        </button>

        <button onClick={() => setCurrentPhase(2)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 2 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : currentPhase > 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 2 ? 'bg-[#FFC20E] text-slate-900' : currentPhase > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            {currentPhase > 2 ? '✓' : '2'}
          </div>
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 2 ? 'text-slate-400' : currentPhase > 2 ? 'text-emerald-700' : 'text-slate-500'}`}>Phase 2</div>
            <div className="text-sm font-bold tracking-tight">Constraint Engine</div>
          </div>
        </button>

        <button onClick={() => setCurrentPhase(3)} className={`p-2.5 rounded-sm border text-left flex items-center gap-3 transition-colors ${currentPhase === 3 ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-100'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentPhase === 3 ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-300 text-slate-700'}`}>
            3
          </div>
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${currentPhase === 3 ? 'text-slate-400' : 'text-slate-500'}`}>Phase 3</div>
            <div className="text-sm font-bold tracking-tight">Optimized Output</div>
          </div>
        </button>

      </div>
    </div>
  );

  // Waterfall Chart Data for Phase 3 Output
  const waterfallData = [
    { name: 'Baseline Rev', value: 24.2, fill: '#94a3b8' },
    { name: '+ Promo Uplift', value: 3.5, fill: '#059669' },
    { name: '- Comp Transference', value: -0.3, fill: '#d97706' },
    { name: '- Trade Spend', value: -2.4, fill: '#e11d48' },
    { name: '= Final NSV', value: 25.0, fill: '#0f172a' }
  ];

  return (
    <div className="space-y-4 font-sans">
      
      {/* HEADER */}
      <div>
        <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
          Channel Owner Home / Prescriptive RGM
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Promo Optimizer
          </h1>
          <span className="bg-slate-200 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-sm border border-slate-300">
            Algorithmic Engine
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
          Linear programming & elasticity optimization solver that generates profit-maximizing promotional schedules subject to budget, gap, and depth constraints.
        </p>
      </div>

      <GlobalFilterBar 
        filters={filterState} 
        onFilterChange={onFilterChange} 
        onApply={onFilterApply} 
      />

      {renderPhaseIndicators()}

      {/* PHASE 1: TARGET & SCOPE SETUP */}
      {currentPhase === 1 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Target & Scope Setup</h2>
            <p className="text-sm text-slate-500">Define the optimization boundaries before configuring financial constraints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Retailer Scope</label>
              <select
                value={targetRetailer}
                onChange={(e) => setTargetRetailer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="Home Depot">Home Depot</option>
                <option value="Lowe's">Lowe's</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Brand Family Scope</label>
              <select
                value={targetProductFamily}
                onChange={(e) => setTargetProductFamily(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="DeWalt 20V MAX Ecosystem">DeWalt 20V MAX Ecosystem</option>
                <option value="Stanley Hand Tools & Tapes">Stanley Hand Tools & Tapes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Time Horizon</label>
              <select
                value={planningHorizon}
                onChange={(e) => setPlanningHorizon(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="Q3 & Q4 - 26 Weeks">Q3 & Q4 - 26 Weeks</option>
                <option value="Q4 - 12 Weeks">Q4 - 12 Weeks</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Historical Elasticity Model</label>
              <select
                value={elasticityModel}
                onChange={(e) => setElasticityModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="Integrated Price-Promo Demand Response Model v3.1">Integrated Price-Promo Demand Response Model v3.1</option>
                <option value="Baseline Seasonal Demand Model">Baseline Seasonal Demand Model</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => setCurrentPhase(2)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Continue to Constraints</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: CONSTRAINT ENGINE */}
      {currentPhase === 2 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Multi-Tier Constraint Engine</h2>
            <p className="text-sm text-slate-500">Configure objective functions, financial guardrails, and execution rules.</p>
          </div>

          <div className="space-y-6">
            
            {/* 1. Weighted Objective Functions */}
            <div className="border border-slate-200 rounded p-5 bg-slate-50 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-base">Weighted Objective Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Primary Objective Function</label>
                    <select value={primaryObjective} onChange={(e) => setPrimaryObjective(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800">
                      <option value="margin">Maximize Gross Margin ($)</option>
                      <option value="volume">Maximize Total Category Share (%)</option>
                      <option value="defend">Defend Market Share (Minimize Bleed)</option>
                      <option value="roi">Maximize Trade Spend ROI (x)</option>
                    </select>
                  </div>
                  <div className="w-24 space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Weight (%)</label>
                    <input type="number" min="0" max="100" value={primaryWeight} onChange={(e) => setPrimaryWeight(Number(e.target.value))} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800" />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Secondary Objective Function</label>
                    <select value={secondaryObjective} onChange={(e) => setSecondaryObjective(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800">
                      <option value="margin">Maximize Gross Margin ($)</option>
                      <option value="volume">Maximize Total Category Share (%)</option>
                      <option value="defend">Defend Market Share (Minimize Bleed)</option>
                      <option value="roi">Maximize Trade Spend ROI (x)</option>
                    </select>
                  </div>
                  <div className="w-24 space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Weight (%)</label>
                    <input type="number" min="0" max="100" value={secondaryWeight} onChange={(e) => setSecondaryWeight(Number(e.target.value))} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Constraints Tabs */}
            <div className="border border-slate-200 rounded overflow-hidden">
               <div className="flex bg-slate-100 border-b border-slate-200">
                 <button onClick={() => setConstraintTab('mandatory')} className={`flex-1 py-3 px-4 text-sm font-bold text-center border-b-2 transition-colors ${constraintTab === 'mandatory' ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Mandatory Constraints (Hard)</button>
                 <button onClick={() => setConstraintTab('optional')} className={`flex-1 py-3 px-4 text-sm font-bold text-center border-b-2 transition-colors ${constraintTab === 'optional' ? 'border-slate-900 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Optional Constraints (Soft)</button>
                 <button onClick={() => setConstraintTab('guidebook')} className={`flex-1 py-3 px-4 text-sm font-bold text-center border-b-2 transition-colors ${constraintTab === 'guidebook' ? 'border-[#FFC20E] text-[#FFC20E] bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Pricing Guidebook (Ref)</button>
               </div>

               <div className="p-6 bg-white">
                 {constraintTab === 'mandatory' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                       <div className="space-y-6">
                         <div>
                           <div className="flex justify-between mb-1.5">
                             <label className="text-slate-900 font-bold">Max Trade Budget Cap</label>
                             <span className="font-bold text-slate-900">${(totalBudget / 1000).toFixed(0)}K</span>
                           </div>
                           <input type="range" min="100000" max="1000000" step="50000" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} className="w-full accent-slate-900 cursor-pointer" />
                         </div>
                         <div>
                           <div className="flex justify-between mb-1.5">
                             <label className="text-slate-900 font-bold">Max Competitor Price Gap (%)</label>
                             <span className="font-bold text-slate-900">{competitorGap}%</span>
                           </div>
                           <input type="range" min="0" max="25" step="1" value={competitorGap} onChange={(e) => setCompetitorGap(Number(e.target.value))} className="w-full accent-slate-900 cursor-pointer" />
                           <p className="text-[10px] text-slate-500 mt-1">MSRP must not exceed competitor by more than {competitorGap}%. If competitor runs TPR, solver will force price drop to match this gap.</p>
                         </div>
                       </div>
                       <div className="space-y-6">
                         <div>
                           <label className="text-slate-900 font-bold block mb-1.5">Max Discount Depth Cap (%)</label>
                           <select value={maxDiscountDepth} onChange={(e) => setMaxDiscountDepth(Number(e.target.value))} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-800 focus:outline-none">
                             <option value={20}>20% Limit</option>
                             <option value={25}>25% Limit</option>
                             <option value={30}>30% Limit</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-slate-900 font-bold block mb-1.5">Max Promo Weeks per Qtr & Cooldown</label>
                           <div className="flex gap-2">
                             <select value={maxPromoWeeksQuarter} onChange={(e) => setMaxPromoWeeksQuarter(Number(e.target.value))} className="w-1/2 bg-white border border-slate-300 rounded p-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-800 focus:outline-none">
                               <option value={3}>3 Wks Max</option>
                               <option value={4}>4 Wks Max</option>
                             </select>
                             <select value={minCooldownGap} onChange={(e) => setMinCooldownGap(Number(e.target.value))} className="w-1/2 bg-white border border-slate-300 rounded p-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-800 focus:outline-none">
                               <option value={2}>2 Wk Gap</option>
                               <option value={3}>3 Wk Gap</option>
                             </select>
                           </div>
                         </div>
                       </div>
                    </div>
                 )}

                 {constraintTab === 'optional' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                       <div className="space-y-6">
                         <div>
                           <label className="text-slate-900 font-bold block mb-1.5">Preferred Retailer Margin Target (%)</label>
                           <input type="number" step="0.1" value={maxRetailerMargin} onChange={(e) => setMaxRetailerMargin(e.target.value)} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-800 focus:outline-none" />
                           <p className="text-[10px] text-slate-500 mt-1">Solver will try to maintain this blended margin for Home Depot across the quarter.</p>
                         </div>
                         <div>
                           <label className="text-slate-900 font-bold block mb-1.5">Target Volume Growth (%)</label>
                           <input type="number" step="0.1" value={targetVolumeGrowth} onChange={(e) => setTargetVolumeGrowth(Number(e.target.value))} className="w-full bg-white border border-slate-300 rounded p-2.5 text-slate-900 font-medium focus:ring-1 focus:ring-slate-800 focus:outline-none" />
                           <p className="text-[10px] text-slate-500 mt-1">Attempt to grow total unit volume by this percentage over the baseline.</p>
                         </div>
                       </div>
                       <div className="space-y-6">
                         <div>
                           <label className="flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors bg-slate-50 border-slate-200 hover:bg-slate-100">
                             <input type="checkbox" checked={preemptiveCounter} onChange={(e) => setPreemptiveCounter(e.target.checked)} className="w-4 h-4 mt-0.5 accent-slate-900" />
                             <div>
                               <span className="font-semibold text-slate-900 block">Preemptive Counter-Strike Rule (Soft)</span>
                               <span className="text-xs text-slate-500 mt-1 block">Prefer scheduling defensive promos 1-2 weeks prior to projected competitor promo windows, even if slightly sub-optimal for raw ROI.</span>
                             </div>
                           </label>
                         </div>
                       </div>
                    </div>
                 )}

                 {constraintTab === 'guidebook' && (
                    <div>
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3">SKU / Product Family</th>
                            <th className="p-3">Base EDLP</th>
                            <th className="p-3">Hi-Lo EDV 1 (Guardrail)</th>
                            <th className="p-3 text-right">Taxonomy Reco Floor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">DeWalt 20V MAX Drill Kit</td>
                            <td className="p-3 text-slate-700 font-medium">$159.00</td>
                            <td className="p-3 text-amber-600 font-medium">$139.00 (-12%)</td>
                            <td className="p-3 text-right text-rose-600 font-bold">$129.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">DeWalt 20V Circular Saw</td>
                            <td className="p-3 text-slate-700 font-medium">$199.00</td>
                            <td className="p-3 text-amber-600 font-medium">$179.00 (-10%)</td>
                            <td className="p-3 text-right text-rose-600 font-bold">$169.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">Stanley FatMax 25ft Tape</td>
                            <td className="p-3 text-slate-700 font-medium">$24.99</td>
                            <td className="p-3 text-amber-600 font-medium">$19.99 (-20%)</td>
                            <td className="p-3 text-right text-rose-600 font-bold">$17.99</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                 )}
               </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setCurrentPhase(1)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded flex items-center gap-2 border border-slate-300 transition-colors"
            >
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>

            <button
              onClick={handleRunOptimizer}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-8 py-2.5 rounded flex items-center gap-2 transition-colors shadow-sm"
            >
              <Zap size={18} />
              <span>Run Algorithmic Optimizer</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: OPTIMIZATION OUTPUTS & TRADE-OFF ANALYSIS */}
      {currentPhase === 3 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 animate-in fade-in">
          
          {isOptimizing ? (
             <div className="py-24 flex flex-col items-center justify-center space-y-4">
               <RefreshCw size={40} className="text-[#FFC20E] animate-spin" />
               <div className="text-xl font-black text-slate-900 tracking-tight">Solving Constraints...</div>
               <p className="text-sm text-slate-500 font-medium">Running linear programming solver across 1,200 permutations.</p>
             </div>
          ) : hasOptimized ? (
            <>
              {/* AI Counter-Strike Summary Banner */}
              <div className="bg-yellow-50 text-slate-900 p-5 rounded-sm border border-yellow-200 flex items-start gap-4">
                <div className="bg-white border border-yellow-300 p-2.5 rounded-full mt-0.5 shrink-0 shadow-sm">
                   <Sparkles size={24} className="text-[#FFC20E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Counter-Strike Solver: Defensive Optimization Complete</h3>
                  <p className="text-sm mt-1.5 leading-relaxed text-slate-700">
                    Calculated an optimized calendar yielding <strong className="font-extrabold text-slate-900 bg-yellow-200/50 px-1 rounded">+14.2% Gross Margin Lift ($1.2M)</strong>. Successfully preempted projected Milwaukee W45 TPR with a DeWalt W44 Circular Ad to defend market share (-800bps volume bleed mitigated), while satisfying the 3-week cooldown constraint prior to Cyber Week.
                  </p>
                </div>
              </div>

              {/* 3-Way Scenario Comparison Table */}
              <div className="border border-slate-200 rounded p-5">
                 <h3 className="text-base font-bold text-slate-900 mb-4">Scenario Comparison</h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                       <tr>
                         <th className="p-3">Key Metric</th>
                         <th className="p-3 text-right">2025 Baseline</th>
                         <th className="p-3 text-right">Undefended SBD Calendar</th>
                         <th className="p-3 text-right bg-emerald-50 text-emerald-900 font-bold border-l border-r border-t border-emerald-200 rounded-t-sm">AI Competitor-Aware Calendar</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-slate-700">
                       <tr>
                         <td className="p-3 font-medium">Gross Rev ($)</td>
                         <td className="p-3 text-right">$24.2M</td>
                         <td className="p-3 text-right">$25.1M</td>
                         <td className="p-3 text-right font-bold bg-emerald-50 text-emerald-700 border-l border-r border-emerald-100">$26.8M (+10.7%)</td>
                       </tr>
                       <tr>
                         <td className="p-3 font-medium">Trade Spend ($)</td>
                         <td className="p-3 text-right">$1.2M</td>
                         <td className="p-3 text-right">$2.1M</td>
                         <td className="p-3 text-right font-bold bg-emerald-50 text-emerald-700 border-l border-r border-emerald-100">$2.4M</td>
                       </tr>
                       <tr>
                         <td className="p-3 font-medium">Net Margin (%)</td>
                         <td className="p-3 text-right">44.0%</td>
                         <td className="p-3 text-right">41.2%</td>
                         <td className="p-3 text-right font-bold bg-emerald-50 text-emerald-700 border-l border-r border-emerald-100">42.8% (+160 bps)</td>
                       </tr>
                       <tr>
                         <td className="p-3 font-medium">Ending Category Share (%)</td>
                         <td className="p-3 text-right">41.4%</td>
                         <td className="p-3 text-right text-rose-600">38.9% (-250 bps Bleed)</td>
                         <td className="p-3 text-right font-bold bg-emerald-50 text-emerald-700 border-l border-r border-b border-emerald-200 rounded-b-sm">43.1% (+170 bps Gain)</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
              </div>

              {/* Interactive Calendar Grid & Sensitivity Slider */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 
                 <div className="lg:col-span-2 border border-slate-200 rounded p-5">
                   <h3 className="text-base font-bold text-slate-900 mb-4">Automated 12-Week Schedule</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                     {calendarSchedule.map((item, idx) => {
                       const isPromo = item.tactic !== 'No Promo';
                       return (
                         <div key={idx} className={`p-3 rounded border ${isPromo ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-1.5">
                             <span className="font-bold text-slate-900">{item.week}</span>
                             {isPromo && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Promo</span>}
                             {item.action === 'Defensive Strike' && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Defend</span>}
                           </div>
                           <div className={`font-semibold ${isPromo ? 'text-emerald-700' : 'text-slate-500'}`}>{item.tactic}</div>
                           {isPromo && <div className="text-xs text-slate-600 mt-1 font-medium">Depth: <span className="font-bold text-slate-900">{item.discount}</span></div>}
                           {item.action === 'Milwaukee TPR (Simulated)' && <div className="text-[10px] text-rose-600 font-bold mt-2 pt-2 border-t border-slate-200">Competitor Promo</div>}
                         </div>
                       );
                     })}
                   </div>
                 </div>

                 <div className="border border-slate-200 rounded p-5 bg-slate-50 flex flex-col justify-between">
                   <div>
                     <h3 className="text-base font-bold text-slate-900 mb-2">Sensitivity Analysis</h3>
                     <p className="text-xs text-slate-500 mb-6 font-medium">Adjust budget dynamically to see real-time margin impact without re-running the solver.</p>
                     
                     <div className="space-y-3">
                       <div className="flex justify-between text-sm font-semibold">
                         <span className="text-slate-700">Budget Constraint</span>
                         <span className="text-slate-900">{sensitivity > 0 ? `+${sensitivity}%` : `${sensitivity}%`}</span>
                       </div>
                       <input 
                         type="range" 
                         min="-20" 
                         max="20" 
                         step="5" 
                         value={sensitivity} 
                         onChange={(e) => setSensitivity(Number(e.target.value))} 
                         className="w-full accent-slate-900 cursor-pointer" 
                       />
                       <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                         <span>Tighten (-20%)</span>
                         <span>Loosen (+20%)</span>
                       </div>
                     </div>

                     <div className="mt-8 bg-white border border-slate-200 p-5 rounded text-center shadow-sm">
                       <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Projected Margin (Adjusted)</span>
                       <span className="text-3xl font-black text-emerald-600 tracking-tight">
                         ${(11.8 * (1 + (sensitivity * 0.3 / 100))).toFixed(2)}M
                       </span>
                     </div>
                   </div>
                 </div>

              </div>

              {/* WATERFALL CHART & DEEP DIVE METRIC TABLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                 {/* WATERFALL CHART */}
                 <div className="border border-slate-200 rounded p-4 flex flex-col bg-slate-50">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Financial Bridge (Net Sales Value)</h3>
                    <div className="h-72 flex-1">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
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
                 </div>

                 {/* DEEP DIVE METRIC TABLE */}
                 <div className="border border-slate-200 rounded overflow-hidden flex flex-col">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <h3 className="font-bold text-slate-900 text-sm">Deep Dive Metric Table (Brand Level Deltas)</h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Brand Portfolio</th>
                            <th className="p-3">Trade Spend Delta</th>
                            <th className="p-3">NSV ROI Delta</th>
                            <th className="p-3">Retailer Margin (HD)</th>
                            <th className="p-3 text-right">Target Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">DeWalt Power Tools</td>
                            <td className="p-3 text-emerald-600 font-medium">-12% (Optimized)</td>
                            <td className="p-3 text-emerald-600 font-medium">+0.8x</td>
                            <td className="p-3 text-emerald-600 font-medium">32.4% (+1.2%)</td>
                            <td className="p-3 text-right"><CheckCircle2 size={16} className="text-emerald-500 inline" /></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">Craftsman Tools</td>
                            <td className="p-3 text-amber-600 font-medium">+4% (Invested)</td>
                            <td className="p-3 text-slate-500 font-medium">-0.2x</td>
                            <td className="p-3 text-slate-500 font-medium">28.5% (Flat)</td>
                            <td className="p-3 text-right"><AlertTriangle size={16} className="text-amber-500 inline" /></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">Stanley Hand Tools</td>
                            <td className="p-3 text-emerald-600 font-medium">-15% (Optimized)</td>
                            <td className="p-3 text-emerald-600 font-medium">+1.4x</td>
                            <td className="p-3 text-emerald-600 font-medium">35.0% (+2.5%)</td>
                            <td className="p-3 text-right"><CheckCircle2 size={16} className="text-emerald-500 inline" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPhase(2)}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded flex items-center gap-2 border border-slate-300 transition-colors"
                >
                  <ChevronLeft size={18} />
                  <span>Re-configure Constraints</span>
                </button>

                <button
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Share size={16} />
                  <span>Push Optimized Schedule to Planner</span>
                </button>
              </div>

            </>
          ) : null}

        </div>
      )}

    </div>
  );
}
