import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '../../api/admin.api';

interface NavItem {
  path: string;
  labelKey: string;
  icon: string;
}

const navGroups: { groupKey: string; items: NavItem[] }[] = [
  {
    groupKey: 'overview',
    items: [{ path: '/dashboard', labelKey: 'nav.dashboard', icon: 'ri-dashboard-3-line' }],
  },
  {
    groupKey: 'business',
    items: [
      { path: '/ateliers',          labelKey: 'nav.ateliers',          icon: 'ri-store-2-line' },
      { path: '/subscriptions',     labelKey: 'nav.subscriptions',     icon: 'ri-checkbox-circle-line' },
      { path: '/plans',             labelKey: 'nav.plans',             icon: 'ri-price-tag-3-line' },
      { path: '/payments',          labelKey: 'nav.payments',          icon: 'ri-bank-card-line' },
      { path: '/payment-gateways',  labelKey: 'nav.payment_gateways',  icon: 'ri-secure-payment-line' },
    ],
  },
  {
    groupKey: 'management',
    items: [
      { path: '/users', labelKey: 'nav.users', icon: 'ri-team-line' },
      { path: '/admin-roles', labelKey: 'nav.admin_roles', icon: 'ri-shield-user-line' },
      { path: '/settings', labelKey: 'nav.settings', icon: 'ri-settings-3-line' },
    ],
  },
  {
    groupKey: 'platform',
    items: [
      { path: '/feature-flags', labelKey: 'nav.feature_flags', icon: 'ri-flag-line' },
      { path: '/support', labelKey: 'nav.support', icon: 'ri-customer-service-2-line' },
      { path: '/notifications', labelKey: 'nav.notifications', icon: 'ri-notification-3-line' },
      { path: '/logs', labelKey: 'nav.logs', icon: 'ri-file-list-3-line' },
      { path: '/integrations', labelKey: 'nav.integrations', icon: 'ri-plug-line' },
      { path: '/marketing', labelKey: 'nav.marketing', icon: 'ri-megaphone-line' },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col flex-shrink-0">
      {/* Admin Profile */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/60">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold flex-shrink-0">
            SA
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{t('admin.role')}</p>
            <p className="text-xs text-gray-400 truncate">admin@dressnmore.sa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navGroups.map((group, groupIdx) => (
          <div key={group.groupKey} className={groupIdx > 0 ? 'mt-6' : ''}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              {t(`nav.groups.${group.groupKey}`)}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className={`${item.icon} text-base`} />
                      </div>
                      {t(item.labelKey)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate('/admin/login', { replace: true });
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-logout-box-line text-base" />
          </div>
          {t('nav.sign_out')}
        </button>
      </div>
    </aside>
  );
}
