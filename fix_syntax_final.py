import re

with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# I will replace lines 406 to 415 with exactly what it should be.
content = re.sub(
    r'                </div>\n              </div>\n            \)\n            \)\}\n          </div>\n        \)\}',
    r'                </div>\n              </div>\n            )}\n          </div>\n        )}',
    content
)

# And lines 580 to 590:
content = re.sub(
    r'                </div>\n              </div>\n            \)\n            \)\}\n          </div>\n        \)\}',
    r'                </div>\n              </div>\n            )\n            )}\n          </div>\n        )}',
    content
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
