import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type AdminRole, ALL_PERMISSIONS } from '../../../mocks/adminRoles';

const PERMISSION_GROUPS = [
  { key: 'dashboard',      icon: 'ri-dashboard-line',           perms: ['view_dashboard'] },
  { key: 'ateliers',       icon: 'ri-store-2-line',             perms: ['view_ateliers','add_atelier','edit_atelier','suspend_atelier','delete_atelier','login_as_atelier'] },
  { key: 'subscriptions',  icon: 'ri-file-list-3-line',         perms: ['view_subscriptions','edit_subscription','cancel_subscription','renew_subscription'] },
  { key: 'payments',       icon: 'ri-bank-card-line',           perms: ['view_payments','refund_payment','mark_paid'] },
  { key: 'plans',          icon: 'ri-price-tag-3-line',         perms: ['view_plans','add_plan','edit_plan','delete_plan'] },
  { key: 'flags',          icon: 'ri-toggle-line',              perms: ['view_flags','edit_flags'] },
  { key: 'support',        icon: 'ri-customer-service-2-line',  perms: ['view_tickets','reply_ticket','close_ticket'] },
  { key: 'users',          icon: 'ri-team-line',                perms: ['view_users','add_user','edit_user','delete_user'] },
  { key: 'reports',        icon: 'ri-bar-chart-line',           perms: ['view_reports','export_reports'] },
  { key: 'settings',       icon: 'ri-settings-3-line',          perms: ['view_settings','edit_settings'] },
  { key: 'notifs',         icon: 'ri-notification-3-line',      perms: ['view_notifications','send_notifications'] },
  { key: 'logs',           icon: 'ri-file-text-line',           perms: ['view_logs'] },
];

export const COLORS = ['teal', 'emerald', 'amber', 'rose', 'orange', 'green', 'pink'] as const;
export type RoleColor = typeof COLORS[number];

export const colorCfg: Record<RoleColor, { bg: string; light: string; text: string; dot: string }> = {
  teal:    { bg: 'bg-teal-600',    light: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500'    },
  emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  amber:   { bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  rose:    { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500'    },
  orange:  { bg: 'bg-orange-500',  light: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  green:   { bg: 'bg-green-600',   light: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-500'   },
  pink:    { bg: 'bg-pink-500',    light: 'bg-pink-50',    text: 'text-pink-600',    dot: 'bg-pink-500'    },
};

interface RoleFormModalProps {
  role: AdminRole | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AdminRole, 'id' | 'usersCount' | 'createdAt'>) => void;
}

export default function RoleFormModal({ role, isOpen, onClose, onSave }: RoleFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!role;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<RoleColor>('teal');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name); setDescription(role.description);
      setColor((role.color as RoleColor) || 'teal');
      setSelected(new Set(role.permissions));
    } else {
      setName(''); setDescription(''); setColor('teal'); setSelected(new Set());
    }
    setNameError('');
  }, [role, isOpen]);

  const togglePerm = (perm: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm); else next.add(perm);
      return next;
    });
  };

  const toggleGroup = (perms: string[]) => {
    const allOn = perms.every((p) => selected.has(p));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOn) perms.forEach((p) => next.delete(p));
      else perms.forEach((p) => next.add(p));
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === ALL_PERMISSIONS.length) setSelected(new Set());
    else setSelected(new Set(ALL_PERMISSIONS));
  };

  const handleSave = () => {
    if (!name.trim()) { setNameError('Role name is required'); return; }
    onSave({ name: name.trim(), description: description.trim(), color, isSystem: false, permissions: [...selected] });
    onClose();
  };

  if (!isOpen) return null;

  const cc = colorCfg[color];
  const isAllSelected = selected.size === ALL_PERMISSIONS.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-5xl my-6 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${cc.light}`}>
              <i className={`ri-shield-user-line ${cc.text}`} />
            </div>
            <h3 className="text-base font-bold text-gray-900">{isEdit ? t('admin_roles.form.title_edit') : t('admin_roles.form.title_add')}</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-5 items-start">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('admin_roles.form.name')}</label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setNameError(''); }}
                placeholder={t('admin_roles.form.name_placeholder')}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all ${nameError ? 'border-rose-400' : 'border-gray-200'}`} />
              {nameError && <p className="text-xs text-rose-500 mt-1">{nameError}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('admin_roles.form.description')}</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder={t('admin_roles.form.description_placeholder')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('admin_roles.form.color')}</label>
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-all ${colorCfg[c].bg} ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-800">{t('admin_roles.form.permissions_title')}</h4>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cc.light} ${cc.text}`}>
                  {selected.size} / {ALL_PERMISSIONS.length} {t('admin_roles.permissions_count')}
                </span>
                <button type="button" onClick={toggleAll}
                  className="text-xs font-medium text-gray-500 hover:text-teal-600 cursor-pointer transition-colors">
                  {isAllSelected ? t('admin_roles.deselect_all') : t('admin_roles.select_all')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto pe-1">
              {PERMISSION_GROUPS.map((group) => {
                const enabledCount = group.perms.filter((p) => selected.has(p)).length;
                const allGroupOn = enabledCount === group.perms.length;
                return (
                  <div key={group.key} className={`rounded-xl border-2 overflow-hidden transition-colors ${enabledCount > 0 ? `border-gray-200 ${cc.light}` : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/60">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 flex items-center justify-center ${enabledCount > 0 ? cc.text : 'text-gray-400'}`}>
                          <i className={`${group.icon} text-sm`} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{t(`admin_roles.groups.${group.key}`)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">{enabledCount}/{group.perms.length}</span>
                        <div onClick={() => toggleGroup(group.perms)}
                          className={`w-8 h-4 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${allGroupOn ? cc.bg : 'bg-gray-200'}`}>
                          <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${allGroupOn ? 'start-4' : 'start-0.5'}`} />
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 space-y-1.5">
                      {group.perms.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={selected.has(perm)} onChange={() => togglePerm(perm)}
                            className="w-3.5 h-3.5 rounded accent-teal-600 cursor-pointer" />
                          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                            {t(`admin_roles.perms.${perm}`)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            {t('admin_roles.form.cancel')}
          </button>
          <button type="button" onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors ${cc.bg} hover:opacity-90`}>
            {t('admin_roles.form.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
