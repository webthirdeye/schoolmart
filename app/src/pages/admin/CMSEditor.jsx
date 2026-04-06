// src/pages/admin/CMSEditor.jsx
// Form-field based CMS editor — proper inputs for every block type
import { useEffect, useState } from 'react';
import { getAllPages, getPage, updateBlock, addBlock, deleteBlock, standardizeAllBlocks } from '../../services/api';
import { clearCMSCache } from '../../hooks/useCMSBlock';
import { ChevronDown, ChevronRight, Trash2, Plus, Eye, EyeOff, Save, GripVertical, Image as ImageIcon, Link2, Type, List, ToggleLeft, Upload, Layers } from 'lucide-react';
import ProductManager from './ProductManager';
import ImageUpload from '../../components/admin/ImageUpload';
import MediaUpload from '../../components/admin/MediaUpload';

// ── Reusable form field helpers ───────────────────────────────────────────────
const Field = ({ label, children, hint }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white" />
);

const TextArea = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white resize-y" />
);

const Toggle = ({ label, value, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
    </div>
    <span className="text-sm text-gray-600 font-medium">{label}</span>
  </label>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-4 mb-2 border-b border-gray-100 pb-1">{children}</h4>
);

// ── CSV Import Logic ─────────────────────────────────────────────────────────────

const parseCSV = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => { if (values[i] !== undefined) obj[h] = values[i]; });
    return obj;
  });
};

const mapCSVToBlockData = (blockType, rows) => {
  if (!rows.length) return null;

  switch (blockType) {
    case 'topbar': {
      const r = rows[0];
      return {
        email: r.email,
        phone1: r.phone1,
        phone2: r.phone2,
        socials: {
          facebook: r.facebook,
          twitter: r.twitter,
          instagram: r.instagram,
          linkedin: r.linkedin
        }
      };
    }
    case 'ticker':
      return { label: rows[0].label || 'Latest Updates', items: rows.map(r => r.item).filter(Boolean) };
    case 'hero': {
      const r = rows[0];
      return {
        badge: r.badge, headline1: r.headline1, headline2: r.headline2,
        subline1: r.subline1, subline2: r.subline2,
        cta1: { label: r.cta1_label, path: r.cta1_path },
        cta2: { label: r.cta2_label, path: r.cta2_path },
        mediaType: r.mediaType || 'slideshow'
      };
    }
    case 'product_carousel':
      return { items: rows.map(r => ({ title: r.title, price: r.price, img: r.img, path: r.path, cartLink: r.cartLink })) };
    case 'tiles':
      return { tiles: rows.map(r => ({ title: r.title, subtitle: r.subtitle, path: r.path, img: r.img, featured: r.featured === 'true' })) };
    case 'solutions':
      return { heading: rows[0].heading, viewAllPath: rows[0].viewAllPath, items: rows.map(r => ({ title: r.title, description: r.description, path: r.path, img: r.img, badge: { label: r.badge_label, color: r.badge_color } })) };
    case 'sidebar_trending':
    case 'sidebar_resources':
      return { items: rows.map(r => ({ label: r.label, path: r.path })) };
    case 'sidebar_banners':
      return { banners: rows.map(r => ({ label: r.label, sublabel: r.sublabel, color: r.color, path: r.path })) };
    case 'hero': {
      const r = rows[0];
      return { 
        badge: r.badge, 
        headline1: r.headline1, 
        headline2: r.headline2, 
        subline1: r.subline1, 
        subline2: r.subline2, 
        bgColor: r.bgColor,
        mediaType: r.mediaType || 'slideshow',
        cta1: { label: r.cta1_label, path: r.cta1_path },
        cta2: { label: r.cta2_label, path: r.cta2_path }
      };
    }
    case 'cta_whatsapp': {
      const r = rows[0];
      return { badge: r.badge, headline: r.headline, description: r.description, whatsappNumber: r.whatsappNumber, phone: r.phone };
    }
    case 'partners':
      return { heading: rows[0].heading, subheading: rows[0].subheading, clients: rows.map(r => ({ name: r.name, icon: r.icon, color: r.color })) };
    case 'inner_page_hero': {
        const r = rows[0];
        return { badge: r.badge, badgeIcon: r.badgeIcon, titleHtml: r.titleHtml, subtitle: r.subtitle, mediaType: r.mediaType || 'image', mediaUrl: r.mediaUrl };
    }
    case 'sidebar_categories':
        return { categories: rows.map(r => ({ name: r.name, icon: r.icon })) };
    case 'feature_card': 
        return { title: rows[0].title, btnLabel: rows[0].btnLabel, bgColor: rows[0].bgColor, btnColor: rows[0].btnColor, btnPath: rows[0].btnPath };
    default:
      return rows[0]; // Simple flat mapping
  }
};

const downloadCSVTemplate = (blockType) => {
  let headers = [];
  switch (blockType) {
    case 'topbar': headers = ['email', 'phone1', 'phone2', 'facebook', 'twitter', 'instagram', 'linkedin']; break;
    case 'ticker': headers = ['label', 'item']; break;
    case 'hero': headers = ['badge', 'headline1', 'headline2', 'subline1', 'subline2', 'bgColor', 'cta1_label', 'cta1_path', 'cta2_label', 'cta2_path', 'mediaType']; break;
    case 'product_carousel': headers = ['title', 'price', 'img', 'path', 'cartLink']; break;
    case 'tiles': headers = ['title', 'subtitle', 'path', 'img', 'featured']; break;
    case 'solutions': headers = ['heading', 'viewAllPath', 'title', 'description', 'path', 'img', 'badge_label', 'badge_color']; break;
    case 'sidebar_trending':
    case 'sidebar_resources': headers = ['label', 'path']; break;
    case 'sidebar_banners': headers = ['label', 'sublabel', 'color', 'path']; break;
    case 'cta_whatsapp': headers = ['badge', 'headline', 'description', 'whatsappNumber', 'phone']; break;
    case 'partners': headers = ['heading', 'subheading', 'name', 'icon', 'color']; break;
    case 'inner_page_hero': headers = ['badge', 'badgeIcon', 'titleHtml', 'subtitle', 'mediaType', 'mediaUrl']; break;
    case 'sidebar_categories': headers = ['name', 'icon']; break;
    case 'feature_card': headers = ['title', 'btnLabel', 'bgColor', 'btnColor', 'btnPath']; break;
    default: headers = ['data'];
  }
  const blob = new Blob([headers.join(',')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${blockType}_template.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const CSVImporter = ({ blockType, onImport }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const rows = parseCSV(evt.target.result);
      const data = mapCSVToBlockData(blockType, rows);
      if (data) onImport(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-block">
        <input type="file" accept=".csv" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">
          <Upload size={14} /> Bulk Load (CSV)
        </button>
      </div>
      <button 
        onClick={() => downloadCSVTemplate(blockType)} 
        className="text-[10px] text-blue-500 font-bold hover:underline"
      >
        Get Template
      </button>
    </div>
  );
};

// ── Block-specific form renderers ─────────────────────────────────────────────
const BlockForms = {

  topbar: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Email"><TextInput value={data.email} onChange={v => set('email', v)} placeholder="info@schoolmart.in" /></Field>
      <Field label="Phone 1"><TextInput value={data.phone1} onChange={v => set('phone1', v)} placeholder="+91 9966109191" /></Field>
      <Field label="Phone 2"><TextInput value={data.phone2} onChange={v => set('phone2', v)} placeholder="+91 9866091111" /></Field>
      <SectionTitle>Social Links</SectionTitle>
      <Field label="Facebook"><TextInput value={data.socials?.facebook} onChange={v => set('socials', { ...data.socials, facebook: v })} placeholder="https://facebook.com/..." /></Field>
      <Field label="Twitter/X"><TextInput value={data.socials?.twitter} onChange={v => set('socials', { ...data.socials, twitter: v })} placeholder="https://twitter.com/..." /></Field>
      <Field label="Instagram"><TextInput value={data.socials?.instagram} onChange={v => set('socials', { ...data.socials, instagram: v })} placeholder="https://instagram.com/..." /></Field>
      <Field label="LinkedIn"><TextInput value={data.socials?.linkedin} onChange={v => set('socials', { ...data.socials, linkedin: v })} placeholder="https://linkedin.com/..." /></Field>
    </div>
  ),

  ticker: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Label"><TextInput value={data.label} onChange={v => set('label', v)} placeholder="Latest Updates" /></Field>
      <Field label="Ticker Items" hint="One item per line">
        <TextArea
          value={(data.items || []).join('\n')}
          onChange={v => set('items', v.split('\n'))}
          rows={6}
          placeholder={"Item 1\nItem 2\nItem 3"}
        />
      </Field>
    </div>
  ),

  hero: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Text Content</SectionTitle>
      <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="Price · Quality · Range Promise" /></Field>
      <Field label="Headline 1"><TextInput value={data.headline1} onChange={v => set('headline1', v)} placeholder="FURNITURE" /></Field>
      <Field label="Headline 2"><TextInput value={data.headline2} onChange={v => set('headline2', v)} placeholder="QUICK DELIVERY" /></Field>
      <Field label="Sub-line 1"><TextInput value={data.subline1} onChange={v => set('subline1', v)} placeholder="Order Now" /></Field>
      <Field label="Sub-line 2"><TextInput value={data.subline2} onChange={v => set('subline2', v)} placeholder="Kindergarten · Highschools · Labs · Libraries" /></Field>
      
      <SectionTitle>Visual Banner Mode</SectionTitle>
      <div className="flex gap-2 mb-4">
        {['slideshow', 'image', 'video'].map(mode => (
          <button
            key={mode}
            onClick={() => set('mediaType', mode)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${data.mediaType === mode || (!data.mediaType && mode === 'slideshow') ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-200'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Banner Background Color</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={data.bgColor || '#0f172a'} 
              onChange={e => set('bgColor', e.target.value)} 
              className="h-10 w-20 p-1 bg-white border rounded-lg cursor-pointer"
            />
            <input 
              type="text" 
              value={data.bgColor || '#0f172a'} 
              onChange={e => set('bgColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono uppercase" 
              placeholder="#HEX"
            />
          </div>
          <p className="text-[8px] text-gray-400">This changes the main banner background color.</p>
        </div>
      </div>

      {(data.mediaType === 'image' || data.mediaType === 'video') ? (
        <MediaUpload 
          label={data.mediaType === 'video' ? "Hero Video" : "Hero Image"} 
          value={data.mediaUrl} 
          onChange={v => set('mediaUrl', v)} 
        />
      ) : (
        <div className="space-y-3">
          <SectionTitle>Slideshow Slides (School Reel)</SectionTitle>
          {(data.slides || []).map((slide, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Slide {i + 1}</span>
                <button onClick={() => set('slides', data.slides.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
              </div>
              <TextInput value={slide.caption} onChange={v => { const s = [...(data.slides || [])]; s[i] = { ...s[i], caption: v }; set('slides', s); }} placeholder="Slide Caption" />
              <ImageUpload label="Slide Image" value={slide.src} onChange={v => { const s = [...(data.slides || [])]; s[i] = { ...s[i], src: v }; set('slides', s); }} />
            </div>
          ))}
          <button onClick={() => set('slides', [...(data.slides || []), { src: '', caption: '' }])}
            className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline mt-1"><Plus size={13} /> Add Slide</button>
        </div>
      )}

      <SectionTitle>Button 1</SectionTitle>
      <Field label="Label"><TextInput value={data.cta1?.label} onChange={v => set('cta1', { ...data.cta1, label: v })} placeholder="Shop Furniture →" /></Field>
      <Field label="Link (path)"><TextInput value={data.cta1?.path} onChange={v => set('cta1', { ...data.cta1, path: v })} placeholder="/furniture" /></Field>
      <SectionTitle>Button 2</SectionTitle>
      <Field label="Label"><TextInput value={data.cta2?.label} onChange={v => set('cta2', { ...data.cta2, label: v })} placeholder="View Catalogue" /></Field>
      <Field label="Link (path)"><TextInput value={data.cta2?.path} onChange={v => set('cta2', { ...data.cta2, path: v })} placeholder="/catalogues" /></Field>
    </div>
  ),

  page_hero: ({ data, set }) => (
    <div className="space-y-4">
      <Field label="Page Title"><TextInput value={data.title} onChange={v => set('title', v)} placeholder="Page Title" /></Field>
      <Field label="Sub-title"><TextInput value={data.subtitle} onChange={v => set('subtitle', v)} placeholder="Page subtitle..." /></Field>
      <Field label="Background Gradient" hint="Tailwind from-to classes"><TextInput value={data.bgGradient} onChange={v => set('bgGradient', v)} placeholder="from-blue-900 to-blue-700" /></Field>
      <div className="flex gap-2 mb-2">
        {['image', 'video'].map(mode => (
          <button key={mode} onClick={() => set('mediaType', mode)} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.mediaType === mode || (!data.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
        ))}
      </div>
      <MediaUpload label="Hero Media" value={data.mediaUrl || data.img} onChange={v => set('mediaUrl', v)} />
    </div>
  ),
  inner_page_hero: ({ data, set }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Badge Icon (Lucide)"><TextInput value={data.badgeIcon} onChange={v => set('badgeIcon', v)} placeholder="Zap" /></Field>
        <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="New Launch 2025" /></Field>
      </div>
      <Field label="Headline HTML (e.g. Future <br/> Digital)"><TextArea value={data.titleHtml} onChange={v => set('titleHtml', v)} rows={3} /></Field>
      <Field label="Sub-headline"><TextArea value={data.subtitle} onChange={v => set('subtitle', v)} rows={2} /></Field>
      
      <SectionTitle>Hero Visual</SectionTitle>
      <div className="flex gap-2 mb-2">
        {['image', 'video'].map(mode => (
          <button key={mode} onClick={() => set('mediaType', mode)} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.mediaType === mode || (!data.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
        ))}
      </div>
      <MediaUpload label="Hero Media" value={data.mediaUrl} onChange={v => set('mediaUrl', v)} />
      
      <SectionTitle>Overlay Text (Optional)</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Box Title"><TextInput value={data.darkBlock?.title} onChange={v => set('darkBlock', { ...data.darkBlock, title: v })} placeholder="Success Metric" /></Field>
        <Field label="Box Content"><TextInput value={data.darkBlock?.subtitle} onChange={v => set('darkBlock', { ...data.darkBlock, subtitle: v })} placeholder="99.9% Uptime" /></Field>
      </div>
    </div>
  ),

  cta_whatsapp: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="Direct Consultation" /></Field>
      <Field label="Headline"><TextInput value={data.headline} onChange={v => set('headline', v)} placeholder="Ready to scale your campus?" /></Field>
      <Field label="Description"><TextArea value={data.description} onChange={v => set('description', v)} rows={3} /></Field>
      <Field label="WhatsApp Number" hint="Country code + number, no spaces or +"><TextInput value={data.whatsappNumber} onChange={v => set('whatsappNumber', v)} placeholder="919966109191" /></Field>
      <Field label="Phone (display)"><TextInput value={data.phone} onChange={v => set('phone', v)} placeholder="+91 9966109191" /></Field>
    </div>
  ),

  partners: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Section Heading"><TextInput value={data.heading} onChange={v => set('heading', v)} placeholder="Trusted by Leading Schools" /></Field>
      <Field label="Sub-heading"><TextInput value={data.subheading} onChange={v => set('subheading', v)} placeholder="4000+ partner schools across India" /></Field>
      <SectionTitle>Stats</SectionTitle>
      {(data.stats || []).map((stat, i) => (
        <div key={i} className="flex gap-2 items-center bg-gray-50 rounded-lg p-2">
          <TextInput value={stat.value} onChange={v => { const s = [...(data.stats || [])]; s[i] = { ...s[i], value: v }; set('stats', s); }} placeholder="4000+" />
          <TextInput value={stat.label} onChange={v => { const s = [...(data.stats || [])]; s[i] = { ...s[i], label: v }; set('stats', s); }} placeholder="Partner Schools" />
          <button onClick={() => set('stats', (data.stats || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('stats', [...(data.stats || []), { value: '', label: '', color: 'text-blue-600' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Stat</button>
      <SectionTitle>Partner Schools (Name only)</SectionTitle>
      {(data.clients || []).map((c, i) => (
        <div key={i} className="flex gap-2 items-center">
          <TextInput value={c.name} onChange={v => { const cl = [...(data.clients || [])]; cl[i] = { ...cl[i], name: v }; set('clients', cl); }} placeholder="School Name" />
          <button onClick={() => set('clients', (data.clients || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('clients', [...(data.clients || []), { name: '', icon: 'GraduationCap', color: 'text-blue-600' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Partner</button>
    </div>
  ),

  tiles: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Masonry Tiles ({(data.tiles || []).length})</SectionTitle>
      {(data.tiles || []).map((tile, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Tile {i + 1}</span>
            <button onClick={() => set('tiles', (data.tiles || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={tile.title} onChange={v => { const t = [...(data.tiles || [])]; t[i] = { ...t[i], title: v }; set('tiles', t); }} placeholder="Tile Title (uppercase)" />
          <TextInput value={tile.subtitle} onChange={v => { const t = [...(data.tiles || [])]; t[i] = { ...t[i], subtitle: v }; set('tiles', t); }} placeholder="Subtitle" />
          <TextInput value={tile.path} onChange={v => { const t = [...(data.tiles || [])]; t[i] = { ...t[i], path: v }; set('tiles', t); }} placeholder="/path" />
          <ImageUpload label="Tile Image" value={tile.img} onChange={v => { const t = [...(data.tiles || [])]; t[i] = { ...t[i], img: v }; set('tiles', t); }} />
        </div>
      ))}
      <button onClick={() => set('tiles', [...(data.tiles || []), { title: '', subtitle: '', path: '/', img: '', height: 'h-56' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline mt-1"><Plus size={13} /> Add Tile</button>
    </div>
  ),

  solutions: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Section Heading"><TextInput value={data.heading} onChange={v => set('heading', v)} placeholder="Explore Our Solutions" /></Field>
      <Field label="View All Link"><TextInput value={data.viewAllPath} onChange={v => set('viewAllPath', v)} placeholder="/catalogues" /></Field>
      <SectionTitle>Solution Cards ({(data.items || []).length})</SectionTitle>
      {(data.items || []).map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Card {i + 1}</span>
            <button onClick={() => set('items', (data.items || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={item.title} onChange={v => { const t = [...(data.items || [])]; t[i] = { ...t[i], title: v }; set('items', t); }} placeholder="Card Title" />
          <TextArea rows={2} value={item.description} onChange={v => { const t = [...(data.items || [])]; t[i] = { ...t[i], description: v }; set('items', t); }} placeholder="Short description..." />
          <TextInput value={item.path} onChange={v => { const t = [...(data.items || [])]; t[i] = { ...t[i], path: v }; set('items', t); }} placeholder="/path" />
          <div className="flex gap-2">
            <TextInput value={item.badge?.label} onChange={v => { const t = [...(data.items || [])]; t[i] = { ...t[i], badge: { ...t[i].badge, label: v } }; set('items', t); }} placeholder="Badge label" />
            <input type="color" value={item.badge?.color || '#000000'}
              onChange={e => { const t = [...(data.items || [])]; t[i] = { ...t[i], badge: { ...t[i].badge, color: e.target.value } }; set('items', t); }}
              className="w-10 h-9 rounded cursor-pointer border border-gray-200 p-0.5" title="Badge color" />
          </div>
          <ImageUpload label="Solution Image" value={item.img} onChange={v => { const t = [...(data.items || [])]; t[i] = { ...t[i], img: v }; set('items', t); }} />
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items || []), { title: '', description: '', path: '/', img: '', badge: { label: '', color: '#3B82F6' } }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Card</button>
    </div>
  ),

  feature_cards: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Section Heading"><TextInput value={data.heading} onChange={v => set('heading', v)} placeholder="Our Furniture Range" /></Field>
      <SectionTitle>Cards ({(data.cards || []).length})</SectionTitle>
      {(data.cards || []).map((card, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Card {i + 1}</span>
            <button onClick={() => set('cards', (data.cards || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={card.title} onChange={v => { const t = [...(data.cards || [])]; t[i] = { ...t[i], title: v }; set('cards', t); }} placeholder="Card Title" />
          <TextArea rows={2} value={card.description} onChange={v => { const t = [...(data.cards || [])]; t[i] = { ...t[i], description: v }; set('cards', t); }} placeholder="Description..." />
          <TextInput value={card.img} onChange={v => { const t = [...(data.cards || [])]; t[i] = { ...t[i], img: v }; set('cards', t); }} placeholder="Image URL" />
          <TextInput value={card.path} onChange={v => { const t = [...(data.cards || [])]; t[i] = { ...t[i], path: v }; set('cards', t); }} placeholder="/path" />
          <ImageUpload label="Card Image" value={card.img} onChange={v => { const t = [...(data.cards || [])]; t[i] = { ...t[i], img: v }; set('cards', t); }} />
        </div>
      ))}
      <button onClick={() => set('cards', [...(data.cards || []), { title: '', description: '', img: '', path: '/' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Card</button>
    </div>
  ),

  product_carousel: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Product Carousel Editor (Slidable Grid Cards)</SectionTitle>
      <div className="space-y-3">
        {(data.items || []).map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50 relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TILE #{i + 1}</span>
              <button onClick={() => set('items', (data.items || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-700 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={item.title} onChange={v => { const s = [...(data.items || [])]; s[i] = { ...s[i], title: v }; set('items', s); }} placeholder="Card Title" />
              <TextInput value={item.price} onChange={v => { const s = [...(data.items || [])]; s[i] = { ...s[i], price: v }; set('items', s); }} placeholder="Price (e.g. 3,500.00)" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={item.path} onChange={v => { const s = [...(data.items || [])]; s[i] = { ...s[i], path: v }; set('items', s); }} placeholder="Product Details Path (/page-link)" />
              <TextInput value={item.cartLink} onChange={v => { const s = [...(data.items || [])]; s[i] = { ...s[i], cartLink: v }; set('items', s); }} placeholder="Add to Cart Link (URL)" />
            </div>
            <ImageUpload label="Product Image" value={item.img} onChange={v => { const s = [...(data.items || [])]; s[i] = { ...s[i], img: v }; set('items', s); }} />
          </div>
        ))}
      </div>
      <button onClick={() => set('items', [...(data.items || []), { title: '', price: '', img: '', path: '#', cartLink: '#' }])}
        className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline mt-1 bg-blue-50 px-3 py-2 rounded-lg w-full justify-center border border-dashed border-blue-200">
        <Plus size={13} /> Add Product Card
      </button>
    </div>
  ),

  sidebar_trending: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Trending Items ({(data.items || []).length})</SectionTitle>
      {(data.items || []).map((item, i) => (
        <div key={i} className="flex gap-2 items-center bg-white border border-gray-100 rounded-lg p-2 shadow-sm relative group">
          <div className="flex-1 space-y-2">
            <TextInput 
              value={typeof item === 'string' ? item : item.label} 
              onChange={v => {
                const ts = [...data.items];
                ts[i] = typeof ts[i] === 'string' ? { label: v, path: '#' } : { ...ts[i], label: v };
                set('items', ts);
              }} 
              placeholder="Label (e.g. Schools for Sale)" 
            />
            <TextInput 
              value={typeof item === 'string' ? '#' : item.path} 
              onChange={v => {
                const ts = [...data.items];
                ts[i] = typeof ts[i] === 'string' ? { label: ts[i], path: v } : { ...ts[i], path: v };
                set('items', ts);
              }} 
              placeholder="Link Path (e.g. /furniture or #)" 
            />
          </div>
          <button onClick={() => set('items', data.items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items || []), { label: '', path: '#' }])}
        className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline mt-1 bg-blue-50 px-3 py-2 rounded-lg w-full justify-center border border-blue-100"><Plus size={13} /> Add Trending Item</button>
    </div>
  ),

  sidebar_resources: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Resource Links ({(data.items || []).length})</SectionTitle>
      {(data.items || []).map((item, i) => (
        <div key={i} className="flex gap-2 items-center bg-white border border-gray-100 rounded-lg p-2 shadow-sm relative group">
          <div className="flex-1 space-y-2">
            <TextInput 
              value={typeof item === 'string' ? item : item.label} 
              onChange={v => {
                const ts = [...data.items];
                ts[i] = typeof ts[i] === 'string' ? { label: v, path: '#' } : { ...ts[i], label: v };
                set('items', ts);
              }} 
              placeholder="Label (e.g. Catalog 2025)" 
            />
            <TextInput 
              value={typeof item === 'string' ? '#' : item.path} 
              onChange={v => {
                const ts = [...data.items];
                ts[i] = typeof ts[i] === 'string' ? { label: ts[i], path: v } : { ...ts[i], path: v };
                set('items', ts);
              }} 
              placeholder="Link Path (e.g. /catalog_res.pdf or #)" 
            />
          </div>
          <button onClick={() => set('items', data.items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items || []), { label: '', path: '#' }])}
        className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline mt-1 bg-blue-50 px-3 py-2 rounded-lg w-full justify-center border border-blue-100"><Plus size={13} /> Add Resource link</button>
    </div>
  ),

  sidebar_banners: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Banner Buttons ({(data.banners || []).length})</SectionTitle>
      {(data.banners || []).map((b, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Banner {i + 1}</span>
            <button onClick={() => set('banners', data.banners.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <div className="flex gap-2">
            <TextInput value={b.label} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], label: v }; set('banners', t); }} placeholder="Label" />
            <input type="color" value={b.color || '#000000'} onChange={e => { const t = [...data.banners]; t[i] = { ...t[i], color: e.target.value }; set('banners', t); }} className="w-10 h-9 rounded cursor-pointer border border-gray-200 p-0.5" />
          </div>
          <TextInput value={b.sublabel} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], sublabel: v }; set('banners', t); }} placeholder="Sub label" />
          <TextInput value={b.path} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], path: v }; set('banners', t); }} placeholder="/path" />
        </div>
      ))}
      <button onClick={() => set('banners', [...(data.banners || []), { label: '', sublabel: '', color: '#0057A8', path: '/' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Banner</button>
    </div>
  ),

  feature_card: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Feature Card Editor (Large CTA Tile)</SectionTitle>
      <Field label="Card Title">
        <TextInput value={data.title} onChange={v => set('title', v)} placeholder="Optimizing Flow & Acoustics." />
      </Field>
      <Field label="Button Label">
        <TextInput value={data.btnLabel} onChange={v => set('btnLabel', v)} placeholder="Request Site Visit" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Background Color">
          <TextInput value={data.bgColor} onChange={v => set('bgColor', v)} placeholder="#1A1A1A" />
        </Field>
        <Field label="Button/Accent Color">
          <TextInput value={data.btnColor} onChange={v => set('btnColor', v)} placeholder="#0066CC" />
        </Field>
      </div>
      <Field label="Button Link Path">
        <TextInput value={data.btnPath} onChange={v => set('btnPath', v)} placeholder="/contact" />
      </Field>
    </div>
  ),

  navbar: ({ data, set }) => (
    <div className="space-y-3">
      <SectionTitle>Logo</SectionTitle>
      <Field label="Site Name"><TextInput value={data.logo?.title} onChange={v => set('logo', { ...data.logo, title: v })} placeholder="SCHOOL MART" /></Field>
      <Field label="Tagline"><TextInput value={data.logo?.tagline} onChange={v => set('logo', { ...data.logo, tagline: v })} placeholder="everything a school needs" /></Field>
      <SectionTitle>Category Icons (name only)</SectionTitle>
      {(data.categories || []).map((cat, i) => (
        <div key={i} className="flex gap-2 items-center">
          <TextInput value={cat.name} onChange={v => { const t = [...data.categories]; t[i] = { ...t[i], name: v }; set('categories', t); }} placeholder="FURNITURE" />
          <TextInput value={cat.path} onChange={v => { const t = [...data.categories]; t[i] = { ...t[i], path: v }; set('categories', t); }} placeholder="/furniture" />
          <button onClick={() => set('categories', data.categories.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('categories', [...(data.categories || []), { name: '', path: '/', icon: 'BookOpen' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Category</button>
    </div>
  ),

  about_hero: ({ data, set }) => (
    <div className="space-y-4">
      <Field label="Hero Title (supports <br/> and span)"><TextArea value={data.title} onChange={v => set('title', v)} rows={3} /></Field>
      <Field label="Hero Subtitle"><TextInput value={data.subtitle} onChange={v => set('subtitle', v)} /></Field>
      <Field label="Description"><TextArea value={data.description} onChange={v => set('description', v)} rows={4} /></Field>
      <div className="flex gap-2 mb-2">
        {['image', 'video'].map(mode => (
          <button key={mode} onClick={() => set('mediaType', mode)} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.mediaType === mode || (!data.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
        ))}
      </div>
      <MediaUpload label="Hero Media" value={data.mediaUrl || data.img} onChange={v => set('mediaUrl', v)} />
    </div>
  ),

  about_philosophy: ({ data, set }) => (
    <div className="space-y-4">
      <Field label="Title"><TextInput value={data.title} onChange={v => set('title', v)} placeholder="Our Philosophy." /></Field>
      <Field label="Statement"><TextArea value={data.statement} onChange={v => set('statement', v)} rows={4} /></Field>
      <SectionTitle>Team Image</SectionTitle>
      <ImageUpload label="Team Image" value={data.teamImg} onChange={v => set('teamImg', v)} />
    </div>
  ),

  journey: ({ data, set }) => (
    <div className="space-y-4">
      <Field label="Section Title"><TextInput value={data.title} onChange={v => set('title', v)} placeholder="A Decade of Excellence." /></Field>
      <SectionTitle>Timeline Steps</SectionTitle>
      {(data.steps || []).map((step, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Year {step.y || i + 1}</span>
            <button onClick={() => set('steps', data.steps.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
          </div>
          <TextInput value={step.y} onChange={v => { const s = [...data.steps]; s[i] = { ...s[i], y: v }; set('steps', s); }} placeholder="Year (e.g. 2012)" />
          <TextInput value={step.t} onChange={v => { const s = [...data.steps]; s[i] = { ...s[i], t: v }; set('steps', s); }} placeholder="Title" />
          <TextInput value={step.d} onChange={v => { const s = [...data.steps]; s[i] = { ...s[i], d: v }; set('steps', s); }} placeholder="Short description" />
        </div>
      ))}
      <button onClick={() => set('steps', [...(data.steps || []), { y: '', t: '', d: '' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline mt-1"><Plus size={13} /> Add Step</button>
    </div>
  ),

  stats: ({ data, set }) => (
    <div className="space-y-2">
      {(data.stats || []).map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <TextInput value={s.value} onChange={v => { const t = [...data.stats]; t[i] = { ...t[i], value: v }; set('stats', t); }} placeholder="4000+" />
          <TextInput value={s.label} onChange={v => { const t = [...data.stats]; t[i] = { ...t[i], label: v }; set('stats', t); }} placeholder="Partner Schools" />
          <button onClick={() => set('stats', data.stats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('stats', [...(data.stats || []), { value: '', label: '' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Stat</button>
    </div>
  ),

  mission_vision: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Mission Statement"><TextArea value={data.mission} onChange={v => set('mission', v)} rows={3} /></Field>
      <Field label="Vision Statement"><TextArea value={data.vision} onChange={v => set('vision', v)} rows={3} /></Field>
    </div>
  ),

  contact_info: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Heading"><TextInput value={data.heading} onChange={v => set('heading', v)} placeholder="Get in Touch" /></Field>
      <Field label="Sub-heading"><TextInput value={data.subheading} onChange={v => set('subheading', v)} /></Field>
      <Field label="Email"><TextInput value={data.email} onChange={v => set('email', v)} placeholder="info@schoolmart.in" /></Field>
      <Field label="Phone 1"><TextInput value={data.phone1} onChange={v => set('phone1', v)} /></Field>
      <Field label="Phone 2"><TextInput value={data.phone2} onChange={v => set('phone2', v)} /></Field>
      <Field label="Address"><TextArea value={data.address} onChange={v => set('address', v)} rows={2} /></Field>
      <Field label="WhatsApp Number"><TextInput value={data.whatsappNumber} onChange={v => set('whatsappNumber', v)} /></Field>
      <Field label="Google Maps Embed URL"><TextArea value={data.mapEmbedUrl} onChange={v => set('mapEmbedUrl', v)} rows={3} /></Field>
    </div>
  ),

  text_content: ({ data, set }) => (
    <div className="space-y-3">
      <Field label="Heading"><TextInput value={data.heading} onChange={v => set('heading', v)} /></Field>
      <Field label="Body Text"><TextArea value={data.body} onChange={v => set('body', v)} rows={6} /></Field>
    </div>
  ),

  catalogues_list: ({ data, set }) => (
    <div className="space-y-3">
      {(data.catalogues || []).map((c, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Catalogue {i + 1}</span>
            <button onClick={() => set('catalogues', data.catalogues.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={c.title} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], title: v }; set('catalogues', t); }} placeholder="Catalogue Title" />
          <TextArea rows={2} value={c.description} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], description: v }; set('catalogues', t); }} placeholder="Description..." />
          <div className="flex gap-2 items-center">
            <TextInput value={c.fileUrl} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], fileUrl: v }; set('catalogues', t); }} placeholder="Download URL or #" />
            <label className="cursor-pointer bg-gray-100 p-2 rounded-lg border border-gray-200 hover:bg-sm-blue hover:text-white transition-colors shrink-0">
               <Upload size={14} />
               <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={async (e) => {
                 if(e.target.files?.[0]) {
                   try {
                     const res = await uploadFile(e.target.files[0]);
                     const t = [...data.catalogues];
                     t[i] = { ...t[i], fileUrl: res.url };
                     set('catalogues', t);
                     alert('Upload successful!');
                   } catch(err) {
                     alert(err.message);
                   }
                 }
               }}/>
            </label>
          </div>
          <ImageUpload label="Thumbnail" value={c.img} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], img: v }; set('catalogues', t); }} />
        </div>
      ))}
      <button onClick={() => set('catalogues', [...(data.catalogues || []), { title: '', description: '', fileUrl: '#', img: '' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Catalogue</button>
    </div>
  ),

  guides_list: ({ data, set }) => (
    <div className="space-y-3">
      {(data.guides || []).map((g, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Guide {i + 1}</span>
            <button onClick={() => set('guides', data.guides.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={g.title} onChange={v => { const t = [...data.guides]; t[i] = { ...t[i], title: v }; set('guides', t); }} placeholder="Guide Title" />
          <TextArea rows={2} value={g.description} onChange={v => { const t = [...data.guides]; t[i] = { ...t[i], description: v }; set('guides', t); }} placeholder="Description..." />
          <TextInput value={g.img} onChange={v => { const t = [...data.guides]; t[i] = { ...t[i], img: v }; set('guides', t); }} placeholder="Image URL" />
          <TextInput value={g.path} onChange={v => { const t = [...data.guides]; t[i] = { ...t[i], path: v }; set('guides', t); }} placeholder="/path or external URL" />
        </div>
      ))}
      <button onClick={() => set('guides', [...(data.guides || []), { title: '', description: '', img: '', path: '#' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"><Plus size={13} /> Add Guide</button>
    </div>
  ),

  catalogues_page_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Top Library Hero</h4>
        <Field label="Badge"><TextInput value={data.libraryHero?.badge} onChange={v => set('libraryHero', { ...data.libraryHero, badge: v })} /></Field>
        <Field label="Title HTML (supports <br/> and span)"><TextArea value={data.libraryHero?.titleHtml} onChange={v => set('libraryHero', { ...data.libraryHero, titleHtml: v })} rows={2} /></Field>
        <Field label="Subtitle"><TextArea value={data.libraryHero?.subtitle} onChange={v => set('libraryHero', { ...data.libraryHero, subtitle: v })} rows={2} /></Field>
        <div className="flex gap-2">
          {['image', 'video'].map(mode => (
            <button key={mode} onClick={() => set('libraryHero', { ...data.libraryHero, mediaType: mode })} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.libraryHero?.mediaType === mode || (!data.libraryHero?.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
          ))}
        </div>
        <MediaUpload label="Hero Media" value={data.libraryHero?.mediaUrl || data.libraryHero?.img} onChange={v => set('libraryHero', { ...data.libraryHero, mediaUrl: v })} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Dark Action Strip</h4>
        <Field label="Title"><TextInput value={data.actionStrip?.title} onChange={v => set('actionStrip', { ...data.actionStrip, title: v })} /></Field>
        <Field label="Description"><TextArea value={data.actionStrip?.subtitle} onChange={v => set('actionStrip', { ...data.actionStrip, subtitle: v })} rows={2} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button 1 Text"><TextInput value={data.actionStrip?.btn1Text} onChange={v => set('actionStrip', { ...data.actionStrip, btn1Text: v })} /></Field>
          <Field label="Button 2 Text"><TextInput value={data.actionStrip?.btn2Text} onChange={v => set('actionStrip', { ...data.actionStrip, btn2Text: v })} /></Field>
        </div>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Resource Tiles (3 items max)</h4>
        {(data.resourceTiles || []).map((t, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={t} onChange={v => { const ts = [...data.resourceTiles]; ts[i] = v; set('resourceTiles', ts); }} />
            <button onClick={() => set('resourceTiles', data.resourceTiles.filter((_,j) => j !== i))} className="text-red-400 p-2"><Trash2 size={13}/></button>
          </div>
        ))}
        {(!data.resourceTiles || data.resourceTiles.length < 3) && <button onClick={() => set('resourceTiles', [...(data.resourceTiles||[]), 'New Tile'])} className="text-blue-500 text-xs font-bold">+ Add Tile</button>}
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Strip Menu Links (comma separated)</h4>
        <TextArea value={(data.menuStrip || []).join(', ')} onChange={v => set('menuStrip', v.split(',').map(s => s.replace(/^,|,$/g, '')))} rows={2} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Bottom Grid Section</h4>
        <Field label="Title HTML"><TextInput value={data.infoGrid?.titleHtml} onChange={v => set('infoGrid', { ...data.infoGrid, titleHtml: v })} /></Field>
        <Field label="Image URL"><TextInput value={data.infoGrid?.img} onChange={v => set('infoGrid', { ...data.infoGrid, img: v })} /></Field>
        <Field label="4 Info Points (comma separated)"><TextArea value={(data.infoGrid?.points || []).join(', ')} onChange={v => set('infoGrid', { ...data.infoGrid, points: v.split(',')})} rows={2} /></Field>
      </div>
    </div>
  ),

  environments_page_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Hero Section</h4>
        <Field label="Badge"><TextInput value={data.hero?.badge} onChange={v => set('hero', { ...data.hero, badge: v })} /></Field>
        <Field label="Title HTML"><TextArea value={data.hero?.titleHtml} onChange={v => set('hero', { ...data.hero, titleHtml: v })} rows={2} /></Field>
        <Field label="Subtitle"><TextArea value={data.hero?.subtitle} onChange={v => set('hero', { ...data.hero, subtitle: v })} rows={2} /></Field>
        <div className="flex gap-2">
          {['image', 'video'].map(mode => (
            <button key={mode} onClick={() => set('hero', { ...data.hero, mediaType: mode })} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.hero?.mediaType === mode || (!data.hero?.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
          ))}
        </div>
        <MediaUpload label="Hero Media" value={data.hero?.mediaUrl || data.heroImage} onChange={v => set('hero', { ...data.hero, mediaUrl: v })} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Dark Action Card</h4>
        <Field label="Title HTML"><TextArea value={data.actionCard?.titleHtml} onChange={v => set('actionCard', { ...data.actionCard, titleHtml: v })} rows={2} /></Field>
        <Field label="Button Text"><TextInput value={data.actionCard?.btnText} onChange={v => set('actionCard', { ...data.actionCard, btnText: v })} /></Field>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Sub Blocks (Icons: Leaf, Wind, Sun, Layers)</h4>
        {(data.subBlocks || []).map((sb, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={sb.title} onChange={v => { const ts = [...data.subBlocks]; ts[i] = { ...ts[i], title: v }; set('subBlocks', ts); }} placeholder="Title" />
            <TextInput value={sb.subtitle} onChange={v => { const ts = [...data.subBlocks]; ts[i] = { ...ts[i], subtitle: v }; set('subBlocks', ts); }} placeholder="Subtitle" />
            <TextInput value={sb.icon} onChange={v => { const ts = [...data.subBlocks]; ts[i] = { ...ts[i], icon: v }; set('subBlocks', ts); }} placeholder="Icon" className="w-24" />
            <button onClick={() => set('subBlocks', data.subBlocks.filter((_,j) => j !== i))} className="text-red-400 p-2"><Trash2 size={13}/></button>
          </div>
        ))}
        <button onClick={() => set('subBlocks', [...(data.subBlocks||[]), { title: '', subtitle: '', icon: 'Sparkles' }])} className="text-blue-500 text-xs font-bold">+ Add Sub Block</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Masonry Images Grid</h4>
        {(data.masonryItems || []).map((m, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 border border-gray-100 rounded-lg bg-white relative">
            <button onClick={() => set('masonryItems', data.masonryItems.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={m.t} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], t: v }; set('masonryItems', ts); }} placeholder="Title (e.g. Natural Light)" />
              <TextInput value={m.c} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], c: v }; set('masonryItems', ts); }} placeholder="Category (e.g. Optics)" />
            </div>
            <ImageUpload label="Grid Image" value={m.img} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], img: v }; set('masonryItems', ts); }} />
            <div className="grid grid-cols-3 gap-2">
              <TextInput value={m.h} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], h: v }; set('masonryItems', ts); }} placeholder="Height (e.g. h-[220px])" className="col-span-3" />
            </div>
          </div>
        ))}
        <button onClick={() => set('masonryItems', [...(data.masonryItems||[]), { t: '', c: '', img: '', h: 'h-[250px]' }])} className="text-blue-500 text-xs font-bold">+ Add Image block</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Bottom Info Grid</h4>
        <Field label="Title HTML"><TextInput value={data.infoGrid?.titleHtml} onChange={v => set('infoGrid', { ...data.infoGrid, titleHtml: v })} /></Field>
        <ImageUpload label="Grid Image" value={data.infoGrid?.img} onChange={v => set('infoGrid', { ...data.infoGrid, img: v })} />
        <Field label="4 Info Points (comma separated)"><TextArea value={(data.infoGrid?.points || []).join(', ')} onChange={v => set('infoGrid', { ...data.infoGrid, points: v.split(',')})} rows={2} /></Field>
      </div>
    </div>
  ),

  guides_page_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Top Hero</h4>
        <Field label="Badge"><TextInput value={data.hero?.badge} onChange={v => set('hero', { ...data.hero, badge: v })} /></Field>
        <Field label="Title HTML"><TextArea value={data.hero?.titleHtml} onChange={v => set('hero', { ...data.hero, titleHtml: v })} rows={2} /></Field>
        <Field label="Subtitle"><TextArea value={data.hero?.subtitle} onChange={v => set('hero', { ...data.hero, subtitle: v })} rows={2} /></Field>
        <div className="flex gap-2">
          {['image', 'video'].map(mode => (
            <button key={mode} onClick={() => set('hero', { ...data.hero, mediaType: mode })} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.hero?.mediaType === mode || (!data.hero?.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
          ))}
        </div>
        <MediaUpload label="Hero Media" value={data.hero?.mediaUrl} onChange={v => set('hero', { ...data.hero, mediaUrl: v })} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Action Cards (3 Max)</h4>
        {(data.actionStrip || []).map((as, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
            <button onClick={() => set('actionStrip', data.actionStrip.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
            <TextArea value={as.titleHtml} onChange={v => { const ts = [...data.actionStrip]; ts[i] = { ...ts[i], titleHtml: v }; set('actionStrip', ts); }} placeholder="Title HTML" rows={2} />
            <div className="flex gap-2">
              <TextInput value={as.btnText || ''} onChange={v => { const ts = [...data.actionStrip]; ts[i] = { ...ts[i], btnText: v }; set('actionStrip', ts); }} placeholder="Button Text (if any)" />
              <TextInput value={as.icon || ''} onChange={v => { const ts = [...data.actionStrip]; ts[i] = { ...ts[i], icon: v }; set('actionStrip', ts); }} placeholder="Icon (e.g. Award)" />
              <select value={as.color} onChange={e => { const ts = [...data.actionStrip]; ts[i] = { ...ts[i], color: e.target.value }; set('actionStrip', ts); }} className="border px-2 rounded">
                 <option value="light">Light</option>
                 <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        ))}
        <button onClick={() => set('actionStrip', [...(data.actionStrip||[]), { titleHtml: '', btnText: '', icon: '', color: 'light' }])} className="text-blue-500 text-xs font-bold">+ Add Card</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Strip Menu Links (comma separated)</h4>
        <TextArea value={(data.menuStrip || []).join(', ')} onChange={v => set('menuStrip', v.split(','))} rows={2} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Resource Image Grid</h4>
        {(data.resourceList || []).map((r, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
            <button onClick={() => set('resourceList', data.resourceList.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
            <div className="flex gap-2">
              <TextInput value={r.t} onChange={v => { const ts = [...data.resourceList]; ts[i] = { ...ts[i], t: v }; set('resourceList', ts); }} placeholder="Title" />
              <TextInput value={r.c} onChange={v => { const ts = [...data.resourceList]; ts[i] = { ...ts[i], c: v }; set('resourceList', ts); }} placeholder="Category" />
            </div>
            <ImageUpload label="Resource Image" value={r.img} onChange={v => { const ts = [...data.resourceList]; ts[i] = { ...ts[i], img: v }; set('resourceList', ts); }} />
          </div>
        ))}
        <button onClick={() => set('resourceList', [...(data.resourceList||[]), { t: '', c: '', img: '', h: 'h-[300px]' }])} className="text-blue-500 text-xs font-bold">+ Add Resource</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Bottom Grid Section</h4>
        <Field label="Title HTML"><TextInput value={data.infoGrid?.titleHtml} onChange={v => set('infoGrid', { ...data.infoGrid, titleHtml: v })} /></Field>
        <ImageUpload label="Grid Image" value={data.infoGrid?.img} onChange={v => set('infoGrid', { ...data.infoGrid, img: v })} />
        <Field label="4 Info Points (comma separated)"><TextArea value={(data.infoGrid?.points || []).join(', ')} onChange={v => set('infoGrid', { ...data.infoGrid, points: v.split(',')})} rows={2} /></Field>
      </div>
    </div>
  ),

  inner_page_hero: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <Field label="Theme Identifier (e.g. Furniture, Sports)"><TextInput value={data.theme} onChange={v => set('theme', v)} placeholder="Furniture" /></Field>
        <Field label="Badge"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="2025 Collection" /></Field>
        <Field label="Icon Logo Name (e.g. Sofa, Shield)"><TextInput value={data.badgeIcon} onChange={v => set('badgeIcon', v)} placeholder="Sofa" /></Field>
        <Field label="Title HTML"><TextArea value={data.titleHtml} onChange={v => set('titleHtml', v)} rows={3} /></Field>
        <Field label="Subtitle"><TextArea value={data.subtitle} onChange={v => set('subtitle', v)} rows={2} /></Field>
        <div className="flex gap-2">
          {['image', 'video'].map(mode => (
            <button key={mode} onClick={() => set('mediaType', mode)} className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${data.mediaType === mode || (!data.mediaType && mode === 'image') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-200'}`}>{mode}</button>
          ))}
        </div>
        <MediaUpload label="Hero Media" value={data.mediaUrl || data.img} onChange={v => set('mediaUrl', v)} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
         <h4 className="font-bold text-gray-800 text-sm">Dark Block</h4>
         <Field label="Title"><TextInput value={data.darkBlock?.title} onChange={v => set('darkBlock', { ...data.darkBlock, title: v })} /></Field>
         <Field label="Subtitle"><TextInput value={data.darkBlock?.subtitle} onChange={v => set('darkBlock', { ...data.darkBlock, subtitle: v })} /></Field>
      </div>
    </div>
  ),

  contact_page_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Left Hero</h4>
        <Field label="Badge"><TextInput value={data.hero?.badge} onChange={v => set('hero', { ...data.hero, badge: v })} /></Field>
        <Field label="Title HTML"><TextArea value={data.hero?.titleHtml} onChange={v => set('hero', { ...data.hero, titleHtml: v })} rows={3} /></Field>
        <Field label="Subtitle"><TextArea value={data.hero?.subtitle} onChange={v => set('hero', { ...data.hero, subtitle: v })} rows={2} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><TextInput value={data.hero?.email} onChange={v => set('hero', { ...data.hero, email: v })} /></Field>
          <Field label="Phone"><TextInput value={data.hero?.phone} onChange={v => set('hero', { ...data.hero, phone: v })} /></Field>
        </div>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Quote Box Text</h4>
        <Field label="Title"><TextInput value={data.quoteBox?.title} onChange={v => set('quoteBox', { ...data.quoteBox, title: v })} /></Field>
        <Field label="Subtitle"><TextInput value={data.quoteBox?.subtitle} onChange={v => set('quoteBox', { ...data.quoteBox, subtitle: v })} /></Field>
        <Field label="Button Text"><TextInput value={data.quoteBox?.btnText} onChange={v => set('quoteBox', { ...data.quoteBox, btnText: v })} /></Field>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Access Cards (Max 4)</h4>
        {(data.accessCards || []).map((card, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
            <button onClick={() => set('accessCards', data.accessCards.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
            <div className="flex gap-2">
              <TextInput value={card.t} onChange={v => { const ts = [...data.accessCards]; ts[i] = { ...ts[i], t: v }; set('accessCards', ts); }} placeholder="Title" />
              <TextInput value={card.i} onChange={v => { const ts = [...data.accessCards]; ts[i] = { ...ts[i], i: v }; set('accessCards', ts); }} placeholder="Icon (Video/Calendar/MapPin/Clock)" />
            </div>
            <TextInput value={card.d} onChange={v => { const ts = [...data.accessCards]; ts[i] = { ...ts[i], d: v }; set('accessCards', ts); }} placeholder="Description" />
            <TextInput value={card.c} onChange={v => { const ts = [...data.accessCards]; ts[i] = { ...ts[i], c: v }; set('accessCards', ts); }} placeholder="Color Classes (e.g. bg-blue-50 text-blue-600)" />
          </div>
        ))}
        <button onClick={() => set('accessCards', [...(data.accessCards||[]), { t: '', i: 'Sparkles', d: '', c: 'bg-gray-50 text-gray-600' }])} className="text-blue-500 text-xs font-bold">+ Add Card</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">FAQ Section</h4>
        <div className="grid grid-cols-2 gap-3 mb-2">
           <Field label="Heading"><TextInput value={data.faq?.title} onChange={v => set('faq', { ...data.faq, title: v })} /></Field>
           <Field label="Subheading"><TextInput value={data.faq?.subtitle} onChange={v => set('faq', { ...data.faq, subtitle: v })} /></Field>
        </div>
        {(data.faq?.items || []).map((faq, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
            <button onClick={() => { const ts = [...(data.faq?.items||[])]; ts.splice(i, 1); set('faq', { ...data.faq, items: ts }); }} className="absolute text-red-400 hover:text-red-600 top-2 right-2"><Trash2 size={13}/></button>
            <TextInput value={faq.q} onChange={v => { const ts = [...data.faq.items]; ts[i] = { ...ts[i], q: v }; set('faq', { ...data.faq, items: ts }); }} placeholder="Question" />
            <TextArea value={faq.a} onChange={v => { const ts = [...data.faq.items]; ts[i] = { ...ts[i], a: v }; set('faq', { ...data.faq, items: ts }); }} placeholder="Answer" rows={2} />
          </div>
        ))}
        <button onClick={() => set('faq', { ...data.faq, items: [...(data.faq?.items||[]), { q: '', a: '' }] })} className="text-blue-500 text-xs font-bold">+ Add FAQ Item</button>
      </div>
    </div>
  ),

  sidebar_categories: ({ data, set }) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <h4 className="font-bold text-gray-800 text-sm">Category Sidebar Tabs</h4>
      <p className="text-[10px] text-gray-500 font-medium">Add the subcategories/filters you want to display on the left sidebar.</p>
      {(data.categories || []).map((cat, i) => (
        <div key={i} className="flex gap-2">
          <TextInput 
            value={cat} 
            onChange={v => { 
                const cs = [...data.categories]; 
                cs[i] = v; 
                set('categories', cs); 
            }} 
            placeholder="e.g. CLASSROOM" 
          />
          <button onClick={() => set('categories', data.categories.filter((_, j) => j !== i))} className="text-red-400 p-2 hover:bg-red-50 rounded"><Trash2 size={13}/></button>
        </div>
      ))}
      <button 
        onClick={() => set('categories', [...(data.categories || []), 'New Tab'])} 
        className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:underline"
      >
        <Plus size={13} /> Add Tab
      </button>
    </div>
  ),
};

// Fallback: generic key-value editor for unknown block types
const GenericForm = ({ data, set }) => (
  <div className="space-y-3">
    {Object.entries(data || {}).map(([key, val]) => (
      <Field key={key} label={key.replace(/_/g, ' ')}>
        {typeof val === 'boolean'
          ? <Toggle label={val ? 'Enabled' : 'Disabled'} value={val} onChange={v => set(key, v)} />
          : typeof val === 'object'
          ? <TextArea rows={4} value={JSON.stringify(val, null, 2)} onChange={v => { try { set(key, JSON.parse(v)); } catch {} }} />
          : <TextInput value={String(val)} onChange={v => set(key, v)} />
        }
      </Field>
    ))}
  </div>
);

// ── Single block editor ────────────────────────────────────────────────────────
function BlockEditor({ slug, block, onSaved }) {
  const [localData, setLocalData] = useState(block.data || {});
  const [visible, setVisible] = useState(block.isVisible !== false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const setField = (key, value) => setLocalData(prev => ({ ...prev, [key]: value }));

  const sanitizeData = (data) => {
    const clean = { ...data };
    Object.keys(clean).forEach(key => {
      const val = clean[key];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
        // Clean up array of strings (e.g. ticker items, menu links)
        clean[key] = val.map(s => s.trim()).filter(Boolean);
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        // Deep clean nested objects (like infoGrid)
        clean[key] = sanitizeData(val);
      }
    });
    return clean;
  };

  const save = async () => {
    setSaving(true);
    try {
      const sanitized = sanitizeData(localData);
      await updateBlock(slug, block._id, { data: sanitized, isVisible: visible });
      clearCMSCache(slug); // bust cache so website fetches fresh data
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete the "${block.blockType}" block?`)) return;
    clearCMSCache(slug); // bust cache on delete too
    await deleteBlock(slug, block._id);
    onSaved();
  };

  const FormComponent = BlockForms[block.blockType];

  const BLOCK_LABELS = {
    topbar: '📋 Top Bar', navbar: '🔗 Navigation Bar', ticker: '📢 News Ticker',
    hero: '🖼️ Hero / Banner', page_hero: '🖼️ Page Hero', cta_whatsapp: '💬 WhatsApp CTA',
    tiles: '🟦 Masonry Tiles', solutions: '🔵 Solutions / Circles', feature_cards: '📦 Top Highlight Cards (Static)',
    partners: '🤝 School Partners', sidebar_trending: '🔥 Trending Sidebar', sidebar_resources: '📚 Resources Sidebar',
    sidebar_banners: '🟧 Sidebar Banners', sidebar_categories: '📑 Sidebar Tabs', about_hero: '👋 About Hero', stats: '📊 Statistics',
    mission_vision: '🎯 Mission & Vision (OLD)', about_philosophy: '🧠 Philosophy & Team Photo', journey: '⏳ Journey Timeline',
    contact_info: '📞 Contact Info', text_content: '📝 Text Content',
    catalogues_list: '📁 Catalogues List', guides_list: '📖 Guides List',
    feature_card: '🎴 Dynamic Feature Card (Color/Text)',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Block Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="flex-1">
          <span className="font-black text-gray-800 text-lg">{BLOCK_LABELS[block.blockType] || block.blockType}</span>
          <div className="flex items-center gap-2 mt-1">
            <CSVImporter blockType={block.blockType} onImport={setLocalData} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setVisible(v => !v); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${visible ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`} title={visible ? 'Visible on site' : 'Hidden from site'}>
            {visible ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
          </button>
          <button onClick={remove} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors" title="Delete block">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Block Body */}
      <div className="p-6">
        {FormComponent
          ? <FormComponent data={localData} set={setField} />
          : <GenericForm data={localData} set={setField} />
        }

        <div className="mt-8 flex items-center justify-between pt-5 border-t border-gray-100">
          <Toggle label="Show block on website" value={visible} onChange={setVisible} />
          <button onClick={save} disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all disabled:opacity-60 shadow-lg ${saved ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'}`}>
            <Save size={16} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page editor ───────────────────────────────────────────────────────────────

// What block types each page slug is allowed to use (matches what the frontend actually reads)
const PAGE_ALLOWED_BLOCKS = {
  home:        ['hero', 'product_carousel', 'tiles', 'solutions', 'sidebar_trending', 'sidebar_resources', 'sidebar_banners', 'cta_whatsapp', 'partners', 'topbar', 'navbar', 'ticker'],
  furniture:   ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  architecture:['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  digital:     ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  sports:      ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  libraries:   ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  labs:        ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  mathematics: ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  science:     ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  design:      ['inner_page_hero', 'feature_card', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
  manufacturing:['inner_page_hero', 'feature_card', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp', 'text_content'],
  corporate:   ['inner_page_hero', 'feature_card', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp', 'text_content'],
  environments:['environments_page_content', 'feature_card'],
  catalogues:  ['catalogues_page_content', 'catalogues_list', 'feature_card'],
  guides:      ['guides_page_content', 'guides_list', 'feature_card'],
  aboutus:     ['about_hero', 'stats', 'about_philosophy', 'journey'],
  'contact-us':['contact_page_content', 'contact_info'],
};

function PageEditor({ slug }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBlockType, setNewBlockType] = useState('');
  const [adding, setAdding] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);

  const load = () => {
    setLoading(true);
    getPage(slug).then(p => {
      setPage(p);
      if (p?.blocks?.length > 0 && !activeBlockId) {
        setActiveBlockId(p.blocks.sort((a,b) => a.order - b.order)[0]._id);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [slug]);

  const addNewBlock = async () => {
    if (!newBlockType) return;
    setAdding(true);
    try {
      await addBlock(slug, { blockType: newBlockType, order: (page?.blocks?.length || 0), data: {} });
      setNewBlockType('');
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const BLOCK_LABELS = {
    topbar: '📋 Top Bar',
    navbar: '🔗 Navigation Bar',
    ticker: '📢 News Ticker',
    hero: '🖼️ Home Hero / Banner',
    product_carousel: '🛒 Slidable Product Carousel',
    inner_page_hero: '🖼️ Page Hero & Image',
    cta_whatsapp: '💬 WhatsApp CTA',
    tiles: '🟦 Masonry Tiles Grid',
    solutions: '🔵 Solutions Circles',
    partners: '🤝 Partner Schools',
    sidebar_trending: '🔥 Sidebar – Trending',
    sidebar_resources: '📚 Sidebar – Resources',
    sidebar_banners: '🟧 Sidebar – Banners',
    sidebar_categories: '📑 Sidebar – Category Tabs',
    about_hero: '👋 About Page Hero',
    stats: '📊 Statistics',
    mission_vision: '🎯 Mission & Vision (OLD)',
    about_philosophy: '🧠 About – Philosophy & Team Photo',
    journey: '⏳ About – Journey Timeline',
    contact_info: '📞 Contact Info',
    text_content: '📝 Text Content',
    catalogues_page_content: '📄 Catalogues Page Content',
    catalogues_list: '📁 Catalogues List',
    environments_page_content: '🌿 Environments Page Content',
    guides_page_content: '📖 Guides Page Content',
    guides_list: '📋 Guides List',
    contact_page_content: '✉️ Contact Page Content',
    feature_card: '🎴 Dynamic Feature Card (Color/Text)',
  };

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!page) return <div className="py-12 text-center text-red-400 bg-red-50 rounded-2xl"><p className="font-bold">Page not found in database</p><p className="text-xs mt-1">Run <code className="bg-red-100 px-1 rounded">npm run seed</code> from the backend folder</p></div>;

  const allowedTypes = PAGE_ALLOWED_BLOCKS[slug] || [];
  const sortedBlocks = [...(page.blocks || [])]
    .filter(b => allowedTypes.includes(b.blockType))
    .sort((a, b) => a.order - b.order);
  const activeBlock = sortedBlocks.find(b => b._id === activeBlockId) || sortedBlocks[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{page.pageTitle}</h3>
          <p className="text-sm text-gray-400 font-medium">{sortedBlocks.length} sections on this page</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar: Block List */}
        <div className="w-full lg:w-64 shrink-0 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Page Sections</h4>
            </div>
            <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {sortedBlocks.map((b, i) => (
                <button
                  key={b._id}
                  onClick={() => setActiveBlockId(b._id)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors group ${activeBlockId === b._id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 w-4">{i + 1}.</span>
                    <span className={`text-sm truncate font-semibold ${activeBlockId === b._id ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {BLOCK_LABELS[b.blockType] || b.blockType}
                    </span>
                  </div>
                  {!b.isVisible && <EyeOff size={12} className="text-gray-400 shrink-0 ml-2" title="Hidden" />}
                  {activeBlockId === b._id && <ChevronRight size={14} className="text-blue-500 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* Add block form — only shows block types that this page's frontend actually reads */}
          {(() => {
            const existingTypes = new Set(sortedBlocks.map(b => b.blockType));
            const allowed = PAGE_ALLOWED_BLOCKS[slug] || [];
            const addable = allowed.filter(t => !existingTypes.has(t));
            return addable.length > 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Missing Section</p>
                <select
                  value={newBlockType}
                  onChange={e => setNewBlockType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select section...</option>
                  {addable.map(t => (
                    <option key={t} value={t}>
                      {BLOCK_LABELS[t] || t}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addNewBlock}
                  disabled={adding || !newBlockType}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black disabled:opacity-50 transition-colors"
                >
                  <Plus size={14} /> {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-400 font-medium">✅ All sections for this page are present</p>
              </div>
            );
          })()}
        </div>

        {/* Right Content: Active Block Editor */}
        <div className="flex-1 min-w-0 w-full">
          {activeBlock ? (
            <BlockEditor key={activeBlock._id} slug={slug} block={activeBlock} onSaved={load} />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-4xl mb-2">👈</p>
              <p className="text-gray-500 font-medium">Select a section from the left to edit</p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Inner Page Cards Manager (always show to allow site-wide product editing) */}
      {true && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <Layers size={16} />
                </span>
                Manage Catalog Products ({page?.pageTitle || slug})
              </h3>
              <p className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                These are the dynamic products that appear under the sidebar tabs at the bottom of the page.
              </p>
            </div>
          </div>
          <div className="p-6 bg-slate-50/30">
            {(() => {
              const liveCats = page?.blocks?.find(b => b.blockType === 'sidebar_categories')?.data?.categories || [];
              return <ProductManager fixedPage={page?.pageTitle} liveCategories={liveCats} />;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main CMS Editor ───────────────────────────────────────────────────────────
const PAGE_ICONS = {
  home: '🏠', furniture: '🪑', architecture: '🏗️', digital: '💻', sports: '🏅',
  libraries: '📚', environments: '🌿', aboutus: 'ℹ️', 'contact-us': '📞',
  mathematics: '📐', science: '🔬', labs: '🧪', design: '🎨',
  manufacturing: '🏭', corporate: '🏢', catalogues: '📁', guides: '📖',
};

export default function CMSEditor() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Support ?page= deep-link from dashboard
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('page');
    if (p) setSelected(p);
  }, []);

  useEffect(() => {
    getAllPages().then(setPages).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  const cataloguePages = ['furniture', 'architecture', 'digital', 'sports', 'libraries', 'labs', 'mathematics', 'science', 'design'];

  return (
    <div>
      {/* Page Selector Grid */}
      {!selected && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-800 mb-1">Choose a page to edit</h2>
              <p className="text-sm text-gray-400">Select any page below to edit its content blocks with form fields</p>
            </div>
            <button 
              onClick={() => {
                if(!confirm('This will automatically add missing sections to all 17 pages. Continue?')) return;
                setLoading(true);
                standardizeAllBlocks()
                  .then(() => { alert('Standardization complete! All pages are now ready.'); window.location.reload(); })
                  .catch(err => { alert(err.message); setLoading(false); });
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              🔄 Fix All Page Sections
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pages.map(p => (
              <button key={p.pageSlug} onClick={() => setSelected(p.pageSlug)}
                className="bg-white rounded-2xl border border-gray-200 p-5 text-left hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <span className="text-3xl block mb-2">{PAGE_ICONS[p.pageSlug] || '📄'}</span>
                <p className="font-black text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{p.pageTitle}</p>
                <p className="text-[10px] text-gray-400 mt-1">/{p.pageSlug}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      {selected && (
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setSelected(null)} className="text-blue-600 font-bold text-sm hover:underline">← All Pages</button>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-bold text-gray-600">{pages.find(p => p.pageSlug === selected)?.pageTitle || selected}</span>
          </div>
          <PageEditor slug={selected} />
        </div>
      )}
    </div>
  );
}
