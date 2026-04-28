// src/pages/admin/AdminDashboard.jsx — Premium Magento-style dashboard with users, stats, and quick links
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuotes, getContacts, getProducts, getAllPages, getUsers } from '../../services/api';
import {
  FileText, Package, MessageSquare, Mail, ArrowRight, Clock,
  Users, Settings, FormInput, Shield, Layers, Globe, Download
} from 'lucide-react';
import { getUploadsExportUrl } from '../../services/api';

const STATUS_COLORS = {
  new: 'bg-emerald-100 text-emerald-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  resolved: 'bg-gray-100 text-gray-500',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-gray-100 text-gray-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ quotes: 0, contacts: 0, products: 0, pages: 0, newQuotes: 0, newContacts: 0, users: 0 });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getQuotes(), getContacts(), getProducts(), getAllPages(), getUsers({ limit: 5 }).catch(() => ({ users: [], total: 0 }))])
      .then(([q, c, p, pgs, u]) => {
        setStats({
          quotes: q.length, contacts: c.length, products: p.length, pages: pgs.length,
          newQuotes: q.filter(x => x.status === 'new').length,
          newContacts: c.filter(x => x.status === 'new').length,
          users: u.total || 0,
        });
        setRecentQuotes(q.slice(0, 4));
        setRecentContacts(c.slice(0, 4));
        setRecentUsers(u.users || []);
        setPages(pgs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  const statCards = [
    { label: 'CMS Pages', value: stats.pages, sub: 'All editable', icon: FileText, color: 'from-blue-500 to-blue-700', path: '/admin/cms' },
    { label: 'Registered Users', value: stats.users, sub: 'Total accounts', icon: Users, color: 'from-indigo-500 to-indigo-700', path: '/admin/users' },
    { label: 'New Quotes', value: stats.newQuotes, sub: `${stats.quotes} total`, icon: MessageSquare, color: 'from-emerald-500 to-emerald-700', path: '/admin/quotes', alert: stats.newQuotes > 0 },
    { label: 'New Messages', value: stats.newContacts, sub: `${stats.contacts} total`, icon: Mail, color: 'from-purple-500 to-purple-700', path: '/admin/contacts', alert: stats.newContacts > 0 },
  ];

  const quickLinks = [
    { label: 'Edit Pages (CMS)', desc: 'Manage all page content blocks', icon: FileText, path: '/admin/cms', color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
    { label: 'Product Manager', desc: 'Manage catalog cards & CSV', icon: Package, path: '/admin/products', color: 'bg-orange-50 text-orange-600', iconBg: 'bg-orange-100' },
    { label: 'Registration Form', desc: 'Edit fields, labels & services', icon: FormInput, path: '/admin/form-config/registration', color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100' },
    { label: 'Login Form', desc: 'Edit fields & forgot password', icon: Shield, path: '/admin/form-config/login', color: 'bg-cyan-50 text-cyan-600', iconBg: 'bg-cyan-100' },
    { label: 'User Management', desc: `${stats.users} registered users`, icon: Users, path: '/admin/users', color: 'bg-indigo-50 text-indigo-600', iconBg: 'bg-indigo-100' },
    { label: 'Global Settings', desc: 'Footer, branding & PDF access', icon: Settings, path: '/admin/settings', color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100' },
    { label: 'Download Backups', desc: 'Export all images (.tar.gz)', icon: Download, path: 'EXTERNAL_DOWNLOAD', color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
  ];

  const PAGE_ICONS = {
    home: '🏠', furniture: '🪑', 'school-building-design': '🏗️', digital: '💻', sports: '🏅',
    libraries: '📚', environments: '🌿', aboutus: 'ℹ️', 'contact-us': '📞',
    'gamified-math-labs': '📐', 'science-is-fun': '🔬', labs: '🧪', design: '🎨',
    manufacturing: '🏭', corporate: '🏢', catalogues: '📁', guides: '📖',
    registration: '📝', login: '🔐',
  };

  return (
    <div className="space-y-8">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.path}
              className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-5 -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-3xl font-black text-gray-800">{card.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">{card.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
              {card.alert && card.value > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-800 text-base">⚡ Quick Actions</h2>
          <p className="text-xs text-gray-400 mt-0.5">Jump to any admin section</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-gray-100">
              return link.path === 'EXTERNAL_DOWNLOAD' ? (
                <a key={link.label} href={getUploadsExportUrl()} download
                  className={`flex items-center gap-3 p-5 hover:bg-gray-50 transition-colors group`}>
                  <div className={`w-10 h-10 rounded-xl ${link.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={link.color.split(' ')[1]} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{link.label}</p>
                    <p className="text-[10px] text-gray-400">{link.desc}</p>
                  </div>
                </a>
              ) : (
                <Link key={link.path} to={link.path}
                  className={`flex items-center gap-3 p-5 hover:bg-gray-50 transition-colors group`}>
                  <div className={`w-10 h-10 rounded-xl ${link.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={link.color.split(' ')[1]} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{link.label}</p>
                    <p className="text-[10px] text-gray-400">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {/* Quick Edit Pages */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-black text-gray-800 text-base">📄 Edit Website Pages</h2>
            <p className="text-xs text-gray-400 mt-0.5">Click any page to edit its content blocks</p>
          </div>
          <Link to="/admin/cms" className="flex items-center gap-1.5 text-blue-600 text-xs font-bold hover:underline">
            All Pages <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-y divide-gray-100">
          {pages.map(p => (
            <Link key={p.slug} to={`/admin/cms?page=${p.slug}`}
              className="flex items-center gap-3 p-4 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-2xl">{PAGE_ICONS[p.slug] || '📄'}</span>
              <div>
                <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{p.title}</p>
                <p className="text-[10px] text-gray-400">/{p.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity — 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              <h3 className="font-black text-gray-700 text-sm">Recent Users</h3>
            </div>
            <Link to="/admin/users" className="text-blue-600 text-xs font-bold hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.length === 0 && <p className="px-6 py-8 text-sm text-gray-400 text-center">No users yet</p>}
            {recentUsers.map(u => (
              <div key={u.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-black">{u.name?.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.schoolName || u.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${u.isVerified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {u.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500" />
              <h3 className="font-black text-gray-700 text-sm">Recent Quotes</h3>
            </div>
            <Link to="/admin/quotes" className="text-blue-600 text-xs font-bold hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentQuotes.length === 0 && <p className="px-6 py-8 text-sm text-gray-400 text-center">No quotes yet</p>}
            {recentQuotes.map(q => (
              <div key={q.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{q.schoolName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {q.pinCode && <span>· 📍 {q.pinCode}</span>}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${STATUS_COLORS[q.status] || 'bg-gray-100 text-gray-500'}`}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-purple-500" />
              <h3 className="font-black text-gray-700 text-sm">Recent Messages</h3>
            </div>
            <Link to="/admin/contacts" className="text-blue-600 text-xs font-bold hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 && <p className="px-6 py-8 text-sm text-gray-400 text-center">No messages yet</p>}
            {recentContacts.map(c => (
              <div key={c.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-500'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
