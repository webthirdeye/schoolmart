// src/pages/Guides.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Scroll, Target, ShieldCheck, Microscope, ArrowUpRight, CheckCircle2, Layers, Zap, GraduationCap, Award, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { formatImgUrl } from '../utils/formatters';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';
import GuideCard from '../components/GuideCard';


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
    { 
      t: 'Ultimate Guide to Building a Legendary School Brand in India', 
      c: 'Branding', 
      cardDescription: 'Master the art of institutional branding to stand out in India\'s competitive education landscape.',
      description: 'School leaders: There is more to developing a legendary brand than being unique in this day and age of hyper-competition. This comprehensive guide explores the psychological and strategic layers of brand building.',
      visualText: 'the ultimate guide to building a legendary school brand.',
      visualColor: 'bg-[#8B5CF6]',
      accentColor: 'bg-[#FACC15]'
    },
    { 
      t: 'Digital Transformation Roadmap 2025', 
      c: 'Technology', 
      cardDescription: 'A strategic framework for schools transitioning to hybrid learning environments.',
      description: 'A comprehensive framework for schools to transition from traditional to hybrid learning environments effectively, focusing on infrastructure, pedagogy, and teacher training.',
      visualText: 'the roadmap to digital excellence in education.',
      visualColor: 'bg-[#0ea5e9]',
      accentColor: 'bg-[#fbbf24]'
    },
    { 
      t: 'Color Psychology in Learning Spaces', 
      c: 'Interiors', 
      cardDescription: 'Leverage environmental design to enhance student focus and emotional well-being.',
      description: 'How to use environmental design and color theory to enhance student focus and emotional well-being. Explore the science behind palette selection in classrooms.',
      visualText: 'mastering color psychology in schools.',
      visualColor: 'bg-[#f43f5e]',
      accentColor: 'bg-[#10b981]'
    },
    { 
      t: 'Sustainable Labs & Scientific Inquiry', 
      c: 'Science', 
      cardDescription: 'Designing safe and sustainable laboratories for high-impact hands-on learning.',
      description: 'Designing high-impact science laboratories that prioritize safety, sustainability, and hands-on learning for the next generation of scientists.',
      visualText: 'building the labs of the future.',
      visualColor: 'bg-[#10b981]',
      accentColor: 'bg-[#fbbf24]'
    },
    { 
      t: 'Inclusive Play: Sports Infrastructure', 
      c: 'Sports', 
      cardDescription: 'Best practices for creating accessible and engaging sports facilities.',
      description: 'Best practices for creating accessible and engaging sports facilities that cater to diverse student needs and promote physical literacy.',
      visualText: 'the guide to inclusive sports design.',
      visualColor: 'bg-[#f97316]',
      accentColor: 'bg-[#0ea5e9]'
    },
    { 
      t: 'Library Re-imagined: Media Centers', 
      c: 'Design', 
      cardDescription: 'Transforming traditional libraries into vibrant multi-media collaboration hubs.',
      description: 'Transforming traditional libraries into vibrant multi-media centers for research and collaboration, moving beyond books to interactive learning.',
      visualText: 're-imagining the school library.',
      visualColor: 'bg-[#6366f1]',
      accentColor: 'bg-[#facc15]'
    },
    { 
      t: 'Campus Safety & Protocol 2025', 
      c: 'Protocol', 
      cardDescription: 'A strategic approach to school security and emergency response frameworks.',
      description: 'A strategic approach to school security, emergency response, and student safety frameworks in an increasingly complex world.',
      visualText: 'the complete guide to campus safety.',
      visualColor: 'bg-[#475569]',
      accentColor: 'bg-[#f43f5e]'
    },
    { 
      t: 'Marketing Roadmap for New Schools', 
      c: 'Enrollment', 
      cardDescription: 'A step-by-step marketing strategy to ensure full enrollment from day one.',
      description: 'A step-by-step marketing strategy for new school launches to ensure full enrollment from day one, covering digital reach and community engagement.',
      visualText: 'the enrollment marketing masterplan.',
      visualColor: 'bg-[#ec4899]',
      accentColor: 'bg-[#fbbf24]'
    },
  ],
};

const ICONS = { ShieldCheck, Target, BookOpen, Layers, Zap, GraduationCap, Award };

const Guides = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const { blocks, loading } = useCMSPage('guides');
  
  const d = blocks?.guides_page_content;
  const heroData = d || DEFAULT_CONTENT.hero;
  const items = d?.caseStudies !== undefined ? d.caseStudies : DEFAULT_CONTENT.caseStudies;

  // Instant loading

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4">
        
        {/* SECTION 1: DYNAMIC HERO (AS REQUESTED) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 mb-2 lg:mb-6">
           <div className="md:col-span-12 lg:col-span-7 bg-white rounded-[40px] p-8 lg:p-10 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group min-h-[300px] lg:min-h-[380px]">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="px-5 py-1.5 bg-gray-50 text-sm-blue font-black rounded-full text-[11px] uppercase tracking-[0.2em] mb-4 w-fit border border-gray-100 relative z-10">
                 <Sparkles size={14} className="inline mr-2" /> {heroData?.badge || 'Knowledge Base 2025'}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black font-heading leading-[0.85] mb-6 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroData?.titleHtml || 'Strategy <br/> <span class="text-sm-blue italic font-serif lowercase tracking-normal">for</span> <br/> Compliance.' }} />
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

              </div>

              <div className="bg-white rounded-[40px] p-8 text-gray-900 flex flex-col justify-between shadow-sm border border-gray-100 group relative overflow-hidden min-h-[200px]">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                 <div className="flex items-center justify-between relative z-10">
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Strategic Partner Service</span>
                    <ArrowRight className="text-gray-400 group-hover:text-sm-blue transition-colors" size={24} />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mt-10 mb-8 relative z-10 text-gray-900" dangerouslySetInnerHTML={{ __html: d.actionCard?.titleHtml || 'Request <br/> Strategy Audit.' }} />
                 <button 
                   onClick={() => navigate('/registration')}
                   className="w-full py-4 bg-sm-blue text-white font-black rounded-xl text-[12px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 hover:bg-gray-900 relative z-10"
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
           <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
              {items.map((work, i) => (
                 <GuideCard 
                   key={i}
                   title={work.t}
                   category={work.c}
                   description={work.description}
                   cardDescription={work.cardDescription}
                   image={work.img}
                   visualText={work.visualText}
                   visualColor={work.visualColor}
                   accentColor={work.accentColor}
                   onClick={() => navigate(`/guides/${work.t.toLowerCase().replace(/\s+/g, '-')}`)}
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

