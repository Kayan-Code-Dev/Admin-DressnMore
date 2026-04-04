import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FieldProps {
  label: string;
  desc?: string;
  children: React.ReactNode;
}
function Field({ label, desc, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {desc && <p className="text-xs text-gray-400 mb-1.5">{desc}</p>}
      {children}
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: () => void;
}
function ToggleRow({ label, desc, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <div onClick={onChange}
        className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${checked ? 'bg-teal-600' : 'bg-gray-200'}`}>
        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${checked ? 'start-5' : 'start-0.5'}`} />
      </div>
    </div>
  );
}

interface SaveBarProps { onSave: () => void; saved: boolean; }
function SaveBar({ onSave, saved }: SaveBarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
      {saved && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
          <i className="ri-checkbox-circle-fill" />{t('settings.saved')}
        </span>
      )}
      <button type="button" onClick={onSave}
        className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
        {t('settings.save')}
      </button>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all bg-white';

export default function GeneralSection() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    platformName: 'Dressnmore', supportEmail: 'support@dressnmore.sa',
    currency: 'SAR', timezone: 'Asia/Riyadh', trialDays: 14,
    logoUrl: 'https://static.readdy.ai/image/dd76bd9e94ab1e595fa3cdea807c4d5b/3865dc1217a516805dbcd654d744a8d8.png',
    maintenanceMode: false,
  });

  const set = (key: keyof typeof form, val: string | number | boolean) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const currencies = ['SAR', 'USD', 'AED', 'KWD', 'BHD', 'OMR', 'QAR', 'EGP'];
  const timezones  = ['Asia/Riyadh', 'Asia/Dubai', 'Asia/Kuwait', 'Africa/Cairo', 'UTC'];

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-50">
          <i className="ri-settings-3-line text-teal-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{t('settings.general.title')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('settings.general.subtitle')}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label={t('settings.general.platform_name')} desc={t('settings.general.platform_name_desc')}>
            <input type="text" value={form.platformName} onChange={(e) => set('platformName', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('settings.general.support_email')} desc={t('settings.general.support_email_desc')}>
            <input type="email" value={form.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('settings.general.currency')}>
            <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls}>
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={t('settings.general.timezone')}>
            <select value={form.timezone} onChange={(e) => set('timezone', e.target.value)} className={inputCls}>
              {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </Field>
          <Field label={t('settings.general.trial_days')} desc={t('settings.general.trial_days_desc')}>
            <input type="number" value={form.trialDays} onChange={(e) => set('trialDays', +e.target.value)} className={inputCls} min={0} max={90} />
          </Field>
          <Field label={t('settings.general.logo_url')} desc={t('settings.general.logo_url_desc')}>
            <input type="url" value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} className={inputCls} />
          </Field>
        </div>

        <ToggleRow
          label={t('settings.general.maintenance_mode')}
          desc={t('settings.general.maintenance_desc')}
          checked={form.maintenanceMode}
          onChange={() => set('maintenanceMode', !form.maintenanceMode)}
        />

        <SaveBar onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}
