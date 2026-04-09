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
  const items = d.caseStudies || DEFAULT_CONTENT.caseStudies;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#004a8e] font-black tracking-widest uppercase py-20">Loading Knowledge Hub...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4">
        
        {/* SECTION 1: DYNAMIC HERO (AS REQUESTED) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 mb-4 lg:mb-10">
           <div className="md:col-span-12 lg:col-span-7 bg-white rounded-[40px] p-8 lg:p-14 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[400px] lg:min-h-[500px]">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="px-5 py-1.5 bg-gray-50 text-[#004a8e] font-black rounded-full text-[9px] uppercase tracking-[0.2em] mb-8 w-fit border border-gray-100 relative z-10">
                 <Sparkles size={14} className="inline mr-2" /> {d.hero?.badge || 'Knowledge Base 2025'}
              </div>
              <h1 className="text-4xl lg:text-8xl font-black font-heading leading-[0.85] mb-8 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: d.hero?.titleHtml || 'Strategy <br/> <span class="text-[#004a8e] italic font-serif lowercase tracking-normal">for</span> <br/> Compliance.' }} />
              <p className="text-gray-400 text-[10px] lg:text-[12px] font-bold uppercase tracking-widest max-w-sm leading-relaxed relative z-10">
                 {d.hero?.subtitle || 'Deep-dive into our institutional strategy handbooks and regulatory frameworks.'}
              </p>
           </div>

           <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-3 lg:gap-4">
              <div className="flex-1 bg-gray-100 rounded-[40px] overflow-hidden border border-gray-100 shadow-sm relative group min-h-[250px]">
                 <CMSMedia 
                    mediaType={d.hero?.mediaType} 
                    mediaUrl={d.hero?.mediaUrl} 
                    fallbackImg={d.heroImage} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-transparent" />
                 <div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Cover Story</span>
                    <h3 className="text-base font-black uppercase tracking-tight text-gray-900">Institutional Excellence.</h3>
                 </div>
              </div>

              <div className="bg-[#004a8e] rounded-[40px] p-8 text-white flex flex-col justify-between shadow-lg group relative overflow-hidden min-h-[200px]">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                 <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Strategic Partner Service</span>
                    <ArrowUpRight className="text-white/40 group-hover:text-white transition-colors" size={24} />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mt-10 mb-8 relative z-10" dangerouslySetInnerHTML={{ __html: d.actionCard?.titleHtml || 'Request <br/> Strategy Audit.' }} />
                 <button 
                   onClick={() => navigate('/registration')}
                   className="w-full py-4 bg-white text-[#004a8e] font-black rounded-full text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:bg-sm-blue hover:text-white relative z-10"
                 >
                    {d.actionCard?.btnText || 'Join Network'}
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION 2: THE ENVIRONMENTS-STYLE MASONRY (AS REQUESTED) */}
        <section className="py-2 border-t border-gray-100 mt-4">
           <div className="flex items-center justify-between py-6 mb-8">
              <h2 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.2em] font-heading">Institutional Strategy Guides</h2>
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
        <section className="my-20">
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
                 <span className="text-[10px] font-black text-[#004a8e] uppercase tracking-[0.4em] mb-6 block">{d.featured?.c}</span>
                 <h2 className="text-4xl lg:text-6xl font-black font-heading leading-[0.9] mb-8 tracking-tighter text-gray-900 uppercase">
                    {d.featured?.t}
                 </h2>
                 <p className="text-gray-400 text-[12px] lg:text-[14px] font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-sm">
                    {d.featured?.d}
                 </p>
                 <button 
                   onClick={() => navigate(`/guides/${d.featured?.t.toLowerCase().replace(/\s+/g, '-')}`)}
                   className="inline-flex items-center gap-4 text-[11px] font-black text-[#004a8e] uppercase tracking-widest group/btn"
                 >
                    Get Full Access <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" size={18} />
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION 4: STRATEGIC TOOLKIT (TOOL CARDS) */}
        <section className="mb-16">
           <div className="flex items-center justify-between py-6 mb-8 border-b border-gray-100">
              <h2 className="text-[14px] font-black text-gray-900 uppercase tracking-[0.2em] font-heading">Toolkit & Documents</h2>
              <button className="text-[10px] font-black text-[#004a8e] uppercase tracking-widest flex items-center gap-2">View All <ArrowRight size={14}/></button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                 { t: 'Compliance Matrix', i: <ShieldCheck size={24}/>, d: 'Checklist for NEP 2024 institutional readiness.' },
                 { t: 'Color Palette Guide', i: <Zap size={24}/>, d: 'Standardizing campus visuals for focus and performance.' },
                 { t: 'Growth Index', i: <Target size={24}/>, d: 'Mathematical model for institutional ROI planning.' }
              ].map((tool, i) => (
                 <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-sm-blue transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#004a8e] group-hover:bg-[#004a8e] group-hover:text-white transition-all transform group-hover:rotate-6">
                       {tool.i}
                    </div>
                    <div className="mt-8">
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 leading-none">{tool.t}</h3>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed mb-6">
                          {tool.d}
                       </p>
                       <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                          <span className="text-[9px] font-black text-[#004a8e] uppercase tracking-[0.2em]">Institutional PDF</span>
                          <Share2 size={16} className="text-gray-300 hover:text-sm-blue transition-colors" />
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* FINAL STRATEGIC BLOCK */}
        <section className="py-10 border-t border-gray-100 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-[40px] p-8 lg:p-14 shadow-sm border border-gray-100">
           <div className="lg:col-span-7">
              <h2 className="text-4xl lg:text-7xl font-black text-gray-900 font-heading mb-8 leading-[0.85] uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: d.infoGrid?.titleHtml }} />
              <div className="grid grid-cols-2 gap-4">
                 {(d.infoGrid?.points || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 p-6 rounded-2xl hover:border-[#004a8e]/20 border border-transparent transition-all">
                       <CheckCircle2 size={18} className="text-[#004a8e]" />
                       {item}
                    </div>
                 ))}
              </div>
              <button 
                onClick={() => navigate('/registration')}
                className="inline-flex items-center gap-3 mt-10 px-10 py-5 bg-[#004a8e] text-white font-black rounded-full text-[11px] uppercase tracking-widest shadow-2xl hover:bg-gray-900 transition-all active:scale-95"
              >
                 Request Strategy Audit <ArrowRight size={18} />
              </button>
           </div>
            <div className="lg:col-span-5 rounded-[40px] overflow-hidden border border-gray-100 h-[400px] lg:h-[550px]">
               <img src={d.infoGrid?.img} alt="Strategy Audit" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
            </div>
        </section>

      </div>
    </main>
  );
};

export default Guides;
