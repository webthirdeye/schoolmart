import React from 'react';
import { CheckCircle2, ArrowRight, Download, Phone, Shield, Target, Construction, Zap, Info, MapPin } from 'lucide-react';

const ROADMAP = [
  {
    num: '01',
    title: 'Initial Preparation',
    sub: 'Legal & Strategy Foundation',
    desc: 'The groundwork for your new institution begins with legal compliance and strategic financial modelling.',
    icon: <Shield size={20} className="text-blue-500" />,
    color: 'blue',
    steps: [
      'Society / Trust Registration certificates',
      'Affiliation Roadmap development',
      'Site Visit & Geotagging reports',
    ],
  },
  {
    num: '02',
    title: 'Infrastructure Build',
    sub: 'Designing Inspiring Spaces',
    desc: 'Transforming land into learning environments that meet NEP standards.',
    icon: <Construction size={20} className="text-emerald-500" />,
    color: 'emerald',
    steps: [
      'NEP-ready campus master planning',
      'Specialized STEM & Composite Labs',
      'Library & Modern Learning Hubs',
    ],
  },
  {
    num: '03',
    title: 'Digital Core Setup',
    sub: 'AI & Connectivity Readiness',
    desc: 'Future-proofing your campus with campus-wide high-speed connectivity.',
    icon: <Zap size={20} className="text-amber-500" />,
    color: 'amber',
    steps: [
      'Campus-wide Ultra-fast Wi-Fi',
      'Smart Classroom Panels & Panels',
      'AI-enabled learning tools setup',
    ],
  },
  {
    num: '04',
    title: 'Compliance & Application',
    sub: 'Board Affiliation Process',
    desc: 'Navigating the complex bureaucratic landscape of board applications.',
    icon: <Target size={20} className="text-rose-500" />,
    color: 'rose',
    steps: [
      'Online Board Application (CBSE/IB/ICSE)',
      'Fee payments & form submission',
      'Board Inspection Coordination',
    ],
  },
];

const SetupGuide = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* COMPACT HERO */}
      <section className="bg-white py-12 px-6 border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full mb-6">
            <Shield size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Institutional Roadmap</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4">
            Phase-Wise <span className="text-sm-blue italic font-serif lowercase tracking-normal">Setup Guide.</span>
          </h1>
          <p className="text-gray-500 text-[12px] font-bold uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
            From registration to board affiliation, our step-by-step roadmap ensures your new school project stays on track and compliant.
          </p>
        </div>
      </section>

      {/* COMPACT STAIRCASE: High Density Grid */}
      <section className="py-16 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP.map((phase, i) => (
               <div key={i} className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-900 mb-6 group-hover:bg-gray-900 group-hover:text-white transition-all`}>
                     {phase.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Phase {phase.num}</span>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{phase.title}</h3>
                  <p className="text-gray-500 text-[12px] leading-relaxed mb-8 flex-grow">{phase.desc}</p>
                  
                  <div className="space-y-3 pt-6 border-t border-gray-50">
                     {phase.steps.map((step, j) => (
                        <div key={j} className="flex gap-3 items-center group/step">
                           <CheckCircle2 size={14} className="text-emerald-500 shrink-0 opacity-40 group-hover/step:opacity-100" />
                           <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight line-clamp-1">{step}</span>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* CHECKLIST BANNER: compact Horizontal Layout */}
      <section className="py-16 px-6 bg-gray-900 text-white">
         <div className="max-w-7xl mx-auto p-12 rounded-[50px] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="md:w-2/3">
               <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 leading-tight">Download the <br /> 48-Point Affiliation <span className="italic font-serif text-emerald-500">Roadmap.</span></h3>
               <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose mb-10">
                  Comprehensive compliance guide for land documents, structural safety, and board norms.
               </p>
               <button className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-emerald-600 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 duration-500 group">
                  Get The Checklist <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
               </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
               <div className="w-48 h-64 bg-white rounded-3xl p-6 flex flex-col justify-end text-gray-950 relative overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12" />
                  <Shield size={40} className="text-emerald-500 mb-6" />
                  <span className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-50">Score</span>
                  <div className="w-full h-1.5 bg-emerald-50 rounded-full mb-3">
                     <div className="w-3/4 h-full bg-emerald-500" />
                  </div>
                  <span className="text-xl font-black">75% SECURE</span>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL ADVISORY: compact centered */}
      <section className="py-16 px-6 text-center">
         <div className="max-w-2xl mx-auto">
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Consult Our Experts.</h4>
            <a href="tel:+919966109191" className="inline-flex items-center gap-4 px-10 py-5 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all shadow-xl shadow-blue-500/10 h-16 w-full md:w-auto flex justify-center">
               <Phone size={16} /> Schedule Strategy Call
            </a>
         </div>
      </section>
    </main>
  );
};

export default SetupGuide;
