import React, { useState } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  FileText, 
  Printer, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';
import { ModelType, modelMetadataMap, GovernanceRuleSettings } from './dsMockData';
import { DsFilterState } from './ModelSwitcherHeader';

interface ModelAuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel: ModelType;
  filters: DsFilterState;
  settings: GovernanceRuleSettings;
}

export default function ModelAuditReportModal({
  isOpen,
  onClose,
  activeModel,
  filters,
  settings
}: ModelAuditReportModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const meta = modelMetadataMap[activeModel];

  const handleSimulatedDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportedSuccess(true);
      setTimeout(() => {
        setExportedSuccess(false);
      }, 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#FFC20E] text-black font-black rounded text-xs uppercase">
              SBD
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Model Risk Governance & Audit Certificate (PDF)</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">
                  PASSED AUDIT
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Validation Report for Stanley Black & Decker Commercial AI Roadmap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL REPORT BODY (SCROLLABLE PRINT-READY SHEET) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 bg-[#FAFAFA]">
          
          {/* REPORT HEADER BLOCK */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Document ID: SBD-MRG-2026-AI-88392
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                {meta.name} (v3.4.1)
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span>Target: {meta.targetMetric}</span>
                <span>•</span>
                <span>Module: {meta.powersModule}</span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="text-[10px] uppercase font-bold text-slate-400">Audit Status</div>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1 sm:justify-end mt-0.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Production Approved</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* AUDIT SCOPE & CONTEXT */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
              1. Commercial Scope & Data Lineage
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Super SBU</span>
                <span className="font-semibold text-slate-800">{filters.superSbu}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Category</span>
                <span className="font-semibold text-slate-800">{filters.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Brand Target</span>
                <span className="font-semibold text-slate-800">{filters.brand}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Customer Account</span>
                <span className="font-semibold text-slate-800">{filters.customer}</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Source Engine: <strong>Snowflake Feature Store (Model Mart v3.4.1)</strong></span>
              <span>Training Samples: <strong>{meta.sampleSize}</strong></span>
            </div>
          </div>

          {/* STATISTICAL VALIDATION BENCHMARKS */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
              2. Backtest & Goodness-of-Fit Telemetry
            </h4>
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans uppercase">Holdout MAPE</div>
                <div className="text-base font-bold text-slate-900">{meta.mape}%</div>
                <div className="text-[9px] text-emerald-600 font-sans font-semibold">Under 5% Threshold</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans uppercase">R² Variance Ratio</div>
                <div className="text-base font-bold text-slate-900">{meta.r2}</div>
                <div className="text-[9px] text-emerald-600 font-sans font-semibold">High Explanatory Power</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans uppercase">Population Drift (PSI)</div>
                <div className="text-base font-bold text-slate-900">{meta.psiScore}</div>
                <div className="text-[9px] text-emerald-600 font-sans font-semibold">Low Feature Drift</div>
              </div>
            </div>
          </div>

          {/* ACTIVE GOVERNANCE BOUNDARIES */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
              3. Enforced Human-in-the-Loop Governance Limits
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Own Elasticity Floor Clamp:</span>
                <span className="font-mono font-bold text-slate-900">ε = {settings.minElasticityFloor.toFixed(1)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Own Elasticity Ceiling Clamp:</span>
                <span className="font-mono font-bold text-slate-900">ε = {settings.maxElasticityCeiling.toFixed(1)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Maximum External Transference Leakage:</span>
                <span className="font-mono font-bold text-slate-900">≤ {settings.maxTransferenceLeakagePct}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Promo Cannibalization Tolerance Ceiling:</span>
                <span className="font-mono font-bold text-slate-900">≤ {settings.promoCannibalizationCeilingPct}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Statistical Fallback Strategy:</span>
                <span className="font-medium text-slate-900">{settings.fallbackHeuristic} ({settings.confidenceClamping} Confidence)</span>
              </div>
            </div>
          </div>

          {/* SIGN-OFF BLOCK */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-full">
                <UserCheck size={18} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Model Risk Committee Sign-Off</div>
                <div className="text-[11px] text-slate-500">
                  Approved for FY2026 Commercial RGM Deployment across Home Depot & Lowe's
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">
              HASH: 8f9b4e12c6a0d331
            </div>
          </div>

        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {exportedSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Audit Report PDF generated and exported successfully!
              </span>
            ) : (
              <span>Format: Standard Enterprise ISO 9001 AI Risk Governance PDF</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSimulatedDownload}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-[#FFC20E] font-bold text-xs uppercase tracking-wider rounded transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isExporting ? 'Generating PDF...' : 'Download Signed PDF'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
