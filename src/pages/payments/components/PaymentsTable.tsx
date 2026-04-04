import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, createColumnHelper,
  flexRender, type SortingState,
} from '@tanstack/react-table';
import { paymentsData, type Payment, type PaymentStatus } from '../../../mocks/payments';
import StatusBadge from '../../../components/base/StatusBadge';
import { ActionIconButton } from '../../../components/base/StatusBadge';
import ConfirmModal from '../../../components/base/ConfirmModal';
import InvoiceModal from './InvoiceModal';

type FilterType = 'all' | PaymentStatus;
const columnHelper = createColumnHelper<Payment>();

const methodConfig: Record<string, { icon: string; color: string }> = {
  visa:  { icon: 'ri-visa-fill',                color: 'text-gray-700' },
  mada:  { icon: 'ri-bank-card-2-line',         color: 'text-emerald-600' },
  stc:   { icon: 'ri-smartphone-line',          color: 'text-teal-600' },
  bank:  { icon: 'ri-bank-line',               color: 'text-gray-600' },
  cash:  { icon: 'ri-money-dollar-circle-line', color: 'text-amber-600' },
};

export default function PaymentsTable() {
  const { t } = useTranslation();
  const [data, setData] = useState<Payment[]>(paymentsData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [invoicePayment, setInvoicePayment] = useState<Payment | null>(null);
  const [confirmData, setConfirmData] = useState<{ type: 'refund' | 'mark_paid'; paymentId: string } | null>(null);

  const filteredData = useMemo(() => {
    const base = statusFilter === 'all' ? data : data.filter((p) => p.status === statusFilter);
    if (!globalFilter) return base;
    const q = globalFilter.toLowerCase();
    return base.filter((p) => p.invoiceId.toLowerCase().includes(q) || p.atelier.toLowerCase().includes(q));
  }, [data, statusFilter, globalFilter]);

  const handleRefund = (paymentId: string) => {
    setData((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: 'refunded' as PaymentStatus } : p)));
  };
  const handleMarkPaid = (paymentId: string) => {
    setData((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: 'paid' as PaymentStatus } : p)));
  };

  const columns = useMemo(() => [
    columnHelper.accessor('invoiceId', {
      header: () => t('payments.col.invoice'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{info.getValue()}</span>
          <button type="button" onClick={() => navigator.clipboard.writeText(info.getValue())}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-teal-500 cursor-pointer transition-colors" title="Copy">
            <i className="ri-file-copy-line text-xs" />
          </button>
        </div>
      ),
    }),
    columnHelper.accessor('atelier', {
      header: () => t('payments.col.atelier'),
      cell: (info) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{info.getValue()}</p>
          <p className="text-xs text-gray-400">{info.row.original.atelierEmail}</p>
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: () => t('payments.col.amount'),
      cell: (info) => (
        <div>
          <p className="text-sm font-bold text-gray-900">${info.getValue().toLocaleString()}</p>
          <p className="text-xs text-gray-400 capitalize">{info.row.original.plan}</p>
        </div>
      ),
    }),
    columnHelper.accessor('method', {
      header: () => t('payments.col.method'),
      cell: (info) => {
        const mc = methodConfig[info.getValue()] ?? methodConfig.bank;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 flex items-center justify-center ${mc.color}`}>
              <i className={`${mc.icon} text-base`} />
            </div>
            <span className="text-sm text-gray-700">{t(`payments.method.${info.getValue()}`)}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: () => t('payments.col.status'),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('date', {
      header: () => t('payments.col.date'),
      cell: (info) => <span className="text-sm text-gray-500">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => t('payments.col.actions'),
      cell: (info) => {
        const { status, id } = info.row.original;
        return (
          <div className="flex items-center gap-0.5">
            <ActionIconButton icon="ri-file-text-line" label={t('payments.view_invoice')} onClick={() => setInvoicePayment(info.row.original)} />
            {status === 'paid' && (
              <ActionIconButton icon="ri-refund-2-line" label={t('payments.refund')} variant="warning"
                onClick={() => setConfirmData({ type: 'refund', paymentId: id })} />
            )}
            {(status === 'pending' || status === 'failed') && (
              <ActionIconButton icon="ri-checkbox-circle-line" label={t('payments.mark_paid')} variant="success"
                onClick={() => setConfirmData({ type: 'mark_paid', paymentId: id })} />
            )}
          </div>
        );
      },
    }),
  ], [t]);

  const table = useReactTable({
    data: filteredData, columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const filters: { value: FilterType; labelKey: string }[] = [
    { value: 'all',      labelKey: 'payments.filter.all'      },
    { value: 'paid',     labelKey: 'payments.filter.paid'     },
    { value: 'pending',  labelKey: 'payments.filter.pending'  },
    { value: 'refunded', labelKey: 'payments.filter.refunded' },
    { value: 'failed',   labelKey: 'payments.filter.failed'   },
  ];

  const totalRevenue = data.filter((p) => p.status === 'paid').reduce((a, p) => a + p.amount, 0);
  const totalPaid    = data.filter((p) => p.status === 'paid').length;
  const totalPending = data.filter((p) => p.status === 'pending').length;
  const totalRefunded= data.filter((p) => p.status === 'refunded').length;

  const totalCount = table.getPrePaginationRowModel().rows.length;
  const pageIndex  = table.getState().pagination.pageIndex;
  const pageSize   = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to   = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('payments.summary.total_revenue'), value: `$${totalRevenue.toLocaleString()}`, icon: 'ri-money-dollar-circle-line', color: 'bg-teal-50 text-teal-600' },
            { label: t('payments.summary.paid'),           value: String(totalPaid),    icon: 'ri-checkbox-circle-line',  color: 'bg-emerald-50 text-emerald-600' },
            { label: t('payments.summary.pending'),        value: String(totalPending), icon: 'ri-time-line',             color: 'bg-amber-50 text-amber-600'     },
            { label: t('payments.summary.refunded'),       value: String(totalRefunded),icon: 'ri-refund-2-line',         color: 'bg-rose-50 text-rose-600'       },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.color}`}>
                <i className={`${card.icon} text-lg`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <button key={f.value} type="button" onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${statusFilter === f.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <i className="ri-search-line text-xs" />
              </div>
              <input type="text" placeholder={t('payments.search_placeholder')} value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-52 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
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
                      <i className="ri-bank-card-line text-4xl" />
                      <p className="text-sm font-medium">{t('payments.no_payments')}</p>
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
              {t('table.showing')} {from}–{to} {t('table.of')} {totalCount} {t('payments.payments_count')}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <i className="ri-arrow-right-s-line" />
              </button>
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <button key={i} type="button" onClick={() => table.setPageIndex(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${table.getState().pagination.pageIndex === i ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {i + 1}
                </button>
              ))}
              <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <i className="ri-arrow-left-s-line" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal payment={invoicePayment} onClose={() => setInvoicePayment(null)} />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmData}
        title={confirmData?.type === 'refund' ? t('payments.refund') : t('payments.mark_paid')}
        message={confirmData?.type === 'refund' ? t('payments.confirm_refund') : t('payments.confirm_mark_paid')}
        confirmLabel={confirmData?.type === 'refund' ? t('payments.refund') : t('payments.mark_paid')}
        confirmVariant={confirmData?.type === 'refund' ? 'warning' : 'success'}
        onConfirm={() => {
          if (!confirmData) return;
          if (confirmData.type === 'refund') handleRefund(confirmData.paymentId);
          else handleMarkPaid(confirmData.paymentId);
        }}
        onClose={() => setConfirmData(null)}
      />
    </>
  );
}
