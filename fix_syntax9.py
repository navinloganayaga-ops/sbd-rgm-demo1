with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

content = content.replace(
'''      </div>
    </div>
  );
}''',
'''      </div>
      </div>
    </div>
  );
}'''
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
