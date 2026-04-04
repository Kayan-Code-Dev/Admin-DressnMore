import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, createColumnHelper,
  flexRender, type SortingState,
} from '@tanstack/react-table';
import StatusBadge, { PlanBadge, ActionIconButton } from '../../../components/base/StatusBadge';
import { ateliersData, type Atelier, type AtelierStatus } from '../../../mocks/ateliers';

type FilterType = 'all' | AtelierStatus;
const columnHelper = createColumnHelper<Atelier>();

interface AteliersTableProps {
  onViewDetails: (atelier: Atelier) => void;
}

export default function AteliersTable({ onViewDetails }: AteliersTableProps) {
  const { t } = useTranslation();
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return ateliersData;
    return ateliersData.filter((a) => a.status === statusFilter);
  }, [statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: () => t('ateliers.col.atelier'),
      cell: (info) => (
        <div className="flex items-center gap-3">
          <img src={info.row.original.avatar} alt={info.getValue()} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{info.getValue()}</p>
            <p className="text-xs text-gray-400">{info.row.original.email}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('owner', {
      header: () => t('ateliers.col.owner'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
            <i className="ri-user-line text-xs" />
          </div>
          <span className="text-sm text-gray-700">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('plan', {
      header: () => t('ateliers.col.plan'),
      cell: (info) => <PlanBadge plan={info.getValue()} />,
    }),
    columnHelper.accessor('status', {
      header: () => t('ateliers.col.status'),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('employees', {
      header: () => t('ateliers.col.employees'),
      cell: (info) => (
        <span className="text-sm text-gray-600 flex items-center gap-1.5">
          <i className="ri-team-line text-gray-400" />{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: () => t('ateliers.col.created'),
      cell: (info) => <span className="text-sm text-gray-500">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => t('ateliers.col.actions'),
      cell: (info) => (
        <div className="flex items-center gap-0.5">
          <ActionIconButton icon="ri-eye-line"   label={t('actions.view')}   onClick={() => onViewDetails(info.row.original)} />
          <ActionIconButton icon="ri-edit-line"  label={t('actions.edit')}   variant="default" />
          <ActionIconButton
            icon={info.row.original.status === 'suspended' ? 'ri-play-circle-line' : 'ri-pause-circle-line'}
            label={info.row.original.status === 'suspended' ? t('actions.activate') : t('actions.suspend')}
            variant="warning"
          />
          <ActionIconButton icon="ri-login-box-line"  label={t('actions.login_as')} variant="success" />
          <ActionIconButton icon="ri-delete-bin-line" label={t('actions.delete')}   variant="danger" />
        </div>
      ),
    }),
  ], [t, onViewDetails]);

  const table = useReactTable({
    data: filteredData, columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const filters: { value: FilterType; labelKey: string }[] = [
    { value: 'all',       labelKey: 'ateliers.filter.all'       },
    { value: 'active',    labelKey: 'ateliers.filter.active'    },
    { value: 'suspended', labelKey: 'ateliers.filter.suspended' },
    { value: 'pending',   labelKey: 'ateliers.filter.pending'   },
    { value: 'trial',     labelKey: 'ateliers.filter.trial'     },
  ];

  const totalCount = table.getFilteredRowModel().rows.length;
  const pageIndex  = table.getState().pagination.pageIndex;
  const pageSize   = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to   = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button key={f.value} type="button" onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${statusFilter === f.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="ri-search-line text-xs" />
            </div>
            <input type="text" placeholder={t('ateliers.search_placeholder')} value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-48 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>
          <button type="button" className="flex items-center gap-2 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" />{t('ateliers.add_atelier')}
          </button>
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
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <i className="ri-store-2-line text-4xl" />
                    <p className="text-sm font-medium">{t('table.no_ateliers')}</p>
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
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {t('table.showing')} {from}–{to} {t('table.of')} {totalCount} {t('table.ateliers_count')}
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
  );
}
