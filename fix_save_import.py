import re

with open('src/components/PromoPlanner.tsx', 'r') as f:
    content = f.read()

# Add Save to lucide-react imports if it's missing
if " Save," not in content and " Save " not in content:
    content = content.replace("UploadCloud", "UploadCloud, Save")

with open('src/components/PromoPlanner.tsx', 'w') as f:
    f.write(content)
