import React from 'react';
import { Calculator, Star, Download, Sparkles, Layout, Box, ArrowRight, Layers, Phone, BookOpen, Zap, Target, CheckCircle2 } from 'lucide-react';


const MATH_MODULES = [
  {
    title: 'Gamified Math Kits',
    subtitle: 'Elementary & Middle School',
    desc: 'Interactive physical boards and manipulatives that transform abstract concepts into tangible play.',
    icon: <Calculator size={20} />,
    items: ['Number Sense Boards', 'Fraction Manipulatives', 'Geometry Building Sets'],
    color: 'bg-emerald-600',
  },
  {
    title: 'Digital Maths Lab',
    subtitle: 'High School Ready',
    desc: 'Advanced software ecosystems with real-time analytics and personalized learning paths.',
    icon: <Zap size={20} />,
    items: ['AI Problem Solvers', '3D Graphing Tools', 'Progress Dashboards'],
    color: 'bg-sm-blue',
  },
  {
    title: 'Teacher Handbooks',
    subtitle: 'Pedagogy & Training',
    desc: 'Step-by-step guides for educators to implement gamified learning effectively in classrooms.',
    icon: <BookOpen size={20} />,
    items: ['Activity Planners', 'Assessment Kits', 'Workshop Materials'],
    color: 'bg-amber-600',
  },
];

const MathResources = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT MATH HERO */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-emerald-500/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full mb-6 border border-emerald-500">
               <Calculator size={14} />
               <span className="text-[9px] font-black uppercase tracking-[.3em] font-heading">Gamified v2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6 text-gray-900">
              Gamified Math <br />
              <span className="text-emerald-600 italic font-serif lowercase tracking-normal text-6xl">Resources.</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-sm mb-10">
               Making mathematics intuitive through play and gamification. 100% aligned with NEP 2020 foundation & primary stage guidelines.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-emerald-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-950 transition-all shadow-xl shadow-emerald-500/20 duration-500 flex items-center gap-3 active:scale-95">
                 Get Resource Kit
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white p-6 shadow-xl rounded-[30px] border border-emerald-100 flex flex-col items-center">
                <Target size={32} className="text-emerald-600 mb-4" />
                <span className="text-2xl font-black text-gray-900 leading-none mb-1">5k+</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Students <br /> Reached</span>
             </div>
             <div className="bg-gray-900 p-6 shadow-xl rounded-[30px] border border-gray-800 flex flex-col items-center text-white">
                <Sparkles size={32} className="text-emerald-600 mb-4" />
                <span className="text-2xl font-black leading-none mb-1">100%</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">Retention <br /> Rate</span>
             </div>
          </div>
        </div>
      </section>

      {/* COMPACT CARD GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
           {MATH_MODULES.map((module, i) => (
              <div key={i} className="flex-1 bg-white p-10 rounded-[35px] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden h-full flex flex-col border transition-all hover:scale-[1.02]">
                 <div className={`absolute top-0 right-0 w-24 h-24 ${module.color}/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`} />
                 <div className={`w-12 h-12 ${module.color} text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-blue-500/10`}>{module.icon}</div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{module.subtitle}</span>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{module.title}</h3>
                 <p className="text-gray-500 text-[11px] leading-relaxed mb-10 flex-grow min-h-[4rem] line-clamp-3">{module.desc}</p>
                 <div className="space-y-4 pt-8 border-t border-gray-50 mt-auto">
                    {module.items.map((item, j) => (
                       <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className={module.color.replace('bg-', 'text-')} />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight line-clamp-1">{item}</span>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="py-16 px-6 bg-emerald-600 text-white rounded-[50px] mx-6 mb-12 flex flex-col items-center justify-center text-center">
         <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Ready to transform your math lab?</h3>
         <button className="flex items-center gap-4 px-10 py-5 bg-gray-950 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-950 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 duration-500">
            <Phone size={18} /> Book Strategy Consultation
         </button>
      </section>
    </main>
  );
};


export default MathResources;
