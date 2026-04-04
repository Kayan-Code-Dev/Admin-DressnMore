import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/feature/AdminLayout';
import AteliersTable from './components/AteliersTable';
import { type Atelier } from '../../mocks/ateliers';
import StatusBadge, { PlanBadge } from '../../components/base/StatusBadge';

export default function AteliersPage() {
  const { t } = useTranslation();
  const [selectedAtelier, setSelectedAtelier] = useState<Atelier | null>(null);

  return (
    <AdminLayout>
      <AteliersTable onViewDetails={setSelectedAtelier} />

      {selectedAtelier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAtelier(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">{t('ateliers.modal.title')}</h3>
              <button type="button" onClick={() => setSelectedAtelier(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <img src={selectedAtelier.avatar} alt={selectedAtelier.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedAtelier.name}</h4>
                  <p className="text-sm text-gray-500">{selectedAtelier.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={selectedAtelier.status} size="sm" />
                    <PlanBadge plan={selectedAtelier.plan} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('ateliers.modal.owner'),     value: selectedAtelier.owner,                icon: 'ri-user-line'       },
                  { label: t('ateliers.modal.employees'), value: String(selectedAtelier.employees),    icon: 'ri-team-line'       },
                  { label: t('ateliers.modal.branches'),  value: String(selectedAtelier.branches),     icon: 'ri-building-2-line' },
                  { label: t('ateliers.modal.phone'),     value: selectedAtelier.phone,                icon: 'ri-phone-line'      },
                  { label: t('ateliers.modal.created'),   value: selectedAtelier.createdAt,            icon: 'ri-calendar-line'   },
                  { label: t('ateliers.modal.renewal'),   value: selectedAtelier.renewalDate,          icon: 'ri-refresh-line'    },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <i className={`${item.icon} text-xs text-gray-400`} />
                      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-teal-700 font-medium">{t('ateliers.modal.monthly_revenue')}</p>
                  <p className="text-2xl font-bold text-teal-600 mt-0.5">
                    {selectedAtelier.monthlyRevenue === 0 ? t('ateliers.modal.free_trial') : `$${selectedAtelier.monthlyRevenue}`}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-600">
                  <i className="ri-money-dollar-circle-line text-xl text-white" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex items-center gap-2">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-edit-line" /> {t('ateliers.modal.edit')}
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-login-box-line" /> {t('ateliers.modal.login_as')}
              </button>
              <button type="button" onClick={() => setSelectedAtelier(null)} className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-close-line" />
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
