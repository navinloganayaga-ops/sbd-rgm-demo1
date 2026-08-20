with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# I need to add a closing parenthesis for the ternary operator.
# The previous line is `</div>`
content = content.replace(
    '''                </div>
              </div>
            )}
          </div>''',
    '''                </div>
              </div>
            )
            )}
          </div>'''
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
