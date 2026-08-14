import React, { useState, useEffect } from 'react';
import { Package, HelpCircle, CheckSquare, Square, Sparkles, TrendingUp, UserCheck, Shield } from 'lucide-react';
import { KIT_COMPONENTS } from '../data';

interface PpaChoiceEngineProps {
  onActivityLog: (message: string) => void;
}

export default function PpaChoiceEngine({ onActivityLog }: PpaChoiceEngineProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'workflow'>('workflow');
  
  // Selected combo pieces
  const [selectedItems, setSelectedItems] = useState<string[]>(['drill_body', 'battery_2ah']);

  // Scorecard values
  const [revLift, setRevLift] = useState(6.8);
  const [choiceProb, setChoiceProb] = useState(72);
  const [optimalMSRP, setOptimalMSRP] = useState(189.00);

  // SVG Curve shifting factor
  const [shiftX, setShiftX] = useState(0);

  // Calculate combo impact
  useEffect(() => {
    // Determine combined attributes
    const hasDrill = selectedItems.includes('drill_body');
    const has2Ah = selectedItems.includes('battery_2ah');
    const has5Ah = selectedItems.includes('battery_5ah');
    const hasCase = selectedItems.includes('tough_case');

    let calculatedMSRP = 0;
    let calculatedLift = 0;
    let calculatedChoice = 50;

    // Sum up WTP contributions to calculate suggested MSRP
    selectedItems.forEach(id => {
      const item = KIT_COMPONENTS.find(c => c.id === id);
      if (item) {
        calculatedMSRP += item.wtpContribution * 1.35;
      }
    });

    // Custom configuration formulas for realistic outcomes
    if (hasDrill && has2Ah && !has5Ah && !hasCase) {
      calculatedLift = 4.2;
      calculatedChoice = 65;
      calculatedMSRP = 149.00;
    } else if (hasDrill && has2Ah && hasCase && !has5Ah) {
      calculatedLift = 6.8;
      calculatedChoice = 72;
      calculatedMSRP = 189.00;
    } else if (hasDrill && has5Ah && !has2Ah && !hasCase) {
      calculatedLift = 8.5;
      calculatedChoice = 58;
      calculatedMSRP = 219.00;
    } else if (hasDrill && has5Ah && hasCase && !has2Ah) {
      calculatedLift = 11.4;
      calculatedChoice = 76;
      calculatedMSRP = 249.00;
    } else if (hasDrill && has2Ah && has5Ah && hasCase) {
      calculatedLift = 14.8;
      calculatedChoice = 82;
      calculatedMSRP = 299.00;
    } else {
      // General combinations fallback
      calculatedLift = selectedItems.length * 2.5;
      calculatedChoice = 40 + (selectedItems.length * 8);
      calculatedMSRP = Math.max(39.00, Math.round(calculatedMSRP));
    }

    setRevLift(Math.round(calculatedLift * 10) / 10);
    setChoiceProb(calculatedChoice);
    setOptimalMSRP(Math.round(calculatedMSRP));

    // Shift willingness to pay curve to the right based on kit complexity
    setShiftX(selectedItems.length * 25);

  }, [selectedItems]);

  const handleToggleItem = (id: string) => {
    let nextSelection = [...selectedItems];
    if (nextSelection.includes(id)) {
      // Don't let users unselect everything
      if (nextSelection.length <= 1) return;
      nextSelection = nextSelection.filter(item => item !== id);
    } else {
      nextSelection.push(id);
    }
    setSelectedItems(nextSelection);
    
    const item = KIT_COMPONENTS.find(c => c.id === id);
    onActivityLog(`Kit Constructor modified. ${nextSelection.includes(id) ? 'Added' : 'Removed'} ${item?.name || id}.`);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 text-white rounded-none flex flex-col h-[580px] w-[380px] shrink-0 transition-all duration-300 hover:border-[#FFC20E]/40 hover:shadow-[0_0_20px_rgba(255,194,14,0.05)]">
      {/* Metallic-style Header */}
      <div className="bg-zinc-950 px-4 py-3.5 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-[#FFC20E]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-zinc-100">PPA Choice Model Engine</span>
        </div>
        <span className="bg-[#0f1b11] text-emerald-400 border border-emerald-500/10 text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
          ACTIVE
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
            <div className="bg-zinc-950/60 p-3 rounded-none border border-zinc-800 space-y-2">
              <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 font-bold">
                Willingness-to-pay (WTP) Segments
              </h4>
              <div className="space-y-2 font-mono text-[9px] text-zinc-400">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="font-bold text-zinc-200">DIY Consumer Range</span>
                  <span>$89.00 - $149.00 MSRP</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="font-bold text-zinc-200">Prosumer Combo Range</span>
                  <span>$159.00 - $249.00 MSRP</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-bold text-zinc-200">Industrial Heavy Range</span>
                  <span>$259.00 - $399.00 MSRP</span>
                </div>
              </div>
            </div>

            {/* Component utility coefficients table */}
            <div className="bg-zinc-950 p-3 rounded-none border border-zinc-800 text-zinc-300 font-mono text-xs">
              <span className="text-[9px] text-zinc-500 uppercase mb-2 block font-bold tracking-wider">Component Consumer Utility Scores</span>
              <div className="grid grid-cols-2 gap-2 text-[9px] text-zinc-400">
                {KIT_COMPONENTS.map(c => (
                  <div key={c.id} className="flex justify-between border-b border-zinc-900 pb-1">
                    <span className="text-zinc-400 text-left truncate max-w-[110px] uppercase text-[8.5px] font-bold">{c.name}</span>
                    <span className="text-[#FFC20E] font-bold font-mono">+{c.wtpContribution} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 leading-relaxed border-l border-[#FFC20E] pl-2 mt-1 font-sans">
              Discrete Choice Modeling algorithms mathematically predict share-of-market trade-offs by evaluating consumer utility score sets against baseline competitive offerings.
            </p>
          </div>
        ) : (
          /* AI SIMULATION WORKFLOW - Kit Constructor */
          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Kit Constructor Workspace */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block mb-1.5 uppercase font-bold tracking-wider">
                Kit Constructor Workspace
              </span>
              
              <div className="grid grid-cols-1 gap-1.5 bg-zinc-950/40 p-2 rounded-none border border-zinc-850">
                {KIT_COMPONENTS.map(item => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleItem(item.id)}
                      className={`flex items-center justify-between p-2 rounded-none border text-left transition-all text-xs cursor-pointer ${
                        isSelected 
                          ? 'bg-zinc-900 border-[#FFC20E]/40 shadow-sm font-bold text-white' 
                          : 'bg-zinc-950/80 border-zinc-900 text-zinc-500 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare size={13} className="text-[#FFC20E] fill-[#FFC20E]/10" />
                        ) : (
                          <Square size={13} className="text-zinc-700" />
                        )}
                        <span className="uppercase text-[9.5px] font-bold tracking-tight">{item.name}</span>
                      </div>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase">
                        Cost: ${item.baseCost}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Willingness-To-Pay curve SVG visualizer */}
            <div className="bg-zinc-950 p-2 rounded-none border border-zinc-850">
              <span className="text-[9px] font-mono text-zinc-500 block mb-1 uppercase tracking-wider font-bold">
                Willingness-to-Pay (WTP) Distribution
              </span>
              
              <div className="relative h-14 flex items-end">
                {/* SVG Curve shifting relative to selection */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Grid marker line */}
                  <line x1="165" y1="0" x2="165" y2="56" stroke="#18181b" strokeWidth="1" strokeDasharray="2 2" />
                  
                  {/* Dynamic Curve */}
                  <path
                    d={`M ${20 + shiftX / 2},50 Q ${120 + shiftX},5 ${260 + shiftX},50`}
                    fill="rgba(255, 194, 14, 0.05)"
                    stroke="#FFC20E"
                    strokeWidth="1.5"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                
                <div className="absolute left-2 bottom-1 text-[8px] font-mono text-zinc-600 uppercase">Low Price</div>
                <div className="absolute right-2 bottom-1 text-[8px] font-mono text-zinc-600 uppercase">Premium Pro</div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1 text-[7.5px] font-mono text-[#FFC20E] uppercase tracking-widest text-center">
                  Target Segment Peak
                </div>
              </div>
            </div>

            {/* Output Scorecard metrics */}
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
              <div className="bg-zinc-950 p-2 rounded-none border border-zinc-850">
                <span className="text-[8px] text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Revenue Lift</span>
                <span className="text-xs font-bold text-emerald-400">+{revLift}%</span>
              </div>
              
              <div className="bg-zinc-950 p-2 rounded-none border border-zinc-850">
                <span className="text-[8px] text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Choice Prob</span>
                <span className="text-xs font-bold text-zinc-200">{choiceProb}%</span>
              </div>

              <div className="bg-zinc-950 p-2 rounded-none border border-[#FFC20E]/20 text-white">
                <span className="text-[8px] text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Optimal Price</span>
                <span className="text-xs font-extrabold text-[#FFC20E]">${optimalMSRP}</span>
              </div>
            </div>

            {/* AI suggestion text */}
            <div className="bg-[#FFC20E]/5 border border-[#FFC20E]/20 rounded-none p-2.5 text-[10px] text-zinc-300 leading-relaxed flex gap-2 font-sans">
              <Sparkles size={12} className="text-[#FFC20E] shrink-0 mt-0.5 fill-[#FFC20E]/10" />
              <div>
                <strong className="font-mono text-[9px] uppercase tracking-wider text-[#FFC20E] block mb-0.5">Choice Recommendation:</strong>
                <span>
                  A combo bundle consisting of {selectedItems.length} components maximizes choice volume share. MSRP priced at <span className="font-extrabold font-mono text-[#FFC20E]">${optimalMSRP}.00</span> captures optimal margin without causing consumer transference back to baseline individual parts.
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
