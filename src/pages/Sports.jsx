// src/pages/Sports.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Activity, Trophy, Shield, Target, ArrowRight, ArrowUpRight, Award, Layers, CheckCircle2, FileText, Stars, ChevronRight, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const Sports = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('sports');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};

  useEffect(() => {
    getProducts({ category: 'Sports' }).then(res => {
      setItems(res || []);
      const defaultCat = sidebarCategories.categories?.[0] || 'Track & Field';
      setSelectedCat(defaultCat);
    });
  }, [sidebarCategories]);

  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());






  return (
    <main className="min-h-screen bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
           {/* COLUMN 1 - STORY (SPAN 5) */}
           <div className="md:col-span-5 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                 <Zap size={12} className="inline mr-2" /> {heroBlock.badge || "Performance 2025"}
              </div>
              <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl lg:text-5xl font-black font-heading leading-[0.9] mb-4 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'Built <br/> <span class="text-sm-blue italic font-serif lowercase tracking-normal">for</span> <br/> Champions.' }} />
              <p className="text-gray-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest max-w-xs leading-loose">
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
                      <h3 className="text-[13px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed text-sm-blue" dangerouslySetInnerHTML={{ __html: (card.title || 'Schedule Site Survey.').replace(/\n/g, '<br/>') }} />
                      <ArrowUpRight className="self-end text-white/20 group-hover:text-sm-blue transition-colors" size={32} />
                    </>
                  ) : (
                    <>
                      <Shield className="text-emerald-300" size={24} />
                      <h3 className="text-[12px] font-black uppercase tracking-[0.1em] z-10 leading-relaxed text-emerald-600 group-hover:text-emerald-700" dangerouslySetInnerHTML={{ __html: (card.title || 'Safety Compliance Gold Certified.').replace(/\n/g, '<br/>') }} />
                    </>
                  )}
                </Link>
              ))}
           </div>
        </section>

         {/* SIDEBAR GALLERY LAYOUT */}
        <section className="py-8 border-t border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
            {/* LEFT SIDEBAR CATEGORY */}
            <div className="w-full lg:w-64 shrink-0 space-y-6 sticky top-24">
               {/* Relevant Sub-categories */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4">
                     <span className="w-1 h-4 bg-sm-blue rounded-full" />
                     <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">COLLECTIONS</h3>
                  </div>
                  <div className="flex flex-col gap-2 px-2">
                     {cats.map((c, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setSelectedCat(c); document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }); }} 
                          className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-black uppercase tracking-[0.05em] transition-all flex items-center justify-between group ${selectedCat.toUpperCase() === c.toUpperCase() ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-800 hover:border-sm-blue hover:text-sm-blue hover:bg-blue-50/30'}`}
                        >
                           {c}
                           <ChevronDown size={14} className={`transition-transform ${selectedCat.toUpperCase() === c.toUpperCase() ? 'rotate-180' : 'opacity-20'}`} />
                        </button>
                     ))}
                  </div>
               </div>
           </div>

           {/* MAIN CONTENT GALLERY */}
            <div className="flex-1 min-w-0">
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start scroll-mt-[200px]">
                 {filteredItems.map((work, i) => (
                    <CatalogueCard 
                      key={i}
                      work={work} 
                      onClick={() => {
                        if (work.ctaLink && (work.ctaLink.startsWith('http') || work.ctaLink.startsWith('www'))) {
                          window.open(work.ctaLink, '_blank');
                        } else {
                          navigate(`/product/${work.slug}`);
                        }
                      }} 
                      themeColor="bg-sm-blue"
                      ringColor="ring-blue-500"
                      textColor="text-blue-400"
                    />
                 ))}
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
              <p className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
                 {blocks?.info_split_grid?.description || 'Shock-absorption technology for elite safety and performance. Our surfaces are tested in professional athletic labs to ensure long-term durability.'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                 {(blocks?.info_split_grid?.points || ['FIBA Compliant', 'Anti-Skid', 'Heat Proof', '10 Yr Warranty']).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[12px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-sm-blue/20 transition-all">
                       <CheckCircle2 size={16} className="text-sm-blue" />
                       {typeof item === 'string' ? item : item.text}
                    </div>
                 ))}
              </div>
              {blocks?.info_split_grid?.ctaLabel && (
                <Link to={blocks.info_split_grid.ctaPath || '/registration'}
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-sm-blue text-white font-black rounded-full text-[12px] uppercase tracking-widest hover:bg-gray-900 transition-all">
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
