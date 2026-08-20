const fs = require('fs');
let content = fs.readFileSync('src/components/StrategicPricingModule.tsx', 'utf8');

content = content.replace(
  /\)}\s*{currentPhase === 2/g,
  `</>)}\n            {currentPhase === 2`
);

fs.writeFileSync('src/components/StrategicPricingModule.tsx', content);
