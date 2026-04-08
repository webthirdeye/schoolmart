// src/pages/Architecture.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Building2, Compass, Pencil, Lightbulb, Layout, ArrowRight, ArrowUpRight, Eye, Stars, Download, Layers, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';

const Architecture = () => {
  const { blocks, loading } = useCMSPage('architecture');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'School Architecture' }).then(res => {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading School Architecture...</div>;


  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* MODERN BESPOKE HERO - COMPACT PACKED */}
        <section className="pt-4 pb-6 flex flex-col lg:flex-row gap-4 items-stretch">
           {/* TEXT BLOCK - LEFT */}
           <div className="flex-1 bg-white rounded-[25px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Stars size={12} className="inline mr-2" /> {heroBlock.badge || "Global Studio 2025"}
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'Spaces <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">that</span> <br/> Speak.' }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose relative z-10">
                 {heroBlock.subtitle || "NEP-ready campus masterplanning and futuristic school architecture designed for deep focus."}
              </p>
           </div>

           {/* IMAGE BLOCK - RIGHT */}
           <div className="lg:w-[500px] rounded-[30px] overflow-hidden relative shadow-lg group">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 z-0 brightness-90"
              />
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-all" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end backdrop-blur-md bg-white/10 p-4 rounded-2xl border border-white/20">
                 <span className="text-[9px] font-black text-white uppercase tracking-widest">Master Planning Case Studies</span>
                 <ArrowUpRight className="text-white" size={24} />
              </div>
           </div>
        </section>

         {/* SIDEBAR GALLERY LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
           {/* LEFT SIDEBAR CATEGORY */}
           <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
              <div className="mb-6 px-4">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">DESIGN PHASES</h3>
                 <div className="w-8 h-1 bg-sm-blue rounded-full" />
              </div>
              {cats.map((cat, i) => (
                 <button 
                   key={i} 
                   onClick={() => { setSelectedCat(cat); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                   className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCat === cat ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                 >
                   {cat}
                   <ChevronRight size={14} className={`transition-transform ${selectedCat === cat ? 'rotate-[-90deg]' : 'opacity-0 group-hover:opacity-100'}`} />
                 </button>
              ))}
           </div>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">PROJECT <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Showcase</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Works: 2020-2025</span>
              </div>
              
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
                       <div className="md:hidden col-span-full">
                          {selectedItem?.name === work.name && (
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          )}
                       </div>
                       {/* PC (2 cols) */}
                       {i % 2 === 1 && (
                          <div className="hidden md:block col-span-full">
                             {filteredItems.slice(i-1, i+1).some(dw => dw.name === selectedItem?.name) && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                       )}
                       {/* Handle End of List */}
                       {i === filteredItems.length - 1 && (
                          <>
                             <div className="hidden md:block col-span-full">
                                {filteredItems.slice(Math.floor(i/2)*2).some(dw => dw.name === selectedItem?.name) && i % 2 !== 1 && (
                                   <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                                )}
                             </div>
                          </>
                       )}
                    </React.Fragment>
                 ))}
                 
                 <div className="bg-gray-900 rounded-[30px] p-8 text-white flex flex-col justify-center min-h-[300px] relative overflow-hidden group shadow-lg">
                    <Building2 size={32} className="text-sm-blue mb-6" />
                    <h4 className="text-xl font-black font-heading mb-4 uppercase leading-none tracking-tighter">Campus <br/> Audit Pro.</h4>
                    <button className="px-6 py-2 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-widest w-fit hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-blue-500/10">Request Site Visit</button>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Architecture;
