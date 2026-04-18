// src/pages/SchoolDesigns.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Palette, Pencil, Ruler, Layers, Building, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, Compass, Lightbulb, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import { handleProductClick } from '../utils/navigation';
import CatalogueCard from '../components/CatalogueCard';

const SchoolDesigns = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('design');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};

  // Priority 1: Auto-select first CMS category if available
  useEffect(() => {
    if (sidebarCategories.categories?.length && !selectedCat) {
      setSelectedCat(sidebarCategories.categories[0]);
    }
  }, [sidebarCategories]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts({ category: 'School Designs' }).then(res => {
      const fetchedItems = res || [];
      setItems(fetchedItems);
      const firstCat = sidebarCategories.categories?.[0] || 
                      (fetchedItems.length > 0 ? fetchedItems[0].subcategory : '');
      if (firstCat) setSelectedCat(firstCat);
    });
  }, [sidebarCategories]);
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const cats = sidebarCategories.categories || [];
  // Only filter if we have items AND a selected category is set (prevents flicker)
  const filteredItems = items.filter(p => selectedCat && (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());







  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* MODERN BESPOKE HERO - COMPACT PACKED */}
        <section className="pt-4 pb-6 flex flex-col lg:flex-row gap-4 items-stretch">
           {/* TEXT BLOCK - LEFT */}
           <div className="flex-1 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="px-3 py-1 bg-gray-900 text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-6 w-fit scale-90 relative z-10">
                 <Stars size={12} className="inline mr-2" /> {heroBlock.badge || "Design Studio 2024"}
              </div>
              <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl md:text-6xl font-black font-heading leading-[0.9] mb-6 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Imagine <br/> <span class=\"text-sm-blue italic font-serif lowercase tracking-normal\">the</span> <br/> Infinite." }} />
              <p className="text-gray-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest max-w-xs leading-loose relative z-10">
                 {heroBlock.subtitle || "We create non-linear, adaptive spaces where students explore, discover, and flourish."}
              </p>
           </div>

           {/* FEATURE BLOCKS - RIGHT */}
           <div className="lg:w-[450px] grid grid-cols-2 lg:grid-cols-1 gap-4">
              {(blocks?.feature_blocks?.blocks || [
                 { title: 'Curated \n Kindergarten \n Design.', bgColor: '#0057A8', textColor: '#FFFFFF' },
                 { title: 'Execution \n Portfolio \n Excellence.', subtitle: '2020-2025', bgColor: '#FACC15', textColor: '#111827' }
              ]).map((fb, i) => (
                 <div key={i} style={{ backgroundColor: fb.bgColor || '#0057A8', color: fb.textColor || '#fff' }} className="rounded-[40px] p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed" dangerouslySetInnerHTML={{ __html: (fb.title || '').replace(/\n/g, '<br/>') }} />
                    {fb.subtitle ? (
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[7px] font-black uppercase tracking-widest opacity-40">{fb.subtitle}</span>
                        <ArrowRight className="opacity-30 group-hover:opacity-100 transition-colors relative z-10" size={24} />
                      </div>
                    ) : (
                      <ArrowUpRight className="self-end opacity-50 group-hover:opacity-100 transition-colors relative z-10" size={24} />
                    )}
                 </div>
              ))}
           </div>
        </section>

        {/* CATEGORY NAV & MAIN CONTENT GALLERY */}
        <section className="py-8 border-t border-gray-100 flex flex-col md:flex-row gap-8 items-start">
            {/* LEFT SIDEBAR CATEGORY */}
            <div className="w-full md:w-64 shrink-0 space-y-6 sticky top-24">
               {/* Relevant Sub-categories */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4">
                     <span className="w-1 h-4 bg-sm-blue rounded-full" />
                     <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">COLLECTIONS</h3>
                  </div>
                  <div className="flex flex-col gap-2 px-2">
                     {cats.map((c, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setSelectedCat(c); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                          className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-black uppercase tracking-[0.05em] transition-all flex items-center justify-between group ${selectedCat.toUpperCase() === c.toUpperCase() ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-800 hover:border-sm-blue hover:text-sm-blue hover:bg-blue-50/30'}`}
                        >
                           {c}
                           <ChevronDown size={14} className={`transition-transform ${selectedCat.toUpperCase() === c.toUpperCase() ? 'rotate-180' : 'opacity-20'}`} />
                        </button>
                     ))}
                  </div>
               </div>
           </div>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-1 min-w-0">

              
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start scroll-mt-[200px]">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <CatalogueCard 
                         key={i}
                         work={work} 
                         onClick={() => handleProductClick(work, navigate, true)} 
                         themeColor="bg-sm-blue"
                         ringColor="ring-blue-500"
                         textColor="text-blue-400"
                       />

                     </React.Fragment>
                 ))}
              </div>


           </div>
        </section>


      </div>
    </main>
  );
};

export default SchoolDesigns;
