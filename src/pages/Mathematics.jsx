// src/pages/Mathematics.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Box, Layers, Calculator, Square, PieChart, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, Hash, Circle, Triangle, Ruler, ChevronRight, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';

const Mathematics = () => {
   const navigate = useNavigate();
   const { blocks, loading } = useCMSPage('mathematics');
   const [items, setItems] = useState([]);
   const [selectedCat, setSelectedCat] = useState('');

   const heroBlock = blocks?.inner_page_hero || {};
   const sidebarCategories = blocks?.sidebar_categories || {};

   useEffect(() => {
      getProducts({ category: 'Mathematics' }).then(res => {
         setItems(res || []);
         const defaultCat = sidebarCategories.categories?.[0] || 'Math Kits';
         setSelectedCat(defaultCat);
      });
   }, [sidebarCategories]);

   const sidebarResources = blocks?.sidebar_resources || {};
   const sidebarTrending = blocks?.sidebar_trending || {};

   const cats = sidebarCategories.categories || [];
   const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());






   return (
      <main className="min-h-screen bg-white pt-6 pb-4">
         <div className="max-w-7xl mx-auto px-4">

            <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
               <div className="lg:col-span-12 bg-white rounded-[40px] p-10 lg:p-14 text-gray-900 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[350px]">
                  <CMSMedia
                     mediaType={heroBlock.mediaType}
                     mediaUrl={heroBlock.mediaUrl}
                     fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=1000&q=80"}
                     className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                  />
                  <div className="absolute top-0 right-0 w-80 h-80 bg-sm-blue/5 rounded-full blur-[100px] -mr-40 -mt-40 opacity-60" />
                  <div className="px-4 py-1.5 bg-sm-blue text-white font-black rounded-full text-[11px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                     <Hash size={12} className="inline mr-2" /> {heroBlock.badge || "Logic & Symmetry 2025"}
                  </div>
                  <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl lg:text-6xl font-black font-heading leading-[0.95] mb-6 tracking-tighter uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Play <br/> <span class=\"text-sm-blue italic font-serif lowercase tracking-normal\">with</span> <br/> Numbers." }} />
                  <p className="text-gray-500 text-[12px] md:text-[13px] font-bold uppercase tracking-widest max-w-md leading-loose relative z-10">
                     {heroBlock.subtitle || (heroBlock.data?.subtitle) || "We create gamified math labs where abstract concepts become tangible experiences through interactive equipment."}
                  </p>
               </div>
            </section>

            {blocks?.action_strip && (
               <section className="mb-6">
                  <Link to={blocks.action_strip.downloadPath || '/catalogues'}
                    style={{ backgroundColor: blocks.action_strip.bgColor || '#111827' }}
                    className="rounded-[40px] p-8 text-white flex items-center justify-between group overflow-hidden relative border border-gray-800 shadow-2xl transition-transform hover:scale-[1.01]">
                    <div className="flex flex-col gap-2">
                       <h3 style={{ color: blocks.action_strip.textColor || undefined }} className="text-[13px] font-black uppercase tracking-[0.2em] text-sm-blue">{blocks.action_strip.title || 'The 2025 Lookbook.'}</h3>
                       <span className="text-[14px] font-black text-white/50 uppercase tracking-widest font-heading">{blocks.action_strip.subtitle || 'MASTER CATALOGUE'}</span>
                    </div>
                    <span className="p-4 bg-sm-blue text-white rounded-full shadow-lg relative z-10 transition-all group-hover:bg-white group-hover:text-sm-blue">
                       <Download size={20} />
                    </span>
                  </Link>
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
                   <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start scroll-mt-48">
                      {filteredItems.map((work, i) => (
                         <CatalogueCard
                            key={i}
                            work={work}
                            onClick={() => {
                               if (work.ctaLink && (work.ctaLink.startsWith('http') || work.ctaLink.startsWith('www'))) {
                                 window.open(work.ctaLink, '_blank');
                               } else {
                                 navigate(`/product/${work.slug}`);
                               }
                            }}
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

export default Mathematics;
