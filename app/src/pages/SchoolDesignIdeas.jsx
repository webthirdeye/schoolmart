import React from 'react';
import { Palette, Layout, Box, ArrowRight, CheckCircle2, Download, Award, Sparkles, Building2, Phone } from 'lucide-react';

const DESIGN_CONCEPTS = [
  {
    title: 'Façade Excellence',
    desc: 'Modern building exteriors using sustainable materials and signature institutional branding.',
    img: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800&q=80',
    points: ['Terracotta Cladding', 'Signage Integration', 'Ambient Lighting'],
  },
  {
    title: 'Smart Classrooms',
    desc: 'Flexible seating and integrated EdTech that adapts to different learning styles.',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    points: ['Modular Desks', 'Acoustic Wall Panels', 'Ergonomic Layouts'],
  },
  {
    title: 'Corridor Utilization',
    desc: 'Transforming transit spaces into active learning zones and gallery walks.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    points: ['Display Softboards', 'Locker Integration', 'Breakout Seating'],
  },
];

const SchoolDesignIdeas = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT DESIGN HERO */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-sm-blue/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sm-blue text-white rounded-full mb-6 border border-sm-blue/20">
               <Palette size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] font-heading">Design v2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              20 Stunning <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal text-6xl">School Design</span> Ideas.
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-sm mb-10">
               Exploring the intersection of modern architecture and pedagogical growth. Curated spatial planning for 21st-century campuses.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-gray-950 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500 flex items-center gap-3">
                 <Download size={18} /> Download Lookbook
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-gray-100 flex flex-col items-center">
                <Building2 size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black text-gray-900 leading-none mb-1">20+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Concept <br /> Blueprints</span>
             </div>
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-gray-100 flex flex-col items-center">
                <Award size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black leading-none mb-1">A+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Aesthetic <br /> Ranking</span>
             </div>
          </div>
        </div>
      </section>

      {/* COMPACT DESIGN GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {DESIGN_CONCEPTS.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row items-stretch gap-8 bg-white border border-gray-100 rounded-[45px] p-10 hover:shadow-2xl transition-all group overflow-hidden">
               <div className="md:w-1/3 h-64 relative overflow-hidden rounded-[35px] shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
               </div>
               <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed mb-8">{item.desc}</p>
                  <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-8">
                     {item.points.map((p, j) => (
                        <div key={j} className="flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-sm-blue" />
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">{p}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex items-center justify-center px-4">
                  <button className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-sm-blue group-hover:text-white transition-all">
                     <ArrowRight size={20} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL STRIP */}
      <section className="py-16 bg-sm-blue px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border border-white/10 p-12 rounded-[50px] gap-8 text-white relative">
            <div className="absolute inset-0 bg-black/5 rounded-[50px]" />
            <div className="relative z-10 text-center md:text-left">
               <h4 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none">Need an architectural site survey?</h4>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-loose">On-campus design assessments by senior institutional architects.</p>
            </div>
            <button className="relative z-10 px-10 py-5 bg-white text-sm-blue font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-xl flex items-center gap-3">
               <Phone size={18} /> Book Site Survey
            </button>
         </div>
      </section>
    </main>
  );
};

export default SchoolDesignIdeas;
