import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { logsData, LOG_USERS, type LogEntry, type LogType, type LogSeverity } from '../../../mocks/logs';

type TimeKey = 'all' | 'today' | 'week' | 'month';

const typeCfg: Record<LogType, { bg: string; text: string }> = {
  auth:     { bg: 'bg-teal-50',    text: 'text-teal-700'    },
  atelier:  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  payment:  { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  settings: { bg: 'bg-orange-50',  text: 'text-orange-700'  },
  system:   { bg: 'bg-gray-100',   text: 'text-gray-600'    },
  error:    { bg: 'bg-rose-50',    text: 'text-rose-600'    },
  support:  { bg: 'bg-pink-50',    text: 'text-pink-600'    },
};

const severityCfg: Record<LogSeverity, { dot: string; label: string }> = {
  info:    { dot: 'bg-gray-400',    label: 'text-gray-500'    },
  success: { dot: 'bg-emerald-500', label: 'text-emerald-600' },
  warning: { dot: 'bg-amber-500',   label: 'text-amber-600'   },
  error:   { dot: 'bg-rose-500',    label: 'text-rose-600'    },
};

const LOG_TYPES: LogType[] = ['auth','atelier','payment','settings','system','error','support'];

const TODAY_PREFIX = '2026-03-20';
const WEEK_DATES   = ['2026-03-20','2026-03-19','2026-03-18','2026-03-17','2026-03-16','2026-03-15','2026-03-14'];
const MONTH_DATES  = WEEK_DATES.concat(['2026-03-13','2026-03-12','2026-03-11','2026-03-10','2026-03-09','2026-03-08','2026-03-07','2026-03-06','2026-03-05','2026-02-28']);

export default function LogsTable() {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<TimeKey>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [search, setSearch]         = useState('');
  const [exportMsg, setExportMsg]   = useState(false);

  const PAGE_SIZE = 15;
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let res = logsData;
    if (timeFilter === 'today')  res = res.filter((l) => l.timestamp.startsWith(TODAY_PREFIX));
    if (timeFilter === 'week')   res = res.filter((l) => WEEK_DATES.some((d) => l.timestamp.startsWith(d)));
    if (timeFilter === 'month')  res = res.filter((l) => MONTH_DATES.some((d) => l.timestamp.startsWith(d)));
    if (typeFilter !== 'all')    res = res.filter((l) => l.type === typeFilter);
    if (userFilter !== 'all')    res = res.filter((l) => l.user === userFilter);
    if (search) { const q = search.toLowerCase(); res = res.filter((l) => l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q)); }
    return res;
  }, [timeFilter, typeFilter, userFilter, search]);

  const summary = useMemo(() => ({
    total:    logsData.length,
    errors:   logsData.filter((l) => l.severity === 'error').length,
    warnings: logsData.filter((l) => l.severity === 'warning').length,
    today:    logsData.filter((l) => l.timestamp.startsWith(TODAY_PREFIX)).length,
  }), []);

  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pageCount  = Math.ceil(filtered.length / PAGE_SIZE);
  const from = page * PAGE_SIZE + 1;
  const to   = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const handleExport = () => { setExportMsg(true); setTimeout(() => setExportMsg(false), 3000); };

  const timeTabs: { key: TimeKey; labelKey: string }[] = [
    { key: 'all',   labelKey: 'logs.time.all'   },
    { key: 'today', labelKey: 'logs.time.today' },
    { key: 'week',  labelKey: 'logs.time.week'  },
    { key: 'month', labelKey: 'logs.time.month' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t('logs.summary.total'),    value: summary.total,    icon: 'ri-file-list-3-line',    bg: 'bg-teal-50 text-teal-600'       },
          { label: t('logs.summary.errors'),   value: summary.errors,   icon: 'ri-error-warning-line',  bg: 'bg-rose-50 text-rose-500'       },
          { label: t('logs.summary.warnings'), value: summary.warnings, icon: 'ri-alert-line',          bg: 'bg-amber-50 text-amber-600'     },
          { label: t('logs.summary.today'),    value: summary.today,    icon: 'ri-calendar-check-line', bg: 'bg-emerald-50 text-emerald-600' },
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
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-50 space-y-3">
          {/* Row 1: Time tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {timeTabs.map((tab) => (
                <button key={tab.key} type="button" onClick={() => { setTimeFilter(tab.key); setPage(0); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${timeFilter === tab.key ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t(tab.labelKey)}
                </button>
              ))}
            </div>

            {/* Row 2: Dropdowns + search + export */}
            <div className="flex items-center gap-2 flex-wrap">
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all cursor-pointer">
                <option value="all">{t('logs.filter.all_types')}</option>
                {LOG_TYPES.map((type) => (
                  <option key={type} value={type}>{t(`logs.types.${type}`)}</option>
                ))}
              </select>

              <select value={userFilter} onChange={(e) => { setUserFilter(e.target.value); setPage(0); }}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all cursor-pointer">
                <option value="all">{t('logs.filter.all_users')}</option>
                {LOG_USERS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>

              <div className="relative">
                <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><i className="ri-search-line text-xs" /></div>
                <input type="text" placeholder={t('logs.search_placeholder')} value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="w-48 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
              </div>

              <div className="flex items-center gap-2">
                {exportMsg && <span className="text-xs text-emerald-600 font-medium"><i className="ri-check-line me-1" />Exported!</span>}
                <button type="button" onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
                  <i className="ri-download-line" />{t('logs.export')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                {['col.time','col.type','col.severity','col.action','col.user','col.ip'].map((k) => (
                  <th key={k} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{t(`logs.${k}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400"><i className="ri-file-list-3-line text-4xl" /><p className="text-sm font-medium">{t('logs.no_logs')}</p></div>
                </td></tr>
              ) : paginated.map((log: LogEntry) => {
                const tc = typeCfg[log.type];
                const sc = severityCfg[log.severity];
                return (
                  <tr key={log.id} className={`hover:bg-gray-50/60 transition-colors ${log.severity === 'error' ? 'bg-rose-50/30' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono text-gray-500">{log.timestamp}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tc.bg} ${tc.text}`}>
                        {t(`logs.types.${log.type}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                        <span className={`text-xs font-medium ${sc.label}`}>{t(`logs.severity.${log.severity}`)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm text-gray-800 font-medium">{log.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{log.target}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs font-medium text-gray-700">{log.user}</p>
                      <p className="text-xs text-gray-400">{log.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{log.ip}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">{t('table.showing')} {from}–{to} {t('table.of')} {filtered.length} {t('logs.logs_count')}</p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer transition-colors">
                <i className="ri-arrow-right-s-line" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => (
                <button key={i} type="button" onClick={() => setPage(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${page === i ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {i + 1}
                </button>
              ))}
              <button type="button" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer transition-colors">
                <i className="ri-arrow-left-s-line" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
