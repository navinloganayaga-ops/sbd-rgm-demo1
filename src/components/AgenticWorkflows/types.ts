export type WorkflowDomain = 
  | 'All' 
  | 'Trade Promotion' 
  | 'Strategic Pricing' 
  | 'Assortment & Portfolio' 
  | 'Governance & Risk' 
  | 'Customer JBP';

export type AutonomyTier = 
  | 'Tier 2 · Co-Pilot Simulation'
  | 'Tier 3 · Human-in-the-Loop Review'
  | 'Tier 4 · One-Click Commercial Sign-Off'
  | 'Tier 5 · Autonomous with Tripwires';

export interface WorkflowStage {
  id: string;
  name: string;
  agentOrModel: string;
  role: string;
  description: string;
  iconName: string;
  estimatedLatency: string;
  inputs: string[];
  outputs: string[];
}

export interface WorkflowSimulationData {
  triggerEvent: string;
  dataSummary: string;
  aiAnalysis: string;
  guardrailCheck: {
    passed: boolean;
    rule: string;
    message: string;
  };
  decisionOutcome: string;
  erpPayload: string;
  kpis: {
    label: string;
    value: string;
    delta: string;
    positive: boolean;
  }[];
  stepLogs: {
    stepIndex: number;
    stepName: string;
    agentName: string;
    timestamp: string;
    log: string;
  }[];
}

export interface WorkflowItem {
  id: string;
  code: string;
  title: string;
  domain: 'Trade Promotion' | 'Strategic Pricing' | 'Assortment & Portfolio' | 'Governance & Risk' | 'Customer JBP';
  description: string;
  sbdFocus: string;
  retailer: string;
  triggerType: 'Anomaly-Driven' | 'Scheduled Cycle' | 'Continuous Stream' | 'On-Demand';
  triggerSchedule: string;
  autonomyLevel: AutonomyTier;
  status: 'Active' | 'Running' | 'Standby' | 'Attention Required';
  metrics: {
    primaryImpact: string;
    secondaryMetric: string;
    executionLatency: string;
    successRate: string;
    totalRuns: number;
    lastRunTime: string;
  };
  stages: WorkflowStage[];
  simulationData: WorkflowSimulationData;
}
