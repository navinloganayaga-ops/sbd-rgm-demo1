import React, { useState } from 'react';
import { Sliders, Sparkles, RefreshCw, Layers, Calendar, Tag, Target, Check } from 'lucide-react';
import { ScenarioLevers, PricingLevers, PromoLevers, AssortmentLevers, GoalSeekLevers } from './types';

interface LeverCardWidgetProps {
  initialLevers: ScenarioLevers;
  onRunSimulation: (updatedLevers: ScenarioLevers) => void;
  isSimulating?: boolean;
}

export default function LeverCardWidget({
  initialLevers,
  onRunSimulation,
  isSimulating = false,
}: LeverCardWidgetProps) {
  const [levers, setLevers] = useState<ScenarioLevers>(initialLevers);
  const domain = levers.domain;

  // Pricing Handlers
  const handlePricingChange = <K extends keyof PricingLevers>(key: K, value: PricingLevers[K]) => {
    setLevers((prev) => ({
      ...prev,
      pricing: {
        ...(prev.pricing as PricingLevers),
        [key]: value,
      },
    }));
  };

  // Promo Handlers
  const handlePromoChange = <K extends keyof PromoLevers>(key: K, value: PromoLevers[K]) => {
    setLevers((prev) => ({
      ...prev,
      promo: {
        ...(prev.promo as PromoLevers),
        [key]: value,
      },
    }));
  };

  // Assortment Handlers
  const handleAssortmentChange = <K extends keyof AssortmentLevers>(key: K, value: AssortmentLevers[K]) => {
    setLevers((prev) => ({
      ...prev,
      assortment: {
        ...(prev.assortment as AssortmentLevers),
        [key]: value,
      },
    }));
  };

  // Goal Seek Handlers
  const handleGoalSeekChange = <K extends keyof GoalSeekLevers>(key: K, value: GoalSeekLevers[K]) => {
    setLevers((prev) => ({
      ...prev,
      goalSeek: {
        ...(prev.goalSeek as GoalSeekLevers),
        [key]: value,
      },
    }));
  };

  const domainBadge = {
    pricing: { label: 'STRATEGIC PRICING LEVERS', icon: <Tag size={14} className="text-amber-600" /> },
    promo: { label: 'TRADE PROMOTION LEVERS', icon: <Calendar size={14} className="text-blue-600" /> },
    assortment: { label: 'ASSORTMENT & TRANSFERENCE LEVERS', icon: <Layers size={14} className="text-purple-600" /> },
    goal_seek: { label: 'GOAL SEEK SOLVER LEVERS', icon: <Target size={14} className="text-emerald-600" /> },
    descriptive: { label: 'PROMO AUDIT PARAMETERS', icon: <Sliders size={14} className="text-amber-600" /> },
  }[domain] || { label: 'SCENARIO LEVERS', icon: <Sliders size={14} className="text-slate-600" /> };

  return (
    <div className="my-3 bg-white border border-slate-200 rounded-md overflow-hidden text-slate-800 shadow-sm text-xs">
      {/* HEADER - LIGHT THEME */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {domainBadge.icon}
          <span className="font-bold text-[11px] tracking-wider uppercase text-slate-900">
            {domainBadge.label}
          </span>
          <span className="bg-slate-200/80 text-slate-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
            Interactive Widget
          </span>
        </div>
        <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Adjust inputs to re-solve
        </span>
      </div>

      {/* BODY - CONDITIONAL LEVERS PER DOMAIN */}
      <div className="p-4 space-y-4 bg-white">
        {/* DOMAIN 1: STRATEGIC PRICING */}
        {(domain === 'pricing' || domain === 'descriptive') && levers.pricing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Proposed Price Increase (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={levers.pricing.priceIncreasePct}
                  onChange={(e) => handlePricingChange('priceIncreasePct', parseFloat(e.target.value))}
                  className="w-full accent-[#FFC20E] cursor-pointer"
                />
                <span className="font-mono font-black text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 min-w-[52px] text-center shadow-xs">
                  +{levers.pricing.priceIncreasePct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                COGS Cost Inflation Offset (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={levers.pricing.cogsInflationPct}
                  onChange={(e) => handlePricingChange('cogsInflationPct', parseFloat(e.target.value) || 0)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs w-24 focus:outline-none focus:border-slate-500 font-bold"
                />
                <span className="text-slate-500 text-[11px]">Pass-through rate: {levers.pricing.shelfPassThroughPct}%</span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Assumed Price Elasticity
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="-2.5"
                  max="-0.2"
                  value={levers.pricing.elasticityIndex}
                  onChange={(e) => handlePricingChange('elasticityIndex', parseFloat(e.target.value) || -1.15)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs w-24 focus:outline-none focus:border-slate-500 font-bold"
                />
                <span className="text-slate-500 text-[10px] font-medium">(Snowflake econometric regression)</span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target Retailer Channel
              </label>
              <select
                value={levers.pricing.retailer}
                onChange={(e) => handlePricingChange('retailer', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-500"
              >
                <option value="Home Depot">The Home Depot (Pro / DIY)</option>
                <option value="Lowe's">Lowe's Home Improvement</option>
                <option value="Amazon">Amazon Industrial</option>
              </select>
            </div>
          </div>
        )}

        {/* DOMAIN 2: TRADE PROMOTIONS */}
        {domain === 'promo' && levers.promo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Promotional Tactic
              </label>
              <select
                value={levers.promo.promoTactic}
                onChange={(e) => handlePromoChange('promoTactic', e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-500"
              >
                <option value="Feature & Display">Feature & Display (Holiday Endcap)</option>
                <option value="TPR">Temporary Price Reduction (TPR)</option>
                <option value="Circular Ad Banner">Circular Ad Banner Front Page</option>
                <option value="Endcap Power-Wing">Endcap Power-Wing Battery Bundle</option>
              </select>
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Discount Depth (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={levers.promo.discountDepthPct}
                  onChange={(e) => handlePromoChange('discountDepthPct', parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <span className="font-mono font-black text-sm text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 min-w-[48px] text-center">
                  -{levers.promo.discountDepthPct}%
                </span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Co-Op Trade Budget ($M)
              </label>
              <input
                type="number"
                step="0.2"
                min="0.5"
                max="15"
                value={levers.promo.coOpBudgetM}
                onChange={(e) => handlePromoChange('coOpBudgetM', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Competitor Defense Shield
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={levers.promo.defensiveShieldActive}
                  onChange={(e) => handlePromoChange('defensiveShieldActive', e.target.checked)}
                  className="accent-slate-900 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-800 text-xs font-medium">
                  Counter-Strike vs <strong className="text-rose-700">Milwaukee M18</strong> in Week 45
                </span>
              </label>
            </div>
          </div>
        )}

        {/* DOMAIN 3: ASSORTMENT PLANNING */}
        {domain === 'assortment' && levers.assortment && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Min GSV Hurdle Threshold ($M)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                value={levers.assortment.gsvHurdleM}
                onChange={(e) => handleAssortmentChange('gsvHurdleM', parseFloat(e.target.value) || 2.0)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Min MAC Margin Hurdle (%)
              </label>
              <input
                type="number"
                step="1"
                min="20"
                max="60"
                value={levers.assortment.macHurdlePct}
                onChange={(e) => handleAssortmentChange('macHurdlePct', parseFloat(e.target.value) || 35)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Tail SKUs Delist Target (Count)
              </label>
              <input
                type="number"
                step="1"
                min="5"
                max="80"
                value={levers.assortment.delistTargetCount}
                onChange={(e) => handleAssortmentChange('delistTargetCount', parseInt(e.target.value) || 37)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Assumed Shelf Transference Rate
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={levers.assortment.transferenceFactorPct}
                  onChange={(e) => handleAssortmentChange('transferenceFactorPct', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 min-w-[48px] text-center">
                  {levers.assortment.transferenceFactorPct}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 4: GOAL SEEK */}
        {domain === 'goal_seek' && levers.goalSeek && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target GSV Goal ($M)
              </label>
              <input
                type="number"
                step="50"
                min="1200"
                max="2000"
                value={levers.goalSeek.targetGsvM}
                onChange={(e) => handleGoalSeekChange('targetGsvM', parseFloat(e.target.value) || 1500)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Minimum MAC Margin Floor (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="35"
                max="50"
                value={levers.goalSeek.minMacPct}
                onChange={(e) => handleGoalSeekChange('minMacPct', parseFloat(e.target.value) || 41.5)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Maximum Allowable Price Hike (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="10"
                value={levers.goalSeek.maxPriceIncreasePct}
                onChange={(e) => handleGoalSeekChange('maxPriceIncreasePct', parseFloat(e.target.value) || 4.5)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-100">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Trade Spend Budget Cap ($M)
              </label>
              <input
                type="number"
                step="2"
                min="10"
                max="50"
                value={levers.goalSeek.tradeSpendCapM}
                onChange={(e) => handleGoalSeekChange('tradeSpendCapM', parseFloat(e.target.value) || 22)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS - LIGHT THEME */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Parameters bound to SBD Econometric Models
        </span>
        <button
          onClick={() => onRunSimulation(levers)}
          disabled={isSimulating}
          className="bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-60 text-slate-900 font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 text-xs"
        >
          <Sparkles size={13} className={isSimulating ? 'animate-spin' : ''} />
          <span>{isSimulating ? 'Solving Econometric Engine...' : 'Run Simulation'}</span>
        </button>
      </div>
    </div>
  );
}
