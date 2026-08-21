import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  subtitle?: string;
  price?: number;
  vol?: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({ options, selectedIds, onChange, placeholder = "Select items..." }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        type="button"
        className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:border-slate-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-slate-900 font-medium truncate pr-4">
          {selectedIds.length === 0 
            ? <span className="text-slate-400">{placeholder}</span>
            : `${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} selected`}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded shadow-lg max-h-60 overflow-auto">
          <div className="p-1">
            {options.map(opt => {
              const isSelected = selectedIds.includes(opt.id);
              return (
                <div 
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  className={`flex items-start gap-3 p-2.5 cursor-pointer rounded transition-colors ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">{opt.label}</div>
                    {(opt.subtitle || opt.price || opt.vol) && (
                      <div className="flex gap-2 text-[11px] text-slate-500 mt-0.5">
                        {opt.subtitle && <span>{opt.subtitle}</span>}
                        {opt.price && <span>Price: ${opt.price.toFixed(2)}</span>}
                        {opt.vol && <span>Vol: {opt.vol}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
