import React from 'react';
import { getIcon } from '../utils/iconMap';
import { useCMSPage } from '../hooks/useCMSBlock';
import { ArrowRight, Award, Settings } from 'lucide-react';

const Manufacturing = () => {
  const { blocks, loading } = useCMSPage('manufacturing');

  const hero = blocks?.manufacturing_hero || {
    badge: 'In-House Precision',
    titleHtml: 'Look At <br/> <span class="text-[#004a8e]">Schoolmart\'s</span> <br/> Manufacturing.',
    description: 'WE TAKE PRIDE IN OUR IN-HOUSE MANUFACTURING FACILITIES, WHICH ENCOMPASS MODULAR FURNITURE MACHINERY, SOLID WOOD MANUFACTURING, METAL WORKS, AND POWDER COATING.',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      'https://images.unsplash.com/photo-1565034946487-077786996e27?w=600&q=80'
    ],
    partnerStat: '4K+',
    partnerLabel: 'Partner Schools'
  };

  const capabilities = blocks?.manufacturing_capabilities || {
    heading: 'Core Capabilities',
    subline: 'Institutional Grade Execution',
    items: [
      { t: 'Modular Furniture', d: 'High-precision systems for institutional scalability.', u: 'WOODWORKING', icon: 'Layers' },
      { t: 'Solid Wood Unit', d: 'Traditional craftsmanship integrated with modern tech.', u: 'ARTISANAL', icon: 'PenTool' },
      { t: 'Advanced Metal Works', d: 'Industrial grade fabrication for heavy-use environments.', u: 'STRUCTURAL', icon: 'Box' },
      { t: 'Powder Coating Lab', d: 'automated durability finishes for zero-maintenance results.', u: 'FINISHING', icon: 'Drill' },
      { t: 'Robotic Welding', d: 'Consistent precision in structural joint integrity.', u: 'P.4.0 SYSTEMS', icon: 'Cpu' },
      { t: 'Internal R&D', d: 'Continuous improvement on ergonomics and materials.', u: 'INNOVATION', icon: 'Microscope' }
    ]
  };

  const quality = blocks?.manufacturing_quality || {
    titleHtml: 'Quality <br/> <span class="not-italic text-[#004a8e]">Assurance.</span>',
    description: 'OUR STATE-OF-THE-ART MANUFACTURING FACILITIES ADHERE TO STRINGENT QUALITY TESTING PRACTICES.',
    boxes: [
      { t: 'Material Selection', d: 'Sourcing of high-grade raw materials with verified stress-test certificates.', icon: 'ShieldCheck' },
      { t: 'Technical Inspection', d: 'Multi-stage QC checkpoints ensuring zero-defect production cycles.', icon: 'Zap' }
    ]
  };

  const cta = blocks?.cta_whatsapp || {
    headline: 'Institutional Infrastructure Excellence.',
    description: 'AN INITIATIVE OF THE THIRDEYE GROUP, UTILIZING PROPRIETARY IN-HOUSE MANUFACTURING UNITS ACROSS INDIA.',
    stats: [
      { value: '7+', label: 'YEARS EXP' },
      { value: '100%', label: 'IN-HOUSE' }
    ],
    whatsappNumber: '919966109191'
  };

  // Instant fallback rendering

  return (
    <main className="min-h-screen bg-white pb-10 overflow-hidden relative font-sans">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6">
        
        {/* SECTION 1: CLEAN INDUSTRIAL HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8 lg:mb-12 py-6">
           <div className="lg:col-span-6 space-y-6 lg:pr-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-gray-900 font-black rounded-full text-[11px] uppercase tracking-[0.2em] border border-gray-200">
                 <Settings size={12} className="text-[#004a8e]" /> {hero.badge}
              </span>
              <h1 
                className="text-4xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase"
                dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
              />
              <p className="text-gray-400 text-[13px] lg:text-sm font-bold uppercase tracking-[0.1em] leading-relaxed max-w-lg">
                 {hero.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                 <button className="px-8 py-4 bg-[#004a8e] text-white font-black rounded-2xl hover:bg-gray-900 transition-all uppercase tracking-[0.2em] text-[12px] flex items-center gap-3 shadow-sm">
                    Facility Tour <ArrowRight size={16} />
                 </button>
                 <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <Award className="text-[#004a8e]" size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">ISO 9001 Certified Facilities</span>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-6 grid grid-cols-2 gap-3 h-[400px] lg:h-[500px]">
              <div className="rounded-[30px] lg:rounded-[40px] overflow-hidden border border-gray-100 shadow-sm relative group">
                 <img src={hero.images[0]} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" alt="Factory Floor" />
              </div>
              <div className="flex flex-col gap-3">
                 <div className="flex-1 rounded-[30px] lg:rounded-[40px] overflow-hidden border border-gray-100 shadow-sm relative group">
                    <img src={hero.images[1]} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" alt="Robotic Arm" />
                 </div>
                 <div className="flex-1 bg-[#004a8e] rounded-[30px] lg:rounded-[40px] p-8 flex flex-col justify-end text-white shadow-sm overflow-hidden relative">
                    <span className="text-4xl lg:text-6xl font-black block leading-none mb-1 tracking-tighter">{hero.partnerStat}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">{hero.partnerLabel}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* SECTION 2: THE MANUFACTURING WORKFLOW */}
        <div className="space-y-4 mb-8 lg:mb-12">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{capabilities.heading}</h2>
              <span className="text-[12px] font-black text-[#004a8e] uppercase tracking-[0.3em]">{capabilities.subline}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.items.map((card, i) => {
                const Icon = getIcon(card.icon);
                return (
                  <div key={i} className="group flex items-start gap-6 p-8 bg-white rounded-[35px] border border-gray-100 hover:border-[#004a8e] transition-all cursor-pointer">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#004a8e] group-hover:bg-[#004a8e] group-hover:text-white transition-all">
                        <Icon size={24} />
                     </div>
                     <div className="flex-1">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-2">{card.u}</span>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-[#004a8e] transition-colors">{card.t}</h3>
                        <p className="text-[12px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                           {card.d}
                        </p>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* SECTION 3: THE TECHNICAL BENCHMARK */}
        <div className="bg-gray-50 rounded-[40px] lg:rounded-[60px] p-8 lg:p-14 border border-gray-100 relative overflow-hidden mb-8 lg:mb-12">
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-6">
                 <h2 
                    className="text-4xl lg:text-6xl font-black text-gray-900 leading-[0.85] tracking-tighter uppercase italic"
                    dangerouslySetInnerHTML={{ __html: quality.titleHtml }}
                 />
                 <p className="text-gray-400 text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    {quality.description}
                 </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {quality.boxes.map((box, i) => {
                   const BoxIcon = getIcon(box.icon);
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
                   return (
                    <div key={i} className="p-8 bg-white rounded-[35px] border border-gray-100 hover:border-[#004a8e] transition-all group">
                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-[#004a8e] group-hover:bg-[#004a8e] group-hover:text-white transition-all">
                          <BoxIcon size={24} />
                       </div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-3 leading-none">{box.t}</h3>
                       <p className="text-[12px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed">
                          {box.d}
                       </p>
                    </div>
                   );
                 })}
              </div>
           </div>
        </div>

        {/* SECTION 4: INSTITUTIONAL FOOTER */}
        <div className="bg-white rounded-[40px] p-10 lg:p-16 flex flex-col items-center text-center text-gray-900 border border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-sm-blue/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-sm-blue/10 transition-all duration-1000" />
           
           <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-4 leading-none relative z-10">
              {cta.headline}
           </h3>
           <p className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] max-w-2xl mb-12 leading-relaxed text-gray-400 relative z-10">
              {hero.description}
           </p>
           <div className="flex flex-wrap justify-center gap-10 lg:gap-20 relative z-10">
              {cta.stats?.map((stat, i) => (
                <div key={i} className="flex items-center gap-10 lg:gap-20">
                  <div className="text-center">
                    <span className="text-4xl lg:text-6xl font-black text-gray-900 block mb-1 tracking-tighter">{stat.value}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                  </div>
                  {i < cta.stats.length - 1 && <div className="w-px bg-gray-100 hidden sm:block h-12" />}
                </div>
              ))}
           </div>
        </div>

      </div>
    </main>
  );
};

export default Manufacturing;

