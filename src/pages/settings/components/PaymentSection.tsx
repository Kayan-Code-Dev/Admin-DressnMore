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

function MaskedInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} pe-10 font-mono text-xs tracking-widest`} />
      <button type="button" onClick={() => setShow((s) => !s)}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
        <i className={`${show ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
      </button>
    </div>
  );
}

const gateways = ['Stripe', 'Tap Payments', 'HyperPay', 'PayTabs', 'Moyasar'];

export default function PaymentSection() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    gateway: 'Tap Payments', apiKey: 'sk_test_xxxxxxxxxxxxxxxxxxxxx',
    webhookSecret: 'whsec_xxxxxxxxxxxxxxxxxxxxx', vatRate: 15, sandboxMode: true,
  });

  const set = (key: keyof typeof form, val: string | number | boolean) => setForm((p) => ({ ...p, [key]: val }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50">
          <i className="ri-bank-card-line text-emerald-600 text-lg" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{t('settings.payment.title')}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('settings.payment.subtitle')}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label={t('settings.payment.gateway')}>
            <select value={form.gateway} onChange={(e) => set('gateway', e.target.value)} className={inputCls}>
              {gateways.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label={t('settings.payment.vat_rate')} desc={t('settings.payment.vat_desc')}>
            <input type="number" value={form.vatRate} onChange={(e) => set('vatRate', +e.target.value)} className={inputCls} min={0} max={100} />
          </Field>
          <div className="col-span-2">
            <Field label={t('settings.payment.api_key')} desc={t('settings.payment.api_key_desc')}>
              <MaskedInput value={form.apiKey} onChange={(v) => set('apiKey', v)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label={t('settings.payment.webhook_secret')} desc={t('settings.payment.webhook_desc')}>
              <MaskedInput value={form.webhookSecret} onChange={(v) => set('webhookSecret', v)} />
            </Field>
          </div>
        </div>

        <ToggleRow
          label={t('settings.payment.sandbox_mode')}
          desc={t('settings.payment.sandbox_desc')}
          checked={form.sandboxMode}
          onChange={() => set('sandboxMode', !form.sandboxMode)}
        />

        {form.sandboxMode && (
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-xl">
            <i className="ri-alert-line text-amber-500" />
            <p className="text-sm text-amber-700 font-medium">Sandbox mode is ON — real payments will NOT be processed</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
          {saved && <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"><i className="ri-checkbox-circle-fill" />{t('settings.saved')}</span>}
          <button type="button" onClick={handleSave}
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
            {t('settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
