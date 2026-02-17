import type { MetricHealth, MetricDefinition } from '@/types';

export function formatMetricValue(value: number, unit: MetricDefinition['unit']): string {
  if (value === 0) return '—';
  switch (unit) {
    case 'currency': return `$${value.toLocaleString('en-US')}`;
    case 'percent': return `${value.toFixed(1)}%`;
    case 'ratio': return `${value.toFixed(1)}x`;
    case 'months': return value >= 999 ? 'N/A' : `${value.toFixed(1)} meses`;
    case 'days': return `${value.toFixed(1)} días`;
    case 'score': return `${Math.round(value)}/100`;
    case 'number': return value.toLocaleString('en-US');
  }
}

export function getMetricHealth(key: string, value: number): MetricHealth {
  if (value === 0) return 'warning';

  const thresholds: Record<string, { healthy: (v: number) => boolean; warning: (v: number) => boolean }> = {
    burnRate: { healthy: (v) => v < 5000, warning: (v) => v < 15000 },
    runway: { healthy: (v) => v > 6, warning: (v) => v > 3 },
    fixedCostRatio: { healthy: (v) => v < 50, warning: (v) => v < 70 },
    revenueConcentration: { healthy: (v) => v < 40, warning: (v) => v < 70 },
    mrr: { healthy: (v) => v > 10000, warning: (v) => v > 5000 },
    netRevenue: { healthy: (v) => v > 10000, warning: (v) => v > 5000 },
    revenueGrowthRate: { healthy: (v) => v > 10, warning: (v) => v > 5 },
    arpu: { healthy: (v) => v > 20, warning: (v) => v > 10 },
    grossMargin: { healthy: (v) => v > 60, warning: (v) => v > 40 },
    appRoi: { healthy: (v) => v > 50, warning: (v) => v > 0 },
    contributionMargin: { healthy: (v) => v > 15, warning: (v) => v > 5 },
    cac: { healthy: (v) => v < 20, warning: (v) => v < 50 },
    costPerLead: { healthy: (v) => v < 10, warning: (v) => v < 25 },
    trialToPaidConversion: { healthy: (v) => v > 15, warning: (v) => v > 5 },
    activationRate: { healthy: (v) => v > 40, warning: (v) => v > 20 },
    churnRate: { healthy: (v) => v < 5, warning: (v) => v < 8 },
    revenueChurn: { healthy: (v) => v < 5, warning: (v) => v < 8 },
    retentionRate: { healthy: (v) => v > 95, warning: (v) => v > 90 },
    averageLifetime: { healthy: (v) => v > 18, warning: (v) => v > 12 },
    totalUsers: { healthy: (v) => v > 5000, warning: (v) => v > 1000 },
    dauMauRatio: { healthy: (v) => v > 30, warning: (v) => v > 20 },
    ltv: { healthy: (v) => v > 500, warning: (v) => v > 200 },
    ltvCacRatio: { healthy: (v) => v > 3, warning: (v) => v > 1.5 },
    paybackPeriod: { healthy: (v) => v < 3, warning: (v) => v < 6 },
    timeToActivation: { healthy: (v) => v < 2, warning: (v) => v < 5 },
    featureAdoptionRate: { healthy: (v) => v > 50, warning: (v) => v > 30 },
    sessionFrequency: { healthy: (v) => v > 4, warning: (v) => v > 2 },
    growthEfficiency: { healthy: (v) => v > 1, warning: (v) => v > 0.5 },
    startupHealthScore: { healthy: (v) => v > 70, warning: (v) => v > 50 },
    platformRiskIndex: { healthy: (v) => v < 40, warning: (v) => v < 70 },
    operationalLeverage: { healthy: (v) => v > 2, warning: (v) => v > 1 },
    portfolioPerformanceIndex: { healthy: (v) => v > 70, warning: (v) => v > 50 },
    margenOperativo: { healthy: (v) => v > 30, warning: (v) => v > 15 },
    cashBalance: { healthy: (v) => v > 50000, warning: (v) => v > 20000 },
  };

  const t = thresholds[key];
  if (!t) return 'warning';
  if (t.healthy(value)) return 'healthy';
  if (t.warning(value)) return 'warning';
  return 'critical';
}

export const HEALTH_COLORS: Record<MetricHealth, string> = {
  healthy: 'text-emerald-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400',
};

export const HEALTH_BG: Record<MetricHealth, string> = {
  healthy: 'bg-emerald-500/15 border-emerald-500/30',
  warning: 'bg-yellow-500/15 border-yellow-500/30',
  critical: 'bg-red-500/15 border-red-500/30',
};

export const HEALTH_DOT: Record<MetricHealth, string> = {
  healthy: 'bg-emerald-400',
  warning: 'bg-yellow-400',
  critical: 'bg-red-400',
};
