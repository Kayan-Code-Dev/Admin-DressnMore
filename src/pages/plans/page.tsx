import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/feature/AdminLayout';
import PlanCard from './components/PlanCard';
import PlanFormModal from './components/PlanFormModal';
import { plansData, type Plan } from '../../mocks/plans';

export default function PlansPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>(plansData);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const activePlans = plans.filter((p) => p.isActive).length;
  const totalSubs = plans.reduce((acc, p) => acc + p.activeSubscribers, 0);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingPlan(null);
    setFormOpen(true);
  };

  const handleDelete = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const handleToggleActive = (planId: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p)));
  };

  const handleSave = (data: Omit<Plan, 'id' | 'activeSubscribers'>) => {
    if (editingPlan) {
      setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? { ...p, ...data } : p)));
    } else {
      const newPlan: Plan = {
        ...data, id: `plan-${Date.now()}`, activeSubscribers: 0,
      };
      setPlans((prev) => [...prev, newPlan]);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Summary + Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-5 py-3 ring-1 ring-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100">
                <i className="ri-price-tag-3-line text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('plans.summary.total')}</p>
                <p className="text-xl font-bold text-gray-900">{plans.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 ring-1 ring-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-50">
                <i className="ri-checkbox-circle-line text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('plans.summary.active')}</p>
                <p className="text-xl font-bold text-emerald-600">{activePlans}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 ring-1 ring-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-50">
                <i className="ri-team-line text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('plans.summary.subscribers')}</p>
                <p className="text-xl font-bold text-teal-600">{totalSubs.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" />{t('plans.add_plan')}
          </button>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl ring-1 ring-gray-100 py-24 gap-4">
            <i className="ri-price-tag-3-line text-5xl text-gray-300" />
            <p className="text-gray-500 font-medium">{t('plans.no_plans')}</p>
            <button type="button" onClick={handleAddNew}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
              {t('plans.add_plan')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} />
            ))}
          </div>
        )}
      </div>

      <PlanFormModal isOpen={formOpen} editingPlan={editingPlan} onSave={handleSave} onClose={() => setFormOpen(false)} />
    </AdminLayout>
  );
}
