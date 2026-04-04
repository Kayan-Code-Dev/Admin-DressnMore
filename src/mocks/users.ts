export type UserRole = 'super_admin' | 'admin' | 'support' | 'finance' | 'content';
export type UserStatus = 'active' | 'suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  initials: string;
  avatarColor: string;
  lastLogin: string;
  createdAt: string;
}

export const usersData: AdminUser[] = [
  { id: 'u1', name: 'Abdulrahman Al-Saud', email: 'abdulrahman@dressnmore.sa', role: 'super_admin', status: 'active', initials: 'AA', avatarColor: 'bg-teal-600', lastLogin: '2026-03-20 09:30', createdAt: '2025-01-01' },
  { id: 'u2', name: 'Noura Al-Ghamdi', email: 'noura@dressnmore.sa', role: 'admin', status: 'active', initials: 'NG', avatarColor: 'bg-emerald-600', lastLogin: '2026-03-20 08:15', createdAt: '2025-02-10' },
  { id: 'u3', name: 'Khalid Bin Salam', email: 'khalid@dressnmore.sa', role: 'support', status: 'active', initials: 'KB', avatarColor: 'bg-amber-500', lastLogin: '2026-03-19 17:45', createdAt: '2025-03-05' },
  { id: 'u4', name: 'Fatima Al-Zahrani', email: 'fatima@dressnmore.sa', role: 'finance', status: 'active', initials: 'FZ', avatarColor: 'bg-rose-500', lastLogin: '2026-03-19 14:20', createdAt: '2025-03-12' },
  { id: 'u5', name: 'Omar Bin Hasan', email: 'omar@dressnmore.sa', role: 'admin', status: 'active', initials: 'OH', avatarColor: 'bg-teal-500', lastLogin: '2026-03-18 11:00', createdAt: '2025-04-01' },
  { id: 'u6', name: 'Sara Al-Otaibi', email: 'sara@dressnmore.sa', role: 'content', status: 'active', initials: 'SO', avatarColor: 'bg-pink-500', lastLogin: '2026-03-17 16:30', createdAt: '2025-04-15' },
  { id: 'u7', name: 'Mohammed Al-Qahtani', email: 'mq@dressnmore.sa', role: 'support', status: 'suspended', initials: 'MQ', avatarColor: 'bg-gray-400', lastLogin: '2026-02-28 10:00', createdAt: '2025-05-20' },
  { id: 'u8', name: 'Layla Bin Rashid', email: 'layla@dressnmore.sa', role: 'finance', status: 'active', initials: 'LR', avatarColor: 'bg-orange-500', lastLogin: '2026-03-20 07:50', createdAt: '2025-06-01' },
];
