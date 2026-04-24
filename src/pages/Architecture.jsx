// src/pages/Architecture.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Compass, Pencil, Lightbulb, Layout, ArrowRight, ArrowUpRight, Eye, Stars, Download, Layers, FileText, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import { handleProductClick } from '../utils/navigation';
import CatalogueCard from '../components/CatalogueCard';
import QuoteSidebarWidget from '../components/QuoteSidebarWidget';
import SidebarWidget from '../components/SidebarWidget';

const Architecture = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('school-building-design');
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
    getProducts({ category: 'Architecture'  }).then(res => {
      setItems(res || []);
    });
  }, []);

  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const cats = sidebarCategories.categories || [];
  // Only filter if we have items AND a selected category is set (prevents flicker)
  const filteredItems = items.filter(p => selectedCat && (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());







  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* MODERN BESPOKE HERO - SPLIT */}
        <section className="pt-4 pb-6 flex flex-col lg:flex-row gap-4 items-stretch">
           {/* TEXT BLOCK - LEFT */}
           <div className="flex-1 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px]" style={{ backgroundColor: heroBlock.bgColor || '#ffffff' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[13px] uppercase tracking-[0.2em] mb-6 w-fit scale-90 relative z-10">
                 <Stars size={12} className="inline mr-2" /> {heroBlock.badge || "Global Studio 2025"}
              </div>
              <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl md:text-6xl font-black font-heading leading-tight mb-6 tracking-tighter uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'School <br /> Building <br /> Design' }} />
              <p style={{ color: heroBlock.textColor || undefined }} className={`text-[13px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10 ${heroBlock.textColor ? 'opacity-80' : 'text-gray-400'}`}>
                 {heroBlock.subtitle || "NEP-READY CAMPUS PLANNING BY EXPERT ARCHITECTS"}
              </p>
           </div>

           {/* IMAGE BLOCK - RIGHT */}
           <div className="lg:col-span-1 lg:w-[500px] rounded-[40px] overflow-hidden relative shadow-lg group">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"}
                className="w-full h-full object-cover transition-transform duration-1000"
              />
              {/* Subtle Overlay to match the clean look */}

           </div>
        </section>

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


         {/* SIDEBAR GALLERY LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
            {/* LEFT SIDEBAR CATEGORY */}
            <div className="w-full lg:w-64 shrink-0 space-y-6 sticky top-24">
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
                          className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-black uppercase tracking-[0.05em] transition-all flex items-center justify-between group ${selectedCat.toUpperCase() === c.toUpperCase() ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-800 hover:border-sm-blue hover:text-sm-blue hover:bg-blue-50/30'}`}
                        >
                           {c}
                           <ChevronDown size={14} className={`transition-transform ${selectedCat.toUpperCase() === c.toUpperCase() ? 'rotate-180' : 'opacity-20'}`} />
                        </button>
                     ))}
                  </div>
               </div>

              <QuoteSidebarWidget sourcePage="Architecture" />

           </div>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-1 min-w-0">

              
              <div id="product-grid" className="columns-1 md:columns-2 lg:columns-3 gap-6 scroll-mt-[200px]">
                 {filteredItems.map((work, i) => (
                    <CatalogueCard 
                      key={i}
                      work={work} 
                      onClick={() => handleProductClick(work, navigate, true)} 
                      themeColor="bg-sm-blue"
                      ringColor="ring-blue-500"
                      textColor="text-blue-400"
                    />
                 ))}
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Architecture;
