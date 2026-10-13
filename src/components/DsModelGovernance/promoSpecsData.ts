export interface WeeklyPromoValidationPoint {
  week: string;
  actualPromoSales: number;
  predictedPromoSales: number;
  errorPct: number;
  eventName?: string;
}

export interface PromoDriverItem {
  driver: string;
  category: string;
  contributionPct: number;
  coefficientSign: '+' | '-';
  description: string;
}

export interface PromoMechanicEffectivenessRow {
  mechanic: string;
  category: string;
  averageLiftPct: number;
  observedPromotions: number;
  marginImpact: 'High Margin' | 'Balanced' | 'Margin Dilutive' | 'Volume Driver';
  confidenceBand: string;
  sampleEvent: string;
}

export interface PromoResponsePoint {
  discountDepthPct: number;
  discountLabel: string;
  predictedIncrementalLiftPct: number;
  predictedVolumeUnits: number;
  predictedGrossSalesDollar: number;
  ciLowerLiftPct: number;
  ciUpperLiftPct: number;
}

export interface PromoLiftOverTimePoint {
  modelRun: string;
  refreshDate: string;
  bundleLiftPct: number;
  freeBatteryLiftPct: number;
  tprLiftPct: number;
  averageLiftPct: number;
}

export interface PromoPerformancePoint {
  modelRun: string;
  refreshDate: string;
  averageErrorPct: number;
  targetThresholdPct: number;
}

export interface PromoCoefficientAcrossRunsRow {
  parameter: string;
  run1: string;
  run2: string;
  run3: string;
  runCurrent: string;
  changeIndicator: 'Stable' | 'Slight Shift' | 'Lift Surge' | 'Sensitivity Shift';
  statusType: 'stable' | 'shift' | 'increase';
}

export interface PromoInputDriftRow {
  inputFeature: string;
  baselineMean: string;
  currentScoring: string;
  psiScore: number;
  driftStatus: 'No Drift (Stable)' | 'Low Drift (Normal)' | 'Moderate Drift (Monitored)';
  category: string;
}

// ---------------------------------------------------------------------------
// 1. MODEL VALIDATION MOCK DATA (PROMO LIFT MODEL)
// ---------------------------------------------------------------------------
export const promoValidationPeriodText = "Validation Period: 2025-W27 to 2025-W52 (26-Week Promotional Events Backtest Window · Holdout Validation)";
export const promoAverageError = "4.8% (MAPE)";
export const promoModelFit = "R² = 0.89 (Lift R² = 0.91)";

export const weeklyPromoValidationData: WeeklyPromoValidationPoint[] = [
  { week: 'W27', actualPromoSales: 245000, predictedPromoSales: 238000, errorPct: 2.9, eventName: 'Post 4th July Circular' },
  { week: 'W28', actualPromoSales: 198000, predictedPromoSales: 205000, errorPct: 3.5 },
  { week: 'W29', actualPromoSales: 212000, predictedPromoSales: 204000, errorPct: 3.8 },
  { week: 'W30', actualPromoSales: 265000, predictedPromoSales: 258000, errorPct: 2.6, eventName: 'Summer Pro Blitz' },
  { week: 'W31', actualPromoSales: 284000, predictedPromoSales: 275000, errorPct: 3.2 },
  { week: 'W32', actualPromoSales: 230000, predictedPromoSales: 239000, errorPct: 3.9 },
  { week: 'W33', actualPromoSales: 215000, predictedPromoSales: 222000, errorPct: 3.3 },
  { week: 'W34', actualPromoSales: 295000, predictedPromoSales: 284000, errorPct: 3.7, eventName: 'Labor Day Kickoff' },
  { week: 'W35', actualPromoSales: 485000, predictedPromoSales: 468000, errorPct: 3.5, eventName: 'Labor Day Major Circular' },
  { week: 'W36', actualPromoSales: 520000, predictedPromoSales: 504000, errorPct: 3.1, eventName: 'Contractor Appreciation Days' },
  { week: 'W37', actualPromoSales: 310000, predictedPromoSales: 322000, errorPct: 3.9 },
  { week: 'W38', actualPromoSales: 245000, predictedPromoSales: 254000, errorPct: 3.7 },
  { week: 'W39', actualPromoSales: 228000, predictedPromoSales: 236000, errorPct: 3.5 },
  { week: 'W40', actualPromoSales: 290000, predictedPromoSales: 281000, errorPct: 3.1, eventName: 'Fall Pro Tool Special' },
  { week: 'W41', actualPromoSales: 340000, predictedPromoSales: 328000, errorPct: 3.5 },
  { week: 'W42', actualPromoSales: 410000, predictedPromoSales: 396000, errorPct: 3.4, eventName: 'Early Black Friday Teaser' },
  { week: 'W43', actualPromoSales: 475000, predictedPromoSales: 459000, errorPct: 3.4 },
  { week: 'W44', actualPromoSales: 590000, predictedPromoSales: 568000, errorPct: 3.7, eventName: 'Holiday Gift Center Drop' },
  { week: 'W45', actualPromoSales: 780000, predictedPromoSales: 746000, errorPct: 4.4, eventName: 'Pre-Black Friday Circular' },
  { week: 'W46', actualPromoSales: 960000, predictedPromoSales: 918000, errorPct: 4.4, eventName: 'Black Friday Super Week' },
  { week: 'W47', actualPromoSales: 1240000, predictedPromoSales: 1192000, errorPct: 3.9, eventName: 'Black Friday Weekend' },
  { week: 'W48', actualPromoSales: 1510000, predictedPromoSales: 1455000, errorPct: 3.6, eventName: 'Cyber Week Pro DoorBusters' },
  { week: 'W49', actualPromoSales: 980000, predictedPromoSales: 945000, errorPct: 3.6, eventName: 'December Gift Center Week 1' },
  { week: 'W50', actualPromoSales: 760000, predictedPromoSales: 732000, errorPct: 3.7, eventName: 'December Gift Center Week 2' },
  { week: 'W51', actualPromoSales: 540000, predictedPromoSales: 522000, errorPct: 3.3, eventName: 'Last Minute Pro Gifting' },
  { week: 'W52', actualPromoSales: 320000, predictedPromoSales: 331000, errorPct: 3.4, eventName: 'Post-Christmas Clearance' }
];

// ---------------------------------------------------------------------------
// 2. KEY DRIVERS OF PROMOTION RESPONSE (HORIZONTAL BAR / RANKED DRIVERS)
// (Variables explicitly requested in screenshot: discount depth, promotion mechanic,
// base price, seasonality, distribution / availability, competitor price and retailer events)
// ---------------------------------------------------------------------------
export const promoDriversData: PromoDriverItem[] = [
  {
    driver: 'Discount Depth (% off shelf price)',
    category: 'Price & Offer',
    contributionPct: 29.4,
    coefficientSign: '+',
    description: 'Primary elasticity term for promotional discount depth (β_depth = +2.45)'
  },
  {
    driver: 'Promotion Mechanic (TPR vs BOGO vs Kit Bundle)',
    category: 'Mechanic Structure',
    contributionPct: 22.8,
    coefficientSign: '+',
    description: 'Structure of the promo: Free Bare Tool with Battery Bundle delivers highest consumer value perception'
  },
  {
    driver: 'Retailer Events & Marketing Support',
    category: 'Retailer Activation',
    contributionPct: 15.6,
    coefficientSign: '+',
    description: 'Circular front cover, Home Depot Pro Desk signage, and HomeDepot.com hero carousel placements'
  },
  {
    driver: 'Distribution & Store In-Stock Availability',
    category: 'Channel Execution',
    contributionPct: 12.1,
    coefficientSign: '+',
    description: 'Store ACV distribution percentage and front-of-store endcap stack availability'
  },
  {
    driver: 'Seasonality & Key Retailer Calendar Events',
    category: 'Temporal Factors',
    contributionPct: 9.8,
    coefficientSign: '+',
    description: 'Father\'s Day tool events, Memorial Day kickoff, and Q4 Holiday Gift Center multiplier'
  },
  {
    driver: 'Competitor Price & Promotional Intensity',
    category: 'Competitive Cross-Lift',
    contributionPct: 6.2,
    coefficientSign: '-',
    description: 'Cross-promo discounting by Milwaukee M18 and Ryobi concurrent promotions (-0.42 drag)'
  },
  {
    driver: 'Base Shelf Price Anchor',
    category: 'Reference Pricing',
    contributionPct: 4.1,
    coefficientSign: '-',
    description: 'Pre-promo regular shelf price anchor perception and premium Pro positioning sensitivity'
  }
];

// ---------------------------------------------------------------------------
// 3. PROMOTION EFFECTIVENESS BY MECHANIC (COMPACT TABLE WITH VALUE/BAR INDICATORS)
// (Requested in screenshot: Promotion mechanic; Average Lift; Observed Promotions)
// ---------------------------------------------------------------------------
export const promoMechanicEffectivenessRows: PromoMechanicEffectivenessRow[] = [
  {
    mechanic: 'Multi-Tool Kit Bundle Special Buy',
    category: 'Combo Kits',
    averageLiftPct: 114.2,
    observedPromotions: 35,
    marginImpact: 'High Margin',
    confidenceBand: '±8.4%',
    sampleEvent: 'DCK420D2 4-Tool Pro Combo @ $299 ($150 off)'
  },
  {
    mechanic: 'Buy Bare Tool + Free Battery (BOGO)',
    category: 'Free Good with Purchase',
    averageLiftPct: 92.5,
    observedPromotions: 28,
    marginImpact: 'Volume Driver',
    confidenceBand: '±6.8%',
    sampleEvent: 'Bare Tool purchase + Free DCB205 5Ah Battery'
  },
  {
    mechanic: 'TPR % Off Shelf (20%+ Discount Depth)',
    category: 'Price Reduction',
    averageLiftPct: 68.4,
    observedPromotions: 42,
    marginImpact: 'Balanced',
    confidenceBand: '±5.2%',
    sampleEvent: '25% off XR Compact Brushless Drill Line'
  },
  {
    mechanic: 'Tiered Spend & Save ($50 off $250 / $100 off $500)',
    category: 'Threshold Incentive',
    averageLiftPct: 52.1,
    observedPromotions: 18,
    marginImpact: 'High Margin',
    confidenceBand: '±7.1%',
    sampleEvent: 'Contractor Tiered Pro Event @ Pro Desk'
  },
  {
    mechanic: 'Dollar-Off Shelf Price Cut ($20 to $40 Off)',
    category: 'Price Reduction',
    averageLiftPct: 38.6,
    observedPromotions: 64,
    marginImpact: 'Balanced',
    confidenceBand: '±4.0%',
    sampleEvent: '$30 off Atomic Compact Series Drills'
  },
  {
    mechanic: 'Gift with Purchase (Accessory Pack / Bag)',
    category: 'Value-Add Premium',
    averageLiftPct: 24.8,
    observedPromotions: 15,
    marginImpact: 'High Margin',
    confidenceBand: '±3.6%',
    sampleEvent: 'Free ToughSystem Tool Bag with Kit'
  }
];

// ---------------------------------------------------------------------------
// 4. PROMOTION RESPONSE CURVE (DISCOUNT DEPTH VS INCREMENTAL LIFT CURVE)
// (Mandatory text: 'Shows the model-estimated incremental lift at different discount levels,
// with other modeled factors held at reference levels.')
// ---------------------------------------------------------------------------
export const promoResponseMandatoryCaption = "Shows the model-estimated incremental lift at different discount levels, with other modeled factors held at reference levels.";

export const promoResponseCurveData: PromoResponsePoint[] = [
  { discountDepthPct: 5,  discountLabel: '5% Off',  predictedIncrementalLiftPct: 12.4, predictedVolumeUnits: 15960, predictedGrossSalesDollar: 2420000, ciLowerLiftPct: 9.8,  ciUpperLiftPct: 15.2 },
  { discountDepthPct: 10, discountLabel: '10% Off', predictedIncrementalLiftPct: 26.8, predictedVolumeUnits: 18010, predictedGrossSalesDollar: 2580000, ciLowerLiftPct: 22.4, ciUpperLiftPct: 31.5 },
  { discountDepthPct: 15, discountLabel: '15% Off', predictedIncrementalLiftPct: 45.2, predictedVolumeUnits: 20620, predictedGrossSalesDollar: 2790000, ciLowerLiftPct: 39.5, ciUpperLiftPct: 51.0 },
  { discountDepthPct: 20, discountLabel: '20% Off', predictedIncrementalLiftPct: 71.8, predictedVolumeUnits: 24400, predictedGrossSalesDollar: 3105000, ciLowerLiftPct: 64.2, ciUpperLiftPct: 79.5 },
  { discountDepthPct: 25, discountLabel: '25% Off', predictedIncrementalLiftPct: 108.5, predictedVolumeUnits: 29610, predictedGrossSalesDollar: 3530000, ciLowerLiftPct: 98.4, ciUpperLiftPct: 119.0 },
  { discountDepthPct: 30, discountLabel: '30% Off', predictedIncrementalLiftPct: 142.0, predictedVolumeUnits: 34360, predictedGrossSalesDollar: 3820000, ciLowerLiftPct: 128.5, ciUpperLiftPct: 156.0 },
  { discountDepthPct: 35, discountLabel: '35% Off', predictedIncrementalLiftPct: 174.5, predictedVolumeUnits: 38980, predictedGrossSalesDollar: 4050000, ciLowerLiftPct: 156.0, ciUpperLiftPct: 194.0 },
  { discountDepthPct: 40, discountLabel: '40% Off', predictedIncrementalLiftPct: 198.0, predictedVolumeUnits: 42320, predictedGrossSalesDollar: 4060000, ciLowerLiftPct: 175.0, ciUpperLiftPct: 222.0 }
];

// ---------------------------------------------------------------------------
// 5. MONITORING 1: PROMOTION LIFT OVER TIME
// ---------------------------------------------------------------------------
export const promoLiftOverTimeData: PromoLiftOverTimePoint[] = [
  { modelRun: 'Run 1 (Q1 \'25)', refreshDate: '2025-01-15', bundleLiftPct: 110.5, freeBatteryLiftPct: 88.2, tprLiftPct: 65.1, averageLiftPct: 68.2 },
  { modelRun: 'Run 2 (Q2 \'25)', refreshDate: '2025-04-12', bundleLiftPct: 112.4, freeBatteryLiftPct: 90.1, tprLiftPct: 66.8, averageLiftPct: 69.8 },
  { modelRun: 'Run 3 (Q3 \'25)', refreshDate: '2025-07-20', bundleLiftPct: 113.8, freeBatteryLiftPct: 91.5, tprLiftPct: 67.5, averageLiftPct: 70.9 },
  { modelRun: 'Run 4 (Q4 \'25)', refreshDate: '2025-10-18', bundleLiftPct: 114.5, freeBatteryLiftPct: 92.0, tprLiftPct: 68.0, averageLiftPct: 71.5 },
  { modelRun: 'Run 5 (Q1 \'26)', refreshDate: '2026-01-22', bundleLiftPct: 114.0, freeBatteryLiftPct: 92.4, tprLiftPct: 68.2, averageLiftPct: 71.5 },
  { modelRun: 'Run 6 (Q2 \'26)', refreshDate: '2026-04-10', bundleLiftPct: 114.2, freeBatteryLiftPct: 92.5, tprLiftPct: 68.4, averageLiftPct: 71.7 }
];

// ---------------------------------------------------------------------------
// 6. MONITORING 2: MODEL PERFORMANCE OVER TIME
// ---------------------------------------------------------------------------
export const promoPerformanceTrendData: PromoPerformancePoint[] = [
  { modelRun: 'Run 1 (Q1 \'25)', refreshDate: '2025-01-15', averageErrorPct: 5.8, targetThresholdPct: 6.5 },
  { modelRun: 'Run 2 (Q2 \'25)', refreshDate: '2025-04-12', averageErrorPct: 5.4, targetThresholdPct: 6.5 },
  { modelRun: 'Run 3 (Q3 \'25)', refreshDate: '2025-07-20', averageErrorPct: 5.1, targetThresholdPct: 6.5 },
  { modelRun: 'Run 4 (Q4 \'25)', refreshDate: '2025-10-18', averageErrorPct: 4.9, targetThresholdPct: 6.5 },
  { modelRun: 'Run 5 (Q1 \'26)', refreshDate: '2026-01-22', averageErrorPct: 4.8, targetThresholdPct: 6.5 },
  { modelRun: 'Run 6 (Q2 \'26)', refreshDate: '2026-04-10', averageErrorPct: 4.6, targetThresholdPct: 6.5 }
];

// ---------------------------------------------------------------------------
// 7. MONITORING 3: KEY COEFFICIENTS ACROSS RUNS (COMPARISON TABLE)
// ---------------------------------------------------------------------------
export const promoCoefficientAcrossRunsRows: PromoCoefficientAcrossRunsRow[] = [
  {
    parameter: 'Discount Depth Lift Elasticity (β_depth)',
    run1: '+2.38',
    run2: '+2.41',
    run3: '+2.43',
    runCurrent: '+2.45',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Combo Kit Bundle Multiplier (β_bundle)',
    run1: '+2.10',
    run2: '+2.12',
    run3: '+2.14',
    runCurrent: '+2.14',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Free Battery BOGO Cross-Incentive (β_bogo)',
    run1: '+1.78',
    run2: '+1.82',
    run3: '+1.84',
    runCurrent: '+1.85',
    changeIndicator: 'Lift Surge',
    statusType: 'increase'
  },
  {
    parameter: 'Retailer Circular Front Cover Boost (β_circular)',
    run1: '+1.52',
    run2: '+1.54',
    run3: '+1.55',
    runCurrent: '+1.56',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Store Endcap & Floor Stack Factor (β_endcap)',
    run1: '+1.20',
    run2: '+1.21',
    run3: '+1.22',
    runCurrent: '+1.21',
    changeIndicator: 'Stable',
    statusType: 'stable'
  },
  {
    parameter: 'Competitor Promo Cross-Cannibalization (β_comp_promo)',
    run1: '-0.38',
    run2: '-0.40',
    run3: '-0.41',
    runCurrent: '-0.42',
    changeIndicator: 'Slight Shift',
    statusType: 'shift'
  }
];

// ---------------------------------------------------------------------------
// 8. MONITORING 4: INPUT & PROMO FEATURE DRIFT (POPULATION STABILITY INDEX)
// ---------------------------------------------------------------------------
export const promoInputDriftRows: PromoInputDriftRow[] = [
  {
    inputFeature: 'Average Promo Discount Depth (%)',
    baselineMean: '21.4%',
    currentScoring: '22.1%',
    psiScore: 0.03,
    driftStatus: 'No Drift (Stable)',
    category: 'Discounting Depth'
  },
  {
    inputFeature: 'Circular Feature Frequency (Pages / Mo)',
    baselineMean: '3.2',
    currentScoring: '3.4',
    psiScore: 0.04,
    driftStatus: 'No Drift (Stable)',
    category: 'Retailer Co-Op Media'
  },
  {
    inputFeature: 'Competitor Promo Overlap Rate (%)',
    baselineMean: '24.5%',
    currentScoring: '28.2%',
    psiScore: 0.09,
    driftStatus: 'Low Drift (Normal)',
    category: 'Competitive Intensity'
  },
  {
    inputFeature: 'Store Endcap ACV Placement Rate (%)',
    baselineMean: '78.2%',
    currentScoring: '79.5%',
    psiScore: 0.02,
    driftStatus: 'No Drift (Stable)',
    category: 'Store Execution'
  },
  {
    inputFeature: 'Post-Promo Dip Recovery Lag (Weeks)',
    baselineMean: '1.4 wks',
    currentScoring: '1.6 wks',
    psiScore: 0.12,
    driftStatus: 'Moderate Drift (Monitored)',
    category: 'Forward Buying Lag'
  }
];
