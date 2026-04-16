import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../../components/base/StatusBadge';
import { fetchSubscription, patchSubscriptionStatus } from '../../../api/subscriptions.api';
import type {
  AdminSubscriptionDetail,
  SubscriptionPayment,
  SubscriptionStatusValue,
} from '../../../types/subscription.types';

const STATUS_OPTIONS: SubscriptionStatusValue[] = ['pending', 'active', 'rejected', 'cancelled'];

interface SubscriptionDetailModalProps {
  subscriptionId: number | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function SubscriptionDetailModal({
  subscriptionId,
  onClose,
  onUpdated,
}: SubscriptionDetailModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<AdminSubscriptionDetail | null>(null);
  const [statusDraft, setStatusDraft] = useState<SubscriptionStatusValue>('pending');

  useEffect(() => {
    if (subscriptionId == null) {
      setDetail(null);
      setError('');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    void fetchSubscription(subscriptionId).then((r) => {
      if (cancelled) return;
      setLoading(false);
      if (r.ok === false) {
        if (r.unauthorized) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setError(r.message);
        setDetail(null);
        return;
      }
      const sub = r.subscription;
      const payments: SubscriptionPayment[] = Array.isArray(sub.payments)
        ? (sub.payments as SubscriptionPayment[])
        : [];
      setDetail({ ...sub, payments });
      const st = r.subscription.status as SubscriptionStatusValue;
      setStatusDraft(STATUS_OPTIONS.includes(st) ? st : 'pending');
    });
    return () => {
      cancelled = true;
    };
  }, [subscriptionId, navigate]);

  if (subscriptionId == null) return null;

  const handleSaveStatus = async () => {
    if (!detail || statusDraft === detail.status) return;
    setSaving(true);
    setError('');
    const r = await patchSubscriptionStatus(detail.id, { status: statusDraft });
    setSaving(false);
    if (r.ok === false) {
      if (r.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(r.message);
      return;
    }
    onUpdated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl my-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{t('subscriptions.detail.title')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
              <i className="ri-loader-4-line text-3xl text-teal-600 animate-spin" />
              <p className="text-sm">{t('subscriptions.loading')}</p>
            </div>
          ) : error ? (
            <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
          ) : detail ? (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{t('subscriptions.col.id')}</p>
                  <p className="font-mono text-gray-900">{detail.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{t('subscriptions.col.tenant')}</p>
                  <p className="text-gray-900 break-all">{detail.tenant_id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-medium">{t('subscriptions.col.plan')}</p>
                  <p className="text-gray-900 font-semibold">{detail.plan.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ${detail.plan.price} · {detail.plan.days} {t('plans.duration_days')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{t('subscriptions.col.starts_at')}</p>
                  <p className="text-gray-800">{detail.starts_at}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{t('subscriptions.col.ends_at')}</p>
                  <p className="text-gray-800">{detail.ends_at}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 font-medium mb-2">{t('subscriptions.detail.status')}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={detail.status} />
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value as SubscriptionStatusValue)}
                    disabled={saving}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {t(`status.${s}`)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={saving || statusDraft === detail.status}
                    onClick={() => void handleSaveStatus()}
                    className="text-sm px-3 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-40 cursor-pointer"
                  >
                    {saving ? t('subscriptions.detail.saving') : t('subscriptions.detail.save_status')}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 font-medium mb-2">{t('subscriptions.detail.payments')}</p>
                {detail.payments.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('subscriptions.detail.no_payments')}</p>
                ) : (
                  <div className="rounded-xl border border-gray-100 overflow-hidden ring-1 ring-gray-100/80">
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead className="bg-gray-50 sticky top-0 z-[1]">
                          <tr>
                            <th className="px-3 py-2.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {t('subscriptions.detail.payments_table.id')}
                            </th>
                            <th className="px-3 py-2.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {t('subscriptions.detail.payments_table.plan')}
                            </th>
                            <th className="px-3 py-2.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {t('subscriptions.detail.payments_table.price')}
                            </th>
                            <th className="px-3 py-2.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {t('subscriptions.detail.payments_table.paid_at')}
                            </th>
                            <th className="px-3 py-2.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {t('subscriptions.detail.payments_table.period')}
                            </th>
                            <th className="px-3 py-2.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {t('subscriptions.detail.payments_table.status')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {detail.payments.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-3 py-2.5 font-mono text-xs text-gray-600 tabular-nums">{p.id}</td>
                              <td className="px-3 py-2.5 font-medium text-gray-900">{p.plan_title}</td>
                              <td className="px-3 py-2.5 font-semibold text-gray-900 tabular-nums">${p.price}</td>
                              <td className="px-3 py-2.5 text-gray-600 text-xs whitespace-nowrap">{p.paid_at}</td>
                              <td className="px-3 py-2.5 text-gray-600 text-xs">
                                <div className="whitespace-nowrap">{p.starts_at}</div>
                                <div className="text-gray-400 whitespace-nowrap">
                                  <span className="font-mono text-[10px] me-1">→</span>
                                  {p.ends_at}
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <StatusBadge status={p.status} size="sm" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            {t('actions.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
