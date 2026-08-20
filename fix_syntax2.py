import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'\}\)\n\s*\}\)', r'})', content)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
