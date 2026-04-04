export const statsData = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$124,580',
    change: '+12.5%',
    changeType: 'up' as const,
    icon: 'ri-money-dollar-circle-line',
    color: 'teal',
  },
  {
    id: 'subscriptions',
    label: 'Active Subscriptions',
    value: '1,284',
    change: '+8.2%',
    changeType: 'up' as const,
    icon: 'ri-checkbox-circle-line',
    color: 'emerald',
  },
  {
    id: 'ateliers',
    label: 'New Ateliers',
    value: '48',
    change: '+23.1%',
    changeType: 'up' as const,
    icon: 'ri-store-2-line',
    color: 'amber',
  },
  {
    id: 'churn',
    label: 'Churn Rate',
    value: '3.2%',
    change: '-0.8%',
    changeType: 'down' as const,
    icon: 'ri-arrow-down-circle-line',
    color: 'rose',
  },
];

export const revenueChartData = [
  { month: 'Jan', revenue: 42000, subscriptions: 820 },
  { month: 'Feb', revenue: 48000, subscriptions: 890 },
  { month: 'Mar', revenue: 55000, subscriptions: 950 },
  { month: 'Apr', revenue: 51000, subscriptions: 920 },
  { month: 'May', revenue: 68000, subscriptions: 1050 },
  { month: 'Jun', revenue: 74000, subscriptions: 1120 },
  { month: 'Jul', revenue: 82000, subscriptions: 1200 },
  { month: 'Aug', revenue: 91000, subscriptions: 1240 },
  { month: 'Sep', revenue: 87000, subscriptions: 1210 },
  { month: 'Oct', revenue: 99000, subscriptions: 1260 },
  { month: 'Nov', revenue: 108000, subscriptions: 1280 },
  { month: 'Dec', revenue: 124580, subscriptions: 1284 },
];

export const growthChartData = [
  { month: 'Jan', newAteliers: 8, churned: 2 },
  { month: 'Feb', newAteliers: 14, churned: 3 },
  { month: 'Mar', newAteliers: 12, churned: 4 },
  { month: 'Apr', newAteliers: 18, churned: 2 },
  { month: 'May', newAteliers: 22, churned: 5 },
  { month: 'Jun', newAteliers: 31, churned: 3 },
  { month: 'Jul', newAteliers: 28, churned: 4 },
  { month: 'Aug', newAteliers: 35, churned: 6 },
  { month: 'Sep', newAteliers: 29, churned: 3 },
  { month: 'Oct', newAteliers: 42, churned: 5 },
  { month: 'Nov', newAteliers: 38, churned: 4 },
  { month: 'Dec', newAteliers: 48, churned: 7 },
];

export const latestSubscriptions = [
  { id: 'SUB-001', atelier: 'Elegance Studio', plan: 'Pro', amount: '$99', status: 'active', date: '2026-03-18' },
  { id: 'SUB-002', atelier: 'Couture House', plan: 'Starter', amount: '$29', status: 'active', date: '2026-03-17' },
  { id: 'SUB-003', atelier: 'La Belle Mode', plan: 'Enterprise', amount: '$299', status: 'pending', date: '2026-03-17' },
  { id: 'SUB-004', atelier: 'Maison Chic', plan: 'Pro', amount: '$99', status: 'active', date: '2026-03-16' },
  { id: 'SUB-005', atelier: 'Fashion Forward', plan: 'Starter', amount: '$29', status: 'suspended', date: '2026-03-15' },
  { id: 'SUB-006', atelier: 'Royal Threads', plan: 'Enterprise', amount: '$299', status: 'active', date: '2026-03-15' },
  { id: 'SUB-007', atelier: 'Silk & Style', plan: 'Pro', amount: '$99', status: 'active', date: '2026-03-14' },
];

export const latestActivities = [
  { id: 1, user: 'Ahmed Al-Rashidi', action: 'Upgraded to Enterprise plan', type: 'upgrade', date: '2026-03-20 09:14' },
  { id: 2, user: 'Sara Khalil', action: 'New atelier registered', type: 'register', date: '2026-03-20 08:52' },
  { id: 3, user: 'Admin', action: 'Suspended atelier: Fashion Forward', type: 'suspend', date: '2026-03-20 08:30' },
  { id: 4, user: 'Lina Moussa', action: 'Payment received $299', type: 'payment', date: '2026-03-19 17:45' },
  { id: 5, user: 'Omar Farouk', action: 'Cancelled subscription', type: 'cancel', date: '2026-03-19 16:22' },
  { id: 6, user: 'Nadia Hassan', action: 'Reset password', type: 'security', date: '2026-03-19 14:10' },
  { id: 7, user: 'Khalid Sami', action: 'New support ticket opened', type: 'support', date: '2026-03-19 11:05' },
];
