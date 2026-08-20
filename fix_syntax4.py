with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# I will find the !isSimulated ternary block inside optimizer
# And ensure it has properly matched parenthesis.
# Let's replace the ending of the optimizer phase 3 block:

target = """                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                    <Save size={16} /> Save Scenario
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
                    Publish Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}"""

replacement = """                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                    <Save size={16} /> Save Scenario
                  </button>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors">
                    Publish Changes
                  </button>
                </div>
              </div>
            )
            )}
          </div>
        )}"""

content = content.replace(target, replacement)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
