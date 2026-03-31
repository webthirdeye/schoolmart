// src/pages/Environments.jsx
import React, { useState } from 'react';
import { Layout, Sparkles, Wind, Sun, Leaf, ArrowRight, ArrowUpRight, Eye, CheckCircle2, Award, Layers } from 'lucide-react';
import InlineQuickView from '../components/InlineQuickView';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Sensory Hub 2025',
    titleHtml: 'Atmosphere <br/> <span class="text-sm-blue italic font-serif lowercase tracking-normal text-left">is</span> <br/> Everything.',
    subtitle: 'Harmonizing architectural sensory design to stimulate deep academic performance.',
  },
  actionCard: {
    titleHtml: 'Request <br/> Environment <br/> Audit Survey.',
    btnText: 'Apply Online',
  },
  heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  subBlocks: [
    { title: 'Eco Materials', subtitle: 'SUSTAINABLE', icon: 'Leaf' },
    { title: 'Sound Control', subtitle: 'ACOUSTICS', icon: 'Wind' },
    { title: 'Digital Lighting', subtitle: 'LUMENS V2', icon: 'Sun' },
  ],
  infoGrid: {
    titleHtml: 'Engineering <span class="text-sm-blue">Atmospheres.</span>',
    points: ['CFD Modeled', 'Acoustic Labs', 'UV Protected', 'Ergo Tech'],
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80',
  },
  masonryItems: [
    { t: 'Natural Light Study', c: 'Optics', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', h: 'h-[220px]' },
    { t: 'Acoustic Panel Grid', c: 'Sound', img: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=600&q=80', h: 'h-[280px]' },
    { t: 'Biophilic Design', c: 'Nature', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80', h: 'h-[250px]' },
    { t: 'Air Quality Lab', c: 'Climate', img: 'https://images.unsplash.com/photo-1581093196277-9f608109ca46?w=800&q=80', h: 'h-[220px]' },
    { t: 'Botanical Courtyard', c: 'Organic', img: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80', h: 'h-[310px]' },
    { t: 'Zen Meditation Pod', c: 'Focus', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80', h: 'h-[250px]' },
  ],
};

const ICONS = { Leaf, Wind, Sun, Layers };

const Environments = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { blocks, loading } = useCMSPage('environments');
  const d = blocks?.environments_page_content || DEFAULT_CONTENT;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sm-blue"></div></div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* BENTO HIGH-DENSITY HERO */}
        <section className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-3 items-stretch h-auto">
           {/* BIG TEXT BLOCK */}
           <div className="md:col-span-3 lg:col-span-2 bg-white rounded-[20px] p-8 flex flex-col justify-center border border-gray-300 shadow-sm relative overflow-hidden group min-h-[220px]">
              <CMSMedia 
                mediaType={d.hero?.mediaType} 
                mediaUrl={d.hero?.mediaUrl} 
                fallbackImg={d.heroImage} 
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-all duration-1000"
              />
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Sparkles size={12} className="inline mr-2" /> {d.hero?.badge}
              </div>
              <h1 className="text-4xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: d.hero?.titleHtml }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-loose text-left relative z-10">
                 {d.hero?.subtitle}
              </p>
           </div>

           {/* ACTION CARD - BLACK */}
           <div className="md:col-span-3 lg:col-span-1 bg-gray-900 rounded-[20px] p-6 text-white flex flex-col justify-between group overflow-hidden relative border border-gray-800 shadow-xl">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed text-sm-blue" dangerouslySetInnerHTML={{ __html: d.actionCard?.titleHtml }} />
              <div className="flex items-center justify-between mt-6">
                 <button className="px-4 py-2 bg-sm-blue text-white font-black rounded-full text-[7px] uppercase tracking-widest active:scale-95 transition-all shadow-lg active:shadow-blue-500/20">{d.actionCard?.btnText}</button>
                 <ArrowUpRight className="text-white/20 group-hover:text-sm-blue transition-colors" size={20} />
              </div>
           </div>

           <div className="hidden lg:block lg:col-span-1 bg-gray-100 rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100">
              <CMSMedia 
                mediaType={d.hero?.mediaType} 
                mediaUrl={d.hero?.mediaUrl} 
                fallbackImg={d.heroImage} 
                className="w-full h-full object-cover brightness-90 transition-all duration-700 hover:scale-110"
              />
           </div>

           {/* SUB-BLOCKS */}
           {(d.subBlocks || []).map((sb, i) => {
             const Icon = ICONS[sb.icon] || Sparkles;
             return (
               <div key={i} className="md:col-span-2 lg:col-span-1 bg-white rounded-[20px] p-6 border border-gray-300 shadow-sm flex items-center justify-between group hover:border-sm-blue transition-colors">
                  <div className="flex flex-col gap-1">
                     <span className="text-[12px] font-black text-gray-900 uppercase tracking-tighter">{sb.title}</span>
                     <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{sb.subtitle}</span>
                  </div>
                  <Icon className="text-blue-300 group-hover:text-sm-blue transition-colors" size={24} />
               </div>
             );
           })}

           {/* FLOW BLOCK */}
           <div className="hidden lg:flex lg:col-span-1 bg-blue-50/30 rounded-[20px] p-6 border border-blue-100 shadow-sm items-center justify-between group hover:bg-sm-blue hover:text-white transition-all">
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">Spatial Research Indices</span>
              <Layers className="text-sm-blue group-hover:text-white transition-colors" size={20} />
           </div>
        </section>

        {/* MASONRY DISPLAY - GOOGLE IMAGES STYLE */}
        <section className="py-6 border-t border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {(d.masonryItems || []).map((work, i) => (
                 <React.Fragment key={i}>
                    <div 
                      className={`relative overflow-hidden rounded-[20px] shadow-sm group cursor-pointer aspect-[4/5] border border-gray-300 transition-all duration-500 scale-100 ${selectedItem?.t === work.t ? 'ring-4 ring-sm-blue shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      onClick={() => setSelectedItem(selectedItem?.t === work.t ? null : work)}
                    >
                       <img src={work.img} alt={work.t} className="w-full h-full object-cover transition-all duration-700 hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent transition-opacity" />
                       <div className="absolute bottom-4 left-4 transition-all">
                          <h3 className="text-base font-black text-white uppercase">{work.t}</h3>
                          <span className="text-[10px] text-sm-blue font-black tracking-widest uppercase">{work.c}</span>
                       </div>
                    </div>

                    {/* INLINE EXPANSION LOGIC */}
                    {/* Mobile */}
                    <div className="md:hidden col-span-full">
                       {selectedItem?.t === work.t && (
                          <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                       )}
                    </div>
                    {/* Tablet (2 cols) */}
                    {i % 2 === 1 && (
                       <div className="hidden md:block lg:hidden col-span-full">
                          {(d.masonryItems || []).slice(i-1, i+1).some(dw => dw.t === selectedItem?.t) && (
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          )}
                       </div>
                    )}
                    {/* Desktop (3 cols) */}
                    {i % 3 === 2 && (
                       <div className="hidden lg:block col-span-full">
                          {(d.masonryItems || []).slice(i-2, i+1).some(dw => dw.t === selectedItem?.t) && (
                             <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                          )}
                       </div>
                    )}
                    {/* Handle End of List */}
                    {i === (d.masonryItems || []).length - 1 && (
                       <>
                          <div className="hidden md:block lg:hidden col-span-full">
                             {(d.masonryItems || []).slice(Math.floor(i/2)*2).some(dw => dw.t === selectedItem?.t) && i % 2 !== 1 && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                          <div className="hidden lg:block col-span-full">
                             {(d.masonryItems || []).slice(Math.floor(i/3)*3).some(dw => dw.t === selectedItem?.t) && i % 3 !== 2 && (
                                <InlineQuickView isOpen={true} onClose={() => setSelectedItem(null)} data={selectedItem} />
                             )}
                          </div>
                       </>
                    )}
                 </React.Fragment>
              ))}
           </div>
        </section>

        {/* INFO SPLIT GRID */}
        <section className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-gray-100 mt-6">
           <div className="bg-white p-12 rounded-[30px] border border-gray-300">
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: d.infoGrid?.titleHtml }} />
              <div className="grid grid-cols-2 gap-3">
                 {(d.infoGrid?.points || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-4 rounded-xl group hover:bg-sm-blue hover:text-white transition-all border border-gray-100">
                       <CheckCircle2 size={14} className="text-sm-blue group-hover:text-white" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           <div className="rounded-[30px] overflow-hidden shadow-xl h-[280px]">
              <img src={d.infoGrid?.img} alt="Consultation" className="w-full h-full object-cover shadow-2xl" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Environments;
