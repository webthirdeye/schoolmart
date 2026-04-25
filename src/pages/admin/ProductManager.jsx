import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getAllPages } from '../../services/api';
import { Package, Plus, Search, Filter, Edit3, Trash2, Star, Tag, Layers, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { formatImgUrl } from '../../utils/formatters';
import BulkUploader from '../../components/admin/BulkUploader';

// ── BULK LOAD LOGIC ──────────────────────────────────────────────────────────

const parseCSV = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Robust CSV splitting to handle commas inside quotes
  const splitLine = (line) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else cur += char;
    }
    result.push(cur.trim());
    return result;
  };

  const headers = splitLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = splitLine(line);
    const obj = {};
    headers.forEach((h, i) => { if (values[i] !== undefined) obj[h] = values[i]; });
    return obj;
  });
};

const downloadProductTemplate = () => {
  const headers = [
    'name', 'category', 'subcategory', 'external_link', 'image', 'button_label',
    'description', 'price', 'isFeatured', 'isNewProduct',
    'stat1_label', 'stat1_value', 'stat2_label', 'stat2_value', 'stat3_label', 'stat3_value',
    'feature1_name', 'feature1_spec', 'feature2_name', 'feature2_spec', 'feature3_name', 'feature3_spec'
  ];
  const csvContent = "\ufeff" + headers.join(',') + "\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `catalog_products_template.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const CSVProductImporter = ({ fixedPage, onImport, availableSubcategories = [] }) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [showBulkImage, setShowBulkImage] = useState(false);
  const [lastUploads, setLastUploads] = useState([]);
  const [batchSettings, setBatchSettings] = useState({ category: fixedPage || '', subcategory: '' });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const rows = parseCSV(evt.target.result);
      processRows(rows);
    };
    reader.readAsText(file);
  };

  const handleFetchSheets = async () => {
    if (!sheetUrl) return alert('Please paste a Google Sheets URL first');
    let url = sheetUrl.trim();

    // Handle "Publish to web" links
    if (url.includes('/pubhtml')) {
      url = url.replace('/pubhtml', '/pub?output=csv');
    }
    // Handle standard "Edit" sharing links
    else if (url.includes('/edit')) {
      url = url.split('/edit')[0] + '/export?format=csv';
    }
    // Fallback/Force CSV format
    else if (!url.includes('output=csv') && !url.includes('format=csv')) {
      url += (url.includes('?') ? '&' : '?') + 'output=csv';
    }

    setFetching(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch sheet content. If it is a private sheet, use the "File > Share > Publish to web" method or make it "Anyone with link".');
      const csvText = await res.text();
      const rows = parseCSV(csvText);
      processRows(rows);
    } catch (err) {
      alert(`Error fetching Google Sheet: ${err.message}`);
    } finally {
      setFetching(false);
    }
  };

  const processRows = (rows) => {
    const products = rows.map(r => {
      const img = formatImgUrl(r.image || r.img || r.imageUrl || '');
      return {
        name: r.name || r.title || r.product || 'Unnamed Card',
        description: r.description || r.desc || '',
        category: fixedPage || r.category,
        subcategory: r.subcategory || r.tab || '',
        price: r.price ? parseFloat(String(r.price).replace(/[$,]/g, '')) : 0,
        image: img,
        images: [img].filter(Boolean),
        ctaLink: r.external_link || r.routing_page || r.link || r.cta_link || '',
        ctaLabel: r.button_label || r.cta_label || '',
        isFeatured: String(r.isFeatured).toLowerCase() === 'true',
        isNewProduct: String(r.isNewProduct).toLowerCase() === 'true',
        stats: [
          { label: r.stat1_label || r.label1, value: r.stat1_value || r.value1 },
          { label: r.stat2_label || r.label2, value: r.stat2_value || r.value2 },
          { label: r.stat3_label || r.label3, value: r.stat3_value || r.value3 },
        ].filter(s => s.label || s.value),
        resources: [
          { name: r.feature1_name || r.spec1_name, size: r.feature1_spec || r.spec1_value },
          { name: r.feature2_name || r.spec2_name, size: r.feature2_spec || r.spec2_value },
          { name: r.feature3_name || r.spec3_name, size: r.feature3_spec || r.spec3_value },
        ].filter(res => res.name)
      };
    });
    if (products.length) onImport(products);
  };

  const handleDirectImport = () => {
    if (!lastUploads.length) return;
    if (!batchSettings.subcategory) return alert('Please select a Subcategory for this batch.');

    const products = lastUploads.map(r => {
      const name = r.originalName.split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        name,
        description: '',
        category: fixedPage || batchSettings.category,
        subcategory: batchSettings.subcategory,
        price: 0,
        image: r.url,
        images: [r.url],
        isFeatured: false,
        isNewProduct: false,
        stats: [],
        resources: []
      };
    });
    onImport(products);
    setLastUploads([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setShowBulkImage(!showBulkImage)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showBulkImage ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
        >
          <ImageIcon size={14} /> Step 1: Bulk Upload Images
        </button>

        <div className="h-6 w-px bg-gray-100 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <input type="file" accept=".csv" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
              <Upload size={14} className="text-blue-500" /> Step 2: Upload CSV
            </button>
          </div>
        </div>

        <div className="flex-grow flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={sheetUrl}
            onChange={e => setSheetUrl(e.target.value)}
            placeholder="Or Google Sheets URL..."
            className="flex-grow px-4 py-2 rounded-xl text-xs border border-gray-200 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50"
          />
          <button
            onClick={handleFetchSheets}
            disabled={fetching}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg ${fetching ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'}`}
          >
            {fetching ? 'Fetching...' : 'Sync Live'}
          </button>
        </div>

        <button onClick={downloadProductTemplate} className="text-[10px] text-blue-500 font-bold hover:underline shrink-0 px-2">Get Template</button>
      </div>

      {showBulkImage && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
          <BulkUploader onUploadComplete={setLastUploads} />

          {lastUploads.length > 0 && (
            <div className="bg-blue-600 rounded-[30px] p-6 text-white shadow-xl shadow-blue-600/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Plus size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider">Flash Import Shortcut</h4>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Add {lastUploads.length} images as products instantly</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase text-white/50">To Subcategory:</span>
                  <input
                    list="batch-subcats"
                    value={batchSettings.subcategory}
                    onChange={e => setBatchSettings({ ...batchSettings, subcategory: e.target.value })}
                    className="bg-transparent border-none outline-none text-xs font-bold placeholder:text-white/30 text-white min-w-[150px]"
                    placeholder="Type or select..."
                  />
                  <datalist id="batch-subcats">
                    {availableSubcategories.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <button
                  onClick={handleDirectImport}
                  className="bg-white text-blue-600 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                >
                  Import Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ProductManager({ fixedPage, liveCategories }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [pagesData, setPagesData] = useState([]);

  const load = () => {
    getProducts().then(setProducts).finally(() => setLoading(false));
    getAllPages().then(setPagesData).catch(() => { });
  };
  useEffect(() => { load(); }, []);

  // Auto-build list of pages and subcategories for the dropdowns
  const assignablePages = pagesData
    .filter(p => ['furniture', 'architecture', 'school-building-design', 'digital', 'sports', 'libraries', 'labs', 'mathematics', 'gamified-math-labs', 'science', 'science-is-fun', 'design'].includes(p.slug || p.pageSlug))
    .map(p => {
      const pSlug = p.slug || p.pageSlug;
      const pTitle = p.title || p.pageTitle;
      // Pull subcategories from the sidebar_categories CMS block
      // The block can be stored with key or type field (not blockType)
      let blockCats = (
        p.blocks?.find(b => b.key === 'sidebar_categories' || b.type === 'sidebar_categories')
      )?.data?.categories || [];

      // If this IS the fixedPage we are editing in CMSEditor, use the LIVE unsaved categories
      if (liveCategories && (fixedPage === pTitle || fixedPage === pSlug)) {
        blockCats = liveCategories;
      }

      // CMS sidebar_categories is the single source of truth for subcategory tabs.
      // Only fall back to scanning products if no CMS block exists at all.
      let finalCats;
      if (blockCats.length > 0) {
        finalCats = blockCats.filter(Boolean);
      } else {
        // Fallback: scan existing products (legacy data before CMS was populated)
        finalCats = [...new Set(
          products
            .filter(prod => prod.category === pTitle || prod.category === pSlug)
            .map(prod => prod.subcategory)
            .filter(Boolean)
        )];
      }

      return {
        title: pTitle,
        slug: pSlug,
        categories: finalCats
      };
    });

  // Helper: find assignable page entry by either title or slug (for fixedPage matching)
  const findPageEntry = (key) =>
    assignablePages.find(p => p.title === key || p.slug === key);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = { ...editing, name: editing.name || 'Unnamed Card' };
      const pId = editing.id || editing.id;
      if (pId) await updateProduct(pId, payload);
      else await createProduct(payload);
      setEditing(null);
      load();
    } catch (err) {
      alert('Error saving card: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    await deleteProduct(id);
    load();
  };

  const handleBulkImport = async (newProducts) => {
    if (!confirm(`Import ${newProducts.length} cards from CSV?`)) return;
    setLoading(true);
    try {
      await Promise.all(newProducts.map(p => createProduct(p)));
      load();
      alert(`Successfully imported ${newProducts.length} cards.`);
    } catch (err) {
      alert(`Error importing cards: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    if (fixedPage && p.category !== fixedPage) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;

    // Case-insensitive subcategory or category filter
    if (filterCat) {
      if (!fixedPage && p.category !== filterCat) return false;
      if (fixedPage && (p.subcategory || '').toUpperCase() !== filterCat.toUpperCase()) return false;
    }
    return true;
  });

  // If fixedPage is setting, the filter dropdown should show subcategories, not root categories
  const dropdownOptions = fixedPage
    ? [...new Set(products.filter(p => p.category === fixedPage).map(p => p.subcategory).filter(Boolean))]
    : categories;

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  if (editing) return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-3xl mx-auto">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-800">{editing.id ? 'Edit Card' : 'New Card'}</h2>
          <p className="text-xs text-gray-400 font-medium">{editing.id ? 'Update card details' : 'Add a new card to an inner page'}</p>
        </div>
        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Name (Optional)</label>
            <input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. STEM Hub Setup" />
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Routing Page (External Link)</label>
            <input 
              value={editing.ctaLink || ''} 
              onChange={e => setEditing({ ...editing, ctaLink: e.target.value })} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-blue-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-blue-600" 
              placeholder="e.g. https://schoolmart.store/your-product.html" 
            />
            <p className="text-[9px] text-gray-400">Users will be redirected to this link when they click the card.</p>
          </div>

          {!fixedPage && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assigned Page *</label>
              <div className="relative">
                <select required value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value, subcategory: '' })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-gray-700">
                  <option value="">Select Page...</option>
                  {assignablePages.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          )}
          <div className={fixedPage ? "col-span-2 space-y-1" : "space-y-1"}>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sidebar Category / Tab *</label>
            <div className="relative">
              <select required value={editing.subcategory || ''} onChange={e => setEditing({ ...editing, subcategory: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-gray-700" disabled={!fixedPage && !editing.category}>
                <option value="">Select Tab...</option>
                {findPageEntry(fixedPage || editing.category)?.categories?.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <ImageUpload
          label="Card Image *"
          value={editing.image || editing.images?.[0] || ''}
          onChange={url => setEditing({ ...editing, image: url, images: [url] })}
        />

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Button Label (Optional)</label>
          <input
            value={editing.ctaLabel || ''}
            onChange={e => setEditing({ ...editing, ctaLabel: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. View on Store (Default: REQUEST QUOTE)"
          />
        </div>

        {/* Collapsible Advanced Info */}
        <details className="group border border-gray-100 rounded-2xl bg-gray-50/30">
          <summary className="px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-400 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span>Advanced (Internal Page Data)</span>
            <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
          </summary>
          <div className="p-5 space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description (Execution Strategy text)</label>
              <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" placeholder="Short description..." />
            </div>

        {/* STATS */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Metrics (Top Right Stats)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Stat {i + 1}</p>
                <input
                  value={editing.stats?.[i]?.label || ''}
                  onChange={e => {
                    const newStats = [...(editing.stats || [{}, {}, {}])];
                    newStats[i] = { ...newStats[i], label: e.target.value };
                    setEditing({ ...editing, stats: newStats });
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" placeholder="Label (e.g. IMPACT)"
                />
                <input
                  value={editing.stats?.[i]?.value || ''}
                  onChange={e => {
                    const newStats = [...(editing.stats || [{}, {}, {}])];
                    newStats[i] = { ...newStats[i], value: e.target.value };
                    setEditing({ ...editing, stats: newStats });
                  }}
                  className="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" placeholder="Value (e.g. 98%)"
                />
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Features & Technical Specs (Right Side Box)</label>
          <div className="space-y-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex flex-col space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    value={editing.resources?.[i]?.name || ''}
                    onChange={e => {
                      const newRes = [...(editing.resources || [{}, {}, {}])];
                      newRes[i] = { ...newRes[i], name: e.target.value };
                      setEditing({ ...editing, resources: newRes });
                    }}
                    className="flex-[2] px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" placeholder="Feature Name (e.g. Ergonomic Design)"
                  />
                  <input
                    value={editing.resources?.[i]?.size || ''}
                    onChange={e => {
                      const newRes = [...(editing.resources || [{}, {}, {}])];
                      newRes[i] = { ...newRes[i], size: e.target.value };
                      setEditing({ ...editing, resources: newRes });
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500" placeholder="Spec / Badge (e.g. Premium)"
                  />
                </div>
                <input
                  value={editing.resources?.[i]?.url || ''}
                  onChange={e => {
                    const newRes = [...(editing.resources || [{}, {}, {}])];
                    newRes[i] = { ...newRes[i], url: e.target.value };
                    setEditing({ ...editing, resources: newRes });
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-mono text-blue-600" placeholder="Link URL (e.g. /specs.pdf or https://...)"
                />
              </div>
            ))}
          </div>
        </div>

            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Button Commands</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={editing.chatLabel || ''}
                  onChange={e => setEditing({ ...editing, chatLabel: e.target.value })}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Chat Label"
                />
                <input
                  value={editing.chatLink || ''}
                  onChange={e => setEditing({ ...editing, chatLink: e.target.value })}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Chat Link"
                />
              </div>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 italic">* Use these only if you want to populate the redundant product page.</p>
        </details>



        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={editing.isFeatured || false} onChange={e => setEditing({ ...editing, isFeatured: e.target.checked })} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span className="text-sm font-bold text-gray-700 flex items-center gap-1"><Star size={14} className="text-orange-400 fill-orange-400" /> Featured Card</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={editing.isNewProduct || false} onChange={e => setEditing({ ...editing, isNewProduct: e.target.checked })} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span className="text-sm font-bold text-gray-700 flex items-center gap-1"><Tag size={14} className="text-green-500" /> Mark as New</span>
          </label>
        </div>

        <div className="pt-5 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={isSaving} className={`px-6 py-2.5 ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30`}>
            Save Card
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={fixedPage ? "space-y-6" : "space-y-6"}>
      {/* CSV Importer — full width top row */}
      <div id="product-importer">
        <CSVProductImporter
          fixedPage={fixedPage}
          onImport={handleBulkImport}
          availableSubcategories={findPageEntry(fixedPage)?.categories || []}
        />
      </div>
      {/* Search + Filter + Add Card — second row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full sm:w-80">
          <div className="pl-4 flex items-center text-gray-400"><Search size={16} /></div>
          <input
            type="text" placeholder={`Search ${fixedPage || 'all'} cards...`}
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-100 shadow-sm rounded-2xl text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value="">{fixedPage ? 'All Subcategories' : 'All Categories'}</option>
              {dropdownOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button onClick={() => setEditing(fixedPage ? { category: fixedPage } : {})} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 whitespace-nowrap">
            <Plus size={16} /> <span className="hidden sm:inline">Add Card</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-black text-gray-900 mb-1">No cards found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or add a new card.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const pId = p.id || p.id;
            return (
            <div key={pId} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col">
              {/* Image Area */}
              <div className="aspect-square bg-gray-50 p-3 relative flex items-center justify-center">
                {p.images?.[0] ? (
                  <img src={formatImgUrl(p.images[0])} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={e => e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'} />
                ) : (
                  <Package size={40} className="text-gray-200" />
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {p.isFeatured && <span className="bg-white/90 backdrop-blur text-orange-600 p-1.5 rounded-full shadow-sm" title="Featured"><Star size={12} className="fill-orange-500" /></span>}
                  {p.isNewProduct && <span className="bg-white/90 backdrop-blur text-green-600 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">NEW</span>}
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button onClick={() => setEditing(p)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 hover:scale-110 hover:bg-blue-50 transition-all shadow-lg" title="Edit">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => remove(pId)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:scale-110 hover:bg-red-50 transition-all shadow-lg" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Data Area */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {!fixedPage ? (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                      <Layers size={10} /> {p.category}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      <Tag size={10} /> {p.subcategory}
                    </span>
                  )}
                  {!fixedPage && p.subcategory && <span className="text-[10px] text-gray-400 font-semibold truncate">{p.subcategory}</span>}
                </div>
                <h3 className="font-bold text-sm text-gray-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{p.name}</h3>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

