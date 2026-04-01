// src/pages/Libraries.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { BookOpen, Library, GraduationCap, Users, Bookmark, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const Libraries = () => {
  const { blocks, loading } = useCMSPage('libraries');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Libraries' }).then(res => {
      setItems(res || []);
    });
  }, []);

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const featureCard = blocks?.feature_card || { 
    title: "Optimizing Flow & Acoustics.", 
    bgColor: "#1A1A1A", 
    btnColor: "#0066CC", 
    btnPath: "#" 
  };
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  useEffect(() => {
    if (!loading && cats.length > 0 && !selectedCat) {
      setSelectedCat(cats[0]);
    }
  }, [loading, cats, selectedCat]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Libraries...</div>;


  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
           <div className="md:col-span-8 bg-white rounded-[25px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-64 h-64 bg-sm-blue/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="px-3 py-1 bg-gray-900 text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Bookmark size={12} className="inline mr-2" /> {heroBlock.badge || "Modern Library Concepts 2025"}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Read <br/> <span className=\"text-sm-blue italic font-serif lowercase tracking-normal\">and</span> <br/> Reflect." }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                 {heroBlock.subtitle || "Transforming traditional book repositories into collaborative, tech-enabled social learning hubs."}
              </p>
           </div>
           
           <div className="md:col-span-4 flex flex-col gap-3">
              <div className="flex-grow bg-sm-blue rounded-[25px] overflow-hidden relative shadow-lg group border border-blue-400">
                 <CMSMedia 
                    mediaType={heroBlock.mediaType} 
                    mediaUrl={heroBlock.mediaUrl} 
                    fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80"}
                    className="w-full h-full object-cover brightness-90 transition-all duration-700 hover:scale-110 opacity-60 group-hover:opacity-100"
                 />
                 <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-all" />
              </div>
              <div 
                style={{ backgroundColor: featureCard.bgColor || '#1A1A1A' }}
                className="rounded-[25px] p-6 text-white flex flex-col justify-between group overflow-hidden relative border border-white/5 shadow-2xl transition-transform hover:scale-[1.02] min-h-[160px]"
              >
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                   {featureCard.title || "Optimizing Flow & Acoustics."}
                 </h3>
                 <Link 
                   to={featureCard.btnPath || '#'}
                   style={{ backgroundColor: featureCard.btnColor || '#0057A8' }}
                   className="p-3 text-white rounded-full self-end mt-4 shadow-xl active:scale-95 z-10"
                 >
                   <ArrowUpRight size={20} />
                 </Link>
              </div>
           </div>
        </section>

        {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">LIBRARY HUB</h3>
                    <div className="w-8 h-1 bg-sm-blue rounded-full" />
                 </div>
                 {cats.map((cat, i) => (
                    <button key={i} onClick={() => setSelectedCat(cat)} className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCat === cat ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-900'}`}>{cat}</button>
                 ))}
                 
                 <div className="mt-12 p-6 bg-white rounded-[25px] border border-gray-200 shadow-sm relative group">
                    <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 block">Design Standard</span>
                    <div className="flex items-center gap-2 mb-4">
                       <CheckCircle2 size={12} className="text-sm-blue" />
                       <span className="text-[9px] font-black uppercase text-gray-900">Quiet Zone Certified</span>
                    </div>
                    <button className="w-full py-2 bg-gray-50 hover:bg-sm-blue hover:text-white rounded-full text-[7px] font-black uppercase tracking-widest transition-all">Request Lookbook</button>
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
           </aside>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-grow">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">BEYOND <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Shelving</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Innovative Spaces: 150+ Designs</span>
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
              </div>
           </div>
        </section>

        {/* INFO SPLIT GRID */}
        <section className="py-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
           <div className="bg-white p-12 rounded-[30px] border border-gray-100 shadow-sm relative group overflow-hidden">
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter">Bespoke <br/> <span className="text-sm-blue">Planning Hub.</span></h2>
              <div className="grid grid-cols-2 gap-3">
                 {['Free Layout Design', 'Mockup Samples', 'Acoustic Studies', 'NEP Ready'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-4 rounded-xl border border-gray-50 hover:bg-sm-blue hover:text-white transition-all">
                       <CheckCircle2 size={14} className="text-sm-blue group-hover:text-white" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="rounded-[30px] overflow-hidden shadow-2xl h-[400px]">
              <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&q=80" alt="Planning" className="w-full h-full object-cover" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Libraries;
