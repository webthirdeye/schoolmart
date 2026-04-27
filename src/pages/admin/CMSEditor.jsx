// src/pages/admin/CMSEditor.jsx
import { useEffect, useState } from 'react';
import { getAllPages, getPage, updateBlock, addBlock, deleteBlock, deletePage, uploadFile, bulkRenameSubcategory, createPage } from '../../services/api';
import { formatImgUrl } from '../../utils/formatters';
import { clearCMSCache } from '../../hooks/useCMSBlock';
import { 
  ChevronDown, ChevronRight, Trash2, Plus, Eye, EyeOff, Save, GripVertical, 
  Image as ImageIcon, Link2, Type, List, ToggleLeft, Upload, Layers, Palette, Video,
  Globe, FileText, Lock, MessageSquare, Box, Package, Search, Sparkles
} from 'lucide-react';
import ProductManager from './ProductManager';
import ImageUpload from '../../components/admin/ImageUpload';
import MediaUpload from '../../components/admin/MediaUpload';
import FileUpload from '../../components/admin/FileUpload';

// ── Reusable Field Components ────────────────────────────────────────────────
const Field = ({ label, children, hint }) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 font-bold">{hint}</p>}
  </div>
);

const ColorInput = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
        className="h-10 w-16 p-1 bg-white border rounded-lg cursor-pointer" />
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono uppercase" placeholder="#HEX" />
    </div>
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm" />
);

const TextArea = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-y transition-all shadow-sm" />
);

const SectionTitle = ({ children }) => (
  <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
    <div className="h-px bg-indigo-50 flex-1"></div> {children} <div className="h-px bg-indigo-50 flex-1"></div>
  </h4>
);

// ── Tile Accordion Editor ───────────────────────────────────────────────────
const EnvironmentEditor = ({ item, i, items, set }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('card');
  const upd = (k, v) => { const it = [...items]; it[i] = { ...it[i], [k]: v }; set('masonryItems', it); };
  const updSpec = (j, k, v) => { const it = [...items]; if (!it[i].specs) it[i].specs = []; it[i].specs[j] = { ...it[i].specs[j], [k]: v }; set('masonryItems', it); };
  
  const innerSlug = item.t.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white mb-4">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 p-5 hover:bg-indigo-50/30 transition-all text-left">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">{i + 1}</div>
        {item.img && <img src={formatImgUrl(item.img)} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest truncate">{item.t || 'Untitled Case Study'}</p>
          <p className="text-[10px] text-gray-400 font-medium truncate">{item.c || 'No Category'}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        <button onClick={e => { e.stopPropagation(); set('masonryItems', items.filter((_, j) => j !== i)); }} className="ml-2 text-red-300 hover:text-red-500"><Trash2 size={15}/></button>
      </button>

      {open && (
        <div className="border-t border-gray-50">
          <div className="flex gap-2 p-4 bg-gray-50/50 border-b border-gray-100">
            <button onClick={() => setTab('card')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'card' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-200'}`}>🃏 Card Fields</button>
            <button onClick={() => setTab('inner')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'inner' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'}`}>📄 Inner Page Fields</button>
          </div>

          <div className="p-6 space-y-5">
            {tab === 'card' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Title (used as slug)"><TextInput value={item.t} onChange={v => upd('t', v)} /></Field>
                  <Field label="Category Tag"><TextInput value={item.c} onChange={v => upd('c', v)} placeholder="Sound, Nature…" /></Field>
                  <Field label="Card Description"><TextArea value={item.cardDescription} onChange={v => upd('cardDescription', v)} rows={2} /></Field>
                </div>
                <ImageUpload label="Card Image" value={item.img} onChange={v => upd('img', v)} />
              </>
            )}

            {tab === 'inner' && (
              <div className="space-y-6">
                <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100/50 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={12}/> Inner Page Identity</h6>
                    <button onClick={() => window.open(`/admin/cms?page=environment-${innerSlug}`, '_blank')} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 text-[8px] font-black uppercase rounded-full hover:bg-blue-50">Deep Edit Sub-Page</button>
                  </div>
                  <Field label="Badge"><TextInput value={item.badge} onChange={v => upd('badge', v)} placeholder="Case Study 2025" /></Field>
                  <Field label="Description"><TextArea value={item.description} onChange={v => upd('description', v)} rows={2} /></Field>
                  <ImageUpload label="Main Hero Image (Detail Page)" value={item.mainImg} onChange={v => upd('mainImg', v)} />
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Technical specs & Taxonomy</h6>
                  {(item.specs || []).map((spec, j) => (
                    <div key={j} className="grid grid-cols-2 gap-2 items-start bg-white p-3 rounded-xl border border-gray-100 relative">
                      <button onClick={() => { const it = [...items]; it[i].specs = it[i].specs.filter((_, k) => k !== j); set('masonryItems', it); }} className="absolute top-1 right-1 text-red-200 hover:text-red-400"><X size={10}/></button>
                      <Field label="Spec Title"><TextInput value={spec.t} onChange={v => updSpec(j, 't', v)} /></Field>
                      <Field label="Spec Description"><TextInput value={spec.d} onChange={v => updSpec(j, 'd', v)} /></Field>
                    </div>
                  ))}
                  <button onClick={() => { const it = [...items]; if (!it[i].specs) it[i].specs = []; it[i].specs.push({ t: '', d: '' }); set('masonryItems', it); }} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600">+ Add Spec</button>
                  <Field label="Technical Details" hint="One per line"><TextArea value={(item.technicalDetails || []).join('\n')} onChange={v => upd('technicalDetails', v.split('\n').map(s => s.trim()).filter(Boolean))} rows={3} /></Field>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                   <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><FileText size={12}/> Main Document Content (HTML)</h6>
                   <TextArea value={item.content} onChange={v => upd('content', v)} rows={8} placeholder="Extra content for the detail page..." />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CaseStudyEditor = ({ item, i, items, set }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('card');
  const upd = (k, v) => { const it = [...items]; it[i] = { ...it[i], [k]: v }; set('items', it); };
  
  const innerSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white mb-4">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 p-5 hover:bg-indigo-50/30 transition-all text-left">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">{i + 1}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest truncate">{item.title || 'Untitled Project'}</p>
          <p className="text-[10px] text-gray-400 font-medium truncate">{item.location || 'No Location'}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        <button onClick={e => { e.stopPropagation(); set('items', items.filter((_, j) => j !== i)); }} className="ml-2 text-red-300 hover:text-red-500"><Trash2 size={15}/></button>
      </button>

      {open && (
        <div className="border-t border-gray-50">
          <div className="flex gap-2 p-4 bg-gray-50/50 border-b border-gray-100">
            <button onClick={() => setTab('card')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'card' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-200'}`}>🃏 Card Fields</button>
            <button onClick={() => setTab('inner')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'inner' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'}`}>📄 Inner Page Fields</button>
          </div>

          <div className="p-6 space-y-5">
            {tab === 'card' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Project Title"><TextInput value={item.title} onChange={v => upd('title', v)} /></Field>
                  <Field label="Location"><TextInput value={item.location} onChange={v => upd('location', v)} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Outcome"><TextInput value={item.outcome} onChange={v => upd('outcome', v)} placeholder="30% Enrollment Growth" /></Field>
                  <Field label="Focus Area"><TextInput value={item.focus} onChange={v => upd('focus', v)} placeholder="Yield Opt" /></Field>
                </div>
                <Field label="Project Slug / Link" hint="links to /p/slug"><TextInput value={item.slug} onChange={v => upd('slug', v)} /></Field>
                <Field label="Card Description"><TextArea value={item.cardDescription} onChange={v => upd('cardDescription', v)} rows={2} /></Field>
                <ImageUpload label="Card Image" value={item.img} onChange={v => upd('img', v)} />
              </>
            )}

            {tab === 'inner' && (
              <div className="space-y-6">
                <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100/50 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={12}/> Inner Page Identity</h6>
                    <button onClick={() => window.open(`/admin/cms?page=resource-${innerSlug}`, '_blank')} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 text-[8px] font-black uppercase rounded-full hover:bg-blue-50">Deep Edit Sub-Page</button>
                  </div>
                  <Field label="Badge Overide"><TextInput value={item.badge} onChange={v => upd('badge', v)} /></Field>
                  <Field label="Description Override"><TextArea value={item.description} onChange={v => upd('description', v)} rows={2} /></Field>
                  <ImageUpload label="Hero Image (Detail Page)" value={item.heroImg} onChange={v => upd('heroImg', v)} />
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                   <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><FileText size={12}/> Main Document Content (HTML)</h6>
                   <TextArea value={item.content} onChange={v => upd('content', v)} rows={8} placeholder="Extra content for the project detail page..." />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const GuideEditor = ({ item, i, items, set }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('card');
  const upd = (k, v) => { const it = [...items]; it[i] = { ...it[i], [k]: v }; set('caseStudies', it); };
  const updStep = (j, k, v) => { const it = [...items]; if (!it[i].steps) it[i].steps = []; it[i].steps[j] = { ...it[i].steps[j], [k]: v }; set('caseStudies', it); };
  const updSum = (j, k, v) => { const it = [...items]; if (!it[i].summaryPoints) it[i].summaryPoints = []; it[i].summaryPoints[j] = { ...it[i].summaryPoints[j], [k]: v }; set('caseStudies', it); };
  
  const innerSlug = item.t.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white mb-4">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 p-5 hover:bg-indigo-50/30 transition-all text-left">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">{i + 1}</div>
        {item.img && <img src={formatImgUrl(item.img)} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest truncate">{item.t || 'Untitled Guide'}</p>
          <p className="text-[10px] text-gray-400 font-medium truncate">{item.c || 'No Category'}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        <button onClick={e => { e.stopPropagation(); set('caseStudies', items.filter((_, j) => j !== i)); }} className="ml-2 text-red-300 hover:text-red-500"><Trash2 size={15}/></button>
      </button>

      {open && (
        <div className="border-t border-gray-50">
          <div className="flex gap-2 p-4 bg-gray-50/50 border-b border-gray-100">
            <button onClick={() => setTab('card')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'card' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-200'}`}>🃏 Card Fields</button>
            <button onClick={() => setTab('inner')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'inner' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'}`}>📄 Inner Page Fields</button>
          </div>

          <div className="p-6 space-y-5">
            {tab === 'card' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Title (used as slug)"><TextInput value={item.t} onChange={v => upd('t', v)} /></Field>
                  <Field label="Category"><TextInput value={item.c} onChange={v => upd('c', v)} /></Field>
                  <Field label="Card Description"><TextArea value={item.cardDescription || item.description} onChange={v => upd('cardDescription', v)} rows={2} /></Field>
                </div>
                <ImageUpload label="Card Image" value={item.img} onChange={v => upd('img', v)} />
              </>
            )}

            {tab === 'inner' && (
              <div className="space-y-6">
                <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100/50 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={12}/> Inner Page Identity</h6>
                    <button onClick={() => window.open(`/admin/cms?page=guide-${innerSlug}`, '_blank')} className="px-3 py-1 bg-white border border-blue-100 text-blue-600 text-[8px] font-black uppercase rounded-full hover:bg-blue-50">Deep Edit Sub-Page</button>
                  </div>
                  <Field label="Badge"><TextInput value={item.badge} onChange={v => upd('badge', v)} placeholder="Strategic Guide 2025" /></Field>
                  <Field label="Intro Paragraph"><TextArea value={item.intro} onChange={v => upd('intro', v)} rows={2} /></Field>
                  <ImageUpload label="Main Hero Image" value={item.mainImg} onChange={v => upd('mainImg', v)} />
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Strategic Steps</h6>
                  {(item.steps || []).map((step, j) => (
                    <div key={j} className="bg-white p-4 rounded-2xl border border-gray-100 relative space-y-2">
                      <button onClick={() => { const it = [...items]; it[i].steps = it[i].steps.filter((_, k) => k !== j); set('caseStudies', it); }} className="absolute top-2 right-2 text-red-200 hover:text-red-400"><Trash2 size={12}/></button>
                      <Field label={`Step ${j+1} Title`}><TextInput value={step.title} onChange={v => updStep(j, 'title', v)} /></Field>
                      <Field label="Content"><TextArea value={step.content} onChange={v => updStep(j, 'content', v)} rows={2} /></Field>
                      <Field label="Insight (quote)"><TextInput value={step.insight} onChange={v => updStep(j, 'insight', v)} /></Field>
                      <Field label="Action Point"><TextInput value={step.action} onChange={v => updStep(j, 'action', v)} /></Field>
                    </div>
                  ))}
                  <button onClick={() => { const it = [...items]; if (!it[i].steps) it[i].steps = []; it[i].steps.push({ title: '', content: '', insight: '', action: '' }); set('caseStudies', it); }} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600">+ Add Step</button>
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Summary Points</h6>
                  <div className="grid grid-cols-2 gap-3">
                    {(item.summaryPoints || []).map((sp, j) => (
                      <div key={j} className="bg-white p-3 rounded-xl border border-gray-100 relative">
                        <button onClick={() => { const it = [...items]; it[i].summaryPoints = it[i].summaryPoints.filter((_, k) => k !== j); set('caseStudies', it); }} className="absolute top-1 right-1 text-red-200 hover:text-red-400"><X size={10}/></button>
                        <Field label="Label"><TextInput value={sp.t} onChange={v => updSum(j, 't', v)} /></Field>
                        <Field label="Icon Name"><TextInput value={sp.icon} onChange={v => updSum(j, 'icon', v)} placeholder="ShieldCheck" /></Field>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { const it = [...items]; if (!it[i].summaryPoints) it[i].summaryPoints = []; it[i].summaryPoints.push({ t: '', icon: 'Star' }); set('caseStudies', it); }} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600">+ Add Summary Point</button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                   <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><FileText size={12}/> Main Document Content (HTML)</h6>
                   <TextArea value={item.content} onChange={v => upd('content', v)} rows={8} placeholder="Extra content for the guide detail page..." />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TileEditor = ({ t, i, data, set }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('card');
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState(false);

  const update = (field, val) => {
    const x = [...(data.tiles || [])];
    x[i] = { ...x[i], [field]: val };
    set('tiles', x);
  };
  const updateInner = (field, val) => {
    const x = [...(data.tiles || [])];
    x[i] = { ...x[i], inner: { ...(x[i].inner || {}), [field]: val } };
    set('tiles', x);
  };
  const inner = t.inner || {};

  // Extract slug: /p/immersive-learning → immersive-learning
  const pageSlug = (t.path || '').replace(/^\/p\//, '').replace(/^\//, '');

  const hasInnerContent = !!(inner.heading || inner.description || inner.content || inner.badge);

  const importFromPage = () => {
    if (!pageSlug) return;
    setFetching(true);
    getPage(pageSlug)
      .then(page => {
        const indexed = {};
        (page.blocks || []).forEach(b => {
          indexed[b.key] = b.data;
          if (b.type && b.type !== b.key) indexed[b.type] = b.data;
        });
        const hero = indexed?.inner_page_hero || indexed?.page_hero || {};
        const cta  = indexed?.inner_page_cta || indexed?.page_cta || {};
        const body = indexed?.text_content || indexed?.page_content || {};
        const x = [...(data.tiles || [])];
        x[i] = {
          ...x[i],
          inner: {
            badge:       inner.badge       || hero.badge       || '',
            heading:     inner.heading     || hero.titleHtml   || hero.title || '',
            description: inner.description || hero.description || hero.subtitle || '',
            heroImg:     inner.heroImg     || hero.img         || hero.mediaUrl || '',
            content:     inner.content     || body.body        || body.content  || '',
            btn1Label:   inner.btn1Label   || cta.actionText   || cta.btn1Label || hero.btn1Label || '',
            btn1Path:    inner.btn1Path    || cta.actionLink   || cta.btn1Path  || hero.btn1Path  || '',
            btn2Label:   inner.btn2Label   || cta.btn2Label    || hero.btn2Label || '',
            btn2Path:    inner.btn2Path    || cta.btn2Path     || hero.btn2Path  || '',
            specs:       inner.specs       || indexed?.resource_specs?.specs || [],
            tags:        inner.tags        || indexed?.resource_specs?.tags  || [],
            gallery:     inner.gallery     || (indexed?.page_gallery?.images || []).map(im => typeof im === 'string' ? im : im.url) || [],
          }
        };
        set('tiles', x);
        setFetched(true);
      })
      .catch(() => setFetched(true))
      .finally(() => setFetching(false));
  };

  // Auto-import when Inner tab opens for the first time and fields are empty
  useEffect(() => {
    if (tab === 'inner' && open && !hasInnerContent && !fetched && !fetching) {
      importFromPage();
    }
  }, [tab, open]);

  return (
    <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden bg-white">
      {/* Card Header — clickable to expand */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 hover:bg-indigo-50/30 transition-all text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">{i + 1}</div>
        {t.img && <img src={formatImgUrl(t.img)} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black text-gray-900 uppercase tracking-widest truncate">{t.title || 'Untitled Tile'}</p>
          {t.subtitle && <p className="text-[10px] text-gray-400 font-medium truncate">{t.subtitle}</p>}
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        <button
          onClick={e => { e.stopPropagation(); set('tiles', (data.tiles || []).filter((_, j) => j !== i)); }}
          className="ml-2 text-red-300 hover:text-red-500 shrink-0"
        ><Trash2 size={15}/></button>
      </button>

      {/* Expandable Body */}
      {open && (
        <div className="border-t border-gray-50">
          {/* Tab switcher */}
          <div className="flex gap-2 p-4 bg-gray-50/50 border-b border-gray-100">
            <button
              onClick={() => setTab('card')}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'card' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-200'}`}
            >🃏 Card Fields</button>
            <button
              onClick={() => { setTab('inner'); if (!hasInnerContent && !fetched) importFromPage(); }}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'inner' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'}`}
            >📄 Inner Page Fields</button>
          </div>

          <div className="p-6 space-y-5">
            {tab === 'card' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tile Title"><TextInput value={t.title} onChange={v => update('title', v)} /></Field>
                  <Field label="Routing Path" hint="URL slug (e.g. /p/interactive-panels)"><TextInput value={t.path} onChange={v => update('path', v)} placeholder="/p/interactive-panels" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tile Height" hint="h-48, h-56, h-64, h-72, row-span-2">
                    <TextInput value={t.height} onChange={v => update('height', v)} placeholder="h-64" />
                  </Field>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" checked={!!t.featured} onChange={e => update('featured', e.target.checked)} className="w-4 h-4 rounded ring-offset-2 focus:ring-2 focus:ring-indigo-600 transition-all" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Featured Style Block</span>
                  </div>
                </div>
                <Field label="Subtitle / Blurb"><TextInput value={t.subtitle} onChange={v => update('subtitle', v)} /></Field>
                <ImageUpload label="Grid Cover Image" value={t.img} onChange={v => update('img', v)} />
              </>
            )}

            {tab === 'inner' && (
              <div className="space-y-6">
                <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100/50 space-y-4">
                  <h6 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-2"><Sparkles size={12}/> Inner Page Identity</h6>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Badge"><TextInput value={inner.badge} onChange={v => updateInner('badge', v)} placeholder="INSTITUTIONAL INSIGHT" /></Field>
                    <Field label="Big Headline (HTML)"><TextInput value={inner.heading} onChange={v => updateInner('heading', v)} /></Field>
                  </div>
                  <Field label="Meta Subtitle"><TextArea value={inner.description} onChange={v => updateInner('description', v)} rows={2} /></Field>
                  <ImageUpload label="Large Hero Imagery" value={inner.heroImg} onChange={v => updateInner('heroImg', v)} />
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Technical specs & Taxonomy</h6>
                  <Field label="Specifications (separated by comma)" hint="e.g. Multi-touch, 4K resolution"><TextInput value={(inner.specs || []).join(', ')} onChange={v => updateInner('specs', v.split(',').map(s => s.trim()).filter(Boolean))} /></Field>
                  <Field label="Categories (separated by comma)" hint="e.g. Technology, Digital"><TextInput value={(inner.tags || []).join(', ')} onChange={v => updateInner('tags', v.split(',').map(s => s.trim()).filter(Boolean))} /></Field>
                  <Field label="Gallery Images (comma separated URLs)" hint="Unsplash or uploaded image links"><TextArea value={(inner.gallery || []).join(', ')} onChange={v => updateInner('gallery', v.split(',').map(s => s.trim()).filter(Boolean))} rows={2} /></Field>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                   <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><FileText size={12}/> Main Document Content (HTML)</h6>
                   <TextArea value={inner.content} onChange={v => updateInner('content', v)} rows={10} placeholder="Enter the long-form page content here..." />
                   
                   <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                         <Field label="Primary Button Label"><TextInput value={inner.btn1Label} onChange={v => updateInner('btn1Label', v)} placeholder="DOWNLOAD GUIDE" /></Field>
                         <Field label="Primary Button Path"><TextInput value={inner.btn1Path} onChange={v => updateInner('btn1Path', v)} placeholder="/p/some-guide.pdf" /></Field>
                      </div>
                      <div className="space-y-4">
                         <Field label="Secondary Button Label"><TextInput value={inner.btn2Label} onChange={v => updateInner('btn2Label', v)} placeholder="SHARE" /></Field>
                         <Field label="Secondary Button Path"><TextInput value={inner.btn2Path} onChange={v => updateInner('btn2Path', v)} placeholder="" /></Field>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Block-Specific Form Renderers ───────────────────────────────────────────
const BlockForms = {

  page_hero: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Inner Page Hero (Split Design)</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category Badge" hint="Example: Resource Hub"><TextInput value={data?.badge} onChange={v => set('badge', v)} /></Field>
        <Field label="Subtitle Statement"><TextInput value={data?.subtitle} onChange={v => set('subtitle', v)} /></Field>
      </div>
      <Field label="Master Title (HTML Allowed)" hint='Example: Immersive Learning: <br/> VR & AR.'>
        <TextArea value={data?.titleHtml || data?.title} onChange={v => set('titleHtml', v)} rows={3} />
      </Field>
      
      <SectionTitle>Floating Logic Card</SectionTitle>
      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
        <Field label="Card Mini-label" hint="Example: Global Standard"><TextInput value={data?.cardLabel} onChange={v => set('cardLabel', v)} /></Field>
        <Field label="Card Main Text" hint="Example: Implementing NEP 2020 Compliance"><TextInput value={data?.cardText} onChange={v => set('cardText', v)} /></Field>
      </div>

      <SectionTitle>Visual Experience</SectionTitle>
      <ImageUpload label="Primary High-Res Image" value={data?.img} onChange={v => set('img', v)} />
      
      <SectionTitle>Action Buttons</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary Btn Label"><TextInput value={data?.btn1Label} onChange={v => set('btn1Label', v)} placeholder="Download Guide" /></Field>
        <Field label="Secondary Btn Label"><TextInput value={data?.btn2Label} onChange={v => set('btn2Label', v)} placeholder="Share" /></Field>
      </div>
    </div>
  ),

  page_content: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Main Article Content</SectionTitle>
      <Field label="Body Content (HTML/Markdown)" hint="The main text of your page. HTML and line breaks are fully supported.">
        <TextArea value={data?.content} onChange={v => set('content', v)} rows={15} />
      </Field>
    </div>
  ),

  resource_specs: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Technical Meta-Data</SectionTitle>
      <Field label="Specifications (One per line)" hint="Shows up as grid blocks under the content.">
        <TextArea value={(data?.specs || []).join('\n')} onChange={v => set('specs', v.split('\n').filter(s => s.trim()))} rows={5} />
      </Field>
      <Field label="Tags / Categories (One per line)" hint="Shows up in the sidebar.">
        <TextArea value={(data?.tags || []).join('\n')} onChange={v => set('tags', v.split('\n').filter(s => s.trim()))} rows={5} />
      </Field>
    </div>
  ),

  masonry_grid: ({ data = {}, set }) => {
    const items = data.items || [];
    return (
      <div className="space-y-4">
        <SectionTitle>Masonry Case Studies Grid</SectionTitle>
        <Field label="Grid Title"><TextInput value={data.title} onChange={v => set('title', v)} placeholder="Case Studies" /></Field>
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-2xl space-y-4 relative border border-gray-100 shadow-sm">
             <button onClick={() => set('items', items.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
             <p className="text-[10px] font-black text-sm-blue uppercase tracking-widest">Case Study #{i + 1}</p>
             <div className="grid grid-cols-2 gap-4">
                <Field label="Tile Title"><TextInput value={item.title} onChange={v => { const it=[...items]; it[i].title=v; set('items', it); }} /></Field>
                <Field label="Category Label"><TextInput value={item.category} onChange={v => { const it=[...items]; it[i].category=v; set('items', it); }} /></Field>
             </div>
             <ImageUpload label="Grid Image" value={item.img} onChange={v => { const it=[...items]; it[i].img=v; set('items', it); }} />
             
             <div className="pt-4 border-t border-gray-200 space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Page Content (for click-through)</p>
                <Field label="Intro Description"><TextArea value={item.description} onChange={v => { const it=[...items]; it[i].description=v; set('items', it); }} rows={3} /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Stat 1 Label"><TextInput value={item.stat1Label} onChange={v => { const it=[...items]; it[i].stat1Label=v; set('items', it); }} /></Field>
                  <Field label="Stat 1 Value"><TextInput value={item.stat1Value} onChange={v => { const it=[...items]; it[i].stat1Value=v; set('items', it); }} /></Field>
                </div>
             </div>
          </div>
        ))}
        <button onClick={() => set('items', [...items, { title: '', category: '', img: '', description: '' }])} className="w-full py-6 border-2 border-dashed border-indigo-100 rounded-2xl text-indigo-400 font-black uppercase text-[11px] tracking-widest hover:bg-indigo-50 transition-all shadow-sm">
           + Add Case Study Module
        </button>
      </div>
    );
  },

  topbar: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Top Bar Appearance</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
         <ColorInput label="Background Color" value={data?.bgColor} onChange={v => set('bgColor', v)} />
         <ColorInput label="Text Color" value={data?.textColor} onChange={v => set('textColor', v)} />
      </div>
      <SectionTitle>Contact Information</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email Address"><TextInput value={data?.email} onChange={v => set('email', v)} placeholder="info@schoolmart.in" /></Field>
        <Field label="Phone Number 1"><TextInput value={data?.phone1} onChange={v => set('phone1', v)} placeholder="+91 9966109191" /></Field>
        <Field label="Phone Number 2"><TextInput value={data?.phone2} onChange={v => set('phone2', v)} placeholder="+91 9866091111" /></Field>
      </div>
      <SectionTitle>Social Media Links</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Facebook"><TextInput value={data?.socials?.facebook} onChange={v => set('socials', { ...(data?.socials || {}), facebook: v })} placeholder="https://facebook.com/..." /></Field>
        <Field label="Twitter / X"><TextInput value={data?.socials?.twitter} onChange={v => set('socials', { ...(data?.socials || {}), twitter: v })} placeholder="https://twitter.com/..." /></Field>
        <Field label="Instagram"><TextInput value={data?.socials?.instagram} onChange={v => set('socials', { ...(data?.socials || {}), instagram: v })} placeholder="https://instagram.com/..." /></Field>
        <Field label="LinkedIn"><TextInput value={data?.socials?.linkedin} onChange={v => set('socials', { ...(data?.socials || {}), linkedin: v })} placeholder="https://linkedin.com/..." /></Field>
        <Field label="YouTube"><TextInput value={data?.socials?.youtube} onChange={v => set('socials', { ...(data?.socials || {}), youtube: v })} placeholder="https://youtube.com/..." /></Field>
      </div>
    </div>
  ),

  ticker: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Live Announcement Ticker</SectionTitle>
      <Field label="Announcement Label"><TextInput value={data?.label} onChange={v => set('label', v)} placeholder="LATEST UPDATES" /></Field>
      <Field label="Announcement Items" hint="One per line - will scroll on site">
        <TextArea value={(data?.items || []).join('\n')} onChange={v => set('items', v.split('\n'))} rows={6} placeholder="New Campus Launching in Mumbai\nBulk Discounts Available Now" />
      </Field>
    </div>
  ),

  discussion_forum: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Discussion Forum Connector</SectionTitle>
      <Field label="Gateway Route (URL)"><TextInput value={data?.url} onChange={v => set('url', v)} placeholder="/forum" /></Field>
      <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 flex items-center gap-3">
         <Globe className="text-indigo-400" size={16} />
         <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Maps the Forum button to your strategic community hub.</p>
      </div>
    </div>
  ),

  hero: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Text Content & DNA</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
         <Field label="Hero Background"><ColorInput value={data?.bgColor} onChange={v => set('bgColor', v)} /></Field>
         <Field label="Text Identity"><ColorInput value={data?.textColor} onChange={v => set('textColor', v)} /></Field>
      </div>
      <Field label="Badge"><TextInput value={data?.badge} onChange={v => set('badge', v)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Headline 1"><TextInput value={data?.headline1} onChange={v => set('headline1', v)} /></Field>
        <Field label="Headline 2"><TextInput value={data?.headline2} onChange={v => set('headline2', v)} /></Field>
      </div>
      
      <SectionTitle>Dynamic Media Core</SectionTitle>
      <div className="flex gap-2">
        {['slideshow', 'image', 'video'].map(mode => (
          <button key={mode} onClick={() => set('mediaType', mode)}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${data?.mediaType === mode || (!data?.mediaType && mode === 'slideshow') ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-200'}`}>
            {mode === 'video' ? <Video size={14} className="inline mr-2" /> : mode === 'image' ? <ImageIcon size={14} className="inline mr-2" /> : <Layers size={14} className="inline mr-2" />}
            {mode}
          </button>
        ))}
      </div>
      <MediaUpload label="Master Media Source" value={data?.mediaUrl} onChange={v => set('mediaUrl', v)} />

      <SectionTitle>Global Actions</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 border-r border-gray-50 pr-4">
           <Field label="Button 1 Label"><TextInput value={data?.cta1?.label} onChange={v => set('cta1', { ...(data?.cta1 || {}), label: v })} /></Field>
           <Field label="Button 1 Path"><TextInput value={data?.cta1?.path} onChange={v => set('cta1', { ...(data?.cta1 || {}), path: v })} /></Field>
        </div>
        <div className="space-y-4">
           <Field label="Button 2 Label"><TextInput value={data?.cta2?.label} onChange={v => set('cta2', { ...(data?.cta2 || {}), label: v })} /></Field>
           <Field label="Button 2 Path"><TextInput value={data?.cta2?.path} onChange={v => set('cta2', { ...(data?.cta2 || {}), path: v })} /></Field>
        </div>
      </div>
    </div>
  ),

  inner_page_hero: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Inner Hero Intelligence</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
         <Field label="Category Badge"><TextInput value={data?.badge} onChange={v => set('badge', v)} placeholder="Performance 2025" /></Field>
         <Field label="Subtitle Statement"><TextArea value={data?.subtitle} onChange={v => set('subtitle', v)} rows={2} placeholder="Engineering high-performance..." /></Field>
      </div>
      <Field label="Master Headline (HTML allowed)"><TextArea value={data?.titleHtml} onChange={v => set('titleHtml', v)} rows={3} placeholder='Built <br/> <span class="text-sm-blue">for</span> <br/> Champions.' /></Field>
      <Field label="Below-Hero Page Description (Full Paragraph)"><TextArea value={data?.pageDescription} onChange={v => set('pageDescription', v)} rows={4} placeholder="Type a detailed paragraph about this category..." /></Field>
      <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Description Text Color" value={data?.pageDescriptionTextColor} onChange={v => set('pageDescriptionTextColor', v)} />
        <ColorInput label="Description BG Color" value={data?.pageDescriptionBgColor} onChange={v => set('pageDescriptionBgColor', v)} />
      </div>
      
      <SectionTitle>Hero Colours</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Text Color" value={data?.textColor} onChange={v => set('textColor', v)} />
        <ColorInput label="Background Overlay Color" value={data?.bgColor} onChange={v => set('bgColor', v)} />
      </div>

      <SectionTitle>Background Media Core</SectionTitle>
      <div className="flex gap-2">
        {['image', 'video'].map(mode => (
          <button key={mode} onClick={() => set('mediaType', mode)}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${data?.mediaType === mode || (!data?.mediaType && mode === 'image') ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-200'}`}>
            {mode === 'video' ? <Video size={14} className="inline mr-2" /> : <ImageIcon size={14} className="inline mr-2" />}
            {mode}
          </button>
        ))}
      </div>
      <MediaUpload label="Primary Video/Image Upload" value={data?.mediaUrl} onChange={v => set('mediaUrl', v)} />
      <ImageUpload label="Fallback Fast-Load Image (SEO/Mobile)" value={data?.img} onChange={v => set('img', v)} />
    </div>
  ),

  manufacturing_hero: ({ data = {}, set }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-4">
         <div className="col-span-4">
           <Field label="Hero Command Title (HTML)"><TextInput value={data?.titleHtml} onChange={v => set('titleHtml', v)} /></Field>
         </div>
         <div className="col-span-2">
           <Field label="Operational Badge"><TextInput value={data?.badge} onChange={v => set('badge', v)} /></Field>
         </div>
      </div>
      <Field label="Manufacturing Description"><TextArea value={data?.description} onChange={v => set('description', v)} rows={3} /></Field>
      
      <SectionTitle>Dual Image Workflow</SectionTitle>
      <div className="grid grid-cols-2 gap-6">
         <ImageUpload 
           label="Primary Facility Shot" 
           value={data?.images?.[0]} 
           onChange={v => { const arr = [...(data?.images || [])]; arr[0] = v; set('images', arr); }} 
         />
         <ImageUpload 
           label="Secondary Action Detail" 
           value={data?.images?.[1]} 
           onChange={v => { const arr = [...(data?.images || [])]; arr[1] = v; set('images', arr); }} 
         />
      </div>

      <SectionTitle>Scale Benchmark Metrics</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
         <Field label="Statistic Value"><TextInput value={data?.partnerStat} onChange={v => set('partnerStat', v)} placeholder="4K+" /></Field>
         <Field label="Statistic Label"><TextInput value={data?.partnerLabel} onChange={v => set('partnerLabel', v)} placeholder="Partner Schools" /></Field>
      </div>
    </div>
  ),

  action_strip: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Global Action Strip</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Strip Background Color" value={data?.bgColor} onChange={v => set('bgColor', v)} />
        <ColorInput label="Strip Text Color" value={data?.textColor} onChange={v => set('textColor', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary Title"><TextInput value={data?.title} onChange={v => set('title', v)} placeholder="The 2025 Lookbook." /></Field>
        <Field label="Sub-title"><TextInput value={data?.subtitle} onChange={v => set('subtitle', v)} placeholder="MASTER CATALOGUE" /></Field>
      </div>
      <Field label="Routing Link" hint="Page this strip links to — e.g. /catalogues or /contact-us"><TextInput value={data?.downloadPath} onChange={v => set('downloadPath', v)} placeholder="/catalogues" /></Field>
    </div>
  ),

  sidebar_categories: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Sidebar Category Manager</SectionTitle>
      <p className="text-[11px] text-gray-400 font-medium">These categories appear in the left sidebar filter. Products must have a matching <strong>subcategory</strong> to appear under each category. Editing a name here will update the filter — make sure product subcategories match exactly.</p>
      <div className="space-y-2">
        {(data?.categories || []).map((cat, i) => (
          <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm group">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-500 shrink-0">{i + 1}</div>
            <input
              type="text"
              value={cat}
              onChange={e => {
                const updated = [...(data.categories || [])];
                updated[i] = e.target.value;
                set('categories', updated);
              }}
              className="flex-1 bg-transparent text-[12px] font-black text-gray-900 uppercase tracking-widest outline-none border-b border-transparent focus:border-indigo-300 transition-colors py-1"
              placeholder="Category name..."
            />
            <button
              onClick={() => set('categories', (data.categories || []).filter((_, j) => j !== i))}
              className="text-red-300 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => set('categories', [...(data?.categories || []), ''])}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:border-indigo-300 hover:bg-indigo-50 transition-all"
      >+ Add Category</button>
      {(data?.categories?.length > 0) && (
        <div className="mt-2 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">⚠ Tip: Product subcategory names must match exactly (case-insensitive) to appear under each filter.</p>
        </div>
      )}
    </div>
  ),

  action_stack: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Action Card Stack</SectionTitle>
      <div className="space-y-4">
        {(data.cards || []).map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
            <button onClick={() => set('cards', data.cards.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <ColorInput label="Card DNA Color" value={c.bgColor} onChange={v => { const t = [...data.cards]; t[i] = { ...t[i], bgColor: v }; set('cards', t); }} />
              <ColorInput label="Card Text Color" value={c.textColor} onChange={v => { const t = [...data.cards]; t[i] = { ...t[i], textColor: v }; set('cards', t); }} />
              <Field label="Redirection Route"><TextInput value={c.link} onChange={v => { const t = [...data.cards]; t[i] = { ...t[i], link: v }; set('cards', t); }} /></Field>
            </div>
            <Field label="Card Display Label (HTML allowed)"><TextArea value={c.title} onChange={v => { const t = [...data.cards]; t[i] = { ...t[i], title: v }; set('cards', t); }} rows={2} /></Field>
          </div>
        ))}
      </div>
      <button onClick={() => set('cards', [...(data.cards || []), { title: '', bgColor: '#FFFFFF', link: '/' }])}
        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Stack Node</button>
    </div>
  ),

  info_split_grid: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Info Split Grid Structure</SectionTitle>
      <Field label="Core Heading (HTML)"><TextInput value={data?.heading} onChange={v => set('heading', v)} /></Field>
      <Field label="Descriptive Passage"><TextArea value={data?.description} onChange={v => set('description', v)} rows={3} /></Field>
      <div className="grid grid-cols-2 gap-4 mb-4">
         <Field label="Button / CTA Label"><TextInput value={data?.ctaLabel} onChange={v => set('ctaLabel', v)} /></Field>
         <Field label="Button Target Route"><TextInput value={data?.ctaPath} onChange={v => set('ctaPath', v)} /></Field>
      </div>
      <ImageUpload label="Grid Split Imagery" value={data?.image} onChange={v => set('image', v)} />
      
      <SectionTitle>Feature Points List</SectionTitle>
      <Field label="Points (One per line)" hint="These map to the grid blocks with checkmarks.">
        <TextArea 
          value={(data?.points || []).map(p => typeof p === 'string' ? p : p.text).join('\n')} 
          onChange={v => set('points', v.split('\n').map(s => s.trimEnd()))} 
          rows={4} 
        />
      </Field>
    </div>
  ),

  solutions: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Solution Matrix</SectionTitle>
      <Field label="Master Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} /></Field>
      <div className="space-y-4">
        {(data.items || []).map((item, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 relative group">
            <button onClick={() => set('items', data.items.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <Field label="Card Title"><TextInput value={item.title} onChange={v => { const t = [...data.items]; t[i] = { ...t[i], title: v }; set('items', t); }} /></Field>
               <Field label="Target Route"><TextInput value={item.path} onChange={v => { const t = [...data.items]; t[i] = { ...t[i], path: v }; set('items', t); }} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <Field label="Badge Text"><TextInput value={item.badge?.label} onChange={v => { const t = [...data.items]; t[i] = { ...t[i], badge: { ...t[i].badge, label: v } }; set('items', t); }} /></Field>
               <ColorInput label="Badge Color" value={item.badge?.color} onChange={v => { const t = [...data.items]; t[i] = { ...t[i], badge: { ...t[i].badge, color: v } }; set('items', t); }} />
            </div>
            <Field label="Institutional Description"><TextArea value={item.description} onChange={v => { const t = [...data.items]; t[i] = { ...t[i], description: v }; set('items', t); }} rows={2} /></Field>
            <ImageUpload label="Card Image" value={item.img} onChange={v => { const t = [...data.items]; t[i] = { ...t[i], img: v }; set('items', t); }} />
          </div>
        ))}
      </div>
      <button onClick={() => set('items', [...(data.items || []), { title: '', description: '', path: '/', img: '', badge: { label: '', color: '#3B82F6' } }])}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:border-indigo-300 hover:bg-indigo-50 transition-all">+ Add Solution Card</button>
    </div>
  ),

  resource_tile: ({ data = {}, set }) => (
    <div className="space-y-8">
      <SectionTitle>Resource Master Mirror</SectionTitle>
      <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 space-y-6">
        <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Home Page Preview (Tile)</h5>
        <Field label="Tile Title"><TextInput value={data.title} onChange={v => set('title', v)} /></Field>
        <Field label="Preview Summary"><TextArea value={data.description} onChange={v => set('description', v)} rows={2} /></Field>
        <ImageUpload label="Tile Cover Image" value={data.img} onChange={v => set('img', v)} />
        <Field label="Dynamic Slug (Identity)"><TextInput value={data.slug} onChange={v => set('slug', v)} placeholder="library-trends-2025" /></Field>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> Inner Resource Content</h5>
        <Field label="Technical Headline"><TextInput value={data.inner?.headline} onChange={v => set('inner', { ...data.inner, headline: v })} /></Field>
        <Field label="Full Post Content (HTML/Markdown support)"><TextArea value={data.inner?.content} onChange={v => set('inner', { ...data.inner, content: v })} rows={8} /></Field>
        <div className="grid grid-cols-2 gap-4">
           <Field label="Downloadable Source (PDF)"><TextInput value={data.inner?.fileUrl} onChange={v => set('inner', { ...data.inner, fileUrl: v })} /></Field>
           <Field label="Consultation Label"><TextInput value={data.inner?.btnLabel} onChange={v => set('inner', { ...data.inner, btnLabel: v })} /></Field>
        </div>
      </div>
    </div>
  ),

  ready_to_scale: ({ data = {}, set }) => (
    <div className="space-y-6 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
      <SectionTitle>Strategic Growth Box</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
         <ColorInput label="Box DNA (Background)" value={data.bgColor} onChange={v => set('bgColor', v)} />
         <ColorInput label="Text DNA" value={data.textColor} onChange={v => set('textColor', v)} />
      </div>
      <Field label="Core Headline"><TextInput value={data.title} onChange={v => set('title', v)} /></Field>
      <Field label="Strategic Sub-headline"><TextArea value={data.subtitle} onChange={v => set('subtitle', v)} rows={3} /></Field>
      <div className="grid grid-cols-2 gap-4">
         <Field label="Action Button Label"><TextInput value={data.btnLabel} onChange={v => set('btnLabel', v)} /></Field>
         <Field label="Target Identity (Path)"><TextInput value={data.btnPath} onChange={v => set('btnPath', v)} /></Field>
      </div>
    </div>
  ),

  free_consultation: ({ data = {}, set }) => (
    <div className="space-y-4 p-8 bg-blue-50/20 rounded-3xl border border-blue-50">
      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Lock size={14}/> Consultation Hook</h4>
      <div className="grid grid-cols-2 gap-4">
        <ColorInput label="Box Color" value={data.bgColor} onChange={v => set('bgColor', v)} />
        <Field label="Header Message"><TextInput value={data.title} onChange={v => set('title', v)} /></Field>
      </div>
      <Field label="Label DNA"><TextInput value={data.label} onChange={v => set('label', v)} /></Field>
      <Field label="Consultation Route"><TextInput value={data.path} onChange={v => set('path', v)} /></Field>
    </div>
  ),

  school_partners: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Institutional Relationships</SectionTitle>
      <Field label="Section Header"><TextInput value={data.heading} onChange={v => set('heading', v)} /></Field>
      <Field label="Partner Rostrum (comma separated names)">
        <TextArea value={(data.partners || []).join(', ')} onChange={v => set('partners', v.split(',').map(s => s.trim()))} rows={4} />
      </Field>
      <Field label="Relationship Matrix Link"><TextInput value={data.path} onChange={v => set('path', v)} /></Field>
    </div>
  ),

  quote_page_fields: ({ data = {}, set }) => (
    <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <SectionTitle>Institutional Quote Verifier</SectionTitle>
      <Field label="Quote Submit Button"><TextInput value={data.submitLabel} onChange={v => set('submitLabel', v)} /></Field>
      <div className="grid grid-cols-2 gap-6 pt-4">
        <Field label="Lead Name Holder"><TextInput value={data.labels?.name} onChange={v => set('labels', { ...data.labels, name: v })} /></Field>
        <Field label="Institution Holder"><TextInput value={data.labels?.school} onChange={v => set('labels', { ...data.labels, school: v })} /></Field>
        <Field label="Jurisdiction PIN"><TextInput value={data.labels?.pincode} onChange={v => set('labels', { ...data.labels, pincode: v })} /></Field>
        <Field label="Hotline Holder"><TextInput value={data.labels?.phone} onChange={v => set('labels', { ...data.labels, phone: v })} /></Field>
      </div>
    </div>
  ),

  sidebar_banners: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Sidebar Banner Stack</SectionTitle>
      <div className="space-y-4">
        {(data.banners || []).map((b, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
            <button onClick={() => set('banners', data.banners.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Title Label"><TextInput value={b.label} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], label: v }; set('banners', t); }} /></Field>
              <ColorInput label="Banner DNA" value={b.color} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], color: v }; set('banners', t); }} />
            </div>
            <Field label="Institutional Sub-label"><TextInput value={b.sublabel} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], sublabel: v }; set('banners', t); }} /></Field>
            <Field label="Target Route"><TextInput value={b.path} onChange={v => { const t = [...data.banners]; t[i] = { ...t[i], path: v }; set('banners', t); }} /></Field>
          </div>
        ))}
      </div>
      <button onClick={() => set('banners', [...(data.banners || []), { label: '', sublabel: '', color: '#0057A8', path: '/' }])}
        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest hover:border-gray-200">+ Add Banner Card</button>
    </div>
  ),

  product_carousel: ({ data = {}, set }) => (
    <div className="space-y-6">
        <SectionTitle>Product Carousel Intelligence</SectionTitle>
        {(data.items || []).map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative space-y-4">
                <button onClick={() => set('items', data.items.filter((_, j) => j !== i))} className="absolute top-4 right-4 text-red-300"><Trash2 size={16}/></button>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Product Identity"><TextInput value={item.title} onChange={v => { const s = [...data.items]; s[i] = { ...s[i], title: v }; set('items', s); }} /></Field>
                    <Field label="Pricing Point"><TextInput value={item.price} onChange={v => { const s = [...data.items]; s[i] = { ...s[i], price: v }; set('items', s); }} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Detail Matrix Route"><TextInput value={item.path} onChange={v => { const s = [...data.items]; s[i] = { ...s[i], path: v }; set('items', s); }} /></Field>
                    <Field label="Cart Identity Link"><TextInput value={item.cartLink} onChange={v => { const s = [...data.items]; s[i] = { ...s[i], cartLink: v }; set('items', s); }} /></Field>
                </div>
                <ImageUpload label="Product Visual" value={item.img} onChange={v => { const s = [...data.items]; s[i] = { ...s[i], img: v }; set('items', s); }} />
            </div>
        ))}
        <button onClick={() => set('items', [...(data.items || []), { title: '', price: '', img: '', path: '#', cartLink: '#' }])}
            className="w-full py-6 rounded-3xl border-2 border-dashed border-gray-100 text-[10px] font-black uppercase tracking-widest">+ Inject Product Tile</button>
    </div>
  ),

  school_sale_listings: ({ data = {}, fullContent = [], set }) => {
    const categoryBlock = fullContent.find(b => b.type === 'sidebar_categories');
    const cities = categoryBlock?.data?.categories || [];

    return (
      <div className="space-y-6">
        <SectionTitle>School Sale Mandates</SectionTitle>
        {(data.items || []).map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative group space-y-6">
            <button 
              onClick={() => set('items', data.items.filter((_, j) => j !== i))}
              className="absolute top-6 right-6 text-red-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
            
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600 uppercase">
                  {i + 1}
               </div>
               <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Module</h5>
            </div>
  
            <div className="grid grid-cols-2 gap-6">
               <Field label="Listing Title"><TextInput value={item.title} onChange={v => { const s=[...data.items]; s[i]={...s[i], title:v}; set('items', s); }} placeholder="Super Star School at West Hyd" /></Field>
               <Field label="Location (City)" hint="Select from Sidebar Categories">
                  <select 
                    value={item.location} 
                    onChange={e => { const s=[...data.items]; s[i]={...s[i], location:e.target.value}; set('items', s); }}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm font-black uppercase tracking-widest"
                  >
                    <option value="">Select City...</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    {!cities.includes(item.location) && item.location && <option value={item.location}>{item.location}</option>}
                  </select>
               </Field>
            </div>
  
            <div className="grid grid-cols-3 gap-4">
               <Field label="Type" hint="SALE / LEASE"><TextInput value={item.type} onChange={v => { const s=[...data.items]; s[i]={...s[i], type:v}; set('items', s); }} placeholder="SALE" /></Field>
               <Field label="Mandate Value"><TextInput value={item.price} onChange={v => { const s=[...data.items]; s[i]={...s[i], price:v}; set('items', s); }} placeholder="12cr" /></Field>
               <Field label="Rating (1-5)"><TextInput value={item.rating} onChange={v => { const s=[...data.items]; s[i]={...s[i], rating:v}; set('items', s); }} placeholder="4.5" /></Field>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
               <Field label="Sales P.A. (Run Rate)"><TextInput value={item.runRate} onChange={v => { const s=[...data.items]; s[i]={...s[i], runRate:v}; set('items', s); }} placeholder="19CR" /></Field>
               <Field label="Margin %"><TextInput value={item.margin} onChange={v => { const s=[...data.items]; s[i]={...s[i], margin:v}; set('items', s); }} placeholder="25%+" /></Field>
            </div>
  
            <Field label="Description / Highlights" hint="Detailed paragraph. Use full stops to separate bullet points.">
               <TextArea value={item.description} onChange={v => { const s=[...data.items]; s[i]={...s[i], description:v}; set('items', s); }} rows={4} />
            </Field>
  
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
               <Field label="CTA Button Label"><TextInput value={item.ctaLabel} onChange={v => { const s=[...data.items]; s[i]={...s[i], ctaLabel:v}; set('items', s); }} placeholder="Contact Us" /></Field>
               <Field label="CTA Redirect Path"><TextInput value={item.ctaLink} onChange={v => { const s=[...data.items]; s[i]={...s[i], ctaLink:v}; set('items', s); }} placeholder="/contact-us" /></Field>
            </div>
          </div>
        ))}
  
        <button 
          onClick={() => set('items', [...(data.items || []), { title: '', location: '', price: '', type: 'SALE', rating: '4.8', runRate: '', margin: '', description: '', ctaLabel: 'Contact Us', ctaLink: '/contact-us' }])}
          className="w-full py-8 rounded-[2rem] border-2 border-dashed border-gray-100 text-gray-400 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:border-orange-200 hover:text-orange-500 transition-all shadow-sm"
        >
          + Inject New Asset Mandate
        </button>
      </div>
    );
  },

  tiles: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Masonry Grid Tiles</SectionTitle>
      <p className="text-[11px] text-gray-400 font-medium">Click a tile card to edit it. Each tile has two sections: <strong>Card Fields</strong> (what shows on the home page grid) and <strong>Inner Page Fields</strong> (content shown when someone clicks through to that tile's page).</p>
      <div className="space-y-3">
        {(data.tiles || []).map((t, i) => (
          <TileEditor key={i} t={t} i={i} data={data} set={set} />
        ))}
      </div>
      <button onClick={async () => {
          const name = prompt('Tile / Inner Page Title:');
          if (!name) return;
          const safeSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
          const finalPath = `/p/${safeSlug}`;
          const finalCmsSlug = `resource-${safeSlug}`;
          
          try {
            // Auto-create the inner page in backend
            await createPage(finalCmsSlug, name);
            
            // Add the tile to home page list
            set('tiles', [...(data.tiles || []), { 
              title: name, 
              subtitle: 'Institutional Insight ' + new Date().getFullYear(), 
              path: finalPath, 
              img: '', 
              span: 'h-64', 
              inner: { 
                badge: 'Institutional Insight', 
                heading: name, 
                description: '', 
                content: '', 
                specs: [], 
                tags: [],
                gallery: [],
                btn1Label: 'DOWNLOAD GUIDE',
                btn1Path: '',
                btn2Label: 'SHARE',
                btn2Path: ''
              } 
            }]);
            
            alert(`Tile added and page "${finalCmsSlug}" created!`);
          } catch (err) {
            alert('Failed to initialize tile page: ' + err.message);
          }
        }}
        className="w-full py-6 rounded-3xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:border-indigo-300 hover:bg-indigo-50 transition-all">+ Add New Tile & Auto-Create Page</button>
    </div>
  ),

  cta_whatsapp: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>WhatsApp CTA Section</SectionTitle>
      <ColorInput label="Section Background Color" value={data?.bgColor} onChange={v => set('bgColor', v)} />
      <Field label="Badge Text"><TextInput value={data?.badge} onChange={v => set('badge', v)} placeholder="Direct Consultation" /></Field>
      <Field label="Main Headline"><TextInput value={data?.headline} onChange={v => set('headline', v)} placeholder="Ready to scale your campus?" /></Field>
      <Field label="Description"><TextArea value={data?.description} onChange={v => set('description', v)} rows={3} placeholder="At SchoolMart, we provide end-to-end expertise..." /></Field>
      <SectionTitle>Contact Links</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
         <Field label="WhatsApp Number" hint="Country code + number, no spaces"><TextInput value={data?.whatsappNumber} onChange={v => set('whatsappNumber', v)} placeholder="919966109191" /></Field>
         <Field label="Phone Number"><TextInput value={data?.phone} onChange={v => set('phone', v)} placeholder="+91 9966109191" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
         <Field label="WhatsApp Button Label"><TextInput value={data?.whatsappLabel} onChange={v => set('whatsappLabel', v)} placeholder="Connect on WhatsApp" /></Field>
         <Field label="Phone Button Label"><TextInput value={data?.phoneLabel} onChange={v => set('phoneLabel', v)} placeholder="Call Support" /></Field>
      </div>
    </div>
  ),

  partners: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Partner Schools Section</SectionTitle>
      <Field label="Section Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} placeholder="Trusted by Leading Schools" /></Field>
      <Field label="Sub-heading"><TextInput value={data?.subheading} onChange={v => set('subheading', v)} placeholder="4000+ partner schools across India" /></Field>
      
      <SectionTitle>Stats</SectionTitle>
      <div className="space-y-3">
        {(data?.stats || []).map((stat, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative flex gap-4 items-center">
            <button onClick={() => set('stats', data.stats.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="flex-1"><Field label="Value"><TextInput value={stat.value} onChange={v => { const s = [...data.stats]; s[i] = { ...s[i], value: v }; set('stats', s); }} placeholder="4000+" /></Field></div>
            <div className="flex-1"><Field label="Label"><TextInput value={stat.label} onChange={v => { const s = [...data.stats]; s[i] = { ...s[i], label: v }; set('stats', s); }} placeholder="Partner Schools" /></Field></div>
          </div>
        ))}
        <button onClick={() => set('stats', [...(data?.stats || []), { value: '', label: '' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Stat</button>
      </div>
      
      <SectionTitle>Partner School Names (Ticker)</SectionTitle>
      <Field label="School Names" hint="One school name per line. These scroll in the marquee ticker.">
        <TextArea value={(data?.clients || []).map(c => typeof c === 'string' ? c : c.name).join('\n')} onChange={v => set('clients', v.split('\n').map(s => s.trimEnd()).map(name => ({ name })))} rows={8} placeholder="AVN Vida International School\nDRS International School\nDelhi Public School" />
      </Field>
    </div>
  ),

  advisory: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Sidebar Advisory Module</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Hero Icon" hint="Lucide Icon Name (e.g. Rocket)"><TextInput value={data.icon} onChange={v => set('icon', v)} /></Field>
        <Field label="Badge Text"><TextInput value={data.badge} onChange={v => set('badge', v)} /></Field>
      </div>
      <Field label="Main Title (HTML allowed)"><TextArea value={data.titleHtml || data.title} onChange={v => set('titleHtml', v)} rows={2} /></Field>
      <Field label="Supporting Subtitle"><TextArea value={data.subtitle} onChange={v => set('subtitle', v)} rows={3} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA Label"><TextInput value={data.ctaLabel} onChange={v => set('ctaLabel', v)} /></Field>
        <Field label="CTA Destination (Path)"><TextInput value={data.ctaPath} onChange={v => set('ctaPath', v)} /></Field>
      </div>
    </div>
  ),

  sidebar_trending: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Sidebar — Trending Items</SectionTitle>
      <Field label="Trending Links" hint="One item per line. These appear in the sidebar 'TRENDING' widget.">
        <TextArea value={(data?.items || []).join('\n')} onChange={v => set('items', v.split('\n').map(s => s.trim()).filter(Boolean))} rows={8} placeholder="Schools for Sale / Lease\nFundraising\nPartnerships\nWorkshops\nJob Openings\nJoin as Influencers" />
      </Field>
    </div>
  ),

  sidebar_resources: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Sidebar — Resources Items</SectionTitle>
      <Field label="Resource Links" hint="One item per line. These appear in the sidebar 'RESOURCES' widget.">
        <TextArea value={(data?.items || []).join('\n')} onChange={v => set('items', v.split('\n').map(s => s.trim()).filter(Boolean))} rows={10} placeholder="Setup School in India\nDigitization Guide\nProduct Catalog 2025\nSkill Lab Guide\nLookbook – Play Furniture" />
      </Field>
    </div>
  ),

  navbar: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Navbar Category Bar</SectionTitle>
      <p className="text-[11px] text-gray-400 font-medium">These are the category icons shown below the main navigation bar.</p>
      <div className="space-y-4">
        {(data?.categories || []).map((cat, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
            <button onClick={() => set('categories', data.categories.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Category Name"><TextInput value={cat.name} onChange={v => { const c = [...data.categories]; c[i] = { ...c[i], name: v }; set('categories', c); }} /></Field>
              <Field label="Page Link"><TextInput value={cat.path} onChange={v => { const c = [...data.categories]; c[i] = { ...c[i], path: v }; set('categories', c); }} placeholder="/furniture" /></Field>
              <Field label="Icon Name" hint="Armchair, Building2, Laptop, etc."><TextInput value={cat.icon} onChange={v => { const c = [...data.categories]; c[i] = { ...c[i], icon: v }; set('categories', c); }} /></Field>
            </div>
          </div>
        ))}
        <button onClick={() => set('categories', [...(data?.categories || []), { name: '', path: '/', icon: 'BookOpen' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Category</button>
      </div>
    </div>
  ),

  // ── REGISTRATION PAGE ─────────────────────────────────────────
  registration_hero: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Registration Hero Section</SectionTitle>
      <Field label="Badge Text"><TextInput value={data?.badge} onChange={v => set('badge', v)} placeholder="Partner Network" /></Field>
      <Field label="Main Heading (HTML)" hint="Use <br/> for line breaks, <span> for styled text"><TextArea value={data?.heading} onChange={v => set('heading', v)} rows={3} placeholder='Join <br/> The <span class="text-sm-blue italic font-serif opacity-80">Circle.</span>' /></Field>
      <Field label="Description Paragraph"><TextArea value={data?.description} onChange={v => set('description', v)} rows={3} placeholder="Get exclusive access to architectural blueprints..." /></Field>
      <SectionTitle>Sidebar Stat Cards</SectionTitle>
      <div className="space-y-3">
        {(data?.statCards || []).map((card, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative flex gap-4">
            <button onClick={() => set('statCards', data.statCards.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="flex-1"><Field label="Title"><TextInput value={card.title} onChange={v => { const s = [...data.statCards]; s[i] = { ...s[i], title: v }; set('statCards', s); }} /></Field></div>
            <div className="flex-1"><Field label="Subtitle"><TextInput value={card.subtitle} onChange={v => { const s = [...data.statCards]; s[i] = { ...s[i], subtitle: v }; set('statCards', s); }} /></Field></div>
          </div>
        ))}
        <button onClick={() => set('statCards', [...(data?.statCards || []), { title: '', subtitle: '' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Stat Card</button>
      </div>
    </div>
  ),

  registration_fields: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Registration Form Fields</SectionTitle>
      <Field label="Form Title"><TextInput value={data?.formTitle} onChange={v => set('formTitle', v)} placeholder="Partner school Registration Form." /></Field>
      <Field label="Form Subtitle"><TextInput value={data?.formSubtitle} onChange={v => set('formSubtitle', v)} placeholder="Please Select the services and get information..." /></Field>
      <Field label="Section Heading (Left Column)"><TextInput value={data?.sectionHeading} onChange={v => set('sectionHeading', v)} placeholder="Institutional Info" /></Field>
      <Field label="Submit Button Text"><TextInput value={data?.submitLabel} onChange={v => set('submitLabel', v)} placeholder="SUBMIT" /></Field>
      <SectionTitle>Form Fields</SectionTitle>
      <p className="text-[11px] text-gray-400 font-medium">Add, remove, reorder, and mark fields as required. Required fields show a red asterisk (*) on the frontend.</p>
      <div className="space-y-3">
        {(data?.fields || []).map((field, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
            <button onClick={() => set('fields', data.fields.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="grid grid-cols-4 gap-3">
              <Field label="Field Label"><TextInput value={field.label} onChange={v => { const f = [...data.fields]; f[i] = { ...f[i], label: v }; set('fields', f); }} /></Field>
              <Field label="Placeholder"><TextInput value={field.placeholder} onChange={v => { const f = [...data.fields]; f[i] = { ...f[i], placeholder: v }; set('fields', f); }} /></Field>
              <Field label="Type">
                <select value={field.type || 'text'} onChange={e => { const f = [...data.fields]; f[i] = { ...f[i], type: e.target.value }; set('fields', f); }}
                  className="w-full px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-sm">
                  <option value="text">Text</option><option value="email">Email</option><option value="password">Password</option>
                  <option value="tel">Phone</option><option value="textarea">Textarea</option><option value="select">Dropdown</option>
                </select>
              </Field>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" checked={!!field.required} onChange={e => { const f = [...data.fields]; f[i] = { ...f[i], required: e.target.checked }; set('fields', f); }} className="w-4 h-4 rounded text-red-600" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Required *</span>
              </div>
            </div>
            {field.type === 'select' && (
              <div className="mt-3">
                <Field label="Dropdown Options" hint="One option per line">
                  <TextArea value={(field.options || []).join('\n')} onChange={v => { const f = [...data.fields]; f[i] = { ...f[i], options: v.split('\n').map(s => s.trim()).filter(Boolean) }; set('fields', f); }} rows={3} />
                </Field>
              </div>
            )}
          </div>
        ))}
        <button onClick={() => set('fields', [...(data?.fields || []), { label: '', placeholder: '', type: 'text', required: false }])}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Field</button>
      </div>
    </div>
  ),

  registration_services: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Select Services Checklist</SectionTitle>
      <Field label="Section Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} placeholder="Select Services" /></Field>
      <SectionTitle>Services List</SectionTitle>
      <div className="space-y-2">
        {(data?.services || []).map((srv, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={srv} onChange={v => { const s = [...data.services]; s[i] = v; set('services', s); }} />
            <button onClick={() => set('services', data.services.filter((_, j) => j !== i))} className="p-3 text-red-300 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
          </div>
        ))}
        <button onClick={() => set('services', [...(data?.services || []), ''])}
          className="w-full py-4 rounded-xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Service Item</button>
      </div>
    </div>
  ),

  registration_school_types: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>School Type Dropdown Options</SectionTitle>
      <div className="space-y-2">
        {(data?.options || []).map((opt, i) => (
          <div key={i} className="flex gap-2">
            <TextInput value={opt} onChange={v => { const o = [...data.options]; o[i] = v; set('options', o); }} />
            <button onClick={() => set('options', data.options.filter((_, j) => j !== i))} className="p-3 text-red-300 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
          </div>
        ))}
        <button onClick={() => set('options', [...(data?.options || []), ''])}
          className="w-full py-4 rounded-xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Option</button>
      </div>
    </div>
  ),

  registration_features: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Bottom Feature Cards</SectionTitle>
      <div className="space-y-4">
        {(data?.cards || []).map((card, i) => (
          <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative">
            <button onClick={() => set('cards', data.cards.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Card Title"><TextInput value={card.title} onChange={v => { const c = [...data.cards]; c[i] = { ...c[i], title: v }; set('cards', c); }} /></Field>
              <Field label="Icon Name" hint="ShieldCheck, Globe, Sparkles, ArrowRight"><TextInput value={card.icon} onChange={v => { const c = [...data.cards]; c[i] = { ...c[i], icon: v }; set('cards', c); }} /></Field>
            </div>
            <Field label="Card Description"><TextArea value={card.description} onChange={v => { const c = [...data.cards]; c[i] = { ...c[i], description: v }; set('cards', c); }} rows={2} /></Field>
          </div>
        ))}
        <button onClick={() => set('cards', [...(data?.cards || []), { title: '', description: '', icon: 'Globe' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Feature Card</button>
      </div>
    </div>
  ),

  // ── LOGIN PAGE ────────────────────────────────────────────────
  login_hero: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Login Hero Section (Left Side)</SectionTitle>
      <Field label="Badge Text"><TextInput value={data?.badge} onChange={v => set('badge', v)} placeholder="Secure Institutional Portal" /></Field>
      <Field label="Main Heading (HTML)" hint="Use <br/> for line breaks"><TextArea value={data?.heading} onChange={v => set('heading', v)} rows={3} placeholder='Welcome <br/> <span class="text-sm-blue italic">Back.</span>' /></Field>
      <Field label="Description Paragraph"><TextArea value={data?.description} onChange={v => set('description', v)} rows={3} /></Field>
      <SectionTitle>Member Stats</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Stats Title"><TextInput value={data?.statsTitle} onChange={v => set('statsTitle', v)} placeholder="Member Circle" /></Field>
        <Field label="Stats Count"><TextInput value={data?.statsCount} onChange={v => set('statsCount', v)} placeholder="15k+ Institutions Online" /></Field>
      </div>
    </div>
  ),

  login_fields: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Login Form Labels & Text</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Step 1 Heading"><TextInput value={data?.step1Heading} onChange={v => set('step1Heading', v)} placeholder="SIGN IN" /></Field>
        <Field label="Step 1 Subtitle"><TextInput value={data?.step1Subtitle} onChange={v => set('step1Subtitle', v)} placeholder="Everything a school needs is within reach." /></Field>
      </div>
      <SectionTitle>Field Labels</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email Label"><TextInput value={data?.emailLabel} onChange={v => set('emailLabel', v)} placeholder="Work Email" /></Field>
        <Field label="Email Placeholder"><TextInput value={data?.emailPlaceholder} onChange={v => set('emailPlaceholder', v)} placeholder="example@institutional.in" /></Field>
        <Field label="Password Label"><TextInput value={data?.passwordLabel} onChange={v => set('passwordLabel', v)} placeholder="Security Key" /></Field>
        <Field label="Forgot Password Link Text"><TextInput value={data?.forgotText} onChange={v => set('forgotText', v)} placeholder="Forgot?" /></Field>
      </div>
      <SectionTitle>Buttons & Prompts</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Login Button Text"><TextInput value={data?.loginBtnText} onChange={v => set('loginBtnText', v)} placeholder="Authorize Portal" /></Field>
        <Field label="New User Prompt"><TextInput value={data?.newUserPrompt} onChange={v => set('newUserPrompt', v)} placeholder="New Institution?" /></Field>
        <Field label="Register Link Text"><TextInput value={data?.registerLinkText} onChange={v => set('registerLinkText', v)} placeholder="Create School Account" /></Field>
      </div>
      <SectionTitle>OTP Step Labels</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Step 2 Heading"><TextInput value={data?.step2Heading} onChange={v => set('step2Heading', v)} placeholder="2FA VERIFY" /></Field>
        <Field label="Step 2 Subtitle"><TextInput value={data?.step2Subtitle} onChange={v => set('step2Subtitle', v)} placeholder="Enter the code from your email" /></Field>
        <Field label="Verify Button Text"><TextInput value={data?.verifyBtnText} onChange={v => set('verifyBtnText', v)} placeholder="Verify Identity" /></Field>
        <Field label="Resend Button Text"><TextInput value={data?.resendText} onChange={v => set('resendText', v)} placeholder="Resend Security Code" /></Field>
      </div>
    </div>
  ),

    // ── GENERIC INNER PAGE BLOCKS ─────────────────────────────────
  page_features: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Feature Cards Grid</SectionTitle>
      <Field label="Section Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} /></Field>
      <div className="space-y-4">
        {(data?.features || []).map((feat, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
            <button onClick={() => set('features', data.features.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Title"><TextInput value={feat.title} onChange={v => { const f = [...data.features]; f[i] = { ...f[i], title: v }; set('features', f); }} /></Field>
              <Field label="Description"><TextInput value={feat.description} onChange={v => { const f = [...data.features]; f[i] = { ...f[i], description: v }; set('features', f); }} /></Field>
              <Field label="Icon"><TextInput value={feat.icon} onChange={v => { const f = [...data.features]; f[i] = { ...f[i], icon: v }; set('features', f); }} /></Field>
            </div>
          </div>
        ))}
        <button onClick={() => set('features', [...(data?.features || []), { title: '', description: '', icon: '' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Feature</button>
      </div>
    </div>
  ),

  page_stats: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Statistics Section</SectionTitle>
      <ColorInput label="Section Background" value={data?.bgColor} onChange={v => set('bgColor', v)} />
      <div className="space-y-3">
        {(data?.stats || []).map((stat, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100 relative flex gap-4">
            <button onClick={() => set('stats', data.stats.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="flex-1"><Field label="Value"><TextInput value={stat.value} onChange={v => { const s = [...data.stats]; s[i] = { ...s[i], value: v }; set('stats', s); }} /></Field></div>
            <div className="flex-1"><Field label="Label"><TextInput value={stat.label} onChange={v => { const s = [...data.stats]; s[i] = { ...s[i], label: v }; set('stats', s); }} /></Field></div>
          </div>
        ))}
        <button onClick={() => set('stats', [...(data?.stats || []), { value: '', label: '' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Stat</button>
      </div>
    </div>
  ),

  page_faq: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>FAQ Section</SectionTitle>
      <Field label="Section Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} placeholder="Frequently Asked Questions" /></Field>
      <div className="space-y-3">
        {(data?.items || []).map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
            <button onClick={() => set('items', data.items.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <Field label="Question"><TextInput value={item.question} onChange={v => { const f = [...data.items]; f[i] = { ...f[i], question: v }; set('items', f); }} /></Field>
            <Field label="Answer"><TextArea value={item.answer} onChange={v => { const f = [...data.items]; f[i] = { ...f[i], answer: v }; set('items', f); }} rows={3} /></Field>
          </div>
        ))}
        <button onClick={() => set('items', [...(data?.items || []), { question: '', answer: '' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add FAQ</button>
      </div>
    </div>
  ),

  page_cta: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Call to Action Strip</SectionTitle>
      <ColorInput label="Background Color" value={data?.bgColor} onChange={v => set('bgColor', v)} />
      <Field label="Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} /></Field>
      <Field label="Description"><TextArea value={data?.description} onChange={v => set('description', v)} rows={2} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Button Label"><TextInput value={data?.btnLabel} onChange={v => set('btnLabel', v)} /></Field>
        <Field label="Button Link"><TextInput value={data?.btnLink} onChange={v => set('btnLink', v)} /></Field>
      </div>
    </div>
  ),

  page_gallery: ({ data = {}, set }) => (
    <div className="space-y-6">
      <SectionTitle>Image Gallery / Masonry Grid</SectionTitle>
      <Field label="Section Heading"><TextInput value={data?.heading} onChange={v => set('heading', v)} /></Field>
      <div className="space-y-3">
        {(data?.images || []).map((img, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
            <button onClick={() => set('images', data.images.filter((_, j) => j !== i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Caption"><TextInput value={img.caption} onChange={v => { const g = [...data.images]; g[i] = { ...g[i], caption: v }; set('images', g); }} /></Field>
              <Field label="Link"><TextInput value={img.link} onChange={v => { const g = [...data.images]; g[i] = { ...g[i], link: v }; set('images', g); }} /></Field>
            </div>
            <ImageUpload label="Image" value={img.url} onChange={v => { const g = [...data.images]; g[i] = { ...g[i], url: v }; set('images', g); }} />
          </div>
        ))}
        <button onClick={() => set('images', [...(data?.images || []), { url: '', caption: '', link: '' }])}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-widest">+ Add Image</button>
      </div>
    </div>
  ),

  workshops_list: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Workshop Events</SectionTitle>
      <p className="text-[11px] text-gray-400 font-medium">Each workshop card shown on the Workshops page. Leave empty to use built-in defaults.</p>
      {(data?.items || []).map((w, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 relative">
          <button onClick={() => set('items', (data.items||[]).filter((_,j)=>j!==i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Day"><TextInput value={w.date?.day} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],date:{...it[i].date,day:v}}; set('items',it); }} placeholder="18"/></Field>
            <Field label="Month"><TextInput value={w.date?.month} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],date:{...it[i].date,month:v}}; set('items',it); }} placeholder="Jul"/></Field>
            <Field label="Type"><TextInput value={w.type} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],type:v}; set('items',it); }} placeholder="Masterclass"/></Field>
          </div>
          <Field label="Title"><TextInput value={w.title} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],title:v}; set('items',it); }}/></Field>
          <Field label="Description"><TextArea value={w.desc} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],desc:v}; set('items',it); }} rows={2}/></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Location"><TextInput value={w.location} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],location:v}; set('items',it); }}/></Field>
            <Field label="Duration"><TextInput value={w.duration} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],duration:v}; set('items',it); }}/></Field>
            <Field label="Price"><TextInput value={w.price} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],price:v}; set('items',it); }} placeholder="₹2,499"/></Field>
          </div>
          <div className="flex items-center gap-2"><input type="checkbox" checked={!!w.featured} onChange={e=>{ const it=[...(data.items||[])]; it[i]={...it[i],featured:e.target.checked}; set('items',it); }} className="w-4 h-4 rounded"/><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Featured (Most Popular badge)</span></div>
        </div>
      ))}
      <button onClick={() => set('items', [...(data?.items||[]), { date:{day:'',month:''}, title:'', type:'', location:'', duration:'', price:'', desc:'' }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Workshop</button>
    </div>
  ),

  how_steps: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Process Steps</SectionTitle>
      {(data?.items || []).map((s, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 relative">
          <button onClick={() => set('items', (data.items||[]).filter((_,j)=>j!==i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Step Number"><TextInput value={s.step} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],step:v}; set('items',it); }} placeholder="01"/></Field>
            <Field label="Step Title"><TextInput value={s.title} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],title:v}; set('items',it); }}/></Field>
          </div>
          <Field label="Description"><TextArea value={s.desc} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],desc:v}; set('items',it); }} rows={2}/></Field>
        </div>
      ))}
      <button onClick={() => set('items', [...(data?.items||[]), { step:'', title:'', desc:'' }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Step</button>
    </div>
  ),

  setup_phases: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Setup Phases (Roadmap Cards)</SectionTitle>
      {(data?.items || []).map((p, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 relative">
          <button onClick={() => set('items', (data.items||[]).filter((_,j)=>j!==i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phase Number"><TextInput value={p.num} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],num:v}; set('items',it); }} placeholder="01"/></Field>
            <Field label="Phase Title"><TextInput value={p.title} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],title:v}; set('items',it); }}/></Field>
          </div>
          <Field label="Description"><TextArea value={p.desc} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],desc:v}; set('items',it); }} rows={2}/></Field>
          <Field label="Checklist Steps" hint="One step per line"><TextArea value={(p.steps||[]).join('\n')} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],steps:v.split('\n').map(s=>s.trim()).filter(Boolean)}; set('items',it); }} rows={3}/></Field>
        </div>
      ))}
      <button onClick={() => set('items', [...(data?.items||[]), { num:'', title:'', desc:'', steps:[] }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Phase</button>
    </div>
  ),

  pricing_plans: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Pricing Plans</SectionTitle>
      {(data?.items || []).map((p, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 relative">
          <button onClick={() => set('items', (data.items||[]).filter((_,j)=>j!==i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Plan Name"><TextInput value={p.title} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],title:v}; set('items',it); }} placeholder="Standard"/></Field>
            <Field label="Price / Label"><TextInput value={p.price} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],price:v}; set('items',it); }} placeholder="₹ Direct"/></Field>
          </div>
          <Field label="Features" hint="One per line"><TextArea value={(p.features||[]).join('\n')} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],features:v.split('\n').map(s=>s.trim()).filter(Boolean)}; set('items',it); }} rows={3}/></Field>
          <Field label="Button Label"><TextInput value={p.cta} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],cta:v}; set('items',it); }} placeholder="Get Quote"/></Field>
        </div>
      ))}
      <button onClick={() => set('items', [...(data?.items||[]), { title:'', price:'', features:[], cta:'Get Quote' }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Plan</button>
    </div>
  ),

  advisory_items: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Advisory Focus Cards</SectionTitle>
      {(data?.items || []).map((a, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 relative">
          <button onClick={() => set('items', (data.items||[]).filter((_,j)=>j!==i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
          <Field label="Title"><TextInput value={a.title} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],title:v}; set('items',it); }}/></Field>
          <Field label="Description"><TextArea value={a.desc} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],desc:v}; set('items',it); }} rows={2}/></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stat Value"><TextInput value={a.stats} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],stats:v}; set('items',it); }} placeholder="₹500Cr+"/></Field>
            <Field label="Stat Label"><TextInput value={a.trend} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],trend:v}; set('items',it); }} placeholder="Capital Advised"/></Field>
          </div>
        </div>
      ))}
      <button onClick={() => set('items', [...(data?.items||[]), { title:'', desc:'', stats:'', trend:'' }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Advisory Item</button>
    </div>
  ),

  case_studies: ({ data = {}, set }) => {
    const items = data?.items || [];
    return (
      <div className="space-y-4">
        <SectionTitle>Case Studies</SectionTitle>
        <div className="space-y-4">
          {items.map((item, i) => (
            <CaseStudyEditor key={i} item={item} i={i} items={items} set={set} />
          ))}
        </div>
        <button 
          onClick={async () => {
            const name = prompt('Case Study Project Title:');
            if (!name) return;
            const safeSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            const finalCmsSlug = `resource-${safeSlug}`; // Using resource prefix for generic case studies
            
            try {
              await createPage(finalCmsSlug, name);
              set('items', [...(data?.items||[]), { title: name, location: '', outcome: '', focus: '', slug: safeSlug }]);
              alert(`Case study added and page "${finalCmsSlug}" created!`);
            } catch (err) {
              alert('Failed to initialize case study page: ' + err.message);
            }
          }} 
          className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all"
        >+ Add New Case Study & Auto-Create Page</button>
      </div>
    );
  },

  blog_posts: ({ data = {}, set }) => (
    <div className="space-y-4">
      <SectionTitle>Blog Posts</SectionTitle>
      {(data?.items || []).map((p, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 relative">
          <button onClick={() => set('items', (data.items||[]).filter((_,j)=>j!==i))} className="absolute top-3 right-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
          <Field label="Date"><TextInput value={p.date} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],date:v}; set('items',it); }} placeholder="OCT 24, 2023"/></Field>
          <Field label="Title"><TextInput value={p.title} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],title:v}; set('items',it); }}/></Field>
          <Field label="Excerpt"><TextArea value={p.excerpt} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],excerpt:v}; set('items',it); }} rows={2}/></Field>
          <ImageUpload label="Cover Image" value={p.img} onChange={v=>{ const it=[...(data.items||[])]; it[i]={...it[i],img:v}; set('items',it); }}/>
        </div>
      ))}
      <button onClick={() => set('items', [...(data?.items||[]), { date:'', title:'', excerpt:'', img:'' }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">+ Add Blog Post</button>
    </div>
  ),


  environments_page_content: ({ data = {}, set }) => {
    const updateField = (path, val) => {
      const clone = JSON.parse(JSON.stringify(data));
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) { if (!obj[keys[i]]) obj[keys[i]] = {}; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = val;
      Object.entries(clone).forEach(([k, v]) => set(k, v));
    };
    const items = data?.masonryItems || [];
    return (
      <div className="space-y-6">
        <SectionTitle>Environments Page</SectionTitle>
        <div className="bg-indigo-50/60 rounded-2xl p-4 space-y-3 border border-indigo-100">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Hero Section</p>
          <Field label="Badge"><TextInput value={data?.badge} onChange={v => set('badge', v)} placeholder="Sensory Hub 2025"/></Field>
          <Field label="Title HTML"><TextArea value={data?.titleHtml} onChange={v => set('titleHtml', v)} rows={2} placeholder="Atmosphere <br/> <span>is</span> Everything."/></Field>
          <Field label="Subtitle"><TextInput value={data?.subtitle} onChange={v => set('subtitle', v)}/></Field>
          <ImageUpload label="Hero Image" value={data?.heroImage} onChange={v => set('heroImage', v)}/>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Action Card</p>
          <Field label="Card Title HTML"><TextInput value={data?.actionCard?.titleHtml} onChange={v => updateField('actionCard.titleHtml', v)}/></Field>
          <Field label="Button Text"><TextInput value={data?.actionCard?.btnText} onChange={v => updateField('actionCard.btnText', v)} placeholder="Apply Online"/></Field>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Info Grid</p>
          <Field label="Section Title HTML"><TextInput value={data?.infoGrid?.titleHtml} onChange={v => updateField('infoGrid.titleHtml', v)}/></Field>
          <Field label="Bullet Points" hint="One per line"><TextArea value={(data?.infoGrid?.points || []).join('\n')} onChange={v => updateField('infoGrid.points', v.split('\n').map(s => s.trim()).filter(Boolean))} rows={3}/></Field>
          <ImageUpload label="Grid Image" value={data?.infoGrid?.img} onChange={v => updateField('infoGrid.img', v)}/>
        </div>
        <SectionTitle>Case Study Cards (Masonry Grid)</SectionTitle>
        <p className="text-[11px] text-gray-400">These cards appear in the grid AND power the individual detail pages at <code>/environments/:slug</code>.</p>
        
        <div className="space-y-4">
          {items.map((item, i) => (
            <EnvironmentEditor key={i} item={item} i={i} items={items} set={set} />
          ))}
        </div>

        <button 
          onClick={async () => {
            const name = prompt('Environment Case Study Title:');
            if (!name) return;
            const safeSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            const finalCmsSlug = `environment-${safeSlug}`;
            
            try {
              await createPage(finalCmsSlug, name);
              set('masonryItems', [...items, { t: name, c: '', img: '', badge: 'Case Study 2025', description: '', specs: [], technicalDetails: [] }]);
              alert(`Card added and page "${finalCmsSlug}" created!`);
            } catch (err) {
              alert('Failed to initialize environment page: ' + err.message);
            }
          }} 
          className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all"
        >+ Add New Case Study & Auto-Create Page</button>
      </div>
    );
  },

  guides_page_content: ({ data = {}, set }) => {
    const updateField = (path, val) => {
      const clone = JSON.parse(JSON.stringify(data));
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) { if (!obj[keys[i]]) obj[keys[i]] = {}; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = val;
      Object.entries(clone).forEach(([k, v]) => set(k, v));
    };
    const items = data?.caseStudies || [];
    return (
      <div className="space-y-6">
        <SectionTitle>Guides Page</SectionTitle>
        <div className="bg-indigo-50/60 rounded-2xl p-4 space-y-3 border border-indigo-100">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Hero Section</p>
          <Field label="Badge"><TextInput value={data?.badge} onChange={v => set('badge', v)} placeholder="Knowledge Base 2025"/></Field>
          <Field label="Title HTML"><TextArea value={data?.titleHtml} onChange={v => set('titleHtml', v)} rows={2}/></Field>
          <Field label="Subtitle"><TextInput value={data?.subtitle} onChange={v => set('subtitle', v)}/></Field>
          <ImageUpload label="Hero Image" value={data?.heroImage} onChange={v => set('heroImage', v)}/>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Action Card</p>
          <Field label="Card Title HTML"><TextInput value={data?.actionCard?.titleHtml} onChange={v => updateField('actionCard.titleHtml', v)}/></Field>
          <Field label="Button Text"><TextInput value={data?.actionCard?.btnText} onChange={v => updateField('actionCard.btnText', v)}/></Field>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Featured Guide</p>
          <Field label="Title"><TextInput value={data?.featured?.t} onChange={v => updateField('featured.t', v)}/></Field>
          <Field label="Category"><TextInput value={data?.featured?.c} onChange={v => updateField('featured.c', v)}/></Field>
          <Field label="Description"><TextArea value={data?.featured?.d} onChange={v => updateField('featured.d', v)} rows={2}/></Field>
          <Field label="Tags" hint="Comma-separated"><TextInput value={(data?.featured?.tags || []).join(', ')} onChange={v => updateField('featured.tags', v.split(',').map(s => s.trim()).filter(Boolean))}/></Field>
          <ImageUpload label="Featured Image" value={data?.featured?.img} onChange={v => updateField('featured.img', v)}/>
        </div>
        <SectionTitle>Strategy Guide Cards</SectionTitle>
        <p className="text-[11px] text-gray-400">These cards appear in the masonry grid AND power the detail pages at <code>/guides/:slug</code>.</p>
        
        <div className="space-y-4">
          {items.map((item, i) => (
            <GuideEditor key={i} item={item} i={i} items={items} set={set} />
          ))}
        </div>

        <button 
          onClick={async () => {
            const name = prompt('Strategic Guide Title:');
            if (!name) return;
            const safeSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
            const finalCmsSlug = `guide-${safeSlug}`;
            
            try {
              await createPage(finalCmsSlug, name);
              set('caseStudies', [...items, { t: name, c: '', img: '', badge: 'Strategic Guide 2025', intro: '', mainImg: '', steps: [], summaryPoints: [] }]);
              alert(`Card added and page "${finalCmsSlug}" created!`);
            } catch (err) {
              alert('Failed to initialize guide page: ' + err.message);
            }
          }} 
          className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all"
        >+ Add New Guide & Auto-Create Page</button>
      </div>
    );
  },

  pdf_resource: ({ data = {}, set }) => (

    <div className="space-y-4">
      <SectionTitle>PDF / Download Resource</SectionTitle>
      <Field label="Resource Title"><TextInput value={data?.title} onChange={v => set('title', v)} /></Field>
      <Field label="Description"><TextArea value={data?.description} onChange={v => set('description', v)} rows={2} /></Field>
      <FileUpload label="Upload PDF" value={data?.fileUrl} onChange={v => set('fileUrl', v)} accept=".pdf" />
      <div className="flex items-center gap-2 pt-2">
        <input type="checkbox" checked={!!data?.registeredOnly} onChange={e => set('registeredOnly', e.target.checked)} className="w-4 h-4 rounded" />
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">🔒 Registered Users Only</span>
      </div>
    </div>
  )
};

// ── Page Icon & Color Mapping ───────────────────────────────────────────────
const PAGE_META = {
  products: { icon: Package, color: 'bg-emerald-600', iconColor: 'text-emerald-600', title: 'Product Manager' },
  home: { icon: Globe, color: 'bg-blue-500', iconColor: 'text-blue-500' },
  furniture: { icon: Layers, color: 'bg-orange-500', iconColor: 'text-orange-500' },
  'school-building-design': { icon: Box, color: 'bg-purple-500', iconColor: 'text-purple-500' },
  digital: { icon: Video, color: 'bg-cyan-500', iconColor: 'text-cyan-500' },
  sports: { icon: Globe, color: 'bg-red-500', iconColor: 'text-red-500' },
  libraries: { icon: FileText, color: 'bg-emerald-500', iconColor: 'text-emerald-500' },
  environments: { icon: Layers, color: 'bg-green-500', iconColor: 'text-green-500' },
  aboutus: { icon: Lock, color: 'bg-indigo-500', iconColor: 'text-indigo-500' },
  'contact-us': { icon: Globe, color: 'bg-pink-500', iconColor: 'text-pink-500' },
  'gamified-math-labs': { icon: Type, color: 'bg-blue-600', iconColor: 'text-blue-600' },
  'science-is-fun': { icon: Video, color: 'bg-indigo-600', iconColor: 'text-indigo-600' },
  labs: { icon: Layers, color: 'bg-teal-500', iconColor: 'text-teal-500' },
  design: { icon: Palette, color: 'bg-rose-500', iconColor: 'text-rose-500' },
  manufacturing: { icon: Box, color: 'bg-gray-600', iconColor: 'text-gray-600' },
  corporate: { icon: Globe, color: 'bg-slate-700', iconColor: 'text-slate-700' },
  catalogues: { icon: List, color: 'bg-amber-500', iconColor: 'text-amber-500' },
  guides: { icon: FileText, color: 'bg-blue-400', iconColor: 'text-blue-400' },
  'school-sale': { icon: Globe, color: 'bg-orange-600', iconColor: 'text-orange-600' },
  partnerships: { icon: Globe, color: 'bg-yellow-500', iconColor: 'text-yellow-500' },
  'setup-guide': { icon: FileText, color: 'bg-cyan-600', iconColor: 'text-cyan-600' },
  registration: { icon: Plus, color: 'bg-emerald-500', iconColor: 'text-emerald-500' },
  login: { icon: Lock, color: 'bg-violet-500', iconColor: 'text-violet-500' },
  workshops: { icon: Layers, color: 'bg-pink-500', iconColor: 'text-pink-500' },
  fundraising: { icon: Globe, color: 'bg-lime-600', iconColor: 'text-lime-600' },
  'how-it-works': { icon: List, color: 'bg-sky-500', iconColor: 'text-sky-500' },
  pricing: { icon: Package, color: 'bg-teal-600', iconColor: 'text-teal-600' },
  'shipping-policy': { icon: FileText, color: 'bg-gray-500', iconColor: 'text-gray-500' },
  'cancellation-policy': { icon: FileText, color: 'bg-gray-500', iconColor: 'text-gray-500' },
  'replacement-return': { icon: FileText, color: 'bg-gray-500', iconColor: 'text-gray-500' },
  payments: { icon: FileText, color: 'bg-green-600', iconColor: 'text-green-600' },
  'order-rejection-policy': { icon: FileText, color: 'bg-gray-500', iconColor: 'text-gray-500' },
  'seller-help': { icon: MessageSquare, color: 'bg-blue-500', iconColor: 'text-blue-500' },
  'sell-on-schoolmart': { icon: Package, color: 'bg-orange-500', iconColor: 'text-orange-500' },
  'report-issue': { icon: MessageSquare, color: 'bg-red-500', iconColor: 'text-red-500' },
  blog: { icon: FileText, color: 'bg-indigo-400', iconColor: 'text-indigo-400' },
  'delivery-locations': { icon: Globe, color: 'bg-cyan-500', iconColor: 'text-cyan-500' },
  'forgot-password': { icon: Lock, color: 'bg-amber-500', iconColor: 'text-amber-500' },
};

const getPageMeta = (slug) => PAGE_META[slug] || { icon: FileText, color: 'bg-indigo-500', iconColor: 'text-indigo-500' };

// ── Main Controller Component ────────────────────────────────────────────────
export default function CMSEditor() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState(null);
  const [originalContent, setOriginalContent] = useState([]);

  useEffect(() => {
    getAllPages()
      .then(setPages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const refreshPages = () => getAllPages().then(setPages).catch(console.error);

  const handleDeletePage = async (e, slug) => {
    e.stopPropagation();
    if (!window.confirm(`Delete page "${slug}" and ALL its CMS blocks? This cannot be undone.`)) return;
    try {
      await deletePage(slug);
      setPages(prev => prev.filter(p => p.slug !== slug));
    } catch (err) {
      alert('Failed to delete page: ' + err.message);
    }
  };

  const selectPage = (slug) => {
    setPageLoading(true);
    setSelectedPage(slug);
    getPage(slug)
      .then(p => {
        setContent(p.blocks || []);
        setOriginalContent(JSON.parse(JSON.stringify(p.blocks || [])));
        if (p.blocks?.length) setActiveBlockId(p.blocks[0].id);
      })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  };

  const handleUpdate = async (blockId, data) => {
    try {
      // ── Detect sidebar_categories renames and propagate to products ──
      const block = content.find(b => b.id === blockId);
      if (block && (block.key === 'sidebar_categories' || block.type === 'sidebar_categories')) {
        const originalBlock = originalContent.find(b => b.id === blockId);
        if (originalBlock) {
          const oldCats = originalBlock.data?.categories || [];
          const newCats = data?.categories || [];
          const oldSet = new Set(oldCats.map(c => c?.trim()).filter(Boolean));
          const newSet = new Set(newCats.map(c => c?.trim()).filter(Boolean));
          const pageTitle = pages.find(p => p.slug === selectedPage)?.title || selectedPage;

          // Compare by index: if old[i] disappeared from the full set and new[i] is fresh, it's a rename
          for (let i = 0; i < Math.min(oldCats.length, newCats.length); i++) {
            const o = (oldCats[i] || '').trim();
            const n = (newCats[i] || '').trim();
            if (o && n && o !== n && !newSet.has(o) && !oldSet.has(n)) {
              await bulkRenameSubcategory(pageTitle, o, n);
            }
          }
        }
        // Snapshot new state so future saves compare against this version
        setOriginalContent(prev => prev.map(b => b.id === blockId ? { ...b, data: JSON.parse(JSON.stringify(data)) } : b));
      }

      await updateBlock(blockId, data);
      // Clear specific page + full cache bust so frontend reflects new data immediately
      clearCMSCache(selectedPage);
      clearCMSCache();
      setContent(content.map(b => b.id === blockId ? { ...b, data, isDirty: false } : b));
      // Also refresh pages data so ProductManager picks up the new categories
      refreshPages();
      // Brief visual confirmation
      setSaveToast(blockId);
      setTimeout(() => setSaveToast(null), 2000);
    } catch (e) {
      alert('Save Failed: ' + e.message);
    }
  };

  const filteredPages = pages.filter(p => 
    (p.title || p.slug).toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPageTitle = pages.find(p => p.slug === selectedPage)?.title || selectedPage;

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-indigo-500/20 shadow-2xl" /></div>;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Institutional Command Console */}
      <div className="p-10 max-w-7xl mx-auto min-w-0 min-h-screen">
        {!selectedPage ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Command Hub</h2>
                      <p className="text-sm text-gray-400 font-medium">Select a module to initialize total administrative sovereignty.</p>
                   </div>
                   <button 
                     onClick={async () => {
                       const name = prompt('Enter Page Name (e.g. Interactive Panels):');
                       if (!name) return;
                       const slug = prompt('Enter Page Slug (e.g. resource-interactive-panels):');
                       if (!slug) return;
                       try {
                         await createPage(slug, name);
                         const updated = await getAllPages();
                         setPages(updated.data || updated);
                         alert('Page created successfully!');
                       } catch (err) {
                         alert('Failed to create page: ' + err.message);
                       }
                     }}
                     className="px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-3"
                   >
                     <Plus size={16} /> New Page
                   </button>
                </div>
                <div className="relative group w-full md:w-80">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search modules..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-sm text-gray-700"
                   />
                </div>
              </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {/* Special Product Manager Injector */}
                <button 
                  onClick={() => selectPage('products')}
                  className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 text-left flex flex-col h-full"
                >
                  <div className={`w-16 h-16 rounded-3xl bg-emerald-600 bg-opacity-10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <Package className="text-emerald-600" size={32} />
                  </div>
                  <div className="mt-auto">
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-1 leading-tight group-hover:text-emerald-600 transition-colors uppercase">
                      Product Data & Bulk Upload
                    </h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/products</p>
                  </div>
                </button>

                {filteredPages.map((p) => {
                  const meta = getPageMeta(p.slug);
                  const Icon = meta.icon;
                  return (
                    <div key={p.slug} className="relative group">
                      <button 
                        onClick={() => selectPage(p.slug)}
                        className="w-full bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 text-left flex flex-col h-full"
                      >
                        <div className={`w-16 h-16 rounded-3xl ${meta.color} bg-opacity-10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className={meta.iconColor} size={32} />
                        </div>
                        <div className="mt-auto">
                          <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                            {p.title || p.name || p.slug}
                          </h4>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/{p.slug}</p>
                        </div>
                      </button>
                      {/* Delete button — appears on hover for cleanup of stale pages */}
                      <button
                        onClick={(e) => handleDeletePage(e, p.slug)}
                        title={`Delete page /${p.slug}`}
                        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
             </div>
          </div>
        ) : selectedPage === 'products' ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-12">
             <div className="flex items-center justify-between bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => { setSelectedPage(null); setActiveBlockId(null); setPageLoading(false); }}
                    className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                  >
                    <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={24} />
                  </button>
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">PRODUCT COMMAND CENTER</h2>
                    <p className="text-[10px] font-black text-emerald-400 mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                      INVENTORY LIVE SYNC ACTIVE
                    </p>
                  </div>
                </div>
             </div>
             
             {/* Product Manager rendering */}
             <ProductManager />
             
          </div>
        ) : pageLoading ? (
          <div className="flex h-96 items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-12">
            {/* Header / Nav */}
            <div className="flex items-center justify-between bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedPage(null)}
                  className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                >
                  <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={24} />
                </button>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{currentPageTitle} COMMAND CENTER</h2>
                  <p className="text-[10px] font-black text-indigo-400 mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></span>
                    OPERATIONAL STATUS: LIVE SYNC ACTIVE
                  </p>
                </div>
              </div>
              <button 
                className="px-8 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-3"
                onClick={() => window.open(selectedPage === 'home' ? '/' : `/${selectedPage}`, '_blank')}
              >
                 <Eye size={16} /> Preview LIVE
              </button>
            </div>

            <div className="flex gap-12 items-start">
               {/* Fixed Block Navigator (Sub-Categories) */}
               <div className="w-72 sticky top-10 space-y-4 shrink-0">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Page Modules</h4>
                     <div className="space-y-2">
                        {content.map((block, idx) => (
                          <button 
                            key={`nav-${block.id}`}
                            onClick={() => document.getElementById(`block-${block.id}`).scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 group transition-all flex items-center gap-3"
                          >
                             <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{idx + 1}</div>
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate group-hover:text-indigo-900">{block.key || block.type}</span>
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Block Editors */}
               <div className="flex-1 space-y-10 min-w-0">
                  {content.map((block, idx) => {
                    const Form = BlockForms[block.type];
                    const isValidForm = typeof Form === 'function';
                    return (
                      <div id={`block-${block.id}`} key={block.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden transition-all hover:shadow-[0_48px_96px_-32px_rgba(67,56,202,0.1)] group scroll-mt-20">
                         <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
                            <div className="flex items-center gap-6">
                               <div className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-50">{idx + 1}</div>
                               <div>
                                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{block.key || block.type}</h3>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MODULE ARCHETYPE: {block.type}</p>
                               </div>
                            </div>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Delete block "${block.key || block.type}"? This cannot be undone.`)) return;
                                try {
                                  await deleteBlock(block.id);
                                  setContent(content.filter(b => b.id !== block.id));
                                } catch (err) {
                                  alert('Delete failed: ' + err.message);
                                }
                              }}
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Delete Block"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                         <div className="p-10 bg-white">
                            {isValidForm ? (
                              <Form data={block.data} fullContent={content} set={(field, val) => {
                                const newData = { ...block.data };
                                const keys = field.split('.');
                                let obj = newData;
                                for(let i=0; i<keys.length-1; i++) {
                                  if(!obj[keys[i]]) obj[keys[i]] = {};
                                  obj = obj[keys[i]];
                                }
                                obj[keys[keys.length-1]] = val;
                                setContent(content.map(b => b.id === block.id ? { ...b, data: newData, isDirty: true } : b));
                              }} />
                            ) : (
                               <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                 <p className="text-gray-300 italic font-medium text-sm font-black uppercase tracking-widest">Advanced Block Template Unlocked</p>
                                 <pre className="text-[10px] text-gray-400 mt-4 text-left p-6 bg-gray-50 rounded-xl overflow-x-auto mx-10">{JSON.stringify(block.data, null, 2)}</pre>
                               </div>
                            )}

                            <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 {block.isDirty && (
                                   <span className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Unsaved Modifications
                                   </span>
                                 )}
                               </div>
                               <div className="flex items-center gap-3">
                                 <button 
                                   onClick={() => handleUpdate(block.id, block.data)}
                                   disabled={!block.isDirty && saveToast !== block.id}
                                   className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                     saveToast === block.id
                                     ? 'bg-green-500 text-white shadow-xl shadow-green-500/20 scale-105'
                                     : block.isDirty 
                                     ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95' 
                                     : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                                   }`}>
                                   <Save size={14} />
                                   {block.isDirty ? 'Publish Changes' : 'All Changes Synced'}
                                 </button>
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                   
                   {/* Add Block Button */}
                   <div className="pt-4 pb-20">
                     <div className="flex items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                         <Plus size={24} />
                       </div>
                       <div className="flex-1">
                         <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Inject New Module</h4>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expand this page's capabilities with a new block archetype.</p>
                       </div>
                       <div className="flex items-center gap-2">
                         <select 
                           id="new-block-type"
                           className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-100"
                         >
                           {Object.keys(BlockForms).sort().map(type => (
                             <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                           ))}
                         </select>
                         <button 
                           onClick={async () => {
                             const type = document.getElementById('new-block-type').value;
                             if (!type) return;
                             try {
                               const newBlock = await addBlock(selectedPage, type, type, {});
                               setContent([...content, { ...newBlock, data: {}, isDirty: false }]);
                               setActiveBlockId(newBlock.id);
                               setTimeout(() => document.getElementById(`block-${newBlock.id}`)?.scrollIntoView({ behavior: 'smooth' }), 100);
                             } catch (err) {
                               alert('Failed to add block: ' + err.message);
                             }
                           }}
                           className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
                         >
                           Add to Page
                         </button>
                       </div>
                     </div>
                   </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
