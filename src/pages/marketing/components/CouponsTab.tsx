import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { couponsData, type Coupon, type CouponStatus } from '../../../mocks/marketing';
import CouponFormModal from './CouponFormModal';
import ConfirmModal from '../../../components/base/ConfirmModal';

type FilterKey = 'all' | CouponStatus;

const statusCfg: Record<CouponStatus, string> = {
  active:   'bg-emerald-50 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-500',
  expired:  'bg-rose-50 text-rose-600',
};

const planCfg: Record<string, string> = {
  all:        'bg-teal-50 text-teal-700',
  starter:    'bg-gray-100 text-gray-600',
  pro:        'bg-amber-50 text-amber-700',
  enterprise: 'bg-emerald-50 text-emerald-700',
};

export default function CouponsTab() {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<Coupon[]>(couponsData);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formModal, setFormModal] = useState<{ open: boolean; coupon: Coupon | null }>({ open: false, coupon: null });
  const [confirmData, setConfirmData] = useState<{ type: 'delete' | 'toggle'; couponId: string } | null>(null);

  const filtered = useMemo(() => {
    let res = filter === 'all' ? coupons : coupons.filter((c) => c.status === filter);
    if (search) { const q = search.toLowerCase(); res = res.filter((c) => c.code.toLowerCase().includes(q)); }
    return res;
  }, [coupons, filter, search]);

  const summary = useMemo(() => ({
    total:   coupons.length,
    active:  coupons.filter((c) => c.status === 'active').length,
    uses:    coupons.reduce((a, c) => a + c.usedCount, 0),
    savings: coupons.reduce((a, c) => a + (c.type === 'fixed' ? c.value * c.usedCount : 0), 0),
  }), [coupons]);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (data: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => {
    if (formModal.coupon) {
      setCoupons((p) => p.map((c) => c.id === formModal.coupon!.id ? { ...c, ...data } : c));
    } else {
      setCoupons((p) => [{ id: `c${Date.now()}`, ...data, usedCount: 0, createdAt: new Date().toISOString().slice(0, 10) }, ...p]);
    }
  };

  const handleConfirm = () => {
    if (!confirmData) return;
    if (confirmData.type === 'delete') {
      setCoupons((p) => p.filter((c) => c.id !== confirmData.couponId));
    } else {
      setCoupons((p) => p.map((c) => c.id === confirmData.couponId
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' as CouponStatus }
        : c));
    }
  };

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: 'all',      labelKey: 'marketing.coupons.filter.all'      },
    { key: 'active',   labelKey: 'marketing.coupons.filter.active'   },
    { key: 'inactive', labelKey: 'marketing.coupons.filter.inactive' },
    { key: 'expired',  labelKey: 'marketing.coupons.filter.expired'  },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('marketing.coupons.summary.total'),   value: summary.total,              icon: 'ri-coupon-line',              bg: 'bg-teal-50 text-teal-600'       },
            { label: t('marketing.coupons.summary.active'),  value: summary.active,             icon: 'ri-checkbox-circle-line',     bg: 'bg-emerald-50 text-emerald-600' },
            { label: t('marketing.coupons.summary.uses'),    value: summary.uses.toLocaleString(),icon: 'ri-user-received-line',      bg: 'bg-amber-50 text-amber-600'     },
            { label: t('marketing.coupons.summary.savings'), value: `$${summary.savings.toLocaleString()}`, icon: 'ri-money-dollar-circle-line', bg: 'bg-rose-50 text-rose-500' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <div><p className="text-xs text-gray-400 font-medium">{card.label}</p><p className="text-xl font-bold text-gray-900">{card.value}</p></div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${filter === f.key ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><i className="ri-search-line text-xs" /></div>
                <input type="text" placeholder={t('marketing.coupons.search_placeholder')} value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
              </div>
              <button type="button" onClick={() => setFormModal({ open: true, coupon: null })}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-add-line" />{t('marketing.coupons.add_coupon')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>{['col.code','col.type','col.value','col.usage','col.plan','col.status','col.expires','col.actions'].map((k) => (
                  <th key={k} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{t(`marketing.coupons.${k}`)}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400"><i className="ri-coupon-line text-4xl" /><p className="text-sm font-medium">{t('marketing.coupons.no_coupons')}</p></div>
                  </td></tr>
                ) : filtered.map((coupon) => {
                  const usagePct = coupon.maxUses > 0 ? Math.min(100, (coupon.usedCount / coupon.maxUses) * 100) : 0;
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">{coupon.code}</span>
                          <button type="button" onClick={() => copyCode(coupon.id, coupon.code)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-teal-500 cursor-pointer transition-colors">
                            <i className={`${copiedId === coupon.id ? 'ri-check-line text-teal-500' : 'ri-file-copy-line'} text-xs`} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${coupon.type === 'percentage' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                          {coupon.type === 'percentage' ? '%' : '$'} {t(`marketing.coupons.types.${coupon.type}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-gray-900">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-32">
                        <p className="text-xs text-gray-500 mb-1">{coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}</p>
                        {coupon.maxUses > 0 && (
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${usagePct >= 90 ? 'bg-rose-400' : usagePct >= 60 ? 'bg-amber-400' : 'bg-teal-500'}`} style={{ width: `${usagePct}%` }} />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${planCfg[coupon.targetPlan] ?? planCfg.all}`}>
                          {t(`marketing.coupons.plan.${coupon.targetPlan}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg[coupon.status]}`}>
                          {t(`marketing.coupons.filter.${coupon.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3"><span className="text-sm text-gray-500">{coupon.expiresAt}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setFormModal({ open: true, coupon })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors">
                            <i className="ri-pencil-line text-sm" />
                          </button>
                          {coupon.status !== 'expired' && (
                            <button type="button" onClick={() => setConfirmData({ type: 'toggle', couponId: coupon.id })}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${coupon.status === 'active' ? 'text-gray-400 hover:bg-amber-50 hover:text-amber-600' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                              <i className={`${coupon.status === 'active' ? 'ri-pause-circle-line' : 'ri-play-circle-line'} text-sm`} />
                            </button>
                          )}
                          <button type="button" onClick={() => setConfirmData({ type: 'delete', couponId: coupon.id })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 cursor-pointer transition-colors">
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CouponFormModal isOpen={formModal.open} coupon={formModal.coupon}
        onClose={() => setFormModal({ open: false, coupon: null })} onSave={handleSave} />
      <ConfirmModal isOpen={!!confirmData}
        title={confirmData?.type === 'delete' ? t('actions.delete') : t('marketing.coupons.confirm_toggle')}
        message={confirmData?.type === 'delete' ? t('marketing.coupons.confirm_delete') : t('marketing.coupons.confirm_toggle')}
        confirmLabel={confirmData?.type === 'delete' ? t('actions.delete') : t('actions.confirm')}
        confirmVariant={confirmData?.type === 'delete' ? 'danger' : 'warning'}
        onConfirm={handleConfirm} onClose={() => setConfirmData(null)} />
    </>
  );
}
