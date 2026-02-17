export type ProjectStatus = 'proposal' | 'in_development' | 'testing' | 'completed' | 'on_hold';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Industry = 'fintech' | 'healthcare' | 'ecommerce' | 'education' | 'logistics' | 'saas' | 'media' | 'real_estate';

export interface Client {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  industry: Industry;
  logo?: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface Developer {
  id: string;
  name: string;
  role: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'designer' | 'qa' | 'pm';
  skills: string[];
  avatar?: string;
  email: string;
  hourlyRate: number;
  availability: number;
  joinedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface CostEntry {
  id: string;
  label: string;
  amount: number;
}

// ─── Control Tower Metrics ───────────────────────────────────
export type MetricCategory =
  | 'supervivencia'
  | 'riesgo_financiero'
  | 'ingresos'
  | 'rentabilidad'
  | 'adquisicion'
  | 'activacion'
  | 'retencion'
  | 'engagement'
  | 'valor_cliente'
  | 'producto'
  | 'estrategica'
  | 'riesgo_estructural'
  | 'escalabilidad'
  | 'portafolio';

export const METRIC_CATEGORY_LABELS: Record<MetricCategory, string> = {
  supervivencia: 'Supervivencia',
  riesgo_financiero: 'Riesgo Financiero',
  ingresos: 'Ingresos',
  rentabilidad: 'Rentabilidad',
  adquisicion: 'Adquisición',
  activacion: 'Activación',
  retencion: 'Retención',
  engagement: 'Engagement',
  valor_cliente: 'Valor Cliente',
  producto: 'Producto',
  estrategica: 'Estratégica',
  riesgo_estructural: 'Riesgo Estructural',
  escalabilidad: 'Escalabilidad',
  portafolio: 'Portafolio',
};

export type MetricHealth = 'healthy' | 'warning' | 'critical';

export interface MetricDefinition {
  key: string;
  name: string;
  category: MetricCategory;
  formula: string;
  events: string[];
  unit: 'currency' | 'percent' | 'ratio' | 'months' | 'days' | 'number' | 'score';
  higherIsBetter: boolean;
}

// All 34 metrics from Control Tower
export const METRIC_DEFINITIONS: MetricDefinition[] = [
  // Supervivencia
  { key: 'cashBalance', name: 'Cash Balance', category: 'supervivencia', formula: 'Bancos + Pasarelas – Obligaciones', events: [], unit: 'currency', higherIsBetter: true },
  { key: 'burnRate', name: 'Burn Rate', category: 'supervivencia', formula: 'Costos – Ingresos', events: ['subscription_started', 'subscription_renewed', 'refund_issued'], unit: 'currency', higherIsBetter: false },
  { key: 'runway', name: 'Runway', category: 'supervivencia', formula: 'Caja / Burn Rate', events: [], unit: 'months', higherIsBetter: true },
  { key: 'fixedCostRatio', name: 'Fixed Cost Ratio', category: 'supervivencia', formula: 'Costos fijos / Costos totales', events: [], unit: 'percent', higherIsBetter: false },
  // Riesgo Financiero
  { key: 'revenueConcentration', name: 'Revenue Concentration', category: 'riesgo_financiero', formula: 'Ingresos principal fuente / Total ingresos', events: ['subscription_started'], unit: 'percent', higherIsBetter: false },
  // Ingresos
  { key: 'mrr', name: 'MRR', category: 'ingresos', formula: 'Σ planes activos × precio', events: ['subscription_started', 'subscription_renewed'], unit: 'currency', higherIsBetter: true },
  { key: 'netRevenue', name: 'Net Revenue', category: 'ingresos', formula: 'Ingresos – comisiones – reembolsos', events: ['subscription_started', 'subscription_renewed', 'refund_issued'], unit: 'currency', higherIsBetter: true },
  { key: 'revenueGrowthRate', name: 'Revenue Growth Rate', category: 'ingresos', formula: '(MRR actual – MRR anterior) / anterior', events: ['subscription_started', 'subscription_renewed'], unit: 'percent', higherIsBetter: true },
  { key: 'arpu', name: 'ARPU', category: 'ingresos', formula: 'Ingresos / Usuarios pagados', events: ['subscription_started'], unit: 'currency', higherIsBetter: true },
  { key: 'averageTicket', name: 'Average Ticket', category: 'ingresos', formula: 'Ingresos pedidos / Nº pedidos', events: ['order_completed'], unit: 'currency', higherIsBetter: true },
  // Rentabilidad
  { key: 'grossMargin', name: 'Gross Margin', category: 'rentabilidad', formula: '(Ingresos – Costos directos) / Ingresos', events: ['subscription_started'], unit: 'percent', higherIsBetter: true },
  { key: 'appRoi', name: 'App ROI', category: 'rentabilidad', formula: '(Ingresos – Costos directos) / Costos directos', events: ['subscription_started'], unit: 'percent', higherIsBetter: true },
  { key: 'breakEven', name: 'Break-even', category: 'rentabilidad', formula: 'Costos totales / Precio promedio', events: ['subscription_started'], unit: 'number', higherIsBetter: false },
  { key: 'contributionMargin', name: 'Contribution Margin', category: 'rentabilidad', formula: 'ARPU – Costo variable', events: ['subscription_started'], unit: 'currency', higherIsBetter: true },
  // Adquisición
  { key: 'cac', name: 'CAC', category: 'adquisicion', formula: 'Marketing / Nuevos clientes', events: ['user_registered', 'subscription_started'], unit: 'currency', higherIsBetter: false },
  { key: 'costPerLead', name: 'Cost per Lead', category: 'adquisicion', formula: 'Marketing / Registros', events: ['user_registered'], unit: 'currency', higherIsBetter: false },
  { key: 'trialToPaidConversion', name: 'Trial → Paid Conversion', category: 'adquisicion', formula: 'Paid / Trials', events: ['trial_started', 'subscription_started'], unit: 'percent', higherIsBetter: true },
  // Activación
  { key: 'activationRate', name: 'Activation Rate', category: 'activacion', formula: 'Activados / Registrados', events: ['user_registered', 'activation_event'], unit: 'percent', higherIsBetter: true },
  // Retención
  { key: 'churnRate', name: 'Churn Rate', category: 'retencion', formula: 'Cancelados / Activos inicio', events: ['subscription_cancelled'], unit: 'percent', higherIsBetter: false },
  { key: 'revenueChurn', name: 'Revenue Churn', category: 'retencion', formula: 'Ingresos perdidos / MRR inicio', events: ['subscription_cancelled'], unit: 'percent', higherIsBetter: false },
  { key: 'retentionRate', name: 'Retention Rate', category: 'retencion', formula: '1 – Churn', events: ['subscription_cancelled'], unit: 'percent', higherIsBetter: true },
  { key: 'averageLifetime', name: 'Average Lifetime', category: 'retencion', formula: '1 / Churn', events: ['subscription_cancelled'], unit: 'months', higherIsBetter: true },
  // Engagement
  { key: 'totalUsers', name: 'Total Users', category: 'engagement', formula: 'Σ acumulado user_registered', events: ['user_registered'], unit: 'number', higherIsBetter: true },
  { key: 'dauMauRatio', name: 'DAU/MAU Ratio', category: 'engagement', formula: 'DAU / MAU', events: ['session_started'], unit: 'percent', higherIsBetter: true },
  // Valor Cliente
  { key: 'ltv', name: 'LTV', category: 'valor_cliente', formula: 'ARPU × Lifetime', events: ['subscription_started', 'subscription_cancelled'], unit: 'currency', higherIsBetter: true },
  { key: 'ltvCacRatio', name: 'LTV/CAC', category: 'valor_cliente', formula: 'LTV / CAC', events: ['subscription_started'], unit: 'ratio', higherIsBetter: true },
  { key: 'paybackPeriod', name: 'Payback Period', category: 'valor_cliente', formula: 'CAC / Margen mensual', events: ['subscription_started'], unit: 'months', higherIsBetter: false },
  // Producto
  { key: 'timeToActivation', name: 'Time to Activation', category: 'producto', formula: 'Promedio (activación – registro)', events: ['user_registered', 'activation_event'], unit: 'days', higherIsBetter: false },
  { key: 'featureAdoptionRate', name: 'Feature Adoption Rate', category: 'producto', formula: 'Usuarios feature / Usuarios activos', events: ['feature_used'], unit: 'percent', higherIsBetter: true },
  { key: 'sessionFrequency', name: 'Session Frequency', category: 'producto', formula: 'Sesiones / Usuario', events: ['session_started'], unit: 'number', higherIsBetter: true },
  // Estratégica
  { key: 'growthEfficiency', name: 'Growth Efficiency', category: 'estrategica', formula: 'Growth / CAC', events: ['subscription_started'], unit: 'ratio', higherIsBetter: true },
  { key: 'startupHealthScore', name: 'Startup Health Score', category: 'estrategica', formula: 'Score ponderado (Runway, ROI, Churn, Growth)', events: [], unit: 'score', higherIsBetter: true },
  // Riesgo Estructural
  { key: 'platformRiskIndex', name: 'Platform Risk Index', category: 'riesgo_estructural', formula: '% ingresos plataforma dominante', events: ['subscription_started'], unit: 'percent', higherIsBetter: false },
  // Escalabilidad
  { key: 'operationalLeverage', name: 'Operational Leverage', category: 'escalabilidad', formula: 'Revenue Growth / Cost Growth', events: ['subscription_started'], unit: 'ratio', higherIsBetter: true },
  // Portafolio
  { key: 'portfolioPerformanceIndex', name: 'Portfolio Performance Index', category: 'portafolio', formula: 'ROI ponderado', events: ['subscription_started'], unit: 'score', higherIsBetter: true },
];

// 9 Fundamental Events
export interface FundamentalEvent {
  name: string;
  description: string;
}

export const FUNDAMENTAL_EVENTS: FundamentalEvent[] = [
  { name: 'user_registered', description: 'Usuario crea cuenta en la app' },
  { name: 'activation_event', description: 'Usuario realiza acción clave que demuestra valor' },
  { name: 'trial_started', description: 'Usuario inicia periodo gratuito' },
  { name: 'subscription_started', description: 'Usuario inicia suscripción paga' },
  { name: 'subscription_renewed', description: 'Renovación automática exitosa' },
  { name: 'subscription_cancelled', description: 'Usuario cancela su suscripción' },
  { name: 'refund_issued', description: 'Reembolso realizado al usuario' },
  { name: 'session_started', description: 'Inicio de sesión activa' },
  { name: 'order_completed', description: 'Pedido completado' },
];

// Metric values per project - keyed by metric key
export type ProjectMetrics = Record<string, number>;

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  industry: Industry;
  status: ProjectStatus;
  priority: Priority;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  teamIds: string[];
  milestones: Milestone[];
  progress: number;
  techStack: string[];
  metrics: ProjectMetrics;
  fixedCosts: CostEntry[];
  variableCosts: CostEntry[];
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalTasks: number;
  completedTasks: number;
  status: 'active' | 'completed' | 'planned';
}

export interface RevenueEntry {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export const INDUSTRY_LABELS: Record<Industry, string> = {
  fintech: 'Fintech',
  healthcare: 'Salud',
  ecommerce: 'E-Commerce',
  education: 'Educación',
  logistics: 'Logística',
  saas: 'SaaS',
  media: 'Media',
  real_estate: 'Bienes Raíces',
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  proposal: 'Propuesta',
  in_development: 'En Desarrollo',
  testing: 'Testing',
  completed: 'Completado',
  on_hold: 'En Pausa',
};

export const ROLE_LABELS: Record<Developer['role'], string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
  mobile: 'Mobile',
  devops: 'DevOps',
  designer: 'Diseñador UI/UX',
  qa: 'QA Engineer',
  pm: 'Project Manager',
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  proposal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  in_development: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  testing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  on_hold: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-slate-500/20 text-slate-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

// Exportar tipos de Supabase
export * from './supabase'