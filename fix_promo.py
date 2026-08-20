with open('src/components/PromoPlanner.tsx', 'r') as f:
    content = f.read()

target = """    <div className="space-y-4 font-sans">
      
        <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
          Interactive 3-step workflow wizard for constructing week-by-week promotional calendars and simulating top & bottom line financial outputs.
        </p>
      </div>"""

replacement = """    <div className="space-y-4 font-sans">"""

content = content.replace(target, replacement)

with open('src/components/PromoPlanner.tsx', 'w') as f:
    f.write(content)
