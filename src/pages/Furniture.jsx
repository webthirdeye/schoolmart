// src/pages/Furniture.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Sofa, GraduationCap, Library, FlaskConical, Building2, ArrowRight, Download, Filter, ChevronDown, CheckCircle2, Award, FileText, Stars, Calculator } from 'lucide-react';
import { handleProductClick } from '../utils/navigation';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const Furniture = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('furniture');
  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};
  const actionStrip = blocks?.action_strip || {};
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

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
    getProducts({ category: 'Furniture'  }).then(res => {
      setItems(res || []);
    });
  }, []);
  
  const cats = sidebarCategories.categories || [];
  // Only filter if we have items AND a selected category is set (prevents flicker)
  const filteredItems = items.filter(p => selectedCat && (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());







  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-7 rounded-[40px] overflow-hidden relative shadow-lg group border border-gray-100 min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80"} 
                className="w-full h-full object-cover transition-all duration-1000"
              />
              {/* Branding Overlays */}

              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-10 font-heading">
                  <div style={{ color: heroBlock.textColor || 'white' }}>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] block mb-3 opacity-80">{heroBlock.badge || "Featured Series"}</span>
                    <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.9] tracking-tighter" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Modular <br/> Classroom Pro." }} />
                  </div>
                  
              </div>
           </div>

           <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex-grow rounded-[40px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group" style={{ backgroundColor: heroBlock.bgColor || ( 'bg-gray-50' === 'bg-white' ? '#ffffff' : '#f9fafb' ) }}>
                 <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[13px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                    <Sofa size={12} className="inline mr-2" /> {heroBlock.badge || "2025 Collection"}
                 </div>
                 <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl font-black font-heading leading-tight mb-4 tracking-tighter uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'School <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">Furniture</span> <br/> Solutions.' }} />
                  <p style={{ color: heroBlock.textColor || undefined }} className={`text-[13px] font-bold uppercase tracking-widest max-w-xs leading-loose ${heroBlock.textColor ? 'opacity-80' : 'text-gray-400'}`}>
                     {heroBlock.subtitle || "1200+ ergonomic products designed for inspiring spaces."}
                  </p>
               </div>

               <Link to={blocks?.action_strip?.downloadPath || '/catalogues'}
                 target="_blank" rel="noopener noreferrer"
                 style={{ backgroundColor: blocks?.action_strip?.bgColor || '#111827' }}
                 className="rounded-[40px] p-8 text-white flex items-center justify-between group overflow-hidden relative border border-gray-800 shadow-2xl">
                    <div className="flex flex-col text-left">
                       <h3 style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[13px] font-black uppercase tracking-[0.2em]">{blocks?.action_strip?.title || 'The 2025 Lookbook.'}</h3>
                       <span style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[13px] font-black uppercase tracking-widest font-heading">{blocks?.action_strip?.subtitle || 'MASTER CATALOGUE'}</span>
                    </div>
                 </Link>
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

        {/* CATEGORY NAV & MAIN PRODUCT GRID */}
        <section className="py-8 flex flex-col md:flex-row gap-8 items-start">
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
                {/* GET A QUOTE BOX */}
                <div className="bg-[#2d6a26] rounded-2xl p-6 flex flex-col items-start text-left shadow-xl mt-8 relative overflow-hidden">
                   <div className="absolute -top-4 -right-4 opacity-10">
                      <Calculator size={100} className="text-white" />
                   </div>
                   <h4 className="text-white/90 text-[10px] font-black uppercase tracking-widest mb-3 relative z-10">Furniture Solutions</h4>
                   <h3 className="text-white text-2xl font-serif font-black uppercase tracking-tight mb-4 leading-none relative z-10">
                      NEED A CUSTOM QUOTE?
                   </h3>
                   <p className="text-white/80 text-[13px] font-medium leading-relaxed mb-6 relative z-10">
                      Get personalized pricing for bulk furniture orders and institutional setups.
                   </p>
                   <Link to="/contact-us" className="px-6 py-3 bg-[#af8c43] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#2d6a26] transition-colors flex items-center gap-2 relative z-10">
                      REQUEST QUOTE <ArrowRight size={14} />
                   </Link>
                </div>
           </div>

           {/* MAIN PRODUCT GRID */}
            <div className="flex-1 min-w-0">
              <div id="product-grid" className="columns-1 md:columns-2 lg:columns-3 gap-6 scroll-mt-[200px] relative">
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

export default Furniture;
