# Dressnmore - Super Admin Dashboard

## 1. Project Description
Dressnmore is a SaaS platform for ateliers management. This is the Super Admin dashboard that allows the system owner and admin team to manage all ateliers, subscriptions, plans, payments, users, settings and more.

**Target Users:** System Owners / Admin Team  
**Core Value:** Full control over the SaaS platform with real-time insights and management tools.

## 2. Page Structure
- `/` → Redirect to `/dashboard`
- `/dashboard` - Main dashboard with stats, charts, and recent activity
- `/ateliers` - Manage all ateliers (list, view, edit, suspend, delete, impersonate)
- `/ateliers/:id` - Atelier details page
- `/subscriptions` - Manage all subscriptions
- `/plans` - Manage pricing plans
- `/payments` - Payment history and management
- `/users` - Admin users management
- `/settings` - System settings (general, email, payment, SMS)
- `/feature-flags` - Feature toggles per plan
- `/support` - Support tickets management
- `/notifications` - Send notifications to ateliers
- `/logs` - System activity logs
- `/integrations` - Payment gateways, SMS, WhatsApp
- `/admin-roles` - Role-based access control
- `/marketing` - Coupons, referrals, free trials
- `*` - 404 Not Found

## 3. Core Features
- [x] Dashboard stats overview
- [x] Ateliers management (list, filter, search, CRUD, impersonate)
- [x] Subscriptions management
- [ ] Plans management (CRUD for pricing plans)
- [ ] Payments history & refunds
- [ ] Admin users & roles management
- [ ] System settings
- [ ] Feature flags per plan
- [ ] Support ticket system
- [ ] Broadcast notifications
- [ ] System logs viewer
- [ ] Third-party integrations
- [ ] Marketing tools (coupons, referrals)
- [ ] Permissions system per page/button

## 4. Data Model Design
No Supabase connected yet - using mock data

## 5. Backend / Third-party Integration Plan
- Supabase: Will be needed for real data (auth, database, edge functions)
- Stripe: Payment integration
- Supabase: Not connected yet

## 6. Development Phase Plan

### Phase 1: Core Layout + Dashboard + Ateliers + Subscriptions ✅
- Goal: Build the main admin shell with sidebar/topbar and 3 core pages
- Deliverable: Fully functional layout + Dashboard + Ateliers + Subscriptions pages with mock data

### Phase 2: Plans + Payments Pages
- Goal: Build plan management and payments pages
- Deliverable: Plans CRUD UI, Payments table with refund/status actions

### Phase 3: Users, Settings, Feature Flags
- Goal: Admin user management, system config, feature toggles
- Deliverable: Users table, settings forms, feature flags toggles

### Phase 4: Support, Notifications, Logs
- Goal: Ticket system, notification sender, activity logs
- Deliverable: Full support workflow, notification form, logs viewer

### Phase 5: Integrations, Roles, Marketing
- Goal: Third-party integration configs, RBAC, marketing tools
- Deliverable: Integration panels, role builder, coupons/referrals UI
