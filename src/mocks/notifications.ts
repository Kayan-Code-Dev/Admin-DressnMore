export type NotifStatus = 'sent' | 'scheduled' | 'draft' | 'failed';
export type NotifTarget = 'all' | 'by_plan' | 'by_status';
export type NotifChannel = 'inapp' | 'email' | 'sms';

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  target: NotifTarget;
  targetDetail: string;
  channels: NotifChannel[];
  sentTo: number;
  opened: number;
  openRate: number;
  status: NotifStatus;
  sentAt: string;
}

export const notificationsData: NotificationRecord[] = [
  { id: 'n1', title: 'New Feature: WhatsApp Integration', message: 'We\'ve launched WhatsApp Business integration for Pro and Enterprise plans. Connect your atelier today!', target: 'by_plan', targetDetail: 'Pro, Enterprise', channels: ['inapp', 'email'], sentTo: 87, opened: 71, openRate: 82, status: 'sent', sentAt: '2026-03-18 10:00' },
  { id: 'n2', title: 'Scheduled Maintenance — March 22', message: 'The platform will be under maintenance on March 22, 2026 from 02:00 AM to 04:00 AM (Riyadh time). All services will be temporarily unavailable.', target: 'all', targetDetail: 'All Ateliers', channels: ['inapp', 'email', 'sms'], sentTo: 142, opened: 118, openRate: 83, status: 'sent', sentAt: '2026-03-17 09:00' },
  { id: 'n3', title: '⚡ Renew Your Subscription — Special Offer', message: 'Your subscription is expiring soon. Renew now and get 2 months free when you upgrade to an annual plan!', target: 'by_status', targetDetail: 'Trial, Expiring', channels: ['inapp', 'email', 'sms'], sentTo: 23, opened: 19, openRate: 83, status: 'sent', sentAt: '2026-03-15 12:00' },
  { id: 'n4', title: 'Platform Update: Invoice Templates', message: 'New customizable invoice templates are now available for all plans. Head to Settings → Invoices to personalize your brand.', target: 'all', targetDetail: 'All Ateliers', channels: ['inapp'], sentTo: 142, opened: 97, openRate: 68, status: 'sent', sentAt: '2026-03-12 11:00' },
  { id: 'n5', title: 'Ramadan Hours & Special Features', message: 'Wishing you a blessed Ramadan! We\'ve added special scheduling features for Ramadan working hours.', target: 'all', targetDetail: 'All Ateliers', channels: ['inapp', 'email'], sentTo: 0, opened: 0, openRate: 0, status: 'scheduled', sentAt: '2026-03-22 08:00' },
  { id: 'n6', title: 'AI Size Recommendations Now Live', message: 'The AI-powered size recommendation engine is now available in beta for Enterprise plan users. Try it today!', target: 'by_plan', targetDetail: 'Enterprise', channels: ['inapp', 'email'], sentTo: 31, opened: 28, openRate: 90, status: 'sent', sentAt: '2026-03-10 14:00' },
  { id: 'n7', title: 'Tips: Getting the Most from Analytics', message: 'We\'ve published a new guide on using the advanced analytics dashboard to track your growth.', target: 'by_plan', targetDetail: 'Pro, Enterprise', channels: ['inapp'], sentTo: 87, opened: 52, openRate: 60, status: 'sent', sentAt: '2026-03-08 09:30' },
  { id: 'n8', title: 'April Pricing Update Notice', message: 'Starting April 1st, we\'re updating our pricing plans. Existing subscribers are grandfathered at their current rates.', target: 'all', targetDetail: 'All Ateliers', channels: ['inapp', 'email', 'sms'], sentTo: 0, opened: 0, openRate: 0, status: 'draft', sentAt: '—' },
];
