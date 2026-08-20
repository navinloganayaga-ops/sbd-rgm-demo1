import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Info,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  RotateCcw,
  UploadCloud
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Cell
} from 'recharts';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';

interface PromoPlannerProps {
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  onFilterApply: () => void;
}

export interface WeekConfig {
  weekNum: number;
  weekLabel: string;
  baselineVolume: number;
  promoType: 'No Promo' | 'TPR' | 'Feature & Display' | 'Circular Ad Banner' | 'Endcap Power-Wing' | 'BOGO';
  discountPct: number;
  coOpFunding: number;
  fundingType: 'Scan/Markdown' | 'Lump Sum Co-Op' | 'Display Fee';
  purchaseReq: string;
  competitorBrand: string;
  competitorAction: string;
  competitorDiscountPct: number;
}

export default function PromoPlanner({ filterState, onFilterChange, onFilterApply }: PromoPlannerProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 State
  const [showImportModal, setShowImportModal] = useState(false);
  const [scenarioName, setScenarioName] = useState('Q4 DeWalt Power Tool Holiday Blitz 2026');
  const [selectedRetailer, setSelectedRetailer] = useState('Home Depot');
  const [baselineYear, setBaselineYear] = useState('2025 POS Actuals');
  const [selectedSkus, setSelectedSkus] = useState<string[]>([
    'dewalt_drill',
    'stanley_tape',
    'craftsman_toolset'
  ]);

  // Step 2 State - 12 Weeks Configuration
  const initialWeeks: WeekConfig[] = Array.from({ length: 12 }, (_, i) => {
    const wNum = 39 + i;
    const isCyber = wNum === 47 || wNum === 48;
    return {
      weekNum: wNum,
      weekLabel: `W${wNum} (Q4)`,
      baselineVolume: 25000 + Math.floor(Math.sin(i) * 3000),
      promoType: isCyber ? 'Feature & Display' : i === 3 ? 'TPR' : 'No Promo',
      discountPct: isCyber ? 25 : i === 3 ? 15 : 0,
      coOpFunding: isCyber ? 50000 : 0,
      fundingType: isCyber ? 'Lump Sum Co-Op' : 'Scan/Markdown',
      purchaseReq: 'None',
      competitorBrand: wNum === 45 ? 'Milwaukee' : 'None',
      competitorAction: wNum === 45 ? 'TPR' : 'No Promo',
      competitorDiscountPct: wNum === 45 ? 20 : 0
    };
  });

  const [weeks, setWeeks] = useState<WeekConfig[]>(initialWeeks);

  // Step 3 State
  const [breakdownView, setBreakdownView] = useState<'product' | 'event'>('product');

  // Handlers for Step 1
  const toggleSku = (skuId: string) => {
    setSelectedSkus(prev => 
      prev.includes(skuId) ? prev.filter(s => s !== skuId) : [...prev, skuId]
    );
  };

  // Handlers for Step 2
  const updateWeek = (index: number, field: keyof WeekConfig, value: any) => {
    setWeeks(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const applyPreset = (preset: 'tpr15' | 'cyber' | 'reset') => {
    setWeeks(prev => prev.map((w, i) => {
      if (preset === 'tpr15') {
        return { ...w, promoType: 'TPR', discountPct: 15, coOpFunding: 0, fundingType: 'Scan/Markdown' as const, purchaseReq: 'None' };
      }
      if (preset === 'cyber') {
        const isCyber = w.weekNum === 47 || w.weekNum === 48;
        return {
          ...w,
          promoType: isCyber ? 'Feature & Display' : 'No Promo',
          discountPct: isCyber ? 25 : 0,
          coOpFunding: isCyber ? 50000 : 0,
          fundingType: isCyber ? 'Lump Sum Co-Op' as const : 'Scan/Markdown' as const,
          purchaseReq: isCyber ? 'Buy 2 Get 1' : 'None'
        };
      }
      return { ...w, promoType: 'No Promo', discountPct: 0, coOpFunding: 0, fundingType: 'Scan/Markdown' as const, purchaseReq: 'None' };
    }));
  };

  // Calculated Metrics
  const calculatedMetrics = weeks.reduce((acc, w) => {
    const isPromo = w.promoType !== 'No Promo';
    const liftCoeff = isPromo ? 1 + (w.discountPct / 100) * 1.8 : 1.0;
    const estUnits = Math.round(w.baselineVolume * liftCoeff);
    const avgPrice = 120; // Blended avg price
    const baselineRev = w.baselineVolume * avgPrice;
    const grossRev = estUnits * (avgPrice * (1 - w.discountPct / 100));
    
    // Trade Spend = (Discount $ * Units) + Co-Op
    const tradeSpend = isPromo ? (estUnits * (avgPrice * (w.discountPct / 100))) + w.coOpFunding : 0;
    const nsv = grossRev - tradeSpend;
    const margin = nsv * 0.4; // assume 40% margin

    return {
      totalBaselineUnits: acc.totalBaselineUnits + w.baselineVolume,
      totalEstUnits: acc.totalEstUnits + estUnits,
      totalBaselineRev: acc.totalBaselineRev + baselineRev,
      totalGrossRev: acc.totalGrossRev + grossRev,
      totalTradeSpend: acc.totalTradeSpend + tradeSpend,
      totalNsv: acc.totalNsv + nsv,
      totalMargin: acc.totalMargin + margin,
      promoWeeksCount: acc.promoWeeksCount + (isPromo ? 1 : 0)
    };
  }, { totalBaselineUnits: 0, totalEstUnits: 0, totalBaselineRev: 0, totalGrossRev: 0, totalTradeSpend: 0, totalNsv: 0, totalMargin: 0, promoWeeksCount: 0 });

  const marginDropThrough = calculatedMetrics.totalGrossRev > 0 ? (calculatedMetrics.totalMargin / calculatedMetrics.totalGrossRev) * 100 : 0;
  const roiRatio = calculatedMetrics.totalTradeSpend > 0 ? (calculatedMetrics.totalMargin / calculatedMetrics.totalTradeSpend) : 0;

  // Real-time sparkline data
  const sparklineData = weeks.map(w => {
    const isPromo = w.promoType !== 'No Promo';
    const liftCoeff = isPromo ? 1 + (w.discountPct / 100) * 1.8 : 1.0;
    return {
      week: `W${w.weekNum}`,
      Volume: Math.round(w.baselineVolume * liftCoeff)
    };
  });

  // Check for cannibalization (e.g. concurrent promos on specific weeks)
  const hasCannibalizationRisk = weeks.some(w => w.promoType !== 'No Promo' && w.discountPct >= 20);

  // Waterfall Chart Data for Step 3
  const promoLiftRaw = calculatedMetrics.totalGrossRev - calculatedMetrics.totalBaselineRev;
  const simulatedTransference = weeks.some(w => w.competitorDiscountPct > 0) ? promoLiftRaw * 0.15 : 0; // Simulated transference
  const finalNsv = calculatedMetrics.totalNsv - simulatedTransference;

  const waterfallData = [
    { name: 'Baseline Rev', value: Math.round(calculatedMetrics.totalBaselineRev / 1000000), fill: '#94a3b8' },
    { name: '+ Promo Uplift', value: Math.round(promoLiftRaw / 1000000), fill: '#059669' },
    { name: '- Comp Transference', value: -Math.round(simulatedTransference / 1000000), fill: '#d97706' },
    { name: '- Trade Spend', value: -Math.round(calculatedMetrics.totalTradeSpend / 1000000), fill: '#e11d48' },
    { name: '= Final NSV', value: Math.round(finalNsv / 1000000), fill: '#0f172a' }
  ];

  // Market Share Chart Data
  const marketShareData = weeks.map(w => {
    const sbdShare = 40 + (w.promoType !== 'No Promo' ? 5 : 0) - (w.competitorDiscountPct > 0 ? 3 : 0);
    const milwaukeeShare = 25 + (w.competitorDiscountPct > 0 ? 5 : 0) - (w.promoType !== 'No Promo' ? 2 : 0);
    const makitaShare = 15;
    const otherShare = 100 - sbdShare - milwaukeeShare - makitaShare;
    return {
      name: w.weekLabel,
      SBD: sbdShare,
      Milwaukee: milwaukeeShare,
      Makita: makitaShare,
      Other: otherShare
    };
  });

  const getDiscountBadgeColor = (pct: number) => {
    if (pct === 0) return 'text-slate-400 bg-slate-100 border-slate-200';
    if (pct < 15) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    if (pct <= 25) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-rose-700 bg-rose-100 border-rose-200';
  };

  const hasCrossElasticityRisk = weeks.some(w => w.competitorDiscountPct > 0);
  const maxCompetitorWeek = weeks.find(w => w.competitorDiscountPct > 0);

  return (
    <div className="space-y-4 font-sans">


      {/* 3-STEP WIZARD PROGRESS HEADER */}
      <div className="bg-white border border-slate-200 rounded-sm p-3">
        <div className="grid grid-cols-3 gap-2">
          
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between ${
              currentStep === 1 
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                : currentStep > 1 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1 ? 'bg-[#FFC20E] text-slate-900' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider block ${currentStep === 1 ? 'text-slate-400' : 'text-emerald-700'}`}>Step 1</span>
                <span className="text-sm font-bold tracking-tight">Scenario Setup</span>
              </div>
            </div>
            <ChevronRight size={16} className={currentStep === 1 ? 'text-[#FFC20E]' : 'text-slate-400'} />
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between ${
              currentStep === 2 
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                : currentStep > 2 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2 ? 'bg-[#FFC20E] text-slate-900' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider block ${currentStep === 2 ? 'text-slate-400' : currentStep > 2 ? 'text-emerald-700' : 'text-slate-500'}`}>Step 2</span>
                <span className="text-sm font-bold tracking-tight">Calendar Config</span>
              </div>
            </div>
            <ChevronRight size={16} className={currentStep === 2 ? 'text-[#FFC20E]' : 'text-slate-400'} />
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between ${
              currentStep === 3 
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-300 text-slate-700'
              }`}>
                3
              </span>
              <div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider block ${currentStep === 3 ? 'text-slate-400' : 'text-slate-500'}`}>Step 3</span>
                <span className="text-sm font-bold tracking-tight">Financial Outputs</span>
              </div>
            </div>
            <Sparkles size={16} className={currentStep === 3 ? 'text-[#FFC20E]' : 'text-slate-400'} />
          </button>

        </div>
      </div>

      {/* STEP 1: SCENARIO SETUP */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Scenario & Product Setup
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Define campaign parameters, target retailer channel, and select participating product lines.
              </p>
            </div>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-[#FFC20E] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-sm flex items-center gap-2 transition-colors"
            >
              <UploadCloud size={16} />
              + Import from Promo Library
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Scenario Name</label>
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Target Retailer Partner</label>
              <select
                value={selectedRetailer}
                onChange={(e) => setSelectedRetailer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="Home Depot">Home Depot</option>
                <option value="Lowe's">Lowe's</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Historical Baseline Benchmark</label>
              <select
                value={baselineYear}
                onChange={(e) => setBaselineYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="2025 POS Actuals">2025 Category POS Actuals</option>
                <option value="3-Year Trended Baseline">3-Year Trended Baseline</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Planning Horizon & Quarter</label>
              <input
                type="text"
                disabled
                value="Q4 2026 (Weeks 39 - 50 • 12 Weeks)"
                className="w-full bg-slate-100 border border-slate-200 rounded p-2.5 text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* PRODUCT SELECTION CHECKBOXES */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="font-semibold text-slate-800 block text-base">
              Participating Product Lines
            </label>
            <p className="text-xs text-slate-500 -mt-2 mb-3">Select SKUs to include in this scenario. Displays baseline volume and base price.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <label 
                onClick={() => toggleSku('dewalt_drill')}
                className={`p-4 border rounded cursor-pointer flex items-start gap-3 transition-all ${
                  selectedSkus.includes('dewalt_drill') 
                    ? 'bg-yellow-50/50 border-yellow-400 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedSkus.includes('dewalt_drill')} 
                  onChange={() => {}} 
                  className="mt-1 accent-slate-900 h-4 w-4" 
                />
                <div className="text-sm w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">DeWalt 20V MAX Cordless Drill Kit</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">SKU: DCD771C2</div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-600">Base Price: <strong className="text-slate-900">$159.00</strong></span>
                    <span className="text-xs text-slate-600">Vol: <strong className="text-slate-900">124.5K</strong></span>
                  </div>
                  {selectedSkus.includes('dewalt_drill') && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-rose-50/50 p-2 rounded text-xs text-slate-700">
                      <span className="font-bold text-rose-800 block mb-1">Direct Competitor Benchmark:</span>
                      Milwaukee M18 Brushless Drill Kit
                    </div>
                  )}
                </div>
              </label>

              <label 
                onClick={() => toggleSku('stanley_tape')}
                className={`p-4 border rounded cursor-pointer flex items-start gap-3 transition-all ${
                  selectedSkus.includes('stanley_tape') 
                    ? 'bg-yellow-50/50 border-yellow-400 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedSkus.includes('stanley_tape')} 
                  onChange={() => {}} 
                  className="mt-1 accent-slate-900 h-4 w-4" 
                />
                <div className="text-sm w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">Stanley FatMax 25ft Tape Measure 2-Pack</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">SKU: FMHT33338</div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-600">Base Price: <strong className="text-slate-900">$24.99</strong></span>
                    <span className="text-xs text-slate-600">Vol: <strong className="text-slate-900">85.2K</strong></span>
                  </div>
                  {selectedSkus.includes('stanley_tape') && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-rose-50/50 p-2 rounded text-xs text-slate-700">
                      <span className="font-bold text-rose-800 block mb-1">Direct Competitor Benchmark:</span>
                      Makita 18V LXT Cordless Combo Kit
                    </div>
                  )}
                </div>
              </label>

              <label 
                onClick={() => toggleSku('craftsman_toolset')}
                className={`p-4 border rounded cursor-pointer flex items-start gap-3 transition-all ${
                  selectedSkus.includes('craftsman_toolset') 
                    ? 'bg-yellow-50/50 border-yellow-400 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={selectedSkus.includes('craftsman_toolset')} 
                  onChange={() => {}} 
                  className="mt-1 accent-slate-900 h-4 w-4" 
                />
                <div className="text-sm w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">Craftsman 135-Pc Mechanics Tool Set</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">SKU: CMMT99206</div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-600">Base Price: <strong className="text-slate-900">$99.00</strong></span>
                    <span className="text-xs text-slate-600">Vol: <strong className="text-slate-900">42.0K</strong></span>
                  </div>
                  {selectedSkus.includes('craftsman_toolset') && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-rose-50/50 p-2 rounded text-xs text-slate-700">
                      <span className="font-bold text-rose-800 block mb-1">Direct Competitor Benchmark:</span>
                      Husky 12-Piece Mechanics Set
                    </div>
                  )}
                </div>
              </label>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors"
            >
              <span>Continue to Calendar</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: WEEK-WISE PROMO CONFIGURATION */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Calendar Configuration
              </h2>
              <p className="text-sm text-slate-500">
                Configure promotional tactics, discount depths, and co-op funding week-by-week.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Quick Apply:</span>
              <button onClick={() => applyPreset('cyber')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-medium transition-colors">
                Cyber Week
              </button>
              <button onClick={() => applyPreset('tpr15')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-medium transition-colors">
                15% TPR All
              </button>
              <button onClick={() => applyPreset('reset')} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded font-medium transition-colors">
                Reset
              </button>
            </div>
          </div>

          {hasCannibalizationRisk && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-3">
              <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
              <div>
                <h4 className="text-amber-900 font-semibold text-sm">Cannibalization Risk Detected</h4>
                <p className="text-amber-800 text-xs mt-0.5">High discount depth (&gt;20%) during promotional weeks may cause cross-brand cannibalization. Review spacing to mitigate.</p>
              </div>
            </div>
          )}

          {hasCrossElasticityRisk && maxCompetitorWeek && (
            <div className="bg-rose-50 border border-rose-200 rounded p-3 flex items-start gap-3">
              <TrendingUp className="text-rose-600 mt-0.5 shrink-0 rotate-180" size={18} />
              <div>
                <h4 className="text-rose-900 font-semibold text-sm">Real-Time Cross-Elasticity Indicator</h4>
                <p className="text-rose-800 text-xs mt-0.5">Notice: Concurrent {maxCompetitorWeek.competitorDiscountPct}% discount on Milwaukee M18 in Week {maxCompetitorWeek.weekNum} projected to reduce DeWalt promotional volume lift by -14.2%.</p>
              </div>
            </div>
          )}

          {/* 12-WEEK MATRIX TABLE */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Week</th>
                  <th className="p-3">Baseline Vol</th>
                  <th className="p-3">Promotional Tactic</th>
                  <th className="p-3">Discount Depth %</th>
                  <th className="p-3">Funding Type</th>
                  <th className="p-3">Purchase Req</th>
                  <th className="p-3">Co-Op Funding ($)</th>
                  <th className="p-3 text-right">Est. Volume Lift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeks.map((w, idx) => {
                  const isPromo = w.promoType !== 'No Promo';
                  const lift = isPromo ? (w.discountPct * 1.8).toFixed(1) : '0.0';

                  return (
                    <React.Fragment key={w.weekNum}>
                      <tr className={`${w.weekNum === 47 || w.weekNum === 48 ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'} ${isPromo && w.competitorDiscountPct > 0 ? 'border-2 border-red-400' : ''}`}>
                        <td className="p-3 font-medium text-slate-900 relative">
                          {isPromo && w.competitorDiscountPct > 0 && (
                             <AlertTriangle className="text-amber-500 absolute left-[-8px] top-4" size={14} title="Overlap with competitor promo" />
                          )}
                          {w.weekLabel}
                          {(w.weekNum === 47 || w.weekNum === 48) && (
                            <span className="ml-2 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase">Holiday</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">{w.baselineVolume.toLocaleString()}</td>
                        <td className="p-3">
                          <select
                            value={w.promoType}
                            onChange={(e) => updateWeek(idx, 'promoType', e.target.value as any)}
                            className="bg-white border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-slate-500 w-44"
                          >
                            <option value="No Promo">No Promo</option>
                            <option value="TPR">TPR</option>
                            <option value="Feature & Display">Feature & Display</option>
                            <option value="Circular Ad Banner">Circular Ad Banner</option>
                            <option value="Endcap Power-Wing">Endcap Power-Wing</option>
                            <option value="BOGO">BOGO</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={w.promoType === 'No Promo'}
                              value={w.discountPct}
                              onChange={(e) => updateWeek(idx, 'discountPct', Number(e.target.value))}
                              className="w-16 bg-white border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-slate-500 disabled:bg-slate-100 disabled:text-slate-400"
                            />
                            {isPromo && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${getDiscountBadgeColor(w.discountPct)}`}>
                                {w.discountPct}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            disabled={w.promoType === 'No Promo'}
                            value={w.fundingType}
                            onChange={(e) => updateWeek(idx, 'fundingType', e.target.value as any)}
                            className="bg-white border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-slate-500 disabled:bg-slate-100 disabled:text-slate-400 w-36"
                          >
                            <option value="Scan/Markdown">Scan/Markdown</option>
                            <option value="Lump Sum Co-Op">Lump Sum Co-Op</option>
                            <option value="Display Fee">Display Fee</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            disabled={w.promoType === 'No Promo'}
                            value={w.purchaseReq}
                            onChange={(e) => updateWeek(idx, 'purchaseReq', e.target.value)}
                            className="w-32 bg-white border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-slate-500 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </td>
                        <td className="p-3">
                           <div className="flex items-center gap-2">
                             <span className="text-slate-400 font-medium">$</span>
                             <input
                              type="number"
                              min="0"
                              disabled={w.promoType === 'No Promo'}
                              value={w.coOpFunding}
                              onChange={(e) => updateWeek(idx, 'coOpFunding', Number(e.target.value))}
                              className="w-24 bg-white border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-slate-500 disabled:bg-slate-100 disabled:text-slate-400"
                            />
                           </div>
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-700">
                          {isPromo ? `+${lift}%` : '—'}
                        </td>
                      </tr>
                      {/* TRACK 2: COMPETITOR ROW */}
                      <tr className="bg-slate-100/50 border-b-2 border-slate-200">
                        <td className="p-2 pl-6 font-medium text-slate-500 text-xs flex items-center gap-2">
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                          <select
                            value={w.competitorBrand}
                            onChange={(e) => updateWeek(idx, 'competitorBrand', e.target.value)}
                            className="bg-transparent font-medium border border-slate-300 rounded px-1.5 py-1 text-xs text-slate-600 focus:outline-none focus:border-slate-500"
                          >
                            <option value="None">No Competitor Selected</option>
                            <option value="Milwaukee">Milwaukee</option>
                            <option value="Makita">Makita</option>
                            <option value="Ryobi">Ryobi</option>
                          </select>
                        </td>
                        <td className="p-2 text-slate-400 text-xs">—</td>
                        <td className="p-2">
                          <select
                            value={w.competitorAction}
                            onChange={(e) => updateWeek(idx, 'competitorAction', e.target.value)}
                            className="bg-transparent border border-slate-300 rounded px-2 py-1 text-xs text-slate-600 focus:outline-none focus:border-slate-500 w-44"
                          >
                            <option value="No Promo">No Promo</option>
                            <option value="TPR">TPR</option>
                            <option value="Feature & Display">Feature & Display</option>
                            <option value="Bundle">Bundle</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={w.competitorAction === 'No Promo'}
                              value={w.competitorDiscountPct}
                              onChange={(e) => updateWeek(idx, 'competitorDiscountPct', Number(e.target.value))}
                              className="w-16 bg-transparent border border-slate-300 rounded px-2 py-1 text-xs text-slate-600 focus:outline-none focus:border-slate-500 disabled:opacity-50"
                            />
                            {w.competitorDiscountPct > 0 && (
                              <span className="text-[10px] px-1 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-600 font-bold">
                                -{w.competitorDiscountPct}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td colSpan={2} className="p-2 text-xs text-slate-400 text-right">
                          {w.competitorDiscountPct > 0 ? <span className="text-rose-600 font-medium">Transference Risk Active</span> : '—'}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* GRANULAR SKU SPEND PLANNING TABLE */}
          <div className="mt-6 border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Granular Tactic & Spend Planning (SKU Level)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculates financial mechanics for active promos</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3">SKU / Product</th>
                    <th className="p-3">Avg List Price</th>
                    <th className="p-3">Base Shelf Price</th>
                    <th className="p-3">Discount %</th>
                    <th className="p-3 text-rose-600">Calc Scan Rate ($)</th>
                    <th className="p-3 font-bold text-emerald-700">Promoted Shelf Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedSkus.map(sku => {
                    const priceMap: any = {
                      'dewalt_drill': 159.00,
                      'stanley_tape': 24.99,
                      'craftsman_toolset': 99.00
                    };
                    const nameMap: any = {
                      'dewalt_drill': 'DeWalt 20V MAX Drill Kit',
                      'stanley_tape': 'Stanley FatMax 25ft Tape',
                      'craftsman_toolset': 'Craftsman 135-Pc Tool Set'
                    };
                    const basePrice = priceMap[sku];
                    const listPrice = (basePrice * 1.15).toFixed(2);
                    // Use max discount pct from weeks for preview
                    const maxDiscount = Math.max(...weeks.map(w => w.discountPct));
                    const scanRate = (basePrice * (maxDiscount / 100)).toFixed(2);
                    const promotedPrice = (basePrice - Number(scanRate)).toFixed(2);
                    
                    return (
                      <tr key={sku} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{nameMap[sku]}</td>
                        <td className="p-3 text-slate-500">${listPrice}</td>
                        <td className="p-3 font-medium text-slate-700">${basePrice.toFixed(2)}</td>
                        <td className="p-3 text-slate-600">{maxDiscount}%</td>
                        <td className="p-3 font-medium text-rose-600">-${scanRate}</td>
                        <td className="p-3 font-bold text-emerald-700 bg-emerald-50/30 border-l border-emerald-100">${promotedPrice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* REAL-TIME LIFT PREVIEW CURVE */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 flex gap-6 items-center">
             <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Real-Time Volume Lift Preview</h4>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <Area type="monotone" dataKey="Volume" stroke="#FFC20E" fill="#fef3c7" strokeWidth={2} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, padding: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
             <div className="w-px h-16 bg-slate-200"></div>
             <div className="shrink-0 flex flex-col items-end justify-center min-w-[120px]">
                <span className="text-xs text-slate-500 font-medium">Est. Promo Units</span>
                <span className="text-2xl font-bold text-slate-900">{calculatedMetrics.totalEstUnits.toLocaleString()}</span>
                <span className="text-xs text-emerald-600 font-medium">+{((calculatedMetrics.totalEstUnits / calculatedMetrics.totalBaselineUnits - 1) * 100).toFixed(1)}% vs Base</span>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded flex items-center gap-2 border border-slate-300 transition-colors"
            >
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors"
            >
              <span>View Financial Outputs</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: FINANCIAL OUTPUTS */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 animate-in fade-in">
          
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Financial Outputs
              </h2>
              <p className="text-sm text-slate-500">
                P&L slicing and metric breakdown for {scenarioName}.
              </p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded">
               <button 
                 onClick={() => setBreakdownView('product')}
                 className={`px-3 py-1.5 text-xs font-semibold rounded ${breakdownView === 'product' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 By Product Family
               </button>
               <button 
                 onClick={() => setBreakdownView('event')}
                 className={`px-3 py-1.5 text-xs font-semibold rounded ${breakdownView === 'event' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 By Promotion Event
               </button>
            </div>
          </div>

          {/* STANDARD SBD METRIC CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">POS UNITS</span>
              <span className="text-xl font-bold text-slate-900">{(calculatedMetrics.totalEstUnits / 1000).toFixed(1)}K</span>
              <div className="text-xs text-emerald-600 font-medium mt-1">+{Math.round((calculatedMetrics.totalEstUnits - calculatedMetrics.totalBaselineUnits) / 1000)}K Lift</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">GROSS SALES ($)</span>
              <span className="text-xl font-bold text-slate-900">${(calculatedMetrics.totalGrossRev / 1000000).toFixed(1)}M</span>
              <div className="text-xs text-slate-500 font-medium mt-1">Gross Rev</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">TOTAL TRADE SPEND ($)</span>
              <span className="text-xl font-bold text-slate-900">${(calculatedMetrics.totalTradeSpend / 1000000).toFixed(2)}M</span>
              <div className="text-xs text-amber-600 font-medium mt-1">{((calculatedMetrics.totalTradeSpend / calculatedMetrics.totalGrossRev) * 100).toFixed(1)}% of Gross</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">NSV ($)</span>
              <span className="text-xl font-bold text-slate-900">${(calculatedMetrics.totalNsv / 1000000).toFixed(1)}M</span>
              <div className="text-xs text-slate-500 font-medium mt-1">NSV</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">ROI RATIO</span>
              <span className="text-xl font-bold text-slate-900">{roiRatio.toFixed(1)}x</span>
              <div className="text-xs text-slate-500 font-medium mt-1">Target: 3.2x</div>
            </div>
          </div>

          {/* CATEGORY MARKET SHARE SCORECARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-slate-900 p-5 rounded">
               <div className="flex justify-between items-start">
                 <div>
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block mb-1">SBD CATEGORY SHARE (%)</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tight">42.8% Share</span>
                 </div>
                 <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded font-bold text-sm">
                   +1.4% vs Competitors
                 </div>
               </div>
            </div>
            <div className="bg-white border border-rose-200 p-5 rounded">
               <div className="flex justify-between items-start">
                 <div>
                   <span className="text-[11px] font-black uppercase tracking-widest text-rose-500 block mb-1">VOLUME BLEED / TRANSFERENCE</span>
                   <span className="text-3xl font-black text-rose-900 tracking-tight">-12.4K Units</span>
                 </div>
                 <div className="text-right">
                   <div className="text-xs font-semibold text-slate-500">Lost to</div>
                   <div className="text-sm font-bold text-slate-900">Milwaukee / Makita</div>
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
             {/* WATERFALL CHART */}
             <div className="border border-slate-200 rounded p-4 flex flex-col">
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

             {/* CATEGORY MARKET SHARE CHART */}
             <div className="border border-slate-200 rounded p-4 flex flex-col">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Category Market Share Distribution (12-Week Q4)</h3>
                <div className="h-72 flex-1">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={marketShareData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                       <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 4, fontSize: 12 }} />
                       <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                       <Bar dataKey="SBD" stackId="a" fill="#FFC20E" name="DeWalt / SBD" />
                       <Bar dataKey="Milwaukee" stackId="a" fill="#e11d48" name="Milwaukee" />
                       <Bar dataKey="Makita" stackId="a" fill="#0284c7" name="Makita" />
                       <Bar dataKey="Other" stackId="a" fill="#94a3b8" name="Other / Store Brands" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* DEEP DIVE METRIC TABLE */}
          <div className="border border-slate-200 rounded overflow-hidden">
             <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
               <h3 className="font-bold text-slate-900 text-sm">Deep Dive Metric Table (Brand Level Deltas)</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                 <thead className="bg-white text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                   <tr>
                     <th className="p-3">Brand Portfolio</th>
                     <th className="p-3">Trade Spend Delta</th>
                     <th className="p-3">NSV ROI Delta</th>
                     <th className="p-3">Retailer Margin (Home Depot)</th>
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

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded flex items-center gap-2 border border-slate-300 transition-colors"
            >
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded flex items-center gap-2 border border-slate-300 transition-colors"
              >
                <FileSpreadsheet size={16} />
                <span>Save to Comparison Hub</span>
              </button>
              
              <button
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors"
              >
                <UploadCloud size={16} />
                <span>Export to SAP ERP</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* IMPORT PROMO LIBRARY MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <UploadCloud className="text-slate-600" size={24} />
                <h2 className="text-lg font-bold text-slate-900">Import from Promo Library</h2>
              </div>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50">
              <div className="space-y-4">
                {[
                  { name: "2025 Home Depot Father's Day BOGO", retailer: "Home Depot", uplift: "+42%", roi: "3.2x", incGsv: "$2.1M" },
                  { name: "Lowe's Q3 Power-Wing Display", retailer: "Lowe's", uplift: "+28%", roi: "2.8x", incGsv: "$1.4M" },
                  { name: "Q4 Cyber Week DeWalt Blitz", retailer: "Amazon", uplift: "+65%", roi: "4.1x", incGsv: "$5.2M" }
                ].map((promo, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-4 flex items-center justify-between hover:border-slate-400 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-900">{promo.name}</h4>
                      <div className="text-xs text-slate-500 mt-1 flex gap-4">
                        <span>Retailer: <strong className="text-slate-700">{promo.retailer}</strong></span>
                        <span>Avg Vol Uplift: <strong className="text-emerald-600">{promo.uplift}</strong></span>
                        <span>Hist. ROI: <strong className="text-slate-700">{promo.roi}</strong></span>
                        <span>Inc. GSV: <strong className="text-slate-700">{promo.incGsv}</strong></span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setScenarioName(promo.name);
                        setShowImportModal(false);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded"
                    >
                      Import
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
