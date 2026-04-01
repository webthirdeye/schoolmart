// src/pages/Furniture.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Sofa, GraduationCap, Library, FlaskConical, Building2, ArrowRight, Download, Filter, ChevronDown, CheckCircle2, Award, FileText, Stars } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const Furniture = () => {
  const { blocks, loading } = useCMSPage('furniture');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Furniture' }).then(res => {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Furniture...</div>;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-7 rounded-[25px] overflow-hidden relative shadow-lg group border border-gray-100 min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80"} 
                className="w-full h-full object-cover brightness-90 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-sm-blue/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end backdrop-blur-md bg-white/10 p-6 rounded-[20px] border border-white/20">
                 <div>
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest block mb-2">{heroBlock.badge || "Featured Series"}</span>
                    <h2 className="text-2xl font-black text-white uppercase leading-none font-heading" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Modular <br/> Classroom Pro." }} />
                 </div>
                 <button className="px-6 py-2.5 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-widest shadow-xl">Explore Series</button>
              </div>
           </div>

           <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex-grow bg-gray-50 rounded-[25px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                    <Sofa size={12} className="inline mr-2" /> {heroBlock.badge || "2025 Collection"}
                 </div>
                 <h1 className="text-4xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'School <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">Furniture</span> <br/> Solutions.' }} />
                 <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                    {heroBlock.subtitle || "1200+ ergonomic products designed for inspiring spaces."}
                 </p>
              </div>

              <div className="bg-gray-900 rounded-[25px] p-8 text-white flex items-center justify-between group overflow-hidden relative border border-gray-800 shadow-2xl transition-transform hover:scale-[1.02]">
                 <div className="flex flex-col gap-2">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-sm-blue">The 2025 Lookbook.</h3>
                    <span className="text-[7px] font-black text-white/40 uppercase tracking-widest font-heading">MASTER CATALOGUE</span>
                 </div>
                 <button className="p-4 bg-sm-blue text-white rounded-full shadow-lg relative z-10 transition-all hover:bg-white hover:text-sm-blue">
                    <Download size={20} />
                 </button>
              </div>
           </div>
        </section>

        {/* MAIN PRODUCT GRID */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">CATEGORIES</h3>
                    <div className="w-8 h-1 bg-sm-blue rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCat === cat ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>{cat}</button>
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

           <div className="flex-grow">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">CLASSROOM <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Collection</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing 1-6 of 120 Products</span>
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
                 
                 <div 
                   style={{ backgroundColor: (blocks?.feature_card?.bgColor || '#111827') }}
                   className="rounded-[30px] p-8 text-white flex flex-col justify-center min-h-[350px] relative overflow-hidden group shadow-lg border border-white/5"
                 >
                    <Building2 size={32} style={{ color: blocks?.feature_card?.btnColor || '#3B82F6' }} className="mb-4" />
                    <h4 className="text-xl font-black font-heading tracking-tighter uppercase leading-none mb-4">
                       {blocks?.feature_card?.title || "Space Planning Hub."}
                    </h4>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-6 leading-relaxed">
                       {blocks?.feature_card?.subtitle || "Free Layout Design & Mockup Services."}
                    </p>
                    <Link 
                      to={blocks?.feature_card?.btnPath || '#'}
                      style={{ backgroundColor: blocks?.feature_card?.btnColor || '#3B82F6' }}
                      className="px-5 py-2.5 text-white font-black rounded-full hover:bg-white hover:text-gray-900 transition-all text-[8px] tracking-widest w-fit z-10"
                    >
                      {blocks?.feature_card?.btnLabel || "Request Pitch"}
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Furniture;
