import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usersData, type AdminUser, type UserRole, type UserStatus } from '../../../mocks/users';
import ConfirmModal from '../../../components/base/ConfirmModal';
import UserFormModal from './UserFormModal';

type FilterKey = 'all' | UserStatus;

const roleConfig: Record<UserRole, { label: string; classes: string }> = {
  super_admin: { label: 'Super Admin',    classes: 'bg-teal-50 text-teal-700' },
  admin:       { label: 'Admin',          classes: 'bg-emerald-50 text-emerald-700' },
  support:     { label: 'Support',        classes: 'bg-amber-50 text-amber-700' },
  finance:     { label: 'Finance',        classes: 'bg-green-50 text-green-700' },
  content:     { label: 'Content',        classes: 'bg-rose-50 text-rose-600' },
};

type ConfirmType = 'delete' | 'suspend' | 'activate';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>(usersData);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch]  = useState('');
  const [formModal, setFormModal] = useState<{ open: boolean; user: AdminUser | null }>({ open: false, user: null });
  const [confirm, setConfirm]  = useState<{ type: ConfirmType; userId: string } | null>(null);

  const filtered = useMemo(() => {
    let res = filter === 'all' ? users : users.filter((u) => u.status === filter);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q));
    }
    return res;
  }, [users, filter, search]);

  const counts = useMemo(() => ({
    total:     users.length,
    active:    users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    roles:     new Set(users.map((u) => u.role)).size,
  }), [users]);

  const handleSave = (data: Omit<AdminUser, 'id' | 'initials' | 'avatarColor' | 'lastLogin' | 'createdAt'>) => {
    if (formModal.user) {
      setUsers((prev) => prev.map((u) => u.id === formModal.user!.id ? { ...u, ...data } : u));
    } else {
      const colors = ['bg-teal-600', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-500', 'bg-orange-500'];
      const newUser: AdminUser = {
        id: `u${Date.now()}`, ...data,
        initials: data.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        lastLogin: '—',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [newUser, ...prev]);
    }
  };

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === 'delete') {
      setUsers((prev) => prev.filter((u) => u.id !== confirm.userId));
    } else {
      const newStatus: UserStatus = confirm.type === 'activate' ? 'active' : 'suspended';
      setUsers((prev) => prev.map((u) => u.id === confirm.userId ? { ...u, status: newStatus } : u));
    }
  };

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: 'all',       labelKey: 'users.filter.all'       },
    { key: 'active',    labelKey: 'users.filter.active'    },
    { key: 'suspended', labelKey: 'users.filter.suspended' },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('users.summary.total'),     value: counts.total,     icon: 'ri-team-line',            bg: 'bg-teal-50 text-teal-600'    },
            { label: t('users.summary.active'),    value: counts.active,    icon: 'ri-user-follow-line',     bg: 'bg-emerald-50 text-emerald-600' },
            { label: t('users.summary.suspended'), value: counts.suspended, icon: 'ri-user-forbid-line',     bg: 'bg-rose-50 text-rose-500'    },
            { label: t('users.summary.roles'),     value: counts.roles,     icon: 'ri-shield-user-line',     bg: 'bg-amber-50 text-amber-500'  },
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

        {/* Table */}
        <div className="bg-white rounded-xl ring-1 ring-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {filters.map((f) => (
                <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${filter === f.key ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-4 h-4 flex items-center justify-center absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <i className="ri-search-line text-xs" />
                </div>
                <input type="text" placeholder={t('users.search_placeholder')} value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-52 ps-8 pe-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
              </div>
              <button type="button" onClick={() => setFormModal({ open: true, user: null })}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
                <i className="ri-user-add-line" />{t('users.add_user')}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  {['col.member', 'col.role', 'col.status', 'col.last_login', 'col.created', 'col.actions'].map((key) => (
                    <th key={key} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {t(`users.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <i className="ri-team-line text-4xl" />
                      <p className="text-sm font-medium">{t('users.no_users')}</p>
                    </div>
                  </td></tr>
                ) : filtered.map((user) => {
                  const rc = roleConfig[user.role];
                  const isSuper = user.role === 'super_admin';
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Member */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 flex items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0 ${user.avatarColor}`}>
                            {user.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rc.classes}`}>
                          {t(`users.roles.${user.role}`)}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {t(`status.${user.status}`)}
                        </span>
                      </td>
                      {/* Last Login */}
                      <td className="px-4 py-3"><span className="text-sm text-gray-500">{user.lastLogin}</span></td>
                      {/* Created */}
                      <td className="px-4 py-3"><span className="text-sm text-gray-500">{user.createdAt}</span></td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setFormModal({ open: true, user })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors" title={t('actions.edit')}>
                            <i className="ri-pencil-line text-sm" />
                          </button>
                          {user.status === 'active' ? (
                            <button type="button" onClick={() => !isSuper && setConfirm({ type: 'suspend', userId: user.id })}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isSuper ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:bg-amber-50 hover:text-amber-600'}`}
                              title={isSuper ? 'Cannot suspend Super Admin' : t('actions.suspend')}>
                              <i className="ri-user-forbid-line text-sm" />
                            </button>
                          ) : (
                            <button type="button" onClick={() => setConfirm({ type: 'activate', userId: user.id })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors" title={t('actions.activate')}>
                              <i className="ri-user-follow-line text-sm" />
                            </button>
                          )}
                          <button type="button" onClick={() => !isSuper && setConfirm({ type: 'delete', userId: user.id })}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isSuper ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:bg-rose-50 hover:text-rose-500'}`}
                            title={isSuper ? 'Cannot delete Super Admin' : t('actions.delete')}>
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <UserFormModal
        isOpen={formModal.open}
        user={formModal.user}
        onClose={() => setFormModal({ open: false, user: null })}
        onSave={handleSave}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirm}
        title={confirm?.type === 'delete' ? t('actions.delete') : confirm?.type === 'suspend' ? t('actions.suspend') : t('actions.activate')}
        message={confirm?.type === 'delete' ? t('users.confirm_delete') : confirm?.type === 'suspend' ? t('users.confirm_suspend') : t('users.confirm_activate')}
        confirmLabel={confirm?.type === 'delete' ? t('actions.delete') : confirm?.type === 'suspend' ? t('actions.suspend') : t('actions.activate')}
        confirmVariant={confirm?.type === 'delete' ? 'danger' : confirm?.type === 'suspend' ? 'warning' : 'success'}
        onConfirm={handleConfirm}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}
