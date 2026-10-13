export interface WeeklyValidationPoint {
  week: string;
  actualDemand: number;
  predictedDemand: number;
  errorPct: number;
}

export interface VariableImportanceItem {
  variable: string;
  category: string;
  importancePct: number;
  description: string;
}

export interface TransferCompositionData {
  sbdRetentionPct: number;
  competitorTransferPct: number;
  walkAwayPct: number;
  sbdRetentionUnits: number;
  competitorUnits: number;
  walkAwayUnits: number;
  scopeSummary: string;
}

export interface MatrixCell {
  donorGroup: string;
  receiverGroup: string;
  transferPct: number;
  volumeUnits: number;
}

export interface TransferStabilityPoint {
  version: string;
  refreshDate: string;
  sbdRetentionPct: number;
  competitorTransferPct: number;
  walkAwayPct: number;
}

export interface RelationshipStabilityRow {
  relationship: string;
  donorCategory: string;
  receiverCategory: string;
  currentRank: number;
  previousRank: number;
  rankChange: 'up' | 'down' | 'same' | 'new';
  rankChangeLabel: string;
  transferRate: number;
}

export interface ModelPerformancePoint {
  version: string;
  refreshDate: string;
  averageErrorPct: number;
  targetThresholdPct: number;
}

export interface InputDriftRow {
  inputName: string;
  baselineMean: string;
  currentMean: string;
  psiScore: number;
  driftStatus: 'No Drift (Stable)' | 'Low Drift (Normal)' | 'Moderate Drift (Monitored)';
  trend: 'stable' | 'up' | 'down';
}

// ---------------------------------------------------------------------------
// 1. MODEL VALIDATION MOCK DATA
// ---------------------------------------------------------------------------
export const validationPeriodText = "Validation Period: 2025-W27 to 2025-W52 (26-Week Holdout Backtest Window · Out-of-Time Validation)";
export const validationErrorPct = 3.6;

export const weeklyValidationData: WeeklyValidationPoint[] = [
  { week: 'W27', actualDemand: 12450, predictedDemand: 12100, errorPct: 2.8 },
  { week: 'W28', actualDemand: 11980, predictedDemand: 12300, errorPct: 2.7 },
  { week: 'W29', actualDemand: 13200, predictedDemand: 12850, errorPct: 2.7 },
  { week: 'W30', actualDemand: 14100, predictedDemand: 13700, errorPct: 2.8 },
  { week: 'W31', actualDemand: 13800, predictedDemand: 14200, errorPct: 2.9 },
  { week: 'W32', actualDemand: 12900, predictedDemand: 12500, errorPct: 3.1 },
  { week: 'W33', actualDemand: 12100, predictedDemand: 12450, errorPct: 2.9 },
  { week: 'W34', actualDemand: 13400, predictedDemand: 13900, errorPct: 3.7 },
  { week: 'W35', actualDemand: 15600, predictedDemand: 15100, errorPct: 3.2 },
  { week: 'W36', actualDemand: 16800, predictedDemand: 16200, errorPct: 3.6 },
  { week: 'W37', actualDemand: 14500, predictedDemand: 14950, errorPct: 3.1 },
  { week: 'W38', actualDemand: 13200, predictedDemand: 13700, errorPct: 3.8 },
  { week: 'W39', actualDemand: 12800, predictedDemand: 12350, errorPct: 3.5 },
  { week: 'W40', actualDemand: 14200, predictedDemand: 13800, errorPct: 2.8 },
  { week: 'W41', actualDemand: 15100, predictedDemand: 14600, errorPct: 3.3 },
  { week: 'W42', actualDemand: 16400, predictedDemand: 15900, errorPct: 3.0 },
  { week: 'W43', actualDemand: 17200, predictedDemand: 16700, errorPct: 2.9 },
  { week: 'W44', actualDemand: 18900, predictedDemand: 18200, errorPct: 3.7 },
  { week: 'W45', actualDemand: 21500, predictedDemand: 20600, errorPct: 4.2 },
  { week: 'W46', actualDemand: 24800, predictedDemand: 23700, errorPct: 4.4 },
  { week: 'W47', actualDemand: 29200, predictedDemand: 28100, errorPct: 3.8 },
  { week: 'W48', actualDemand: 34100, predictedDemand: 32900, errorPct: 3.5 },
  { week: 'W49', actualDemand: 26400, predictedDemand: 25500, errorPct: 3.4 },
  { week: 'W50', actualDemand: 22100, predictedDemand: 21300, errorPct: 3.6 },
  { week: 'W51', actualDemand: 18700, predictedDemand: 18100, errorPct: 3.2 },
  { week: 'W52', actualDemand: 14200, predictedDemand: 13800, errorPct: 2.8 }
];

// ---------------------------------------------------------------------------
// 2. VARIABLE IMPORTANCE MOCK DATA (VTM MODEL)
// ---------------------------------------------------------------------------
export const variableImportanceData: VariableImportanceItem[] = [
  {
    variable: 'Platform / Voltage Compatibility',
    category: 'System Architecture',
    importancePct: 34.2,
    description: 'Battery system lock-in (DeWalt 20V MAX vs 60V FLEXVOLT system vs 12V)'
  },
  {
    variable: 'Product Type & Form Factor',
    category: 'Tool Function',
    importancePct: 24.8,
    description: 'Primary core utility (Hammer Drill vs Impact Driver vs Combo Kit)'
  },
  {
    variable: 'Pack / Kit Configuration',
    category: 'Merchandising Packaging',
    importancePct: 16.5,
    description: 'Bare Tool vs 1-Battery Kit vs 2-Battery Kit with Charger & Bag'
  },
  {
    variable: 'Brand Tier & Loyalty',
    category: 'Commercial Brand',
    importancePct: 11.2,
    description: 'DeWalt Industrial Pro vs Craftsman DIY/Homeowner brand loyalty'
  },
  {
    variable: 'Price Point / Price Tier Gap',
    category: 'Pricing Structure',
    importancePct: 7.8,
    description: 'Relative dollar delta between delisted SKU and candidate substitute'
  },
  {
    variable: 'Motor Tech (Brushless vs Brushed)',
    category: 'Performance Spec',
    importancePct: 3.5,
    description: 'XR Brushless motor longevity and runtime tiering'
  },
  {
    variable: 'Chuck & Collet Specification',
    category: 'Hardware Specs',
    importancePct: 2.0,
    description: '1/2" metal ratcheting chuck vs 3/8" chuck vs 1/4" hex quick-release'
  }
];

// ---------------------------------------------------------------------------
// 3. TRANSFER COMPOSITION MOCK DATA (100% STACKED BAR)
// ---------------------------------------------------------------------------
export const transferCompositionData: TransferCompositionData = {
  sbdRetentionPct: 59.2,
  competitorTransferPct: 26.5,
  walkAwayPct: 14.3,
  sbdRetentionUnits: 148000,
  competitorUnits: 66250,
  walkAwayUnits: 35750,
  scopeSummary: 'Aggregate view for selected business filters: Tools & Outdoor · Power Tools · DeWalt · The Home Depot · FY2026'
};

// ---------------------------------------------------------------------------
// 4. DEMAND TRANSFER MATRIX MOCK DATA (HEATMAP / MATRIX)
// ---------------------------------------------------------------------------
export const donorProductGroups = [
  'Cordless Drills (Compact & Hammer)',
  'Impact Drivers & Wrenches',
  'Combo Kits (2-Tool & Multi-Pack)',
  'Circular & Miter Saws',
  'Batteries & Starter Packs'
];

export const receiverProductGroups = [
  'Cordless Drills',
  'Impact Drivers',
  'Combo Kits',
  'Circular Saws',
  'Batteries & Packs',
  'Competitor / Walk-Away'
];

export const demandTransferMatrixGrid: number[][] = [
  // Drills -> [Drills, Impact, Combo, Saws, Batteries, Competitor/Walk-away]
  [44.5, 12.0, 18.2, 2.5, 6.8, 16.0],
  // Impact ->
  [14.2, 42.0, 19.5, 1.8, 5.5, 17.0],
  // Combo Kits ->
  [19.0, 16.5, 38.0, 4.5, 3.2, 18.8],
  // Saws ->
  [3.5, 2.0, 6.2, 54.0, 8.5, 25.8],
  // Batteries ->
  [4.0, 3.5, 8.2, 5.1, 62.4, 16.8]
];

// ---------------------------------------------------------------------------
// 5. MONITORING 1: TRANSFER STABILITY OVER TIME
// ---------------------------------------------------------------------------
export const transferStabilityData: TransferStabilityPoint[] = [
  { version: 'v1.0 (Q1 \'25)', refreshDate: '2025-01-15', sbdRetentionPct: 57.2, competitorTransferPct: 28.1, walkAwayPct: 14.7 },
  { version: 'v1.1 (Q2 \'25)', refreshDate: '2025-04-12', sbdRetentionPct: 58.0, competitorTransferPct: 27.6, walkAwayPct: 14.4 },
  { version: 'v1.2 (Q3 \'25)', refreshDate: '2025-07-20', sbdRetentionPct: 58.5, competitorTransferPct: 27.2, walkAwayPct: 14.3 },
  { version: 'v2.0 (Q4 \'25)', refreshDate: '2025-10-18', sbdRetentionPct: 59.8, competitorTransferPct: 26.0, walkAwayPct: 14.2 },
  { version: 'v2.1 (Q1 \'26)', refreshDate: '2026-01-22', sbdRetentionPct: 59.0, competitorTransferPct: 26.7, walkAwayPct: 14.3 },
  { version: 'v2.2 (Q2 \'26)', refreshDate: '2026-04-10', sbdRetentionPct: 59.2, competitorTransferPct: 26.5, walkAwayPct: 14.3 }
];

// ---------------------------------------------------------------------------
// 6. MONITORING 2: RELATIONSHIP STABILITY (RANK-CHANGE TABLE)
// ---------------------------------------------------------------------------
export const relationshipStabilityRows: RelationshipStabilityRow[] = [
  {
    relationship: '20V Compact Drill (DCD771) → 20V XR Brushless Hammer Drill (DCD805)',
    donorCategory: 'Compact Drill',
    receiverCategory: 'XR Hammer Drill',
    currentRank: 1,
    previousRank: 1,
    rankChange: 'same',
    rankChangeLabel: '0 Unchanged',
    transferRate: 38.4
  },
  {
    relationship: '2-Tool Combo Kit (DCK280) → Bare Drill + 5.0Ah Battery Bundle',
    donorCategory: 'Combo Kit',
    receiverCategory: 'Bare Tool + Battery',
    currentRank: 2,
    previousRank: 3,
    rankChange: 'up',
    rankChangeLabel: '+1 Rising',
    transferRate: 26.1
  },
  {
    relationship: '20V Impact Driver (DCF885) → 20V XR 3-Speed Impact Driver (DCF887)',
    donorCategory: 'Impact Driver',
    receiverCategory: 'XR Impact Driver',
    currentRank: 3,
    previousRank: 2,
    rankChange: 'down',
    rankChangeLabel: '-1 Shift',
    transferRate: 24.8
  },
  {
    relationship: 'DeWalt 20V Bare Tool delisted → Competitor Milwaukee M18 Equivalent',
    donorCategory: 'DeWalt Pro',
    receiverCategory: 'Milwaukee M18',
    currentRank: 4,
    previousRank: 4,
    rankChange: 'same',
    rankChangeLabel: '0 Unchanged',
    transferRate: 18.2
  },
  {
    relationship: 'Craftsman V20 Combo delisted → DeWalt 20V MAX Entry Kit',
    donorCategory: 'Craftsman V20',
    receiverCategory: 'DeWalt Entry',
    currentRank: 5,
    previousRank: 6,
    rankChange: 'up',
    rankChangeLabel: '+1 Rising',
    transferRate: 14.5
  },
  {
    relationship: '12" Sliding Miter Saw (DWS779) → 12" Dual-Bevel Compound Saw (DWS716)',
    donorCategory: 'Stationary Wood',
    receiverCategory: 'Stationary Wood',
    currentRank: 6,
    previousRank: 5,
    rankChange: 'down',
    rankChangeLabel: '-1 Shift',
    transferRate: 12.0
  }
];

// ---------------------------------------------------------------------------
// 7. MONITORING 3: MODEL PERFORMANCE OVER TIME (TREND CHART)
// ---------------------------------------------------------------------------
export const modelPerformanceTrendData: ModelPerformancePoint[] = [
  { version: 'v1.0 (Q1 \'25)', refreshDate: '2025-01-15', averageErrorPct: 5.2, targetThresholdPct: 6.0 },
  { version: 'v1.1 (Q2 \'25)', refreshDate: '2025-04-12', averageErrorPct: 4.7, targetThresholdPct: 6.0 },
  { version: 'v1.2 (Q3 \'25)', refreshDate: '2025-07-20', averageErrorPct: 4.2, targetThresholdPct: 6.0 },
  { version: 'v2.0 (Q4 \'25)', refreshDate: '2025-10-18', averageErrorPct: 3.9, targetThresholdPct: 6.0 },
  { version: 'v2.1 (Q1 \'26)', refreshDate: '2026-01-22', averageErrorPct: 3.8, targetThresholdPct: 6.0 },
  { version: 'v2.2 (Q2 \'26)', refreshDate: '2026-04-10', averageErrorPct: 3.6, targetThresholdPct: 6.0 }
];

// ---------------------------------------------------------------------------
// 8. MONITORING 4: INPUT / DATA DRIFT
// ---------------------------------------------------------------------------
export const inputDriftRows: InputDriftRow[] = [
  {
    inputName: 'Platform Voltage Price Gap ($)',
    baselineMean: '$42.50',
    currentMean: '$44.10',
    psiScore: 0.04,
    driftStatus: 'No Drift (Stable)',
    trend: 'stable'
  },
  {
    inputName: 'Battery Pack Attach Rate (%)',
    baselineMean: '31.2%',
    currentMean: '33.8%',
    psiScore: 0.06,
    driftStatus: 'Low Drift (Normal)',
    trend: 'up'
  },
  {
    inputName: 'Retailer Assortment Breadth (SKU Count)',
    baselineMean: '28 SKUs',
    currentMean: '27 SKUs',
    psiScore: 0.02,
    driftStatus: 'No Drift (Stable)',
    trend: 'stable'
  },
  {
    inputName: 'Competitor Price Premium (vs Milwaukee M18)',
    baselineMean: '-12.4%',
    currentMean: '-8.9%',
    psiScore: 0.11,
    driftStatus: 'Moderate Drift (Monitored)',
    trend: 'up'
  },
  {
    inputName: 'Promotional Feature Circular Frequency',
    baselineMean: '3.8 wks/yr',
    currentMean: '4.1 wks/yr',
    psiScore: 0.05,
    driftStatus: 'No Drift (Stable)',
    trend: 'stable'
  }
];
