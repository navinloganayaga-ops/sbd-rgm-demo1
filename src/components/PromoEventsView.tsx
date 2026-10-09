import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp,
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Tag,
  Calendar,
  X,
  Sparkles,
  Bot,
  Sliders,
  Send,
  Download,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Bell,
  Check,
  Eye,
  BarChart3,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Info,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import GlobalFilterBar, { FilterState } from './GlobalFilterBar';
import { NavItem } from './Sidebar';
import { getSharedGuardrails, saveSharedGuardrails } from '../utils/guardrailStore';

export interface PromoEventsViewProps {
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  onFilterApply: () => void;
  onNavigateTab?: (item: NavItem, payload?: any) => void;
}

export interface PromotedSku {
  skuId: string;
  name: string;
  basePrice: string;
  promoPrice: string;
  discountPct: string;
  units: string;
  retailSales: string;
  tradeSpend: string;
  sgmMargin: string;
  elasticityIndex: string;
  status: 'Optimal' | 'Sub-optimal' | 'Breach';
}

export interface EventRow {
  pcrNumber: string;
  title: string;
  bu: string;
  brand: string;
  customer: string;
  timing: string;
  dates: string;
  mechanic: string;
  status: 'Completed' | 'In Review' | 'Draft';
  health: 'optimal' | 'healthy' | 'warning' | 'critical';
  anomalyNote?: string;
  skuCount: number;
  skus: PromotedSku[];
  
  // 1. Demand & Topline
  posUnitsAct: string;
  posUnitsPlan: string;
  posUnitsPct: string;
  posUnitsVar: string;
  posUnitsVarIsNegative: boolean;

  posRetailAct: string;
  posRetailPlan: string;
  posRetailPct: string;
  posRetailVar: string;
  posRetailVarIsNegative: boolean;

  posInvoiceAct: string;
  posInvoicePlan: string;
  posInvoicePct: string;
  posInvoiceVar: string;

  // 2. Trade Spend
  merchantSpendAct: string;
  merchantSpendPlan: string;
  
  rsaAdjAct: string;
  rsaAdjPlan: string;
  rsaAdjPct: string;
  rsaAdjVar: string;
  
  totalTradeSpendAct: string;
  totalTradeSpendPlan: string;
  totalTradeSpendPct: string;
  totalTradeSpendVar: string;

  // 3. Net Value & Profitability
  roi: string;
  
  nsvAct: string;
  nsvPlan: string;
  nsvPct: string;
  nsvVar: string;
  nsvVarIsNegative: boolean;

  sgmAct: string;
  sgmPlan: string;
  agmAct: string;
  agmPlan: string;

  dropThruSgmAct: string;
  dropThruSgmPlan: string;
  dropThruAgmAct: string;
  dropThruAgmPlan: string;

  // Quick legacy helpers
  units: string;
  retailSales: string;
  tradeSpend: string;
  nsv: string;
  sgmMargin: string;
  sgmVarianceBps: string;
}

interface GuardrailRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  brand: string;
  status: 'active' | 'warning' | 'dormant';
  lastChecked: string;
  violationsCount: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  chips?: string[];
  dataWidget?: 'waterfall' | 'skuList' | 'guardrailSuggestion';
}

export default function PromoEventsView({ 
  filterState, 
  onFilterChange, 
  onFilterApply,
  onNavigateTab 
}: PromoEventsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  
  // Agentic Features State
  const [isSynthesisExpanded, setIsSynthesisExpanded] = useState(true);
  const [activeWaterfallModal, setActiveWaterfallModal] = useState<'posUnits' | 'retailSales' | 'nsv' | 'tradeSpend' | null>(null);
  const [isGuardrailModalOpen, setIsGuardrailModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bottom Section View & Multi-select State (Replicated from Tool Screenshot)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'PCR-2026-0812': true, // Expanded by default to showcase replicated rich card structure
    'PCR-2026-0835': false
  });
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState('All');
  const [selectedHealthFilter, setSelectedHealthFilter] = useState('All');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  const toggleCardExpanded = (pcrNumber: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [pcrNumber]: !prev[pcrNumber]
    }));
  };

  const toggleSelectEvent = (pcrNumber: string) => {
    setSelectedEventIds(prev => 
      prev.includes(pcrNumber) ? prev.filter(id => id !== pcrNumber) : [...prev, pcrNumber]
    );
  };

  const handleSelectAll = (eventsToSelect: EventRow[]) => {
    if (selectedEventIds.length === eventsToSelect.length && eventsToSelect.length > 0) {
      setSelectedEventIds([]);
    } else {
      setSelectedEventIds(eventsToSelect.map(e => e.pcrNumber));
    }
  };

  // New Guardrail Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleMetric, setNewRuleMetric] = useState('GTN Spend');
  const [newRuleCondition, setNewRuleCondition] = useState('exceeds plan by >');
  const [newRuleThreshold, setNewRuleThreshold] = useState('5%');
  const [newRuleBrand, setNewRuleBrand] = useState('DeWalt');

  // Guardrail Rules Collection (Shared with RGM AI Copilot)
  const [guardrailRules, setGuardrailRules] = useState<GuardrailRule[]>(() => {
    return getSharedGuardrails() as GuardrailRule[];
  });

  useEffect(() => {
    const handleUpdate = () => {
      setGuardrailRules(getSharedGuardrails() as GuardrailRule[]);
    };
    window.addEventListener('rgm-guardrails-updated', handleUpdate);
    return () => window.removeEventListener('rgm-guardrails-updated', handleUpdate);
  }, []);

  // Floating Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      timestamp: '10:42 AM',
      text: "Hello! I am your SBD Promo Intelligence Agent. I've analyzed all 12 closed Q1 promotional events across PTG and HTAS. POS volume fell short by -19.2% (-83.0K units), but SGM margin expanded by +367 bps due to disciplined trade spend execution. What would you like to explore?",
      chips: [
        "Why did POS units miss plan?",
        "Deconstruct Home Depot Drill promo drag",
        "Which event had highest ROI?",
        "Pass underperforming events to Optimizer"
      ]
    }
  ]);

  // Toast Notification Trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sample Events Data matching SBD Enterprise RGM Context & Tool Screenshots
  const sampleEvents: EventRow[] = [
    { 
      pcrNumber: 'PCR-2026-0812', 
      title: 'Q1 DeWalt 20V Drill Blitz', 
      bu: 'Power Tools Group', 
      brand: 'DeWalt', 
      customer: 'Home Depot', 
      timing: 'Q1 2026',
      dates: '01/12/2026 - 02/09/2026 · 4 Wks',
      mechanic: 'Feature & Display (Endcap + Circular Ad)',
      status: 'Completed', 
      health: 'warning',
      anomalyNote: 'Promo depth executed at 22% vs optimal 15% elasticity boundary. Diminishing returns failed to yield incremental volume.',
      skuCount: 14,
      skus: [
        { skuId: 'DCD771C2', name: '20V MAX 1/2-in Cordless Compact Drill Kit', basePrice: '$159.00', promoPrice: '$119.00', discountPct: '25%', units: '72,400', retailSales: '$8.6M', tradeSpend: '$1.4M', sgmMargin: '27.4%', elasticityIndex: '0.64x (Drag)', status: 'Sub-optimal' },
        { skuId: 'DCF885C1', name: '20V MAX 1/4-in Impact Driver Kit', basePrice: '$149.00', promoPrice: '$119.00', discountPct: '20%', units: '32,100', retailSales: '$3.8M', tradeSpend: '$650K', sgmMargin: '28.2%', elasticityIndex: '0.88x (Elastic)', status: 'Optimal' },
        { skuId: 'DCB205-2', name: '20V MAX 5.0Ah Dual Battery Pack Companion', basePrice: '$199.00', promoPrice: '$159.00', discountPct: '20%', units: '14,200', retailSales: '$2.3M', tradeSpend: '$480K', sgmMargin: '31.5%', elasticityIndex: '1.25x (High Lift)', status: 'Optimal' },
        { skuId: 'DCD791B', name: '20V MAX XR Brushless Drill (Bare Tool)', basePrice: '$139.00', promoPrice: '$119.00', discountPct: '14%', units: '5,800', retailSales: '$690K', tradeSpend: '$120K', sgmMargin: '29.8%', elasticityIndex: '1.05x (Balanced)', status: 'Optimal' }
      ],
      posUnitsAct: '124.5K',
      posUnitsPlan: '172.7K',
      posUnitsPct: '72% of plan',
      posUnitsVar: '-48.2K vs 172.7K',
      posUnitsVarIsNegative: true,
      posRetailAct: '$18.2M',
      posRetailPlan: '$24.6M',
      posRetailPct: '74% of plan',
      posRetailVar: '-$6.4M vs $24.6M',
      posRetailVarIsNegative: true,
      posInvoiceAct: '$13.1M',
      posInvoicePlan: '$17.5M',
      posInvoicePct: '75% of plan',
      posInvoiceVar: '-$4.4M vs $17.5M',
      merchantSpendAct: '$1.8M',
      merchantSpendPlan: '$2.1M',
      rsaAdjAct: '$1.3M',
      rsaAdjPlan: '$1.6M',
      rsaAdjPct: '81% of plan',
      rsaAdjVar: '-$300.0K vs $1.6M',
      totalTradeSpendAct: '$3.1M',
      totalTradeSpendPlan: '$3.9M',
      totalTradeSpendPct: '79% of plan',
      totalTradeSpendVar: '-$820.0K vs $3.9M',
      roi: '1.62x',
      nsvAct: '$11.8M',
      nsvPlan: '$16.4M',
      nsvPct: '72% of plan',
      nsvVar: '-$4.6M vs $16.4M',
      nsvVarIsNegative: true,
      sgmAct: '28.4%',
      sgmPlan: '24.2%',
      agmAct: '29.1%',
      agmPlan: '27.0%',
      dropThruSgmAct: '7.4%',
      dropThruSgmPlan: '5.8%',
      dropThruAgmAct: '12.6%',
      dropThruAgmPlan: '11.1%',
      units: '124.5K',
      retailSales: '$18.2M',
      tradeSpend: '$3.1M',
      nsv: '$11.8M',
      sgmMargin: '+28.4%',
      sgmVarianceBps: '+412 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0815', 
      title: 'Stanley FatMax Tape 2-Pk Promo', 
      bu: 'Hand Tools & Accessories', 
      brand: 'Stanley', 
      customer: 'Lowe\'s', 
      timing: 'Q1 2026',
      dates: '01/19/2026 - 02/16/2026 · 4 Wks',
      mechanic: 'Co-op Circular Feature + Dump Bin Display',
      status: 'Completed', 
      health: 'optimal',
      anomalyNote: 'High retailer pass-through rate (92%) with zero margin leakage and strong attachment to contractor toolbelts.',
      skuCount: 6,
      skus: [
        { skuId: 'FMHT33525', name: 'FatMax 25ft Tape Measure 2-Pack Special Buy', basePrice: '$34.97', promoPrice: '$24.97', discountPct: '28%', units: '58,200', retailSales: '$1.45M', tradeSpend: '$210K', sgmMargin: '32.1%', elasticityIndex: '1.42x (High Lift)', status: 'Optimal' },
        { skuId: 'FMHT33835', name: 'FatMax 35ft Heavy-Duty Tape Measure', basePrice: '$29.97', promoPrice: '$24.97', discountPct: '16%', units: '18,400', retailSales: '$460K', tradeSpend: '$85K', sgmMargin: '30.4%', elasticityIndex: '1.18x (Elastic)', status: 'Optimal' },
        { skuId: 'STHT77403', name: 'Stanley Classic Box Beam Level 48-in', basePrice: '$39.97', promoPrice: '$32.97', discountPct: '17%', units: '8,600', retailSales: '$283K', tradeSpend: '$45K', sgmMargin: '29.8%', elasticityIndex: '1.10x (Healthy)', status: 'Optimal' }
      ],
      posUnitsAct: '85.2K',
      posUnitsPlan: '79.2K',
      posUnitsPct: '108% of plan',
      posUnitsVar: '+6.0K vs 79.2K',
      posUnitsVarIsNegative: false,
      posRetailAct: '$6.4M',
      posRetailPlan: '$5.8M',
      posRetailPct: '110% of plan',
      posRetailVar: '+$600.0K vs $5.8M',
      posRetailVarIsNegative: false,
      posInvoiceAct: '$4.9M',
      posInvoicePlan: '$4.4M',
      posInvoicePct: '111% of plan',
      posInvoiceVar: '+$500.0K vs $4.4M',
      merchantSpendAct: '$420K',
      merchantSpendPlan: '$500K',
      rsaAdjAct: '$560K',
      rsaAdjPlan: '$580K',
      rsaAdjPct: '97% of plan',
      rsaAdjVar: '-$20.0K vs $580K',
      totalTradeSpendAct: '$980K',
      totalTradeSpendPlan: '$1.1M',
      totalTradeSpendPct: '89% of plan',
      totalTradeSpendVar: '-$120.0K vs $1.1M',
      roi: '2.84x',
      nsvAct: '$4.2M',
      nsvPlan: '$3.8M',
      nsvPct: '111% of plan',
      nsvVar: '+$400.0K vs $3.8M',
      nsvVarIsNegative: false,
      sgmAct: '31.2%',
      sgmPlan: '26.8%',
      agmAct: '32.4%',
      agmPlan: '29.1%',
      dropThruSgmAct: '8.9%',
      dropThruSgmPlan: '6.4%',
      dropThruAgmAct: '14.2%',
      dropThruAgmPlan: '12.0%',
      units: '85.2K',
      retailSales: '$6.4M',
      tradeSpend: '$980K',
      nsv: '$4.2M',
      sgmMargin: '+31.2%',
      sgmVarianceBps: '+785 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0819', 
      title: 'Craftsman Mechanics Set Spring Deal', 
      bu: 'Hand Tools & Accessories', 
      brand: 'Craftsman', 
      customer: 'Amazon', 
      timing: 'Q1 2026',
      dates: '02/01/2026 - 02/28/2026 · 4 Wks',
      mechanic: 'Digital Deal of the Day + Prime Lightning Deal',
      status: 'Completed', 
      health: 'healthy',
      anomalyNote: 'Strong digital conversion with stable search ranking; modest cannibalization of 3-piece individual ratchets.',
      skuCount: 8,
      skus: [
        { skuId: 'CMMT12024', name: 'Craftsman 121-Pc Mechanics Tool Set with Chest', basePrice: '$129.00', promoPrice: '$99.00', discountPct: '23%', units: '24,200', retailSales: '$2.4M', tradeSpend: '$420K', sgmMargin: '25.6%', elasticityIndex: '1.14x (Elastic)', status: 'Optimal' },
        { skuId: 'CMMT45300', name: 'Craftsman 230-Pc Versastack Mechanics Set', basePrice: '$199.00', promoPrice: '$159.00', discountPct: '20%', units: '12,500', retailSales: '$1.98M', tradeSpend: '$380K', sgmMargin: '24.8%', elasticityIndex: '0.98x (Neutral)', status: 'Optimal' }
      ],
      posUnitsAct: '42.0K',
      posUnitsPlan: '44.5K',
      posUnitsPct: '94% of plan',
      posUnitsVar: '-2.5K vs 44.5K',
      posUnitsVarIsNegative: true,
      posRetailAct: '$8.5M',
      posRetailPlan: '$8.9M',
      posRetailPct: '96% of plan',
      posRetailVar: '-$400.0K vs $8.9M',
      posRetailVarIsNegative: true,
      posInvoiceAct: '$6.3M',
      posInvoicePlan: '$6.6M',
      posInvoicePct: '95% of plan',
      posInvoiceVar: '-$300.0K vs $6.6M',
      merchantSpendAct: '$680K',
      merchantSpendPlan: '$700K',
      rsaAdjAct: '$720K',
      rsaAdjPlan: '$750K',
      rsaAdjPct: '96% of plan',
      rsaAdjVar: '-$30.0K vs $750K',
      totalTradeSpendAct: '$1.4M',
      totalTradeSpendPlan: '$1.5M',
      totalTradeSpendPct: '93% of plan',
      totalTradeSpendVar: '-$100.0K vs $1.5M',
      roi: '2.15x',
      nsvAct: '$5.6M',
      nsvPlan: '$5.8M',
      nsvPct: '97% of plan',
      nsvVar: '-$200.0K vs $5.8M',
      nsvVarIsNegative: true,
      sgmAct: '25.1%',
      sgmPlan: '24.5%',
      agmAct: '26.4%',
      agmPlan: '25.8%',
      dropThruSgmAct: '6.5%',
      dropThruSgmPlan: '6.1%',
      dropThruAgmAct: '11.0%',
      dropThruAgmPlan: '10.5%',
      units: '42.0K',
      retailSales: '$8.5M',
      tradeSpend: '$1.4M',
      nsv: '$5.6M',
      sgmMargin: '+25.1%',
      sgmVarianceBps: '+180 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0824', 
      title: 'DeWalt ToughSystem Storage Promo', 
      bu: 'Storage & Workspace', 
      brand: 'DeWalt', 
      customer: 'Home Depot', 
      timing: 'Q1 2026',
      dates: '02/10/2026 - 03/10/2026 · 4 Wks',
      mechanic: 'Pro Contractor ProDesk Endcap + Floor Stack',
      status: 'Completed', 
      health: 'optimal',
      anomalyNote: 'Modular rolling system basket attachment rate was 1.6x baseline, elevating high-margin accessory sales.',
      skuCount: 12,
      skus: [
        { skuId: 'DWST08201', name: 'ToughSystem 2.0 Mobile Storage Cart Carrier', basePrice: '$89.00', promoPrice: '$69.00', discountPct: '22%', units: '21,500', retailSales: '$1.48M', tradeSpend: '$240K', sgmMargin: '29.4%', elasticityIndex: '1.38x (High Lift)', status: 'Optimal' },
        { skuId: 'DWST08203', name: 'ToughSystem 2.0 Deep Box Organizer', basePrice: '$59.00', promoPrice: '$49.00', discountPct: '17%', units: '17,300', retailSales: '$847K', tradeSpend: '$130K', sgmMargin: '28.5%', elasticityIndex: '1.22x (Elastic)', status: 'Optimal' }
      ],
      posUnitsAct: '38.8K',
      posUnitsPlan: '36.2K',
      posUnitsPct: '107% of plan',
      posUnitsVar: '+2.6K vs 36.2K',
      posUnitsVarIsNegative: false,
      posRetailAct: '$7.1M',
      posRetailPlan: '$6.5M',
      posRetailPct: '109% of plan',
      posRetailVar: '+$600.0K vs $6.5M',
      posRetailVarIsNegative: false,
      posInvoiceAct: '$5.3M',
      posInvoicePlan: '$4.9M',
      posInvoicePct: '108% of plan',
      posInvoiceVar: '+$400.0K vs $4.9M',
      merchantSpendAct: '$550K',
      merchantSpendPlan: '$600K',
      rsaAdjAct: '$650K',
      rsaAdjPlan: '$650K',
      rsaAdjPct: '100% of plan',
      rsaAdjVar: '$0.0 vs $650K',
      totalTradeSpendAct: '$1.2M',
      totalTradeSpendPlan: '$1.3M',
      totalTradeSpendPct: '92% of plan',
      totalTradeSpendVar: '-$100.0K vs $1.3M',
      roi: '2.42x',
      nsvAct: '$4.9M',
      nsvPlan: '$4.4M',
      nsvPct: '111% of plan',
      nsvVar: '+$500.0K vs $4.4M',
      nsvVarIsNegative: false,
      sgmAct: '29.0%',
      sgmPlan: '25.6%',
      agmAct: '30.2%',
      agmPlan: '27.4%',
      dropThruSgmAct: '8.1%',
      dropThruSgmPlan: '6.2%',
      dropThruAgmAct: '13.5%',
      dropThruAgmPlan: '11.4%',
      units: '38.8K',
      retailSales: '$7.1M',
      tradeSpend: '$1.2M',
      nsv: '$4.9M',
      sgmMargin: '+29.0%',
      sgmVarianceBps: '+530 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0830', 
      title: 'Irwin Vise-Grip Hardware Month', 
      bu: 'Hand Tools & Accessories', 
      brand: 'Irwin', 
      customer: 'Ace Hardware', 
      timing: 'Q1 2026',
      dates: '02/15/2026 - 03/15/2026 · 4 Wks',
      mechanic: 'Hardware Wholesaler Circular + Front Counter Display',
      status: 'Completed', 
      health: 'optimal',
      anomalyNote: 'Highest gross-to-net realization across channel (+94.2%) with exceptional merchant pass-through rate.',
      skuCount: 5,
      skus: [
        { skuId: 'IRW-2078107', name: 'Vise-Grip 7-in Curved Jaw Locking Pliers', basePrice: '$18.99', promoPrice: '$14.99', discountPct: '21%', units: '14,200', retailSales: '$212K', tradeSpend: '$28K', sgmMargin: '33.8%', elasticityIndex: '1.45x (High Lift)', status: 'Optimal' },
        { skuId: 'IRW-2078110', name: 'Vise-Grip 10-in Original Locking Wrench Tool', basePrice: '$22.99', promoPrice: '$17.99', discountPct: '22%', units: '7,300', retailSales: '$131K', tradeSpend: '$18K', sgmMargin: '31.9%', elasticityIndex: '1.30x (Elastic)', status: 'Optimal' }
      ],
      posUnitsAct: '21.5K',
      posUnitsPlan: '19.8K',
      posUnitsPct: '109% of plan',
      posUnitsVar: '+1.7K vs 19.8K',
      posUnitsVarIsNegative: false,
      posRetailAct: '$2.1M',
      posRetailPlan: '$1.9M',
      posRetailPct: '111% of plan',
      posRetailVar: '+$200.0K vs $1.9M',
      posRetailVarIsNegative: false,
      posInvoiceAct: '$1.6M',
      posInvoicePlan: '$1.4M',
      posInvoicePct: '114% of plan',
      posInvoiceVar: '+$200.0K vs $1.4M',
      merchantSpendAct: '$140K',
      merchantSpendPlan: '$160K',
      rsaAdjAct: '$180K',
      rsaAdjPlan: '$190K',
      rsaAdjPct: '95% of plan',
      rsaAdjVar: '-$10.0K vs $190K',
      totalTradeSpendAct: '$320K',
      totalTradeSpendPlan: '$350K',
      totalTradeSpendPct: '91% of plan',
      totalTradeSpendVar: '-$30.0K vs $350K',
      roi: '3.12x',
      nsvAct: '$1.4M',
      nsvPlan: '$1.2M',
      nsvPct: '117% of plan',
      nsvVar: '+$200.0K vs $1.2M',
      nsvVarIsNegative: false,
      sgmAct: '32.8%',
      sgmPlan: '26.5%',
      agmAct: '34.0%',
      agmPlan: '28.2%',
      dropThruSgmAct: '9.8%',
      dropThruSgmPlan: '6.8%',
      dropThruAgmAct: '15.4%',
      dropThruAgmPlan: '12.1%',
      units: '21.5K',
      retailSales: '$2.1M',
      tradeSpend: '$320K',
      nsv: '$1.4M',
      sgmMargin: '+32.8%',
      sgmVarianceBps: '+910 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0835', 
      title: 'DeWalt 12-in Miter Saw & Stand Combo', 
      bu: 'Power Tools Group', 
      brand: 'DeWalt', 
      customer: 'Lowe\'s', 
      timing: 'Q1 2026',
      dates: '02/20/2026 - 03/20/2026 · 4 Wks',
      mechanic: 'Lowe\'s Spring Pro Black Friday Feature Ad',
      status: 'Completed', 
      health: 'critical',
      anomalyNote: 'Breached SGM margin floor (22.4% vs 24.0% guardrail limit) due to unbudgeted retailer markdown markdown co-op and week 8 stockouts.',
      skuCount: 4,
      skus: [
        { skuId: 'DWS779', name: '12-in Sliding Compound Miter Saw', basePrice: '$499.00', promoPrice: '$399.00', discountPct: '20%', units: '11,200', retailSales: '$4.46M', tradeSpend: '$560K', sgmMargin: '21.8%', elasticityIndex: '0.51x (Deficit)', status: 'Breach' },
        { skuId: 'DWX723', name: 'Heavy-Duty Miter Saw Rolling Stand', basePrice: '$249.00', promoPrice: '$199.00', discountPct: '20%', units: '7,300', retailSales: '$1.45M', tradeSpend: '$240K', sgmMargin: '23.4%', elasticityIndex: '0.62x (Sub-optimal)', status: 'Breach' }
      ],
      posUnitsAct: '18.5K',
      posUnitsPlan: '37.0K',
      posUnitsPct: '50% of plan',
      posUnitsVar: '-18.5K vs 37.0K',
      posUnitsVarIsNegative: true,
      posRetailAct: '$2.5M',
      posRetailPlan: '$5.0M',
      posRetailPct: '50% of plan',
      posRetailVar: '-$2.5M vs $5.0M',
      posRetailVarIsNegative: true,
      posInvoiceAct: '$2.0M',
      posInvoicePlan: '$4.0M',
      posInvoicePct: '50% of plan',
      posInvoiceVar: '-$2.0M vs $4.0M',
      merchantSpendAct: '$380K',
      merchantSpendPlan: '$450K',
      rsaAdjAct: '$420K',
      rsaAdjPlan: '$450K',
      rsaAdjPct: '93% of plan',
      rsaAdjVar: '-$30.0K vs $450K',
      totalTradeSpendAct: '$800K',
      totalTradeSpendPlan: '$900K',
      totalTradeSpendPct: '89% of plan',
      totalTradeSpendVar: '-$100.0K vs $900K',
      roi: '1.24x',
      nsvAct: '$1.8M',
      nsvPlan: '$3.5M',
      nsvPct: '51% of plan',
      nsvVar: '-$1.7M vs $3.5M',
      nsvVarIsNegative: true,
      sgmAct: '22.4%',
      sgmPlan: '24.8%',
      agmAct: '23.1%',
      agmPlan: '26.0%',
      dropThruSgmAct: '4.8%',
      dropThruSgmPlan: '6.2%',
      dropThruAgmAct: '9.2%',
      dropThruAgmPlan: '11.5%',
      units: '18.5K',
      retailSales: '$2.5M',
      tradeSpend: '$800K',
      nsv: '$1.8M',
      sgmMargin: '+22.4%',
      sgmVarianceBps: '-95 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0842', 
      title: 'DeWalt Atomic 20V Compact Impact Kit', 
      bu: 'Power Tools Group', 
      brand: 'DeWalt', 
      customer: 'Home Depot', 
      timing: 'Q1 2026',
      dates: '03/01/2026 - 03/29/2026 · 4 Wks',
      mechanic: 'Spring Pro Appreciation Event Endcap Feature',
      status: 'Completed', 
      health: 'healthy',
      anomalyNote: 'Balanced promo window with stable inventory replenishment across all district warehouses.',
      skuCount: 7,
      skus: [
        { skuId: 'DCF850P1', name: 'Atomic 20V MAX 1/4-in 3-Speed Impact Driver Kit', basePrice: '$199.00', promoPrice: '$159.00', discountPct: '20%', units: '22,400', retailSales: '$3.56M', tradeSpend: '$580K', sgmMargin: '27.9%', elasticityIndex: '1.08x (Healthy)', status: 'Optimal' },
        { skuId: 'DCD708C2', name: 'Atomic 20V MAX 1/2-in Drill Kit', basePrice: '$179.00', promoPrice: '$149.00', discountPct: '17%', units: '13,000', retailSales: '$1.93M', tradeSpend: '$370K', sgmMargin: '27.1%', elasticityIndex: '1.02x (Healthy)', status: 'Optimal' }
      ],
      posUnitsAct: '35.4K',
      posUnitsPlan: '36.8K',
      posUnitsPct: '96% of plan',
      posUnitsVar: '-1.4K vs 36.8K',
      posUnitsVarIsNegative: true,
      posRetailAct: '$5.8M',
      posRetailPlan: '$6.0M',
      posRetailPct: '97% of plan',
      posRetailVar: '-$200.0K vs $6.0M',
      posRetailVarIsNegative: true,
      posInvoiceAct: '$4.3M',
      posInvoicePlan: '$4.4M',
      posInvoicePct: '98% of plan',
      posInvoiceVar: '-$100.0K vs $4.4M',
      merchantSpendAct: '$460K',
      merchantSpendPlan: '$500K',
      rsaAdjAct: '$490K',
      rsaAdjPlan: '$510K',
      rsaAdjPct: '96% of plan',
      rsaAdjVar: '-$20.0K vs $510K',
      totalTradeSpendAct: '$950K',
      totalTradeSpendPlan: '$1.0M',
      totalTradeSpendPct: '95% of plan',
      totalTradeSpendVar: '-$50.0K vs $1.0M',
      roi: '2.04x',
      nsvAct: '$3.9M',
      nsvPlan: '$4.0M',
      nsvPct: '98% of plan',
      nsvVar: '-$100.0K vs $4.0M',
      nsvVarIsNegative: true,
      sgmAct: '27.6%',
      sgmPlan: '26.2%',
      agmAct: '28.8%',
      agmPlan: '27.5%',
      dropThruSgmAct: '7.3%',
      dropThruSgmPlan: '6.4%',
      dropThruAgmAct: '12.2%',
      dropThruAgmPlan: '11.3%',
      units: '35.4K',
      retailSales: '$5.8M',
      tradeSpend: '$950K',
      nsv: '$3.9M',
      sgmMargin: '+27.6%',
      sgmVarianceBps: '+340 bps'
    },
    { 
      pcrNumber: 'PCR-2026-0850', 
      title: 'Stanley ProLine Level & Laser Bundle', 
      bu: 'Hand Tools & Accessories', 
      brand: 'Stanley', 
      customer: 'Menards', 
      timing: 'Q1 2026',
      dates: '03/05/2026 - 04/02/2026 · 4 Wks',
      mechanic: '11% Rebate Week Circular Feature Tab',
      status: 'Completed', 
      health: 'optimal',
      anomalyNote: 'High trade ROI (2.4x) on contractor-focused endcap feature with excellent margin realization.',
      skuCount: 3,
      skus: [
        { skuId: 'STHT77340', name: 'Cross-Line Laser Level Self-Leveling Kit', basePrice: '$89.00', promoPrice: '$69.00', discountPct: '22%', units: '9,800', retailSales: '$676K', tradeSpend: '$120K', sgmMargin: '31.2%', elasticityIndex: '1.32x (High Lift)', status: 'Optimal' },
        { skuId: 'STHT43240', name: 'FatMax Torpedo Level Magnetic 9-in', basePrice: '$24.99', promoPrice: '$19.99', discountPct: '20%', units: '4,400', retailSales: '$88K', tradeSpend: '$90K', sgmMargin: '29.5%', elasticityIndex: '1.12x (Balanced)', status: 'Optimal' }
      ],
      posUnitsAct: '14.2K',
      posUnitsPlan: '12.6K',
      posUnitsPct: '113% of plan',
      posUnitsVar: '+1.6K vs 12.6K',
      posUnitsVarIsNegative: false,
      posRetailAct: '$1.4M',
      posRetailPlan: '$1.2M',
      posRetailPct: '117% of plan',
      posRetailVar: '+$200.0K vs $1.2M',
      posRetailVarIsNegative: false,
      posInvoiceAct: '$1.05M',
      posInvoicePlan: '$900K',
      posInvoicePct: '117% of plan',
      posInvoiceVar: '+$150.0K vs $900K',
      merchantSpendAct: '$95K',
      merchantSpendPlan: '$110K',
      rsaAdjAct: '$115K',
      rsaAdjPlan: '$120K',
      rsaAdjPct: '96% of plan',
      rsaAdjVar: '-$5.0K vs $120K',
      totalTradeSpendAct: '$210K',
      totalTradeSpendPlan: '$230K',
      totalTradeSpendPct: '91% of plan',
      totalTradeSpendVar: '-$20.0K vs $230K',
      roi: '2.44x',
      nsvAct: '$920K',
      nsvPlan: '$800K',
      nsvPct: '115% of plan',
      nsvVar: '+$120.0K vs $800K',
      nsvVarIsNegative: false,
      sgmAct: '30.5%',
      sgmPlan: '26.8%',
      agmAct: '31.8%',
      agmPlan: '28.0%',
      dropThruSgmAct: '8.4%',
      dropThruSgmPlan: '6.5%',
      dropThruAgmAct: '13.9%',
      dropThruAgmPlan: '11.8%',
      units: '14.2K',
      retailSales: '$1.4M',
      tradeSpend: '$210K',
      nsv: '$920K',
      sgmMargin: '+30.5%',
      sgmVarianceBps: '+620 bps'
    }
  ];

  const filteredEvents = sampleEvents.filter(ev => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.pcrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCustomer = 
      selectedCustomerFilter === 'All' || 
      ev.customer.toLowerCase().includes(selectedCustomerFilter.toLowerCase());

    const matchesHealth = 
      selectedHealthFilter === 'All' || 
      (selectedHealthFilter === 'Optimal' && ev.health === 'optimal') ||
      (selectedHealthFilter === 'Healthy' && ev.health === 'healthy') ||
      (selectedHealthFilter === 'Warning' && ev.health === 'warning') ||
      (selectedHealthFilter === 'Critical' && ev.health === 'critical');

    return matchesSearch && matchesCustomer && matchesHealth;
  });

  // Handle Passing PCR Event to Optimizer
  const handlePassToOptimizer = (event: EventRow) => {
    showToast(`⚡ Passed "${event.pcrNumber}" to Trade Promotions Optimizer! Pre-populating elasticities & constraints for Q2 planning.`);
    if (onNavigateTab) {
      setTimeout(() => {
        onNavigateTab('trade_promotions', { pcr: event.pcrNumber, brand: event.brand, customer: event.customer });
      }, 1200);
    }
  };

  // Handle Chat Prompt Execution
  const handleSendChatMessage = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // Contextual responses based on user query
    setTimeout(() => {
      let responseText = "";
      let chips: string[] = [];
      let widget: 'waterfall' | 'skuList' | 'guardrailSuggestion' | undefined = undefined;

      const q = query.toLowerCase();
      if (q.includes('why') || q.includes('miss') || q.includes('units') || q.includes('pos')) {
        responseText = "The -83.0K POS units variance (-19.2% vs plan) was concentrated in two primary drivers:\n\n1. **DeWalt 20V Drill Blitz (PCR-2026-0812)**: Missed forecast by -48.2K units because promo discount depth (22%) breached diminishing elasticity returns without generating incremental volume.\n2. **Lowe's Miter Saw Supply Gaps (PCR-2026-0835)**: Experienced 14% stockouts during promotional week 8.\n\nHowever, trade spend was curtailed by -$1.8M, preserving cash.";
        chips = ["Show SKU waterfall for Drill Blitz", "Configure Guardrail for Promo Depth", "Pass Drill Blitz to Optimizer"];
        widget = 'waterfall';
      } else if (q.includes('home depot') || q.includes('drill')) {
        responseText = "DeWalt at Home Depot generated $18.2M POS retail sales on $3.1M trade spend. While SGM margin reached +28.4% (+412 bps vs plan), lift was heavily cannibalized by adjacent non-promoted cordless kits. Re-running this in the Trade Promotions Optimizer with a 15% discount depth and $2.4M spend yields a projected +$1.2M NSV improvement.";
        chips = ["⚡ Send to Trade Optimizer Now", "Set GTN alert on Home Depot"];
      } else if (q.includes('roi') || q.includes('highest')) {
        responseText = "Highest promotional ROI in Q1 was achieved by **Irwin Vise-Grip Hardware Month (PCR-2026-0830)** at **3.1x ROI** and +32.8% SGM margin, followed by **Stanley FatMax Tape (PCR-2026-0815)** at **2.8x ROI**. Both featured high retailer pass-through and minimal RSA co-op leakage.";
        chips = ["Replicate Irwin structure for Q2", "View Stanley FatMax SKUs"];
      } else if (q.includes('optimizer') || q.includes('pass')) {
        responseText = "Ready to pass underperforming event parameters (PCR-2026-0812 and PCR-2026-0835) into the algorithmic Trade Promotions Optimizer. Would you like to switch to the Optimizer tab?";
        chips = ["Navigate to Promo Optimizer", "Download audit summary"];
      } else {
        responseText = `Agent synthesized your inquiry for "${query}". Cross-referencing 12 closed promotional records: PTG shows +412 bps margin gain despite volume softening, while HTAS delivered above-plan gross-to-net realization across all retail tiers.`;
        chips = ["Why did POS units miss plan?", "Show guardrails status", "Deconstruct retail sales loss"];
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        chips,
        dataWidget: widget
      };

      setChatMessages(prev => [...prev, agentMsg]);
    }, 600);
  };

  // Add Guardrail Rule
  const handleAddGuardrailRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: GuardrailRule = {
      id: `gr-${Date.now()}`,
      name: newRuleName,
      metric: newRuleMetric,
      condition: newRuleCondition,
      threshold: newRuleThreshold,
      brand: newRuleBrand,
      status: 'active',
      lastChecked: 'Just now',
      violationsCount: 0
    };

    const updatedRules = [newRule, ...guardrailRules];
    setGuardrailRules(updatedRules);
    saveSharedGuardrails(updatedRules as any);
    setNewRuleName('');
    setIsGuardrailModalOpen(false);
    showToast(`🛡️ Guardrail Agent "${newRule.name}" created and deployed to continuous monitoring background thread!`);
  };

  // Data for Popover Waterfall Charts
  const posUnitsWaterfall = [
    { name: 'Plan Target', value: 433.4, delta: 433.4, isTotal: true },
    { name: 'Drill Blitz Drag', value: -48.2, delta: -48.2, isNegative: true },
    { name: 'Miter Saw Stockouts', value: -18.5, delta: -18.5, isNegative: true },
    { name: 'Cannibalization Gap', value: -22.3, delta: -22.3, isNegative: true },
    { name: 'Stanley FatMax Gain', value: 6.0, delta: 6.0, isPositive: true },
    { name: 'Actual Units', value: 350.5, delta: 350.5, isTotal: true }
  ];

  const retailSalesWaterfall = [
    { name: 'Plan $ Retail', value: 60.4, delta: 60.4, isTotal: true },
    { name: 'Price Elasticity Deficit', value: -7.8, delta: -7.8, isNegative: true },
    { name: 'Home Depot Drill Dip', value: -6.2, delta: -6.2, isNegative: true },
    { name: 'Lowe\'s Timing Delay', value: -2.8, delta: -2.8, isNegative: true },
    { name: 'Hand Tools Lift', value: 1.2, delta: 1.2, isPositive: true },
    { name: 'Actual $ Retail', value: 44.8, delta: 44.8, isTotal: true }
  ];

  const nsvWaterfall = [
    { name: 'Plan NSV', value: 38.9, delta: 38.9, isTotal: true },
    { name: 'Volume Shortfall Drag', value: -11.4, delta: -11.4, isNegative: true },
    { name: 'RSA Spend Savings', value: 1.8, delta: 1.8, isPositive: true },
    { name: 'Mix Shift to SGM+', value: 0.9, delta: 0.9, isPositive: true },
    { name: 'Merchant Spend Co-op', value: -1.5, delta: -1.5, isNegative: true },
    { name: 'Actual NSV', value: 28.7, delta: 28.7, isTotal: true }
  ];

  return (
    <div className="space-y-4 font-sans text-slate-900 pb-16 relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded shadow-2xl border-l-4 border-[#FFC20E] flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles size={18} className="text-[#FFC20E] shrink-0" />
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-1 flex items-center gap-2">
            <span>Channel Owner Home</span>
            <span className="text-slate-300">/</span>
            <span>Promo Effectiveness</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Promo Events
            </h1>
            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-slate-300">
              ✂ IN DESIGN
            </span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-amber-300 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-600" />
              <span>AGENTIC ENHANCED</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
            Plan vs Execution vs Actuals across PTG + HTAS. Each row is one PCR; click into any event for SKU-level execution detail, or invoke agent actions.
          </p>
        </div>

        {/* TOP LEVEL ACTION BUTTONS */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => showToast("Exporting 12 Closed PCR Records & Retrospective Performance Data to Excel...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-sm text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download size={14} className="text-slate-500" />
            <span>Export to Excel</span>
          </button>

          <button 
            onClick={() => setIsGuardrailModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-sm text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer border border-slate-700 relative"
          >
            <ShieldCheck size={14} className="text-[#FFC20E]" />
            <span>+ Create Guardrail Agent</span>
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ml-1">
              {guardrailRules.length} Active
            </span>
          </button>
        </div>
      </div>

      {/* COMPLETED TAB BADGE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-sm border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-sm text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-slate-700" />
            <span>Completed 12</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Closed promos — grouped by quarter for retrospective review.
          </span>
        </div>

        {/* Guardrail watchdog health ticker */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 font-semibold bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Watchdog Active:</span>
            <span className="font-bold text-slate-900">{guardrailRules.length} rules scanning</span>
          </span>
          <button 
            onClick={() => setIsGuardrailModalOpen(true)}
            className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <AlertTriangle size={12} className="text-amber-600" />
            <span>1 Warning: PCR-0835</span>
          </button>
        </div>
      </div>

      {/* GLOBAL FILTER BAR */}
      <GlobalFilterBar 
        filters={filterState} 
        onFilterChange={onFilterChange} 
        onApply={onFilterApply} 
      />

      {/* 1. AUTONOMOUS ROOT CAUSE SYNTHESIS BANNER (FEATURE 2) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border border-amber-200/90 rounded-sm shadow-sm overflow-hidden transition-all">
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-amber-100/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#FFC20E] text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Autonomous Root Cause Synthesis Engine
                </span>
                <span className="bg-amber-200/80 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-sm border border-amber-300">
                  REAL-TIME AUDIT
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  • 12 closed events & 148 SKUs evaluated in background thread
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                <strong className="text-amber-900 font-black">Executive Summary:</strong> While aggregate POS volume missed plan by <span className="text-rose-700 font-bold">-19.2% (-83.0K units)</span> primarily driven by Home Depot DeWalt 20V Drill elasticity miscalibration and supply constraints at Lowe's, gross-to-net realization improved as reduced promotional discounting yielded an expanded <span className="text-emerald-700 font-bold">+367 bps SGM margin</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => {
                setIsChatOpen(true);
                setIsChatMinimized(false);
                handleSendChatMessage("Explain root cause breakdown of the -83K units gap");
              }}
              className="bg-white hover:bg-amber-100/60 text-slate-800 border border-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Bot size={13} className="text-amber-700" />
              <span>Ask Agent to Explain</span>
            </button>
            <button
              onClick={() => setIsSynthesisExpanded(!isSynthesisExpanded)}
              className="text-slate-600 hover:text-slate-900 p-1.5 rounded transition-colors"
              title={isSynthesisExpanded ? "Collapse Synthesis Breakdown" : "Expand Synthesis Breakdown"}
            >
              {isSynthesisExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* EXPANDED SYNTHESIS MULTI-FACTOR DECOMPOSITION */}
        {isSynthesisExpanded && (
          <div className="p-4 bg-white/70 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-sm border border-amber-200/70 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">Top Variance Driver</span>
                <span className="font-bold text-rose-700">-48.2K Units</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">DeWalt Drill Blitz Promo Depth Miscalibration</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Promotional discount depth was executed at 22% vs optimal 15% elasticity boundary. Diminishing returns failed to yield incremental volume.
              </p>
              <button 
                onClick={() => {
                  const ev = sampleEvents[0];
                  handlePassToOptimizer(ev);
                }}
                className="mt-2 text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 pt-1 border-t border-slate-100"
              >
                <span>Pass Drill Blitz to Optimizer</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="bg-white p-3 rounded-sm border border-amber-200/70 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Retailer Out-of-Stock</span>
                <span className="font-bold text-amber-700">-18.5K Units</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Lowe's Miter Saw Supply Disruption</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                PCR-2026-0835 experienced 14% retail stockouts during week 8 feature ad, dampening sell-through and dropping SGM to 22.4%.
              </p>
              <button 
                onClick={() => setActiveWaterfallModal('posUnits')}
                className="mt-2 text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 pt-1 border-t border-slate-100"
              >
                <span>View Full Waterfall</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="bg-white p-3 rounded-sm border border-amber-200/70 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Margin Bright Spot</span>
                <span className="font-bold text-emerald-700">+367 bps Margin</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Hand Tools Gross-to-Net Realization</h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Stanley FatMax tape bundle delivered +31.2% SGM with 92% pass-through rate, counteracting power tool volume drag.
              </p>
              <button 
                onClick={() => {
                  setSelectedEvent(sampleEvents[1]);
                }}
                className="mt-2 text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 pt-1 border-t border-slate-100"
              >
                <span>Inspect FatMax Retrospective</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="relative bg-white border border-slate-200 rounded-sm shadow-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search PCR number, title, brand or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-24 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {filteredEvents.length} of {sampleEvents.length} Records
        </span>
      </div>

      {/* FINAL RESULTS SCORECARD HEADER & KPI GRID (MATCHING ATTACHED SCREENSHOT EXACTLY WITH MICRO-AGENT PULSE TRIGGERS) */}
      <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-5 shadow-sm">
        
        {/* SUMMARY HEADER BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black uppercase text-slate-900 tracking-wide">FINAL RESULTS</span>
            <span className="text-xs text-slate-500 font-medium">12 closed events</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {/* Missed plan pill */}
            <div className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
              <TrendingDown size={14} className="text-rose-600" />
              <span>Missed plan · -27.9% vs plan NSV</span>
            </div>

            {/* Expanded margin pill */}
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Expanded margin · +367 bps SGM vs plan</span>
            </div>
          </div>
        </div>

        {/* 3-COLUMN KPI GRID WITH MICRO-AGENT PULSE TRIGGERS (FEATURE 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
          
          {/* COLUMN 1: DEMAND & TOPLINE */}
          <div className="space-y-4 pr-4 md:border-r border-slate-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
              <span>DEMAND & TOPLINE</span>
              <span className="text-[10px] text-slate-400 font-medium">Actual vs Plan</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* POS UNITS with Micro-Agent Pulse Trigger */}
              <div className="relative group bg-slate-50/50 p-2.5 rounded-sm border border-slate-100 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">POS UNITS</span>
                  {/* Micro-Agent Pulse Trigger Button */}
                  <button 
                    onClick={() => setActiveWaterfallModal('posUnits')}
                    className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs transition-all cursor-pointer"
                    title="Click for Agent Waterfall Breakdown"
                  >
                    <Sparkles size={10} className="text-amber-600 animate-pulse" />
                    <span>Diagnose</span>
                  </button>
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">350.5K</span>
                <span className="text-[11px] text-slate-500 font-medium block">81% of plan</span>
                <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -83.0K vs 433.4K
                </span>
              </div>

              {/* POS $ AT RETAIL with Micro-Agent Pulse Trigger */}
              <div className="relative group bg-slate-50/50 p-2.5 rounded-sm border border-slate-100 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">POS $ AT RETAIL</span>
                  <button 
                    onClick={() => setActiveWaterfallModal('retailSales')}
                    className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs transition-all cursor-pointer"
                    title="Click for Agent Waterfall Breakdown"
                  >
                    <Sparkles size={10} className="text-amber-600 animate-pulse" />
                    <span>Decompose</span>
                  </button>
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$44.8M</span>
                <span className="text-[11px] text-slate-500 font-medium block">74% of plan</span>
                <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$15.6M vs $60.4M
                </span>
              </div>
            </div>

            {/* POS $ AT INVOICE SALES */}
            <div className="bg-slate-50/50 p-2.5 rounded-sm border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">POS $ AT INVOICE SALES</span>
              <span className="text-xl font-bold text-slate-900 tracking-tight">$32.2M</span>
              <span className="text-[11px] text-slate-500 font-medium block">74% of plan</span>
              <span className="inline-block mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                -$11.2M vs $43.5M
              </span>
            </div>
          </div>

          {/* COLUMN 2: TRADE SPEND */}
          <div className="space-y-4 pr-4 md:border-r border-slate-200">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              TRADE SPEND
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">MERCHANT SPEND $</span>
              <span className="text-xs italic text-slate-500 font-medium block">logic under construction</span>
              <span className="text-[11px] text-slate-400 font-medium block">vs $9.4M plan</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">RSA ADJ. TOTAL $</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$4.3M</span>
                <span className="text-[11px] text-slate-500 font-medium block">84% of plan</span>
                <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$790.7K vs $5.1M
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">TOTAL TRADE SPEND $</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$7.8M</span>
                <span className="text-[11px] text-slate-500 font-medium block">82% of plan</span>
                <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -$1.8M vs $9.6M
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: NET VALUE & PROFITABILITY */}
          <div className="space-y-4">
            <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
              <span>NET VALUE & PROFITABILITY</span>
              <span className="text-[10px] text-emerald-700 font-bold">Margin Expansion</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">ROI</span>
                <span className="text-base font-black text-slate-900 block">1.84x</span>
                <span className="text-[10px] text-slate-400 font-medium">calibrated net model</span>
              </div>

              {/* NSV $ with Micro-Agent Pulse Trigger */}
              <div className="relative group bg-slate-50/50 p-2 rounded-sm border border-slate-100 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">NSV $</span>
                  <button 
                    onClick={() => setActiveWaterfallModal('nsv')}
                    className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs transition-all cursor-pointer"
                    title="Click for Agent Waterfall Breakdown"
                  >
                    <Sparkles size={10} className="text-amber-600 animate-pulse" />
                    <span>Bridge</span>
                  </button>
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">$28.7M</span>
                <span className="text-[11px] text-slate-500 font-medium block">74% of plan</span>
                <span className="inline-block mt-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1 py-0.2 rounded-sm">
                  -$10.2M vs $38.9M
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-[11px]">
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider mb-0.5">SGM / AGM % · ACT</span>
                <div className="text-emerald-700 font-bold text-sm">SGM+ 27.0% <span className="text-slate-400 font-medium text-xs">vs 23.3% plan</span></div>
                <div className="text-emerald-700 font-bold text-sm">AGM+ 27.9% <span className="text-slate-400 font-medium text-xs">vs 26.7% plan</span></div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider mb-0.5">DROP-THRU % · ACT</span>
                <div className="text-emerald-700 font-bold text-sm">SGM+ 7.1% <span className="text-slate-400 font-medium text-xs">vs 5.4% plan</span></div>
                <div className="text-emerald-700 font-bold text-sm">AGM+ 12.1% <span className="text-slate-400 font-medium text-xs">vs 10.9% plan</span></div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. REPLICATED EVENTS SECTION (EXACT TOOL REPLICATION WITH AGENTIC LAYER) */}
      <div className="space-y-4">
        {/* Section Top Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 uppercase tracking-wider text-xs">
                Closed Promotional Events
              </span>
              <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-300">
                {filteredEvents.length} Events
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Quick Customer Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Retailer:</span>
              <select
                value={selectedCustomerFilter}
                onChange={(e) => setSelectedCustomerFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded px-2 py-1 font-medium focus:outline-none"
              >
                <option value="All">All Retailers</option>
                <option value="Home Depot">Home Depot</option>
                <option value="Lowe's">Lowe's</option>
                <option value="Ace Hardware">Ace Hardware</option>
                <option value="Menards">Menards</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>

            {/* Quick Health Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Health:</span>
              <select
                value={selectedHealthFilter}
                onChange={(e) => setSelectedHealthFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded px-2 py-1 font-medium focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Optimal">Optimal</option>
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning / Drag</option>
                <option value="Critical">Critical Floor Breach</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Batch Agent Actions when items are selected */}
            {selectedEventIds.length > 0 && (
              <div className="flex items-center gap-2 mr-2 animate-in fade-in">
                <button
                  onClick={() => {
                    showToast(`⚡ Batch passing ${selectedEventIds.length} events to Trade Promotions Optimizer...`);
                    if (onNavigateTab) {
                      setTimeout(() => onNavigateTab('trade_promotions'), 1200);
                    }
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles size={12} className="text-[#FFC20E]" />
                  <span>Optimize Selected ({selectedEventIds.length})</span>
                </button>
              </div>
            )}

            {/* View Mode Toggle (Cards vs Table) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Cards View (Detailed 9-Metric Scorecard per Event)"
              >
                <LayoutGrid size={13} />
                <span>Card View</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Compact Table View"
              >
                <List size={13} />
                <span>Table View</span>
              </button>
            </div>

            <button 
              onClick={() => showToast("Exporting Filtered Promotional View to Excel...")}
              className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1.5 rounded-sm transition-colors"
            >
              <FileSpreadsheet size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* 1. REPLICATED CARDS VIEW (MATCHING THE ATTACHED SCREENSHOT EXACTLY) */}
        {viewMode === 'cards' && (
          <div className="space-y-4">
            {filteredEvents.map(event => {
              const isExpanded = !!expandedCards[event.pcrNumber];
              const isSelected = selectedEventIds.includes(event.pcrNumber);

              return (
                <div 
                  key={event.pcrNumber}
                  className={`bg-white border rounded-sm shadow-sm transition-all overflow-hidden ${
                    event.health === 'critical' ? 'border-rose-300 ring-1 ring-rose-200' :
                    event.health === 'warning' ? 'border-amber-300' :
                    'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* CARD HEADER (MATCHING SCREENSHOT WITH CHECKBOX, TITLE, METADATA, [REVIEW] BUTTON & INLINE AGENT ACTIONS) */}
                  <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Checkbox */}
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectEvent(event.pcrNumber)}
                        className="mt-1 sm:mt-0 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer h-4 w-4"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* PCR Number & Event Title */}
                          <h3 
                            onClick={() => toggleCardExpanded(event.pcrNumber)}
                            className="text-base font-black text-slate-900 tracking-tight hover:text-amber-800 cursor-pointer flex items-center gap-2"
                          >
                            <span>{event.pcrNumber}</span>
                            <span className="text-slate-300 font-normal">|</span>
                            <span>{event.title}</span>
                          </h3>

                          {/* Customer / Retailer Badge */}
                          <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-300">
                            {event.customer}
                          </span>

                          {/* Brand Badge */}
                          <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-2 py-0.5 rounded border border-amber-300">
                            {event.brand}
                          </span>

                          {/* Timing / Dates */}
                          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                            <Calendar size={12} className="text-slate-400" />
                            <span>{event.dates}</span>
                          </span>

                          {/* Promo Mechanic */}
                          <span className="text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-medium hidden lg:inline">
                            {event.mechanic}
                          </span>

                          {/* Completed Status Pill */}
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span>Completed</span>
                          </span>

                          {/* Guardrail / Anomaly Alert Pill */}
                          {event.health === 'critical' && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-300 flex items-center gap-1 animate-pulse">
                              <AlertTriangle size={11} className="text-rose-600" />
                              <span>⚠️ Guardrail Floor Breached</span>
                            </span>
                          )}
                          {event.health === 'warning' && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <Sparkles size={11} className="text-amber-700" />
                              <span>Elasticity Drag Detected</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Header Action Buttons (Including Exact [Review] Button and Inline Agent Hub) */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {/* Exact [ Review ] Button from Tool Screenshot */}
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3.5 py-1.5 rounded-sm text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye size={13} className="text-slate-600" />
                        <span>Review</span>
                      </button>

                      {/* Inline Agent: Pass to Optimizer */}
                      <button
                        onClick={() => handlePassToOptimizer(event)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        title="Pass event parameters into Trade Promotions Optimizer"
                      >
                        <Sparkles size={12} className="text-[#FFC20E]" />
                        <span className="hidden sm:inline">Pass to Optimizer</span>
                        <span className="sm:hidden">Optimize</span>
                      </button>

                      {/* Inline Agent: Ask Copilot */}
                      <button
                        onClick={() => {
                          setIsChatOpen(true);
                          setIsChatMinimized(false);
                          handleSendChatMessage(`Analyze performance, elasticity, and margin realization for ${event.pcrNumber} (${event.title})`);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 p-1.5 rounded-sm text-xs font-bold transition-colors cursor-pointer"
                        title="Discuss this PCR event with SBD Promo Copilot"
                      >
                        <Bot size={14} className="text-amber-700" />
                      </button>

                      {/* Expand / Collapse Chevron */}
                      <button
                        onClick={() => toggleCardExpanded(event.pcrNumber)}
                        className="text-slate-500 hover:text-slate-900 p-1.5 rounded transition-colors"
                        title={isExpanded ? "Collapse Promoted SKUs" : "Expand Promoted SKUs"}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* CARD BODY: 3-COLUMN SCORECARD (MATCHING THE SCREENSHOT EXACTLY WITH MICRO-AGENT PULSE TRIGGERS) */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-5 text-sm bg-white">
                    
                    {/* COLUMN 1: DEMAND & TOPLINE */}
                    <div className="space-y-3.5 pr-0 md:pr-4 md:border-r border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                        <span>DEMAND & TOPLINE</span>
                        <span className="text-[10px] text-slate-400 font-medium">Actual vs Plan</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* POS UNITS with Micro-Agent Pulse Trigger */}
                        <div className="relative group bg-slate-50/60 p-2.5 rounded-sm border border-slate-100 hover:border-amber-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">POS UNITS</span>
                            <button 
                              onClick={() => setActiveWaterfallModal('posUnits')}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs transition-all cursor-pointer"
                              title="Click for Agent Waterfall Breakdown"
                            >
                              <Sparkles size={10} className="text-amber-600 animate-pulse" />
                              <span>Diagnose</span>
                            </button>
                          </div>
                          <span className="text-xl font-black text-slate-900 tracking-tight block mt-0.5">{event.posUnitsAct}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{event.posUnitsPct}</span>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${
                            event.posUnitsVarIsNegative 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {event.posUnitsVar}
                          </span>
                        </div>

                        {/* POS $ AT RETAIL with Micro-Agent Pulse Trigger */}
                        <div className="relative group bg-slate-50/60 p-2.5 rounded-sm border border-slate-100 hover:border-amber-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">POS $ AT RETAIL</span>
                            <button 
                              onClick={() => setActiveWaterfallModal('retailSales')}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs transition-all cursor-pointer"
                              title="Click for Agent Waterfall Breakdown"
                            >
                              <Sparkles size={10} className="text-amber-600 animate-pulse" />
                              <span>Decompose</span>
                            </button>
                          </div>
                          <span className="text-xl font-black text-slate-900 tracking-tight block mt-0.5">{event.posRetailAct}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{event.posRetailPct}</span>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${
                            event.posRetailVarIsNegative 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {event.posRetailVar}
                          </span>
                        </div>
                      </div>

                      {/* POS $ AT INVOICE SALES */}
                      <div className="bg-slate-50/60 p-2.5 rounded-sm border border-slate-100">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">POS $ AT INVOICE SALES</span>
                        <span className="text-lg font-bold text-slate-900 tracking-tight block mt-0.5">{event.posInvoiceAct}</span>
                        <span className="text-[11px] text-slate-500 font-medium block">{event.posInvoicePct}</span>
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border bg-slate-100 text-slate-700 border-slate-200">
                          {event.posInvoiceVar}
                        </span>
                      </div>
                    </div>

                    {/* COLUMN 2: TRADE SPEND */}
                    <div className="space-y-3.5 pr-0 md:pr-4 md:border-r border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        TRADE SPEND
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">MERCHANT SPEND $</span>
                        <span className="text-base font-bold text-slate-900 block mt-0.5">{event.merchantSpendAct}</span>
                        <span className="text-[11px] italic text-slate-400 font-medium block">logic under construction</span>
                        <span className="text-[11px] text-slate-400 font-medium block">vs {event.merchantSpendPlan} plan</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">RSA ADJ. TOTAL $</span>
                          <span className="text-lg font-black text-slate-900 tracking-tight block mt-0.5">{event.rsaAdjAct}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{event.rsaAdjPct}</span>
                          <span className="inline-block mt-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            {event.rsaAdjVar}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">TOTAL TRADE SPEND $</span>
                          <span className="text-lg font-black text-slate-900 tracking-tight block mt-0.5">{event.totalTradeSpendAct}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{event.totalTradeSpendPct}</span>
                          <span className="inline-block mt-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            {event.totalTradeSpendVar}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 3: NET VALUE & PROFITABILITY */}
                    <div className="space-y-3.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                        <span>NET VALUE & PROFITABILITY</span>
                        <span className={`text-[10px] font-bold ${
                          event.health === 'critical' ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {event.health === 'critical' ? 'Margin Warning' : 'Margin Realized'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">ROI</span>
                          <span className="text-lg font-black text-slate-900 block mt-0.5">{event.roi}</span>
                          <span className="text-[10px] text-slate-400 font-medium">calibrated net model</span>
                        </div>

                        {/* NSV $ with Micro-Agent Pulse Trigger */}
                        <div className="relative group bg-slate-50/60 p-2 rounded-sm border border-slate-100 hover:border-amber-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">NSV $</span>
                            <button 
                              onClick={() => setActiveWaterfallModal('nsv')}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs transition-all cursor-pointer"
                              title="Click for Agent Waterfall Breakdown"
                            >
                              <Sparkles size={10} className="text-amber-600 animate-pulse" />
                              <span>Bridge</span>
                            </button>
                          </div>
                          <span className="text-xl font-black text-slate-900 tracking-tight block mt-0.5">{event.nsvAct}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{event.nsvPct}</span>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-1 py-0.2 rounded-sm border ${
                            event.nsvVarIsNegative 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {event.nsvVar}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2.5 text-[11px]">
                        <div>
                          <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider mb-0.5">SGM / AGM % · ACT</span>
                          <div className="text-emerald-700 font-bold text-xs">SGM+ {event.sgmAct} <span className="text-slate-400 font-medium text-[10px]">vs {event.sgmPlan} plan</span></div>
                          <div className="text-emerald-700 font-bold text-xs">AGM+ {event.agmAct} <span className="text-slate-400 font-medium text-[10px]">vs {event.agmPlan} plan</span></div>
                        </div>

                        <div>
                          <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider mb-0.5">DROP-THRU % · ACT</span>
                          <div className="text-emerald-700 font-bold text-xs">SGM+ {event.dropThruSgmAct} <span className="text-slate-400 font-medium text-[10px]">vs {event.dropThruSgmPlan} plan</span></div>
                          <div className="text-emerald-700 font-bold text-xs">AGM+ {event.dropThruAgmAct} <span className="text-slate-400 font-medium text-[10px]">vs {event.dropThruAgmPlan} plan</span></div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* EXPANDABLE PROMOTED SKUs & AGENT SYNTHESIS DRAWER */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-4 space-y-4 animate-in fade-in duration-150">
                      {/* Event Specific Agent Synthesis Banner */}
                      <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded bg-[#FFC20E] text-slate-900 flex items-center justify-center shrink-0">
                            <Sparkles size={13} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-black text-amber-950 tracking-wide block">
                              Agent Retrospective Diagnosis
                            </span>
                            <p className="text-xs text-slate-800 leading-snug">
                              {event.anomalyNote || "Execution was balanced with stable margin realization across all promoted items."}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handlePassToOptimizer(event)}
                          className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 shrink-0 shadow-2xs"
                        >
                          <Sparkles size={11} className="text-[#FFC20E]" />
                          <span>Solve Next Quarter in Optimizer</span>
                        </button>
                      </div>

                      {/* Promoted SKUs Sub-table */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                            Promoted SKUs Execution Breakdown ({event.skus.length} of {event.skuCount} Hero SKUs)
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">Audited Point-of-Sale Realization</span>
                        </div>

                        <div className="overflow-x-auto bg-white border border-slate-200 rounded-sm">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9px] border-b border-slate-200">
                              <tr>
                                <th className="p-2.5">SKU ID</th>
                                <th className="p-2.5">Description</th>
                                <th className="p-2.5 text-right">Base Price</th>
                                <th className="p-2.5 text-right">Promo Price</th>
                                <th className="p-2.5 text-center">Depth</th>
                                <th className="p-2.5 text-right">Units Sold</th>
                                <th className="p-2.5 text-right">Retail POS</th>
                                <th className="p-2.5 text-right">Trade Spend</th>
                                <th className="p-2.5 text-right">SGM Margin</th>
                                <th className="p-2.5 text-center">Elasticity Index</th>
                                <th className="p-2.5 text-center">Agent Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {event.skus.map(sku => (
                                <tr key={sku.skuId} className="hover:bg-slate-50/70">
                                  <td className="p-2.5 font-bold text-slate-800">{sku.skuId}</td>
                                  <td className="p-2.5 font-medium text-slate-700">{sku.name}</td>
                                  <td className="p-2.5 text-right text-slate-500">{sku.basePrice}</td>
                                  <td className="p-2.5 text-right font-bold text-slate-900">{sku.promoPrice}</td>
                                  <td className="p-2.5 text-center">
                                    <span className="bg-slate-100 text-slate-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                      -{sku.discountPct}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-right font-semibold text-slate-800">{sku.units}</td>
                                  <td className="p-2.5 text-right font-bold text-slate-900">{sku.retailSales}</td>
                                  <td className="p-2.5 text-right text-slate-600">{sku.tradeSpend}</td>
                                  <td className="p-2.5 text-right font-bold text-emerald-700">{sku.sgmMargin}</td>
                                  <td className="p-2.5 text-center font-medium text-slate-600">{sku.elasticityIndex}</td>
                                  <td className="p-2.5 text-center">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      sku.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                                      sku.status === 'Sub-optimal' ? 'bg-amber-100 text-amber-900' :
                                      'bg-rose-100 text-rose-800'
                                    }`}>
                                      {sku.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* 2. COMPACT TABLE VIEW (FOR USERS PREFERRING FAST TABULAR SCANNING) */}
        {viewMode === 'table' && (
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="p-3 w-8">
                      <input 
                        type="checkbox"
                        checked={selectedEventIds.length === filteredEvents.length && filteredEvents.length > 0}
                        onChange={() => handleSelectAll(filteredEvents)}
                        className="rounded border-slate-300 text-slate-900 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">PCR ID</th>
                    <th className="p-3">Event Title</th>
                    <th className="p-3">Brand / Customer</th>
                    <th className="p-3 text-right">POS Units</th>
                    <th className="p-3 text-right">Retail Sales</th>
                    <th className="p-3 text-right">Trade Spend</th>
                    <th className="p-3 text-right">SGM Margin</th>
                    <th className="p-3 text-center">Health Status</th>
                    <th className="p-3 text-center">Inline Agent Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map(row => (
                    <tr 
                      key={row.pcrNumber}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      <td className="p-3">
                        <input 
                          type="checkbox"
                          checked={selectedEventIds.includes(row.pcrNumber)}
                          onChange={() => toggleSelectEvent(row.pcrNumber)}
                          className="rounded border-slate-300 text-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* PCR ID */}
                      <td 
                        onClick={() => setSelectedEvent(row)}
                        className="p-3 font-semibold text-slate-800 cursor-pointer hover:underline"
                      >
                        {row.pcrNumber}
                      </td>

                      {/* Title */}
                      <td 
                        onClick={() => setSelectedEvent(row)}
                        className="p-3 font-bold text-slate-900 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{row.title}</span>
                          <span className="text-[10px] font-medium text-slate-400">({row.skuCount} SKUs)</span>
                        </div>
                      </td>

                      {/* Brand & Customer */}
                      <td className="p-3 text-slate-600">
                        <span className="font-bold text-slate-900">{row.brand}</span>
                        <span className="text-slate-500 text-xs block">{row.customer}</span>
                      </td>

                      {/* POS Units */}
                      <td className="p-3 text-right font-semibold text-slate-800">{row.posUnitsAct}</td>

                      {/* Retail Sales */}
                      <td className="p-3 text-right font-bold text-slate-900">{row.posRetailAct}</td>

                      {/* Trade Spend */}
                      <td className="p-3 text-right font-medium text-slate-700">{row.totalTradeSpendAct}</td>

                      {/* SGM Margin */}
                      <td className="p-3 text-right font-bold">
                        <span className={row.health === 'critical' ? 'text-rose-600' : 'text-emerald-700'}>
                          {row.sgmAct}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">{row.sgmVarianceBps}</span>
                      </td>

                      {/* Health Badge */}
                      <td className="p-3 text-center">
                        {row.health === 'optimal' && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Check size={10} /> Optimal
                          </span>
                        )}
                        {row.health === 'healthy' && (
                          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            Healthy
                          </span>
                        )}
                        {row.health === 'warning' && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <AlertTriangle size={10} /> Drag
                          </span>
                        )}
                        {row.health === 'critical' && (
                          <span className="bg-rose-50 text-rose-800 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <AlertTriangle size={10} /> Floor Breached
                          </span>
                        )}
                      </td>

                      {/* INLINE AGENT ACTION HUB */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassToOptimizer(row);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-sm flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                            title="Pass PCR parameters to Trade Promotions Optimizer"
                          >
                            <Sparkles size={11} className="text-[#FFC20E]" />
                            <span>Pass to Optimizer</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(row);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm transition-colors cursor-pointer"
                            title="Review Event Record"
                          >
                            <Eye size={13} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsChatOpen(true);
                              setIsChatMinimized(false);
                              handleSendChatMessage(`Analyze performance and margin drivers for event ${row.pcrNumber} (${row.title})`);
                            }}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-sm transition-colors cursor-pointer border border-amber-200"
                            title="Discuss with SBD Promo Copilot"
                          >
                            <Bot size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. AGENT WATCHDOG & GUARDRAILS MODAL (FEATURE 4) */}
      {isGuardrailModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-[#FFC20E]" />
                <div>
                  <h3 className="text-base font-black tracking-tight">Continuous Agent Watchdog & Guardrails</h3>
                  <p className="text-[11px] text-slate-400">Configure real-time monitoring bots without writing any code</p>
                </div>
              </div>
              <button onClick={() => setIsGuardrailModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
              
              {/* Active Rules List */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                    Active Watchdog Agents ({guardrailRules.length})
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">Continuous evaluation active</span>
                </div>

                <div className="space-y-2">
                  {guardrailRules.map(rule => (
                    <div 
                      key={rule.id}
                      className={`p-3 rounded-sm border flex items-center justify-between text-xs ${
                        rule.status === 'warning' 
                          ? 'bg-amber-50/70 border-amber-300 text-amber-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="font-bold text-slate-900">{rule.name}</strong>
                          <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.2 rounded font-semibold text-slate-600">
                            {rule.brand}
                          </span>
                          {rule.status === 'warning' && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-rose-200 flex items-center gap-1">
                              <AlertTriangle size={10} /> 1 Anomaly Flagged
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Alert when <span className="font-semibold">{rule.metric}</span> {rule.condition} <span className="font-bold">{rule.threshold}</span>
                        </p>
                        <span className="text-[10px] text-slate-400 block">Last evaluated {rule.lastChecked}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setGuardrailRules(prev => prev.filter(r => r.id !== rule.id));
                            showToast(`Watchdog rule "${rule.name}" removed.`);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Delete Guardrail"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create New Guardrail Form */}
              <form onSubmit={handleAddGuardrailRule} className="bg-slate-50 p-4 rounded-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                  <Plus size={14} className="text-[#FFC20E]" />
                  <span>Configure New Background Guardrail Rule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Rule Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Home Depot GTN Variance Alert"
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      required
                      className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Target Brand / Scope</label>
                    <select
                      value={newRuleBrand}
                      onChange={(e) => setNewRuleBrand(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                    >
                      <option value="DeWalt">DeWalt (PTG)</option>
                      <option value="Stanley">Stanley (HTAS)</option>
                      <option value="Craftsman">Craftsman</option>
                      <option value="Irwin">Irwin</option>
                      <option value="All Brands">All SBD Portfolio</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Monitoring Metric</label>
                    <select
                      value={newRuleMetric}
                      onChange={(e) => setNewRuleMetric(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                    >
                      <option value="GTN Spend">GTN Spend vs Plan</option>
                      <option value="SGM Margin">SGM Margin Floor</option>
                      <option value="Promo ROI">Promo ROI Threshold</option>
                      <option value="POS Unit Elasticity">POS Unit Elasticity Lift</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Condition</label>
                      <select
                        value={newRuleCondition}
                        onChange={(e) => setNewRuleCondition(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                      >
                        <option value="exceeds plan by >">exceeds plan by &gt;</option>
                        <option value="drops below floor">drops below floor</option>
                        <option value="falls below">falls below</option>
                      </select>
                    </div>

                    <div className="w-24">
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Threshold</label>
                      <input 
                        type="text" 
                        value={newRuleThreshold}
                        onChange={(e) => setNewRuleThreshold(e.target.value)}
                        placeholder="5%"
                        className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsGuardrailModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck size={14} className="text-[#FFC20E]" />
                    <span>Deploy Guardrail</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* 3. MICRO-AGENT WATERFALL POPOVER MODAL (FEATURE 3) */}
      {activeWaterfallModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#FFC20E]" />
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    {activeWaterfallModal === 'posUnits' && "POS Units Variance Waterfall & Root Cause"}
                    {activeWaterfallModal === 'retailSales' && "POS $ at Retail Loss Decomposition Waterfall"}
                    {activeWaterfallModal === 'nsv' && "Net Sales Value (NSV) Financial Bridge Waterfall"}
                  </h3>
                  <p className="text-[11px] text-slate-400">Micro-agent decomposed plan vs actual variance drivers</p>
                </div>
              </div>
              <button onClick={() => setActiveWaterfallModal(null)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto font-sans text-xs">
              
              {/* Waterfall Chart */}
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Step-by-Step Variance Decomposition (
                    {activeWaterfallModal === 'posUnits' ? 'Thousands of Units' : '$ Millions'}
                    )
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Derived from 12 closed PCR actuals</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        activeWaterfallModal === 'posUnits' ? posUnitsWaterfall :
                        activeWaterfallModal === 'retailSales' ? retailSalesWaterfall :
                        nsvWaterfall
                      }
                      margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} interval={0} />
                      <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                      <Tooltip 
                        formatter={(val: any) => [
                          activeWaterfallModal === 'posUnits' ? `${val}K Units` : `$${val}M`, 
                          'Variance Contribution'
                        ]}
                        contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '4px', fontSize: '11px' }}
                      />
                      <ReferenceLine y={0} stroke="#94A3B8" />
                      <Bar dataKey="delta">
                        {(activeWaterfallModal === 'posUnits' ? posUnitsWaterfall :
                          activeWaterfallModal === 'retailSales' ? retailSalesWaterfall :
                          nsvWaterfall
                        ).map((entry, index) => {
                          let color = '#475569';
                          if (entry.isTotal) color = '#0F172A';
                          else if (entry.isNegative) color = '#E11D48';
                          else if (entry.isPositive) color = '#10B981';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Synthesis & SKU Contribution Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-sm space-y-2">
                  <h4 className="font-black text-amber-950 uppercase tracking-wide text-xs flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-700" />
                    <span>Agent Diagnostic Synthesis</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    The gap is isolated to promotional depth setting rather than category contraction. Elasticity saturation occurred at week 4 of the DeWalt Drill Blitz, where incremental spend produced an elasticity index of 0.61x (below the 1.0x break-even line).
                  </p>
                  <div className="pt-2 border-t border-amber-200 flex justify-between items-center text-[10px] font-bold text-amber-900">
                    <span>Prescriptive Action:</span>
                    <span>Cap Promo Depth at 15%</span>
                  </div>
                </div>

                <div className="border border-slate-200 p-4 rounded-sm space-y-2 bg-white">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                    Contributing SKU Records
                  </h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-700">DeWalt DCD771C2 Drill Kit</span>
                      <strong className="text-rose-700">-32.4K Units (-$5.2M)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-700">DeWalt DWS779 Miter Saw</span>
                      <strong className="text-rose-700">-18.5K Units (-$2.5M)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-700">Stanley 25ft FatMax Tape 2-Pk</span>
                      <strong className="text-emerald-700">+6.0K Units (+$850K)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Craftsman 121-Pc Mechanics Set</span>
                      <strong className="text-emerald-700">+2.1K Units (+$320K)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setActiveWaterfallModal(null);
                    setIsChatOpen(true);
                    setIsChatMinimized(false);
                    handleSendChatMessage("What promo changes would recover the -$15.6M retail sales loss in Q2?");
                  }}
                  className="text-slate-700 hover:text-slate-950 font-bold flex items-center gap-1.5"
                >
                  <Bot size={14} className="text-[#FFC20E]" />
                  <span>Discuss Recovery Plan with Copilot</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveWaterfallModal(null)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-sm shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EVENT RETROSPECTIVE DETAIL DRAWER */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right font-sans">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedEvent.pcrNumber}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                    selectedEvent.health === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedEvent.health}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">{selectedEvent.title}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 font-sans text-sm">
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 grid grid-cols-2 gap-4">
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">BRAND</span> <strong className="text-slate-900">{selectedEvent.brand}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">CUSTOMER</span> <strong className="text-slate-900">{selectedEvent.customer}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">TIMING</span> <strong className="text-slate-900">{selectedEvent.timing}</strong></div>
                <div><span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">SGM MARGIN</span> <strong className="text-emerald-700 text-base">{selectedEvent.sgmMargin}</strong></div>
              </div>

              {/* Agent Diagnosis Box */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-sm space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wide">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Agent Retrospective Diagnosis</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedEvent.anomalyNote || "Performance was executed within planned elasticity boundaries. Volume pass-through rate was healthy."}
                </p>
              </div>

              {/* SKU Breakdown */}
              <div className="border border-slate-200 rounded-sm p-4 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">SKU Execution Breakdown</h4>
                <div className="space-y-2 text-slate-700 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium">Core Hero SKU (DCD771C2)</span>
                    <strong className="text-slate-900">72,400 Units · $10.6M POS</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-medium">Battery Pack Companion (DCB205-2)</span>
                    <strong className="text-slate-900">38,100 Units · $4.8M POS</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Modular Storage Carrier (DWST08201)</span>
                    <strong className="text-slate-900">14,000 Units · $2.8M POS</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    handlePassToOptimizer(selectedEvent);
                    setSelectedEvent(null);
                  }}
                  className="w-full bg-[#FFC20E] hover:bg-yellow-400 text-black font-black py-3 rounded-sm text-xs flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider"
                >
                  <Sparkles size={14} />
                  <span>Pass Parameters to Trade Optimizer</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    onNavigateTab?.('review_hub');
                  }}
                  className="w-full bg-white text-slate-800 border border-slate-300 font-bold py-2 rounded-sm text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar size={14} className="text-slate-600" />
                  <span>Open in Review Hub</span>
                </button>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-sm text-xs hover:bg-slate-800 transition-colors"
                >
                  Close Record View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. FLOATING CHAT PANEL ("SBD PROMO COPILOT") (FEATURE 1) */}
      <div className="fixed bottom-4 right-6 z-40 font-sans">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-[#FFC20E] transition-all hover:scale-105 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-[#FFC20E] text-slate-900 flex items-center justify-center font-black">
              <Bot size={16} />
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                <span>SBD Promo Copilot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-300 font-medium">Ask descriptive insights</div>
            </div>
          </button>
        ) : (
          <div className={`bg-white rounded shadow-2xl border border-slate-300 transition-all duration-200 overflow-hidden flex flex-col ${
            isChatMinimized ? 'w-80 h-14' : 'w-96 sm:w-[420px] h-[520px]'
          }`}>
            {/* Chat Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#FFC20E] text-black flex items-center justify-center font-bold">
                  <Bot size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>SBD Promo Copilot</span>
                    <span className="text-[9px] bg-slate-800 text-[#FFC20E] px-1 py-0.2 rounded font-semibold">Active Agent</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Context: 12 Closed PCR Events</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button 
                  onClick={() => setIsChatMinimized(!isChatMinimized)}
                  className="p-1 hover:text-white"
                  title={isChatMinimized ? "Expand" : "Minimize"}
                >
                  {isChatMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 hover:text-white"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body (when not minimized) */}
            {!isChatMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[88%] p-3 rounded-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-slate-900 text-white rounded-br-none shadow-sm' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                      }`}>
                        <div className="whitespace-pre-line text-xs">{msg.text}</div>

                        {/* Interactive Suggestion Chips */}
                        {msg.chips && msg.chips.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {msg.chips.map((chip, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendChatMessage(chip)}
                                className="bg-slate-100 hover:bg-yellow-50 hover:border-[#FFC20E] text-slate-700 text-[10px] font-semibold px-2 py-1 rounded border border-slate-200 transition-colors cursor-pointer text-left"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Ask about promo lift, SGM margin, or variance..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 bg-[#FFC20E] hover:bg-yellow-400 disabled:opacity-40 text-black rounded font-bold transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
