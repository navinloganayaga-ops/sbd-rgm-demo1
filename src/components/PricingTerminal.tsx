import React, { useState, useEffect } from 'react';
import { Tag, Send, Sparkles, Sliders, TrendingUp, HelpCircle } from 'lucide-react';
import { ELASTICITY_GRID } from '../data';

interface PricingTerminalProps {
  onActivityLog: (message: string) => void;
}

export default function PricingTerminal({ onActivityLog }: PricingTerminalProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'workflow'>('workflow');
  
  // Selected category and channel from the grid
  const [selectedCell, setSelectedCell] = useState({
    category: 'Power Tools',
    channel: 'Home Depot'
  });

  const [tariffShock, setTariffShock] = useState(5);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  // Dynamic pricing state based on selected cell and tariff shock
  const [originalPrice, setOriginalPrice] = useState(149.99);
  const [recommendedPrice, setRecommendedPrice] = useState(154.99);
  const [volumeChange, setVolumeChange] = useState(-2.1);
  const [marginPreserved, setMarginPreserved] = useState(1.85);

  const activeCoefficient = ELASTICITY_GRID.find(
    item => item.category === selectedCell.category && item.channel === selectedCell.channel
  )?.coefficient || -1.5;

  const activeBaseline = ELASTICITY_GRID.find(
    item => item.category === selectedCell.category && item.channel === selectedCell.channel
  )?.baselineVolume || 10000;

  // Handle cell click from the heatmap
  const handleCellClick = (category: string, channel: string) => {
    setSelectedCell({ category, channel });
    onActivityLog(`Pricing Matrix context changed to: Category [${category}], Channel [${channel}].`);
  };

  // Run the LLM simulation when selection or sliders change
  useEffect(() => {
    setIsTyping(true);
    
    // Determine dynamic values based on category & coefficient
    let basePrice = 14.99; // Default Stanley Tape
    if (selectedCell.category === 'Power Tools') {
      basePrice = 199.00;
    } else if (selectedCell.category === 'Storage') {
      basePrice = 79.99;
    }

    // Mathematical calculations
    // Price elasticity formula: % Change in Volume = Coefficient * % Change in Price
    // Let's model a optimal price recommendation that passes some cost to consumer
    // Optimal price increases when tariff shock increases, but bounded by coefficient severity
    const priceIncreasePct = (tariffShock * 0.75) / Math.abs(activeCoefficient);
    const recommended = basePrice * (1 + priceIncreasePct / 100);
    const actualIncreasePct = ((recommended - basePrice) / basePrice) * 100;
    const volDrop = activeCoefficient * actualIncreasePct;
    
    // Net Margin impact considering the tariff shock reduces margin, but price increase recovers it
    const costImpact = tariffShock * -0.5; // cost goes up
    const priceBenefit = actualIncreasePct * 0.6; // margin goes up
    const netMargin = costImpact + priceBenefit;

    const timer = setTimeout(() => {
      setIsTyping(false);
      setOriginalPrice(Math.round(basePrice * 100) / 100);
      setRecommendedPrice(Math.round(recommended * 100) / 100);
      setVolumeChange(Math.round(volDrop * 100) / 100);
      setMarginPreserved(Math.round(netMargin * 100) / 100);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCell, tariffShock, activeCoefficient]);

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 text-white rounded-none flex flex-col h-[580px] w-[380px] shrink-0 transition-all duration-300 hover:border-[#FFC20E]/40 hover:shadow-[0_0_20px_rgba(255,194,14,0.05)]">
      {/* Metallic-style Header */}
      <div className="bg-zinc-950 px-4 py-3.5 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-[#FFC20E]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-zinc-100">Strategic Pricing Matrix</span>
        </div>
        <span className="bg-[#0f1b11] text-emerald-400 border border-emerald-500/10 text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
          LIVE
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
          /* DATA DIAGNOSTICS VIEW - Elasticity Heatmap */
          <div className="space-y-4 flex-1">
            <div>
              <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 font-bold">
                Channel Elasticity Coefficient Heatmap
              </h4>
              <p className="text-[9px] text-zinc-500 mb-2 font-sans">
                Click cells to dynamically redirect the AI Copilot target context.
              </p>

              {/* Heatmap Grid */}
              <div className="border border-zinc-800 rounded-none overflow-hidden text-xs bg-zinc-950/40">
                {/* Header Row */}
                <div className="grid grid-cols-4 bg-zinc-950/80 border-b border-zinc-800 text-[9px] font-mono text-zinc-500 text-center py-1.5 font-bold uppercase tracking-wider">
                  <div className="text-left pl-2">Segment</div>
                  <div>Home Depot</div>
                  <div>Lowe's</div>
                  <div>Ind. Dist.</div>
                </div>

                {/* Grid Categories */}
                {['Power Tools', 'Hand Tools', 'Storage'].map(category => (
                  <div key={category} className="grid grid-cols-4 border-b border-zinc-900/60 py-1 items-center">
                    <div className="font-mono text-[9px] pl-2 text-zinc-400 font-bold uppercase">{category}</div>
                    
                    {['Home Depot', "Lowe's", 'Industrial Dist.'].map(channel => {
                      const item = ELASTICITY_GRID.find(
                        g => g.category === category && g.channel === channel
                      );
                      const isSelected = selectedCell.category === category && selectedCell.channel === channel;
                      const val = item ? item.coefficient : -1.5;
                      
                      // Highlight color intensity based on absolute elasticity value
                      const bgIntensity = Math.abs(val) > 2.0 
                        ? 'bg-red-950/30 text-red-400 border border-red-900/10 hover:bg-red-950/50' 
                        : Math.abs(val) > 1.3 
                        ? 'bg-amber-950/30 text-amber-400 border border-amber-900/10 hover:bg-amber-950/50' 
                        : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/10 hover:bg-emerald-950/50';

                      return (
                        <button
                          key={channel}
                          onClick={() => handleCellClick(category, channel)}
                          className={`mx-1 py-1.5 rounded-none text-center font-mono font-bold text-[10px] transition-all cursor-pointer ${
                            isSelected 
                              ? 'ring-1 ring-[#FFC20E] ring-offset-1 ring-offset-zinc-950 bg-zinc-900 text-[#FFC20E] scale-105 border-zinc-700 shadow-sm' 
                              : bgIntensity
                          }`}
                        >
                          {val.toFixed(1)}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Elasticity Context Detail */}
            <div className="bg-zinc-950/60 p-3 rounded-none border border-zinc-800/80 text-xs text-zinc-300">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold block mb-1">Context Spotlight</span>
              <p className="font-bold text-zinc-200 text-xs mb-1 uppercase tracking-tight">
                {selectedCell.category} • {selectedCell.channel}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[9px] text-zinc-400">
                <div>
                  <span className="uppercase text-[8px] text-zinc-500">Elasticity Coefficient:</span>
                  <p className="text-zinc-200 font-extrabold">{activeCoefficient}</p>
                </div>
                <div>
                  <span className="uppercase text-[8px] text-zinc-500">Monthly Baseline:</span>
                  <p className="text-zinc-200 font-extrabold">{activeBaseline.toLocaleString()} units</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 italic mt-2.5 font-sans leading-relaxed">
                {Math.abs(activeCoefficient) > 2.0 
                  ? 'Highly price-sensitive segment. Any price increases must be strictly offset by value bundling.'
                  : 'Inelastic behavior observed. Significant opportunities exist to capture margin with moderate pricing adjustments.'}
              </p>
            </div>
          </div>
        ) : (
          /* AI SIMULATION WORKFLOW - Embedded Copilot Terminal */
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {/* Input Slider for Tariff / Cost Shocks */}
            <div className="bg-zinc-950/40 p-2.5 rounded-none border border-zinc-800/80">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 uppercase font-bold tracking-wider">
                  <Sliders size={11} className="text-[#FFC20E]" />
                  Tariff & Cost Shock
                </span>
                <span className="text-[10px] font-mono font-black text-[#FFC20E]">+{tariffShock}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={tariffShock}
                onChange={(e) => setTariffShock(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[8px] text-zinc-500 font-mono mt-0.5 uppercase">
                <span>No Shock</span>
                <span>Moderate (+5%)</span>
                <span>Severe (+15%)</span>
              </div>
            </div>

            {/* Chat Box Visual Mockup */}
            <div className="flex-1 border border-zinc-800 rounded-none bg-zinc-950/60 flex flex-col text-white font-mono p-3 h-48 overflow-y-auto justify-between">
              <div>
                {/* User Prompt */}
                <div className="bg-zinc-900/80 border-l border-[#FFC20E] p-1.5 rounded-none text-[9px] mb-2.5">
                  <span className="text-[#FFC20E] font-bold uppercase text-[8px]">Prompt</span>
                  <p className="text-zinc-300 italic mt-0.5 leading-normal">
                    "Optimize gross margin for {selectedCell.category} at {selectedCell.channel} assuming a {tariffShock}% tariff hike."
                  </p>
                </div>

                {/* AI Response Stream */}
                <div className="space-y-1.5 text-[11px] relative">
                  {isTyping ? (
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] animate-pulse">
                      <Sparkles size={10} className="text-[#FFC20E] animate-spin" />
                      <span>Computing pricing elasticity curves...</span>
                    </div>
                  ) : (
                    <div className="space-y-2 text-zinc-300">
                      <div className="flex items-center gap-1">
                        <Sparkles size={10} className="text-[#FFC20E] fill-[#FFC20E]/10" />
                        <span className="font-extrabold text-[8px] text-[#FFC20E] uppercase tracking-widest">Pricing CoPilot Response:</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-2 rounded-none border border-zinc-900 text-[9px]">
                        <div>
                          <span className="text-zinc-500 uppercase text-[8px]">MSRP Shelf Price:</span>
                          <p className="text-white font-bold text-[10px] mt-0.5">${originalPrice} ➔ <span className="text-[#FFC20E]">${recommendedPrice}</span></p>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[8px]">Net Volume Impact:</span>
                          <p className="text-red-400 font-bold text-[10px] mt-0.5">{volumeChange}%</p>
                        </div>
                        <div className="col-span-2 border-t border-zinc-900 pt-1 mt-1 flex justify-between">
                          <span className="text-zinc-500 uppercase text-[8px]">Net Margin Saved:</span>
                          <span className={`font-black text-[10px] ${marginPreserved >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {marginPreserved >= 0 ? '+' : ''}{marginPreserved}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input Area Mock */}
              <div className="border-t border-zinc-900 pt-2 flex items-center gap-1 text-[9px]">
                <input
                  type="text"
                  placeholder="Ask Pricing CoPilot..."
                  disabled
                  className="flex-1 bg-transparent text-zinc-500 focus:outline-none"
                />
                <button className="text-[#FFC20E] opacity-50">
                  <Send size={10} />
                </button>
              </div>
            </div>

            {/* Custom Interactive Revenue Curve Apex */}
            <div className="bg-zinc-950/60 p-2.5 rounded-none border border-zinc-800">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1 font-bold uppercase tracking-wider">
                <span>Revenue Optimization Curve Apex</span>
                <span className="text-emerald-400 font-bold">Peak Yield Optimized</span>
              </div>
              <div className="relative h-12 flex items-end justify-center">
                {/* SVG Revenue Curve */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Revenue curve drawing */}
                  <path
                    d="M 10,40 Q 165,5 330,40"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="2"
                  />
                  {/* Highlight optimal dots */}
                  <circle cx="165" cy="8" r="4" fill="#FFC20E" className="animate-pulse" />
                  <circle cx="165" cy="8" r="2.5" fill="#FFC20E" />
                </svg>
                
                {/* Curve axis labels */}
                <div className="absolute left-2 bottom-1 text-[8px] font-mono text-zinc-500">
                  ${(originalPrice * 0.8).toFixed(1)}
                </div>
                <div className="absolute right-2 bottom-1 text-[8px] font-mono text-zinc-500">
                  ${(originalPrice * 1.3).toFixed(1)}
                </div>
                <div className="absolute text-[9px] font-mono font-extrabold text-zinc-100 bottom-6 transform translate-y-1 bg-zinc-900 border border-zinc-800 px-1 py-0.5">
                  MSRP: <span className="text-[#FFC20E]">${recommendedPrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
