import React, { useState } from 'react';
import { Layers, Sparkles, ArrowRight, TrendingUp, Info, RotateCcw } from 'lucide-react';
import { PORTFOLIO_SKUS } from '../data';

interface AssortmentAgentProps {
  onActivityLog: (message: string) => void;
}

export default function AssortmentAgent({ onActivityLog }: AssortmentAgentProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'workflow'>('workflow');
  const [isAiEnabled, setIsAiEnabled] = useState(false);

  const handleToggleAi = () => {
    const newState = !isAiEnabled;
    setIsAiEnabled(newState);
    onActivityLog(
      newState 
        ? "AI Assortment Architect initiated SKU rationalization. Detected high demand redundancy in socket segment." 
        : "Reset assortment matrix to baseline retail configuration."
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 text-white rounded-none flex flex-col h-[580px] w-[380px] shrink-0 transition-all duration-300 hover:border-[#FFC20E]/40 hover:shadow-[0_0_20px_rgba(255,194,14,0.05)]">
      {/* Metallic-style Header */}
      <div className="bg-zinc-950 px-4 py-3.5 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#FFC20E]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-zinc-100">AYR Assortment Architect</span>
        </div>
        <span className="bg-[#0f1b11] text-emerald-400 border border-emerald-500/10 text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
          READY
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-950/80 border-b border-zinc-800/80 text-[10px] font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex-1 py-2 text-center border-r border-zinc-800/80 transition-all font-bold ${
            activeTab === 'diagnostics' ? 'bg-zinc-900 text-[#FFC20E] border-b border-b-[#FFC20E]' : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
          }`}
        >
          Data Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex-1 py-2 text-center transition-all font-bold ${
            activeTab === 'workflow' ? 'bg-zinc-900 text-[#FFC20E] border-b border-b-[#FFC20E]' : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300'
          }`}
        >
          AI Simulation
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col justify-between bg-zinc-900/40 text-zinc-100">
        {activeTab === 'diagnostics' ? (
          /* DATA DIAGNOSTICS VIEW */
          <div className="space-y-3.5 flex-1">
            <div>
              <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                Active Assortment Baseline Performance
              </h4>
              <div className="space-y-1.5">
                {PORTFOLIO_SKUS.map(sku => (
                  <div key={sku.id} className="flex justify-between items-center text-xs p-1.5 bg-zinc-950/60 rounded-none border border-zinc-800/60">
                    <div>
                      <span className="font-bold text-zinc-200 text-[11px] uppercase tracking-tight">{sku.name}</span>
                      <p className="text-[9px] text-zinc-500 font-mono">Brand: {sku.brand} | POS: Shelf #{sku.shelfPosition}</p>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <p className="font-bold text-zinc-100">${sku.revenue.toLocaleString()}</p>
                      <p className="text-zinc-500">{sku.volume.toLocaleString()} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated cannibalization risk metric */}
            <div className="bg-zinc-950 p-3 rounded-none border border-zinc-800 text-zinc-300 font-mono text-[10px]">
              <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block">Assortment Diagnostics Warning</span>
              <p className="text-[#FFC20E] font-bold mt-1">High SKU Density Overlap Detected</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed font-sans">
                DeWalt 12-Pc Set and 15-Pc Set exhibit 89% consumer demographic alignment. Retaining both results in severe baseline dilution and high cannibalization friction.
              </p>
            </div>
          </div>
        ) : (
          /* AI SIMULATION WORKFLOW - Interactive Shelf Segment */
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Interactive Toggle Switch */}
            <div className="flex justify-between items-center bg-zinc-950 border border-zinc-800 p-3 rounded-none">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#FFC20E] animate-pulse" />
                <div>
                  <span className="text-[10px] font-mono font-bold block text-[#FFC20E] uppercase tracking-wider">AI Assortment Architect</span>
                  <span className="text-[9px] text-zinc-500 font-sans">Rationalize and run transference modeling</span>
                </div>
              </div>
              <button
                onClick={handleToggleAi}
                className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
                  isAiEnabled ? 'bg-[#FFC20E]' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    isAiEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Visual Shelf Display */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">Interactive Shelf Segment</span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Facing Segments</span>
              </div>
              
              <div className="bg-zinc-950/60 p-3 rounded-none border border-zinc-800 min-h-60 flex flex-col justify-between relative overflow-hidden">
                
                {/* Horizontal Connector Line for Demand Transference when toggled */}
                {isAiEnabled && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                    {/* Curve connector between the 12-pc and 15-pc socket sets */}
                    <path
                      d="M 160,55 Q 165,110 160,165"
                      fill="none"
                      stroke="#FFC20E"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-[progress-stripe_2s_linear_infinite]"
                    />
                    {/* Direct Arrow Indicator */}
                    <polygon points="156,161 160,169 164,161" fill="#FFC20E" />
                  </svg>
                )}

                {/* SKU Cards Shelf */}
                <div className="space-y-2.5">
                  {/* SKU 1: 12-Pc (Delist Candidate) */}
                  <div className={`p-2 rounded-none border transition-all duration-500 relative ${
                    isAiEnabled 
                      ? 'bg-red-950/20 border-red-900/40 opacity-40 scale-95' 
                      : 'bg-zinc-900/80 border-zinc-800'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">DeWalt • Facing 1</span>
                        <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-tight">DeWalt 12-Pc Socket Set</h5>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-200">$29.99</span>
                    </div>

                    {/* Transform details when AI Rationalization is toggled ON */}
                    {isAiEnabled ? (
                      <div className="mt-1.5 py-0.5 px-1.5 bg-red-950/45 text-red-400 border border-red-900/30 rounded-none text-[8.5px] font-mono font-bold flex items-center gap-1 animate-fadeIn">
                        <span>DELIST CANDIDATE - 84% DEMAND TRANSFERENCE</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-[9px] text-zinc-500 font-mono">
                        Base Volume: 4.5K units | Revenue: $134,500
                      </div>
                    )}
                  </div>

                  {/* SKU 2: 15-Pc (Organic Lift Target) */}
                  <div className={`p-2 rounded-none border transition-all duration-500 relative ${
                    isAiEnabled 
                      ? 'bg-[#FFC20E]/5 border-[#FFC20E]/30 scale-[1.01] shadow-[0_0_15px_rgba(255,194,14,0.05)]' 
                      : 'bg-zinc-900/80 border-zinc-800'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">DeWalt • Facing 2</span>
                        <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-tight">DeWalt 15-Pc Socket Set</h5>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-200">$49.99</span>
                    </div>

                    {/* Transform details when AI Rationalization is toggled ON */}
                    {isAiEnabled ? (
                      <div className="mt-1.5 py-0.5 px-1.5 bg-[#FFC20E]/10 text-zinc-100 border border-[#FFC20E]/20 rounded-none text-[8.5px] font-mono font-bold flex justify-between items-center animate-fadeIn">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={10} className="text-emerald-400 animate-pulse" />
                          +12% Organic Shelf Lift Captured
                        </span>
                        <span className="bg-[#FFC20E] text-black text-[7.5px] px-1 font-black uppercase">Retain & Expand</span>
                      </div>
                    ) : (
                      <div className="mt-1 text-[9px] text-zinc-500 font-mono">
                        Base Volume: 6.2K units | Revenue: $309,900
                      </div>
                    )}
                  </div>

                  {/* Secondary stable SKUs to complete shelf aesthetics */}
                  <div className="flex gap-2">
                    <div className="flex-1 p-1.5 bg-zinc-900 border border-zinc-800 rounded-none text-[10px]">
                      <span className="text-zinc-500 font-mono text-[8px] uppercase">Stanley</span>
                      <p className="font-bold text-zinc-300 truncate text-[10px] mt-0.5">Claw Hammer</p>
                      <span className="text-emerald-400 font-mono text-[9px] block mt-0.5">+1.5%</span>
                    </div>
                    <div className="flex-1 p-1.5 bg-zinc-900 border border-zinc-800 rounded-none text-[10px]">
                      <span className="text-zinc-500 font-mono text-[8px] uppercase">Irwin</span>
                      <p className="font-bold text-zinc-300 truncate text-[10px] mt-0.5">Vise-Grip</p>
                      <span className="text-zinc-500 font-mono text-[9px] block mt-0.5 uppercase">Stable</span>
                    </div>
                  </div>

                </div>

                {/* SBD Shelf Base */}
                <div className="bg-zinc-950 h-3 border-t border-zinc-850 mt-3 flex items-center justify-between px-2 text-[8px] text-zinc-500 font-mono uppercase font-bold tracking-wider">
                  <span>FACING GRID v2</span>
                  <span className="text-[#FFC20E]">● INTEGRATED SHELF PLANOGRAM</span>
                </div>
              </div>
            </div>

            {/* Decision explanation text block */}
            <div className="text-[10px] leading-relaxed text-zinc-400 flex gap-1.5 items-start bg-zinc-950/40 p-2.5 rounded-none border border-zinc-800/80 font-sans">
              <Info size={12} className="text-[#FFC20E] shrink-0 mt-0.5" />
              <span>
                {isAiEnabled 
                  ? "AI Transference Engine calculated that 84% of 12-Pc buyers will switch to the premium 15-Pc set rather than walk away, resulting in $42,500 net margin savings."
                  : "Enable AI Rationalization above to filter overlapping items and optimize retail shelf space productivity."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
