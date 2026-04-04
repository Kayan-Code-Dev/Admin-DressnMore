export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxEmployees: number;
  maxBranches: number;
  features: string[];
  isActive: boolean;
  activeSubscribers: number;
  isPopular: boolean;
  colorScheme: 'slate' | 'teal' | 'amber';
  icon: string;
}

export const plansData: Plan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    monthlyPrice: 29,
    yearlyPrice: 290,
    maxEmployees: 5,
    maxBranches: 1,
    features: [
      'Up to 5 employees',
      '1 branch',
      'Basic reporting',
      'Customer management',
      'Order tracking',
      'Email support',
    ],
    isActive: true,
    activeSubscribers: 218,
    isPopular: false,
    colorScheme: 'slate',
    icon: 'ri-seedling-line',
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    monthlyPrice: 99,
    yearlyPrice: 990,
    maxEmployees: 25,
    maxBranches: 3,
    features: [
      'Up to 25 employees',
      'Up to 3 branches',
      'Advanced analytics',
      'Customer management',
      'Order tracking',
      'Inventory management',
      'SMS notifications',
      'Priority email support',
    ],
    isActive: true,
    activeSubscribers: 847,
    isPopular: true,
    colorScheme: 'teal',
    icon: 'ri-rocket-line',
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    maxEmployees: -1,
    maxBranches: -1,
    features: [
      'Unlimited employees',
      'Unlimited branches',
      'Full analytics suite',
      'Customer management',
      'Order tracking',
      'Inventory management',
      'SMS & WhatsApp notifications',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    isActive: true,
    activeSubscribers: 219,
    isPopular: false,
    colorScheme: 'amber',
    icon: 'ri-building-4-line',
  },
];
