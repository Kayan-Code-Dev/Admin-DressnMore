import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type AdminUser, type UserRole } from '../../../mocks/users';

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all bg-white';

const ROLES: UserRole[] = ['super_admin', 'admin', 'support', 'finance', 'content'];

const roleColors: Record<UserRole, string> = {
  super_admin: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  admin:       'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  support:     'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  finance:     'bg-green-50 text-green-700 ring-1 ring-green-200',
  content:     'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
};

interface FormState {
  name: string; email: string; role: UserRole; password: string; active: boolean;
}

interface UserFormModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AdminUser, 'id' | 'initials' | 'avatarColor' | 'lastLogin' | 'createdAt'> & { password?: string }) => void;
}

export default function UserFormModal({ user, isOpen, onClose, onSave }: UserFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!user;

  const [form, setForm] = useState<FormState>({
    name: user?.name ?? '', email: user?.email ?? '',
    role: user?.role ?? 'support', password: '',
    active: user ? user.status === 'active' : true,
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!isEdit && !form.password.trim()) e.password = 'Required for new admin';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ name: form.name, email: form.email, role: form.role, status: form.active ? 'active' : 'suspended', password: form.password || undefined });
    onClose();
  };

  if (!isOpen) return null;

  const selectedRoleColor = roleColors[form.role];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-teal-50">
              <i className="ri-user-settings-line text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {isEdit ? t('users.form.title_edit') : t('users.form.title_add')}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('users.form.name')}</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder={t('users.form.name_placeholder')} className={`${inputCls} ${errors.name ? 'border-rose-400' : ''}`} />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('users.form.email')}</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder={t('users.form.email_placeholder')} className={`${inputCls} ${errors.email ? 'border-rose-400' : ''}`} />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('users.form.role')}</label>
            <div className="grid grid-cols-5 gap-2">
              {ROLES.map((r) => (
                <button key={r} type="button" onClick={() => set('role', r)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border-2 ${
                    form.role === r ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}>
                  {t(`users.roles.${r}`)}
                </button>
              ))}
            </div>
            <p className={`text-xs mt-2 px-3 py-2 rounded-lg font-medium ${selectedRoleColor}`}>
              <i className="ri-shield-check-line me-1.5" />{t(`users.role_desc.${form.role}`)}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {isEdit ? t('users.form.password_edit') : t('users.form.password')}
            </label>
            {isEdit && <p className="text-xs text-gray-400 mb-1.5">{t('users.form.password_hint')}</p>}
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className={`${inputCls} pe-10 ${errors.password ? 'border-rose-400' : ''}`} />
              <button type="button" onClick={() => setShowPass((s) => !s)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <i className={`${showPass ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-800">{t('users.form.active')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{form.active ? 'User can login and access the dashboard' : 'User account is suspended'}</p>
            </div>
            <div onClick={() => set('active', !form.active)}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${form.active ? 'bg-teal-600' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.active ? 'start-5' : 'start-0.5'}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            {t('users.form.cancel')}
          </button>
          <button type="button" onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 cursor-pointer whitespace-nowrap transition-colors">
            {t('users.form.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
