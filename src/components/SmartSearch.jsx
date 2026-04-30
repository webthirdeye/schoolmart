// src/components/SmartSearch.jsx — AI-Powered Suggestive Search Bar
import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, ArrowRight, Sparkles, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Static search index: all SchoolMart pages, products, and topics ──
const SEARCH_INDEX = [
  // Core Categories
  { label: 'Furniture', desc: 'CHAMPION DESK, Pre-primary, Hostel, Office', path: '/furniture', tags: 'furniture desk chair table seating bench ergonomic champion', category: '🪑 Categories' },
  { label: 'School Architecture', desc: 'Campus design, AutoCAD, 3D renders', path: '/school-building-design', tags: 'architecture building design campus layout vastu floor plan autocad', category: '🏗️ Categories' },
  { label: 'Digital Infrastructure', desc: 'Smartboards, IFP, AI Camera, Smart Class', path: '/digital', tags: 'digital smartboard ifp interactive flat panel ai camera smart class projector', category: '💻 Categories' },
  { label: 'School Interior Designs', desc: 'Learning Street, Wondergarten, Moon Room', path: '/design', tags: 'design interior corridor wall learning street wondergarten rumpus moon room', category: '🎨 Categories' },
  { label: 'Libraries', desc: 'Phygital Library, RFID, Digital Cataloguing', path: '/libraries', tags: 'library phygital books reading rfid digital catalogue', category: '📚 Categories' },
  { label: 'Sports Infrastructure', desc: 'Multi-sport, Indoor, Rooftop, Swimming', path: '/sports', tags: 'sports ground playground basketball football cricket court rooftop swimming', category: '🏟️ Categories' },
  { label: 'Gamified Math Labs', desc: 'MATHEMATICA — Curriculum-mapped Math Lab', path: '/gamified-math-labs', tags: 'math mathematics lab gamified manipulatives vedic geometry mathematica', category: '🧮 Categories' },
  { label: 'Science Labs', desc: 'Physics, Chemistry, Biology, Computer Labs', path: '/science-is-fun', tags: 'science lab physics chemistry biology experiment stem', category: '🔬 Categories' },
  { label: 'Labs & Libraries', desc: 'Complete lab and library solutions', path: '/labs', tags: 'lab science composite skill discovery pod computer', category: '🔬 Categories' },

  // Key Products
  { label: 'DISCOVERY POD', desc: 'CBSE-Mandated Composite Skill Lab', path: '/composite-skill-labs', tags: 'discovery pod composite skill lab cbse mandated 3d printing woodwork electronics drone', category: '⭐ Products' },
  { label: 'CHAMPION DESK', desc: 'Dual-seater with bag storage, BIS-certified', path: '/furniture', tags: 'champion desk dual seater institutional grade bis certified', category: '⭐ Products' },
  { label: 'MATHEMATICA Lab', desc: 'Gamified math with curriculum integration', path: '/gamified-math-labs', tags: 'mathematica math lab gamified curriculum mapped interactive', category: '⭐ Products' },
  { label: 'Phygital Library', desc: 'Physical + Digital hybrid library', path: '/libraries', tags: 'phygital library physical digital hybrid rfid', category: '⭐ Products' },
  { label: 'Interactive Flat Panel (IFP)', desc: '4K, 50-touch, EDLA Certified, AI Camera', path: '/digital', tags: 'ifp interactive flat panel smartboard 4k edla google certified', category: '⭐ Products' },
  { label: 'Learning Street', desc: 'Corridor transformation with educational walls', path: '/design', tags: 'learning street corridor wall interactive educational gamified', category: '⭐ Products' },

  // Pages
  { label: 'Home', desc: 'SchoolMart homepage', path: '/', tags: 'home main landing', category: '📄 Pages' },
  { label: 'About Us', desc: 'Company history and vision', path: '/aboutus', tags: 'about us company history vision mission team thirdeye', category: '📄 Pages' },
  { label: 'Manufacturing', desc: 'Our production capabilities', path: '/manufacturing', tags: 'manufacturing production factory quality process', category: '📄 Pages' },
  { label: 'Contact Us', desc: 'Get in touch — phone, email, office', path: '/contact-us', tags: 'contact us email phone address office hyderabad banjara hills', category: '📄 Pages' },
  { label: 'Catalogues', desc: 'Download product catalogues', path: '/catalogues', tags: 'catalogue catalog brochure download pdf', category: '📄 Pages' },
  { label: 'Environments', desc: 'Classroom & campus environments', path: '/environments', tags: 'environments classroom campus setup gallery', category: '📄 Pages' },
  { label: 'Guides', desc: 'Expert guides and resources', path: '/guides', tags: 'guides resources tips articles expert', category: '📄 Pages' },
  { label: 'Setup Guide', desc: 'How to start a new school', path: '/setup-guide', tags: 'setup guide new school start how to step by step', category: '📄 Pages' },
  { label: 'Workshops', desc: 'Teacher training and workshops', path: '/workshops', tags: 'workshop training teacher professional development', category: '📄 Pages' },
  { label: 'Fundraising', desc: 'CSR, grants, and funding help', path: '/fundraising', tags: 'fundraising csr government grant funding subsidy', category: '📄 Pages' },
  { label: 'Partnerships', desc: 'Business collaboration opportunities', path: '/partnerships', tags: 'partnership collaboration distributor franchise business', category: '📄 Pages' },

  // Compliance / Topics
  { label: 'CBSE Affiliation Requirements', desc: 'Land, labs, library, computer ratios', path: '/labs', tags: 'cbse affiliation requirements mandate compliance inspection lab computer library', category: '📋 Compliance' },
  { label: 'ICSE School Requirements', desc: 'Equipment, language lab, art & music', path: '/labs', tags: 'icse isc requirements language lab art music equipment', category: '📋 Compliance' },
  { label: 'NEP 2020 Infrastructure', desc: 'Activity-based, vocational, coding labs', path: '/labs', tags: 'nep 2020 national education policy vocational coding activity based', category: '📋 Compliance' },
  { label: 'IB School Infrastructure', desc: 'Design tech lab, CAS room, modular', path: '/labs', tags: 'ib international baccalaureate design tech cas modular flexible', category: '📋 Compliance' },
];

const TRENDING_SEARCHES = [
  'DISCOVERY POD',
  'CBSE Lab Requirements',
  'Furniture for 500 students',
  'Smartboard prices',
  'New school setup',
];

export default function SmartSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sm_recent_searches') || '[]');
      setRecentSearches(stored.slice(0, 5));
    } catch { /* ignore */ }
    inputRef.current?.focus();
  }, []);

  // Save to recent searches
  const saveRecent = (text) => {
    const updated = [text, ...recentSearches.filter(s => s !== text)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('sm_recent_searches', JSON.stringify(updated));
  };

  // Fuzzy local search
  const searchLocal = useCallback((q) => {
    if (!q.trim()) { setResults([]); return; }
    const terms = q.toLowerCase().split(/\s+/);
    const scored = SEARCH_INDEX.map(item => {
      const searchable = `${item.label} ${item.desc} ${item.tags}`.toLowerCase();
      let score = 0;
      let allMatch = true;
      for (const term of terms) {
        if (searchable.includes(term)) {
          score += 10;
          // Bonus for label match
          if (item.label.toLowerCase().includes(term)) score += 20;
          // Bonus for exact word match
          if (searchable.split(/\s+/).some(w => w === term)) score += 5;
        } else {
          allMatch = false;
        }
      }
      return { ...item, score, allMatch };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => {
      // Prioritize items where all terms matched
      if (a.allMatch !== b.allMatch) return b.allMatch - a.allMatch;
      return b.score - a.score;
    })
    .slice(0, 8);

    setResults(scored);
    setSelectedIdx(-1);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => searchLocal(query), 150);
    return () => clearTimeout(timer);
  }, [query, searchLocal]);

  // AI search for complex queries
  const triggerAISearch = async () => {
    if (!query.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Quick answer only (max 60 words, use bullet points): ${query}`,
          history: [],
          sessionId: 'search_' + Date.now(),
          currentPage: '/',
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiResult({
          text: data.reply,
          links: data.suggestedLinks || [],
        });
      }
    } catch { /* ignore */ }
    finally { setAiLoading(false); }
  };

  const handleNavigate = (path, label) => {
    saveRecent(label || query);
    onClose();
    navigate(path);
  };

  const handleKeyDown = (e) => {
    const totalItems = results.length + (aiResult ? 1 : 0);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && selectedIdx < results.length) {
        handleNavigate(results[selectedIdx].path, results[selectedIdx].label);
      } else if (query.trim()) {
        triggerAISearch();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Group results by category
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  });

  const showEmpty = query.length > 0 && results.length === 0 && !aiLoading && !aiResult;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] animate-[fadeIn_0.15s_ease-out]" onClick={onClose} />

      {/* Search Panel */}
      <div className="fixed top-0 left-0 right-0 z-[9991] flex justify-center pt-[10vh] px-4 animate-[slideDown_0.2s_ease-out]">
        <div className="w-full max-w-[640px] bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <Search size={20} className="text-gray-300 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, labs, compliance, pages..."
              className="flex-1 text-[15px] text-gray-800 placeholder:text-gray-300 outline-none font-medium"
              autoFocus
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); setAiResult(null); }} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            )}
            <button
              onClick={triggerAISearch}
              disabled={!query.trim() || aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#004a8e] to-[#0066cc] text-white text-[10px] font-black uppercase tracking-wider rounded-full hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              {aiLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
              Ask AI
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* No Query — Show Trending + Recent */}
            {!query && (
              <div className="px-5 py-4 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Clock size={9} /> Recent</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((s, i) => (
                        <button key={i} onClick={() => setQuery(s)}
                          className="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-[#004a8e] rounded-full border border-gray-100 hover:border-blue-200 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><TrendingUp size={9} /> Trending</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SEARCHES.map((s, i) => (
                      <button key={i} onClick={() => setQuery(s)}
                        className="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-[#004a8e] rounded-full border border-gray-100 hover:border-blue-200 transition-all">
                        🔥 {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Local Results */}
            {Object.keys(grouped).length > 0 && (
              <div className="py-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-5 pt-3 pb-1">{category}</p>
                    {items.map((item, idx) => {
                      const flatIdx = results.indexOf(item);
                      return (
                        <button
                          key={item.label + item.path}
                          onClick={() => handleNavigate(item.path, item.label)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all ${
                            flatIdx === selectedIdx ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-bold truncate ${flatIdx === selectedIdx ? 'text-[#004a8e]' : 'text-gray-800'}`}>{item.label}</p>
                            <p className="text-[11px] text-gray-400 truncate">{item.desc}</p>
                          </div>
                          <ArrowRight size={14} className={`shrink-0 ${flatIdx === selectedIdx ? 'text-[#004a8e]' : 'text-gray-200'}`} />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* AI Result */}
            {aiLoading && (
              <div className="px-5 py-6 flex items-center justify-center gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-bold">Arjun is thinking...</span>
              </div>
            )}

            {aiResult && (
              <div className="px-5 py-4 border-t border-gray-100">
                <p className="text-[9px] font-black text-[#004a8e] uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles size={9} /> AI Answer</p>
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-4">
                  <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-line">{aiResult.text.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                  {aiResult.links?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {aiResult.links.map((link, i) => (
                        <button key={i} onClick={() => handleNavigate(link.slug, link.label)}
                          className="px-3 py-1.5 text-[10px] font-bold text-[#004a8e] bg-white border border-blue-200 rounded-full hover:bg-[#004a8e] hover:text-white transition-all">
                          {link.label} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {showEmpty && (
              <div className="px-5 py-8 text-center">
                <p className="text-gray-400 text-sm font-semibold">No results for "{query}"</p>
                <p className="text-gray-300 text-xs mt-1">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500">Enter</kbd> or click <span className="text-[#004a8e] font-bold">Ask AI</span> for a smart answer</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 text-[9px] text-gray-300 font-bold">
              <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-[8px] text-gray-500">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-[8px] text-gray-500">Enter</kbd> Select</span>
              <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-[8px] text-gray-500">Esc</kbd> Close</span>
            </div>
            <p className="text-[9px] text-gray-300 font-bold flex items-center gap-1"><Sparkles size={8} /> Powered by Arjun AI</p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
