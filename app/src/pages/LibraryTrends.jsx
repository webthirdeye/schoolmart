import React from 'react';
import { Library, Layout, BookOpen, ArrowRight, CheckCircle2, Download, Award, Sparkles, Building2, Phone, Search, Globe, FolderOpen } from 'lucide-react';

const LIBRARY_TRENDS = [
  {
    title: 'Reading Zones',
    subtitle: 'Interactive Spaces',
    desc: 'Creating tiered seating, cozy nooks, and acoustic zones to encourage immersion.',
    icon: <Search size={20} />,
    items: ['Tiered Seating', 'Acoustic Wall Panels', 'Integrated Lighting'],
    color: 'bg-emerald-600',
  },
  {
    title: 'Digital Archives',
    subtitle: 'Future Ready',
    desc: 'Cloud-managed catalogues and e-reading stations for seamless resource access.',
    icon: <Globe size={20} />,
    items: ['E-Ink Tablets', 'Cloud Catalogue', 'Automated Checkouts'],
    color: 'bg-sm-blue',
  },
  {
    title: 'Modular Shelving',
    subtitle: 'Adaptive Storage',
    desc: 'Flexible shelving systems that adapt to growing collections and multi-use spaces.',
    icon: <FolderOpen size={20} />,
    items: ['Height-adjustable Shelves', 'Mobile Book Racks', 'Integrated Displays'],
    color: 'bg-amber-600',
  },
];

const LibraryTrends = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT LIBRARY HERO */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-emerald-500/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full mb-6 border border-emerald-100 shadow-sm">
               <Library size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] font-heading">Trends v2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Modern Library <br />
              <span className="text-emerald-600 italic font-serif lowercase tracking-normal text-6xl">Trends.</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-sm mb-10">
               Transforming traditional storage halls into vibrant, tech-enabled centers of inquiry and collaboration.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-emerald-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-950 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 duration-500 flex items-center gap-3">
                 <BookOpen size={18} /> Get Design Guide
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-emerald-100 flex flex-col items-center">
                <BookOpen size={32} className="text-emerald-600 mb-4" />
                <span className="text-2xl font-black text-gray-900 leading-none mb-1">50+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Modern <br /> Catalogues</span>
             </div>
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-emerald-100 flex flex-col items-center">
                <Award size={32} className="text-emerald-600 mb-4" />
                <span className="text-2xl font-black leading-none mb-1">A+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Institutional <br /> Standards</span>
             </div>
          </div>
        </div>
      </section>

      {/* TREND GRID: Technical Setup */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
           {LIBRARY_TRENDS.map((item, i) => (
              <div key={i} className="flex-1 bg-white p-10 rounded-[35px] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden h-full flex flex-col border transition-all hover:scale-[1.02]">
                 <div className={`absolute top-0 right-0 w-24 h-24 ${item.color}/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`} />
                 <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-emerald-500/10`}>{item.icon}</div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{item.subtitle}</span>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{item.title}</h3>
                 <p className="text-gray-500 text-[10px] leading-relaxed mb-10 flex-grow min-h-[4rem] line-clamp-3 uppercase font-black tracking-widest">{item.desc}</p>
                 <div className="space-y-4 pt-8 border-t border-gray-100 mt-auto">
                    {item.items.map((p, j) => (
                       <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className={item.color.replace('bg-', 'text-')} />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight line-clamp-1">{p}</span>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="py-12 bg-white px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border border-gray-100 p-12 rounded-[50px] gap-8 bg-gray-900 text-white">
            <div>
               <h4 className="text-xl font-black uppercase tracking-tighter mb-2 leading-none">Need an on-campus library audit?</h4>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-loose">Audit for stock organization, digital systems, and spatial efficiency.</p>
            </div>
            <button className="px-10 py-5 bg-emerald-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-2xl flex items-center gap-3">
               <Phone size={18} /> Schedule Strategy Call
            </button>
         </div>
      </section>
    </main>
  );
};

export default LibraryTrends;
