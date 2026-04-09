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
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  useEffect(() => {
    if (!loading && cats.length > 0 && !selectedCat) {
      setSelectedCat(cats[0]);
    }
  }, [loading, cats, selectedCat]);

  if (loading) return null;


  return (
    <main className="min-h-screen bg-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
           <div className="lg:col-span-7 rounded-[40px] overflow-hidden relative shadow-lg group border border-gray-100 min-h-[400px]">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80"} 
                className="w-full h-full object-cover transition-all duration-1000"
              />
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end backdrop-blur-md bg-white/10 p-6 rounded-[30px] border border-white/20">
                 <div>
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest block mb-2">{heroBlock.badge || "Featured Series"}</span>
                    <h2 className="text-2xl font-black text-white uppercase leading-none font-heading" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Modular <br/> Classroom Pro." }} />
                 </div>
                 <button className="px-6 py-2.5 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-widest shadow-xl">Explore Series</button>
              </div>
           </div>

           <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex-grow bg-gray-50 rounded-[40px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                    <Sofa size={12} className="inline mr-2" /> {heroBlock.badge || "2025 Collection"}
                 </div>
                 <h1 className="text-4xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'School <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">Furniture</span> <br/> Solutions.' }} />
                 <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                    {heroBlock.subtitle || "1200+ ergonomic products designed for inspiring spaces."}
                 </p>
              </div>

               <Link to={blocks?.action_strip?.downloadPath || '/catalogues'}
                 style={{ backgroundColor: blocks?.action_strip?.bgColor || '#111827' }}
                 className="rounded-[40px] p-8 text-white flex items-center justify-between group overflow-hidden relative border border-gray-800 shadow-2xl transition-transform hover:scale-[1.02]">
                 <div className="flex flex-col gap-2">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-sm-blue">{blocks?.action_strip?.title || 'The 2025 Lookbook.'}</h3>
                    <span className="text-[7px] font-black text-white/40 uppercase tracking-widest font-heading">{blocks?.action_strip?.subtitle || 'MASTER CATALOGUE'}</span>
                 </div>
                 <span className="p-4 bg-sm-blue text-white rounded-full shadow-lg relative z-10 transition-all group-hover:bg-white group-hover:text-sm-blue">
                    <Download size={20} />
                 </span>
               </Link>
           </div>
        </section>

        {/* CATEGORY NAV & MAIN PRODUCT GRID */}
        <section className="py-8 flex flex-col md:flex-row gap-8 items-start">
           {/* LEFT CATEGORY NAV */}
           <div className="w-full md:w-64 shrink-0 space-y-2 sticky top-24">
              <div className="flex items-center gap-3 mb-6 px-4">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">COLLECTIONS</h3>
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

           {/* MAIN PRODUCT GRID */}
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                   {selectedCat || 'CLASSROOM'} <span className="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Collection</span>
                 </h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredItems.length} Products</span>
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

              {/* FULL WIDTH SPACE PLANNING HUB */}
              <div className="mt-16 pt-16 border-t border-gray-100">
                 <div 
                   className="rounded-[40px] bg-white p-8 lg:p-16 text-gray-900 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-sm border border-gray-100 min-h-[300px]"
                 >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sm-blue/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                    
                    <div className="relative z-10 max-w-2xl text-center md:text-left">
                       <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                          <Building2 size={32} className="text-sm-blue" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Infrastructure Support</span>
                       </div>
                       <h4 className="text-4xl lg:text-5xl font-black font-heading tracking-tighter uppercase leading-[0.9] mb-6">
                          {blocks?.feature_card?.title || "Space Planning Hub."}
                       </h4>
                       <p className="text-gray-400 text-xs lg:text-sm font-bold uppercase tracking-widest leading-loose max-w-lg">
                          {blocks?.feature_card?.subtitle || "Free Layout Design & Mockup Services. Get professional campus architecture audits and master planning."}
                       </p>
                    </div>

                    <div className="mt-10 md:mt-0 relative z-10">
                       <Link 
                         to={blocks?.feature_card?.btnPath || '/registration'}
                         className="px-10 py-5 bg-sm-blue text-white font-black rounded-full hover:bg-gray-900 transition-all text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 group"
                       >
                         {blocks?.feature_card?.btnLabel || "Request Pitch"}
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Furniture;
