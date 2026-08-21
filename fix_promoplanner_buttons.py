import re

with open('src/components/PromoPlanner.tsx', 'r') as f:
    content = f.read()

target = """          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors"
            >
              <span>Continue to Calendar</span>
              <ChevronRight size={18} />
            </button>
          </div>"""

replacement = """          <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <Save size={16} /> Save Scenario
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              Compare Scenarios
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#FFC20E] hover:bg-yellow-400 text-slate-900 font-bold text-sm px-6 py-2.5 rounded flex items-center gap-2 transition-colors"
            >
              <span>Continue to Calendar</span>
              <ChevronRight size={18} />
            </button>
          </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Successfully added Save and Compare buttons to PromoPlanner.")
else:
    print("Could not find the target block.")

with open('src/components/PromoPlanner.tsx', 'w') as f:
    f.write(content)

