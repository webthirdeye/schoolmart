// src/pages/Catalogues.jsx
import React, { useState } from 'react';
import { BookOpen, Download, ArrowUpRight, Layers, FileText, Share2, ShieldCheck, Zap, CheckCircle2, X } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { useNavigate } from 'react-router-dom';
import CMSMedia from '../components/ui/CMSMedia';
import CatalogueCard from '../components/CatalogueCard';

const DEFAULT_CONTENT = {
  libraryHero: {
    badge: 'Digital Library 2025',
    titleHtml: 'Digital <br/> <span class="text-[#004a8e] italic font-serif lowercase tracking-normal">Infrastructure.</span>',
    subtitle: 'Deep-dive into our comprehensive institutional catalogues and design handbooks.',
  },
  actionStrip: {
    title: '2025 Master Catalogue.',
    subtitle: 'Complete range of ergonomic campus solutions for modern schools.',
    btn1Text: 'Instant PDF',
    btn2Text: 'Request Hub',
  },
  resourceTiles: ['Technical Specs', 'Compliance Guide', 'Design Portfolio'],
  infoGrid: {
    titleHtml: 'Knowledge <span class="text-[#004a8e]">Infrastructure.</span>',
    points: ['Verified Specs', 'Compliance Audit', 'Future Ready', 'BIFMA Level-3'],
    img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=80',
  }
};

const DEFAULT_CATALOGUES = [
  { title: 'School Furniture 2025', category: 'Modular furniture for classrooms and labs.', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', fileUrl: '#' },
  { title: 'Digital Infrastructure', category: 'Smart boards and digital edtech solutions.', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', fileUrl: '#' },
  { title: 'Sports & Play', category: 'Professional equipment for sports and outdoor play.', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', fileUrl: '#' },
  { title: 'Lab & Science', category: 'Comprehensive kits for STEM and lab environments.', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', fileUrl: '#' },
  { title: 'Library Solutions', category: 'Modern shelving and reading space architecture.', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=80', fileUrl: '#' },
  { title: 'Skill Lab Guide', category: 'Vocational training and specialized skill labs.', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cb61402?w=800&q=80', fileUrl: '#' },
  { title: 'Audit Indices 2025', category: 'Documentation for institutional quality audits.', img: 'https://images.unsplash.com/photo-1454165833267-028cc21e7867?w=800&q=80', fileUrl: '#' },
  { title: 'Setup Guide India', category: 'Legal and logistical framework for school setup.', img: 'https://images.unsplash.com/photo-1522071823907-b712ec46597a?w=800&q=80', fileUrl: '#' },
];

const Catalogues = () => {
  const navigate = useNavigate();
  const { blocks, loading } = useCMSPage('catalogues');
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRegistered, setIsRegistered] = useState(!!localStorage.getItem('user'));
  const [showCaution, setShowCaution] = useState(false);
  
  const d = blocks?.catalogues_page_content || DEFAULT_CONTENT;
  const cmsCatalogues = (blocks?.catalogues_list?.catalogues || []).map(c => ({
    ...c,
    category: c.category || c.description || '',
  }));
  // Force exactly 8 items for the institutional grid density
  const catalogues = [...cmsCatalogues, ...DEFAULT_CATALOGUES].slice(0, 8);

  const handleDownload = (e, item) => {
    e.stopPropagation();
    if (!isRegistered) {
       setShowCaution(true);
       return;
    }
    window.open(item.fileUrl || '#', '_blank');
  };

  // Loading removed for instant fallback rendering

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4">
        <div className="flex flex-col gap-4 lg:gap-6">
           
           <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[40px] p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden shadow-sm">
                 <div className="px-5 py-1.5 bg-gray-50 text-[#004a8e] font-black rounded-full text-[13px] uppercase tracking-[0.2em] mb-6 w-fit border border-gray-100">
                    <BookOpen size={14} className="inline mr-2" /> {d.libraryHero?.badge || 'Catalogue'}
                 </div>
                 <h1 className="text-3xl lg:text-4xl font-black font-heading leading-tight mb-8 tracking-tighter text-gray-900 uppercase break-words" dangerouslySetInnerHTML={{ __html: d.libraryHero?.titleHtml }} />
                 <p className="text-gray-400 text-[13px] md:text-[13px] font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                    {d.libraryHero?.subtitle}
                 </p>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-4">
                 <div className="bg-white rounded-[40px] p-8 lg:p-14 text-gray-900 flex flex-col md:flex-row justify-between items-center relative border border-gray-100 shadow-sm flex-grow">
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-2xl lg:text-4xl font-black uppercase tracking-[0.1em] text-[#004a8e] mb-4">{d.actionStrip?.title}</h3>
                       <p className="text-gray-400 text-[13px] md:text-[15px] font-bold uppercase tracking-widest leading-loose max-w-sm mx-auto md:mx-0">{d.actionStrip?.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-8 md:mt-0 justify-center">
                       <button 
                         onClick={(e) => handleDownload(e, catalogues[0])}
                         className="px-8 py-5 bg-[#004a8e] text-white font-black rounded-full text-[13px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
                       >
                          <Download size={14} /> {d.actionStrip?.btn1Text || 'Instant PDF'}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                    {(d.resourceTiles || []).map((t, i) => (
                       <div key={i} className="bg-white rounded-[25px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-[#004a8e] transition-all cursor-pointer">
                          <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#004a8e] transition-colors leading-none mb-4">{t}</h4>
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#004a8e] group-hover:text-white transition-all self-end">
                             <ArrowUpRight size={18} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </section>

           {/* MAIN CATALOGUE GRID */}
           <section className="py-2">
              <div className="flex items-center justify-between py-4 mb-4">
                 <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-[0.2em] font-heading">Handbooks & Catalogues</h2>
                 <div className="h-[1px] flex-grow mx-8 bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {catalogues.map((item, i) => (
                    <CatalogueCard 
                       key={i}
                       work={{ name: item.title, subcategory: item.category || item.description, image: item.img, fileUrl: item.fileUrl }} 
                       isSelected={selectedItem?.title === item.title}
                       onClick={() => setSelectedItem(selectedItem?.title === item.title ? null : item)}
                       onAction={(e) => handleDownload(e, item)}
                       actionText="Download PDF"
                       themeColor="bg-[#004a8e]"
                       ringColor="ring-blue-100"
                       textColor="text-[#004a8e]"
                    />
                 ))}
              </div>
           </section>

           <section className="py-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-10">
              <div className="lg:col-span-6 bg-white p-8 lg:p-14 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                 <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading mb-8 leading-[0.9] uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: d.infoGrid?.titleHtml }} />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(d.infoGrid?.points || []).map((item, i) => (
                       <div key={i} className="flex items-center gap-4 text-[13px] font-black uppercase tracking-widest bg-gray-50 p-5 rounded-2xl border border-transparent hover:border-[#004a8e]/20 transition-all">
                          <CheckCircle2 size={16} className="text-[#004a8e]" />
                          {item}
                       </div>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-6 rounded-[40px] overflow-hidden border border-gray-100 shadow-sm h-[300px] lg:h-[450px]">
                 <img src={d.infoGrid?.img || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1000&q=80'} alt="Info" className="w-full h-full object-cover transition-all duration-1000" />
              </div>
           </section>

        </div>
      </div>

      {/* REGISTRATION MODAL / CAUTION */}
      {showCaution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in transition-all">
           <div className="bg-white rounded-[40px] p-10 lg:p-16 max-w-xl w-full shadow-3xl text-center relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004a8e]/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <button onClick={() => setShowCaution(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
                 <X size={24} />
              </button>
              
              <div className="w-20 h-20 bg-blue-50 text-[#004a8e] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                 <Download size={40} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading mb-6 leading-tight uppercase tracking-tighter">Identity <br/> <span className="text-[#004a8e]">Required.</span></h2>
              <p className="text-gray-400 text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.2em] mb-12 leading-loose mx-auto max-w-sm">
                 Our technical handbooks and pricing indices are gated for institutional institutional partners. Please join our network to unlock full access.
              </p>
              
              <div className="space-y-4">
                 <button 
                   onClick={() => navigate('/registration')}
                   className="w-full py-5 bg-[#004a8e] text-white font-black rounded-full uppercase tracking-widest text-[13px] shadow-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                    Register For Access <ArrowUpRight size={18} />
                 </button>
                 <button 
                   onClick={() => setShowCaution(false)}
                   className="w-full py-5 bg-white text-gray-400 font-black rounded-full uppercase tracking-widest text-[11px] hover:text-gray-900 transition-colors"
                 >
                    Browse Public View
                 </button>
              </div>
           </div>
        </div>
      )}
    </main>
  );
};

export default Catalogues;
