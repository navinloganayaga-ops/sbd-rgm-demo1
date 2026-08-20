import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Make sure we don't accidentally skip something. Let's do string replacement for the button in Phase 1 (Simulator).
target_sim_btn = """              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setCurrentPhase(2)}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  Next: Customer Targets <ChevronRight size={16} />
                </button>
              </div>
            </div>
            </>)}
            {currentPhase === 2 && ("""

replace_sim_btn = """              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Simulate Scenario
                </button>
              </div>
            </div>
            </>)}
            {currentPhase === 2 && (""" # Keep this boundary so we can regex out phase 2 later if needed, but actually wait, let's just do it directly.

# First Simulator:
content = content.replace("""              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setCurrentPhase(2)}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  Next: Customer Targets <ChevronRight size={16} />
                </button>
              </div>
            </div>
            </>)}""",
"""              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Simulate Scenario
                </button>
              </div>
            </div>
            </>)}""")


# First Optimizer:
content = content.replace("""              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setCurrentPhase(2)}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  Next: Customer Targets <ChevronRight size={16} />
                </button>
              </div>
            </div>
            </>)}""",
"""              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button 
                  onClick={simulate}
                  className="flex items-center gap-2 bg-[#FFC20E] text-slate-900 px-6 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-[#eab308] transition-colors"
                >
                  <Sparkles size={16} /> Run Optimizer Engine
                </button>
              </div>
            </div>
            </>)}""")

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
