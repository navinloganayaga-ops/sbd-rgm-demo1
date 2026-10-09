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
  Loader2,
  BookOpen,
  User,
  Activity
} from 'lucide-react';
import { FilterState } from '../GlobalFilterBar';
import { 
  ChatMessage, 
  ActiveScenario, 
  ScenarioLevers, 
  ExecutionStep,
  PromptLibraryItem 
} from './types';
import { 
  initialActiveScenario, 
  sampleScenariosByPrompt, 
  contextualExecutionSteps,
  promptLibraryItems 
} from './mockData';
import ExecutionTraceWidget, { defaultExecutionSteps } from './ExecutionTraceWidget';
import LeverCardWidget from './LeverCardWidget';
import ScenarioOutputWidget from './ScenarioOutputWidget';
import PromptLibraryModal from './PromptLibraryModal';
import MonitoringConditionsSection from './MonitoringConditionsSection';
import { GuardrailCondition } from '../../utils/guardrailStore';

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
        'Welcome to **RGM AI Copilot** — your conversational commercial intelligence engine for Stanley Black & Decker.\n\nI am connected to the **Snowflake Commercial Data Cloud** (Point-of-Sale scanner data, ERP actuals, and trade ledgers) and **SBD Cross-Elasticity & Transference Models**. Use the **Prompt Library** at the top to launch pre-calibrated scenarios across Pricing, Trade Promotions, Assortment, and Goal Seek, or type any commercial query in the prompt bar below.',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [thinkingState, setThinkingState] = useState<ThinkingState | null>(null);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
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

      addToast(
        'Scenario Solved',
        `Generated commercial model for "${preset.title}"`,
        'success'
      );
    }, 2400);
  };

  // Launch prompt from Prompt Library
  const handleSelectPromptFromLibrary = (item: PromptLibraryItem) => {
    const preset = sampleScenariosByPrompt[item.key] || sampleScenariosByPrompt['pricing_5pct'];
    if (!preset || thinkingState !== null) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      content: item.userPrompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    runThinkingProcess(item.key, preset, item.userPrompt);
  };

  // Trigger diagnostic from Monitoring Conditions section (guardrails)
  const handleTriggerConditionInvestigation = (cond: GuardrailCondition) => {
    if (thinkingState !== null) return;

    if (cond.status === 'warning' || cond.targetPcr) {
      const preset = sampleScenariosByPrompt['investigate_margin_breach'];
      const query = `Investigate breach on Minimum Margin Sentinel for PCR-2026-0835 (Craftsman Promo: 21.8% vs 24.0% floor)`;
      
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        timestamp: 'Just now',
        content: query,
      };

      setMessages((prev) => [...prev, userMsg]);
      runThinkingProcess('investigate_margin_breach', preset, query);
    } else {
      const preset = sampleScenariosByPrompt['audit_gtn_watchdog'];
      const query = `Audit active status and headroom for ${cond.name} across Q4 promotional events`;
      
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        timestamp: 'Just now',
        content: query,
      };

      setMessages((prev) => [...prev, userMsg]);
      runThinkingProcess('audit_gtn_watchdog', preset, query);
    }
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

    if (lower.includes('breach') || lower.includes('sentinel') || lower.includes('0835') || (lower.includes('margin') && lower.includes('investigat'))) {
      matchedKey = 'investigate_margin_breach';
    } else if (lower.includes('watchdog') || lower.includes('gtn') || lower.includes('spend cap')) {
      matchedKey = 'audit_gtn_watchdog';
    } else if (lower.includes('inflation') || lower.includes('tiered') || lower.includes('cogs')) {
      matchedKey = 'pricing_inflation';
    } else if (lower.includes('overspend') || lower.includes('leakage') || lower.includes('0812') || lower.includes('diminishing')) {
      matchedKey = 'promo_overspend';
    } else if (lower.includes('npi') || lower.includes('atomic') || lower.includes('compact')) {
      matchedKey = 'assortment_npi';
    } else if (lower.includes('promo') || lower.includes('calendar') || lower.includes('holiday') || lower.includes('milwaukee') || lower.includes('tpo')) {
      matchedKey = 'promo_calendar';
    } else if (lower.includes('sku') || lower.includes('tail') || lower.includes('assortment') || lower.includes('rationaliz') || lower.includes('delist')) {
      matchedKey = 'assortment_tail';
    } else if (lower.includes('goal') || lower.includes('1.5') || lower.includes('target') || lower.includes('seek')) {
      matchedKey = 'goal_seek_1_5b';
    } else if (lower.includes('q3') || lower.includes('roi') || lower.includes('historical') || lower.includes('previous') || lower.includes('audit')) {
      matchedKey = 'descriptive_roi';
    }

    const preset = sampleScenariosByPrompt[matchedKey] || sampleScenariosByPrompt['pricing_5pct'];
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
      'Generating SBD Commercial Scenario Deck (PDF/PPTX) with Snowflake data citations...',
      'info'
    );
    setTimeout(() => {
      addToast('Export Complete', 'Downloaded "SBD_RGM_Scenario_Summary.pdf"', 'success');
    }, 1200);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'agent',
        timestamp: 'Just now',
        content:
          'Chat session reset. RGM AI Copilot is ready. Use the **Prompt Library** at the top or ask any commercial question to simulate scenarios.',
      },
    ]);
    addToast('Chat Cleared', 'Active chat history reset.', 'info');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-[#F8F9FA] text-slate-800 rounded border border-slate-200 shadow-sm overflow-hidden font-sans">
      
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

      {/* 1. TOP HEADER & CONTEXT BAR - LIGHT THEME (CLEAN & PROFESSIONAL) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
            RGM SUITE › PRESCRIPTIVE & AGENTIC
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

        {/* ACTIVE CONTEXT & TOOLBAR CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Retailer:</span>
            <span className="text-slate-900 font-bold">Home Depot</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Brand:</span>
            <span className="text-slate-900 font-bold">DeWalt 20V</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold text-[10px]">Snowflake Real-time Synced</span>
          </div>

          {/* PROMPT LIBRARY HEADER BUTTON */}
          <button
            onClick={() => setIsPromptLibraryOpen(true)}
            className="px-3 py-1.5 bg-[#FFC20E] hover:bg-yellow-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ml-1"
          >
            <BookOpen size={13} className="text-slate-950" />
            <span>Prompt Library</span>
            <span className="bg-slate-950 text-[#FFC20E] text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-0.5">
              {promptLibraryItems.length}
            </span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {/* 2. CHAT FEED CANVAS (FULL WIDTH, CLEAN & PROFESSIONAL) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto space-y-5">

          {/* CHAT MESSAGES STREAM */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-[#FFC20E] flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-2xs">
                    <Bot size={17} />
                  </div>
                )}

                <div className={`flex flex-col ${isUser ? 'items-end max-w-2xl' : 'items-start w-full max-w-4xl'}`}>
                  
                  {/* MESSAGE SENDER & TIMESTAMP */}
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700">
                      {isUser ? 'Channel Manager (You)' : 'SBD RGM Intelligence Agent'}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  {/* USER MESSAGE BUBBLE */}
                  {isUser ? (
                    <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-sm">
                      {msg.content}
                    </div>
                  ) : (
                    /* AGENT MESSAGE CONTAINER */
                    <div className="w-full bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
                      
                      {/* 1. AGENT SUMMARY TEXT WITH STRUCTURED MARKDOWN */}
                      <div className="text-xs text-slate-800 leading-relaxed font-sans space-y-2 whitespace-pre-line">
                        {msg.content}
                      </div>

                      {/* 2. COLLAPSIBLE EXECUTION TRACE ACCORDION */}
                      {msg.executionTrace && msg.executionTrace.length > 0 && (
                        <ExecutionTraceWidget steps={msg.executionTrace} defaultOpen={false} />
                      )}

                      {/* 4. INLINE INTERACTIVE LEVER CARD */}
                      {msg.showLeverCard && msg.levers && (
                        <LeverCardWidget
                          initialLevers={msg.levers}
                          onRunSimulation={(updated) => handleRerunSimulation(msg.id, updated)}
                        />
                      )}

                      {/* 5. SCENARIO OUTPUT CARD */}
                      {msg.showOutputCard && msg.impactMetrics && msg.scenarioTitle && msg.domain && (
                        <ScenarioOutputWidget
                          metrics={msg.impactMetrics}
                          scenarioTitle={msg.scenarioTitle}
                          domain={msg.domain}
                          targetTab={
                            msg.domain === 'pricing'
                              ? 'strategic_pricing'
                              : msg.domain === 'assortment'
                              ? 'assortment_planner'
                              : 'trade_promotions'
                          }
                          chartType={msg.chartType}
                          promoEvents={msg.promoEvents}
                          skuPriceImpacts={msg.skuPriceImpacts}
                          calendarWeeks={msg.calendarWeeks}
                          delistedSkus={msg.delistedSkus}
                          goalPillars={msg.goalPillars}
                          onSaveToTab={handleSaveToTab}
                          onExportSummary={handleExportSummary}
                        />
                      )}

                    </div>
                  )}

                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {/* LIVE AGENT THINKING / RUNNING STATE */}
          {thinkingState && (
            <div className="flex gap-3.5 justify-start animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-[#FFC20E] flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Bot size={17} />
              </div>
              <div className="w-full max-w-4xl bg-white border border-amber-300 rounded-lg p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="text-amber-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Agent Engine is Solving Commercial Scenario...
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
      </div>

      {/* 3. PROMPT INPUT BAR */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 shrink-0 shadow-2xs">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
            {/* INPUT FIELD */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask anything about RGM, pricing elasticity, trade promotions, or scenario simulation..."
                disabled={thinkingState !== null}
                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 disabled:opacity-50 font-sans"
              />
            </div>

            {/* SEND / RUN BUTTON */}
            <button
              type="submit"
              disabled={!inputPrompt.trim() || thinkingState !== null}
              className="px-4 py-2.5 bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <span>Run Scenario</span>
              <Send size={13} className="fill-slate-950" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: MONITORING CONDITIONS (INHERITED FROM PROMO EVENTS GUARDRAILS) */}
      <MonitoringConditionsSection
        onTriggerInvestigation={handleTriggerConditionInvestigation}
        onShowToast={addToast}
      />

      {/* 5. PROMPT LIBRARY MODAL */}
      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelectPrompt={handleSelectPromptFromLibrary}
        onCopyToInput={(text) => {
          setInputPrompt(text);
          setIsPromptLibraryOpen(false);
          addToast('Prompt Loaded', 'Query populated in input bar. Hit Enter to run.', 'info');
        }}
      />

    </div>
  );
}
