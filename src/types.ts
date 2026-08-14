export interface Retailer {
  id: string;
  name: string;
  logo: string;
}

export interface ProductLine {
  id: string;
  name: string;
  brand: 'DeWalt' | 'Stanley' | 'Craftsman' | 'Irwin';
  sku: string;
  basePrice: number;
  elasticity: number;
}

export interface PromoSimulationResult {
  discountDepth: number;
  incrementalLiftVolume: number;
  crossBrandCannibalization: number;
  netRevenueLift: number;
  roi: number;
  recommendation: string;
  status: string;
}

export interface ElasticityCell {
  category: string;
  channel: string;
  coefficient: number;
  baselineVolume: number;
}

export interface PricingSimulationResult {
  originalPrice: number;
  recommendedPrice: number;
  volumeChangePct: number;
  netMarginChangePct: number;
  elasticityScore: number;
  apexRevenue: number;
}

export interface SKUItem {
  id: string;
  name: string;
  brand: 'DeWalt' | 'Stanley' | 'Craftsman' | 'Irwin';
  status: 'Active' | 'Optimized' | 'Delisted' | 'Upgraded';
  demandTransference?: number;
  volume: number;
  revenue: number;
  shelfPosition: number;
}

export interface KitComponent {
  id: string;
  name: string;
  baseCost: number;
  wtpContribution: number;
}
