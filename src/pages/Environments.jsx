// src/pages/Environments.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wind, Sun, Leaf, ArrowUpRight, CheckCircle2, Layers, ShieldCheck, Microscope } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Sensory Hub 2025',
    titleHtml: 'Atmosphere <br/> <span class="text-[#004a8e] italic font-serif lowercase tracking-normal">is</span> <br/> Everything.',
    subtitle: 'Harmonizing architectural sensory design to stimulate deep academic performance.',
  },
  actionCard: {
    titleHtml: 'Request <br/> Environment Survey.',
    btnText: 'Apply Online',
  },
  heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  subBlocks: [
    { title: 'Eco Materials', subtitle: 'SUSTAINABLE', icon: 'Leaf' },
    { title: 'Sound Control', subtitle: 'ACOUSTICS', icon: 'Wind' },
    { title: 'Digital Lighting', subtitle: 'LUMENS V2', icon: 'Sun' },
  ],
  infoGrid: {
    titleHtml: 'Engineering <span class="text-[#004a8e]">Atmospheres.</span>',
    points: ['CFD Modeled', 'Acoustic Labs', 'UV Protected', 'Ergo Tech'],
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80',
  },
  masonryItems: [
    { t: 'Natural Light Study', c: 'Optics', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
    { t: 'Acoustic Panel Grid', c: 'Sound', img: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=600&q=80' },
    { t: 'Biophilic Design', c: 'Nature', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80' },
    { t: 'Air Quality Lab', c: 'Climate', img: 'https://images.unsplash.com/photo-1581093196277-9f608109ca46?w=800&q=80' },
    { t: 'Botanical Courtyard', c: 'Organic', img: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80' },
    { t: 'Zen Meditation Pod', c: 'Focus', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80' },
  ],
};

const ICONS = { Leaf, Wind, Sun, Layers };

const Environments = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('environments');
  
  const d = blocks?.environments_page_content || DEFAULT_CONTENT;
  const heroData = blocks?.environments_page_content || d.hero;
  const masonryItems = (d.masonryItems?.length ? d.masonryItems : DEFAULT_CONTENT.masonryItems);

  // Instant fallback rendering

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4">
        
        {/* HERO SECTION (COMPRESSED) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 mb-4 lg:mb-6">
           {/* TEXT BLOCK */}
           <div className="md:col-span-12 lg:col-span-5 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[300px] lg:min-h-[400px]">
              <div className="px-5 py-1.5 bg-gray-50 text-[#004a8e] font-black rounded-full text-[11px] uppercase tracking-[0.2em] mb-6 w-fit border border-gray-100">
                 <Sparkles size={14} className="inline mr-2" /> {heroData?.badge}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black font-heading leading-[0.9] mb-8 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: heroData?.titleHtml }} />
              <p className="text-gray-400 text-[12px] lg:text-[13px] font-bold uppercase tracking-widest max-w-sm leading-relaxed">
                 {heroData?.subtitle}
              </p>
           </div>

           {/* IMAGE BLOCK */}
           <div className="hidden lg:block lg:col-span-4 bg-gray-100 rounded-[40px] overflow-hidden border border-gray-100 shadow-sm h-full">
              <CMSMedia 
                mediaType={heroData?.mediaType} 
                mediaUrl={heroData?.mediaUrl} 
                fallbackImg={d.heroImage} 
                className="w-full h-full object-cover transition-all duration-1000"
              />
           </div>

           {/* ACTION CARD (LIGHT) */}
           <div className="md:col-span-6 lg:col-span-3 bg-[#004a8e] rounded-[40px] p-8 text-white flex flex-col justify-between shadow-lg">
              <span className="text-[12px] font-black uppercase tracking-[0.3em] opacity-60">Strategic Partner Service</span>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mt-10 mb-8" dangerouslySetInnerHTML={{ __html: d.actionCard?.titleHtml }} />
              <button 
                onClick={() => navigate('/registration')}
                className="w-full py-4 bg-white text-[#004a8e] font-black rounded-2xl text-[12px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
              >
                 {d.actionCard?.btnText}
              </button>
           </div>
           

        </section>

        {/* MASONRY DISPLAY (SMALLER CARDS) */}
        <section className="py-2 border-t border-gray-100 mt-4">
           <div className="flex items-center justify-between py-4 mb-4">
              <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-[0.2em] font-heading">Institutional Case Studies</h2>
              <div className="h-[1px] flex-grow mx-8 bg-gray-100" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                             {masonryItems.map((work, i) => (
                 <CatalogueCard 
                   key={i}
                   work={{ name: work.t, subcategory: work.c, image: work.img }} 
                   isSelected={selectedItem?.t === work.t} 
                   onClick={() => setSelectedItem(selectedItem?.t === work.t ? null : work)} 
                   onAction={() => navigate(`/environments/${work.t.toLowerCase().replace(/\s+/g, '-')}`)}
                   actionText="Read More"
                   themeColor="bg-[#004a8e]"
                   ringColor="ring-blue-100"
                   textColor="text-[#004a8e]"
                 />
              ))}
           </div>
        </section>

        {/* INFO GRID (COMPRESSED) */}
        <section className="py-10 border-t border-gray-100 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-[40px] p-8 lg:p-12 shadow-sm">
           <div className="lg:col-span-7">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading mb-8 leading-[0.9] uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: d.infoGrid?.titleHtml }} />
              <div className="grid grid-cols-2 gap-3">
                 {(d.infoGrid?.points || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[12px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-5 rounded-2xl hover:border-[#004a8e]/20 border border-transparent transition-all">
                       <CheckCircle2 size={16} className="text-[#004a8e]" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
            <div className="lg:col-span-5 rounded-[40px] overflow-hidden border border-gray-100 h-[300px] lg:h-[350px]">
               <img src={d.infoGrid?.img || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80"} alt="Consultation" className="w-full h-full object-cover transition-all duration-1000" />
            </div>
        </section>

      </div>
    </main>
  );
};

export default Environments;

