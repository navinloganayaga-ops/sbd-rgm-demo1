import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Save, 
  Download, 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Calendar,
  Layers,
  Tag,
  Target,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Legend
} from 'recharts';
import { 
  ScenarioImpactMetrics, 
  ScenarioDomain, 
  PromoEventItem, 
  SkuPriceImpactItem, 
  CalendarWeekItem, 
  DelistedSkuItem, 
  GoalPillarItem 
} from './types';

interface ScenarioOutputWidgetProps {
  metrics: ScenarioImpactMetrics;
  scenarioTitle: string;
  domain: ScenarioDomain;
  targetTab: 'strategic_pricing' | 'trade_promotions' | 'assortment_planner';
  chartType?: 'event_roi' | 'waterfall' | 'calendar_curve' | 'assortment_matrix' | 'goal_seek_bridge';
  promoEvents?: PromoEventItem[];
  skuPriceImpacts?: SkuPriceImpactItem[];
  calendarWeeks?: CalendarWeekItem[];
  delistedSkus?: DelistedSkuItem[];
  goalPillars?: GoalPillarItem[];
  onSaveToTab: (targetTab: string, title: string) => void;
  onExportSummary: () => void;
  onViewInDrawer: () => void;
}

export default function ScenarioOutputWidget({
  metrics,
  scenarioTitle,
  domain,
  targetTab,
  chartType = 'waterfall',
  promoEvents,
  skuPriceImpacts,
  calendarWeeks,
  delistedSkus,
  goalPillars,
  onSaveToTab,
  onExportSummary,
  onViewInDrawer,
}: ScenarioOutputWidgetProps) {
  const tabLabel = {
    strategic_pricing: 'Strategic Pricing',
    trade_promotions: 'Trade Promotions',
    assortment_planner: 'Assortment Planner',
  }[targetTab];

  // Specific Event Chart Data for Promo ROI
  const eventChartData = promoEvents?.map(e => ({
    name: e.eventName.replace('Special', '').replace('Blowout', '').trim(),
    'Baseline Units': e.baseUnitsK,
    'Lift Units': e.liftUnitsK,
    'Incremental GSV': Number((e.gsvLiftK / 1000).toFixed(1)),
    'ROI': e.roi
  })) || [
    { name: 'Mid-Summer W30', 'Baseline Units': 85, 'Lift Units': 18, 'Incremental GSV': 2.8, ROI: 5.96 },
    { name: 'Labor Day W34', 'Baseline Units': 98, 'Lift Units': 44, 'Incremental GSV': 7.4, ROI: 4.50 },
    { name: 'Fall Pro Days W38', 'Baseline Units': 92, 'Lift Units': 36, 'Incremental GSV': 5.9, ROI: 3.54 },
  ];

  // Specific Calendar Trend Curve for Promo Calendar
  const calendarCurveData = [
    { week: 'W40', Base: 95, Promo: 95, MilwaukeeRisk: 0 },
    { week: 'W41', Base: 98, Promo: 98, MilwaukeeRisk: 0 },
    { week: 'W42', Base: 96, Promo: 96, MilwaukeeRisk: 0 },
    { week: 'W43', Base: 100, Promo: 142, MilwaukeeRisk: 0 }, // Tooltober
    { week: 'W44', Base: 102, Promo: 104, MilwaukeeRisk: 0 },
    { week: 'W45', Base: 105, Promo: 138, MilwaukeeRisk: 14.5 }, // Defended strike
    { week: 'W46', Base: 108, Promo: 110, MilwaukeeRisk: 0 },
    { week: 'W47', Base: 115, Promo: 215, MilwaukeeRisk: 0 }, // Black Friday
    { week: 'W48', Base: 112, Promo: 185, MilwaukeeRisk: 0 }, // Cyber Week
    { week: 'W49', Base: 106, Promo: 118, MilwaukeeRisk: 0 },
    { week: 'W50', Base: 104, Promo: 112, MilwaukeeRisk: 0 },
    { week: 'W51', Base: 100, Promo: 100, MilwaukeeRisk: 0 },
  ];

  return (
    <div className="my-3.5 bg-white border border-slate-200 rounded-md overflow-hidden text-slate-800 shadow-sm text-xs font-sans">
      {/* HEADER - LIGHT THEME */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            {domain === 'descriptive' ? 'Historical Promotional Effectiveness Audit' : 'Scenario Financial Impact Model'}
          </span>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            {scenarioTitle}
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-600" />
            Model Verified
          </span>
        </div>
      </div>

      {/* KPI SCORECARD TILES - LIGHT THEME */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* GSV */}
        <div className="bg-white border border-slate-200 p-3 rounded shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
            {domain === 'descriptive' ? 'Audited Total GSV' : 'Simulated GSV'}
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-black text-slate-900 font-mono">
              ${metrics.simulatedGsvM.toFixed(1)}M
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-700 font-semibold font-mono">
            <TrendingUp size={11} className="text-emerald-600" />
            <span>+${metrics.gsvDeltaM.toFixed(1)}M ({metrics.gsvDeltaPct > 0 ? `+${metrics.gsvDeltaPct.toFixed(1)}%` : `${metrics.gsvDeltaPct.toFixed(1)}%`})</span>
          </div>
        </div>

        {/* MAC % */}
        <div className="bg-white border border-slate-200 p-3 rounded shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Trade Margin (MAC)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-black text-slate-900 font-mono">
              {metrics.simulatedMacPct.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-700 font-semibold font-mono">
            <TrendingUp size={11} className="text-emerald-600" />
            <span>+{metrics.macBpsDelta} bps Expansion</span>
          </div>
        </div>

        {/* VOLUME UNITS */}
        <div className="bg-white border border-slate-200 p-3 rounded shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sales Volume (Units)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-black text-slate-900 font-mono">
              {metrics.simulatedVolumeUnitsM.toFixed(2)}M
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold font-mono">
            {metrics.volumeUnitsDeltaPct >= 0 ? (
              <span className="text-emerald-700 flex items-center gap-0.5">
                <TrendingUp size={11} className="text-emerald-600" /> +{metrics.volumeUnitsDeltaPct.toFixed(1)}% Lift
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-0.5">
                <TrendingDown size={11} className="text-rose-600" /> {metrics.volumeUnitsDeltaPct.toFixed(1)}% Drag
              </span>
            )}
          </div>
        </div>

        {/* ROI / TRADE SPEND */}
        <div className="bg-white border border-slate-200 p-3 rounded shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Blended ROI Ratio</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-black text-slate-900 font-mono">
              {metrics.roiRatio.toFixed(2)}x
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-medium block mt-0.5 truncate">
            Trade Spend: ${metrics.tradeSpendM.toFixed(1)}M
          </span>
        </div>
      </div>

      {/* CONTEXTUAL GRAPH SECTION */}
      <div className="p-4 bg-white border-b border-slate-200">
        
        {/* GRAPH 1: FOR DESCRIPTIVE PROMO ROI */}
        {chartType === 'event_roi' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Q3 Promotional Event Incremental Lift & ROI SBD Audit
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Units in Thousands (K)</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={eventChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#b45309' }} tickFormatter={(v) => `${v}x`} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 4, fontSize: 11, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  <Bar yAxisId="left" dataKey="Baseline Units" fill="#94a3b8" radius={[2, 2, 0, 0]} maxBarSize={32} />
                  <Bar yAxisId="left" dataKey="Lift Units" fill="#FFC20E" radius={[2, 2, 0, 0]} maxBarSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="ROI" stroke="#b45309" strokeWidth={2} dot={{ r: 4, fill: '#b45309' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* GRAPH 2: FOR PROMO CALENDAR */}
        {chartType === 'calendar_curve' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Q4 12-Week Weekly Demand Trajectory (Unpromoted vs Optimized TPO)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Weekly Units (K)</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calendarCurveData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 4, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  <Line type="monotone" dataKey="Base" name="Unpromoted Baseline" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Promo" name="Optimized Promo Schedule" stroke="#FFC20E" strokeWidth={2.5} dot={{ r: 3, fill: '#0f172a' }} />
                  <Line type="monotone" dataKey="MilwaukeeRisk" name="Mitigated Bleed (W45)" stroke="#e11d48" strokeWidth={2} dot={{ r: 4, fill: '#e11d48' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* GRAPH 3: FOR WATERFALL (PRICING, ASSORTMENT, GOAL SEEK) */}
        {(chartType === 'waterfall' || chartType === 'assortment_matrix' || chartType === 'goal_seek_bridge') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                P&L Gross Sales Value Bridge ($ Millions USD)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Values in $M</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.waterfallBridge} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={(v) => `$${v}M`} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 4, fontSize: 11, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                    formatter={(val: any) => [`$${val}M`, 'Value']}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={48}>
                    {metrics.waterfallBridge.map((entry, idx) => (
                      <Cell
                        key={`bar-${idx}`}
                        fill={entry.fill || (entry.value < 0 ? '#ef4444' : entry.name.includes('Simulated') || entry.name.includes('Delivered') || entry.name.includes('Realized') ? '#0f172a' : '#10b981')}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* CONTEXTUAL STRUCTURED TABLE SECTION */}
      <div className="p-4 bg-slate-50/40 border-b border-slate-200">
        
        {/* TABLE 1: PROMO EVENTS TABLE */}
        {promoEvents && promoEvents.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/70 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Q3 Event Performance Breakdown
              </span>
              <span className="text-[10px] text-slate-500">Circana Home Depot Scanner Actuals</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2">Week</th>
                  <th className="p-2">Event Name</th>
                  <th className="p-2">Tactic</th>
                  <th className="p-2 text-right">Spend</th>
                  <th className="p-2 text-right">Lift Units</th>
                  <th className="p-2 text-right">Inc. GSV</th>
                  <th className="p-2 text-right font-black text-slate-900">ROI Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {promoEvents.map((evt) => (
                  <tr key={evt.week} className="hover:bg-slate-50/80">
                    <td className="p-2 font-bold text-slate-700">{evt.week}</td>
                    <td className="p-2 font-sans font-semibold text-slate-900">{evt.eventName}</td>
                    <td className="p-2 font-sans text-slate-600">{evt.tactic}</td>
                    <td className="p-2 text-right text-slate-600">${evt.spendK}K</td>
                    <td className="p-2 text-right text-emerald-700 font-bold">+{evt.liftUnitsK}K</td>
                    <td className="p-2 text-right text-slate-900 font-bold">+${(evt.gsvLiftK / 1000).toFixed(2)}M</td>
                    <td className="p-2 text-right font-bold text-amber-700 bg-amber-50/50">{evt.roi.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLE 2: SKU PRICE IMPACT TABLE */}
        {skuPriceImpacts && skuPriceImpacts.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/70 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Participating SKU Price Realization Architecture
              </span>
              <span className="text-[10px] text-slate-500">+5.0% Base Realization</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Product Description</th>
                  <th className="p-2 text-right">Current MSRP</th>
                  <th className="p-2 text-right">New MSRP</th>
                  <th className="p-2 text-right">Elasticity Drag</th>
                  <th className="p-2 text-right font-black text-slate-900">GSV Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {skuPriceImpacts.map((sku) => (
                  <tr key={sku.sku} className="hover:bg-slate-50/80">
                    <td className="p-2 font-bold text-slate-700">{sku.sku}</td>
                    <td className="p-2 font-sans font-semibold text-slate-900">{sku.name}</td>
                    <td className="p-2 text-right text-slate-500">${sku.currentPrice.toFixed(2)}</td>
                    <td className="p-2 text-right font-bold text-slate-900">${sku.proposedPrice.toFixed(2)}</td>
                    <td className="p-2 text-right text-slate-500">{sku.volumeDeltaPct}%</td>
                    <td className="p-2 text-right font-bold text-emerald-700">+${(sku.gsvImpactK / 1000).toFixed(1)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLE 3: CALENDAR WEEKS TABLE */}
        {calendarWeeks && calendarWeeks.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/70 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Q4 Optimized Promotional Schedule
              </span>
              <span className="text-[10px] text-slate-500">Key Spikes & Defensive Strike</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2">Week</th>
                  <th className="p-2">Event Label</th>
                  <th className="p-2">Promotional Tactic</th>
                  <th className="p-2 text-right">Depth</th>
                  <th className="p-2">Competitor Threat</th>
                  <th className="p-2 text-right font-black text-slate-900">Expected Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {calendarWeeks.map((w) => (
                  <tr key={w.week} className="hover:bg-slate-50/80">
                    <td className="p-2 font-bold text-slate-700">{w.week}</td>
                    <td className="p-2 font-sans font-semibold text-slate-900">{w.label}</td>
                    <td className="p-2 font-sans text-slate-600">{w.tactic}</td>
                    <td className="p-2 text-right font-bold text-rose-700">-{w.discountPct}%</td>
                    <td className="p-2 font-sans text-xs">
                      {w.competitorAction !== 'No Promo' ? (
                        <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {w.competitorAction}
                        </span>
                      ) : (
                        <span className="text-slate-400">Clear</span>
                      )}
                    </td>
                    <td className="p-2 text-right font-bold text-emerald-700">{w.expectedUnitsK}K Units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLE 4: DELISTED SKUS TABLE */}
        {delistedSkus && delistedSkus.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/70 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Delisted Tail SKUs & Demand Transference Destinations
              </span>
              <span className="text-[10px] text-slate-500">65% Demand Captured</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Description</th>
                  <th className="p-2 text-right">Prior GSV</th>
                  <th className="p-2 text-right">Prior MAC</th>
                  <th className="p-2">Transference Destination SKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {delistedSkus.map((d) => (
                  <tr key={d.sku} className="hover:bg-slate-50/80">
                    <td className="p-2 font-bold text-rose-700">{d.sku}</td>
                    <td className="p-2 font-sans font-semibold text-slate-900">{d.name}</td>
                    <td className="p-2 text-right text-slate-500">${d.gsvK}K</td>
                    <td className="p-2 text-right text-rose-600 font-bold">{d.macPct}%</td>
                    <td className="p-2 font-sans font-semibold text-emerald-700 flex items-center gap-1">
                      <ArrowRight size={11} className="text-emerald-500" />
                      {d.transferDestination}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLE 5: GOAL SEEK PILLARS TABLE */}
        {goalPillars && goalPillars.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden bg-white shadow-2xs">
            <div className="bg-slate-100/70 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                Cross-Pillar Commercial Allocation Blueprint
              </span>
              <span className="text-[10px] text-slate-500">$1.504B GSV Target Solved</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2">RGM Pillar</th>
                  <th className="p-2">Recommended Lever Action</th>
                  <th className="p-2 text-right font-black text-slate-900">GSV Contribution</th>
                  <th className="p-2 text-right">MAC Impact</th>
                  <th className="p-2 text-center">Feasibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {goalPillars.map((p) => (
                  <tr key={p.pillar} className="hover:bg-slate-50/80">
                    <td className="p-2 font-sans font-bold text-slate-900">{p.pillar}</td>
                    <td className="p-2 font-sans text-slate-600">{p.action}</td>
                    <td className="p-2 text-right font-bold text-emerald-700">+${p.gsvDeltaM.toFixed(1)}M</td>
                    <td className="p-2 text-right font-bold text-slate-700">+{p.macDeltaBps} bps</td>
                    <td className="p-2 text-center font-sans">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {p.feasibility}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACTION BUTTON GROUP - LIGHT THEME */}
      <div className="bg-slate-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSaveToTab(targetTab, scenarioTitle)}
            className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 text-xs transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <Save size={13} />
            <span>Save to {tabLabel}</span>
          </button>

          <button
            onClick={onExportSummary}
            className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs border border-slate-300 transition-colors cursor-pointer shadow-2xs"
          >
            <Download size={13} />
            <span>Export PDF/PPT Summary</span>
          </button>
        </div>

        <button
          onClick={onViewInDrawer}
          className="text-slate-800 hover:text-black font-bold flex items-center gap-1 text-xs cursor-pointer ml-auto hover:underline"
        >
          <span>View Details in Right Workspace</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
