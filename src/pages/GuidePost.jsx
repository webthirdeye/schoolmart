import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MessageCircle, Phone, ArrowRight, ShieldCheck, Zap, Layers, Globe, Star, Lightbulb, Compass, Target, BookOpen } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';

const ICON_MAP = { ShieldCheck, Target, Zap, Compass, Star, Lightbulb, Layers, Globe, BookOpen };

const DEFAULT_DATA = {
  title: "The Parent's Magnet: Creating a School that Families Choose",
  badge: "Strategic Guide 2025",
  mainImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  intro: "The decision to enroll a child is the most significant financial and emotional commitment a family makes. This guide outlines how to transform your institution into a magnet for aspirational parents.",
  steps: [
    {
      title: "Step 1: Audit Parent Priorities & Perceptions",
      content: "Modern parents prioritize safety, individual attention, and global exposure over just legacy and infrastructure.",
      insight: "Direct research often reveals that 'Safety' is now ranked higher than 'Academic Results' in the initial inquiry phase.",
      action: "Conduct a 5-question digital audit with current prospective leads."
    },
    {
      title: "Step 2: Engineering the First Impression",
      content: "The 'First 3 Minutes' of a campus visit determine the enrolment probability.",
      insight: "A cluttered reception desk or a loud corridor can reduce enrolment conversion by up to 25%.",
      action: "Standardize the check-in protocol and audit the sensory hub of your reception."
    },
    {
      title: "Step 3: Visual Proof of Transparency",
      content: "Aspirational parents want to see the labs, the libraries, and the kitchens.",
      insight: "Schools that offer a 'Behind the Scenes' kitchen or lab tour have a 15% higher secondary inquiry rate.",
      action: "Create a 'Transparency Circuit' for your next school tour."
    }
  ],
  summaryPoints: [
    { t: "Institutional Authority", icon: "ShieldCheck" },
    { t: "Parental Psychology", icon: "Target" },
    { t: "Conversion Strategy", icon: "Zap" },
    { t: "Sensory Marketing", icon: "Compass" }
  ]
};

const GuidePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Load data from the listing page AND the dedicated sub-page
  const { blocks: listBlocks, loading: listLoading } = useCMSPage('guides');
  const { blocks: pageBlocks, loading: pageLoading } = useCMSPage(`guide-${slug}`);
  
  // Consolidate all possible items from the parent page
  const legacyItems = listBlocks?.guides_page_content?.caseStudies || [];
  const dynamicItems = listBlocks?.masonry_grid?.items || [];
  const allItems = [...legacyItems, ...dynamicItems];

  // Find the matching item by slug
  const matchedItem = allItems.find(r => {
    const title = r.t || r.title || '';
    return title.toLowerCase().replace(/\s+/g, '-') === slug;
  });

  // Dedicated page blocks
  const heroBlock = pageBlocks?.page_hero || pageBlocks?.inner_page_hero || {};
  const contentBlock = pageBlocks?.page_content || pageBlocks?.text_content || {};

  const guideData = {
    title: matchedItem?.t || heroBlock.title || (slug || '').replace(/-/g, ' ').toUpperCase(),
    badge: matchedItem?.badge || heroBlock.badge || DEFAULT_DATA.badge,
    mainImg: matchedItem?.img || heroBlock.img || heroBlock.mediaUrl || DEFAULT_DATA.mainImg,
    intro: matchedItem?.intro || heroBlock.subtitle || DEFAULT_DATA.intro,
    steps: matchedItem?.steps?.length ? matchedItem.steps : (pageBlocks?.guide_steps?.steps || DEFAULT_DATA.steps),
    summaryPoints: matchedItem?.summaryPoints?.length ? matchedItem.summaryPoints : (pageBlocks?.summary_points?.points || DEFAULT_DATA.summaryPoints),
    content: contentBlock.content || contentBlock.body || ''
  };

  const loading = listLoading && pageLoading;

  // Instant loading

  return (
    <main className="min-h-screen bg-white pb-10 font-body">
      {/* HEADER (ULTRA COMPACT) */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#004a8e] hover:bg-white px-4 py-2 rounded-full transition-all">
              <ArrowLeft size={16} /> Back to Guides
           </button>
           <div className="flex items-center gap-4 text-gray-300">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">Strategy Hub 2025</span>
              <BookOpen size={16} />
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 lg:pt-12">
        {/* HERO AREA (NARRATIVE STYLE) */}
        <div className="text-center mb-12">
           <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#004a8e] font-black rounded-full text-[11px] uppercase tracking-[0.2em] mb-6 border border-blue-100">
              {guideData.badge}
           </span>
           <h1 className="text-3xl lg:text-5xl font-black font-heading leading-[1.1] tracking-tighter uppercase mb-8 text-gray-900 border-b-2 border-gray-100 pb-8">
              {guideData.title}
           </h1>
           <p className="text-base lg:text-lg text-gray-500 font-bold uppercase tracking-tight leading-relaxed max-w-2xl mx-auto">
              {guideData.intro}
           </p>
        </div>

        {/* MAIN FEATURE IMAGE */}
        <div className="rounded-[40px] overflow-hidden mb-12 shadow-2xl border border-gray-100 h-[300px] lg:h-[450px]">
           <img src={guideData.mainImg} alt="Guide Hero" className="w-full h-full object-cover" />
        </div>

        {guideData.content && (
           <div 
              className="prose prose-lg prose-slate max-w-none mb-16 prose-headings:font-black prose-headings:uppercase prose-p:text-gray-500 prose-p:font-medium"
              dangerouslySetInnerHTML={{ __html: guideData.content }}
           />
        )}

        {/* STEP-BY-STEP CONTENT */}
        <div className="space-y-16">
           {guideData.steps.map((step, i) => (
              <section key={i} className="relative pl-12 lg:pl-16 border-l-2 border-gray-100">
                 {/* STEP MARKER */}
                 <div className="absolute left-0 top-0 -translate-x-1/2 w-12 h-12 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-[#004a8e] font-black text-sm z-10 shadow-sm">
                    {i + 1}
                 </div>
                 
                 <div className="space-y-6">
                    <h2 className="text-2xl lg:text-3xl font-black font-heading text-gray-900 uppercase tracking-tighter leading-tight">
                       {step.title}
                    </h2>
                    
                    <p className="text-gray-500 text-sm lg:text-base font-bold uppercase tracking-tight leading-loose opacity-80">
                       {step.content}
                    </p>
                    
                    {/* INSIGHT BOX */}
                    {step.insight && (
                      <div className="bg-blue-50/50 p-6 lg:p-8 rounded-[30px] border border-blue-100 flex items-start gap-4">
                         <Lightbulb className="text-[#004a8e] shrink-0" size={24} />
                         <p className="text-[13px] lg:text-sm font-black text-[#004a8e] uppercase tracking-widest leading-relaxed italic">
                            "{step.insight}"
                         </p>
                      </div>
                    )}
                    
                    {/* ACTION POINT */}
                    {step.action && (
                      <div className="flex items-center gap-4 pt-2">
                         <div className="w-8 h-px bg-gray-200" />
                         <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Action Point:</span>
                         <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest"> {step.action}</span>
                      </div>
                    )}
                 </div>
              </section>
           ))}
        </div>

        {/* SUMMARY PILL GRID */}
        <div className="mt-20 py-10 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
           {guideData.summaryPoints.map((point, i) => {
              const IconComp = ICON_MAP[point.icon] || Star;
              return (
                <div key={i} className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-[30px] border border-transparent hover:border-[#004a8e] hover:bg-white transition-all group">
                  <div className="text-gray-300 group-hover:text-[#004a8e] transition-colors"><IconComp size={20} /></div>
                  <span className="text-[11px] font-black text-gray-500 group-hover:text-gray-900 uppercase tracking-widest text-center">{point.t}</span>
                </div>
              );
           })}
        </div>

        {/* FINAL SIGNATURE ACTION */}
        <div className="mt-16 bg-[#004a8e] rounded-[40px] p-10 lg:p-14 text-center text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           <h2 className="text-3xl lg:text-4xl font-black font-heading uppercase tracking-tighter mb-4 leading-tight">
              Scale Your Institutional Influence.
           </h2>
           <p className="text-[12px] lg:text-[13px] font-black uppercase tracking-[0.2em] opacity-60 max-w-lg mx-auto mb-10 leading-loose">
              OUR STRATEGY PANELS WORK WITH TOP SCHOOLS GLOBALLY TO RE-ENGINEER THEIR ENROLMENT MODELS AND ACADEMIC STANDARDS.
           </p>
           <button 
             onClick={() => navigate('/registration')}
             className="px-10 py-5 bg-white text-[#004a8e] font-black rounded-full uppercase tracking-[0.2em] shadow-xl transition-all text-[13px]"
           >
              Register for Strategic Audit
           </button>
        </div>

      </div>
    </main>
  );
};

export default GuidePost;

