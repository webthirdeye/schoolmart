import React, { useState } from 'react';
import { Settings, Shield, Zap, Box, Factory, Truck, CheckCircle2, Award, ArrowRight, ArrowUpRight, Download, Eye, Layers, Activity } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const stats = [
  { label: 'AREA', value: '50k+', u: 'SQFT' },
  { label: 'ARMS', value: '12', u: 'BOTS' },
  { label: 'DAILY', value: '800+', u: 'OUT' },
  { label: 'CHECKS', value: '100%', u: 'QC' },
];

const Manufacturing = () => {
  const { blocks, loading } = useCMSPage('manufacturing');
  const [selectedItem, setSelectedItem] = useState(null);
  const heroBlock = blocks?.inner_page_hero || {};
  const statsBlock = blocks?.stats || {};
  const currentStats = statsBlock.stats || stats;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Manufacturing...</div>;

  const manufacturingCards = [
    { name: 'ROBOTIC ASSEMBLY', subcategory: 'Precision 4.0', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80' },
    { name: 'CNC MACHINING', subcategory: '0.01mm Grade', image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80' },
    { name: 'QUALITY CONTROL', subcategory: 'ISO Certified', image: 'https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?w=800&q=80' },
    { name: 'LOGISTICS HUB', subcategory: 'Global Shipping', image: 'https://images.unsplash.com/photo-1586528116311-ad8669931342?w=800&q=80' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* TECHNICAL STRIP HERO - HORIZONTAL HIGH DENSITY */}
        <section className="pt-4 pb-12 flex flex-col gap-3">
           {/* STRIP 1 - THE STORY & STATS */}
           <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-8">
            <div className="flex-1 bg-[#1A1A1A] rounded-[30px] p-12 text-white relative overflow-hidden group border border-gray-800 shadow-2xl min-h-[400px] flex flex-col justify-center">
               <CMSMedia 
                 mediaType={heroBlock.mediaType} 
                 mediaUrl={heroBlock.mediaUrl} 
                 fallbackImg={heroBlock.img || "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=1200&q=80"}
                 className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-[3000ms] z-0"
               />
               <div className="relative z-10">
                 <div className="px-4 py-1.5 bg-emerald-500 text-white font-black rounded-full text-[10px] uppercase tracking-[0.2em] mb-6 w-fit shadow-xl shadow-emerald-500/20">
                    <Factory size={14} className="inline mr-2" /> {heroBlock.badge || "Precision 4.0"}
                 </div>
                 <h1 className="text-5xl lg:text-7xl font-black font-heading leading-none mb-6 tracking-tighter uppercase" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || 'Precision <br/> <span className="text-emerald-500 italic font-serif lowercase tracking-normal">and</span> <br/> Scale.' }} />
                 <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest max-w-sm leading-loose">
                    {heroBlock.subtitle || "Combining robotic precision with artisan craftsmanship for institutional excellence."}
                 </p>
               </div>
               <div className="absolute top-12 right-12 flex flex-col gap-4 z-20">
                  <button className="p-4 bg-emerald-500 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all shadow-xl active:scale-90">
                     <ArrowUpRight size={24} />
                  </button>
                  <button className="p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-emerald-500 transition-all border border-white/10">
                     <Download size={24} />
                  </button>
               </div>
            </div>

            {/* STATS STRIP - PACKED */}
            <div className="lg:w-[320px] bg-white rounded-[30px] p-10 grid grid-cols-2 gap-6 border border-gray-100 shadow-sm content-center">
               {currentStats.map((s, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-50 group hover:border-emerald-200 transition-colors">
                     <span className="text-3xl font-black font-heading text-gray-900 leading-none mb-2">{s.value}</span>
                     <span className="text-[8px] font-black tracking-widest text-emerald-600 uppercase text-center">{s.label}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* HIGH IMPACT CARDS SECTION */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {manufacturingCards.map((card, i) => (
               <CatalogueCard 
                 key={i}
                 work={card} 
                 isSelected={selectedItem?.name === card.name}
                 onClick={() => setSelectedItem(selectedItem?.name === card.name ? null : card)}
                 themeColor="bg-emerald-600"
                 ringColor="ring-emerald-400"
                 textColor="text-emerald-400"
               />
            ))}
         </div>
        </section>

        {/* PROCESS FLOW - HORIZONTAL CLOSELY PACKED */}
        <section className="pb-12 border-t border-gray-100 py-12 overflow-hidden">
           <div className="flex overflow-x-auto gap-6 scrollbar-hide pb-4">
              {[
                 { t: 'Material', i: <Box /> },
                 { t: 'Cutting', i: <Settings /> },
                 { t: 'Assembly', i: <Layers /> },
                 { t: 'Quality', i: <Shield /> },
                 { t: 'Logistics', i: <Truck /> },
              ].map((step, i) => (
                 <div key={i} className="flex-none w-48 bg-white p-8 rounded-[30px] border border-gray-100 flex flex-col items-center gap-6 group hover:shadow-xl transition-all shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all border border-transparent group-hover:border-emerald-100">{step.i}</div>
                    <span className="text-[10px] font-black uppercase text-gray-900 tracking-widest">{step.t}</span>
                 </div>
              ))}
           </div>
        </section>

        {/* INFO GRID - COMPACT */}
        <section className="py-12 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
           <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
              <h2 className="text-4xl font-black text-gray-900 font-heading mb-8 leading-none uppercase tracking-tighter">Direct Source <br/> <span className="text-emerald-600">Control.</span></h2>
              <div className="flex flex-col gap-4">
                 {['NEP Compliant Materials', 'BIFMA Level 3 Quality', 'Zero VOC Finishing', 'Eco-Circular Supply'].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase bg-gray-50 p-5 rounded-2xl border border-gray-50 hover:bg-emerald-50 transition-colors">
                       <CheckCircle2 size={16} className="text-emerald-500" />
                       {item}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="rounded-[40px] overflow-hidden shadow-2xl h-[450px]">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&q=80" alt="Tech" className="w-full h-full object-cover" />
           </div>
        </section>
      </div>
    </main>
  );
};

export default Manufacturing;
