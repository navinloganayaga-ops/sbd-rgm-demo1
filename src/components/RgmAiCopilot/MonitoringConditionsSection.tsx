import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  PauseCircle,
  PlayCircle,
  ArrowUpRight
} from 'lucide-react';
import { 
  GuardrailCondition, 
  getSharedGuardrails, 
  saveSharedGuardrails 
} from '../../utils/guardrailStore';

interface MonitoringConditionsSectionProps {
  onTriggerInvestigation: (condition: GuardrailCondition) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'sync') => void;
}

export default function MonitoringConditionsSection({
  onTriggerInvestigation,
  onShowToast,
}: MonitoringConditionsSectionProps) {
  const [conditions, setConditions] = useState<GuardrailCondition[]>(getSharedGuardrails());
  const [filterMode, setFilterMode] = useState<'all' | 'compliant' | 'warning'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // New Condition Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleMetric, setNewRuleMetric] = useState('GTN Spend');
  const [newRuleCondition, setNewRuleCondition] = useState('exceeds plan by >');
  const [newRuleThreshold, setNewRuleThreshold] = useState('5%');
  const [newRuleBrand, setNewRuleBrand] = useState('DeWalt');

  // Synchronize on external changes
  useEffect(() => {
    const handleUpdate = () => {
      setConditions(getSharedGuardrails());
    };
    window.addEventListener('rgm-guardrails-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('rgm-guardrails-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleRunVerification = () => {
    setIsVerifying(true);
    onShowToast(
      'Live Verification Started',
      'Scanning active PCR events and Snowflake POS actuals against guardrails...',
      'sync'
    );

    setTimeout(() => {
      setIsVerifying(false);
      const updated = conditions.map(c => ({
        ...c,
        lastChecked: 'Just now'
      }));
      setConditions(updated);
      saveSharedGuardrails(updated);
      onShowToast(
        'Verification Complete',
        `Evaluated ${conditions.length} guardrails: 3 compliant, 1 active breach on PCR-2026-0835.`,
        'success'
      );
    }, 1000);
  };

  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newCondition: GuardrailCondition = {
      id: `gr-${Date.now()}`,
      name: newRuleName.trim(),
      metric: newRuleMetric,
      condition: newRuleCondition,
      threshold: newRuleThreshold,
      brand: newRuleBrand,
      status: 'active',
      lastChecked: 'Just now',
      violationsCount: 0,
      violationDetail: `Continuous surveillance configured for ${newRuleMetric} ${newRuleCondition} ${newRuleThreshold} on ${newRuleBrand}.`
    };

    const next = [newCondition, ...conditions];
    setConditions(next);
    saveSharedGuardrails(next);
    setIsAddModalOpen(false);
    setNewRuleName('');
    onShowToast(
      'Condition Added',
      `"${newCondition.name}" is now monitored continuously.`,
      'success'
    );
  };

  const handleToggleStatus = (id: string) => {
    const next = conditions.map(c => {
      if (c.id === id) {
        const nextStatus: GuardrailCondition['status'] = c.status === 'dormant' ? 'active' : 'dormant';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setConditions(next);
    saveSharedGuardrails(next);
    onShowToast('Condition Updated', 'Updated condition monitoring state.', 'info');
  };

  const activeViolations = conditions.filter(c => c.status === 'warning' || c.violationsCount > 0);
  const compliantCount = conditions.filter(c => c.status === 'active' && c.violationsCount === 0).length;

  const filteredConditions = conditions.filter(c => {
    if (filterMode === 'compliant') return c.status === 'active' && c.violationsCount === 0;
    if (filterMode === 'warning') return c.status === 'warning' || c.violationsCount > 0;
    return true;
  });

  return (
    <div className="bg-slate-50/80 border-t border-slate-200/80 px-5 py-3.5 shrink-0 transition-all font-sans">
      
      {/* SECTION HEADER: SUBTLE & REFINED */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            title={isCollapsed ? 'Expand monitoring conditions' : 'Collapse section'}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-semibold text-slate-800 tracking-tight group-hover:text-slate-950 transition-colors">
                Monitoring conditions
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">
                {conditions.length} active
              </span>
              {activeViolations.length > 0 && (
                <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {activeViolations.length} alert
                </span>
              )}
            </div>

            {isCollapsed ? (
              <ChevronUp size={13} className="text-slate-400 group-hover:text-slate-600 ml-0.5 transition-transform" />
            ) : (
              <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-600 ml-0.5 transition-transform" />
            )}
          </button>

          <span className="hidden lg:inline text-[11px] text-slate-400 border-l border-slate-200 pl-3">
            Real-time surveillance across margin floors, spend caps, and promo ROI
          </span>
        </div>

        {/* HEADER CONTROLS */}
        <div className="flex items-center gap-2">
          {/* Subtle Filter Toggle */}
          <div className="flex items-center bg-slate-200/60 p-0.5 rounded text-[11px]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                filterMode === 'all' 
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({conditions.length})
            </button>
            <button
              onClick={() => setFilterMode('compliant')}
              className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                filterMode === 'compliant' 
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Compliant ({compliantCount})
            </button>
            <button
              onClick={() => setFilterMode('warning')}
              className={`px-2 py-0.5 rounded font-medium transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'warning' 
                  ? 'bg-white text-rose-700 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {activeViolations.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              Alerts ({activeViolations.length})
            </button>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition-colors cursor-pointer disabled:opacity-50"
            title="Scan events against active guardrails"
          >
            <RefreshCw size={13} className={isVerifying ? 'animate-spin text-amber-600' : ''} />
          </button>

          {/* Add Condition Subtle Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus size={12} className="text-slate-500" />
            <span>Add condition</span>
          </button>
        </div>
      </div>

      {/* MONITORING CONDITIONS CARDS GRID: CLEAN, READABLE, SUBTLE */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5 pt-1">
          {filteredConditions.map((cond) => {
            const isWarning = cond.status === 'warning' || cond.violationsCount > 0;
            const isDormant = cond.status === 'dormant';

            return (
              <div
                key={cond.id}
                className={`p-3 rounded-lg border transition-all relative flex flex-col justify-between ${
                  isWarning
                    ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                    : isDormant
                    ? 'bg-slate-100/50 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200/70 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  {/* CARD TOP ROW: TITLE & STATUS INDICATOR */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                      {cond.name}
                    </h4>

                    {isWarning ? (
                      <span className="shrink-0 inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Alert
                      </span>
                    ) : isDormant ? (
                      <span className="shrink-0 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        Paused
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-1.5 py-0.5 rounded font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Compliant
                      </span>
                    )}
                  </div>

                  {/* READABLE CONDITION SPECIFICATION */}
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span className="font-medium text-slate-700">{cond.brand}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{cond.metric}</span>
                    <span className="font-mono text-slate-800 bg-slate-100/80 border border-slate-200/60 px-1.5 py-0.2 rounded text-[10px]">
                      {cond.condition} {cond.threshold}
                    </span>
                  </div>

                  {/* DETAIL / OBSERVATION (SUBTLE & INFORMATIVE) */}
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                    isWarning ? 'text-rose-700 font-medium' : 'text-slate-500'
                  }`}>
                    {cond.violationDetail || 'Scanned and compliant against active commercial plan.'}
                  </p>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={10} className="text-slate-400" />
                    <span>{cond.lastChecked}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(cond.id)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-slate-100"
                      title={isDormant ? 'Resume surveillance' : 'Pause surveillance'}
                    >
                      {isDormant ? 'Resume' : 'Mute'}
                    </button>

                    <button
                      onClick={() => onTriggerInvestigation(cond)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        isWarning
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      <Sparkles size={11} className={isWarning ? 'text-white' : 'text-slate-500'} />
                      <span>{isWarning ? 'Investigate' : 'Audit'}</span>
                      <ArrowUpRight size={10} className="opacity-70" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TO ADD NEW CONDITION: CLEAN & PROFESSIONAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden font-sans">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#FFC20E]" />
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  Add Monitoring Condition
                </h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddCondition} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Condition Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home Depot GTN Variance Guardrail"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Target Brand / Scope
                  </label>
                  <select
                    value={newRuleBrand}
                    onChange={(e) => setNewRuleBrand(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="DeWalt">DeWalt (PTG)</option>
                    <option value="Stanley">Stanley (HTAS)</option>
                    <option value="Craftsman">Craftsman</option>
                    <option value="Irwin">Irwin</option>
                    <option value="All Brands">All SBD Portfolio</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Monitoring Metric
                  </label>
                  <select
                    value={newRuleMetric}
                    onChange={(e) => setNewRuleMetric(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="GTN Spend">GTN Spend vs Plan</option>
                    <option value="SGM Margin">SGM Margin Floor</option>
                    <option value="Promo ROI">Promo ROI Threshold</option>
                    <option value="POS Elasticity">POS Elasticity Sensitivity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Condition Rule
                  </label>
                  <select
                    value={newRuleCondition}
                    onChange={(e) => setNewRuleCondition(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="exceeds plan by >">exceeds plan by &gt;</option>
                    <option value="drops below floor">drops below floor</option>
                    <option value="falls below">falls below</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Threshold Value
                  </label>
                  <input
                    type="text"
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(e.target.value)}
                    placeholder="5%"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ShieldCheck size={13} className="text-[#FFC20E]" />
                  <span>Deploy Condition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
