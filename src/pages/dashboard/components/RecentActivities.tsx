import { useTranslation } from 'react-i18next';
import { latestActivities } from '../../../mocks/dashboard';

const activityConfig: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  upgrade:  { icon: 'ri-arrow-up-circle-line',      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  register: { icon: 'ri-store-add-line',             iconBg: 'bg-teal-50',    iconColor: 'text-teal-600'    },
  suspend:  { icon: 'ri-pause-circle-line',          iconBg: 'bg-rose-50',    iconColor: 'text-rose-600'    },
  payment:  { icon: 'ri-money-dollar-circle-line',   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600'   },
  cancel:   { icon: 'ri-close-circle-line',          iconBg: 'bg-gray-100',   iconColor: 'text-gray-500'    },
  security: { icon: 'ri-shield-check-line',          iconBg: 'bg-teal-50',    iconColor: 'text-teal-600'    },
  support:  { icon: 'ri-customer-service-2-line',    iconBg: 'bg-amber-50',   iconColor: 'text-amber-600'   },
};

export default function RecentActivities() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">{t('recent.activities.title')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('recent.activities.subtitle')}</p>
        </div>
        <button type="button" className="text-xs font-medium text-teal-600 hover:text-teal-700 cursor-pointer whitespace-nowrap">
          {t('recent.activities.view_logs')} →
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {latestActivities.map((activity) => {
          const cfg = activityConfig[activity.type] ?? activityConfig.support;
          return (
            <div key={activity.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 ${cfg.iconBg}`}>
                <i className={`${cfg.icon} text-sm ${cfg.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.user}</p>
              </div>
              <p className="text-xs text-gray-400 flex-shrink-0">{activity.date.split(' ')[1]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
