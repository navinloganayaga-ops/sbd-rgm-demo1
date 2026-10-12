import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  Zap, 
  User, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  SlidersHorizontal, 
  Bot, 
  FileText, 
  Database, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle, 
  Lock, 
  Download, 
  Send, 
  Info,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { 
  CharterStage, 
  CharterStep, 
  ActivationTrigger, 
  DecisionRightRole, 
  GuardrailPolicy, 
  MissionScope,
  initialCharterStages, 
  initialTriggers, 
  initialDecisionRole, 
  initialGuardrails 
} from './charterData';

interface TradePromotionsCharterViewProps {
  onBackToWorkflows?: () => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'sync') => void;
}

export default function TradePromotionsCharterView({
  onBackToWorkflows,
  onShowToast
}: TradePromotionsCharterViewProps) {
  // State for stages & steps
  const [stages, setStages] = useState<CharterStage[]>(initialCharterStages);
  const [triggers, setTriggers] = useState<ActivationTrigger[]>(initialTriggers);
  const [decisionRole, setDecisionRole] = useState<DecisionRightRole>(initialDecisionRole);
  const [guardrails, setGuardrails] = useState<GuardrailPolicy[]>(initialGuardrails);

  // Modal states
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [isExecutingMission, setIsExecutingMission] = useState(false);
  const [editingStep, setEditingStep] = useState<{ stageId: string; step: CharterStep } | null>(null);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState<{ stageId: string } | null>(null);

  // Mission Scope State
  const [missionScope, setMissionScope] = useState<MissionScope>({
    retailer: 'The Home Depot',
    brand: 'DeWalt',
    category: 'Cordless Power Tools (20V & 60V Max)',
    skuCluster: '20V MAX Brushless Hero Drill & Impact Kits',
    eventWindow: "Father's Day Tool Days (Q2 June 2026)",
    startDate: '2026-06-08',
    endDate: '2026-06-21',
    budgetEnvelope: 1250000,
    minNetMarginFloor: 42.0,
    maxDiscountDepth: 20.0,
    missionLead: 'Sarah Jenkins (Senior Director RGM, North America)',
    selectedTrigger: 'Calendar cadence'
  });

  // Execution Simulator State
  const [executionProgress, setExecutionProgress] = useState(0);
  const [activeExecutingStepIndex, setActiveExecutingStepIndex] = useState(0);
  const [executionLogs, setExecutionLogs] = useState<Array<{ time: string; stage: string; message: string; type: 'info' | 'success' | 'gate' }>>([]);
  const [awaitingGateApproval, setAwaitingGateApproval] = useState<CharterStep | null>(null);
  const [isMissionComplete, setIsMissionComplete] = useState(false);

  // Helper Toast trigger
  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'sync' = 'success') => {
    if (onShowToast) {
      onShowToast(title, message, type);
    }
  };

  // Toggle stage collapse
  const toggleStage = (stageId: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  // Toggle step enabled
  const toggleStepEnabled = (stageId: string, stepId: string) => {
    setStages(prev => prev.map(st => {
      if (st.id !== stageId) return st;
      return {
        ...st,
        steps: st.steps.map(step => {
          if (step.id !== stepId) return step;
          const nextState = !step.enabled;
          triggerToast(
            nextState ? 'Step Re-enabled' : 'Step Bypassed',
            `Step ${step.stepNumber} has been ${nextState ? 'activated' : 'bypassed'} in charter execution.`,
            'info'
          );
          return { ...step, enabled: nextState };
        })
      };
    }));
  };

  // Toggle trigger active
  const toggleTrigger = (triggerId: string) => {
    setTriggers(prev => prev.map(tr => {
      if (tr.id !== triggerId) return tr;
      const nextActive = !tr.active;
      triggerToast(
        nextActive ? 'Trigger Activated' : 'Trigger Disabled',
        `Activation rule "${tr.title}" set to ${nextActive ? 'active' : 'inactive'}.`,
        'info'
      );
      return { ...tr, active: nextActive };
    }));
  };

  // Save Step Edit
  const handleSaveStepEdit = (updatedStep: CharterStep) => {
    if (!editingStep) return;
    setStages(prev => prev.map(st => {
      if (st.id !== editingStep.stageId) return st;
      return {
        ...st,
        steps: st.steps.map(s => s.id === updatedStep.id ? updatedStep : s)
      };
    }));
    triggerToast('Step Configuration Updated', `Saved parameters for Step ${updatedStep.stepNumber}.`, 'success');
    setEditingStep(null);
  };

  // Add Custom Step
  const handleAddCustomStep = (stageId: string, newStep: Omit<CharterStep, 'id' | 'stepNumber'>) => {
    setStages(prev => prev.map(st => {
      if (st.id !== stageId) return st;
      const nextNum = (st.steps.length + 1).toString().padStart(2, '0');
      const step: CharterStep = {
        ...newStep,
        id: `custom-step-${Date.now()}`,
        stepNumber: nextNum
      };
      return {
        ...st,
        stepsCount: st.stepsCount + 1,
        gatesCount: step.isGate ? st.gatesCount + 1 : st.gatesCount,
        steps: [...st.steps, step]
      };
    }));
    triggerToast('Step Added to Charter', 'New agentic step registered successfully.', 'success');
    setIsAddStepModalOpen(null);
  };

  // Reset Charter to Default
  const handleResetToDefault = () => {
    setStages(initialCharterStages);
    setTriggers(initialTriggers);
    setDecisionRole(initialDecisionRole);
    setGuardrails(initialGuardrails);
    triggerToast('Charter Reset', 'Restored default SBD trade promotions multi-agent workflow spec.', 'sync');
  };

  // Start Live Mission Execution Simulation
  const handleLaunchMission = () => {
    setIsScopeModalOpen(false);
    setIsExecutingMission(true);
    setIsMissionComplete(false);
    setExecutionProgress(5);
    setActiveExecutingStepIndex(0);
    setExecutionLogs([
      {
        time: '14:20:01',
        stage: 'Initialization',
        message: `Mission initiated for ${missionScope.retailer} · ${missionScope.brand} (${missionScope.skuCluster}). Budget envelope: $${(missionScope.budgetEnvelope / 1000).toFixed(0)}k.`,
        type: 'info'
      }
    ]);

    // Flatten all enabled steps
    const allEnabledSteps = stages.flatMap(st => st.steps.filter(s => s.enabled));
    
    // Simulate step progression
    let currentIdx = 0;
    const runNextStep = () => {
      if (currentIdx >= allEnabledSteps.length) {
        setExecutionProgress(100);
        setIsMissionComplete(true);
        setExecutionLogs(logs => [
          ...logs,
          {
            time: '14:24:12',
            stage: 'System & Execution',
            message: 'All stages certified! SAP Vistex records committed and trade spend audit tripwire activated.',
            type: 'success'
          }
        ]);
        return;
      }

      const step = allEnabledSteps[currentIdx];
      setActiveExecutingStepIndex(currentIdx);
      const progressPercent = Math.min(95, Math.round(((currentIdx + 1) / allEnabledSteps.length) * 100));
      setExecutionProgress(progressPercent);

      // Log step start
      setExecutionLogs(logs => [
        ...logs,
        {
          time: new Date().toLocaleTimeString(),
          stage: `Step ${step.stepNumber}`,
          message: `Running: ${step.title.slice(0, 75)}... [Agent: ${step.agents[0] || step.roles?.[0] || 'Autonomous Agent'}]`,
          type: 'info'
        }
      ]);

      // Check if it's a decision gate requiring HITL approval
      if (step.isGate) {
        setAwaitingGateApproval(step);
        setExecutionLogs(logs => [
          ...logs,
          {
            time: new Date().toLocaleTimeString(),
            stage: `Gate: ${step.gateOwner || 'RGM Lead'}`,
            message: `Awaiting HITL verification for Step ${step.stepNumber} (${step.artifacts[0]?.label || 'Decision Artifact'}).`,
            type: 'gate'
          }
        ]);
        // Pause until user clicks approve
      } else {
        // Proceed automatically after brief timeout
        setTimeout(() => {
          currentIdx++;
          runNextStep();
        }, 900);
      }
    };

    setTimeout(() => {
      runNextStep();
    }, 800);
  };

  // Gate Approval Handler in Simulator
  const handleApproveGate = () => {
    if (!awaitingGateApproval) return;
    const approvedStep = awaitingGateApproval;
    setAwaitingGateApproval(null);

    setExecutionLogs(logs => [
      ...logs,
      {
        time: new Date().toLocaleTimeString(),
        stage: `Gate Approved`,
        message: `Sign-off granted by ${approvedStep.gateOwner || 'RGM Lead'} for Step ${approvedStep.stepNumber}. Resuming automated workflow pipeline...`,
        type: 'success'
      }
    ]);

    // Continue to next steps
    const allEnabledSteps = stages.flatMap(st => st.steps.filter(s => s.enabled));
    let nextIdx = activeExecutingStepIndex + 1;

    const runRemaining = (idx: number) => {
      if (idx >= allEnabledSteps.length) {
        setExecutionProgress(100);
        setIsMissionComplete(true);
        setExecutionLogs(logs => [
          ...logs,
          {
            time: new Date().toLocaleTimeString(),
            stage: 'System & Execution',
            message: 'All stages certified! SAP Vistex records committed and trade spend audit tripwire activated.',
            type: 'success'
          }
        ]);
        return;
      }

      const stp = allEnabledSteps[idx];
      setActiveExecutingStepIndex(idx);
      const prog = Math.min(95, Math.round(((idx + 1) / allEnabledSteps.length) * 100));
      setExecutionProgress(prog);

      setExecutionLogs(logs => [
        ...logs,
        {
          time: new Date().toLocaleTimeString(),
          stage: `Step ${stp.stepNumber}`,
          message: `Running: ${stp.title.slice(0, 75)}... [Agent: ${stp.agents[0] || stp.roles?.[0] || 'Autonomous Agent'}]`,
          type: 'info'
        }
      ]);

      if (stp.isGate) {
        setAwaitingGateApproval(stp);
        setExecutionLogs(logs => [
          ...logs,
          {
            time: new Date().toLocaleTimeString(),
            stage: `Gate: ${stp.gateOwner || 'RGM Lead'}`,
            message: `Awaiting HITL verification for Step ${stp.stepNumber} (${stp.artifacts[0]?.label || 'Decision Artifact'}).`,
            type: 'gate'
          }
        ]);
      } else {
        setTimeout(() => {
          runRemaining(idx + 1);
        }, 900);
      }
    };

    setTimeout(() => {
      runRemaining(nextIdx);
    }, 600);
  };

  const getArtifactBadgeStyle = (type: string) => {
    switch (type) {
      case 'decision':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'report':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'document':
      case 'presentation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'calendar':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'payload':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              <span className="font-semibold text-slate-700">PRESCRIPTIVE & AGENTIC</span>
              <span>/</span>
              <button 
                onClick={onBackToWorkflows}
                className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                AGENTIC WORKFLOWS
              </button>
              <span>/</span>
              <span className="text-slate-900 font-bold">TRADE PROMOTIONS CHARTER</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Trade Promotions Workflow Charter
              </h1>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-sm flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-600" />
                <span>Multi-Agent Orchestration Spec</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 max-w-4xl leading-relaxed">
              This charter defines the end-to-end multi-agent execution pipeline for promotion strategy, event calendar optimization, and ERP settlement. Configure stages, agents, artifacts, and approval gates below, then click <strong className="text-slate-800 font-semibold">Initiate mission</strong> to parameterize scope and execute.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onBackToWorkflows && (
              <button
                onClick={onBackToWorkflows}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              >
                Back to Workflows
              </button>
            )}

            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className="text-slate-500" />
              <span>Reset Charter</span>
            </button>

            <button
              onClick={() => setIsScopeModalOpen(true)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-md flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Play size={13} className="fill-slate-900" />
              <span>Initiate mission</span>
            </button>
          </div>
        </div>

        {/* CHARTER EXECUTIVE SUMMARY STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Configured Stages
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              3 Stages · 16 Total Steps
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
              {stages.flatMap(s => s.steps).filter(s => s.enabled).length} Steps Active in Charter
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Governance & Gates
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              7 Human-in-the-Loop Gates
            </div>
            <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
              RGM Lead & Key Account Sign-off
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Autonomous Agents
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              10 Specialized Agents
            </div>
            <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
              Elasticity Solver, Promo Architect, Vistex Sync
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
              Enforced Guardrails
            </span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              4 Active Policy Rules
            </div>
            <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
              3 Hard Constraints · 1 Flex Delta
            </span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVATION TRIGGERS SECTION (EXACT DESIGN FROM IMAGE) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Activation triggers</span>
              <span className="text-[11px] font-normal text-slate-500">
                (Define what conditions wake up this multi-agent mission)
              </span>
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Click trigger card to toggle participation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {triggers.map(trig => {
            const getIcon = () => {
              switch (trig.iconName) {
                case 'calendar':
                  return <Calendar size={16} className="text-amber-600" />;
                case 'trending-up':
                  return <TrendingUp size={16} className="text-emerald-600" />;
                case 'zap':
                  return <Zap size={16} className="text-blue-600" />;
                case 'user':
                  return <User size={16} className="text-purple-600" />;
                default:
                  return <Sparkles size={16} className="text-slate-600" />;
              }
            };

            return (
              <div
                key={trig.id}
                onClick={() => toggleTrigger(trig.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  trig.active 
                    ? 'bg-slate-50/70 border-slate-300 hover:border-slate-400 shadow-2xs' 
                    : 'bg-slate-50/20 border-dashed border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-white border border-slate-200 rounded-md shadow-2xs">
                      {getIcon()}
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      trig.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {trig.active ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{trig.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{trig.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Trigger Status</span>
                  <span className="font-semibold text-slate-800">{trig.active ? 'Monitored' : 'Bypassed'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DECISION RIGHTS & GUARDRAIL POLICIES BAR */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Decision Rights Role */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-200 lg:pr-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-amber-600" />
              <span>Decision rights</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Governance Owner
            </span>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">{decisionRole.role}</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                Mandatory Sign-off
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              {decisionRole.description}
            </p>
          </div>
        </div>

        {/* Right: Guardrail Policies */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Lock size={14} className="text-slate-600" />
              <span>Enforced Guardrail Policies</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Evaluated at each gate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {guardrails.map(gr => (
              <div key={gr.id} className="bg-slate-50 border border-slate-200 rounded-md p-2.5 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      gr.tier === 'HARD' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {gr.tier}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{gr.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 line-clamp-1">{gr.description}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                  {gr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. THE 3 STAGES & WORKFLOW PIPELINE (EXACT VISUAL REPLICATION) */}
      <div className="space-y-5">
        {stages.map((stage) => {
          const enabledSteps = stage.steps.filter(s => s.enabled);
          const accentBorder = stage.accentColor === 'amber' ? 'border-amber-300' : 'border-blue-300';
          const accentBg = stage.accentColor === 'amber' ? 'bg-amber-500' : 'bg-blue-600';
          const accentBadge = stage.accentColor === 'amber' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-blue-50 text-blue-900 border-blue-200';

          return (
            <div 
              key={stage.id} 
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs transition-all"
            >
              {/* STAGE HEADER BAR */}
              <div 
                onClick={() => toggleStage(stage.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${accentBg}`}>
                    {stage.stageNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {stage.title}
                      </h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${accentBadge}`}>
                        {stage.stepsCount} steps · {stage.gatesCount} {stage.gatesCount === 1 ? 'gate' : 'gates'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {stage.subText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddStepModalOpen({ stageId: stage.id });
                    }}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Step</span>
                  </button>

                  <div className="text-slate-400 p-1 hover:text-slate-600">
                    {stage.isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* STAGE BODY: CONNECTED TIMELINE OF STEPS */}
              {stage.isExpanded && (
                <div className="p-4 sm:p-6 space-y-3 bg-[#FAFBFD]">
                  {stage.steps.map((step, idx) => {
                    const isLast = idx === stage.steps.length - 1;

                    return (
                      <div key={step.id} className="relative flex items-start gap-3 sm:gap-4 group">
                        
                        {/* Vertical Connector Line */}
                        {!isLast && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 z-0" />
                        )}

                        {/* Step Number Circle */}
                        <div className={`w-8 h-8 rounded-full border text-xs font-mono font-bold flex items-center justify-center shrink-0 z-10 transition-colors shadow-2xs ${
                          step.enabled 
                            ? 'bg-white border-slate-300 text-slate-800 group-hover:border-slate-400' 
                            : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                        }`}>
                          {step.stepNumber}
                        </div>

                        {/* Step Card Content */}
                        <div className={`flex-1 p-3.5 rounded-lg border transition-all ${
                          step.enabled 
                            ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs' 
                            : 'bg-slate-50/70 border-dashed border-slate-200 text-slate-400 opacity-60'
                        }`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                            {/* Step Title & Details */}
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-start gap-2">
                                <h3 className={`text-xs sm:text-sm font-bold tracking-tight leading-snug ${step.enabled ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                                  {step.title}
                                </h3>

                                {/* Financial Commitment Money Badge */}
                                {step.moneyBadge && (
                                  <span className="p-1 bg-amber-50 text-amber-700 border border-amber-300 rounded shadow-2xs shrink-0" title="Financial Commitment Gate">
                                    <DollarSign size={13} className="text-amber-600" />
                                  </span>
                                )}
                              </div>

                              {/* Badges / Chips: Agents, Artifacts, Roles, Gate Note */}
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                
                                {/* Assigned Agent Chip */}
                                {step.agents.map((agent, aIdx) => (
                                  <span 
                                    key={aIdx}
                                    className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1.5"
                                  >
                                    <Bot size={12} className="text-amber-600" />
                                    <span>{agent}</span>
                                  </span>
                                ))}

                                {/* Role Chip */}
                                {step.roles?.map((role, rIdx) => (
                                  <span 
                                    key={rIdx}
                                    className="text-[11px] font-bold text-slate-800 bg-amber-50/70 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1.5"
                                  >
                                    <User size={12} className="text-amber-700" />
                                    <span>{role}</span>
                                  </span>
                                ))}

                                {/* Artifact Chip */}
                                {step.artifacts.map((art, artIdx) => (
                                  <span 
                                    key={artIdx}
                                    className={`text-[10px] font-medium px-2 py-0.5 rounded border flex items-center gap-1.5 ${getArtifactBadgeStyle(art.type)}`}
                                  >
                                    {art.type === 'report' ? <FileSpreadsheet size={11} /> :
                                     art.type === 'document' || art.type === 'presentation' ? <FileText size={11} /> :
                                     art.type === 'calendar' ? <Calendar size={11} /> :
                                     art.type === 'payload' ? <Database size={11} /> :
                                     <CheckCircle2 size={11} />}
                                    <span>{art.label}</span>
                                  </span>
                                ))}

                                {/* Gate Indicator */}
                                {step.isGate && (
                                  <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                                    <ShieldCheck size={11} className="text-amber-700" />
                                    <span>Gate: {step.gateOwner || 'RGM Lead'}</span>
                                  </span>
                                )}
                              </div>

                              {/* Explanatory Note (if any) */}
                              {step.note && (
                                <p className="text-[11px] text-amber-900/80 italic pt-1">
                                  {step.note}
                                </p>
                              )}
                            </div>

                            {/* Actions: Configure & Toggle */}
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-1 md:pt-0">
                              <button
                                onClick={() => setEditingStep({ stageId: stage.id, step })}
                                className="text-slate-500 hover:text-slate-800 p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Configure step parameters"
                              >
                                <Edit3 size={13} />
                              </button>

                              <button
                                onClick={() => toggleStepEnabled(stage.id, step.id)}
                                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer border ${
                                  step.enabled 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {step.enabled ? 'ACTIVE' : 'BYPASSED'}
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. INITIATE MISSION: SCOPE DEFINITION MODAL */}
      {isScopeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto font-sans">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFC20E]/20 rounded-lg">
                  <Play size={18} className="fill-slate-900 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Initiate Mission: Define Scope & Parameters
                  </h2>
                  <p className="text-xs text-slate-500">
                    Parameterize retailer perimeter, brand portfolio, promo event window, and commercial hurdles.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsScopeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scope Form Fields */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Row 1: Retailer & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Retail Partner / Account
                  </label>
                  <select
                    value={missionScope.retailer}
                    onChange={(e) => setMissionScope({ ...missionScope, retailer: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="The Home Depot">The Home Depot (US)</option>
                    <option value="Lowe's">Lowe's Companies</option>
                    <option value="Menards">Menards Midwest</option>
                    <option value="Amazon">Amazon Tools & Home Improvement</option>
                    <option value="Grainger">Grainger Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Stanley Black & Decker Brand
                  </label>
                  <select
                    value={missionScope.brand}
                    onChange={(e) => setMissionScope({ ...missionScope, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="DeWalt">DeWalt (Guaranteed Tough)</option>
                    <option value="Craftsman">Craftsman</option>
                    <option value="Stanley">Stanley</option>
                    <option value="Black & Decker">Black & Decker</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Category & SKU Cluster */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Super SBU / Category
                  </label>
                  <select
                    value={missionScope.category}
                    onChange={(e) => setMissionScope({ ...missionScope, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Cordless Power Tools (20V & 60V Max)">Cordless Power Tools (20V & 60V Max)</option>
                    <option value="Hand Tools & Storage">Hand Tools & Storage</option>
                    <option value="Outdoor Power Equipment (OPE)">Outdoor Power Equipment (OPE)</option>
                    <option value="Power Tool Accessories">Power Tool Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target SKU Cluster / Promo Range
                  </label>
                  <select
                    value={missionScope.skuCluster}
                    onChange={(e) => setMissionScope({ ...missionScope, skuCluster: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="20V MAX Brushless Hero Drill & Impact Kits">20V MAX Brushless Hero Drill & Impact Kits</option>
                    <option value="ATOMIC Compact Series 2-Tool Combos">ATOMIC Compact Series 2-Tool Combos</option>
                    <option value="FLEXVOLT Advantage Heavy Duty Systems">FLEXVOLT Advantage Heavy Duty Systems</option>
                    <option value="ToughSystem 2.0 Modular Storage Units">ToughSystem 2.0 Modular Storage Units</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Promo Event Window & Trigger Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Circular Event Window
                  </label>
                  <select
                    value={missionScope.eventWindow}
                    onChange={(e) => setMissionScope({ ...missionScope, eventWindow: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Father's Day Tool Days (Q2 June 2026)">Father's Day Tool Days (Q2 June 2026)</option>
                    <option value="Memorial Day Major Promo (May 2026)">Memorial Day Major Promo (May 2026)</option>
                    <option value="Labor Day Contractor Push (Sept 2026)">Labor Day Contractor Push (Sept 2026)</option>
                    <option value="Q4 Black Friday / Holiday Peak (Nov-Dec 2026)">Q4 Black Friday / Holiday Peak (Nov-Dec 2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Wake-up Trigger
                  </label>
                  <select
                    value={missionScope.selectedTrigger}
                    onChange={(e) => setMissionScope({ ...missionScope, selectedTrigger: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Calendar cadence">Calendar cadence (Scheduled review window)</option>
                    <option value="On demand">On demand (Manual mission launch)</option>
                    <option value="Threshold breach">Threshold breach (Promo ROI limit crossed)</option>
                    <option value="Market event">Market event (Competitor price move detected)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Budget Envelope & Hurdles */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Commercial Guardrails & Budget Envelope</span>
                  <span className="text-[11px] text-amber-700 font-semibold">Strict Hard Constraints</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Trade Budget Envelope ($)</label>
                    <input
                      type="number"
                      value={missionScope.budgetEnvelope}
                      onChange={(e) => setMissionScope({ ...missionScope, budgetEnvelope: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Min Net Margin Floor (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={missionScope.minNetMarginFloor}
                      onChange={(e) => setMissionScope({ ...missionScope, minNetMarginFloor: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Max Discount Depth TPR (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={missionScope.maxDiscountDepth}
                      onChange={(e) => setMissionScope({ ...missionScope, maxDiscountDepth: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mission Owner Lead */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Designated Mission Lead / Approver
                </label>
                <input
                  type="text"
                  value={missionScope.missionLead}
                  onChange={(e) => setMissionScope({ ...missionScope, missionLead: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                16 steps will be orchestrated with 7 human-in-the-loop gates.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsScopeModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLaunchMission}
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-extrabold text-xs px-5 py-2 rounded shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Play size={13} className="fill-slate-900" />
                  <span>Trigger Workflow Mission</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. LIVE MISSION EXECUTION SIMULATOR MODAL */}
      {isExecutingMission && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col font-sans overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isMissionComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 animate-pulse'}`}>
                  {isMissionComplete ? <CheckCircle2 size={20} /> : <Sparkles size={20} />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isMissionComplete ? 'Mission Successfully Certified & Pushed' : 'Executing Trade Promotions Multi-Agent Mission'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Scope: {missionScope.retailer} · {missionScope.brand} · {missionScope.eventWindow}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsExecutingMission(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Overall Multi-Agent Pipeline Progress</span>
                  <span>{executionProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-[#FFC20E] transition-all duration-300"
                    style={{ width: `${executionProgress}%` }}
                  />
                </div>
              </div>

              {/* HUMAN IN THE LOOP DECISION GATE MODAL POPUP */}
              {awaitingGateApproval && (
                <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-4 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-full shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                          Human-in-the-Loop Sign-off Required
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                          Gate: {awaitingGateApproval.gateOwner || 'RGM Lead'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {awaitingGateApproval.title}
                      </h4>
                      <p className="text-xs text-slate-700">
                        The agent swarm has generated the <strong className="text-slate-900">{awaitingGateApproval.artifacts[0]?.label || 'Artifact'}</strong>. Please review compliance with margin and trade allowance policies before proceeding.
                      </p>

                      {/* Mock Artifact Preview */}
                      <div className="bg-white border border-amber-200 rounded p-2.5 text-[11px] text-slate-600 mt-2 space-y-1">
                        <div className="font-semibold text-slate-800">Generated Decision Artifact Spec:</div>
                        <div>· Projected Incremental Revenue: <strong>+$1,840,000</strong></div>
                        <div>· Net-Net Contribution Margin: <strong>43.8%</strong> (Floor Hurdle: 42.0% ✓)</div>
                        <div>· Guardrails Passed: <strong>Floor-price rule, Max TPR ≤ 20%, Retail Parity satisfied</strong></div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={handleApproveGate}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-1.5 rounded flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          <Check size={13} className="text-emerald-400" />
                          <span>Approve Gate & Continue Mission</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MISSION COMPLETION REPORT */}
              {isMissionComplete && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span className="font-bold text-emerald-950 text-sm">
                        Mission Execution Certified
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      SAP Condition Record #VR-2026-8819 Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    The entire multi-agent workflow has completed successfully across all 3 stages. Circular ad slots are locked in The Home Depot joint planner and pricing accruals are staged in SAP Vistex.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-white border border-emerald-200 rounded p-2">
                      <span className="text-[10px] text-slate-500 block">Incremental Revenue</span>
                      <strong className="text-sm text-slate-900">+$3.84M</strong>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded p-2">
                      <span className="text-[10px] text-slate-500 block">Volume Lift</span>
                      <strong className="text-sm text-emerald-700">+28.4%</strong>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded p-2">
                      <span className="text-[10px] text-slate-500 block">Net-Net Margin</span>
                      <strong className="text-sm text-slate-900">44.2%</strong>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded p-2">
                      <span className="text-[10px] text-slate-500 block">Guardrail Compliance</span>
                      <strong className="text-sm text-emerald-700">100% Passed</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* LIVE AGENT REASONING & EXECUTION LOGS */}
              <div>
                <span className="font-bold text-slate-900 text-xs block mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-500" />
                  <span>Real-time Agent Swarm Execution Log</span>
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-56 overflow-y-auto font-mono text-[11px] space-y-1.5">
                  {executionLogs.map((log, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">{log.time}</span>
                      <span className={`font-bold shrink-0 ${
                        log.type === 'success' ? 'text-emerald-700' :
                        log.type === 'gate' ? 'text-amber-700' : 'text-blue-700'
                      }`}>
                        [{log.stage}]
                      </span>
                      <span className="text-slate-700">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Audit Trail Recorded in Stanley Black & Decker Enterprise RGM Ledger
              </span>

              <div className="flex items-center gap-2">
                {isMissionComplete && (
                  <button
                    onClick={() => {
                      triggerToast('Audit Report Exported', 'Downloaded PDF specification for SAP Vistex deployment.', 'success');
                      setIsExecutingMission(false);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download size={13} />
                    <span>Download Mission Summary</span>
                  </button>
                )}

                <button
                  onClick={() => setIsExecutingMission(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. STEP CONFIGURATION DRAWER / MODAL */}
      {editingStep && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit3 size={15} className="text-amber-600" />
                <span>Configure Step {editingStep.step.stepNumber}</span>
              </h3>
              <button onClick={() => setEditingStep(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Step Title</label>
                <input
                  type="text"
                  value={editingStep.step.title}
                  onChange={(e) => setEditingStep({
                    ...editingStep,
                    step: { ...editingStep.step, title: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Agent (Optional)</label>
                <input
                  type="text"
                  value={editingStep.step.agents.join(', ')}
                  onChange={(e) => setEditingStep({
                    ...editingStep,
                    step: { ...editingStep.step, agents: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }
                  })}
                  placeholder="e.g. Elasticity solver, Promo architect"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Decision Gate Status</div>
                  <div className="text-[11px] text-slate-500">Require human-in-the-loop sign-off before progressing</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingStep.step.isGate}
                  onChange={(e) => setEditingStep({
                    ...editingStep,
                    step: { ...editingStep.step, isGate: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              {editingStep.step.isGate && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gate Owner Role</label>
                  <input
                    type="text"
                    value={editingStep.step.gateOwner || 'RGM Lead'}
                    onChange={(e) => setEditingStep({
                      ...editingStep,
                      step: { ...editingStep.step, gateOwner: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingStep(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveStepEdit(editingStep.step)}
                className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-4 py-1.5 rounded cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. ADD CUSTOM STEP MODAL */}
      {isAddStepModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus size={15} className="text-amber-600" />
                <span>Add Step to Stage</span>
              </h3>
              <button onClick={() => setIsAddStepModalOpen(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const title = (form.elements.namedItem('stepTitle') as HTMLInputElement).value;
              const agent = (form.elements.namedItem('stepAgent') as HTMLInputElement).value;
              const isGate = (form.elements.namedItem('stepGate') as HTMLInputElement).checked;

              handleAddCustomStep(isAddStepModalOpen.stageId, {
                title,
                agents: agent ? [agent] : [],
                artifacts: [{ type: 'decision', label: 'custom artifact' }],
                isGate,
                gateOwner: isGate ? 'RGM Lead' : undefined,
                enabled: true
              });
            }} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Step Objective & Description</label>
                <input
                  name="stepTitle"
                  required
                  placeholder="e.g. Competitive elasticity scenario test"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Agent</label>
                <input
                  name="stepAgent"
                  placeholder="e.g. Custom trade optimizer"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input id="newStepGate" name="stepGate" type="checkbox" className="accent-amber-500 rounded" />
                <label htmlFor="newStepGate" className="font-semibold text-slate-700">Require Decision Gate</label>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStepModalOpen(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-4 py-1.5 rounded cursor-pointer"
                >
                  Add Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
