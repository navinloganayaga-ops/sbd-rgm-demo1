export interface ParticipatingSku {
  skuId: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  promoPriceLastYear: number;
  discountPctLastYear: number;
  unitsLastYear: number;
  gsvLastYear: number;
  marginLastYear: number;
  elasticityIndex: number;
  elasticityLabel: 'High Lift (Elastic)' | 'Balanced' | 'Margin Drag (Inelastic)';
  
  // Current Plan Allocations (Configurable)
  included: boolean;
  currentPromoPrice: number;
  currentDiscountPct: number;
  tradeSpendAllocated: number;
  projectedUnits: number;
  projectedGSV: number;
  projectedMargin: number;
  rationale: string;
}

export interface PcrHistoricalRecord {
  pcrNumber: string;
  title: string;
  customer: string;
  brand: string;
  bu: string;
  category: string;
  timing: string;
  dates: string;
  mechanic: string;
  skus: ParticipatingSku[];
  
  // Performance against targets (FY2025 Actual vs Plan)
  posUnitsAct: string;
  posUnitsPlan: string;
  posUnitsVarPct: string;
  posUnitsStatus: 'Hit' | 'Miss' | 'Within';

  posRetailAct: string;
  posRetailPlan: string;
  posRetailVarPct: string;
  posRetailStatus: 'Hit' | 'Miss' | 'Within';

  gsvAct: string;
  gsvPlan: string;
  gsvVarPct: string;
  gsvStatus: 'Hit' | 'Miss' | 'Within';

  sgmMarginAct: string;
  sgmMarginPlan: string;
  sgmVarBps: string;
  sgmStatus: 'Hit' | 'Miss' | 'Within';

  tradeSpendAct: string;
  tradeSpendPlan: string;
  roiAct: string;
  roiPlan: string;

  // ML Baseline & Incremental Split
  baselineUnits: number;
  incrementalUnits: number;
  baselineGSV: number;
  incrementalGSV: number;
  modelConfidence: number;
  cannibalizationDragUnits: number;
  haloAttachmentGSV: number;
}

export interface ApproachCard {
  id: 'rollover' | 'margins' | 'gsv' | 'balanced';
  title: string;
  badge: string;
  tagline: string;
  description: string;
  keyKPIs: {
    projectedGSV: string;
    gsvGrowth: string;
    projectedSgmMargin: string;
    marginBpsDelta: string;
    tradeSpend: string;
    promoROI: string;
    projectedUnits: string;
    unitsGrowth: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
  };
  modelStrategy: string;
  skuRule: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  approachId: 'rollover' | 'margins' | 'gsv' | 'balanced' | 'custom';
  approachName: string;
  createdAt: string;
  pcrCount: number;
  skuCount: number;
  gsv: number;
  gsvFormatted: string;
  marginPct: number;
  marginFormatted: string;
  tradeSpend: number;
  tradeSpendFormatted: string;
  units: number;
  unitsFormatted: string;
  roi: string;
  isConfirmedToSalesforce: boolean;
  salesforceCampaignId?: string;
  skusSnapshot: ParticipatingSku[];
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  chips?: string[];
}
