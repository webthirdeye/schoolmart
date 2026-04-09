// src/pages/admin/CMSEditor.jsx
// Form-field based CMS editor — proper inputs for every block type
import { useEffect, useState } from 'react';
import { getAllPages, getPage, updateBlock, addBlock, deleteBlock, standardizeAllBlocks, uploadFile } from '../../services/api';
import { clearCMSCache } from '../../hooks/useCMSBlock';
import { ChevronDown, ChevronRight, Trash2, Plus, Eye, EyeOff, Save, GripVertical, Image as ImageIcon, Link2, Type, List, ToggleLeft, Upload, Layers } from 'lucide-react';
import ProductManager from './ProductManager';
import ImageUpload from '../../components/admin/ImageUpload';
import MediaUpload from '../../components/admin/MediaUpload';
import FileUpload from '../../components/admin/FileUpload';

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
    case 'cta_whatsapp': {
      const r = rows[0];
      return { badge: r.badge, headline: r.headline, description: r.description, whatsappNumber: r.whatsappNumber, phone: r.phone };
    }
    case 'partners':
      return { heading: rows[0].heading, subheading: rows[0].subheading, clients: rows.map(r => ({ name: r.name, icon: r.icon, color: r.color })) };
    case 'inner_page_hero': {
        const r = rows[0];
        return { theme: r.theme, badge: r.badge, badgeIcon: r.badgeIcon, titleHtml: r.titleHtml, subtitle: r.subtitle, mediaType: r.mediaType || 'image', mediaUrl: r.mediaUrl || r.img };
    }
    case 'about_hero': {
        const r = rows[0];
        return { title: r.title, subtitle: r.subtitle, description: r.description, mediaType: r.mediaType || 'image', mediaUrl: r.mediaUrl || r.img };
    }
    case 'about_philosophy': {
        const r = rows[0];
        return { title: r.title, statement: r.statement, teamImg: r.teamImg };
    }
    case 'stats':
        return { stats: rows.map(r => ({ value: r.value, label: r.label, icon: r.icon })) };
    case 'journey':
        return { title: rows[0].title, steps: rows.map(r => ({ y: r.y, t: r.t, d: r.d })) };
    case 'default_hero_page':
        return { title: rows[0].title, subtitle: rows[0].subtitle, img: rows[0].img };
    case 'sidebar_categories':
        return { categories: rows.map(r => ({ name: r.name, icon: r.icon })) };

    case 'feature_card': 
        return { title: rows[0].title, subtitle: rows[0].subtitle, btnLabel: rows[0].btnLabel, bgColor: rows[0].bgColor, btnColor: rows[0].btnColor, btnPath: rows[0].btnPath, icon: rows[0].icon };
    case 'action_strip':
        return { title: rows[0].title, subtitle: rows[0].subtitle, downloadPath: rows[0].downloadPath, bgColor: rows[0].bgColor };
    case 'grid_heading':
        return { leftHeading: rows[0].leftHeading, rightStat: rows[0].rightStat };
    case 'info_split_grid':
        return { titleHtml: rows[0].titleHtml, description: rows[0].description, points: rows.map(r => r.point).filter(Boolean), btnLabel: rows[0].btnLabel, btnPath: rows[0].btnPath, img: rows[0].img };
    case 'action_stack':
        return { cards: rows.map(r => ({ title: r.title, subtitle: r.subtitle, icon: r.icon, link: r.link, bgColor: r.bgColor })) };
    case 'feature_blocks':
        return { blocks: rows.map(r => ({ title: r.title, subtitle: r.subtitle, icon: r.icon, bgColor: r.bgColor, textColor: r.textColor })) };
    case 'listings':
      return { items: rows.map(r => ({ type: r.type, location: r.location, title: r.title, rating: r.rating, description: r.description, price: r.price, runRate: r.runRate, margin: r.margin })) };
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
    case 'feature_card': headers = ['title', 'subtitle', 'btnLabel', 'bgColor', 'btnColor', 'btnPath', 'icon']; break;
    case 'action_strip': headers = ['title', 'subtitle', 'downloadPath', 'bgColor']; break;
    case 'grid_heading': headers = ['leftHeading', 'rightStat']; break;
    case 'info_split_grid': headers = ['titleHtml', 'description', 'point', 'btnLabel', 'btnPath', 'img']; break;
    case 'action_stack': headers = ['title', 'subtitle', 'icon', 'link', 'bgColor']; break;
    case 'feature_blocks': headers = ['title', 'subtitle', 'icon', 'bgColor', 'textColor']; break;
    case 'listings': headers = ['type', 'location', 'title', 'rating', 'description', 'price', 'runRate', 'margin']; break;
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
        <Field label="Theme Identifier (e.g. Furniture, Sports)"><TextInput value={data.theme} onChange={v => set('theme', v)} placeholder="Furniture" /></Field>
        <Field label="Badge Icon (Lucide)"><TextInput value={data.badgeIcon} onChange={v => set('badgeIcon', v)} placeholder="Zap" /></Field>
      </div>
      <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="New Launch 2025" /></Field>
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
        <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
          <TextInput value={s.value} onChange={v => { const t = [...data.stats]; t[i] = { ...t[i], value: v }; set('stats', t); }} placeholder="1200+" className="w-24" />
          <TextInput value={s.label} onChange={v => { const t = [...data.stats]; t[i] = { ...t[i], label: v }; set('stats', t); }} placeholder="Products" />
          <TextInput value={s.icon} onChange={v => { const t = [...data.stats]; t[i] = { ...s[i], icon: v }; set('stats', t); }} placeholder="Icon (Clock/Users)" className="w-32" />
          <button onClick={() => set('stats', data.stats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => set('stats', [...(data.stats || []), { value: '', label: '', icon: 'Users' }])}
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



  catalogues_list: ({ data, set }) => (
    <div className="space-y-3">
      {(data.catalogues || []).map((c, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Catalogue {i + 1}</span>
            <button onClick={() => set('catalogues', data.catalogues.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={c.title} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], title: v }; set('catalogues', t); }} placeholder="Catalogue Title" />
          <TextArea rows={2} value={c.category || c.description} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], category: v, description: v }; set('catalogues', t); }} placeholder="Category / Description..." />
          <FileUpload label={`PDF / Document (Catalogue ${i + 1})`} value={c.fileUrl} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], fileUrl: v }; set('catalogues', t); }} />
          <ImageUpload label="Thumbnail" value={c.img} onChange={v => { const t = [...data.catalogues]; t[i] = { ...t[i], img: v }; set('catalogues', t); }} />
        </div>
      ))}
      <button onClick={() => set('catalogues', [...(data.catalogues || []), { title: '', category: '', description: '', fileUrl: '#', img: '' }])}
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
        <ImageUpload label="Grid Image" value={data.infoGrid?.img} onChange={v => set('infoGrid', { ...data.infoGrid, img: v })} />
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
        <h4 className="font-bold text-gray-800 text-sm">Environment Case Studies ({(data.masonryItems || []).length})</h4>
        {(data.masonryItems || []).map((m, i) => (
          <details key={i} className="border border-gray-200 rounded-xl bg-white relative group">
            <summary className="p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-700">{m.t || `Item ${i + 1}`} <span className="text-gray-400 font-medium">— {m.c || 'No category'}</span></span>
              <button onClick={(e) => { e.preventDefault(); set('masonryItems', data.masonryItems.filter((_,j) => j !== i)); }} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={13}/></button>
            </summary>
            <div className="p-4 pt-2 space-y-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <TextInput value={m.t} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], t: v }; set('masonryItems', ts); }} placeholder="Title (e.g. Natural Light)" />
                <TextInput value={m.c} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], c: v }; set('masonryItems', ts); }} placeholder="Category (e.g. Optics)" />
              </div>
              <ImageUpload label="Card / Hero Image" value={m.img} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], img: v }; set('masonryItems', ts); }} />
              <div className="pt-3 border-t border-dashed border-gray-100">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">Inner Page Fields</p>
                <Field label="Badge"><TextInput value={m.badge} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], badge: v }; set('masonryItems', ts); }} placeholder="Case Study 2025" /></Field>
                <Field label="Description"><TextArea rows={3} value={m.description} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], description: v }; set('masonryItems', ts); }} placeholder="Designing a high-performance educational dining environment..." /></Field>
                <div className="mt-2 space-y-2">
                  <p className="text-[10px] font-bold text-gray-500">Spec Cards ({(m.specs || []).length})</p>
                  {(m.specs || []).map((spec, si) => (
                    <div key={si} className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg">
                      <div className="flex-1 space-y-1">
                        <TextInput value={spec.t} onChange={v => { const ts = [...data.masonryItems]; const sp = [...(ts[i].specs||[])]; sp[si] = { ...sp[si], t: v }; ts[i] = { ...ts[i], specs: sp }; set('masonryItems', ts); }} placeholder="Spec title" />
                        <TextInput value={spec.d} onChange={v => { const ts = [...data.masonryItems]; const sp = [...(ts[i].specs||[])]; sp[si] = { ...sp[si], d: v }; ts[i] = { ...ts[i], specs: sp }; set('masonryItems', ts); }} placeholder="Spec description" />
                      </div>
                      <button onClick={() => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], specs: (ts[i].specs||[]).filter((_,k)=>k!==si) }; set('masonryItems', ts); }} className="text-red-400 shrink-0 mt-1"><Trash2 size={12}/></button>
                    </div>
                  ))}
                  <button onClick={() => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], specs: [...(ts[i].specs||[]), { t: '', d: '' }] }; set('masonryItems', ts); }} className="text-blue-500 text-[10px] font-bold">+ Add Spec</button>
                </div>
                <Field label="Technical Details (one per line)">
                  <TextArea rows={4} value={(m.technicalDetails || []).join('\n')} onChange={v => { const ts = [...data.masonryItems]; ts[i] = { ...ts[i], technicalDetails: v.split('\n').filter(Boolean) }; set('masonryItems', ts); }} placeholder={"Stainless Steel 304 Grade\nComposite ceiling panels"} />
                </Field>
              </div>
            </div>
          </details>
        ))}
        <button onClick={() => set('masonryItems', [...(data.masonryItems||[]), { t: '', c: '', img: '', h: 'h-[250px]', badge: '', description: '', specs: [], technicalDetails: [] }])} className="text-blue-500 text-xs font-bold">+ Add Case Study</button>
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
        <h4 className="font-bold text-gray-800 text-sm">Strategy Guide Cards ({(data.caseStudies || []).length})</h4>
        {(data.caseStudies || []).map((r, i) => (
          <details key={i} className="border border-gray-200 rounded-xl bg-white relative group">
            <summary className="p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-700">{r.t || `Guide ${i + 1}`} <span className="text-gray-400 font-medium">— {r.c || 'No category'}</span></span>
              <button onClick={(e) => { e.preventDefault(); set('caseStudies', data.caseStudies.filter((_,j) => j !== i)); }} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={13}/></button>
            </summary>
            <div className="p-4 pt-2 space-y-3 border-t border-gray-100">
              <div className="flex gap-2">
                <TextInput value={r.t} onChange={v => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], t: v }; set('caseStudies', ts); }} placeholder="Guide Title" />
                <TextInput value={r.c} onChange={v => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], c: v }; set('caseStudies', ts); }} placeholder="Category" />
              </div>
              <ImageUpload label="Card / Hero Image" value={r.img} onChange={v => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], img: v }; set('caseStudies', ts); }} />
              <div className="pt-3 border-t border-dashed border-gray-100">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">Inner Page Fields</p>
                <Field label="Badge"><TextInput value={r.badge} onChange={v => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], badge: v }; set('caseStudies', ts); }} placeholder="Strategic Guide 2025" /></Field>
                <Field label="Introduction"><TextArea rows={3} value={r.intro} onChange={v => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], intro: v }; set('caseStudies', ts); }} placeholder="The decision to enroll a child..." /></Field>
                <div className="mt-2 space-y-2">
                  <p className="text-[10px] font-bold text-gray-500">Steps ({(r.steps || []).length})</p>
                  {(r.steps || []).map((step, si) => (
                    <div key={si} className="bg-gray-50 p-3 rounded-lg space-y-1 relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Step {si + 1}</span>
                        <button onClick={() => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], steps: (ts[i].steps||[]).filter((_,k)=>k!==si) }; set('caseStudies', ts); }} className="text-red-400"><Trash2 size={11}/></button>
                      </div>
                      <TextInput value={step.title} onChange={v => { const ts = [...data.caseStudies]; const st = [...(ts[i].steps||[])]; st[si] = { ...st[si], title: v }; ts[i] = { ...ts[i], steps: st }; set('caseStudies', ts); }} placeholder="Step title" />
                      <TextArea rows={2} value={step.content} onChange={v => { const ts = [...data.caseStudies]; const st = [...(ts[i].steps||[])]; st[si] = { ...st[si], content: v }; ts[i] = { ...ts[i], steps: st }; set('caseStudies', ts); }} placeholder="Content..." />
                      <TextInput value={step.insight} onChange={v => { const ts = [...data.caseStudies]; const st = [...(ts[i].steps||[])]; st[si] = { ...st[si], insight: v }; ts[i] = { ...ts[i], steps: st }; set('caseStudies', ts); }} placeholder="Insight quote" />
                      <TextInput value={step.action} onChange={v => { const ts = [...data.caseStudies]; const st = [...(ts[i].steps||[])]; st[si] = { ...st[si], action: v }; ts[i] = { ...ts[i], steps: st }; set('caseStudies', ts); }} placeholder="Action point" />
                    </div>
                  ))}
                  <button onClick={() => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], steps: [...(ts[i].steps||[]), { title: '', content: '', insight: '', action: '' }] }; set('caseStudies', ts); }} className="text-blue-500 text-[10px] font-bold">+ Add Step</button>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-[10px] font-bold text-gray-500">Summary Points ({(r.summaryPoints || []).length})</p>
                  {(r.summaryPoints || []).map((pt, pi) => (
                    <div key={pi} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
                      <TextInput value={pt.t} onChange={v => { const ts = [...data.caseStudies]; const sp = [...(ts[i].summaryPoints||[])]; sp[pi] = { ...sp[pi], t: v }; ts[i] = { ...ts[i], summaryPoints: sp }; set('caseStudies', ts); }} placeholder="Label" />
                      <TextInput value={pt.icon} onChange={v => { const ts = [...data.caseStudies]; const sp = [...(ts[i].summaryPoints||[])]; sp[pi] = { ...sp[pi], icon: v }; ts[i] = { ...ts[i], summaryPoints: sp }; set('caseStudies', ts); }} placeholder="Icon" />
                      <button onClick={() => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], summaryPoints: (ts[i].summaryPoints||[]).filter((_,k)=>k!==pi) }; set('caseStudies', ts); }} className="text-red-400 shrink-0"><Trash2 size={11}/></button>
                    </div>
                  ))}
                  <button onClick={() => { const ts = [...data.caseStudies]; ts[i] = { ...ts[i], summaryPoints: [...(ts[i].summaryPoints||[]), { t: '', icon: 'Star' }] }; set('caseStudies', ts); }} className="text-blue-500 text-[10px] font-bold">+ Add Point</button>
                </div>
              </div>
            </div>
          </details>
        ))}
        <button onClick={() => set('caseStudies', [...(data.caseStudies||[]), { t: '', c: '', img: '', badge: '', intro: '', steps: [], summaryPoints: [] }])} className="text-blue-500 text-xs font-bold">+ Add Guide Card</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Featured Article (Editorial Breakout)</h4>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title"><TextInput value={data.featured?.t} onChange={v => set('featured', { ...data.featured, t: v })} placeholder="The Parent's Magnet" /></Field>
          <Field label="Category"><TextInput value={data.featured?.c} onChange={v => set('featured', { ...data.featured, c: v })} placeholder="Enrollment Strategy" /></Field>
        </div>
        <Field label="Description"><TextArea value={data.featured?.d} onChange={v => set('featured', { ...data.featured, d: v })} rows={3} placeholder="How to redesign your school identity..." /></Field>
        <Field label="Tags (comma separated)"><TextInput value={(data.featured?.tags || []).join(', ')} onChange={v => set('featured', { ...data.featured, tags: v.split(',').map(s => s.trim()) })} placeholder="Branding, Admissions, Psychology" /></Field>
        <ImageUpload label="Featured Image" value={data.featured?.img} onChange={v => set('featured', { ...data.featured, img: v })} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Bottom Grid Section</h4>
        <Field label="Title HTML"><TextInput value={data.infoGrid?.titleHtml} onChange={v => set('infoGrid', { ...data.infoGrid, titleHtml: v })} /></Field>
        <ImageUpload label="Grid Image" value={data.infoGrid?.img} onChange={v => set('infoGrid', { ...data.infoGrid, img: v })} />
        <Field label="4 Info Points (comma separated)"><TextArea value={(data.infoGrid?.points || []).join(', ')} onChange={v => set('infoGrid', { ...data.infoGrid, points: v.split(',')})} rows={2} /></Field>
      </div>
    </div>
  ),

  corporate_page_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Hero Branding</h4>
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
        <h4 className="font-bold text-gray-800 text-sm">Strategic Capabilities</h4>
        {(data.capabilities || []).map((item, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
             <button onClick={() => set('capabilities', data.capabilities.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
             <TextInput value={item.t} onChange={v => { const ts = [...data.capabilities]; ts[i] = { ...ts[i], t: v }; set('capabilities', ts); }} placeholder="Capability Title" />
             <TextInput value={item.d} onChange={v => { const ts = [...data.capabilities]; ts[i] = { ...ts[i], d: v }; set('capabilities', ts); }} placeholder="Description" />
          </div>
        ))}
        <button onClick={() => set('capabilities', [...(data.capabilities||[]), { t: '', d: '' }])} className="text-blue-500 text-xs font-bold">+ Add Capability</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Final CTA</h4>
        <Field label="Large Heading"><TextArea value={data.cta?.titleHtml} onChange={v => set('cta', { ...data.cta, titleHtml: v })} rows={2} /></Field>
        <Field label="Button Text"><TextInput value={data.cta?.btnText} onChange={v => set('cta', { ...data.cta, btnText: v })} /></Field>
      </div>
    </div>
  ),

  manufacturing_page_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Main Hero</h4>
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
        <h4 className="font-bold text-gray-800 text-sm">Grid Cards (Robotic, CNC, etc.)</h4>
        {(data.cards || []).map((card, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
             <button onClick={() => set('cards', data.cards.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
             <TextInput value={card.name} onChange={v => { const ts = [...data.cards]; ts[i] = { ...ts[i], name: v }; set('cards', ts); }} placeholder="Card Title" />
             <TextInput value={card.subcategory} onChange={v => { const ts = [...data.cards]; ts[i] = { ...ts[i], subcategory: v }; set('cards', ts); }} placeholder="Subtitle/Tag" />
             <ImageUpload label="Image" value={card.image} onChange={v => { const ts = [...data.cards]; ts[i] = { ...ts[i], image: v }; set('cards', ts); }} />
          </div>
        ))}
        <button onClick={() => set('cards', [...(data.cards||[]), { name: '', subcategory: '', image: '' }])} className="text-blue-500 text-xs font-bold">+ Add Card</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Industrial Bottom Grid</h4>
        <Field label="Heading HTML"><TextInput value={data.infoGrid?.titleHtml} onChange={v => set('infoGrid', { ...data.infoGrid, titleHtml: v })} /></Field>
        <ImageUpload label="Grid Image" value={data.infoGrid?.img} onChange={v => set('infoGrid', { ...data.infoGrid, img: v })} />
        <Field label="4 Specs (comma separated)"><TextArea value={(data.infoGrid?.points || []).join(', ')} onChange={v => set('infoGrid', { ...data.infoGrid, points: v.split(',')})} rows={2} /></Field>
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

  listings: ({ data, set }) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <h4 className="font-bold text-gray-800 text-sm">Opportunities List</h4>
      {(data.items || []).map((item, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
          <button onClick={() => set('items', data.items.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400"><Trash2 size={13}/></button>
          <TextInput value={item.title} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], title: v }; set('items', ts); }} placeholder="Title" />
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={item.location} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], location: v }; set('items', ts); }} placeholder="Location" />
            <select value={item.type} onChange={e => { const ts = [...data.items]; ts[i] = { ...ts[i], type: e.target.value }; set('items', ts); }} className="border rounded text-xs px-2">
              <option value="Lease">Lease</option>
              <option value="Sale">Sale</option>
              <option value="Franchise">Franchise</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={item.size} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], size: v }; set('items', ts); }} placeholder="Size" />
            <TextInput value={item.price} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], price: v }; set('items', ts); }} placeholder="Price/Contact" />
          </div>
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items||[]), { title: '', location: '', type: 'Lease', size: '', price: '' }])} className="text-blue-500 font-bold text-xs">+ Add Listing</button>
    </div>
  ),

  environment_post_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Post Hero</h4>
        <Field label="Title"><TextInput value={data.title} onChange={v => set('title', v)} placeholder="Dining Hall Architecture & Execution" /></Field>
        <Field label="Badge"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="Case Study 2025" /></Field>
        <Field label="Description"><TextArea value={data.description} onChange={v => set('description', v)} rows={4} placeholder="Designing a high-performance educational dining environment..." /></Field>
        <ImageUpload label="Main Image" value={data.mainImg} onChange={v => set('mainImg', v)} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Specification Cards ({(data.specs || []).length})</h4>
        {(data.specs || []).map((spec, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
            <button onClick={() => set('specs', data.specs.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
            <TextInput value={spec.t} onChange={v => { const ts = [...data.specs]; ts[i] = { ...ts[i], t: v }; set('specs', ts); }} placeholder="Spec Title (e.g. Ergonomic Seating)" />
            <TextArea rows={2} value={spec.d} onChange={v => { const ts = [...data.specs]; ts[i] = { ...ts[i], d: v }; set('specs', ts); }} placeholder="Description..." />
          </div>
        ))}
        <button onClick={() => set('specs', [...(data.specs||[]), { t: '', d: '' }])} className="text-blue-500 text-xs font-bold">+ Add Spec Card</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Technical Details (Bullet Points)</h4>
        <Field label="One bullet per line" hint="These appear in the blue technical spec box">
          <TextArea
            value={(data.technicalDetails || []).join('\n')}
            onChange={v => set('technicalDetails', v.split('\n').filter(Boolean))}
            rows={6}
            placeholder={"Stainless Steel 304 Grade\nComposite ceiling panels\nGranite work surfaces"}
          />
        </Field>
      </div>
    </div>
  ),

  guide_post_content: ({ data, set }) => (
    <div className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Guide Hero</h4>
        <Field label="Title"><TextInput value={data.title} onChange={v => set('title', v)} placeholder="The Parent's Magnet: Creating a School..." /></Field>
        <Field label="Badge"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="Strategic Guide 2025" /></Field>
        <Field label="Introduction"><TextArea value={data.intro} onChange={v => set('intro', v)} rows={4} placeholder="The decision to enroll a child is the most significant..." /></Field>
        <ImageUpload label="Main Image" value={data.mainImg} onChange={v => set('mainImg', v)} />
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Guide Steps ({(data.steps || []).length})</h4>
        {(data.steps || []).map((step, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Step {i + 1}</span>
              <button onClick={() => set('steps', data.steps.filter((_,j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
            </div>
            <Field label="Step Title"><TextInput value={step.title} onChange={v => { const ts = [...data.steps]; ts[i] = { ...ts[i], title: v }; set('steps', ts); }} placeholder="Step 1: Audit Parent Priorities" /></Field>
            <Field label="Content"><TextArea rows={3} value={step.content} onChange={v => { const ts = [...data.steps]; ts[i] = { ...ts[i], content: v }; set('steps', ts); }} placeholder="Modern parents prioritize safety..." /></Field>
            <Field label="Insight Quote"><TextArea rows={2} value={step.insight} onChange={v => { const ts = [...data.steps]; ts[i] = { ...ts[i], insight: v }; set('steps', ts); }} placeholder="Direct research often reveals..." /></Field>
            <Field label="Action Point"><TextInput value={step.action} onChange={v => { const ts = [...data.steps]; ts[i] = { ...ts[i], action: v }; set('steps', ts); }} placeholder="Conduct a 5-question digital audit..." /></Field>
          </div>
        ))}
        <button onClick={() => set('steps', [...(data.steps||[]), { title: '', content: '', insight: '', action: '' }])} className="text-blue-500 text-xs font-bold">+ Add Step</button>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
        <h4 className="font-bold text-gray-800 text-sm">Summary Points ({(data.summaryPoints || []).length})</h4>
        {(data.summaryPoints || []).map((pt, i) => (
          <div key={i} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-100">
            <TextInput value={pt.t} onChange={v => { const ts = [...data.summaryPoints]; ts[i] = { ...ts[i], t: v }; set('summaryPoints', ts); }} placeholder="Point label (e.g. Parental Psychology)" />
            <TextInput value={pt.icon} onChange={v => { const ts = [...data.summaryPoints]; ts[i] = { ...ts[i], icon: v }; set('summaryPoints', ts); }} placeholder="Icon (ShieldCheck/Target/Zap)" />
            <button onClick={() => set('summaryPoints', data.summaryPoints.filter((_,j) => j !== i))} className="text-red-400 shrink-0"><Trash2 size={14}/></button>
          </div>
        ))}
        <button onClick={() => set('summaryPoints', [...(data.summaryPoints||[]), { t: '', icon: 'Star' }])} className="text-blue-500 text-xs font-bold">+ Add Point</button>
      </div>
    </div>
  ),

  categories: ({ data, set }) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <h4 className="font-bold text-gray-800 text-sm">Categories / Models List</h4>
      {(data.items || []).map((cat, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
          <button onClick={() => set('items', data.items.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400"><Trash2 size={13}/></button>
          <TextInput value={cat.title} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], title: v }; set('items', ts); }} placeholder="Category Title" />
          <div className="grid grid-cols-2 gap-2">
             <TextInput value={cat.icon} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], icon: v }; set('items', ts); }} placeholder="Icon (Award/Zap/Globe)" />
             <TextInput value={cat.color} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], color: v }; set('items', ts); }} placeholder="Tailwind Colors" />
          </div>
          <TextArea value={(cat.items || []).join(', ')} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], items: v.split(',').map(s=>s.trim()) }; set('items', ts); }} placeholder="Points (comma separated)" rows={2} />
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items||[]), { title: '', icon: 'Award', color: 'bg-blue-50 text-blue-600', items: [] }])} className="text-blue-500 font-bold text-xs">+ Add Category</button>
    </div>
  ),

  benefits: ({ data, set }) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <h4 className="font-bold text-gray-800 text-sm">Benefits Grid</h4>
      {(data.items || []).map((b, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
          <button onClick={() => set('items', data.items.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400"><Trash2 size={13}/></button>
          <TextInput value={b.title} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], title: v }; set('items', ts); }} placeholder="Benefit Title" />
          <TextInput value={b.icon} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], icon: v }; set('items', ts); }} placeholder="Icon (CheckCircle2)" />
          <TextArea value={b.description} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], description: v }; set('items', ts); }} placeholder="Description" rows={2} />
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items||[]), { title: '', icon: 'CheckCircle2', description: '' }])} className="text-blue-500 font-bold text-xs">+ Add Benefit</button>
    </div>
  ),

  upcoming_events: ({ data, set }) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <h4 className="font-bold text-gray-800 text-sm">Workshop Events</h4>
      {(data.items || []).map((e, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-gray-100 rounded-lg relative">
          <button onClick={() => set('items', data.items.filter((_,j) => j !== i))} className="absolute top-2 right-2 text-red-400"><Trash2 size={13}/></button>
          <TextInput value={e.title} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], title: v }; set('items', ts); }} placeholder="Event Title" />
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={e.date} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], date: v }; set('items', ts); }} placeholder="Date (e.g. 15 May 2025)" />
            <TextInput value={e.location} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], location: v }; set('items', ts); }} placeholder="Location" />
          </div>
          <TextInput value={(e.speakers || []).join(', ')} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], speakers: v.split(',').map(s=>s.trim()) }; set('items', ts); }} placeholder="Speakers (comma separated)" />
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={e.type} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], type: v }; set('items', ts); }} placeholder="Type (Webinar/Workshop)" />
            <TextInput value={e.status} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], status: v }; set('items', ts); }} placeholder="Status (Book Now)" />
          </div>
        </div>
      ))}
      <button onClick={() => set('items', [...(data.items||[]), { title: '', date: '', location: '', speakers: [], type: 'Workshop', status: 'Upcoming' }])} className="text-blue-500 font-bold text-xs">+ Add Event</button>
    </div>
  ),

  text_content: ({ data, set }) => (
    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
      <h4 className="font-bold text-gray-800 text-sm">Rich Text Content</h4>
      <Field label="Heading Content"><TextInput value={data.title} onChange={v => set('title', v)} /></Field>
      <div className="space-y-1">
         <label className="text-[10px] font-black uppercase text-gray-400">Body (HTML Allowed)</label>
         <TextArea value={data.body} onChange={v => set('body', v)} rows={15} className="font-mono text-[12px]" />
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
         <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Tip: You can use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, and &lt;li&gt; tags to structure your content properly.</p>
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
  // ── New block forms for per-page unique elements ─────────────────────────

  action_strip: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Dark Action Strip (below hero)</SectionTitle>
      <Field label="Title">
        <TextInput value={data.title} onChange={v => set('title', v)} placeholder="The 2025 Lookbook" />
      </Field>
      <Field label="Subtitle">
        <TextInput value={data.subtitle} onChange={v => set('subtitle', v)} placeholder="MASTER CATALOGUE" />
      </Field>
      <Field label="Download / Link Path">
        <TextInput value={data.downloadPath} onChange={v => set('downloadPath', v)} placeholder="/catalogues" />
      </Field>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase">Background Color</label>
        <div className="flex gap-2">
          <input type="color" value={data.bgColor || '#1A1A1A'} onChange={e => set('bgColor', e.target.value)} className="h-10 w-16 p-1 border rounded-lg cursor-pointer" />
          <input type="text" value={data.bgColor || '#1A1A1A'} onChange={e => set('bgColor', e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono uppercase" />
        </div>
      </div>
    </div>
  ),

  grid_heading: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Grid Heading Bar (above product cards)</SectionTitle>
      <Field label="Left Heading HTML" hint='Use *word* for italic, e.g. CLASSROOM *Collection*'>
        <TextInput value={data.leftHeading} onChange={v => set('leftHeading', v)} placeholder="CLASSROOM *Collection*" />
      </Field>
      <Field label="Right Stat Text">
        <TextInput value={data.rightStat} onChange={v => set('rightStat', v)} placeholder="Showing 12 Products" />
      </Field>
    </div>
  ),

  info_split_grid: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Info Split Grid (Bottom Section)</SectionTitle>
      <Field label="Heading HTML" hint='Supports <br/> and <span> tags'>
        <TextArea value={data.titleHtml} onChange={v => set('titleHtml', v)} rows={2} placeholder="Bespoke *Planning Hub*" />
      </Field>
      <Field label="Description">
        <TextArea value={data.description} onChange={v => set('description', v)} rows={3} />
      </Field>
      <SectionTitle>Info Points</SectionTitle>
      {(data.points || []).map((point, i) => (
        <div key={i} className="flex gap-2 items-center">
          <TextInput value={point} onChange={v => { const p = [...(data.points || [])]; p[i] = v; set('points', p); }} placeholder={`Point ${i + 1}`} />
          <button onClick={() => set('points', (data.points || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={() => set('points', [...(data.points || []), ''])} className="text-blue-600 text-xs font-bold"><Plus size={13} /> Add Point</button>
      <SectionTitle>CTA Button</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Button Label"><TextInput value={data.btnLabel} onChange={v => set('btnLabel', v)} placeholder="Schedule Site Visit" /></Field>
        <Field label="Button Link"><TextInput value={data.btnPath} onChange={v => set('btnPath', v)} placeholder="/contact-us" /></Field>
      </div>
      <SectionTitle>Image</SectionTitle>
      <ImageUpload label="Section Image" value={data.img} onChange={v => set('img', v)} />
    </div>
  ),

  action_stack: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Action Stack Cards (Sports page – right side mini cards)</SectionTitle>
      {(data.cards || []).map((card, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Card {i + 1}</span>
            <button onClick={() => set('cards', (data.cards || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={card.title} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], title: v }; set('cards', c); }} placeholder="Schedule Site Survey" />
          <TextInput value={card.subtitle} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], subtitle: v }; set('cards', c); }} placeholder="Subtitle text" />
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={card.icon} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], icon: v }; set('cards', c); }} placeholder="Icon (Lucide name)" />
            <TextInput value={card.link} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], link: v }; set('cards', c); }} placeholder="/path" />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-[10px] font-bold text-gray-500 uppercase">BG Color</label>
            <input type="color" value={card.bgColor || '#1A1A1A'} onChange={e => { const c = [...(data.cards || [])]; c[i] = { ...c[i], bgColor: e.target.value }; set('cards', c); }} className="h-8 w-12 p-0.5 border rounded cursor-pointer" />
            <input type="text" value={card.bgColor || '#1A1A1A'} onChange={e => { const c = [...(data.cards || [])]; c[i] = { ...c[i], bgColor: e.target.value }; set('cards', c); }} className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
          </div>
        </div>
      ))}
      <button onClick={() => set('cards', [...(data.cards || []), { title: '', subtitle: '', icon: 'Zap', link: '#', bgColor: '#1A1A1A' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold"><Plus size={13} /> Add Card</button>
    </div>
  ),

  feature_blocks: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Colored Feature Blocks (Design page – right-side colored cards)</SectionTitle>
      {(data.blocks || []).map((block, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Block {i + 1}</span>
            <button onClick={() => set('blocks', (data.blocks || []).filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
          <TextInput value={block.title} onChange={v => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], title: v }; set('blocks', b); }} placeholder="Block Title" />
          <TextInput value={block.subtitle} onChange={v => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], subtitle: v }; set('blocks', b); }} placeholder="Subtitle / Year" />
          <TextInput value={block.icon} onChange={v => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], icon: v }; set('blocks', b); }} placeholder="Icon (Lucide)" />
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-2 items-center">
              <label className="text-[10px] font-bold text-gray-400">BG</label>
              <input type="color" value={block.bgColor || '#0057A8'} onChange={e => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], bgColor: e.target.value }; set('blocks', b); }} className="h-8 w-12 p-0.5 border rounded cursor-pointer" />
              <input type="text" value={block.bgColor || '#0057A8'} onChange={e => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], bgColor: e.target.value }; set('blocks', b); }} className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-[10px] font-bold text-gray-400">Text</label>
              <input type="color" value={block.textColor || '#FFFFFF'} onChange={e => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], textColor: e.target.value }; set('blocks', b); }} className="h-8 w-12 p-0.5 border rounded cursor-pointer" />
              <input type="text" value={block.textColor || '#FFFFFF'} onChange={e => { const b = [...(data.blocks || [])]; b[i] = { ...b[i], textColor: e.target.value }; set('blocks', b); }} className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => set('blocks', [...(data.blocks || []), { title: '', subtitle: '', icon: 'Palette', bgColor: '#0057A8', textColor: '#FFFFFF' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold"><Plus size={13} /> Add Block</button>
    </div>
  ),

  registration_hero: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Registration Page — Hero Sidebar</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Badge Icon (Lucide)"><TextInput value={data.badgeIcon} onChange={v => set('badgeIcon', v)} placeholder="Users" /></Field>
        <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="Partner Network" /></Field>
      </div>
      <Field label="Main Heading HTML" hint='e.g. Join The <span>Circle.</span>'>
        <TextArea value={data.titleHtml} onChange={v => set('titleHtml', v)} rows={2} />
      </Field>
      <Field label="Sub-paragraph">
        <TextArea value={data.subtitle} onChange={v => set('subtitle', v)} rows={3} />
      </Field>
      <SectionTitle>Feature Bullets</SectionTitle>
      {(data.features || []).map((f, i) => (
        <div key={i} className="flex gap-2 items-start bg-gray-50 rounded-lg p-2">
          <div className="flex-1 space-y-1">
            <TextInput value={f.title} onChange={v => { const fs = [...(data.features || [])]; fs[i] = { ...fs[i], title: v }; set('features', fs); }} placeholder="Feature title" />
            <TextInput value={f.subtitle} onChange={v => { const fs = [...(data.features || [])]; fs[i] = { ...fs[i], subtitle: v }; set('features', fs); }} placeholder="Feature description" />
          </div>
          <button onClick={() => set('features', (data.features || []).filter((_, j) => j !== i))} className="text-red-400 mt-2"><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={() => set('features', [...(data.features || []), { title: '', subtitle: '' }])} className="text-blue-600 text-xs font-bold"><Plus size={13} /> Add Feature</button>
    </div>
  ),

  registration_features: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Registration Page — Bottom Feature Cards</SectionTitle>
      {(data.cards || []).map((card, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Card {i + 1}</span>
            <button onClick={() => set('cards', (data.cards || []).filter((_, j) => j !== i))} className="text-red-400"><Trash2 size={13} /></button>
          </div>
          <TextInput value={card.icon} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], icon: v }; set('cards', c); }} placeholder="Icon (Lucide)" />
          <TextInput value={card.title} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], title: v }; set('cards', c); }} placeholder="Title" />
          <TextInput value={card.description} onChange={v => { const c = [...(data.cards || [])]; c[i] = { ...c[i], description: v }; set('cards', c); }} placeholder="Description" />
          <div className="flex gap-2 items-center">
            <label className="text-[10px] font-bold text-gray-400">Color</label>
            <input type="color" value={card.color || '#0057A8'} onChange={e => { const c = [...(data.cards || [])]; c[i] = { ...c[i], color: e.target.value }; set('cards', c); }} className="h-8 w-12 p-0.5 border rounded cursor-pointer" />
          </div>
        </div>
      ))}
      <button onClick={() => set('cards', [...(data.cards || []), { icon: 'Shield', title: '', description: '', color: '#0057A8' }])}
        className="flex items-center gap-1 text-blue-600 text-xs font-bold"><Plus size={13} /> Add Card</button>
    </div>
  ),

  login_hero: ({ data, set }) => (
    <div className="space-y-4">
      <SectionTitle>Login Page — Hero Sidebar</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Badge Icon (Lucide)"><TextInput value={data.badgeIcon} onChange={v => set('badgeIcon', v)} placeholder="Shield" /></Field>
        <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} placeholder="Secure Institutional Portal" /></Field>
      </div>
      <Field label="Main Heading HTML">
        <TextArea value={data.titleHtml} onChange={v => set('titleHtml', v)} rows={2} placeholder="Welcome Back." />
      </Field>
      <Field label="Sub-paragraph">
        <TextArea value={data.subtitle} onChange={v => set('subtitle', v)} rows={3} />
      </Field>
      <SectionTitle>Member Circle Section</SectionTitle>
      <Field label="Circle Heading">
        <TextInput value={data.circleHeading} onChange={v => set('circleHeading', v)} placeholder="Join 4000+ Institutional Partners" />
      </Field>
      <Field label="Circle Sub-text">
        <TextInput value={data.circleSubtext} onChange={v => set('circleSubtext', v)} placeholder="Access exclusive resources" />
      </Field>
      <SectionTitle>Bottom CTA</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label='"New Institution?" Text'><TextInput value={data.newUserText} onChange={v => set('newUserText', v)} placeholder="New Institution?" /></Field>
        <Field label="Register Link Label"><TextInput value={data.registerLabel} onChange={v => set('registerLabel', v)} placeholder="Register Now" /></Field>
      </div>
    </div>
  ),

  listings: ({ data, set, allBlocks }) => {
    const locations = allBlocks?.find(b => b.blockType === 'sidebar_categories')?.data?.categories?.map(c => c.name) || [];
    
    return (
    <div className="space-y-6">
      <SectionTitle>Property & Business Listings ({(data.items || []).length})</SectionTitle>
      {(data.items || []).map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-[25px] p-6 space-y-4 bg-gray-50/50 shadow-sm relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-black">
                 {i + 1}
               </span>
               <span className="text-xs font-black uppercase tracking-widest text-gray-500">Mandate Editor</span>
            </div>
            <button onClick={() => set('items', (data.items || []).filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-3">
                <Field label="Mandate Type">
                   <select 
                     value={item.type || 'Investment'} 
                     onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], type: v.target.value }; set('items', ts); }}
                     className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                   >
                      <option value="Investment">Investment Opportunity</option>
                      <option value="Sale">Direct Sale Mandate</option>
                   </select>
                </Field>
                <Field label="Location (Dynamic from Sidebar Tabs)">
                   <div className="relative">
                      <select 
                        value={item.location || ''} 
                        onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], location: v.target.value }; set('items', ts); }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white appearance-none"
                      >
                         <option value="">Select Location...</option>
                         {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                   </div>
                </Field>
                <Field label="Deal Title"><TextInput value={item.title} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], title: v }; set('items', ts); }} placeholder="K-12 SCHOOL FOR LEASE" /></Field>
             </div>
             <div className="space-y-3">
                <Field label="Mandate Value (Price Display)"><TextInput value={item.price} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], price: v }; set('items', ts); }} placeholder="9.50 Cr" /></Field>
                <div className="grid grid-cols-2 gap-2">
                   <Field label="Rating (Star)"><TextInput value={item.rating} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], rating: v }; set('items', ts); }} placeholder="8.5" /></Field>
                   <Field label="Margin %"><TextInput value={item.margin} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], margin: v }; set('items', ts); }} placeholder="25%+" /></Field>
                </div>
                <Field label="Sales P.A. (Run Rate)"><TextInput value={item.runRate} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], runRate: v }; set('items', ts); }} placeholder="1.2 Cr" /></Field>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Field label="CTA Button Label"><TextInput value={item.ctaLabel} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], ctaLabel: v }; set('items', ts); }} placeholder="Contact Business" /></Field>
             <Field label="CTA Button Link"><TextInput value={item.ctaLink} onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], ctaLink: v }; set('items', ts); }} placeholder="/contact-us" /></Field>
          </div>

          <Field label="Description Bullets" hint="Sentences separated by periods will become bullets. First 3 used.">
             <TextArea 
               value={item.description} 
               onChange={v => { const ts = [...data.items]; ts[i] = { ...ts[i], description: v }; set('items', ts); }} 
               placeholder="Established school. Stable revenue model. Prime location." 
             />
          </Field>
        </div>
      ))}
      <button 
        onClick={() => set('items', [...(data.items || []), { type: 'Investment', location: '', title: '', price: '', rating: '8.5', margin: '25%+', runRate: '', description: '' }])}
        className="w-full flex justify-center items-center gap-2 py-4 bg-white border-2 border-dashed border-gray-200 rounded-[25px] text-gray-400 font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all"
      >
        <Plus size={16} /> Add New Mandate Card
      </button>
    </div>
  )},
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
function BlockEditor({ slug, block, allBlocks, onSaved }) {
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
    feature_card: '🎴 Feature Card (Color/CTA)',
    action_strip: '🏷️ Dark Action Strip',
    grid_heading: '📊 Grid Heading Bar',
    info_split_grid: 'ℹ️ Info Split Grid',
    action_stack: '📚 Action Stack Cards',
    feature_blocks: '🎨 Colored Feature Blocks',
    registration_hero: '📝 Registration Hero',
    registration_features: '✨ Registration Features',
    login_hero: '🔐 Login Hero',
    corporate_page_content: '🏢 Corporate Page Content',
    manufacturing_page_content: '🏭 Manufacturing Page Content',
    environments_page_content: '🌿 Environments Page Content',
    catalogues_page_content: '📄 Catalogues Page Content',
    guides_page_content: '📖 Guides Page Content',
    contact_page_content: '✉️ Contact Page Content',
    listings: '🏛️ Property & Business Listings',
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
          ? <FormComponent data={localData} set={setField} allBlocks={allBlocks} />
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
  home:        ['topbar', 'navbar', 'ticker', 'hero', 'product_carousel', 'tiles', 'solutions', 'sidebar_trending', 'sidebar_resources', 'sidebar_banners', 'cta_whatsapp', 'partners'],
  furniture:   ['inner_page_hero', 'action_strip', 'sidebar_categories', 'grid_heading', 'feature_card', 'cta_whatsapp'],
  architecture:['inner_page_hero', 'sidebar_categories', 'grid_heading', 'feature_card', 'cta_whatsapp'],
  digital:     ['inner_page_hero', 'sidebar_categories', 'grid_heading', 'feature_card', 'cta_whatsapp'],
  sports:      ['inner_page_hero', 'action_stack', 'sidebar_categories', 'grid_heading', 'feature_card', 'info_split_grid', 'cta_whatsapp'],
  libraries:   ['inner_page_hero', 'feature_card', 'sidebar_categories', 'grid_heading', 'info_split_grid', 'cta_whatsapp'],
  labs:        ['inner_page_hero', 'sidebar_categories', 'grid_heading', 'info_split_grid', 'cta_whatsapp'],
  mathematics: ['inner_page_hero', 'sidebar_categories', 'grid_heading', 'info_split_grid', 'cta_whatsapp'],
  science:     ['inner_page_hero', 'feature_card', 'sidebar_categories', 'grid_heading', 'info_split_grid', 'cta_whatsapp'],
  design:      ['inner_page_hero', 'feature_blocks', 'sidebar_categories', 'grid_heading', 'feature_card', 'info_split_grid', 'cta_whatsapp'],
  manufacturing:['manufacturing_page_content', 'cta_whatsapp'],
  corporate:   ['corporate_page_content', 'cta_whatsapp'],
  environments:['environments_page_content', 'cta_whatsapp'],
  catalogues:  ['catalogues_page_content', 'catalogues_list', 'cta_whatsapp'],
  guides:      ['guides_page_content', 'guides_list', 'cta_whatsapp'],
  aboutus:     ['about_hero', 'stats', 'about_philosophy', 'journey'],
  'contact-us':['contact_page_content', 'contact_info'],
  'school-sale': ['inner_page_hero', 'sidebar_categories', 'listings', 'cta_whatsapp'],
  partnerships:['inner_page_hero', 'sidebar_categories', 'categories', 'cta_whatsapp'],
  'setup-guide': ['inner_page_hero', 'sidebar_categories', 'benefits', 'cta_whatsapp'],
  workshops:   ['inner_page_hero', 'sidebar_categories', 'upcoming_events', 'cta_whatsapp'],
  fundraising: ['inner_page_hero', 'sidebar_categories', 'categories', 'cta_whatsapp'],
  registration:['registration_hero', 'registration_features'],
  login:       ['login_hero'],
  'digitization-guide': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'catalogue-2025': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'skill-lab-guide': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'play-furniture-lookbook': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'math-resources': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'completed-projects': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'design-ideas': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'library-trends': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'job-openings': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'influencer-program': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
  'setup-school-india': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
};

const DEFAULT_ALLOWED_BLOCKS = ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'];

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
    feature_card: '🎴 Feature Card (Color/CTA)',
    action_strip: '🏷️ Dark Action Strip',
    grid_heading: '📊 Grid Heading Bar',
    info_split_grid: 'ℹ️ Info Split Grid',
    action_stack: '📚 Action Stack Cards',
    feature_blocks: '🎨 Colored Feature Blocks',
    registration_hero: '📝 Registration Hero Sidebar',
    registration_features: '✨ Registration Bottom Cards',
    login_hero: '🔐 Login Hero Sidebar',
    corporate_page_content: '🏢 Corporate Page Content',
    manufacturing_page_content: '🏭 Manufacturing Page Content',
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
            const allowed = PAGE_ALLOWED_BLOCKS[slug] || DEFAULT_ALLOWED_BLOCKS;
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
            <BlockEditor key={activeBlock._id} slug={slug} block={activeBlock} allBlocks={page.blocks} onSaved={load} />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-4xl mb-2">👈</p>
              <p className="text-gray-500 font-medium">Select a section from the left to edit</p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Inner Page Cards Manager - Only show on pages that actually use the global product list */}
      {(['home', 'furniture', 'architecture', 'digital', 'sports', 'libraries', 'labs', 'mathematics', 'science', 'design'].includes(slug)) && (
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
                {slug === 'home' 
                  ? "Manage the dynamic products appearing in the homepage carousel." 
                  : "Manage the dynamic products that appear under the sidebar tabs on this page."}
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
  'school-sale': '🏫', partnerships: '🤝', 'setup-guide': '📘', workshops: '🎟️', fundraising: '💰',
  'digitization-guide': '📱', 'catalogue-2025': '📖', 'skill-lab-guide': '🧪',
  'play-furniture-lookbook': '🪑', 'math-resources': '🧮', 'completed-projects': '🏗️',
  'design-ideas': '💡', 'library-trends': '🏛️', 'job-openings': '💼',
  'influencer-program': '📣',
  registration: '📝',
  login: '🔐',
  'setup-school-india': '🏫',
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
