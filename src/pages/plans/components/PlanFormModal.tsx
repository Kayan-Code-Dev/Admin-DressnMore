import { useState, useEffect, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { type Plan } from '../../../mocks/plans';

interface PlanFormModalProps {
  isOpen: boolean;
  editingPlan: Plan | null;
  onSave: (planData: Omit<Plan, 'id' | 'activeSubscribers'>) => void;
  onClose: () => void;
}

const defaultForm = {
  name: '', monthlyPrice: 0, yearlyPrice: 0,
  maxEmployees: 5, maxBranches: 1,
  features: [] as string[], isActive: true,
  isPopular: false, colorScheme: 'slate' as Plan['colorScheme'], icon: 'ri-seedling-line',
};

const colorOptions: { value: Plan['colorScheme']; label: string; cls: string }[] = [
  { value: 'slate', label: 'Slate', cls: 'bg-gray-600' },
  { value: 'teal',  label: 'Teal',  cls: 'bg-teal-600' },
  { value: 'amber', label: 'Amber', cls: 'bg-amber-600' },
];

export default function PlanFormModal({ isOpen, editingPlan, onSave, onClose }: PlanFormModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState(defaultForm);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (editingPlan) {
      setForm({
        name: editingPlan.name, monthlyPrice: editingPlan.monthlyPrice,
        yearlyPrice: editingPlan.yearlyPrice, maxEmployees: editingPlan.maxEmployees,
        maxBranches: editingPlan.maxBranches, features: [...editingPlan.features],
        isActive: editingPlan.isActive, isPopular: editingPlan.isPopular,
        colorScheme: editingPlan.colorScheme, icon: editingPlan.icon,
      });
    } else {
      setForm(defaultForm);
    }
    setFeatureInput('');
  }, [editingPlan, isOpen]);

  if (!isOpen) return null;

  const handleFeatureKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && featureInput.trim()) {
      e.preventDefault();
      setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg my-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            {editingPlan ? t('plans.form.title_edit') : t('plans.form.title_add')}
          </h3>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.name')}</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('plans.form.name_placeholder')}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.monthly_price')} ($)</label>
              <input type="number" value={form.monthlyPrice} onChange={(e) => setForm((p) => ({ ...p, monthlyPrice: +e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.yearly_price')} ($)</label>
              <input type="number" value={form.yearlyPrice} onChange={(e) => setForm((p) => ({ ...p, yearlyPrice: +e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.employees_label')}</label>
              <input type="number" value={form.maxEmployees} onChange={(e) => setForm((p) => ({ ...p, maxEmployees: +e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.branches_label')}</label>
              <input type="number" value={form.maxBranches} onChange={(e) => setForm((p) => ({ ...p, maxBranches: +e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
            <div className="flex items-center gap-3">
              {colorOptions.map((c) => (
                <button key={c.value} type="button" onClick={() => setForm((p) => ({ ...p, colorScheme: c.value }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm cursor-pointer transition-all ${form.colorScheme === c.value ? 'border-gray-400' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className={`w-3 h-3 rounded-full ${c.cls}`} />{c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('plans.form.features_label')}</label>
            <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={handleFeatureKey}
              placeholder={t('plans.form.features_placeholder')}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all mb-2" />
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.features.map((feat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                    {feat}
                    <button type="button" onClick={() => removeFeature(idx)} className="hover:text-teal-900 cursor-pointer">
                      <i className="ri-close-line text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.isActive ? 'bg-teal-600' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.isActive ? 'start-4' : 'start-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{t('plans.form.active_label')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm((p) => ({ ...p, isPopular: !p.isPopular }))}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${form.isPopular ? 'bg-amber-500' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.isPopular ? 'start-4' : 'start-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{t('plans.most_popular')}</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            {t('plans.form.cancel')}
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
            {t('plans.form.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
