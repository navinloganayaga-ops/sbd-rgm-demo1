export interface WeeklyPricingValidationPoint {
  week: string;
  actualSales: number;
  predictedSales: number;
  errorPct: number;
}

export interface HierarchyElasticityRow {
  hierarchyLevel: string;
  sampleSkus: string;
  elasticity: number;
  classification: 'Highly Elastic' | 'Elastic' | 'Moderate Elasticity' | 'Inelastic (Necessity)';
  priceSensitivity: 'High' | 'Moderate-High' | 'Moderate' | 'Low';
  shareOfVolume: string;
}

export interface DemandDriverItem {
  driver: string;
  category: string;
  contributionPct: number;
  coefficientSign: '+' | '-';
  description: string;
}

export interface PriceResponsePoint {
  priceChangePct: number;
  priceChangeLabel: string;
  priceDollar: number;
  demandIndex: number;
  predictedDemandUnits: number;
  ciLowerIndex: number;
  ciUpperIndex: number;
}

export interface ElasticityOverTimePoint {
  modelRun: string;
  refreshDate: string;
  averageElasticity: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface PricingPerformancePoint {
  modelRun: string;
  refreshDate: string;
  averageErrorPct: number;
  targetThresholdPct: number;
}

export interface CoefficientAcrossRunsRow {
  parameter: string;
  run1: string;
  run2: string;
  run3: string;
  runCurrent: string;
  changeIndicator: 'Stable' | 'Slight Shift' | 'Sensitivity Increase';
  statusType: 'stable' | 'shift' | 'increase';
}

export interface PricingInputDriftRow {
  inputFeature: string;
  baselineMean: string;
  currentScoring: string;
  psiScore: number;
  driftStatus: 'No Drift (Stable)' | 'Low Drift (Normal)' | 'Moderate Drift (Monitored)';
  category: string;
}

// ---------------------------------------------------------------------------
// 1. MODEL VALIDATION MOCK DATA (PRICING ELASTICITY MODEL)
// ---------------------------------------------------------------------------
export const pricingValidationPeriodText = "Validation Period: 2025-W27 to 2025-W52 (26-Week Holdout Backtest Window · Out-of-Time Validation)";
export const pricingAverageError = "4.1% (MAPE)";
export const pricingModelFit = "R² = 0.91 (Weighted R² = 0.93)";

export const weeklyPricingValidationData: WeeklyPricingValidationPoint[] = [
  { week: 'W27', actualSales: 482000, predictedSales: 471000, errorPct: 2.3 },
  { week: 'W28', actualSales: 465000, predictedSales: 478000, errorPct: 2.8 },
  { week: 'W29', actualSales: 512000, predictedSales: 498000, errorPct: 2.7 },
  { week: 'W30', actualSales: 545000, predictedSales: 529000, errorPct: 2.9 },
  { week: 'W31', actualSales: 538000, predictedSales: 552000, errorPct: 2.6 },
  { week: 'W32', actualSales: 498000, predictedSales: 485000, errorPct: 2.6 },
  { week: 'W33', actualSales: 472000, predictedSales: 489000, errorPct: 3.6 },
  { week: 'W34', actualSales: 521000, predictedSales: 539000, errorPct: 3.5 },
  { week: 'W35', actualSales: 605000, predictedSales: 588000, errorPct: 2.8 },
  { week: 'W36', actualSales: 652000, predictedSales: 631000, errorPct: 3.2 },
  { week: 'W37', actualSales: 564000, predictedSales: 582000, errorPct: 3.2 },
  { week: 'W38', actualSales: 515000, predictedSales: 536000, errorPct: 4.1 },
  { week: 'W39', actualSales: 498000, predictedSales: 482000, errorPct: 3.2 },
  { week: 'W40', actualSales: 552000, predictedSales: 539000, errorPct: 2.4 },
  { week: 'W41', actualSales: 589000, predictedSales: 568000, errorPct: 3.6 },
  { week: 'W42', actualSales: 638000, predictedSales: 619000, errorPct: 3.0 },
  { week: 'W43', actualSales: 671000, predictedSales: 651000, errorPct: 3.0 },
  { week: 'W44', actualSales: 735000, predictedSales: 712000, errorPct: 3.1 },
  { week: 'W45', actualSales: 840000, predictedSales: 805000, errorPct: 4.2 },
  { week: 'W46', actualSales: 968000, predictedSales: 928000, errorPct: 4.1 },
  { week: 'W47', actualSales: 1140000, predictedSales: 1092000, errorPct: 4.2 },
  { week: 'W48', actualSales: 1330000, predictedSales: 1285000, errorPct: 3.4 },
  { week: 'W49', actualSales: 1028000, predictedSales: 994000, errorPct: 3.3 },
  { week: 'W50', actualSales: 862000, predictedSales: 832000, errorPct: 3.5 },
  { week: 'W51', actualSales: 728000, predictedSales: 704000, errorPct: 3.3 },
  { week: 'W52', actualSales: 554000, predictedSales: 539000, errorPct: 2.7 }
];

// ---------------------------------------------------------------------------
// 2. AVERAGE OWN-PRICE ELASTICITY MOCK DATA (COMPACT TABLE)
// ---------------------------------------------------------------------------
export const overallScopeElasticity = -1.68;
export const overallScopeLabel = "Overall Scope Elasticity (Tools & Outdoor · Power Tools · DeWalt · The Home Depot)";

export const hierarchyElasticityRows: HierarchyElasticityRow[] = [
  {
    hierarchyLevel: 'Cordless Compact Drills',
    sampleSkus: 'DCD771C2, DCD708C2',
    elasticity: -1.24,
    classification: 'Moderate Elasticity',
    priceSensitivity: 'Moderate',
    shareOfVolume: '24.5%'
  },
  {
    hierarchyLevel: 'XR High-Performance Hammer Drills',
    sampleSkus: 'DCD805D2, DCD999B',
    elasticity: -1.82,
    classification: 'Elastic',
    priceSensitivity: 'Moderate-High',
    shareOfVolume: '18.2%'
  },
  {
    hierarchyLevel: 'Impact Drivers & Wrenches',
    sampleSkus: 'DCF885C1, DCF887B',
    elasticity: -1.45,
    classification: 'Elastic',
    priceSensitivity: 'Moderate',
    shareOfVolume: '16.8%'
  },
  {
    hierarchyLevel: 'Multi-Tool Combo Kits (2-Tool & 4-Tool)',
    sampleSkus: 'DCK280C2, DCK420D2',
    elasticity: -2.15,
    classification: 'Highly Elastic',
    priceSensitivity: 'High',
    shareOfVolume: '21.0%'
  },
  {
    hierarchyLevel: 'Circular & Miter Saws',
    sampleSkus: 'DCS391B, DWS779',
    elasticity: -1.38,
    classification: 'Moderate Elasticity',
    priceSensitivity: 'Moderate',
    shareOfVolume: '9.5%'
  },
  {
    hierarchyLevel: '20V / 60V Replacement Batteries',
    sampleSkus: 'DCB205-2, DCB606',
    elasticity: -0.72,
    classification: 'Inelastic (Necessity)',
    priceSensitivity: 'Low',
    shareOfVolume: '7.2%'
  },
  {
    hierarchyLevel: 'Tool Storage & ToughSystem Units',
    sampleSkus: 'DWST08201, DWST08203',
    elasticity: -1.10,
    classification: 'Moderate Elasticity',
    priceSensitivity: 'Moderate',
    shareOfVolume: '2.8%'
  }
];

// ---------------------------------------------------------------------------
// 3. KEY DRIVERS OF DEMAND MOCK DATA (HORIZONTAL BAR CHART / RANKED DRIVERS)
// ---------------------------------------------------------------------------
export const demandDriversData: DemandDriverItem[] = [
  {
    driver: 'Own Price (Regular Base Shelf Price)',
    category: 'Core Pricing',
    contributionPct: 32.5,
    coefficientSign: '-',
    description: 'Primary own-price elasticity response term (β_price = -1.68)'
  },
  {
    driver: 'Promotional Depth & Circular Ad Feature',
    category: 'Trade Promotion',
    contributionPct: 24.2,
    coefficientSign: '+',
    description: 'TPR discount depth %, circular front-page feature, and endcap execution'
  },
  {
    driver: 'Competitor Price Gap (vs Milwaukee M18 & Ryobi)',
    category: 'Cross-Price Index',
    contributionPct: 18.6,
    coefficientSign: '+',
    description: 'Relative price index vs rival tier-1 pro and DIY cordless lines'
  },
  {
    driver: 'Distribution & On-Shelf Availability',
    category: 'Channel Execution',
    contributionPct: 11.4,
    coefficientSign: '+',
    description: 'Store ACV distribution percentage and out-of-stock buffer rates'
  },
  {
    driver: 'Seasonality & Key Retail Calendar Events',
    category: 'Temporal Factors',
    contributionPct: 8.1,
    coefficientSign: '+',
    description: 'Father\'s Day tool events, Memorial Day promo weeks, Q4 Black Friday surge'
  },
  {
    driver: 'Macro Housing Starts & Contractor Sentiment',
    category: 'Macroeconomics',
    contributionPct: 5.2,
    coefficientSign: '+',
    description: 'Residential construction index and commercial renovation spending'
  }
];

// ---------------------------------------------------------------------------
// 4. PRICE RESPONSE CURVE MOCK DATA (HIERARCHICAL BAYESIAN S-CURVE)
// ---------------------------------------------------------------------------
export const referencePriceDollar = 159.00;
export const referenceDemandUnits = 14200;

export const priceResponseCurveData: PriceResponsePoint[] = [
  { priceChangePct: -25, priceChangeLabel: '-25%', priceDollar: 119.25, demandIndex: 154, predictedDemandUnits: 21870, ciLowerIndex: 144, ciUpperIndex: 165 },
  { priceChangePct: -20, priceChangeLabel: '-20%', priceDollar: 127.20, demandIndex: 141, predictedDemandUnits: 20020, ciLowerIndex: 133, ciUpperIndex: 149 },
  { priceChangePct: -15, priceChangeLabel: '-15%', priceDollar: 135.15, demandIndex: 129, predictedDemandUnits: 18320, ciLowerIndex: 123, ciUpperIndex: 135 },
  { priceChangePct: -10, priceChangeLabel: '-10%', priceDollar: 143.10, demandIndex: 118, predictedDemandUnits: 16760, ciLowerIndex: 114, ciUpperIndex: 123 },
  { priceChangePct: -5,  priceChangeLabel: '-5%',  priceDollar: 151.05, demandIndex: 109, predictedDemandUnits: 15480, ciLowerIndex: 105, ciUpperIndex: 112 },
  { priceChangePct: 0,   priceChangeLabel: '0% (Ref)', priceDollar: 159.00, demandIndex: 100, predictedDemandUnits: 14200, ciLowerIndex: 100, ciUpperIndex: 100 },
  { priceChangePct: 5,   priceChangeLabel: '+5%',  priceDollar: 166.95, demandIndex: 91,  predictedDemandUnits: 12920, ciLowerIndex: 87,  ciUpperIndex: 95 },
  { priceChangePct: 10,  priceChangeLabel: '+10%', priceDollar: 174.90, demandIndex: 82,  predictedDemandUnits: 11640, ciLowerIndex: 77,  ciUpperIndex: 87 },
  { priceChangePct: 15,  priceChangeLabel: '+15%', priceDollar: 182.85, demandIndex: 74,  predictedDemandUnits: 10510, ciLowerIndex: 68,  ciUpperIndex: 80 },
  { priceChangePct: 20,  priceChangeLabel: '+20%', priceDollar: 190.80, demandIndex: 66,  predictedDemandUnits: 9370,  ciLowerIndex: 60,  ciUpperIndex: 73 },
  { priceChangePct: 25,  priceChangeLabel: '+25%', priceDollar: 198.75, demandIndex: 59,  predictedDemandUnits: 8380,  ciLowerIndex: 52,  ciUpperIndex: 66 }
];

export const priceResponseMandatoryCaption = "Shows the model-estimated demand at different price points, with other modeled factors held at reference levels.";

// ---------------------------------------------------------------------------
// 5. MONITORING 1: PRICE ELASTICITY OVER TIME
// ---------------------------------------------------------------------------
export const elasticityOverTimeData: ElasticityOverTimePoint[] = [
  { modelRun: 'Run 1 (Q1 \'25)', refreshDate: '2025-01-15', averageElasticity: -1.74, confidenceLower: -1.86, confidenceUpper: -1.62 },
  { modelRun: 'Run 2 (Q2 \'25)', refreshDate: '2025-04-12', averageElasticity: -1.71, confidenceLower: -1.82, confidenceUpper: -1.60 },
  { modelRun: 'Run 3 (Q3 \'25)', refreshDate: '2025-07-20', averageElasticity: -1.69, confidenceLower: -1.79, confidenceUpper: -1.59 },
  { modelRun: 'Run 4 (Q4 \'25)', refreshDate: '2025-10-18', averageElasticity: -1.67, confidenceLower: -1.77, confidenceUpper: -1.57 },
  { modelRun: 'Run 5 (Q1 \'26)', refreshDate: '2026-01-22', averageElasticity: -1.68, confidenceLower: -1.78, confidenceUpper: -1.58 },
  { modelRun: 'Run 6 (Q2 \'26)', refreshDate: '2026-04-10', averageElasticity: -1.68, confidenceLower: -1.78, confidenceUpper: -1.58 }
];

// ---------------------------------------------------------------------------
// 6. MONITORING 2: MODEL PERFORMANCE OVER TIME
// ---------------------------------------------------------------------------
export const pricingPerformanceTrendData: PricingPerformancePoint[] = [
  { modelRun: 'Run 1 (Q1 \'25)', refreshDate: '2025-01-15', averageErrorPct: 5.4, targetThresholdPct: 6.0 },
  { modelRun: 'Run 2 (Q2 \'25)', refreshDate: '2025-04-12', averageErrorPct: 4.9, targetThresholdPct: 6.0 },
  { modelRun: 'Run 3 (Q3 \'25)', refreshDate: '2025-07-20', averageErrorPct: 4.5, targetThresholdPct: 6.0 },
  { modelRun: 'Run 4 (Q4 \'25)', refreshDate: '2025-10-18', averageErrorPct: 4.3, targetThresholdPct: 6.0 },
  { modelRun: 'Run 5 (Q1 \'26)', refreshDate: '2026-01-22', averageErrorPct: 4.1, targetThresholdPct: 6.0 },
  { modelRun: 'Run 6 (Q2 \'26)', refreshDate: '2026-04-10', averageErrorPct: 4.0, targetThresholdPct: 6.0 }
];

// ---------------------------------------------------------------------------
// 7. MONITORING 3: KEY COEFFICIENTS ACROSS RUNS (COMPARISON TABLE)
// ---------------------------------------------------------------------------
export const coefficientAcrossRunsRows: CoefficientAcrossRunsRow[] = [
  {
    parameter: 'Own-Price Elasticity Term (β_price)',
    run1: '-1.74',
    run2: '-1.71',
    run3: '-1.69',
    runCurrent: '-1.68',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Competitor Price Gap vs Milwaukee M18 (β_comp)',
    run1: '+0.38',
    run2: '+0.40',
    run3: '+0.42',
    runCurrent: '+0.43',
    changeIndicator: 'Sensitivity Increase',
    statusType: 'increase'
  },
  {
    parameter: 'Promotional Depth Lift Multiplier (β_promo)',
    run1: '+1.85',
    run2: '+1.83',
    run3: '+1.81',
    runCurrent: '+1.81',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'ACV Distribution & In-Stock Factor (β_dist)',
    run1: '+0.92',
    run2: '+0.94',
    run3: '+0.95',
    runCurrent: '+0.96',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Seasonality Peak Event Multiplier (β_season)',
    run1: '+1.42',
    run2: '+1.43',
    run3: '+1.45',
    runCurrent: '+1.44',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Macro Housing Starts Sensitivity (β_macro)',
    run1: '+0.25',
    run2: '+0.28',
    run3: '+0.31',
    runCurrent: '+0.32',
    changeIndicator: 'Slight Shift',
    statusType: 'shift'
  }
];

// ---------------------------------------------------------------------------
// 8. MONITORING 4: INPUT & FEATURE DRIFT (POPULATION STABILITY INDEX)
// ---------------------------------------------------------------------------
export const pricingInputDriftRows: PricingInputDriftRow[] = [
  {
    inputFeature: 'Shelf Base Price ($)',
    baselineMean: '$158.40',
    currentScoring: '$159.20',
    psiScore: 0.02,
    driftStatus: 'No Drift (Stable)',
    category: 'Price Point Distribution'
  },
  {
    inputFeature: 'Competitor Price Ratio (vs Milwaukee/Ryobi)',
    baselineMean: '1.04x',
    currentScoring: '1.08x',
    psiScore: 0.06,
    driftStatus: 'Low Drift (Normal)',
    category: 'Cross-Price Index'
  },
  {
    inputFeature: 'TPR Promo Depth (%)',
    baselineMean: '18.2%',
    currentScoring: '19.4%',
    psiScore: 0.04,
    driftStatus: 'No Drift (Stable)',
    category: 'Trade Promotion Level'
  },
  {
    inputFeature: 'Store ACV All-Commodity In-Stock Rate',
    baselineMean: '96.4%',
    currentScoring: '95.8%',
    psiScore: 0.03,
    driftStatus: 'No Drift (Stable)',
    category: 'Channel Execution'
  },
  {
    inputFeature: 'Macro Residential Starts Index',
    baselineMean: '102.1',
    currentScoring: '98.4',
    psiScore: 0.11,
    driftStatus: 'Moderate Drift (Monitored)',
    category: 'Macroeconomics'
  }
];

