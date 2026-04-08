import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMSPage } from '../hooks/useCMSBlock';
import { ArrowRight, Zap, Shield, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getProducts } from '../services/api';

const GenericInnerPage = ({ explicitSlug }) => {
  const params = useParams();
  const slug = explicitSlug || params.slug;
  const { blocks, loading } = useCMSPage(slug);
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');

  const heroBlock = blocks?.inner_page_hero || {};
  const textContent = blocks?.text_content || { title: '', body: '' };
  const benefitsBlock = blocks?.benefits || null;
  const listCategoriesBlock = blocks?.categories || null;
  const upcomingEventsBlock = blocks?.upcoming_events || null;

  const pageTitle = (slug || '').replace(/-/g, ' ').toUpperCase();

  const FALLBACK_CATEGORIES = {
    'school-sale': ['Premium Campuses', 'Lease Opportunities', 'Operational Schools', 'Greenfield Projects'],
    'partnerships': ['Academic Alliances', 'Financial Partnerships', 'EdTech Collaborations', 'Sports Academies'],
    'workshops': ['Masterclasses', 'Webinars', 'Leadership Summits', 'Teacher Training'],
    'setup-guide': ['Compliance & Legal', 'Infrastructure Planning', 'Curriculum Design', 'Resource Audits'],
    'fundraising': ['Seed Capital', 'Expansion Funds', 'Grants', 'Investor Pitch'],
    'digitization-guide': ['Hardware Deployment', 'Learning Management', 'Teacher Training', 'Campus ERP'],
    'setup-school-india': ['Registration', 'Infrastructure', 'Board Norms', 'Finance'],
    'skill-lab-guide': ['STEM Infrastructure', 'Robotics Kits', 'ATL Labs', 'Curriculum Kits'],
    'play-furniture-lookbook': ['Pre-Primary', 'Outdoor Play', 'Soft Play Area', 'Classroom Modular'],
    'gamified-math-resources': ['Math Labs', 'Board Games', 'Digital Platforms', 'Kit Training'],
    'completed-projects': ['K-12 Schools', 'Preschools', 'Institutional Hubs'],
    'school-design-ideas': ['Façade Design', 'Corridor Utilization', 'Smart Classrooms', 'Library Layouts'],
    'library-trends': ['Digital Catalogs', 'Reading Zones', 'Furniture Selection', 'Resource Digitization'],
    'job-openings': ['Academic roles', 'Operational roles', 'Sales & Marketing', 'Technical Support'],
    'influencers': ['Education Content', 'Brand Collaborations', 'Event Partnerships', 'Advocacy'],
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

  if (loading) return null;

  return (
    <main className="min-h-screen bg-white pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* COMPACT HERO STRIP */}
        <section className="bg-gray-50 border-x border-b border-gray-100 rounded-b-[40px] px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-sm">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sm-blue" />
              <span className="text-sm-blue text-[10px] font-black uppercase tracking-[0.3em]">Resource Hub</span>
            </div>
            <h1
              className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-2 leading-none"
              dangerouslySetInnerHTML={{ __html: heroBlock.titleHtml || heroBlock.title || textContent.title || pageTitle }}
            />
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-loose max-w-lg">
              {heroBlock.subtitle || `Accelerating ${pageTitle.toLowerCase()} strategies through modern infrastructure and expert models.`}
            </p>
          </div>
          <button className="px-6 py-3 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all">Download Guide</button>
        </section>

        {/* CATEGORY CHIP NAV */}
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

        {/* CONTENT GRID */}
        {!loading && (
          <div className="space-y-6">
            {benefitsBlock && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(benefitsBlock.items || []).map((b, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col hover:border-sm-blue transition-all group">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <Award size={20} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">{b.title}</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-loose">{b.description}</p>
                  </div>
                ))}
              </div>
            )}

            {listCategoriesBlock && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(listCategoriesBlock.items || []).map((cat, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-[35px] p-8 flex flex-col items-start shadow-sm hover:shadow-xl transition-all">
                    <div className={`w-10 h-10 ${cat.color || 'bg-blue-50 text-blue-600'} rounded-xl flex items-center justify-center mb-6`}>
                      <Shield size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none mb-4">{cat.title}</h3>
                    <ul className="space-y-2.5 w-full">
                      {(cat.items || []).map((li, j) => (
                        <li key={j} className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={12} className="text-sm-blue" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {filteredItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            )}

            {!benefitsBlock && !listCategoriesBlock && !upcomingEventsBlock && filteredItems.length === 0 && (
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
        )}
      </div>
    </main>
  );
};

export default GenericInnerPage;
