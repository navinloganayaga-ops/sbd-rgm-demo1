import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Fix currentPhase === 1 error
content = re.sub(
    r'\{currentPhase === 1 \{currentPhase === 1 && \(\{currentPhase === 1 && \( \(<>',
    r'{currentPhase === 1 && (<>',
    content
)

# And for the optimizer side:
content = re.sub(
    r'\{currentPhase === 1 \&\& \(\s*\{\/\* Optimization Parameters',
    r'{currentPhase === 1 && (<>\n            {/* Optimization Parameters',
    content
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
