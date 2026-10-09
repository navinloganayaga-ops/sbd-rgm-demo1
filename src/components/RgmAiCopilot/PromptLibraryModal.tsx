import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Tag, 
  TrendingUp, 
  Calendar, 
  Layers, 
  ArrowRight,
  BookOpen,
  Sliders,
  DollarSign,
  BarChart3,
  Box,
  Target
} from 'lucide-react';
import { PromptLibraryItem } from './types';
import { promptLibraryItems } from './mockData';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (item: PromptLibraryItem) => void;
  onCopyToInput: (text: string) => void;
}

export default function PromptLibraryModal({
  isOpen,
  onClose,
  onSelectPrompt,
  onCopyToInput,
}: PromptLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Prompts', count: promptLibraryItems.length },
    { id: 'pricing', label: 'Strategic Pricing', count: promptLibraryItems.filter(p => p.pillar === 'pricing').length },
    { id: 'promo', label: 'Trade Promotions', count: promptLibraryItems.filter(p => p.pillar === 'promo').length },
    { id: 'assortment', label: 'Assortment', count: promptLibraryItems.filter(p => p.pillar === 'assortment').length },
    { id: 'goal_seek', label: 'Executive Targets', count: promptLibraryItems.filter(p => p.pillar === 'goal_seek').length },
    { id: 'descriptive', label: 'Descriptive Audit', count: promptLibraryItems.filter(p => p.pillar === 'descriptive').length },
  ];

  const filteredPrompts = promptLibraryItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.pillar === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (item: PromptLibraryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyToInput(item.userPrompt);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getPillarBadge = (pillar: PromptLibraryItem['pillar']) => {
    switch (pillar) {
      case 'pricing':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: DollarSign,
          label: 'STRATEGIC PRICING'
        };
      case 'promo':
        return {
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
          icon: BarChart3,
          label: 'TRADE PROMOTIONS'
        };
      case 'assortment':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          icon: Box,
          label: 'ASSORTMENT PLANNING'
        };
      case 'goal_seek':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-200',
          icon: Target,
          label: 'EXECUTIVE TARGET'
        };
      case 'descriptive':
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: BookOpen,
          label: 'DESCRIPTIVE AUDIT'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden text-slate-800 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FFC20E] text-slate-950 flex items-center justify-center font-bold">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">RGM Prompt Library</h3>
                <span className="bg-slate-800 border border-slate-700 text-[#FFC20E] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  {promptLibraryItems.length} Scenarios Available
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-calibrated econometric simulation prompts grounded in Snowflake enterprise data.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search prompts by keyword, SKU, retailer, elasticity, or pillar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.id ? 'bg-slate-700 text-[#FFC20E]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PROMPTS GRID / LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#F8F9FA] space-y-3">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded border border-dashed border-slate-300 p-8">
              <Search size={32} className="mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No matching prompts found</h4>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your keyword or category filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 text-xs text-amber-700 font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredPrompts.map((item) => {
              const badge = getPillarBadge(item.pillar);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-amber-400/80 rounded-lg p-4 shadow-2xs hover:shadow-md transition-all group relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border flex items-center gap-1 ${badge.bg}`}>
                        <BadgeIcon size={11} />
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Horizon: {item.suggestedHorizon}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopy(item, e)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy query text to input bar"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy to Input</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectPrompt(item);
                          onClose();
                        }}
                        className="px-3.5 py-1 bg-[#FFC20E] hover:bg-yellow-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                      >
                        <Play size={11} className="fill-slate-950" />
                        <span>Run Scenario</span>
                      </button>
                    </div>
                  </div>

                  {/* PROMPT TITLE & QUERY */}
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-black">
                    {item.title}
                  </h4>
                  <div className="my-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded font-mono text-xs text-slate-800 leading-relaxed">
                    <span className="text-amber-600 font-bold mr-1">&gt;</span>
                    "{item.userPrompt}"
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    {item.description}
                  </p>

                  {/* IMPACT PREVIEW & TAGS */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <TrendingUp size={12} className="text-emerald-600" />
                      <span>Modeled Impact: {item.impactPreview}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#FFC20E]" />
            <span>Select any prompt to execute real-time econometric regression & cross-elasticity solvers.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
