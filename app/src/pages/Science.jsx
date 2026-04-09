// src/pages/Science.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { FlaskConical, Beaker, Atom, Microscope, Dna, Zap, ArrowRight, ArrowUpRight, Download, Eye, FileText, Activity, Layers, CheckCircle2, Stars, ChevronRight } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';

const Science = () => {
  const { blocks, loading } = useCMSPage('science');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Science Is Fun' }).then(res => {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-black tracking-widest uppercase py-20">Loading Science...</div>;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-8 bg-emerald-50 rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-emerald-100 shadow-sm relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=1000&q=80"}
                className="w-full h-full object-cover transition-all duration-1000"
              />
              <div className="px-3 py-1 bg-emerald-500 text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Activity size={12} className="inline mr-2 animate-pulse" /> {heroBlock.badge || "Experimental Discovery 2025"}
              </div>
              <h1 className="text-4xl lg:text-7xl font-black font-heading leading-[0.9] mb-8 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Science <br/> <span class=\"text-emerald-500 italic font-serif lowercase tracking-normal\">is</span> <br/> Pure Fun." }} />
              <p className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                 {heroBlock.subtitle || "From periodic tables to precision workbenches, we create spaces where curiosity triggers action."}
              </p>
           </div>

           <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="flex-grow rounded-[40px] overflow-hidden relative shadow-lg group border border-gray-100 min-h-[250px]">
                 <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80" className="w-full h-full object-cover transition-all duration-700 hover:scale-110" alt="Lab" />
              </div>
              <div 
                className="rounded-[40px] p-8 bg-white border border-emerald-100 text-gray-900 flex flex-col justify-between group overflow-hidden relative shadow-sm transition-transform hover:scale-[1.02]">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed text-gray-900" dangerouslySetInnerHTML={{ __html: (blocks?.feature_card?.title || "Zero-Leaking <br/> Security <br/> Performance.").replace(/\n/g, '<br/>') }} />
                 <Link to={blocks?.feature_card?.btnPath || "/contact-us"}
                   style={{ backgroundColor: blocks?.feature_card?.btnColor || '#10B981' }}
                   className="p-4 text-white rounded-full self-end mt-4 shadow-xl active:scale-95 hover:bg-emerald-500 hover:text-white transition-all"><ArrowUpRight size={24} /></Link>
              </div>
           </div>
        </section>

         {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
           {/* LEFT SIDEBAR CATEGORY */}
           <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
              <div className="mb-6 px-4">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">SCIENCE CORE</h3>
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
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.grid_heading?.leftHtml || 'CHEMISTRY <span class="text-emerald-500 italic font-serif lowercase tracking-normal text-lg ml-2">Apparatus</span>' }} />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blocks?.grid_heading?.rightStat || 'Selected Kits for Gr. 8-12'}</span>
              </div>
              
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <CatalogueCard 
                         work={work} 
                         isSelected={selectedItem?.name === work.name} 
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)} 
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
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-[0.9] uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.info_split_grid?.heading || 'Science <br/> <span class="text-emerald-500">Performance.</span>' }} />
              <div className="grid grid-cols-2 gap-3">
                 {(blocks?.info_split_grid?.points || ['Acid Resistant', 'Safe Plumbing', 'SEFA Certified', 'Custom Fitting']).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-5 rounded-2xl border border-transparent hover:border-emerald-500/20 transition-all group/point">
                       <CheckCircle2 size={16} className="text-emerald-500" />
                       {typeof item === 'string' ? item : item.text}
                    </div>
                 ))}
              </div>
                 <div 
                   className="rounded-[40px] bg-white p-8 lg:p-16 text-gray-900 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-sm border border-gray-100 min-h-[300px]"
                 >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sm-blue/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                    
                    <div className="relative z-10 max-w-2xl text-center md:text-left">
                       <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                          <Building2 size={32} className="text-sm-blue" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Infrastructure Support</span>
                       </div>
                       <h4 className="text-4xl lg:text-5xl font-black font-heading tracking-tighter uppercase leading-[0.9] mb-6">
                          {blocks?.feature_card?.title || "Space Planning Hub."}
                       </h4>
                       <p className="text-gray-400 text-xs lg:text-sm font-bold uppercase tracking-widest leading-loose max-w-lg">
                          {blocks?.feature_card?.subtitle || "Free Layout Design & Mockup Services. Get professional campus architecture audits and master planning."}
                       </p>
                    </div>

                    <div className="mt-10 md:mt-0 relative z-10">
                       <Link 
                         to={blocks?.feature_card?.btnPath || '/registration'}
                         className="px-10 py-5 bg-sm-blue text-white font-black rounded-full hover:bg-gray-900 transition-all text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 group"
                       >
                         {blocks?.feature_card?.btnLabel || "Request Pitch"}
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>
           </div>
           
           <div className="rounded-[40px] overflow-hidden shadow-2xl h-[400px] border border-gray-100">
              <img src={blocks?.info_split_grid?.image || "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1000&q=80"} alt="Laboratory" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Science;
