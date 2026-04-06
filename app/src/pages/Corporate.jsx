import { Target, Users, Rocket, Award, ShieldCheck, Heart, ArrowUpRight, CheckCircle2, LayoutGrid, Sparkles, Building2, Briefcase, Globe } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';

const partners = [
  { name: 'KVS Schools', cat: 'Central Govt', img: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=400&q=80' },
  { name: 'Podar Education', cat: 'Private Network', img: 'https://images.unsplash.com/photo-1522071823907-b712ec46597a?w=400&q=80' },
  { name: 'JNV Academies', cat: 'Govt Residential', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80' },
];

const Corporate = () => {
  const { blocks, loading } = useCMSPage('corporate');
  const d = blocks?.corporate_page_content || {};
  const partnerBlock = blocks?.partners || {};
  const currentPartners = partnerBlock.items || partners;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Corporate...</div>;

  return (
    <main className="min-h-screen bg-white pt-10 pb-20 overflow-hidden relative">
      {/* PROFESSIONAL BENTO HERO (Unique for Corporate) */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-6 gap-6 min-h-[900px]">
            
            {/* Main Statement Bento (Screenshot 2 Inspired) */}
            <div className="lg:col-span-8 lg:row-span-4 bg-gray-900 rounded-[60px] p-12 lg:p-20 text-white relative overflow-hidden group shadow-3xl">
               <CMSMedia 
                 mediaType={d.hero?.mediaType} 
                 mediaUrl={d.hero?.mediaUrl} 
                 fallbackImg={d.hero?.img} 
                 className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000"
               />
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sm-blue opacity-10 rounded-full blur-[100px] group-hover:scale-110 transition-transform" />
               <div className="relative z-10 flex flex-col h-full">
                  <span className="inline-block px-5 py-2 bg-sm-blue text-white font-black rounded-full mb-10 text-[10px] uppercase tracking-widest shadow-lg">{d.hero?.badge || "Enterprise Solutions"}</span>
                  <h1 className="text-5xl md:text-8xl font-black font-heading leading-[0.85] tracking-tighter uppercase mb-12" dangerouslySetInnerHTML={{ __html: d.hero?.titleHtml || "Strategic <br/> Infrastructure <br/> <span className=\"text-sm-blue italic font-serif\">Partnership.</span>" }} />
                  <p className="text-white/40 text-lg md:text-xl max-w-xl leading-relaxed mb-auto font-medium uppercase tracking-widest">
                     {d.hero?.subtitle || "We don't just supply; we strategize. Our corporate division handles institutional procurement for high-net school networks across 22 states."}
                  </p>
                  <div className="mt-12">
                     <button className="px-10 py-5 bg-white text-gray-900 font-black rounded-3xl hover:bg-sm-blue hover:text-white transition-all shadow-xl uppercase tracking-widest text-[11px] active:scale-95 flex items-center gap-3">
                        Institutional Pitch Deck <Briefcase size={18} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Global Reach Bento */}
            <div className="lg:col-span-4 lg:row-span-3 bg-sm-blue rounded-[60px] p-12 text-white flex flex-col justify-center text-center relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
               <Globe size={80} className="mx-auto mb-8 text-white/30 group-hover:scale-125 transition-transform duration-1000" />
               <h3 className="text-5xl font-black mb-2 tracking-tight">22</h3>
               <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-loose">States Active <br/> Across PAN India</p>
            </div>

            {/* Ethics Bento */}
            <div className="lg:col-span-4 lg:row-span-3 bg-white rounded-[60px] p-12 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center group hover:shadow-2xl transition-all">
               <ShieldCheck size={50} className="text-sm-blue mb-8 group-hover:scale-110 transition-transform" />
               <h4 className="text-2xl font-black text-gray-900 mb-2 leading-tight uppercase font-heading tracking-tight">Transparency First</h4>
               <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-relaxed">Full ERP Integration for <br/> Institutional Audits.</p>
            </div>

            {/* Partners Bento Grid (Screenshot 3 Style) */}
            <div className="lg:col-span-8 lg:row-span-2 bg-gray-50 rounded-[60px] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 group shadow-inner">
               <div className="flex-1">
                  <h4 className="text-xl font-black text-gray-900 mb-2 uppercase font-heading tracking-tight leading-none">Our High-Impact Allies.</h4>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-loose">Serving 50,000+ students monthly.</p>
               </div>
                <div className="flex -space-x-8">
                   {currentPartners.map((p, i) => (
                     <div key={i} className="w-20 h-20 rounded-full border-8 border-gray-50 overflow-hidden shadow-xl hover:rotate-6 transition-all cursor-pointer">
                        <img src={typeof p === 'string' ? p : p.img} alt={typeof p === 'string' ? `Partner ${i}` : p.name} className="w-full h-full object-cover" />
                     </div>
                   ))}
                   {currentPartners.length > 3 && (
                     <div className="w-20 h-20 rounded-full border-8 border-gray-50 bg-sm-blue flex items-center justify-center text-white text-xs font-black shadow-xl hover:-rotate-6 transition-all cursor-pointer">
                        +{currentPartners.length - 3}
                     </div>
                   )}
                </div>
            </div>

         </div>
      </section>

      {/* STRATEGIC CAPABILITIES (Screenshot 4 Product Inspired Variation) */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
               <h2 className="text-5xl md:text-8xl font-black text-gray-900 font-heading leading-tight mb-8 tracking-tighter uppercase">Boardroom <br/> <span className="text-sm-blue">Consultancy.</span></h2>
               <div className="space-y-6">
                  {(d.capabilities?.length ? d.capabilities : [
                    { t: 'Multi-Phase Procurement', d: 'Structured budgets across fiscal years.' },
                    { t: 'Turnkey Campus Ready', d: 'Design-Build-Supply-Maintain workflow.' },
                    { t: 'Bulk Logistics Hub', d: 'Priority delivery for school networks.' },
                  ]).map((item, i) => (
                    <div key={i} className="flex items-center gap-6 p-8 rounded-[40px] bg-gray-50 border border-transparent group hover:bg-white hover:border-sm-blue hover:shadow-3xl transition-all cursor-pointer">
                       <div className="w-14 h-14 bg-blue-50 text-sm-blue group-hover:bg-sm-blue group-hover:text-white rounded-2xl flex items-center justify-center transition-all">
                          <Target size={24} />
                       </div>
                       <div>
                          <h5 className="text-xl font-black text-gray-900 mb-1 leading-tight uppercase font-heading">{item.t}</h5>
                          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{item.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex-1 w-full order-1 lg:order-2">
               <div className="relative rounded-[70px] overflow-hidden shadow-2xl skew-x-1 group-hover:skew-x-0 transition-transform duration-1000 h-[600px] border-8 border-white">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80" alt="Corporate Office" className="w-full h-full object-cover transition-all duration-1000 h-full" />
                  <div className="absolute inset-0 bg-sm-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-10 right-10 flex gap-2">
                     <span className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg text-sm-blue border border-blue-50">Headquarters BLR</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL CTA ENVELOPE (Unique for Corporate) */}
      <section className="py-24 px-4 bg-gray-50">
         <div className="max-w-5xl mx-auto rounded-[80px] bg-white p-12 lg:p-20 text-center relative shadow-3xl border border-gray-100 group transition-all hover:scale-[1.02]">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-sm-blue rounded-[50px] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-all">
               <Rocket size={48} />
            </div>
            <h5 className="text-gray-900 text-3xl md:text-5xl font-black font-heading leading-tight mb-10 tracking-tighter uppercase mt-10" dangerouslySetInnerHTML={{ __html: d.cta?.titleHtml || "Scale Your Institutional <br/> <span className=\"text-sm-blue decoration-yellow-400 decoration-4 underline underline-offset-[16px]\">Impact.</span>" }} />
            <button className="px-12 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-sm-blue transition-all shadow-xl uppercase tracking-widest text-[11px] active:scale-95 flex items-center justify-center gap-3 mx-auto">
               {d.cta?.btnText || 'Request Management Consultation'} <ArrowUpRight size={20} />
            </button>
         </div>
      </section>
    </main>
  );
};

export default Corporate;
