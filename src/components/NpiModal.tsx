import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';

interface NpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function NpiModal({ isOpen, onClose, onAdd }: NpiModalProps) {
  const [brand, setBrand] = useState('DeWalt');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">NPI Ghost SKU Configurator</h2>
            <p className="text-sm text-slate-500 mt-1">Define product attributes and target financials to simulate pure incremental growth and baseline cannibalization.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Attribute Profile */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Step 1: Define Attribute Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand</label>
                  <select 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  >
                    <option>DeWalt</option>
                    <option>Stanley</option>
                    <option>Craftsman</option>
                    <option>MAC Tools</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Battery Platform</label>
                  <select className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                    <option>20V MAX</option>
                    <option>12V MAX</option>
                    <option>60V FlexVolt</option>
                    <option>Corded/Hand Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Motor Technology</label>
                  <select className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                    <option>Brushless</option>
                    <option>Brushed</option>
                    <option>N/A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                  <select className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500">
                    <option>Impact Driver</option>
                    <option>Hammer Drill</option>
                    <option>Circular Saw</option>
                    <option>Measurement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pack Type</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="packType" defaultChecked className="text-slate-900 focus:ring-slate-900 border-slate-300" />
                      <span className="text-sm font-medium text-slate-700">Bare Tool</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="packType" className="text-slate-900 focus:ring-slate-900 border-slate-300" />
                      <span className="text-sm font-medium text-slate-700">Kit / Multi-Pack</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Target Financials */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Step 2: Define Target Financials</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target MSRP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-medium sm:text-sm">$</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="149.00"
                      className="w-full bg-white border border-slate-300 rounded p-2 pl-7 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Expected Margin (MAC %)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="42.5"
                      className="w-full bg-white border border-slate-300 rounded p-2 pr-8 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" 
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-medium sm:text-sm">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Projected Year 1 Volume (Units)</label>
                  <input 
                    type="text" 
                    placeholder="50,000"
                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Real-Time AI Cannibalization Preview */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-5">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-600" />
              Instant Cannibalization Radius Preview
            </h4>
            <p className="text-sm font-medium text-amber-800/80 mb-4">
              Based on the selected attributes ({brand} 20V MAX Brushless), the Cosine Similarity Engine predicts high overlap with your existing 20V portfolio.
            </p>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-700">~60% Cannibalized from Base</span>
                <span className="text-emerald-700">~40% Pure Incremental Growth</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-rose-500 h-full w-[60%]"></div>
                <div className="bg-emerald-500 h-full w-[40%]"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onAdd();
              onClose();
            }}
            className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-5 py-2 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
          >
            Add NPI to Scenario <Sparkles size={16} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
