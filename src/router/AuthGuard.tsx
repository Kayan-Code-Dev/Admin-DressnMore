import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/session';

export function AuthGuard({ children }: { children: React.ReactElement }) {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
}
