const fs = require('fs');

let content = fs.readFileSync('src/components/StrategicPricingModule.tsx', 'utf8');

// Replace {activeTab === 'simulator' && ( with phase logic.
content = content.replace(
  /{activeTab === 'simulator' && \([\s\S]*?<div className="space-y-6 animate-in fade-in duration-300">/,
  `{activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {currentPhase === 1 && (`
);

content = content.replace(
  /{\/\* Step 2: Customer Targets \*\/}/g,
  `)}
            {currentPhase === 2 && (
            <>
            {/* Step 2: Customer Targets */}`
);

// We need to carefully replace the close of step 2 for simulator.
content = content.replace(
  /{\/\* Output Deep Dive \(Visible after simulation\) \*\/}\s*{isSimulated && \(/,
  `</>
            )}
            
            {/* Output Deep Dive (Visible after simulation) */}
            {currentPhase === 3 && isSimulated && (`
);

// For optimizer
content = content.replace(
  /{activeTab === 'optimizer' && \([\s\S]*?<div className="space-y-6 animate-in fade-in duration-300">/,
  `{activeTab === 'optimizer' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {currentPhase === 1 && (`
);

// The optimizer has `{/* Empty State Table / Simulated State */}` block which is step 3.
content = content.replace(
  /{\/\* Empty State Table \/ Simulated State \*\/}\s*{!isSimulated \? \(/,
  `</>
            )}

            {/* Empty State Table / Simulated State */}
            {currentPhase === 3 && (
              !isSimulated ? (`
);

// And we need to fix the closing brace for !isSimulated ? ( ... ) : ( ... )
// Actually, in Optimizer, currentPhase === 3 should just render the table if isSimulated.
// Wait, !isSimulated ? ( empty state ) : ( output ). It's fine to keep it like this!
// We just need to add a closing parenthesis.
content = content.replace(
  /Publish Changes\s*<\/button>\s*<\/div>\s*<\/div>\s*\)}\s*<\/div>\s*\)}/g,
  `Publish Changes
                  </button>
                </div>
              </div>
            )}
            )}
          </div>
        )}`
);

fs.writeFileSync('src/components/StrategicPricingModule.tsx', content);
