// ─── Coupons ─────────────────────────────────────────────────────────────────
export type CouponType   = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired';
export type CouponPlan   = 'all' | 'starter' | 'pro' | 'enterprise';

export interface Coupon {
  id: string; code: string; type: CouponType; value: number;
  maxUses: number; usedCount: number; targetPlan: CouponPlan;
  status: CouponStatus; expiresAt: string; createdAt: string;
}

export const couponsData: Coupon[] = [
  { id: 'c1', code: 'SUMMER25',    type: 'percentage', value: 25, maxUses: 100, usedCount: 67,  targetPlan: 'all',        status: 'active',   expiresAt: '2026-06-30', createdAt: '2026-01-15' },
  { id: 'c2', code: 'NEWBIZ50',    type: 'percentage', value: 50, maxUses: 20,  usedCount: 20,  targetPlan: 'starter',    status: 'expired',  expiresAt: '2026-02-28', createdAt: '2026-01-01' },
  { id: 'c3', code: 'PRO3MONTHS',  type: 'fixed',      value: 90, maxUses: 50,  usedCount: 31,  targetPlan: 'pro',        status: 'active',   expiresAt: '2026-12-31', createdAt: '2026-02-10' },
  { id: 'c4', code: 'LAUNCH2025',  type: 'percentage', value: 30, maxUses: 0,   usedCount: 145, targetPlan: 'all',        status: 'inactive', expiresAt: '2025-12-31', createdAt: '2025-01-01' },
  { id: 'c5', code: 'ENTERPRISE20',type: 'percentage', value: 20, maxUses: 30,  usedCount: 14,  targetPlan: 'enterprise', status: 'active',   expiresAt: '2026-09-30', createdAt: '2026-03-01' },
  { id: 'c6', code: 'RAMADAN30',   type: 'percentage', value: 30, maxUses: 200, usedCount: 87,  targetPlan: 'all',        status: 'active',   expiresAt: '2026-04-10', createdAt: '2026-03-15' },
  { id: 'c7', code: 'VIP100OFF',   type: 'fixed',      value: 100,maxUses: 10,  usedCount: 4,   targetPlan: 'enterprise', status: 'active',   expiresAt: '2026-12-31', createdAt: '2026-03-05' },
  { id: 'c8', code: 'COMEBACK15',  type: 'percentage', value: 15, maxUses: 0,   usedCount: 22,  targetPlan: 'all',        status: 'inactive', expiresAt: '2026-05-31', createdAt: '2026-02-20' },
];

// ─── Referrals ────────────────────────────────────────────────────────────────
export type ReferralStatus = 'active' | 'paused' | 'inactive';

export interface ReferralRecord {
  id: string; referrer: string; referrerEmail: string;
  code: string; totalReferred: number; converted: number;
  pendingCommission: number; totalEarned: number;
  status: ReferralStatus; joinedAt: string;
}

export const referralsData: ReferralRecord[] = [
  { id: 'ref1', referrer: 'Elegance Studio',     referrerEmail: 'ahmed@elegance.com',    code: 'ELEGANCE15',  totalReferred: 12, converted: 8,  pendingCommission: 240,  totalEarned: 960,  status: 'active',   joinedAt: '2025-06-01' },
  { id: 'ref2', referrer: 'Couture House',        referrerEmail: 'sara@couturehouse.sa',  code: 'COUTURESARA', totalReferred: 7,  converted: 5,  pendingCommission: 150,  totalEarned: 600,  status: 'active',   joinedAt: '2025-07-15' },
  { id: 'ref3', referrer: 'La Belle Mode',        referrerEmail: 'lina@labellemode.com',  code: 'LABELLEMODE', totalReferred: 19, converted: 14, pendingCommission: 0,    totalEarned: 1680, status: 'active',   joinedAt: '2025-05-10' },
  { id: 'ref4', referrer: 'Royal Threads',        referrerEmail: 'khalid@royalthreads.sa',code: 'ROYALREF',    totalReferred: 4,  converted: 2,  pendingCommission: 60,   totalEarned: 240,  status: 'paused',   joinedAt: '2025-08-20' },
  { id: 'ref5', referrer: 'Fashion Forward',      referrerEmail: 'omar@fashforward.sa',   code: 'FASHFORWARD', totalReferred: 9,  converted: 6,  pendingCommission: 180,  totalEarned: 720,  status: 'active',   joinedAt: '2025-09-01' },
  { id: 'ref6', referrer: 'Silk & Style',         referrerEmail: 'fatima@silkstyle.com',  code: 'SILKSTYLE',   totalReferred: 3,  converted: 1,  pendingCommission: 30,   totalEarned: 120,  status: 'inactive', joinedAt: '2025-10-05' },
  { id: 'ref7', referrer: 'Vogue Atelier',        referrerEmail: 'hassan@vogue.com',      code: 'VOGUEATELIER',totalReferred: 22, converted: 18, pendingCommission: 540,  totalEarned: 2160, status: 'active',   joinedAt: '2025-04-15' },
];

// ─── Free Trials ──────────────────────────────────────────────────────────────
export type TrialStatus = 'active' | 'expired' | 'converted' | 'cancelled';

export interface FreeTrial {
  id: string; atelier: string; atelierEmail: string;
  plan: string; trialStart: string; trialEnd: string;
  daysRemaining: number; totalDays: number; status: TrialStatus;
}

export const freeTrialsData: FreeTrial[] = [
  { id: 'ft1', atelier: 'Desert Rose Boutique',  atelierEmail: 'contact@desertrose.sa',    plan: 'Pro',        trialStart: '2026-03-10', trialEnd: '2026-03-31', daysRemaining: 11, totalDays: 21, status: 'active'    },
  { id: 'ft2', atelier: 'Maison Khaleeji',        atelierEmail: 'info@maisonkhaleeji.sa',   plan: 'Enterprise', trialStart: '2026-03-01', trialEnd: '2026-03-28', daysRemaining: 8,  totalDays: 27, status: 'active'    },
  { id: 'ft3', atelier: 'Bespoke Threads',        atelierEmail: 'hi@bespokethreads.com',    plan: 'Pro',        trialStart: '2026-02-15', trialEnd: '2026-03-07', daysRemaining: 0,  totalDays: 20, status: 'converted' },
  { id: 'ft4', atelier: 'Zara Couture KSA',       atelierEmail: 'admin@zaraksa.sa',         plan: 'Starter',    trialStart: '2026-02-20', trialEnd: '2026-03-06', daysRemaining: 0,  totalDays: 14, status: 'expired'   },
  { id: 'ft5', atelier: 'Al Noor Fashion',        atelierEmail: 'contact@alnoor.sa',        plan: 'Enterprise', trialStart: '2026-03-15', trialEnd: '2026-04-04', daysRemaining: 15, totalDays: 20, status: 'active'    },
  { id: 'ft6', atelier: 'Haute Couture Jeddah',   atelierEmail: 'style@hautejedddah.com',   plan: 'Pro',        trialStart: '2026-01-10', trialEnd: '2026-01-24', daysRemaining: 0,  totalDays: 14, status: 'expired'   },
  { id: 'ft7', atelier: 'Glam Studio Riyadh',     atelierEmail: 'glam@studio.sa',           plan: 'Pro',        trialStart: '2026-03-18', trialEnd: '2026-04-07', daysRemaining: 18, totalDays: 20, status: 'active'    },
  { id: 'ft8', atelier: 'Moderno Boutique',        atelierEmail: 'hello@moderno.sa',        plan: 'Starter',    trialStart: '2026-02-01', trialEnd: '2026-02-14', daysRemaining: 0,  totalDays: 14, status: 'cancelled' },
];
