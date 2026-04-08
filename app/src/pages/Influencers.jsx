import React from 'react';
import { Users, Star, ArrowRight, CheckCircle2, Award, Zap, Building2, Phone, Globe, Camera, Share2, Radio } from 'lucide-react';

const PARTNERSHIP_MODELS = [
  {
    title: 'Content Creators',
    subtitle: 'Micro-Influencers',
    desc: 'Education-focused creators with 10k+ reach. Focused on campus tours and product reviews.',
    icon: <Camera size={20} />,
    items: ['Free Product Kits', 'Campus Access', 'Affiliate Commissions'],
    color: 'bg-rose-500',
  },
  {
    title: 'Academic Advocacy',
    subtitle: 'Institutional Voices',
    desc: 'Senior educators or architects who advocate for modern, safe learning environments.',
    icon: <Users size={20} />,
    items: ['Thought Leadership', 'Expert Panels', 'Design Collaboration'],
    color: 'bg-emerald-600',
  },
  {
    title: 'Brand Ambassadors',
    subtitle: 'Exclusive Partners',
    desc: 'Select individuals who embody our mission to transform global education infrastructure.',
    icon: <Award size={20} />,
    items: ['Annual Retainer', 'Media Presence', 'Exclusive Events'],
    color: 'bg-sm-blue',
  },
];

const Influencers = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT PARTNER HERO */}
      <section className="bg-gray-50 py-16 px-6 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-rose-500/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 shadow-xl text-white rounded-full mb-6 border border-gray-800">
               <Star size={14} className="text-sm-blue" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] font-heading">Partner v2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Join as <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal text-6xl">Influencers.</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-sm mb-10">
               Collaborate with India's fastest-growing institutional brand. Driving impact across 500+ premium campuses nationwide.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-gray-950 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500 flex items-center gap-3">
                 Register Interest <Radio size={18} />
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center p-12 bg-white rounded-[50px] shadow-2xl border border-gray-100 relative overflow-hidden">
             <div className="absolute inset-0 bg-sm-blue/5 animate-pulse" />
             <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="flex -space-x-4 mb-4">
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden"><img src="https://i.pravatar.cc/100?u=1" alt="p" /></div>
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden"><img src="https://i.pravatar.cc/100?u=2" alt="p" /></div>
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden"><img src="https://i.pravatar.cc/100?u=3" alt="p" /></div>
                </div>
                <div className="flex items-center gap-2 text-sm-blue font-black tracking-widest uppercase text-[10px]">
                   <Share2 size={14} /> Join 250+ Voices
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP GRID: Compact Models */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
           {PARTNERSHIP_MODELS.map((model, i) => (
              <div key={i} className="flex-1 bg-white p-10 rounded-[35px] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden h-full flex flex-col border transition-all hover:scale-[1.02]">
                 <div className={`absolute top-0 right-0 w-24 h-24 ${model.color}/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`} />
                 <div className={`w-12 h-12 ${model.color} text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-blue-500/10`}>{model.icon}</div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{model.subtitle}</span>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{model.title}</h3>
                 <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest leading-relaxed mb-10 flex-grow min-h-[4rem] line-clamp-3">{model.desc}</p>
                 <div className="space-y-4 pt-8 border-t border-gray-100 mt-auto">
                    {model.items.map((it, j) => (
                       <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className={model.color.replace('bg-', 'text-')} />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight line-clamp-1">{it}</span>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="py-16 px-6 bg-gray-950 text-white rounded-[50px] mx-6 mb-12 flex flex-col items-center justify-center text-center">
         <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Building institutional brand excellence, together.</h2>
         <div className="flex gap-4">
            <button className="px-10 py-5 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500 flex items-center gap-3">
               Apply for Partnerships
            </button>
         </div>
      </section>
    </main>
  );
};

export default Influencers;
