with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Let's fix line 408 (Simulator branch, phase 3):
content = content.replace(
'''                </div>
              </div>
            )
            )}
          </div>
        )}

        {activeTab === 'optimizer' && (''',
'''                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'optimizer' && ('''
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
