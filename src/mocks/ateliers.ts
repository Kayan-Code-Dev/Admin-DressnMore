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
  { id: 'AT-001', name: 'Elegance Studio', owner: 'Ahmed Al-Rashidi', email: 'ahmed@elegance.com', phone: '+966 50 111 2233', plan: 'Enterprise', status: 'active', employees: 24, branches: 3, createdAt: '2024-06-12', renewalDate: '2027-06-12', monthlyRevenue: 299, avatar: 'https://readdy.ai/api/search-image?query=elegant%20fashion%20atelier%20logo%20minimal%20gold%20letter%20E%20on%20white%20background%2C%20luxury%20branding&width=48&height=48&seq=at001&orientation=squarish' },
  { id: 'AT-002', name: 'Couture House', owner: 'Sara Khalil', email: 'sara@couturehouse.sa', phone: '+966 55 222 3344', plan: 'Pro', status: 'active', employees: 12, branches: 2, createdAt: '2024-09-03', renewalDate: '2027-09-03', monthlyRevenue: 99, avatar: 'https://readdy.ai/api/search-image?query=couture%20fashion%20boutique%20logo%20minimal%20letter%20C%20gold%20on%20cream%20background%2C%20luxury%20fashion%20brand%20identity&width=48&height=48&seq=at002&orientation=squarish' },
  { id: 'AT-003', name: 'La Belle Mode', owner: 'Lina Moussa', email: 'lina@labellemode.com', phone: '+966 54 333 4455', plan: 'Enterprise', status: 'active', employees: 35, branches: 5, createdAt: '2024-03-20', renewalDate: '2027-03-20', monthlyRevenue: 299, avatar: 'https://readdy.ai/api/search-image?query=french%20fashion%20atelier%20logo%20minimal%20letter%20L%20cursive%20on%20white%2C%20haute%20couture%20elegant%20minimal&width=48&height=48&seq=at003&orientation=squarish' },
  { id: 'AT-004', name: 'Maison Chic', owner: 'Nadia Hassan', email: 'nadia@maisonchic.sa', phone: '+966 56 444 5566', plan: 'Pro', status: 'pending', employees: 8, branches: 1, createdAt: '2026-02-14', renewalDate: '2027-02-14', monthlyRevenue: 99, avatar: 'https://readdy.ai/api/search-image?query=maison%20fashion%20boutique%20minimal%20logo%20letter%20M%20on%20soft%20pink%20background%2C%20modern%20chic%20fashion%20studio&width=48&height=48&seq=at004&orientation=squarish' },
  { id: 'AT-005', name: 'Fashion Forward', owner: 'Omar Farouk', email: 'omar@fashionforward.sa', phone: '+966 59 555 6677', plan: 'Starter', status: 'suspended', employees: 4, branches: 1, createdAt: '2025-07-08', renewalDate: '2026-07-08', monthlyRevenue: 29, avatar: 'https://readdy.ai/api/search-image?query=fashion%20forward%20modern%20logo%20letter%20F%20bold%20black%20on%20white%2C%20contemporary%20fashion%20brand%20minimal&width=48&height=48&seq=at005&orientation=squarish' },
  { id: 'AT-006', name: 'Royal Threads', owner: 'Khalid Sami', email: 'khalid@royalthreads.sa', phone: '+966 50 666 7788', plan: 'Enterprise', status: 'active', employees: 42, branches: 7, createdAt: '2024-01-15', renewalDate: '2027-01-15', monthlyRevenue: 299, avatar: 'https://readdy.ai/api/search-image?query=royal%20luxury%20fashion%20logo%20golden%20crown%20with%20letter%20R%20on%20dark%20background%2C%20premium%20fashion%20atelier%20branding&width=48&height=48&seq=at006&orientation=squarish' },
  { id: 'AT-007', name: 'Silk & Style', owner: 'Fatima Al-Zahra', email: 'fatima@silkstyle.com', phone: '+966 53 777 8899', plan: 'Pro', status: 'active', employees: 15, branches: 2, createdAt: '2025-04-22', renewalDate: '2027-04-22', monthlyRevenue: 99, avatar: 'https://readdy.ai/api/search-image?query=silk%20fashion%20boutique%20logo%20minimal%20letter%20S%20elegant%20cursive%20white%20on%20blush%20pink%20background%2C%20luxury%20fashion&width=48&height=48&seq=at007&orientation=squarish' },
  { id: 'AT-008', name: 'Tailor\'s Touch', owner: 'Rania Adel', email: 'rania@tailorstouch.sa', phone: '+966 58 888 9900', plan: 'Starter', status: 'trial', employees: 3, branches: 1, createdAt: '2026-03-10', renewalDate: '2026-04-10', monthlyRevenue: 0, avatar: 'https://readdy.ai/api/search-image?query=tailor%20fashion%20logo%20minimal%20needle%20thread%20letter%20T%20on%20light%20gray%20background%2C%20artisan%20fashion%20brand%20identity&width=48&height=48&seq=at008&orientation=squarish' },
  { id: 'AT-009', name: 'Vogue Atelier', owner: 'Hassan Tamer', email: 'hassan@vogueatelier.com', phone: '+966 51 999 0011', plan: 'Pro', status: 'active', employees: 18, branches: 3, createdAt: '2024-11-30', renewalDate: '2027-11-30', monthlyRevenue: 99, avatar: 'https://readdy.ai/api/search-image?query=vogue%20fashion%20atelier%20modern%20logo%20letter%20V%20geometric%20black%20on%20white%2C%20editorial%20fashion%20brand%20minimal%20design&width=48&height=48&seq=at009&orientation=squarish' },
  { id: 'AT-010', name: 'Chic Couture', owner: 'Dina Qassem', email: 'dina@chiccouture.sa', phone: '+966 57 100 2233', plan: 'Enterprise', status: 'active', employees: 28, branches: 4, createdAt: '2024-05-18', renewalDate: '2027-05-18', monthlyRevenue: 299, avatar: 'https://readdy.ai/api/search-image?query=chic%20couture%20fashion%20logo%20letter%20C%20in%20circle%20on%20ivory%20background%2C%20french%20fashion%20haute%20couture%20minimal%20logo&width=48&height=48&seq=at010&orientation=squarish' },
  { id: 'AT-011', name: 'Modern Stitch', owner: 'Youssef Mansour', email: 'youssef@modernstitch.com', phone: '+966 52 200 3344', plan: 'Starter', status: 'active', employees: 6, branches: 1, createdAt: '2025-12-05', renewalDate: '2026-12-05', monthlyRevenue: 29, avatar: 'https://readdy.ai/api/search-image?query=modern%20stitch%20fashion%20logo%20minimal%20letter%20M%20stitch%20pattern%20on%20off-white%20background%2C%20contemporary%20tailoring%20brand&width=48&height=48&seq=at011&orientation=squarish' },
  { id: 'AT-012', name: 'Luxury Loom', owner: 'Maya Suleiman', email: 'maya@luxuryloom.sa', phone: '+966 55 300 4455', plan: 'Pro', status: 'active', employees: 11, branches: 2, createdAt: '2025-08-14', renewalDate: '2027-08-14', monthlyRevenue: 99, avatar: 'https://readdy.ai/api/search-image?query=luxury%20loom%20fashion%20logo%20elegant%20letter%20L%20with%20weave%20pattern%20gold%20on%20white%2C%20premium%20fabric%20atelier%20minimal%20branding&width=48&height=48&seq=at012&orientation=squarish' },
];
