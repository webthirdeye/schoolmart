import React, { useState, useEffect } from 'react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Star, MapPin, ChevronRight, Info, Award, Download, FileText, Send, Share2, Bookmark, CheckCircle2, History, Users, Scale, MessageSquare, Globe, ArrowRight, Zap, Target, Search, ChevronDown } from 'lucide-react';

const PropertyListingCard = ({ item }) => {
  // Convert description to bullets if it's a block of text, otherwise use dummy bullets for visual consistency
  const descriptionPoints = (item.description || "Established middle and higher primary school with a stable revenue model. Following the State Board curriculum specifically designed for holistic growth. Operates in a prime location with high enrollment potential.")
    .split('.')
    .filter(p => p.trim().length > 0)
    .slice(0, 3);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all h-full relative">
      {/* PREMIUM Ribbon */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
        <div className="absolute top-6 right-[-32px] w-[140px] bg-[#10b981] text-white text-[10px] font-black uppercase py-1 text-center rotate-45 shadow-lg tracking-widest z-20">
          PREMIUM
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-black text-sky-600 uppercase tracking-widest">
            {item.type === 'Sale' ? 'School for Sale' : 'Institutional Investment'} in {item.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 group-hover:text-sm-blue transition-colors h-[3.5rem] overflow-hidden">
          {item.title}
        </h3>

        {/* Social Icons */}
        <div className="flex gap-4 mb-6 opacity-30">
           <Mail size={16} />
           <Phone size={16} />
           <Facebook size={16} />
           <Linkedin size={16} />
        </div>

        {/* Description as Bullet Points */}
        <div className="mb-6 flex-grow">
           <ul className="space-y-3">
              {descriptionPoints.map((point, i) => (
                 <li key={i} className="flex items-start gap-2 text-gray-500 text-[12px] leading-relaxed">
                    <span className="text-sm-blue mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sm-blue/30" />
                    {point.trim()}...
                 </li>
              ))}
           </ul>
        </div>

        {/* Rating & Location */}
        <div className="flex items-center gap-6 mb-8 pt-4 border-t border-gray-50">
           <div className="flex items-center gap-2">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-black text-gray-900">{item.rating || '8.5'}</span>
           </div>
           <div className="flex items-center gap-2">
              <MapPin size={16} className="text-red-500" />
              <span className="text-sm font-black text-gray-500">{item.location.split(',')[0]}</span>
           </div>
        </div>

        {/* Stat strips */}
        <div className="space-y-2 mb-8 bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
           <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Run Rate Sales</span>
              <span className="text-[12px] font-black text-gray-700">{item.runRate || "INR 3.6 - 64 lakh"}</span>
           </div>
           <div className="flex justify-between items-center py-2 border-t border-gray-100/50">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">EBITDA Margin</span>
              <span className="text-[12px] font-black text-gray-700">{item.margin || "20 - 30 %"}</span>
           </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                {item.type === 'Sale' ? 'Business For Sale' : 'Investment Value'}
              </span>
              <span className="text-2xl font-black text-sky-700 tracking-tighter">
                {item.price}
              </span>
           </div>
           <Link to="/contact-us" className="px-6 py-4 bg-[#FFDB00] text-gray-900 font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all">
              Contact Business
           </Link>
        </div>
      </div>
    </div>
  );
};

const CITIES = ['All Cities', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Pune', 'Delhi NCR', 'Kolkata'];

const SchoolSale = () => {
  const { blocks, loading } = useCMSPage('school-sale');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchTerm, setSearchTerm] = useState('');

  const listings = blocks?.listings?.items || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return null;

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         l.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || l.location.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  return (
    <main className="min-h-screen bg-white">
       {/* Small Hero Strip (Smergers Style) */}
       <section className="bg-gray-50/50 py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-8 h-0.5 bg-sm-blue rounded-full" />
                   <span className="text-[10px] font-black text-sm-blue uppercase tracking-[0.3em]">Institutional M&A</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                  Schools for <span className="text-sm-blue italic font-serif lowercase tracking-normal">Sale & Lease.</span>
                </h1>
             </div>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="SEARCH BY CITY OR KEYWORD..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-sm-blue shadow-sm transition-all"
                />
             </div>
          </div>
       </section>

       <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
             
             {/* LEFT SIDEBAR: CITIES */}
             <aside className="w-full lg:w-72 shrink-0 space-y-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                   <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">HOT LOCATIONS</h3>
                   <div className="h-0.5 flex-grow bg-gray-100 rounded-full" />
                </div>
                
                <div className="space-y-2">
                   {CITIES.map((city, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setSelectedCity(city); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCity === city ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                         {city}
                         <ChevronRight size={14} className={`transition-transform ${selectedCity === city ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                   ))}
                </div>

                {/* Sidebar Call to Action */}
                <div className="p-8 bg-sm-blue rounded-[35px] text-white mt-12 relative overflow-hidden group shadow-2xl shadow-blue-500/20">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                      <Zap size={80} />
                   </div>
                   <h4 className="text-sm font-black uppercase tracking-tight mb-2 relative z-10">Institutional <br /> Advisory?</h4>
                   <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-loose mb-6 relative z-10">
                      We help you find the right mandate for your school growth.
                   </p>
                   <Link to="/contact-us" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sm-blue font-black rounded-full text-[9px] uppercase tracking-widest hover:scale-105 transition-all relative z-10">
                      Contact Us <ArrowRight size={14} />
                   </Link>
                </div>
             </aside>

             {/* MAIN GRID */}
             <div className="flex-grow">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{selectedCity}</span>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{filteredListings.length} ACTIVE MANDATES</h2>
                   </div>
                </div>

                {filteredListings.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredListings.map((item, i) => (
                         <PropertyListingCard key={i} item={item} />
                      ))}
                   </div>
                ) : (
                   <div className="py-32 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                      <Search size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight text-gray-400">No results found</h3>
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
