import React, { useState, useEffect } from 'react';
import { CheckCircle2, RefreshCw, Server, ShieldCheck, X } from 'lucide-react';

interface ErpPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  payloadSummary: string;
}

export default function ErpPushModal({ isOpen, onClose, agentName, payloadSummary }: ErpPushModalProps) {
  const [step, setStep] = useState<'validating' | 'syncing' | 'completed'>('validating');

  useEffect(() => {
    if (isOpen) {
      setStep('validating');
      const timer1 = setTimeout(() => setStep('syncing'), 1500);
      const timer2 = setTimeout(() => setStep('completed'), 3500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-lg w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFC20E] text-slate-900 p-2 rounded-sm">
              <Server size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                Enterprise Integration
              </span>
              <h3 className="text-lg font-bold text-white">
                SAP S/4HANA Synchronization
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* PAYLOAD SUMMARY BOX */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-md space-y-2">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Approved Decision Payload:</span>
          <p className="text-slate-200 text-sm font-medium leading-relaxed">{payloadSummary}</p>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/50 flex items-center justify-between">
             <span className="font-medium">Source Agent</span>
             <span className="text-[#FFC20E] font-bold bg-yellow-900/20 px-2 py-0.5 rounded-sm">{agentName}</span>
          </div>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="space-y-3 text-sm">
          
          {/* STEP 1: VALIDATION */}
          <div className="flex items-center gap-4 p-3 rounded-md bg-slate-800/50 border border-slate-700/50">
            {step === 'validating' ? (
              <RefreshCw size={20} className="text-[#FFC20E] animate-spin shrink-0" />
            ) : (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="font-bold block text-slate-200">1. Databricks RGM Governance Validation</span>
              <span className="text-xs text-slate-400 font-medium">Verifying price guardrails, margin caps & co-op allowances...</span>
            </div>
          </div>

          {/* STEP 2: SAP SYNC */}
          <div className={`flex items-center gap-4 p-3 rounded-md border transition-all ${
            step === 'syncing' ? 'bg-slate-800 border-slate-600' : step === 'completed' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-900 border-slate-800/50 opacity-50'
          }`}>
            {step === 'syncing' ? (
              <RefreshCw size={20} className="text-[#FFC20E] animate-spin shrink-0" />
            ) : step === 'completed' ? (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            ) : (
              <Server size={20} className="text-slate-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block text-slate-200">2. SAP S/4HANA Trade Promotion Engine</span>
              <span className="text-xs text-slate-400 font-medium">Pushing active promotional calendar condition types (PR00/TP01)...</span>
            </div>
          </div>

          {/* STEP 3: COMPLETED */}
          <div className={`flex items-center gap-4 p-3 rounded-md border transition-all ${
            step === 'completed' ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-100' : 'bg-slate-900 border-slate-800/50 opacity-50'
          }`}>
            <ShieldCheck size={24} className={step === 'completed' ? 'text-emerald-400 shrink-0' : 'text-slate-600 shrink-0'} />
            <div>
              <span className="font-bold block text-white">3. Sales Operations Dispatch</span>
              <span className="text-xs text-slate-400 font-medium">Transmission payload verified. Campaign status updated to ACTIVE in ERP.</span>
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            disabled={step !== 'completed'}
            className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            {step === 'completed' ? 'Return to Terminal' : 'Synchronizing...'}
          </button>
        </div>

      </div>
    </div>
  );
}
