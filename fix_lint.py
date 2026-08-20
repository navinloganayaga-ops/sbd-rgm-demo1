with open('src/components/StrategicPricingModule.tsx', 'r') as f:
    content = f.read()

# Fix ChevronRight import
if 'ChevronRight' not in content:
    content = content.replace(
        'Filter } from \'lucide-react\';',
        'Filter, ChevronRight } from \'lucide-react\';'
    )

# Fix onChange to onFilterChange in GlobalFilterBar
content = content.replace(
    'onChange={setFilterState}',
    'onFilterChange={setFilterState}'
)

with open('src/components/StrategicPricingModule.tsx', 'w') as f:
    f.write(content)
