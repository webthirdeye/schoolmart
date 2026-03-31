// src/pages/Mathematics.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Compass, Box, Layers, Calculator, Square, PieChart, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, Hash, Circle, Triangle, Ruler } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';

const mathItems = [
  { id: 1, title: 'Geometric Shapes Kit', cat: 'Lab Equipment', img: 'https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=800&q=80', badge: 'Must Have' },
  { id: 2, title: 'Calculus Visualization Board', cat: 'Digital Tools', img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80', badge: 'Top Rated' },
  { id: 3, title: 'The Abacus Classic', cat: 'Primary Tools', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', badge: 'Traditional' },
  { id: 4, title: 'Algebra Logic Cubes', cat: 'Puzzles', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80', badge: 'Interactive' },
  { id: 5, title: '3D Geometry Modeler', cat: 'Software', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', badge: 'New Entry' },
  { id: 6, title: 'Number Line System', cat: 'Visual Aids', img: 'https://images.unsplash.com/photo-1516534775068-ba3e84529db1?w=800&q=80', badge: 'Essential' },
];

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Mathematics...</div>;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-12 bg-gray-900 rounded-[30px] p-12 text-white flex flex-col justify-center border border-gray-800 shadow-2xl relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=1000&q=80"}
                className="absolute inset-0 w-full h-full object-cover brightness-50 opacity-40 group-hover:opacity-60 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-96 h-96 bg-sm-blue/10 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60" />
              <div className="px-4 py-1.5 bg-sm-blue text-white font-black rounded-full text-[9px] uppercase tracking-[0.2em] mb-6 w-fit scale-90 relative z-10">
                 <Hash size={12} className="inline mr-2" /> {heroBlock.badge || "Logic & Symmetry 2025"}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black font-heading leading-none mb-6 tracking-tighter uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Play <br/> <span className=\"text-sm-blue italic font-serif lowercase tracking-normal\">with</span> <br/> Numbers." }} />
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest max-w-md leading-loose relative z-10">
                 {heroBlock.subtitle || "We create gamified math labs where abstract concepts become tangible experiences through interactive equipment."}
              </p>
           </div>
        </section>

        {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">MATH HUB</h3>
                    <div className="w-8 h-1 bg-sm-blue rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCat === cat ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>{cat}</button>
                 ))}
                 
                 <div className="mt-12 p-6 bg-blue-50/30 rounded-[25px] border border-blue-100 shadow-sm relative group overflow-hidden">
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-sm-blue/20 blur-xl rounded-full" />
                    <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 block">Our Standard</span>
                    <div className="flex items-center gap-2 mb-4">
                       <CheckCircle2 size={12} className="text-sm-blue" />
                       <span className="text-[9px] font-black uppercase text-gray-900">NEP Compliant Labs</span>
                    </div>
                    <button className="w-full py-2 bg-sm-blue text-white rounded-full text-[7px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Lab Setup Guide</button>
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
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">THE <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Lab-Kit</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Works: Gr. 1-12</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {filteredItems.map((work, i) => (
                     <React.Fragment key={i}>
                       <div 
                         className={`relative overflow-hidden rounded-[25px] shadow-sm group cursor-pointer border border-gray-300 aspect-[4/5] transition-all duration-500 bg-gray-50 ${selectedItem?.name === work.name ? 'ring-4 ring-sm-blue shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'}`}
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)}
                       >
                          <img src={(work.image || work.images?.[0] || "")} alt={work.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-10 h-10 rounded-full bg-sm-blue shadow-xl flex items-center justify-center text-white">
                                <ArrowUpRight size={18} />
                             </div>
                          </div>
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0">
                             <h3 className="text-base font-black text-white uppercase tracking-tighter font-heading leading-none mb-1">{work.name}</h3>
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
              </div>
           </div>
        </section>

        {/* INFO SPLIT GRID */}
        <section className="py-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
           <div className="bg-white p-12 rounded-[30px] border border-gray-100 shadow-sm relative group overflow-hidden">
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter">Bespoke <br/> <span className="text-sm-blue">Planning Hub.</span></h2>
              <div className="grid grid-cols-2 gap-3">
                 {['Curriculum Ready', 'Expert Training', '24/7 Support', 'GST Compliant'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-4 rounded-xl border border-gray-50 hover:bg-sm-blue hover:text-white transition-all">
                       <CheckCircle2 size={14} className="text-sm-blue group-hover:text-white" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="rounded-[30px] overflow-hidden shadow-2xl h-[400px]">
              <img src="https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=1000&q=80" alt="Laboratory" className="w-full h-full object-cover" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Mathematics;
