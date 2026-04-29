// src/pages/admin/AdminLayout.jsx — Magento-style categorized sidebar
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Package, MessageSquare,
  Mail, LogOut, ExternalLink, ChevronRight, ChevronDown, Menu, X,
  Users, Settings, Sliders, FormInput, Shield, Globe, Layers, Bot
} from 'lucide-react';

const SIDEBAR_SECTIONS = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', path: '/admin', icon: LayoutDashboard, color: 'text-blue-400' },
    ]
  },
  {
    title: 'Content',
    items: [
      { label: 'Edit Pages (CMS)', path: '/admin/cms', icon: FileText, color: 'text-purple-400' },
      { label: 'Products / Cards', path: '/admin/products', icon: Package, color: 'text-orange-400' },
    ]
  },
  {
    title: 'Forms & Auth',
    items: [
      { label: 'Registration Config', path: '/admin/form-config/registration', icon: FormInput, color: 'text-emerald-400' },
      { label: 'Login Config', path: '/admin/form-config/login', icon: Shield, color: 'text-cyan-400' },
    ]
  },
  {
    title: 'Users & Leads',
    items: [
      { label: 'Users', path: '/admin/users', icon: Users, color: 'text-indigo-400' },
      { label: 'Arjun Chat Leads', path: '/admin/chat-leads', icon: Bot, color: 'text-cyan-400' },
      { label: 'Quote Requests', path: '/admin/quotes', icon: MessageSquare, color: 'text-green-400' },
      { label: 'Messages', path: '/admin/contacts', icon: Mail, color: 'text-pink-400' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Global Settings', path: '/admin/settings', icon: Settings, color: 'text-amber-400' },
    ]
  },
];

// Flatten for label lookup
const ALL_NAV_ITEMS = SIDEBAR_SECTIONS.flatMap(s => s.items);

export default function AdminLayout() {
  const { user, logout, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/admin/login');
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const toggleSection = (title) => {
    setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
  if (!user || !isAdmin) return null;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(path);
  };

  const currentLabel = ALL_NAV_ITEMS.find(n => isActive(n.path))?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0f172a] flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 pt-7 pb-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-xs">SM</span>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-wide">SchoolMart</p>
            <p className="text-white/30 text-[10px] font-medium tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Categorized Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {SIDEBAR_SECTIONS.map(section => {
            const collapsed = collapsedSections[section.title];
            const hasActive = section.items.some(item => isActive(item.path));
            return (
              <div key={section.title} className="mb-1">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${hasActive ? 'text-blue-400' : 'text-white/25'} group-hover:text-white/50 transition-colors`}>
                    {section.title}
                  </span>
                  <ChevronDown size={12} className={`text-white/20 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
                </button>
                {!collapsed && (
                  <div className="space-y-0.5 mt-0.5">
                    {section.items.map(item => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link key={item.path} to={item.path}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                            active
                              ? 'bg-white/10 text-white shadow-inner'
                              : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                          }`}
                        >
                          <Icon size={16} className={active ? item.color : 'text-white/30'} />
                          <span className="truncate">{item.label}</span>
                          {active && <ChevronRight size={12} className="ml-auto text-white/20" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-4 pt-4 border-t border-white/5">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 text-[13px] font-semibold transition-all">
              <ExternalLink size={15} /> View Website
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
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(s => !s)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-black text-gray-800 text-lg">{currentLabel}</h1>
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
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
