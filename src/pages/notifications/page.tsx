import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/feature/AdminLayout';
import ComposePanel from './components/ComposePanel';
import NotificationsHistory from './components/NotificationsHistory';
import { notificationsData } from '../../mocks/notifications';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const sent  = notificationsData.filter((n) => n.status === 'sent');
  const total = notificationsData.filter((n) => n.status === 'sent').reduce((a, n) => a + n.sentTo, 0);
  const avgOpen = sent.length > 0 ? Math.round(sent.reduce((a, n) => a + n.openRate, 0) / sent.length) : 0;
  const last7   = notificationsData.filter((n) => n.status === 'sent').length;
  const today   = 1;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('notifications.summary.total_sent'), value: total.toLocaleString(), icon: 'ri-send-plane-line',       bg: 'bg-teal-50 text-teal-600'    },
            { label: t('notifications.summary.avg_open'),  value: `${avgOpen}%`,           icon: 'ri-eye-line',              bg: 'bg-emerald-50 text-emerald-600' },
            { label: t('notifications.summary.last_7'),    value: String(last7),            icon: 'ri-calendar-check-line',   bg: 'bg-amber-50 text-amber-600'  },
            { label: t('notifications.summary.today'),     value: String(today),            icon: 'ri-notification-badge-line',bg: 'bg-rose-50 text-rose-500'   },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Compose + History */}
        <ComposePanel onSent={() => setRefreshKey((k) => k + 1)} />
        <NotificationsHistory key={refreshKey} />
      </div>
    </AdminLayout>
  );
}
