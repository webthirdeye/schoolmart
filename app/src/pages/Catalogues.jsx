// src/pages/Catalogues.jsx
import React, { useState } from 'react';
import { BookOpen, Download, ArrowUpRight, Layers } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const DEFAULT_CONTENT = {
  libraryHero: {
    badge: 'Digital Library 2025',
    titleHtml: 'Digital <br/> <span class="text-sm-blue italic font-serif lowercase tracking-normal">Infrastructure.</span>',
    subtitle: 'Deep-dive into our comprehensive institutional catalogues and design handbooks.',
  },
  actionStrip: {
    title: '2025 Master Catalogue.',
    subtitle: 'Complete range of ergonomic campus solutions for modern schools.',
    btn1Text: 'Instant PDF',
    btn2Text: 'Share Hub',
  },
  resourceTiles: ['Technical Specs', 'Compliance Guide', 'Design Portfolio'],
  menuStrip: ['MASTER 2025', 'FURNITURE', 'INFRASTRUCTURE', 'RESOURCES', 'AUDIT INDICES'],
  infoGrid: {
    titleHtml: 'Knowledge <span class="text-sm-blue">Infrastructure.</span>',
    points: ['Verified Specs', 'Compliance Audit', 'Future Ready', 'BIFMA Level-3'],
    img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=80',
  }
};

const DEFAULT_CATALOGUES = [
  { title: 'School Furniture 2025', category: 'Furniture', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
  { title: 'Tech Infrastructure', category: 'Digital', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80' },
  { title: 'Sports Surfaces', category: 'Sports', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
  { title: 'Lab Equipment', category: 'Science', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80' },
];

const Catalogues = () => {
    const { blocks, loading } = useCMSPage('catalogues');
  const [selectedItem, setSelectedItem] = useState(null);
  const d = blocks?.catalogues_page_content || DEFAULT_CONTENT;
  const catalogues = blocks?.catalogues_list?.catalogues || DEFAULT_CATALOGUES;

    if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Catalogues...</div>;

  return (
    <main className="min-h-screen bg-white pt-10 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-8">
           {/* Main Content Area */}
           <div className="flex-grow min-w-0">
             <section className="pt-2 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-4 bg-gray-50 rounded-[30px] p-12 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px]">
                   <CMSMedia 
                     mediaType={d.libraryHero?.mediaType} 
                     mediaUrl={d.libraryHero?.mediaUrl} 
                     fallbackImg={d.libraryHero?.img} 
                     className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-1000"
                   />
                   <div className="px-4 py-1.5 bg-sm-blue text-white font-black rounded-full text-[10px] uppercase tracking-[0.2em] mb-6 w-fit shadow-xl shadow-blue-500/20 relative z-10">
                      <BookOpen size={14} className="inline mr-2" /> {d.libraryHero?.badge || 'Catalogue'}
                   </div>
                   <h1 className="text-4xl lg:text-5xl font-black font-heading leading-tight mb-8 tracking-tighter text-gray-900 uppercase" dangerouslySetInnerHTML={{ __html: d.libraryHero?.titleHtml }} />
                   <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest max-w-xs leading-loose">
                      {d.libraryHero?.subtitle}
                   </p>
                </div>

                <div className="md:col-span-8 flex flex-col gap-6">
                   <div className="bg-[#1A1A1A] rounded-[30px] p-10 text-white flex flex-col lg:flex-row justify-between items-center group overflow-hidden relative border border-gray-800 shadow-2xl transition-transform hover:scale-[1.01] flex-grow">
                      <div className="flex-1">
                         <h3 className="text-2xl font-black uppercase tracking-[0.1em] leading-relaxed text-sm-blue mb-2">{d.actionStrip?.title}</h3>
                         <p className="text-white/40 text-[10px] uppercase tracking-widest leading-loose max-w-sm">{d.actionStrip?.subtitle}</p>
                      </div>
                      <div className="flex gap-4 mt-8 lg:mt-0">
                         <button className="px-8 py-4 bg-sm-blue text-white font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">{d.actionStrip?.btn1Text || 'Download'}</button>
                         <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-sm-blue hover:border-sm-blue transition-all">Request Hardcopy</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(d.resourceTiles || []).map((t, i) => (
                         <div key={i} className="bg-white rounded-[30px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-sm-blue transition-all cursor-pointer hover:shadow-lg">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-sm-blue transition-colors leading-none mb-6">{t}</h4>
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-sm-blue group-hover:text-white transition-all self-end">
                               <ArrowUpRight size={24} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </section>

             <section className="pb-12 px-2 overflow-hidden">
                <div className="flex overflow-x-auto gap-12 pb-4 hide-scrollbar justify-start border-b border-gray-100">
                  {(d.menuStrip || []).map((cat, i) => (
                     <button key={i} className="flex-none text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] transition-colors py-2 active:text-sm-blue">{cat}</button>
                  ))}
                </div>
             </section>

             <section className="py-12 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {catalogues.map((item, i) => (
                      <CatalogueCard 
                         key={i}
                         work={{ name: item.title, subcategory: item.category || item.description, image: item.img, fileUrl: item.fileUrl }} 
                         isSelected={selectedItem?.title === item.title}
                         onClick={() => setSelectedItem(selectedItem?.title === item.title ? null : item)}
                         themeColor="bg-sm-blue"
                         ringColor="ring-blue-500"
                         textColor="text-blue-400"
                      />
                   ))}
                </div>
             </section>

             <section className="py-12 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
                <div className="order-2 lg:order-1 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                   <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: d.infoGrid?.titleHtml }} />
                   <div className="grid grid-cols-2 gap-4">
                      {(d.infoGrid?.points || []).map((item, i) => (
                         <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 p-5 rounded-2xl border border-gray-50 hover:bg-sm-blue hover:text-white transition-all">
                            <Layers size={16} className="text-sm-blue group-hover:text-white" />
                            {item}
                         </div>
                      ))}
                   </div>
                </div>
                
                <div className="order-1 lg:order-2 rounded-[40px] overflow-hidden shadow-2xl h-[450px]">
                   <img src={d.infoGrid?.img || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=80'} alt="Info" className="w-full h-full object-cover brightness-95 hover:brightness-100 transition-all duration-1000" />
                </div>
             </section>
           </div>
        </div>
      </div>
    </main>
  );
};

export default Catalogues;
