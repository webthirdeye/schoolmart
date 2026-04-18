// src/pages/Science.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FlaskConical, Beaker, Atom, Microscope, Dna, Zap, ArrowRight, ArrowUpRight, Download, Eye, FileText, Activity, Layers, CheckCircle2, Stars, ChevronRight, Building2, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import { handleProductClick } from '../utils/navigation';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';
import CatalogueCard from '../components/CatalogueCard';

const Science = () => {
   const navigate = useNavigate();
   const { blocks, loading } = useCMSPage('science');
   const [items, setItems] = useState([]);
   const [selectedCat, setSelectedCat] = useState('');

   const sidebarCategories = blocks?.sidebar_categories || {};
   const heroBlock = blocks?.inner_page_hero || {};
   
   useEffect(() => {
    window.scrollTo(0, 0);
    getProducts({ category: 'Science' }).then(res => {
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
   const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());




  
    return (
      <main className="min-h-screen bg-white pt-6 pb-4">
         <div className="max-w-7xl mx-auto px-4">

            <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-stretch">
               {/* TEXT BLOCK */}
               <div className="lg:col-span-5 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[300px] lg:min-h-[400px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-6 w-fit border border-emerald-100 relative z-10">
                     <Activity size={12} className="inline mr-2 animate-pulse" /> {heroBlock.badge || "Experimental Discovery 2025"}
                  </div>
                  <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl lg:text-6xl font-black font-heading leading-[0.9] mb-8 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Science <br/> <span class=\"text-emerald-500 italic font-serif lowercase tracking-normal\">is</span> <br/> Pure Fun." }} />
                  <p className="text-gray-400 text-[12px] lg:text-[13px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                     {heroBlock.subtitle || "From periodic tables to precision workbenches, we create spaces where curiosity triggers action."}
                  </p>
               </div>

               {/* IMAGE BLOCK */}
               <div className="lg:col-span-4 bg-emerald-50 rounded-[40px] overflow-hidden border border-emerald-100 shadow-sm relative group h-full">
                  <CMSMedia
                     mediaType={heroBlock.mediaType}
                     mediaUrl={heroBlock.mediaUrl}
                     fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=1000&q=80"}
                     className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>

               {/* FEATURE CARD / ACTION STRIP */}
               <div className="lg:col-span-3 flex flex-col gap-3 lg:gap-4">
                  <div 
                    style={{ backgroundColor: blocks?.action_strip?.bgColor || '#059669' }}
                    className="flex-grow rounded-[40px] p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden group transition-colors">
                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                     <span style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[12px] font-black uppercase tracking-[0.3em] relative z-10">{blocks?.action_strip?.subtitle || "Safety & Tech"}</span>
                     <h3 style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-2xl font-black uppercase tracking-tighter leading-tight mt-10 mb-2 relative z-10" 
                        dangerouslySetInnerHTML={{ __html: (blocks?.action_strip?.title || blocks?.feature_card?.title || "Security <br/> Performance.").replace(/\n/g, '<br/>') }} />
                     
                     <Link to={blocks?.action_strip?.downloadPath || blocks?.feature_card?.btnPath || "/contact-us"}
                        className="w-full py-4 bg-white text-emerald-600 font-black rounded-2xl text-[12px] uppercase tracking-widest active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 group/btn">
                        {blocks?.action_strip?.btnType === 'download' ? <Download size={14} /> : <ArrowUpRight size={14} />} 
                        {blocks?.action_strip?.btnType === 'download' ? 'Download Assets' : 'Explore Labs'}
                     </Link>
                  </div>
               </div>
            </section>

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


                  <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start scroll-mt-[200px]">
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

export default Science;
