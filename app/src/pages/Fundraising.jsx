import React, { useState } from 'react';
import { Target, TrendingUp, Shield, Zap, ArrowRight, CheckCircle2, Award, Phone, Mail, FileText, ChevronRight, BarChart3, Activity, MapPin } from 'lucide-react';

const ADVISORY_FOCUS = [
  {
    title: 'Yield Optimization',
    desc: 'Maximizing institutional revenue through enrollment strategy and space utilization audits.',
    stats: '15-20%',
    trend: 'Avg Improvement',
    icon: <BarChart3 size={20} />,
    color: 'emerald',
  },
  {
    title: 'Project Feasibility',
    desc: 'Data-driven catchment area analysis and demographic studies for new campus viability.',
    stats: '100+',
    trend: 'Feasibility Reports',
    icon: <Target size={20} />,
    color: 'blue',
  },
  {
    title: 'Capital Structuring',
    desc: 'Accessing specialized educational soft loans, grants, and strategic growth capital.',
    stats: '₹500Cr+',
    trend: 'Capital Advised',
    icon: <TrendingUp size={20} />,
    color: 'amber',
  },
];

const CASE_STUDIES = [
  { title: 'K-12 Tech Campus', location: 'Bengaluru', outcome: '30% Enrollment Growth', focus: 'Yield Opt' },
  { title: 'Global Preschool Chain', location: 'Mumbai', outcome: '₹50Cr Growth Funding', focus: 'Capital Struct' },
  { title: 'STEM Integrated High School', location: 'Hyderabad', outcome: 'Board Cert. Ready', focus: 'Feasibility' },
];

const Fundraising = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* COMPACT HERO */}
      <section className="bg-gray-900 py-16 px-6 relative overflow-hidden text-center text-white border-b border-white/10">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6 text-sm-blue">
            <Shield size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Performance Advisory</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
            Maximize <span className="text-sm-blue italic font-serif lowercase tracking-normal">Your Institutional Asset.</span>
          </h1>
          <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose max-w-xl mx-auto mb-10">
            We provide the critical data and strategic advisory school owners need to optimize enrollment, yield, and campus performance.
          </p>
          <div className="flex justify-center flex-col md:flex-row gap-4">
             <button className="px-10 py-5 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500 group">
                Schedule Performance Audit <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-1" />
             </button>
             <button className="px-10 py-5 border border-white/20 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">
                Download Brochure
             </button>
          </div>
        </div>
      </section>

      {/* ADVISORY CARDS: Compact Bento Grid */}
      <section className="py-16 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVISORY_FOCUS.map((focus, i) => (
               <div key={i} className="flex flex-col p-10 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group">
                  <div className={`w-12 h-12 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gray-900 group-hover:text-white transition-all`}>
                     {focus.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{focus.title}</h3>
                  <p className="text-gray-500 text-[12px] leading-relaxed mb-10 flex-grow min-h-[4.5rem] line-clamp-3">{focus.desc}</p>
                  <div className="pt-8 border-t border-gray-50 flex flex-col">
                     <span className={`text-4xl font-black text-gray-900 mb-1 group-hover:text-sm-blue transition-colors`}>{focus.stats}</span>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{focus.trend}</span>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* CASE STUDIES: Clean compact vertical list feel */}
      <section className="py-16 px-6 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block underline underline-offset-8">Case Studies</span>
               <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-4">Advisory <br /> Impact.</h2>
               <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-loose mb-10">
                  Real numbers, real outcomes. Institutional growth facilitated by Board Expertise.
               </p>
               <button className="flex items-center gap-2 text-sm-blue font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                  Full Analytics <ChevronRight size={14} />
               </button>
            </div>
            <div className="lg:w-2/3 flex flex-nowrap md:grid md:grid-cols-1 lg:grid-cols-2 gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {CASE_STUDIES.map((cs, i) => (
                  <div key={i} className="flex-shrink-0 w-80 md:w-full bg-gray-50 p-8 rounded-[35px] border border-gray-100 group hover:border-sm-blue transition-colors relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-[8px] font-black bg-gray-950 text-white px-3 py-1.5 rounded-full uppercase tracking-widest">{cs.focus}</span>
                        <Award size={20} className="text-emerald-500" />
                     </div>
                     <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2 leading-none">{cs.title}</h4>
                     <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-6 flex items-center gap-1"><MapPin size={10} /> {cs.location}</p>
                     <p className="text-emerald-600 font-black text-[16px] uppercase tracking-tighter">{cs.outcome}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FINAL ADVISORY: Quick Contact Center */}
      <section className="bg-gray-50 py-16 px-6 border-t border-gray-100 flex flex-col items-center text-center">
         <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">Secure Your Strategic Audit Today.</h3>
            <div className="flex gap-4 justify-center flex-col md:flex-row">
               <a href="tel:+919966109191" className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all">
                  <Phone size={16} /> Strategy Call
               </a>
               <a href="mailto:advisor@schoolmart.in" className="flex items-center gap-2 px-8 py-4 border border-gray-100 text-gray-700 font-black rounded-xl text-[10px] uppercase tracking-widest hover:border-sm-blue hover:text-sm-blue transition-all">
                  <Mail size={16} /> Request Deck
               </a>
            </div>
         </div>
      </section>

    </main>
  );
};

export default Fundraising;
