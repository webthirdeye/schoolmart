import React from 'react';
import { getIcon } from '../utils/iconMap';
import { useCMSPage } from '../hooks/useCMSBlock';
import { Globe, ArrowRight, MessageCircle, Phone } from 'lucide-react';

const Corporate = () => {
  const { blocks, loading } = useCMSPage('corporate');
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;

  const hero = blocks?.corporate_hero || {
    badge: 'Foundational Intelligence',
    titleHtml: 'All About <br/> <span class="text-[#004a8e] italic font-serif lowercase tracking-normal">Schoolmart</span> <br/> Consortium.',
    description: 'SCHOOL MART IS A ONE STOP FOR ALL SCHOOL INFRASTRUCTURE NEEDS. A CONSORTIUM OF 16 PANEL ARCHITECTS, 20+ DESIGNERS, SCHOOL INNOVATORS, & EDTECH MAJORS WORKING FROM 4 COUNTRIES.',
    ctaPitchDeck: 'Request Pitch Deck',
    ctaWhatsapp: 'WhatsApp',
    statsValue: '22',
    statsLabel: 'States Active Operational Network'
  };

  const ecosystem = blocks?.corporate_ecosystem?.items || [
    { t: 'Furniture', icon: 'Briefcase' },
    { t: 'Architecture', icon: 'Building2' },
    { t: 'Digital Infra', icon: 'Laptop' },
    { t: 'School Designs', icon: 'Palette' },
    { t: 'Digital Content', icon: 'Monitor' },
    { t: 'Sports', icon: 'Trophy' },
    { t: 'Mathematics', icon: 'CheckCircle2' },
    { t: 'Science', icon: 'FlaskConical' },
    { t: 'Labs / Libraries', icon: 'Library' },
    { t: 'School Branding', icon: 'Target' },
    { t: 'AR + VR Learning', icon: 'Zap' },
    { t: 'Innovation', icon: 'Sparkles' }
  ];

  const strategy = blocks?.corporate_strategy || {
    badge: 'Strategic Advisory',
    title: 'Consultancy At Board Level.',
    description: 'Exposé to latest innovations and edtech products at a lesser price for partner schools.',
    points: ['IN-HOUSE MANUFACTURING', 'EDTECH INNOVATION ACCESS', 'GAMIFICATION SPECIALISTS', 'GLOBAL ARCHITECTURAL PANEL']
  };

  const pillars = blocks?.corporate_pillars?.pillars || [
    { t: 'Quality Protocol', d: 'All products hold TS and ISO 9001 certifications. Durability, performance, and safety tests are audited by experts.', u: 'Standards', icon: 'ShieldCheck' },
    { t: 'Rapid R&D', d: 'Iterative laboratory development ensures we stay at the forefront of global innovation.', u: 'Innovation', icon: 'Microscope' },
    { t: 'Global Logistics', v: 'A rapidly growing network focused on mass production and efficient delivery.', u: 'Supply Chain', icon: 'Globe' },
    { t: 'Expert Design', d: '16 Architects & 20+ Designers creating ergonomic spaces that promote creativity.', u: 'Architecture', icon: 'PenTool' }
  ];

  const cta = blocks?.cta_whatsapp || {
    headline: 'Ready To Talk?',
    description: 'WE HAVE THE EXPERTISE IN GUIDING YOU TO SET UP YOUR NEW CAMPUS PROJECT AND MAXIMIZE PERFORMANCE.',
    whatsappNumber: '919966109191',
    phone: '+91 9966109191'
  };

  // Instant loading

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6">
        {/* 01. VISIONARY HERO */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch mb-6">
          <div className="flex-[2] bg-white border border-gray-100 rounded-[30px] lg:rounded-[40px] p-8 lg:p-14 text-gray-900 relative flex flex-col justify-center min-h-[450px] lg:min-h-[550px] shadow-sm overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none" />
            
            <div className="inline-block px-5 py-1.5 bg-blue-50 text-[#004a8e] font-black rounded-full mb-8 text-[11px] uppercase tracking-[0.2em] w-fit border border-[#004a8e]/10 relative z-10">
              {hero.badge}
            </div>
            
            <h1 
              className="text-4xl lg:text-7xl font-black leading-[0.9] tracking-tighter mb-8 uppercase max-w-2xl relative z-10"
              dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
            />
            
            <p className="text-gray-400 text-[12px] lg:text-[13px] font-black uppercase tracking-[0.15em] max-w-lg mb-12 leading-relaxed relative z-10">
              {hero.description}
            </p>
            
            <div className="flex flex-wrap gap-4 relative z-10">
              <button className="px-8 py-4 bg-[#004a8e] text-white font-black rounded-full hover:bg-gray-900 transition-all uppercase tracking-[0.15em] text-[12px] flex items-center gap-3 shadow-lg active:scale-95">
                {hero.ctaPitchDeck} <ArrowRight size={16} />
              </button>
              <a href={`https://wa.me/${hero.ctaWhatsapp === 'WhatsApp' ? '919966109191' : hero.ctaWhatsapp}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white border border-gray-200 text-[#25D366] font-black rounded-full hover:bg-gray-50 transition-all uppercase tracking-[0.15em] text-[12px] flex items-center gap-3 shadow-sm">
                WhatsApp <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div className="flex-1 bg-[#004a8e] rounded-[30px] lg:rounded-[40px] p-10 flex flex-col items-center justify-center text-center text-white shadow-sm relative overflow-hidden group">
            <Globe className="w-24 h-24 text-white/10 mb-8" strokeWidth={1} />
            <div className="relative z-10">
              <span className="text-7xl lg:text-9xl font-black leading-none tracking-tighter block mb-2">{hero.statsValue}</span>
              <p className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] leading-tight opacity-70">
                {hero.statsLabel.split(' ').slice(0, 2).join(' ')} <br/> {hero.statsLabel.split(' ').slice(2).join(' ')}
              </p>
            </div>
          </div>
        </div>

        {/* 02. ECOSYSTEM GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6 lg:mb-8">
          {ecosystem.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={i} className="bg-white p-4 lg:p-6 rounded-[20px] lg:rounded-[30px] border border-gray-100 flex flex-col items-center justify-center gap-4 group hover:border-[#004a8e] transition-all cursor-pointer">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-50 rounded-xl lg:rounded-2xl flex items-center justify-center text-[#004a8e] group-hover:bg-[#004a8e] group-hover:text-white transition-all transform animate-in">
                  <Icon size={24} />
                </div>
                <h3 className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.2em] text-center text-gray-500 group-hover:text-[#004a8e] transition-colors">{item.t}</h3>
              </div>
            );
          })}
        </div>

        {/* 03. STRATEGIC NARRATIVE & PILLARS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6 lg:mb-8">
          <div className="lg:col-span-4 bg-gray-50 rounded-[30px] lg:rounded-[40px] p-8 lg:p-12 flex flex-col justify-center border border-gray-100">
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-black text-[#004a8e] uppercase tracking-[0.3em] block mb-4">{strategy.badge}</span>
                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading leading-tight uppercase tracking-tighter">
                  {strategy.title.split(' ').slice(0, 1).join(' ')} <br/> {strategy.title.split(' ').slice(1, 3).join(' ')} <br/> {strategy.title.split(' ').slice(3).join(' ')}
                </h2>
              </div>
              <p className="text-[12px] lg:text-[13px] text-gray-400 font-bold uppercase tracking-[0.05em] leading-relaxed">
                {strategy.description}
              </p>
              <div className="space-y-2 pt-2">
                {strategy.points.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                    <ArrowRight size={16} className="text-[#004a8e]" />
                    <span className="text-[8px] lg:text-[11px] font-black text-gray-900 uppercase tracking-widest">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map((box, i) => {
              const Icon = getIcon(box.icon);
              return (
                <div key={i} className="bg-white p-8 rounded-[30px] lg:rounded-[40px] border border-gray-100 flex flex-col justify-between group hover:border-[#004a8e] transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[8px] font-black text-[#004a8e] uppercase tracking-[0.2em]">{box.u}</span>
                    <div className="text-gray-300 group-hover:text-[#004a8e] transition-colors">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tight mb-3 leading-none">{box.t}</h3>
                    <p className="text-[11px] lg:text-[12px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                      {box.d || box.v}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 04. INSTITUTIONAL CTA */}
        <div className="bg-white rounded-[30px] lg:rounded-[50px] p-10 lg:p-16 text-center text-gray-900 relative overflow-hidden flex flex-col items-center border border-gray-100 shadow-sm group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sm-blue/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-sm-blue/10 transition-all duration-1000" />
          <h2 className="text-4xl lg:text-7xl font-black font-heading leading-[0.9] tracking-tighter mb-8 uppercase">
            {cta.headline}
          </h2>
          <p className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] max-w-xl mx-auto opacity-70 leading-relaxed mb-10">
            {cta.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 relative z-10">
            <a href={`https://wa.me/${cta.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-[#25D366] text-white font-black rounded-full hover:scale-105 transition-all uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.3)]">
               Connect On WhatsApp <MessageCircle size={20} />
            </a>
            <a href={`tel:${cta.phone || cta.whatsappNumber}`} className="px-10 py-5 bg-white border border-gray-200 text-[#004a8e] font-black rounded-full hover:bg-gray-50 transition-all uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 shadow-sm">
               Call {cta.phone || cta.whatsappNumber} <Phone size={20} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Corporate;

