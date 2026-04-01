// src/pages/Guides.jsx
import React, { useState } from 'react';
import { BookOpen, Award, Shield, Layers, ArrowUpRight } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Knowledge Base 2025',
    titleHtml: 'Strategy. <br/> <span class="text-sm-blue italic font-serif lowercase tracking-normal">for</span> <br/> Compliance.',
    subtitle: 'Deep-dive into our institutional strategy handbooks and regulatory frameworks.',
  },
  actionStrip: [
    { titleHtml: 'NEP 2024 <br/> Implementation Kit.', btnText: 'Download PDF', color: 'dark' },
    { titleHtml: 'Certification <br/> & <br/> Standards BIFMA.', color: 'light', icon: 'Award' },
    { titleHtml: 'Custom <br/> Institutional Portfolio.', btnText: 'Request Curation', color: 'light' },
  ],
  menuStrip: ['NEP 2020', 'SAFETY PROTOCOL', 'TECH SPECS', 'CERTIFICATIONS', 'SITE PLANNING'],
  resourceList: [
    { t: 'Safety Master-Guide', c: 'Logistics', img: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=600&q=80', h: 'h-[300px]' },
    { t: 'Spatial Planning', c: 'Design', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80', h: 'h-[400px]' },
    { t: 'Color Psychology', c: 'Interiors', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', h: 'h-[350px]' },
  ],
  infoGrid: {
    titleHtml: 'Regulatory <span class="text-sm-blue">Frameworks.</span>',
    points: ['NEA Guidelines', 'Site Surveys', 'Compliance Audit', 'Future Ready'],
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80'
  }
};

const ICONS = { Award, BookOpen, Shield, Layers };

const Guides = () => {
  const { blocks, loading } = useCMSPage('guides');
  const [selectedItem, setSelectedItem] = useState(null);
  const d = blocks?.guides_page_content || DEFAULT_CONTENT;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sm-blue"></div></div>;

  return (
    <main className="min-h-screen bg-white pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-12 flex flex-col gap-6">
           {/* LARGE WIDE STORY BLOCK */}
           <div className="bg-gray-50 rounded-[30px] p-12 lg:p-20 flex flex-col items-center text-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px] justify-center">
              <CMSMedia 
                mediaType={d.hero?.mediaType} 
                mediaUrl={d.hero?.mediaUrl} 
                fallbackImg={null} 
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-all duration-1000"
              />
              <div className="px-4 py-1.5 bg-sm-blue text-white font-black rounded-full text-[10px] uppercase tracking-[0.2em] mb-8 w-fit shadow-xl shadow-blue-500/20 relative z-10">
                 <BookOpen size={14} className="inline mr-2" /> {d.hero?.badge}
              </div>
              <h1 className="text-4xl lg:text-7xl font-black font-heading leading-tight mb-8 tracking-tighter text-gray-900 uppercase max-w-3xl relative z-10" dangerouslySetInnerHTML={{ __html: d.hero?.titleHtml }} />
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest max-w-md leading-loose relative z-10">
                 {d.hero?.subtitle}
              </p>
           </div>

           {/* HORIZONTAL ACTION STRIP */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(d.actionStrip || []).map((card, i) => {
                const isDark = card.color === 'dark';
                const Icon = ICONS[card.icon];
                return (
                  <div key={i} className={`${isDark ? 'bg-gray-900 text-white shadow-2xl' : 'bg-white border-gray-100 hover:border-sm-blue shadow-sm'} rounded-[30px] p-10 flex flex-col justify-between group overflow-hidden relative border transition-all hover:scale-[1.02] min-h-[220px]`}>
                     <h3 className={`text-[12px] font-black uppercase tracking-[0.2em] relative z-10 leading-relaxed ${isDark ? 'text-sm-blue' : 'text-gray-400 group-hover:text-sm-blue'}`} dangerouslySetInnerHTML={{ __html: card.titleHtml }} />
                     <div className="flex items-center justify-between mt-auto pt-6">
                        {card.btnText && <button className={`px-6 py-3 font-black rounded-full text-[9px] uppercase tracking-widest w-fit transition-all ${isDark ? 'bg-sm-blue text-white shadow-lg shadow-blue-500/20 active:scale-95' : 'bg-gray-50 text-gray-400 group-hover:bg-sm-blue group-hover:text-white'}`}>{card.btnText}</button>}
                        {!card.btnText && Icon && <Icon className={`${isDark ? 'text-white/20 group-hover:text-sm-blue' : 'text-gray-200 group-hover:text-sm-blue'} transition-colors ml-auto`} size={32} />}
                        {card.btnText && <ArrowUpRight className={`${isDark ? 'text-white/20 group-hover:text-sm-blue' : 'text-gray-200 group-hover:text-sm-blue'} transition-colors`} size={24} />}
                     </div>
                  </div>
                )
              })}
           </div>
        </section>

        {/* Compact Strip Menu */}
        <section className="pb-8 px-2 overflow-hidden">
           <div className="flex overflow-x-auto gap-12 pb-4 hide-scrollbar justify-start border-b border-gray-100">
             {(d.menuStrip || []).map((cat, i) => (
                <button key={i} className="flex-none text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] transition-colors py-2 active:text-sm-blue">{cat}</button>
             ))}
           </div>
        </section>

        {/* RESOURCE LISTING */}
        <section className="py-12 border-t border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(d.resourceList || []).map((work, i) => (
                 <CatalogueCard 
                   key={i}
                   work={{ name: work.t, subcategory: work.c, image: work.img }} 
                   isSelected={selectedItem?.t === work.t}
                   onClick={() => setSelectedItem(selectedItem?.t === work.t ? null : work)}
                   themeColor="bg-sm-blue"
                   ringColor="ring-blue-500"
                   textColor="text-blue-400"
                 />
              ))}
           </div>
        </section>

        {/* INFO SPLIT GRID */}
        <section className="py-12 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
           <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: d.infoGrid?.titleHtml }} />
              <div className="grid grid-cols-2 gap-4">
                 {(d.infoGrid?.points || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-5 rounded-2xl border border-gray-50 hover:bg-sm-blue hover:text-white transition-all">
                       <Award size={16} className="text-sm-blue group-hover:text-white" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           <div className="rounded-[40px] overflow-hidden shadow-2xl h-[450px]">
              <img src={d.infoGrid?.img} alt="Planning" className="w-full h-full object-cover" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Guides;
