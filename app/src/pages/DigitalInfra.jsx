// src/pages/DigitalInfra.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Laptop, Monitor, Wifi, Cpu, Globe, ArrowRight, ArrowUpRight, ShieldCheck, Zap, Download, Eye, FileText, CheckCircle2, Stars } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const DigitalInfra = () => {
  const { blocks, loading } = useCMSPage('digital');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getProducts({ category: 'Digital Infrastructure' }).then(res => {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Digital Infrastructure...</div>;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* MODERN TECH HERO */}
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
           <div className="md:col-span-4 bg-[#0A0A0A] rounded-[25px] p-8 text-white flex flex-col justify-center border border-gray-800 shadow-xl relative overflow-hidden group min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000 brightness-50"
              />
              <div className="absolute top-0 right-0 w-48 h-48 bg-sm-blue/20 rounded-full blur-[80px] -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Zap size={12} className="inline mr-2" /> {heroBlock.badge || "Digital Transformation 2025"}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black font-heading leading-tight mb-4 tracking-tighter uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Future <br/> <span className=\"text-sm-blue italic font-serif lowercase tracking-normal\">is</span> <br/> Digital." }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose relative z-10">
                 {heroBlock.subtitle || "Deploying cutting-edge Ed-Tech and campus-wide smart infrastructure."}
              </p>
           </div>
           
           <div className="md:col-span-8 rounded-[25px] overflow-hidden relative shadow-lg group border border-gray-100 min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=1200&q=80"}
                className="w-full h-full object-cover brightness-90 transition-all duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-all" />
              <div className="absolute bottom-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white max-w-md hidden lg:block">
                 <p className="text-[11px] font-black uppercase tracking-widest mb-2 opacity-60">Success Metric</p>
                 <h3 className="text-xl font-black uppercase tracking-tighter">99.9% Uptime Deployment Guaranteed.</h3>
              </div>
           </div>
        </section>

        {/* SIDEBAR GRID LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-8">
           <aside className="lg:w-[240px] flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                 <div className="mb-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">ED-TECH CORE</h3>
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
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">SMART <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Hardware</span></h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enterprise Class: 300+ Deployments</span>
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
                   className="rounded-[30px] p-8 text-white flex flex-col justify-center min-h-[300px] relative overflow-hidden group shadow-lg border border-white/5"
                 >
                    <Laptop size={32} style={{ color: blocks?.feature_card?.btnColor || '#3B82F6' }} className="mb-6 border border-white/10 p-2 w-12 h-12 rounded-xl" />
                    <h4 className="text-xl font-black font-heading mb-4 uppercase leading-none tracking-tighter">
                       {blocks?.feature_card?.title || "Campus Audit Pro."}
                    </h4>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-6 leading-relaxed">
                       {blocks?.feature_card?.subtitle || "Infrastructure Security & Performance."}
                    </p>
                    <Link 
                      to={blocks?.feature_card?.btnPath || '#'}
                      style={{ backgroundColor: blocks?.feature_card?.btnColor || '#3B82F6' }}
                      className="px-6 py-2.5 text-white font-black rounded-full text-[8px] uppercase tracking-widest w-fit hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-blue-500/10 z-10"
                    >
                      {blocks?.feature_card?.btnLabel || "Request Site Visit"}
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default DigitalInfra;
