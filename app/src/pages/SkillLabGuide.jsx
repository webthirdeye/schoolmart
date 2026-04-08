import React from 'react';
import { Zap, Target, Cpu, Activity, ArrowRight, CheckCircle2, Award, Laptop, Settings, Layers, Box, Phone } from 'lucide-react';

const LAB_CONFIGS = [
  {
    title: 'Composite Skill Lab',
    badge: 'Multi-Disciplinary',
    desc: 'Integrated space for Coding, IoT, and AI prototyping with industry-standard hardware.',
    icon: <Cpu size={20} />,
    items: ['AI Micro-controllers', 'IoT Sensors Kit', 'Digital Prototyping Board'],
    color: 'bg-sm-blue',
  },
  {
    title: 'Robotics & STEM',
    badge: 'Hardware Centric',
    desc: 'Modular building blocks and programming tools for robotics competitions and physics experiments.',
    icon: <Settings size={20} />,
    items: ['LEGO Education Kits', 'Drone Tech Hub', 'Industrial Robot Arms'],
    color: 'bg-emerald-600',
  },
  {
    title: 'ATL & Innovation',
    badge: 'Creative Making',
    desc: 'Dedicated tinkering space with 3D printers, laser cutters, and traditional toolsets.',
    icon: <Activity size={20} />,
    items: ['3D Printing Station', 'Laser Cutting Tools', 'Mechanical Workbench'],
    color: 'bg-rose-500',
  },
];

const SkillLabGuide = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT LAB HERO */}
      <section className="bg-gray-950 py-16 px-6 relative overflow-hidden text-white border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-sm-blue/5 skew-x-12 -mr-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sm-blue shadow-xl text-white rounded-full mb-6 border border-sm-blue/20">
               <Zap size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] font-heading">v2025 Blueprints</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Setting Up <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal">Composite</span> Skill Labs.
            </h1>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose max-w-md mb-10">
               Technical blueprints for building future-ready skill hubs. 100% compliant with NITI Aayog & NEP 2020 guidelines for STEM education.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500 flex items-center gap-3">
                 <Box size={18} /> Request Lab Blueprint
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-6 shadow-xl rounded-[30px] border border-white/10 flex flex-col items-center">
                <Target size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black leading-none mb-1">500+</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">Labs <br /> Installed</span>
             </div>
             <div className="bg-white/5 p-6 shadow-xl rounded-[30px] border border-white/10 flex flex-col items-center">
                <Award size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black leading-none mb-1">100%</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">Compliance <br /> Rate</span>
             </div>
          </div>
        </div>
      </section>

      {/* LAB CONFIG GRID: Technical Layout */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
           {LAB_CONFIGS.map((config, i) => (
              <div key={i} className="flex-1 bg-white p-10 rounded-[35px] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden h-full flex flex-col border transition-all hover:scale-[1.02]">
                 <div className={`absolute top-0 right-0 w-24 h-24 ${config.color}/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`} />
                 <div className={`w-12 h-12 ${config.color} text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-blue-500/10`}>{config.icon}</div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{config.badge}</span>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{config.title}</h3>
                 <p className="text-gray-500 text-[11px] leading-relaxed mb-10 flex-grow min-h-[4rem] line-clamp-3">{config.desc}</p>
                 <div className="space-y-4 pt-8 border-t border-gray-50 mt-auto">
                    {config.items.map((item, j) => (
                       <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight line-clamp-1">{item}</span>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* CONSULTATION STRIP */}
      <section className="py-12 bg-sm-blue px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border border-white/10 p-12 rounded-[50px] gap-8 text-white relative">
            <div className="absolute inset-0 bg-black/5 rounded-[50px]" />
            <div className="relative z-10 text-center md:text-left">
               <h4 className="text-xl font-black uppercase tracking-tighter mb-2 leading-none">Book a technical facility audit.</h4>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-loose">On-site infrastructure assessments & technical handholding.</p>
            </div>
            <button className="relative z-10 px-10 py-5 bg-white text-sm-blue font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white hover:shadow-2xl transition-all shadow-xl flex items-center gap-3">
               <Phone size={18} /> Schedule Audit
            </button>
         </div>
      </section>
    </main>
  );
};

export default SkillLabGuide;
