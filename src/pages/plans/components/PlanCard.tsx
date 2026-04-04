import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Plan } from '../../../mocks/plans';
import ConfirmModal from '../../../components/base/ConfirmModal';

const colorConfig = {
  slate: {
    headerBg: 'bg-gradient-to-br from-gray-700 to-gray-900',
    iconBg: 'bg-gray-600',
    accent: 'text-gray-300',
    badge: 'bg-gray-500/30 text-gray-200',
    featBullet: 'bg-gray-400',
  },
  teal: {
    headerBg: 'bg-gradient-to-br from-teal-600 to-teal-900',
    iconBg: 'bg-teal-500',
    accent: 'text-teal-200',
    badge: 'bg-teal-500/30 text-teal-100',
    featBullet: 'bg-teal-400',
  },
  amber: {
    headerBg: 'bg-gradient-to-br from-amber-600 to-amber-900',
    iconBg: 'bg-amber-500',
    accent: 'text-amber-200',
    badge: 'bg-amber-500/30 text-amber-100',
    featBullet: 'bg-amber-400',
  },
};

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (planId: string) => void;
  onToggleActive: (planId: string) => void;
}

export default function PlanCard({ plan, onEdit, onDelete, onToggleActive }: PlanCardProps) {
  const { t } = useTranslation();
  const [showDelete, setShowDelete] = useState(false);
  const [pricePeriod, setPricePeriod] = useState<'monthly' | 'yearly'>('monthly');
  const cfg = colorConfig[plan.colorScheme];

  const displayPrice = pricePeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const savings = Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100);

  return (
    <>
      <div className={`bg-white rounded-2xl ring-1 overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 ${plan.isActive ? 'ring-gray-200' : 'ring-gray-100 opacity-70'}`}>
        {/* Card Header */}
        <div className={`${cfg.headerBg} px-5 py-5 relative`}>
          {plan.isPopular && (
            <div className="absolute top-3 end-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                <i className="ri-star-fill me-1" />{t('plans.most_popular')}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${cfg.iconBg}`}>
                <i className={`${plan.icon} text-xl text-white`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className={`text-xs ${cfg.accent}`}>
                  {plan.maxEmployees === -1 ? t('plans.unlimited') : plan.maxEmployees} {t('plans.max_employees').toLowerCase()} ·{' '}
                  {plan.maxBranches === -1 ? t('plans.unlimited') : plan.maxBranches} {t('plans.max_branches').toLowerCase()}
                </p>
              </div>
            </div>
            {/* Active Toggle */}
            <button type="button" onClick={() => onToggleActive(plan.id)} className="cursor-pointer"
              title={plan.isActive ? t('plans.plan_active') : t('plans.plan_inactive')}>
              <div className={`w-10 h-6 rounded-full transition-colors relative ${plan.isActive ? 'bg-white/30' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${plan.isActive ? 'start-4' : 'start-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {(['monthly', 'yearly'] as const).map((p) => (
                <button key={p} type="button" onClick={() => setPricePeriod(p)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${pricePeriod === p ? 'bg-white text-gray-900' : 'text-gray-500'}`}>
                  {t(`plans.${p}`)}
                </button>
              ))}
            </div>
            {pricePeriod === 'yearly' && savings > 0 && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                -{savings}%
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">${displayPrice}</span>
            <span className="text-sm text-gray-400">/{pricePeriod === 'monthly' ? t('plans.monthly').toLowerCase() : t('plans.yearly').toLowerCase()}</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-5 py-4 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t('plans.features')}</p>
          <ul className="space-y-2">
            {plan.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <i className="ri-check-line text-emerald-500 text-sm font-bold" />
                </div>
                <span className="text-sm text-gray-600">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-user-3-line text-sm text-gray-400" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{plan.activeSubscribers.toLocaleString()}</span>
            <span className="text-xs text-gray-400">{t('plans.active_subscribers').toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onEdit(plan)} title={t('plans.edit_plan')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer">
              <i className="ri-edit-line text-base" />
            </button>
            <button type="button" onClick={() => setShowDelete(true)} title={t('plans.delete_plan')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
              <i className="ri-delete-bin-line text-base" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title={t('plans.delete_plan')}
        message={t('plans.confirm_delete')}
        confirmLabel={t('actions.delete')}
        confirmVariant="danger"
        onConfirm={() => onDelete(plan.id)}
        onClose={() => setShowDelete(false)}
      />
    </>
  );
}
