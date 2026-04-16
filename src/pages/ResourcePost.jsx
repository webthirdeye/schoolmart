import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Share2, MapPin, MessageSquare, Download } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';

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
    const { blocks } = useCMSPage(`resource-${slug}`);
    const heroBlock = blocks?.page_hero || {};
    const contentBlock = blocks?.page_content || {};
    const specsBlock = blocks?.resource_specs || {};
    const fallback = RESOURCE_DATA[slug] || {
        title: (slug || '').replace(/-/g, ' ').toUpperCase(),
        subtitle: `In-depth technical analysis and implementation roadmap for ${slug?.replace(/-/g, ' ')}.`,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
        content: `<p class="text-lg text-gray-700 leading-relaxed mb-6">Our experts are currently compiling the latest institutional standards and procurement guidelines for this resource module.</p>`,
        specs: ['Compliance Check', 'Value Engineering', 'Standardization'],
        tags: ['Institutional', 'Guide', '2025 Spec']
    };
    const resource = {
        title: heroBlock.titleHtml || heroBlock.title || fallback.title,
        subtitle: heroBlock.subtitle || fallback.subtitle,
        image: heroBlock.img || fallback.image,
        content: contentBlock.content || fallback.content,
        specs: specsBlock.specs || fallback.specs,
        tags: specsBlock.tags || fallback.tags,
    };

    return (
        <div className="bg-white flex flex-col font-sans">
            {/* NEW: Premium Full-Width Hero Section */}
            <section className="relative w-full min-h-[550px] flex items-center overflow-hidden bg-gray-900">
                {/* Background Image with optimized overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={resource.image} 
                        alt={resource.title} 
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 pt-20 pb-16">
                    {/* Back button with glass effect */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-white/60 hover:text-white transition-all mb-12"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-[0.3em]">Institutional Hub</span>
                    </button>

                    <div className="max-w-3xl">
                        {/* Dynamic Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sm-blue rounded-full border border-white/20 mb-8 shadow-2xl animate-fade-in">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                                {heroBlock.badge || 'Resource Center'}
                            </span>
                        </div>

                        {/* Master Title */}
                        <h1 
                            className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tight drop-shadow-2xl"
                            dangerouslySetInnerHTML={{ __html: resource.title }} 
                        />

                        {/* Subtitle */}
                        <p className="text-xl lg:text-2xl text-white/80 font-medium leading-relaxed mb-12 max-w-2xl border-l-4 border-sm-blue pl-6">
                            {resource.subtitle}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-6">
                            <button className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl text-[14px] uppercase tracking-[0.2em] shadow-2xl hover:bg-sm-blue hover:text-white transition-all flex items-center gap-4 active:scale-95 group">
                                {heroBlock.btn1Label || 'Download Guide'} 
                                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                            <button className="px-10 py-5 bg-transparent text-white border-2 border-white/30 backdrop-blur-md font-black rounded-2xl text-[14px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-4">
                                {heroBlock.btn2Label || 'Share Post'} <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Floating Floating Logic Badge - Only shown if active */}
                    <div className="absolute bottom-16 right-6 lg:right-12 hidden md:block">
                        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-2xl max-w-[280px] hover:scale-105 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-sm-blue rounded-2xl text-white shadow-lg">
                                    <MapPin size={20} />
                                </div>
                                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-none">
                                    {heroBlock.cardLabel || 'Global Standard'}
                                </span>
                            </div>
                            <p className="text-white font-bold text-lg leading-tight">
                                {heroBlock.cardText || 'Implementing NEP 2020 Compliance'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Body */}
            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Content Column */}
                    <div className="flex-1 bg-white p-8 lg:p-12 rounded-[40px] shadow-sm border border-gray-100">
                        <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: resource.content }}
                        />
                        
                        {/* Specs Grid */}
                        <div className="mt-12 pt-12 border-t border-gray-100">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Technical Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {resource.specs.map(spec => (
                                    <div key={spec} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center group hover:bg-sm-blue hover:text-white transition-all duration-300">
                                        <p className="font-black text-[13px] uppercase tracking-widest">{spec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                        {/* Related Tags */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-gray-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Consultant CTA */}
                        <div className="bg-sm-navy p-8 rounded-[32px] text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <MessageSquare className="text-sm-yellow mb-4" size={32} />
                                <h3 className="text-xl font-black mb-2 uppercase tracking-tight leading-tight">Need Expert Advice?</h3>
                                <p className="text-white/70 text-sm leading-relaxed mb-6">Our campus planners are ready to help you visualize your space.</p>
                                <Link to="/contact-us" className="w-full py-3 bg-white text-sm-navy font-black rounded-xl text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-sm-yellow transition-colors group-hover:shadow-xl">
                                    Talk to Us <ArrowRight size={14} />
                                </Link>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                        </div>
                    </aside>
                </div>
            </main>


        </div>
    );
};

export default ResourcePost;
