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

const providers = ['Unifonic', 'Taqnyat', 'Twilio', 'Msegat', 'SMS Misr'];

export default function SmsSection() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [form, setForm] = useState({
    provider: 'Unifonic', apiKey: 'unifonic_api_key_xxxxxx',
    senderId: 'Dressnmore', enableSms: true,
  });

  const set = (key: keyof typeof form, val: string | boolean) => setForm((p) => ({ ...p, [key]: val }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const handleTest = () => { setTestSent(true); setTimeout(() => setTestSent(false), 3000); };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50">
          <i className="ri-message-2-line text-rose-500 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{t('settings.sms.title')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('settings.sms.subtitle')}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label={t('settings.sms.provider')}>
            <select value={form.provider} onChange={(e) => set('provider', e.target.value)} className={inputCls}>
              {providers.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label={t('settings.sms.sender_id')} desc={t('settings.sms.sender_id_desc')}>
            <input type="text" value={form.senderId} onChange={(e) => set('senderId', e.target.value)} className={inputCls} maxLength={11} />
          </Field>
          <div className="col-span-2">
            <Field label={t('settings.sms.api_key')}>
              <div className="relative">
                <input type="password" value={form.apiKey} onChange={(e) => set('apiKey', e.target.value)}
                  className={`${inputCls} font-mono text-xs tracking-widest`} />
              </div>
            </Field>
          </div>
        </div>

        <ToggleRow
          label={t('settings.sms.enable_sms')}
          desc={t('settings.sms.enable_desc')}
          checked={form.enableSms}
          onChange={() => set('enableSms', !form.enableSms)}
        />

        {/* SMS Preview */}
        <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview</p>
          <div className="bg-teal-600 text-white text-sm rounded-2xl rounded-tl-none px-4 py-2.5 inline-block max-w-xs">
            {form.senderId || 'Sender'}: Your Dressnmore account has been renewed successfully. Thank you!
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
          {testSent && <span className="flex items-center gap-1.5 text-sm font-medium text-teal-600"><i className="ri-send-plane-fill" />Test SMS sent!</span>}
          {saved && <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><i className="ri-checkbox-circle-fill" />{t('settings.saved')}</span>}
          <button type="button" onClick={handleTest}
            className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-smartphone-line me-1.5" />{t('settings.test')}
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
