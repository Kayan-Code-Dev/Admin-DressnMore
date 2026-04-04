import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { referralsData, type ReferralRecord, type ReferralStatus } from '../../../mocks/marketing';
import ConfirmModal from '../../../components/base/ConfirmModal';

type FilterKey = 'all' | ReferralStatus;

const statusCfg: Record<ReferralStatus, string> = {
  active:   'bg-emerald-50 text-emerald-700',
  paused:   'bg-amber-50 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
};

export default function ReferralsTab() {
  const { t } = useTranslation();
  const [referrals, setReferrals] = useState<ReferralRecord[]>(referralsData);
  const [filter, setFilter]   = useState<FilterKey>('all');
  const [search, setSearch]   = useState('');
  const [commissionRate, setCommissionRate] = useState(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirm, setConfirm]  = useState<{ type: 'pause' | 'activate'; id: string } | null>(null);

  const filtered = useMemo(() => {
    let res = filter === 'all' ? referrals : referrals.filter((r) => r.status === filter);
    if (search) { const q = search.toLowerCase(); res = res.filter((r) => r.referrer.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)); }
    return res;
  }, [referrals, filter, search]);

  const summary = useMemo(() => ({
    total:      referrals.reduce((a, r) => a + r.totalReferred, 0),
    active:     referrals.filter((r) => r.status === 'active').length,
    converted:  referrals.reduce((a, r) => a + r.converted, 0),
    commission: referrals.reduce((a, r) => a + r.totalEarned + r.pendingCommission, 0),
  }), [referrals]);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirm = () => {
    if (!confirm) return;
    const newStatus: ReferralStatus = confirm.type === 'activate' ? 'active' : 'paused';
    setReferrals((p) => p.map((r) => r.id === confirm.id ? { ...r, status: newStatus } : r));
  };

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: 'all',    labelKey: 'marketing.referrals.filter.all'    },
    { key: 'active', labelKey: 'marketing.referrals.filter.active' },
    { key: 'paused', labelKey: 'marketing.referrals.filter.paused' },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('marketing.referrals.summary.total'),      value: summary.total,                    icon: 'ri-user-add-line',         bg: 'bg-teal-50 text-teal-600'       },
            { label: t('marketing.referrals.summary.active'),     value: summary.active,                   icon: 'ri-team-line',              bg: 'bg-emerald-50 text-emerald-600' },
            { label: t('marketing.referrals.summary.converted'),  value: summary.converted,                icon: 'ri-checkbox-circle-line',   bg: 'bg-amber-50 text-amber-600'     },
            { label: t('marketing.referrals.summary.commission'), value: `$${summary.commission.toLocaleString()}`, icon: 'ri-coins-line', bg: 'bg-rose-50 text-rose-500'       },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <div><p className="text-xs text-gray-400 font-medium">{card.label}</p><p className="text-xl font-bold text-gray-900">{card.value}</p></div>
            </div>
          ))}
        </div>

        {/* Commission Settings */}
        <div className="bg-white rounded-xl ring-1 ring-gray-100 p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50">
              <i className="ri-settings-4-line text-amber-600 text-lg" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{t('marketing.referrals.commission_settings')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('marketing.referrals.commission_rate_label')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-32">
              <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(+e.target.value)} min={0} max={100}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all pe-8" />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
            </div>
            <span className="text-sm text-gray-500">per conversion</span>
            <button type="button" className="px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
              {t('settings.save')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${filter === f.key ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><i className="ri-search-line text-xs" /></div>
              <input type="text" placeholder={t('marketing.referrals.search_placeholder')} value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>{['col.referrer','col.code','col.referred','col.converted','col.earned','col.joined','col.status','col.actions'].map((k) => (
                  <th key={k} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{t(`marketing.referrals.${k}`)}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400"><i className="ri-share-line text-4xl" /><p className="text-sm font-medium">{t('marketing.referrals.no_referrals')}</p></div>
                  </td></tr>
                ) : filtered.map((ref) => {
                  const rate = ref.totalReferred > 0 ? Math.round((ref.converted / ref.totalReferred) * 100) : 0;
                  return (
                    <tr key={ref.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{ref.referrer}</p>
                        <p className="text-xs text-gray-400">{ref.referrerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded">{ref.code}</span>
                          <button type="button" onClick={() => copyCode(ref.id, ref.code)} className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-teal-500 cursor-pointer transition-colors">
                            <i className={`${copiedId === ref.id ? 'ri-check-line text-teal-500' : 'ri-file-copy-line'} text-xs`} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-sm font-bold text-gray-900">{ref.totalReferred}</span></td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-gray-900">{ref.converted}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{rate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-gray-900">${(ref.totalEarned + ref.pendingCommission).toLocaleString()}</p>
                        {ref.pendingCommission > 0 && <p className="text-xs text-amber-600">${ref.pendingCommission} pending</p>}
                      </td>
                      <td className="px-4 py-3"><span className="text-sm text-gray-500">{ref.joinedAt}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg[ref.status]}`}>
                          {t(`marketing.referrals.filter.${ref.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {ref.status === 'active' ? (
                            <button type="button" onClick={() => setConfirm({ type: 'pause', id: ref.id })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 cursor-pointer transition-colors">
                              <i className="ri-pause-circle-line text-sm" />
                            </button>
                          ) : (
                            <button type="button" onClick={() => setConfirm({ type: 'activate', id: ref.id })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors">
                              <i className="ri-play-circle-line text-sm" />
                            </button>
                          )}
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

      <ConfirmModal isOpen={!!confirm}
        title={confirm?.type === 'pause' ? t('actions.suspend') : t('actions.activate')}
        message={confirm?.type === 'pause' ? t('marketing.referrals.confirm_pause') : t('marketing.referrals.confirm_activate')}
        confirmLabel={confirm?.type === 'pause' ? t('actions.suspend') : t('actions.activate')}
        confirmVariant={confirm?.type === 'pause' ? 'warning' : 'success'}
        onConfirm={handleConfirm} onClose={() => setConfirm(null)} />
    </>
  );
}
