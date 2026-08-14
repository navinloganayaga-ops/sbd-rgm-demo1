import React, { useState, useEffect } from 'react';
import { Megaphone, Play, Loader2, Sparkles, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { RETAILERS, PRODUCT_LINES, DIAGNOSTIC_METRICS } from '../data';

interface PromoOptimizerProps {
  onActivityLog: (message: string) => void;
}

export default function PromoOptimizer({ onActivityLog }: PromoOptimizerProps) {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'workflow'>('workflow');
  const [selectedRetailer, setSelectedRetailer] = useState('hd');
  const [selectedProduct, setSelectedProduct] = useState('dewalt_drill');
  const [discountDepth, setDiscountDepth] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [hasRun, setHasRun] = useState(true);

  // Simulation outputs
  const [liftVol, setLiftVol] = useState(6750);
  const [cannibalVol, setCannibalVol] = useState(1680);
  const [roi, setRoi] = useState(4.2);
  const [aiRec, setAiRec] = useState('');

  const currentProduct = PRODUCT_LINES.find(p => p.id === selectedProduct) || PRODUCT_LINES[0];
  const currentRetailer = RETAILERS.find(r => r.id === selectedRetailer) || RETAILERS[0];
  const diagnostics = DIAGNOSTIC_METRICS[selectedProduct as keyof typeof DIAGNOSTIC_METRICS] || DIAGNOSTIC_METRICS.dw_drill;

  // Run calculation simulation
  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    onActivityLog(`Initiated promotion simulation for ${currentProduct.name} at ${currentRetailer.name}.`);

    // Animate the pipeline steps
    const timer1 = setTimeout(() => setSimulationStep(2), 600);
    const timer2 = setTimeout(() => setSimulationStep(3), 1200);
    const timer3 = setTimeout(() => setSimulationStep(4), 1800);
    
    const timerFinished = setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
      setSimulationStep(0);

      // Perform dynamic calculations based on inputs
      const baseVol = currentProduct.id === 'dewalt_drill' ? 8000 : 25000;
      const el = Math.abs(currentProduct.elasticity);
      const factor = discountDepth / 100;
      
      // Lift formula with diminishing returns
      const calculatedLift = Math.round(baseVol * factor * el * (3.5 - factor * 2.5));
      
      // Cannibalization is higher with deeper discounts
      const calculatedCannibal = Math.round(calculatedLift * (0.15 + (discountDepth / 100) * 0.5));
      
      // Calculate a realistic ROI curve peaking around 15% - 20%
      let calculatedRoi = 1.2 + (discountDepth * 0.25) - (Math.pow(discountDepth - 18, 2) * 0.012);
      calculatedRoi = Math.max(0.4, Math.round(calculatedRoi * 10) / 10);

      setLiftVol(calculatedLift);
      setCannibalVol(calculatedCannibal);
      setRoi(calculatedRoi);

      // Generate context-aware AI recommendation
      let recommendation = '';
      if (discountDepth < 10) {
        recommendation = `Under-promoted: A ${discountDepth}% discount at ${currentRetailer.name} is insufficient to cross the consumer purchase threshold. AI suggests increasing discount to 15% to drive a healthy 3.2x ROI without triggering stockouts.`;
      } else if (discountDepth >= 10 && discountDepth <= 20) {
        recommendation = `Approved: A ${discountDepth}% discount depth at ${currentRetailer.name} yields an optimal ${calculatedRoi}x ROI. Cannibalization is safely capped at ${calculatedCannibal} units. Avoid moving deeper to conserve margin.`;
      } else if (discountDepth > 20 && discountDepth <= 35) {
        recommendation = `Sub-optimal: Discount of ${discountDepth}% stimulates high velocity, but cannibalizes cross-brand products like Craftsman by ${calculatedCannibal} units (+${Math.round(discountDepth * 1.5)}% vs baseline). Consider dialling back to 18%.`;
      } else {
        recommendation = `Warning: High Danger of margin erosion! At ${discountDepth}% off, competitor price-matching policies are triggered. Cannibalization sweeps ${calculatedCannibal} units. ROI plummets to ${calculatedRoi}x.`;
      }

      setAiRec(recommendation);
      onActivityLog(`Simulation completed. Lift Vol: +${calculatedLift} units, Cannibalization: ${calculatedCannibal} units, ROI: ${calculatedRoi}x.`);
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinished);
    };
  };

  // Re-run simulation when core values change slightly to keep UI updating
  useEffect(() => {
    if (hasRun && !isSimulating) {
      // Small instant re-evaluation to keep calculations in sync with sliders
      const baseVol = currentProduct.id === 'dewalt_drill' ? 8000 : 25000;
      const el = Math.abs(currentProduct.elasticity);
      const factor = discountDepth / 100;
      const calculatedLift = Math.round(baseVol * factor * el * (3.5 - factor * 2.5));
      const calculatedCannibal = Math.round(calculatedLift * (0.15 + (discountDepth / 100) * 0.5));
      let calculatedRoi = 1.2 + (discountDepth * 0.25) - (Math.pow(discountDepth - 18, 2) * 0.012);
      calculatedRoi = Math.max(0.4, Math.round(calculatedRoi * 10) / 10);

      setLiftVol(calculatedLift);
      setCannibalVol(calculatedCannibal);
      setRoi(calculatedRoi);

      let recommendation = '';
      if (discountDepth < 10) {
        recommendation = `Under-promoted: A ${discountDepth}% discount at ${currentRetailer.name} is insufficient to cross consumer thresholds. Suggest 15% for optimal results.`;
      } else if (discountDepth >= 10 && discountDepth <= 22) {
        recommendation = `Approved: A ${discountDepth}% discount depth at ${currentRetailer.name} yields an optimal ${calculatedRoi}x ROI. Cannibalization of baseline Craftsman inventory is capped at ${calculatedCannibal} units.`;
      } else if (discountDepth > 22 && discountDepth <= 35) {
        recommendation = `Sub-optimal: ${discountDepth}% discount drives volume but increases cannibalization on other SBD brands by ${calculatedCannibal} units. Pull back closer to 15%.`;
      } else {
        recommendation = `Warning: Excessive discount (${discountDepth}%) triggers deep margin erosion and brand friction. ROI collapses to ${calculatedRoi}x.`;
      }
      setAiRec(recommendation);
    }
  }, [discountDepth, selectedProduct, selectedRetailer]);

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 text-white rounded-none flex flex-col h-[580px] w-[380px] shrink-0 transition-all duration-300 hover:border-[#FFC20E]/40 hover:shadow-[0_0_20px_rgba(255,194,14,0.05)]">
      {/* Metallic-style Header */}
      <div className="bg-zinc-950 px-4 py-3.5 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Megaphone size={14} className="text-[#FFC20E]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-zinc-100">Trade Promo Engine v4.2</span>
        </div>
        <span className="bg-[#0f1b11] text-emerald-400 border border-emerald-500/10 text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
          OPTIMIZED
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

      {/* Main Tab Content Container */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col justify-between bg-zinc-900/40 text-zinc-100">
        {activeTab === 'diagnostics' ? (
          /* DATA DIAGNOSTICS VIEW */
          <div className="space-y-4 flex-1">
            <div className="bg-zinc-950/60 p-3 rounded-none border border-zinc-800/80">
              <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">Selected SKU History</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-mono">Historical YoY:</span>
                  <p className="font-bold text-emerald-400">{diagnostics.historicalYoY}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-mono">Promo Frequency:</span>
                  <p className="font-bold text-zinc-300">{diagnostics.promoFrequency}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-mono">Retailer Margin:</span>
                  <p className="font-bold text-zinc-300">{diagnostics.avgRetailerMargin}</p>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-mono">OOS Risk:</span>
                  <p className="mt-0.5">
                    <span className={`inline-block px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase tracking-wider ${
                      diagnostics.outOfStockRisk === 'High' ? 'bg-red-950/40 text-red-400 border border-red-800/20' :
                      diagnostics.outOfStockRisk === 'Medium' ? 'bg-amber-950/40 text-amber-400 border border-amber-800/20' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/20'
                    }`}>
                      {diagnostics.outOfStockRisk}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Elasticity Plot Chart Area */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Promo Elasticity Response</span>
                <span className="text-[9px] font-mono text-[#FFC20E] bg-zinc-950 px-1.5 py-0.5 border border-zinc-800">
                  Elasticity: {currentProduct.elasticity}
                </span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-none border border-zinc-800 h-32 flex flex-col justify-between text-zinc-300 font-mono">
                <div className="flex justify-between text-[9px] text-zinc-500 border-b border-zinc-850 pb-1 font-bold uppercase tracking-wider">
                  <span>Discount %</span>
                  <span>Predicted Lift Volume</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-[9px] text-zinc-400">10%:</span>
                    <div className="flex-1 bg-zinc-900 h-2 rounded-none overflow-hidden">
                      <div className="bg-[#FFC20E] h-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="w-10 text-right text-[10px] text-zinc-400">+35%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-[9px] text-zinc-400">20%:</span>
                    <div className="flex-1 bg-zinc-900 h-2 rounded-none overflow-hidden">
                      <div className="bg-[#FFC20E] h-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="w-10 text-right text-[10px] text-zinc-400">+75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-[9px] text-zinc-400">30%:</span>
                    <div className="flex-1 bg-zinc-900 h-2 rounded-none overflow-hidden">
                      <div className="bg-[#FFC20E] h-full opacity-50" style={{ width: '92%' }}></div>
                    </div>
                    <span className="w-10 text-right text-[10px] text-zinc-400">+92%</span>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-500 text-center italic border-t border-zinc-850 pt-1 font-sans">
                  Optimal Promos: {diagnostics.optimalPromoWindow}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed border-l border-[#FFC20E] pl-2.5 mt-2 font-sans">
              Historically, {currentProduct.name} displays heavy forward-buying behavior. Deep promotions above 25% shift volume forward rather than driving incremental organic category buyers.
            </div>
          </div>
        ) : (
          /* WORKFLOW TERMINAL VIEW */
          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Input Selection Block */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-zinc-500 font-mono text-[9px] uppercase tracking-wider mb-1 font-bold">Retailer</label>
                <select
                  value={selectedRetailer}
                  onChange={(e) => {
                    setSelectedRetailer(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-none p-1.5 font-sans focus:outline-none focus:border-[#FFC20E] text-zinc-200"
                >
                  {RETAILERS.map(r => (
                    <option key={r.id} value={r.id} className="bg-zinc-950 text-zinc-100">{r.logo} {r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-500 font-mono text-[9px] uppercase tracking-wider mb-1 font-bold">Product Line</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-none p-1.5 font-sans focus:outline-none focus:border-[#FFC20E] text-ellipsis text-zinc-200"
                >
                  {PRODUCT_LINES.map(p => (
                    <option key={p.id} value={p.id} className="bg-zinc-950 text-zinc-100">{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider Depth */}
            <div className="bg-zinc-950/40 p-3 rounded-none border border-zinc-800/80">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">Discount Depth</span>
                <span className="text-[10px] font-mono bg-zinc-900 text-[#FFC20E] border border-zinc-800 font-extrabold px-1.5 py-0.5 rounded-sm">
                  {discountDepth}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={discountDepth}
                onChange={(e) => setDiscountDepth(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-1 uppercase">
                <span>0%</span>
                <span>Optimal (15%)</span>
                <span>50%</span>
              </div>
            </div>

            {/* Multi-Stage Visual Pipeline */}
            <div className="bg-zinc-950 p-2 rounded-none border border-zinc-800/80 text-[9px] font-mono">
              <div className="flex items-center justify-between text-zinc-500 mb-1 font-bold uppercase tracking-wider">
                <span>Simulation Pipeline</span>
                {isSimulating && <span className="text-[#FFC20E] text-[8px] animate-pulse">Running Agent Models...</span>}
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className={`py-1 rounded-none border text-[8px] uppercase tracking-wider font-bold ${
                  simulationStep === 1 || isSimulating ? 'bg-[#FFC20E]/10 text-[#FFC20E] border-[#FFC20E]' :
                  hasRun && simulationStep === 0 ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-zinc-900 text-zinc-600 border-zinc-850'
                }`}>
                  Data Ingest
                </div>
                <div className={`py-1 rounded-none border text-[8px] uppercase tracking-wider font-bold ${
                  simulationStep === 2 ? 'bg-[#FFC20E]/10 text-[#FFC20E] border-[#FFC20E] animate-pulse' :
                  hasRun && simulationStep === 0 && !isSimulating ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-zinc-900 text-zinc-600 border-zinc-850'
                }`}>
                  AI Modeling
                </div>
                <div className={`py-1 rounded-none border text-[8px] uppercase tracking-wider font-bold ${
                  simulationStep === 3 ? 'bg-[#FFC20E]/10 text-[#FFC20E] border-[#FFC20E] animate-pulse' :
                  hasRun && simulationStep === 0 && !isSimulating ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-zinc-900 text-zinc-600 border-zinc-850'
                }`}>
                  Cannib. Check
                </div>
                <div className={`py-1 rounded-none border text-[8px] uppercase tracking-wider font-bold ${
                  simulationStep === 4 ? 'bg-[#FFC20E]/10 text-[#FFC20E] border-[#FFC20E] animate-pulse' :
                  hasRun && simulationStep === 0 && !isSimulating ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' : 'bg-zinc-900 text-zinc-600 border-zinc-850'
                }`}>
                  ROI Sign-off
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full bg-zinc-950 hover:bg-black text-white font-mono py-2.5 px-4 rounded-none flex items-center justify-center gap-2 border border-zinc-800 hover:border-[#FFC20E] transition-all active:scale-[0.98] disabled:opacity-50 text-xs tracking-wider uppercase font-extrabold cursor-pointer"
            >
              {isSimulating ? (
                <>
                  <Loader2 size={13} className="animate-spin text-[#FFC20E]" />
                  <span>Calculating Lift Matrix...</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-[#FFC20E] fill-[#FFC20E]" />
                  <span>Run Promo Simulation</span>
                </>
              )}
            </button>

            {/* Simulation Results Display */}
            {hasRun && !isSimulating && (
              <div className="space-y-2.5 animate-fadeIn flex-1 flex flex-col justify-between">
                {/* Visual Split Bar Graph */}
                <div className="bg-zinc-950/60 p-2.5 rounded-none border border-zinc-800">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider">Volume Dynamics (Units)</span>
                    <span className="text-[10px] bg-zinc-900 text-white border border-zinc-800 px-1.5 py-0.2 font-extrabold font-mono">
                      ROI: <span className="text-[#FFC20E]">{roi}x</span>
                    </span>
                  </div>
                  
                  {/* Lift vs Cannibal Bar */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-mono">
                        <span>Incremental Lift Volume</span>
                        <span className="font-bold text-emerald-400 font-mono">+{liftVol} u</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-none overflow-hidden mt-0.5 border border-zinc-800">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
                          style={{ width: `${Math.min(100, (liftVol / 30000) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-mono">
                        <span>Cross-Brand Cannibalization</span>
                        <span className="font-bold text-amber-500 font-mono">-{cannibalVol} u</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-none overflow-hidden mt-0.5 border border-zinc-800">
                        <div 
                          className="bg-amber-500 h-full transition-all duration-500 ease-out" 
                          style={{ width: `${Math.min(100, (cannibalVol / 12000) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                <div className="border border-[#FFC20E]/20 bg-[#FFC20E]/5 p-2.5 rounded-none text-xs text-zinc-300 relative overflow-hidden flex gap-2.5">
                  <div className="text-[#FFC20E] shrink-0 mt-0.5">
                    <Sparkles size={13} className="fill-[#FFC20E]/10" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase font-black tracking-wider text-[#FFC20E] block mb-0.5">
                      🤖 AI Agent Recommendation
                    </span>
                    <p className="leading-snug text-[10.5px] italic font-sans text-zinc-300">
                      {aiRec}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
