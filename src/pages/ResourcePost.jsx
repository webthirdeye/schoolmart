import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Share2, MapPin, MessageSquare, Download, Sparkles, Box, FileText, Award } from 'lucide-react';
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
    'skill-labs': { 
        title: 'Composite Skill Labs: Future-Ready Education', 
        subtitle: 'Preparing students for the challenges of tomorrow with NEP 2026 compliant lab ecosystems.', 
        image: '/images/discovery-pod.png', 
        content: `
            <p class="text-lg text-gray-700 leading-relaxed mb-6">Our Composite Skill Labs are designed as multi-disciplinary hubs where Science, Technology, Engineering, and Art converge. These labs are fully compliant with NEP 2026 and CBSE standards, providing a "Discovery Pod" environment for hands-on learning.</p>
            
            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Available Lab Packages</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h3 class="font-black text-sm-blue mb-2">BASIC PACKAGE</h3>
                    <p class="text-xs font-bold text-gray-500 mb-4">₹2L - ₹5L</p>
                    <ul class="text-xs space-y-2 text-gray-600 font-medium">
                        <li>• Basic Electronics & Robotics</li>
                        <li>• 3D Printing Starter Kit</li>
                        <li>• Basic Life Skills Tools</li>
                        <li>• 4-6 Workstations</li>
                    </ul>
                </div>
                <div class="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <h3 class="font-black text-gray-900 mb-2">ADVANCED PACKAGE</h3>
                    <p class="text-xs font-bold text-gray-500 mb-4">₹3.5L - ₹6.5L</p>
                    <ul class="text-xs space-y-2 text-gray-600 font-medium">
                        <li>• Advanced AI & Coding Kits</li>
                        <li>• Prototyping & CAD Basics</li>
                        <li>• Digital Design Tools</li>
                        <li>• 8-10 Desktop Systems</li>
                    </ul>
                </div>
                <div class="p-6 bg-teal-50 rounded-2xl border border-teal-100">
                    <h3 class="font-black text-teal-700 mb-2">COMPREHENSIVE</h3>
                    <p class="text-xs font-bold text-gray-500 mb-4">₹9L - ₹17L</p>
                    <ul class="text-xs space-y-2 text-gray-600 font-medium">
                        <li>• Full Robotics & Drone Lab</li>
                        <li>• Interactive Smart Panels</li>
                        <li>• High-End Workstations</li>
                        <li>• Complete Furniture Layout</li>
                    </ul>
                </div>
            </div>

            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Core Curriculum Areas</h2>
            <p class="text-gray-600 mb-6">Our labs cover essential skill domains including Electronics, 3D Printing, Prototyping, AI/ML basics, Design Thinking, and even practical life skills like electrical and plumbing basics.</p>
            
            <div class="grid grid-cols-2 gap-4 mb-10">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80" class="rounded-2xl shadow-sm border border-gray-100" />
                <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80" class="rounded-2xl shadow-sm border border-gray-100" />
            </div>
        `, 
        specs: ['NEP 2026 Compliant', 'CBSE Standardized', 'Modular Layouts'], 
        tags: ['STEM', 'Innovation', 'Laboratories'] 
    },
    'ai-classroom': {
        title: '20+ AI Tools for Classrooms',
        subtitle: 'The era of AI is here. Transform your pedagogy with cutting-edge tools.',
        image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1200&q=80',
        content: `
            <p class="text-lg text-gray-700 leading-relaxed mb-6">Artificial Intelligence is no longer a future concept; it is actively reshaping how students learn and teachers manage classrooms. We provide a curated selection of 20+ AI tools designed for modern institutions.</p>
            
            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Personalized Learning & Automation</h2>
            <p class="text-gray-600 mb-8">From AI-powered virtual tutors to automated grading systems, these tools allow teachers to focus more on student interaction and less on administrative tasks.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                    <div class="w-10 h-10 bg-sm-blue text-white rounded-lg flex items-center justify-center font-black shrink-0">01</div>
                    <div>
                        <h4 class="font-black text-gray-900 uppercase text-[11px] mb-1">MagicSchool AI</h4>
                        <p class="text-[11px] text-gray-500 leading-tight">Automated lesson planning and IEP generation for overworked teachers.</p>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                    <div class="w-10 h-10 bg-sm-blue text-white rounded-lg flex items-center justify-center font-black shrink-0">02</div>
                    <div>
                        <h4 class="font-black text-gray-900 uppercase text-[11px] mb-1">Canva Magic Studio</h4>
                        <p class="text-[11px] text-gray-500 leading-tight">AI-driven design tools for creating stunning classroom visuals in seconds.</p>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                    <div class="w-10 h-10 bg-sm-blue text-white rounded-lg flex items-center justify-center font-black shrink-0">03</div>
                    <div>
                        <h4 class="font-black text-gray-900 uppercase text-[11px] mb-1">Curipod</h4>
                        <p class="text-[11px] text-gray-500 leading-tight">Interactive AI lessons that adapt to student feedback in real-time.</p>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                    <div class="w-10 h-10 bg-sm-blue text-white rounded-lg flex items-center justify-center font-black shrink-0">04</div>
                    <div>
                        <h4 class="font-black text-gray-900 uppercase text-[11px] mb-1">Quillbot</h4>
                        <p class="text-[11px] text-gray-500 leading-tight">Advanced paraphrasing and grammar support for student writing improvement.</p>
                    </div>
                </div>
            </div>

            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">The 2026 AI Roadmap</h2>
            <p class="text-gray-600 mb-10">We help schools implement a multi-phase AI adoption strategy, including teacher training, ethics guidelines, and secure data infrastructure.</p>

            <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80" class="w-full rounded-3xl shadow-lg border-8 border-white mb-10" />
        `,
        specs: ['Teacher Training', 'API Integrations', 'Privacy Compliant'],
        tags: ['Technology', 'AI', 'Future']
    },
    'furniture-planning': {
        title: 'Furniture Design & Planning',
        subtitle: 'Revolutionizing Classroom Comfort with 1200+ ergonomic solutions.',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
        content: `
            <p class="text-lg text-gray-700 leading-relaxed mb-6">Classroom comfort is directly linked to student performance. Research shows that ergonomic seating can increase attention spans by up to 27%.</p>
            
            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Design-to-Execution Services</h2>
            <p class="text-gray-600 mb-8">We don't just sell furniture; we plan your entire campus infrastructure. With a catalog of 1200+ models, we cover every corner of your school.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div class="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" class="w-full h-40 object-cover rounded-2xl mb-4" />
                    <h4 class="font-black text-gray-900 uppercase text-[12px] mb-2">Kindergarten Fun</h4>
                    <p class="text-[11px] text-gray-500">Soft-edge designs and vibrant colors for early years.</p>
                </div>
                <div class="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                    <img src="https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=600&q=80" class="w-full h-40 object-cover rounded-2xl mb-4" />
                    <h4 class="font-black text-gray-900 uppercase text-[12px] mb-2">Modular Labs</h4>
                    <p class="text-[11px] text-gray-500">Chemical-resistant surfaces and mobile storage units.</p>
                </div>
            </div>

            <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">The "Ergo-Smart" Series</h2>
            <p class="text-gray-600 mb-6">Our signature chairs are designed to support the lumbar spine, reducing fatigue during long study sessions. Available in 16+ institutional shades.</p>
            
            <div class="bg-sm-blue/5 p-8 rounded-[40px] border border-sm-blue/10 mb-10">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sm-blue shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 10-10M2 12l5 5 2-2"/></svg>
                    </div>
                    <h3 class="font-black text-gray-900 uppercase tracking-tight">Institutional Durability</h3>
                </div>
                <p class="text-[13px] text-gray-600 leading-relaxed font-medium">Every piece undergoes a 12-point stress test to ensure it survives the rigors of a school environment for decades.</p>
            </div>
        `,
        specs: ['1200+ Models', 'Ergonomic Certified', '5-Year Warranty'],
        gallery: [
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80'
        ],
        tags: ['Furniture', 'Design', 'Infrastructure']
    },
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
        cardLabel: innerData.cardLabel || heroBlock.cardLabel || 'Verified Ready',
        gallery: innerData.gallery || blocks?.page_gallery?.images || blocks?.gallery?.images || fallback.gallery || []
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
            <section className="pt-4 pb-8 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                   {/* Back Navigation */}
                   <button 
                       onClick={() => navigate(-1)}
                       className="group flex items-center gap-3 text-gray-400 hover:text-sm-blue transition-all mb-6 animate-in fade-in slide-in-from-left-4 duration-700"
                   >
                       <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group- group-hover:border-sm-blue transition-all">
                           <ArrowLeft size={16} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Hub</span>
                   </button>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                      {/* TEXT CONTENT */}
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                         <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-sm-blue/5 rounded-2xl border border-sm-blue/10 mb-4">
                             <Sparkles size={14} className="text-sm-blue" />
                             <span className="text-[10px] font-black text-sm-blue uppercase tracking-[0.2em]">
                                 {resource.badge}
                             </span>
                         </div>

                         <h1 
                             className="text-3xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-4 uppercase tracking-tight font-heading"
                             dangerouslySetInnerHTML={{ __html: resource.title }} 
                         />

                         <div className="w-16 h-1 bg-sm-blue rounded-full mb-6" />

                         <p className="text-base lg:text-lg text-gray-500 font-medium leading-relaxed mb-6 max-w-xl">
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
            <main className="max-w-7xl mx-auto px-4 lg:px-12 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Content Column */}
                    <div className="flex-1">
                        <div 
                            className="prose prose-lg lg:prose-xl prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: resource.content }}
                        />
                        
                        {/* Gallery Section */}
                        {resource.gallery && resource.gallery.length > 0 && (
                            <div className="mt-16">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Visual Reference Gallery</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {resource.gallery.map((img, idx) => {
                                        const url = typeof img === 'string' ? img : img.url;
                                        const caption = typeof img === 'string' ? `Gallery ${idx}` : (img.caption || `Gallery ${idx}`);
                                        return (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group relative">
                                                <img 
                                                    src={formatImgUrl(url)} 
                                                    alt={caption} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                />
                                                {typeof img !== 'string' && img.caption && (
                                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {img.caption}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Specs Grid */}
                        <div className="mt-10 pt-10 border-t border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px bg-gray-100 flex-1" />
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Technical Parameters</h3>
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

                        {/* CASE STUDIES SECTION (Dynamic from CMS) */}
                        {blocks?.case_studies?.items && blocks.case_studies.items.length > 0 && (
                            <div className="mt-20 pt-20 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                    <div>
                                        <span className="text-[10px] font-black text-sm-blue uppercase tracking-[0.4em] mb-4 block underline underline-offset-8 decoration-sm-yellow decoration-4">Implementation</span>
                                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">Real-World <br/> Impact.</h2>
                                    </div>
                                    <p className="max-w-md text-gray-500 text-[13px] font-bold uppercase tracking-widest leading-relaxed">
                                        Verified outcomes and strategic milestones achieved through specialized advisory.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {blocks.case_studies.items.map((cs, i) => (
                                        <div key={i} className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 group hover:border-sm-blue hover:bg-white hover:shadow-2xl hover:shadow-sm-blue/5 transition-all flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="px-4 py-2 bg-white rounded-2xl border border-gray-100 group-hover:border-sm-blue/20 transition-colors">
                                                    <span className="text-[10px] font-black text-gray-400 group-hover:text-sm-blue uppercase tracking-widest">{cs.focus || 'Case Study'}</span>
                                                </div>
                                                <Award size={24} className="text-sm-yellow transition-transform group-hover:scale-110" />
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-3 flex-grow">{cs.title}</h4>
                                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12} className="text-sm-blue" /> {cs.location}</p>
                                            <p className="text-gray-500 text-[12px] font-medium leading-relaxed mb-10 line-clamp-3">
                                                {cs.cardDescription || cs.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100/50">
                                                <p className="text-emerald-600 font-black text-[20px] uppercase tracking-tighter">{cs.outcome}</p>
                                                <Link to={`/p/${cs.slug || cs.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="text-sm-blue hover:translate-x-1 transition-transform text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    Analysis <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
