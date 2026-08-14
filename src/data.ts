import { Retailer, ProductLine, ElasticityCell, SKUItem, KitComponent } from './types';

export const RETAILERS: Retailer[] = [
  { id: 'hd', name: 'Home Depot', logo: '🟧' },
  { id: 'lowes', name: 'Lowe\'s', logo: '🟦' },
  { id: 'amazon', name: 'Amazon', logo: '⬛' }
];

export const PRODUCT_LINES: ProductLine[] = [
  { id: 'dewalt_drill', name: 'DeWalt 20V Max Drill Kit', brand: 'DeWalt', sku: 'DCD771C2', basePrice: 199.00, elasticity: -1.8 },
  { id: 'stanley_tape', name: 'Stanley FatMax 25ft Tape', brand: 'Stanley', sku: 'FMHT33502S', basePrice: 14.99, elasticity: -1.2 },
  { id: 'craftsman_jigsaw', name: 'Craftsman V20 Cordless Jigsaw', brand: 'Craftsman', sku: 'CMCS600B', basePrice: 89.00, elasticity: -2.1 },
  { id: 'irwin_vise_grip', name: 'Irwin Vise-Grip Plier Set', brand: 'Irwin', sku: 'IRW105054', basePrice: 24.99, elasticity: -1.4 }
];

export const ELASTICITY_GRID: ElasticityCell[] = [
  { category: 'Power Tools', channel: 'Home Depot', coefficient: -2.4, baselineVolume: 12500 },
  { category: 'Power Tools', channel: 'Lowe\'s', coefficient: -2.2, baselineVolume: 9800 },
  { category: 'Power Tools', channel: 'Industrial Dist.', coefficient: -1.2, baselineVolume: 5400 },
  { category: 'Hand Tools', channel: 'Home Depot', coefficient: -1.4, baselineVolume: 32000 },
  { category: 'Hand Tools', channel: 'Lowe\'s', coefficient: -1.3, baselineVolume: 28500 },
  { category: 'Hand Tools', channel: 'Industrial Dist.', coefficient: -0.9, baselineVolume: 15100 },
  { category: 'Storage', channel: 'Home Depot', coefficient: -1.8, baselineVolume: 18400 },
  { category: 'Storage', channel: 'Lowe\'s', coefficient: -1.9, baselineVolume: 14200 },
  { category: 'Storage', channel: 'Industrial Dist.', coefficient: -1.1, baselineVolume: 8900 }
];

export const PORTFOLIO_SKUS: SKUItem[] = [
  { id: 'dw_socket_12', name: 'DeWalt 12-Pc Socket Set', brand: 'DeWalt', status: 'Active', demandTransference: 84, volume: 4500, revenue: 134500, shelfPosition: 1 },
  { id: 'dw_socket_15', name: 'DeWalt 15-Pc Socket Set', brand: 'DeWalt', status: 'Active', volume: 6200, revenue: 309900, shelfPosition: 2 },
  { id: 'irwin_pliers', name: 'Irwin Vise-Grip', brand: 'Irwin', status: 'Active', volume: 8200, revenue: 204900, shelfPosition: 3 },
  { id: 'stanley_hammer', name: 'Stanley FatMax Claw Hammer', brand: 'Stanley', status: 'Active', volume: 11000, revenue: 219900, shelfPosition: 4 },
  { id: 'craftsman_wrench', name: 'Craftsman Adjustable Wrench', brand: 'Craftsman', status: 'Active', volume: 7500, revenue: 112500, shelfPosition: 5 }
];

export const KIT_COMPONENTS: KitComponent[] = [
  { id: 'drill_body', name: '20V Cordless Drill Body', baseCost: 45, wtpContribution: 85 },
  { id: 'battery_2ah', name: '2.0Ah Battery Pack', baseCost: 15, wtpContribution: 30 },
  { id: 'battery_5ah', name: '5.0Ah Premium Battery', baseCost: 35, wtpContribution: 65 },
  { id: 'tough_case', name: 'ToughSystem Storage Case', baseCost: 20, wtpContribution: 40 }
];

export const DIAGNOSTIC_METRICS = {
  dw_drill: {
    historicalYoY: '+6.2%',
    promoFrequency: '4x/year',
    avgRetailerMargin: '32.4%',
    optimalPromoWindow: 'Father\'s Day Q2',
    outOfStockRisk: 'Low'
  },
  stanley_tape: {
    historicalYoY: '+1.5%',
    promoFrequency: '8x/year',
    avgRetailerMargin: '41.2%',
    optimalPromoWindow: 'Black Friday Q4',
    outOfStockRisk: 'Medium'
  },
  craftsman_jigsaw: {
    historicalYoY: '+12.4%',
    promoFrequency: '2x/year',
    avgRetailerMargin: '28.5%',
    optimalPromoWindow: 'Spring Deals Q1',
    outOfStockRisk: 'High'
  },
  irwin_vise_grip: {
    historicalYoY: '+3.1%',
    promoFrequency: '3x/year',
    avgRetailerMargin: '38.0%',
    optimalPromoWindow: 'Holiday Gifting Q4',
    outOfStockRisk: 'Low'
  }
};
