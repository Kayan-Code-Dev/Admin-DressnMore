import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all bg-white';

interface FieldProps { label: string; desc?: string; children: React.ReactNode; }
function Field({ label, desc, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {desc && <p className="text-xs text-gray-400 mb-1.5">{desc}</p>}
      {children}
    </div>
  );
}

interface ToggleRowProps { label: string; desc?: string; checked: boolean; onChange: () => void; }
function ToggleRow({ label, desc, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <div onClick={onChange} className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${checked ? 'bg-teal-600' : 'bg-gray-200'}`}>
        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${checked ? 'start-5' : 'start-0.5'}`} />
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} pe-10`} />
      <button type="button" onClick={() => setShow((s) => !s)}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
        <i className={`${show ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
      </button>
    </div>
  );
}

export default function EmailSection() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [form, setForm] = useState({
    smtpHost: 'smtp.mailgun.org', smtpPort: '587',
    smtpUser: 'postmaster@dressnmore.sa', smtpPass: 'smtp_secret_key_here',
    fromName: 'Dressnmore Platform', fromEmail: 'noreply@dressnmore.sa',
    enableNotifications: true,
  });

  const set = (key: keyof typeof form, val: string | boolean) => setForm((p) => ({ ...p, [key]: val }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const handleTest = () => { setTestSent(true); setTimeout(() => setTestSent(false), 3000); };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50">
          <i className="ri-mail-settings-line text-amber-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{t('settings.email.title')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('settings.email.subtitle')}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label={t('settings.email.smtp_host')}>
            <input type="text" value={form.smtpHost} onChange={(e) => set('smtpHost', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('settings.email.smtp_port')}>
            <input type="text" value={form.smtpPort} onChange={(e) => set('smtpPort', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('settings.email.smtp_user')}>
            <input type="text" value={form.smtpUser} onChange={(e) => set('smtpUser', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('settings.email.smtp_pass')}>
            <PasswordInput value={form.smtpPass} onChange={(v) => set('smtpPass', v)} />
          </Field>
          <Field label={t('settings.email.from_name')}>
            <input type="text" value={form.fromName} onChange={(e) => set('fromName', e.target.value)} className={inputCls} />
          </Field>
          <Field label={t('settings.email.from_email')}>
            <input type="email" value={form.fromEmail} onChange={(e) => set('fromEmail', e.target.value)} className={inputCls} />
          </Field>
        </div>

        <ToggleRow
          label={t('settings.email.enable_notifications')}
          desc={t('settings.email.enable_desc')}
          checked={form.enableNotifications}
          onChange={() => set('enableNotifications', !form.enableNotifications)}
        />

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
          {testSent && <span className="flex items-center gap-1.5 text-sm font-medium text-teal-600"><i className="ri-send-plane-fill" />Test email sent!</span>}
          {saved && <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><i className="ri-checkbox-circle-fill" />{t('settings.saved')}</span>}
          <button type="button" onClick={handleTest}
            className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-send-plane-line me-1.5" />{t('settings.test')}
          </button>
          <button type="button" onClick={handleSave}
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
            {t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
