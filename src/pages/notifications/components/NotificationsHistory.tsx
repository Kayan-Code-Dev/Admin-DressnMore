import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type NotificationRecord, type NotifStatus, notificationsData } from '../../../mocks/notifications';

type FilterKey = 'all' | NotifStatus;

const statusCfg: Record<NotifStatus, string> = {
  sent:      'bg-emerald-50 text-emerald-700',
  scheduled: 'bg-amber-50 text-amber-700',
  draft:     'bg-gray-100 text-gray-500',
  failed:    'bg-rose-50 text-rose-600',
};

const channelIcons: Record<string, string> = {
  inapp: 'ri-notification-3-line',
  email: 'ri-mail-line',
  sms:   'ri-message-2-line',
};

export default function NotificationsHistory() {
  const { t } = useTranslation();
  const [records] = useState<NotificationRecord[]>(notificationsData);
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() =>
    filter === 'all' ? records : records.filter((r) => r.status === filter)
  , [records, filter]);

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: 'all',       labelKey: 'notifications.filter.all'       },
    { key: 'sent',      labelKey: 'notifications.filter.sent'      },
    { key: 'scheduled', labelKey: 'notifications.filter.scheduled' },
    { key: 'draft',     labelKey: 'notifications.filter.draft'     },
  ];

  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-gray-900">{t('notifications.history_title')}</h3>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button key={f.key} type="button" onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${filter === f.key ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t(f.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80">
            <tr>
              {['col.title','col.target','col.channels','col.sent','col.opened','col.date','col.status'].map((k) => (
                <th key={k} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {t(`notifications.${k}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-14 text-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <i className="ri-notification-3-line text-4xl" />
                  <p className="text-sm font-medium">{t('notifications.no_notifications')}</p>
                </div>
              </td></tr>
            ) : filtered.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 max-w-56">
                  <p className="text-sm font-semibold text-gray-900 truncate">{rec.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{rec.message.slice(0, 50)}…</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                    {rec.targetDetail}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {rec.channels.map((ch) => (
                      <div key={ch} className="w-6 h-6 flex items-center justify-center rounded-md bg-teal-50 text-teal-600" title={ch}>
                        <i className={`${channelIcons[ch]} text-xs`} />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">{rec.sentTo > 0 ? rec.sentTo.toLocaleString() : '—'}</span>
                </td>
                <td className="px-4 py-3">
                  {rec.sentTo > 0 ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{rec.opened}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${rec.openRate}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{rec.openRate}%</span>
                      </div>
                    </div>
                  ) : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3"><span className="text-sm text-gray-500">{rec.sentAt}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg[rec.status]}`}>
                    {t(`notifications.status.${rec.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
