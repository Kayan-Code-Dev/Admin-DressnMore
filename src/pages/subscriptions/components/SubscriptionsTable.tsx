import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, createColumnHelper,
  flexRender, type SortingState,
} from '@tanstack/react-table';
import StatusBadge, { PlanBadge, ActionIconButton } from '../../../components/base/StatusBadge';
import { subscriptionsData, type Subscription, type SubscriptionStatus } from '../../../mocks/subscriptions';

type FilterType = 'all' | SubscriptionStatus;
const columnHelper = createColumnHelper<Subscription>();

export default function SubscriptionsTable() {
  const { t } = useTranslation();
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return subscriptionsData;
    return subscriptionsData.filter((s) => s.status === statusFilter);
  }, [statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: () => t('subscriptions.col.id'),
      cell: (info) => <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{info.getValue()}</span>,
    }),
    columnHelper.accessor('atelierName', {
      header: () => t('subscriptions.col.atelier'),
      cell: (info) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{info.getValue()}</p>
          <p className="text-xs text-gray-400">{info.row.original.atelierOwner}</p>
        </div>
      ),
    }),
    columnHelper.accessor('plan', {
      header: () => t('subscriptions.col.plan'),
      cell: (info) => <PlanBadge plan={info.getValue()} />,
    }),
    columnHelper.accessor('price', {
      header: () => t('subscriptions.col.price'),
      cell: (info) => (
        <div>
          <p className="text-sm font-bold text-gray-900">{info.getValue() === 0 ? t('subscriptions.free_trial') : `$${info.getValue()}`}</p>
          <p className="text-xs text-gray-400">{t(`subscriptions.${info.row.original.billingCycle}`)}</p>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => t('subscriptions.col.status'),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('renewalDate', {
      header: () => t('subscriptions.col.renewal_date'),
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <i className="ri-calendar-line text-gray-400 text-xs" />{info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('lastPayment', {
      header: () => t('subscriptions.col.last_payment'),
      cell: (info) => <span className="text-sm text-gray-500">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => t('subscriptions.col.actions'),
      cell: (info) => {
        const status = info.row.original.status;
        return (
          <div className="flex items-center gap-0.5">
            <ActionIconButton icon="ri-eye-line" label={t('actions.view_details')} />
            {status === 'active' && <ActionIconButton icon="ri-exchange-line" label={t('actions.change_plan')} variant="default" />}
            {(status === 'cancelled' || status === 'expired')
              ? <ActionIconButton icon="ri-refresh-line" label={t('actions.renew')} variant="success" />
              : <ActionIconButton icon="ri-close-circle-line" label={t('actions.cancel')} variant="danger" />
            }
          </div>
        );
      },
    }),
  ], [t]);

  const table = useReactTable({
    data: filteredData, columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const filters: { value: FilterType; labelKey: string }[] = [
    { value: 'all',       labelKey: 'subscriptions.filter.all'       },
    { value: 'active',    labelKey: 'subscriptions.filter.active'    },
    { value: 'pending',   labelKey: 'subscriptions.filter.pending'   },
    { value: 'trial',     labelKey: 'subscriptions.filter.trial'     },
    { value: 'cancelled', labelKey: 'subscriptions.filter.cancelled' },
    { value: 'expired',   labelKey: 'subscriptions.filter.expired'   },
  ];

  const totalActive = subscriptionsData.filter((s) => s.status === 'active').length;
  const totalMRR    = subscriptionsData.filter((s) => s.status === 'active' && s.billingCycle === 'monthly').reduce((acc, s) => acc + s.price, 0);
  const totalCount  = table.getFilteredRowModel().rows.length;
  const pageIndex   = table.getState().pagination.pageIndex;
  const pageSize    = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to   = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500 font-medium">{t('subscriptions.summary.total')}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{subscriptionsData.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500 font-medium">{t('subscriptions.summary.active')}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalActive}</p>
        </div>
        <div className="bg-white rounded-xl p-4 ring-1 ring-gray-100">
          <p className="text-xs text-gray-500 font-medium">{t('subscriptions.summary.mrr')}</p>
          <p className="text-2xl font-bold text-teal-600 mt-1">${totalMRR.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f.value} type="button" onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${statusFilter === f.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >{t(f.labelKey)}</button>
            ))}
          </div>
          <div className="relative flex-shrink-0">
            <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="ri-search-line text-xs" />
            </div>
            <input type="text" placeholder={t('subscriptions.search_placeholder')} value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-52 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer whitespace-nowrap" onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && <i className={`ri-arrow-${header.column.getIsSorted() === 'asc' ? 'up' : 'down'}-s-line text-teal-500`} />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <i className="ri-file-list-3-line text-4xl" />
                    <p className="text-sm font-medium">{t('table.no_subscriptions')}</p>
                  </div>
                </td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('table.showing')} {from}–{to} {t('table.of')} {totalCount} {t('table.subscriptions_count')}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
              <i className="ri-arrow-right-s-line" />
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button key={i} type="button" onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${table.getState().pagination.pageIndex === i ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >{i + 1}</button>
            ))}
            <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
              <i className="ri-arrow-left-s-line" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
