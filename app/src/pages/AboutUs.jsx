import { Target, Users, Rocket, Award, ShieldCheck, Heart, ArrowUpRight, CheckCircle2, LayoutGrid, Sparkles } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';

const AboutUs = () => {
  const { blocks, loading } = useCMSPage('aboutus');
  const heroBlock = blocks?.about_hero || {};

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading About Us...</div>;

  return (
    <main className="min-h-screen bg-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        
        <section className="pt-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch h-auto lg:h-[400px]">
           <div className="lg:col-span-8 bg-gray-50 rounded-[25px] p-10 flex flex-col justify-center border border-gray-100 shadow-sm relative overflow-hidden group">
              <CMSMedia 
                mediaType={heroBlock.mediaType} 
                mediaUrl={heroBlock.mediaUrl} 
                fallbackImg={heroBlock.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-1000"
              />
              <div className="absolute top-0 right-0 w-64 h-64 bg-sm-blue/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-sm-blue/10 transition-all duration-1000" />
              <div className="px-3 py-1 bg-sm-blue text-white font-black rounded-full text-[8px] uppercase tracking-[0.2em] mb-4 w-fit scale-90 relative z-10">
                 <Rocket size={12} className="inline mr-2" /> {heroBlock.subtitle || "Since 2012"}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black font-heading leading-tight mb-4 tracking-tighter text-gray-900 uppercase relative z-10" dangerouslySetInnerHTML={{ __html: heroBlock.title || 'Empowering <br/> <span className="text-sm-blue italic font-serif lowercase tracking-normal">the</span> <br/> Future of Edu.' }} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest max-w-sm leading-loose relative z-10">
                 {heroBlock.description || "Designing learning environments that shape the future through visionary innovation and ergonomics."}
              </p>
           </div>

            {/* STAT STACK (SPAN 4) - PACKED */}
            <div className="lg:col-span-4 flex flex-col gap-3">
               {(blocks?.stats?.stats || [
                 { value: '7+', label: 'Years Experience', icon: 'Clock' },
                 { value: '1200+', label: 'Products', icon: 'LayoutGrid' },
                 { value: '16+', label: 'Panel Architects', icon: 'Users' }
               ]).map((s, i) => (
                  <div key={i} className={`flex-1 ${i % 2 !== 0 ? 'bg-sm-blue' : 'bg-gray-900'} rounded-[25px] p-8 text-white flex flex-col justify-between group overflow-hidden relative border ${i % 2 !== 0 ? 'border-blue-400 shadow-xl' : 'border-gray-800 shadow-2xl'} transition-all hover:scale-[1.02]`}>
                     <div className="flex justify-between items-start text-white">
                        <h3 className="text-[28px] font-black font-heading leading-none uppercase">{s.value}</h3>
                        <Users size={32} className="text-white/30 group-hover:text-white transition-colors" />
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-[0.2em]">{s.label}</span>
                  </div>
               ))}
            </div>
        </section>


        {/* BENTO STORYTELLING - CLOSELY PACKED */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-6">
            {/* PHILOSOPHY */}
            <div className="lg:col-span-2 bg-white rounded-[25px] p-10 flex flex-col justify-center border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
               <div className="w-12 h-1 bg-sm-blue mb-6 rounded-full" />
               <h3 className="text-2xl font-black text-gray-900 font-heading mb-4 uppercase tracking-tighter">
                 {blocks?.about_philosophy?.title?.includes(' ') ? (
                   <>
                     {blocks.about_philosophy.title.split(' ').slice(0, -1).join(' ')}{' '}
                     <span className="text-sm-blue">{blocks.about_philosophy.title.split(' ').slice(-1)}</span>
                   </>
                 ) : (
                   blocks?.about_philosophy?.title || <>Our <span className="text-sm-blue">Philosophy.</span></>
                 )}
               </h3>
               <p className="text-gray-500 text-[10px] leading-relaxed max-w-sm font-bold uppercase tracking-widest">
                  {blocks?.about_philosophy?.statement || blocks?.mission_vision?.mission || "We don't just supply furniture; we engineer productivity, safety, and curiosity into every square inch."}
               </p>
            </div>

           {/* TEAM PHOTO */}
           <div className="lg:col-span-2 rounded-[25px] overflow-hidden shadow-2xl group min-h-[300px]">
              <img 
                src={blocks?.about_philosophy?.teamImg || "https://images.unsplash.com/photo-1522071823907-b712ec46597a?w=1000&q=80"} 
                alt="Team" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
           </div>
        </div>

        {/* JOURNEY TIMELINE - PACKED */}
        <div className="mt-8 relative text-center pb-12">
           <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading mb-10 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: blocks?.journey?.title || 'A DECADE OF EXCELLENCE.' }} />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(blocks?.journey?.steps || [
                { y: '2012', t: 'FOUNDATION', d: 'Started in Maharashtra' },
                { y: '2017', t: 'DIGITAL ERA', d: 'Smart Classroom Launch' },
                { y: '2025', t: 'NATIONAL LEADER', d: 'Institutional Excellence' },
              ]).map((step, i) => (
                 <div key={i} className="bg-white p-8 rounded-[25px] border border-gray-100 shadow-sm relative group hover:-translate-y-2 transition-all">
                    <span className="text-3xl font-black font-heading text-sm-blue/20 group-hover:text-sm-blue transition-colors mb-2 block tracking-tighter">{step.y}</span>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">{step.t}</h4>
                    <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">{step.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;
