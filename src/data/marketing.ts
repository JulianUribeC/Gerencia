export interface Campaign {
  id: string;
  name: string;
  channel: 'google_ads' | 'meta' | 'linkedin' | 'twitter' | 'organic' | 'referral' | 'email';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number; // user_registered
  trials: number; // trial_started
  conversions: number; // subscription_started
  startDate: string;
  endDate: string;
}

export interface FunnelStage {
  stage: string;
  event: string;
  count: number;
  color: string;
}

export interface ChannelPerformance {
  channel: string;
  spend: number;
  leads: number;
  conversions: number;
  cac: number;
  roi: number;
}

export interface MonthlyMarketing {
  month: string;
  spend: number;
  leads: number;
  trials: number;
  conversions: number;
  cac: number;
}

export const campaigns: Campaign[] = [
  {
    id: 'cm1', name: 'BancoFlex Launch Ads', channel: 'google_ads', status: 'active',
    budget: 8000, spent: 5200, impressions: 125000, clicks: 3750, leads: 820, trials: 310, conversions: 62,
    startDate: '2025-03-01', endDate: '2025-06-30',
  },
  {
    id: 'cm2', name: 'MediCare Awareness', channel: 'meta', status: 'active',
    budget: 6000, spent: 4100, impressions: 180000, clicks: 5400, leads: 1200, trials: 480, conversions: 96,
    startDate: '2025-02-15', endDate: '2025-05-31',
  },
  {
    id: 'cm3', name: 'Terranova Tech Brand', channel: 'linkedin', status: 'active',
    budget: 4500, spent: 3200, impressions: 45000, clicks: 1350, leads: 180, trials: 0, conversions: 12,
    startDate: '2025-01-01', endDate: '2025-12-31',
  },
  {
    id: 'cm4', name: 'ShopNow Early Access', channel: 'meta', status: 'paused',
    budget: 5000, spent: 2800, impressions: 95000, clicks: 2850, leads: 650, trials: 195, conversions: 39,
    startDate: '2025-04-01', endDate: '2025-07-31',
  },
  {
    id: 'cm5', name: 'EduTech Content SEO', channel: 'organic', status: 'completed',
    budget: 3000, spent: 3000, impressions: 320000, clicks: 12800, leads: 2400, trials: 720, conversions: 216,
    startDate: '2024-06-01', endDate: '2025-01-31',
  },
  {
    id: 'cm6', name: 'MediaFlow Influencer', channel: 'twitter', status: 'completed',
    budget: 12000, spent: 11500, impressions: 850000, clicks: 25500, leads: 8500, trials: 2550, conversions: 510,
    startDate: '2024-04-01', endDate: '2024-12-31',
  },
  {
    id: 'cm7', name: 'Newsletter Nurture', channel: 'email', status: 'active',
    budget: 1200, spent: 800, impressions: 28000, clicks: 4200, leads: 350, trials: 140, conversions: 42,
    startDate: '2025-01-01', endDate: '2025-12-31',
  },
  {
    id: 'cm8', name: 'Partner Referral Program', channel: 'referral', status: 'active',
    budget: 2000, spent: 1400, impressions: 0, clicks: 0, leads: 420, trials: 168, conversions: 67,
    startDate: '2025-02-01', endDate: '2025-12-31',
  },
];

// Aggregate funnel from all campaigns
export const funnelData: FunnelStage[] = [
  { stage: 'Impressions', event: '-', count: 1643000, color: '#3b82f6' },
  { stage: 'Clicks', event: '-', count: 55850, color: '#6366f1' },
  { stage: 'Registros', event: 'user_registered', count: 14520, color: '#8b5cf6' },
  { stage: 'Activaciones', event: 'activation_event', count: 8712, color: '#a855f7' },
  { stage: 'Trials', event: 'trial_started', count: 4563, color: '#d946ef' },
  { stage: 'Suscripciones', event: 'subscription_started', count: 1044, color: '#ec4899' },
  { stage: 'Renovaciones', event: 'subscription_renewed', count: 876, color: '#10b981' },
];

export const channelPerformance: ChannelPerformance[] = [
  { channel: 'Google Ads', spend: 5200, leads: 820, conversions: 62, cac: 83.9, roi: 1.8 },
  { channel: 'Meta (FB/IG)', spend: 6900, leads: 1850, conversions: 135, cac: 51.1, roi: 3.2 },
  { channel: 'LinkedIn', spend: 3200, leads: 180, conversions: 12, cac: 266.7, roi: 0.4 },
  { channel: 'Twitter/X', spend: 11500, leads: 8500, conversions: 510, cac: 22.5, roi: 5.8 },
  { channel: 'Orgánico (SEO)', spend: 3000, leads: 2400, conversions: 216, cac: 13.9, roi: 9.2 },
  { channel: 'Referral', spend: 1400, leads: 420, conversions: 67, cac: 20.9, roi: 6.1 },
  { channel: 'Email', spend: 800, leads: 350, conversions: 42, cac: 19.0, roi: 6.5 },
];

export const monthlyMarketing: MonthlyMarketing[] = [
  { month: 'Jul 2024', spend: 4200, leads: 680, trials: 204, conversions: 41, cac: 102.4 },
  { month: 'Ago 2024', spend: 4800, leads: 850, trials: 255, conversions: 51, cac: 94.1 },
  { month: 'Sep 2024', spend: 4500, leads: 920, trials: 276, conversions: 55, cac: 81.8 },
  { month: 'Oct 2024', spend: 5200, leads: 1100, trials: 330, conversions: 66, cac: 78.8 },
  { month: 'Nov 2024', spend: 5000, leads: 1250, trials: 375, conversions: 75, cac: 66.7 },
  { month: 'Dic 2024', spend: 6500, leads: 1800, trials: 540, conversions: 108, cac: 60.2 },
  { month: 'Ene 2025', spend: 3800, leads: 980, trials: 294, conversions: 59, cac: 64.4 },
  { month: 'Feb 2025', spend: 4200, leads: 1150, trials: 345, conversions: 69, cac: 60.9 },
  { month: 'Mar 2025', spend: 4800, leads: 1320, trials: 396, conversions: 79, cac: 60.8 },
  { month: 'Abr 2025', spend: 5100, leads: 1450, trials: 435, conversions: 87, cac: 58.6 },
  { month: 'May 2025', spend: 5500, leads: 1600, trials: 480, conversions: 96, cac: 57.3 },
  { month: 'Jun 2025', spend: 5800, leads: 1750, trials: 525, conversions: 105, cac: 55.2 },
];

export const CHANNEL_LABELS: Record<Campaign['channel'], string> = {
  google_ads: 'Google Ads',
  meta: 'Meta (FB/IG)',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  organic: 'Orgánico',
  referral: 'Referral',
  email: 'Email',
};

export const CAMPAIGN_STATUS_COLORS: Record<Campaign['status'], string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};
