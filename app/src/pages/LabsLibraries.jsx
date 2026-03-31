// src/pages/LabsLibraries.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { FlaskConical, Beaker, Atom, Microscope, Dna, Zap, ArrowRight, ArrowUpRight, Download, Eye, FileText, Activity, Layers, CheckCircle2, Stars } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';

const compositeItems = [
  { id: 1, title: 'Modular Lab Bench', cat: 'Science Labs', img: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&q=80', badge: 'Safety Plus' },
  { id: 2, title: 'Smart Library Rack', cat: 'Modern Library', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80', badge: 'High-Density' },
  { id: 3, title: 'STEM Discovery Kit', cat: 'Activity Room', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80', badge: 'Curated' },
  { id: 4, title: 'Chemical Storage', cat: 'Security', img: 'https://images.unsplash.com/photo-1581093196277-9f608109ca46?w=800&q=80', badge: 'Fire-Resist' },
  { id: 5, title: 'Library Lounge Pod', cat: 'Interiors', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', badge: 'Acoustic' },
  { id: 6, title: 'Mobile Project Cart', cat: 'Maker Space', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', badge: 'Utility' },
];

const LabsLibraries = () => {
  const { blocks, loading } = useCMSPage('labs');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Composite Skill Labs' }).then(res => {
      setItems(res || []);
    });
  }, []);

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Composite Skill Labs...</div>;


  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-12 bg-white rounded-[30px] p-12 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=1000&q=80"}
                className="absolute inset-0 w-full h-full object-cover brightness-110 opacity-10 group-hover:opacity-20 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60" />
              <div className="px-4 py-1.5 bg-emerald-600 text-white font-black rounded-full text-[9px] uppercase tracking-[0.2em] mb-6 w-fit scale-90 relative z-10">
                 <FlaskConical size={12} className="inline mr-2" /> {heroBlock.badge || "Research & Literacy 2025"}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black font-heading leading-none mb-6 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Bento <br/> <span className=\"text-emerald-600 italic font-serif lowercase tracking-normal\">of</span> <br/> Knowledge." }} />
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                 {heroBlock.subtitle || "Integrated solutions for composite skill labs and futuristic digital libraries in one unified platform."}
              </p>
           </div>
        </section>

        {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">COMPOSITE CORE</h3>
                    <div className="w-8 h-1 bg-emerald-600 rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCat === cat ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-900'}`}>{cat}</button>
                 ))}
                 
                 <div className="mt-12 p-6 bg-emerald-50/30 rounded-[25px] border border-emerald-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 block">Our Compliance</span>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span className="text-[9px] font-black uppercase text-gray-900">NEP GUIDELINES</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span className="text-[9px] font-black uppercase text-gray-900">SEFA CERTIFIED</span>
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
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">LAB <span className="text-emerald-600 italic font-serif lowercase tracking-normal text-lg ml-2">& Library</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Masterpieces: 500+ Projects</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                 {filteredItems.map((work, i) => (
                    <React.Fragment key={i}>
                       <div 
                         className={`relative overflow-hidden rounded-[25px] shadow-sm group cursor-pointer border border-gray-300 aspect-[4/5] transition-all duration-500 bg-gray-50 ${selectedItem?.name === work.name ? 'ring-4 ring-emerald-600 shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'}`}
                         onClick={() => setSelectedItem(selectedItem?.name === work.name ? null : work)}
                       >
                          <img src={(work.image || work.images?.[0] || "")} alt={work.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-10 h-10 rounded-full bg-emerald-600 shadow-xl flex items-center justify-center text-white">
                                <ArrowUpRight size={18} />
                             </div>
                          </div>
                          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0">
                             <h3 className="text-base font-black text-white uppercase tracking-tighter font-heading leading-none mb-1">{work.name}</h3>
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
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter">Bespoke <br/> <span className="text-emerald-600">Planning Hub.</span></h2>
              <div className="grid grid-cols-2 gap-3">
                 {['Free Consultation', 'BIFMA Certified', 'Custom Fitting', 'GST Ready'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-4 rounded-xl border border-gray-50 hover:bg-emerald-600 hover:text-white transition-all">
                       <CheckCircle2 size={14} className="text-emerald-600 group-hover:text-white" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="rounded-[30px] overflow-hidden shadow-2xl h-[400px]">
              <img src="https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=1000&q=80" alt="Planning" className="w-full h-full object-cover" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default LabsLibraries;
