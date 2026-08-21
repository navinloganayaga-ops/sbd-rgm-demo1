import re

with open('src/components/PortfolioTransferenceModule.tsx', 'r') as f:
    content = f.read()

# Replace <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> with <div className="space-y-6">
content = content.replace('<div className="grid grid-cols-1 md:grid-cols-3 gap-6">', '<div className="space-y-6">')

# Replace <div className="md:col-span-2 space-y-6"> with <div className="space-y-6">
content = content.replace('<div className="md:col-span-2 space-y-6">', '<div className="space-y-6">')

collaboration_regex = re.compile(r'\{\/\* SBD Collaboration Panel \(Right Column\) \*\/}.*?(?=</main>|</div>\s*</div>\s*\{/\* Modals)', re.DOTALL)
match = collaboration_regex.search(content)
if match:
    content = content[:match.start()] + '</div></div>' + content[match.end():]
else:
    print("Collaboration panel not found")

with open('src/components/PortfolioTransferenceModule.tsx', 'w') as f:
    f.write(content)

