// src/components/ResourceTiles.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { submitQuote } from '../services/api';
import { useCMSPage } from '../hooks/useCMSBlock';
import ProductCarousel from './ProductCarousel';
import SidebarWidget from './SidebarWidget';
import { formatImgUrl } from '../utils/formatters';

const tiles = [
  {
    title: 'IMMERSIVE LEARNING',
    subtitle: 'VR & AR in Education',
    path: '/p/immersive-learning',
    height: 'h-64',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
  },
  {
    title: 'KINDERGARTEN DESIGN',
    subtitle: 'Playful Learning Spaces',
    path: '/p/kindergarten-design',
    height: 'h-48',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    title: 'COMPOSITE SKILL LABS',
    subtitle: 'Future-Ready Education',
    path: '/p/skill-labs',
    height: 'h-56',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
  },
  {
    title: 'LIBRARY INNOVATIONS',
    subtitle: 'Modern Reading Spaces',
    path: '/p/library-innovations',
    height: 'h-72',
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  },
  {
    title: 'FURNITURE DESIGN & PLANNING',
    subtitle: 'Custom Solutions',
    path: '/p/furniture-planning',
    height: 'h-52',
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
  },
  {
    title: 'SELLING OR BUYING A SCHOOL',
    subtitle: 'CHECK OPPORTUNITIES WITH US',
    path: '/p/school-sale',
    height: 'h-64',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
    featured: true,
  },
  {
    title: 'GAMIFIED MATH LABS',
    subtitle: 'Learn Math Through Play',
    path: '/p/math-labs',
    height: 'h-48',
    img: 'https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=600&q=80',
  },
  {
    title: 'INTERACTIVE WALLS',
    subtitle: 'Engaging Learning Tools',
    path: '/p/interactive-walls',
    height: 'h-60',
    img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80',
  },
  {
    title: '16 LATEST INTERACTIVE PANELS',
    subtitle: 'FOR CLASSROOMS',
    path: '/p/interactive-panels',
    height: 'h-56',
    img: 'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?w=600&q=80',
  },
  {
    title: 'WONDERGARTENS',
    subtitle: 'Magical Learning Spaces',
    path: '/p/wondergartens',
    height: 'h-48',
    img: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80',
  },
  {
    title: '20+ AI TOOLS FOR CLASSROOMS',
    subtitle: 'WITH TRAINING SUPPORT',
    path: '/p/ai-classroom',
    height: 'h-52',
    img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&q=80',
  },
  {
    title: 'SMART SPORTS FOR SCHOOLS',
    subtitle: 'Next-Gen Sports Infrastructure',
    path: '/p/smart-sports',
    height: 'h-64',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
  },
];


const ResourceTiles = () => {
  const [quoteForm, setQuoteForm] = useState({ schoolName: '', phone: '', pinCode: '', message: '' });
  const [quoteStatus, setQuoteStatus] = useState(null);

  // Fetch CMS data — fall back to static arrays above
  const { blocks } = useCMSPage('home');
  const cmsTiles = blocks?.tiles?.tiles;
  const sidebarTrending = blocks?.sidebar_trending || {};
  const sidebarResources = blocks?.sidebar_resources || {};
  const sidebarBanners = blocks?.sidebar_banners || {};
  const activeTiles = (cmsTiles?.length ? cmsTiles : tiles).map((t, i) => ({
    ...t,
    height: t.height || ['h-64','h-48','h-56','h-72','h-52','h-64','h-48','h-60','h-56','h-48','h-52','h-64'][i % 12],
    featured: !!t.featured,
  }));

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteStatus('loading');
    try {
      await submitQuote(quoteForm);
      setQuoteStatus('success');
      setQuoteForm({ schoolName: '', phone: '', pinCode: '', message: '' });
    } catch {
      setQuoteStatus('error');
    }
  };

  return (
    <section className="pt-0 pb-2 px-4 bg-sm-gray">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Premium Product Carousel */}
            <div className="mb-4 mt-2">
              <ProductCarousel />
            </div>            {/* Masonry Tiles Grid */}
            <div className="columns-2 lg:columns-3 gap-1.5 space-y-1.5">
              {activeTiles.map((tile) => {
                const isExternal = tile.path?.startsWith('http') || tile.path?.startsWith('www');
                const path = tile.path?.startsWith('www') ? `https://${tile.path}` : tile.path;
                
                const TileWrapper = isExternal ? 'a' : Link;
                const wrapperProps = isExternal 
                  ? { href: path, target: "_blank", rel: "noopener noreferrer" } 
                  : { to: path };

                return (
                  <TileWrapper
                    key={tile.title}
                    {...wrapperProps}
                    className={`block break-inside-avoid bg-white rounded-2xl overflow-hidden relative group shadow-sm transition-all duration-300 mb-4 ${tile.featured ? 'border-2 border-sm-yellow shadow-sm-yellow/20 ring-4 ring-sm-yellow/5' : 'border border-gray-200'} h-full`}
                  >
                    <div className={`${tile.height} relative overflow-hidden bg-gray-50`}>
                      <img
                        src={formatImgUrl(tile.img)}
                        alt={tile.title}
                        className="absolute inset-0 w-full h-full object-contain bg-white transition-transform duration-500 group-"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80';
                        }}
                      />

                      {/* Explore Badge */}
                      <div className="absolute top-3 right-3 px-4 py-1.5 bg-white shadow-xl rounded-full flex items-center gap-2 z-10 group-hover:bg-sm-blue transition-all duration-300">
                        <span className="text-[11px] text-sm-blue font-black uppercase tracking-widest group-hover:text-white transition-colors duration-300">Explore</span>
                        <ArrowRight size={14} className="text-sm-blue group-hover:text-white transition-colors duration-300" />
                      </div>
                      
                      {/* Overlay Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <h3 className="text-white font-black text-[18px] font-heading leading-tight uppercase tracking-wide mb-1 group-hover:text-sm-yellow transition-colors duration-300">
                          {tile.title}
                        </h3>
                        <p className="text-white/90 text-[12px] font-bold leading-relaxed uppercase tracking-widest truncate">
                          {tile.subtitle}
                        </p>
                      </div>
                    </div>
                  </TileWrapper>
                );
              })}
            </div>


          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-1.5 mt-2">
            <div className="space-y-1.5">
              <Link
                to="/forums"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-sm-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-sm"
              >
                <MessageSquare size={16} />
                <span className="uppercase tracking-wider text-[13px]">Discussion Forum</span>
              </Link>
                        {/* Get a Quote Form — Highlighted */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-sm-blue">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest text-center">GET A QUOTE</h3>
                </div>
                <form className="p-5 space-y-4" onSubmit={handleQuoteSubmit}>
                  {quoteStatus === 'success' && <div className="bg-green-50 text-green-700 rounded-xl p-3 text-sm font-bold text-center">✅ Quote submitted! We'll contact you shortly.</div>}
                  {quoteStatus === 'error' && <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm font-bold text-center">❌ Failed to submit. Please try again.</div>}
                  <div className="space-y-4">
                    <input type="text" placeholder="School Name" value={quoteForm.schoolName} onChange={e => setQuoteForm(f => ({ ...f, schoolName: e.target.value }))} required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-sm-blue outline-none transition-all placeholder:text-gray-400 font-medium" />
                    <input type="tel" placeholder="Phone Number" value={quoteForm.phone} onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))} required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-sm-blue outline-none transition-all placeholder:text-gray-400 font-medium" />
                    <input type="text" placeholder="Pin Code" value={quoteForm.pinCode} onChange={e => setQuoteForm(f => ({ ...f, pinCode: e.target.value }))} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-sm-blue outline-none transition-all placeholder:text-gray-400 font-medium" />
                    <textarea placeholder="What are you looking for?" value={quoteForm.message} onChange={e => setQuoteForm(f => ({ ...f, message: e.target.value }))} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-sm-blue outline-none transition-all resize-none placeholder:text-gray-400 font-medium"></textarea>
                  </div>
                  <button type="submit" disabled={quoteStatus === 'loading'} className="w-full py-3 bg-sm-blue text-white font-black rounded-xl text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-60">{quoteStatus === 'loading' ? 'Submitting…' : 'Submit Request'}</button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
               <SidebarWidget 
                  title="TRENDING" 
                  type="trending" 
                  items={sidebarTrending?.items?.length ? sidebarTrending.items : [
                    "Schools for Sale / Lease",
                    "Fundraising",
                    "Partnerships",
                    "Workshops",
                    "Job Openings",
                    "Join as Influencers"
                  ]} 
               />
               
               <div className="relative rounded-2xl overflow-hidden shadow-sm h-40">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" alt="Consultation" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-white/90 p-5 flex flex-col items-center justify-center text-gray-900 text-center">
                     <h2 className="text-2xl font-black mb-0 uppercase tracking-tighter text-teal-700">FREE</h2>
                     <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-teal-700">CONSULTATION</h3>
                     <Link to="/contact-us" className="px-6 py-2.5 bg-white text-teal-700 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-colors">Book Now</Link>
                  </div>
               </div>

               <SidebarWidget 
                  title="RESOURCES" 
                  type="resources" 
                  items={sidebarResources?.items?.length ? sidebarResources.items : [
                    "Setup School in India",
                    "Digitization Guide",
                    "Product Catalog 2025",
                    "Skill Lab Guide",
                    "Lookbook – Play Furniture",
                    "Gamified Math Resources",
                    "Completed Projects",
                    "20 Stunning School Design Ideas",
                    "Library Trends"
                  ]} 
               />
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-6">
              <div className="bg-cyan-500 px-4 py-2">
                <h3 className="text-white font-bold text-center uppercase tracking-wide text-sm">Follow Us</h3>
              </div>
              <div className="p-4 flex justify-center gap-3">
                <a href="https://www.facebook.com/schoolmart.in" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://twitter.com/schoolmarts" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:bg-sky-600 transition-colors duration-200 shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="https://www.youtube.com/channel/UCgKY_Kf8jH1hoP3p0I0tiRA" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors duration-200 shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>

            {/* Sidebar Bottom Banners from CMS */}
            <div className="space-y-3">
              {(sidebarBanners?.banners?.length ? sidebarBanners.banners : [
                { label: 'Products for', sublabel: 'Govt Schools', color: '#0057A8', path: '/govt' },
                { label: 'School Renovation', sublabel: 'Services', color: '#9333ea', path: '/renovation' },
                { label: '20 Smart School Ideas', sublabel: '', color: '#f97316', path: '/ideas' },
              ]).map((banner, i) => (
                <Link
                  key={i}
                  to={banner.path || '/'}
                  className="block relative h-16 rounded-2xl overflow-hidden shadow-sm group"
                >
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity group-hover:opacity-90"
                    style={{ backgroundColor: banner.color || '#0057A8' }}
                  >
                    <p className="text-sm font-bold uppercase">{banner.label}</p>
                    {banner.sublabel && <p className="text-[11px] uppercase tracking-[0.2em] font-medium opacity-80">{banner.sublabel}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceTiles;
