import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type TargetType = 'all' | 'by_plan' | 'by_status';
type Channel = 'inapp' | 'email' | 'sms';

interface ComposeForm {
  title: string;
  message: string;
  target: TargetType;
  plans: string[];
  statuses: string[];
  channels: Channel[];
}

const PLAN_OPTIONS   = ['Starter', 'Pro', 'Enterprise'];
const STATUS_OPTIONS = ['Active', 'Trial', 'Suspended'];
const CHANNEL_OPTIONS: { key: Channel; icon: string; label_key: string }[] = [
  { key: 'inapp', icon: 'ri-notification-3-line',  label_key: 'notifications.channels.inapp' },
  { key: 'email', icon: 'ri-mail-line',             label_key: 'notifications.channels.email' },
  { key: 'sms',   icon: 'ri-message-2-line',        label_key: 'notifications.channels.sms'   },
];
const MSG_MAX = 500;

export default function ComposePanel({ onSent }: { onSent: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<ComposeForm>({
    title: '', message: '', target: 'all', plans: ['Pro','Enterprise'], statuses: ['Active'], channels: ['inapp', 'email'],
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = <K extends keyof ComposeForm>(key: K, val: ComposeForm[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const toggleArr = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleSend = () => {
    if (!form.title.trim() || !form.message.trim() || form.channels.length === 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false); setSent(true);
      setForm({ title: '', message: '', target: 'all', plans: [], statuses: [], channels: ['inapp', 'email'] });
      onSent();
      setTimeout(() => setSent(false), 4000);
    }, 1500);
  };

  const isValid = form.title.trim() && form.message.trim() && form.channels.length > 0;
  const charsLeft = MSG_MAX - form.message.length;

  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-teal-50">
          <i className="ri-send-plane-2-line text-teal-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{t('notifications.compose.title')}</h3>
          <p className="text-xs text-gray-400">{t('notifications.compose.subtitle')}</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{t('notifications.fields.title')}</label>
          <input type="text" value={form.title} onChange={(e) => setField('title', e.target.value)}
            placeholder={t('notifications.fields.title_placeholder')} maxLength={100}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold text-gray-700">{t('notifications.fields.message')}</label>
            <span className={`text-xs font-medium ${charsLeft < 50 ? 'text-rose-500' : 'text-gray-400'}`}>
              {charsLeft} {t('notifications.chars_remaining')}
            </span>
          </div>
          <textarea value={form.message} onChange={(e) => setField('message', e.target.value.slice(0, MSG_MAX))}
            placeholder={t('notifications.fields.message_placeholder')} rows={4}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 resize-none transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('notifications.target.label')}</label>
            <div className="space-y-2">
              {(['all', 'by_plan', 'by_status'] as TargetType[]).map((opt) => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="target" checked={form.target === opt} onChange={() => setField('target', opt)}
                    className="w-4 h-4 accent-teal-600 cursor-pointer" />
                  <span className="text-sm text-gray-700">{t(`notifications.target.${opt}`)}</span>
                </label>
              ))}
            </div>
            {form.target === 'by_plan' && (
              <div className="mt-3 ps-6 space-y-1.5">
                {PLAN_OPTIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.plans.includes(p)} onChange={() => setField('plans', toggleArr(form.plans, p))}
                      className="w-3.5 h-3.5 rounded accent-teal-600 cursor-pointer" />
                    <span className="text-sm text-gray-600">{p}</span>
                  </label>
                ))}
              </div>
            )}
            {form.target === 'by_status' && (
              <div className="mt-3 ps-6 space-y-1.5">
                {STATUS_OPTIONS.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.statuses.includes(s)} onChange={() => setField('statuses', toggleArr(form.statuses, s))}
                      className="w-3.5 h-3.5 rounded accent-teal-600 cursor-pointer" />
                    <span className="text-sm text-gray-600">{s}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Channels */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('notifications.channels.label')}</label>
            <div className="space-y-2">
              {CHANNEL_OPTIONS.map((ch) => {
                const on = form.channels.includes(ch.key);
                return (
                  <div key={ch.key} onClick={() => setField('channels', toggleArr(form.channels, ch.key))}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${on ? 'border-teal-400 bg-teal-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${on ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <i className={`${ch.icon} text-sm`} />
                    </div>
                    <span className={`text-sm font-medium ${on ? 'text-teal-700' : 'text-gray-600'}`}>{t(ch.label_key)}</span>
                    {on && <div className="ms-auto w-5 h-5 flex items-center justify-center rounded-full bg-teal-600 text-white"><i className="ri-check-line text-xs" /></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preview */}
        {form.title && (
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('notifications.preview')}</p>
            <div className="bg-white rounded-xl p-3.5 ring-1 ring-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-teal-600 text-white flex-shrink-0">
                <i className="ri-notification-3-fill text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{form.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.message || '...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {sent && (
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <i className="ri-checkbox-circle-fill" />{t('notifications.sent_success')}
            </span>
          )}
          {!sent && <div />}
          <button type="button" onClick={handleSend} disabled={!isValid || sending}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap transition-all ${isValid && !sending ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {sending ? <><i className="ri-loader-4-line animate-spin" />{t('notifications.sending')}</> : <><i className="ri-send-plane-fill" />{t('notifications.send')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
