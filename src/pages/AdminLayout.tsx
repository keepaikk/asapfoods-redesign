import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UtensilsCrossed, LogOut, Settings } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = '/login';
  };

  const navLink = (to: string, label: string, icon?: React.ReactNode) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
        location.pathname === to
          ? 'bg-orange-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="h-6 w-6 text-orange-600" />
            <span className="font-black text-lg">Joviva Admin</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex gap-2 mb-8">
          {navLink('/admin', 'Menu', <UtensilsCrossed className="h-4 w-4" />)}
          {navLink('/admin/settings', 'Site Settings', <Settings className="h-4 w-4" />)}
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
