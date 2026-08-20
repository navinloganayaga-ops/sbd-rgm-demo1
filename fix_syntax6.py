import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Let's fix lines 565-590:
content = re.sub(
    r'                </div>\n              </div>\n            \)\n            \)\}\n          </div>\n        \)\}\n      </div>\n    </div>\n  \);\n\}',
    r'                </div>\n              </div>\n            )}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}',
    content
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
