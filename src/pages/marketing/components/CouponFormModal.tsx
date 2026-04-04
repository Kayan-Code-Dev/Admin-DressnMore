import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Coupon, type CouponType, type CouponPlan } from '../../../mocks/marketing';

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all bg-white';

const PLANS: CouponPlan[] = ['all', 'starter', 'pro', 'enterprise'];

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

interface CouponFormModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => void;
}

export default function CouponFormModal({ coupon, isOpen, onClose, onSave }: CouponFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!coupon;

  const [form, setForm] = useState({
    code: '', type: 'percentage' as CouponType, value: 20,
    maxUses: 0, targetPlan: 'all' as CouponPlan,
    expiresAt: '', active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (coupon) {
      setForm({ code: coupon.code, type: coupon.type, value: coupon.value, maxUses: coupon.maxUses, targetPlan: coupon.targetPlan, expiresAt: coupon.expiresAt, active: coupon.status === 'active' });
    } else {
      setForm({ code: '', type: 'percentage', value: 20, maxUses: 0, targetPlan: 'all', expiresAt: '', active: true });
    }
    setErrors({});
  }, [coupon, isOpen]);

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = 'Required';
    if (form.value <= 0) e.value = 'Must be > 0';
    if (form.type === 'percentage' && form.value > 100) e.value = 'Max 100%';
    if (!form.expiresAt) e.expiresAt = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ code: form.code.toUpperCase().trim(), type: form.type, value: form.value, maxUses: form.maxUses, targetPlan: form.targetPlan, status: form.active ? 'active' : 'inactive', expiresAt: form.expiresAt });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-teal-50">
              <i className="ri-coupon-line text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {isEdit ? t('marketing.coupons.form.title_edit') : t('marketing.coupons.form.title_add')}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.coupons.form.code')}</label>
            <div className="flex gap-2">
              <input type="text" value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder={t('marketing.coupons.form.code_placeholder')}
                className={`flex-1 ${inputCls} font-mono uppercase ${errors.code ? 'border-rose-400' : ''}`} />
              <button type="button" onClick={() => set('code', generateCode())}
                className="px-3 py-2.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-refresh-line me-1" />{t('marketing.coupons.form.generate')}
              </button>
            </div>
            {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.coupons.form.type')}</label>
              <div className="flex gap-2">
                {(['percentage', 'fixed'] as CouponType[]).map((t_) => (
                  <button key={t_} type="button" onClick={() => set('type', t_)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-2 ${form.type === t_ ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}>
                    {t_ === 'percentage' ? '%' : '$'} {t(`marketing.coupons.types.${t_}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.coupons.form.value')}</label>
              <div className="relative">
                <input type="number" value={form.value} onChange={(e) => set('value', +e.target.value)} min={1} max={form.type === 'percentage' ? 100 : 9999}
                  className={`${inputCls} pe-8 ${errors.value ? 'border-rose-400' : ''}`} />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  {form.type === 'percentage' ? '%' : '$'}
                </span>
              </div>
              {errors.value && <p className="text-xs text-rose-500 mt-1">{errors.value}</p>}
            </div>
          </div>

          {/* Max Uses + Target Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.coupons.form.max_uses')}</label>
              <input type="number" value={form.maxUses} onChange={(e) => set('maxUses', +e.target.value)} min={0}
                className={inputCls} placeholder="0" />
              <p className="text-xs text-gray-400 mt-1">{t('marketing.coupons.form.max_uses_hint')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.coupons.form.target_plan')}</label>
              <select value={form.targetPlan} onChange={(e) => set('targetPlan', e.target.value as CouponPlan)} className={inputCls}>
                {PLANS.map((p) => <option key={p} value={p}>{t(`marketing.coupons.plan.${p}`)}</option>)}
              </select>
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.coupons.form.expiry')}</label>
            <input type="date" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)}
              className={`${inputCls} ${errors.expiresAt ? 'border-rose-400' : ''}`} />
            {errors.expiresAt && <p className="text-xs text-rose-500 mt-1">{errors.expiresAt}</p>}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-800">{t('marketing.coupons.form.active')}</p>
            <div onClick={() => set('active', !form.active)}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${form.active ? 'bg-teal-600' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.active ? 'start-5' : 'start-0.5'}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            {t('marketing.coupons.form.cancel')}
          </button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
            {t('marketing.coupons.form.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
