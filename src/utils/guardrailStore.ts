export interface GuardrailCondition {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  brand: string;
  status: 'active' | 'warning' | 'dormant';
  lastChecked: string;
  violationsCount: number;
  violationDetail?: string;
  targetPcr?: string;
}

export const INITIAL_GUARDRAILS: GuardrailCondition[] = [
  {
    id: 'gr-1',
    name: 'GTN Spend Cap Watchdog',
    metric: 'GTN Spend',
    condition: 'exceeds plan by >',
    threshold: '5%',
    brand: 'DeWalt',
    status: 'active',
    lastChecked: '4 mins ago',
    violationsCount: 0,
    violationDetail: 'All active DeWalt Q4 promotional spends remain within the 5% margin tolerance.'
  },
  {
    id: 'gr-2',
    name: 'Minimum Margin Sentinel',
    metric: 'SGM Margin',
    condition: 'drops below floor',
    threshold: '24.0%',
    brand: 'All Brands',
    status: 'warning',
    lastChecked: '12 mins ago',
    violationsCount: 1,
    violationDetail: 'Breach detected on PCR-2026-0835 (Craftsman Promo): SGM realized at 21.8% vs 24.0% minimum floor.',
    targetPcr: 'PCR-2026-0835'
  },
  {
    id: 'gr-3',
    name: 'Trade ROI Guard',
    metric: 'Promo ROI',
    condition: 'falls below',
    threshold: '1.5x',
    brand: 'Craftsman / Irwin',
    status: 'active',
    lastChecked: '25 mins ago',
    violationsCount: 0,
    violationDetail: 'Blended ROI across Craftsman/Irwin closed events is 2.14x (compliant with 1.5x floor).'
  },
  {
    id: 'gr-4',
    name: 'Price Elasticity Drift Alert',
    metric: 'Elasticity Sensitivity',
    condition: 'cross-elasticity drift exceeds',
    threshold: '0.35 index',
    brand: 'DeWalt 20V MAX',
    status: 'active',
    lastChecked: '1 hour ago',
    violationsCount: 0,
    violationDetail: 'DeWalt vs Milwaukee cross-elasticity stable at 0.38 index.'
  }
];

const STORAGE_KEY = 'sbd_rgm_guardrail_conditions';

export function getSharedGuardrails(): GuardrailCondition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return INITIAL_GUARDRAILS;
}

export function saveSharedGuardrails(rules: GuardrailCondition[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    window.dispatchEvent(new CustomEvent('rgm-guardrails-updated', { detail: rules }));
  } catch (e) {
    // ignore
  }
}
