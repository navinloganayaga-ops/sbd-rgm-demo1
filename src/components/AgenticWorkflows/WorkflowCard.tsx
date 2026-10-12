import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Database, 
  Clock, 
  CheckCircle2, 
  Send,
  Zap,
  Info
} from 'lucide-react';
import { WorkflowItem } from './types';

interface WorkflowCardProps {
  key?: React.Key;
  workflow: WorkflowItem;
  onRunWorkflow: (workflow: WorkflowItem) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'sync') => void;
  onOpenCharter?: () => void;
}

export default function WorkflowCard({
  workflow,
  onRunWorkflow,
  onShowToast,
  onOpenCharter,
}: WorkflowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: WorkflowItem['status']) => {
    switch (status) {
      case 'Active':
      case 'Running':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Standby':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'Attention Required':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getDomainColor = (domain: WorkflowItem['domain']) => {
    switch (domain) {
      case 'Trade Promotion':
        return 'text-amber-800 bg-amber-50/80 border-amber-200';
      case 'Strategic Pricing':
        return 'text-indigo-800 bg-indigo-50/80 border-indigo-200';
      case 'Assortment & Portfolio':
        return 'text-emerald-800 bg-emerald-50/80 border-emerald-200';
      case 'Governance & Risk':
        return 'text-rose-800 bg-rose-50/80 border-rose-200';
      case 'Customer JBP':
        return 'text-blue-800 bg-blue-50/80 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 shadow-2xs transition-all flex flex-col justify-between">
      
      {/* CARD TOP INFO */}
      <div>
        {/* ROW 1: CODE, DOMAIN, STATUS CHIPS */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-sm">
              {workflow.code}
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${getDomainColor(workflow.domain)}`}>
              {workflow.domain}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm border flex items-center gap-1.5 ${getStatusColor(workflow.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${workflow.status === 'Running' || workflow.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{workflow.status}</span>
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mb-1.5">
          {workflow.title}
        </h3>

        {/* SBD SCOPE & RETAILER */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-slate-700">{workflow.sbdFocus}</span>
          <span>·</span>
          <span>{workflow.retailer}</span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {workflow.description}
        </p>

        {/* MULTI-AGENT PIPELINE STEPPER (HORIZONTAL CONNECTED NODES) */}
        <div className="mb-4 bg-slate-50/80 border border-slate-200/80 rounded-md p-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Agentic Orchestration Pipeline</span>
            <span className="text-slate-400 font-medium font-mono">{workflow.stages.length} Stages</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 relative">
            {workflow.stages.map((stage, idx) => (
              <div 
                key={stage.id} 
                className="bg-white border border-slate-200/90 rounded p-2 text-left relative group hover:border-amber-400 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold text-slate-700">0{idx + 1}</span>
                  <span className="font-mono text-[9px]">{stage.estimatedLatency}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight truncate" title={stage.name}>
                  {stage.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5" title={stage.agentOrModel}>
                  {stage.agentOrModel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* METRICS & TRIGGER STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/60 rounded p-2">
            <span className="text-[10px] text-slate-400 font-medium block">Commercial Impact</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{workflow.metrics.primaryImpact}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 rounded p-2">
            <span className="text-[10px] text-slate-400 font-medium block">Key Volume / Metric</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{workflow.metrics.secondaryMetric}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 rounded p-2">
            <span className="text-[10px] text-slate-400 font-medium block">Trigger & Cadence</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{workflow.triggerType}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 rounded p-2">
            <span className="text-[10px] text-slate-400 font-medium block">Autonomy Level</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{workflow.autonomyLevel.split('·')[0]}</span>
          </div>
        </div>

        {/* EXPANDABLE PIPELINE DETAILS */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 animate-in fade-in duration-200 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 text-xs">Trigger Schedule & Rules:</div>
              <p className="text-[11px] text-slate-600">{workflow.triggerSchedule}</p>
              
              <div className="font-bold text-slate-900 text-xs pt-1">Recent Execution Statistics:</div>
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
                <span>Success Rate: <strong className="text-slate-900">{workflow.metrics.successRate}</strong></span>
                <span>Total Historical Runs: <strong className="text-slate-900">{workflow.metrics.totalRuns}</strong></span>
                <span>Average Latency: <strong className="text-slate-900">{workflow.metrics.executionLatency}</strong></span>
                <span>Last Certified: <strong className="text-slate-900">{workflow.metrics.lastRunTime}</strong></span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CARD FOOTER ACTIONS */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Stages & Rules'}</span>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className="flex items-center gap-2">
          {workflow.domain === 'Trade Promotion' && onOpenCharter && (
            <button
              onClick={onOpenCharter}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles size={12} className="text-amber-700" />
              <span>Configure Charter</span>
            </button>
          )}

          <button
            onClick={() => onRunWorkflow(workflow)}
            className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <Play size={13} className="fill-slate-900" />
            <span>Simulate / Run</span>
          </button>
        </div>
      </div>

    </div>
  );
}
