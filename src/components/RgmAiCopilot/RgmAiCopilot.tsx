import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  FileDown, 
  ChevronRight, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Info, 
  Trash2, 
  HelpCircle,
  TrendingUp,
  Tag,
  Calendar,
  Layers,
  Target,
  BarChart3,
  Loader2
} from 'lucide-react';
import { FilterState } from '../GlobalFilterBar';
import { ChatMessage, ActiveScenario, ScenarioLevers, ExecutionStep } from './types';
import { 
  quickPromptChips, 
  initialActiveScenario, 
  sampleScenariosByPrompt, 
  contextualExecutionSteps 
} from './mockData';
import ExecutionTraceWidget, { defaultExecutionSteps } from './ExecutionTraceWidget';
import LeverCardWidget from './LeverCardWidget';
import ScenarioOutputWidget from './ScenarioOutputWidget';
import ActiveScenarioDrawer from './ActiveScenarioDrawer';

interface RgmAiCopilotProps {
  filterState?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onFilterApply?: () => void;
  onNavigateTab?: (tab: 'strategic_pricing' | 'trade_promotions' | 'assortment_planner') => void;
}

interface ToastNotice {
  id: string;
  type: 'success' | 'info' | 'sync';
  title: string;
  message: string;
}

interface ThinkingState {
  chipId: string;
  steps: ExecutionStep[];
  currentStepIndex: number;
}

export default function RgmAiCopilot({
  filterState,
  onFilterChange,
  onFilterApply,
  onNavigateTab,
}: RgmAiCopilotProps) {
  // Chat History
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      timestamp: 'Today at 9:00 AM',
      content:
        'Welcome to **RGM AI Copilot** — your conversational commercial intelligence engine for Stanley Black & Decker.\n\nI am connected to the **Circana POS econometric database**, **SAP S/4HANA commercial master**, and **SBD Cross-Elasticity & Transference Kernels**. Select one of the quick scenario prompts below or ask any question to simulate pricing moves, analyze promotional ROI, or rationalize assortment.',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [thinkingState, setThinkingState] = useState<ThinkingState | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeScenario, setActiveScenario] = useState<ActiveScenario>(initialActiveScenario);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'sync' = 'success') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingState]);

  // Execute Step-by-Step Thinking Animation
  const runThinkingProcess = (
    promptId: string,
    preset: typeof sampleScenariosByPrompt[string],
    userText: string
  ) => {
    const rawSteps = contextualExecutionSteps[promptId] || defaultExecutionSteps;
    
    // Initialize steps with first step running and others pending
    const initialSteps: ExecutionStep[] = rawSteps.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'running' : 'pending',
    }));

    setThinkingState({
      chipId: promptId,
      steps: initialSteps,
      currentStepIndex: 0,
    });

    // Animate Step 1 -> Step 2
    setTimeout(() => {
      setThinkingState((prev) => {
        if (!prev) return null;
        const updated = [...prev.steps];
        if (updated[0]) updated[0] = { ...updated[0], status: 'completed' };
        if (updated[1]) updated[1] = { ...updated[1], status: 'running' };
        return { ...prev, steps: updated, currentStepIndex: 1 };
      });
    }, 600);

    // Animate Step 2 -> Step 3
    setTimeout(() => {
      setThinkingState((prev) => {
        if (!prev) return null;
        const updated = [...prev.steps];
        if (updated[1]) updated[1] = { ...updated[1], status: 'completed' };
        if (updated[2]) updated[2] = { ...updated[2], status: 'running' };
        return { ...prev, steps: updated, currentStepIndex: 2 };
      });
    }, 1200);

    // Animate Step 3 -> Step 4
    setTimeout(() => {
      setThinkingState((prev) => {
        if (!prev) return null;
        const updated = [...prev.steps];
        if (updated[2]) updated[2] = { ...updated[2], status: 'completed' };
        if (updated[3]) updated[3] = { ...updated[3], status: 'running' };
        return { ...prev, steps: updated, currentStepIndex: 3 };
      });
    }, 1800);

    // Complete all steps and emit final contextual response
    setTimeout(() => {
      const finalCompletedSteps: ExecutionStep[] = rawSteps.map((s) => ({
        ...s,
        status: 'completed',
      }));

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        timestamp: 'Just now',
        content: preset.agentSummary,
        domain: preset.levers.domain,
        scenarioTitle: preset.title,
        executionTrace: finalCompletedSteps,
        levers: preset.levers,
        impactMetrics: preset.metrics,
        showLeverCard: preset.levers.domain !== 'descriptive',
        showOutputCard: true,
        chartType: preset.chartType,
        promoEvents: preset.promoEvents,
        skuPriceImpacts: preset.skuPriceImpacts,
        calendarWeeks: preset.calendarWeeks,
        delistedSkus: preset.delistedSkus,
        goalPillars: preset.goalPillars,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setThinkingState(null);

      // Update Right Drawer with prompt-specific contextual scenario
      setActiveScenario({
        id: `SCN-${Date.now().toString().slice(-4)}`,
        title: preset.title,
        domain: preset.levers.domain,
        targetTab: preset.targetTab,
        levers: preset.levers,
        metrics: preset.metrics,
        lastUpdated: 'Just now',
        summaryHighlights: preset.summaryHighlights,
        drawerDetails: preset.drawerDetails,
      });

      addToast(
        'Scenario Solved',
        `Generated contextual model for "${preset.title}"`,
        'success'
      );
    }, 2400);
  };

  // Handle Quick Action Chip Click
  const handleSelectPromptChip = (chipId: string) => {
    const preset = sampleScenariosByPrompt[chipId];
    if (!preset || thinkingState !== null) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      content: preset.userPrompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    runThinkingProcess(chipId, preset, preset.userPrompt);
  };

  // Handle Freeform Prompt Submission
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || thinkingState !== null) return;

    const query = inputPrompt.trim();
    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Analyze intent keywords
    const lower = query.toLowerCase();
    let matchedKey = 'pricing_5pct';
    if (lower.includes('promo') || lower.includes('calendar') || lower.includes('holiday') || lower.includes('milwaukee') || lower.includes('tpo')) {
      matchedKey = 'promo_calendar';
    } else if (lower.includes('sku') || lower.includes('tail') || lower.includes('assortment') || lower.includes('rationaliz') || lower.includes('delist')) {
      matchedKey = 'assortment_tail';
    } else if (lower.includes('goal') || lower.includes('1.5') || lower.includes('target') || lower.includes('seek')) {
      matchedKey = 'goal_seek_1_5b';
    } else if (lower.includes('q3') || lower.includes('roi') || lower.includes('historical') || lower.includes('previous') || lower.includes('audit')) {
      matchedKey = 'descriptive_roi';
    }

    const preset = sampleScenariosByPrompt[matchedKey];
    runThinkingProcess(matchedKey, preset, query);
  };

  // In-Chat Simulation Rerun
  const handleRerunSimulation = (msgId: string, updatedLevers: ScenarioLevers) => {
    addToast('Re-calculating Scenario', 'Solving updated lever parameters...', 'info');

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === msgId && msg.impactMetrics) {
            let modifier = 1.0;
            if (updatedLevers.pricing) {
              modifier = 1.0 + (updatedLevers.pricing.priceIncreasePct - 5.0) * 0.008;
            } else if (updatedLevers.promo) {
              modifier = 1.0 + (updatedLevers.promo.discountDepthPct - 15) * 0.004;
            }

            const newSimGsv = Number((msg.impactMetrics.baselineGsvM * modifier * 1.0298).toFixed(1));
            const newDelta = Number((newSimGsv - msg.impactMetrics.baselineGsvM).toFixed(1));

            const updatedMetrics = {
              ...msg.impactMetrics,
              simulatedGsvM: newSimGsv,
              gsvDeltaM: newDelta,
              gsvDeltaPct: Number(((newDelta / msg.impactMetrics.baselineGsvM) * 100).toFixed(2)),
              waterfallBridge: [
                { name: 'Base GSV', value: msg.impactMetrics.baselineGsvM, fill: '#64748b' },
                { name: 'Price/Lift Shift', value: Number((newDelta * 1.2).toFixed(1)), fill: '#10b981' },
                { name: 'Volume Drag', value: Number((-newDelta * 0.2).toFixed(1)), fill: '#ef4444' },
                { name: 'Updated GSV', value: newSimGsv, fill: '#FFC20E' },
              ],
            };

            // Also update drawer
            setActiveScenario((curr) => ({
              ...curr,
              levers: updatedLevers,
              metrics: updatedMetrics,
              lastUpdated: 'Just now',
            }));

            return {
              ...msg,
              levers: updatedLevers,
              impactMetrics: updatedMetrics,
            };
          }
          return msg;
        })
      );
      addToast('Simulation Updated', 'Model converged with updated parameters.', 'success');
    }, 600);
  };

  // Save Scenario to target tab
  const handleSaveToTab = (targetTab: string, title: string) => {
    const tabName = {
      strategic_pricing: 'Strategic Pricing',
      trade_promotions: 'Trade Promotions',
      assortment_planner: 'Assortment Planner',
    }[targetTab] || targetTab;

    addToast(
      'Scenario Saved',
      `"${title}" was synced to the ${tabName} module.`,
      'success'
    );

    if (onNavigateTab) {
      setTimeout(() => {
        onNavigateTab(targetTab as any);
      }, 700);
    }
  };

  const handleExportSummary = () => {
    addToast(
      'Export Initiated',
      'Generating SBD Commercial Scenario Deck (PDF/PPTX) with Circana POS citations...',
      'info'
    );
    setTimeout(() => {
      addToast('Export Complete', 'Downloaded "SBD_RGM_Scenario_Summary.pdf"', 'success');
    }, 1200);
  };

  const handleSyncAllModules = () => {
    addToast(
      'Cross-Module Sync',
      'Syncing parameters across Strategic Pricing, Trade Promotions, and Assortment Planner.',
      'sync'
    );
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'agent',
        timestamp: 'Just now',
        content:
          'Chat session reset. RGM AI Copilot is ready. Select an action chip below or ask any question regarding SBD pricing, trade promos, or assortment.',
      },
    ]);
    addToast('Chat Cleared', 'Active chat history reset.', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] bg-white text-slate-800 rounded border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* TOAST NOTIFICATION CONTAINER */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 border border-slate-800 text-white p-3 rounded shadow-xl flex items-start gap-2.5 animate-in slide-in-from-right-5 fade-in duration-200"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
              {toast.type === 'sync' && <RefreshCw size={16} className="text-[#FFC20E] animate-spin" />}
              {toast.type === 'info' && <Info size={16} className="text-blue-400" />}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 1. HEADER & FILTER BAR - LIGHT THEME (NO COPILOT TAG) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
            Channel Owner Home / Prescriptive RGM
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              RGM AI Copilot
            </h1>
            <span className="text-slate-500 text-xs font-medium hidden sm:inline">
              | Conversational insights Engine & Scenario Generator
            </span>
          </div>
        </div>

        {/* ACTIVE CONTEXT FILTER CHIPS - LIGHT THEME */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Retailer:</span>
            <span className="text-slate-900 font-bold">Home Depot</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Brand:</span>
            <span className="text-slate-900 font-bold">DeWalt 20V</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Horizon:</span>
            <span className="text-slate-900 font-bold">Q4 2026</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold text-[10px]">Circana & SAP Synced</span>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </header>

      {/* 2. MAIN CHAT WORKSPACE (SPLIT VIEW / TWO-COLUMN LAYOUT) */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-[#F8F9FA]">
        
        {/* LEFT PANEL (65% width): Chat Feed & Prompt Bar */}
        <div className={`flex flex-col min-w-0 transition-all duration-300 ${isDrawerOpen ? 'w-full lg:w-[65%]' : 'w-full'}`}>
          
          {/* SCROLLABLE CHAT FEED */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-[#F8F9FA]">
            
            {/* WELCOME / QUICK ACTION PROMPT CHIPS */}
            <div className="bg-white border border-slate-200 p-4 rounded shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={18} className="text-slate-800" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Quick Action Scenario Prompts
                </span>
                <span className="text-[10px] text-slate-500 ml-auto hidden sm:inline">
                  Click to launch scenario
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                {quickPromptChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleSelectPromptChip(chip.id)}
                    disabled={thinkingState !== null}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded text-left transition-all group cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-black leading-snug">
                      <span>{chip.label}</span>
                      <ChevronRight size={13} className="text-slate-400 group-hover:text-amber-600 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-tight line-clamp-1">
                      {chip.subtext}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGE STREAM */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Agent Avatar */}
                {msg.sender === 'agent' && (
                  <div className="w-8 h-8 rounded bg-[#FFC20E] text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-2xs">
                    <Bot size={18} />
                  </div>
                )}

                {/* Message Bubble Content */}
                <div
                  className={`max-w-[92%] md:max-w-[88%] rounded p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white font-medium ml-8 shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 mr-4 shadow-2xs'
                  }`}
                >
                  {/* Sender & Timestamp Header */}
                  <div className="flex items-center justify-between gap-4 mb-2 text-[10px] opacity-75 border-b border-current/15 pb-1">
                    <span className="font-bold uppercase tracking-wider">
                      {msg.sender === 'user' ? 'Commercial Category Director' : 'RGM AI Copilot Engine'}
                    </span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Formatted Text Content */}
                  <div className="whitespace-pre-wrap space-y-2 text-xs">
                    {msg.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph.split('**').map((part, pIdx) =>
                          pIdx % 2 === 1 ? (
                            <strong key={pIdx} className={msg.sender === 'user' ? 'text-amber-300 font-bold' : 'text-slate-950 font-bold'}>
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {/* AGENT EXECUTION TRACE ACCORDION */}
                  {msg.executionTrace && (
                    <ExecutionTraceWidget steps={msg.executionTrace} />
                  )}

                  {/* IN-CHAT INTERACTIVE LEVER CARD WIDGET */}
                  {msg.showLeverCard && msg.levers && (
                    <LeverCardWidget
                      initialLevers={msg.levers}
                      onRunSimulation={(updated) => handleRerunSimulation(msg.id, updated)}
                      isSimulating={false}
                    />
                  )}

                  {/* SCENARIO OUTPUT CARD WIDGET WITH CONTEXTUAL CHARTS AND TABLES */}
                  {msg.showOutputCard && msg.impactMetrics && msg.domain && msg.scenarioTitle && (
                    <ScenarioOutputWidget
                      metrics={msg.impactMetrics}
                      scenarioTitle={msg.scenarioTitle}
                      domain={msg.domain}
                      targetTab={activeScenario.targetTab}
                      chartType={msg.chartType}
                      promoEvents={msg.promoEvents}
                      skuPriceImpacts={msg.skuPriceImpacts}
                      calendarWeeks={msg.calendarWeeks}
                      delistedSkus={msg.delistedSkus}
                      goalPillars={msg.goalPillars}
                      onSaveToTab={handleSaveToTab}
                      onExportSummary={handleExportSummary}
                      onViewInDrawer={() => setIsDrawerOpen(true)}
                    />
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded bg-[#FFC20E] text-slate-900 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    SBD
                  </div>
                )}
              </div>
            ))}

            {/* 4. VISUAL STEP-BY-STEP AGENT IS THINKING / WORKING STATE */}
            {thinkingState && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded bg-[#FFC20E] text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-2xs">
                  <Bot size={18} />
                </div>
                <div className="max-w-[92%] md:max-w-[88%] w-full bg-white border border-amber-200/80 rounded p-4 text-xs shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="text-amber-600 animate-spin" />
                      <span className="font-bold text-slate-900 text-xs">
                        RGM Copilot is thinking & executing steps...
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-mono font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Step {thinkingState.currentStepIndex + 1} of {thinkingState.steps.length}
                    </span>
                  </div>

                  <ExecutionTraceWidget
                    steps={thinkingState.steps}
                    defaultOpen={true}
                    isLiveLoading={true}
                    activeRunningIndex={thinkingState.currentStepIndex}
                  />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* PROMPT INPUT BAR - LIGHT THEME */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  disabled={thinkingState !== null}
                  placeholder="Ask RGM Copilot (e.g. 'Simulate 5% price increase for DeWalt drills' or 'Analyze Promo ROI')..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-500 rounded px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!inputPrompt.trim() || thinkingState !== null}
                className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold px-4 py-2.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 active:scale-95 shadow-sm"
              >
                <Send size={14} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
              <span>Enter natural language queries or click any quick action chip above.</span>
              <span className="font-mono text-slate-500">SBD Commercial Intelligence v4.2</span>
            </div>
          </div>
        </div>

        {/* 5. RIGHT PANEL (35% width, Collapsible): Active Scenario Workspace & Tab Push Panel */}
        <ActiveScenarioDrawer
          scenario={activeScenario}
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          onPushToTab={(tab) => handleSaveToTab(tab, activeScenario.title)}
          onSyncAllModules={handleSyncAllModules}
          onExportExecutiveDeck={handleExportSummary}
        />
      </div>
    </div>
  );
}
