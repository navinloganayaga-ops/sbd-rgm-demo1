import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Workflow, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Database, 
  Clock, 
  CheckCircle2, 
  Send,
  Zap,
  Info,
  Network,
  ListFilter,
  Check,
  AlertCircle
} from 'lucide-react';
import { agenticWorkflowsList } from './mockData';
import { WorkflowItem, WorkflowDomain } from './types';
import WorkflowCard from './WorkflowCard';
import WorkflowRunModal from './WorkflowRunModal';
import WorkflowDagView from './WorkflowDagView';

interface AgenticWorkflowsViewProps {
  onNavigateTab?: (tab: string) => void;
}

interface ToastNotice {
  id: string;
  type: 'success' | 'info' | 'sync';
  title: string;
  message: string;
}

export default function AgenticWorkflowsView({ onNavigateTab }: AgenticWorkflowsViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<WorkflowDomain>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'dag' | 'audit'>('cards');
  const [activeWorkflowForRun, setActiveWorkflowForRun] = useState<WorkflowItem | null>(null);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'sync' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleGlobalRefresh = () => {
    setIsRefreshing(true);
    showToast('Syncing Agentic Pipelines', 'Polling Snowflake event streams and SAP condition queues...', 'sync');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Pipelines In Sync', '6 multi-agent pipelines evaluated. Zero exceptions.', 'success');
    }, 1200);
  };

  // Filtered workflows
  const filteredWorkflows = useMemo(() => {
    return agenticWorkflowsList.filter(wf => {
      const matchesDomain = selectedDomain === 'All' || wf.domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        wf.title.toLowerCase().includes(q) ||
        wf.code.toLowerCase().includes(q) ||
        wf.description.toLowerCase().includes(q) ||
        wf.sbdFocus.toLowerCase().includes(q) ||
        wf.retailer.toLowerCase().includes(q)
      );
      return matchesDomain && matchesSearch;
    });
  }, [selectedDomain, searchQuery]);

  const domainTabs: { domain: WorkflowDomain; count: number }[] = [
    { domain: 'All', count: agenticWorkflowsList.length },
    { domain: 'Trade Promotion', count: agenticWorkflowsList.filter(w => w.domain === 'Trade Promotion').length },
    { domain: 'Strategic Pricing', count: agenticWorkflowsList.filter(w => w.domain === 'Strategic Pricing').length },
    { domain: 'Assortment & Portfolio', count: agenticWorkflowsList.filter(w => w.domain === 'Assortment & Portfolio').length },
    { domain: 'Governance & Risk', count: agenticWorkflowsList.filter(w => w.domain === 'Governance & Risk').length },
    { domain: 'Customer JBP', count: agenticWorkflowsList.filter(w => w.domain === 'Customer JBP').length },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* TOAST NOTIFICATION CONTAINER */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-lg text-xs flex items-start gap-3 max-w-sm transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'sync'
                ? 'bg-slate-900 text-white border-slate-700'
                : toast.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            <div className="mt-0.5">
              {toast.type === 'sync' ? (
                <RefreshCw size={14} className="animate-spin text-amber-400" />
              ) : toast.type === 'info' ? (
                <Info size={14} className="text-blue-600" />
              ) : (
                <CheckCircle2 size={14} className="text-emerald-600" />
              )}
            </div>
            <div>
              <div className="font-bold">{toast.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5">{toast.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TOP HEADER & TITLE STRIP */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
              <span className="font-semibold text-slate-700">PRESCRIPTIVE & AGENTIC</span>
              <span>/</span>
              <span className="text-slate-500">AGENTIC WORKFLOWS</span>
              <span>/</span>
              <span className="text-slate-400">AUTONOMOUS RGM PIPELINES</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Agentic Workflows
              </h1>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
                Multi-Agent Orchestration
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Autonomous multi-agent orchestration pipelines for Revenue Growth Management, pricing simulation, demand transference, and commercial governance across Stanley Black & Decker brands and retail partners.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGlobalRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-amber-600' : 'text-slate-500'} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Pipelines'}</span>
            </button>

            <button
              onClick={() => setActiveWorkflowForRun(agenticWorkflowsList[0])}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-xs px-4 py-2 rounded-md flex items-center gap-2 transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Play size={13} className="fill-slate-900" />
              <span>Simulate Next Trigger</span>
            </button>
          </div>
        </div>

        {/* METRICS & STATUS RIBBON */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
              Certified Pipelines
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              6 Workflows
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              100% Operational Status
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
              Cumulative Commercial Value
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              +$14.2M Protected
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Margin & Revenue Impact
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
              Execution Success Rate
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              98.8%
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              Zero Policy Violations
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
              Connected Infrastructure
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Snowflake + SAP</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              EDI 852 & Vistex Staging
            </span>
          </div>
        </div>
      </div>

      {/* TOOLBAR: SEARCH, DOMAIN TABS, VIEW MODE */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* DOMAIN FILTER PILLS (FUNCTIONAL BUTTONS) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
          {domainTabs.map(tab => {
            const isActive = selectedDomain === tab.domain;
            return (
              <button
                key={tab.domain}
                onClick={() => setSelectedDomain(tab.domain)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.domain}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTROLS: SEARCH & VIEW SWITCHER */}
        <div className="flex items-center gap-2">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 md:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, SKU, or retailer..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
            />
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-md text-xs shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Workflow Cards Grid"
            >
              <Workflow size={13} />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setViewMode('dag')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'dag'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="DAG Architecture View"
            >
              <Network size={13} />
              <span>Architecture (DAG)</span>
            </button>

            <button
              onClick={() => setViewMode('audit')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'audit'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Execution Audit Log Stream"
            >
              <Activity size={13} />
              <span>Audit Log</span>
            </button>
          </div>
        </div>

      </div>

      {/* VIEWPORT BODY */}
      
      {/* 1. WORKFLOW CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{filteredWorkflows.length}</strong> of {agenticWorkflowsList.length} workflows</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-amber-700 font-semibold hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkflows.map(workflow => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onRunWorkflow={(wf) => setActiveWorkflowForRun(wf)}
                onShowToast={showToast}
              />
            ))}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 space-y-2">
              <Bot size={32} className="mx-auto text-slate-400" />
              <div className="text-sm font-bold text-slate-700">No matching workflows found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No workflows match your search query "{searchQuery}". Try searching for "promo", "pricing", "transference", or select "All".
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. PIPELINE CANVAS / DAG VIEW */}
      {viewMode === 'dag' && (
        <WorkflowDagView 
          workflows={agenticWorkflowsList}
          onSelectWorkflowToRun={(wf) => setActiveWorkflowForRun(wf)}
        />
      )}

      {/* 3. EXECUTION AUDIT LOG STREAM VIEW */}
      {viewMode === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Autonomous Execution & Event Stream
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time chronological audit trail of automated trigger evaluations, agent reasoning traces, and staged ERP payloads.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Streaming Active
            </span>
          </div>

          <div className="space-y-3">
            {agenticWorkflowsList.flatMap(wf => wf.simulationData.stepLogs.map(log => ({ ...log, wfCode: wf.code, wfTitle: wf.title }))).map((entry, idx) => (
              <div key={idx} className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3 text-xs flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-700 text-[10px] shrink-0 mt-0.5">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-slate-900">{entry.wfCode}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-700">{entry.stepName}</span>
                      <span className="text-slate-400 text-[11px]">({entry.agentName})</span>
                    </div>
                    <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                      {entry.log}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">{entry.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKFLOW RUN / SIMULATION MODAL */}
      {activeWorkflowForRun && (
        <WorkflowRunModal
          workflow={activeWorkflowForRun}
          isOpen={true}
          onClose={() => setActiveWorkflowForRun(null)}
          onShowToast={showToast}
        />
      )}

    </div>
  );
}
