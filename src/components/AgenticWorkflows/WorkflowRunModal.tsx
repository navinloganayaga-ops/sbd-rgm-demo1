import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Database,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { WorkflowItem } from './types';

interface WorkflowRunModalProps {
  workflow: WorkflowItem;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'sync') => void;
}

export default function WorkflowRunModal({
  workflow,
  isOpen,
  onClose,
  onShowToast,
}: WorkflowRunModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isPushedToErp, setIsPushedToErp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start automatically or be ready
      setCurrentStepIndex(0);
      setIsRunning(true);
      setIsCompleted(false);
      setIsPushedToErp(false);
    }
  }, [isOpen, workflow.id]);

  useEffect(() => {
    if (!isRunning || currentStepIndex < 0) return;

    if (currentStepIndex < workflow.stages.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
      onShowToast(
        'Workflow Execution Complete',
        `${workflow.code} finished with zero exceptions. Policy guardrails satisfied.`,
        'success'
      );
    }
  }, [isRunning, currentStepIndex, workflow.stages.length]);

  if (!isOpen) return null;

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsRunning(true);
    setIsCompleted(false);
    setIsPushedToErp(false);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(workflow.simulationData.erpPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
    onShowToast('Copied to Clipboard', 'ERP Condition Payload copied successfully.');
  };

  const handlePushToErp = () => {
    setIsPushedToErp(true);
    onShowToast(
      'ERP Condition Push Staged',
      `Transmitted transaction payload to SAP Vistex staging queue for ${workflow.sbdFocus}.`,
      'sync'
    );
  };

  const sim = workflow.simulationData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-bold text-xs">
              {workflow.code.split('-')[1] || 'WF'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{workflow.code}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-600">{workflow.domain}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {workflow.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              disabled={isRunning}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer disabled:opacity-40"
              title="Restart simulation"
            >
              <RefreshCw size={16} className={isRunning ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TRIGGER EVENT CALLOUT */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 flex items-start gap-3">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-700 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-0.5">
                Simulation Trigger Context
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {sim.triggerEvent}
              </p>
              <div className="text-slate-500 text-[11px] mt-1">
                Context: {workflow.sbdFocus} · Retail Partner: {workflow.retailer}
              </div>
            </div>
          </div>

          {/* PIPELINE EXECUTION PROGRESS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Multi-Agent Pipeline Progression
              </span>
              <span className="text-xs text-slate-500">
                {isRunning ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                    <Loader2 size={12} className="animate-spin" />
                    Executing Stage {Math.min(currentStepIndex + 1, workflow.stages.length)} of {workflow.stages.length}...
                  </span>
                ) : isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 size={12} />
                    All {workflow.stages.length} Stages Certified
                  </span>
                ) : (
                  'Ready'
                )}
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
              <div 
                className="h-full bg-[#FFC20E] transition-all duration-300"
                style={{ 
                  width: `${((currentStepIndex + 1) / (workflow.stages.length + 1)) * 100}%` 
                }}
              />
            </div>

            {/* STAGE CARDS */}
            <div className="space-y-2">
              {workflow.stages.map((st, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex && isRunning;
                const isPending = idx > currentStepIndex;

                return (
                  <div 
                    key={st.id}
                    className={`border rounded-md p-3 transition-all flex items-start justify-between gap-3 ${
                      isCurrent 
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                        : isPast
                        ? 'bg-emerald-50/30 border-emerald-200/80'
                        : 'bg-white border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isPast ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 size={14} />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center">
                            <Loader2 size={13} className="animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 rounded-xs border border-slate-200">
                            {st.agentOrModel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                          {st.description}
                        </p>
                        
                        {/* INPUTS / OUTPUTS TAGS */}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                          <span className="text-slate-400">Inputs:</span>
                          {st.inputs.map((inp, i) => (
                            <span key={i} className="text-slate-600 bg-slate-50 px-1 py-0.2 rounded-xs border border-slate-200/70">
                              {inp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {st.estimatedLatency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATION RESULTS (Visible when complete or progress underway) */}
          {(isCompleted || currentStepIndex >= workflow.stages.length - 1) && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
              
              {/* KPIS GRID */}
              <div>
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                  Projected Financial & Operational Impact
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {sim.kpis.map((kpi, kIdx) => (
                    <div key={kIdx} className="bg-slate-50 border border-slate-200/90 rounded-md p-2.5">
                      <span className="text-[10px] text-slate-500 font-medium block truncate">{kpi.label}</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{kpi.value}</div>
                      <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
                        {kpi.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI REASONING & GUARDRAIL CHECK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded-md p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>AI Synthesis & Recommendation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sim.aiAnalysis}
                  </p>
                </div>

                <div className={`border rounded-md p-3.5 ${
                  sim.guardrailCheck.passed 
                    ? 'bg-emerald-50/40 border-emerald-200' 
                    : 'bg-rose-50/40 border-rose-200'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                    <ShieldCheck size={14} className={sim.guardrailCheck.passed ? 'text-emerald-600' : 'text-rose-600'} />
                    <span>Guardrail & Policy Audit</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 mb-0.5">
                    Rule: {sim.guardrailCheck.rule}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sim.guardrailCheck.message}
                  </p>
                </div>
              </div>

              {/* ERP TRANSACTION PAYLOAD */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Database size={13} className="text-slate-500" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Generated SAP Vistex / Trade ERP Payload
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPayload}
                    className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {copiedPayload ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                    <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200/80 overflow-x-auto whitespace-pre-wrap">
                  {sim.erpPayload}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Autonomy: <span className="font-semibold text-slate-700">{workflow.autonomyLevel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePushToErp}
              disabled={!isCompleted || isPushedToErp}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isPushedToErp 
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 disabled:opacity-50'
              }`}
            >
              {isPushedToErp ? (
                <>
                  <Check size={14} />
                  <span>Payload Staged in SAP</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Approve & Stage in SAP ERP</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
