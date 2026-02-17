export interface TaxObligation {
  id: string;
  name: string;
  type: 'iva' | 'isr' | 'retenciones' | 'imss' | 'local';
  rate: number;
  frequency: 'mensual' | 'trimestral' | 'anual';
  dueDay: number; // día del mes
  status: 'al_dia' | 'pendiente' | 'vencido';
}

export interface TaxPayment {
  month: string;
  iva: number;
  isr: number;
  retenciones: number;
  imss: number;
  total: number;
  deducible: number;
}

export interface DeductibleCategory {
  category: string;
  amount: number;
  percentage: number; // del total
}

export const taxObligations: TaxObligation[] = [
  { id: 't1', name: 'IVA Mensual', type: 'iva', rate: 16, frequency: 'mensual', dueDay: 17, status: 'al_dia' },
  { id: 't2', name: 'ISR Provisional', type: 'isr', rate: 30, frequency: 'mensual', dueDay: 17, status: 'al_dia' },
  { id: 't3', name: 'Retención ISR Salarios', type: 'retenciones', rate: 0, frequency: 'mensual', dueDay: 17, status: 'pendiente' },
  { id: 't4', name: 'Cuotas IMSS', type: 'imss', rate: 0, frequency: 'mensual', dueDay: 17, status: 'al_dia' },
  { id: 't5', name: 'ISR Anual', type: 'isr', rate: 30, frequency: 'anual', dueDay: 31, status: 'pendiente' },
  { id: 't6', name: 'Impuesto Sobre Nómina', type: 'local', rate: 3, frequency: 'mensual', dueDay: 17, status: 'al_dia' },
];

export const taxPayments: TaxPayment[] = [
  { month: 'Jul 2024', iva: 5120, isr: 9600, retenciones: 3200, imss: 2800, total: 20720, deducible: 8500 },
  { month: 'Ago 2024', iva: 5920, isr: 11200, retenciones: 3500, imss: 2800, total: 23420, deducible: 9200 },
  { month: 'Sep 2024', iva: 5440, isr: 10080, retenciones: 3300, imss: 2800, total: 21620, deducible: 8800 },
  { month: 'Oct 2024', iva: 6960, isr: 13440, retenciones: 3800, imss: 2800, total: 27000, deducible: 10500 },
  { month: 'Nov 2024', iva: 6560, isr: 12480, retenciones: 3600, imss: 2800, total: 25440, deducible: 9800 },
  { month: 'Dic 2024', iva: 8320, isr: 16800, retenciones: 4100, imss: 2800, total: 32020, deducible: 12200 },
  { month: 'Ene 2025', iva: 6240, isr: 11200, retenciones: 3400, imss: 2900, total: 23740, deducible: 9500 },
  { month: 'Feb 2025', iva: 7200, isr: 13440, retenciones: 3700, imss: 2900, total: 27240, deducible: 10800 },
  { month: 'Mar 2025', iva: 7680, isr: 14560, retenciones: 3900, imss: 2900, total: 29040, deducible: 11500 },
  { month: 'Abr 2025', iva: 8080, isr: 15680, retenciones: 4000, imss: 2900, total: 30660, deducible: 12000 },
  { month: 'May 2025', iva: 8640, isr: 17280, retenciones: 4200, imss: 2900, total: 33020, deducible: 12800 },
  { month: 'Jun 2025', iva: 9280, isr: 19200, retenciones: 4400, imss: 2900, total: 35780, deducible: 13500 },
];

export const deductibles: DeductibleCategory[] = [
  { category: 'Nómina y honorarios', amount: 42000, percentage: 34 },
  { category: 'Servicios cloud (AWS, GCP)', amount: 18500, percentage: 15 },
  { category: 'Software y licencias', amount: 12800, percentage: 10 },
  { category: 'Oficina y coworking', amount: 8500, percentage: 7 },
  { category: 'Equipo de cómputo', amount: 15200, percentage: 12 },
  { category: 'Capacitación y cursos', amount: 6400, percentage: 5 },
  { category: 'Viáticos y representación', amount: 4200, percentage: 3 },
  { category: 'Telecomunicaciones', amount: 3800, percentage: 3 },
  { category: 'Seguros', amount: 5600, percentage: 5 },
  { category: 'Otros gastos operativos', amount: 7500, percentage: 6 },
];

export const TAX_TYPE_LABELS: Record<TaxObligation['type'], string> = {
  iva: 'IVA',
  isr: 'ISR',
  retenciones: 'Retenciones',
  imss: 'IMSS',
  local: 'Local',
};

export const TAX_STATUS_COLORS: Record<TaxObligation['status'], string> = {
  al_dia: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  vencido: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const TAX_STATUS_LABELS: Record<TaxObligation['status'], string> = {
  al_dia: 'Al día',
  pendiente: 'Pendiente',
  vencido: 'Vencido',
};
