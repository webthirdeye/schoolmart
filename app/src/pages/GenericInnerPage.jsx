import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMSPage } from '../hooks/useCMSBlock';
import { getIcon } from '../utils/iconMap';
import { 
  ArrowRight, Zap, Shield, Award, ChevronRight, CheckCircle2, 
  Download, Box, Phone, MapPin, ExternalLink, Clock, Layers, FileText
} from 'lucide-react';
import { getProducts } from '../services/api';

const GenericInnerPage = ({ explicitSlug }) => {
  const params = useParams();
  const slug = explicitSlug || params.slug;
  const { blocks, loading } = useCMSPage(slug);
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const textContent = blocks?.text_content || { title: '', body: '' };
  const resourceGrid = blocks?.resource_grid || null;
  const catalogGrid = blocks?.catalog_grid || null;
  const portfolioGrid = blocks?.portfolio_grid || null;
  const lookbookGrid = blocks?.lookbook_grid || null;
  const jobListings = blocks?.job_listings || null;
  const innerPageCta = blocks?.inner_page_cta || null;

  const pageTitle = (slug || '').replace(/-/g, ' ').toUpperCase();

  const FALLBACK_CATEGORIES = {
    'school-sale': ['Premium Campuses', 'Lease Opportunities', 'Operational Schools', 'Greenfield Projects'],
    'partnerships': ['Academic Alliances', 'Financial Partnerships', 'EdTech Collaborations', 'Sports Academies'],
    'workshops': ['Masterclasses', 'Webinars', 'Leadership Summits', 'Teacher Training'],
    'setup-guide': ['Compliance & Legal', 'Infrastructure Planning', 'Curriculum Design', 'Resource Audits'],
    'fundraising': ['Seed Capital', 'Expansion Funds', 'Grants', 'Investor Pitch'],
    'digitization-guide': ['Hardware Deployment', 'Learning Management', 'Teacher Training', 'Campus ERP'],
    'product-catalog-2025': ['Furniture', 'Digital', 'Learning', 'Lab Spaces'],
    'setup-school-india': ['Registration', 'Infrastructure', 'Board Norms', 'Finance'],
    'skill-lab-guide': ['STEM Infrastructure', 'Robotics Kits', 'ATL Labs', 'Curriculum Kits'],
    'play-furniture-lookbook': ['Pre-Primary', 'Outdoor Play', 'Soft Play Area', 'Classroom Modular'],
    'gamified-math-resources': ['Math Labs', 'Board Games', 'Digital Platforms', 'Kit Training'],
    'completed-projects': ['K-12 Schools', 'Preschools', 'Institutional Hubs'],
    'design-ideas': ['Façade Design', 'Corridor Utilization', 'Smart Classrooms', 'Library Layouts'],
    'library-trends': ['Digital Catalogs', 'Reading Zones', 'Furniture Selection', 'Resource Digitization'],
    'job-openings': ['Academic roles', 'Operational roles', 'Sales & Marketing', 'Technical Support'],
    'influencer-program': ['Education Content', 'Brand Collaborations', 'Event Partnerships', 'Advocacy'],
  };

  const cats = FALLBACK_CATEGORIES[slug] || ['Overview', 'Resources', 'Case Studies', 'News'];

  useEffect(() => {
    getProducts({}).then(res => setItems(res || []));
    window.scrollTo(0, 0);
  }, [slug]);

  const filteredItems = items.filter(p => !selectedCat || (p.subcategory || '').toUpperCase() === selectedCat.toUpperCase());

  useEffect(() => {
    if (!loading && cats.length > 0 && !selectedCat) {
      setSelectedCat(cats[0]);
    }
  }, [loading, cats, selectedCat]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-sm">
      Loading Resource Blueprint...
    </div>
  );

  const HeroIcon = getIcon(heroBlock.icon || 'Zap');
  const theme = heroBlock.theme || 'Light';

  const themeClasses = {
    Dark: {
      bg: 'bg-white',
      text: 'text-gray-900',
      sub: 'text-gray-400',
      accent: 'text-sm-blue',
      badge: 'bg-sm-blue/10 text-sm-blue',
      border: 'border-gray-100'
    },
    Rose: {
      bg: 'bg-rose-50/50',
      text: 'text-gray-900',
      badge: 'bg-rose-500 text-white border-rose-200',
      subtitle: 'text-gray-400',
      hr: 'bg-rose-500/5'
    },
    Emerald: {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      badge: 'bg-emerald-600 text-white border-emerald-500',
      subtitle: 'text-gray-400',
      hr: 'bg-emerald-500/5'
    },
    Light: {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      badge: 'bg-gray-900 text-white border-gray-800',
      subtitle: 'text-gray-400',
      hr: 'bg-sm-blue/5'
    }
  }[theme] || themeClasses.Light;

  return (
    <main className="min-h-screen bg-white pb-12">
      {/* ──────────────────────────────────────────
          1. HERO SECTION
      ────────────────────────────────────────── */}
      <section className={`${themeClasses.bg} py-16 px-6 relative overflow-hidden border-b border-gray-100`}>
        <div className={`absolute top-0 right-0 w-1/4 h-full ${themeClasses.hr} skew-x-12 -mr-12 pointer-events-none`} />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 ${themeClasses.badge} rounded-full mb-6 border`}>
              <HeroIcon size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">{heroBlock.badge || 'Resource Hub'}</span>
            </div>
            <h1 
              className={`text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6 ${themeClasses.text}`}
              dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || heroBlock.title || pageTitle }}
            />
            <p className={`${themeClasses.subtitle} text-[11px] font-black uppercase tracking-widest leading-loose max-w-lg mb-10`}>
              {heroBlock.description || heroBlock.subtitle || textContent.title || `Accelerating ${pageTitle.toLowerCase()} strategies through modern infrastructure.`}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('content-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3.5 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-blue-500/20"
              >
                {heroBlock.actionText || 'Explore Modules'}
              </button>
            </div>
          </div>

          {heroBlock.stats && (
            <div className="flex-shrink-0 grid grid-cols-2 gap-4">
              {heroBlock.stats.map((stat, i) => (
                <div key={i} className="bg-white/5 p-6 shadow-xl rounded-[30px] border border-white/10 backdrop-blur-md flex flex-col items-center min-w-[120px]">
                   <span className="text-2xl font-black text-white leading-none mb-1">{stat.value}</span>
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12" id="content-grid">
        {/* ──────────────────────────────────────────
            2. CATEGORY CHIP NAV
        ────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {cats.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCat === cat ? 'bg-sm-blue text-white shadow-lg shadow-blue-500/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ──────────────────────────────────────────
            3. CONTENT BLOCKS
        ────────────────────────────────────────── */}
        <div className="space-y-12">
          
          {/* A. RESOURCE GRID (3-Column Bento) */}
          {resourceGrid && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(resourceGrid.items || []).map((item, i) => {
                const ItemIcon = getIcon(item.icon || 'Box');
                return (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-[35px] p-10 group hover:bg-white hover:shadow-2xl transition-all flex flex-col h-full border hover:scale-[1.02] duration-500">
                    <div className={`w-12 h-12 ${item.color || 'bg-sm-blue'} text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/10`}>
                      <ItemIcon size={20} />
                    </div>
                    {item.badge && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{item.badge}</span>}
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">{item.title}</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed mb-10 flex-grow">{item.desc}</p>
                    <div className="space-y-4 pt-8 border-t border-gray-100">
                      {(item.items || []).map((li, j) => (
                        <div key={j} className="flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-emerald-500" />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight line-clamp-1">{li}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* B. CATALOG GRID */}
          {catalogGrid && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(catalogGrid.catalogs || []).map((cat, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col hover:scale-[1.02] duration-500">
                  <div className="h-48 relative overflow-hidden shrink-0">
                     <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                     <div className={`absolute top-4 left-4 ${cat.color} text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl shadow-black/20`}>{cat.subtitle}</div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                     <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">{cat.title}</h2>
                     <div className="flex gap-6 mb-10 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                           <Layers size={14} className="text-gray-400" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{cat.pages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <FileText size={14} className="text-gray-400" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{cat.size}</span>
                        </div>
                     </div>
                     <button className="mt-auto py-4 bg-gray-50 hover:bg-sm-blue hover:text-white text-gray-400 font-black rounded-xl text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Download size={14} /> Download PDF
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* C. LOOKBOOK GRID (Alternating) */}
          {lookbookGrid && (
            <div className="flex flex-col gap-8">
              {(lookbookGrid.collections || []).map((coll, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-12 bg-white border border-gray-100 rounded-[45px] p-12 hover:shadow-2xl transition-all group">
                  <div className={`md:w-1/2 h-80 relative overflow-hidden rounded-[40px] ${i % 2 === 1 ? 'md:order-last' : ''}`}>
                    <img src={coll.img} alt={coll.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="md:w-1/2 flex flex-col">
                    <span className={`w-fit px-4 py-1.5 ${coll.color} text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-6`}>{coll.subtitle}</span>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">{coll.title}</h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed mb-8">{coll.desc}</p>
                    <button className="w-fit flex items-center gap-3 text-sm-blue font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all">
                      View Full Collection <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* D. JOB LISTINGS */}
          {jobListings && (
            <div className="flex flex-col gap-4">
              {(jobListings.jobs || []).map((job, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-[30px] p-8 flex flex-col md:flex-row items-center justify-between group hover:border-sm-blue transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm-blue text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full">{job.dept}</span>
                      <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-sm-blue transition-colors">{job.role}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                       <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    </div>
                  </div>
                  <div className="mt-8 md:mt-0 items-end flex flex-col gap-2">
                    <button className="px-10 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all flex items-center gap-3">
                       Apply Now <ExternalLink size={14} />
                    </button>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">v2025-04 Posting</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* E. PORTFOLIO GRID */}
          {portfolioGrid && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(portfolioGrid.projects || []).map((p, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col hover:scale-[1.02] duration-500">
                    <div className="h-56 relative overflow-hidden shrink-0">
                       <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className={`absolute top-4 left-4 ${p.color} text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl shadow-black/20 flex items-center gap-2`}>
                          <MapPin size={10} /> {p.subtitle}
                       </div>
                    </div>
                    <div className="p-10 flex flex-col flex-grow">
                       <div className="flex gap-2 mb-6">
                          {(p.tags || []).map((tag, t) => (
                             <span key={t} className="text-[7px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 rounded-full px-3 py-1">{tag}</span>
                          ))}
                       </div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4 min-h-[3rem] line-clamp-2">{p.title}</h3>
                       <p className="text-gray-500 text-[11px] leading-relaxed mb-10 flex-grow line-clamp-3">{p.desc}</p>
                       <button className="w-fit flex items-center gap-3 text-sm-blue font-black uppercase text-[10px] tracking-widest group-hover:gap-6 transition-all">
                          Explore Case Study <ArrowRight size={18} />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          )}

          {/* F. FALLBACK: TEXT CONTENT / NOT FOUND */}
          {!resourceGrid && !catalogGrid && !portfolioGrid && !lookbookGrid && !jobListings && filteredItems.length === 0 && (
            <div className="bg-gray-50 rounded-[30px] border border-gray-100 p-10 text-center min-h-[400px] flex items-center justify-center">
              {textContent.body ? (
                <div className="text-left w-full prose-sm max-w-none">
                  <div className="text-gray-600 leading-loose" dangerouslySetInnerHTML={{ __html: textContent.body }} />
                </div>
              ) : (
                <div className="max-w-xs text-center">
                  <Zap size={32} className="mx-auto mb-6 text-sm-blue/20" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Detailed insights for {pageTitle} are being curated for the 2025 Institutional Handbook.
                  </p>
                  <Link to="/contact-us">
                    <button className="mt-6 px-8 py-3 bg-gray-900 text-white font-black rounded-xl text-[9px] uppercase tracking-widest">Inquire for Early Access</button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────
            4. DYNAMIC PRODUCTS HUB
        ────────────────────────────────────────── */}
        {filteredItems.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
               <Box className="text-sm-blue" /> Related Infrastructure Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredItems.map((work, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col group hover:shadow-xl transition-all">
                  <span className="text-sm-blue text-[9px] font-black uppercase tracking-widest mb-2">{work.subcategory || 'RESOURCE'}</span>
                  <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tight mb-4 group-hover:text-sm-blue transition-colors line-clamp-2 min-h-[2.5rem]">{work.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-sm-blue flex items-center gap-2">Read Guide <ArrowRight size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────
          5. FOOTER CTA STRIP
      ────────────────────────────────────────── */}
      {innerPageCta && (
        <section 
          className={`py-16 px-6 rounded-[50px] mx-6 mt-20 mb-12 flex flex-col items-center justify-center text-center group transition-all duration-700
            ${innerPageCta.theme === 'Black' ? 'bg-gray-950 text-white' : 
              innerPageCta.theme === 'Blue' ? 'bg-sm-blue text-white' : 
              innerPageCta.theme === 'Rose' ? 'bg-rose-50 text-gray-900 border border-rose-100' :
              innerPageCta.theme === 'Emerald' ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-900 border border-gray-100'}
          `}
        >
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 max-w-2xl px-4">{innerPageCta.title}</h3>
          {innerPageCta.subtitle && <p className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-10">{innerPageCta.subtitle}</p>}
          <button 
            className={`px-12 py-5 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 duration-500 flex items-center gap-4
              ${innerPageCta.theme === 'Black' || innerPageCta.theme === 'Blue' || innerPageCta.theme === 'Emerald' ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-sm-blue'}
            `}
            onClick={() => window.location.href = innerPageCta.actionLink || '/contact-us'}
          >
            {innerPageCta.actionText || 'Schedule Consultation'}
          </button>
        </section>
      )}
    </main>
  );
};

export default GenericInnerPage;
