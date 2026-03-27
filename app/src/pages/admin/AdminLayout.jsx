// src/pages/admin/AdminLayout.jsx — Premium redesign
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Package, MessageSquare,
  Mail, LogOut, ExternalLink, ChevronRight, Menu, X, Layers
} from 'lucide-react';

const NAV = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard, color: 'text-blue-400' },
  { label: 'Edit Pages', path: '/admin/cms', icon: FileText, color: 'text-purple-400' },
  { label: 'Products', path: '/admin/products', icon: Package, color: 'text-orange-400' },
  { label: 'Quote Requests', path: '/admin/quotes', icon: MessageSquare, color: 'text-green-400' },
  { label: 'Messages', path: '/admin/contacts', icon: Mail, color: 'text-pink-400' },
];

export default function AdminLayout() {
  const { user, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/admin/login');
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
  if (!user || !isAdmin) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 pt-7 pb-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">SM</span>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-wide">SchoolMart</p>
            <p className="text-white/30 text-[10px] font-medium tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <p className="text-white/20 text-[9px] font-black uppercase tracking-widest px-3 mb-3">Main Menu</p>
          {NAV.map(item => {
            const Icon = item.icon;
            const isOverview = item.path === '/admin';
            const active = isOverview 
              ? (location.pathname === '/admin' || location.pathname === '/admin/dashboard')
              : location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <Icon size={18} className={active ? item.color : ''} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-white/20" />}
              </Link>
            );
          })}

          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-widest px-3 mb-3">Quick Links</p>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 text-sm font-semibold transition-all">
              <ExternalLink size={16} /> View Website
            </a>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.name}</p>
              <p className="text-white/30 text-[10px] truncate">{user?.email}</p>
            </div>
            <button onClick={() => { logout(); navigate('/admin/login'); }}
              className="text-white/30 hover:text-red-400 transition-colors p-1" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(s => !s)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-black text-gray-800 text-lg capitalize">
                {NAV.find(n => n.path === location.pathname || (n.path !== '/admin' && location.pathname.startsWith(n.path)))?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-400">SchoolMart Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <ExternalLink size={14} /> Preview Site
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
