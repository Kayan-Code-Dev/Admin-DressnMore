import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateTenant } from '../../../api/tenants.api';

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white';

interface EditTenantModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string;
  initialName: string;
  initialPlan: string;
  onSaved: () => void;
}

export default function EditTenantModal({
  open,
  onClose,
  tenantId,
  initialName,
  initialPlan,
  onSaved,
}: EditTenantModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState(initialName);
  const [plan, setPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialName);
      setPlan(initialPlan);
      setError('');
    }
  }, [open, initialName, initialPlan]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await updateTenant(tenantId, { name: name.trim(), plan });
    setLoading(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(result.message);
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
      onClick={() => !loading && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{t('ateliers.edit.title')}</h3>
          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('ateliers.edit.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('ateliers.edit.plan')}
            </label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className={inputCls}>
              <option value="basic">{t('ateliers.create.plans.basic')}</option>
              <option value="professional">{t('ateliers.create.plans.professional')}</option>
              <option value="enterprise">{t('ateliers.create.plans.enterprise')}</option>
            </select>
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
              onClick={() => !loading && onClose()}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              {t('ateliers.create.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 cursor-pointer disabled:opacity-60"
            >
              {loading ? t('ateliers.edit.submitting') : t('ateliers.edit.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
