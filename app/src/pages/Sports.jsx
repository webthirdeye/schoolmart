// src/pages/Sports.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { Zap, Activity, Trophy, Shield, Target, ArrowRight, ArrowUpRight, Award, Layers, CheckCircle2, FileText, Stars, ChevronRight } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

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
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  useEffect(() => {
    if (!loading && cats.length > 0 && !selectedCat) {
      setSelectedCat(cats[0]);
    }
  }, [loading, cats, selectedCat]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-black tracking-widest uppercase">Loading Sports Infrastructure...</div>;


  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
           {/* COLUMN 1 - STORY (SPAN 5) */}
           <div className="md:col-span-5 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                 <Zap size={12} className="inline mr-2" /> {heroBlock.badge || "Performance 2025"}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black font-heading leading-[0.9] mb-4 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'Built <br/> <span class="text-sm-blue italic font-serif lowercase tracking-normal">for</span> <br/> Champions.' }} />
              <p className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                 {heroBlock.subtitle || "Engineering high-performance athletic surfaces for the next generation of athletes."}
              </p>
           </div>

           <div className="md:col-span-4 rounded-[40px] overflow-hidden relative shadow-lg group border border-gray-100">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
              />
           </div>

           {/* COLUMN 3 - ACTION STACK (SPAN 3) */}
           <div className="md:col-span-3 flex flex-col gap-4">
              {(blocks?.action_stack?.cards || [
                { title: 'Schedule \n Site Survey.', bgColor: '#111827' },
                { title: 'Safety Compliance \n Gold Certified.', bgColor: '#ECFDF5' }
              ]).map((card, i) => (
                <Link key={i} to={card.link || '/contact-us'}
                  style={{ backgroundColor: card.bgColor || (i === 0 ? '#111827' : '#ECFDF5') }}
                  className={`flex-1 rounded-[40px] p-8 flex flex-col justify-between group overflow-hidden relative shadow-sm border ${i === 0 ? 'border-gray-800 shadow-2xl' : 'border-gray-100'}`}>
                  {i === 0 ? (
                    <>
                      <h3 className="text-[12px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed text-sm-blue" dangerouslySetInnerHTML={{ __html: (card.title || 'Schedule Site Survey.').replace(/\n/g, '<br/>') }} />
                      <ArrowUpRight className="self-end text-white/20 group-hover:text-sm-blue transition-colors" size={32} />
                    </>
                  ) : (
                    <>
                      <Shield className="text-emerald-300" size={24} />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.1em] z-10 leading-relaxed text-emerald-600 group-hover:text-emerald-700" dangerouslySetInnerHTML={{ __html: (card.title || 'Safety Compliance Gold Certified.').replace(/\n/g, '<br/>') }} />
                    </>
                  )}
                </Link>
              ))}
           </div>
        </section>

         {/* SIDEBAR GALLERY LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
           {/* LEFT SIDEBAR CATEGORY */}
           <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
              <div className="mb-6 px-4">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-4">ARENA MODULES</h3>
                 <div className="w-8 h-1 bg-sm-blue rounded-full" />
              </div>
              {cats.map((cat, i) => (
                 <button 
                   key={i} 
                   onClick={() => { setSelectedCat(cat); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                   className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCat === cat ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                 >
                   {cat}
                   <ChevronRight size={14} className={`transition-transform ${selectedCat === cat ? 'rotate-[-90deg]' : 'opacity-0 group-hover:opacity-100'}`} />
                 </button>
              ))}
           </div>

           {/* MAIN CONTENT GALLERY */}
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-8 px-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.grid_heading?.leftHtml || 'ELITE <span class="text-sm-blue italic font-serif lowercase tracking-normal text-lg ml-2">Surfaces</span>' }} />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blocks?.grid_heading?.rightStat || '1,200+ Fields Installed'}</span>
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

              {/* FULL WIDTH ARENA HUB */}
              <div className="mt-16 pt-16 border-t border-gray-100">
                 <div 
                     className="rounded-[40px] p-8 lg:p-16 bg-white text-gray-900 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-sm border border-gray-100 min-h-[300px]"
                   >
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sm-blue/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                     
                     <div className="relative z-10 max-w-2xl text-center md:text-left">
                        <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                           <Trophy size={32} className="text-sm-blue" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Performance Support</span>
                        </div>
                        <h4 className="text-4xl lg:text-5xl font-black font-heading tracking-tighter uppercase leading-[0.9] mb-6">
                           {blocks?.feature_card?.title || 'Arena Audit Pro.'}
                        </h4>
                        <p className="text-gray-400 text-xs lg:text-sm font-bold uppercase tracking-widest leading-loose max-w-lg">
                           {blocks?.feature_card?.subtitle || 'Professional arena audits and turf specification planning. Get your institutional sports grounds ready for championship-level performance.'}
                        </p>
                     </div>

                     <div className="mt-10 md:mt-0 relative z-10">
                        <Link 
                          to={blocks?.feature_card?.btnPath || '/registration'}
                          style={{ backgroundColor: blocks?.feature_card?.btnColor || '#3B82F6' }}
                          className="px-10 py-5 text-white font-black rounded-full hover:bg-white hover:text-gray-900 transition-all text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 group"
                        >
                          {blocks?.feature_card?.btnLabel || 'Request Site Audit'}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </div>
              </div>
           </div>
        </section>

        {/* INFO SPLIT GRID - COMPACT */}
        <section className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-gray-100 mt-6 pt-12">
           <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-[400px] border border-gray-100">
              <img src={blocks?.info_split_grid?.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&q=80'} alt="Athletic" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
           </div>
            
           <div className="bg-white p-12 lg:p-16 rounded-[40px] shadow-sm border border-gray-100">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading mb-8 leading-[0.9] uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.info_split_grid?.heading || 'High <span class="text-sm-blue italic font-serif lowercase tracking-normal">Impact</span> Performance.' }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
                 {blocks?.info_split_grid?.description || 'Shock-absorption technology for elite safety and performance. Our surfaces are tested in professional athletic labs to ensure long-term durability.'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                 {(blocks?.info_split_grid?.points || ['FIBA Compliant', 'Anti-Skid', 'Heat Proof', '10 Yr Warranty']).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-sm-blue/20 transition-all">
                       <CheckCircle2 size={16} className="text-sm-blue" />
                       {typeof item === 'string' ? item : item.text}
                    </div>
                 ))}
              </div>
              {blocks?.info_split_grid?.ctaLabel && (
                <Link to={blocks.info_split_grid.ctaPath || '/registration'}
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-sm-blue text-white font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all">
                  {blocks.info_split_grid.ctaLabel} <ArrowRight size={14} />
                </Link>
              )}
           </div>
        </section>
      </div>
    </main>
  );
};

export default Sports;
