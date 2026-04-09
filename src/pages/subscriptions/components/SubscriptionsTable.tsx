import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import StatusBadge, { PlanBadge, ActionIconButton } from '../../../components/base/StatusBadge';
import SubscriptionDetailModal from './SubscriptionDetailModal';
import { fetchSubscriptionsList, patchSubscriptionStatus } from '../../../api/subscriptions.api';
import type { AdminSubscription } from '../../../types/subscription.types';
import type { SubscriptionStatusValue } from '../../../types/subscription.types';

const PER_PAGE = 15;

type FilterType = 'all' | SubscriptionStatusValue;
const columnHelper = createColumnHelper<AdminSubscription>();

const STATUS_OPTIONS: SubscriptionStatusValue[] = ['pending', 'active', 'rejected', 'cancelled'];

export default function SubscriptionsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [patchingId, setPatchingId] = useState<number | null>(null);

  const loadSubscriptions = useCallback(async () => {
    setListError('');
    setLoading(true);
    const r = await fetchSubscriptionsList(page, PER_PAGE, {
      status: statusFilter === 'all' ? undefined : statusFilter,
    });
    setLoading(false);
    if (r.ok === false) {
      if (r.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setListError(r.message);
      setRows([]);
      return;
    }
    let data = r.list.data;
    if (statusFilter !== 'all') {
      data = data.filter((s) => s.status === statusFilter);
    }
    setRows(data);
    setLastPage(Math.max(1, r.list.last_page));
    setTotal(r.list.total);
  }, [navigate, page, statusFilter]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const filteredRows = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (s) =>
        String(s.id).includes(q) ||
        s.tenant_id.toLowerCase().includes(q) ||
        (s.plan?.title ?? '').toLowerCase().includes(q),
    );
  }, [rows, globalFilter]);

  const handlePatchStatus = useCallback(
    async (id: number, status: string) => {
      setPatchingId(id);
      const r = await patchSubscriptionStatus(id, { status });
      setPatchingId(null);
      if (r.ok === false) {
        if (r.unauthorized) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setListError(r.message);
        return;
      }
      await loadSubscriptions();
    },
    [navigate, loadSubscriptions],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => t('subscriptions.col.id'),
        cell: (info) => (
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('tenant_id', {
        header: () => t('subscriptions.col.tenant'),
        cell: (info) => (
          <div>
            <p className="text-sm font-semibold text-gray-900">{info.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor((row) => row.plan?.title ?? '', {
        id: 'planTitle',
        header: () => t('subscriptions.col.plan'),
        cell: (info) => <PlanBadge plan={info.getValue()} />,
      }),
      columnHelper.accessor((row) => row.plan?.price ?? '', {
        id: 'planPrice',
        header: () => t('subscriptions.col.price'),
        cell: (info) => {
          const row = info.row.original;
          const price = row.plan?.price;
          return (
            <div>
              <p className="text-sm font-bold text-gray-900">${price}</p>
              <p className="text-xs text-gray-400">
                {row.plan?.days} {t('plans.duration_days')}
              </p>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: () => t('subscriptions.col.status'),
        cell: (info) => {
          const sub = info.row.original;
          return (
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <StatusBadge status={sub.status} />
              <select
                value={
                  STATUS_OPTIONS.includes(sub.status as SubscriptionStatusValue)
                    ? (sub.status as SubscriptionStatusValue)
                    : 'pending'
                }
                disabled={patchingId === sub.id}
                onChange={(e) => void handlePatchStatus(sub.id, e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-800 max-w-[140px] focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {t(`status.${s}`)}
                  </option>
                ))}
              </select>
            </div>
          );
        },
      }),
      columnHelper.accessor('ends_at', {
        header: () => t('subscriptions.col.ends_at'),
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <i className="ri-calendar-line text-gray-400 text-xs" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('subscriptions.col.actions'),
        cell: (info) => (
          <span className="inline-flex items-center gap-0.5">
            <ActionIconButton
              icon="ri-eye-line"
              label={t('actions.view_details')}
              onClick={() => setDetailId(info.row.original.id)}
            />
          </span>
        ),
      }),
    ],
    [t, patchingId, handlePatchStatus],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filters: { value: FilterType; labelKey: string }[] = [
    { value: 'all', labelKey: 'subscriptions.filter.all' },
    { value: 'active', labelKey: 'subscriptions.filter.active' },
    { value: 'pending', labelKey: 'subscriptions.filter.pending' },
    { value: 'rejected', labelKey: 'subscriptions.filter.rejected' },
    { value: 'cancelled', labelKey: 'subscriptions.filter.cancelled' },
  ];

  const totalActiveOnPage = rows.filter((s) => s.status === 'active').length;
  const totalMRRApprox = rows
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => acc + Number.parseFloat(String(s.plan?.price ?? 0)), 0);

  const pageScoped = lastPage > 1;

  const hasSearch = globalFilter.trim().length > 0;
  const displayFrom = rows.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const displayTo = rows.length === 0 ? 0 : (page - 1) * PER_PAGE + rows.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500 font-medium">{t('subscriptions.summary.total')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '—' : total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            {t('subscriptions.summary.active')}
            {pageScoped ? (
              <span className="text-gray-400 font-normal ms-1">({t('subscriptions.summary.page_scope')})</span>
            ) : null}
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {loading ? '—' : totalActiveOnPage}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            {t('subscriptions.summary.mrr')}
            {pageScoped ? (
              <span className="text-gray-400 font-normal ms-1">({t('subscriptions.summary.page_scope')})</span>
            ) : null}
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {loading ? '—' : `$${totalMRRApprox.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      {listError ? (
        <div className="rounded-xl bg-rose-50 text-rose-800 text-sm px-4 py-3 ring-1 ring-rose-100">
          {listError}
        </div>
      ) : null}

      <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatusFilter(f.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${statusFilter === f.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
          <div className="relative flex-shrink-0">
            <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="ri-search-line text-xs" />
            </div>
            <input
              type="text"
              placeholder={t('subscriptions.search_placeholder')}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-52 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
              <i className="ri-loader-4-line text-3xl text-teal-600 animate-spin" />
              <p className="text-sm">{t('subscriptions.loading')}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/80">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer whitespace-nowrap"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() && (
                            <i
                              className={`ri-arrow-${header.column.getIsSorted() === 'asc' ? 'up' : 'down'}-s-line text-teal-500`}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-50">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <i className="ri-file-list-3-line text-4xl" />
                        <p className="text-sm font-medium">{t('table.no_subscriptions')}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500">
            {hasSearch
              ? t('subscriptions.search_on_page', { count: filteredRows.length })
              : `${t('table.showing')} ${displayFrom}–${displayTo} ${t('table.of')} ${total} ${t('table.subscriptions_count')}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-right-s-line" />
            </button>
            <span className="text-sm text-gray-600 px-2 min-w-[4rem] text-center">
              {page} / {lastPage}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= lastPage || loading}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-s-line" />
            </button>
          </div>
        </div>
      </div>

      <SubscriptionDetailModal
        subscriptionId={detailId}
        onClose={() => setDetailId(null)}
        onUpdated={() => void loadSubscriptions()}
      />
    </div>
  );
}
