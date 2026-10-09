import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Cpu, Terminal, ShieldCheck, Loader2 } from 'lucide-react';
import { ExecutionStep } from './types';

interface ExecutionTraceWidgetProps {
  steps?: ExecutionStep[];
  defaultOpen?: boolean;
  isLiveLoading?: boolean;
  activeRunningIndex?: number;
}

export const defaultExecutionSteps: ExecutionStep[] = [
  {
    stepNumber: 1,
    title: 'Filter Context Applied (DeWalt / Home Depot)',
    status: 'completed',
    detail: 'Scoped to DeWalt 20V Cordless Family | Retailer: The Home Depot | Horizon: Q4 2026',
    telemetry: 'Synced with Snowflake Commercial Data Cloud'
  },
  {
    stepNumber: 2,
    title: 'Querying Elasticity Engine',
    status: 'completed',
    detail: 'Simulated price elasticity curve: -1.15 coefficient; Competitor index calibrated vs Milwaukee M18',
    telemetry: 'Scan records ingested: 124,500 rows | R-Squared fit: 0.942'
  },
  {
    stepNumber: 3,
    title: 'Calculating Transference & Cannibalization',
    status: 'completed',
    detail: 'Shelf transference factor modeled at 65% retained; Cannibalization cross-matrix solved',
    telemetry: 'Volume bleed mitigated: 12.4K units | Competitor cross-elasticity: 0.38'
  },
  {
    stepNumber: 4,
    title: 'Scenario Generated successfully',
    status: 'completed',
    detail: 'Commercial P&L bridge, MAC margin variance, and executive KPI scorecards computed',
    telemetry: 'Solver runtime: 142ms | Status: Global Optimum Verified'
  }
];

export default function ExecutionTraceWidget({
  steps = defaultExecutionSteps,
  defaultOpen = true,
  isLiveLoading = false,
  activeRunningIndex = -1,
}: ExecutionTraceWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const isDone = completedCount === steps.length;

  return (
    <div className="my-3 border border-slate-200 rounded-md bg-white overflow-hidden text-xs shadow-sm">
      {/* ACCORDION HEADER - LIGHT THEME */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 text-slate-800 flex items-center justify-between transition-colors border-b border-slate-200 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#FFC20E]/20 text-slate-900 flex items-center justify-center font-mono text-[10px] font-bold">
            <Cpu size={12} className="text-amber-700" />
          </div>
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Agent Execution Trace
          </span>
          {isDone ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-600" />
              {steps.length}/{steps.length} Steps Completed
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono px-2 py-0.5 rounded font-semibold flex items-center gap-1 animate-pulse">
              <Loader2 size={11} className="animate-spin text-amber-600" />
              Step {Math.max(1, activeRunningIndex + 1)} of {steps.length} in progress...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <span>{isOpen ? 'Collapse Trace' : 'Expand Trace'}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* ACCORDION BODY - LIGHT THEME */}
      {isOpen && (
        <div className="p-3.5 space-y-3 bg-white font-sans">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running' || (isLiveLoading && idx === activeRunningIndex);
            const isPending = !isCompleted && !isRunning;

            return (
              <div
                key={step.stepNumber}
                className={`flex items-start gap-3 p-2.5 rounded transition-all ${
                  isRunning
                    ? 'bg-amber-50/70 border border-amber-200/80'
                    : isCompleted
                    ? 'bg-slate-50/60 border border-slate-100'
                    : 'opacity-40 border border-transparent'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted && (
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  )}
                  {isRunning && (
                    <Loader2 size={16} className="text-amber-600 animate-spin" />
                  )}
                  {isPending && (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold">
                      {step.stepNumber}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-bold text-[11px] ${
                        isRunning ? 'text-amber-900 font-black' : isCompleted ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      Step {step.stepNumber}: {step.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${
                        isCompleted
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : isRunning
                          ? 'text-amber-700 bg-amber-100 border-amber-300 animate-pulse'
                          : 'text-slate-400 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {isCompleted ? 'Validated' : isRunning ? 'Executing' : 'Queued'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {step.detail}
                  </p>

                  {step.telemetry && (
                    <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      <Terminal size={11} className="text-amber-600 shrink-0" />
                      <span className="truncate">{step.telemetry}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck size={13} className="text-emerald-600" />
              SBD Econometric Risk Model: High Confidence (98.4% R-squared)
            </span>
            <span className="font-mono text-slate-400 text-[10px]">Model v4.2.1-PROD</span>
          </div>
        </div>
      )}
    </div>
  );
}
