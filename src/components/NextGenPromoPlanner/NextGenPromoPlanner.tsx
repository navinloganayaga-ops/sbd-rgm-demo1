import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Tag, 
  Calendar, 
  X, 
  Sparkles, 
  Bot, 
  Sliders, 
  Send, 
  Download, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  RefreshCw, 
  Check, 
  BarChart3, 
  Filter, 
  Layers, 
  FileSpreadsheet, 
  Info, 
  RotateCcw, 
  SlidersHorizontal, 
  DollarSign, 
  Clock, 
  Cloud, 
  Share2, 
  Trash2, 
  Lock,
  Boxes,
  Percent,
  TrendingUp as TrendingUpIcon,
  ShoppingBag
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { FilterState } from '../GlobalFilterBar';
import { NavItem } from '../Sidebar';
import { 
  PcrHistoricalRecord, 
  ParticipatingSku, 
  ApproachCard, 
  SavedScenario, 
  AssistantMessage 
} from './types';
import { 
  pcrHistoricalDatabase, 
  standardApproachCards, 
  catalogCatalogCandidateSkus, 
  initialSavedScenarios 
} from './mockPcrData';

interface NextGenPromoPlannerProps {
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  onFilterApply: () => void;
  onNavigateTab?: (item: NavItem, payload?: any) => void;
}

export default function NextGenPromoPlanner({
  filterState,
  onFilterChange,
  onFilterApply,
  onNavigateTab
}: NextGenPromoPlannerProps) {
  // WIZARD STEP: 1 = Filter PCRs, 2 = Performance & Baseline, 3 = Strategy Approach, 4 = SKU Allocations & Sim, 5 = Compare & Salesforce
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1 STATE: Selected PCRs for optimization
  const [selectedPcrIds, setSelectedPcrIds] = useState<string[]>([
    'PCR-2025-0812',
    'PCR-2025-0815',
    'PCR-2025-0824'
  ]);
  const [expandedPcrId, setExpandedPcrId] = useState<string | null>('PCR-2025-0812');
  const [searchPcrQuery, setSearchPcrQuery] = useState('');
  const [selectedBuFilter, setSelectedBuFilter] = useState<string>('All');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('All');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');

  // STEP 2 STATE: Stacked Bar Metric View
  const [stackedBarMetric, setStackedBarMetric] = useState<'units' | 'gsv' | 'retail'>('units');

  // STEP 3 STATE: Selected Approach
  const [selectedApproachId, setSelectedApproachId] = useState<'rollover' | 'margins' | 'gsv' | 'balanced'>('margins');

  // STEP 4 STATE: SKU Allocations & Simulation
  const [skuAllocations, setSkuAllocations] = useState<ParticipatingSku[]>(() => {
    // Flatten SKUs from initial selected PCRs and apply default approach adjustments
    const baseSkus = pcrHistoricalDatabase
      .filter(p => ['PCR-2025-0812', 'PCR-2025-0815', 'PCR-2025-0824'].includes(p.pcrNumber))
      .flatMap(p => p.skus);
    return JSON.parse(JSON.stringify(baseSkus));
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState(false);
  const [saveScenarioModalOpen, setSaveScenarioModalOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');

  // STEP 5 STATE: Scenarios & Salesforce Sync
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(initialSavedScenarios);
  const [selectedScenarioForSalesforce, setSelectedScenarioForSalesforce] = useState<string>('scen-02');
  const [isSalesforceModalOpen, setIsSalesforceModalOpen] = useState(false);
  const [isSalesforceSyncing, setIsSalesforceSyncing] = useState(false);
  const [salesforceSyncSuccess, setSalesforceSyncSuccess] = useState<boolean>(false);
  const [syncedReceipt, setSyncedReceipt] = useState<{ id: string; time: string; campaign: string } | null>(null);

  // FEATURE 9: FLOATING PROMO ASSISTANT (Copilot)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAssistantMinimized, setIsAssistantMinimized] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      timestamp: '10:45 AM',
      text: "Hello! I am your Next Gen Promo Assistant. I'm connected to your FY2025 historical PCR performance logs and ML elasticity models. How can I assist your FY2026 promotion planning?",
      chips: [
        "How does Aggressive Margins compare to FY2025?",
        "Simulate impact if we drop drill discount to 18%",
        "Which SKU has highest incremental elasticity?",
        "Check Salesforce TPM sync readiness"
      ]
    }
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string, _type?: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ----------------------------------------------------
  // FILTERED PCR LIST (STEP 1)
  // ----------------------------------------------------
  const filteredPcrs = useMemo(() => {
    return pcrHistoricalDatabase.filter(pcr => {
      const matchSearch = !searchPcrQuery.trim() || 
        pcr.pcrNumber.toLowerCase().includes(searchPcrQuery.toLowerCase()) ||
        pcr.title.toLowerCase().includes(searchPcrQuery.toLowerCase()) ||
        pcr.customer.toLowerCase().includes(searchPcrQuery.toLowerCase()) ||
        pcr.brand.toLowerCase().includes(searchPcrQuery.toLowerCase());
      
      const matchBu = selectedBuFilter === 'All' || pcr.bu === selectedBuFilter;
      const matchCust = selectedCustomerFilter === 'All' || pcr.customer === selectedCustomerFilter;
      const matchBrand = selectedBrandFilter === 'All' || pcr.brand === selectedBrandFilter;

      return matchSearch && matchBu && matchCust && matchBrand;
    });
  }, [searchPcrQuery, selectedBuFilter, selectedCustomerFilter, selectedBrandFilter]);

  // Toggle PCR selection
  const handleTogglePcr = (pcrNumber: string) => {
    setSelectedPcrIds(prev => {
      const exists = prev.includes(pcrNumber);
      const next = exists ? prev.filter(id => id !== pcrNumber) : [...prev, pcrNumber];
      
      // Update SKU allocations list to match selected PCRs
      const nextSkus = pcrHistoricalDatabase
        .filter(p => next.includes(p.pcrNumber))
        .flatMap(p => p.skus);
      setSkuAllocations(JSON.parse(JSON.stringify(nextSkus)));

      return next;
    });
  };

  const handleSelectAllFilteredPcrs = () => {
    if (selectedPcrIds.length === filteredPcrs.length) {
      setSelectedPcrIds([]);
      setSkuAllocations([]);
    } else {
      const allIds = filteredPcrs.map(p => p.pcrNumber);
      setSelectedPcrIds(allIds);
      const allSkus = pcrHistoricalDatabase
        .filter(p => allIds.includes(p.pcrNumber))
        .flatMap(p => p.skus);
      setSkuAllocations(JSON.parse(JSON.stringify(allSkus)));
    }
  };

  // ----------------------------------------------------
  // SELECTED PCR DATA & STACKED BAR DATA (STEP 2)
  // ----------------------------------------------------
  const selectedPcrObjects = useMemo(() => {
    return pcrHistoricalDatabase.filter(p => selectedPcrIds.includes(p.pcrNumber));
  }, [selectedPcrIds]);

  const totalParticipatingSkusCount = useMemo(() => {
    return selectedPcrObjects.reduce((acc, p) => acc + p.skus.length, 0);
  }, [selectedPcrObjects]);

  // Stacked Bar Data
  const stackedBarChartData = useMemo(() => {
    return selectedPcrObjects.map(p => {
      if (stackedBarMetric === 'units') {
        return {
          name: p.pcrNumber,
          shortTitle: p.title.replace('FY2025 ', '').slice(0, 22) + '...',
          baseline: Math.round(p.baselineUnits / 1000),
          incremental: Math.round(p.incrementalUnits / 1000),
          total: Math.round((p.baselineUnits + p.incrementalUnits) / 1000),
          unitLabel: 'K Units'
        };
      } else if (stackedBarMetric === 'gsv') {
        return {
          name: p.pcrNumber,
          shortTitle: p.title.replace('FY2025 ', '').slice(0, 22) + '...',
          baseline: Number((p.baselineGSV / 1000000).toFixed(2)),
          incremental: Number((p.incrementalGSV / 1000000).toFixed(2)),
          total: Number(((p.baselineGSV + p.incrementalGSV) / 1000000).toFixed(2)),
          unitLabel: '$M GSV'
        };
      } else {
        const totalRetail = parseFloat(p.posRetailAct.replace(/[^0-9.]/g, ''));
        const baselineRetail = totalRetail * 0.65;
        const incRetail = totalRetail * 0.35;
        return {
          name: p.pcrNumber,
          shortTitle: p.title.replace('FY2025 ', '').slice(0, 22) + '...',
          baseline: Number(baselineRetail.toFixed(2)),
          incremental: Number(incRetail.toFixed(2)),
          total: Number(totalRetail.toFixed(2)),
          unitLabel: '$M Retail'
        };
      }
    });
  }, [selectedPcrObjects, stackedBarMetric]);

  // ----------------------------------------------------
  // APPLY STRATEGIC APPROACH TO SKU ALLOCATIONS (STEP 3 -> 4)
  // ----------------------------------------------------
  const handleApplyApproach = (approachId: 'rollover' | 'margins' | 'gsv' | 'balanced') => {
    setSelectedApproachId(approachId);
    triggerToast(`Applied Strategy: ${standardApproachCards.find(a => a.id === approachId)?.title}`);

    // Update SKU allocations based on approach
    setSkuAllocations(prev => {
      return prev.map(sku => {
        let newDiscount = sku.discountPctLastYear;
        let newSpend = sku.tradeSpendAllocated;

        if (approachId === 'rollover') {
          newDiscount = sku.discountPctLastYear;
          newSpend = sku.tradeSpendAllocated;
        } else if (approachId === 'margins') {
          // If elasticity is drag, drop discount by 6%; if high lift, keep or optimize
          if (sku.elasticityIndex < 0.9) {
            newDiscount = Math.max(12, Number((sku.discountPctLastYear - 6).toFixed(1)));
            newSpend = Math.round(sku.tradeSpendAllocated * 0.7);
          } else if (sku.elasticityIndex > 1.3) {
            newDiscount = Number((sku.discountPctLastYear - 1).toFixed(1));
            newSpend = Math.round(sku.tradeSpendAllocated * 1.15);
          } else {
            newDiscount = Math.max(14, Number((sku.discountPctLastYear - 3).toFixed(1)));
            newSpend = Math.round(sku.tradeSpendAllocated * 0.85);
          }
        } else if (approachId === 'gsv') {
          // Deepen discount by 3-5% for maximum velocity
          newDiscount = Math.min(30, Number((sku.discountPctLastYear + 4).toFixed(1)));
          newSpend = Math.round(sku.tradeSpendAllocated * 1.35);
        } else if (approachId === 'balanced') {
          // Algorithmic balance
          if (sku.elasticityIndex > 1.3) {
            newDiscount = Number((sku.discountPctLastYear + 2).toFixed(1));
            newSpend = Math.round(sku.tradeSpendAllocated * 1.2);
          } else {
            newDiscount = Math.max(15, Number((sku.discountPctLastYear - 4).toFixed(1)));
            newSpend = Math.round(sku.tradeSpendAllocated * 0.9);
          }
        }

        const newPromoPrice = Number((sku.basePrice * (1 - newDiscount / 100)).toFixed(2));
        
        // Elasticity recalculation
        const priceChangePct = (sku.promoPriceLastYear - newPromoPrice) / sku.promoPriceLastYear;
        const volumeLiftFactor = 1 + (priceChangePct * sku.elasticityIndex);
        const newUnits = Math.round(sku.unitsLastYear * Math.max(0.7, volumeLiftFactor));
        const newGSV = Math.round(newUnits * newPromoPrice * 0.76); // wholesale realization
        const newMargin = Number((sku.marginLastYear + (approachId === 'margins' ? 4.2 : approachId === 'gsv' ? -2.5 : 1.8)).toFixed(1));

        return {
          ...sku,
          currentDiscountPct: newDiscount,
          currentPromoPrice: newPromoPrice,
          tradeSpendAllocated: newSpend,
          projectedUnits: newUnits,
          projectedGSV: newGSV,
          projectedMargin: newMargin
        };
      });
    });
  };

  // ----------------------------------------------------
  // SKU CONTROLS & REAL-TIME SIMULATION (STEP 4)
  // ----------------------------------------------------
  const handleUpdateSkuDiscount = (skuId: string, newDiscountPct: number) => {
    setSkuAllocations(prev => prev.map(sku => {
      if (sku.skuId !== skuId) return sku;
      const validDiscount = Math.max(5, Math.min(45, newDiscountPct));
      const newPromoPrice = Number((sku.basePrice * (1 - validDiscount / 100)).toFixed(2));
      const priceChangePct = (sku.promoPriceLastYear - newPromoPrice) / sku.promoPriceLastYear;
      const volumeLiftFactor = 1 + (priceChangePct * sku.elasticityIndex);
      const newUnits = Math.round(sku.unitsLastYear * Math.max(0.6, volumeLiftFactor));
      const newGSV = Math.round(newUnits * newPromoPrice * 0.76);
      const marginChange = (sku.discountPctLastYear - validDiscount) * 0.45;
      const newMargin = Number((sku.marginLastYear + marginChange).toFixed(1));

      return {
        ...sku,
        currentDiscountPct: validDiscount,
        currentPromoPrice: newPromoPrice,
        projectedUnits: newUnits,
        projectedGSV: newGSV,
        projectedMargin: newMargin
      };
    }));
  };

  const handleToggleSkuIncluded = (skuId: string) => {
    setSkuAllocations(prev => prev.map(sku => {
      if (sku.skuId !== skuId) return sku;
      const nextIncluded = !sku.included;
      triggerToast(nextIncluded ? `Included SKU ${sku.skuId}` : `Removed SKU ${sku.skuId} from promo allocation`);
      return { ...sku, included: nextIncluded };
    }));
  };

  const handleRunManualSimulation = () => {
    setIsSimulating(true);
    triggerToast('Simulating Financial Outcomes via ML Elasticity Curves...', 'info');
    setTimeout(() => {
      setIsSimulating(false);
      triggerToast('Simulation Complete! Updated GSV, Units & Margin Outcomes.');
    }, 700);
  };

  // Calculated Totals from Current SKU Allocations
  const activeAllocatedSkus = useMemo(() => {
    return skuAllocations.filter(s => s.included);
  }, [skuAllocations]);

  const simulatedTotals = useMemo(() => {
    const totalGSV = activeAllocatedSkus.reduce((acc, s) => acc + s.projectedGSV, 0);
    const totalUnits = activeAllocatedSkus.reduce((acc, s) => acc + s.projectedUnits, 0);
    const totalSpend = activeAllocatedSkus.reduce((acc, s) => acc + s.tradeSpendAllocated, 0);
    const weightedMargin = totalGSV > 0
      ? activeAllocatedSkus.reduce((acc, s) => acc + (s.projectedMargin * s.projectedGSV), 0) / totalGSV
      : 28.5;
    const roi = totalSpend > 0 ? (totalGSV * (weightedMargin / 100) / totalSpend).toFixed(2) + 'x' : '2.10x';

    // Baseline historical totals from selected PCRs for comparison
    const baseGSV = selectedPcrObjects.reduce((acc, p) => acc + p.baselineGSV + p.incrementalGSV, 0);
    const baseUnits = selectedPcrObjects.reduce((acc, p) => acc + p.baselineUnits + p.incrementalUnits, 0);
    const gsvDelta = totalGSV - baseGSV;
    const gsvDeltaPct = baseGSV > 0 ? ((gsvDelta / baseGSV) * 100).toFixed(1) : '+0.0';

    return {
      totalGSV,
      totalGSVFormatted: `$${(totalGSV / 1000000).toFixed(2)}M`,
      totalUnits,
      totalUnitsFormatted: `${(totalUnits / 1000).toFixed(1)}K`,
      totalSpend,
      totalSpendFormatted: `$${(totalSpend / 1000000).toFixed(2)}M`,
      weightedMargin: Number(weightedMargin.toFixed(1)),
      roi,
      gsvDelta,
      gsvDeltaPct: Number(gsvDeltaPct) >= 0 ? `+${gsvDeltaPct}%` : `${gsvDeltaPct}%`
    };
  }, [activeAllocatedSkus, selectedPcrObjects]);

  // ----------------------------------------------------
  // SCENARIO SAVE & SALESFORCE CONFIRMATION (STEP 5)
  // ----------------------------------------------------
  const handleSaveCurrentScenario = () => {
    if (!newScenarioName.trim()) return;
    const newScen: SavedScenario = {
      id: `scen-${Date.now()}`,
      name: newScenarioName.trim(),
      approachId: selectedApproachId,
      approachName: standardApproachCards.find(a => a.id === selectedApproachId)?.title || 'Custom Simulation',
      createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pcrCount: selectedPcrIds.length,
      skuCount: activeAllocatedSkus.length,
      gsv: simulatedTotals.totalGSV,
      gsvFormatted: simulatedTotals.totalGSVFormatted,
      marginPct: simulatedTotals.weightedMargin,
      marginFormatted: `${simulatedTotals.weightedMargin}%`,
      tradeSpend: simulatedTotals.totalSpend,
      tradeSpendFormatted: simulatedTotals.totalSpendFormatted,
      units: simulatedTotals.totalUnits,
      unitsFormatted: simulatedTotals.totalUnitsFormatted,
      roi: simulatedTotals.roi,
      isConfirmedToSalesforce: false,
      skusSnapshot: JSON.parse(JSON.stringify(activeAllocatedSkus))
    };

    setSavedScenarios(prev => [newScen, ...prev]);
    setSelectedScenarioForSalesforce(newScen.id);
    setNewScenarioName('');
    setSaveScenarioModalOpen(false);
    triggerToast(`Saved "${newScen.name}" successfully!`);
    setCurrentStep(5);
  };

  const handlePushToSalesforce = () => {
    setIsSalesforceSyncing(true);
    setTimeout(() => {
      setIsSalesforceSyncing(false);
      setSalesforceSyncSuccess(true);
      const targetScen = savedScenarios.find(s => s.id === selectedScenarioForSalesforce);
      const receipt = {
        id: `SFDC-TPM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString(),
        campaign: targetScen ? targetScen.name : 'FY2026 Optimization'
      };
      setSyncedReceipt(receipt);

      // Mark scenario confirmed
      setSavedScenarios(prev => prev.map(s => {
        if (s.id === selectedScenarioForSalesforce) {
          return { ...s, isConfirmedToSalesforce: true, salesforceCampaignId: receipt.id };
        }
        return s;
      }));

      triggerToast('Scenario successfully confirmed and pushed to Salesforce Promo Planning!', 'success');
    }, 1500);
  };

  // ----------------------------------------------------
  // PROMO ASSISTANT CHAT HANDLER (FEATURE 9)
  // ----------------------------------------------------
  const handleSendAssistantQuery = (queryText?: string) => {
    const q = queryText || assistantInput;
    if (!q.trim()) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: q.trim()
    };
    setAssistantMessages(prev => [...prev, userMsg]);
    if (!queryText) setAssistantInput('');

    // Formulate response
    setTimeout(() => {
      let reply = "I analyzed your current promotion parameters.";
      const lower = q.toLowerCase();

      if (lower.includes('margin') || lower.includes('aggressive')) {
        reply = `**Aggressive on Margins** projects an **SGM expansion of +440 bps (to 31.8%)** and saves **$2.5M in trade spend**. It trims TPR discount from 25% down to 18% on inelastic tools (like DCD771C2) while maintaining 5.0Ah battery velocity. Volume dips by -7.9%, but net penny profit increases by +$1.8M.`;
      } else if (lower.includes('drill') || lower.includes('18%') || lower.includes('drop')) {
        reply = `Simulating **18% discount on DeWalt 20V Drill (DCD771C2)**: \n- Retail Price: **$130.38** (vs $119.00 last year)\n- Unit Lift: **61,400 units** (vs 72,400 units, -15%)\n- Trade Spend Savings: **+$480,000**\n- SGM Margin expands from **27.4% to 32.1%** (+470 bps)\n- Model Verdict: **Recommended** — elasticity was only 0.64x, proving deep 25% discount was unnecessary.`;
      } else if (lower.includes('elasticity') || lower.includes('highest')) {
        reply = `The highest incremental elasticity SKU in this plan is **DCB205-2 (20V MAX 5.0Ah Dual Battery Pack)** at **1.45x elasticity**, followed by **FMHT33525 FatMax Tape 2-Pk** at **1.42x**. Both deliver over +38% incremental lift per dollar of trade allowance.`;
      } else if (lower.includes('salesforce') || lower.includes('sync')) {
        reply = `Salesforce TPM sync check: **100% Ready**. All 14 SKU condition records match SAP Vistex key fields, trade allowances are mapped to Consumer Goods Cloud Fund #FD-2026-90, and gross-to-net hurdles conform to Home Depot co-op guidelines.`;
      } else if (lower.includes('baseline') || lower.includes('incremental')) {
        reply = `Baseline volume represents organic shelf velocity without promotional stimulus (calculated from pre-event non-promoted 8-week run rate). Incremental lift represents pure volume added by the circular feature and price point, isolated from halo and cannibalization.`;
      } else {
        reply = `Based on your selection of **${selectedPcrIds.length} PCRs** and **${activeAllocatedSkus.length} active SKUs**, current simulated GSV is **${simulatedTotals.totalGSVFormatted}** (${simulatedTotals.gsvDeltaPct} vs last year) with a projected SGM Margin of **${simulatedTotals.weightedMargin}%**. Ready to proceed to the next step.`;
      }

      const botReply: AssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply
      };
      setAssistantMessages(prev => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-20 relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-md shadow-2xl border-l-4 border-[#FFC20E] flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles size={18} className="text-[#FFC20E] shrink-0" />
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              <span className="font-semibold text-slate-700">PRESCRIPTIVE & AGENTIC</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">NEXT GEN PROMO PLANNER</span>
              <span>/</span>
              <span className="text-slate-500">SALESFORCE INTEGRATED</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Next Gen Promo Planner
              </h1>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-sm flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-600" />
                <span>Next-Gen Trade Promotion Suite</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm flex items-center gap-1">
                <Cloud size={12} className="text-emerald-600" />
                <span>Salesforce Promo Planning Sync Active</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 max-w-4xl leading-relaxed">
              Transform historical PCR events into profit-maximizing future campaigns. Filter last year's closed promotions, review baseline vs. incremental decomposition, choose high-level strategic approaches, fine-tune SKU allocations, simulate financial outcomes, and push directly to Salesforce Promo Planning.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setIsAssistantOpen(true);
                setIsAssistantMinimized(false);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer border border-slate-200"
            >
              <Bot size={15} className="text-amber-700" />
              <span>Promo Copilot</span>
            </button>

            <button
              onClick={() => {
                if (currentStep === 4) {
                  setSaveScenarioModalOpen(true);
                } else if (currentStep === 5) {
                  setIsSalesforceModalOpen(true);
                } else {
                  setCurrentStep(prev => Math.min(5, prev + 1));
                }
              }}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-md flex items-center gap-2 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <span>{currentStep === 4 ? 'Save Scenario' : currentStep === 5 ? 'Push to Salesforce' : 'Next Step'}</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 2. FIVE-STEP INTERACTIVE WIZARD STEPPER */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-sans">
          {[
            { num: 1, title: '1. Filter Last Year PCRs', sub: `${selectedPcrIds.length} Selected` },
            { num: 2, title: '2. Performance & Baseline', sub: 'Model Stacked Bar' },
            { num: 3, title: '3. Strategic Approach', sub: standardApproachCards.find(a => a.id === selectedApproachId)?.title.split(' ')[0] || 'Margins' },
            { num: 4, title: '4. SKU Allocations & Sim', sub: `${activeAllocatedSkus.length} Active SKUs` },
            { num: 5, title: '5. Compare & Salesforce', sub: `${savedScenarios.length} Scenarios` }
          ].map(st => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-50/80 border-amber-400 shadow-2xs'
                    : isCompleted
                    ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
              >
                <div>
                  <div className={`font-bold text-[11px] truncate ${isActive ? 'text-amber-950 font-black' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {st.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {st.sub}
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ml-1 ${
                  isActive
                    ? 'bg-[#FFC20E] text-slate-900'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? <Check size={11} className="stroke-[3]" /> : st.num}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: FILTER PCRS / PROMOTIONS FROM LAST YEAR TO EDIT / OPTIMIZE */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-4">
          
          {/* STEP 1 HEADER & CONTROLS (Identical to Promo Events) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Step 1: Select Last Year Closed PCRs to Edit / Optimize</span>
                  <span className="text-xs font-normal text-slate-500">
                    (1 PCR contains multiple participating SKUs)
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter historical closed promotional events from FY2025. Select the events you want our AI model to optimize for the upcoming promotional calendar.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllFilteredPcrs}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors cursor-pointer"
                >
                  {selectedPcrIds.length === filteredPcrs.length ? 'Deselect All' : 'Select All Filtered'}
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedPcrIds.length === 0}
                  className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold text-xs px-4 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Proceed with {selectedPcrIds.length} Selected PCRs</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* FILTER TOOLBAR: BU, Customer, Brand, Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchPcrQuery}
                  onChange={(e) => setSearchPcrQuery(e.target.value)}
                  placeholder="Search PCR #, event title, or brand..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white"
                />
              </div>

              {/* Retailer / Customer dropdown */}
              <div>
                <select
                  value={selectedCustomerFilter}
                  onChange={(e) => setSelectedCustomerFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="All">All Retailers (Customer)</option>
                  <option value="Home Depot">The Home Depot</option>
                  <option value="Lowe's">Lowe's</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Ace Hardware">Ace Hardware</option>
                </select>
              </div>

              {/* Brand dropdown */}
              <div>
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="All">All SBD Brands</option>
                  <option value="DeWalt">DeWalt</option>
                  <option value="Craftsman">Craftsman</option>
                  <option value="Stanley">Stanley</option>
                  <option value="Irwin">Irwin</option>
                </select>
              </div>

              {/* Business Unit dropdown */}
              <div>
                <select
                  value={selectedBuFilter}
                  onChange={(e) => setSelectedBuFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="All">All Business Units (BU)</option>
                  <option value="Power Tools Group">Power Tools Group (PTG)</option>
                  <option value="Hand Tools & Accessories">Hand Tools & Accessories (HTAS)</option>
                  <option value="Storage & Workspace">Storage & Workspace</option>
                </select>
              </div>
            </div>

            {/* SELECTION SUMMARY BADGE */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{selectedPcrIds.length} of {filteredPcrs.length} PCRs selected</span>
                <span>·</span>
                <span className="font-semibold text-amber-900">{totalParticipatingSkusCount} Participating SKUs</span>
              </div>

              <div className="text-[11px] text-slate-500">
                Click any row to inspect participating SKUs and baseline sales
              </div>
            </div>
          </div>

          {/* LIST OF FILTERED PCRS WITH EXPANDABLE SKUs */}
          <div className="space-y-3">
            {filteredPcrs.map(pcr => {
              const isSelected = selectedPcrIds.includes(pcr.pcrNumber);
              const isExpanded = expandedPcrId === pcr.pcrNumber;

              return (
                <div 
                  key={pcr.pcrNumber}
                  className={`bg-white border rounded-lg overflow-hidden transition-all shadow-2xs ${
                    isSelected ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* PCR HEADER ROW */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start md:items-center gap-3">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTogglePcr(pcr.pcrNumber)}
                        className="w-4 h-4 mt-0.5 md:mt-0 accent-[#FFC20E] rounded cursor-pointer shrink-0"
                      />

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {pcr.pcrNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{pcr.title}</span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {pcr.customer}
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {pcr.brand}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span>{pcr.dates}</span>
                          <span>·</span>
                          <span>{pcr.mechanic}</span>
                          <span>·</span>
                          <span className="font-bold text-slate-700">{pcr.skus.length} Participating SKUs</span>
                        </div>
                      </div>
                    </div>

                    {/* KEY LAST YEAR RESULTS CHIPS & EXPAND TOGGLE */}
                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">FY2025 Actual POS</div>
                        <div className="text-xs font-bold text-slate-900">{pcr.posRetailAct} ({pcr.posUnitsAct})</div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">SGM Margin</div>
                        <div className="text-xs font-bold text-emerald-700">{pcr.sgmMarginAct}</div>
                      </div>

                      <button
                        onClick={() => setExpandedPcrId(isExpanded ? null : pcr.pcrNumber)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        title={isExpanded ? 'Hide Participating SKUs' : 'Show Participating SKUs'}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED ACCORDION: PARTICIPATING SKUs IN THIS PCR */}
                  {isExpanded && (
                    <div className="bg-[#FAFBFD] border-t border-slate-100 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>Participating SKUs in {pcr.pcrNumber} ({pcr.skus.length} items):</span>
                        <span className="text-[11px] font-normal text-slate-500">Historical performance data</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase">
                              <th className="pb-1.5">SKU ID</th>
                              <th className="pb-1.5">SKU Name</th>
                              <th className="pb-1.5 text-right">Base MSRP</th>
                              <th className="pb-1.5 text-right">FY25 Promo</th>
                              <th className="pb-1.5 text-right">Discount</th>
                              <th className="pb-1.5 text-right">FY25 Units</th>
                              <th className="pb-1.5 text-right">FY25 GSV</th>
                              <th className="pb-1.5 text-right">Margin %</th>
                              <th className="pb-1.5 text-right">Elasticity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {pcr.skus.map(sku => (
                              <tr key={sku.skuId} className="hover:bg-slate-100/60 transition-colors">
                                <td className="py-2 font-mono font-bold text-slate-900">{sku.skuId}</td>
                                <td className="py-2 max-w-xs truncate font-medium">{sku.name}</td>
                                <td className="py-2 text-right font-mono text-slate-500">${sku.basePrice.toFixed(2)}</td>
                                <td className="py-2 text-right font-mono font-bold text-slate-900">${sku.promoPriceLastYear.toFixed(2)}</td>
                                <td className="py-2 text-right font-bold text-amber-700">{sku.discountPctLastYear}%</td>
                                <td className="py-2 text-right font-mono">{sku.unitsLastYear.toLocaleString()}</td>
                                <td className="py-2 text-right font-mono">${(sku.gsvLastYear / 1000).toFixed(0)}K</td>
                                <td className="py-2 text-right font-bold text-emerald-700">{sku.marginLastYear}%</td>
                                <td className="py-2 text-right">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    sku.elasticityIndex > 1.2
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : sku.elasticityIndex < 0.8
                                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {sku.elasticityIndex.toFixed(2)}x
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* STEP 1 BOTTOM ACTION BAR */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <div className="text-xs text-slate-600">
              Selected <strong>{selectedPcrIds.length}</strong> promotional events for optimization.
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={selectedPcrIds.length === 0}
              className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-extrabold text-xs px-5 py-2 rounded-md shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Step 2: Performance Review</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PERFORMANCE AGAINST METRIC TARGETS + STACKED BAR DECOMPOSITION */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-4">
          
          {/* STEP 2 TOP METRIC SCORECARDS (Plan vs Act Targets) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Step 2: Target Performance & ML Baseline vs. Incremental Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Retrospective evaluation of selected {selectedPcrIds.length} PCRs against corporate targets and ML econometric lift decomposition.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Back to Filters
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-4 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Recommend Approaches</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Target Scorecards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">POS Units vs Target</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  248.5K Act / 288.1K Plan
                </div>
                <span className="text-[11px] text-rose-700 font-semibold block mt-0.5">
                  -13.7% Missed Target
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">POS Retail vs Target</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  $31.7M Act / $36.9M Plan
                </div>
                <span className="text-[11px] text-rose-700 font-semibold block mt-0.5">
                  -14.1% Volume Drag
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">SGM % Margin Realization</span>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  29.5% Act / 25.5% Plan
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  +400 bps Exceeded Hurdle
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Promo ROI & Efficiency</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  2.29x Average ROI
                </div>
                <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                  $5.28M Trade Spend Committed
                </span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE STACKED BAR CHART: BASELINE VS INCREMENTAL (FROM MODEL) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={16} className="text-amber-600" />
                  <span>Econometric Decomposition: Baseline Volume vs. Incremental Lift</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deconstructed via ML sales-response model isolating pure promotional lift from organic shelf run-rate.
                </p>
              </div>

              {/* Metric Toggle: Units vs GSV vs Retail */}
              <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded text-xs self-start sm:self-auto">
                <button
                  onClick={() => setStackedBarMetric('units')}
                  className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                    stackedBarMetric === 'units' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Units (Thousands)
                </button>
                <button
                  onClick={() => setStackedBarMetric('gsv')}
                  className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                    stackedBarMetric === 'gsv' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gross Sales ($ GSV)
                </button>
                <button
                  onClick={() => setStackedBarMetric('retail')}
                  className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                    stackedBarMetric === 'retail' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  POS Retail ($)
                </button>
              </div>
            </div>

            {/* Recharts Stacked Bar Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedBarChartData} margin={{ top: 15, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const baselineVal = payload.find(p => p.dataKey === 'baseline')?.value || 0;
                        const incVal = payload.find(p => p.dataKey === 'incremental')?.value || 0;
                        const total = Number(baselineVal) + Number(incVal);
                        const incShare = total > 0 ? ((Number(incVal) / total) * 100).toFixed(1) : '0';

                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700">
                            <div className="font-bold text-amber-400">{label} — {data.shortTitle}</div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-300">Baseline Organic Volume:</span>
                              <span className="font-mono font-bold">{baselineVal} {data.unitLabel}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#FFC20E] font-semibold">Pure Incremental Lift:</span>
                              <span className="font-mono font-bold text-[#FFC20E]">+{incVal} {data.unitLabel}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-1 flex items-center justify-between gap-4 text-[11px]">
                              <span className="text-slate-400">Incremental Lift Ratio:</span>
                              <span className="font-bold text-emerald-400">{incShare}% Lift</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                    formatter={(value) => value === 'baseline' ? 'Organic Baseline (Run-Rate)' : 'Model Incremental Lift'}
                  />
                  {/* Baseline Bar (Soft Slate) */}
                  <Bar dataKey="baseline" stackId="a" fill="#334155" radius={[0, 0, 0, 0]} barSize={42} />
                  {/* Incremental Bar (DeWalt Industrial Yellow) */}
                  <Bar dataKey="incremental" stackId="a" fill="#FFC20E" radius={[4, 4, 0, 0]} barSize={42} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Diagnostic Takeaways Callout */}
            <div className="bg-amber-50/70 border border-amber-200 rounded p-3 text-xs text-slate-700 flex items-start gap-2.5">
              <Sparkles size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">AI Model Diagnostic Takeaway:</span>
                <span className="ml-1 text-slate-700">
                  Across the {selectedPcrIds.length} selected promotions, <strong>36.4% of total volume was incremental lift</strong>. However, deep discounts on inelastic cordless kits (DCD771C2) generated diminishing returns. Switching to targeted spend allocation can recover up to <strong>+$1.8M in net margin</strong> without sacrificing incremental scale.
                </span>
              </div>
            </div>
          </div>

          {/* STEP 2 BOTTOM ACTION BAR */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded"
            >
              Back to Filter Selection
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-5 py-2 rounded-md shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Step 3: Strategic Approach Recommendation</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: TOOL RECOMMENDS 2 OR 3 HIGH-LEVEL 'APPROACH' CARDS + KEY KPIS */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Step 3: Select Strategic Promotional Approach
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our econometric engine synthesizes 3 prescriptive approaches for your FY2026 plan. Select an approach to generate SKU-level allocations and simulated outcomes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Back to Baseline
                </button>
                <button
                  onClick={() => {
                    handleApplyApproach(selectedApproachId);
                    setCurrentStep(4);
                  }}
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-4 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Apply & Allocate SKUs</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* THE APPROACH CARDS (Exact match to prompt: 1. Continue same plan, 2. Aggressive on Margins, 3. Aggressive on GSV + Balanced) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {standardApproachCards.map(approach => {
              const isSelected = selectedApproachId === approach.id;

              return (
                <div
                  key={approach.id}
                  onClick={() => handleApplyApproach(approach.id)}
                  className={`bg-white rounded-lg p-5 border-2 transition-all cursor-pointer flex flex-col justify-between shadow-2xs select-none ${
                    isSelected
                      ? 'border-[#FFC20E] ring-2 ring-[#FFC20E]/40 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header Badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                        approach.id === 'margins' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : approach.id === 'gsv'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : approach.id === 'balanced'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {approach.badge}
                      </span>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#FFC20E] border-amber-500 text-slate-900' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                      {approach.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                      {approach.tagline}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-2.5 leading-normal">
                      {approach.description}
                    </p>

                    {/* KEY PROJECTED KPIS */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Projected GSV:</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{approach.keyKPIs.projectedGSV}</span>
                          <span className={`ml-1 text-[10px] font-semibold ${approach.keyKPIs.gsvGrowth.startsWith('+') ? 'text-emerald-700' : 'text-slate-500'}`}>
                            ({approach.keyKPIs.gsvGrowth})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">SGM % Margin:</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{approach.keyKPIs.projectedSgmMargin}</span>
                          <span className={`ml-1 text-[10px] font-semibold ${approach.keyKPIs.marginBpsDelta.startsWith('+') ? 'text-emerald-700' : 'text-rose-700'}`}>
                            ({approach.keyKPIs.marginBpsDelta})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Trade Spend Required:</span>
                        <span className="font-mono font-bold text-slate-800">{approach.keyKPIs.tradeSpend}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Estimated Promo ROI:</span>
                        <span className="font-bold text-amber-700">{approach.keyKPIs.promoROI}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Risk Profile:</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          approach.keyKPIs.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {approach.keyKPIs.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Radio Button Action */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyApproach(approach.id);
                      }}
                      className={`w-full py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FFC20E] text-slate-900 shadow-2xs' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ Selected Approach' : 'Select This Approach'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* STEP 3 BOTTOM ACTION BAR */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded"
            >
              Back to Performance
            </button>
            <button
              onClick={() => {
                handleApplyApproach(selectedApproachId);
                setCurrentStep(4);
              }}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-5 py-2 rounded-md shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Step 4: SKU Allocations & Simulation</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: SUGGEST SKU ALLOCATIONS, ADD/REMOVE SKUS, & SIMULATE OUTCOMES */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-4">
          
          {/* STEP 4 TOP LIVE SIMULATION DASHBOARD */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Step 4: Configure SKU Allocations & Live Financial Simulation
                  </h2>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Strategy: {standardApproachCards.find(a => a.id === selectedApproachId)?.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust discount depths, trade allowances, or add/remove SKUs. The financial outcome updates live via econometric simulation.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAddSkuModalOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add SKU from Catalog</span>
                </button>

                <button
                  onClick={handleRunManualSimulation}
                  disabled={isSimulating}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} className={isSimulating ? 'animate-spin text-amber-400' : 'text-slate-300'} />
                  <span>{isSimulating ? 'Simulating...' : 'Recalculate Model'}</span>
                </button>

                <button
                  onClick={() => setSaveScenarioModalOpen(true)}
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-4 py-1.5 rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Save as Scenario</span>
                </button>
              </div>
            </div>

            {/* LIVE FINANCIAL OUTCOME STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Simulated GSV</span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  {simulatedTotals.totalGSVFormatted}
                </div>
                <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                  {simulatedTotals.gsvDeltaPct} vs FY2025
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">SGM Contribution Margin</span>
                <div className="text-base font-black text-emerald-700 mt-0.5">
                  {simulatedTotals.weightedMargin}%
                </div>
                <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                  Target Hurdle: 25.0% ✓
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Projected Volume Units</span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  {simulatedTotals.totalUnitsFormatted}
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Across {activeAllocatedSkus.length} active SKUs
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Committed Trade Spend</span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  {simulatedTotals.totalSpendFormatted}
                </div>
                <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
                  ROI: {simulatedTotals.roi}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Guardrail Tripwires</span>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mt-1">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>3 / 3 Hard Guardrails Passed</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Max TPR depth $\le 25\%$ ✓
                </span>
              </div>
            </div>
          </div>

          {/* SKU ALLOCATION & CONTROLS GRID */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">
                Detailed SKU Allocation Table ({skuAllocations.length} total SKUs · {activeAllocatedSkus.length} participating)
              </span>
              <span className="text-[11px] text-slate-500">
                Drag slider to simulate different discount depths
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase">
                    <th className="pb-2 w-10 text-center">Active</th>
                    <th className="pb-2">SKU Details</th>
                    <th className="pb-2 text-right">Base MSRP</th>
                    <th className="pb-2 text-center w-56">Simulate Discount Depth (%)</th>
                    <th className="pb-2 text-right">Promo Price</th>
                    <th className="pb-2 text-right">Trade Allowance</th>
                    <th className="pb-2 text-right">Simulated Units</th>
                    <th className="pb-2 text-right">Projected GSV</th>
                    <th className="pb-2 text-right">Margin %</th>
                    <th className="pb-2">Model Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {skuAllocations.map(sku => (
                    <tr 
                      key={sku.skuId}
                      className={`transition-colors ${!sku.included ? 'bg-slate-50/70 opacity-50' : 'hover:bg-slate-50/60'}`}
                    >
                      {/* Active Toggle Switch */}
                      <td className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={sku.included}
                          onChange={() => handleToggleSkuIncluded(sku.skuId)}
                          className="w-4 h-4 accent-[#FFC20E] rounded cursor-pointer"
                        />
                      </td>

                      {/* SKU Name & Brand */}
                      <td className="py-3 pr-2">
                        <div className="font-mono font-bold text-slate-900 text-[11px]">{sku.skuId}</div>
                        <div className="font-semibold text-slate-800 truncate max-w-xs">{sku.name}</div>
                        <div className="text-[10px] text-slate-500">{sku.brand} · {sku.category}</div>
                      </td>

                      {/* Base Price */}
                      <td className="py-3 text-right font-mono text-slate-500">
                        ${sku.basePrice.toFixed(2)}
                      </td>

                      {/* Interactive Discount Slider */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="5"
                            max="40"
                            step="0.5"
                            disabled={!sku.included}
                            value={sku.currentDiscountPct}
                            onChange={(e) => handleUpdateSkuDiscount(sku.skuId, parseFloat(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer disabled:opacity-30"
                          />
                          <span className="font-mono font-bold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-14 text-center shrink-0">
                            {sku.currentDiscountPct}%
                          </span>
                        </div>
                      </td>

                      {/* Promo Price */}
                      <td className="py-3 text-right font-mono font-bold text-slate-900">
                        ${sku.currentPromoPrice.toFixed(2)}
                      </td>

                      {/* Trade Spend Allowance */}
                      <td className="py-3 text-right font-mono text-slate-700">
                        ${(sku.tradeSpendAllocated / 1000).toFixed(0)}K
                      </td>

                      {/* Projected Units */}
                      <td className="py-3 text-right font-mono font-bold text-slate-900">
                        {sku.projectedUnits.toLocaleString()}
                      </td>

                      {/* Projected GSV */}
                      <td className="py-3 text-right font-mono font-bold text-slate-900">
                        ${(sku.projectedGSV / 1000).toFixed(0)}K
                      </td>

                      {/* Margin % */}
                      <td className="py-3 text-right">
                        <span className={`font-bold ${sku.projectedMargin >= 28 ? 'text-emerald-700' : 'text-slate-800'}`}>
                          {sku.projectedMargin}%
                        </span>
                      </td>

                      {/* Model Rationale */}
                      <td className="py-3 pl-2 max-w-xs">
                        <span className="text-[10px] text-slate-500 leading-tight block line-clamp-2">
                          {sku.rationale}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STEP 4 BOTTOM ACTION BAR */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded"
            >
              Back to Strategic Approaches
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSaveScenarioModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded shadow-xs cursor-pointer transition-all"
              >
                Save as Scenario
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-5 py-2 rounded shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Proceed to Step 5: Compare & Salesforce Sync</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: SAVE AND COMPARE SCENARIOS + CONFIRM TO SALESFORCE PROMO PLANNING */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-5">
          
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Step 5: Scenario Comparison & Salesforce Promo Planning Confirmation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare saved scenarios side-by-side against last year's baseline, select the winning strategy, and push the confirmed campaign to Salesforce Promo Planning.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Back to Allocations
                </button>
                <button
                  onClick={() => setIsSalesforceModalOpen(true)}
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-4 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Cloud size={14} />
                  <span>Push to Salesforce TPM</span>
                </button>
              </div>
            </div>
          </div>

          {/* SCENARIO COMPARISON MATRIX CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* CARD 0: LAST YEAR BASELINE (FY2025 ACTUALS) */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                  HISTORICAL BASELINE
                </span>
                <span className="text-[10px] text-slate-500">FY2025 Closed</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">FY2025 Actuals (Unchanged)</h3>
              <p className="text-[11px] text-slate-500">The actual historical performance baseline across the selected PCRs.</p>

              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Gross Sales (GSV):</span>
                  <span className="font-bold text-slate-900">$32.1M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SGM Margin %:</span>
                  <span className="font-bold text-slate-900">27.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Committed Trade Spend:</span>
                  <span className="font-mono text-slate-700">$8.6M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Volume Units:</span>
                  <span className="font-mono text-slate-700">324.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Promo ROI:</span>
                  <span className="font-bold text-slate-700">1.88x</span>
                </div>
              </div>
            </div>

            {/* CARDS 1 & 2: SAVED SCENARIOS */}
            {savedScenarios.slice(0, 2).map((scen, sIdx) => {
              const isSelected = selectedScenarioForSalesforce === scen.id;

              return (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenarioForSalesforce(scen.id)}
                  className={`bg-white rounded-lg p-4 text-xs space-y-3 border-2 transition-all cursor-pointer shadow-2xs ${
                    isSelected ? 'border-[#FFC20E] ring-2 ring-amber-200 bg-amber-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {scen.approachName}
                    </span>
                    {scen.isConfirmedToSalesforce ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                        <CheckCircle2 size={10} /> Synced
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Draft Scenario</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{scen.name}</h3>
                  <p className="text-[11px] text-slate-500">Created: {scen.createdAt} · {scen.skuCount} active SKUs</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Gross Sales (GSV):</span>
                      <span className="font-bold text-slate-900">{scen.gsvFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">SGM Margin %:</span>
                      <span className="font-bold text-emerald-700">{scen.marginFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Committed Trade Spend:</span>
                      <span className="font-mono text-slate-700">{scen.tradeSpendFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Volume Units:</span>
                      <span className="font-mono text-slate-700">{scen.unitsFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Promo ROI:</span>
                      <span className="font-bold text-amber-700">{scen.roi}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScenarioForSalesforce(scen.id);
                      }}
                      className={`w-full py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#FFC20E] text-slate-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ Selected for Salesforce Sync' : 'Select for Salesforce Sync'}
                    </button>
                  </div>
                </div>
              );
            })}

          </div>

          {/* SALESFORCE PROMO PLANNING CONFIRMATION BOX */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg shrink-0 mt-0.5">
                  <Cloud size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Confirm Scenario to Salesforce Promo Planning (Consumer Goods Cloud)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                    Pushing this confirmed scenario synchronizes customer promo agreements, circular event dates, SKU allowance commitments, and SAP Vistex pricing condition records directly to your enterprise Salesforce TPM instance.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSalesforceModalOpen(true)}
                className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-5 py-2.5 rounded-md shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Cloud size={15} />
                <span>Confirm & Push to Salesforce</span>
              </button>
            </div>

            {/* Salesforce Staging Payload Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Selected Scenario</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {savedScenarios.find(s => s.id === selectedScenarioForSalesforce)?.name || 'Scenario B: Margin Expansion'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target Salesforce TPM Account</span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  The Home Depot (US Commercial)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Promotional Campaign Object</span>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">
                  SFDC-PRM-2026-99021
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Trade Fund Accrual Commitment</span>
                <span className="font-mono font-bold text-amber-700 block mt-0.5">
                  {savedScenarios.find(s => s.id === selectedScenarioForSalesforce)?.tradeSpendFormatted || '$6.1M'}
                </span>
              </div>
            </div>

            {syncedReceipt && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-xs flex items-center justify-between text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>
                    Successfully synchronized to Salesforce TPM at <strong>{syncedReceipt.time}</strong>. Record ID: <strong className="font-mono">{syncedReceipt.id}</strong>.
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Active in Salesforce
                </span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SKU TO PROMOTION FROM SBD CATALOG */}
      {/* ========================================================================= */}
      {isAddSkuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus size={15} className="text-amber-600" />
                <span>Add SKU from Stanley Black & Decker Catalog</span>
              </h3>
              <button onClick={() => setIsAddSkuModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Browse candidate hero SKUs from the SBD portfolio to include in this promotional event:
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {catalogCatalogCandidateSkus.map(candidate => (
                <div 
                  key={candidate.skuId}
                  className="p-3 rounded border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-mono font-bold text-slate-900">{candidate.skuId}</div>
                    <div className="font-semibold text-slate-800 text-xs">{candidate.name}</div>
                    <div className="text-[10px] text-slate-500">Base: ${candidate.basePrice.toFixed(2)} · Elasticity: {candidate.elasticityIndex}x</div>
                  </div>

                  <button
                    onClick={() => {
                      setSkuAllocations(prev => [...prev, { ...candidate, included: true }]);
                      setIsAddSkuModalOpen(false);
                      triggerToast(`Added ${candidate.skuId} (${candidate.name}) to allocation.`);
                    }}
                    className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-3 py-1.5 rounded cursor-pointer shrink-0"
                  >
                    + Add to Plan
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsAddSkuModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SAVE CURRENT SCENARIO */}
      {/* ========================================================================= */}
      {saveScenarioModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={15} className="text-amber-600" />
                <span>Save Current Optimization as Scenario</span>
              </h3>
              <button onClick={() => setSaveScenarioModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Scenario Name</label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g. Scenario C: Father's Day Balanced Margin"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <div>· Strategy Applied: <strong>{standardApproachCards.find(a => a.id === selectedApproachId)?.title}</strong></div>
                <div>· Active Participating SKUs: <strong>{activeAllocatedSkus.length} SKUs</strong></div>
                <div>· Projected GSV: <strong>{simulatedTotals.totalGSVFormatted}</strong> ({simulatedTotals.gsvDeltaPct})</div>
                <div>· SGM Margin: <strong>{simulatedTotals.weightedMargin}%</strong></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSaveScenarioModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCurrentScenario}
                disabled={!newScenarioName.trim()}
                className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold text-xs px-4 py-1.5 rounded cursor-pointer"
              >
                Save & Compare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SALESFORCE PROMO PLANNING CONFIRMATION FLOW */}
      {/* ========================================================================= */}
      {isSalesforceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded">
                  <Cloud size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Confirm to Salesforce Promo Planning
                </h3>
              </div>
              <button onClick={() => setIsSalesforceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are about to commit the selected scenario into Salesforce Trade Promotion Management (TPM) and lock pricing condition records in SAP Vistex:
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Selected Scenario:</span>
                <span className="font-bold text-slate-900">{savedScenarios.find(s => s.id === selectedScenarioForSalesforce)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Retail Partner / Customer:</span>
                <span className="font-semibold text-slate-800">The Home Depot (US Commercial)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Projected GSV Revenue:</span>
                <span className="font-mono font-bold text-slate-900">{savedScenarios.find(s => s.id === selectedScenarioForSalesforce)?.gsvFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trade Funds Accrual:</span>
                <span className="font-mono font-bold text-amber-700">{savedScenarios.find(s => s.id === selectedScenarioForSalesforce)?.tradeSpendFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active SKUs Committed:</span>
                <span className="font-bold text-slate-800">{savedScenarios.find(s => s.id === selectedScenarioForSalesforce)?.skuCount} SKUs</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSalesforceModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePushToSalesforce();
                  setIsSalesforceModalOpen(false);
                }}
                disabled={isSalesforceSyncing}
                className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-5 py-2 rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Cloud size={14} />
                <span>Confirm & Push</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 9: FLOATING PROMO ASSISTANT (SAME COPILOT AS PROMO EVENTS) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 right-5 z-40 font-sans">
        {!isAssistantOpen ? (
          <button
            onClick={() => {
              setIsAssistantOpen(true);
              setIsAssistantMinimized(false);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-2xl border-2 border-[#FFC20E] flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
            title="Open SBD Promo Copilot"
          >
            <Bot size={18} className="text-[#FFC20E]" />
            <span className="text-xs font-bold pr-1">Promo Copilot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        ) : (
          <div className={`bg-white border border-slate-200 rounded-xl shadow-2xl transition-all flex flex-col font-sans overflow-hidden ${
            isAssistantMinimized ? 'w-80 h-12' : 'w-96 h-[480px]'
          }`}>
            {/* Assistant Header */}
            <div className="bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-400 text-slate-900 rounded">
                  <Bot size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">SBD Promo Intelligence Agent</div>
                  <div className="text-[10px] text-amber-300 font-medium mt-0.5">Connected to ML Elasticity Model</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAssistantMinimized(prev => !prev)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {isAssistantMinimized ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Chat Body (when not minimized) */}
            {!isAssistantMinimized && (
              <>
                <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-[#FAFBFD]">
                  {assistantMessages.map(msg => (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none'
                      }`}>
                        <div className="whitespace-pre-line">{msg.text}</div>
                      </div>

                      {/* Chips if provided */}
                      {msg.chips && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.chips.map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleSendAssistantQuery(chip)}
                              className="text-[10px] font-semibold text-slate-700 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 px-2 py-1 rounded transition-colors cursor-pointer text-left"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAssistantQuery();
                  }}
                  className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    placeholder="Ask about margins, elasticity, or Salesforce sync..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 p-1.5 rounded cursor-pointer shrink-0"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
