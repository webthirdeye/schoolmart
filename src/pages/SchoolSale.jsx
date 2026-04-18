import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Star, MapPin, ChevronRight, Info, Award, Download, FileText, Send, Share2, Bookmark, CheckCircle2, History, Users, Scale, MessageSquare, Globe, ArrowRight, Zap, Target, Search, ChevronDown, Rocket, Building2, TrendingUp, Handshake } from 'lucide-react';

const PropertyListingCard = ({ item }) => {
  // Description split into bullet points (by newline or period)
  const descriptionPoints = (item.description || "")
    .split(/[\n.]/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative p-6 mb-8 break-inside-avoid">
       {/* HEADER - BADGE & LOCATION */}
       <div className="flex items-center justify-between mb-8">
           <div className="px-4 py-2 bg-sm-blue/5 rounded-full border border-sm-blue/10">
             <span className="text-[11px] font-black text-sm-blue uppercase tracking-[0.2em]">
               {item.type || 'SALE'} MANDATE
             </span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
              <MapPin size={12} className="text-red-500" />
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{item.location || 'HYDERABAD'}</span>
           </div>
       </div>

       <div className="flex flex-col flex-1">
          {/* TITLE & RATING */}
          <div className="mb-6">
             <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tighter uppercase mb-3 pr-4 group-hover:text-sm-blue transition-colors">
               {item.title || "Institutional Asset Listing"}
             </h3>
             <div className="flex items-center gap-2">
                <div className="flex items-center">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={`${i < (parseInt(item.rating) || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} `} />
                   ))}
                </div>
                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Premium Rated</span>
             </div>
          </div>

          {/* POINTS LIST */}
          <div className="bg-gray-50/50 rounded-[30px] p-6 mb-8 border border-gray-100/50">
             {descriptionPoints.length > 0 ? (
                <ul className="space-y-4">
                   {descriptionPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                         <div className="mt-1 flex-shrink-0 w-5 h-5 bg-white rounded-full shadow-sm border border-emerald-100 flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                         </div>
                         <span className="text-[13px] font-bold text-gray-600 leading-snug">{point}</span>
                      </li>
                   ))}
                </ul>
             ) : (
                <p className="text-[13px] text-gray-400 italic font-medium">No description provided...</p>
             )}
          </div>

          {/* KEY STATS GRID */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sales P.A.</p>
                <p className="text-lg font-black text-gray-900 tracking-tighter uppercase">{item.runRate || "TBD"}</p>
             </div>
             <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Profitability</p>
                <p className="text-lg font-black text-gray-900 tracking-tighter uppercase">{item.margin || "TBD"}</p>
             </div>
          </div>

          {/* FOOTER ACTION */}
          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Listing Value</p>
                <p className="text-3xl font-black text-sm-blue tracking-tighter uppercase">
                  {item.price || "Contact"}
                </p>
             </div>
              <Link 
                to={item.ctaLink || "/contact-us"} 
                className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl text-[12px] uppercase tracking-widest shadow-lg hover:bg-sm-blue hover:shadow-blue-200 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                 {item.ctaLabel || "View Details"}
              </Link>
          </div>
       </div>
    </div>
  );
};


const SchoolSale = () => {
  const { blocks, loading } = useCMSPage('school_sale');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchTerm, setSearchTerm] = useState('');

  // Shield against static flicker: Only use fallbacks if loading is finished AND no data was found
  const listings = (loading) ? [] : (blocks?.school_sale_listings?.items || [
    { title: 'Super Star School at West Hyd', location: 'HYDERABAD', price: '12cr', type: 'SALE' },
    { title: 'Academic Excellence Hub', location: 'CHENNAI', price: '25cr', type: 'LEASE' },
    { title: 'Premier Global Academy', location: 'BANGALORE', price: '18cr', type: 'SALE' },
  ]);
  const heroBlock = blocks?.hero || blocks?.inner_page_hero || {};
  const advisoryBlock = blocks?.advisory || {};
  
  
  // Dynamic Cities from listings + defaults
  const categoryBlock = blocks?.sidebar_categories || {};
  const cmsCities = (categoryBlock.categories || []).map(c => c.toUpperCase());
  
  // Combine CMS categories with listing cities as fallback
  const listingCities = Array.from(new Set(listings.map(l => (l.location || '').toUpperCase()))).filter(Boolean);
  const CITIES = cmsCities.length > 0 ? cmsCities : Array.from(new Set(['HYDERABAD', 'CHENNAI', 'BANGALORE', 'MUMBAI', 'DELHI', 'PUNE', ...listingCities])).sort();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Instant loading

  const filteredListings = listings.filter(l => {
    const matchesSearch = (l.location || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (l.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || (l.location || '').toUpperCase().includes(selectedCity.toUpperCase());
    return matchesSearch && matchesCity;
  });

  return (
    <main className="min-h-screen bg-gray-50/30">
       {/* Small Hero Strip */}
       <section className="bg-white py-14 border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-sm-blue rounded-full" />
                    <span className="text-[13px] font-black text-sm-blue uppercase tracking-[0.4em]">{heroBlock.badge || "Institutional M&A"}</span>
                 </div>
                 <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none pr-4" dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || heroBlock.title || 'Schools for <span class="text-sm-blue italic font-serif lowercase tracking-normal">Sale & Lease.</span>' }} />
              </div>
             <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH MANDATES..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[20px] text-[13px] font-black uppercase tracking-widest outline-none focus:border-sm-blue focus:bg-white shadow-sm transition-all"
                />
             </div>
          </div>
       </section>

       <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
             
             {/* LEFT SIDEBAR: CITIES */}
             <aside className="w-full space-y-3 lg:sticky lg:top-28 z-10">
                <button 
                  onClick={() => setSelectedCity('All Cities')}
                  className={`w-full bg-[#111827] text-white p-7 rounded-[22px] shadow-2xl flex items-center justify-between group transition-all mb-4 ${selectedCity === 'All Cities' ? 'ring-4 ring-sm-blue/20' : ''}`}
                >
                   <span className="text-[14px] font-black uppercase tracking-[0.3em]">ALL CITIES</span>
                   <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-all" />
                </button>
                
                <div className="flex flex-col gap-3">
                   {CITIES.map((city, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setSelectedCity(city); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-full text-left px-8 py-5.5 rounded-[22px] text-[13px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-between group border border-transparent shadow-sm ${selectedCity === city ? 'bg-sm-blue text-white shadow-xl' : 'bg-white text-gray-400 hover:text-gray-900 hover:border-gray-200'}`}
                      >
                         {city}
                      </button>
                   ))}
                </div>

                 <div className="p-10 bg-white border border-gray-100 rounded-[45px] text-gray-900 mt-12 relative overflow-hidden group shadow-md text-center">
                   <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all transform scale-150">
                      <Rocket size={150} className="text-sm-blue" />
                   </div>
                   <h4 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10 font-heading leading-none" dangerouslySetInnerHTML={{ __html: advisoryBlock.titleHtml || advisoryBlock.title || "Elite <br /> Advisory." }} />
                   <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest leading-loose mb-10 relative z-10">
                      {advisoryBlock.subtitle || "Expert consultation for high-value institutional mandates."}
                   </p>
                   <Link to={advisoryBlock.ctaPath || "/contact-us"} className="inline-flex items-center gap-3 px-10 py-4 bg-sm-blue text-white font-black rounded-full text-[12px] uppercase tracking-widest hover:bg-gray-900 transition-all relative z-10 shadow-2xl shadow-blue-500/20">
                      {advisoryBlock.ctaLabel || "Consult Now"} <ArrowRight size={16} />
                   </Link>
                </div>
             </aside>

             {/* MAIN CONTENT GALLERY */}
             <div className="min-w-0">
                <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
                   <div className="flex flex-col">
                      <span className="text-[13px] font-black text-sm-blue uppercase tracking-[0.4em] mb-2">{selectedCity} Asset Network</span>
                      <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">{filteredListings.length} ACTIVE MANDATES</h2>
                   </div>
                </div>

                {filteredListings.length > 0 ? (
                   <div className="columns-1 md:columns-2 lg:columns-2 gap-8">
                      {filteredListings.map((item, i) => (
                         <PropertyListingCard key={i} item={item} />
                      ))}
                   </div>
                ) : (
                   <div className="py-40 text-center bg-white rounded-[60px] border-2 border-dashed border-gray-100 shadow-inner">
                      <Search size={64} className="mx-auto text-gray-200 mb-6" />
                      <h3 className="text-xl font-black text-gray-300 uppercase tracking-widest">No matching mandates</h3>
                      <button onClick={() => { setSearchTerm(''); setSelectedCity('All Cities'); }} className="mt-10 px-10 py-4 bg-gray-900 text-white font-black rounded-full text-[13px] uppercase tracking-widest shadow-xl">Reset Filter</button>
                   </div>
                )}
             </div>

          </div>
       </div>
    </main>
  );
};

export default SchoolSale;
