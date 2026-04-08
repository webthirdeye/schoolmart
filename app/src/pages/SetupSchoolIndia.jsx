import React from 'react';
import { Building2, Shield, Target, FileText, ArrowRight, CheckCircle2, Award, Phone } from 'lucide-react';

const SETUP_PHASES = [
  {
    phase: 'Trust & Society',
    title: 'Legal Foundation',
    desc: 'Registering your educational society or trust with specialized bylaws to support institutional growth.',
    icon: <Shield size={20} />,
    items: ['Trust Deed Registration', 'Bylaws Drafting', 'Educational Clause Norms'],
    color: 'bg-sm-blue',
  },
  {
    phase: 'Infrastructure',
    title: 'Site & Architecture',
    desc: 'Site survey and design that meets board-specific land norms and student safety standards.',
    icon: <Building2 size={20} />,
    items: ['CBSE/ICSE Land Norms', 'Campus Master Planning', 'Building Safety Certificates'],
    color: 'bg-emerald-600',
  },
  {
    phase: 'Affiliation',
    title: 'Registration & Finalize',
    desc: 'Documentation and process handholding for online registration with board portals.',
    icon: <Target size={20} />,
    items: ['Documentation Audit', 'Inspection Mock Drills', 'On-site Compliance Check'],
    color: 'bg-amber-600',
  },
];

const SetupSchoolIndia = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT COMPLIANCE HERO */}
      <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full mb-6 border border-emerald-100">
               <span className="text-[9px] font-black uppercase tracking-[.3em]">Compliance Masterclass</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6 text-gray-900">
              Setting Up A <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal">School</span> In India.
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-lg mb-10">
               From legal foundation to CBSE/ICSE board norms, our institutional roadmap ensures your school project stays on track and compliant.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group">
                Checkboard Norms <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100">
             <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl"><CheckCircle2 size={24} /></div>
                   <div>
                      <h4 className="text-[12px] font-black uppercase tracking-tight text-gray-900 mb-1 leading-none">150+ Schools</h4>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Facilitated Setup</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-xl"><Award size={24} /></div>
                   <div>
                      <h4 className="text-[12px] font-black uppercase tracking-tight text-gray-900 mb-1 leading-none">Trust Foundation</h4>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Legal & Strategy</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SETUP PHASE GRID: Compact Timeline Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
           {SETUP_PHASES.map((phase, i) => (
              <div key={i} className="flex-1 bg-white p-10 rounded-[35px] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden h-full">
                 <div className={`absolute top-0 right-0 w-24 h-24 ${phase.color}/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`} />
                 <div className={`w-12 h-12 ${phase.color} text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl`}>{phase.icon}</div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{phase.phase}</span>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{phase.title}</h3>
                 <p className="text-gray-500 text-[11px] leading-relaxed mb-10 flex-grow min-h-[4rem] line-clamp-3">{phase.desc}</p>
                 <div className="space-y-4 pt-8 border-t border-gray-50">
                    {phase.items.map((item, j) => (
                       <div key={j} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-sm-blue" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight line-clamp-1">{item}</span>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="py-16 px-6 bg-gray-950 text-white rounded-[50px] mx-6 mb-12 flex flex-col items-center justify-center text-center group">
         <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Expert Affiliation & Legal Consultation.</h3>
         <button className="flex items-center gap-4 px-10 py-5 bg-white text-gray-950 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue hover:text-white transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500">
            <Phone size={18} /> Schedule Strategy Call
         </button>
      </section>
    </main>
  );
};

export default SetupSchoolIndia;
