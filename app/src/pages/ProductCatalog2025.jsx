import React from 'react';
import { FileText, Download, Star, Award, Box, ArrowRight, Zap, Target, Phone, BookOpen, Layers } from 'lucide-react';

const CATALOGS = [
  {
    title: 'Play Furniture',
    subtitle: 'Pre-Primary Collections',
    pages: '124 Pages',
    size: '14MB PDF',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    color: 'bg-rose-500',
  },
  {
    title: 'Lab & STEM',
    subtitle: 'Modular Equipment',
    pages: '86 Pages',
    size: '9MB PDF',
    img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    color: 'bg-emerald-600',
  },
  {
    title: 'Digital Hub',
    subtitle: 'Smart Solutions',
    pages: '48 Pages',
    size: '6MB PDF',
    img: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=800&q=80',
    color: 'bg-sm-blue',
  },
];

const ProductCatalog2025 = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT CATALOGUE HERO */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sm-blue/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 shadow-xl text-white rounded-full mb-6 border border-gray-800">
               <span className="text-[9px] font-black uppercase tracking-[.3em] font-heading">New v2025 Release</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Institutional <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal text-6xl">Catalogues.</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-sm mb-10">
               Download the definitive guide to modern school infrastructure. 12+ categories, 2000+ products, and premium institutional designs.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-950 transition-all shadow-xl shadow-blue-500/20 active:scale-95 duration-500 flex items-center gap-3">
                 <Download size={18} /> Download All (32MB)
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-gray-100 flex flex-col items-center">
                <Box size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black text-gray-900 leading-none mb-1">2k+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Products <br /> Catalogue</span>
             </div>
             <div className="bg-gray-900 p-6 shadow-xl rounded-[30px] border border-gray-800 flex flex-col items-center text-white">
                <Award size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black leading-none mb-1">15+</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">National <br /> Awards</span>
             </div>
          </div>
        </div>
      </section>

      {/* COMPACT SCROLLABLE GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATALOGS.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group overflow-hidden h-full flex flex-col relative border transition-all hover:scale-[1.02]">
                <div className="h-48 relative overflow-hidden shrink-0">
                   <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
                   <div className={`absolute top-4 left-4 ${item.color} text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl shadow-black/20`}>{item.subtitle}</div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[1.5rem]">{item.title}</h3>
                   <div className="flex gap-6 mb-10 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                         <Layers size={14} className="text-gray-400" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.pages}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <FileText size={14} className="text-gray-400" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.size}</span>
                      </div>
                   </div>
                   <button className="mt-auto w-full py-4 bg-gray-50 hover:bg-sm-blue hover:text-white text-gray-400 font-black rounded-xl text-[9px] uppercase tracking-widest shadow-inner group-hover:shadow-2xl transition-all mb-2 flex items-center justify-center gap-2">
                      <Download size={14} /> Download PDF
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL STRIP */}
      <section className="py-12 bg-white px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border border-gray-100 p-12 rounded-[50px] gap-8 bg-gray-50">
            <div>
               <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2 leading-none">Need a printed hardcover edition?</h4>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Complimentary master catalogues for institutional partners.</p>
            </div>
            <button className="px-10 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue hover:shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center gap-3">
               Request Printing Curation <ArrowRight size={18} />
            </button>
         </div>
      </section>
    </main>
  );
};

export default ProductCatalog2025;
