import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { featureFlagsData, type FeatureFlag, type FlagCategory } from '../../../mocks/featureFlags';

type PlanKey = 'starter' | 'pro' | 'enterprise';

const CATEGORIES: FlagCategory[] = ['core', 'advanced', 'integrations', 'beta'];

const categoryConfig: Record<FlagCategory, { icon: string; color: string; bg: string }> = {
  core:         { icon: 'ri-layout-masonry-line', color: 'text-teal-700',    bg: 'bg-teal-50'    },
  advanced:     { icon: 'ri-rocket-line',         color: 'text-amber-700',   bg: 'bg-amber-50'   },
  integrations: { icon: 'ri-links-line',          color: 'text-emerald-700', bg: 'bg-emerald-50' },
  beta:         { icon: 'ri-flask-line',          color: 'text-rose-600',    bg: 'bg-rose-50'    },
};

const planConfig: Record<PlanKey, { label: string; headerBg: string; countColor: string; toggleOn: string }> = {
  starter:    { label: 'Starter',    headerBg: 'bg-gray-800',   countColor: 'text-gray-300',   toggleOn: 'bg-gray-600'   },
  pro:        { label: 'Pro',        headerBg: 'bg-teal-700',   countColor: 'text-teal-200',   toggleOn: 'bg-teal-500'   },
  enterprise: { label: 'Enterprise', headerBg: 'bg-emerald-700',countColor: 'text-emerald-200',toggleOn: 'bg-emerald-500'},
};

const PLANS: PlanKey[] = ['starter', 'pro', 'enterprise'];

export default function FlagsTable() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [flags, setFlags] = useState<FeatureFlag[]>(featureFlagsData);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [unsavedCount, setUnsavedCount] = useState(0);

  const toggle = (id: string, plan: PlanKey) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, plans: { ...f.plans, [plan]: !f.plans[plan] } } : f));
    setUnsavedCount((c) => c + 1);
    setSaved(false);
  };

  const handleSaveAll = () => {
    setSaved(true);
    setUnsavedCount(0);
    setTimeout(() => setSaved(false), 3000);
  };

  const filteredBySearch = useMemo(() => {
    if (!search) return flags;
    const q = search.toLowerCase();
    return flags.filter((f) => f.name.toLowerCase().includes(q) || f.nameAr.includes(q) || f.description.toLowerCase().includes(q));
  }, [flags, search]);

  const grouped = useMemo(() => {
    const map = new Map<FlagCategory, FeatureFlag[]>();
    CATEGORIES.forEach((cat) => map.set(cat, []));
    filteredBySearch.forEach((f) => map.get(f.category)?.push(f));
    return map;
  }, [filteredBySearch]);

  // Counts per plan
  const planCounts = useMemo(() => {
    const counts: Record<PlanKey, { enabled: number; total: number }> = {
      starter:    { enabled: 0, total: 0 },
      pro:        { enabled: 0, total: 0 },
      enterprise: { enabled: 0, total: 0 },
    };
    flags.forEach((f) => {
      PLANS.forEach((p) => {
        counts[p].total++;
        if (f.plans[p]) counts[p].enabled++;
      });
    });
    return counts;
  }, [flags]);

  // Summary
  const summary = useMemo(() => {
    const total = flags.length;
    const fullyEnabled = flags.filter((f) => PLANS.every((p) => f.plans[p])).length;
    const partial = flags.filter((f) => PLANS.some((p) => f.plans[p]) && !PLANS.every((p) => f.plans[p])).length;
    const beta = flags.filter((f) => f.isBeta).length;
    return { total, fullyEnabled, partial, beta };
  }, [flags]);

  return (
    <div className="flex flex-col gap-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t('feature_flags.summary.total'),       value: summary.total,        icon: 'ri-toggle-line',         bg: 'bg-teal-50 text-teal-600'       },
          { label: t('feature_flags.summary.enabled_all'), value: summary.fullyEnabled, icon: 'ri-checkbox-circle-line',bg: 'bg-emerald-50 text-emerald-600' },
          { label: t('feature_flags.summary.partial'),     value: summary.partial,      icon: 'ri-contrast-2-line',     bg: 'bg-amber-50 text-amber-600'     },
          { label: t('feature_flags.summary.beta_count'),  value: summary.beta,         icon: 'ri-flask-line',          bg: 'bg-rose-50 text-rose-500'       },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.bg}`}>
              <i className={`${card.icon} text-lg`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative">
            <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="ri-search-line text-xs" />
            </div>
            <input type="text" placeholder={t('feature_flags.search_placeholder')} value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
          </div>
          <div className="flex items-center gap-3">
            {unsavedCount > 0 && !saved && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <i className="ri-edit-2-line" />{unsavedCount} {t('feature_flags.unsaved')}
              </span>
            )}
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <i className="ri-checkbox-circle-fill" />{t('feature_flags.saved')}
              </span>
            )}
            <button type="button" onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
              <i className="ri-save-line" />{t('feature_flags.save_all')}
            </button>
          </div>
        </div>

        {/* Plan Headers */}
        <div className="grid grid-cols-[1fr_120px_100px_100px_100px] border-b border-gray-100">
          <div className="px-5 py-3 bg-gray-50 flex items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('feature_flags.col.feature')}</span>
          </div>
          {PLANS.map((plan) => {
            const pc = planConfig[plan];
            const cnt = planCounts[plan];
            return (
              <div key={plan} className={`py-3 px-4 ${pc.headerBg} flex flex-col items-center justify-center text-center`}>
                <p className="text-xs font-bold text-white">{t(`feature_flags.col.${plan}`)}</p>
                <p className={`text-xs mt-0.5 ${pc.countColor}`}>{cnt.enabled}/{cnt.total}</p>
              </div>
            );
          })}
        </div>

        {/* Grouped Rows */}
        <div>
          {CATEGORIES.map((cat) => {
            const catFlags = grouped.get(cat) ?? [];
            if (catFlags.length === 0) return null;
            const catCfg = categoryConfig[cat];
            return (
              <div key={cat}>
                {/* Category Header */}
                <div className={`px-5 py-2.5 flex items-center gap-2 ${catCfg.bg} border-y border-gray-100`}>
                  <div className={`w-5 h-5 flex items-center justify-center ${catCfg.color}`}>
                    <i className={`${catCfg.icon} text-sm`} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wide ${catCfg.color}`}>
                    {t(`feature_flags.categories.${cat}`)}
                  </span>
                  <span className={`text-xs font-medium ${catCfg.color} opacity-60`}>({catFlags.length})</span>
                </div>

                {/* Feature Rows */}
                {catFlags.map((flag) => (
                  <div key={flag.id}
                    className="grid grid-cols-[1fr_120px_100px_100px_100px] border-b border-gray-50 last:border-b-0 hover:bg-gray-50/40 transition-colors">
                    {/* Feature Info */}
                    <div className="px-5 py-3.5 flex items-start gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">{isAr ? flag.nameAr : flag.name}</p>
                          {flag.isBeta && (
                            <span className="text-xs font-bold px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                              {t('feature_flags.beta_badge')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {isAr ? flag.descriptionAr : flag.description}
                        </p>
                      </div>
                    </div>

                    {/* Plan Toggles */}
                    {PLANS.map((plan) => {
                      const on = flag.plans[plan];
                      const pc = planConfig[plan];
                      return (
                        <div key={plan} className="flex items-center justify-center py-3.5 px-4">
                          <div onClick={() => toggle(flag.id, plan)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${on ? pc.toggleOn : 'bg-gray-200'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${on ? 'start-5' : 'start-0.5'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}

          {filteredBySearch.length === 0 && (
            <div className="px-4 py-16 text-center">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <i className="ri-toggle-line text-4xl" />
                <p className="text-sm font-medium">{t('feature_flags.no_flags')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
