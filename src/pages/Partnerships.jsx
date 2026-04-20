import React, { useState } from 'react';
import { getIcon } from '../utils/iconMap';
import { useCMSPage } from '../hooks/useCMSBlock';
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react';

const Partnerships = () => {
  const { blocks, loading } = useCMSPage('partnerships');
  const [activeForm, setActiveForm] = useState(false);

  const hero = blocks?.partnerships_hero || {
    badge: 'Institutional Alliance',
    titleHtml: 'Strategic <span class="text-sm-blue italic font-serif lowercase tracking-normal">Partnerships.</span>',
    description: 'Join India\'s largest educational ecosystem. From academic excellence to infrastructure growth, we provide the toolkit for high-performing institutions.',
    stats: [
      { value: '4K+', label: 'Schools' },
      { value: '28', label: 'States' }
    ]
  };

  const programs = blocks?.partnerships_programs?.programs || [
    {
      category: 'Academic Partnerships',
      title: 'Elevate Educational Quality',
      desc: 'Integrate specialized coaching, curriculum planning, and performance tracking into your school.',
      color: 'bg-sm-blue',
      icon: 'BookOpen',
      items: [
        'IIT / NEET Coaching Integration',
        'Advanced Curriculum Mapping (NEP 2020)',
        'Faculty Training & Empowerment',
        'Student Performance Analytics',
      ],
    },
    {
      category: 'Operational Partnerships',
      title: 'School Development & Facilities',
      desc: 'End-to-end infrastructure management and sports program development for modern campuses.',
      color: 'bg-emerald-600',
      icon: 'Construction',
      items: [
        'Infrastructure Evaluation & Roadmaps',
        'Sports Academy Development',
        'Campus Maintenance Audits',
        'Vendor Ecosystem Management',
      ],
    },
    {
      category: 'Financial Partnerships',
      title: 'Fundraising & Advisory',
      desc: 'Access specialized capital, CSR grants, and investor networks for institutional growth.',
      color: 'bg-amber-600',
      icon: 'TrendingUp',
      items: [
        'CSR Grant Facilitation',
        'Investor & HNI Introductions',
        'Project Proposal Handholding',
        'Operational Yield Management',
      ],
    },
  ];

  const rewards = blocks?.partnerships_rewards || {
    title: 'Institutional Rewards',
    subtitle: 'Exclusive benefits for partner schools.',
    rewards: [
      { title: 'Bulk Discounts', desc: 'Special institutional pricing for large-scale procurement.', icon: 'TrendingUp' },
      { title: 'Loyalty Points', desc: 'Earn points on every order redeemable for upgrades.', icon: 'Star' },
      { title: 'Pilot Access', desc: 'First-move advantage on new EdTech and Lab tools.', icon: 'Zap' },
    ]
  };

  const cta = blocks?.cta_whatsapp || {
    headline: 'speak with our alliance head',
    whatsappNumber: '919966109191'
  };

  // Instant loading

  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT HERO */}
      <section className="bg-gray-50 py-12 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sm-blue" />
              <span className="text-sm-blue text-[12px] font-black uppercase tracking-[0.3em]">{hero.badge}</span>
            </div>
            <h1 
              className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4"
              dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
            />
            <p className="text-gray-500 text-[13px] font-bold uppercase tracking-widest leading-relaxed max-w-lg mb-8">
              {hero.description}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setActiveForm(true)} className="px-8 py-3.5 bg-sm-blue text-white font-black rounded-xl text-[12px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-blue-500/10">
                Join Program <ArrowRight size={14} className="inline ml-2" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
             {hero.stats?.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center w-32 md:w-40">
                   <span className={`text-2xl font-black block ${i === 1 ? 'text-sm-blue' : 'text-gray-900'}`}>{stat.value}</span>
                   <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">{stat.label}</span>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS: Compact Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, i) => {
            const Icon = getIcon(prog.icon);
            return (
              <div key={i} className="flex flex-col bg-white p-8 rounded-[35px] border border-gray-100 hover:shadow-2xl transition-all group">
                 <div className={`w-12 h-12 ${prog.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                    <Icon size={20} />
                 </div>
                 <span className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{prog.category}</span>
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">{prog.title}</h2>
                 <p className="text-gray-500 text-[13px] leading-relaxed mb-8 flex-grow">{prog.desc}</p>
                 <div className="space-y-3 mb-8">
                    {prog.items.map((item, j) => (
                       <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-[13px] font-bold text-gray-600 uppercase tracking-tight">{item}</span>
                       </div>
                    ))}
                 </div>
                 <button onClick={() => setActiveForm(true)} className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl text-[12px] uppercase tracking-widest group-hover:bg-sm-blue group-hover:text-white transition-all">
                    Inquire Now
                 </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* REWARDS: Wide Compact Strip */}
      <section className="bg-gray-50 text-gray-900 py-12 px-6 border-t border-gray-100">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{rewards.title}</h3>
               <p className="text-gray-400 text-[13px] font-black uppercase tracking-widest">{rewards.subtitle}</p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
               {rewards.rewards?.map((r, i) => {
                  const RewardIcon = getIcon(r.icon);
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
                  return (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-all">
                       <div className="w-8 h-8 shrink-0 bg-sm-blue rounded-lg flex items-center justify-center text-white">
                          <RewardIcon size={16} />
                       </div>
                       <div>
                          <h4 className="text-[13px] font-black uppercase tracking-tight mb-1 text-gray-900">{r.title}</h4>
                          <p className="text-gray-400 text-[12px] leading-relaxed">{r.desc}</p>
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>
      </section>

      {/* FORM MODAL */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setActiveForm(false)}>
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Partner Application</h3>
            <p className="text-gray-400 text-[12px] font-bold uppercase tracking-widest mb-8">Initiate your alliance with SchoolMart.</p>
            <form className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium outline-none focus:border-sm-blue transition-all" />
              <input type="text" placeholder="Institution Name" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium outline-none focus:border-sm-blue transition-all" />
              <input type="tel" placeholder="Mobile Number" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium outline-none focus:border-sm-blue transition-all" />
              <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium outline-none focus:border-sm-blue transition-all">
                <option value="">Partnership Type</option>
                <option>Academic Alliances</option>
                <option>Operational Growth</option>
                <option>Yield Management</option>
              </select>
              <button 
                type="button" 
                onClick={() => window.open(`https://wa.me/${cta.whatsappNumber}`, '_blank')}
                className="w-full py-4 bg-sm-blue text-white font-black rounded-2xl uppercase tracking-widest text-[12px] shadow-xl shadow-blue-500/10 hover:bg-gray-900 transition-all mt-4"
              >
                Connect on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Partnerships;

