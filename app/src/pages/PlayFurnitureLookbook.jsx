import React from 'react';
import { Armchair, Star, Download, ShieldCheck, Sparkles, Layout, Box, ArrowRight, Layers, Phone } from 'lucide-react';


const COLLECTIONS = [
  {
    title: 'Pre-Primary Hub',
    subtitle: 'Nursery & LKG Ready',
    desc: 'Ergonomic, colorful, and sustainable furniture designed for the first steps of learning.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    color: 'bg-rose-500',
  },
  {
    title: 'Outdoor Adventure',
    subtitle: 'Safe Play Area',
    desc: 'Heavy-duty multiplay systems, swings, and slides with international safety certification.',
    img: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&q=80',
    color: 'bg-emerald-600',
  },
  {
    title: 'Soft Play Zone',
    subtitle: 'Early Childhood',
    desc: 'Safe, cushioned environments for toddlers to explore physical coordination and play.',
    img: 'https://images.unsplash.com/photo-1608447714925-599deeb5a682?w=800&q=80',
    color: 'bg-sm-blue',
  },
];

const PlayFurnitureLookbook = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT PLAY HERO */}
      <section className="bg-rose-50/50 py-16 px-6 border-b border-rose-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-rose-500/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded-full mb-6 border border-rose-200">
               <Sparkles size={14} />
               <span className="text-[9px] font-black uppercase tracking-[.3em] font-heading">Lookbook v2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Play Furniture <br />
              <span className="text-rose-500 italic font-serif lowercase tracking-normal text-6xl">Lookbook.</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-sm mb-10">
               Inspiring early childhood spaces designed with safety, ergonomics, and aesthetic joy at their core.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-rose-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-950 transition-all shadow-xl shadow-rose-500/20 active:scale-95 duration-500 flex items-center gap-3">
                 <Download size={18} /> Download Lookbook
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-rose-100 flex flex-col items-center">
                <Box size={32} className="text-rose-500 mb-4" />
                <span className="text-2xl font-black text-gray-900 leading-none mb-1">500+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Installations <br /> Across India</span>
             </div>
             <div className="bg-gray-900 p-6 shadow-xl rounded-[30px] border border-gray-800 flex flex-col items-center text-white">
                <ShieldCheck size={32} className="text-rose-500 mb-4" />
                <span className="text-2xl font-black leading-none mb-1">100%</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">Child <br /> Safe Materals</span>
             </div>
          </div>
        </div>
      </section>

      {/* COMPACT AESTHETIC GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {COLLECTIONS.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-12 bg-white border border-gray-100 rounded-[45px] p-12 hover:shadow-2xl transition-all group overflow-hidden">
               <div className={`md:w-1/2 h-80 relative overflow-hidden rounded-[40px] ${i % 2 === 1 ? 'md:order-last' : ''}`}>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
               </div>
               <div className="md:w-1/2 flex flex-col">
                  <span className={`w-fit px-4 py-1.5 ${item.color} text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-6`}>{item.subtitle}</span>
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed mb-8 flex-grow">{item.desc}</p>
                  <button className="w-fit flex items-center gap-3 text-rose-500 font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all">
                     View Full Collection <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER STRIP */}
      <section className="py-20 px-6 bg-rose-50 flex flex-col items-center justify-center text-center">
         <h4 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">Ready to design your play environment?</h4>
         <button className="px-12 py-5 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all shadow-2xl active:scale-95 duration-500 flex items-center gap-4">
            <Phone size={18} /> Book Design Consultation
         </button>
      </section>
    </main>
  );
};

export default PlayFurnitureLookbook;
