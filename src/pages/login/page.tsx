import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { loginAdmin } from '../../api/admin.api';
import { isAuthenticated } from '../../lib/session';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate   = useNavigate();
  const { currentLang, toggleLanguage } = useLanguage();
  const isAr = i18n.language === 'ar';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t('login.error'));
      return;
    }
    setLoading(true);
    const result = await loginAdmin(email.trim(), password);
    setLoading(false);
    if (result.ok === false) {
      setError(result.message || t('login.error'));
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  const inputCls = 'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all bg-white placeholder:text-gray-400';

  return (
    <div className="min-h-screen flex" dir={isAr ? 'rtl' : 'ltr'}>
      {/* ── Left: Brand Panel ─────────────────────────────────── */}
      <div className="hidden lg:flex w-2/5 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1a1f36 0%, #0d1117 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #10b981 0%, transparent 50%)' }} />

        {/* Top: Logo */}
        <div className="relative z-10">
          <img src="https://static.readdy.ai/image/dd76bd9e94ab1e595fa3cdea807c4d5b/3865dc1217a516805dbcd654d744a8d8.png"
            alt="Dressnmore" className="h-10 object-contain object-left mb-8" />
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">{t('login.brand_title')}</h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{t('login.brand_desc')}</p>
        </div>

        {/* Middle: Features */}
        <div className="relative z-10 space-y-5">
          {[
            { icon: 'ri-dashboard-3-line',    key: 'f1', color: 'text-teal-400'    },
            { icon: 'ri-bar-chart-line',       key: 'f2', color: 'text-emerald-400' },
            { icon: 'ri-store-2-line',         key: 'f3', color: 'text-amber-400'   },
          ].map((feat) => (
            <div key={feat.key} className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 ${feat.color}`}>
                <i className={`${feat.icon} text-lg`} />
              </div>
              <span className="text-sm font-medium text-gray-300">{t(`login.features.${feat.key}`)}</span>
            </div>
          ))}
        </div>

        {/* Bottom: Stats Row */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { value: '142+', label: 'Ateliers' },
              { value: '$48K', label: 'MRR' },
              { value: '98%',  label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600">© 2026 Dressnmore · v2.1.0</p>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="flex justify-end p-5">
          <button type="button" onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all cursor-pointer">
            <i className="ri-translate-2 text-sm" />
            {currentLang === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>

        {/* Centered Form */}
        <div className="flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <img src="https://static.readdy.ai/image/dd76bd9e94ab1e595fa3cdea807c4d5b/3865dc1217a516805dbcd654d744a8d8.png"
                alt="Dressnmore" className="h-8 object-contain mx-auto mb-3" />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t('login.title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5">{t('login.subtitle')}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('login.email')}</label>
                <div className="relative">
                  <div className="w-5 h-5 flex items-center justify-center absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="ri-mail-line" />
                  </div>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder={t('login.email_placeholder')} autoComplete="email" required
                    className={`${inputCls} ps-11`} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('login.password')}</label>
                <div className="relative">
                  <div className="w-5 h-5 flex items-center justify-center absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="ri-lock-line" />
                  </div>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder={t('login.password_placeholder')} autoComplete="current-password" required
                    className={`${inputCls} ps-11 pe-12`} />
                  <button type="button" onClick={() => setShowPass((s) => !s)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                    <i className={`${showPass ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`} />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="w-5 h-5 flex items-center justify-center text-rose-500 flex-shrink-0"><i className="ri-error-warning-line" /></div>
                  <p className="text-sm text-rose-600 font-medium">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className={`w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all cursor-pointer ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 active:scale-[.98]'}`}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin" />{t('login.submitting')}</span>
                  : <span className="flex items-center justify-center gap-2"><i className="ri-login-box-line" />{t('login.submit')}</span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
