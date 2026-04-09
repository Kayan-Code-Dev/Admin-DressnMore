import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../components/base/ConfirmDialog';
import AdminLayout from '../../components/feature/AdminLayout';
import AteliersTable from './components/AteliersTable';
import CreateTenantModal from './components/CreateTenantModal';
import StatusBadge from '../../components/base/StatusBadge';
import {
  fetchTenant,
  toggleTenantActive,
  addTenantDomain,
  deleteTenantDomain,
  migrateTenant,
  seedTenant,
  deleteTenant,
} from '../../api/tenants.api';
import { resolveTenantPortalUrl } from '../../config/tenantPortal.config';
import { isBackendDomainSlug } from '../../lib/tenant.utils';
import { tenantRowStatus, formatTenantDate } from '../../lib/tenant.utils';
import type { Tenant } from '../../types/tenant.types';

function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0] ?? ''}${p[1][0] ?? ''}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || '—';
}

export default function AteliersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Tenant | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTick, setDetailTick] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [listVersion, setListVersion] = useState(0);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [domainBusy, setDomainBusy] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [deletingDomainId, setDeletingDomainId] = useState<number | null>(null);
  const [migrateBusy, setMigrateBusy] = useState(false);
  const [seedBusy, setSeedBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toolsError, setToolsError] = useState('');
  const detailFetchIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      setDetailLoading(false);
      detailFetchIdRef.current = null;
      return;
    }
    const switchedTenant = detailFetchIdRef.current !== selectedId;
    detailFetchIdRef.current = selectedId;
    if (switchedTenant) {
      setDetail(null);
    }
    let cancelled = false;
    setDetailLoading(true);
    fetchTenant(selectedId).then((r) => {
      if (cancelled) return;
      setDetailLoading(false);
      if (r.ok) setDetail(r.tenant);
      else setDetail(null);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId, detailTick]);

  useEffect(() => {
    setNewDomain('');
    setDomainError('');
    setDeletingDomainId(null);
    setToolsError('');
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) setDeleteConfirmOpen(false);
  }, [selectedId]);

  const bumpList = () => setListVersion((v) => v + 1);

  const handleToggleFromDetail = async () => {
    if (!selected?.id) return;
    setToggleBusy(true);
    const result = await toggleTenantActive(selected.id);
    setToggleBusy(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      return;
    }
    bumpList();
    setDetailTick((x) => x + 1);
  };

  const handleAddDomain = async () => {
    if (!selected?.id) return;
    const slug = newDomain.trim();
    if (!slug) {
      setDomainError(t('ateliers.modal.domain_required'));
      return;
    }
    setDomainError('');
    setDomainBusy(true);
    const result = await addTenantDomain(selected.id, slug);
    setDomainBusy(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setDomainError(result.message);
      return;
    }
    setNewDomain('');
    bumpList();
    setDetailTick((x) => x + 1);
  };

  const handleDeleteDomain = async (domainId: number) => {
    if (!selected?.id) return;
    setDeletingDomainId(domainId);
    const result = await deleteTenantDomain(selected.id, domainId);
    setDeletingDomainId(null);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setDomainError(result.message);
      return;
    }
    setDomainError('');
    bumpList();
    setDetailTick((x) => x + 1);
  };

  const handleMigrate = async () => {
    if (!selected?.id) return;
    setToolsError('');
    setMigrateBusy(true);
    const result = await migrateTenant(selected.id);
    setMigrateBusy(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setToolsError(result.message);
      return;
    }
    bumpList();
    setDetailTick((x) => x + 1);
  };

  const handleSeed = async () => {
    if (!selected?.id) return;
    setToolsError('');
    setSeedBusy(true);
    const result = await seedTenant(selected.id);
    setSeedBusy(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setToolsError(result.message);
      return;
    }
    bumpList();
    setDetailTick((x) => x + 1);
  };

  const handleDeleteTenantConfirm = async () => {
    if (!selected?.id) return;
    setToolsError('');
    setDeleteBusy(true);
    const result = await deleteTenant(selected.id);
    setDeleteBusy(false);
    if (result.ok === false) {
      if (result.unauthorized) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setToolsError(result.message);
      setDeleteConfirmOpen(false);
      return;
    }
    setDeleteConfirmOpen(false);
    setSelectedId(null);
    bumpList();
  };

  const selected = detail;

  return (
    <AdminLayout>
      <AteliersTable
        listVersion={listVersion}
        onAdd={() => setCreateOpen(true)}
        onViewDetails={(row) => setSelectedId(row.id)}
        onTenantMutated={() => setDetailTick((x) => x + 1)}
      />

      <CreateTenantModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={bumpList}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title={t('ateliers.modal.delete_confirm_title')}
        description={t('ateliers.modal.delete_tenant_confirm', {
          name: selected?.name ?? '—',
        })}
        confirmLabel={t('ateliers.modal.delete_confirm_action')}
        cancelLabel={t('ateliers.create.cancel')}
        loading={deleteBusy}
        onClose={() => !deleteBusy && setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteTenantConfirm}
        variant="danger"
      />

      {selectedId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-gray-900">{t('ateliers.modal.title')}</h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {detailLoading || !selected ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                <i className="ri-loader-4-line animate-spin text-2xl" />
                <span className="text-sm">{t('ateliers.loading')}</span>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-teal-100 text-teal-700 text-xl font-bold flex items-center justify-center flex-shrink-0">
                      {initials(selected.name)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{selected.name}</h4>
                      <p className="text-sm text-gray-500">{selected.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <StatusBadge status={tenantRowStatus(selected)} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        label: t('ateliers.modal.tenant_id'),
                        value: selected.id,
                        icon: 'ri-fingerprint-line',
                      },
                      {
                        label: t('ateliers.modal.phone'),
                        value: selected.phone?.trim() || '—',
                        icon: 'ri-phone-line',
                      },
                      {
                        label: t('ateliers.modal.created'),
                        value: formatTenantDate(selected.created_at),
                        icon: 'ri-calendar-line',
                      },
                      {
                        label: t('ateliers.modal.updated'),
                        value: formatTenantDate(selected.updated_at),
                        icon: 'ri-time-line',
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded-xl p-3 sm:col-span-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <i className={`${item.icon} text-xs text-gray-400`} />
                          <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 break-all">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <i className="ri-global-line text-xs text-gray-400" />
                      <p className="text-xs text-gray-400 font-medium">{t('ateliers.modal.domain')}</p>
                    </div>
                    {!selected.domains?.length ? (
                      <p className="text-sm text-gray-500 py-1">—</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {selected.domains.map((d) => {
                          const portalUrl = resolveTenantPortalUrl(d.domain);
                          const kind = isBackendDomainSlug(d.domain) ? 'backend' : 'storefront';
                          return (
                          <li
                            key={d.id}
                            className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                          >
                            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                {t(`ateliers.modal.domain_kind_${kind}`)}
                              </span>
                              {portalUrl ? (
                                <a
                                  href={portalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-sm text-teal-600 hover:text-teal-700 hover:underline break-all"
                                >
                                  {portalUrl}
                                </a>
                              ) : (
                                <span className="font-mono text-sm text-gray-800 break-all">{d.domain}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={deletingDomainId === d.id}
                              onClick={() => void handleDeleteDomain(d.id)}
                              title={t('ateliers.modal.domain_delete')}
                              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 cursor-pointer transition-colors"
                            >
                              {deletingDomainId === d.id ? (
                                <i className="ri-loader-4-line animate-spin text-base" />
                              ) : (
                                <i className="ri-delete-bin-line text-base" />
                              )}
                            </button>
                          </li>
                          );
                        })}
                      </ul>
                    )}
                    {domainError && (
                      <p className="text-xs text-rose-600 mt-2">{domainError}</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {t('ateliers.modal.add_domain')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newDomain}
                        onChange={(e) => {
                          setNewDomain(e.target.value);
                          setDomainError('');
                        }}
                        placeholder={t('ateliers.modal.domain_placeholder')}
                        autoComplete="off"
                        className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white font-mono"
                      />
                      <button
                        type="button"
                        disabled={domainBusy}
                        onClick={() => void handleAddDomain()}
                        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {domainBusy ? (
                          <i className="ri-loader-4-line animate-spin" />
                        ) : (
                          <i className="ri-add-line" />
                        )}
                        {t('ateliers.modal.domain_submit')}
                      </button>
                    </div>
                  </div>
                </div>

                {toolsError && (
                  <div className="px-6 pb-2">
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                      {toolsError}
                    </p>
                  </div>
                )}

                <div className="px-6 pb-3 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    disabled={migrateBusy || seedBusy || deleteBusy}
                    onClick={() => void handleMigrate()}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {migrateBusy ? (
                      <i className="ri-loader-4-line animate-spin" />
                    ) : (
                      <i className="ri-database-2-line" />
                    )}
                    {t('ateliers.modal.migrate')}
                  </button>
                  <button
                    type="button"
                    disabled={migrateBusy || seedBusy || deleteBusy}
                    onClick={() => void handleSeed()}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {seedBusy ? (
                      <i className="ri-loader-4-line animate-spin" />
                    ) : (
                      <i className="ri-seedling-line" />
                    )}
                    {t('ateliers.modal.seed')}
                  </button>
                  <button
                    type="button"
                    disabled={migrateBusy || seedBusy || deleteBusy}
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <i className="ri-delete-bin-line" />
                    {t('ateliers.modal.delete_tenant')}
                  </button>
                </div>

                <div className="px-6 pb-5 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={toggleBusy || migrateBusy || seedBusy || deleteBusy}
                    onClick={() => void handleToggleFromDetail()}
                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                      selected.is_active
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {toggleBusy ? (
                      <i className="ri-loader-4-line animate-spin" />
                    ) : (
                      <i className={selected.is_active ? 'ri-pause-circle-line' : 'ri-play-circle-line'} />
                    )}
                    {selected.is_active ? t('actions.suspend') : t('actions.activate')}
                  </button>
                  <button
                    type="button"
                    disabled={migrateBusy || seedBusy || deleteBusy}
                    onClick={() => setSelectedId(null)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
