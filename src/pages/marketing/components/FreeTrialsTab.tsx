import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { freeTrialsData, type FreeTrial, type TrialStatus } from '../../../mocks/marketing';
import ConfirmModal from '../../../components/base/ConfirmModal';

type FilterKey = 'all' | TrialStatus;

const statusCfg: Record<TrialStatus, string> = {
  active:    'bg-emerald-50 text-emerald-700',
  expired:   'bg-rose-50 text-rose-600',
  converted: 'bg-teal-50 text-teal-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const planColors: Record<string, string> = {
  Starter:    'bg-gray-100 text-gray-600',
  Pro:        'bg-amber-50 text-amber-700',
  Enterprise: 'bg-emerald-50 text-emerald-700',
};

interface ExtendModalProps { trial: FreeTrial | null; onClose: () => void; onExtend: (id: string, days: number) => void; }
function ExtendModal({ trial, onClose, onExtend }: ExtendModalProps) {
  const { t } = useTranslation();
  const [days, setDays] = useState(7);
  if (!trial) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-50"><i className="ri-calendar-check-line text-teal-600 text-lg" /></div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{t('marketing.trials.extend_modal.title')}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{trial.atelier}</p>
            </div>
          </div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('marketing.trials.extend_modal.days_label')}</label>
          <div className="flex items-center gap-3 mb-5">
            {[7, 14, 30].map((d) => (
              <button key={d} type="button" onClick={() => setDays(d)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-2 ${days === d ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}>
                +{d}
              </button>
            ))}
            <div className="relative w-20">
              <input type="number" value={days} onChange={(e) => setDays(Math.max(1, +e.target.value))} min={1} max={90}
                className="w-full px-2 py-2 text-sm border border-gray-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
              {t('marketing.trials.extend_modal.cancel')}
            </button>
            <button type="button" onClick={() => { onExtend(trial.id, days); onClose(); }}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
              {t('marketing.trials.extend_modal.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FreeTrialsTab() {
  const { t } = useTranslation();
  const [trials, setTrials] = useState<FreeTrial[]>(freeTrialsData);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [extendTrial, setExtendTrial] = useState<FreeTrial | null>(null);
  const [confirm, setConfirm] = useState<{ type: 'convert' | 'cancel'; id: string } | null>(null);

  const filtered = useMemo(() => {
    let res = filter === 'all' ? trials : trials.filter((t) => t.status === filter);
    if (search) { const q = search.toLowerCase(); res = res.filter((t) => t.atelier.toLowerCase().includes(q) || t.atelierEmail.toLowerCase().includes(q)); }
    return res;
  }, [trials, filter, search]);

  const summary = useMemo(() => {
    const active    = trials.filter((t) => t.status === 'active').length;
    const expired   = trials.filter((t) => t.status === 'expired').length;
    const converted = trials.filter((t) => t.status === 'converted').length;
    const total     = trials.filter((t) => t.status !== 'active').length;
    return { active, expired, converted, rate: total > 0 ? Math.round((converted / (converted + expired)) * 100) : 0 };
  }, [trials]);

  const handleExtend = (id: string, days: number) => {
    setTrials((p) => p.map((t) => t.id === id ? { ...t, daysRemaining: t.daysRemaining + days } : t));
  };

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === 'convert') {
      setTrials((p) => p.map((t) => t.id === confirm.id ? { ...t, status: 'converted' as TrialStatus, daysRemaining: 0 } : t));
    } else {
      setTrials((p) => p.map((t) => t.id === confirm.id ? { ...t, status: 'cancelled' as TrialStatus, daysRemaining: 0 } : t));
    }
  };

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: 'all',       labelKey: 'marketing.trials.filter.all'       },
    { key: 'active',    labelKey: 'marketing.trials.filter.active'    },
    { key: 'expired',   labelKey: 'marketing.trials.filter.expired'   },
    { key: 'converted', labelKey: 'marketing.trials.filter.converted' },
    { key: 'cancelled', labelKey: 'marketing.trials.filter.cancelled' },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('marketing.trials.summary.active'),    value: summary.active,       icon: 'ri-time-line',             bg: 'bg-teal-50 text-teal-600'       },
            { label: t('marketing.trials.summary.expired'),   value: summary.expired,      icon: 'ri-calendar-close-line',   bg: 'bg-rose-50 text-rose-500'       },
            { label: t('marketing.trials.summary.converted'), value: summary.converted,    icon: 'ri-checkbox-circle-line',  bg: 'bg-emerald-50 text-emerald-600' },
            { label: t('marketing.trials.summary.rate'),      value: `${summary.rate}%`,   icon: 'ri-percent-line',          bg: 'bg-amber-50 text-amber-600'     },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <div><p className="text-xs text-gray-400 font-medium">{card.label}</p><p className="text-xl font-bold text-gray-900">{card.value}</p></div>
            </div>
          ))}
        </div>

        {/* Table */}
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
                <input type="text" placeholder={t('marketing.trials.search_placeholder')} value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
              </div>
              <button type="button"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-gift-line" />{t('marketing.trials.grant_trial')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>{['col.atelier','col.plan','col.start','col.end','col.days','col.status','col.actions'].map((k) => (
                  <th key={k} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{t(`marketing.trials.${k}`)}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400"><i className="ri-gift-line text-4xl" /><p className="text-sm font-medium">{t('marketing.trials.no_trials')}</p></div>
                  </td></tr>
                ) : filtered.map((trial) => {
                  const pct = trial.totalDays > 0 ? Math.max(0, Math.round((trial.daysRemaining / trial.totalDays) * 100)) : 0;
                  const isActive = trial.status === 'active';
                  return (
                    <tr key={trial.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{trial.atelier}</p>
                        <p className="text-xs text-gray-400">{trial.atelierEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${planColors[trial.plan] ?? planColors.Pro}`}>{trial.plan}</span>
                      </td>
                      <td className="px-4 py-3"><span className="text-sm text-gray-500">{trial.trialStart}</span></td>
                      <td className="px-4 py-3"><span className="text-sm text-gray-500">{trial.trialEnd}</span></td>
                      <td className="px-4 py-3 min-w-36">
                        {isActive ? (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">{trial.daysRemaining} {t('marketing.trials.days_remaining')}</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${pct > 50 ? 'bg-teal-500' : pct > 20 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        ) : <span className="text-sm text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg[trial.status]}`}>
                          {t(`marketing.trials.filter.${trial.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isActive && <>
                            <button type="button" onClick={() => setExtendTrial(trial)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 cursor-pointer whitespace-nowrap transition-colors">
                              <i className="ri-add-circle-line" />{t('marketing.trials.extend')}
                            </button>
                            <button type="button" onClick={() => setConfirm({ type: 'convert', id: trial.id })}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 cursor-pointer whitespace-nowrap transition-colors">
                              <i className="ri-vip-crown-line" />{t('marketing.trials.convert')}
                            </button>
                            <button type="button" onClick={() => setConfirm({ type: 'cancel', id: trial.id })}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 cursor-pointer transition-colors">
                              <i className="ri-close-circle-line text-sm" />
                            </button>
                          </>}
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

      <ExtendModal trial={extendTrial} onClose={() => setExtendTrial(null)} onExtend={handleExtend} />
      <ConfirmModal isOpen={!!confirm}
        title={confirm?.type === 'convert' ? t('marketing.trials.convert') : t('marketing.trials.cancel_trial')}
        message={confirm?.type === 'convert' ? t('marketing.trials.confirm_convert') : t('marketing.trials.confirm_cancel')}
        confirmLabel={confirm?.type === 'convert' ? t('marketing.trials.convert') : t('marketing.trials.cancel_trial')}
        confirmVariant={confirm?.type === 'convert' ? 'success' : 'danger'}
        onConfirm={handleConfirm} onClose={() => setConfirm(null)} />
    </>
  );
}
