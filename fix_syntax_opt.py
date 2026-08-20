import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r'(\s*</div>\s*</div>\s*</div>\s*</div>)\s*<div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">',
    re.DOTALL
)

# Replacing 4 closing divs with 3 closing divs
replacement = r'''
                </div>
              </div>
            </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">'''

content = pattern.sub(replacement, content)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
