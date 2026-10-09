import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ArrowLeft, 
  Filter, 
  History, 
  ArrowUpDown, 
  X, 
  Check, 
  Calendar,
  Layers,
  ChevronUp,
  FileSpreadsheet,
  Download,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { FilterState } from './GlobalFilterBar';
import { NavItem } from './Sidebar';

export interface ReviewHubViewProps {
  filterState?: FilterState;
  onFilterChange?: (f: FilterState) => void;
  onNavigateTab?: (item: NavItem, payload?: any) => void;
}

export interface PcrReviewRow {
  pcrNumber: string;
  title: string;
  flags: Array<'MULTI-LINE SKU' | 'MGSV'>;
  bu: string;
  demandGroup: string;
  pliLinesCount: number;
  openReviewItems: number;
  defaultWindowStart?: string;
  defaultWindowEnd?: string;
}

export default function ReviewHubView({
  filterState,
  onFilterChange,
  onNavigateTab
}: ReviewHubViewProps) {
  // Exact master data matching image.png
  const initialPcrs: PcrReviewRow[] = [
    {
      pcrNumber: 'P-00175325',
      title: 'Q1 2026 Storage National PCR - All Channels',
      flags: ['MULTI-LINE SKU', 'MGSV'],
      bu: 'PTG',
      demandGroup: 'HD , LOWES',
      pliLinesCount: 8,
      openReviewItems: 8,
      defaultWindowStart: '2026-01-01',
      defaultWindowEnd: '2026-02-15'
    },
    {
      pcrNumber: 'P-00176309',
      title: 'Q1 2026 National HPG Promotions (Hand Vacs)',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'HD , LOWES',
      pliLinesCount: 12,
      openReviewItems: 12,
      defaultWindowStart: '2026-01-12',
      defaultWindowEnd: '2026-02-28'
    },
    {
      pcrNumber: 'P-00178368',
      title: 'Q1 25 HD.com SBOTD',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 6,
      openReviewItems: 6,
      defaultWindowStart: '2026-01-20',
      defaultWindowEnd: '2026-02-10'
    },
    {
      pcrNumber: 'P-00185913',
      title: 'DW HDYOW DCKO215M1 NLP',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 10,
      openReviewItems: 10,
      defaultWindowStart: '2026-02-01',
      defaultWindowEnd: '2026-03-15'
    },
    {
      pcrNumber: 'P-00204884',
      title: 'Big Box Spring Black Friday Adjustment',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 12,
      openReviewItems: 12,
      defaultWindowStart: '2026-03-01',
      defaultWindowEnd: '2026-04-15'
    },
    {
      pcrNumber: 'P-00194301',
      title: 'THD ZT3 60 Final Volume and Cub Days Funding 2025',
      flags: ['MGSV'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 4,
      openReviewItems: 4,
      defaultWindowStart: '2025-10-01',
      defaultWindowEnd: '2025-11-30'
    },
    {
      pcrNumber: 'P-00185935',
      title: 'Q1 2026 CHT HD E&O',
      flags: ['MGSV'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 6,
      openReviewItems: 6,
      defaultWindowStart: '2026-01-15',
      defaultWindowEnd: '2026-02-28'
    },
    {
      pcrNumber: 'P-00182410',
      title: 'DW 20V Drill Blitz Retrospective Promo',
      flags: ['MULTI-LINE SKU', 'MGSV'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 9,
      openReviewItems: 9,
      defaultWindowStart: '2026-01-10',
      defaultWindowEnd: '2026-02-25'
    },
    {
      pcrNumber: 'P-00191244',
      title: 'Lowe\'s Spring Power Event National Adjustment',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'LOWES',
      pliLinesCount: 8,
      openReviewItems: 8,
      defaultWindowStart: '2026-03-01',
      defaultWindowEnd: '2026-04-10'
    },
    {
      pcrNumber: 'P-00169820',
      title: 'Craftsman Mechanics Tool Set Holiday Clearance',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'HD , ACE',
      pliLinesCount: 5,
      openReviewItems: 5,
      defaultWindowStart: '2025-11-15',
      defaultWindowEnd: '2025-12-31'
    },
    {
      pcrNumber: 'P-00174092',
      title: 'Menards ProLine Level & Laser Circular Promo',
      flags: ['MGSV'],
      bu: 'PTG',
      demandGroup: 'MENARDS',
      pliLinesCount: 4,
      openReviewItems: 4,
      defaultWindowStart: '2026-02-01',
      defaultWindowEnd: '2026-03-15'
    },
    {
      pcrNumber: 'P-00201155',
      title: 'Stanley FatMax Spring Contractor Special Buy',
      flags: ['MULTI-LINE SKU'],
      bu: 'PTG',
      demandGroup: 'HD',
      pliLinesCount: 7,
      openReviewItems: 7,
      defaultWindowStart: '2026-02-15',
      defaultWindowEnd: '2026-03-31'
    }
  ];

  // Exact 4 PCRs pre-selected as shown in image.png:
  // SELECTED (4): P-00176309, P-00178368, P-00185913, P-00204884
  const [selectedPcrIds, setSelectedPcrIds] = useState<string[]>([
    'P-00176309',
    'P-00178368',
    'P-00185913',
    'P-00204884'
  ]);

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown states matching exact top filters in image.png
  const [filterSuperSbu, setFilterSuperSbu] = useState('All');
  const [filterSbu, setFilterSbu] = useState('All');
  const [filterBu, setFilterBu] = useState('2 selected');
  const [filterDivision, setFilterDivision] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPortfolio, setFilterPortfolio] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterDemandGroup, setFilterDemandGroup] = useState('All');
  const [filterCustomer, setFilterCustomer] = useState('All');

  // Active Dropdown menu for filters
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Active Convergence Tab state
  const [activeConvergenceTab, setActiveConvergenceTab] = useState<'mgsv' | 'sku_exclusion' | 'pos_actuals' | 'cross_pcr' | 'rsa'>('mgsv');

  // Jump to section state
  const [isJumpToSectionOpen, setIsJumpToSectionOpen] = useState(false);
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);
  const [activeAuditModal, setActiveAuditModal] = useState(false);

  // POS actuals window dates state for the selected PCRs
  const [posWindows, setPosWindows] = useState<Record<string, { start: string; end: string; status: string }>>({
    'P-00176309': { start: '2026-01-12', end: '2026-02-28', status: 'Confirmed' },
    'P-00178368': { start: '2026-01-20', end: '2026-02-10', status: 'Confirmed' },
    'P-00185913': { start: '2026-02-01', end: '2026-03-15', status: 'Confirmed' },
    'P-00204884': { start: '2026-03-01', end: '2026-04-15', status: 'Confirmed' }
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    return initialPcrs.filter(pcr => {
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matches = 
          pcr.pcrNumber.toLowerCase().includes(q) ||
          pcr.title.toLowerCase().includes(q) ||
          pcr.demandGroup.toLowerCase().includes(q) ||
          pcr.bu.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [initialPcrs, searchTerm]);

  // Toggle selection of individual PCR
  const toggleSelectPcr = (pcrNumber: string) => {
    if (selectedPcrIds.includes(pcrNumber)) {
      setSelectedPcrIds(prev => prev.filter(id => id !== pcrNumber));
    } else {
      setSelectedPcrIds(prev => [...prev, pcrNumber]);
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedPcrIds.length === filteredRows.length) {
      setSelectedPcrIds([]);
    } else {
      setSelectedPcrIds(filteredRows.map(r => r.pcrNumber));
    }
  };

  // Remove single chip
  const removeSelectedChip = (pcrNumber: string) => {
    setSelectedPcrIds(prev => prev.filter(id => id !== pcrNumber));
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedPcrIds([]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterSuperSbu('All');
    setFilterSbu('All');
    setFilterBu('2 selected');
    setFilterDivision('All');
    setFilterCategory('All');
    setFilterPortfolio('All');
    setFilterBrand('All');
    setFilterDemandGroup('All');
    setFilterCustomer('All');
    setSearchTerm('');
    showToast('Filters reset to default.');
  };

  // Calculate scope metrics based on selection
  const selectedPcrsData = initialPcrs.filter(p => selectedPcrIds.includes(p.pcrNumber));
  const totalPliLines = selectedPcrsData.reduce((acc, curr) => acc + curr.pliLinesCount, 0);
  const totalOpenReviewItems = selectedPcrsData.reduce((acc, curr) => acc + curr.openReviewItems, 0);

  return (
    <div className="space-y-4 font-sans text-slate-900 pb-20">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border-l-4 border-[#F59E0B] px-4 py-2.5 rounded shadow-xl text-xs font-semibold flex items-center gap-2">
          <Check size={14} className="text-[#F59E0B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
          REVIEWS
        </div>
        <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
          Review Hub
        </h1>
        <p className="text-xs sm:text-[13px] text-slate-600">
          Pick the PCRs you want to review, then confirm the POS actuals window for each.
        </p>
      </div>

      {/* 2. FILTERS CONTAINER (EXACT REPLICATION FROM IMAGE.PNG) */}
      <div className="bg-white border border-slate-200 rounded-sm p-3.5 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            FILTERS
          </span>
          <button 
            onClick={handleResetFilters}
            className="text-slate-600 hover:text-slate-900 underline text-xs font-medium cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {/* SUPER SBU */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'super_sbu' ? null : 'super_sbu')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">SUPER SBU:</span>
              <span className="text-slate-900 font-medium">{filterSuperSbu}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'super_sbu' && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'Tools & Outdoor', 'Industrial'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterSuperSbu(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SBU */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'sbu' ? null : 'sbu')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">SBU:</span>
              <span className="text-slate-900 font-medium">{filterSbu}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'sbu' && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'Power Tools', 'Hand Tools', 'Storage', 'Outdoor'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterSbu(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BU: 2 selected */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'bu' ? null : 'bu')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">BU:</span>
              <span className="text-slate-900 font-medium">{filterBu}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'bu' && (
              <div className="absolute left-0 mt-1 w-56 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                <div className="px-3 py-1.5 font-bold text-slate-500 text-[10px] uppercase border-b border-slate-100">
                  Select Business Units
                </div>
                {['Power Tools Group (PTG)', 'Hand Tools & Accessories', 'Outdoor Power Equipment', 'Engineered Fastening'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterBu(opt === 'Power Tools Group (PTG)' ? '2 selected' : opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800 flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    {(opt.includes('PTG') || opt.includes('Hand Tools')) && <Check size={12} className="text-slate-700" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DIVISION */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'division' ? null : 'division')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">DIVISION:</span>
              <span className="text-slate-900 font-medium">{filterDivision}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'division' && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'Commercial', 'Retail', 'Industrial'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterDivision(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">CATEGORY:</span>
              <span className="text-slate-900 font-medium">{filterCategory}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'category' && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'Drilling & Fastening', 'Hand Saws', 'Mechanics Tools'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterCategory(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PORTFOLIO */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'portfolio' ? null : 'portfolio')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">PORTFOLIO:</span>
              <span className="text-slate-900 font-medium">{filterPortfolio}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'portfolio' && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'Cordless 20V MAX', 'FLEXVOLT 60V', 'Core Corded'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterPortfolio(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BRAND */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">BRAND:</span>
              <span className="text-slate-900 font-medium">{filterBrand}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'brand' && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'DeWalt', 'Craftsman', 'Stanley', 'Black+Decker', 'IRWIN', 'LENOX'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterBrand(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DEMAND GROUP */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'demand_group' ? null : 'demand_group')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">DEMAND GROUP:</span>
              <span className="text-slate-900 font-medium">{filterDemandGroup}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'demand_group' && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'HD', 'LOWES', 'MENARDS', 'AMAZON', 'ACE'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterDemandGroup(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CUSTOMER */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'customer' ? null : 'customer')}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-sm hover:border-slate-400 text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="font-bold text-slate-700">CUSTOMER:</span>
              <span className="text-slate-900 font-medium">{filterCustomer}</span>
              <ChevronDown size={13} className="text-slate-500 ml-0.5" />
            </button>
            {activeDropdown === 'customer' && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-300 rounded-sm shadow-lg z-30 py-1 text-xs">
                {['All', 'The Home Depot', 'Lowe\'s', 'Menards', 'Amazon', 'Tractor Supply'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setFilterCustomer(opt); setActiveDropdown(null); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-800"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. REVIEW SCOPE BAR WITH ORANGE/AMBER ACCENT (EXACT REPLICATION FROM IMAGE.PNG) */}
      <div className="bg-white border-y sm:border border-slate-200 border-l-4 border-l-[#F59E0B] p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        
        {/* Left Side: Back button + Funnel + Scope Metrics */}
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => onNavigateTab?.('promo_events')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm text-xs font-semibold text-slate-800 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={13} className="text-slate-600" />
            <span>Promo Events</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <Filter size={14} className="text-slate-500 shrink-0" />
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block leading-none mb-0.5">
                REVIEW SCOPE
              </span>
              <div className="text-xs text-slate-800">
                <span className="font-bold">HD</span>
                <span className="text-slate-400 mx-1.5">·</span>
                <span>{selectedPcrIds.length} PCRs selected</span>
                <span className="text-slate-400 mx-1.5">·</span>
                <span>{totalPliLines} PLI lines</span>
                <span className="text-slate-400 mx-1.5">·</span>
                <span className="font-bold text-[#B45309]">
                  {totalOpenReviewItems} open review items
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Audit history + Jump to section */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audit history dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsAuditHistoryOpen(!isAuditHistoryOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm text-xs font-medium text-slate-800 cursor-pointer shadow-2xs"
            >
              <History size={13} className="text-slate-500" />
              <span>Audit history</span>
              <ChevronDown size={13} className="text-slate-500" />
            </button>
            {isAuditHistoryOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-300 rounded-sm shadow-xl z-30 p-2.5 text-xs space-y-2">
                <div className="font-bold text-slate-800 border-b border-slate-100 pb-1">Recent Review Audits</div>
                <div className="text-slate-600 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span>P-00176309 updated</span>
                    <span className="text-slate-400">10m ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>P-00185913 POS locked</span>
                    <span className="text-slate-400">2h ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>P-00204884 assigned</span>
                    <span className="text-slate-400">Yesterday</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsAuditHistoryOpen(false); showToast('Opened full audit trail.'); }}
                  className="w-full text-center text-xs text-blue-600 hover:underline pt-1 border-t border-slate-100"
                >
                  View full audit log
                </button>
              </div>
            )}
          </div>

          {/* Jump to section dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsJumpToSectionOpen(!isJumpToSectionOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm text-xs font-medium text-slate-800 cursor-pointer shadow-2xs"
            >
              <span>Jump to section</span>
              <ChevronDown size={13} className="text-slate-500" />
            </button>
            {isJumpToSectionOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-300 rounded-sm shadow-xl z-30 py-1 text-xs">
                <button 
                  onClick={() => {
                    setIsJumpToSectionOpen(false);
                    const el = document.getElementById('section-pick-pcrs');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 text-slate-800 flex items-center justify-between"
                >
                  <span>1. Pick PCRs to review</span>
                  <span className="text-[10px] text-slate-400">Top</span>
                </button>
                <button 
                  onClick={() => {
                    setIsJumpToSectionOpen(false);
                    const el = document.getElementById('section-convergence');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 text-slate-800 flex items-center justify-between"
                >
                  <span>2. Convergence</span>
                  <span className="text-[10px] text-slate-400">3 items</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. MAIN CONTAINER: "Pick PCRs to review" (EXACT REPLICATION FROM IMAGE.PNG) */}
      <div id="section-pick-pcrs" className="bg-white border border-slate-200 rounded-sm p-4 shadow-2xs space-y-3.5">
        
        {/* Section title & count */}
        <div>
          <h2 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Pick PCRs to review
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {filteredRows.length} PCRs match your filters for <strong className="font-bold text-slate-900">HD</strong> · <strong className="font-bold text-slate-900">{selectedPcrIds.length} selected</strong>
          </p>
        </div>

        {/* Selected Chips Bar */}
        <div className="bg-white border border-slate-200 rounded-sm p-2 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide px-1">
            SELECTED ({selectedPcrIds.length})
          </span>

          {selectedPcrIds.map(id => (
            <div 
              key={id}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-mono shadow-2xs"
            >
              <span>{id}</span>
              <button 
                onClick={() => removeSelectedChip(id)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                title={`Remove ${id}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}

          {selectedPcrIds.length > 0 && (
            <button 
              onClick={clearSelection}
              className="text-slate-600 hover:text-slate-900 underline text-xs font-normal ml-1 cursor-pointer"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Search & Select all bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search PCR number, title, or SKU..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-300 rounded-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Right Counter & Select all link */}
          <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0 self-end sm:self-center">
            <span>{filteredRows.length}/{initialPcrs.length}</span>
            <span>•</span>
            <button 
              onClick={toggleSelectAll}
              className="text-slate-800 hover:text-black underline text-xs cursor-pointer font-medium"
            >
              Select all ({selectedPcrIds.length}/{filteredRows.length})
            </button>
          </div>
        </div>

        {/* 5. TABLE OF PCRs (EXACT REPLICATION FROM IMAGE.PNG) */}
        <div className="border border-slate-200 rounded-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ECEEF1] text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={filteredRows.length > 0 && selectedPcrIds.length === filteredRows.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 font-bold text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>PCR #</span>
                    <ArrowUpDown size={11} className="text-slate-500" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-bold text-slate-700 min-w-[280px]">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>TITLE</span>
                    <ArrowUpDown size={11} className="text-slate-500" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>FLAGS</span>
                    <ArrowUpDown size={11} className="text-slate-500" />
                    <Filter size={11} className="text-slate-500" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-bold text-slate-700">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>BU</span>
                    <ArrowUpDown size={11} className="text-slate-500" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-bold text-slate-700">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>DEMAND GROUP</span>
                    <ArrowUpDown size={11} className="text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {filteredRows.map((row) => {
                const isSelected = selectedPcrIds.includes(row.pcrNumber);
                return (
                  <tr 
                    key={row.pcrNumber}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectPcr(row.pcrNumber)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* PCR # */}
                    <td className="py-2.5 px-3 font-bold font-mono text-[11px] text-slate-900 whitespace-nowrap">
                      {row.pcrNumber}
                    </td>

                    {/* TITLE */}
                    <td className="py-2.5 px-3 text-xs font-normal text-slate-900">
                      {row.title}
                    </td>

                    {/* FLAGS (YELLOW & PURPLE PILLS AS IN IMAGE.PNG) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {row.flags.map((flag) => {
                          if (flag === 'MULTI-LINE SKU') {
                            return (
                              <span 
                                key={flag}
                                className="bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] font-bold text-[9px] tracking-wide px-2 py-0.5 rounded-sm uppercase"
                              >
                                MULTI-LINE SKU
                              </span>
                            );
                          }
                          if (flag === 'MGSV') {
                            return (
                              <span 
                                key={flag}
                                className="bg-[#EDE9FE] text-[#6B21A8] border border-[#DDD6FE] font-bold text-[9px] tracking-wide px-2 py-0.5 rounded-sm uppercase"
                              >
                                MGSV
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </td>

                    {/* BU */}
                    <td className="py-2.5 px-3 text-xs text-slate-600 whitespace-nowrap">
                      {row.bu}
                    </td>

                    {/* DEMAND GROUP */}
                    <td className="py-2.5 px-3 text-xs text-slate-600 whitespace-nowrap">
                      {row.demandGroup}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* 6. CONVERGENCE SECTION (EXACT REPLICATION FROM ATTACHED IMAGE) */}
      <div id="section-convergence" className="space-y-2.5">
        
        {/* Convergence Header & Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <div className="font-bold tracking-wider text-slate-800 uppercase text-[11px]">
            CONVERGENCE
          </div>
          <div className="text-[11px] text-slate-500 font-normal">
            <span>3 items outstanding</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span>0 need re-confirmation</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span>suggested next: </span>
            <button 
              onClick={() => {
                setActiveConvergenceTab('pos_actuals');
                showToast('Switched to suggested tab: POS Actuals');
              }}
              className="text-slate-800 hover:text-black underline font-semibold cursor-pointer"
            >
              POS Actuals
            </button>
          </div>
        </div>

        {/* Tab Strip Grid: Row 1 (4 tabs) and Row 2 (1 tab) */}
        <div className="space-y-2">
          
          {/* Row 1: MGSV Line Item | SKU Exclusion | POS Actuals | Cross-PCR Overlaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            
            {/* Tab 1: MGSV Line Item (Active tab with yellow border & indicator) */}
            <button
              onClick={() => setActiveConvergenceTab('mgsv')}
              className={`flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-sm transition-all text-xs cursor-pointer shadow-2xs ${
                activeConvergenceTab === 'mgsv'
                  ? 'border-[#F59E0B] border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]/50'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span className="font-bold text-slate-900 text-xs">MGSV Line Item</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px] border border-slate-200">
                N/A
              </span>
            </button>

            {/* Tab 2: SKU Exclusion */}
            <button
              onClick={() => setActiveConvergenceTab('sku_exclusion')}
              className={`flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-sm transition-all text-xs cursor-pointer shadow-2xs ${
                activeConvergenceTab === 'sku_exclusion'
                  ? 'border-[#F59E0B] border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]/50'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium text-slate-800 text-xs">SKU Exclusion</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px] border border-slate-200 uppercase tracking-tight">
                NOT STARTED
              </span>
            </button>

            {/* Tab 3: POS Actuals */}
            <button
              onClick={() => setActiveConvergenceTab('pos_actuals')}
              className={`flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-sm transition-all text-xs cursor-pointer shadow-2xs ${
                activeConvergenceTab === 'pos_actuals'
                  ? 'border-[#F59E0B] border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]/50'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium text-slate-800 text-xs">POS Actuals</span>
              <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-bold text-[10px] border border-[#FCD34D] flex items-center gap-1 uppercase tracking-tight">
                <AlertTriangle size={11} className="text-[#B45309]" />
                <span>4 OPEN</span>
              </span>
            </button>

            {/* Tab 4: Cross-PCR Overlaps */}
            <button
              onClick={() => setActiveConvergenceTab('cross_pcr')}
              className={`flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-sm transition-all text-xs cursor-pointer shadow-2xs ${
                activeConvergenceTab === 'cross_pcr'
                  ? 'border-[#F59E0B] border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]/50'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium text-slate-800 text-xs">Cross-PCR Overlaps</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px] border border-slate-200">
                N/A
              </span>
            </button>

          </div>

          {/* Row 2: RSA Redemption */}
          <div className="grid grid-cols-1">
            <button
              onClick={() => setActiveConvergenceTab('rsa')}
              className={`flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-sm transition-all text-xs cursor-pointer shadow-2xs ${
                activeConvergenceTab === 'rsa'
                  ? 'border-[#F59E0B] border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]/50'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium text-slate-800 text-xs">RSA Redemption</span>
              <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] font-bold text-[10px] border border-[#FCD34D] flex items-center gap-1 uppercase tracking-tight">
                <AlertTriangle size={11} className="text-[#B45309]" />
                <span>36 OPEN</span>
              </span>
            </button>
          </div>

        </div>

        {/* Content Box corresponding to the active tab (MGSV Line Item by default) */}
        <div className="bg-white border border-slate-200 rounded-sm p-4 sm:p-5 shadow-2xs space-y-4">
          
          {/* Top Title, History badge, and "Skip this section" button */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {activeConvergenceTab === 'mgsv' && 'MGSV Line Item'}
                  {activeConvergenceTab === 'sku_exclusion' && 'SKU Exclusion'}
                  {activeConvergenceTab === 'pos_actuals' && 'POS Actuals'}
                  {activeConvergenceTab === 'cross_pcr' && 'Cross-PCR Overlaps'}
                  {activeConvergenceTab === 'rsa' && 'RSA Redemption'}
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 font-mono">
                  <RotateCcw size={10} className="text-slate-400" />
                  <span>0</span>
                </span>
              </div>
              <p className="text-xs italic text-slate-500 mt-0.5">
                {activeConvergenceTab === 'mgsv' && 'Do any MGSV placeholder lines need to become SKUs, merch cost, or be excluded?'}
                {activeConvergenceTab === 'sku_exclusion' && 'Specify individual SKUs to exclude from promotion reconciliation calculation.'}
                {activeConvergenceTab === 'pos_actuals' && 'Review and reconcile POS scanner actuals for 4 open promotion windows.'}
                {activeConvergenceTab === 'cross_pcr' && 'Identify overlapping promo mechanics running concurrent retailer flights.'}
                {activeConvergenceTab === 'rsa' && 'Verify retailer scan allowance (RSA) bill-backs and claim settlement items.'}
              </p>
            </div>

            {/* Skip this section button */}
            <button
              onClick={() => showToast('Section skipped for current review scope.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-sm transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <Edit3 size={12} className="text-slate-500" />
              <span>Skip this section</span>
            </button>
          </div>

          {/* Dotted border message box */}
          {activeConvergenceTab === 'mgsv' && (
            <div className="border border-dashed border-slate-300 rounded-sm py-12 px-4 text-center bg-slate-50/30">
              <p className="text-xs text-slate-500 font-normal">
                No MGSV placeholder lines in this scope — nothing to review here.
              </p>
            </div>
          )}

          {activeConvergenceTab === 'sku_exclusion' && (
            <div className="border border-dashed border-slate-300 rounded-sm py-10 px-4 text-center bg-slate-50/30 space-y-2">
              <p className="text-xs text-slate-600 font-medium">
                All 37 promoted SKUs are currently included in review scope.
              </p>
              <button 
                onClick={() => showToast('SKU Exclusion selector opened.')}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-800 text-xs rounded-sm hover:bg-slate-50 shadow-2xs font-semibold cursor-pointer"
              >
                + Add SKU Exclusion Rule
              </button>
            </div>
          )}

          {activeConvergenceTab === 'pos_actuals' && (
            <div className="space-y-3 pt-1">
              <div className="text-xs text-slate-600 font-semibold flex items-center justify-between">
                <span>4 Open PCR Events Requiring Confirmation:</span>
                <span className="text-amber-700 text-[11px] font-bold">Action Needed</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {selectedPcrsData.map(pcr => (
                  <div key={pcr.pcrNumber} className="border border-slate-200 rounded p-2.5 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900">{pcr.pcrNumber}</span>
                      <span className="text-slate-500 text-[11px] ml-1.5">• {pcr.demandGroup}</span>
                      <p className="text-slate-700 text-[11px] truncate max-w-[240px] mt-0.5">{pcr.title}</p>
                    </div>
                    <button 
                      onClick={() => showToast(`Confirmed POS actuals for ${pcr.pcrNumber}`)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-medium hover:bg-slate-100 cursor-pointer shadow-2xs"
                    >
                      Confirm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeConvergenceTab === 'cross_pcr' && (
            <div className="border border-dashed border-slate-300 rounded-sm py-12 px-4 text-center bg-slate-50/30">
              <p className="text-xs text-slate-500 font-normal">
                No cross-PCR overlaps detected across selected promotional dates.
              </p>
            </div>
          )}

          {activeConvergenceTab === 'rsa' && (
            <div className="space-y-3 pt-1">
              <div className="text-xs text-slate-600 font-semibold flex items-center justify-between">
                <span>36 Open RSA Redemption Claim Lines:</span>
                <span className="text-amber-700 text-[11px] font-bold">Needs Reconciliation</span>
              </div>
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2">Claim ID</th>
                      <th className="p-2">Customer</th>
                      <th className="p-2">Promo Code</th>
                      <th className="p-2 text-right">Claim Amount</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-800 text-[11px]">
                    <tr>
                      <td className="p-2 font-mono">CLM-88401</td>
                      <td className="p-2">The Home Depot</td>
                      <td className="p-2">DW-20V-Q1-BLITZ</td>
                      <td className="p-2 text-right font-mono font-medium">$4,120.00</td>
                      <td className="p-2 text-center">
                        <button onClick={() => showToast('Claim approved')} className="text-blue-600 hover:underline">Approve</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">CLM-88402</td>
                      <td className="p-2">The Home Depot</td>
                      <td className="p-2">HPG-VAC-CLEARANCE</td>
                      <td className="p-2 text-right font-mono font-medium">$2,850.00</td>
                      <td className="p-2 text-center">
                        <button onClick={() => showToast('Claim approved')} className="text-blue-600 hover:underline">Approve</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
