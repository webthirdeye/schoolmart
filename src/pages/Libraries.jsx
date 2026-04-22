// src/pages/Libraries.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Library, GraduationCap, Users, Bookmark, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, ChevronRight, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import { handleProductClick } from '../utils/navigation';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';

const Libraries = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('libraries');
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
    getProducts({ category: 'Libraries'  }).then(res => {
      setItems(res || []);
    });
  }, []);
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const featureCard = blocks?.feature_card || { 
    title: "Optimizing Flow & Acoustics.", 
    bgColor: "#1A1A1A", 
    btnColor: "#0066CC", 
    btnPath: "#" 
  };
  
  const cats = sidebarCategories.categories || [];
  // Only filter if we have items AND a selected category is set (prevents flicker)
  const filteredItems = items.filter(p => selectedCat && (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());







  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
           <div className="md:col-span-8 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-64 h-64 bg-sm-blue/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="px-3 py-1 bg-gray-900 text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Bookmark size={12} className="inline mr-2" /> {heroBlock.badge || "Modern Library Concepts 2025"}
              </div>
              <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl lg:text-7xl font-black font-heading leading-[0.9] mb-8 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Read <br/> <span class=\"text-sm-blue italic font-serif lowercase tracking-normal\">and</span> <br/> Reflect." }} />
              <p className="text-gray-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                 {heroBlock.subtitle || "Transforming traditional book repositories into collaborative, tech-enabled social learning hubs."}
              </p>
           </div>
           
            <div className="md:col-span-4 flex flex-col gap-3">
               <div className="bg-white rounded-[40px] overflow-hidden relative shadow-sm group border border-gray-100 flex-grow">
                  <CMSMedia 
                     mediaType={heroBlock.mediaType} 
                     mediaUrl={heroBlock.mediaUrl} 
                     fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80"}
                     className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                  />
               </div>
               <div 
                 className="rounded-[40px] p-8 bg-white text-gray-900 flex flex-col justify-between group overflow-hidden relative border border-gray-100 shadow-sm transition-transform hover:scale-[1.02] min-h-[160px]"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  <h3 className="text-[13px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed text-sm-blue">
                    {featureCard.title || "Optimizing Flow & Acoustics."}
                  </h3>
                  <Link 
                    to={featureCard.btnPath || '#'}
                    className="p-4 bg-gray-900 text-white rounded-full self-end mt-4 shadow-xl active:scale-95 z-10 hover:bg-sm-blue transition-all"
                  >
                    <ArrowUpRight size={24} />
                  </Link>
               </div>
            </div>
        </section>

        {/* PAGE DESCRIPTION EXTENSION */}
        {heroBlock.pageDescription && (
           <section className="pb-6 border-b border-gray-100 max-w-5xl">
              <p className="text-gray-600 font-medium text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap">
                 {heroBlock.pageDescription}
              </p>
           </section>
        )}


         {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
            {/* LEFT SIDEBAR CATEGORY */}
            <div className="w-full lg:w-64 shrink-0 space-y-6 sticky top-24">
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
                          className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-black uppercase tracking-[0.05em] transition-all flex items-center justify-between group ${selectedCat.toUpperCase() === c.toUpperCase() ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-800 hover:border-sm-blue hover:text-sm-blue hover:bg-blue-50/30'}`}
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

export default Libraries;
