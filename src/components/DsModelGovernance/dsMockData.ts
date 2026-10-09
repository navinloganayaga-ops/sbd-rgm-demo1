export type ModelType = 'transference' | 'elasticity' | 'promo_lift';

export interface ModelMetadata {
  id: ModelType;
  name: string;
  shortName: string;
  powersModule: string;
  targetMetric: string;
  mape: number;
  r2: number;
  recency: string;
  driftStatus: 'Healthy / Low Drift' | 'Minimal Drift' | 'Monitoring Required';
  psiScore: number;
  sampleSize: string;
  algorithm: string;
  targetSkuContext: string;
  description: string;
}

export interface BacktestDataPoint {
  month: string;
  actual: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  residualPct: number;
}

export interface ShapDriver {
  id: string;
  feature: string;
  category: 'Competitive' | 'Product' | 'Promotion' | 'Macro / Demand' | 'Assortment' | 'Demand Group';
  shapValue: number; // Positive = drives volume up, Negative = decreases volume
  impactPercent: string;
  businessDescription: string;
  confidence: string;
}

export interface DonorSkuData {
  id: string;
  sku: string;
  name: string;
  brand: string;
  baselineVolumeUnits: number;
  listPrice: number;
  destinations: {
    targetSku: string;
    brand: string;
    type: 'Intra-Brand (DeWalt)' | 'Sister Brand (Craftsman)' | 'Competitor Direct (Milwaukee)' | 'Competitor Value (Ryobi)' | 'Walk-Away Loss';
    transferPct: number;
    volumeRetainedUnits: number;
    dollarTransfer: number;
    color: string;
  }[];
}

export interface ElasticityCurvePoint {
  price: number;
  volumeUnits: number; // in thousands
  elasticity: number;
  revenueM: number;
  grossMarginPct: number;
  lowerConfidence: number;
  upperConfidence: number;
  isKinkPoint?: boolean;
  kinkLabel?: string;
  isCurrentPrice?: boolean;
}

export interface CrossPriceRow {
  competitor: string;
  brand: string;
  keySku: string;
  currentPrice: number;
  crossElasticity: number; // e.g. +0.68
  impactPlus5Pct: {
    dewaltVolumeShiftPct: number;
    dewaltIncrementalUnits: number;
    dewaltRevenueShift: number;
  };
  impactMinus5Pct: {
    dewaltVolumeShiftPct: number;
    dewaltIncrementalUnits: number;
    dewaltRevenueShift: number;
  };
  substitutionRisk: 'High' | 'Medium' | 'Low';
}

export interface PromoDecompositionItem {
  mechanic: string;
  baseline: number;
  pureIncremental: number;
  cannibalization: number;
  forwardBuy: number;
  haloEffect: number;
  netIncremental: number;
  totalVolume: number;
  roi: string;
}

export interface PromoDecayPoint {
  week: number;
  efficiencyPct: number;
  liftMultiplier: number;
  warningZone?: boolean;
  annotation?: string;
}

export interface GovernanceRuleSettings {
  minElasticityFloor: number; // e.g. -3.0
  maxElasticityCeiling: number; // e.g. -0.5
  maxTransferenceLeakagePct: number; // e.g. 25%
  promoCannibalizationCeilingPct: number; // e.g. 18%
  confidenceClamping: '90%' | '95%' | '99%';
  fallbackHeuristic: 'Empirical Bayes Shrinkage' | 'Regional Category Roll-Up' | 'Historical SKU Median';
  lastModifiedBy: string;
  lastModifiedAt: string;
  isDefault: boolean;
}

// -------------------------------------------------------------
// MODEL METADATA
// -------------------------------------------------------------
export const modelMetadataMap: Record<ModelType, ModelMetadata> = {
  transference: {
    id: 'transference',
    name: 'Demand Transference Model',
    shortName: 'Transference ML',
    powersModule: 'Assortment Planner',
    targetMetric: 'Volume Substitution & Leakage Rate',
    mape: 4.2,
    r2: 0.912,
    recency: 'Trained 2 days ago · Snowflake Batch #2026-W41',
    driftStatus: 'Healthy / Low Drift',
    psiScore: 0.038,
    sampleSize: '1,482,900 POS Transactions (Home Depot & Lowe\'s)',
    algorithm: 'Discrete Choice Multinomial Logit + Extreme Gradient Boosting (XGBoost)',
    targetSkuContext: 'DeWalt 20V MAX & Craftsman V20 Cordless Lines',
    description: 'Predicts consumer switching propensity and brand walk-away rate when a SKU is rationalized, substituted, or out of stock.'
  },
  elasticity: {
    id: 'elasticity',
    name: 'Pricing Elasticity Model',
    shortName: 'Price Elasticity ML',
    powersModule: 'Strategic Pricing Simulator',
    targetMetric: 'Unconstrained Own & Cross Price Elasticity (ε)',
    mape: 3.6,
    r2: 0.944,
    recency: 'Trained 1 day ago · Snowflake Model Mart v3.4.1',
    driftStatus: 'Healthy / Low Drift',
    psiScore: 0.029,
    sampleSize: '2,140,500 Weekly Store-Item Observations',
    algorithm: 'Hierarchical Bayesian Mixed-Effects Log-Log Regression with Non-linear Splines',
    targetSkuContext: 'DeWalt Professional Tools vs Milwaukee / Makita / Ryobi',
    description: 'Estimates price elasticity curves with psychological barrier kink points and cross-elasticity competitive reactions.'
  },
  promo_lift: {
    id: 'promo_lift',
    name: 'Promo Lift Model',
    shortName: 'Promo Lift ML',
    powersModule: 'Trade Promotions Simulator',
    targetMetric: 'Net Incremental Volume & Cannibalization Decomposition',
    mape: 4.8,
    r2: 0.895,
    recency: 'Trained 3 days ago · Daily Circana + Snowflake ETL',
    driftStatus: 'Healthy / Low Drift',
    psiScore: 0.046,
    sampleSize: '890,200 Circular & Endcap Promotional Runs',
    algorithm: 'Causal Random Forest (CausalML) + Double Machine Learning (DML)',
    targetSkuContext: 'Father\'s Day, Pro Black Friday, and Retailer Circulars',
    description: 'Decomposes gross promotional spikes into pure incremental lift, forward buying, halo accessory purchases, and sister-SKU cannibalization.'
  }
};

// -------------------------------------------------------------
// BACKTEST DATA (12-MONTH HISTORICAL ACTUALS VS PREDICTED)
// -------------------------------------------------------------
export const backtestDataMap: Record<ModelType, BacktestDataPoint[]> = {
  transference: [
    { month: 'Oct 25', actual: 142.4, predicted: 140.1, lowerBound: 134.2, upperBound: 146.0, residualPct: -1.6 },
    { month: 'Nov 25', actual: 215.8, predicted: 212.0, lowerBound: 204.5, upperBound: 219.5, residualPct: -1.8 },
    { month: 'Dec 25', actual: 248.6, predicted: 244.2, lowerBound: 236.0, upperBound: 252.4, residualPct: -1.8 },
    { month: 'Jan 26', actual: 118.2, predicted: 120.4, lowerBound: 114.1, upperBound: 126.7, residualPct: 1.9 },
    { month: 'Feb 26', actual: 124.9, predicted: 123.5, lowerBound: 118.0, upperBound: 129.0, residualPct: -1.1 },
    { month: 'Mar 26', actual: 156.3, predicted: 154.2, lowerBound: 148.2, upperBound: 160.2, residualPct: -1.3 },
    { month: 'Apr 26', actual: 184.7, predicted: 187.1, lowerBound: 180.3, upperBound: 193.9, residualPct: 1.3 },
    { month: 'May 26', actual: 198.5, predicted: 196.2, lowerBound: 189.5, upperBound: 202.9, residualPct: -1.2 },
    { month: 'Jun 26', actual: 232.1, predicted: 230.8, lowerBound: 223.1, upperBound: 238.5, residualPct: -0.6 },
    { month: 'Jul 26', actual: 172.4, predicted: 175.0, lowerBound: 168.2, upperBound: 181.8, residualPct: 1.5 },
    { month: 'Aug 26', actual: 164.0, predicted: 162.8, lowerBound: 156.4, upperBound: 169.2, residualPct: -0.7 },
    { month: 'Sep 26', actual: 178.9, predicted: 177.3, lowerBound: 170.8, upperBound: 183.8, residualPct: -0.9 }
  ],
  elasticity: [
    { month: 'Oct 25', actual: 18.2, predicted: 18.0, lowerBound: 17.2, upperBound: 18.8, residualPct: -1.1 },
    { month: 'Nov 25', actual: 27.4, predicted: 27.8, lowerBound: 26.7, upperBound: 28.9, residualPct: 1.5 },
    { month: 'Dec 25', actual: 31.9, predicted: 31.2, lowerBound: 30.1, upperBound: 32.3, residualPct: -2.2 },
    { month: 'Jan 26', actual: 15.1, predicted: 15.3, lowerBound: 14.6, upperBound: 16.0, residualPct: 1.3 },
    { month: 'Feb 26', actual: 16.0, predicted: 15.8, lowerBound: 15.1, upperBound: 16.5, residualPct: -1.3 },
    { month: 'Mar 26', actual: 20.3, predicted: 20.1, lowerBound: 19.3, upperBound: 20.9, residualPct: -1.0 },
    { month: 'Apr 26', actual: 23.8, predicted: 24.2, lowerBound: 23.3, upperBound: 25.1, residualPct: 1.7 },
    { month: 'May 26', actual: 25.6, predicted: 25.4, lowerBound: 24.5, upperBound: 26.3, residualPct: -0.8 },
    { month: 'Jun 26', actual: 29.8, predicted: 29.5, lowerBound: 28.5, upperBound: 30.5, residualPct: -1.0 },
    { month: 'Jul 26', actual: 22.1, predicted: 22.4, lowerBound: 21.6, upperBound: 23.2, residualPct: 1.4 },
    { month: 'Aug 26', actual: 21.0, predicted: 20.8, lowerBound: 20.0, upperBound: 21.6, residualPct: -1.0 },
    { month: 'Sep 26', actual: 22.9, predicted: 23.1, lowerBound: 22.2, upperBound: 24.0, residualPct: 0.9 }
  ],
  promo_lift: [
    { month: 'Oct 25', actual: 44.5, predicted: 43.2, lowerBound: 40.5, upperBound: 45.9, residualPct: -2.9 },
    { month: 'Nov 25', actual: 88.2, predicted: 86.4, lowerBound: 81.8, upperBound: 91.0, residualPct: -2.0 },
    { month: 'Dec 25', actual: 104.0, predicted: 101.5, lowerBound: 96.2, upperBound: 106.8, residualPct: -2.4 },
    { month: 'Jan 26', actual: 28.6, predicted: 29.8, lowerBound: 27.4, upperBound: 32.2, residualPct: 4.2 },
    { month: 'Feb 26', actual: 32.1, predicted: 31.4, lowerBound: 29.2, upperBound: 33.6, residualPct: -2.2 },
    { month: 'Mar 26', actual: 48.9, predicted: 47.6, lowerBound: 44.9, upperBound: 50.3, residualPct: -2.7 },
    { month: 'Apr 26', actual: 62.4, predicted: 64.1, lowerBound: 60.5, upperBound: 67.7, residualPct: 2.7 },
    { month: 'May 26', actual: 71.0, predicted: 69.5, lowerBound: 65.8, upperBound: 73.2, residualPct: -2.1 },
    { month: 'Jun 26', actual: 95.8, predicted: 94.2, lowerBound: 89.6, upperBound: 98.8, residualPct: -1.7 },
    { month: 'Jul 26', actual: 52.3, predicted: 54.0, lowerBound: 50.8, upperBound: 57.2, residualPct: 3.3 },
    { month: 'Aug 26', actual: 49.1, predicted: 48.0, lowerBound: 45.1, upperBound: 50.9, residualPct: -2.2 },
    { month: 'Sep 26', actual: 58.7, predicted: 59.9, lowerBound: 56.4, upperBound: 63.4, residualPct: 2.0 }
  ]
};

// -------------------------------------------------------------
// SHAP FEATURE IMPORTANCE DATA
// -------------------------------------------------------------
export const shapDriversMap: Record<ModelType, ShapDriver[]> = {
  transference: [
    {
      id: 'shap_t1',
      feature: 'Battery Platform Ecosystem (20V MAX)',
      category: 'Product',
      shapValue: 0.38,
      impactPercent: '+24.2%',
      businessDescription: 'Existing DeWalt cordless tool owners exhibit a 78% lock-in to the 20V battery platform, heavily penalizing shifts to external Milwaukee or Makita tools.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_t2',
      feature: 'Competitor In-Stock Availability Rate',
      category: 'Competitive',
      shapValue: -0.24,
      impactPercent: '-15.3%',
      businessDescription: 'When Milwaukee M18 has 98%+ on-shelf availability at Home Depot, transference leakage upon a DeWalt SKU stockout increases by 6.4%.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_t3',
      feature: 'Category Linear Bay Footprint Share',
      category: 'Assortment',
      shapValue: 0.21,
      impactPercent: '+13.4%',
      businessDescription: 'Every additional foot of prime eye-level bay allocation decreases category walk-away rate by 3.2% through brand visual dominance.',
      confidence: 'High (p = 0.002)'
    },
    {
      id: 'shap_t4',
      feature: 'Brand Loyalty & Contractor NPS',
      category: 'Demand Group',
      shapValue: 0.17,
      impactPercent: '+10.8%',
      businessDescription: 'Pro commercial account holders display 4.2x higher willingness to wait or substitute within DeWalt rather than cross-shop Ryobi.',
      confidence: 'High (p = 0.004)'
    },
    {
      id: 'shap_t5',
      feature: 'Price Gap to Secondary SBD Option',
      category: 'Competitive',
      shapValue: -0.15,
      impactPercent: '-9.5%',
      businessDescription: 'Price differentials exceeding $35 between premium DeWalt and Craftsman sister SKUs trigger 22% transfer to Craftsman.',
      confidence: 'Medium (p = 0.012)'
    },
    {
      id: 'shap_t6',
      feature: 'Bare Tool vs Kit Packaging Multiplier',
      category: 'Product',
      shapValue: 0.12,
      impactPercent: '+7.6%',
      businessDescription: 'Tool-only bare SKUs experience 18% higher transfer agility because buyers already own auxiliary batteries and chargers.',
      confidence: 'Medium (p = 0.018)'
    },
    {
      id: 'shap_t7',
      feature: 'Pro Desk Contractor Penetration',
      category: 'Demand Group',
      shapValue: 0.09,
      impactPercent: '+5.7%',
      businessDescription: 'Volume moving through contractor account reps has 91% retention to DeWalt portfolio via commercial rebate agreements.',
      confidence: 'Medium (p = 0.025)'
    },
    {
      id: 'shap_t8',
      feature: 'Warranty & Service Network Proximity',
      category: 'Product',
      shapValue: 0.05,
      impactPercent: '+3.2%',
      businessDescription: 'Proximity to certified SBD repair centers maintains contractor brand stickiness during substitution events.',
      confidence: 'Low (p = 0.048)'
    }
  ],
  elasticity: [
    {
      id: 'shap_e1',
      feature: 'Base Price Index vs Milwaukee M18',
      category: 'Competitive',
      shapValue: -0.44,
      impactPercent: '-28.1%',
      businessDescription: 'Primary elasticity driver: When DeWalt list price rises above parity with comparable Milwaukee M18 tools, demand volume drops precipitously.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_e2',
      feature: 'Competitor Price Gap ($ Absolute Delta)',
      category: 'Competitive',
      shapValue: 0.29,
      impactPercent: '+18.5%',
      businessDescription: 'A $15 price advantage over Milwaukee at Home Depot generates an average +14.2% unit lift across 20V core power tools.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_e3',
      feature: 'Retailer Gross Margin Hurdle (32% Target)',
      category: 'Demand Group',
      shapValue: -0.20,
      impactPercent: '-12.8%',
      businessDescription: 'Retailer margin compression constraints dampen wholesale price realization pass-through elasticity.',
      confidence: 'High (p = 0.001)'
    },
    {
      id: 'shap_e4',
      feature: 'PPI Raw Material Index (Steel/Copper/Lithium)',
      category: 'Macro / Demand',
      shapValue: -0.16,
      impactPercent: '-10.2%',
      businessDescription: 'Input cost inflation dampens consumer real disposable spending on discretionary multi-tool purchases.',
      confidence: 'High (p = 0.003)'
    },
    {
      id: 'shap_e5',
      feature: 'Spring Remodeling Seasonality Peak',
      category: 'Macro / Demand',
      shapValue: 0.15,
      impactPercent: '+9.6%',
      businessDescription: 'April-June peak construction season suppresses demand elasticity, allowing higher margin realization with lower volume loss.',
      confidence: 'High (p = 0.005)'
    },
    {
      id: 'shap_e6',
      feature: 'U.S. Housing Starts & Contractor Work Backlog',
      category: 'Macro / Demand',
      shapValue: 0.11,
      impactPercent: '+7.0%',
      businessDescription: 'Healthy commercial housing starts shift customer mix to price-inelastic professional trade contractors.',
      confidence: 'Medium (p = 0.015)'
    },
    {
      id: 'shap_e7',
      feature: 'Pro Membership Tier Discount Depth',
      category: 'Promotion',
      shapValue: 0.08,
      impactPercent: '+5.1%',
      businessDescription: 'Volume tier rebates insulate top-quartile contractor purchasing from list price shifts.',
      confidence: 'Medium (p = 0.022)'
    },
    {
      id: 'shap_e8',
      feature: 'Freight & Ocean Logistics Surcharge Pass-Through',
      category: 'Macro / Demand',
      shapValue: -0.06,
      impactPercent: '-3.8%',
      businessDescription: 'Regional logistics surcharges trigger minor volume resistance in non-metro retailer hubs.',
      confidence: 'Low (p = 0.041)'
    }
  ],
  promo_lift: [
    {
      id: 'shap_p1',
      feature: 'TPR Discount Depth (% Off MSRP)',
      category: 'Promotion',
      shapValue: 0.51,
      impactPercent: '+34.2%',
      businessDescription: 'Temporary price reductions exceeding 25% cross the psychological conversion threshold, generating 2.8x lift acceleration.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_p2',
      feature: 'Circular Front Cover & Mobile App Hero Feature',
      category: 'Promotion',
      shapValue: 0.33,
      impactPercent: '+22.1%',
      businessDescription: 'Front-page retailer circular and Home Depot app hero carousel placement amplifies promotional foot traffic by +114%.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_p3',
      feature: 'Pro Secondary Endcap Placement (Aisle 1/Pro)',
      category: 'Assortment',
      shapValue: 0.27,
      impactPercent: '+18.1%',
      businessDescription: 'Placement on the prime Contractor Entrance endcap produces a sustained +48% incremental unit run rate vs inline aisle.',
      confidence: 'High (p < 0.001)'
    },
    {
      id: 'shap_p4',
      feature: 'Buy-Tool-Get-Battery (BOGO GWP) Bundle',
      category: 'Product',
      shapValue: 0.23,
      impactPercent: '+15.4%',
      businessDescription: 'Free 5.0Ah battery gift structure yields 38% higher incremental ROI than equivalent cash dollar discount by protecting price integrity.',
      confidence: 'High (p = 0.002)'
    },
    {
      id: 'shap_p5',
      feature: 'Competitor Counter-Promotion Interference',
      category: 'Competitive',
      shapValue: -0.21,
      impactPercent: '-14.1%',
      businessDescription: 'Concurrent Milwaukee Red Zone promotional feature in adjacent bay erodes 34% of expected DeWalt campaign incremental lift.',
      confidence: 'High (p = 0.003)'
    },
    {
      id: 'shap_p6',
      feature: 'Promotion Duration Fatigue (>21 Days)',
      category: 'Promotion',
      shapValue: -0.16,
      impactPercent: '-10.7%',
      businessDescription: 'Running promotions longer than 3 consecutive weeks induces steep customer fatigue and severe post-promo volume dip.',
      confidence: 'High (p = 0.008)'
    },
    {
      id: 'shap_p7',
      feature: 'Key Holiday Co-Op (Father\'s Day / Pro Days)',
      category: 'Macro / Demand',
      shapValue: 0.14,
      impactPercent: '+9.4%',
      businessDescription: 'National gift-giving seasons create an organic multiplier on casual DIY shopper footfall.',
      confidence: 'Medium (p = 0.014)'
    },
    {
      id: 'shap_p8',
      feature: 'Retailer Associate In-Store Incentive (SPIFF)',
      category: 'Demand Group',
      shapValue: 0.07,
      impactPercent: '+4.7%',
      businessDescription: 'In-aisle expert associate recommendation increases trade-up to DeWalt XR premium bundle by 12%.',
      confidence: 'Low (p = 0.038)'
    }
  ]
};

// -------------------------------------------------------------
// DEMAND TRANSFERENCE MATRIX & CHOICE ARCHITECTURE DATA
// -------------------------------------------------------------
export const donorSkusData: DonorSkuData[] = [
  {
    id: 'donor_1',
    sku: 'DCD996B',
    name: 'DeWalt 20V MAX XR 1/2" Brushless Hammer Drill (Bare)',
    brand: 'DeWalt',
    baselineVolumeUnits: 68400,
    listPrice: 159.00,
    destinations: [
      { targetSku: 'DCD805B (DeWalt 20V XR Compact Drill)', brand: 'DeWalt', type: 'Intra-Brand (DeWalt)', transferPct: 42.5, volumeRetainedUnits: 29070, dollarTransfer: 4360500, color: '#FFC20E' },
      { targetSku: 'CMCD720B (Craftsman V20 Brushless Drill)', brand: 'Craftsman', type: 'Sister Brand (Craftsman)', transferPct: 18.2, volumeRetainedUnits: 12448, dollarTransfer: 1232352, color: '#DC2626' },
      { targetSku: '2804-20 (Milwaukee M18 Fuel 1/2" Hammer)', brand: 'Milwaukee', type: 'Competitor Direct (Milwaukee)', transferPct: 22.4, volumeRetainedUnits: 15321, dollarTransfer: 2589249, color: '#9333EA' },
      { targetSku: 'PBLHM101B (Ryobi ONE+ HP 18V Hammer Drill)', brand: 'Ryobi', type: 'Competitor Value (Ryobi)', transferPct: 9.3, volumeRetainedUnits: 6361, dollarTransfer: 629739, color: '#2563EB' },
      { targetSku: 'Walk-Away (No Purchase / Category Lost)', brand: 'Lost Sale', type: 'Walk-Away Loss', transferPct: 7.6, volumeRetainedUnits: 5200, dollarTransfer: 826800, color: '#64748B' }
    ]
  },
  {
    id: 'donor_2',
    sku: 'DCD771C2',
    name: 'DeWalt 20V MAX Cordless Drill/Driver Kit (2-Battery)',
    brand: 'DeWalt',
    baselineVolumeUnits: 124500,
    listPrice: 159.00,
    destinations: [
      { targetSku: 'DCD708C2 (DeWalt Atomic 20V Compact Kit)', brand: 'DeWalt', type: 'Intra-Brand (DeWalt)', transferPct: 46.0, volumeRetainedUnits: 57270, dollarTransfer: 9106930, color: '#FFC20E' },
      { targetSku: 'CMCD700C1 (Craftsman V20 Drill Kit)', brand: 'Craftsman', type: 'Sister Brand (Craftsman)', transferPct: 21.5, volumeRetainedUnits: 26767, dollarTransfer: 2649933, color: '#DC2626' },
      { targetSku: '2606-22CT (Milwaukee M18 Compact Kit)', brand: 'Milwaukee', type: 'Competitor Direct (Milwaukee)', transferPct: 16.8, volumeRetainedUnits: 20916, dollarTransfer: 3534804, color: '#9333EA' },
      { targetSku: 'PSBDD01K (Ryobi ONE+ 18V Compact Kit)', brand: 'Ryobi', type: 'Competitor Value (Ryobi)', transferPct: 9.8, volumeRetainedUnits: 12201, dollarTransfer: 1207899, color: '#2563EB' },
      { targetSku: 'Walk-Away (No Purchase / Category Lost)', brand: 'Lost Sale', type: 'Walk-Away Loss', transferPct: 5.9, volumeRetainedUnits: 7346, dollarTransfer: 1168014, color: '#64748B' }
    ]
  },
  {
    id: 'donor_3',
    sku: 'DCS380B',
    name: 'DeWalt 20V MAX Reciprocating Saw (Bare Tool)',
    brand: 'DeWalt',
    baselineVolumeUnits: 54200,
    listPrice: 129.00,
    destinations: [
      { targetSku: 'DCS367B (DeWalt XR Compact Recip Saw)', brand: 'DeWalt', type: 'Intra-Brand (DeWalt)', transferPct: 44.2, volumeRetainedUnits: 23956, dollarTransfer: 3569444, color: '#FFC20E' },
      { targetSku: 'CMCS300B (Craftsman V20 Reciprocating Saw)', brand: 'Craftsman', type: 'Sister Brand (Craftsman)', transferPct: 15.6, volumeRetainedUnits: 8455, dollarTransfer: 667945, color: '#DC2626' },
      { targetSku: '2722-20 (Milwaukee M18 Hackzall / Sawzall)', brand: 'Milwaukee', type: 'Competitor Direct (Milwaukee)', transferPct: 24.1, volumeRetainedUnits: 13062, dollarTransfer: 2207478, color: '#9333EA' },
      { targetSku: 'P519 (Ryobi 18V ONE+ Reciprocating Saw)', brand: 'Ryobi', type: 'Competitor Value (Ryobi)', transferPct: 8.9, volumeRetainedUnits: 4823, dollarTransfer: 381017, color: '#2563EB' },
      { targetSku: 'Walk-Away (No Purchase / Category Lost)', brand: 'Lost Sale', type: 'Walk-Away Loss', transferPct: 7.2, volumeRetainedUnits: 3904, dollarTransfer: 503616, color: '#64748B' }
    ]
  },
  {
    id: 'donor_4',
    sku: 'CMCD700C1',
    name: 'Craftsman V20 Cordless Drill/Driver Kit',
    brand: 'Craftsman',
    baselineVolumeUnits: 82100,
    listPrice: 99.00,
    destinations: [
      { targetSku: 'CMCD720C2 (Craftsman V20 Brushless 2-Bat)', brand: 'Craftsman', type: 'Sister Brand (Craftsman)', transferPct: 38.4, volumeRetainedUnits: 31526, dollarTransfer: 3751594, color: '#DC2626' },
      { targetSku: 'DCD771C2 (DeWalt 20V MAX Drill Kit)', brand: 'DeWalt', type: 'Intra-Brand (DeWalt)', transferPct: 24.8, volumeRetainedUnits: 20360, dollarTransfer: 3237240, color: '#FFC20E' },
      { targetSku: 'PSBDD01K (Ryobi ONE+ 18V Drill Kit)', brand: 'Ryobi', type: 'Competitor Value (Ryobi)', transferPct: 22.1, volumeRetainedUnits: 18144, dollarTransfer: 1796256, color: '#2563EB' },
      { targetSku: '2606-22CT (Milwaukee M18 Compact Kit)', brand: 'Milwaukee', type: 'Competitor Direct (Milwaukee)', transferPct: 6.2, volumeRetainedUnits: 5090, dollarTransfer: 860210, color: '#9333EA' },
      { targetSku: 'Walk-Away (No Purchase / Category Lost)', brand: 'Lost Sale', type: 'Walk-Away Loss', transferPct: 8.5, volumeRetainedUnits: 6980, dollarTransfer: 691020, color: '#64748B' }
    ]
  }
];

export const decisionHierarchyWaterfall = [
  { level: 'Level 1: Platform Compatibility', weight: 40, cumulative: 40, detail: 'Battery System (20V MAX vs M18 vs V20) creates primary lock-in hurdle', deltaLabel: '40% Primary Filter' },
  { level: 'Level 2: Brand Loyalty & Trust', weight: 30, cumulative: 70, detail: 'Contractor reputation, warranty support, brand equity perception', deltaLabel: '+30% Brand Filter' },
  { level: 'Level 3: Price Point Tier', weight: 20, cumulative: 90, detail: 'Budget boundaries ($99 vs $159 vs $249) and promotional sensitivity', deltaLabel: '+20% Price Band' },
  { level: 'Level 4: Form Factor & Specs', weight: 10, cumulative: 100, detail: 'Tool ergonomics, weight, brushless vs brushed motor, RPM ratings', deltaLabel: '+10% Spec Refinement' }
];

// -------------------------------------------------------------
// PRICING ELASTICITY S-CURVE & CROSS-PRICE DATA
// -------------------------------------------------------------
export const elasticityPoints: ElasticityCurvePoint[] = [
  { price: 129, volumeUnits: 178.5, elasticity: -0.72, revenueM: 23.02, grossMarginPct: 31.5, lowerConfidence: 171.2, upperConfidence: 185.8 },
  { price: 139, volumeUnits: 169.2, elasticity: -0.84, revenueM: 23.51, grossMarginPct: 33.8, lowerConfidence: 162.0, upperConfidence: 176.4 },
  { price: 149, volumeUnits: 158.0, elasticity: -0.98, revenueM: 23.54, grossMarginPct: 36.2, lowerConfidence: 151.0, upperConfidence: 165.0, isKinkPoint: true, kinkLabel: 'Psych Kink $149' },
  { price: 159, volumeUnits: 148.6, elasticity: -1.14, revenueM: 23.62, grossMarginPct: 38.5, lowerConfidence: 141.8, upperConfidence: 155.4 },
  { price: 169, volumeUnits: 140.2, elasticity: -1.28, revenueM: 23.69, grossMarginPct: 40.6, lowerConfidence: 133.4, upperConfidence: 147.0 },
  { price: 179, volumeUnits: 131.0, elasticity: -1.45, revenueM: 23.44, grossMarginPct: 42.4, lowerConfidence: 124.5, upperConfidence: 137.5 },
  { price: 189, volumeUnits: 124.8, elasticity: -1.62, revenueM: 23.58, grossMarginPct: 44.1, lowerConfidence: 118.2, upperConfidence: 131.4 },
  { price: 199, volumeUnits: 112.5, elasticity: -1.95, revenueM: 22.38, grossMarginPct: 45.3, lowerConfidence: 105.8, upperConfidence: 119.2, isKinkPoint: true, kinkLabel: 'Core Kink $199 Barrier', isCurrentPrice: true },
  { price: 209, volumeUnits: 98.4, elasticity: -2.35, revenueM: 20.56, grossMarginPct: 45.8, lowerConfidence: 91.8, upperConfidence: 105.0 },
  { price: 219, volumeUnits: 84.1, elasticity: -2.78, revenueM: 18.41, grossMarginPct: 45.2, lowerConfidence: 77.8, upperConfidence: 90.4 },
  { price: 229, volumeUnits: 71.3, elasticity: -3.12, revenueM: 16.32, grossMarginPct: 44.0, lowerConfidence: 65.2, upperConfidence: 77.4 },
  { price: 249, volumeUnits: 51.2, elasticity: -3.65, revenueM: 12.74, grossMarginPct: 41.5, lowerConfidence: 45.8, upperConfidence: 56.6, isKinkPoint: true, kinkLabel: 'Premium Barrier $249' }
];

export const crossPriceMatrix: CrossPriceRow[] = [
  {
    competitor: 'Milwaukee Tool',
    brand: 'Milwaukee',
    keySku: '2804-20 M18 FUEL 1/2" Hammer Drill',
    currentPrice: 199.00,
    crossElasticity: 0.68,
    impactPlus5Pct: {
      dewaltVolumeShiftPct: 3.4,
      dewaltIncrementalUnits: 4233,
      dewaltRevenueShift: 842367
    },
    impactMinus5Pct: {
      dewaltVolumeShiftPct: -3.4,
      dewaltIncrementalUnits: -4233,
      dewaltRevenueShift: -842367
    },
    substitutionRisk: 'High'
  },
  {
    competitor: 'Ryobi (TTI)',
    brand: 'Ryobi',
    keySku: 'PBLHM101B ONE+ HP Brushless Hammer Drill',
    currentPrice: 119.00,
    crossElasticity: 0.32,
    impactPlus5Pct: {
      dewaltVolumeShiftPct: 1.6,
      dewaltIncrementalUnits: 1992,
      dewaltRevenueShift: 396408
    },
    impactMinus5Pct: {
      dewaltVolumeShiftPct: -1.6,
      dewaltIncrementalUnits: -1992,
      dewaltRevenueShift: -396408
    },
    substitutionRisk: 'Medium'
  },
  {
    competitor: 'Craftsman (SBD Internal)',
    brand: 'Craftsman',
    keySku: 'CMCD720B V20 Brushless Hammer Drill',
    currentPrice: 119.00,
    crossElasticity: 0.41,
    impactPlus5Pct: {
      dewaltVolumeShiftPct: 2.05,
      dewaltIncrementalUnits: 2552,
      dewaltRevenueShift: 507848
    },
    impactMinus5Pct: {
      dewaltVolumeShiftPct: -2.05,
      dewaltIncrementalUnits: -2552,
      dewaltRevenueShift: -507848
    },
    substitutionRisk: 'Medium'
  },
  {
    competitor: 'Makita USA',
    brand: 'Makita',
    keySku: 'XPH14Z 18V LXT Brushless Hammer Drill',
    currentPrice: 179.00,
    crossElasticity: 0.45,
    impactPlus5Pct: {
      dewaltVolumeShiftPct: 2.25,
      dewaltIncrementalUnits: 2801,
      dewaltRevenueShift: 557399
    },
    impactMinus5Pct: {
      dewaltVolumeShiftPct: -2.25,
      dewaltIncrementalUnits: -2801,
      dewaltRevenueShift: -557399
    },
    substitutionRisk: 'Medium'
  },
  {
    competitor: 'Bosch Power Tools',
    brand: 'Bosch',
    keySku: 'GSB18V-535C 18V EC Brushless Hammer',
    currentPrice: 169.00,
    crossElasticity: 0.22,
    impactPlus5Pct: {
      dewaltVolumeShiftPct: 1.1,
      dewaltIncrementalUnits: 1370,
      dewaltRevenueShift: 272630
    },
    impactMinus5Pct: {
      dewaltVolumeShiftPct: -1.1,
      dewaltIncrementalUnits: -1370,
      dewaltRevenueShift: -272630
    },
    substitutionRisk: 'Low'
  }
];

// -------------------------------------------------------------
// PROMO LIFT DECOMPOSITION & FREQUENCY DECAY DATA
// -------------------------------------------------------------
export const promoDecompositionData: PromoDecompositionItem[] = [
  {
    mechanic: '15% Off TPR Inline',
    baseline: 42000,
    pureIncremental: 14500,
    cannibalization: -3200,
    forwardBuy: -2100,
    haloEffect: 2800,
    netIncremental: 12000,
    totalVolume: 54000,
    roi: '142%'
  },
  {
    mechanic: '25% Pro Flash Sale',
    baseline: 42000,
    pureIncremental: 29800,
    cannibalization: -7400,
    forwardBuy: -5600,
    haloEffect: 5200,
    netIncremental: 22000,
    totalVolume: 64000,
    roi: '184%'
  },
  {
    mechanic: 'Buy Bare Tool + Free 5Ah Bat',
    baseline: 42000,
    pureIncremental: 38200,
    cannibalization: -6100,
    forwardBuy: -4200,
    haloEffect: 8900,
    netIncremental: 36800,
    totalVolume: 78800,
    roi: '228%'
  },
  {
    mechanic: 'Father\'s Day Endcap ($199)',
    baseline: 42000,
    pureIncremental: 44500,
    cannibalization: -8900,
    forwardBuy: -6400,
    haloEffect: 11200,
    netIncremental: 40400,
    totalVolume: 82400,
    roi: '246%'
  },
  {
    mechanic: 'Black Friday Pro Mega-Bay',
    baseline: 42000,
    pureIncremental: 68400,
    cannibalization: -14200,
    forwardBuy: -12800,
    haloEffect: 16500,
    netIncremental: 57900,
    totalVolume: 99900,
    roi: '272%'
  }
];

export const promoDecayData: PromoDecayPoint[] = [
  { week: 1, efficiencyPct: 100, liftMultiplier: 2.42, annotation: 'Peak Incremental Lift (+142%)' },
  { week: 2, efficiencyPct: 81, liftMultiplier: 2.15, annotation: 'High Sustained Run-rate' },
  { week: 3, efficiencyPct: 59, liftMultiplier: 1.84, annotation: 'Efficiency Inflection Point' },
  { week: 4, efficiencyPct: 37, liftMultiplier: 1.51, warningZone: true, annotation: 'Fatigue Warning Threshold' },
  { week: 5, efficiencyPct: 22, liftMultiplier: 1.31, warningZone: true, annotation: 'Sub-Optimal Margin Accretion' },
  { week: 6, efficiencyPct: 14, liftMultiplier: 1.19, warningZone: true, annotation: 'Severe Forward-Buy Penalty' }
];

// -------------------------------------------------------------
// GOVERNANCE AUDIT LOG MOCK DATA
// -------------------------------------------------------------
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  ruleName: string;
  changeSummary: string;
  status: 'Enforced' | 'Active' | 'Approved by Model Risk';
}

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-08 14:22:10 UTC',
    user: 'Channel RGM Lead (Home Depot)',
    ruleName: 'Elasticity Floor Limiter',
    changeSummary: 'Clamped own price elasticity floor at ε = -3.00 (raw ML produced -4.18 on rare legacy SKU)',
    status: 'Enforced'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-07 09:15:44 UTC',
    user: 'Director, Commercial Data Science',
    ruleName: 'Max Transference Leakage',
    changeSummary: 'Restricted external brand leakage to ≤ 25.0% for cordless power tool assortments',
    status: 'Approved by Model Risk'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-05 18:40:02 UTC',
    user: 'Pricing Strategy Manager',
    ruleName: 'Confidence Clamping',
    changeSummary: 'Updated statistical threshold to 95% Confidence Interval with Empirical Bayes Shrinkage',
    status: 'Enforced'
  }
];
