import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Terminal, 
  Send, 
  CheckCircle2, 
  Handshake,
  Tag,
  Boxes,
  ChevronRight,
  RefreshCw,
  Server,
  X
} from 'lucide-react';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';
import ErpPushModal from './ErpPushModal';

interface AgenticCommerceHubProps {
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  onFilterApply: () => void;
}

export type AgentId = 'promocopilot' | 'priceiq' | 'portfoliooptima' | 'termstrategy';

interface AgentDef {
  id: AgentId;
  name: string;
  codeName: string;
  badge: string;
  icon: React.ReactNode;
  tags: string[];
  description: string;
  defaultPrompt: string;
  sampleLog: string[];
  sampleOutput: {
    summary: string;
    kpis: { label: string; value: string; delta: string; isPositive: boolean }[];
    bullets: string[];
    erpPayload: string;
    riskScore: string;
  };
}

export default function AgenticCommerceHub({ filterState, onFilterChange, onFilterApply }: AgenticCommerceHubProps) {
  const [subPage, setSubPage] = useState<'marketplace' | 'terminal'>('marketplace');
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('promocopilot');
  const [promptText, setPromptText] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isErpModalOpen, setIsErpModalOpen] = useState(false);

  const agents: Record<AgentId, AgentDef> = {
    promocopilot: {
      id: 'promocopilot',
      name: 'Market Share Defender',
      codeName: 'ShareDefender',
      badge: 'COUNTER-STRIKE & TPO',
      icon: <Bot size={24} className="text-[#FFC20E]" />,
      tags: ['Competitor Counter-Striking', 'Milwaukee/Makita Threat Detection', 'Promo ROI Simulation'],
      description: 'Optimizes trade promotions by focusing specifically on counter-striking competitor threats and minimizing volume bleed to Milwaukee and Makita.',
      defaultPrompt: "Analyze Home Depot Q4 DeWalt promo risk if Milwaukee launches a 20% off M18 battery bundle in Week 46.",
      sampleLog: [
        "[Querying Circana Category POS Data] Loading Home Depot historical Q4 POS logs...",
        "[Calculating Cross-Price Elasticity vs Milwaukee] Detecting cross-elasticity bleed for 20% depth...",
        "[Mitigating Transference Risk] High transference risk detected for DeWalt 20V battery SKUs...",
        "[Optimizing Trade Spend] Synthesizing Q4 Preemptive Defensive Promo & ERP Payload..."
      ],
      sampleOutput: {
        summary: "DeWalt Q4 Home Depot Defensive Analysis complete. Launching a preemptive 15% TPR Circular Ad on DeWalt 20V prevents 800bps of volume bleed to Milwaukee's upcoming battery bundle attack.",
        riskScore: "Low Risk (12/100)",
        kpis: [
          { label: 'Market Share Retained', value: '43.1%', delta: '+170 bps Gain', isPositive: true },
          { label: 'Trade Spend', value: '$2.4M', delta: 'Within Budget', isPositive: true },
          { label: 'Volume Bleed Mitigated', value: '12.4K Units', delta: 'Protected', isPositive: true }
        ],
        bullets: [
          "Deploy preemptive defensive strike (W44) before Makita BOGO event.",
          "Recommend 15% TPR depth for DeWalt 20V Circular Saws.",
          "Shift promotional co-op allowance to digital banner placement."
        ],
        erpPayload: "Q4 DeWalt Defensive Campaign: 15% TPR depth W44 ($2.4M trade spend)"
      }
    },
    priceiq: {
      id: 'priceiq',
      name: 'Base Price Architect',
      codeName: 'PriceArchitect',
      badge: 'STRATEGIC PRICING',
      icon: <Tag size={24} className="text-[#FFC20E]" />,
      tags: ['Competitor MSRP Indexing', 'Cross-Elasticity Analysis', 'Net Price Planning'],
      description: 'Preserves margins by evaluating base pricing elasticity, indexing MSRP against competitors, and modeling tariff impact pass-throughs.',
      defaultPrompt: "Model 5% base price increase on Stanley FatMax tapes to offset raw material costs",
      sampleLog: [
        "[Ingesting POS Data] Loading base price historical elasticity curve...",
        "[Competitor MSRP Indexing] Milwaukee equivalent currently priced at $26.99 (92% index)...",
        "[Modeling Volume Impact] Simulating -0.8 elasticity impact on unit velocity...",
        "[Optimizing Price] Finalizing Net Price Planning recommendations..."
      ],
      sampleOutput: {
        summary: "Base Price Simulation complete. A 5% increase raises MSRP to $26.24. Demand elasticity (-0.8) indicates a mild volume drop, but net gross margin improves by +210 bps.",
        riskScore: "Medium Risk (45/100)",
        kpis: [
          { label: 'New Base Price', value: '$26.24', delta: '+$1.25', isPositive: true },
          { label: 'Unit Volume', value: '82.4K', delta: '-3.3%', isPositive: false },
          { label: 'Gross Margin Yield', value: '44.2%', delta: '+210 bps', isPositive: true }
        ],
        bullets: [
          "Implement 5% list price increase effective Q1 2027.",
          "Maintain current trade promotion budgets to soften consumer sticker shock.",
          "Monitor Milwaukee competitive response over next 8 weeks."
        ],
        erpPayload: "Update Base Price Condition (PR00) for FMHT33338 to $26.24 effective Jan 1"
      }
    },
    portfoliooptima: {
      id: 'portfoliooptima',
      name: 'Category Assortment Planner',
      codeName: 'AssortmentPlanner',
      badge: 'PORTFOLIO MIX',
      icon: <Boxes size={24} className="text-[#FFC20E]" />,
      tags: ['Cross-Elasticity Analysis', 'Demand Transference Modeling', 'SKU Rationalization'],
      description: 'Evaluates SKU rationalization initiatives by predicting consumer demand transference and protecting overall category volume.',
      defaultPrompt: "Evaluate demand transference if delisting 12-Pc Socket Set from Home Depot shelf",
      sampleLog: [
        "[Ingesting Assortment Data] Loading Planogram & SKU Velocity Logs...",
        "[Cross-Elasticity Analysis] Simulating consumer switching behavior (12-Pc -> 15-Pc Set)...",
        "[Evaluating Shelf Efficiency] 84% demand transference predicted to higher margin SKU...",
        "[Optimizing Assortment] SKU Rationalization Proposal generated."
      ],
      sampleOutput: {
        summary: "SKU Rationalization complete. Delisting DeWalt 12-Pc Socket Set retains 84% category volume through demand transference to 15-Pc Socket Set while freeing 2 feet of shelf space.",
        riskScore: "Low Risk (18/100)",
        kpis: [
          { label: 'Demand Transference', value: '84%', delta: 'High Retention', isPositive: true },
          { label: 'Category Volume', value: '11.8K', delta: '-1.2% net loss', isPositive: false },
          { label: 'Shelf Margin Yield', value: '$380/sqft', delta: '+14.2% lift', isPositive: true }
        ],
        bullets: [
          "Delist DeWalt 12-Pc Socket Set (SKU dw_socket_12) in H2 2026.",
          "Expand shelf facing for DeWalt 15-Pc Socket Set from 2 to 4 facings.",
          "Re-allocate saved inventory working capital."
        ],
        erpPayload: "Planogram Revision: Delist dw_socket_12, Expand dw_socket_15 facings"
      }
    },
    termstrategy: {
      id: 'termstrategy',
      name: 'Promotion Execution Agent',
      codeName: 'ExecutionAgent',
      badge: 'SAP INTEGRATION',
      icon: <Handshake size={24} className="text-[#FFC20E]" />,
      tags: ['SAP Promo Triggering', 'Retailer Win-Win Frontier', 'Pay-for-Performance'],
      description: 'Executes commercial contracts and promotions directly into SAP ERP, ensuring all trade term amendments are actively synchronized.',
      defaultPrompt: "Trigger SAP promotions for Q4 DeWalt 20V campaign",
      sampleLog: [
        "[Ingesting Contract Data] Loading Master Service Agreement (MSA) Terms...",
        "[SAP Connectivity] Establishing secure connection to SAP ERP Trade Module...",
        "[Validating Constraints] Ensuring promo depth (15%) complies with guardrails...",
        "[Executing Transaction] Trade Term & Promo Frontier Matrix synchronized."
      ],
      sampleOutput: {
        summary: "Execution complete. SAP promotions triggered for Q4 DeWalt 20V campaign. Volume rebates and co-op allowances have been successfully configured in the ERP.",
        riskScore: "Low Risk (8/100)",
        kpis: [
          { label: 'Net-Net Margin', value: '42.8%', delta: '+160 bps', isPositive: true },
          { label: 'Co-op Allowance', value: '$2.4M', delta: 'Approved', isPositive: true },
          { label: 'ERP Sync Status', value: 'Success', delta: 'Transaction 0x99A', isPositive: true }
        ],
        bullets: [
          "Structure 15% TPR threshold at Q4 W44 for DeWalt 20V Circular Saws.",
          "Cap promotional co-op contribution at $2.4M with proof-of-performance clause.",
          "Secure guaranteed end-cap placement across 1,800 storefronts."
        ],
        erpPayload: "SAP Transaction: Trigger Promo W44 15% TPR + $2.4M Co-op Cap"
      }
    }
  };

  const activeAgent = agents[selectedAgentId];

  const handleLaunchAgent = (id: AgentId) => {
    setSelectedAgentId(id);
    setPromptText(agents[id].defaultPrompt);
    setSubPage('terminal');
    setHasExecuted(false);
  };

  const handleExecutePrompt = (prompt: string) => {
    setPromptText(prompt);
    setIsExecuting(true);
    setHasExecuted(false);
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
    }, 1500);
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* HEADER */}
      <div>
        <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
          Channel Owner Home / AI Suite
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agentic Commerce Hub
          </h1>
          <span className="bg-[#FFC20E] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-sm">
            Multi-Agent Runtime
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
          Autonomous Revenue Growth Management multi-agent network powered by Gemini decision models and Databricks enterprise data pipelines.
        </p>
      </div>

      <GlobalFilterBar 
        filters={filterState} 
        onFilterChange={onFilterChange} 
        onApply={onFilterApply} 
      />

      {/* SUB-PAGE NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mt-2">
        <button
          onClick={() => setSubPage('marketplace')}
          className={`px-4 py-2 text-sm font-bold rounded-t transition-colors ${
            subPage === 'marketplace'
              ? 'bg-slate-900 text-white border-t-2 border-[#FFC20E]'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          Agent Marketplace Cards
        </button>

        <button
          onClick={() => setSubPage('terminal')}
          className={`px-4 py-2 text-sm font-bold rounded-t transition-colors flex items-center gap-2 ${
            subPage === 'terminal'
              ? 'bg-slate-900 text-white border-t-2 border-[#FFC20E]'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Terminal size={16} className={subPage === 'terminal' ? 'text-[#FFC20E]' : ''} />
          <span>Execution Terminal</span>
        </button>
      </div>

      {/* SUB-PAGE 1: AGENT MARKETPLACE GRID */}
      {subPage === 'marketplace' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(agents).map(agent => (
              <div 
                key={agent.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-sm p-6 space-y-5 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-md">
                        {agent.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                          {agent.badge}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">
                          {agent.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {agent.tags.map(t => (
                      <span key={t} className="bg-slate-50 text-slate-700 text-xs px-2.5 py-1 rounded-sm font-medium border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     Active / Gemini 2.5
                  </span>

                  <button
                    onClick={() => handleLaunchAgent(agent.id)}
                    className="bg-slate-900 hover:bg-[#FFC20E] hover:text-slate-900 text-white font-bold text-sm px-5 py-2 rounded-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Launch Agent</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-PAGE 2: INTERACTIVE EXECUTION TERMINAL */}
      {subPage === 'terminal' && (
        <div className="bg-slate-900 text-white rounded-sm p-6 space-y-6 shadow-xl animate-in fade-in">
          
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFC20E] text-slate-900 p-2.5 rounded-sm">
                {activeAgent.icon}
              </div>
              <div>
                <span className="text-[10px] text-[#FFC20E] uppercase font-bold tracking-widest block mb-0.5">
                  Interactive Terminal
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeAgent.name}</span>
                  <span className="text-slate-400 font-medium text-sm">({activeAgent.codeName})</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold">Switch Agent:</span>
              <div className="flex bg-slate-800 rounded p-1">
                {Object.values(agents).map(ag => (
                  <button
                    key={ag.id}
                    onClick={() => handleLaunchAgent(ag.id)}
                    className={`px-3 py-1.5 rounded font-bold transition-colors ${
                      ag.id === activeAgent.id ? 'bg-[#FFC20E] text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ag.codeName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pre-loaded RGM Command Chips
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExecutePrompt("Analyze Home Depot Q4 DeWalt promo risk if Milwaukee launches a 20% off M18 battery bundle in Week 46.")}
                className="bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 text-xs font-medium px-3 py-2 rounded-sm transition-colors text-left"
              >
                "Analyze Home Depot Q4 DeWalt promo risk if Milwaukee launches a 20% off M18 battery bundle in Week 46."
              </button>
              <button
                onClick={() => handleExecutePrompt("Generate preemptive defensive promo for DeWalt 20V")}
                className="bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 text-xs font-medium px-3 py-2 rounded-sm transition-colors text-left"
              >
                "Generate preemptive defensive promo for DeWalt 20V"
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <input
                type="text"
                placeholder="Type custom RGM query or directive..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-sm px-4 py-3 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-[#FFC20E] focus:ring-1 focus:ring-[#FFC20E]"
              />
              <button
                onClick={() => handleExecutePrompt(promptText || activeAgent.defaultPrompt)}
                disabled={isExecuting}
                className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold text-sm px-6 py-3 rounded-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                {isExecuting ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                <span>Execute</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-sm space-y-2 font-sans text-sm shadow-inner">
            <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-900 pb-2 mb-2">
              <span className="font-bold uppercase tracking-wider font-sans">Reasoning Log Stream</span>
              <span className="text-emerald-500 flex items-center gap-1.5 font-sans font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Agent Trace
              </span>
            </div>

            {isExecuting ? (
              <div className="py-6 text-center text-slate-400 animate-pulse space-y-2">
                <RefreshCw size={24} className="mx-auto text-[#FFC20E] animate-spin" />
                <p className="font-sans text-sm font-medium">Executing multi-agent reasoning chain...</p>
              </div>
            ) : hasExecuted ? (
              <div className="space-y-1.5 text-slate-300">
                {activeAgent.sampleLog.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-slate-600 shrink-0">&gt;</span>
                    <span className={i === activeAgent.sampleLog.length - 1 ? 'text-[#FFC20E] font-semibold' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-slate-600 font-sans text-sm font-medium">
                Awaiting execution command...
              </div>
            )}
          </div>

          {hasExecuted && !isExecuting && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 space-y-5 animate-in fade-in">
              
              <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
                <span className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FFC20E]" />
                  Interactive Decision Card
                </span>
                <span className={`text-xs px-2.5 py-1 rounded font-bold ${activeAgent.sampleOutput.riskScore.includes('Low') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {activeAgent.sampleOutput.riskScore}
                </span>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                <p className="font-medium text-white text-base leading-relaxed">{activeAgent.sampleOutput.summary}</p>
                
                <div className="mt-5 mb-3 font-bold text-slate-200">Strategic Action Directives:</div>
                <ul className="space-y-2.5 list-none pl-0">
                  {activeAgent.sampleOutput.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-[#FFC20E] shrink-0 mt-0.5" />
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {activeAgent.sampleOutput.kpis.map((k, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-700 p-4 rounded-sm shadow-inner">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{k.label}</span>
                    <span className="text-2xl font-black text-white block tracking-tight">{k.value}</span>
                    <span className={`text-xs font-bold mt-1.5 block ${k.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {k.delta}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end">
                <button
                  onClick={() => setIsErpModalOpen(true)}
                  className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-sm flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Server size={18} />
                  <span>Approve & Push to ERP</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      <ErpPushModal
        isOpen={isErpModalOpen}
        onClose={() => setIsErpModalOpen(false)}
        agentName={activeAgent.name}
        payloadSummary={activeAgent.sampleOutput.erpPayload}
      />

    </div>
  );
}
