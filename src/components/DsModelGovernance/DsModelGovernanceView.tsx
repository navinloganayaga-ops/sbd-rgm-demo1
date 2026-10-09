import React, { useState } from 'react';
import { 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  Layers, 
  Percent, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import ModelSwitcherHeader, { DsFilterState } from './ModelSwitcherHeader';
import ModelHealthScorecard from './ModelHealthScorecard';
import ShapImportancePanel from './ShapImportancePanel';
import TransferenceDeepDive from './TransferenceDeepDive';
import ElasticityDeepDive from './ElasticityDeepDive';
import PromoLiftDeepDive from './PromoLiftDeepDive';
import BusinessGuardrailsPanel from './BusinessGuardrailsPanel';
import ModelAuditReportModal from './ModelAuditReportModal';
import { 
  ModelType, 
  GovernanceRuleSettings, 
  AuditLogEntry, 
  initialAuditLogs,
  modelMetadataMap 
} from './dsMockData';
import { NavItem } from '../Sidebar';

interface DsModelGovernanceViewProps {
  onNavigateTab?: (tab: NavItem) => void;
}

export default function DsModelGovernanceView({ onNavigateTab }: DsModelGovernanceViewProps) {
  // 1. ACTIVE MODEL STATE
  const [activeModel, setActiveModel] = useState<ModelType>('transference');

  // 2. CONTEXT FILTERS STATE
  const [filters, setFilters] = useState<DsFilterState>({
    superSbu: 'Tools & Outdoor',
    category: 'Power Tools',
    brand: 'DeWalt',
    customer: 'The Home Depot',
    timeframe: 'FY2026'
  });

  // 3. BUSINESS GOVERNANCE SETTINGS STATE
  const [settings, setSettings] = useState<GovernanceRuleSettings>({
    minElasticityFloor: -3.0,
    maxElasticityCeiling: -0.5,
    maxTransferenceLeakagePct: 25,
    promoCannibalizationCeilingPct: 18,
    confidenceClamping: '95%',
    fallbackHeuristic: 'Empirical Bayes Shrinkage',
    lastModifiedBy: 'Channel RGM Lead (Home Depot)',
    lastModifiedAt: '2026-10-08 14:22 UTC',
    isDefault: true
  });

  // 4. AUDIT LOGS STATE
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  // 5. TOAST NOTIFICATION STATE
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // 6. MODAL STATE FOR AUDIT REPORT
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleSaveOverrides = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      user: 'Channel RGM Lead (Home Depot)',
      ruleName: `${modelMetadataMap[activeModel].shortName} Overrides`,
      changeSummary: `Applied custom guardrails: Leakage ≤ ${settings.maxTransferenceLeakagePct}%, Floor ε = ${settings.minElasticityFloor.toFixed(1)}, Cannibalization ≤ ${settings.promoCannibalizationCeilingPct}%`,
      status: 'Enforced'
    };

    setAuditLogs([newEntry, ...auditLogs]);
    setSettings(prev => ({ ...prev, isDefault: false }));
    showToast('Rule overrides successfully saved & pushed to RGM model registry.', 'success');
  };

  const handleResetBaseline = () => {
    setSettings({
      minElasticityFloor: -3.0,
      maxElasticityCeiling: -0.5,
      maxTransferenceLeakagePct: 25,
      promoCannibalizationCeilingPct: 18,
      confidenceClamping: '95%',
      fallbackHeuristic: 'Empirical Bayes Shrinkage',
      lastModifiedBy: 'System Auto-Reset',
      lastModifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      isDefault: true
    });
    showToast('Reverted all limits to unconstrained raw machine learning baseline.', 'info');
  };

  const currentMeta = modelMetadataMap[activeModel];

  // Helper to jump to downstream simulator powered by this model
  const handleJumpToDownstreamModule = () => {
    if (!onNavigateTab) return;
    if (activeModel === 'transference') {
      onNavigateTab('assortment_planner');
    } else if (activeModel === 'elasticity') {
      onNavigateTab('strategic_pricing');
    } else if (activeModel === 'promo_lift') {
      onNavigateTab('trade_promotions');
    }
  };

  return (
    <div className="relative font-sans space-y-6 pb-12">
      
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-md shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-200 text-xs">
          {toastMessage.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          {toastMessage.type === 'info' && <Info size={16} className="text-[#FFC20E] shrink-0" />}
          {toastMessage.type === 'warning' && <AlertTriangle size={16} className="text-rose-400 shrink-0" />}
          <span className="font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. GLOBAL MODEL SWITCHER HEADER & CONTEXT FILTERS */}
      <ModelSwitcherHeader
        activeModel={activeModel}
        onSelectModel={(m) => {
          setActiveModel(m);
          showToast(`Switched view to ${modelMetadataMap[m].name}`, 'info');
        }}
        filters={filters}
        onFilterChange={(f) => {
          setFilters(f);
          showToast('Updated governance filters for ' + f.customer, 'info');
        }}
        onExportAuditReport={() => setIsAuditModalOpen(true)}
        isCustomGovernanceActive={!settings.isDefault}
      />

      {/* 2 & 3. TOP DUAL PANELS: MODEL HEALTH (LEFT) & SHAP FEATURE IMPORTANCE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* TOP-LEFT (6 COLS): MODEL HEALTH & BACKTEST SCORECARD */}
        <div className="lg:col-span-6">
          <ModelHealthScorecard activeModel={activeModel} />
        </div>

        {/* TOP-RIGHT (6 COLS): GLOBAL FEATURE IMPORTANCE (SHAP VALUES) */}
        <div className="lg:col-span-6">
          <ShapImportancePanel activeModel={activeModel} />
        </div>
      </div>

      {/* 4. DYNAMIC MODEL DEEP-DIVE INSPECTOR (CENTER PANEL) */}
      <div className="bg-slate-50/50 border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC20E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Inspector: {currentMeta.name}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              Powers: <strong className="text-slate-700">{currentMeta.powersModule}</strong>
            </span>
          </div>

          {onNavigateTab && (
            <button
              onClick={handleJumpToDownstreamModule}
              className="text-xs font-semibold text-slate-700 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Launch {currentMeta.powersModule}</span>
              <ArrowRight size={13} className="text-amber-600" />
            </button>
          )}
        </div>

        {/* RENDER ACTIVE DEEP-DIVE SUBCOMPONENT */}
        {activeModel === 'transference' && <TransferenceDeepDive />}
        {activeModel === 'elasticity' && <ElasticityDeepDive />}
        {activeModel === 'promo_lift' && <PromoLiftDeepDive />}
      </div>

      {/* 5. BUSINESS GUARDRAILS & OVERRIDE CONTROLS (BOTTOM PANEL) */}
      <BusinessGuardrailsPanel
        settings={settings}
        onUpdateSettings={setSettings}
        onSaveOverrides={handleSaveOverrides}
        onResetBaseline={handleResetBaseline}
        auditLogs={auditLogs}
      />

      {/* 6. MODEL AUDIT REPORT MODAL (PDF EXPORT) */}
      <ModelAuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        activeModel={activeModel}
        filters={filters}
        settings={settings}
      />

    </div>
  );
}
