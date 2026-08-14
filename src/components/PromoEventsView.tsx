import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  TrendingDown, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Tag,
  Calendar,
  X
} from 'lucide-react';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';

interface PromoEventsViewProps {
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  onFilterApply: () => void;
}

interface EventRow {
  pcrNumber: string;
  title: string;
  bu: string;
  brand: string;
  customer: string;
  timing: string;
  units: string;
  retailSales: string;
  tradeSpend: string;
  nsv: string;
  status: 'Completed' | 'In Review' | 'Draft';
  sgmMargin: string;
}

export default function PromoEventsView({ filterState, onFilterChange, onFilterApply }: PromoEventsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);

  const sampleEvents: EventRow[] = [
    { pcrNumber: 'PCR-2026-0812', title: 'Q1 DeWalt 20V Drill Blitz', bu: 'Power Tools Group', brand: 'DeWalt', customer: 'Home Depot', timing: 'Q1 2026', units: '124.5K', retailSales: '$18.2M', tradeSpend: '$3.1M', nsv: '$11.8M', status: 'Completed', sgmMargin: '+28.4%' },
    { pcrNumber: 'PCR-2026-0815', title: 'Stanley FatMax Tape 2-Pk Promo', bu: 'Hand Tools & Accessories', brand: 'Stanley', customer: 'Lowe\'s', timing: 'Q1 2026', units: '85.2K', retailSales: '$6.4M', tradeSpend: '$980K', nsv: '$4.2M', status: 'Completed', sgmMargin: '+31.2%' },
    { pcrNumber: 'PCR-2026-0819', title: 'Craftsman Mechanics Set Spring Deal', bu: 'Hand Tools & Accessories', brand: 'Craftsman', customer: 'Amazon', timing: 'Q1 2026', units: '42.0K', retailSales: '$8.5M', tradeSpend: '$1.4M', nsv: '$5.6M', status: 'Completed', sgmMargin: '+25.1%' },
    { pcrNumber: 'PCR-2026-0824', title: 'DeWalt ToughSystem Storage Promo', bu: 'Storage & Workspace', brand: 'DeWalt', customer: 'Home Depot', timing: 'Q1 2026', units: '38.8K', retailSales: '$7.1M', tradeSpend: '$1.2M', nsv: '$4.9M', status: 'Completed', sgmMargin: '+29.0%' },
    { pcrNumber: 'PCR-2026-0830', title: 'Irwin Vise-Grip Hardware Month', bu: 'Hand Tools & Accessories', brand: 'Irwin', customer: 'Ace Hardware', timing: 'Q1 2026', units: '21.5K', retailSales: '$2.1M', tradeSpend: '$320K', nsv: '$1.4M', status: 'Completed', sgmMargin: '+32.8%' },
    { pcrNumber: 'PCR-2026-0835', title: 'DeWalt Miter Saw & Stand Combo', bu: 'Power Tools Group', brand: 'DeWalt', customer: 'Lowe\'s', timing: 'Q1 2026', units: '18.5K', retailSales: '$2.5M', tradeSpend: '$800K', nsv: '$1.8M', status: 'Completed', sgmMargin: '+22.4%' }
  ];

  const filteredEvents = sampleEvents.filter(ev => 
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.pcrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 font-sans">
      
      {/* BREADCRUMB & HEADER */}
      <div>
        <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
          Channel Owner Home
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Promo Events
          </h1>
          <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-slate-300">
            ✂ IN DESIGN
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
          Plan vs Execution vs Actuals across PTG + HTAS. Each row is one PCR; click into any event for SKU-level execution detail.
        </p>
      </div>

      {/* COMPLETED TAB BADGE */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-sm border border-slate-200 shadow-sm">
        <div className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-sm text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-slate-700" />
          <span>Completed 12</span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Closed promos — grouped by quarter for retrospective review.
        </span>
      </div>

      {/* GLOBAL FILTER BAR */}
      <GlobalFilterBar 
        filters={filterState} 
        onFilterChange={onFilterChange} 
        onApply={onFilterApply} 
      />

      {/* SEARCH BAR */}
      <div className="relative bg-white border border-slate-200 rounded-sm shadow-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search PCR number, title or BU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-20 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-[10px] text-slate-400">
          {filteredEvents.length}/35
        </span>
      </div>

      {/* FINAL RESULTS SCORECARD HEADER & KPI GRID (MATCHING ATTACHED SCREENSHOT EXACTLY) */}
      <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-5 shadow-sm">
        
        {/* SUMMARY HEADER BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black uppercase text-slate-900 tracking-wide">FINAL RESULTS</span>
            <span className="text-xs text-slate-500 font-medium">12 closed events</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {/* Missed plan pill */}
            <div className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
              <TrendingDown size={14} className="text-rose-600" />
              <span>Missed plan · -27.9% vs plan NSV</span>
            </div>

            {/* Expanded margin pill */}
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Expanded margin · +367 bps SGM vs plan</span>
            </div>
          </div>
        </div>

        {/* 3-COLUMN KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
          
          {/* COLUMN 1: DEMAND & TOPLINE */}
          <div className="space-y-4 pr-4 md:border-r border-slate-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              DEMAND & TOPLINE
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">POS UNITS</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">350.5K</span>
                <span className="text-[11px] text-slate-500 font-medium block">81% of plan</span>
                <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -83.0K vs 433.4K
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">POS $ AT RETAIL</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$44.8M</span>
                <span className="text-[11px] text-slate-500 font-medium block">74% of plan</span>
                <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$15.6M vs $60.4M
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">POS $ AT INVOICE SALES</span>
              <span className="text-xl font-bold text-slate-900 tracking-tight">$32.2M</span>
              <span className="text-[11px] text-slate-500 font-medium block">74% of plan</span>
              <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                -$11.2M vs $43.5M
              </span>
            </div>
          </div>

          {/* COLUMN 2: TRADE SPEND */}
          <div className="space-y-4 pr-4 md:border-r border-slate-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              TRADE SPEND
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">MERCHANT SPEND $</span>
              <span className="text-xs italic text-slate-500 font-medium block">logic under construction</span>
              <span className="text-[11px] text-slate-400 font-medium block">vs $9.4M plan</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">RSA ADJ. TOTAL $</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$4.3M</span>
                <span className="text-[11px] text-slate-500 font-medium block">84% of plan</span>
                <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$790.7K vs $5.1M
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">TOTAL TRADE SPEND $</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$7.8M</span>
                <span className="text-[11px] text-slate-500 font-medium block">82% of plan</span>
                <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$1.8M vs $9.6M
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: NET VALUE & PROFITABILITY */}
          <div className="space-y-4">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              NET VALUE & PROFITABILITY
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">ROI</span>
                <span className="text-xs italic text-slate-500 font-medium block">logic under construction</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">NSV $</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$28.7M</span>
                <span className="text-[11px] text-slate-500 font-medium block">74% of plan</span>
                <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$10.2M vs $38.9M
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-[11px]">
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider mb-0.5">SGM / AGM % · ACT</span>
                <div className="text-emerald-700 font-bold text-sm">SGM+ 27.0% <span className="text-slate-400 font-medium text-xs">vs 23.3% plan</span></div>
                <div className="text-emerald-700 font-bold text-sm">AGM+ 27.9% <span className="text-slate-400 font-medium text-xs">vs 26.7% plan</span></div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider mb-0.5">DROP-THRU % · ACT</span>
                <div className="text-emerald-700 font-bold text-sm">SGM+ 7.1% <span className="text-slate-400 font-medium text-xs">vs 5.4% plan</span></div>
                <div className="text-emerald-700 font-bold text-sm">AGM+ 12.1% <span className="text-slate-400 font-medium text-xs">vs 10.9% plan</span></div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CLOSED EVENTS LIST TABLE */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-sm">
          <span className="font-bold text-slate-800 uppercase tracking-wider">
            Closed Promotional PCR Records ({filteredEvents.length})
          </span>
          <span className="text-slate-500 text-[11px] font-semibold">Click row to view SKU execution payload</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3">PCR ID</th>
                <th className="p-3">Event Title</th>
                <th className="p-3">Brand / Customer</th>
                <th className="p-3 text-right">POS Units</th>
                <th className="p-3 text-right">Retail Sales</th>
                <th className="p-3 text-right">Trade Spend</th>
                <th className="p-3 text-right">SGM Margin</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map(row => (
                <tr 
                  key={row.pcrNumber}
                  onClick={() => setSelectedEvent(row)}
                  className="hover:bg-yellow-50/50 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-semibold text-slate-800">{row.pcrNumber}</td>
                  <td className="p-3 font-bold text-slate-900">{row.title}</td>
                  <td className="p-3 text-slate-600">
                    <span className="font-bold text-slate-800">{row.brand}</span> ({row.customer})
                  </td>
                  <td className="p-3 text-right font-semibold text-slate-800">{row.units}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{row.retailSales}</td>
                  <td className="p-3 text-right font-medium text-slate-700">{row.tradeSpend}</td>
                  <td className="p-3 text-right text-emerald-700 font-bold">{row.sgmMargin}</td>
                  <td className="p-3 text-center">
                    <button className="text-slate-400 hover:text-slate-800 p-1 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVENT DETAIL DRAWER MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedEvent.pcrNumber}</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">{selectedEvent.title}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 font-sans text-sm">
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 grid grid-cols-2 gap-4">
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">BRAND</span> <strong className="text-slate-900">{selectedEvent.brand}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">CUSTOMER</span> <strong className="text-slate-900">{selectedEvent.customer}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">TIMING</span> <strong className="text-slate-900">{selectedEvent.timing}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">SGM MARGIN</span> <strong className="text-emerald-700 text-base">{selectedEvent.sgmMargin}</strong></div>
              </div>

              <div className="border border-slate-200 rounded-sm p-4 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">SKU Execution Breakdown</h4>
                <div className="space-y-2 text-slate-700 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium">DeWalt 20V Cordless Drill Kit (DCD771C2)</span>
                    <strong className="text-slate-900">72,400 Units</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium">DeWalt 20V Max 5.0Ah Battery 2-Pk</span>
                    <strong className="text-slate-900">38,100 Units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">DeWalt ToughSystem Rolling Storage</span>
                    <strong className="text-slate-900">14,000 Units</strong>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-sm text-sm">
                <strong className="font-bold">Post-Event Retrospective Note:</strong> Promotional volume lift exceeded baseline forecast by +14.2%. Margin expansion achieved through optimization of RSA co-op spend caps.
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-sm text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              Close Record View
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
