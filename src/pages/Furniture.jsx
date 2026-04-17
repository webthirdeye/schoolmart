// src/pages/Furniture.jsx
import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getProducts } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Sofa, GraduationCap, Library, FlaskConical, Building2, ArrowRight, Download, Filter, ChevronDown, CheckCircle2, Award, FileText, Stars } from 'lucide-react';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const Furniture = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('furniture');
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const sidebarCategories = blocks?.sidebar_categories || {};
  const actionStrip = blocks?.action_strip || {};

  useEffect(() => {
    getProducts({ category: 'Furniture' }).then(res => {
      setItems(res || []);
      const defaultCat = sidebarCategories.categories?.[0] || 'Desks';
      setSelectedCat(defaultCat);
    });
  }, [sidebarCategories]);
  
  const cats = sidebarCategories.categories || [];
  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());






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
              {/* Branding Overlays */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-10 font-heading">
                  <div style={{ color: heroBlock.textColor || 'white' }}>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] block mb-3 opacity-80">{heroBlock.badge || "Featured Series"}</span>
                    <h2 className="text-4xl lg:text-5xl font-black uppercase leading-[0.9] tracking-tighter" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || "Modular <br/> Classroom Pro." }} />
                  </div>
                  <button 
                    onClick={() => { if(heroBlock.ctaPath) window.location.href = heroBlock.ctaPath }}
                    className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl text-[12px] uppercase tracking-widest shadow-2xl hover:bg-sm-blue hover:text-white transition-all transform hover:translate-y-[-2px] active:translate-y-0"
                  >
                    {heroBlock.btnLabel || "Explore Series"}
                  </button>
              </div>
           </div>

           <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex-grow bg-gray-50 rounded-[40px] p-8 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[13px] uppercase tracking-[0.2em] mb-4 w-fit scale-90">
                    <Sofa size={12} className="inline mr-2" /> {heroBlock.badge || "2025 Collection"}
                 </div>
                 <h1 style={{ color: heroBlock.textColor || undefined }} className="text-4xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'School <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">Furniture</span> <br/> Solutions.' }} />
                  <p className="text-gray-400 text-[13px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                     {heroBlock.subtitle || "1200+ ergonomic products designed for inspiring spaces."}
                  </p>
               </div>

               <Link to={blocks?.action_strip?.downloadPath || '/catalogues'}
                 style={{ backgroundColor: blocks?.action_strip?.bgColor || '#111827' }}
                 className="rounded-[40px] p-8 text-white flex items-center justify-between group overflow-hidden relative border border-gray-800 shadow-2xl transition-transform hover:scale-[1.02]">
                    <div className="flex flex-col text-left">
                       <h3 style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[13px] font-black uppercase tracking-[0.2em] text-sm-blue">{blocks?.action_strip?.title || 'The 2025 Lookbook.'}</h3>
                       <span style={{ color: blocks?.action_strip?.textColor || undefined }} className="text-[13px] font-black opacity-40 uppercase tracking-widest font-heading">{blocks?.action_strip?.subtitle || 'MASTER CATALOGUE'}</span>
                    </div>
                 <span className="p-4 bg-sm-blue text-white rounded-full shadow-lg relative z-10 transition-all group-hover:bg-white group-hover:text-sm-blue">
                    <Download size={20} />
                 </span>
               </Link>
           </div>
        </section>

        {/* CATEGORY NAV & MAIN PRODUCT GRID */}
        <section className="py-8 flex flex-col md:flex-row gap-8 items-start">
            {/* LEFT SIDEBAR CATEGORY */}
            <div className="w-full md:w-64 shrink-0 space-y-6 sticky top-24">
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
                          className={`w-full text-left px-5 py-4 rounded-xl text-[13px] font-black uppercase tracking-[0.05em] transition-all flex items-center justify-between group ${selectedCat.toUpperCase() === c.toUpperCase() ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-800 hover:border-sm-blue hover:text-sm-blue hover:bg-blue-50/30'}`}
                        >
                           {c}
                           <ChevronDown size={14} className={`transition-transform ${selectedCat.toUpperCase() === c.toUpperCase() ? 'rotate-180' : 'opacity-20'}`} />
                        </button>
                     ))}
                  </div>
                </div>
           </div>

           {/* MAIN PRODUCT GRID */}
            <div className="flex-1 min-w-0">
              <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start scroll-mt-[200px] relative">
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
      </div>
    </main>
  );
};

export default Furniture;
