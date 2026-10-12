export interface CharterStep {
  id: string;
  stepNumber: string;
  title: string;
  description?: string;
  agents: string[];
  artifacts: {
    type: 'report' | 'document' | 'decision' | 'calendar' | 'payload';
    label: string;
  }[];
  roles?: string[];
  moneyBadge?: boolean;
  isGate?: boolean;
  gateOwner?: string;
  gateDescription?: string;
  note?: string;
  enabled: boolean;
}

export interface CharterStage {
  id: string;
  stageNumber: number;
  title: string;
  subText: string;
  stepsCount: number;
  gatesCount: number;
  isExpanded: boolean;
  accentColor: string; // 'amber' | 'blue'
  steps: CharterStep[];
}

export interface ActivationTrigger {
  id: string;
  iconName: 'calendar' | 'trending-up' | 'zap' | 'user';
  title: string;
  description: string;
  active: boolean;
}

export interface DecisionRightRole {
  role: string;
  description: string;
  active: boolean;
}

export interface GuardrailPolicy {
  id: string;
  name: string;
  tier: 'HARD' | 'FLEX';
  description: string;
  value?: string;
}

export interface MissionScope {
  retailer: string;
  brand: string;
  category: string;
  skuCluster: string;
  eventWindow: string;
  startDate: string;
  endDate: string;
  budgetEnvelope: number;
  minNetMarginFloor: number;
  maxDiscountDepth: number;
  missionLead: string;
  selectedTrigger: string;
}

export const initialCharterStages: CharterStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Promotion Strategy & Budget Design',
    subText: 'Historical performance, NPD overlay and market context feed a customer × brand strategy and budget allocation.',
    stepsCount: 4,
    gatesCount: 1,
    isExpanded: true,
    accentColor: 'amber',
    steps: [
      {
        id: 'st-1-01',
        stepNumber: '01',
        title: 'Historical Insights — base vs. incremental volume and last 8 events scored for winners/losers',
        agents: ['Promo baseline analyst'],
        artifacts: [{ type: 'report', label: 'report artifact' }],
        enabled: true,
      },
      {
        id: 'st-1-02',
        stepNumber: '02',
        title: "Innovation & NPD calendar overlay — this year's launches mapped so promotions support new-item ramp",
        agents: ['Launch calendar planner'],
        artifacts: [{ type: 'document', label: 'document artifact' }],
        enabled: true,
      },
      {
        id: 'st-1-03',
        stepNumber: '03',
        title: 'Market & category insights — competitor moves and regulatory/category context (e.g. HFSS watch)',
        agents: ['Market scanner'],
        artifacts: [{ type: 'report', label: 'report artifact' }],
        enabled: true,
      },
      {
        id: 'st-1-04',
        stepNumber: '04',
        title: 'Strategy plans for customer × brand — growth/seed/harvest quadrant, invest/hold/divest objective, budget allocation',
        agents: [],
        moneyBadge: true,
        roles: ['RGM Lead'],
        artifacts: [{ type: 'decision', label: 'decision artifact' }],
        note: 'Commits the account budget envelope by brand → Commercial Finance.',
        isGate: true,
        gateOwner: 'RGM Lead',
        enabled: true,
      }
    ]
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Promotion Event Design & Calendar Optimization',
    subText: 'Model check and rule manual seed the optimizer; scenarios are run, adjusted, collision-checked and submitted.',
    stepsCount: 7,
    gatesCount: 5,
    isExpanded: true,
    accentColor: 'amber',
    steps: [
      {
        id: 'st-2-01',
        stepNumber: '05',
        title: 'Base & incremental elasticity model verification — cross-elasticity curve validation against recent scanner logs',
        agents: ['Elasticity solver'],
        artifacts: [{ type: 'report', label: 'report artifact' }],
        enabled: true,
      },
      {
        id: 'st-2-02',
        stepNumber: '06',
        title: 'Event slot generation — seed circular ad calendar with candidate hero SKUs and promotional mechanics',
        agents: ['Promo architect'],
        artifacts: [{ type: 'calendar', label: 'calendar artifact' }],
        enabled: true,
      },
      {
        id: 'st-2-03',
        stepNumber: '07',
        title: 'Cross-brand cannibalization & halo evaluation — isolate DeWalt vs. Craftsman internal volume migration',
        agents: ['Portfolio transfer engine'],
        artifacts: [{ type: 'report', label: 'report artifact' }],
        enabled: true,
      },
      {
        id: 'st-2-04',
        stepNumber: '08',
        title: 'Retailer gross margin & penny profit parity check — guarantee Home Depot / Lowe\'s hurdle rates',
        agents: ['Retail parity agent'],
        artifacts: [{ type: 'decision', label: 'decision artifact' }],
        isGate: true,
        gateOwner: 'Key Account Lead',
        enabled: true,
      },
      {
        id: 'st-2-05',
        stepNumber: '09',
        title: 'Forward-buy & post-promotional dip simulation — model retailer inventory build and pantry loading',
        agents: ['Demand rhythm model'],
        artifacts: [{ type: 'report', label: 'report artifact' }],
        enabled: true,
      },
      {
        id: 'st-2-06',
        stepNumber: '10',
        title: 'Multi-scenario optimizer & trade spend allocation — Pareto solver maximizing net profit contribution',
        agents: ['Trade spend optimizer'],
        artifacts: [{ type: 'decision', label: 'decision artifact' }],
        isGate: true,
        gateOwner: 'Commercial Finance Lead',
        enabled: true,
      },
      {
        id: 'st-2-07',
        stepNumber: '11',
        title: 'Collision check & circular ad calendar lock — ensure no conflicting promotions across regional merchandising zones',
        agents: [],
        roles: ['RGM Lead'],
        artifacts: [{ type: 'decision', label: 'decision artifact' }],
        note: 'Locks promotional calendar and commits trade allowances.',
        isGate: true,
        gateOwner: 'RGM Lead',
        enabled: true,
      }
    ]
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'System & Execution',
    subText: 'Sell-in, JBP feedback, demand/supply planning and the pre-staged hand-off and push to TPM.',
    stepsCount: 5,
    gatesCount: 1,
    isExpanded: true,
    accentColor: 'blue',
    steps: [
      {
        id: 'st-3-01',
        stepNumber: '12',
        title: 'Joint Business Planning (JBP) sell-in deck synthesis — automated merchant presentation and commercial pitch',
        agents: ['Pitch synthesizer'],
        artifacts: [{ type: 'document', label: 'presentation artifact' }],
        enabled: true,
      },
      {
        id: 'st-3-02',
        stepNumber: '13',
        title: 'Retailer POS circular acceptance & agreement lock — capture merchant sign-off and joint co-op funding',
        agents: [],
        roles: ['Key Account Director'],
        artifacts: [{ type: 'decision', label: 'decision artifact' }],
        isGate: true,
        gateOwner: 'Key Account Director',
        enabled: true,
      },
      {
        id: 'st-3-03',
        stepNumber: '14',
        title: 'Demand & supply planning handoff — synchronize factory forecast, inventory buffer, and DC staging',
        agents: ['Supply chain sync agent'],
        artifacts: [{ type: 'document', label: 'document artifact' }],
        enabled: true,
      },
      {
        id: 'st-3-04',
        stepNumber: '15',
        title: 'SAP Vistex condition record generation — draft automated pricing conditions and PCR accruals',
        agents: ['ERP integration agent'],
        artifacts: [{ type: 'payload', label: 'ERP payload artifact' }],
        enabled: true,
      },
      {
        id: 'st-3-05',
        stepNumber: '16',
        title: 'TPM execution push & live audit tripwire lock — commit to SAP ledger and activate real-time spend surveillance',
        agents: [],
        moneyBadge: true,
        roles: ['RGM Lead'],
        artifacts: [{ type: 'decision', label: 'decision artifact' }],
        note: 'Pre-staged hand-off and push to TPM.',
        isGate: true,
        gateOwner: 'RGM Lead',
        enabled: true,
      }
    ]
  }
];

export const initialTriggers: ActivationTrigger[] = [
  {
    id: 'trig-1',
    iconName: 'calendar',
    title: 'Calendar cadence',
    description: 'A scheduled review window comes around.',
    active: true,
  },
  {
    id: 'trig-2',
    iconName: 'trending-up',
    title: 'Threshold breach',
    description: 'A tracked metric crosses a set limit.',
    active: true,
  },
  {
    id: 'trig-3',
    iconName: 'zap',
    title: 'Market event',
    description: 'An external move — a competitor price change or cost shock.',
    active: true,
  },
  {
    id: 'trig-4',
    iconName: 'user',
    title: 'On demand',
    description: 'Started manually by the mission owner.',
    active: true,
  }
];

export const initialDecisionRole: DecisionRightRole = {
  role: 'RGM Lead',
  description: 'Reviews and approves every gated decision in this mission',
  active: true,
};

export const initialGuardrails: GuardrailPolicy[] = [
  {
    id: 'gr-1',
    name: 'Floor-price rule',
    tier: 'HARD',
    description: 'No promoted price may fall below the published floor on any SKU.',
    value: 'Floor MSRP - 20%',
  },
  {
    id: 'gr-2',
    name: 'Max discount depth',
    tier: 'HARD',
    description: 'Promotional TPR cannot exceed 20% on cordless power tools.',
    value: '≤ 20.0% TPR',
  },
  {
    id: 'gr-3',
    name: 'Minimum Net-Net Margin',
    tier: 'HARD',
    description: 'Must preserve 42.0% Net-Net commercial contribution margin.',
    value: '≥ 42.0% Margin',
  },
  {
    id: 'gr-4',
    name: 'Brand Lane Clearance',
    tier: 'FLEX',
    description: 'Maintain minimum $6.00 price delta between Craftsman and DeWalt.',
    value: '≥ $6.00 Delta',
  }
];
