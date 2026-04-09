// src/pages/Mathematics.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Compass, Box, Layers, Calculator, Square, PieChart, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, Hash, Circle, Triangle, Ruler, ChevronRight } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';

const Mathematics = () => {
  const { blocks, loading } = useCMSPage('mathematics');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Gamified Math Labs' }).then(res => {
      setItems(res || []);
    });
  }, []);

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  useEffect(() => {
    if (!loading && cats.length > 0 && !selectedCat) {
      setSelectedCat(cats[0]);
    }
  }, [loading, cats, selectedCat]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-black tracking-widest uppercase py-20">Loading Mathematics...</div>;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-12 bg-white rounded-[40px] p-12 lg:p-20 text-gray-900 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[450px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=1000&q=80"}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-96 h-96 bg-sm-blue/5 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60" />
              <div className="px-4 py-1.5 bg-sm-blue text-white font-black rounded-full text-[9px] uppercase tracking-[0.2em] mb-6 w-fit scale-90 relative z-10">
                 <Hash size={12} className="inline mr-2" /> {heroBlock.badge || "Logic & Symmetry 2025"}
              </div>
              <h1 className="text-5xl lg:text-8xl font-black font-heading leading-[0.9] mb-8 tracking-tighter uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Play <br/> <span class=\"text-sm-blue italic font-serif lowercase tracking-normal\">with</span> <br/> Numbers." }} />
              <p className="text-gray-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest max-w-md leading-loose relative z-10">
                 {heroBlock.subtitle || (heroBlock.data?.subtitle) || "We create gamified math labs where abstract concepts become tangible experiences through interactive equipment."}
              </p>
           </div>
        </section>

         {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
           {/* LEFT SIDEBAR CATEGORY */}
           <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
              <div className="mb-6 px-4">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">MATH HUB</h3>
                 <div className="w-8 h-1 bg-sm-blue rounded-full" />
              </div>
              {cats.map((cat, i) => (
                 <button 
                   key={i} 
                   onClick={() => { setSelectedCat(cat); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                   className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCat === cat ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                 >
                   {cat}
                   <ChevronRight size={14} className={`transition-transform ${selectedCat === cat ? 'rotate-[-90deg]' : 'opacity-0 group-hover:opacity-100'}`} />
                 </button>
              ))}
           </div>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.grid_heading?.leftHtml || `THE <span class="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Lab-Kit</span>` }} />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blocks?.grid_heading?.rightStat || 'Selected Works: Gr. 1-12'}</span>
              </div>
              
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <CatalogueCard 
                         work={work} 
                         isSelected={selectedItem?.name === work.name} 
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)} 
                         themeColor="bg-sm-blue"
                         ringColor="ring-blue-500"
                         textColor="text-blue-400"
                       />

                       {/* INLINE EXPANSION LOGIC */}
                       {/* Mobile */}
                       {selectedItem?.name === work.name && (
                          <div className="md:hidden col-span-full">
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          </div>
                       )}
                       
                       {/* Tablet (2 cols) */}
                       {(i % 2 === 1 || i === filteredItems.length - 1) && 
                         filteredItems.slice(Math.floor(i/2)*2, i+1).some(dw => dw.name === selectedItem?.name) && (
                          <div className="hidden md:block lg:hidden col-span-full">
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          </div>
                       )}

                       {/* Desktop (3 cols) */}
                       {(i % 3 === 2 || i === filteredItems.length - 1) && 
                         filteredItems.slice(Math.floor(i/3)*3, i+1).some(dw => dw.name === selectedItem?.name) && (
                          <div className="hidden lg:block col-span-full">
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          </div>
                       )}
                    </React.Fragment>
                 ))}
              </div>
           </div>
        </section>

        {/* INFO SPLIT GRID (HUB) */}
        <section className="py-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6 pt-12">
           <div className="bg-white p-12 lg:p-16 rounded-[40px] border border-gray-100 shadow-sm relative group overflow-hidden">
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-[0.9] uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.info_split_grid?.heading || 'Bespoke <br/> <span class="text-sm-blue">Planning Hub.</span>' }} />
              <div className="grid grid-cols-2 gap-3">
                 {(blocks?.info_split_grid?.points || ['Curriculum Ready', 'Expert Training', '24/7 Support', 'GST Compliant']).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-5 rounded-2xl border border-transparent hover:border-sm-blue/20 transition-all">
                       <CheckCircle2 size={16} className="text-sm-blue group-hover:text-white" />
                       {typeof item === 'string' ? item : item.text}
                    </div>
                 ))}
              </div>
              <Link 
                 to={blocks?.info_split_grid?.ctaPath || "/registration"}
                 className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-gray-900 text-white font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all"
              >
                 {blocks?.info_split_grid?.ctaLabel || "Request Site Visit"} <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="rounded-[40px] overflow-hidden shadow-2xl h-[400px] border border-gray-100">
              <img src={blocks?.info_split_grid?.image || "https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=1000&q=80"} alt="Laboratory" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Mathematics;
