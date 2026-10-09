export type ScenarioDomain = 'pricing' | 'promo' | 'assortment' | 'goal_seek' | 'descriptive';

export interface PricingLevers {
  participatingSkus: string[];
  priceIncreasePct: number;
  cogsInflationPct: number;
  elasticityIndex: number;
  shelfPassThroughPct: number;
  retailer: string;
}

export interface PromoLevers {
  promoWindow: string;
  promoTactic: 'TPR' | 'Feature & Display' | 'Circular Ad Banner' | 'Endcap Power-Wing';
  discountDepthPct: number;
  coOpBudgetM: number;
  defensiveShieldActive: boolean;
  competitorBrand: string;
}

export interface AssortmentLevers {
  gsvHurdleM: number;
  macHurdlePct: number;
  delistTargetCount: number;
  transferenceFactorPct: number;
  introduceNpi: boolean;
  npiSkuName: string;
}

export interface GoalSeekLevers {
  targetGsvM: number;
  minMacPct: number;
  maxPriceIncreasePct: number;
  tradeSpendCapM: number;
}

export type ScenarioLevers = {
  domain: ScenarioDomain;
  pricing?: PricingLevers;
  promo?: PromoLevers;
  assortment?: AssortmentLevers;
  goalSeek?: GoalSeekLevers;
};

export interface ScenarioImpactMetrics {
  baselineGsvM: number;
  simulatedGsvM: number;
  gsvDeltaM: number;
  gsvDeltaPct: number;
  baselineMacPct: number;
  simulatedMacPct: number;
  macBpsDelta: number;
  baselineVolumeUnitsM: number;
  simulatedVolumeUnitsM: number;
  volumeUnitsDeltaPct: number;
  tradeSpendM: number;
  roiRatio: number;
  retainedTransferencePct?: number;
  waterfallBridge: {
    name: string;
    value: number;
    fill?: string;
  }[];
  categoryShare?: {
    sbdPct: number;
    deltaBps: number;
    competitorLeakageKUnits: number;
  };
}

export interface ExecutionStep {
  stepNumber: number;
  title: string;
  status: 'completed' | 'running' | 'pending';
  detail: string;
  telemetry?: string;
}

export interface PromoEventItem {
  week: string;
  eventName: string;
  tactic: string;
  discountPct: number;
  spendK: number;
  baseUnitsK: number;
  liftUnitsK: number;
  gsvLiftK: number;
  roi: number;
}

export interface SkuPriceImpactItem {
  sku: string;
  name: string;
  currentPrice: number;
  proposedPrice: number;
  elasticity: number;
  volumeDeltaPct: number;
  gsvImpactK: number;
  macDeltaBps: number;
}

export interface CalendarWeekItem {
  week: string;
  label: string;
  tactic: string;
  discountPct: number;
  spendK: number;
  competitorAction: string;
  expectedUnitsK: number;
}

export interface DelistedSkuItem {
  sku: string;
  name: string;
  gsvK: number;
  macPct: number;
  reason: string;
  transferDestination: string;
}

export interface GoalPillarItem {
  pillar: string;
  action: string;
  gsvDeltaM: number;
  macDeltaBps: number;
  feasibility: 'High' | 'Medium' | 'Optimal';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  content: string;
  domain?: ScenarioDomain;
  scenarioTitle?: string;
  executionTrace?: ExecutionStep[];
  levers?: ScenarioLevers;
  impactMetrics?: ScenarioImpactMetrics;
  showLeverCard?: boolean;
  showOutputCard?: boolean;
  // Specific Contextual Data
  promoEvents?: PromoEventItem[];
  skuPriceImpacts?: SkuPriceImpactItem[];
  calendarWeeks?: CalendarWeekItem[];
  delistedSkus?: DelistedSkuItem[];
  goalPillars?: GoalPillarItem[];
  chartType?: 'event_roi' | 'waterfall' | 'calendar_curve' | 'assortment_matrix' | 'goal_seek_bridge';
}

export interface ActiveScenario {
  id: string;
  title: string;
  domain: ScenarioDomain;
  targetTab: 'strategic_pricing' | 'trade_promotions' | 'assortment_planner';
  levers: ScenarioLevers;
  metrics: ScenarioImpactMetrics;
  lastUpdated: string;
  summaryHighlights: string[];
  drawerDetails?: {
    type: 'descriptive' | 'pricing' | 'promo' | 'assortment' | 'goal_seek';
    primaryKpis: { label: string; value: string; delta: string; isGood: boolean }[];
    subSectionTitle: string;
    subSectionItems: { label: string; value: string; badge?: string }[];
  };
}

export interface PromptLibraryItem {
  id: string;
  key: string;
  title: string;
  pillar: 'pricing' | 'promo' | 'assortment' | 'goal_seek' | 'descriptive';
  pillarLabel: string;
  userPrompt: string;
  description: string;
  tags: string[];
  suggestedHorizon: string;
  impactPreview: string;
}
