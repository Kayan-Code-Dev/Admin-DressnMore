import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentAdmin } from '../api/admin.api';
import { getStoredAdmin } from '../lib/session';
import type { StoredAdmin } from '../types/admin.types';

type Ctx = {
  admin: StoredAdmin | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AdminProfileContext = createContext<Ctx | null>(null);

export function AdminProfileProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<StoredAdmin | null>(() => getStoredAdmin());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const r = await fetchCurrentAdmin();
    if (r.ok === false && r.unauthorized) {
      navigate('/admin/login', { replace: true });
      return;
    }
    if (r.ok) {
      setAdmin(r.admin);
    } else {
      setAdmin(getStoredAdmin());
    }
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const value = useMemo(() => ({ admin, loading, refresh }), [admin, loading, refresh]);

  return (
    <AdminProfileContext.Provider value={value}>{children}</AdminProfileContext.Provider>
  );
}

export function useAdminProfile(): Ctx {
  const ctx = useContext(AdminProfileContext);
  if (!ctx) {
    throw new Error('useAdminProfile must be used within AdminProfileProvider');
  }
  return ctx;
}
