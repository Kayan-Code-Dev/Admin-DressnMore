import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminPlan } from '../../../types/plan.types';
import ConfirmModal from '../../../components/base/ConfirmModal';

const colorConfig = {
  slate: {
    headerBg: 'bg-gradient-to-br from-gray-700 to-gray-900',
    iconBg: 'bg-gray-600',
    accent: 'text-gray-300',
    badge: 'bg-gray-500/30 text-gray-200',
  },
  teal: {
    headerBg: 'bg-gradient-to-br from-teal-600 to-teal-900',
    iconBg: 'bg-teal-500',
    accent: 'text-teal-200',
    badge: 'bg-teal-500/30 text-teal-100',
  },
  amber: {
    headerBg: 'bg-gradient-to-br from-amber-600 to-amber-900',
    iconBg: 'bg-amber-500',
    accent: 'text-amber-200',
    badge: 'bg-amber-500/30 text-amber-100',
  },
};

export type PlanCardColorScheme = keyof typeof colorConfig;

interface PlanCardProps {
  plan: AdminPlan;
  colorScheme: PlanCardColorScheme;
  onEdit: (plan: AdminPlan) => void;
  onDelete: (planId: number) => void;
  onToggleActive: (plan: AdminPlan) => void;
  toggleBusy?: boolean;
}

export default function PlanCard({
  plan,
  colorScheme,
  onEdit,
  onDelete,
  onToggleActive,
  toggleBusy,
}: PlanCardProps) {
  const { t } = useTranslation();
  const [showDelete, setShowDelete] = useState(false);
  const cfg = colorConfig[colorScheme];

  return (
    <>
      <div
        className={`bg-white rounded-2xl ring-1 overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 ${plan.is_active ? 'ring-gray-200' : 'ring-gray-100 opacity-70'}`}
      >
        <div className={`${cfg.headerBg} px-5 py-5 relative`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${cfg.iconBg}`}>
                <i className="ri-price-tag-3-line text-xl text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{plan.title}</h3>
                <p className={`text-xs ${cfg.accent}`}>
                  {plan.days} {t('plans.duration_days')}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={toggleBusy}
              onClick={() => onToggleActive(plan)}
              className="cursor-pointer disabled:opacity-50 shrink-0"
              title={plan.is_active ? t('plans.plan_active') : t('plans.plan_inactive')}
            >
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${plan.is_active ? 'bg-white/30' : 'bg-white/10'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${plan.is_active ? 'start-4' : 'start-0.5'}`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
            <span className="text-sm text-gray-400">{t('plans.price_once')}</span>
          </div>
        </div>

        <div className="px-5 py-4 flex-1 min-h-[120px]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {t('plans.description_heading')}
          </p>
          <p className="text-sm text-gray-600 line-clamp-5 leading-relaxed whitespace-pre-wrap">
            {plan.description || '—'}
          </p>
        </div>

        <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(plan)}
            title={t('plans.edit_plan')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <i className="ri-edit-line text-base" />
          </button>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            title={t('plans.delete_plan')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <i className="ri-delete-bin-line text-base" />
          </button>
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
