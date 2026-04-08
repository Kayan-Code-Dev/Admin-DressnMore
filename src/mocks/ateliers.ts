import { avatarPlaceholderUrl } from '../config/branding';

export type AtelierStatus = 'active' | 'suspended' | 'pending' | 'trial';
export type AtelierPlan = 'Starter' | 'Pro' | 'Enterprise';

export interface Atelier {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  plan: AtelierPlan;
  status: AtelierStatus;
  employees: number;
  branches: number;
  createdAt: string;
  renewalDate: string;
  monthlyRevenue: number;
  avatar: string;
}

export const ateliersData: Atelier[] = [
  { id: 'AT-001', name: 'Elegance Studio', owner: 'Ahmed Al-Rashidi', email: 'ahmed@elegance.com', phone: '+966 50 111 2233', plan: 'Enterprise', status: 'active', employees: 24, branches: 3, createdAt: '2024-06-12', renewalDate: '2027-06-12', monthlyRevenue: 299, avatar: avatarPlaceholderUrl },
  { id: 'AT-002', name: 'Couture House', owner: 'Sara Khalil', email: 'sara@couturehouse.sa', phone: '+966 55 222 3344', plan: 'Pro', status: 'active', employees: 12, branches: 2, createdAt: '2024-09-03', renewalDate: '2027-09-03', monthlyRevenue: 99, avatar: avatarPlaceholderUrl },
  { id: 'AT-003', name: 'La Belle Mode', owner: 'Lina Moussa', email: 'lina@labellemode.com', phone: '+966 54 333 4455', plan: 'Enterprise', status: 'active', employees: 35, branches: 5, createdAt: '2024-03-20', renewalDate: '2027-03-20', monthlyRevenue: 299, avatar: avatarPlaceholderUrl },
  { id: 'AT-004', name: 'Maison Chic', owner: 'Nadia Hassan', email: 'nadia@maisonchic.sa', phone: '+966 56 444 5566', plan: 'Pro', status: 'pending', employees: 8, branches: 1, createdAt: '2026-02-14', renewalDate: '2027-02-14', monthlyRevenue: 99, avatar: avatarPlaceholderUrl },
  { id: 'AT-005', name: 'Fashion Forward', owner: 'Omar Farouk', email: 'omar@fashionforward.sa', phone: '+966 59 555 6677', plan: 'Starter', status: 'suspended', employees: 4, branches: 1, createdAt: '2025-07-08', renewalDate: '2026-07-08', monthlyRevenue: 29, avatar: avatarPlaceholderUrl },
  { id: 'AT-006', name: 'Royal Threads', owner: 'Khalid Sami', email: 'khalid@royalthreads.sa', phone: '+966 50 666 7788', plan: 'Enterprise', status: 'active', employees: 42, branches: 7, createdAt: '2024-01-15', renewalDate: '2027-01-15', monthlyRevenue: 299, avatar: avatarPlaceholderUrl },
  { id: 'AT-007', name: 'Silk & Style', owner: 'Fatima Al-Zahra', email: 'fatima@silkstyle.com', phone: '+966 53 777 8899', plan: 'Pro', status: 'active', employees: 15, branches: 2, createdAt: '2025-04-22', renewalDate: '2027-04-22', monthlyRevenue: 99, avatar: avatarPlaceholderUrl },
  { id: 'AT-008', name: 'Tailor\'s Touch', owner: 'Rania Adel', email: 'rania@tailorstouch.sa', phone: '+966 58 888 9900', plan: 'Starter', status: 'trial', employees: 3, branches: 1, createdAt: '2026-03-10', renewalDate: '2026-04-10', monthlyRevenue: 0, avatar: avatarPlaceholderUrl },
  { id: 'AT-009', name: 'Vogue Atelier', owner: 'Hassan Tamer', email: 'hassan@vogueatelier.com', phone: '+966 51 999 0011', plan: 'Pro', status: 'active', employees: 18, branches: 3, createdAt: '2024-11-30', renewalDate: '2027-11-30', monthlyRevenue: 99, avatar: avatarPlaceholderUrl },
  { id: 'AT-010', name: 'Chic Couture', owner: 'Dina Qassem', email: 'dina@chiccouture.sa', phone: '+966 57 100 2233', plan: 'Enterprise', status: 'active', employees: 28, branches: 4, createdAt: '2024-05-18', renewalDate: '2027-05-18', monthlyRevenue: 299, avatar: avatarPlaceholderUrl },
  { id: 'AT-011', name: 'Modern Stitch', owner: 'Youssef Mansour', email: 'youssef@modernstitch.com', phone: '+966 52 200 3344', plan: 'Starter', status: 'active', employees: 6, branches: 1, createdAt: '2025-12-05', renewalDate: '2026-12-05', monthlyRevenue: 29, avatar: avatarPlaceholderUrl },
  { id: 'AT-012', name: 'Luxury Loom', owner: 'Maya Suleiman', email: 'maya@luxuryloom.sa', phone: '+966 55 300 4455', plan: 'Pro', status: 'active', employees: 11, branches: 2, createdAt: '2025-08-14', renewalDate: '2027-08-14', monthlyRevenue: 99, avatar: avatarPlaceholderUrl },
];
