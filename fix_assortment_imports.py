import re

with open('src/components/PortfolioTransferenceModule.tsx', 'r') as f:
    content = f.read()

lucide_import_regex = re.compile(r"import\s*\{([^\}]*)\}\s*from\s*'lucide-react';")

def update_lucide(match):
    imports = match.group(1)
    if "ChevronDown" not in imports:
        imports += ", ChevronDown"
    if "ChevronUp" not in imports:
        imports += ", ChevronUp"
    return f"import {{{imports}}} from 'lucide-react';"

content = lucide_import_regex.sub(update_lucide, content)

with open('src/components/PortfolioTransferenceModule.tsx', 'w') as f:
    f.write(content)
