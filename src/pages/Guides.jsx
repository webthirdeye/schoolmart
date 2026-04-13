// src/pages/Guides.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Scroll, Target, ShieldCheck, Microscope, ArrowUpRight, CheckCircle2, Layers, Zap, GraduationCap, Award, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { formatImgUrl } from '../utils/formatters';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Knowledge Base 2025',
    titleHtml: 'Strategy <br/> <span class="text-[#004a8e] italic font-serif lowercase tracking-normal">for</span> <br/> Compliance.',
    subtitle: 'Deep-dive into our institutional strategy handbooks and regulatory frameworks.',
  },
  actionCard: {
    titleHtml: 'Request <br/> Strategy Audit.',
    btnText: 'Join Network',
  },
  heroImage: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&q=80',
  subBlocks: [
    { title: 'NEP 2024', subtitle: 'COMPLIANCE', icon: 'ShieldCheck' },
    { title: 'Parent Psychology', subtitle: 'STRATEGY', icon: 'Target' },
    { title: 'Campus Safety', subtitle: 'PROTOCOL', icon: 'BookOpen' },
  ],
  infoGrid: {
    titleHtml: 'Strategic <span class="text-[#004a8e]">Institutional growth.</span>',
    points: ['Validated Audits', 'Compliance Mapping', 'Enrollment Funnels', 'Growth Roadmap'],
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80',
  },
  featured: {
    t: 'The Parents Magnet',
    c: 'Enrollment Strategy',
    d: 'How to redesign your school identity to attract the premium segment without losing heritage.',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    tags: ['Branding', 'Admissions', 'Psychology']
  },
  // Mapping the environments style cards
  caseStudies: [
    { t: 'Digital Transformation', c: 'Technology', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80' },
    { t: 'Color Psychology', c: 'Interiors', img: 'https://images.unsplash.com/photo-1541829070764-84a7d30dee62?w=800&q=80' },
    { t: 'Sustainable Labs', c: 'Science', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80' },
    { t: 'Inclusive Play', c: 'Sports', img: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80' },
    { t: 'Library Re-imagined', c: 'Design', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80' },
    { t: 'Campus Safety 2025', c: 'Protocol', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80' },
    { t: 'Marketing Roadmap', c: 'Enrollment', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' },
    { t: 'Innovation Hubs', c: 'Growth', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80' },
  ],
};

const ICONS = { ShieldCheck, Target, BookOpen, Layers, Zap, GraduationCap, Award };

const Guides = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const { blocks, loading } = useCMSPage('guides');
  
  const d = blocks?.guides_page_content || DEFAULT_CONTENT;
  const heroData = blocks?.guides_page_content || d.hero;
  const items = d.caseStudies || DEFAULT_CONTENT.caseStudies;

  // Instant loading

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4">
        
        {/* SECTION 1: DYNAMIC HERO (AS REQUESTED) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 mb-2 lg:mb-6">
           <div className="md:col-span-12 lg:col-span-7 bg-white rounded-[40px] p-8 lg:p-10 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[300px] lg:min-h-[380px]">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="px-5 py-1.5 bg-gray-50 text-[#004a8e] font-black rounded-full text-[11px] uppercase tracking-[0.2em] mb-4 w-fit border border-gray-100 relative z-10">
                 <Sparkles size={14} className="inline mr-2" /> {heroData?.badge || 'Knowledge Base 2025'}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black font-heading leading-[0.85] mb-6 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroData?.titleHtml || 'Strategy <br/> <span class="text-[#004a8e] italic font-serif lowercase tracking-normal">for</span> <br/> Compliance.' }} />
              <p className="text-gray-400 text-[12px] lg:text-[13px] font-bold uppercase tracking-widest max-w-sm leading-relaxed relative z-10">
                 {heroData?.subtitle || 'Deep-dive into our institutional strategy handbooks and regulatory frameworks.'}
              </p>
           </div>

           <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-3 lg:gap-4">
              <div className="flex-1 bg-gray-100 rounded-[40px] overflow-hidden border border-gray-100 shadow-sm relative group min-h-[250px]">
                 <CMSMedia 
                    mediaType={heroData?.mediaType} 
                    mediaUrl={heroData?.mediaUrl} 
                    fallbackImg={d.heroImage} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                 />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              <div className="bg-white rounded-[40px] p-8 text-gray-900 flex flex-col justify-between shadow-sm border border-gray-100 group relative overflow-hidden min-h-[200px]">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                 <div className="flex items-center justify-between relative z-10">
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Strategic Partner Service</span>
                    <ArrowUpRight className="text-gray-400 group-hover:text-sm-blue transition-colors" size={24} />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mt-10 mb-8 relative z-10 text-gray-900" dangerouslySetInnerHTML={{ __html: d.actionCard?.titleHtml || 'Request <br/> Strategy Audit.' }} />
                 <button 
                   onClick={() => navigate('/registration')}
                   className="w-full py-4 bg-sm-blue text-white font-black rounded-xl text-[12px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-500/20 hover:bg-gray-900 relative z-10"
                 >
                    {d.actionCard?.btnText || 'Join Network'}
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION 2: THE ENVIRONMENTS-STYLE MASONRY (AS REQUESTED) */}
        <section className="py-2 border-t border-gray-100 mt-2">
           <div className="flex items-center justify-between py-4 mb-4">
              <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-[0.2em] font-heading">Institutional Strategy Guides</h2>
              <div className="h-[1px] flex-grow mx-8 bg-gray-100" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((work, i) => (
                 <CatalogueCard 
                   key={i}
                   work={{ name: work.t, subcategory: work.c, image: work.img }} 
                   isSelected={selectedItem?.t === work.t} 
                   onClick={() => setSelectedItem(selectedItem?.t === work.t ? null : work)} 
                   onAction={() => navigate(`/guides/${work.t.toLowerCase().replace(/\s+/g, '-')}`)}
                   actionText="Read More"
                   themeColor="bg-[#004a8e]"
                   ringColor="ring-blue-100"
                   textColor="text-[#004a8e]"
                 />
              ))}
           </div>
        </section>

        {/* SECTION 3: EDITORIAL BREAKOUT - THE PARENTS MAGNET */}
        <section className="my-10">
           <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row min-h-[500px] group">
              <div className="flex-1 relative overflow-hidden">
                 <img src={d.featured?.img} alt="Featured" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                 <div className="absolute top-6 left-6 flex gap-2">
                    {(d.featured?.tags || []).map((tag, i) => (
                       <span key={i} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#004a8e] font-black rounded-full text-[8px] uppercase tracking-widest shadow-sm">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>
              <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center bg-white relative">
                 <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#004a8e]/5 rounded-full blur-3xl -mr-32 -mb-32" />
                 <span className="text-[12px] font-black text-[#004a8e] uppercase tracking-[0.4em] mb-6 block">{d.featured?.c}</span>
                 <h2 className="text-4xl lg:text-6xl font-black font-heading leading-[0.9] mb-8 tracking-tighter text-gray-900 uppercase">
                    {d.featured?.t}
                 </h2>
                 <p className="text-gray-400 text-[13px] lg:text-[13px] font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-sm">
                    {d.featured?.d}
                 </p>
                 <button 
                   onClick={() => navigate(`/guides/${d.featured?.t.toLowerCase().replace(/\s+/g, '-')}`)}
                   className="inline-flex items-center gap-4 text-[13px] font-black text-[#004a8e] uppercase tracking-widest group/btn"
                 >
                    Get Full Access <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" size={18} />
                 </button>
              </div>
           </div>
        </section>

      </div>
    </main>
  );
};

export default Guides;

