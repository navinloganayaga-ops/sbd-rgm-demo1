import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

target = '<span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">🚧 Under Const.</span>'
replacement = '<span className="bg-[#FFC20E] text-neutral-900 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">BETA</span>'

content = content.replace(target, replacement)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
