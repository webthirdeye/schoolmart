// src/pages/Science.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { FlaskConical, Beaker, Atom, Microscope, Dna, Zap, ArrowRight, ArrowUpRight, Download, Eye, FileText, Activity, Layers, CheckCircle2, Stars } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';

const scienceItems = [
  { id: 1, title: 'Modular Physics Bench', cat: 'Lab Furniture', img: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80', badge: 'Safety Plus' },
  { id: 2, title: 'The Human Anatomy V3', cat: 'Biology Models', img: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&q=80', badge: 'High-Detail' },
  { id: 3, title: 'Spectroscopy Kit', cat: 'Optics', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80', badge: 'Advanced' },
  { id: 4, title: 'Chemical Storage Unit', cat: 'Safety', img: 'https://images.unsplash.com/photo-1581093196277-9f608109ca46?w=800&q=80', badge: 'ISO Certified' },
  { id: 5, title: 'DNA Sequencer Card', cat: 'Biotech', img: 'https://images.unsplash.com/photo-1579154235820-22718e001804?w=800&q=80', badge: 'Modern' },
  { id: 6, title: 'Micro-Grid Solar Kit', cat: 'Renewables', img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', badge: 'STEM Pick' },
];

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Science...</div>;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-8 bg-emerald-50 rounded-[25px] p-8 flex flex-col justify-center border border-emerald-100 shadow-sm relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=1000&q=80"}
                className="absolute inset-0 w-full h-full object-cover brightness-95 opacity-20 group-hover:opacity-30 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="px-3 py-1 bg-emerald-500 text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Activity size={12} className="inline mr-2 animate-pulse" /> {heroBlock.badge || "Experimental Discovery 2025"}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Science <br/> <span className=\"text-emerald-500 italic font-serif lowercase tracking-normal\">is</span> <br/> Pure Fun." }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                 {heroBlock.subtitle || "From periodic tables to precision workbenches, we create spaces where curiosity triggers action."}
              </p>
           </div>

           <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="flex-grow rounded-[25px] overflow-hidden relative shadow-lg group border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80" className="w-full h-full object-cover brightness-90 transition-all duration-700 hover:scale-110" alt="Lab" />
                 <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-all" />
              </div>
              <div className="bg-[#1A1A1A] rounded-[25px] p-6 text-white flex flex-col justify-between group overflow-hidden relative border border-gray-800 shadow-2xl transition-transform hover:scale-[1.02]">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed text-emerald-400">Zero-Leaking <br/> Security <br/> Performance.</h3>
                 <button className="p-3 bg-emerald-500 text-white rounded-full self-end mt-4 shadow-xl active:scale-95"><ArrowUpRight size={20} /></button>
              </div>
           </div>
        </section>

        {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">SCIENCE CORE</h3>
                    <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCat === cat ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-900'}`}>{cat}</button>
                 ))}
                 
                 <div className="mt-12 p-6 bg-emerald-900 rounded-[25px] border border-emerald-800 text-white shadow-2xl overflow-hidden relative group">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 blur-xl opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[8px] font-black text-emerald-400 tracking-[0.2em] uppercase mb-4 block">Safety Status</span>
                    <div className="flex items-center gap-2 mb-4">
                       <CheckCircle2 size={12} className="text-emerald-400" />
                       <span className="text-[9px] font-black uppercase">OSHA Compliant</span>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-emerald-500 rounded-full text-[7px] font-black uppercase tracking-widest transition-all">Download SDS</button>
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
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">CHEMISTRY <span className="text-emerald-500 italic font-serif lowercase tracking-normal text-lg ml-2">Apparatus</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Kits for Gr. 8-12</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <div 
                         className={`relative overflow-hidden rounded-[25px] shadow-sm group cursor-pointer border border-gray-300 aspect-[4/5] transition-all duration-500 ${selectedItem?.name === work.name ? 'ring-4 ring-emerald-500 shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'}`}
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)}
                       >
                          <img src={(work.image || work.images?.[0] || "")} alt={work.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-10 h-10 rounded-full bg-emerald-500 shadow-xl flex items-center justify-center text-white">
                                <ArrowUpRight size={18} />
                             </div>
                          </div>
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0">
                             <h3 className="text-base font-black text-white uppercase tracking-tighter font-heading">{work.name}</h3>
                             <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">{work.subcategory}</span>
                          </div>
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
              </div>
           </div>
        </section>

        {/* INFO SPLIT GRID */}
        <section className="py-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
           <div className="bg-white p-12 rounded-[30px] border border-gray-100 shadow-sm relative group overflow-hidden">
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter">Security <br/> <span className="text-emerald-500">Performance.</span></h2>
              <div className="grid grid-cols-2 gap-3">
                 {['Acid Resistant', 'Safe Plumbing', 'SEFA Certified', 'Custom Fitting'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-4 rounded-xl border border-gray-50 hover:bg-emerald-500 hover:text-white transition-all">
                       <CheckCircle2 size={14} className="text-emerald-500 group-hover:text-white" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="rounded-[30px] overflow-hidden shadow-2xl h-[400px]">
              <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1000&q=80" alt="Laboratory" className="w-full h-full object-cover" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Science;
