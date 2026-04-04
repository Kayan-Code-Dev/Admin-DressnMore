export interface AdminRole {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  usersCount: number;
  permissions: string[];
  createdAt: string;
}

export const ALL_PERMISSIONS = [
  'view_dashboard',
  'view_ateliers','add_atelier','edit_atelier','suspend_atelier','delete_atelier','login_as_atelier',
  'view_subscriptions','edit_subscription','cancel_subscription','renew_subscription',
  'view_payments','refund_payment','mark_paid',
  'view_plans','add_plan','edit_plan','delete_plan',
  'view_flags','edit_flags',
  'view_tickets','reply_ticket','close_ticket',
  'view_users','add_user','edit_user','delete_user',
  'view_reports','export_reports',
  'view_settings','edit_settings',
  'view_notifications','send_notifications',
  'view_logs',
];

export const adminRolesData: AdminRole[] = [
  {
    id: 'r1', name: 'Super Admin', description: 'Full access to all platform features and settings',
    color: 'teal', isSystem: true, usersCount: 1, permissions: [...ALL_PERMISSIONS], createdAt: '2025-01-01',
  },
  {
    id: 'r2', name: 'Admin', description: 'Manage ateliers, subscriptions, plans and payments',
    color: 'emerald', isSystem: true, usersCount: 2,
    permissions: ['view_dashboard','view_ateliers','add_atelier','edit_atelier','suspend_atelier','view_subscriptions','edit_subscription','cancel_subscription','renew_subscription','view_payments','mark_paid','view_plans','add_plan','edit_plan','view_reports','export_reports','view_tickets','reply_ticket','close_ticket'],
    createdAt: '2025-01-01',
  },
  {
    id: 'r3', name: 'Support Agent', description: 'Handle customer support tickets and basic atelier queries',
    color: 'amber', isSystem: true, usersCount: 2,
    permissions: ['view_dashboard','view_ateliers','view_subscriptions','view_payments','view_tickets','reply_ticket','close_ticket','view_reports'],
    createdAt: '2025-01-01',
  },
  {
    id: 'r4', name: 'Finance Manager', description: 'Access payments, invoices, financial reports and billing',
    color: 'green', isSystem: true, usersCount: 2,
    permissions: ['view_dashboard','view_ateliers','view_subscriptions','view_payments','refund_payment','mark_paid','view_plans','view_reports','export_reports'],
    createdAt: '2025-01-01',
  },
  {
    id: 'r5', name: 'Content Manager', description: 'Manage platform plans, feature flags and notifications',
    color: 'rose', isSystem: false, usersCount: 1,
    permissions: ['view_dashboard','view_plans','add_plan','edit_plan','view_flags','edit_flags','view_notifications','send_notifications'],
    createdAt: '2025-03-10',
  },
  {
    id: 'r6', name: 'Billing Specialist', description: 'Focused on payment processing, refunds and renewal management',
    color: 'orange', isSystem: false, usersCount: 0,
    permissions: ['view_dashboard','view_ateliers','view_subscriptions','renew_subscription','view_payments','refund_payment','mark_paid','view_reports','export_reports'],
    createdAt: '2025-06-15',
  },
];
