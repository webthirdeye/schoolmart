// src/pages/admin/ChatLeadsInbox.jsx — Premium Lead Management Dashboard
import { useState, useEffect } from 'react';
import {
  Bot, Phone, Mail, Calendar, ChevronDown, ChevronUp, Search,
  Flame, Target, School, Users, IndianRupee, MessageCircle,
  CheckCircle, PhoneCall, Trophy, Trash2, ExternalLink, Clock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL
  || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const STATUS_OPTS = ['active', 'captured', 'contacted', 'converted'];
const STATUS_STYLES = {
  active:    { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  captured:  { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  contacted: { bg: 'bg-purple-100',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  converted: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const INTENT_LABELS = {
  new_school_setup: '🏫 New School Setup',
  campus_upgrade:   '🔄 Campus Upgrade',
  lab_inquiry:      '🔬 Lab Inquiry',
  furniture_inquiry:'🪑 Furniture',
  library_setup:    '📚 Library Setup',
  sports_inquiry:   '🏟️ Sports',
  digital_infra:    '💻 Digital Infra',
  interior_design:  '🎨 Interior Design',
  compliance_help:  '📋 Compliance',
  pricing_inquiry:  '💰 Pricing',
};

const ScoreBadge = ({ score }) => {
  const color = score >= 70 ? 'text-red-600 bg-red-50 border-red-200' 
              : score >= 40 ? 'text-amber-600 bg-amber-50 border-amber-200'
              : 'text-gray-500 bg-gray-50 border-gray-200';
  const label = score >= 70 ? '🔥 Hot' : score >= 40 ? '🌤️ Warm' : '❄️ Cold';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${color}`}>
      {label} · {score}
    </span>
  );
};

export default function ChatLeadsInbox() {
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy]   = useState('recent'); // recent, score

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/chat/leads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/chat/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setLeads(prev => prev.filter(l => l.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  // Filter & sort
  const filtered = leads
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (l.name || '').toLowerCase().includes(q)
        || (l.schoolName || '').toLowerCase().includes(q)
        || (l.phone || '').includes(q)
        || (l.email || '').toLowerCase().includes(q)
        || (l.intent || '').includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'score') return (b.leadScore || 0) - (a.leadScore || 0);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const counts = STATUS_OPTS.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {});
  const hotLeads = leads.filter(l => l.leadScore >= 70).length;

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Leads</p>
          <p className="text-2xl font-black text-gray-800 mt-1">{leads.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1"><Flame size={10} /> Hot Leads</p>
          <p className="text-2xl font-black text-red-600 mt-1">{hotLeads}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Captured</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{counts.captured || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Contacted</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{counts.contacted || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1"><Trophy size={10} /> Converted</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{counts.converted || 0}</p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5">
          {['all', ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                filter === s ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {s} {s !== 'all' && counts[s] > 0 && <span className="ml-0.5 opacity-70">({counts[s]})</span>}
              {s === 'all' && <span className="ml-0.5 opacity-70">({leads.length})</span>}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-600 outline-none focus:border-blue-400"
        >
          <option value="recent">Sort: Most Recent</option>
          <option value="score">Sort: Lead Score ↓</option>
        </select>
      </div>

      {/* Leads List */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <Bot size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-semibold">No leads found</p>
          <p className="text-gray-300 text-xs mt-1">Arjun is waiting for conversations to capture leads</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(lead => {
          const isOpen = expanded === lead.id;
          const msgCount = Array.isArray(lead.messages) ? lead.messages.length : 0;
          const userMsgCount = Array.isArray(lead.messages) ? lead.messages.filter(m => m.role === 'user').length : 0;
          const style = STATUS_STYLES[lead.status] || STATUS_STYLES.active;

          return (
            <div key={lead.id} className={`bg-white rounded-2xl border shadow-sm transition-all ${lead.leadScore >= 70 ? 'border-red-200 shadow-red-500/5' : 'border-gray-100'}`}>
              {/* Card Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : lead.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 rounded-2xl transition-colors"
              >
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                  lead.name ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {lead.name ? lead.name.charAt(0).toUpperCase() : <Bot size={18} />}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-gray-800 truncate">{lead.name || `Session ${lead.sessionId?.slice(-6)}`}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {lead.schoolName && <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1"><School size={10} /> {lead.schoolName}</span>}
                    {lead.intent && <span className="text-[10px] text-gray-400 font-bold">{INTENT_LABELS[lead.intent] || lead.intent}</span>}
                    {lead.boardType && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{lead.boardType}</span>}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 shrink-0">
                  <ScoreBadge score={lead.leadScore || 0} />
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <MessageCircle size={10} /> {userMsgCount} msgs
                    </p>
                    <p className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
                      <Clock size={9} />
                      {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
                </div>
              </button>

              {/* Expanded Details */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</p>
                      <p className="text-sm font-bold text-gray-700">{lead.name || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"><Phone size={12} /> {lead.phone}</a>
                      ) : <p className="text-sm text-gray-400">—</p>}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"><Mail size={12} /> {lead.email}</a>
                      ) : <p className="text-sm text-gray-400">—</p>}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">School</p>
                      <p className="text-sm font-bold text-gray-700">{lead.schoolName || '—'}</p>
                    </div>
                  </div>

                  {/* AI Extracted Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Target size={9} /> Intent</p>
                      <p className="text-xs font-bold text-blue-700">{INTENT_LABELS[lead.intent] || lead.intent || '—'}</p>
                    </div>
                    <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50">
                      <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1 flex items-center gap-1"><IndianRupee size={9} /> Budget</p>
                      <p className="text-xs font-bold text-green-700">{lead.estimatedBudget || '—'}</p>
                    </div>
                    <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Board</p>
                      <p className="text-xs font-bold text-indigo-700">{lead.boardType || '—'}</p>
                    </div>
                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                      <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={9} /> Students</p>
                      <p className="text-xs font-bold text-orange-700">{lead.studentCount || '—'}</p>
                    </div>
                  </div>

                  {/* Conversation Transcript */}
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <MessageCircle size={10} /> Conversation ({msgCount} messages)
                    </p>
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 max-h-[400px] overflow-y-auto space-y-3">
                      {(lead.messages || []).map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          {msg.role !== 'user' && (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                              <Bot size={12} className="text-blue-600" />
                            </div>
                          )}
                          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta + Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1"><Calendar size={10} /> Created: {new Date(lead.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>·</span>
                      <span>Page: {lead.currentPage || '/'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.status === 'active' && (
                        <button onClick={() => changeStatus(lead.id, 'captured')} className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl text-[10px] font-bold transition-colors">
                          Mark Captured
                        </button>
                      )}
                      {(lead.status === 'active' || lead.status === 'captured') && (
                        <button onClick={() => changeStatus(lead.id, 'contacted')} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl text-[10px] font-bold transition-colors flex items-center gap-1">
                          <PhoneCall size={10} /> Contacted
                        </button>
                      )}
                      {lead.status !== 'converted' && (
                        <button onClick={() => changeStatus(lead.id, 'converted')} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-bold transition-colors flex items-center gap-1">
                          <Trophy size={10} /> Converted
                        </button>
                      )}
                      <button onClick={() => deleteLead(lead.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[10px] font-bold transition-colors flex items-center gap-1">
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
