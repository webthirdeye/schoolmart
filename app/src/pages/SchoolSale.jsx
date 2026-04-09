import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Star, MapPin, ChevronRight, Info, Award, Download, FileText, Send, Share2, Bookmark, CheckCircle2, History, Users, Scale, MessageSquare, Globe, ArrowRight, Zap, Target, Search, ChevronDown, Rocket, Building2, TrendingUp, Handshake } from 'lucide-react';

const PropertyListingCard = ({ item }) => {
  // Description split into bullets safely
  const descriptionPoints = (item.description || "Established middle and higher primary school with a stable revenue model. Following the State Board curriculum specifically designed for holistic growth. Operates in a prime location with high enrollment potential.")
    .split('.')
    .filter(p => p.trim().length > 0)
    .slice(0, 3);

  const hasFinancials = item.runRate || item.margin;

  return (
    <div className="bg-white border border-gray-100 rounded-[35px] shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 relative p-2 mb-8 break-inside-avoid">
      {/* HEADER SECTION - CATEGORY & LOCATION */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] lg:text-[10px] font-black text-[#004a8e] uppercase tracking-[0.2em]">
                {item.type || 'Institutional Mandate'}
              </span>
              {item.subcategory && (
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.subcategory}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
             <MapPin size={10} className="text-red-500" />
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.location || 'Pan India'}</span>
          </div>
      </div>

      <div className="px-6 pb-6 flex flex-col">
        {/* TITLE AREA */}
        <div className="mb-6 group-hover:px-2 transition-all duration-500">
           <h3 className="text-xl lg:text-2xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase mb-4 group-hover:text-[#004a8e]">
             {item.title}
           </h3>
           <div className="flex gap-3 items-center">
              <div className="flex gap-2.5 opacity-40 group-hover:opacity-100 transition-opacity">
                 <Mail size={14} className="hover:text-[#004a8e] cursor-pointer" />
                 <Phone size={14} className="hover:text-[#004a8e] cursor-pointer" />
                 <Linkedin size={14} className="hover:text-[#004a8e] cursor-pointer" />
              </div>
              <div className="h-[1px] flex-grow bg-gray-100" />
              <div className="flex items-center gap-1.5">
                 <Star size={12} className="fill-amber-400 text-amber-400" />
                 <span className="text-[10px] font-black text-gray-900">{item.rating || '8.5'} Rating</span>
              </div>
           </div>
        </div>

        {/* DATA GRID */}
        <div className="flex flex-col gap-4 mb-6">
           <div className="bg-gray-50/50 rounded-[25px] p-5 border border-gray-100/50">
              <ul className="space-y-3">
                 {descriptionPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-500 text-[11px] font-bold uppercase tracking-tight leading-snug">
                       <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                       {point.trim()}
                    </li>
                 ))}
              </ul>
           </div>

           {hasFinancials && (
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col shadow-sm">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Sales P.A</span>
                    <span className="text-[12px] font-black text-gray-900 tracking-tight">{item.runRate || "Verified"}</span>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col shadow-sm">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Margin</span>
                    <span className="text-[12px] font-black text-gray-900 tracking-tight">{item.margin || "25%+"}</span>
                 </div>
              </div>
           )}
        </div>

        {/* FOOTER ACTION AREA */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex flex-col w-full sm:w-auto">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mandate Value</span>
              <span className="text-2xl lg:text-3xl font-black text-[#004a8e] tracking-tighter">
                {item.price}
              </span>
           </div>
            <Link 
              to={item.ctaLink || "/contact-us"} 
              className="w-full sm:w-auto text-center px-8 py-4 bg-[#FFDB00] text-gray-900 font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/10 hover:bg-gray-900 hover:text-white transition-all transform group-hover:scale-105 active:scale-95"
            >
               {item.ctaLabel || "Contact Business"}
            </Link>
        </div>
      </div>
    </div>
  );
};


const SchoolSale = () => {
  const { blocks, loading } = useCMSPage('school-sale');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchTerm, setSearchTerm] = useState('');

  const listings = blocks?.listings?.items || [];
  const dynamicCities = blocks?.sidebar_categories?.categories || [];
  const CITIES = ['All Cities', ...dynamicCities];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return null;

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.location?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         l.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || l.location?.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  return (
    <main className="min-h-screen bg-white">
       {/* Small Hero Strip */}
       <section className="bg-gray-50/50 py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-8 h-0.5 bg-[#004a8e] rounded-full" />
                   <span className="text-[10px] font-black text-[#004a8e] uppercase tracking-[0.3em]">Institutional M&A</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                  Schools for <span className="text-[#004a8e] italic font-serif lowercase tracking-normal">Sale & Lease.</span>
                </h1>
             </div>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="SEARCH MANDATES..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#004a8e] shadow-sm transition-all"
                />
             </div>
          </div>
       </section>

       <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Use grid instead of flex to ensure proper stacking and prevent mobile overlap glitches */}
          <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-12 items-start">
             
             {/* LEFT SIDEBAR: CITIES (Sticky only on large screens) */}
             <aside className="w-full space-y-6 lg:sticky lg:top-24 z-10 bg-white">
                <div className="flex items-center gap-3 mb-6">
                   <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">HOT LOCATIONS</h3>
                   <div className="h-0.5 flex-grow bg-gray-100 rounded-full" />
                </div>
                
                <div className="flex flex-col gap-2">
                   {CITIES.map((city, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setSelectedCity(city); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-full text-left px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCity === city ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                         {city}
                         <ChevronRight size={14} className={`transition-transform ${selectedCity === city ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                   ))}
                </div>

                <div className="p-8 bg-white border border-gray-100 rounded-[40px] text-gray-900 mt-12 relative overflow-hidden group shadow-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
                      <Rocket size={80} className="text-[#004a8e]" />
                   </div>
                   <h4 className="text-lg font-black uppercase tracking-tight mb-2 relative z-10 font-heading leading-tight">Elite <br /> Advisory.</h4>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose mb-8 relative z-10">
                      We help you find the right mandate for your school growth.
                   </p>
                   <Link to="/contact-us" className="inline-flex items-center gap-2 px-8 py-3 bg-[#004a8e] text-white font-black rounded-full text-[9px] uppercase tracking-widest hover:scale-105 transition-all relative z-10 shadow-xl shadow-blue-500/20">
                      Contact Us <ArrowRight size={14} />
                   </Link>
                </div>
             </aside>

             {/* MAIN MASONRY GRID */}
             <div className="min-w-0">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#004a8e] uppercase tracking-[0.4em] mb-1">{selectedCity} Asset Network</span>
                      <h2 className="text-xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">{filteredListings.length} ACTIVE MANDATES</h2>
                   </div>
                </div>

                {filteredListings.length > 0 ? (
                   <div className="columns-1 md:columns-2 gap-8 space-y-8">
                      {filteredListings.map((item, i) => (
                         <PropertyListingCard key={i} item={item} />
                      ))}
                   </div>
                ) : (
                   <div className="py-32 text-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
                      <Search size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">No results found</h3>
                      <button onClick={() => { setSearchTerm(''); setSelectedCity('All Cities'); }} className="mt-8 px-8 py-3 bg-gray-900 text-white font-black rounded-full text-[10px] uppercase tracking-widest">Clear Filters</button>
                   </div>
                )}
             </div>

          </div>
       </div>
    </main>
  );
};

export default SchoolSale;
