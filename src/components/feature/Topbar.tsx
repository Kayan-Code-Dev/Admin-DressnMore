import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';

export default function Topbar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { t }      = useTranslation();
  const { currentLang, toggleLanguage } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifCount] = useState(5);

  const rawKey  = location.pathname.split('/')[1] || 'dashboard';
  const pageKey = rawKey.replace(/-/g, '_');
  const title    = t(`page.${pageKey}.title`,    { defaultValue: rawKey });
  const subtitle = t(`page.${pageKey}.subtitle`, { defaultValue: '' });

  const handleSignOut = () => {
    localStorage.removeItem('dressnmore_admin_auth');
    setProfileOpen(false);
    navigate('/login', { replace: true });
  };

  // ... existing code ...
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-5 h-5 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <i className="ri-search-line text-sm" />
          </div>
          <input type="text" placeholder={t('topbar.search_placeholder')} value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-52 ps-9 pe-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
        </div>

        <button type="button" onClick={toggleLanguage}
          title={currentLang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all cursor-pointer whitespace-nowrap">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-translate-2 text-sm" /></div>
          {currentLang === 'ar' ? 'EN' : 'عربي'}
        </button>

        <div className="relative">
          <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <i className="ri-notification-3-line text-base" />
          </button>
          {notifCount > 0 && (
            <span className="absolute -top-1 -end-1 w-4 h-4 flex items-center justify-center bg-rose-500 text-white text-xs rounded-full font-bold">
              {notifCount}
            </span>
          )}
        </div>

        <div className="relative">
          <button type="button" onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold flex-shrink-0">SA</div>
            <span className="text-sm font-semibold text-gray-800 hidden sm:block">{t('admin.role')}</span>
            <div className="w-4 h-4 flex items-center justify-center text-gray-400">
              <i className={`ri-arrow-${profileOpen ? 'up' : 'down'}-s-line text-base`} />
            </div>
          </button>

          {profileOpen && (
            <div className="absolute end-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 py-1.5 z-50">
              <button type="button" onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <i className="ri-user-line text-gray-400" /> {t('topbar.my_profile')}
              </button>
              <button type="button" onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <i className="ri-settings-3-line text-gray-400" /> {t('page.settings.title')}
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button type="button" onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer">
                <i className="ri-logout-box-line text-rose-400" /> {t('topbar.sign_out')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
