import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Share2, MapPin, MessageSquare, Download, Sparkles, Box, FileText } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';
import { formatImgUrl } from '../utils/formatters';

// Fallback data for slugs not yet in the CMS
const RESOURCE_DATA = {
    'how-it-works': {
        title: 'How It Works: Connecting Education & Innovation',
        subtitle: 'A seamless journey from discovery to implementation.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
        content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">SchoolMart simplifies the procurement and design process for educational institutions. We bring together architects, educators, and technology providers on a single platform.</p><h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">The 3-Step Process</h2>`,
        specs: ['Needs Assessment', 'Custom Layouts', 'Vendor Vetting'],
        tags: ['Process', 'Onboarding', 'Guide']
    },
    'pricing': { title: 'Transparent Pricing: Value-Driven Innovation', subtitle: 'Optimized costs for maximum institutional impact.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">We believe in fair, transparent pricing that helps schools stretch their budgets without compromising on quality.</p>`, specs: ['Bulk Discounts', 'Institutional Rates', 'GST Invoicing'], tags: ['Finance', 'Budgeting', 'Procurement'] },
    'shipping-policy': { title: 'Shipping & Delivery Policy', subtitle: 'Safe, timely, and professional delivery across India.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">We understand the specific requirements of school deliveries, including restricted hours and sensitive handling.</p>`, specs: ['Pan-India Delivery', 'Scheduled Slots', 'Professional Handling'], tags: ['Logistics', 'Policy', 'Support'] },
    'cancellation-policy': { title: 'Cancellation & Refund Framework', subtitle: 'Clear guidelines for institutional orders.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Institutional orders have unique timelines and commitment structures.</p>`, specs: ['Timeline Based', 'Order Modification', 'Refund processing'], tags: ['Policy', 'Legal', 'Support'] },
    'sell-on-schoolmart': { title: 'Partner with SchoolMart', subtitle: "Join India's leading marketplace for school infrastructure.", image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Reach thousands of schools across Bharat.</p>`, specs: ['Merchant Dashboard', 'Quality QC', 'Payment Security'], tags: ['Partnership', 'Business', 'Growth'] },
    'replacement-return': { title: 'Replacement & Return Framework', subtitle: 'Ensuring quality and satisfaction for every school project.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Our QC teams ensure every item meets institutional durability standards.</p>`, specs: ['QC Documentation', 'Impact Reporting', 'Fast-track Logistics'], tags: ['Policy', 'Quality', 'Support'] },
    'payments': { title: 'Secure Academic Payments', subtitle: 'Flexible and secure transaction methods for institutions.', image: 'https://images.unsplash.com/photo-1554224155-16974a4ea2da?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">We support corporate banking, LC, and milestone-based payments for large infrastructure projects.</p>`, specs: ['PCI DSS Compliant', 'GST Invoicing', 'Escrow Support'], tags: ['Finance', 'Legal', 'Infrastructure'] },
    'order-rejection-policy': { title: 'Order Rejection & Dispute Resolution', subtitle: 'Protecting your interests throughout the delivery process.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Guidelines for rejecting shipments at the time of delivery due to visible damage or mismatch.</p>`, specs: ['Delivery Inspection', 'Immediate Reporting', 'Resolution Timelines'], tags: ['Policy', 'Support', 'Quality'] },
    'immersive-learning': { title: 'Immersive Learning: VR & AR in Education', subtitle: 'Transforming classrooms into infinite worlds of discovery.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Virtual and Augmented Reality are powerful pedagogical tools reshaping how students interact with complex information.</p>`, specs: ['VR Headsets', 'AR Content Library', 'Teacher Training'], tags: ['Technology', 'STEM', 'Innovation'] },
    'kindergarten-design': { title: 'Kindergarten Design: Playful Learning Spaces', subtitle: 'Designing spaces that nurture curiosity, creativity, and joy.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Early childhood environments play a critical role in a child's development.</p>`, specs: ['Ergonomic Seating', 'Sensory Zones', 'Flexible Layouts'], tags: ['Interiors', 'Design', 'Early Years'] },
    'skill-labs': { title: 'Composite Skill Labs: Future-Ready Education', subtitle: 'Preparing students for the challenges of tomorrow.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Our Composite Skill Labs are designed as multi-disciplinary hubs where Science, Technology, Engineering, and Art converge.</p>`, specs: ['Modular Workbenches', 'Robotics Kits', 'Safety Equipment'], tags: ['STEM', 'Innovation', 'Laboratories'] },
    'library-innovations': { title: 'Library Innovations: Modern Reading Spaces', subtitle: 'From quiet zones to collaborative digital hubs.', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">The modern school library is no longer just a warehouse for books.</p>`, specs: ['Acoustic Seating', 'Digital Catalogs', 'Quiet Pods'], tags: ['Interiors', 'Reading', 'Digital'] },
    'interactive-panels': { title: '16 Latest Interactive Panels for Classrooms', subtitle: 'The ultimate tool for the modern educator.', image: 'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?w=1200&q=80', content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Interactive panels are the centerpiece of the smart classroom.</p>`, specs: ['4K UHD Display', 'Multi-touch Tech', 'Android/Windows OS'], tags: ['Technology', 'EdTech', 'Classroom'] },
};

const ResourcePost = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    // Try CMS first, fallback to static RESOURCE_DATA
    const { blocks, loading } = useCMSPage(`resource-${slug}`);
    const { blocks: homeBlocks } = useCMSPage('home');

    // Find if this slug matches a tile in the home page masonry (for deep-edit support)
    const homeTilesArray = homeBlocks?.tiles?.tiles || [];
    const homeTile = homeTilesArray.find(t => 
        t.path === `/p/${slug}` || t.path === slug || t.path?.endsWith(`/${slug}`)
    );
    const innerData = homeTile?.inner || {};

    const heroBlock = blocks?.page_hero || blocks?.inner_page_hero || {};
    const contentBlock = blocks?.page_content || blocks?.text_content || {};
    
    // Priority: Home Tile Deep Edit > Explicit Page Block > Hardcoded Fallback
    const fallback = RESOURCE_DATA[slug] || {
        title: (slug || '').replace(/-/g, ' ').toUpperCase(),
        subtitle: `In-depth technical analysis and implementation roadmap for ${slug?.replace(/-/g, ' ')}.`,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
        content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Our experts are currently compiling the latest institutional standards and procurement guidelines for this resource module.</p>`,
        specs: ['Compliance Check', 'Value Engineering', 'Standardization'],
        tags: ['Institutional', 'Guide', '2025 Spec']
    };

    const resource = {
        title: innerData.heading || heroBlock.titleHtml || heroBlock.title || fallback.title,
        subtitle: innerData.description || heroBlock.subtitle || fallback.subtitle,
        image: innerData.heroImg || heroBlock.img || heroBlock.mediaUrl || fallback.image,
        badge: innerData.badge || heroBlock.badge || fallback.badge || 'RESOURCE GUIDE',
        content: innerData.content || contentBlock.content || contentBlock.body || fallback.content,
        specs: (innerData.specs && innerData.specs.length) ? innerData.specs : (fallback.specs || []),
        tags: (innerData.tags && innerData.tags.length) ? innerData.tags : (fallback.tags || []),
        btn1Label: innerData.btn1Label || heroBlock.btn1Label || 'DOWNLOAD GUIDE',
        btn1Path: innerData.btn1Path || heroBlock.btn1Path || '#',
        btn2Label: innerData.btn2Label || heroBlock.btn2Label || 'SHARE',
        btn2Path: innerData.btn2Path || heroBlock.btn2Path || '#',
        cardLabel: innerData.cardLabel || heroBlock.cardLabel || 'Verified Ready'
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: resource.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-sm">
            Accessing Knowledge...
        </div>
    );

    return (
        <div className="bg-white flex flex-col font-sans">
            <section className="pt-8 pb-16 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                   {/* Back Navigation */}
                   <button 
                       onClick={() => navigate(-1)}
                       className="group flex items-center gap-3 text-gray-400 hover:text-sm-blue transition-all mb-12 animate-in fade-in slide-in-from-left-4 duration-700"
                   >
                       <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group- group-hover:border-sm-blue transition-all">
                           <ArrowLeft size={18} />
                       </div>
                       <span className="text-[11px] font-black uppercase tracking-[0.3em]">Institutional Hub</span>
                   </button>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      {/* TEXT CONTENT */}
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                         <div className="inline-flex items-center gap-3 px-4 py-2 bg-sm-blue/5 rounded-2xl border border-sm-blue/10 mb-8">
                             <Sparkles size={16} className="text-sm-blue" />
                             <span className="text-[11px] font-black text-sm-blue uppercase tracking-[0.2em]">
                                 {resource.badge}
                             </span>
                         </div>

                         <h1 
                             className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-8 uppercase tracking-tight font-heading"
                             dangerouslySetInnerHTML={{ __html: resource.title }} 
                         />

                         <div className="w-20 h-1.5 bg-sm-blue rounded-full mb-10" />

                         <p className="text-lg lg:text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-xl">
                             {resource.subtitle}
                         </p>

                         <div className="flex flex-wrap gap-5">
                             {resource.btn1Path && resource.btn1Path !== '#' ? (
                                <a 
                                    href={resource.btn1Path} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl text-[13px] uppercase tracking-[0.2em] shadow-xl hover:bg-sm-blue hover:shadow-sm-blue/20 transition-all flex items-center gap-4 group"
                                >
                                    {resource.btn1Label} 
                                    <Download size={18} className="transition-transform group-" />
                                </a>
                             ) : (
                                <button className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl text-[13px] uppercase tracking-[0.2em] shadow-xl hover:bg-sm-blue transition-all flex items-center gap-4 group">
                                    {resource.btn1Label} 
                                    <Download size={18} className="transition-transform group-" />
                                </button>
                             )}
                             
                             <button 
                                onClick={resource.btn2Path && resource.btn2Path !== '#' ? () => window.open(resource.btn2Path, '_blank') : handleShare}
                                className="px-10 py-5 bg-white text-gray-900 border border-gray-200 font-black rounded-2xl text-[13px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center gap-4 shadow-sm"
                             >
                                 {resource.btn2Label} {resource.btn2Path && resource.btn2Path !== '#' ? <ArrowRight size={18} /> : <Share2 size={18} />}
                             </button>
                         </div>
                      </div>

                      {/* IMAGE CARRIER */}
                      <div className="relative h-[450px] lg:h-[650px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                         {/* Decorative Background Elements */}
                         <div className="absolute -top-12 -right-12 w-64 h-64 bg-sm-blue/5 blur-3xl rounded-full" />
                         <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-sm-yellow/10 blur-3xl rounded-full" />
                         
                         <div className="w-full h-full rounded-[60px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white relative group">
                            <img 
                                src={formatImgUrl(resource.image)} 
                                alt={resource.title} 
                                className="w-full h-full object-cover transition-transform duration-[2s] group-"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80'; }}
                            />
                            
                            {/* Floating Metadata Card */}
                            <div className="absolute right-8 bottom-8 bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/20 transform transition-all duration-500 hidden sm:block">
                               <div className="flex items-center gap-4 mb-3">
                                  <div className="w-10 h-10 bg-sm-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sm-blue/30">
                                     <Sparkles size={18} />
                                  </div>
                                  <div>
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{resource.cardLabel}</span>
                                     <p className="text-[14px] font-black text-gray-900 uppercase">Resource Verified</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
            </section>

            {/* Main Content Body */}
            <main className="max-w-7xl mx-auto px-4 lg:px-12 py-20">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Content Column */}
                    <div className="flex-1">
                        <div 
                            className="prose prose-lg lg:prose-xl prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: resource.content }}
                        />
                        
                        {/* Specs Grid */}
                        <div className="mt-20 pt-16 border-t border-gray-100">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-px bg-gray-100 flex-1" />
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Technical Parameters</h3>
                                <div className="h-px bg-gray-100 flex-1" />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resource.specs.map((spec, idx) => (
                                    <div key={idx} className="group p-8 bg-gray-50 border border-gray-100 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-sm-blue mb-6 group- transition-transform">
                                            <Box size={18} />
                                        </div>
                                        <p className="font-black text-[14px] text-gray-900 uppercase tracking-widest leading-snug">{spec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-96 space-y-8">
                        {/* Sticky Container */}
                        <div className="sticky top-24 space-y-8">
                            {/* Related Tags */}
                            <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[40px] shadow-sm border border-gray-100/50">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Taxonomy</h3>
                                <div className="flex flex-wrap gap-2">
                                    {resource.tags.map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-white text-gray-600 text-[10px] font-black rounded-xl uppercase tracking-wider border border-gray-100 shadow-sm hover:border-sm-blue hover:text-sm-blue transition-all cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Consultant CTA */}
                            <div className="bg-sm-navy p-10 rounded-[48px] text-white relative overflow-hidden group shadow-2xl shadow-sm-navy/20">
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                                        <MessageSquare className="text-sm-yellow" size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight leading-tight">Expert <br/> Strategic Advice</h3>
                                    <p className="text-white/60 text-[13px] leading-relaxed mb-10 font-medium">Our senior campus planners are available for one-on-one strategy sessions.</p>
                                    
                                    <Link to="/contact-us" className="w-full py-5 bg-white text-sm-navy font-black rounded-[20px] text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-sm-yellow hover:text-sm-navy transition-all group-hover:shadow-2xl">
                                        Book Consultation <ArrowRight size={16} />
                                    </Link>
                                </div>
                                
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 transition-transform duration-1000 group-" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sm-blue/10 rounded-full -ml-16 -mb-16 blur-2xl" />
                            </div>
                            
                            {/* Share & Support Card */}
                            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Did you find this helpful?</p>
                                <div className="flex gap-4">
                                    <button onClick={handleShare} className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                                        Share <Share2 size={14} />
                                    </button>
                                    <button onClick={() => window.print()} className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                                        Print <FileText size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>


        </div>
    );
};

export default ResourcePost;
