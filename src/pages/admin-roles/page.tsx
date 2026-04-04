import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminRolesData, type AdminRole, ALL_PERMISSIONS } from '../../mocks/adminRoles';
import RoleFormModal, { colorCfg, type RoleColor } from './components/RoleFormModal';
import ConfirmModal from '../../components/base/ConfirmModal';
import AdminLayout from '../../components/feature/AdminLayout';

const PERMISSION_GROUPS = [
  { key: 'dashboard',     icon: 'ri-dashboard-line',           perms: ['view_dashboard'] },
  { key: 'ateliers',      icon: 'ri-store-2-line',             perms: ['view_ateliers','add_atelier','edit_atelier','suspend_atelier','delete_atelier','login_as_atelier'] },
  { key: 'subscriptions', icon: 'ri-file-list-3-line',         perms: ['view_subscriptions','edit_subscription','cancel_subscription','renew_subscription'] },
  { key: 'payments',      icon: 'ri-bank-card-line',           perms: ['view_payments','refund_payment','mark_paid'] },
  { key: 'plans',         icon: 'ri-price-tag-3-line',         perms: ['view_plans','add_plan','edit_plan','delete_plan'] },
  { key: 'flags',         icon: 'ri-toggle-line',              perms: ['view_flags','edit_flags'] },
  { key: 'support',       icon: 'ri-customer-service-2-line',  perms: ['view_tickets','reply_ticket','close_ticket'] },
  { key: 'users',         icon: 'ri-team-line',                perms: ['view_users','add_user','edit_user','delete_user'] },
  { key: 'reports',       icon: 'ri-bar-chart-line',           perms: ['view_reports','export_reports'] },
  { key: 'settings',      icon: 'ri-settings-3-line',          perms: ['view_settings','edit_settings'] },
  { key: 'notifs',        icon: 'ri-notification-3-line',      perms: ['view_notifications','send_notifications'] },
  { key: 'logs',          icon: 'ri-file-text-line',           perms: ['view_logs'] },
];

export default function AdminRolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<AdminRole[]>(adminRolesData);
  const [selectedId, setSelectedId] = useState<string>(adminRolesData[0]?.id ?? '');
  const [formModal, setFormModal] = useState<{ open: boolean; role: AdminRole | null }>({ open: false, role: null });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = roles.find((r) => r.id === selectedId) ?? roles[0];

  const handleSave = (data: Omit<AdminRole, 'id' | 'usersCount' | 'createdAt'>) => {
    if (formModal.role) {
      setRoles((prev) => prev.map((r) => r.id === formModal.role!.id ? { ...r, ...data } : r));
    } else {
      const newRole: AdminRole = { id: `r${Date.now()}`, ...data, usersCount: 0, createdAt: new Date().toISOString().slice(0, 10) };
      setRoles((prev) => [...prev, newRole]);
      setSelectedId(newRole.id);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setRoles((prev) => prev.filter((r) => r.id !== deleteId));
    if (selectedId === deleteId) setSelectedId(roles.find((r) => r.id !== deleteId)?.id ?? '');
  };

  const cc = selected ? colorCfg[(selected.color as RoleColor) || 'teal'] : colorCfg.teal;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        {/* Summary Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Roles',    value: roles.length,                                    icon: 'ri-shield-user-line',  bg: 'bg-teal-50 text-teal-600'    },
            { label: 'System Roles',   value: roles.filter((r) => r.isSystem).length,           icon: 'ri-lock-line',         bg: 'bg-amber-50 text-amber-600'  },
            { label: 'Custom Roles',   value: roles.filter((r) => !r.isSystem).length,          icon: 'ri-user-settings-line',bg: 'bg-emerald-50 text-emerald-600' },
            { label: 'Total Perms',    value: ALL_PERMISSIONS.length,                           icon: 'ri-key-2-line',        bg: 'bg-rose-50 text-rose-500'    },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-xl p-4 ring-1 ring-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${c.bg}`}>
                <i className={`${c.icon} text-lg`} />
              </div>
              <div><p className="text-xs text-gray-400 font-medium">{c.label}</p><p className="text-xl font-bold text-gray-900">{c.value}</p></div>
            </div>
          ))}
        </div>

        {/* Main 2-Panel Layout */}
        <div className="flex gap-5 items-start">
          {/* Left: Roles List */}
          <div className="w-72 flex-shrink-0 flex flex-col gap-3">
            <button type="button" onClick={() => setFormModal({ open: true, role: null })}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-teal-300 text-teal-600 text-sm font-semibold hover:bg-teal-50 cursor-pointer transition-colors">
              <i className="ri-add-line" />{t('admin_roles.add_role')}
            </button>

            {roles.map((role) => {
              const c = colorCfg[(role.color as RoleColor) || 'teal'];
              const isSelected = role.id === selectedId;
              return (
                <div key={role.id} onClick={() => setSelectedId(role.id)}
                  className={`bg-white rounded-xl ring-1 cursor-pointer transition-all overflow-hidden ${isSelected ? 'ring-2 ring-teal-400' : 'ring-gray-100 hover:ring-gray-200'}`}>
                  <div className="flex items-stretch">
                    <div className={`w-1.5 flex-shrink-0 ${c.bg}`} />
                    <div className="flex-1 px-4 py-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{role.name}</p>
                            {role.isSystem && (
                              <span className="text-xs font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                                {t('admin_roles.system_role')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>
                          {role.permissions.length} {t('admin_roles.permissions_count')}
                        </span>
                        <span className="text-xs text-gray-400">{role.usersCount} {t('admin_roles.users_using')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Permissions Detail */}
          {selected && (
            <div className="flex-1 min-w-0 bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
              {/* Role Header */}
              <div className={`px-6 py-5 border-b border-gray-100 flex items-center justify-between ${cc.light}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${cc.bg} text-white`}>
                    <i className="ri-shield-user-line text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">{selected.name}</h3>
                      {selected.isSystem && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-white/70 text-gray-600 rounded-full border border-gray-200">
                          {t('admin_roles.system_role')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{selected.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-xs font-semibold ${cc.text}`}>{selected.permissions.length} / {ALL_PERMISSIONS.length} {t('admin_roles.permissions_count')}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{selected.usersCount} {t('admin_roles.users_using')}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{selected.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!selected.isSystem && (
                    <>
                      <button type="button" onClick={() => setFormModal({ open: true, role: selected })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
                        <i className="ri-pencil-line" />{t('actions.edit')}
                      </button>
                      <button type="button" onClick={() => setDeleteId(selected.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-rose-500 text-sm font-medium rounded-xl border border-rose-200 hover:bg-rose-50 cursor-pointer whitespace-nowrap transition-colors">
                        <i className="ri-delete-bin-line" />{t('actions.delete')}
                      </button>
                    </>
                  )}
                  {selected.isSystem && (
                    <span className="text-xs text-gray-400 px-3 py-2 bg-white/60 rounded-lg border border-gray-200">
                      <i className="ri-lock-line me-1" />{t('admin_roles.system_role_desc')}
                    </span>
                  )}
                </div>
              </div>

              {/* Permission Groups Grid */}
              <div className="p-5 grid grid-cols-3 gap-3">
                {PERMISSION_GROUPS.map((group) => {
                  const enabledPerms = group.perms.filter((p) => selected.permissions.includes(p));
                  const hasAny = enabledPerms.length > 0;
                  return (
                    <div key={group.key} className={`rounded-xl overflow-hidden ring-1 ${hasAny ? `ring-gray-200 ${cc.light}` : 'ring-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/60">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 flex items-center justify-center ${hasAny ? cc.text : 'text-gray-300'}`}>
                            <i className={`${group.icon} text-sm`} />
                          </div>
                          <span className={`text-xs font-bold ${hasAny ? 'text-gray-800' : 'text-gray-400'}`}>
                            {t(`admin_roles.groups.${group.key}`)}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold ${hasAny ? cc.text : 'text-gray-400'}`}>
                          {enabledPerms.length}/{group.perms.length}
                        </span>
                      </div>
                      <div className="px-3 py-2 space-y-1.5">
                        {group.perms.map((perm) => {
                          const on = selected.permissions.includes(perm);
                          return (
                            <div key={perm} className="flex items-center gap-2">
                              <div className={`w-3.5 h-3.5 flex items-center justify-center rounded-full flex-shrink-0 ${on ? cc.bg : 'bg-gray-200'}`}>
                                {on && <i className="ri-check-line text-white text-xs" style={{ fontSize: '8px' }} />}
                              </div>
                              <span className={`text-xs ${on ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                                {t(`admin_roles.perms.${perm}`)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <RoleFormModal
        role={formModal.role} isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, role: null })} onSave={handleSave}
      />
      <ConfirmModal
        isOpen={!!deleteId}
        title={t('admin_roles.delete_role') || 'Delete Role'}
        message={t('admin_roles.confirm_delete')}
        confirmLabel={t('actions.delete')}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
