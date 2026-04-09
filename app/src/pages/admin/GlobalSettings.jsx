// src/pages/admin/GlobalSettings.jsx — Footer, Branding, PDF Access settings
import { useEffect, useState } from 'react';
import { getAllSettings, updateSetting } from '../../services/api';
import { Save, Plus, Trash2, Globe, FileText, Palette, Lock } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('footer');

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
      const newData = { ...prev[key] };
      const keys = path.split('.');
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj[keys[i]] = { ...obj[keys[i]] };
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

  const footer = settings.footer || {};
  const branding = settings.branding || {};
  const pdfAccess = settings.pdf_access || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">⚙️ Global Settings</h2>
          <p className="text-sm text-gray-400 mt-1">Manage footer, branding, and PDF access controls</p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-lg ${saved ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'}`}>
          <Save size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'footer', label: 'Footer', icon: Globe },
          { key: 'branding', label: 'Branding', icon: Palette },
          { key: 'pdf', label: 'PDF Access', icon: Lock },
          { key: 'product_ui', label: 'Product UI', icon: FileText },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* Brand Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">🏷️ Footer Brand</h3>
            <TextInput label="Brand Name" value={footer.brand?.name} onChange={v => updateLocal('footer', 'brand.name', v)} />
            <TextInput label="Tagline" value={footer.brand?.tagline} onChange={v => updateLocal('footer', 'brand.tagline', v)} />
            <TextArea label="Description" value={footer.brand?.description} onChange={v => updateLocal('footer', 'brand.description', v)} rows={3} />
          </div>

          {/* Footer Columns */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">📋 Footer Columns</h3>
            {(footer.columns || []).map((col, ci) => (
              <div key={ci} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <TextInput label={`Column ${ci + 1} Title`} value={col.title} onChange={v => {
                    const cols = [...footer.columns];
                    cols[ci] = { ...cols[ci], title: v };
                    updateLocal('footer', 'columns', cols);
                  }} />
                  <button onClick={() => {
                    const cols = footer.columns.filter((_, i) => i !== ci);
                    updateLocal('footer', 'columns', cols);
                  }} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={14} /></button>
                </div>
                {(col.links || []).map((link, li) => (
                  <div key={li} className="flex gap-2 items-center">
                    <input type="text" value={link.label} onChange={e => {
                      const cols = [...footer.columns];
                      const links = [...cols[ci].links];
                      links[li] = { ...links[li], label: e.target.value };
                      cols[ci] = { ...cols[ci], links };
                      updateLocal('footer', 'columns', cols);
                    }} placeholder="Label" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                    <input type="text" value={link.path} onChange={e => {
                      const cols = [...footer.columns];
                      const links = [...cols[ci].links];
                      links[li] = { ...links[li], path: e.target.value };
                      cols[ci] = { ...cols[ci], links };
                      updateLocal('footer', 'columns', cols);
                    }} placeholder="/path" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                    <button onClick={() => {
                      const cols = [...footer.columns];
                      cols[ci] = { ...cols[ci], links: cols[ci].links.filter((_, j) => j !== li) };
                      updateLocal('footer', 'columns', cols);
                    }} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={13} /></button>
                  </div>
                ))}
                <button onClick={() => {
                  const cols = [...footer.columns];
                  cols[ci] = { ...cols[ci], links: [...(cols[ci].links || []), { label: '', path: '/' }] };
                  updateLocal('footer', 'columns', cols);
                }} className="text-blue-500 text-xs font-bold">+ Add Link</button>
              </div>
            ))}
            <button onClick={() => {
              updateLocal('footer', 'columns', [...(footer.columns || []), { title: 'New Column', links: [] }]);
            }} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-sm hover:border-blue-400 hover:text-blue-500 transition-colors">
              <Plus size={16} /> Add Column
            </button>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">📞 Footer Contact Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Email" value={footer.contact?.email} onChange={v => updateLocal('footer', 'contact.email', v)} />
              <TextInput label="Phone 1" value={footer.contact?.phone1} onChange={v => updateLocal('footer', 'contact.phone1', v)} />
              <TextInput label="Phone 2" value={footer.contact?.phone2} onChange={v => updateLocal('footer', 'contact.phone2', v)} />
              <TextInput label="WhatsApp" value={footer.contact?.whatsapp} onChange={v => updateLocal('footer', 'contact.whatsapp', v)} />
            </div>
            <TextArea label="Address" value={footer.contact?.address} onChange={v => updateLocal('footer', 'contact.address', v)} rows={2} />
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">🔗 Social Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Facebook" value={footer.social?.facebook} onChange={v => updateLocal('footer', 'social.facebook', v)} placeholder="https://facebook.com/..." />
              <TextInput label="Twitter / X" value={footer.social?.twitter} onChange={v => updateLocal('footer', 'social.twitter', v)} placeholder="https://twitter.com/..." />
              <TextInput label="Instagram" value={footer.social?.instagram} onChange={v => updateLocal('footer', 'social.instagram', v)} placeholder="https://instagram.com/..." />
              <TextInput label="LinkedIn" value={footer.social?.linkedin} onChange={v => updateLocal('footer', 'social.linkedin', v)} placeholder="https://linkedin.com/..." />
              <TextInput label="YouTube" value={footer.social?.youtube} onChange={v => updateLocal('footer', 'social.youtube', v)} placeholder="https://youtube.com/..." />
            </div>
          </div>

          {/* Copyright */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">©️ Copyright & Legal</h3>
            <TextInput label="Copyright Text" value={footer.copyright} onChange={v => updateLocal('footer', 'copyright', v)} />
            <h4 className="text-[10px] font-bold text-gray-500 uppercase mt-3">Bottom Links</h4>
            {(footer.bottomLinks || []).map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={link.label} onChange={e => {
                  const links = [...footer.bottomLinks];
                  links[i] = { ...links[i], label: e.target.value };
                  updateLocal('footer', 'bottomLinks', links);
                }} placeholder="Label" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                <input type="text" value={link.path} onChange={e => {
                  const links = [...footer.bottomLinks];
                  links[i] = { ...links[i], path: e.target.value };
                  updateLocal('footer', 'bottomLinks', links);
                }} placeholder="/path" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                <button onClick={() => updateLocal('footer', 'bottomLinks', footer.bottomLinks.filter((_, j) => j !== i))}
                  className="text-red-400 p-1"><Trash2 size={13} /></button>
              </div>
            ))}
            <button onClick={() => updateLocal('footer', 'bottomLinks', [...(footer.bottomLinks || []), { label: '', path: '/' }])}
              className="text-blue-500 text-xs font-bold">+ Add Link</button>
          </div>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">🎨 Site Branding</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Site Name" value={branding.siteName} onChange={v => updateLocal('branding', 'siteName', v)} />
            <TextInput label="Tagline" value={branding.tagline} onChange={v => updateLocal('branding', 'tagline', v)} />
            <TextInput label="Logo URL" value={branding.logoUrl} onChange={v => updateLocal('branding', 'logoUrl', v)} placeholder="https://..." />
            <TextInput label="Favicon URL" value={branding.faviconUrl} onChange={v => updateLocal('branding', 'faviconUrl', v)} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={branding.primaryColor || '#0057A8'} onChange={e => updateLocal('branding', 'primaryColor', e.target.value)}
                  className="h-10 w-16 p-1 border rounded-lg cursor-pointer" />
                <input type="text" value={branding.primaryColor || '#0057A8'} onChange={e => updateLocal('branding', 'primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={branding.accentColor || '#3B82F6'} onChange={e => updateLocal('branding', 'accentColor', e.target.value)}
                  className="h-10 w-16 p-1 border rounded-lg cursor-pointer" />
                <input type="text" value={branding.accentColor || '#3B82F6'} onChange={e => updateLocal('branding', 'accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product UI Tab */}
      {activeTab === 'product_ui' && (
        <div className="space-y-6">
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">🏷️ Global Section Titles</h3>
              <p className="text-xs text-gray-500">Change the headings that appear in the product Quick View and Detail boxes.</p>
              <div className="grid grid-cols-2 gap-4">
                <TextInput 
                  label="Technical Specs Heading" 
                  value={settings.product_ui?.featuresTitle} 
                  onChange={v => updateLocal('product_ui', 'featuresTitle', v)}
                  placeholder="KEY FEATURES & TECHNICAL SPECS"
                />
                <TextInput 
                  label="Execution Strategy Heading" 
                  value={settings.product_ui?.executionTitle} 
                  onChange={v => updateLocal('product_ui', 'executionTitle', v)}
                  placeholder="EXECUTION STRATEGY"
                />
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">🔘 Action Button Defaults</h3>
              <p className="text-xs text-gray-500">Customize the labels and links for the primary call-to-action buttons.</p>
              <div className="grid grid-cols-2 gap-4">
                <TextInput 
                  label="Request Quote Label" 
                  value={settings.product_ui?.ctaLabel} 
                  onChange={v => updateLocal('product_ui', 'ctaLabel', v)}
                  placeholder="REQUEST QUOTE"
                />
                <TextInput 
                  label="Request Quote Link" 
                  value={settings.product_ui?.ctaLink} 
                  onChange={v => updateLocal('product_ui', 'ctaLink', v)}
                  placeholder="/registration"
                />
                <TextInput 
                  label="Chat Label" 
                  value={settings.product_ui?.chatLabel} 
                  onChange={v => updateLocal('product_ui', 'chatLabel', v)}
                  placeholder="CHAT"
                />
                <TextInput 
                  label="Chat Link" 
                  value={settings.product_ui?.chatLink} 
                  onChange={v => updateLocal('product_ui', 'chatLink', v)}
                  placeholder="https://wa.me/919966109191"
                />
              </div>
           </div>
        </div>
      )}

      {/* PDF Access Tab */}
      {activeTab === 'pdf' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">🔒 PDF Download Access Control</h3>
          <p className="text-sm text-gray-500">Control whether users must be registered/logged in to download PDFs and catalogues.</p>
          
          <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className={`relative w-12 h-6 rounded-full transition-colors ${pdfAccess.requireLogin ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => updateLocal('pdf_access', 'requireLogin', !pdfAccess.requireLogin)}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pdfAccess.requireLogin ? 'translate-x-6' : ''}`} />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-700">Require Login for PDF Downloads</span>
              <p className="text-xs text-gray-400">When enabled, non-registered users see "Identity Required" modal</p>
            </div>
          </label>

          <TextInput label="Modal Heading" value={pdfAccess.modalHeading}
            onChange={v => updateLocal('pdf_access', 'modalHeading', v)}
            placeholder="IDENTITY REQUIRED." />
          <TextArea label="Modal Message" value={pdfAccess.message}
            onChange={v => updateLocal('pdf_access', 'message', v)}
            placeholder="Our technical handbooks and pricing indices are gated for institutional partners. Please join our network to unlock full access." />
          <TextInput label="Register Button Text" value={pdfAccess.registerBtnText}
            onChange={v => updateLocal('pdf_access', 'registerBtnText', v)}
            placeholder="REGISTER FOR ACCESS" />
          <TextInput label="Dismiss Button Text" value={pdfAccess.dismissBtnText}
            onChange={v => updateLocal('pdf_access', 'dismissBtnText', v)}
            placeholder="BROWSE PUBLIC VIEW" />
        </div>
      )}
    </div>
  );
}
