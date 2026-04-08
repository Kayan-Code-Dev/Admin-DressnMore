import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import {
  fetchTenantsList,
  toggleTenantActive,
} from '../../../api/tenants.api';
import { buildTenantPortalUrl } from '../../../config/tenantPortal.config';
import { tenantRowStatus, primaryDomain, formatTenantDate } from '../../../lib/tenant.utils';
import type { Tenant } from '../../../types/tenant.types';

type FilterType = 'all' | 'active' | 'suspended' | 'trial';
const columnHelper = createColumnHelper<Tenant>();

function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0] ?? ''}${p[1][0] ?? ''}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || '—';
}

interface AteliersTableProps {
  onViewDetails: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onAdd: () => void;
  listVersion: number;
  /** Called after suspend/activate so open detail modals can refetch */
  onTenantMutated?: () => void;
}

export default function AteliersTable({
  onViewDetails,
  onEdit,
  onAdd,
  listVersion,
  onTenantMutated,
}: AteliersTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [rows, setRows] = useState<Tenant[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    const result = await fetchTenantsList(page, perPage);
    setLoading(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setLoadError(result.message);
      setRows([]);
      return;
    }
    setRows(result.list.data);
    setLastPage(Math.max(1, result.list.last_page));
    setTotal(result.list.total);
  }, [page, navigate]);

  const handleToggleActive = useCallback(
    async (tenant: Tenant) => {
      setTogglingId(tenant.id);
      const result = await toggleTenantActive(tenant.id);
      setTogglingId(null);
      if (result.ok === false) {
        if (result.unauthorized) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setLoadError(result.message);
        return;
      }
      await load();
      onTenantMutated?.();
    },
    [load, navigate, onTenantMutated],
  );

  useEffect(() => {
    load();
  }, [load, listVersion]);

  const filteredData = useMemo(() => {
    let list = rows;
    if (statusFilter !== 'all') {
      list = list.filter((r) => tenantRowStatus(r) === statusFilter);
    }
    const q = globalFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => {
      const slug = primaryDomain(r);
      const portalUrl = buildTenantPortalUrl(slug);
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        slug.toLowerCase().includes(q) ||
        (portalUrl?.toLowerCase().includes(q) ?? false) ||
        r.admin_name.toLowerCase().includes(q)
      );
    });
  }, [rows, statusFilter, globalFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => t('ateliers.col.atelier'),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {initials(row.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{info.getValue()}</p>
                <p className="text-xs text-gray-400">{row.email}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'admin_name',
        header: () => t('ateliers.col.owner'),
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
              <i className="ri-user-line text-xs" />
            </div>
            <span className="text-sm text-gray-700">{info.row.original.admin_name}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'domain',
        header: () => t('ateliers.col.domain'),
        cell: (info) => {
          const slug = primaryDomain(info.row.original);
          const url = buildTenantPortalUrl(slug);
          if (!url) {
            return <span className="text-sm text-gray-400">—</span>;
          }
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-teal-600 hover:text-teal-700 hover:underline break-all"
            >
              {url}
            </a>
          );
        },
      }),
      columnHelper.accessor('plan', {
        header: () => t('ateliers.col.plan'),
        cell: (info) => <PlanBadge plan={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'status',
        header: () => t('ateliers.col.status'),
        cell: (info) => <StatusBadge status={tenantRowStatus(info.row.original)} />,
      }),
      columnHelper.display({
        id: 'created',
        header: () => t('ateliers.col.created'),
        cell: (info) => (
          <span className="text-sm text-gray-500">
            {formatTenantDate(info.row.original.created_at)}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('ateliers.col.actions'),
        cell: (info) => {
          const row = info.row.original;
          const busy = togglingId === row.id;
          return (
            <div className="flex items-center gap-0.5">
              <ActionIconButton
                icon="ri-eye-line"
                label={t('actions.view')}
                onClick={() => onViewDetails(row)}
              />
              <ActionIconButton
                icon="ri-edit-line"
                label={t('actions.edit')}
                variant="default"
                onClick={() => onEdit(row)}
              />
              <ActionIconButton
                icon={busy ? 'ri-loader-4-line' : row.is_active ? 'ri-pause-circle-line' : 'ri-play-circle-line'}
                label={row.is_active ? t('actions.suspend') : t('actions.activate')}
                variant="warning"
                disabled={busy}
                spinIcon={busy}
                onClick={() => void handleToggleActive(row)}
              />
            </div>
          );
        },
      }),
    ],
    [t, onViewDetails, onEdit, togglingId, handleToggleActive],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filters: { value: FilterType; labelKey: string }[] = [
    { value: 'all', labelKey: 'ateliers.filter.all' },
    { value: 'active', labelKey: 'ateliers.filter.active' },
    { value: 'suspended', labelKey: 'ateliers.filter.suspended' },
    { value: 'trial', labelKey: 'ateliers.filter.trial' },
  ];

  const showingFrom = total === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, total);

  return (
    <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === f.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
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
            <input
              type="text"
              placeholder={t('ateliers.search_placeholder')}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-48 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            {t('ateliers.add_atelier')}
          </button>
        </div>
      </div>

      {loadError && (
        <div className="px-5 py-3 bg-rose-50 text-rose-700 text-sm border-b border-rose-100">
          {loadError}
        </div>
      )}

      <div className="overflow-x-auto min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
            <i className="ri-loader-4-line animate-spin text-xl" />
            <span className="text-sm">{t('ateliers.loading')}</span>
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
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          {t('table.showing')} {showingFrom}–{showingTo} {t('table.of')} {total}{' '}
          {t('table.ateliers_count')}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
          <span className="text-sm text-gray-600 tabular-nums px-2">
            {page} / {lastPage}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page >= lastPage || loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line" />
          </button>
        </div>
      </div>
    </div>
  );
}
