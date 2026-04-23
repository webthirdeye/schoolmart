// src/pages/LabsLibraries.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FlaskConical, Beaker, Atom, Microscope, Dna, Zap, ArrowRight, ArrowUpRight, Download, Eye, FileText, Activity, Layers, CheckCircle2, Stars, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import { handleProductClick } from '../utils/navigation';
import CatalogueCard from '../components/CatalogueCard';

const LabsLibraries = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('labs');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};

  // Priority 1: Auto-select first CMS category if available
  useEffect(() => {
    if (!loading) {
      if (sidebarCategories.categories?.length && !selectedCat) {
        setSelectedCat(sidebarCategories.categories[0]);
      } else if (!sidebarCategories.categories?.length && !selectedCat && items.length > 0) {
        setSelectedCat(items[0].subcategory);
      }
    }
  }, [sidebarCategories, loading, items, selectedCat]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts({ category: 'Labs'  }).then(res => {
      setItems(res || []);
    });
  }, []);
  
  const cats = sidebarCategories.categories || [];
  // Only filter if we have items AND a selected category is set (prevents flicker)
  const filteredItems = items.filter(p => selectedCat && (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());







  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            <div className="lg:col-span-12 bg-white rounded-[40px] p-10 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[350px]">
               <CMSMedia 
                 mediaType={heroBlock.mediaType} 
                 mediaUrl={heroBlock.mediaUrl} 
                 fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=1000&q=80"}
                 className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
               />
               <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -mr-40 -mt-40 opacity-60" />
               <div className="px-3 py-1 bg-emerald-100 text-emerald-700 font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10 border border-emerald-200">
                  <Activity size={12} className="inline mr-2 animate-pulse" /> {heroBlock.badge || "Integrated Lab Solutions"}
               </div>
               <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl lg:text-6xl font-black font-heading leading-[0.95] mb-6 tracking-tighter uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Composite <br/> <span class=\"text-emerald-500 italic font-serif lowercase tracking-normal\">Skill</span> <br/> Labs." }} />
               <p style={{ color: heroBlock.textColor || undefined }} className={`text-[12px] md:text-[13px] font-bold uppercase tracking-[0.3em] max-w-sm leading-loose relative z-10 ${heroBlock.textColor ? 'opacity-80' : 'text-gray-400'}`}>
                  {heroBlock.subtitle || "The next generation of multidisciplinary spaces where science meets future-ready architecture."}
               </p>
            </div>
         </section>

         {blocks?.action_strip && (
            <section className="mb-8">
               <Link to={blocks.action_strip.downloadPath || '/catalogues'}
                 target="_blank" rel="noopener noreferrer"
                 style={{ backgroundColor: blocks.action_strip.bgColor || '#065F46' }}
                 className="rounded-[40px] p-8 text-white flex items-center justify-between group overflow-hidden relative border border-emerald-900 shadow-2xl transition-transform hover:scale-[1.01]">
                 <div className="flex flex-col gap-2">
                    <h3 style={{ color: blocks.action_strip.textColor || undefined }} className="text-[13px] font-black uppercase tracking-[0.2em]">{blocks.action_strip.title || 'Skill Lab Guide 2025.'}</h3>
                    <span style={{ color: blocks.action_strip.textColor || undefined }} className="text-[14px] font-black uppercase tracking-widest font-heading">{blocks.action_strip.subtitle || 'TECHNICAL SPECIFICATIONS'}</span>
                 </div>
                 </Link>
            </section>
         )}

        
        {/* PAGE DESCRIPTION EXTENSION */}
        {heroBlock.pageDescription && (
           <section 
             className={heroBlock.pageDescriptionBgColor ? 'px-6 py-4 md:px-8 md:py-5 mb-6 rounded-[30px] text-center w-full shadow-sm border-0' : 'pb-6 border-b border-gray-100 max-w-5xl'}
             style={{ backgroundColor: heroBlock.pageDescriptionBgColor || 'transparent' }}
           >
              <p 
                className={`${heroBlock.pageDescriptionBgColor ? 'text-[15px] md:text-lg font-bold' : 'text-gray-600 font-medium text-[14px] md:text-[15px]'} leading-snug whitespace-pre-wrap max-w-4xl mx-auto`}
                style={{ color: heroBlock.pageDescriptionTextColor || undefined }}
              >
                 {heroBlock.pageDescription}
              </p>
           </section>
        )}

        {/* CATEGORY NAV & MAIN CONTENT GALLERY */}
        <section className="py-8 border-t border-gray-100 flex flex-col md:flex-row gap-8 items-start">
            {/* LEFT CATEGORY NAV */}
            <div className="w-full md:w-64 shrink-0 space-y-6 sticky top-24">
               {/* Relevant Sub-categories */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4">
                     <span className="w-1 h-4 bg-emerald-600 rounded-full" />
                     <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">COLLECTIONS</h3>
                  </div>
                  <div className="flex flex-col gap-2 px-2">
                     {cats.map((c, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setSelectedCat(c); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                          className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-black uppercase tracking-[0.05em] transition-all flex items-center justify-between group ${selectedCat.toUpperCase() === c.toUpperCase() ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-800 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/30'}`}
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
                <div id="product-grid" className="columns-1 md:columns-2 lg:columns-3 gap-6 scroll-mt-[200px]">
                  {filteredItems.map((work, i) => (
                    <CatalogueCard 
                      key={i}
                      work={work} 
                      onClick={() => handleProductClick(work, navigate, true)} 
                    />
                  ))}
               </div>
           </div>
        </section>


      </div>
    </main>
  );
};

export default LabsLibraries;
