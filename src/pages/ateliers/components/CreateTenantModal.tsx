import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createTenant } from '../../../api/tenants.api';
import type { CreateTenantPayload } from '../../../types/tenant.types';

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white';

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const defaultForm: CreateTenantPayload = {
  name: '',
  email: '',
  domain: '',
  admin_name: '',
  admin_email: '',
  admin_password: '',
  plan: 'basic',
  trial_days: 14,
};

export default function CreateTenantModal({ open, onClose, onCreated }: CreateTenantModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateTenantPayload>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const set = <K extends keyof CreateTenantPayload>(key: K, val: CreateTenantPayload[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await createTenant(form);
    setLoading(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(result.message);
      return;
    }
    setForm(defaultForm);
    onCreated();
    onClose();
  };

  const handleClose = () => {
    if (!loading) {
      setForm(defaultForm);
      setError('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-base font-bold text-gray-900">{t('ateliers.create.title')}</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer disabled:opacity-50"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { key: 'name' as const, type: 'text', auto: 'organization' },
            { key: 'email' as const, type: 'email', auto: 'email' },
            { key: 'domain' as const, type: 'text', auto: 'off' },
            { key: 'admin_name' as const, type: 'text', auto: 'name' },
            { key: 'admin_email' as const, type: 'email', auto: 'email' },
            { key: 'admin_password' as const, type: 'password', auto: 'new-password' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t(`ateliers.create.fields.${field.key}`)}
              </label>
              <input
                type={field.type}
                value={String(form[field.key])}
                onChange={(e) => set(field.key, e.target.value as CreateTenantPayload[typeof field.key])}
                autoComplete={field.auto}
                required
                className={inputCls}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('ateliers.create.fields.plan')}
            </label>
            <select
              value={form.plan}
              onChange={(e) => set('plan', e.target.value)}
              className={inputCls}
            >
              <option value="basic">{t('ateliers.create.plans.basic')}</option>
              <option value="professional">{t('ateliers.create.plans.professional')}</option>
              <option value="enterprise">{t('ateliers.create.plans.enterprise')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('ateliers.create.fields.trial_days')}
            </label>
            <input
              type="number"
              min={0}
              max={365}
              value={form.trial_days}
              onChange={(e) => set('trial_days', Number(e.target.value))}
              className={inputCls}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-rose-50 rounded-lg border border-rose-100 text-sm text-rose-600">
              <i className="ri-error-warning-line flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer disabled:opacity-50"
            >
              {t('ateliers.create.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 cursor-pointer disabled:opacity-60"
            >
              {loading ? t('ateliers.create.submitting') : t('ateliers.create.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
