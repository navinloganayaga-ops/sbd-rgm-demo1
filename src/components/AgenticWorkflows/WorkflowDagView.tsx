import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Bot, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Activity, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { WorkflowItem } from './types';

interface WorkflowDagViewProps {
  workflows: WorkflowItem[];
  onSelectWorkflowToRun: (workflow: WorkflowItem) => void;
}

interface DagNode {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5;
  tierName: string;
  name: string;
  type: 'data' | 'model' | 'agent' | 'guardrail' | 'execution';
  description: string;
  latency: string;
  status: 'Active' | 'Syncing' | 'Standby';
  connectedWorkflows: string[];
  metrics: string;
}

export default function WorkflowDagView({
  workflows,
  onSelectWorkflowToRun,
}: WorkflowDagViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-reasoning');

  const dagNodes: DagNode[] = [
    // TIER 1: DATA
    {
      id: 'node-snowflake',
      tier: 1,
      tierName: 'Tier 1 · Data Feeds & Streams',
      name: 'Snowflake Commercial Data Cloud',
      type: 'data',
      description: 'Ingests real-time EDI 852 point-of-sale scanner data, retailer shipments, and promotional trade ledgers.',
      latency: '80ms latency',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-02', 'WF-RGM-03', 'WF-RGM-04'],
      metrics: '2.4M POS records / hr'
    },
    {
      id: 'node-sap-cogs',
      tier: 1,
      tierName: 'Tier 1 · Data Feeds & Streams',
      name: 'SAP ERP Actuals & Master COGS',
      type: 'data',
      description: 'Feeds current manufacturing Bill of Materials, cold rolled steel indices, logistics surcharges, and MSA contract baselines.',
      latency: '120ms latency',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-02', 'WF-RGM-04', 'WF-RGM-05'],
      metrics: '14,800 active SKU masters'
    },
    {
      id: 'node-competitor-scraper',
      tier: 1,
      tierName: 'Tier 1 · Data Feeds & Streams',
      name: 'Retailer Circular & Scraping Agent',
      type: 'data',
      description: 'Surveils digital weekly ads and circulars from Home Depot, Lowe\'s, and Menards to flag rival price movements.',
      latency: '340ms latency',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-02'],
      metrics: '42 retail banners tracked'
    },

    // TIER 2: MODELS
    {
      id: 'node-elasticity-model',
      tier: 2,
      tierName: 'Tier 2 · ML & Quantitative Models',
      name: 'Cross-Price Elasticity Engine',
      type: 'model',
      description: 'Computes non-linear volume elasticity S-curves and cross-elasticity demand transference versus Milwaukee and Makita.',
      latency: '280ms inference',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-02', 'WF-RGM-06'],
      metrics: 'R² 0.91 · MAPE 4.2%'
    },
    {
      id: 'node-transference-model',
      tier: 2,
      tierName: 'Tier 2 · ML & Quantitative Models',
      name: 'Demand Transference Matrix Model',
      type: 'model',
      description: 'Predicts consumer substitution walk-rates and assortment switching probabilities when rationalizing tail SKUs.',
      latency: '320ms inference',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-03', 'WF-RGM-06'],
      metrics: 'R² 0.94 · 84.6% retention'
    },
    {
      id: 'node-lift-model',
      tier: 2,
      tierName: 'Tier 2 · ML & Quantitative Models',
      name: 'Promo Lift Decomposition Engine',
      type: 'model',
      description: 'Decomposes promotional sales into pure incremental lift, forward-buy drag, category halo, and cannibalization.',
      latency: '260ms inference',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-05'],
      metrics: 'R² 0.89 · 5-factor split'
    },

    // TIER 3: AGENTS
    {
      id: 'node-reasoning',
      tier: 3,
      tierName: 'Tier 3 · Autonomous Agent Reasoning',
      name: 'Gemini 2.5 Flash Strategic Reasoner',
      type: 'agent',
      description: 'Synthesizes multi-factor commercial counter-tactics, trade spend optimization, and plain-English executive explanations.',
      latency: '410ms reasoning',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-02', 'WF-RGM-03', 'WF-RGM-05', 'WF-RGM-06'],
      metrics: 'Autonomous Scenario Engine'
    },
    {
      id: 'node-frontier-agent',
      tier: 3,
      tierName: 'Tier 3 · Autonomous Agent Reasoning',
      name: 'Pareto Win-Win Frontier Negotiator',
      type: 'agent',
      description: 'Simulates hundreds of joint business planning trade term trade-offs to plot mutual win-win frontier curves.',
      latency: '510ms reasoning',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-05'],
      metrics: 'Game-Theoretic Optimizer'
    },
    {
      id: 'node-shap-explainer',
      tier: 3,
      tierName: 'Tier 3 · Autonomous Agent Reasoning',
      name: 'SHAP Driver Root-Cause Diagnostics',
      type: 'agent',
      description: 'Isolates exact Shapley value driver contributions for margin variances and promotional anomalies.',
      latency: '190ms reasoning',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-04'],
      metrics: 'Explainable AI Governance'
    },

    // TIER 4: GUARDRAILS
    {
      id: 'node-guardrail-engine',
      tier: 4,
      tierName: 'Tier 4 · Commercial Guardrails & Risk',
      name: 'SBD Policy Guardrail Rule Engine',
      type: 'guardrail',
      description: 'Hard financial tripwires enforcing 42.0% Net-Net margin floors, maximum 20% discount depths, and GTN spend caps.',
      latency: '60ms check',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-02', 'WF-RGM-03', 'WF-RGM-04', 'WF-RGM-05', 'WF-RGM-06'],
      metrics: '14 Active Guardrails Enforced'
    },
    {
      id: 'node-brand-arbitrage',
      tier: 4,
      tierName: 'Tier 4 · Commercial Guardrails & Risk',
      name: 'Brand Lane Clearance Checker',
      type: 'guardrail',
      description: 'Maintains clean $6.00+ price gaps between Stanley (Good), Craftsman (Better), and DeWalt (Best) brand tiers.',
      latency: '40ms check',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-02'],
      metrics: 'Zero Brand Cannibalization'
    },

    // TIER 5: EXECUTION
    {
      id: 'node-sap-vistex',
      tier: 5,
      tierName: 'Tier 5 · ERP Execution & Systems',
      name: 'SAP Vistex Trade Management Staging',
      type: 'execution',
      description: 'Stages formal PR00 price condition contracts and PCR promotion records ready for ERP ledger posting.',
      latency: '190ms commit',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-01', 'WF-RGM-02', 'WF-RGM-04'],
      metrics: '100% Automated Staging'
    },
    {
      id: 'node-blue-yonder',
      tier: 5,
      tierName: 'Tier 5 · ERP Execution & Systems',
      name: 'Blue Yonder / JDA Planogram Sync',
      type: 'execution',
      description: 'Exports industry-standard PSA planogram schematics directly to retail merchant space planning portals.',
      latency: '240ms export',
      status: 'Active',
      connectedWorkflows: ['WF-RGM-03'],
      metrics: 'Store POG Automation'
    }
  ];

  const selectedNode = dagNodes.find(n => n.id === selectedNodeId) || dagNodes[6];

  const getNodeIcon = (type: DagNode['type']) => {
    switch (type) {
      case 'data':
        return <Database size={15} className="text-blue-600" />;
      case 'model':
        return <Activity size={15} className="text-indigo-600" />;
      case 'agent':
        return <Bot size={15} className="text-amber-600" />;
      case 'guardrail':
        return <ShieldCheck size={15} className="text-emerald-600" />;
      case 'execution':
        return <Send size={15} className="text-slate-700" />;
      default:
        return <Cpu size={15} />;
    }
  };

  const getTierNodes = (tier: number) => dagNodes.filter(n => n.tier === tier);

  return (
    <div className="space-y-4">
      
      {/* SECTION BANNER */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              End-to-End Orchestration Architecture
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-700">Real-Time Data Flow Active</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Multi-Agent Directed Acyclic Graph (DAG)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
            Trace how live Snowflake POS signals propagate through predictive econometrics models, autonomous Gemini reasoning agents, SBD policy guardrails, and final SAP ERP condition execution.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-md p-2.5 text-xs shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Pipeline Nodes</div>
            <div className="font-bold text-slate-900">{dagNodes.length} Certified Nodes</div>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Active Workflows</div>
            <div className="font-bold text-slate-900">6 Multi-Agent Pipelines</div>
          </div>
        </div>
      </div>

      {/* DAG MAIN VIEWPORT (5 TIERS HORIZONTAL FLOW) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* LEFT 3 COLS: 5 TIERS VISUAL PIPELINE */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-4 overflow-x-auto">
          
          {[1, 2, 3, 4, 5].map((tierNum) => {
            const tierNodes = getTierNodes(tierNum);
            const tierTitle = tierNodes[0]?.tierName || `Tier ${tierNum}`;

            return (
              <div key={tierNum} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {tierTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {tierNodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`text-left p-3 rounded-md border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-50/70 border-amber-400 shadow-xs ring-1 ring-amber-300' 
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="p-1.5 rounded bg-white border border-slate-200/80 shadow-2xs">
                            {getNodeIcon(node.type)}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{node.latency}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug truncate" title={node.name}>
                          {node.name}
                        </h4>

                        <div className="text-[10px] text-slate-500 truncate mt-1">
                          {node.metrics}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">
                            {node.connectedWorkflows.length} Workflows
                          </span>
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            {node.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>

        {/* RIGHT 1 COL: NODE INSPECTOR SIDEBAR */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Node Inspector
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-slate-100 border border-slate-200">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {selectedNode.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">{selectedNode.tierName}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Operational Description
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="bg-slate-50 border border-slate-200/80 rounded p-2 text-xs flex justify-between">
                <span className="text-slate-500">Latency:</span>
                <span className="font-mono font-bold text-slate-800">{selectedNode.latency}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded p-2 text-xs flex justify-between">
                <span className="text-slate-500">Throughput / Accuracy:</span>
                <span className="font-bold text-slate-800">{selectedNode.metrics}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded p-2 text-xs flex justify-between">
                <span className="text-slate-500">Service Status:</span>
                <span className="font-semibold text-emerald-700">{selectedNode.status}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Connected Agentic Workflows ({selectedNode.connectedWorkflows.length})
              </span>
              <div className="space-y-1.5">
                {selectedNode.connectedWorkflows.map((wfCode) => {
                  const matchedWf = workflows.find(w => w.code === wfCode);
                  if (!matchedWf) return null;
                  return (
                    <div 
                      key={wfCode} 
                      className="bg-slate-50 border border-slate-200/80 rounded p-2 text-xs flex items-center justify-between"
                    >
                      <div className="truncate mr-2">
                        <span className="font-mono font-bold text-slate-800 mr-1.5">{matchedWf.code}</span>
                        <span className="text-slate-600 truncate">{matchedWf.title}</span>
                      </div>
                      <button
                        onClick={() => onSelectWorkflowToRun(matchedWf)}
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800 shrink-0 px-2 py-0.5 bg-amber-50 rounded border border-amber-200 cursor-pointer"
                      >
                        Run
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-400">
              Select any node across the 5 tiers to view real-time parameters and connected pipelines.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
