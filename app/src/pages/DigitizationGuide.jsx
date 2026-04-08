import React from 'react';
import { Smartphone, Cloud, Cpu, Shield, ArrowRight, CheckCircle2, Download, Award, Laptop, Settings } from 'lucide-react';

const DIGITIZATION_BLOCKS = [
  {
    title: 'Hardware Infrastructure',
    desc: 'Campus-wide Wi-Fi, Interactive Flat Panels, and Student Computing Devices.',
    icon: <Laptop size={20} />,
    items: ['6E Wireless Access Points', '75/86" 4K Smart Panels', 'Cloud-managed Networking'],
  },
  {
    title: 'ERP & LMS Ecosystem',
    desc: 'Unified school management and learning platforms for seamless administration.',
    icon: <Settings size={20} />,
    items: ['Automated Fee Management', 'Student Attendance App', 'Learning Progress Tracking'],
  },
  {
    title: 'Teacher Empowerment',
    desc: 'Continuous training modules for staff to master digital pedagogy tools.',
    icon: <Award size={20} />,
    items: ['EdTech Certification', 'Content Creation Tools', 'Collaborative Workshops'],
  },
];

const DigitizationGuide = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT TECH HERO */}
      <section className="bg-gray-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-sm-blue/10 skew-x-12 -mr-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sm-blue/20 text-sm-blue rounded-full mb-6 border border-sm-blue/20">
               <Smartphone size={12} />
               <span className="text-[9px] font-black uppercase tracking-widest">v2.0 Digitization</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Complete Guide <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal">to</span> School Digitization.
            </h1>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose max-w-md mb-10">
               India's most comprehensive blueprint for transforming traditional schools into AI-enabled smart campuses.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3.5 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-950 transition-all shadow-xl shadow-blue-500/20 active:scale-95 duration-500">
                Download Master Guide
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md">
             <div className="grid grid-cols-2 gap-3">
                <div className="w-24 h-24 bg-sm-blue/20 rounded-2xl flex flex-col items-center justify-center border border-sm-blue/20">
                   <span className="text-2xl font-black text-white">100%</span>
                   <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Secure</span>
                </div>
                <div className="w-24 h-24 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10">
                   <span className="text-2xl font-black text-white">2025</span>
                   <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Ready</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* COMPACT BENTO GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIGITIZATION_BLOCKS.map((block, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-[35px] p-10 group hover:bg-white hover:shadow-2xl transition-all">
                <div className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-sm-blue mb-8 group-hover:bg-sm-blue group-hover:text-white transition-all">{block.icon}</div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">{block.title}</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed mb-8 min-h-[3rem]">{block.desc}</p>
                <div className="space-y-3">
                  {block.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING STRIP */}
      <section className="py-12 bg-sm-blue px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <h4 className="text-xl font-black uppercase tracking-tight">Need a customized audit for your school?</h4>
            <button className="px-10 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-2xl">
               Book Free Digital Audit
            </button>
         </div>
      </section>
    </main>
  );
};

export default DigitizationGuide;
