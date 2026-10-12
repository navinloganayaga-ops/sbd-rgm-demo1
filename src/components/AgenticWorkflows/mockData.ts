import { WorkflowItem } from './types';

export const agenticWorkflowsList: WorkflowItem[] = [
  {
    id: 'wf-01',
    code: 'WF-RGM-01',
    title: 'Autonomous Competitor Counter-Strike & Promo Defense',
    domain: 'Trade Promotion',
    description: 'Continuously detects aggressive competitor discounts (Milwaukee M18, Makita 18V) via Snowflake POS feeds, models brand transference bleed, and auto-synthesizes high-ROI defensive promotional counter-strikes.',
    sbdFocus: 'DeWalt 20V MAX Power Tools & Batteries',
    retailer: 'The Home Depot',
    triggerType: 'Anomaly-Driven',
    triggerSchedule: 'Hourly Snowflake EDI 852 Scanner Ingestion',
    autonomyLevel: 'Tier 4 · One-Click Commercial Sign-Off',
    status: 'Active',
    metrics: {
      primaryImpact: '+$420K Margin Protected',
      secondaryMetric: '14.2K Units Volume Saved',
      executionLatency: '1.4s',
      successRate: '98.6%',
      totalRuns: 34,
      lastRunTime: '18 mins ago'
    },
    stages: [
      {
        id: 'st-01-1',
        name: 'POS Stream & Scraper Listener',
        agentOrModel: 'Snowflake CDC + Web Scraping Agent',
        role: 'Data Ingestion',
        description: 'Ingests hourly Home Depot scanner sales and competitor circular promos to flag sudden volume dips or deep competitor discounts.',
        iconName: 'Database',
        estimatedLatency: '240ms',
        inputs: ['Home Depot EDI 852 Feeds', 'Competitor Ad Circulars', 'Snowflake POS Scanner'],
        outputs: ['Discounter Threat Object', 'Price Index Delta (Milwaukee -18%)']
      },
      {
        id: 'st-01-2',
        name: 'Cross-Price Elasticity Engine',
        agentOrModel: 'Cross-Elasticity ML Model (R² 0.91)',
        role: 'Threat Evaluation',
        description: 'Calculates cross-price demand transference from DeWalt 20V SKUs to Milwaukee M18 promotional battery bundles.',
        iconName: 'Activity',
        estimatedLatency: '320ms',
        inputs: ['Price Gap Delta', 'Brand Loyalty Matrix', 'Historical Cross-Elasticity (-1.42)'],
        outputs: ['Projected Volume Bleed (-8,200 Units)', 'Share Loss Risk (800 bps)']
      },
      {
        id: 'st-01-3',
        name: 'Preemptive Promo Simulator',
        agentOrModel: 'Gemini 2.5 Flash Strategy Agent',
        role: 'Scenario Optimization',
        description: 'Simulates 8 defensive promotion permutations (TPR depth vs bundle co-op) to identify optimal counter-measure maximizing Net MAC.',
        iconName: 'Sparkles',
        estimatedLatency: '410ms',
        inputs: ['Trade Spend Budget ($2.4M Cap)', 'Baseline POS Volume', 'Retailer Co-op Terms'],
        outputs: ['Optimal Counter-Tactic: 15% TPR W44', 'Projected Net ROI (3.8x)']
      },
      {
        id: 'st-01-4',
        name: 'Guardrail & Margin Validator',
        agentOrModel: 'SBD Commercial Policy Engine',
        role: 'Risk Governance',
        description: 'Validates simulated promotion against strict financial guardrails: minimum 42% Net-Net margin and zero cross-brand cannibalization.',
        iconName: 'ShieldCheck',
        estimatedLatency: '120ms',
        inputs: ['Net-Net Margin Floor (42.0%)', 'Authorized GTN Allowance', 'PCR Policy'],
        outputs: ['Guardrail Pass: 43.1% Margin Achieved', 'Zero Policy Exceptions']
      },
      {
        id: 'st-01-5',
        name: 'ERP Payload & CRM Dispatcher',
        agentOrModel: 'SAP Vistex Integration Agent',
        role: 'Execution & Dispatch',
        description: 'Formats certified promotion terms into formal SAP condition records and stages workflow for Commercial Director approval.',
        iconName: 'Send',
        estimatedLatency: '190ms',
        inputs: ['Validated Counter-Tactic', 'Retailer Account Code', 'Timing Window'],
        outputs: ['SAP Condition Contract Staged', 'One-Click Commercial Payload Created']
      }
    ],
    simulationData: {
      triggerEvent: 'Milwaukee Tool launched unannounced 20% TPR Circular promotion on M18 Fuel Combo Kit at Home Depot (Week 44).',
      dataSummary: 'Historical scan data indicates cross-elasticity with DeWalt 20V XR is -1.42. Predicted volume bleed without action is 8,200 units ($1.15M retail GSV).',
      aiAnalysis: 'Recommends launching a preemptive 15% TPR digital circular event on DeWalt 20V Max (DCK280C2) paired with a $15 instant manufacturer mail-in rebate. Recovers 94% of transferred volume while keeping Gross Margin at 43.1%.',
      guardrailCheck: {
        passed: true,
        rule: 'Net-Net Margin ≥ 42.0% & Promo Depth ≤ 20%',
        message: 'Proposed 15% TPR yields 43.1% Net-Net Margin (+110 bps above minimum allowable threshold).'
      },
      decisionOutcome: 'Counter-strike calibrated: Week 44 Circular Ad + 15% TPR. Staged for one-click commercial approval.',
      erpPayload: 'SAP Vistex Transaction: COND_REC_TPR_W44 | Account: HOME_DEPOT_001 | SKU: DCK280C2 | Depth: 15% | Accrual: $184,000',
      kpis: [
        { label: 'Volume Bleed Mitigated', value: '7,700 Units', delta: '94% Protected', positive: true },
        { label: 'Net Commercial Margin', value: '43.1%', delta: '+110 bps vs Floor', positive: true },
        { label: 'Trade Spend Required', value: '$184K', delta: 'Within Budget', positive: true },
        { label: 'Promo Efficiency (ROI)', value: '3.8x', delta: '+0.6x vs Benchmark', positive: true }
      ],
      stepLogs: [
        { stepIndex: 0, stepName: 'POS Stream & Scraper Listener', agentName: 'Snowflake CDC Stream', timestamp: '10:02:14 AM', log: 'Alert detected: Home Depot EDI 852 shows Milwaukee M18 ad index shift -18% in Atlanta & Dallas metros.' },
        { stepIndex: 1, stepName: 'Cross-Price Elasticity Engine', agentName: 'Cross-Elasticity ML Model', timestamp: '10:02:15 AM', log: 'Simulating cross-price migration for 12 core SKUs. Bleed estimate: -8,200 units over 3-week promo cycle.' },
        { stepIndex: 2, stepName: 'Preemptive Promo Simulator', agentName: 'Gemini 2.5 Flash Agent', timestamp: '10:02:16 AM', log: 'Synthesized defensive scenario: 15% TPR depth W44 recovers 94% volume with optimal co-op digital placement.' },
        { stepIndex: 3, stepName: 'Guardrail & Margin Validator', agentName: 'Policy Rule Engine', timestamp: '10:02:16 AM', log: 'Evaluated against SBD Commercial Policy v4.2. Margin 43.1% is compliant with 42% threshold.' },
        { stepIndex: 4, stepName: 'ERP Payload & CRM Dispatcher', agentName: 'SAP Vistex Connector', timestamp: '10:02:17 AM', log: 'Drafted condition contract COND_REC_TPR_W44. One-click commercial push notification staged.' }
      ]
    }
  },
  {
    id: 'wf-02',
    code: 'WF-RGM-02',
    title: 'Base Price Elasticity & Tariff Pass-Through Optimizer',
    domain: 'Strategic Pricing',
    description: 'Models multi-echelon cost inflation (steel index, logistics tariffs) and optimizes base MSRP price adjustments across Craftsman and Stanley hand tools while maintaining retailer gross margin parity.',
    sbdFocus: 'Craftsman & Stanley Mechanics Hand Tools',
    retailer: 'Lowe\'s & Home Depot',
    triggerType: 'Scheduled Cycle',
    triggerSchedule: 'Monthly SBD Commercial Pricing Gate',
    autonomyLevel: 'Tier 3 · Human-in-the-Loop Review',
    status: 'Active',
    metrics: {
      primaryImpact: '+$1.85M Annual Net Margin',
      secondaryMetric: '+190 bps Gross Margin Yield',
      executionLatency: '2.1s',
      successRate: '100%',
      totalRuns: 14,
      lastRunTime: 'Yesterday at 4:30 PM'
    },
    stages: [
      {
        id: 'st-02-1',
        name: 'COGS & Tariff Ingestion Feed',
        agentOrModel: 'SAP BOM & Commodity Price Feeder',
        role: 'Cost Ingestion',
        description: 'Pulls updated raw material indices (Cold Rolled Steel +4.2%) and freight surcharges across manufacturing plants.',
        iconName: 'TrendingUp',
        estimatedLatency: '310ms',
        inputs: ['SAP Bill of Materials (BOM)', 'Commodity Index Feeds', 'Inbound Freight Tariffs'],
        outputs: ['Unit Cost Inflation (+3.8%)', 'Affected SKU Cluster (142 SKUs)']
      },
      {
        id: 'st-02-2',
        name: 'Price Elasticity S-Curve Solver',
        agentOrModel: 'Non-Linear Elasticity Model (MAPE 3.8%)',
        role: 'Elasticity Solver',
        description: 'Computes volume response curves across $0.25 price bands to pinpoint kink points where customer demand remains inelastic.',
        iconName: 'LineChart',
        estimatedLatency: '450ms',
        inputs: ['Historical Price Points ($19.99-$29.99)', 'POS Velocity Logs', 'Competitor Shelf Pricing'],
        outputs: ['Elasticity Coefficients (-0.72 avg)', 'Optimal Kink Point ($24.99)']
      },
      {
        id: 'st-02-3',
        name: 'Retailer Margin Gap Calculator',
        agentOrModel: 'Commercial Terms Optimizer',
        role: 'Partner Parity',
        description: 'Models retailer penny profit and gross margin % at candidate list prices to guarantee retailer acceptance hurdles.',
        iconName: 'Scale',
        estimatedLatency: '280ms',
        inputs: ['Retailer Target Margin (32.0%)', 'Proposed Wholesale List', 'Competitor Benchmarks'],
        outputs: ['Retailer Margin: 33.4% (+140 bps)', 'Zero Pushback Risk']
      },
      {
        id: 'st-02-4',
        name: 'Cross-Brand Index Arbitrage',
        agentOrModel: 'Brand Architecture Agent',
        role: 'Portfolio Balance',
        description: 'Ensures price tiering between Good (Stanley), Better (Craftsman), and Best (DeWalt) preserves distinct brand lanes without overlap.',
        iconName: 'Layers',
        estimatedLatency: '350ms',
        inputs: ['DeWalt Entry Anchor ($34.99)', 'Craftsman Target ($24.99)', 'Stanley Opening ($17.99)'],
        outputs: ['Lane Separation: $7.00 clean gap', 'Cross-Cannibalization < 2%']
      },
      {
        id: 'st-02-5',
        name: 'SAP PR00 Master Condition Push',
        agentOrModel: 'ERP Staging Pipeline',
        role: 'Contract Generation',
        description: 'Generates bulk PR00 pricing condition proposal with 60-day customer advance notification packets ready for key account managers.',
        iconName: 'FileCheck',
        estimatedLatency: '220ms',
        inputs: ['Approved Price Matrix', 'Effective Date (Jan 1, 2027)', 'Customer Hierarchy'],
        outputs: ['SAP Condition Batch #7741', 'Customer Sell-In Decks']
      }
    ],
    simulationData: {
      triggerEvent: 'Monthly commercial pricing trigger: Cold Rolled Steel index increased +4.2%, creating $0.38 unit margin compression on Craftsman mechanics tool sets.',
      dataSummary: 'Analyzed 142 SKUs across Craftsman and Stanley hand tools. Historical elasticity is -0.72 (mildly inelastic in mid-tier retail sets).',
      aiAnalysis: 'Recommends selective list price adjustment of +4.8% on Craftsman Mechanics Set (CMHT37338) from $23.99 to $24.99. Volume contraction will be limited to -3.1%, yielding a net positive gross profit contribution of +$1.85M annually.',
      guardrailCheck: {
        passed: true,
        rule: 'Retailer Guaranteed Margin ≥ 32.0% & Price Gap vs DeWalt ≥ $6.00',
        message: 'Lowe\'s margin is preserved at 33.4% (exceeds requirement by 140 bps). DeWalt lane clearance is maintained at $7.50.'
      },
      decisionOutcome: 'Proposed price increase (+4.8%) verified and ready for SBD Pricing Committee review.',
      erpPayload: 'SAP Pricing Condition: COND_PR00_CRAFTSMAN | SKUs: 142 | Avg Delta: +4.8% | Effective: 2027-01-01',
      kpis: [
        { label: 'Gross Margin Yield', value: '44.8%', delta: '+190 bps Lift', positive: true },
        { label: 'Annual Net Impact', value: '+$1.85M', delta: 'Incremental GSV', positive: true },
        { label: 'Unit Volume Drift', value: '-3.1%', delta: 'Well Within Guardrail', positive: true },
        { label: 'Retailer Margin', value: '33.4%', delta: '+140 bps vs Target', positive: true }
      ],
      stepLogs: [
        { stepIndex: 0, stepName: 'COGS & Tariff Ingestion Feed', agentName: 'SAP BOM Feeder', timestamp: 'Yesterday 4:28 PM', log: 'Ingested raw material index adjustments: Steel +4.2%, Freight +1.8% across 142 Mechanics SKUs.' },
        { stepIndex: 1, stepName: 'Price Elasticity S-Curve Solver', agentName: 'Elasticity Model', timestamp: 'Yesterday 4:29 PM', log: 'Solved non-linear demand curve: Kink point at $24.99 maximizes gross contribution with elasticity -0.72.' },
        { stepIndex: 2, stepName: 'Retailer Margin Gap Calculator', agentName: 'Terms Optimizer', timestamp: 'Yesterday 4:29 PM', log: 'Retailer margin verified at 33.4% ($8.35 penny profit per unit at Lowe\'s).' },
        { stepIndex: 3, stepName: 'Cross-Brand Index Arbitrage', agentName: 'Brand Architecture Agent', timestamp: 'Yesterday 4:30 PM', log: 'Confirmed clean $7.50 gap between Craftsman ($24.99) and DeWalt 20V entry ($32.49).' },
        { stepIndex: 4, stepName: 'SAP PR00 Master Condition Push', agentName: 'ERP Pipeline', timestamp: 'Yesterday 4:30 PM', log: 'Drafted SAP Condition Batch #7741. Commercial notification packet exported.' }
      ]
    }
  },
  {
    id: 'wf-03',
    code: 'WF-RGM-03',
    title: 'Demand Transference & SKU Rationalization Orchestrator',
    domain: 'Assortment & Portfolio',
    description: 'Models consumer walk-rates and substitution behavior upon delisting tail SKUs, orchestrating planogram shelf expansion for high-margin hero items while retaining >84% category volume.',
    sbdFocus: 'DeWalt Corded vs Cordless Power Tools (Bay 14)',
    retailer: 'The Home Depot',
    triggerType: 'Scheduled Cycle',
    triggerSchedule: 'Quarterly Planogram Reset Review',
    autonomyLevel: 'Tier 4 · One-Click Commercial Sign-Off',
    status: 'Active',
    metrics: {
      primaryImpact: '+$1.42M Shelf Gross Profit',
      secondaryMetric: '84.6% Volume Retained',
      executionLatency: '1.8s',
      successRate: '97.2%',
      totalRuns: 22,
      lastRunTime: '3 days ago'
    },
    stages: [
      {
        id: 'st-03-1',
        name: 'Planogram Velocity & Space Feeder',
        agentOrModel: 'Home Depot POS & Space Scanner',
        role: 'Space Analytics',
        description: 'Analyzes linear feet allocation, sales density per square foot, and slow-moving tail SKUs across retail bays.',
        iconName: 'LayoutGrid',
        estimatedLatency: '290ms',
        inputs: ['Bay 14 Planogram CAD', 'SKU Sales per Facing', 'Inventory Turn Rates'],
        outputs: ['Tail SKU Candidates (12 corded SKUs)', 'Underperforming Shelf Footage (4.5 ft)']
      },
      {
        id: 'st-03-2',
        name: 'Demand Transference Matrix Engine',
        agentOrModel: 'Transference ML Model (R² 0.94)',
        role: 'Transference Simulation',
        description: 'Calculates consumer substitution probabilities based on battery platform loyalty, price point, and tool form factor.',
        iconName: 'GitFork',
        estimatedLatency: '420ms',
        inputs: ['Transference Heatmap', 'Delist Candidate List', 'Customer Purchase History'],
        outputs: ['Transference Ratio (84.6% to DeWalt 20V Cordless)', 'Walk-Away Rate (15.4%)']
      },
      {
        id: 'st-03-3',
        name: 'Hero Facing Re-allocation Solver',
        agentOrModel: 'Shelf Space Optimization Solver',
        role: 'Facing Optimization',
        description: 'Re-allocates reclaimed linear footage to top-performing DeWalt 20V MAX Atomic and PowerStack SKUs to maximize facing productivity.',
        iconName: 'Maximize2',
        estimatedLatency: '310ms',
        inputs: ['Reclaimed Footage (4.5 ft)', 'Hero SKU Velocity', 'Out-of-Stock Probability'],
        outputs: ['Facing Expansion Plan (+2 facings on DCD791)', 'OOS Reduction (-35%)']
      },
      {
        id: 'st-03-4',
        name: 'Cannibalization & Margin Verifier',
        agentOrModel: 'SBD Assortment Risk Engine',
        role: 'Financial Verification',
        description: 'Verifies that net basket margin rises after factoring in the higher margin percentage of cordless brushless tools.',
        iconName: 'ShieldAlert',
        estimatedLatency: '180ms',
        inputs: ['Corded Margin (36.2%)', 'Cordless Brushless Margin (45.8%)', 'Transferred Units'],
        outputs: ['Net Dollar Margin Delta (+$1.42M)', 'Retailer Sales Density (+18.2%)']
      },
      {
        id: 'st-03-5',
        name: 'Blue Yonder Planogram Exporter',
        agentOrModel: 'Category Captain Export Agent',
        role: 'Retailer Sync',
        description: 'Exports industry-standard JDA/Blue Yonder planogram interchange files for immediate merchant review and store rollout.',
        iconName: 'FolderArchive',
        estimatedLatency: '240ms',
        inputs: ['Final Facing Matrix', 'POG Dimension Bounds', 'UPC Master Data'],
        outputs: ['Blue Yonder PSA File Ready', 'Merchant Presentation Deck']
      }
    ],
    simulationData: {
      triggerEvent: 'Quarterly assortment review for Home Depot Bay 14: Delisting 6 legacy corded drill & reciprocating saw SKUs.',
      dataSummary: 'Evaluated 6 delist candidates generating $1.8M gross revenue. Substitution model predicts 84.6% of shoppers switch to DeWalt 20V cordless equivalents.',
      aiAnalysis: 'Recommends delisting DWD112 (Corded Drill) and expanding DCD791D2 (20V Brushless Compact Drill) from 2 to 4 facings. Net shelf profit increases by +$1.42M due to a +960 bps margin premium on cordless brushless tools.',
      guardrailCheck: {
        passed: true,
        rule: 'Transference Retention ≥ 80.0% & Category Dollar Growth > 0',
        message: '84.6% demand transference exceeds the 80% threshold. Net dollar profit expands by +14.2%.'
      },
      decisionOutcome: 'Assortment reset blueprint finalized. Blue Yonder POG ready for Category Merchant sign-off.',
      erpPayload: 'POG_RESET_BAY14: Delist 6 Corded SKUs | Expand 4 Cordless Hero SKUs | Net GSV Lift: +$1.42M',
      kpis: [
        { label: 'Demand Transference', value: '84.6%', delta: '+4.6% vs Hurdle', positive: true },
        { label: 'Shelf Gross Profit', value: '+$1.42M', delta: '+14.2% Growth', positive: true },
        { label: 'Facings Optimized', value: '18 Facings', delta: '4.5 ft Saved', positive: true },
        { label: 'OOS Risk Reduction', value: '-35%', delta: 'Higher Stock Buffer', positive: true }
      ],
      stepLogs: [
        { stepIndex: 0, stepName: 'Planogram Velocity & Space Feeder', agentName: 'Space Scanner', timestamp: '3 days ago 11:15 AM', log: 'Audited Bay 14: 6 corded SKUs identified in bottom 10th percentile of inventory turns.' },
        { stepIndex: 1, stepName: 'Demand Transference Matrix Engine', agentName: 'Transference Model', timestamp: '3 days ago 11:16 AM', log: 'Computed walk-rate: 84.6% of shoppers substitute to DeWalt 20V platform; 15.4% walk-away.' },
        { stepIndex: 2, stepName: 'Hero Facing Re-allocation Solver', agentName: 'Space Solver', timestamp: '3 days ago 11:17 AM', log: 'Re-assigned 4.5 linear feet to DCD791D2 and DCF887B cordless brushless hero SKUs.' },
        { stepIndex: 3, stepName: 'Cannibalization & Margin Verifier', agentName: 'Assortment Risk Engine', timestamp: '3 days ago 11:18 AM', log: 'Margin rate rises from 36.2% to 45.8% on transferred volume, expanding net profit +$1.42M.' },
        { stepIndex: 4, stepName: 'Blue Yonder Planogram Exporter', agentName: 'Export Agent', timestamp: '3 days ago 11:18 AM', log: 'Generated Blue Yonder PSA planogram file. Merchant proposal ready for review.' }
      ]
    }
  },
  {
    id: 'wf-04',
    code: 'WF-RGM-04',
    title: 'Real-Time Commercial Guardrail & GTN Spend Surveillance',
    domain: 'Governance & Risk',
    description: 'Surveils real-time promotional deductions, PCR claims, and unauthorized off-invoice allowances across Snowflake and SAP, triggering autonomous tripwire alerts and commercial remediation playbooks.',
    sbdFocus: 'Enterprise-Wide Commercial Accounts (HD, Lowe\'s, Menards)',
    retailer: 'All Key Accounts',
    triggerType: 'Continuous Stream',
    triggerSchedule: '24/7 Live Snowflake Stream & Event Broker',
    autonomyLevel: 'Tier 5 · Autonomous with Tripwires',
    status: 'Running',
    metrics: {
      primaryImpact: '$890K Spend Bleed Prevented',
      secondaryMetric: '14 Active Guardrails Enforced',
      executionLatency: '0.8s',
      successRate: '99.4%',
      totalRuns: 184,
      lastRunTime: 'Active now'
    },
    stages: [
      {
        id: 'st-04-1',
        name: 'Trade Ledger Stream Ingestor',
        agentOrModel: 'Snowflake Live Event Stream',
        role: 'Stream Ingestion',
        description: 'Continuously monitors EDI 812 deductions, credit memos, and PCR promotional claims as they clear the financial ledger.',
        iconName: 'Activity',
        estimatedLatency: '110ms',
        inputs: ['SAP Ledger Feed', 'EDI 812 Deductions', 'Snowflake CDC Stream'],
        outputs: ['Daily Accrual Velocity', 'Promotional Runaway Variance']
      },
      {
        id: 'st-04-2',
        name: 'Tripwire & Cap Breach Detector',
        agentOrModel: 'Threshold Rule Engine (14 Guardrails)',
        role: 'Breach Detection',
        description: 'Compares real-time promotional claims against authorized quarterly co-op caps and contracted discount maximums.',
        iconName: 'AlertOctagon',
        estimatedLatency: '150ms',
        inputs: ['Quarterly Trade Budget ($4.2M)', 'Approved PCR Contracts', 'Claimed Dollars'],
        outputs: ['Active Breach Alert (PCR-2026-0835)', 'Severity Level: High']
      },
      {
        id: 'st-04-3',
        name: 'SHAP Variance Root-Cause Explainer',
        agentOrModel: 'SHAP Decomposition Explainer',
        role: 'Root Cause Diagnostics',
        description: 'Decomposes spend overrun into underlying drivers: unauthorized scan-down depth vs over-accrued digital co-op allowances.',
        iconName: 'SlidersHorizontal',
        estimatedLatency: '240ms',
        inputs: ['Claim Line Items', 'Contract Terms', 'SHAP Driver Matrix'],
        outputs: ['Root Driver: Unauthorized scan-down (78% contribution)']
      },
      {
        id: 'st-04-4',
        name: 'Commercial Policy Enforcement Agent',
        agentOrModel: 'Autonomous Policy Enforcer',
        role: 'Policy Control',
        description: 'Freezes pending unauthorized deduction lines in SAP and compiles proof-of-performance discrepancy dossier.',
        iconName: 'ShieldCheck',
        estimatedLatency: '180ms',
        inputs: ['Breach Dossier', 'SAP Ledger Hold API', 'Commercial Audit Rules'],
        outputs: ['Hold Placed on $148K Discrepancy', 'Commercial Triage Report']
      },
      {
        id: 'st-04-5',
        name: 'Executive Webhook & Alert Dispatch',
        agentOrModel: 'Commercial Remediation Webhook',
        role: 'Notification & Audit',
        description: 'Dispatches instant interactive alert card to Commercial Vice President and Account Lead with pre-computed recovery options.',
        iconName: 'Bell',
        estimatedLatency: '120ms',
        inputs: ['Remediation Options', 'VP Commercial Webhook', 'Audit Log'],
        outputs: ['Teams/Slack Notification Sent', 'Compliance Ticket Created']
      }
    ],
    simulationData: {
      triggerEvent: 'Snowflake event stream detected GTN spend runway breach: Account HOME_DEPOT_001 claimed $148,000 in unapproved circular scan-down allowances.',
      dataSummary: 'Quarterly co-op cap for Q4 was $4.2M. Total claims reached $4.348M (+3.5% over contractual ceiling).',
      aiAnalysis: 'Root-cause analysis identifies that promotional event PCR-2026-0835 applied a 20% discount instead of the approved 15% rate on DeWalt 20V battery 2-packs. Automated tripwire placed a temporary hold on the deduction and notified Account Management.',
      guardrailCheck: {
        passed: false,
        rule: 'GTN Spend ≤ Contractual Co-op Cap & Max Depth ≤ 15%',
        message: 'Breach detected: Depth reached 20% on battery SKU DW20V2PK, exceeding authorized 15% limit by 500 bps.'
      },
      decisionOutcome: 'Autonomous hold placed on $148K deduction line. Remediation package submitted to Channel Lead.',
      erpPayload: 'SAP Hold Trigger: HOLD_DEDUCT_812 | Account: HOME_DEPOT | Ref: PCR-2026-0835 | Amount: $148,000 | Reason: DEPTH_OVERRUN',
      kpis: [
        { label: 'Spend Bleed Prevented', value: '$148,000', delta: 'Instant Hold', positive: true },
        { label: 'Time to Detection', value: '11 mins', delta: 'Real-Time Stream', positive: true },
        { label: 'Active Guardrails', value: '14 Active', delta: '100% Operational', positive: true },
        { label: 'False Positive Rate', value: '0.0%', delta: 'Verified by SHAP', positive: true }
      ],
      stepLogs: [
        { stepIndex: 0, stepName: 'Trade Ledger Stream Ingestor', agentName: 'Snowflake CDC', timestamp: 'Active Stream', log: 'Streaming EDI 812 deductions: Ingested batch 2026-Q4-089 ($3.2M claims processed).' },
        { stepIndex: 1, stepName: 'Tripwire & Cap Breach Detector', agentName: 'Rule Engine', timestamp: '14 mins ago', log: 'BREACH FLAGGED: PCR-2026-0835 pushed Home Depot trade spend $148K above Q4 cap.' },
        { stepIndex: 2, stepName: 'SHAP Variance Root-Cause Explainer', agentName: 'SHAP Explainer', timestamp: '13 mins ago', log: 'SHAP decomposition: 78% of variance caused by depth overrun (20% applied vs 15% approved).' },
        { stepIndex: 3, stepName: 'Commercial Policy Enforcement Agent', agentName: 'Policy Enforcer', timestamp: '12 mins ago', log: 'Executed API hold on SAP claim line 0x489F. Commercial reconciliation ticket staged.' },
        { stepIndex: 4, stepName: 'Executive Webhook & Alert Dispatch', agentName: 'Alert Webhook', timestamp: '11 mins ago', log: 'Dispatched High Priority Alert to Commercial Director and Trade Governance lead.' }
      ]
    }
  },
  {
    id: 'wf-05',
    code: 'WF-RGM-05',
    title: 'Customer Joint Business Planning (JBP) Win-Win Frontier',
    domain: 'Customer JBP',
    description: 'Generates Pareto-optimal trade term packages and growth rebate tiers for annual Joint Business Planning meetings, optimizing mutual profit frontier between SBD MAC and retailer gross margin.',
    sbdFocus: 'Home Depot Enterprise Master Commercial Agreement',
    retailer: 'The Home Depot',
    triggerType: 'On-Demand',
    triggerSchedule: 'Annual / Semi-Annual JBP Negotiation Cycle',
    autonomyLevel: 'Tier 2 · Co-Pilot Simulation',
    status: 'Standby',
    metrics: {
      primaryImpact: '+$3.4M Joint Value Created',
      secondaryMetric: '+110 bps SBD Margin Lift',
      executionLatency: '2.4s',
      successRate: '100%',
      totalRuns: 16,
      lastRunTime: '5 days ago'
    },
    stages: [
      {
        id: 'st-05-1',
        name: 'Contractual Term & Growth Rebate Ingestion',
        agentOrModel: 'Master Service Agreement Parser',
        role: 'Contract Analysis',
        description: 'Extracts historical rebate thresholds, co-op marketing commitments, payment terms, and early-pay discounts.',
        iconName: 'FileText',
        estimatedLatency: '340ms',
        inputs: ['Historical MSA Contract', 'Tiered Volume Rebate Table', 'Payment Terms (2% 30 Net 60)'],
        outputs: ['Current Term Baseline', 'SBD Net Contribution (41.8%)', 'Retailer Margin (31.2%)']
      },
      {
        id: 'st-05-2',
        name: 'Pareto Win-Win Frontier Solver',
        agentOrModel: 'Game-Theoretic Frontier Optimizer',
        role: 'Frontier Modeling',
        description: 'Simulates 500 term combinations (growth incentives vs marketing funds) to plot the non-dominated Pareto efficiency frontier.',
        iconName: 'TrendingUp',
        estimatedLatency: '520ms',
        inputs: ['Volume Stretch Targets (+6%)', 'Co-op Advertising ROI', 'Rebate Elasticity'],
        outputs: ['Pareto Frontier Curve', 'Win-Win Equilibrium Point (+110 bps SBD / +80 bps Retailer)']
      },
      {
        id: 'st-05-3',
        name: 'Tiered Volume Hurdle Calibrator',
        agentOrModel: 'Volume Stretch Agent',
        role: 'Incentive Design',
        description: 'Designs realistic tiered growth hurdles that unlock incremental rebate dollars only upon achieving stretch volume targets.',
        iconName: 'Target',
        estimatedLatency: '310ms',
        inputs: ['Baseline Volume (2.1M Units)', 'Stretch Goal (2.28M Units)', 'Rebate Rate (+1.25%)'],
        outputs: ['Tier 1 Hurdle (100%)', 'Tier 2 Hurdle (105%)', 'Tier 3 Hurdle (108%)']
      },
      {
        id: 'st-05-4',
        name: 'Pay-for-Performance Validator',
        agentOrModel: 'Proof-of-Performance Auditor',
        role: 'Risk Audit',
        description: 'Binds marketing co-op funds to verified prime end-cap placement, digital app search prominence, and circular ads.',
        iconName: 'CheckCircle2',
        estimatedLatency: '210ms',
        inputs: ['Store Count (1,950 doors)', 'End-Cap Compliance History', 'Audit Clauses'],
        outputs: ['Enforceable Performance Clauses', 'Proof-of-Execution SLA']
      },
      {
        id: 'st-05-5',
        name: 'Executive Term Sheet Assembler',
        agentOrModel: 'Commercial Proposal Synthesizer',
        role: 'Presentation Staging',
        description: 'Compiles certified executive negotiation term sheet, win-win waterfall charts, and briefing deck for C-Suite meeting.',
        iconName: 'Briefcase',
        estimatedLatency: '280ms',
        inputs: ['Optimized Terms', 'Mutual Margin Projections', 'Sign-off Matrix'],
        outputs: ['C-Suite Briefing Deck (PDF)', 'Interactive Term Simulator']
      }
    ],
    simulationData: {
      triggerEvent: 'Annual JBP negotiation cycle initiated with Home Depot merchandising leadership for FY2026-27 power tool agreement.',
      dataSummary: 'Current baseline agreement generates $142M in wholesale GSV at 41.8% SBD margin and 31.2% retailer margin.',
      aiAnalysis: 'Simulated 500 trade term configurations. Proposes shifting $1.2M from passive MDF allowances into a Tiered Growth Rebate (+1.25% rebate above 105% volume index). Drives +8.6% volume stretch, expanding SBD net margin by +110 bps and retailer margin by +80 bps.',
      guardrailCheck: {
        passed: true,
        rule: 'SBD Net Contribution Margin ≥ 42.0% & Pay-for-Performance Enforced',
        message: 'Optimized agreement delivers 42.9% SBD Net Margin (+110 bps above baseline) with strict proof-of-performance clauses.'
      },
      decisionOutcome: 'Pareto-optimal JBP term package ready for Executive Vice President review.',
      erpPayload: 'JBP_TERMS_FY26: SBD Net Margin +110 bps | HD Margin +80 bps | Stretch Volume Target: 2.28M Units',
      kpis: [
        { label: 'Joint Value Created', value: '+$3.4M', delta: 'Mutual Expansion', positive: true },
        { label: 'SBD Margin Lift', value: '+110 bps', delta: '42.9% Net Margin', positive: true },
        { label: 'Retailer Margin Lift', value: '+80 bps', delta: '32.0% Ret. Margin', positive: true },
        { label: 'Volume Stretch Target', value: '+8.6%', delta: '2.28M Units', positive: true }
      ],
      stepLogs: [
        { stepIndex: 0, stepName: 'Contractual Term & Growth Rebate Ingestion', agentName: 'MSA Parser', timestamp: '5 days ago 9:00 AM', log: 'Ingested Master Service Agreement: Baseline margin 41.8% SBD, 31.2% Home Depot.' },
        { stepIndex: 1, stepName: 'Pareto Win-Win Frontier Solver', agentName: 'Frontier Optimizer', timestamp: '5 days ago 9:01 AM', log: 'Plotted 500 term scenarios. Identified non-dominated sweet spot at +110 bps SBD / +80 bps HD.' },
        { stepIndex: 2, stepName: 'Tiered Volume Hurdle Calibrator', agentName: 'Volume Stretch Agent', timestamp: '5 days ago 9:02 AM', log: 'Designed 3-tier growth rebate: Base (0%), Stretch Tier 1 (105% vol = +0.75%), Stretch Tier 2 (108% vol = +1.25%).' },
        { stepIndex: 3, stepName: 'Pay-for-Performance Validator', agentName: 'Proof Auditor', timestamp: '5 days ago 9:03 AM', log: 'Integrated compliance covenants: Co-op funds released only upon verified end-cap execution.' },
        { stepIndex: 4, stepName: 'Executive Term Sheet Assembler', agentName: 'Proposal Synthesizer', timestamp: '5 days ago 9:04 AM', log: 'Generated C-Suite negotiation briefing deck. Ready for Executive Committee sign-off.' }
      ]
    }
  },
  {
    id: 'wf-06',
    code: 'WF-RGM-06',
    title: 'New Product Introduction (NPI) Ghost SKU Launch & Cannibalization Forecaster',
    domain: 'Assortment & Portfolio',
    description: 'Simulates market entrance for upcoming DeWalt innovations (PowerStack Battery, XR Brushless Kits), predicting incremental category growth vs internal cannibalization of existing SKUs.',
    sbdFocus: 'DeWalt 20V XR Innovation & PowerStack Battery Platform',
    retailer: 'The Home Depot & Lowe\'s',
    triggerType: 'On-Demand',
    triggerSchedule: 'Stage-Gate Product Launch Review',
    autonomyLevel: 'Tier 3 · Human-in-the-Loop Review',
    status: 'Standby',
    metrics: {
      primaryImpact: '+$8.6M Incremental Year-1 Revenue',
      secondaryMetric: '22% Cannibalization (Target < 25%)',
      executionLatency: '2.2s',
      successRate: '96.8%',
      totalRuns: 19,
      lastRunTime: '1 week ago'
    },
    stages: [
      {
        id: 'st-06-1',
        name: 'Innovation Attribute & Price Profiler',
        agentOrModel: 'NPI Spec & Vector Embedding Engine',
        role: 'Feature Extraction',
        description: 'Maps technical tool specs (brushless motor, pouch cell technology, MSRP $219) into multi-dimensional attribute space.',
        iconName: 'Boxes',
        estimatedLatency: '310ms',
        inputs: ['Product Engineering Specs', 'Proposed MSRP ($219.00)', 'Target Pro Contractor Segment'],
        outputs: ['Synthetic Ghost SKU Vector', 'Nearest Neighbor Archetypes']
      },
      {
        id: 'st-06-2',
        name: 'Cannibalization & Cross-Elasticity Predictor',
        agentOrModel: 'Cross-Elasticity ML Model',
        role: 'Volume Forecasting',
        description: 'Simulates where customer demand will originate: new trade conquest vs internal substitution from existing DeWalt SKUs.',
        iconName: 'GitMerge',
        estimatedLatency: '480ms',
        inputs: ['Ghost SKU Vector', 'Category Elasticity Matrix', 'Competitor Conquest Rates'],
        outputs: ['Internal Cannibalization (22.1%)', 'Competitor Conquest (48.4%)', 'New Category Expansion (29.5%)']
      },
      {
        id: 'st-06-3',
        name: 'Pipeline Fill & Working Capital Modeler',
        agentOrModel: 'Supply Chain Sync Agent',
        role: 'Inventory Sizing',
        description: 'Calculates initial store pipeline fill across 1,950 doors and required factory safety stock for first 180 days.',
        iconName: 'Truck',
        estimatedLatency: '290ms',
        inputs: ['Store Count (1,950 doors)', 'Initial Facing Count (2 facings)', 'Forecasted Sell-Through Velocity'],
        outputs: ['Initial Pipe Fill (42,000 Units)', 'Factory Build Plan (110,000 Units H1)']
      },
      {
        id: 'st-06-4',
        name: 'Retailer Sell-In Pitch Synthesizer',
        agentOrModel: 'Retailer Pitch Architect',
        role: 'Commercial Presentation',
        description: 'Builds retailer-specific commercial justification deck proving category dollar expansion and premium margin yield.',
        iconName: 'Presentation',
        estimatedLatency: '350ms',
        inputs: ['Projected POS Velocity', 'Retailer Penny Profit (+$28.40/unit)', 'Assortment Fit'],
        outputs: ['Merchant Sell-In One-Pager', 'Financial Justification Deck']
      },
      {
        id: 'st-06-5',
        name: 'ERP Staging & UPC Master Creator',
        agentOrModel: 'SAP Master Data Staging Pipeline',
        role: 'System Staging',
        description: 'Stages provisional material master records and pricing conditions in SAP ready for formal launch release.',
        iconName: 'Database',
        estimatedLatency: '190ms',
        inputs: ['Provisional Material ID', 'MSRP & Wholesale Price', 'Packaging Dimensions'],
        outputs: ['Staged SAP Material Master', 'GDSN Barcode Ready']
      }
    ],
    simulationData: {
      triggerEvent: 'NPI Stage-Gate Launch simulation for DeWalt 20V PowerStack 5.0Ah Compact Battery Innovation (MSRP $219.00).',
      dataSummary: 'Nearest neighbor analysis matches product against premium lithium-ion launches over past 5 years. Projected Year-1 category demand is 78,000 units.',
      aiAnalysis: 'Simulation demonstrates high incremental expansion: 48.4% of volume conquers market share from Milwaukee M18 and Makita 18V; 29.5% expands category spending; internal cannibalization of DeWalt legacy batteries is kept to 22.1% (well below the 25% risk ceiling).',
      guardrailCheck: {
        passed: true,
        rule: 'Internal Cannibalization ≤ 25.0% & Gross Margin Rate ≥ 45.0%',
        message: 'Cannibalization is 22.1% (within safety guardrail). Gross margin rate reaches 48.2% (+320 bps above portfolio average).'
      },
      decisionOutcome: 'Innovation commercial launch plan verified. Store pipeline fill approved for H1 2027 rollout.',
      erpPayload: 'NPI_STAGING: DeWalt PowerStack 5.0Ah | MSRP: $219.00 | Pipe Fill: 42K Units | Year-1 GSV: $8.6M',
      kpis: [
        { label: 'Year-1 Net Revenue', value: '+$8.6M', delta: 'Incremental Lift', positive: true },
        { label: 'Competitor Conquest', value: '48.4%', delta: 'Share Taken from Milwaukee', positive: true },
        { label: 'Internal Cannibalization', value: '22.1%', delta: 'Under 25% Guardrail', positive: true },
        { label: 'Innovation Gross Margin', value: '48.2%', delta: '+320 bps vs Avg', positive: true }
      ],
      stepLogs: [
        { stepIndex: 0, stepName: 'Innovation Attribute & Price Profiler', agentName: 'NPI Embedding Engine', timestamp: '1 week ago 2:10 PM', log: 'Vectorized product attributes: Pouch cell battery, 5.0Ah capacity, $219 MSRP mapped to premium pro tier.' },
        { stepIndex: 1, stepName: 'Cannibalization & Cross-Elasticity Predictor', agentName: 'Elasticity Model', timestamp: '1 week ago 2:11 PM', log: 'Simulated 78,000 unit volume: 48.4% competitor conquest, 29.5% market expansion, 22.1% internal substitution.' },
        { stepIndex: 2, stepName: 'Pipeline Fill & Working Capital Modeler', agentName: 'Supply Chain Sync', timestamp: '1 week ago 2:12 PM', log: 'Computed inventory staging: 42,000 units for 1,950 Home Depot doors (2 facings per store).' },
        { stepIndex: 3, stepName: 'Retailer Sell-In Pitch Synthesizer', agentName: 'Pitch Architect', timestamp: '1 week ago 2:13 PM', log: 'Generated merchant presentation: Proves Home Depot will capture +$3.2M incremental category margin.' },
        { stepIndex: 4, stepName: 'ERP Staging & UPC Master Creator', agentName: 'SAP Staging Pipeline', timestamp: '1 week ago 2:14 PM', log: 'Staged SAP Material Master #DCBP520. Innovation package certified.' }
      ]
    }
  }
];
