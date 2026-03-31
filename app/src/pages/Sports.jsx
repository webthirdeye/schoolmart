// src/pages/Sports.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Zap, Activity, Trophy, Shield, Target, ArrowRight, ArrowUpRight, Award, Layers, CheckCircle2, FileText, Stars } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';

const sportsWorks = [
  { title: 'The Olympic Track', cat: 'Competition', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', height: 'h-[220px]' },
  { title: 'Maple Court Pro', cat: 'Basketball', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80', height: 'h-[280px]' },
  { title: 'Turf Excellence', cat: 'Football', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', height: 'h-[320px]' },
  { title: 'Aquatic High-Dive', cat: 'Swimming', img: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&q=80', height: 'h-[250px]' },
  { title: 'Indoor Gym Elite', cat: 'Fitness', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', height: 'h-[220px]' },
  { title: 'Badminton Arena', cat: 'Racket Sports', img: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80', height: 'h-[300px]' },
  { title: 'Cricket Pitch Max', cat: 'Outdoor', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80', height: 'h-[250px]' },
];

const Sports = () => {
  const { blocks, loading } = useCMSPage('sports');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Sports Infrastructure' }).then(res => {
      setItems(res || []);
    });
  }, []);

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Sports Infrastructure...</div>;


  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
           {/* COLUMN 1 - STORY (SPAN 5) */}
           <div className="md:col-span-5 bg-white rounded-[25px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                 <Zap size={12} className="inline mr-2" /> {heroBlock.badge || "Performance 2025"}
              </div>
              <h1 className="text-4xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'Built <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">for</span> <br/> Champions.' }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                 {heroBlock.subtitle || "Engineering high-performance athletic surfaces for the next generation."}
              </p>
           </div>

           <div className="md:col-span-4 rounded-[25px] overflow-hidden relative shadow-lg group">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-sm-blue/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>

           {/* COLUMN 3 - ACTION STACK (SPAN 3) */}
           <div className="md:col-span-3 flex flex-col gap-4">
              <div className="flex-1 bg-gray-900 rounded-[25px] p-6 text-white flex flex-col justify-between group overflow-hidden relative border border-gray-800">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed text-sm-blue">Schedule <br/> Site Survey.</h3>
                 <ArrowUpRight className="self-end text-white/20 group-hover:text-sm-blue transition-colors" size={24} />
              </div>
              <div className="flex-1 bg-emerald-50 rounded-[25px] p-6 text-emerald-600 flex flex-col justify-between group overflow-hidden relative border border-emerald-100">
                 <Shield className="text-emerald-300" size={20} />
                 <h3 className="text-[9px] font-black uppercase tracking-[0.1em] z-10 leading-relaxed group-hover:text-emerald-700">Safety Compliance Gold Certified.</h3>
              </div>
           </div>
        </section>

        {/* SIDEBAR GALLERY LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           {/* LEFT SIDEBAR CATEGORY */}
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">ARENA MODULES</h3>
                    <div className="w-8 h-1 bg-sm-blue rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCat === cat ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>{cat}</button>
                 ))}
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
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">ELITE <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Surfaces</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">1,200+ Fields Installed</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <div 
                         className={`relative overflow-hidden rounded-[25px] shadow-sm group cursor-pointer aspect-[4/5] border border-gray-300 transition-all duration-500 ${selectedItem?.name === work.name ? 'ring-4 ring-sm-blue shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'}`}
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)}
                       >
                          <img src={(work.image || work.images?.[0] || "")} alt={work.name} className="w-full h-full object-cover transition-all duration-700 hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0">
                             <h3 className="text-base font-black text-white uppercase tracking-tighter">{work.name}</h3>
                             <span className="text-[10px] text-sm-blue font-black tracking-widest uppercase">{work.subcategory}</span>
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
                 
                 <div className="bg-gray-900 rounded-[25px] p-8 text-white flex flex-col justify-center min-h-[250px] relative overflow-hidden group">
                    <Trophy size={32} className="text-sm-blue mb-4" />
                    <h4 className="text-xl font-black font-heading tracking-tighter uppercase leading-none mb-4">Tournaments <br/> Ready.</h4>
                    <button className="px-5 py-2.5 bg-sm-blue text-white font-black rounded-full hover:bg-white hover:text-gray-900 transition-all text-[8px] tracking-widest w-fit">Request Specs</button>
                 </div>
              </div>
           </div>
        </section>

        {/* INFO SPLIT GRID - COMPACT */}
        <section className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-gray-100 mt-6">
           <div className="relative rounded-[30px] overflow-hidden shadow-xl h-[350px]">
              <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=80" alt="Athletic" className="w-full h-full object-cover" />
           </div>
           
           <div className="bg-white p-10 rounded-[30px] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 font-heading mb-6 leading-none uppercase">High <span className="text-sm-blue">Impact.</span></h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                 Shock-absorption technology for safety and performance.
              </p>
              <div className="grid grid-cols-2 gap-3">
                 {['FIBA Compliant', 'Anti-Skid', 'Heat Proof', '10 Yr Warranty'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <CheckCircle2 size={12} className="text-sm-blue" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Sports;
