import { type ReactNode } from 'react';
import { AdminProfileProvider } from '../../contexts/AdminProfileContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProfileProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProfileProvider>
  );
}
