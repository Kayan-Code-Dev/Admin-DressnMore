import { Navigate, type RouteObject } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/login/page';
import { AuthGuard } from './AuthGuard';
import DashboardPage from '../pages/dashboard/page';
import AteliersPage from '../pages/ateliers/page';
import SubscriptionsPage from '../pages/subscriptions/page';
import PlansPage from '../pages/plans/page';
import PaymentsPage from '../pages/payments/page';
import SettingsPage from '../pages/settings/page';
import SupportPage from '../pages/support/page';
import UsersPage from '../pages/users/page';
import FeatureFlagsPage from '../pages/feature-flags/page';
import AdminRolesPage from '../pages/admin-roles/page';
import NotificationsPage from '../pages/notifications/page';
import MarketingPage from '../pages/marketing/page';
import LogsPage from '../pages/logs/page';
import ComingSoonPage from '../pages/ComingSoon';
import PaymentGatewaysPage from '../pages/payment-gateways/page';

const routes: RouteObject[] = [
  { path: '/login',         element: <Navigate to="/admin/login" replace /> },
  { path: '/admin/login',   element: <LoginPage /> },
  { path: '/',              element: <AuthGuard><Navigate to="/dashboard" replace /></AuthGuard> },
  { path: '/dashboard',     element: <AuthGuard><DashboardPage /></AuthGuard> },
  { path: '/ateliers',      element: <AuthGuard><AteliersPage /></AuthGuard> },
  { path: '/subscriptions', element: <AuthGuard><SubscriptionsPage /></AuthGuard> },
  { path: '/plans',         element: <AuthGuard><PlansPage /></AuthGuard> },
  { path: '/payments',      element: <AuthGuard><PaymentsPage /></AuthGuard> },
  { path: '/payment-gateways',  element: <AuthGuard><PaymentGatewaysPage /></AuthGuard> },
  { path: '/users',         element: <AuthGuard><UsersPage /></AuthGuard> },
  { path: '/admin-roles',   element: <AuthGuard><AdminRolesPage /></AuthGuard> },
  { path: '/settings',      element: <AuthGuard><SettingsPage /></AuthGuard> },
  { path: '/feature-flags', element: <AuthGuard><FeatureFlagsPage /></AuthGuard> },
  { path: '/support',       element: <AuthGuard><SupportPage /></AuthGuard> },
  { path: '/notifications', element: <AuthGuard><NotificationsPage /></AuthGuard> },
  { path: '/logs',          element: <AuthGuard><LogsPage /></AuthGuard> },
  { path: '/integrations',  element: <AuthGuard><ComingSoonPage /></AuthGuard> },
  { path: '/marketing',     element: <AuthGuard><MarketingPage /></AuthGuard> },
  { path: '*',              element: <NotFound /> },
];

export default routes;
