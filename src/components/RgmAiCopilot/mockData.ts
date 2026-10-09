import { 
  ActiveScenario, 
  ChatMessage, 
  ScenarioImpactMetrics, 
  ScenarioLevers, 
  ExecutionStep, 
  PromoEventItem, 
  SkuPriceImpactItem, 
  CalendarWeekItem, 
  DelistedSkuItem, 
  GoalPillarItem,
  PromptLibraryItem
} from './types';

export const promptLibraryItems: PromptLibraryItem[] = [
  {
    id: 'lib-1',
    key: 'pricing_5pct',
    title: 'Simulate 5% Price Increase for DeWalt 20V MAX',
    pillar: 'pricing',
    pillarLabel: 'Strategic Pricing',
    userPrompt: 'Simulate 5% Price Increase for DeWalt 20V MAX at Home Depot with 90% shelf pass-through',
    description: 'Models category elasticity (-1.15), retailer pass-through, and net GSV realization vs Milwaukee M18.',
    tags: ['Snowflake Elasticity', 'COGS Offset', 'DeWalt 20V'],
    suggestedHorizon: 'Q4 2026',
    impactPreview: '+$42.4M Net GSV · +120 bps MAC Margin · -2.34% Volume Drag'
  },
  {
    id: 'lib-2',
    key: 'promo_calendar',
    title: 'Optimize Q4 Trade Promo Calendar',
    pillar: 'promo',
    pillarLabel: 'Trade Promotions',
    userPrompt: 'Optimize Q4 Trade Promo Calendar to maximize incremental lift and counter Milwaukee holiday promo',
    description: 'Solves linear programming schedule across Tooltober, Black Friday, and Cyber Week spikes.',
    tags: ['TPO Linear Solver', 'Milwaukee Defense', 'Holiday Spikes'],
    suggestedHorizon: 'Q4 Weeks 40-52',
    impactPreview: '+$68.2M Lift GSV · 3.82x Promo ROI · 42.9% Market Share Securing'
  },
  {
    id: 'lib-3',
    key: 'assortment_tail',
    title: 'Rationalize Bottom 37 Tail SKUs',
    pillar: 'assortment',
    pillarLabel: 'Assortment Planning',
    userPrompt: 'Rationalize Bottom 37 Tail SKUs with 65% demand transference to core Hero SKUs',
    description: 'Evaluates 240 active catalog SKUs against $2.0M GSV and 35.0% MAC hurdle thresholds to prune low-velocity tail.',
    tags: ['Transference Model', 'Working Capital', 'Catalog Pruning'],
    suggestedHorizon: 'FY2027 Line Review',
    impactPreview: '+$3.8M Net GSV · +140 bps MAC · -$4.2M Inventory Working Capital'
  },
  {
    id: 'lib-4',
    key: 'goal_seek_1_5b',
    title: 'Goal Seek: Reach $1.5B GSV Target',
    pillar: 'goal_seek',
    pillarLabel: 'Executive Target',
    userPrompt: 'Goal Seek: Reach $1.5B GSV Target while maintaining MAC margin above 41.5%',
    description: 'Multi-objective cross-pillar solver balancing price increases, promotional spikes, and SKU pruning.',
    tags: ['Multi-Objective Solver', 'P&L Optimization', 'Executive Target'],
    suggestedHorizon: 'FY2026 Full Year',
    impactPreview: '$1,504.2M Achieved · 42.2% MAC (+100 bps) · Balanced Allocation'
  },
  {
    id: 'lib-5',
    key: 'descriptive_roi',
    title: 'Analyze DeWalt 20V Promo ROI in Q3 Home Depot',
    pillar: 'descriptive',
    pillarLabel: 'Post-Event Descriptive',
    userPrompt: 'Analyze DeWalt 20V Promo ROI in Q3 Home Depot across scanner POS actuals',
    description: 'Deconstructs scanner POS data, baseline run-rates, promotional lift spikes, and gross-to-net deduction realization.',
    tags: ['Snowflake POS Actuals', 'Baseline Decomposition', 'Trade Settlement'],
    suggestedHorizon: 'Q3 Historical Closed',
    impactPreview: '4.26x Blended ROI · +$16.2M Incremental GSV · Low Forward-Buy'
  },
  {
    id: 'lib-6',
    key: 'pricing_inflation',
    title: 'Test Tiered +3% / +7% Inflation Pass-Through',
    pillar: 'pricing',
    pillarLabel: 'Strategic Pricing',
    userPrompt: 'Test Tiered +3% / +7% Inflation Pass-Through across Home Depot and Lowe\'s to defend raw material COGS',
    description: 'Simulates tiered price hikes to defend against battery cell and steel cost inflation with retailer acceptance buffers.',
    tags: ['Tiered Pricing', 'Raw Material COGS', 'Channel Parity'],
    suggestedHorizon: 'Q1-Q2 2027',
    impactPreview: '+$56.8M Net Realization · +140 bps MAC · 92% Channel Acceptance'
  },
  {
    id: 'lib-7',
    key: 'promo_overspend',
    title: 'Deconstruct Promo Spend Variance & Margin Leakage',
    pillar: 'promo',
    pillarLabel: 'Trade Promotions',
    userPrompt: 'Deconstruct Home Depot Drill Promo Variance & Margin Leakage for PCR-2026-0812',
    description: 'Audits discount depth vs elasticity boundary where 22% promo discount caused diminishing volume returns.',
    tags: ['PCR Audit', 'Diminishing Returns', 'Margin Floor'],
    suggestedHorizon: 'Q1 Closed Review',
    impactPreview: '-$1.8M Spend Preserved · +367 bps SGM Shield · Corrective Depth -15%'
  },
  {
    id: 'lib-8',
    key: 'assortment_npi',
    title: 'Simulate Atomic 20V NPI Replacement & Cannibalization',
    pillar: 'assortment',
    pillarLabel: 'Assortment Planning',
    userPrompt: 'Simulate Atomic 20V Compact Brushless NPI Launch Cannibalization vs Legacy 12V Bare Tools',
    description: 'Models customer trade-up propensity and shelf space allocation for new compact brushless power tools.',
    tags: ['NPI Innovation', 'Trade-Up Matrix', 'Shelf Footprint'],
    suggestedHorizon: 'Q2 2027 Launch',
    impactPreview: '+$28.4M Incremental NPI · +185 bps Mix Margin · 72% Replacement'
  }
];

export const quickPromptChips = [
  {
    id: 'descriptive_roi',
    label: 'Analyze DeWalt 20V Promo ROI in Q3 Home Depot',
    subtext: 'Descriptive event audit, lift vs baseline & ROI breakdown',
    domain: 'descriptive' as const,
  },
  {
    id: 'pricing_5pct',
    label: 'Simulate 5% Price Increase for DeWalt 20V MAX',
    subtext: 'Strategic pricing elasticity & net realization',
    domain: 'pricing' as const,
  },
  {
    id: 'promo_calendar',
    label: 'Optimize Q4 Trade Promo Calendar',
    subtext: 'TPO calendar schedule & Milwaukee counter-strike',
    domain: 'promo' as const,
  },
  {
    id: 'assortment_tail',
    label: 'Rationalize Bottom 37 Tail SKUs',
    subtext: 'Assortment cleanse & demand transference to core',
    domain: 'assortment' as const,
  },
  {
    id: 'goal_seek_1_5b',
    label: 'Goal Seek: Reach $1.5B GSV Target',
    subtext: 'Cross-pillar solver for $1.5B GSV at >=41.5% MAC',
    domain: 'goal_seek' as const,
  },
];

export const contextualExecutionSteps: Record<string, ExecutionStep[]> = {
  descriptive_roi: [
    {
      stepNumber: 1,
      title: 'Connecting to Snowflake Data Cloud (Home Depot Q3)',
      status: 'completed',
      detail: 'Ingested 13 weeks of scanner POS records across 2,200 store doors and homedepot.com',
      telemetry: 'Scan records loaded: 148,200 POS transactions | Period: W27 - W39'
    },
    {
      stepNumber: 2,
      title: 'Isolating Baseline Run-Rate from Promotional Lift Spikes',
      status: 'completed',
      detail: 'Decomposed regular unpromoted sales velocity (98.2K units/wk) vs promo event spikes',
      telemetry: 'Holt-Winters decomposition | Adjusted R²: 0.962 | Base volume: 1.22M units'
    },
    {
      stepNumber: 3,
      title: 'Auditing Trade Allowances & Co-Op Spend',
      status: 'completed',
      detail: 'Reconciled $3.8M total trade investment across TPR scan discounts, display fees, and circular co-op',
      telemetry: 'Snowflake Trade Settlement ledger verified | Margin variance: ±0.2%'
    },
    {
      stepNumber: 4,
      title: 'Synthesizing Event ROI & Price Sensitivity Audit',
      status: 'completed',
      detail: 'Calculated incremental GSV of $16.2M delivering 4.26x blended ROI with minimal forward-buy drag',
      telemetry: 'Descriptive Audit Complete | Output tables & event bridge generated'
    }
  ],
  pricing_5pct: [
    {
      stepNumber: 1,
      title: 'Loading SKU Master & Retailer Price Architecture',
      status: 'completed',
      detail: 'Loaded DeWalt 20V Cordless Family list prices, shelf MSRPs, and wholesale contracts at Home Depot',
      telemetry: 'Catalog items: 42 active SKUs | Snowflake Enterprise Catalog: NA-US-THD-2026'
    },
    {
      stepNumber: 2,
      title: 'Querying Snowflake Econometric Elasticity Engine',
      status: 'completed',
      detail: 'Estimated category price elasticity curve: -1.15; Cross-elasticity vs Milwaukee M18 evaluated at 0.38',
      telemetry: 'Log-log demand regression | Standard error: 0.041 | 95% Confidence Interval'
    },
    {
      stepNumber: 3,
      title: 'Simulating COGS Inflation & Margin Pass-Through',
      status: 'completed',
      detail: 'Modeled +5.0% price hike against +2.2% raw materials inflation with 90% shelf pass-through',
      telemetry: 'Unit velocity modeled: -2.34% volume drag (-30K units) | Price effect: +$71.0M'
    },
    {
      stepNumber: 4,
      title: 'Generating Net Realization & Waterfall P&L Bridge',
      status: 'completed',
      detail: 'Net GSV expands by +$42.4M (+2.98%) with +120 bps MAC expansion (to 42.4%)',
      telemetry: 'Realization efficiency: 59.7% | Final scenario state validated'
    }
  ],
  promo_calendar: [
    {
      stepNumber: 1,
      title: 'Ingesting Q4 12-Week Holiday Baseline Curve',
      status: 'completed',
      detail: 'Baseline unpromoted demand curve calibrated for Weeks 40-51 (Tooltober through Cyber Week)',
      telemetry: 'Baseline projection: 1.25M units | Category seasonal index: 1.34x'
    },
    {
      stepNumber: 2,
      title: 'Simulating Milwaukee M18 Competitive Threat Matrix',
      status: 'completed',
      detail: 'Detected planned Milwaukee 20% off battery bundle attack in W45 with 14.5K unit volume bleed risk',
      telemetry: 'Competitive intelligence model: Milwaukee Cross-Price Elasticity 0.42'
    },
    {
      stepNumber: 3,
      title: 'Solving Linear Programming TPO Schedule',
      status: 'completed',
      detail: 'Optimized 3 high-impact promotional spikes (W43 Tooltober, W47 Black Friday, W48 Cyber Week)',
      telemetry: 'TPO Simplex Solver converged in 84ms | Total trade spend budget: $5.4M'
    },
    {
      stepNumber: 4,
      title: 'Generating Preemptive Defensive Strike Schedule',
      status: 'completed',
      detail: 'W45 Defensive 15% TPR prevents 12.4K units of volume bleed, securing 42.9% category market share',
      telemetry: 'Net incremental GSV: +$68.2M | Blended promo ROI: 3.82x'
    }
  ],
  assortment_tail: [
    {
      stepNumber: 1,
      title: 'Filtering Portfolio Against GSV & MAC Hurdles',
      status: 'completed',
      detail: 'Audited 240 active SKUs against $2.0M minimum GSV and 35.0% MAC profitability hurdles',
      telemetry: 'Snowflake Home Depot velocity tiers | 37 SKUs identified in Delist quadrant'
    },
    {
      stepNumber: 2,
      title: 'Isolating 37 Low-Velocity Tail SKUs for Rationalization',
      status: 'completed',
      detail: 'Identified legacy 12V bare tools, slow specialty drill bits, and outdated hammer variants',
      telemetry: 'Delisted revenue: $3.4M GSV | Inventory holding cost reduction: $480K/yr'
    },
    {
      stepNumber: 3,
      title: 'Simulating Shelf Demand Transference Matrix',
      status: 'completed',
      detail: 'Transference engine projects 65% of customer demand successfully absorbed by core DeWalt 20V items',
      telemetry: 'Customer choice model: Transference capture: $2.2M GSV | Transference drag: -35%'
    },
    {
      stepNumber: 4,
      title: 'Modeling NPI DeWalt Atomic 20V Gen-2 Substitution',
      status: 'completed',
      detail: 'Introducing Atomic Compact Gen-2 adds $2.5M gross revenue with +180 bps MAC accretion',
      telemetry: 'Net assortment GSV: +$1.2M | Core shelf space utilization: +18%'
    }
  ],
  goal_seek_1_5b: [
    {
      stepNumber: 1,
      title: 'Setting Objective Function: Target GSV >= $1.500B',
      status: 'completed',
      detail: 'Target GSV: $1,500.0M | Constraint: Minimum MAC Margin >= 41.5% | Trade Spend Cap: $22M',
      telemetry: 'Baseline starting point: $1,420.0M GSV | Required gap: +$80.0M (+5.6%)'
    },
    {
      stepNumber: 2,
      title: 'Executing Multi-Variable Cross-Pillar Non-Linear Solver',
      status: 'completed',
      detail: 'Simultaneously evaluated Strategic Pricing, Trade Promotions, and Assortment Transference',
      telemetry: 'Multi-objective Pareto frontier solver | Iterations: 1,420 | Solved in 196ms'
    },
    {
      stepNumber: 3,
      title: 'Optimizing Cross-Pillar Lever Allocation',
      status: 'completed',
      detail: 'Allocated: +3.8% Base Price realization (+$48.0M), Q4 TPO promo spike (+$31.4M), 24 tail SKU pruning (+$4.8M)',
      telemetry: 'Pillar weights: Pricing 57% | Promo 37% | Assortment 6%'
    },
    {
      stepNumber: 4,
      title: 'Goal Solution Validated & Converged',
      status: 'completed',
      detail: 'Delivers $1,504.2M GSV (+5.93%) with 42.2% MAC (+100 bps) and 44.2% category share',
      telemetry: 'Convergence status: Optimal | All enterprise governance constraints satisfied'
    }
  ],
  investigate_margin_breach: [
    {
      stepNumber: 1,
      title: 'Auditing Closed Promo Records for PCR-2026-0835',
      status: 'completed',
      detail: 'Ingested POS actuals, retailer billbacks, and contract markdown ledger for Craftsman promo event',
      telemetry: 'Realized SGM: 21.8% vs 24.0% floor constraint | Total trade spend: $800K'
    },
    {
      stepNumber: 2,
      title: 'Decomposing 220 bps Margin Dilution Root Cause',
      status: 'completed',
      detail: 'Identified unbudgeted retailer markdown assistance ($180K) and week 8 stockouts as primary drag drivers',
      telemetry: 'Markdown co-op leakage: -170 bps | Stockout lost margin: -50 bps'
    },
    {
      stepNumber: 3,
      title: 'Simulating Restructured Promo Mechanics',
      status: 'completed',
      detail: 'Modeled capping scan discount at 15% (vs 20%) and shifting $90K to performance-contingent endcap allowance',
      telemetry: 'Restructured SGM projected at 25.4% (+360 bps recovery) with full volume preservation'
    },
    {
      stepNumber: 4,
      title: 'Formulating Autonomous Remediation Brief',
      status: 'completed',
      detail: 'Generated corrective terms proposal for Lowe\'s merchant joint business planning review',
      telemetry: 'Audit status: Root Cause Verified | Ready to sync to Trade Promotions Optimizer'
    }
  ],
  audit_gtn_watchdog: [
    {
      stepNumber: 1,
      title: 'Scanning 14 Active DeWalt Promotional Events',
      status: 'completed',
      detail: 'Audited gross-to-net deductions, TPR scan allowances, and coop funds against Q4 commercial budgets',
      telemetry: 'Total active trade spend: $14.2M vs $14.9M plan | Variance: -4.7% (Under budget)'
    },
    {
      stepNumber: 2,
      title: 'Evaluating GTN 5% Variance Cap Guardrail',
      status: 'completed',
      detail: 'Verified all 14 active PCR records are compliant; maximum variance observed is +2.1% on Drill Blitz',
      telemetry: 'GTN spend safety headroom: $410K before 5% threshold breach'
    },
    {
      stepNumber: 3,
      title: 'Synthesizing Trade Health Summary',
      status: 'completed',
      detail: 'Confirmed zero violations across PTG channel accounts with positive cash preservation',
      telemetry: 'Guardrail status: ACTIVE & FULLY COMPLIANT | Next scheduled check in 15 mins'
    }
  ],
  pricing_inflation: [
    {
      stepNumber: 1,
      title: 'Loading Bill of Materials & Cell Inflation Matrix',
      status: 'completed',
      detail: 'Parsed lithium-ion battery pack and motor copper cost increases totaling +4.1% blended COGS inflation',
      telemetry: 'BOM items evaluated: 48 assemblies | Snowflake Enterprise Ledger: US-TOWSON-PTG'
    },
    {
      stepNumber: 2,
      title: 'Simulating Tiered Retailer Pass-Through Curve',
      status: 'completed',
      detail: 'Modeled +3.0% on entry bare tools and +7.0% on contractor multi-tool combo kits across Home Depot and Lowe\'s',
      telemetry: 'Weighted average price increase: +4.8% | Acceptance index: 92%'
    },
    {
      stepNumber: 3,
      title: 'Calculating Gross Profit Realization',
      status: 'completed',
      detail: 'Yields +$56.8M gross realization, fully neutralizing $31.2M in raw material inflation drag',
      telemetry: 'Net MAC expansion: +140 bps | Realization efficiency: 81.4%'
    }
  ],
  promo_overspend: [
    {
      stepNumber: 1,
      title: 'Ingesting Scanner Elasticity Bounds for PCR-2026-0812',
      status: 'completed',
      detail: 'Evaluated 22% promotional discount on DeWalt 20V Drill Blitz vs theoretical elasticity optimum of 15%',
      telemetry: 'Elasticity curve shows diminishing returns above 16% discount depth'
    },
    {
      stepNumber: 2,
      title: 'Calculating Diminishing Return Margin Waste',
      status: 'completed',
      detail: 'Extra 7% discount consumed $480K in trade allowance without generating incremental scanner volume',
      telemetry: 'Incremental volume elasticity at 22%: 0.21 (highly inelastic / unprofitable)'
    },
    {
      stepNumber: 3,
      title: 'Recommending Recalibrated Q2 Promo Structure',
      status: 'completed',
      detail: 'Recommend 15% TPR with $150K circular feature; saves $330K trade spend while retaining 96% of volume',
      telemetry: 'SGM improvement: +180 bps | Recommended action ready for Trade Planner'
    }
  ],
  assortment_npi: [
    {
      stepNumber: 1,
      title: 'Calibrating Atomic 20V NPI Cannibalization Model',
      status: 'completed',
      detail: 'Modeled customer choice switching probabilities between legacy 12V Max and new Atomic 20V Compact',
      telemetry: 'NPI MSRP: $179 | Trade-up propensity index: 0.74'
    },
    {
      stepNumber: 2,
      title: 'Calculating Net Margin Accretion from Trade-Up',
      status: 'completed',
      detail: '72% of customers trade up to Atomic 20V generating +$28.4M gross revenue at 44.5% MAC (+185 bps)',
      telemetry: 'Legacy 12V bare tool phaseout: 28K units retired without net category volume loss'
    },
    {
      stepNumber: 3,
      title: 'Finalizing Assortment Transition Strategy',
      status: 'completed',
      detail: 'Net GSV expands by +$14.2M with streamlined shelf space and improved contractor satisfaction',
      telemetry: 'Assortment score: Optimal | Ready for Line Review sync'
    }
  ]
};

export const samplePromoEvents: PromoEventItem[] = [
  { week: 'W30', eventName: 'Mid-Summer DIY Special', tactic: 'TPR 10%', discountPct: 10, spendK: 480, baseUnitsK: 85, liftUnitsK: 18, gsvLiftK: 2860, roi: 5.96 },
  { week: 'W34', eventName: 'Labor Day Tool Blowout', tactic: 'Feature & Display', discountPct: 15, spendK: 1650, baseUnitsK: 98, liftUnitsK: 44, gsvLiftK: 7420, roi: 4.50 },
  { week: 'W38', eventName: 'Fall Pro Contractor Days', tactic: 'Circular Ad Banner', discountPct: 20, spendK: 1670, baseUnitsK: 92, liftUnitsK: 36, gsvLiftK: 5920, roi: 3.54 },
];

export const sampleSkuPriceImpacts: SkuPriceImpactItem[] = [
  { sku: 'DCD771C2', name: 'DeWalt 20V MAX Drill Kit', currentPrice: 159.00, proposedPrice: 166.95, elasticity: -1.15, volumeDeltaPct: -2.3, gsvImpactK: 18400, macDeltaBps: 130 },
  { sku: 'DCS391B', name: 'DeWalt 20V Circular Saw', currentPrice: 129.00, proposedPrice: 135.45, elasticity: -1.10, volumeDeltaPct: -2.1, gsvImpactK: 12600, macDeltaBps: 115 },
  { sku: 'DCF885C1', name: 'DeWalt 20V 1/4" Impact Driver', currentPrice: 149.00, proposedPrice: 156.45, elasticity: -1.20, volumeDeltaPct: -2.6, gsvImpactK: 11400, macDeltaBps: 125 },
];

export const sampleCalendarWeeks: CalendarWeekItem[] = [
  { week: 'W43', label: 'Tooltober Kickoff', tactic: 'Feature & Display', discountPct: 15, spendK: 850, competitorAction: 'No Promo', expectedUnitsK: 142 },
  { week: 'W45', label: 'Pre-Holiday Strike Defense', tactic: 'TPR Defensive 15%', discountPct: 15, spendK: 1200, competitorAction: 'Milwaukee 20% Bundle', expectedUnitsK: 138 },
  { week: 'W47', label: 'Black Friday Super Event', tactic: 'Feature & Circular', discountPct: 25, spendK: 1950, competitorAction: 'Milwaukee / Makita TPR', expectedUnitsK: 215 },
  { week: 'W48', label: 'Cyber Week Pro Digital', tactic: 'Online Banner TPR', discountPct: 20, spendK: 1400, competitorAction: 'Makita BOGO', expectedUnitsK: 185 },
];

export const sampleDelistedSkus: DelistedSkuItem[] = [
  { sku: 'DW-12V-012', name: 'DeWalt 12V Legacy Compact Bare Drill', gsvK: 840, macPct: 24.2, reason: 'GSV & MAC Below Hurdle', transferDestination: 'DCD771C2 20V MAX Core' },
  { sku: 'ST-HM-940', name: 'Stanley 16oz Fiberglass Curve Hammer', gsvK: 620, macPct: 27.5, reason: 'Low Margin Run-Rate', transferDestination: 'Stanley FatMax AntiVibe Hammer' },
  { sku: 'DW-DW-441', name: 'DeWalt 20V 3/8" Right Angle Drill V1', gsvK: 980, macPct: 26.0, reason: 'Superseded by Compact Gen-2', transferDestination: 'DeWalt Atomic 20V Compact Gen-2' },
  { sku: 'CR-SC-204', name: 'Craftsman Multi-Bit Ratchet Screwdriver', gsvK: 960, macPct: 28.4, reason: 'Tail Volume Drag', transferDestination: 'Craftsman 135-Pc Mechanics Set' },
];

export const sampleGoalPillars: GoalPillarItem[] = [
  { pillar: 'Strategic Pricing', action: '+3.8% Net Price Realization on core bare tools', gsvDeltaM: 48.0, macDeltaBps: 140, feasibility: 'Optimal' },
  { pillar: 'Trade Promotions', action: 'Shift $1.2M Co-op to W47 Black Friday & W48 Cyber Week', gsvDeltaM: 31.4, macDeltaBps: 70, feasibility: 'High' },
  { pillar: 'Assortment Transference', action: 'Delist 24 slow tail SKUs; absorb 65% demand into flagship drills', gsvDeltaM: 4.8, macDeltaBps: 180, feasibility: 'High' },
];

export const initialActiveScenario: ActiveScenario = {
  id: 'SCN-PRC-2026-01',
  title: 'DeWalt 20V MAX +5% Net Price Realization',
  domain: 'pricing',
  targetTab: 'strategic_pricing',
  lastUpdated: 'Just now',
  summaryHighlights: [
    'Net revenue realization: +$42.4M GSV (+2.98%)',
    'MAC gross margin expands +120 bps to 42.4%',
    'Elasticity response modeled at -1.15 with minimal unit bleed (-2.34%)',
  ],
  drawerDetails: {
    type: 'pricing',
    primaryKpis: [
      { label: 'Simulated GSV', value: '$1,462.4M', delta: '+$42.4M', isGood: true },
      { label: 'Trade Margin (MAC)', value: '42.4%', delta: '+120 bps', isGood: true },
      { label: 'Volume (Units)', value: '1.25M', delta: '-2.3%', isGood: false },
      { label: 'Realization Yield', value: '59.7%', delta: 'Target: >55%', isGood: true },
    ],
    subSectionTitle: 'Key Pricing Parameters',
    subSectionItems: [
      { label: 'Base Price Increase', value: '+5.0%', badge: 'Approved' },
      { label: 'COGS Inflation Offset', value: '2.2%' },
      { label: 'Price Elasticity', value: '-1.15' },
      { label: 'Retailer Pass-Through', value: '90%' },
      { label: 'Key Competitor Gap', value: '-$9.55 vs Milwaukee M18' },
    ]
  },
  levers: {
    domain: 'pricing',
    pricing: {
      participatingSkus: ['DCD771C2 Drill Kit', 'DCS391B Circular Saw', 'DCF885C1 Impact Driver'],
      priceIncreasePct: 5.0,
      cogsInflationPct: 2.2,
      elasticityIndex: -1.15,
      shelfPassThroughPct: 90,
      retailer: 'Home Depot',
    },
  },
  metrics: {
    baselineGsvM: 1420.0,
    simulatedGsvM: 1462.4,
    gsvDeltaM: 42.4,
    gsvDeltaPct: 2.98,
    baselineMacPct: 41.2,
    simulatedMacPct: 42.4,
    macBpsDelta: 120,
    baselineVolumeUnitsM: 1.28,
    simulatedVolumeUnitsM: 1.25,
    volumeUnitsDeltaPct: -2.34,
    tradeSpendM: 14.2,
    roiRatio: 4.1,
    waterfallBridge: [
      { name: 'Base GSV', value: 1420.0, fill: '#64748b' },
      { name: 'Price Realization', value: 71.0, fill: '#10b981' },
      { name: 'Elasticity Drag', value: -28.6, fill: '#ef4444' },
      { name: 'COGS Pass-thru', value: 0.0, fill: '#3b82f6' },
      { name: 'Simulated GSV', value: 1462.4, fill: '#FFC20E' },
    ],
    categoryShare: {
      sbdPct: 43.5,
      deltaBps: +30,
      competitorLeakageKUnits: 4.2,
    },
  },
};

export const sampleScenariosByPrompt: Record<
  string,
  {
    userPrompt: string;
    agentSummary: string;
    levers: ScenarioLevers;
    metrics: ScenarioImpactMetrics;
    targetTab: 'strategic_pricing' | 'trade_promotions' | 'assortment_planner';
    title: string;
    chartType: 'event_roi' | 'waterfall' | 'calendar_curve' | 'assortment_matrix' | 'goal_seek_bridge';
    promoEvents?: PromoEventItem[];
    skuPriceImpacts?: SkuPriceImpactItem[];
    calendarWeeks?: CalendarWeekItem[];
    delistedSkus?: DelistedSkuItem[];
    goalPillars?: GoalPillarItem[];
    drawerDetails: ActiveScenario['drawerDetails'];
    summaryHighlights: string[];
  }
> = {
  descriptive_roi: {
    userPrompt: 'Analyze DeWalt 20V Promo ROI in Q3 Home Depot',
    title: 'Q3 DeWalt 20V Historical Promo Effectiveness Audit',
    targetTab: 'trade_promotions',
    chartType: 'event_roi',
    agentSummary:
      'Retrospective audit of Q3 Home Depot scanner POS data confirms strong promotional efficiency for DeWalt 20V Cordless. Total trade spend of $3.8M generated **$16.2M in incremental GSV** across 3 major promotional events, yielding a **4.26x blended ROI ratio**.\n\nKey Findings:\n• **Labor Day Tool Blowout (W34)** was the highest-dollar driver, generating $7.42M incremental GSV (+44.9K lift units) at a 4.50x ROI with Feature & Display endcap placement.\n• **Mid-Summer DIY Special (W30)** delivered the highest efficiency at 5.96x ROI with a shallow 10% TPR scan discount.\n• **Fall Pro Contractor Days (W38)** suffered minor cannibalization from Milwaukee bundle cross-elasticity, returning 3.54x ROI.\n• Unpromoted baseline sales velocity held firm at **98.2K units/week** with negligible forward-buy inventory hangover.',
    summaryHighlights: [
      'Total Q3 Trade Spend: $3.8M across 3 events',
      'Incremental GSV Realized: +$16.2M (Blended ROI: 4.26x)',
      'Baseline run-rate preserved with negligible forward-buy drag',
    ],
    drawerDetails: {
      type: 'descriptive',
      primaryKpis: [
        { label: 'Incremental GSV', value: '+$16.2M', delta: '+11.6% Lift', isGood: true },
        { label: 'Total Trade Spend', value: '$3.8M', delta: 'Under Budget', isGood: true },
        { label: 'Blended Promo ROI', value: '4.26x', delta: 'Benchmark: 3.5x', isGood: true },
        { label: 'Top Event', value: 'Labor Day W34', delta: '$7.4M Lift', isGood: true },
      ],
      subSectionTitle: 'Q3 Promotional Events SBD Audit',
      subSectionItems: [
        { label: 'W30 Mid-Summer DIY', value: '5.96x ROI', badge: 'Most Efficient' },
        { label: 'W34 Labor Day Blowout', value: '4.50x ROI', badge: 'Highest GSV' },
        { label: 'W38 Fall Pro Days', value: '3.54x ROI', badge: 'Competitor Drag' },
        { label: 'Customer Channel', value: 'The Home Depot (Pro/DIY)' },
        { label: 'Forward Buy Drag', value: '<2.1% (Healthy)' },
      ]
    },
    promoEvents: samplePromoEvents,
    levers: {
      domain: 'descriptive',
      promo: {
        promoWindow: 'Q3 Historical Actuals (Weeks 27-39)',
        promoTactic: 'Feature & Display',
        discountDepthPct: 15,
        coOpBudgetM: 3.8,
        defensiveShieldActive: true,
        competitorBrand: 'Milwaukee',
      },
    },
    metrics: {
      baselineGsvM: 1395.0,
      simulatedGsvM: 1448.5,
      gsvDeltaM: 53.5,
      gsvDeltaPct: 3.84,
      baselineMacPct: 41.5,
      simulatedMacPct: 42.1,
      macBpsDelta: 60,
      baselineVolumeUnitsM: 1.22,
      simulatedVolumeUnitsM: 1.34,
      volumeUnitsDeltaPct: 9.84,
      tradeSpendM: 3.8,
      roiRatio: 4.26,
      waterfallBridge: [
        { name: 'Base GSV', value: 1395.0, fill: '#64748b' },
        { name: 'Baseline Volume', value: 34.0, fill: '#10b981' },
        { name: 'Promo Lift', value: 23.3, fill: '#3b82f6' },
        { name: 'Trade Allowances', value: -3.8, fill: '#ef4444' },
        { name: 'Delivered GSV', value: 1448.5, fill: '#FFC20E' },
      ],
      categoryShare: {
        sbdPct: 42.8,
        deltaBps: +110,
        competitorLeakageKUnits: 6.8,
      },
    },
  },
  pricing_5pct: {
    userPrompt: 'Simulate 5% Price Increase for DeWalt 20V MAX',
    title: 'DeWalt 20V MAX +5% Base Price Increase Scenario',
    targetTab: 'strategic_pricing',
    chartType: 'waterfall',
    agentSummary:
      'Econometric modeling indicates strong price realization potential across the DeWalt 20V Cordless portfolio at Home Depot. Raising list prices by **+5.0%** generates **+$42.4M in incremental GSV (+2.98%)** and expands MAC margin by **+120 bps to 42.4%**.\n\nStrategic Takeaways:\n• **Price Elasticity:** Category elasticity is inelastic at -1.15, meaning revenue gains easily outpace the modeled -2.34% volume decline (-30K units).\n• **Competitive Gap:** DeWalt 20V Drill Kit price moves from $159 to $166.95, maintaining a favorable $9.05 price gap below Milwaukee M18 ($176.00).\n• **Inflation Neutralization:** Fully offsets anticipated +2.2% COGS component inflation with 90% retailer shelf pass-through.',
    summaryHighlights: [
      'Net GSV Realization: +$42.4M (+2.98%)',
      'Trade Margin Expansion: +120 bps (to 42.4% MAC)',
      'Volume elasticity response: -2.34% (-30K units)',
    ],
    drawerDetails: {
      type: 'pricing',
      primaryKpis: [
        { label: 'Simulated GSV', value: '$1,462.4M', delta: '+$42.4M', isGood: true },
        { label: 'Trade Margin (MAC)', value: '42.4%', delta: '+120 bps', isGood: true },
        { label: 'Volume (Units)', value: '1.25M', delta: '-2.3%', isGood: false },
        { label: 'Net Yield', value: '59.7%', delta: 'Optimal', isGood: true },
      ],
      subSectionTitle: 'Strategic Pricing Levers',
      subSectionItems: [
        { label: 'Base Price Hike', value: '+5.0%', badge: 'Active' },
        { label: 'COGS Inflation Offset', value: '2.2%' },
        { label: 'Category Elasticity', value: '-1.15' },
        { label: 'Retailer Pass-Through', value: '90%' },
        { label: 'Cross-Price Index', value: '94.8% vs Milwaukee' },
      ]
    },
    skuPriceImpacts: sampleSkuPriceImpacts,
    levers: {
      domain: 'pricing',
      pricing: {
        participatingSkus: ['DCD771C2 Drill Kit', 'DCS391B Circular Saw', 'DCF885C1 Impact Driver'],
        priceIncreasePct: 5.0,
        cogsInflationPct: 2.2,
        elasticityIndex: -1.15,
        shelfPassThroughPct: 90,
        retailer: 'Home Depot',
      },
    },
    metrics: {
      baselineGsvM: 1420.0,
      simulatedGsvM: 1462.4,
      gsvDeltaM: 42.4,
      gsvDeltaPct: 2.98,
      baselineMacPct: 41.2,
      simulatedMacPct: 42.4,
      macBpsDelta: 120,
      baselineVolumeUnitsM: 1.28,
      simulatedVolumeUnitsM: 1.25,
      volumeUnitsDeltaPct: -2.34,
      tradeSpendM: 14.2,
      roiRatio: 4.1,
      waterfallBridge: [
        { name: 'Base GSV', value: 1420.0, fill: '#64748b' },
        { name: 'Price Realization', value: 71.0, fill: '#10b981' },
        { name: 'Elasticity Drag', value: -28.6, fill: '#ef4444' },
        { name: 'Mix Shift', value: 0.0, fill: '#3b82f6' },
        { name: 'Simulated GSV', value: 1462.4, fill: '#FFC20E' },
      ],
      categoryShare: {
        sbdPct: 43.5,
        deltaBps: +30,
        competitorLeakageKUnits: 4.2,
      },
    },
  },
  promo_calendar: {
    userPrompt: 'Optimize Q4 Trade Promo Calendar',
    title: 'Q4 Holiday Trade Calendar TPO Optimization',
    targetTab: 'trade_promotions',
    chartType: 'calendar_curve',
    agentSummary:
      'The Q4 TPO Optimization Solver has generated a profit-maximizing 12-week promotional calendar for Home Depot. Total trade investment of **$5.4M** delivers **+$68.2M incremental GSV (+4.84%)** and elevates SBD Category Share to **42.9% (+140 bps)**.\n\nDefensive Strike Blueprint:\n• **Preemptive Counter-Strike (W45):** Intel shows Milwaukee launching a 20% off M18 battery bundle in Week 45. Activating a 15% TPR defensive shield successfully protects **12.4K units of volume bleed**.\n• **Black Friday (W47) & Cyber Week (W48):** Deploys Feature & Display front-end endcaps at 25% depth, generating 215K units and 185K units respectively.\n• **Blended ROI:** 3.82x across the entire 12-week holiday cycle.',
    summaryHighlights: [
      'Q4 Incremental GSV: +$68.2M (+4.84% vs Base)',
      'Protected 12.4K units from Milwaukee W45 battery attack',
      'Category Market Share expanded to 42.9% (+140 bps)',
    ],
    drawerDetails: {
      type: 'promo',
      primaryKpis: [
        { label: 'Simulated GSV', value: '$1,478.2M', delta: '+$68.2M', isGood: true },
        { label: 'Trade Spend', value: '$5.4M', delta: 'Co-Op Capped', isGood: true },
        { label: 'Market Share', value: '42.9%', delta: '+140 bps', isGood: true },
        { label: 'Bleed Mitigated', value: '12.4K Units', delta: 'Protected', isGood: true },
      ],
      subSectionTitle: 'Q4 TPO Calendar Parameters',
      subSectionItems: [
        { label: 'Holiday Spikes', value: '3 Major Events (W43, W47, W48)' },
        { label: 'Discount Depth', value: '15% TPR / 25% Black Friday' },
        { label: 'Co-Op Budget', value: '$5.4M Total' },
        { label: 'Milwaukee Defense', value: 'Active W45 Strike', badge: 'Defended' },
        { label: 'Blended Promo ROI', value: '3.82x' },
      ]
    },
    calendarWeeks: sampleCalendarWeeks,
    levers: {
      domain: 'promo',
      promo: {
        promoWindow: 'Q4 12-Week Holiday Cycle (W40-W51)',
        promoTactic: 'Feature & Display',
        discountDepthPct: 15,
        coOpBudgetM: 5.4,
        defensiveShieldActive: true,
        competitorBrand: 'Milwaukee',
      },
    },
    metrics: {
      baselineGsvM: 1410.0,
      simulatedGsvM: 1478.2,
      gsvDeltaM: 68.2,
      gsvDeltaPct: 4.84,
      baselineMacPct: 40.8,
      simulatedMacPct: 41.9,
      macBpsDelta: 110,
      baselineVolumeUnitsM: 1.25,
      simulatedVolumeUnitsM: 1.38,
      volumeUnitsDeltaPct: 10.4,
      tradeSpendM: 5.4,
      roiRatio: 3.82,
      waterfallBridge: [
        { name: 'Base GSV', value: 1410.0, fill: '#64748b' },
        { name: 'Q4 Promo Lift', value: 73.6, fill: '#10b981' },
        { name: 'Trade Allowances', value: -5.4, fill: '#ef4444' },
        { name: 'Shielded Volume', value: 0.0, fill: '#3b82f6' },
        { name: 'Simulated GSV', value: 1478.2, fill: '#FFC20E' },
      ],
      categoryShare: {
        sbdPct: 42.9,
        deltaBps: +140,
        competitorLeakageKUnits: 2.1,
      },
    },
  },
  assortment_tail: {
    userPrompt: 'Rationalize Bottom 37 Tail SKUs',
    title: 'Assortment Portfolio Transference & SKU Rationalization',
    targetTab: 'assortment_planner',
    chartType: 'assortment_matrix',
    agentSummary:
      'Portfolio Transference Solver has audited 240 active SKUs against enterprise hurdle rates ($2.0M GSV and 35% MAC). Delisting **37 low-velocity tail SKUs** eliminates $3.4M in slow inventory while **65% of demand transfers** into core high-margin DeWalt 20V SKUs.\n\nTransference & NPI Mechanics:\n• **Delisted Tail:** 37 SKUs (legacy 12V tools, slow hammers, redundant accessories) delisted without shelf footprint loss.\n• **Transference Capture:** $2.2M of customer demand transfers directly into flagship DeWalt 20V drill kits and impact drivers.\n• **Innovation Substitution:** Introducing **DeWalt Atomic 20V Compact Gen-2** adds $2.5M gross revenue, yielding net portfolio GSV expansion (+ $1.2M) and **+180 bps MAC accretion (to 42.0%)**.',
    summaryHighlights: [
      '37 Tail SKUs Delisted ($3.4M slow inventory removed)',
      '65% Demand Transference retained in high-margin core',
      'MAC Margin expands +180 bps to 42.0%',
    ],
    drawerDetails: {
      type: 'assortment',
      primaryKpis: [
        { label: 'Net GSV Impact', value: '+$1.2M', delta: '+180 bps MAC', isGood: true },
        { label: 'SKUs Delisted', value: '37 Tail Items', delta: 'Cleaned', isGood: true },
        { label: 'Demand Retained', value: '65.0%', delta: 'Transferred', isGood: true },
        { label: 'NPI Gross Lift', value: '+$2.5M', delta: 'Gen-2 Atomic', isGood: true },
      ],
      subSectionTitle: 'Assortment Transference Levers',
      subSectionItems: [
        { label: 'Min GSV Hurdle', value: '$2.0M' },
        { label: 'Min MAC Hurdle', value: '35.0%' },
        { label: 'Transference Rate', value: '65% Retained', badge: 'High Capture' },
        { label: 'Delist Count', value: '37 SKUs' },
        { label: 'NPI Substitution', value: 'Atomic 20V Gen-2' },
      ]
    },
    delistedSkus: sampleDelistedSkus,
    levers: {
      domain: 'assortment',
      assortment: {
        gsvHurdleM: 2.0,
        macHurdlePct: 35.0,
        delistTargetCount: 37,
        transferenceFactorPct: 65,
        introduceNpi: true,
        npiSkuName: 'DeWalt Atomic 20V Compact Gen-2',
      },
    },
    metrics: {
      baselineGsvM: 1400.0,
      simulatedGsvM: 1401.2,
      gsvDeltaM: 1.2,
      gsvDeltaPct: 0.09,
      baselineMacPct: 40.2,
      simulatedMacPct: 42.0,
      macBpsDelta: 180,
      baselineVolumeUnitsM: 1.30,
      simulatedVolumeUnitsM: 1.28,
      volumeUnitsDeltaPct: -1.54,
      tradeSpendM: 2.1,
      roiRatio: 4.5,
      retainedTransferencePct: 65,
      waterfallBridge: [
        { name: 'Base GSV', value: 1400.0, fill: '#64748b' },
        { name: 'Delisted Tail', value: -3.4, fill: '#ef4444' },
        { name: 'Retained Transf', value: 2.2, fill: '#10b981' },
        { name: 'NPI Gen-2 Lift', value: 2.5, fill: '#3b82f6' },
        { name: 'Cannibalization', value: -0.1, fill: '#f59e0b' },
        { name: 'Net GSV Impact', value: 1401.2, fill: '#FFC20E' },
      ],
      categoryShare: {
        sbdPct: 43.1,
        deltaBps: +60,
        competitorLeakageKUnits: 1.8,
      },
    },
  },
  goal_seek_1_5b: {
    userPrompt: 'Goal Seek: Reach $1.5B GSV Target',
    title: 'Cross-Pillar Enterprise Goal Seek ($1.500B GSV Target)',
    targetTab: 'strategic_pricing',
    chartType: 'goal_seek_bridge',
    agentSummary:
      'The Multi-Variable Cross-Pillar Goal Seek Engine converged on an optimal commercial plan achieving **$1,504.2M GSV (+5.93% / +$84.2M)** while beating the minimum margin floor with **42.2% MAC (+100 bps)**.\n\nOptimal Pillar Mix Allocation:\n1. **Strategic Pricing Pillar (57% of Target):** +3.8% base price increase on core 20V bare tools delivers **+$48.0M GSV** with +140 bps margin expansion.\n2. **Trade Promotion Pillar (37% of Target):** Redirects $1.2M co-op funding to Black Friday/Cyber Week digital placements, generating **+$31.4M GSV**.\n3. **Assortment Rationalization (6% of Target):** Prunes 24 low-velocity tail SKUs and recaptures 65% demand in core DeWalt drills, contributing **+$4.8M GSV**.',
    summaryHighlights: [
      'Target Solved: $1,504.2M GSV (+5.93% vs $1,420M base)',
      'Trade Margin (MAC) preserved at 42.2% (+100 bps expansion)',
      'Cross-pillar balanced execution across Pricing, Promos & Assortment',
    ],
    drawerDetails: {
      type: 'goal_seek',
      primaryKpis: [
        { label: 'Target GSV Achieved', value: '$1,504.2M', delta: 'Goal: $1.5B', isGood: true },
        { label: 'Trade Margin (MAC)', value: '42.2%', delta: '+100 bps', isGood: true },
        { label: 'Pricing Pillar GSV', value: '+$48.0M', delta: '57% Share', isGood: true },
        { label: 'Promo Pillar GSV', value: '+$31.4M', delta: '37% Share', isGood: true },
      ],
      subSectionTitle: 'Cross-Pillar Lever Allocation',
      subSectionItems: [
        { label: 'Strategic Pricing', value: '+3.8% Base Hike', badge: '+$48.0M' },
        { label: 'Trade Promotions', value: 'Q4 Holiday Spike', badge: '+$31.4M' },
        { label: 'Assortment Transference', value: '24 Tail SKUs Pruned', badge: '+$4.8M' },
        { label: 'Trade Spend Budget', value: '$18.5M (Under Cap)' },
        { label: 'Category Share Target', value: '44.2% (+170 bps)' },
      ]
    },
    goalPillars: sampleGoalPillars,
    levers: {
      domain: 'goal_seek',
      goalSeek: {
        targetGsvM: 1500.0,
        minMacPct: 41.5,
        maxPriceIncreasePct: 4.5,
        tradeSpendCapM: 22.0,
      },
    },
    metrics: {
      baselineGsvM: 1420.0,
      simulatedGsvM: 1504.2,
      gsvDeltaM: 84.2,
      gsvDeltaPct: 5.93,
      baselineMacPct: 41.2,
      simulatedMacPct: 42.2,
      macBpsDelta: 100,
      baselineVolumeUnitsM: 1.28,
      simulatedVolumeUnitsM: 1.33,
      volumeUnitsDeltaPct: 3.91,
      tradeSpendM: 18.5,
      roiRatio: 4.55,
      waterfallBridge: [
        { name: 'Base GSV', value: 1420.0, fill: '#64748b' },
        { name: 'Pricing Pillar', value: 48.0, fill: '#10b981' },
        { name: 'Promo Pillar', value: 31.4, fill: '#3b82f6' },
        { name: 'Assortment Transf', value: 4.8, fill: '#8b5cf6' },
        { name: 'Target GSV Realized', value: 1504.2, fill: '#FFC20E' },
      ],
      categoryShare: {
        sbdPct: 44.2,
        deltaBps: +170,
        competitorLeakageKUnits: 3.1,
      },
    },
  },
  investigate_margin_breach: {
    userPrompt: 'Investigate breach on Minimum Margin Sentinel for PCR-2026-0835 (Craftsman Promo: 21.8% vs 24.0% floor)',
    title: 'Autonomous Root Cause & Remediation: PCR-2026-0835 SGM Breach',
    targetTab: 'trade_promotions',
    chartType: 'waterfall',
    agentSummary:
      'Autonomous diagnostic completed for **PCR-2026-0835 (Lowe\'s Spring Pro Craftsman Miter Saw Promo)**. SGM margin realized at **21.8%**, breaching the configured 24.0% guardrail limit by **-220 bps**.\n\nRoot Cause Decomposition:\n1. **Unbudgeted Markdown Billbacks (-170 bps):** Retailer unilaterally requested $180K in markdown assistance after promotional week 3 price matching against online competitor.\n2. **Week 8 Supply Stockouts (-50 bps):** Store-level fill rates dropped to 86%, forfeiting 4.2K high-margin accessory attachments.\n\nRecommended Autonomous Remediation:\n• **Cap Scan Allowance:** Renegotiate next cycle scan allowance at 15% depth (vs 20%).\n• **Performance-Contingent Rebate:** Shift $90K into endcap execution compliance bonus to recover +360 bps SGM margin (projected **25.4% SGM**).',
    summaryHighlights: [
      'Breach Root Cause: $180K unplanned markdown assistance & stockouts',
      'Remediation: Restructure PCR allowance to 15% scan discount',
      'Projected Recovery: +360 bps SGM to 25.4% margin compliance',
    ],
    drawerDetails: {
      type: 'promo',
      primaryKpis: [
        { label: 'Realized SGM Margin', value: '21.8%', delta: '-220 bps Breach', isGood: false },
        { label: 'Guardrail Floor', value: '24.0%', delta: 'Target Floor', isGood: true },
        { label: 'Restructured SGM', value: '25.4%', delta: '+360 bps Recouped', isGood: true },
        { label: 'Preserved Cash', value: '+$330K', delta: 'Net Trade Savings', isGood: true },
      ],
      subSectionTitle: 'Diagnostic Parameters',
      subSectionItems: [
        { label: 'Event ID', value: 'PCR-2026-0835' },
        { label: 'Account', value: 'Lowe\'s Commercial' },
        { label: 'Breach Driver', value: 'Markdown Co-op Leakage', badge: 'Critical' },
        { label: 'Corrective Action', value: 'Performance Contingent Rebate' }
      ]
    },
    levers: {
      domain: 'promo',
      promo: {
        promoWindow: 'Q2 2026 Restructured',
        promoTactic: 'TPR',
        discountDepthPct: 15.0,
        coOpBudgetM: 0.65,
        defensiveShieldActive: true,
        competitorBrand: 'Milwaukee / Rigid',
      },
    },
    metrics: {
      baselineGsvM: 18.5,
      simulatedGsvM: 19.8,
      gsvDeltaM: 1.3,
      gsvDeltaPct: 7.02,
      baselineMacPct: 21.8,
      simulatedMacPct: 25.4,
      macBpsDelta: 360,
      baselineVolumeUnitsM: 0.085,
      simulatedVolumeUnitsM: 0.088,
      volumeUnitsDeltaPct: 3.5,
      tradeSpendM: 0.65,
      roiRatio: 2.05,
      waterfallBridge: [
        { name: 'Actual SGM', value: 21.8, fill: '#ef4444' },
        { name: 'Discount Cap (+5%)', value: 2.1, fill: '#10b981' },
        { name: 'Stockout Fix', value: 0.9, fill: '#3b82f6' },
        { name: 'Co-op Reallocation', value: 0.6, fill: '#10b981' },
        { name: 'Restructured SGM', value: 25.4, fill: '#FFC20E' },
      ],
    },
  },
  audit_gtn_watchdog: {
    userPrompt: 'Audit active status and headroom for GTN Spend Cap Watchdog across Q4 promotional events',
    title: 'Autonomous Trade Spend Audit: GTN 5% Guardrail Compliance',
    targetTab: 'trade_promotions',
    chartType: 'event_roi',
    agentSummary:
      'Audit complete for **GTN Spend Cap Watchdog** across all 14 active Q4 promotional events for DeWalt (PTG) and Stanley (HTAS).\n\nKey Verification Findings:\n• **Spend Status:** Total committed trade spend is **$14.2M vs $14.9M plan** (-4.7% under budget).\n• **Safety Headroom:** All active PCR events comply with the <5% overspend ceiling. The highest individual variance is **+2.1% on Drill Blitz**, preserving **$410K** in margin headroom.\n• **Zero Violations:** No threshold breaches detected across Snowflake scanner and settlement ledgers.',
    summaryHighlights: [
      '14 Active Events Audited: Zero Violations detected',
      'Net GTN Spend: -4.7% Under Budget ($14.2M vs $14.9M Plan)',
      'Margin Safety Headroom: $410K buffer before 5% threshold',
    ],
    drawerDetails: {
      type: 'promo',
      primaryKpis: [
        { label: 'Active Events', value: '14 PCRs', delta: '100% Compliant', isGood: true },
        { label: 'Total GTN Spend', value: '$14.2M', delta: '-$700K vs Plan', isGood: true },
        { label: 'Max Event Variance', value: '+2.1%', delta: 'Ceiling: 5.0%', isGood: true },
        { label: 'Safety Headroom', value: '$410K', delta: 'Protected', isGood: true },
      ],
      subSectionTitle: 'Guardrail Verification Matrix',
      subSectionItems: [
        { label: 'Guardrail Name', value: 'GTN Spend Cap Watchdog' },
        { label: 'Monitored Metric', value: 'Gross-to-Net Spend > 5%' },
        { label: 'Frequency', value: 'Continuous Background Stream' },
        { label: 'Health Status', value: 'Optimal Compliance', badge: 'Active' },
      ]
    },
    promoEvents: samplePromoEvents,
    levers: {
      domain: 'promo',
      promo: {
        promoWindow: 'Q4 2026',
        promoTactic: 'Feature & Display',
        discountDepthPct: 15.0,
        coOpBudgetM: 14.2,
        defensiveShieldActive: true,
        competitorBrand: 'Milwaukee M18',
      },
    },
    metrics: {
      baselineGsvM: 1420.0,
      simulatedGsvM: 1442.5,
      gsvDeltaM: 22.5,
      gsvDeltaPct: 1.58,
      baselineMacPct: 41.2,
      simulatedMacPct: 41.8,
      macBpsDelta: 60,
      baselineVolumeUnitsM: 1.28,
      simulatedVolumeUnitsM: 1.30,
      volumeUnitsDeltaPct: 1.56,
      tradeSpendM: 14.2,
      roiRatio: 4.15,
      waterfallBridge: [
        { name: 'Plan Budget', value: 14.9, fill: '#64748b' },
        { name: 'Spend Realized', value: 14.2, fill: '#10b981' },
        { name: 'Variance Savings', value: 0.7, fill: '#3b82f6' },
        { name: 'Headroom Buffer', value: 0.41, fill: '#FFC20E' },
      ],
    },
  },
  pricing_inflation: {
    userPrompt: 'Test Tiered +3% / +7% Inflation Pass-Through across Home Depot and Lowe\'s to defend raw material COGS',
    title: 'Tiered Pricing Strategy: Inflation Defense Pass-Through',
    targetTab: 'strategic_pricing',
    chartType: 'waterfall',
    agentSummary:
      'Simulated tiered pricing structure to defend against **+4.1% raw material inflation** across lithium cells and copper windings.\n\nStructure Architecture:\n• **Entry Bare Tools:** +3.0% moderate price hike to protect velocity and contractor entry threshold.\n• **Contractor Kits & Heavy Duty:** +7.0% price hike where contractor willingness-to-pay remains highly price-inelastic.\n\nRealization Outcome:\n• **Gross Realization:** +$56.8M gross revenue increase, generating **+$25.6M net margin expansion** over inflation costs with **92% retail buyer acceptance**.',
    summaryHighlights: [
      '+$56.8M Gross Revenue Realization across Home Depot & Lowe\'s',
      '+140 bps MAC Expansion (42.6% simulated margin)',
      '92% Channel buyer acceptance rating based on historic elasticity',
    ],
    drawerDetails: {
      type: 'pricing',
      primaryKpis: [
        { label: 'Net GSV Impact', value: '+$56.8M', delta: '+4.0% Lift', isGood: true },
        { label: 'MAC Margin', value: '42.6%', delta: '+140 bps', isGood: true },
        { label: 'COGS Neutralized', value: '$31.2M', delta: '100% Offset', isGood: true },
        { label: 'Channel Acceptance', value: '92%', delta: 'High Confidence', isGood: true },
      ],
      subSectionTitle: 'Tiered Price Parameters',
      subSectionItems: [
        { label: 'Bare Tools Tier', value: '+3.0% ($129 -> $133)' },
        { label: 'Combo Kits Tier', value: '+7.0% ($299 -> $320)' },
        { label: 'Elasticity Coefficient', value: '-0.88 (Inelastic)' },
        { label: 'Retailer Pass-Through', value: '94% Assumed' }
      ]
    },
    skuPriceImpacts: sampleSkuPriceImpacts,
    levers: {
      domain: 'pricing',
      pricing: {
        participatingSkus: ['DCD771C2 Drill Kit', 'DCS391B Circular Saw', 'DCK280C2 2-Tool Kit'],
        priceIncreasePct: 5.2,
        cogsInflationPct: 4.1,
        elasticityIndex: -0.88,
        shelfPassThroughPct: 94,
        retailer: 'Home Depot & Lowe\'s',
      },
    },
    metrics: {
      baselineGsvM: 1420.0,
      simulatedGsvM: 1476.8,
      gsvDeltaM: 56.8,
      gsvDeltaPct: 4.0,
      baselineMacPct: 41.2,
      simulatedMacPct: 42.6,
      macBpsDelta: 140,
      baselineVolumeUnitsM: 1.28,
      simulatedVolumeUnitsM: 1.26,
      volumeUnitsDeltaPct: -1.56,
      tradeSpendM: 12.0,
      roiRatio: 4.73,
      waterfallBridge: [
        { name: 'Base GSV', value: 1420.0, fill: '#64748b' },
        { name: 'Price Hike Realization', value: 88.0, fill: '#10b981' },
        { name: 'COGS Inflation Drag', value: -31.2, fill: '#ef4444' },
        { name: 'Volume Friction', value: -0.0, fill: '#f59e0b' },
        { name: 'Simulated GSV', value: 1476.8, fill: '#FFC20E' },
      ],
    },
  },
  promo_overspend: {
    userPrompt: 'Deconstruct Home Depot Drill Promo Variance & Margin Leakage for PCR-2026-0812',
    title: 'Promo Elasticity Bound Analysis: PCR-2026-0812 Optimization',
    targetTab: 'trade_promotions',
    chartType: 'event_roi',
    agentSummary:
      'Econometric diagnostic completed for **PCR-2026-0812 (Q1 DeWalt 20V Drill Blitz at Home Depot)**.\n\nKey Variance Findings:\n• **Discount Depth Inefficiency:** Promo discount was executed at **22% vs optimal 15% elasticity boundary**. Beyond 16% discount depth, scanner volume lift plateaued while trade allowance consumed an extra $480K in deadweight loss.\n• **Corrective Recommendation:** Recalibrate upcoming Q2 promotional structure to **15% TPR with dedicated ProDesk circular feature**, preserving **$330K trade spend** while securing 96% of peak volume.',
    summaryHighlights: [
      'Elasticity Inefficiency: 22% promo depth breached diminishing returns',
      '$480K Deadweight trade spend identified in excessive price discount',
      'Recommended Q2 structure preserves $330K spend with +180 bps margin',
    ],
    drawerDetails: {
      type: 'promo',
      primaryKpis: [
        { label: 'Executed Discount', value: '22.0%', delta: 'Sub-optimal', isGood: false },
        { label: 'Optimal Discount', value: '15.0%', delta: 'Boundary', isGood: true },
        { label: 'Trade Spend Savings', value: '+$330K', delta: 'Preserved', isGood: true },
        { label: 'SGM Margin Shift', value: '+180 bps', delta: 'Recouped', isGood: true },
      ],
      subSectionTitle: 'Elasticity Decomposition',
      subSectionItems: [
        { label: 'Event ID', value: 'PCR-2026-0812' },
        { label: 'Product Family', value: 'DeWalt 20V Cordless Drills' },
        { label: 'Scanner Elasticity', value: '0.21 above 16% depth', badge: 'Inelastic' },
        { label: 'Next Cycle Action', value: '15% TPR + ProDesk Feature' }
      ]
    },
    promoEvents: samplePromoEvents,
    levers: {
      domain: 'promo',
      promo: {
        promoWindow: 'Q2 2026',
        promoTactic: 'TPR',
        discountDepthPct: 15.0,
        coOpBudgetM: 1.1,
        defensiveShieldActive: false,
        competitorBrand: 'Milwaukee',
      },
    },
    metrics: {
      baselineGsvM: 18.2,
      simulatedGsvM: 19.4,
      gsvDeltaM: 1.2,
      gsvDeltaPct: 6.59,
      baselineMacPct: 27.4,
      simulatedMacPct: 29.2,
      macBpsDelta: 180,
      baselineVolumeUnitsM: 0.125,
      simulatedVolumeUnitsM: 0.132,
      volumeUnitsDeltaPct: 5.6,
      tradeSpendM: 1.1,
      roiRatio: 2.25,
      waterfallBridge: [
        { name: 'Original Promo GSV', value: 18.2, fill: '#64748b' },
        { name: 'Restructured Depth (+7%)', value: 1.5, fill: '#10b981' },
        { name: 'Volume Rebalancing', value: -0.3, fill: '#ef4444' },
        { name: 'Optimized GSV', value: 19.4, fill: '#FFC20E' },
      ],
    },
  },
  assortment_npi: {
    userPrompt: 'Simulate Atomic 20V Compact Brushless NPI Launch Cannibalization vs Legacy 12V Bare Tools',
    title: 'NPI Launch & Cannibalization Simulation: DeWalt Atomic 20V',
    targetTab: 'assortment_planner',
    chartType: 'assortment_matrix',
    agentSummary:
      'Simulated commercial launch of **DeWalt Atomic 20V Compact Brushless Line** with customer choice switching dynamics.\n\nCannibalization & Trade-Up Synthesis:\n• **Contractor Trade-Up:** 72% of existing 12V Max bare tool purchasers upgrade to Atomic 20V Compact, driving **+$28.4M gross revenue** at **44.5% MAC (+185 bps accretion)**.\n• **Shelf Rationalization:** Replaces 28 slow-moving legacy 12V SKUs without net foot traffic loss at Home Depot tool corrals.\n• **Net Contribution:** Delivers **+$14.2M net incremental GSV** and expands contractor brand loyalty score.',
    summaryHighlights: [
      '+$28.4M Gross NPI Launch Revenue from Atomic 20V Compact',
      '72% Trade-Up Propensity from legacy 12V tool segment',
      '+185 bps Mix Margin Accretion with 28 tail SKUs retired',
    ],
    drawerDetails: {
      type: 'assortment',
      primaryKpis: [
        { label: 'NPI Gross Revenue', value: '+$28.4M', delta: 'Launch', isGood: true },
        { label: 'Net Portfolio Lift', value: '+$14.2M', delta: '+185 bps MAC', isGood: true },
        { label: 'Trade-Up Propensity', value: '72.0%', delta: 'High Conversion', isGood: true },
        { label: 'Retired Legacy SKUs', value: '28 Items', delta: 'Pruned', isGood: true },
      ],
      subSectionTitle: 'NPI Launch Levers',
      subSectionItems: [
        { label: 'NPI Line', value: 'Atomic 20V Compact Brushless' },
        { label: 'Target MSRP', value: '$179.00' },
        { label: 'Target Shelf Share', value: '3 Endcaps per door' },
        { label: 'Retirement Phaseout', value: 'Legacy 12V Bare Tools' }
      ]
    },
    delistedSkus: sampleDelistedSkus,
    levers: {
      domain: 'assortment',
      assortment: {
        gsvHurdleM: 2.5,
        macHurdlePct: 40.0,
        delistTargetCount: 28,
        transferenceFactorPct: 72,
        introduceNpi: true,
        npiSkuName: 'DeWalt Atomic 20V Compact Line',
      },
    },
    metrics: {
      baselineGsvM: 1420.0,
      simulatedGsvM: 1434.2,
      gsvDeltaM: 14.2,
      gsvDeltaPct: 1.0,
      baselineMacPct: 41.2,
      simulatedMacPct: 43.05,
      macBpsDelta: 185,
      baselineVolumeUnitsM: 1.28,
      simulatedVolumeUnitsM: 1.31,
      volumeUnitsDeltaPct: 2.34,
      tradeSpendM: 6.5,
      roiRatio: 4.37,
      waterfallBridge: [
        { name: 'Base GSV', value: 1420.0, fill: '#64748b' },
        { name: 'Atomic 20V NPI Lift', value: 28.4, fill: '#10b981' },
        { name: 'Legacy 12V Phaseout', value: -14.2, fill: '#ef4444' },
        { name: 'Simulated GSV', value: 1434.2, fill: '#FFC20E' },
      ],
    },
  },
};
