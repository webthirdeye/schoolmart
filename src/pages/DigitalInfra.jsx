// src/pages/DigitalInfra.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop, Monitor, Wifi, Cpu, Globe, ArrowRight, ArrowUpRight, ShieldCheck, Zap, Download, Eye, FileText, CheckCircle2, Stars, ChevronDown } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import { handleProductClick } from '../utils/navigation';
import CatalogueCard from '../components/CatalogueCard';
import SidebarWidget from '../components/SidebarWidget';

const DigitalInfra = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('digital');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};

  // Priority 1: Auto-select first CMS category if available
  useEffect(() => {
    if (sidebarCategories.categories?.length && !selectedCat) {
      setSelectedCat(sidebarCategories.categories[0]);
    }
  }, [sidebarCategories]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts({ category: 'Digital Infra' }).then(res => {
      const fetchedItems = res || [];
      setItems(fetchedItems);
      const firstCat = sidebarCategories.categories?.[0] || 
                      (fetchedItems.length > 0 ? fetchedItems[0].subcategory : '');
      if (firstCat) setSelectedCat(firstCat);
    });
  }, [sidebarCategories]);

  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarTrending = blocks?.sidebar_trending || {};
  
  const cats = sidebarCategories.categories || [];
  // Only filter if we have items AND a selected category is set (prevents flicker)
  const filteredItems = items.filter(p => selectedCat && (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());





  const heroImgFallback = "/images/hero_digital.png";
  const darkBlock = heroBlock.darkBlock || { title: "Metric", subtitle: "99.9% Uptime Guaranteed." };

  
  return (
    <main className="min-h-screen bg-white pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* MODERN TECH HERO */}
        <section className="pt-6 pb-2 grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[360px]">
           <div className="lg:col-span-8 rounded-[30px] overflow-hidden relative shadow-lg group border border-gray-100 min-h-[300px] lg:h-full bg-gray-50">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img || heroImgFallback}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              {/* Branding Overlays */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-10 font-heading">
                 <div style={{ color: heroBlock.textColor || 'white' }}>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] block mb-3 opacity-80">{heroBlock.badge || "Network Infrastructure"}</span>
                    <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.9] tracking-tighter" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Campus <br/> Connectivity." }} />
                 </div>
                 <button className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl text-[12px] uppercase tracking-widest shadow-2xl hover:bg-sm-blue hover:text-white transition-all transform hover:translate-y-[-2px]">
                   {heroBlock.btnLabel || "System Audit"}
                 </button>
              </div>
           </div>

           <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex-grow bg-gray-50 rounded-[30px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[220px]">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-sm-blue/5 rounded-full blur-[80px] -mr-20 -mt-20" />
                 
                 <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[11px] uppercase tracking-[0.2em] mb-4 w-fit relative z-10 scale-90 origin-left">
                    <Zap size={14} className="inline mr-2" /> {heroBlock.badge || "Digital Transformation 2025"}
                 </div>
                 <h1 className="text-3xl lg:text-4xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'Future <br/> Digital.' }} />
                 <p className="text-gray-400 text-[12px] font-bold uppercase tracking-widest max-w-xs leading-relaxed relative z-10">
                    {heroBlock.subtitle || "Cutting-edge Ed-Tech and campus-wide smart infrastructure."}
                 </p>
              </div>

               <Link to={blocks?.action_strip?.downloadPath || '/catalogues'}
                 style={{ backgroundColor: blocks?.action_strip?.bgColor || '#0A0A0A' }}
                 className="rounded-[30px] p-6 text-white flex items-center justify-between group overflow-hidden relative border border-gray-800 shadow-xl transition-all hover:border-sm-blue/50">
                 <div className="flex flex-col gap-1 relative z-10">
                    <h3 style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[11px] font-black uppercase tracking-[0.3em]">
                        {blocks?.action_strip?.title || "Digital Campus 2025"}
                    </h3>
                    <span style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[13px] font-black uppercase tracking-tight font-heading">
                        {blocks?.action_strip?.subtitle || "SECURE INFRASTRUCTURE"}
                    </span>
                 </div>
                 </Link>
           </div>
        </section>

        {/* CATEGORY NAV & MAIN CONTENT GALLERY */}
        <section className="py-12 flex flex-col md:flex-row gap-10 items-start relative z-20">
            {/* LEFT SIDEBAR CATEGORY */}
            <div className="w-full md:w-64 shrink-0 space-y-6 sticky top-28">
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

              
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start scroll-mt-[200px] relative">
                 {filteredItems.map((work, i) => (
                    <CatalogueCard 
                      key={i}
                      work={work} 
                      onClick={() => handleProductClick(work, navigate, true)} 
                      themeColor="bg-sm-blue"
                      ringColor="ring-blue-500"
                      textColor="text-blue-400"
                    />
                 ))}
              </div>
           </div>
        </section>
      </div>
    </main>
  );
};

export default DigitalInfra;
