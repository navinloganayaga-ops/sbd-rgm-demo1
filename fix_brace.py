with open('src/components/PortfolioTransferenceModule.tsx', 'r') as f:
    c = f.read()
c = c.replace("{/* TAB 4: SCENARIO GOVERNANCE */}}", "{/* TAB 4: SCENARIO GOVERNANCE */}")
with open('src/components/PortfolioTransferenceModule.tsx', 'w') as f:
    f.write(c)
