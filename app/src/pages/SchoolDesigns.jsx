// src/pages/SchoolDesigns.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Layout, Palette, Pencil, Ruler, Layers, Building, ArrowRight, ArrowUpRight, Download, Eye, FileText, CheckCircle2, Stars, Compass, Lightbulb, ChevronDown } from 'lucide-react';
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

  if (loading) return null;


  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* MODERN BESPOKE HERO - COMPACT PACKED */}
        <section className="pt-4 pb-6 flex flex-col lg:flex-row gap-4 items-stretch">
           {/* TEXT BLOCK - LEFT */}
           <div className="flex-1 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
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
              <h1 className="text-4xl md:text-6xl font-black font-heading leading-[0.9] mb-6 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Imagine <br/> <span class=\"text-sm-blue italic font-serif lowercase tracking-normal\">the</span> <br/> Infinite." }} />
              <p className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest max-w-xs leading-loose relative z-10">
                 {heroBlock.subtitle || "We create non-linear, adaptive spaces where students explore, discover, and flourish."}
              </p>
           </div>

           {/* FEATURE BLOCKS - RIGHT */}
           <div className="lg:w-[450px] grid grid-cols-2 lg:grid-cols-1 gap-4">
              {(blocks?.feature_blocks?.blocks || [
                { title: 'Curated \n Kindergarten \n Design.', bgColor: '#0057A8', textColor: '#FFFFFF' },
                { title: 'Execution \n Portfolio \n Excellence.', subtitle: '2020-2025', bgColor: '#FACC15', textColor: '#111827' }
              ]).map((fb, i) => (
                <div key={i} style={{ backgroundColor: fb.bgColor || '#0057A8', color: fb.textColor || '#fff' }} className="rounded-[40px] p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed" dangerouslySetInnerHTML={{ __html: (fb.title || '').replace(/\n/g, '<br/>') }} />
                   {fb.subtitle ? (
                     <div className="flex items-center justify-between mt-4">
                       <span className="text-[7px] font-black uppercase tracking-widest opacity-40">{fb.subtitle}</span>
                       <ArrowRight className="opacity-30 group-hover:opacity-100 transition-colors relative z-10" size={24} />
                     </div>
                   ) : (
                     <ArrowUpRight className="self-end opacity-50 group-hover:opacity-100 transition-colors relative z-10" size={24} />
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* CATEGORY NAV & MAIN CONTENT GALLERY */}
        <section className="py-8 border-t border-gray-100 flex flex-col md:flex-row gap-8 items-start">
           {/* LEFT CATEGORY NAV */}
           <div className="w-full md:w-64 shrink-0 space-y-2 sticky top-24">
              <div className="flex items-center gap-3 mb-6 px-4">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">DESIGN MODULES</h3>
                 <div className="h-0.5 flex-grow bg-gray-100 rounded-full" />
              </div>
              {cats.map((cat, i) => (
                 <button 
                   key={i} 
                   onClick={() => { setSelectedCat(cat); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                   className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCat === cat ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                 >
                   {cat}
                   <ChevronDown size={14} className={`transition-transform ${selectedCat === cat ? 'rotate-[-90deg]' : 'opacity-0 group-hover:opacity-100'}`} />
                 </button>
              ))}
           </div>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.grid_heading?.leftHtml || `${selectedCat || 'COLOR'} <span class="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Psychology</span>` }} />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blocks?.grid_heading?.rightStat || 'Case Studies: 450+ Sites'}</span>
              </div>
              
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
                       {selectedItem?.name === work.name && (
                          <div className="md:hidden col-span-full">
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          </div>
                       )}
                       
                       {/* Tablet (2 cols) */}
                       {(i % 2 === 1 || i === filteredItems.length - 1) && 
                         filteredItems.slice(Math.floor(i/2)*2, i+1).some(dw => dw.name === selectedItem?.name) && (
                          <div className="hidden md:block lg:hidden col-span-full">
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          </div>
                       )}

                       {/* Desktop (3 cols) */}
                       {(i % 3 === 2 || i === filteredItems.length - 1) && 
                         filteredItems.slice(Math.floor(i/3)*3, i+1).some(dw => dw.name === selectedItem?.name) && (
                          <div className="hidden lg:block col-span-full">
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          </div>
                       )}
                    </React.Fragment>
                 ))}
              </div>

              {/* FULL WIDTH DESIGN AUDIT HUB */}
              <div className="mt-16 pt-16 border-t border-gray-100">
                 <div 
                     className="rounded-[40px] p-8 lg:p-16 bg-white text-gray-900 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-sm border border-gray-100 min-h-[300px]"
                   >
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sm-blue/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                     
                     <div className="relative z-10 max-w-2xl text-center md:text-left">
                        <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                           <Layout size={32} className="text-sm-blue" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Design Support</span>
                        </div>
                        <h4 className="text-4xl lg:text-5xl font-black font-heading tracking-tighter uppercase leading-[0.9] mb-6">
                           {blocks?.feature_card?.title || 'Bespoke Space Design.'}
                        </h4>
                        <p className="text-gray-400 text-xs lg:text-sm font-bold uppercase tracking-widest leading-loose max-w-lg">
                           {blocks?.feature_card?.subtitle || 'Request a custom pitch for your institutional project. We specialize in non-linear architecture and psychological color mapping.'}
                        </p>
                     </div>

                    <div className="mt-10 md:mt-0 relative z-10">
                       <Link 
                         to={blocks?.feature_card?.btnPath || '/registration'}
                         className="px-10 py-5 bg-gray-900 text-white font-black rounded-full hover:bg-sm-blue transition-all text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 group"
                       >
                         {blocks?.feature_card?.btnLabel || 'Request Design Pitch'}
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* INFORMATIONAL BLOCK */}
        <section className="py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center border-t border-gray-100 mt-6 pt-12">
           <div className="order-2 lg:order-1 relative">
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sm-blue rounded-full blur-[80px] opacity-10" />
              <div className="bg-white p-10 lg:p-14 rounded-[40px] shadow-sm border border-gray-100 relative z-10">
                 <div className="w-16 h-1.5 bg-sm-blue rounded-full mb-8" />
                 <h2 className="text-3xl font-black text-gray-900 font-heading mb-6 leading-tight tracking-tighter uppercase" dangerouslySetInnerHTML={{ __html: blocks?.info_split_grid?.heading || 'Psychology <br/> of <span class="text-sm-blue">Colors.</span>' }} />
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
                    {blocks?.info_split_grid?.description || 'We engineer moods. From focus-inducing blues to creativity-sparking yellows. Our team uses academic research to map institutional zones.'}
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    {(blocks?.info_split_grid?.points || ['200+ Palettes', 'UV Resistant', 'Odourless', 'Texture Ready']).map((item, i) => (
                       <div key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-3.5 rounded-xl group hover:bg-gray-900 hover:text-white transition-all">
                          <Layers size={14} className="text-sm-blue group-hover:text-white" />
                          {typeof item === 'string' ? item : item.text}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
           <div className="order-1 lg:order-2">
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-1000">
                  <img src={blocks?.info_split_grid?.image || 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=1000&q=80'} alt="Atmosphere" className="w-full h-[400px] object-cover" />
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default SchoolDesigns;
