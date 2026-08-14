import React, { useState, useEffect } from 'react';
import { Handshake, AlertTriangle, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface TermsContractSimulatorProps {
  onActivityLog: (message: string) => void;
}

export default function TermsContractSimulator({ onActivityLog }: TermsContractSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'workflow'>('workflow');
  const [selectedBuyer, setSelectedBuyer] = useState('ace');
  
  // Proposed Terms Sliders
  const [volumeDiscount, setVolumeDiscount] = useState(5.5);
  const [coOpMarketing, setCoOpMarketing] = useState(3.0);

  // Dynamic simulation outcomes
  const [buyerScore, setBuyerScore] = useState(78);
  const [sbdMargin, setSbdMargin] = useState(45.2);
  const [isWarningActive, setIsWarningActive] = useState(false);

  // Calculate terms dynamics
  useEffect(() => {
    // Buyer score logic: Buyers love discounts and co-op marketing
    // Base scores vary slightly by retailer profile
    let baseScore = 32;
    if (selectedBuyer === 'hd') baseScore = 25; // Tougher negotiators
    if (selectedBuyer === 'lowes') baseScore = 28;

    const discountWeight = selectedBuyer === 'hd' ? 4.2 : 5.0;
    const coOpWeight = selectedBuyer === 'amazon' ? 7.5 : 6.0;

    const calculatedBuyerScore = Math.min(
      100, 
      Math.max(10, Math.round(baseScore + (volumeDiscount * discountWeight) + (coOpMarketing * coOpWeight)))
    );

    // SBD Margin logic: Margin decreases as SBD gives deeper discounts/co-op
    const baseSbdMargin = 55.0;
    const calculatedSbdMargin = Math.max(
      20,
      Math.round((baseSbdMargin - (volumeDiscount * 1.15) - (coOpMarketing * 0.95)) * 10) / 10
    );

    setBuyerScore(calculatedBuyerScore);
    setSbdMargin(calculatedSbdMargin);

    // Warning light conditions: Trigger warning if Co-op falls below 2.2% at Ace or other channels
    if (coOpMarketing < 2.2) {
      if (!isWarningActive) {
        setIsWarningActive(true);
        onActivityLog(`High Risk Warning triggered: Co-op Marketing proposed at ${coOpMarketing}% is below critical threshold of 2.2%.`);
      }
    } else {
      setIsWarningActive(false);
    }
  }, [volumeDiscount, coOpMarketing, selectedBuyer]);

  // Log user edits occasionally
  const handleSliderRelease = (type: string, value: number) => {
    onActivityLog(`Adjusted ${type} to ${value}%. Buyer Score updated to ${buyerScore}%.`);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 text-white rounded-none flex flex-col h-[580px] w-[380px] shrink-0 transition-all duration-300 hover:border-[#FFC20E]/40 hover:shadow-[0_0_20px_rgba(255,194,14,0.05)]">
      {/* Metallic-style Header */}
      <div className="bg-zinc-950 px-4 py-3.5 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Handshake size={14} className="text-[#FFC20E]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-zinc-100">Trade Terms Margin Frontier</span>
        </div>
        <span className="bg-[#1c1809] text-[#FFC20E] border border-[#FFC20E]/20 text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider animate-pulse">
          Simulating
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
          <div className="space-y-4 flex-1">
            <div className="bg-zinc-950/60 p-3 rounded-none border border-zinc-800 text-xs space-y-2">
              <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 font-bold">Retailer Baseline Guidelines</h4>
              
              <div className="space-y-1.5 font-mono text-[9px] text-zinc-400">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="font-bold text-zinc-200">Home Depot</span>
                  <span>Target Discount: 6.0% | Target Co-op: 3.5%</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="font-bold text-zinc-200">Lowe's</span>
                  <span>Target Discount: 5.5% | Target Co-op: 3.2%</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="font-bold text-zinc-200">Ace Hardware</span>
                  <span>Target Discount: 4.5% | Target Co-op: 2.2%</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-bold text-zinc-200">Amazon</span>
                  <span>Target Discount: 8.0% | Target Co-op: 4.5%</span>
                </div>
              </div>
            </div>

            {/* Negotiation Frontier Chart */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block mb-1 font-bold uppercase tracking-wider">Contract Negotiation Frontier Map</span>
              <div className="bg-zinc-950 border border-zinc-800 rounded-none text-zinc-300 font-mono text-[10px] p-3">
                <div className="flex justify-between text-[8px] text-zinc-500 border-b border-zinc-900 pb-1 mb-2 uppercase">
                  <span>SBD Margin vs Buyer Satisfaction</span>
                  <span>Theoretical Equilibrium</span>
                </div>
                
                <div className="space-y-2 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase text-[8px]">Aggressive SBD Deal:</span>
                    <span className="text-red-400">Buyer Score: 45% (High Friction)</span>
                  </div>
                  <div className="w-full bg-zinc-900 border border-zinc-850 h-1.5 rounded-none">
                    <div className="bg-red-500 h-full" style={{ width: '45%' }}></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase text-[8px]">Equilibrium Frontier:</span>
                    <span className="text-[#FFC20E]">Buyer Score: 75% (Win-Win)</span>
                  </div>
                  <div className="w-full bg-zinc-900 border border-zinc-850 h-1.5 rounded-none">
                    <div className="bg-[#FFC20E] h-full" style={{ width: '75%' }}></div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase text-[8px]">Over-Generous Deal:</span>
                    <span className="text-emerald-400">Buyer Score: 95% (Margin Loss)</span>
                  </div>
                  <div className="w-full bg-zinc-900 border border-zinc-850 h-1.5 rounded-none">
                    <div className="bg-emerald-500 h-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 leading-normal border-l border-[#FFC20E] pl-2 mt-2 font-sans">
              Our trade terms algorithm optimizes negotiations on the Pareto Frontier, mapping the exact curve where supplier margins are preserved without alienating channel partnerships.
            </div>
          </div>
        ) : (
          /* AI SIMULATION WORKFLOW */
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {/* Buyer Selector */}
            <div className="text-xs">
              <label className="block text-zinc-500 font-mono mb-1 uppercase text-[9px] tracking-wider">Retail Partner Profile</label>
              <select
                value={selectedBuyer}
                onChange={(e) => setSelectedBuyer(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-none p-1.5 font-sans font-bold text-zinc-200 focus:outline-none focus:border-[#FFC20E] text-xs"
              >
                <option value="hd">Home Depot (Pro/DIY Heavy)</option>
                <option value="lowes">Lowe's (DIY Oriented)</option>
                <option value="ace">Ace Hardware (Franchise/Local)</option>
                <option value="amazon">Amazon (Pure-play e-Commerce)</option>
              </select>
            </div>

            {/* Negotiation Sliders Panel */}
            <div className="bg-zinc-950/40 p-3 rounded-none border border-zinc-800 space-y-3.5">
              <span className="font-mono text-[9px] text-zinc-400 uppercase font-black block">
                SBD Proposed Terms Input
              </span>

              {/* Slider 1: Volume Discount */}
              <div>
                <div className="flex justify-between items-center mb-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <span>Volume Discounts</span>
                  <span className="font-extrabold text-[#FFC20E]">{volumeDiscount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={volumeDiscount}
                  onChange={(e) => setVolumeDiscount(Number(e.target.value))}
                  onMouseUp={() => handleSliderRelease('Volume Discount', volumeDiscount)}
                  onTouchEnd={() => handleSliderRelease('Volume Discount', volumeDiscount)}
                  className="w-full"
                />
              </div>

              {/* Slider 2: Co-op Marketing */}
              <div>
                <div className="flex justify-between items-center mb-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <span>Co-op Marketing Funds</span>
                  <span className={`font-extrabold ${coOpMarketing < 2.2 ? 'text-red-400' : 'text-zinc-200'}`}>
                    {coOpMarketing}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={coOpMarketing}
                  onChange={(e) => setCoOpMarketing(Number(e.target.value))}
                  onMouseUp={() => handleSliderRelease('Co-op Marketing', coOpMarketing)}
                  onTouchEnd={() => handleSliderRelease('Co-op Marketing', coOpMarketing)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Split Metrics Outcome Display */}
            <div className="grid grid-cols-2 gap-2 text-center">
              {/* Buyer Score Gauge */}
              <div className="bg-zinc-950 p-2.5 rounded-none border border-zinc-800 text-white flex flex-col justify-between">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Retailer Win Score</span>
                <div className="my-2 text-2xl font-display font-black text-[#FFC20E]">
                  {buyerScore}%
                </div>
                
                {/* Score health pill */}
                <span className={`inline-block mx-auto px-2 py-0.5 rounded-none text-[8px] font-mono font-extrabold uppercase ${
                  buyerScore >= 70 && buyerScore <= 85 
                    ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/30' 
                    : buyerScore > 85 
                    ? 'bg-amber-950/30 text-[#FFC20E] border border-[#FFC20E]/20'
                    : 'bg-red-950/30 text-red-400 border border-red-900/30'
                }`}>
                  {buyerScore >= 70 && buyerScore <= 85 ? 'Win-Win Deal' : buyerScore > 85 ? 'Margin Leakage' : 'High Friction'}
                </span>
              </div>

              {/* SBD Gross Margin Projected */}
              <div className="bg-zinc-950/60 p-2.5 rounded-none border border-zinc-800 text-zinc-300 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Projected SBD Margin</span>
                <div className="my-2 text-2xl font-display font-black text-zinc-100">
                  {sbdMargin}%
                </div>
                
                {/* Profitability Index indicator */}
                <div className="flex items-center justify-center gap-1 text-[8.5px] font-mono text-zinc-500 uppercase">
                  <TrendingUp size={10} className="text-emerald-400" />
                  <span>Target: &gt;42.0%</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Warnings Indicator block */}
            {isWarningActive ? (
              <div className="bg-red-950/15 border border-red-900/40 rounded-none p-2 flex gap-2 items-start text-red-200 animate-pulse font-sans">
                <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <div className="text-[9.5px] leading-tight text-red-300">
                  <span className="font-bold font-mono text-red-400 uppercase tracking-wider text-[8px] block mb-0.5">⚠️ High Risk Warning</span> 
                  Dropping Co-op below 2.2% triggers automatic category review protocols at Ace Hardware. Contract signature blocks might fail.
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/15 border border-emerald-900/40 rounded-none p-2 flex gap-2 items-start text-emerald-200 font-sans">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[9.5px] leading-tight text-emerald-300">
                  <span className="font-bold font-mono text-emerald-400 uppercase tracking-wider text-[8px] block mb-0.5">✓ Frontier Status Safe</span> 
                  Contract terms lie comfortably inside the win-win frontier region. Category reviews are bypassed.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
