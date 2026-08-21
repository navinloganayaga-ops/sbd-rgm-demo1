import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Replace the last three divs with two
# Specifically:
target = """        )}
      </div>
      </div>
    </div>
  );
}"""

replacement = """        )}
      </div>
    </div>
  );
}"""

if target in content:
    content = content.replace(target, replacement)
    print("Fixed extra div at the end.")
else:
    print("Target not found, falling back to regex.")
    
with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
