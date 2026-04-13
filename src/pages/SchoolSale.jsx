import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Star, MapPin, ChevronRight, Info, Award, Download, FileText, Send, Share2, Bookmark, CheckCircle2, History, Users, Scale, MessageSquare, Globe, ArrowRight, Zap, Target, Search, ChevronDown, Rocket, Building2, TrendingUp, Handshake } from 'lucide-react';

const PropertyListingCard = ({ item }) => {
  // Description split into bullets safely
  const descriptionPoints = (item.description || "Established middle and higher primary school with a stable revenue model. Following the State Board curriculum specifically designed for holistic growth. Operates in a prime location with high enrollment potential.")
    .split('.')
    .filter(p => p.trim().length > 0)
    .slice(0, 2);

  return (
    <div className="bg-white border border-gray-100 rounded-[45px] shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 relative p-4 mb-8 break-inside-avoid">
       {/* HEADER SECTION - CATEGORY & LOCATION */}
       <div className="flex items-center justify-between px-4 pt-4 pb-4">
           <div className="flex items-center gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[13px] font-black text-sm-blue uppercase tracking-[0.2em]">
               {item.type || 'SALE'}
             </span>
           </div>
           <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
              <MapPin size={14} className="text-red-500 fill-red-500/10" />
              <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">{item.location || 'HYDERABAD'}</span>
           </div>
       </div>

       <div className="px-5 pb-6 flex flex-col">
         {/* TITLE AREA */}
         <div className="mb-8">
            <h3 className="text-2xl lg:text-3xl font-black text-gray-900 leading-[1] tracking-tighter uppercase mb-6 pr-4">
              {item.title || "SUPER STAR SCHOOL AT WEST HYD"}
            </h3>
            <div className="flex gap-4 items-center">
               <div className="flex gap-4 text-gray-400">
                  <Mail size={18} className="hover:text-sm-blue cursor-pointer transition-colors" />
                  <Phone size={18} className="hover:text-sm-blue cursor-pointer transition-colors" />
                  <Linkedin size={18} className="hover:text-sm-blue cursor-pointer transition-colors" />
               </div>
               <div className="h-[1px] flex-grow bg-gray-100" />
               <div className="flex items-center gap-2">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="text-[14px] font-black text-gray-900">{item.rating || '4'} Rating</span>
               </div>
            </div>
         </div>

         {/* DATA GRID */}
         <div className="flex flex-col gap-5 mb-8">
            <div className="bg-gray-50/30 rounded-[35px] p-6 lg:p-8 border border-gray-100/50 shadow-inner">
               <ul className="space-y-4">
                  {descriptionPoints.map((point, i) => (
                     <li key={i} className="flex items-center gap-4 text-gray-600 text-[14px] font-bold uppercase tracking-tight leading-tight">
                        <div className="p-1 bg-white rounded-full shadow-sm border border-emerald-100">
                           <CheckCircle2 size={18} className="text-emerald-500" />
                        </div>
                        {point.trim()}
                     </li>
                  ))}
               </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[30px] border border-gray-100 flex flex-col shadow-sm group-hover:border-sm-blue/20 transition-all">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 opacity-60">Sales P.A</span>
                  <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">{item.runRate || "19CR"}</span>
               </div>
               <div className="bg-white p-6 rounded-[30px] border border-gray-100 flex flex-col shadow-sm group-hover:border-sm-blue/20 transition-all">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 opacity-60">Margin</span>
                  <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">{item.margin || "25%+"}</span>
               </div>
            </div>
         </div>

         {/* FOOTER ACTION AREA */}
         <div className="mt-auto pt-8 flex items-center justify-between gap-6 border-t border-gray-50">
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 opacity-60">Mandate Value</span>
               <span className="text-3xl lg:text-4xl font-black text-sm-blue tracking-tighter uppercase whitespace-nowrap">
                 {item.price || "12cr"}
               </span>
            </div>
             <Link 
               to={item.ctaLink || "/contact-us"} 
               className="px-10 py-5 bg-[#FFD700] text-gray-900 font-black rounded-[25px] text-[13px] uppercase tracking-widest shadow-xl shadow-amber-200 hover:bg-gray-900 hover:text-white transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
             >
                {item.ctaLabel || "Contact Us"}
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

  const listings = blocks?.listings?.items || [
    { title: 'Super Star School at West Hyd', location: 'HYDERABAD', price: '12cr', type: 'SALE' },
    { title: 'Academic Excellence Hub', location: 'CHENNAI', price: '25cr', type: 'LEASE' },
    { title: 'Premier Global Academy', location: 'BANGALORE', price: '18cr', type: 'SALE' },
  ];
  
  const CITIES = ['HYDERABAD', 'CHENNAI', 'AHMEDABAD', 'PUNE', 'BANGALORE', 'COIMBATORE', 'SURAT', 'DELHI', 'VIJAYAWADA', 'VISAKHAPATNAM'];

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
                   <span className="text-[13px] font-black text-sm-blue uppercase tracking-[0.4em]">Institutional M&A</span>
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none pr-4">
                  Schools for <span className="text-sm-blue italic font-serif lowercase tracking-normal">Sale & Lease.</span>
                </h1>
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
                   <h4 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10 font-heading leading-none">Elite <br /> Advisory.</h4>
                   <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest leading-loose mb-10 relative z-10">
                      Expert consultation for high-value institutional mandates.
                   </p>
                   <Link to="/contact-us" className="inline-flex items-center gap-3 px-10 py-4 bg-sm-blue text-white font-black rounded-full text-[12px] uppercase tracking-widest hover:bg-gray-900 transition-all relative z-10 shadow-2xl shadow-blue-500/20">
                      Consult Now <ArrowRight size={16} />
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
                   <div className="columns-1 md:columns-2 gap-8 space-y-8">
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
