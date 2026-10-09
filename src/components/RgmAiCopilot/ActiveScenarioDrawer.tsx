import React from 'react';
import { 
  Sliders, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Share2, 
  ChevronRight, 
  PanelRightClose, 
  PanelRightOpen, 
  Layers, 
  FileSpreadsheet, 
  Sparkles, 
  Tag, 
  Calendar,
  Target,
  BarChart3,
  TrendingUp,
  Award
} from 'lucide-react';
import { ActiveScenario } from './types';

interface ActiveScenarioDrawerProps {
  scenario: ActiveScenario;
  isOpen: boolean;
  onToggle: () => void;
  onPushToTab: (targetTab: string) => void;
  onSyncAllModules: () => void;
  onExportExecutiveDeck: () => void;
}

export default function ActiveScenarioDrawer({
  scenario,
  isOpen,
  onToggle,
  onPushToTab,
  onSyncAllModules,
  onExportExecutiveDeck,
}: ActiveScenarioDrawerProps) {
  const m = scenario.metrics;
  const l = scenario.levers;
  const details = scenario.drawerDetails;

  const targetTabLabel = {
    strategic_pricing: 'Strategic Pricing',
    trade_promotions: 'Trade Promotions',
    assortment_planner: 'Assortment Planner',
  }[scenario.targetTab];

  const domainIcon = {
    pricing: <Tag size={14} className="text-amber-600" />,
    promo: <Calendar size={14} className="text-blue-600" />,
    assortment: <Layers size={14} className="text-purple-600" />,
    goal_seek: <Target size={14} className="text-emerald-600" />,
    descriptive: <BarChart3 size={14} className="text-amber-600" />,
  }[scenario.domain] || <Sliders size={14} className="text-slate-600" />;

  return (
    <div
      className={`border-l border-slate-200 bg-white text-slate-800 flex flex-col shrink-0 transition-all duration-300 font-sans shadow-sm ${
        isOpen ? 'w-full lg:w-[35%] xl:w-[35%]' : 'w-12'
      }`}
    >
      {/* DRAWER COLLAPSED SLIVER */}
      {!isOpen ? (
        <div className="h-full flex flex-col items-center py-4 bg-slate-50 text-slate-500">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-200 text-slate-700 rounded cursor-pointer transition-colors"
            title="Expand Active Scenario Workspace"
          >
            <PanelRightOpen size={18} />
          </button>
          <div className="mt-8 [writing-mode:vertical-rl] rotate-180 font-bold uppercase tracking-widest text-[10px] text-slate-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC20E] inline-block" />
            <span>Active Scenario Workspace</span>
          </div>
        </div>
      ) : (
        /* DRAWER FULL EXPANDED VIEW - LIGHT THEME */
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
          {/* HEADER */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Active Scenario Workspace
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5" title={scenario.title}>
                {scenario.title}
              </h3>
            </div>
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
              title="Collapse Drawer"
            >
              <PanelRightClose size={17} />
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* SCENARIO META BANNER */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Module</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  {domainIcon}
                  {targetTabLabel}
                </span>
              </div>
              <button
                onClick={() => onPushToTab(scenario.targetTab)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>Jump to Tab</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* CONTEXTUAL PRIMARY KPIS FOR THIS PROMPT */}
            {details && details.primaryKpis && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Key Scenario Metrics
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {details.primaryKpis.map((kpi, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                        {kpi.label}
                      </span>
                      <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                        {kpi.value}
                      </div>
                      <span className={`text-[10px] font-semibold block mt-0.5 ${kpi.isGood ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {kpi.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REAL-TIME COMPARISON TABLE */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Baseline vs Scenario Model
                </span>
                <span className="text-[10px] text-emerald-700 font-bold font-mono">Live Delta</span>
              </div>
              <div className="border border-slate-200 rounded overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="py-2 px-2.5">Metric</th>
                      <th className="py-2 px-2 text-right">Base</th>
                      <th className="py-2 px-2 text-right">Simulated</th>
                      <th className="py-2 px-2.5 text-right font-black text-slate-900">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-sans font-medium text-slate-700">GSV ($M)</td>
                      <td className="py-2 px-2 text-right text-slate-500">${m.baselineGsvM.toFixed(1)}</td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">${m.simulatedGsvM.toFixed(1)}</td>
                      <td className="py-2 px-2.5 text-right font-bold text-emerald-700">
                        +${m.gsvDeltaM.toFixed(1)}M
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-sans font-medium text-slate-700">MAC (%)</td>
                      <td className="py-2 px-2 text-right text-slate-500">{m.baselineMacPct.toFixed(1)}%</td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">{m.simulatedMacPct.toFixed(1)}%</td>
                      <td className="py-2 px-2.5 text-right font-bold text-emerald-700">
                        +{m.macBpsDelta} bps
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-sans font-medium text-slate-700">Units (M)</td>
                      <td className="py-2 px-2 text-right text-slate-500">{m.baselineVolumeUnitsM.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">{m.simulatedVolumeUnitsM.toFixed(2)}</td>
                      <td className={`py-2 px-2.5 text-right font-bold ${m.volumeUnitsDeltaPct >= 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {m.volumeUnitsDeltaPct >= 0 ? `+${m.volumeUnitsDeltaPct.toFixed(1)}%` : `${m.volumeUnitsDeltaPct.toFixed(1)}%`}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-sans font-medium text-slate-700">Trade Spend</td>
                      <td className="py-2 px-2 text-right text-slate-500">$12.0M</td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">${m.tradeSpendM.toFixed(1)}M</td>
                      <td className="py-2 px-2.5 text-right font-bold text-amber-700">
                        {m.roiRatio.toFixed(1)}x ROI
                      </td>
                    </tr>
                    {m.categoryShare && (
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-sans font-medium text-slate-700">Category Share</td>
                        <td className="py-2 px-2 text-right text-slate-500">42.4%</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-900">{m.categoryShare.sbdPct.toFixed(1)}%</td>
                        <td className="py-2 px-2.5 text-right font-bold text-emerald-700">
                          +{m.categoryShare.deltaBps} bps
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CONTEXTUAL AUDIT SUBSECTION (TAILORED PER PROMPT) */}
            {details && details.subSectionItems && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  {details.subSectionTitle}
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
                  {details.subSectionItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">{item.label}:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{item.value}</span>
                        {item.badge && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUMMARY HIGHLIGHTS */}
            {scenario.summaryHighlights && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Executive Decision Takeaways
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 bg-amber-50/40 border border-amber-200/60 p-3 rounded">
                  {scenario.summaryHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ONE-CLICK ACTION TRIGGERS */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Module Push & Synchronization
              </span>

              <button
                onClick={() => onPushToTab(scenario.targetTab)}
                className="w-full bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold py-2.5 px-3 rounded flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer shadow-sm active:scale-98"
              >
                <Sparkles size={14} />
                <span>Sync & Open in {targetTabLabel}</span>
              </button>

              <button
                onClick={onSyncAllModules}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold py-2 px-3 rounded flex items-center justify-center gap-2 text-xs border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              >
                <RefreshCw size={13} className="text-slate-600" />
                <span>Sync Parameters Across All 3 Modules</span>
              </button>

              <button
                onClick={onExportExecutiveDeck}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded flex items-center justify-center gap-2 text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet size={13} className="text-slate-600" />
                <span>Export SBD Executive Deck (PPTX)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
