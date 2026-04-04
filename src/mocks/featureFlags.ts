export type FlagCategory = 'core' | 'advanced' | 'integrations' | 'beta';

export interface FeatureFlag {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: FlagCategory;
  isBeta?: boolean;
  plans: { starter: boolean; pro: boolean; enterprise: boolean };
}

export const featureFlagsData: FeatureFlag[] = [
  // Core
  { id: 'ff01', name: 'Customer Management', nameAr: 'إدارة العملاء', description: 'Add, edit and manage customer profiles', descriptionAr: 'إضافة وتعديل وإدارة ملفات العملاء', category: 'core', plans: { starter: true, pro: true, enterprise: true } },
  { id: 'ff02', name: 'Order Tracking', nameAr: 'تتبع الطلبات', description: 'Track orders from creation to delivery', descriptionAr: 'تتبع الطلبات من الإنشاء حتى التسليم', category: 'core', plans: { starter: true, pro: true, enterprise: true } },
  { id: 'ff03', name: 'Invoice Generation', nameAr: 'إنشاء الفواتير', description: 'Generate and send professional invoices', descriptionAr: 'إنشاء وإرسال فواتير احترافية', category: 'core', plans: { starter: true, pro: true, enterprise: true } },
  { id: 'ff04', name: 'Basic Inventory', nameAr: 'المخزن الأساسي', description: 'Track fabric and material inventory', descriptionAr: 'تتبع مخزون الأقمشة والمواد', category: 'core', plans: { starter: true, pro: true, enterprise: true } },
  { id: 'ff05', name: 'Employee Management', nameAr: 'إدارة الموظفين', description: 'Manage staff roles and work schedules', descriptionAr: 'إدارة أدوار الموظفين وجداول العمل', category: 'core', plans: { starter: false, pro: true, enterprise: true } },
  { id: 'ff06', name: 'Multi-Branch Support', nameAr: 'دعم متعدد الفروع', description: 'Operate and manage multiple branches', descriptionAr: 'تشغيل وإدارة فروع متعددة', category: 'core', plans: { starter: false, pro: false, enterprise: true } },

  // Advanced
  { id: 'ff07', name: 'Advanced Analytics', nameAr: 'تحليلات متقدمة', description: 'Revenue charts, retention and growth metrics', descriptionAr: 'مخططات الإيرادات ومقاييس النمو والاحتفاظ', category: 'advanced', plans: { starter: false, pro: true, enterprise: true } },
  { id: 'ff08', name: 'Customer Loyalty Program', nameAr: 'برنامج ولاء العملاء', description: 'Points, rewards and tier-based loyalty system', descriptionAr: 'نقاط ومكافآت ونظام ولاء متدرج', category: 'advanced', plans: { starter: false, pro: true, enterprise: true } },
  { id: 'ff09', name: 'Automated SMS Reminders', nameAr: 'تذكيرات SMS تلقائية', description: 'Auto-send order and appointment reminders', descriptionAr: 'إرسال تذكيرات الطلبات والمواعيد تلقائياً', category: 'advanced', plans: { starter: false, pro: true, enterprise: true } },
  { id: 'ff10', name: 'Custom Branding', nameAr: 'علامة تجارية مخصصة', description: 'Custom logo, colors and domain for client portal', descriptionAr: 'شعار وألوان ونطاق مخصص لبوابة العملاء', category: 'advanced', plans: { starter: false, pro: false, enterprise: true } },
  { id: 'ff11', name: 'API Access', nameAr: 'الوصول للـ API', description: 'Full REST API access for integrations', descriptionAr: 'وصول كامل لـ REST API للتكاملات', category: 'advanced', plans: { starter: false, pro: false, enterprise: true } },
  { id: 'ff12', name: 'Bulk Export', nameAr: 'تصدير مجمّع', description: 'Export all data to Excel, CSV or PDF', descriptionAr: 'تصدير جميع البيانات إلى Excel أو CSV أو PDF', category: 'advanced', plans: { starter: false, pro: true, enterprise: true } },

  // Integrations
  { id: 'ff13', name: 'WhatsApp Integration', nameAr: 'تكامل واتساب', description: 'Send notifications via WhatsApp Business API', descriptionAr: 'إرسال إشعارات عبر واجهة برمجة واتساب للأعمال', category: 'integrations', plans: { starter: false, pro: true, enterprise: true } },
  { id: 'ff14', name: 'Accounting Software', nameAr: 'برنامج المحاسبة', description: 'Sync with Zoho Books, QuickBooks or Odoo', descriptionAr: 'مزامنة مع Zoho Books أو QuickBooks أو Odoo', category: 'integrations', plans: { starter: false, pro: false, enterprise: true } },
  { id: 'ff15', name: 'Multiple Payment Gateways', nameAr: 'بوابات دفع متعددة', description: 'Accept payments via Tap, HyperPay, Mada, STC', descriptionAr: 'قبول المدفوعات عبر Tap وHyperPay ومدى وSTC', category: 'integrations', plans: { starter: false, pro: true, enterprise: true } },
  { id: 'ff16', name: 'Google Calendar Sync', nameAr: 'مزامنة Google Calendar', description: 'Sync appointments with Google Calendar', descriptionAr: 'مزامنة المواعيد مع Google Calendar', category: 'integrations', plans: { starter: false, pro: true, enterprise: true } },

  // Beta
  { id: 'ff17', name: 'AI Size Recommendations', nameAr: 'توصيات المقاس بالذكاء الاصطناعي', description: 'Auto-suggest size based on body measurements', descriptionAr: 'اقتراح المقاس تلقائياً بناءً على قياسات الجسم', category: 'beta', isBeta: true, plans: { starter: false, pro: false, enterprise: true } },
  { id: 'ff18', name: 'Smart Pricing Suggestions', nameAr: 'اقتراحات التسعير الذكي', description: 'AI-powered pricing based on market trends', descriptionAr: 'تسعير مدعوم بالذكاء الاصطناعي بناءً على اتجاهات السوق', category: 'beta', isBeta: true, plans: { starter: false, pro: false, enterprise: false } },
  { id: 'ff19', name: 'Predictive Inventory', nameAr: 'المخزون التنبؤي', description: 'Predict restocking needs based on order patterns', descriptionAr: 'التنبؤ باحتياجات إعادة التخزين بناءً على أنماط الطلبات', category: 'beta', isBeta: true, plans: { starter: false, pro: false, enterprise: true } },
  { id: 'ff20', name: 'Voice Command Interface', nameAr: 'واجهة الأوامر الصوتية', description: 'Navigate and create orders using voice commands', descriptionAr: 'التنقل وإنشاء الطلبات باستخدام الأوامر الصوتية', category: 'beta', isBeta: true, plans: { starter: false, pro: false, enterprise: false } },
];
