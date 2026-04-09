import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminPlan } from '../../../types/plan.types';

interface PlanFormModalProps {
  isOpen: boolean;
  editingPlan: AdminPlan | null;
  saving: boolean;
  submitError: string;
  onClose: () => void;
  onCreate: (payload: { title: string; description: string; days: string; price: string }) => Promise<void>;
  onUpdate: (
    id: number,
    payload: { title: string; description: string; days: string; price: string; is_active: boolean },
  ) => Promise<void>;
}

const emptyForm = () => ({
  title: '',
  description: '',
  days: '',
  price: '',
  is_active: true,
});

export default function PlanFormModal({
  isOpen,
  editingPlan,
  saving,
  submitError,
  onClose,
  onCreate,
  onUpdate,
}: PlanFormModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPlan) {
      setForm({
        title: editingPlan.title,
        description: editingPlan.description,
        days: String(editingPlan.days),
        price: String(editingPlan.price),
        is_active: editingPlan.is_active,
      });
    } else {
      setForm(emptyForm());
    }
  }, [editingPlan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const title = form.title.trim();
    const description = form.description.trim();
    const days = form.days.trim();
    const price = form.price.trim();
    if (!title || !description || !days || !price) return;

    if (editingPlan) {
      await onUpdate(editingPlan.id, {
        title,
        description,
        days,
        price,
        is_active: form.is_active,
      });
    } else {
      await onCreate({ title, description, days, price });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg my-4" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            {editingPlan ? t('plans.form.title_edit') : t('plans.form.title_add')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {submitError ? (
            <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{submitError}</p>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.title_label')}</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={t('plans.form.title_placeholder')}
              disabled={saving}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={t('plans.form.description_placeholder')}
              rows={4}
              disabled={saving}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-y min-h-[96px] disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.days')}</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.days}
                onChange={(e) => setForm((p) => ({ ...p, days: e.target.value }))}
                placeholder={t('plans.form.days_placeholder')}
                disabled={saving}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.price')}</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder={t('plans.form.price_placeholder')}
                disabled={saving}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {editingPlan ? (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.is_active ? 'bg-teal-600' : 'bg-gray-200'}`}
                onClick={() => !saving && setForm((p) => ({ ...p, is_active: !p.is_active }))}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.is_active ? 'start-4' : 'start-0.5'}`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{t('plans.form.active_label')}</span>
            </label>
          ) : null}
        </div>

        <div className="px-6 pb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60"
          >
            {t('plans.form.cancel')}
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60"
          >
            {saving ? t('plans.form.saving') : t('plans.form.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
