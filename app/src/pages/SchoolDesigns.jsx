// src/pages/SchoolDesigns.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Layout, Palette, Pencil, Ruler, Layers, Building, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, Compass, Lightbulb } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const SchoolDesigns = () => {
  const { blocks, loading } = useCMSPage('design');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'School Designs' }).then(res => {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading School Designs...</div>;


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
              <div className="px-3 py-1 bg-gray-900 text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-6 w-fit scale-90 relative z-10">
                 <Stars size={12} className="inline mr-2" /> {heroBlock.badge || "Design Studio 2024"}
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-heading leading-none mb-6 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Imagine <br/> <span className=\"text-sm-blue italic font-serif lowercase tracking-normal\">the</span> <br/> Infinite." }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose relative z-10">
                 {heroBlock.subtitle || "We create non-linear, adaptive spaces where students explore, discover, and flourish."}
              </p>
           </div>

           {/* FEATURE BLOCKS - RIGHT */}
           <div className="lg:w-[450px] grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-sm-blue rounded-[30px] p-8 text-white flex flex-col justify-between group overflow-hidden relative shadow-lg">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed">Curated <br/> Kindergarten <br/> Design.</h3>
                 <ArrowUpRight className="self-end text-white/50 group-hover:text-white transition-colors relative z-10" size={24} />
              </div>
              <div className="bg-yellow-400 rounded-[30px] p-8 text-gray-900 flex flex-col justify-between group overflow-hidden relative shadow-lg">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed">Execution <br/> Portfolio <br/> Excellence.</h3>
                 <ArrowRight className="self-end text-gray-900/30 group-hover:text-gray-900 transition-colors relative z-10" size={24} />
              </div>
           </div>
        </section>

        {/* SIDEBAR GALLERY LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           {/* LEFT SIDEBAR CATEGORY */}
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">DESIGN MODULES</h3>
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
           </aside>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-grow">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">COLOR <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Psychology</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Case Studies: 450+ Sites</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
                       
                       {/* Mobile Inline Expansion */}
                       <div className="md:hidden col-span-full">
                          {selectedItem?.name === work.name && (
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          )}
                       </div>

                       {/* Tablet Inline Expansion */}
                       {i % 2 === 1 && (
                          <div className="hidden md:block lg:hidden col-span-full">
                             {filteredItems.slice(i-1, i+1).some(dw => dw.name === selectedItem?.name) && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                       )}

                       {/* Desktop Inline Expansion */}
                       {i % 3 === 2 && (
                          <div className="hidden lg:block col-span-full">
                             {filteredItems.slice(i-2, i+1).some(dw => dw.name === selectedItem?.name) && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                       )}

                       {/* Handle end of list for expansions */}
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
                 
                 <div className="bg-gray-900 rounded-[30px] p-8 text-white flex flex-col justify-center min-h-[300px] relative overflow-hidden group shadow-lg">
                    <Layout size={32} className="text-sm-blue mb-6" />
                    <h4 className="text-xl font-black font-heading mb-4 uppercase leading-none tracking-tighter">Bespoke <br/> Space Design.</h4>
                    <button className="px-6 py-2 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-widest w-fit hover:bg-white hover:text-gray-900 transition-all">Request Pitch</button>
                 </div>
              </div>
           </div>
        </section>

        {/* INFORMATIONAL BLOCK */}
        <section className="py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center border-t border-gray-100 mt-6 pt-12">
           <div className="order-2 lg:order-1 relative">
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sm-blue rounded-full blur-[80px] opacity-10" />
              <div className="bg-white p-10 lg:p-14 rounded-[40px] shadow-3xl border border-gray-300 relative z-10">
                 <div className="w-16 h-1.5 bg-sm-blue rounded-full mb-8" />
                 <h2 className="text-3xl font-black text-gray-900 font-heading mb-6 leading-tight tracking-tighter uppercase">Psychology <br/> of <span className="text-sm-blue">Colors.</span></h2>
                 <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
                    We engineer moods. From focus-inducing blues to creativity-sparking yellows.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    {['200+ Palettes', 'UV Resistant', 'Odourless', 'Texture Ready'].map((item, i) => (
                       <div key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-3.5 rounded-xl group hover:bg-gray-900 hover:text-white transition-all">
                          <Layers size={14} className="text-sm-blue group-hover:text-white" />
                          {item}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
           <div className="order-1 lg:order-2">
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-1000">
                 <img src="https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=1000&q=80" alt="Atmosphere" className="w-full h-[400px] object-cover" />
                 <div className="absolute inset-0 bg-blue-900/10 backdrop-contrast-125" />
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default SchoolDesigns;
