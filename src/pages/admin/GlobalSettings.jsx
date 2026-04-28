// src/pages/admin/GlobalSettings.jsx — Total Control Edition
import { useEffect, useState } from 'react';
import { getAllSettings, updateSetting, getUploadsExportUrl } from '../../services/api';
import { Save, Globe, Palette, Type, Lock, FileText, Share2, Bell, Smartphone, Download, HardDrive } from 'lucide-react';

const ColorInput = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded border-0 p-0 cursor-pointer" />
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-mono" />
    </div>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder, hint }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
    {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
  </div>
);

const TextArea = ({ label, value, onChange, rows = 3, placeholder }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-y" />
  </div>
);

export default function GlobalSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');

  useEffect(() => {
    setLoading(true);
    getAllSettings()
      .then(list => {
        const map = {};
        list.forEach(s => { map[s.key] = s.data; });
        setSettings(map);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const updateLocal = (key, path, value) => {
    setSettings(prev => {
      const newData = JSON.parse(JSON.stringify(prev[key] || {}));
      const keys = path.split('.');
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return { ...prev, [key]: newData };
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const [key, data] of Object.entries(settings)) {
        await updateSetting(key, data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  const branding = settings.branding || {};
  const footer = settings.footer || {};
  const pdfAccess = settings.pdf_access || {};
  const designDna = settings.design_dna || {};
  const ticker = settings.ticker || { items: [] };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">⚙️ Master DNA Console</h2>
          <p className="text-sm text-gray-500 mt-1">Total Control over Site Identity, Navigation, and Global Constants</p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-2xl ${saved ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 active:scale-95'}`}>
          <Save size={18} />
          {saving ? 'Pulsing Data...' : saved ? 'Logic Updated!' : 'Push System Updates'}
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
        {[
          { key: 'branding', label: 'Identity & Social', icon: Palette },
          { key: 'ticker', label: 'Live Ticker', icon: Bell },
          { key: 'design_dna', label: 'Design Scaling', icon: Type },
          { key: 'footer', label: 'Footer Hub', icon: Globe },
          { key: 'pdf', label: 'Security Gate', icon: Lock },
          { key: 'system', label: 'System & Backups', icon: HardDrive },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Identity & Social Tab */}
        {activeTab === 'branding' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest"><Palette size={18} className="text-indigo-500" /> Navigation Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput label="Top Bar Background" value={branding.topBar?.bgColor} onChange={v => updateLocal('branding', 'topBar.bgColor', v)} />
                <ColorInput label="Top Bar Text Color" value={branding.topBar?.textColor} onChange={v => updateLocal('branding', 'topBar.textColor', v)} />
                <ColorInput label="Navbar Accent Color" value={branding.accentColor} onChange={v => updateLocal('branding', 'accentColor', v)} />
                <TextInput label="Institutional Logo URL" value={branding.logoUrl} onChange={v => updateLocal('branding', 'logoUrl', v)} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest"><Share2 size={18} className="text-blue-500" /> Social Routing Hub</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Facebook URL" value={branding.socialLinks?.facebook} onChange={v => updateLocal('branding', 'socialLinks.facebook', v)} placeholder="https://facebook.com/..." />
                <TextInput label="Twitter / X" value={branding.socialLinks?.twitter} onChange={v => updateLocal('branding', 'socialLinks.twitter', v)} placeholder="https://twitter.com/..." />
                <TextInput label="Instagram" value={branding.socialLinks?.instagram} onChange={v => updateLocal('branding', 'socialLinks.instagram', v)} placeholder="https://instagram.com/..." />
                <TextInput label="LinkedIn" value={branding.socialLinks?.linkedin} onChange={v => updateLocal('branding', 'socialLinks.linkedin', v)} placeholder="https://linkedin.com/..." />
              </div>
            </div>
          </div>
        )}

        {/* Live Ticker Manager */}
        {activeTab === 'ticker' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest"><Bell size={18} className="text-amber-500" /> Announcement Ticker</h3>
              <button onClick={() => updateLocal('ticker', 'items', [...(ticker.items || []), 'New Campus Update!'])} 
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                + Add Message
              </button>
            </div>
            <div className="space-y-3">
              {(ticker.items || []).map((t, i) => (
                <div key={i} className="flex gap-3 group">
                  <input type="text" value={t} onChange={e => {
                    const items = [...ticker.items];
                    items[i] = e.target.value;
                    updateLocal('ticker', 'items', items);
                  }} className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition-all" />
                  <button onClick={() => {
                    const items = ticker.items.filter((_, idx) => idx !== i);
                    updateLocal('ticker', 'items', items);
                  }} className="px-3 text-red-300 hover:text-red-500 transition-colors">
                    <Save size={14} className="rotate-45" /> {/* Delete Icon Placeholder */}
                  </button>
                </div>
              ))}
              {(!ticker.items || ticker.items.length === 0) && (
                <div className="py-12 text-center text-gray-300 italic text-sm">No active ticker announcements</div>
              )}
            </div>
          </div>
        )}

        {/* Design DNA Scaling */}
        {activeTab === 'design_dna' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
             <div className="space-y-4">
               <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest"><Type size={18} className="text-emerald-500" /> Typography Scales</h3>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                 <TextInput label="Base Font Size" value={designDna.typography?.bodySize} onChange={v => updateLocal('design_dna', 'typography.bodySize', v)} placeholder="14px" />
                 <TextInput label="Heading Scale" value={designDna.typography?.headingScale} onChange={v => updateLocal('design_dna', 'typography.headingScale', v)} placeholder="1.2" />
                 <TextInput label="Global Radius" value={designDna.aesthetics?.borderRadius} onChange={v => updateLocal('design_dna', 'aesthetics.borderRadius', v)} placeholder="20px" />
               </div>
             </div>
             <div className="space-y-4 pt-8 border-t border-gray-100">
               <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest"><Globe size={18} className="text-sky-500" /> Page Master Backgrounds</h3>
               <div className="grid grid-cols-2 gap-6">
                 <ColorInput label="Master Page Background" value={designDna.themes?.mainBg} onChange={v => updateLocal('design_dna', 'themes.mainBg', v)} />
                 <ColorInput label="Section Alternator" value={designDna.themes?.sectionBg} onChange={v => updateLocal('design_dna', 'themes.sectionBg', v)} />
               </div>
             </div>
          </div>
        )}

        {/* Security Gate */}
        {activeTab === 'pdf' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
             <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest"><Lock size={18} className="text-red-500" /> Institutional Gating Control</h3>
             <label className="flex items-center gap-4 cursor-pointer p-6 border-2 border-indigo-50 bg-indigo-50/20 rounded-2xl hover:bg-indigo-50/40 transition-all">
                <input type="checkbox" checked={pdfAccess.requireLogin} onChange={e => updateLocal('pdf_access', 'requireLogin', e.target.checked)} className="w-5 h-5 accent-indigo-600" />
                <div>
                  <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Enforce Portal Verification</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Requires login for Catalogues, Handbooks, and Banners</p>
                </div>
              </label>
              <div className="grid gap-6 pt-6 border-t border-gray-100">
                <TextInput label="Gating Headline" value={pdfAccess.modalHeading} onChange={v => updateLocal('pdf_access', 'modalHeading', v)} />
                <TextArea label="Institutional Message" value={pdfAccess.message} onChange={v => updateLocal('pdf_access', 'message', v)} />
                <div className="grid grid-cols-2 gap-6">
                  <TextInput label="Redirect Button" value={pdfAccess.registerBtnText} onChange={v => updateLocal('pdf_access', 'registerBtnText', v)} />
                  <TextInput label="Dismiss Button" value={pdfAccess.dismissBtnText} onChange={v => updateLocal('pdf_access', 'dismissBtnText', v)} />
                </div>
              </div>
          </div>
        )}

        {/* Shared Footer Tab */}
        {activeTab === 'footer' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">🏛️ Footer Branding</h3>
              <TextInput label="Name" value={footer.brand?.name} onChange={v => updateLocal('footer', 'brand.name', v)} />
              <TextArea label="Description" value={footer.brand?.description} onChange={v => updateLocal('footer', 'brand.description', v)} />
            </div>
          </div>
        )}

        {/* System & Backups Tab */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <HardDrive size={28} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Media & Uploads Backup</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Download all images and files as a compressed archive (.tar.gz)</p>
                </div>
              </div>
              <a 
                href={getUploadsExportUrl()} 
                download 
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                <Download size={18} /> Download All Uploads
              </a>
            </div>

            <div className="pt-8 border-t border-gray-100">
               <h3 className="font-black text-gray-900 text-sm flex items-center gap-2 uppercase tracking-widest mb-4"><Bell size={18} className="text-amber-500" /> Maintenance Mode</h3>
               <p className="text-xs text-gray-500 mb-6">Use this section to perform system-wide maintenance or export data for offline editing.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Export Log</p>
                   <p className="text-xs text-gray-600">Download system logs for debugging.</p>
                   <button className="mt-4 text-xs font-bold text-blue-600 hover:underline">Download Logs (Internal)</button>
                 </div>
                 <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Database Dump</p>
                   <p className="text-xs text-gray-600">Export the entire database as JSON (Beta).</p>
                   <button className="mt-4 text-xs font-bold text-blue-600 hover:underline">Generate Dump</button>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
