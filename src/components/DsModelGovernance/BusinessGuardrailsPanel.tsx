import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  Check, 
  History, 
  HelpCircle, 
  Sparkles, 
  Cpu, 
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GovernanceRuleSettings, AuditLogEntry, initialAuditLogs } from './dsMockData';

interface BusinessGuardrailsPanelProps {
  settings: GovernanceRuleSettings;
  onUpdateSettings: (newSettings: GovernanceRuleSettings) => void;
  onSaveOverrides: () => void;
  onResetBaseline: () => void;
  auditLogs: AuditLogEntry[];
}

export default function BusinessGuardrailsPanel({
  settings,
  onUpdateSettings,
  onSaveOverrides,
  onResetBaseline,
  auditLogs
}: BusinessGuardrailsPanelProps) {
  const [showAuditHistory, setShowAuditHistory] = useState<boolean>(false);

  const isModified = !settings.isDefault;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs font-sans">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-900 text-[#FFC20E] rounded border border-slate-800">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Business Guardrails & Model Override Controls
              </h3>
              {isModified ? (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                  Custom Governance Enforced
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                  Raw ML Baseline Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Enforce commercial boundary limits to prevent statistical edge-case anomalies and protect SBD profit margins
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuditHistory(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
          >
            <History size={13} />
            <span>Audit Trail ({auditLogs.length})</span>
            {showAuditHistory ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <button
            onClick={onResetBaseline}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
            title="Revert all limits to unconstrained machine learning predictions"
          >
            <RotateCcw size={13} />
            <span>Reset to Raw ML Baseline</span>
          </button>

          <button
            onClick={onSaveOverrides}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#FFC20E] hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider rounded transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Save size={14} className="text-black" />
            <span>Save Rule Overrides</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        
        {/* CONTROL 1: ELASTICITY FLOOR & CEILING LIMITERS */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Elasticity Floor Limiter</span>
              <span className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-amber-800">
                ε = {settings.minElasticityFloor.toFixed(1)}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Caps extreme raw elasticity values. Model cannot assume sensitivity steeper than this floor.
            </p>
            <input
              type="range"
              min={-4.5}
              max={-1.5}
              step={0.1}
              value={settings.minElasticityFloor}
              onChange={(e) => onUpdateSettings({
                ...settings,
                minElasticityFloor: parseFloat(e.target.value),
                isDefault: false
              })}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
              <span>-4.5 (Permissive)</span>
              <span>-3.0 (Target)</span>
              <span>-1.5 (Strict)</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/70">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Elasticity Ceiling Limiter</span>
              <span className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-amber-800">
                ε = {settings.maxElasticityCeiling.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={-1.2}
              max={-0.1}
              step={0.1}
              value={settings.maxElasticityCeiling}
              onChange={(e) => onUpdateSettings({
                ...settings,
                maxElasticityCeiling: parseFloat(e.target.value),
                isDefault: false
              })}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
              <span>-1.2</span>
              <span>-0.5 (Inelastic Cap)</span>
              <span>-0.1</span>
            </div>
          </div>
        </div>

        {/* CONTROL 2: MAX TRANSFERENCE LEAKAGE THRESHOLD (%) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Max External Leakage Cap</span>
              <span className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-rose-800">
                ≤ {settings.maxTransferenceLeakagePct}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Restricts maximum volume transferred to external competitors (Milwaukee/Ryobi) during assortment rationalization.
            </p>
            <input
              type="range"
              min={10}
              max={45}
              step={1}
              value={settings.maxTransferenceLeakagePct}
              onChange={(e) => onUpdateSettings({
                ...settings,
                maxTransferenceLeakagePct: parseInt(e.target.value),
                isDefault: false
              })}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
              <span>10% (Strict)</span>
              <span>25% (SBD Standard)</span>
              <span>45% (Unbounded)</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-slate-600 bg-white/70 p-2 rounded">
            <strong>Enforcement Logic:</strong> Excess external leakage over {settings.maxTransferenceLeakagePct}% is forced into Craftsman & Stanley sister SKUs.
          </div>
        </div>

        {/* CONTROL 3: PROMO CANNIBALIZATION CEILING (%) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Cannibalization Tolerance</span>
              <span className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-amber-800">
                ≤ {settings.promoCannibalizationCeilingPct}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Triggers warning flag in Promo Simulator if promotion robs more than {settings.promoCannibalizationCeilingPct}% of volume from adjacent DeWalt SKUs.
            </p>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={settings.promoCannibalizationCeilingPct}
              onChange={(e) => onUpdateSettings({
                ...settings,
                promoCannibalizationCeilingPct: parseInt(e.target.value),
                isDefault: false
              })}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
              <span>5% (Low Drag)</span>
              <span>18% (Standard)</span>
              <span>35% (Permissive)</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-slate-600 bg-white/70 p-2 rounded">
            <strong>Protects:</strong> High-margin XR brushless SKUs from heavy promotional discount cannibalization.
          </div>
        </div>

        {/* CONTROL 4: CONFIDENCE INTERVAL & FALLBACK STRATEGY */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
              <span>Statistical Confidence Clamp</span>
              <span className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-900">
                {settings.confidenceClamping}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
              Clamps predictive outputs within selected confidence tolerance bands.
            </p>
            <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded border border-slate-200 text-xs">
              {(['90%', '95%', '99%'] as const).map(conf => (
                <button
                  key={conf}
                  onClick={() => onUpdateSettings({ ...settings, confidenceClamping: conf, isDefault: false })}
                  className={`py-1 text-center font-bold text-[11px] rounded transition-colors cursor-pointer ${
                    settings.confidenceClamping === conf
                      ? 'bg-slate-900 text-[#FFC20E]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {conf}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/70">
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Low-Sample Heuristic Fallback:
            </label>
            <select
              value={settings.fallbackHeuristic}
              onChange={(e) => onUpdateSettings({
                ...settings,
                fallbackHeuristic: e.target.value as any,
                isDefault: false
              })}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Empirical Bayes Shrinkage">Empirical Bayes Shrinkage (Default)</option>
              <option value="Regional Category Roll-Up">Regional Category Roll-Up</option>
              <option value="Historical SKU Median">Historical SKU Median</option>
            </select>
          </div>
        </div>

      </div>

      {/* COLLAPSIBLE AUDIT TRAIL LOG */}
      {showAuditHistory && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <History size={14} className="text-amber-600" />
              <span>Model Risk Governance Audit Trail</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              Logged in Snowflake Model Governance Ledger · Immutably Timestamped
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 text-slate-600 font-bold text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Timestamp (UTC)</th>
                  <th className="py-2 px-3">Authorized Actor</th>
                  <th className="py-2 px-3">Rule Modified</th>
                  <th className="py-2 px-3">Parameter Adjustment</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{log.user}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{log.ruleName}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">{log.changeSummary}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {log.status}
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
}
