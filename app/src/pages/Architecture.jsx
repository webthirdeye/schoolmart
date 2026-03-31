// src/pages/Architecture.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Building2, Compass, Pencil, Lightbulb, Layout, ArrowRight, ArrowUpRight, Eye, Stars, Download, Layers, FileText, CheckCircle2 } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';

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
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           {/* LEFT SIDEBAR CATEGORY */}
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">DESIGN PHASES</h3>
                    <div className="w-8 h-1 bg-sm-blue rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCat === cat ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>{cat}</button>
                 ))}
                 
                 <div className="mt-12 p-6 bg-gray-50 rounded-[25px] border border-gray-100 shadow-sm">
                    <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 block">Our Compliance</span>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-sm-blue" />
                          <span className="text-[9px] font-black uppercase text-gray-900 tracking-wider">NEP GUIDELINES</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-sm-blue" />
                          <span className="text-[9px] font-black uppercase text-gray-900 tracking-wider">NREDA GOLD</span>
                       </div>
                    </div>
                 </div>
              </div>
           
                  {/* Dynamic Resources & Trending Blocks */}
                  {sidebarResources?.items?.length > 0 && (
                     <div className="mt-8 p-6 bg-white rounded-[25px] border border-gray-200 shadow-sm">
                        <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 block">Resources</span>
                        <div className="space-y-4">
                           {sidebarResources.items.map((item, i) => {
                              const label = typeof item === 'string' ? item : item.label;
                              const path = typeof item === 'string' || !item.path ? '#' : item.path;
                              return (
                                 <Link key={i} to={path} className="flex items-start gap-3 hover:translate-x-1 transition-transform group/link">
                                    <FileText size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-[9px] font-black uppercase text-gray-900 leading-tight group-hover/link:text-sm-blue transition-colors">{label}</span>
                                 </Link>
                              );
                           })}
                        </div>
                     </div>
                  )}
                  {sidebarTrending?.items?.length > 0 && (
                     <div className="mt-4 p-6 bg-gray-900 rounded-[25px] border border-gray-800 shadow-xl">
                        <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase mb-4 block">Trending Now</span>
                        <div className="space-y-4">
                           {sidebarTrending.items.map((item, i) => {
                              const label = typeof item === 'string' ? item : item.label;
                              const path = typeof item === 'string' || !item.path ? '#' : item.path;
                              return (
                                 <Link key={i} to={path} className="flex items-start gap-3 hover:translate-x-1 transition-transform group/link">
                                    <Stars size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-[9px] font-black uppercase text-white leading-tight group-hover/link:text-blue-400 transition-colors">{label}</span>
                                 </Link>
                              );
                           })}
                        </div>
                     </div>
                  )}</aside>

           {/* MAIN CONTENT GALLERY - GOOGLE IMAGES STYLE */}
           <div className="flex-grow">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">PROJECT <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Showcase</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Works: 2020-2025</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <div 
                         className={`relative overflow-hidden rounded-[30px] shadow-xl group cursor-pointer aspect-[4/5] border border-gray-300 transition-all duration-500 ${selectedItem?.name === work.name ? 'ring-4 ring-sm-blue shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'}`}
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)}
                       >
                          <img src={(work.image || work.images?.[0] || "")} alt={work.name} className="w-full h-full object-cover transition-all duration-700 hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-6 right-6">
                             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={18} />
                             </div>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                             <span className="text-sm-blue font-black text-[8px] uppercase tracking-widest block mb-1">{work.subcategory}</span>
                             <h3 className="text-xl font-black text-white font-heading leading-tight uppercase">{work.name}</h3>
                          </div>
                          {selectedItem?.name === work.name && (
                             <div className="absolute inset-0 bg-sm-blue/20 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white text-sm-blue px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">
                                   Reading...
                                </div>
                             </div>
                          )}
                       </div>

                       {/* INLINE EXPANSION LOGIC */}
                       {/* Mobile */}
                       <div className="md:hidden col-span-full">
                          {selectedItem?.name === work.name && (
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          )}
                       </div>
                       {/* Tablet (2 cols) */}
                       {i % 2 === 1 && (
                          <div className="hidden md:block lg:hidden col-span-full">
                             {filteredItems.slice(i-1, i+1).some(dw => dw.name === selectedItem?.name) && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                       )}
                       {/* Desktop (3 cols) */}
                       {i % 3 === 2 && (
                          <div className="hidden lg:block col-span-full">
                             {filteredItems.slice(i-2, i+1).some(dw => dw.name === selectedItem?.name) && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                       )}
                       {/* Handle End of List */}
                       {i === filteredItems.length - 1 && (
                          <>
                             <div className="hidden md:block lg:hidden col-span-full">
                                {filteredItems.slice(Math.floor(i/2)*2).some(dw => dw.name === selectedItem?.name) && i % 2 !== 1 && (
                                   <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                                )}
                             </div>
                             <div className="hidden lg:block col-span-full">
                                {filteredItems.slice(Math.floor(i/3)*3).some(dw => dw.name === selectedItem?.name) && i % 3 !== 2 && (
                                   <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                                )}
                             </div>
                          </>
                       )}
                    </React.Fragment>
                 ))}
                 
                 <div className="bg-gray-900 rounded-[30px] p-8 text-white flex flex-col justify-center min-h-[300px] relative overflow-hidden group">
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
