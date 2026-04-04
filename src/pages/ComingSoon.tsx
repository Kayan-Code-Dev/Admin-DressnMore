import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/feature/AdminLayout';

const pageIcons: Record<string, string> = {
  '/plans':         'ri-price-tag-3-line',
  '/payments':      'ri-bank-card-line',
  '/users':         'ri-team-line',
  '/admin-roles':   'ri-shield-user-line',
  '/settings':      'ri-settings-3-line',
  '/feature-flags': 'ri-flag-line',
  '/support':       'ri-customer-service-2-line',
  '/notifications': 'ri-notification-3-line',
  '/logs':          'ri-file-list-3-line',
  '/integrations':  'ri-plug-line',
  '/marketing':     'ri-megaphone-line',
};

export default function ComingSoonPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathKey = '/' + location.pathname.split('/')[1];
  const tKey    = pathKey.slice(1).replace(/-/g, '_');
  const icon    = pageIcons[pathKey] ?? 'ri-tools-line';
  const desc    = t(`coming_soon.${tKey}`, { defaultValue: t('coming_soon.badge') });

  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-96 gap-6">
        <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-teal-50">
          <i className={`${icon} text-4xl text-teal-500`} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{t('coming_soon.title')}</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">{desc}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
          <i className="ri-hammer-line text-amber-500 text-sm" />
          <p className="text-xs font-medium text-amber-700">{t('coming_soon.badge')}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
