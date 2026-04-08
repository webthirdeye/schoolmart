import React from 'react';
import { Target, CheckCircle2, Award, Zap, ArrowRight, Star, Building2, Layout, Users, Phone, MapPin } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Greenfield K-12 Campus',
    subtitle: 'Hyderabad, India',
    desc: 'Complete campus setup including furniture, STEM labs, and sports infrastructure.',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    tags: ['A-Z Implementation', 'Modern Architecture'],
    color: 'bg-sm-blue',
  },
  {
    title: 'Digital Play Space Revamp',
    subtitle: 'Bangalore, India',
    desc: 'Transforming traditional preschools into tech-enabled creative play zones.',
    img: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800&q=80',
    tags: ['Soft Play', 'Digitization'],
    color: 'bg-rose-500',
  },
  {
    title: 'NITI Aayog Skill Hub',
    subtitle: 'Delhi NCR, India',
    desc: 'Turnkey setup of composite skill labs with AI and Robotics modules.',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    tags: ['Technical Lab', 'Skill Centre'],
    color: 'bg-emerald-600',
  },
];

const CompletedProjects = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT PROJECTS HERO */}
      <section className="bg-gray-950 py-16 px-6 relative overflow-hidden text-white border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-sm-blue/5 skew-x-12 -mr-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sm-blue/20 text-sm-blue rounded-full mb-6 border border-sm-blue/20">
               <Target size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] font-heading text-sm-blue">Institutional Portfolio</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Completed <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal text-6xl">Portfolios.</span>
            </h1>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose max-w-sm mb-10">
               Exploring 500+ campus success stories across India. From boutique preschools to massive K-12 institutional hubs.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-950 transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500 flex items-center gap-3">
                 View All Projects (50+)
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-6 shadow-xl rounded-[30px] border border-white/10 flex flex-col items-center">
                <Building2 size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black leading-none mb-1">12</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">States <br /> Covered</span>
             </div>
             <div className="bg-white/5 p-6 shadow-xl rounded-[30px] border border-white/10 flex flex-col items-center">
                <Award size={32} className="text-sm-blue mb-4" />
                <span className="text-2xl font-black leading-none mb-1">500+</span>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">Completed <br /> Projects</span>
             </div>
          </div>
        </div>
      </section>

      {/* COMPACT BENTO GRID: Project Showcase */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           {PROJECTS.map((p, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group overflow-hidden h-full flex flex-col border transition-all hover:scale-[1.02]">
                 <div className="h-56 relative overflow-hidden shrink-0">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-100" />
                    <div className={`absolute top-4 left-4 ${p.color} text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl shadow-black/20 flex items-center gap-2`}><MapPin size={10} /> {p.subtitle}</div>
                 </div>
                 <div className="p-10 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-6">
                       {p.tags.map((tag, t) => (
                          <span key={t} className="text-[7px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 rounded-full px-3 py-1">{tag}</span>
                       ))}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{p.title}</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed mb-10 flex-grow line-clamp-3">{p.desc}</p>
                    <button className="w-fit flex items-center gap-3 text-sm-blue font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all">
                       Explore Case Study <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* CALL STRIP */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-100 flex flex-col items-center justify-center text-center">
         <h4 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">Discuss your campus transformation.</h4>
         <button className="px-12 py-5 bg-gray-950 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all shadow-2xl active:scale-95 duration-500 flex items-center gap-4">
            <Phone size={18} /> Schedule Project Review
         </button>
      </section>
    </main>
  );
};

export default CompletedProjects;
