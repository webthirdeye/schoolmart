import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Video, MapPin, Globe, Headphones, MessageCircle, Send, ChevronRight, X, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { submitContact } from '../services/api';
import { useCMSPage } from '../hooks/useCMSBlock';

const ContactUs = () => {
    const navigate = useNavigate();
    const [showCaution, setShowCaution] = useState(false);
    const [formData, setFormData] = useState({ schoolName: '', phone: '', city: '', message: '' });
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleFormInteraction = () => {
        if (!user) {
            setShowCaution(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleFormInteraction()) return;

        setStatus('loading');
        try {
            const res = await submitContact({
                schoolName: formData.schoolName,
                phone: formData.phone,
                pinCode: formData.city, // Using city as pinCode field for consistency in contact model
                message: formData.message,
                subject: 'Inquiry from Contact Us Page'
            });
            if (res.error) throw new Error(res.error);
            setStatus('success');
            setFormData({ schoolName: '', phone: '', city: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    const { blocks, loading } = useCMSPage('contact-us');
    const hero = blocks?.inner_page_hero || {
       badge: 'Connect with experts',
       titleHtml: 'Let\'s Build <br /> The Future <br /> <span class="text-blue-600 italic font-serif lowercase tracking-normal px-2">Together.</span>',
       subtitle: 'From architectural blueprints to furniture installations, we assist you in every step.',
    };

    // Instant loading

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;
    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-100 relative">
            {/* HERO SECTION - WHITE THEME */}
            <section className="pt-12 pb-4 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        
                        {/* LEFT CONTENT */}
                        <div className="flex-1 pt-10">
                            {/* Connect Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-10 border border-blue-100 shadow-sm">
                                <MessageCircle size={16} className="text-blue-600" />
                                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{hero.badge}</span>
                            </div>

                            {/* Main Heading */}
                            <h1 
                                className="text-6xl lg:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-6 font-heading"
                                dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                            />

                            {/* Subtitle */}
                            <p className="text-slate-400 text-[14px] font-bold uppercase tracking-widest leading-loose max-w-md mb-8">
                                {hero.subtitle}
                            </p>

                            {/* Direct Contacts Row */}
                            <div className="flex flex-col sm:flex-row gap-12 border-l-2 border-slate-50 pl-8 ml-2">
                                <div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">Email Strategy</span>
                                    <span className="text-slate-900 font-bold text-lg select-all">info@schoolmart.in</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Hotline Call</span>
                                    <span className="text-slate-900 font-bold text-lg select-all">+91 9966109191</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT FORM CARD */}
                        <div className="w-full lg:w-[480px] relative">
                            <div className="bg-white rounded-[50px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] p-12 lg:p-14 relative border border-slate-50 overflow-hidden group">
                                {/* Thick blue top accent */}
                                <div className="absolute top-0 left-0 right-0 h-3 bg-blue-600" />
                                
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">Get a Quote</h2>
                                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mt-2 px-1">Tailored solutions for your school</p>
                                </div>

                                {status === 'success' && (
                                    <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[30px] text-[12px] font-black uppercase tracking-widest mb-8 text-center border border-emerald-100 animate-in zoom-in-95 duration-500">
                                        Success! We'll contact you shortly.
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="bg-red-50 text-red-600 p-6 rounded-[30px] text-[12px] font-black uppercase tracking-widest mb-8 text-center border border-red-100">
                                        Failed to submit. Please try again.
                                    </div>
                                )}

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="relative group/field">
                                        <input 
                                            type="text" 
                                            required
                                            onClick={handleFormInteraction}
                                            value={formData.schoolName}
                                            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                                            placeholder="Institutional Name" 
                                            className="w-full px-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[20px] focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-[12px] uppercase tracking-widest placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="tel" 
                                            required
                                            onClick={handleFormInteraction}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="Contact No." 
                                            className="w-full px-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[20px] focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-[12px] uppercase tracking-widest placeholder:text-slate-300"
                                        />
                                        <input 
                                            type="text" 
                                            required
                                            onClick={handleFormInteraction}
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            placeholder="City" 
                                            className="w-full px-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[20px] focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-[12px] uppercase tracking-widest placeholder:text-slate-300"
                                        />
                                    </div>

                                    <textarea 
                                        rows={3}
                                        required
                                        onClick={handleFormInteraction}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        placeholder="Requirement Details..."
                                        className="w-full px-8 py-6 bg-slate-50/50 border border-slate-100 rounded-[25px] focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-[12px] uppercase tracking-widest placeholder:text-slate-300 resize-none h-32"
                                    />

                                    <button 
                                        disabled={status === 'loading'}
                                        className="w-full mt-4 py-6 bg-slate-900 text-white font-black rounded-[20px] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200 uppercase tracking-[0.3em] text-[12px] group/btn disabled:opacity-50"
                                    >
                                        {status === 'loading' ? 'Processing...' : 'Connect'}
                                        <Send size={18} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                    </button>
                                </form>
                            </div>
                            
                            {/* Decorative background shadow for card depth */}
                            <div className="absolute -bottom-10 -right-10 w-full h-full bg-blue-600/5 -z-10 blur-3xl rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE GRID SECTION */}
            <section className="py-6 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Video, color: 'bg-emerald-50 text-emerald-500', t: 'Video Consultation', s: 'Schedule a virtual tour.' },
                            { icon: MapPin, color: 'bg-orange-50 text-orange-500', t: 'Site Visit', s: 'Invite our experts.' },
                            { icon: Globe, color: 'bg-blue-50 text-blue-500', t: 'Registered Hub', s: 'Visit our flagship office.' },
                            { icon: Headphones, color: 'bg-purple-50 text-purple-600', t: '24/7 Support', s: 'Round the clock assistance.' }
                        ].map((item, i) => (
                            <div key={i} className="p-10 bg-white rounded-[40px] border border-slate-50 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all group cursor-default">
                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group- transition-transform`}>
                                    <item.icon size={26} />
                                </div>
                                <h4 className="text-[17px] font-black text-slate-900 uppercase tracking-tighter mb-2">{item.t}</h4>
                                <p className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">{item.s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-8 bg-slate-50/50 border-t border-slate-100 rounded-[3rem] lg:rounded-[5rem] mt-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-4">
                        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Common Queries.</h2>
                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Institutional Service & Support Hub</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { q: 'Pan-India Installation?', a: 'Professional on-site assembly and setup across all 22 states.' },
                            { q: 'Lead Time?', a: 'Standard production and deployment cycles are 4-6 weeks.' },
                            { q: 'NEP 2020?', a: 'All layouts and lab equipment are 100% compliant with latest guidelines.' },
                            { q: 'Site Audits?', a: 'Free professional auditing for campus redevelopment projects.' },
                            { q: 'Bulk Pricing?', a: 'Tiered factory-direct pricing for institutional scale procurement.' },
                            { q: 'Digital Updates?', a: 'Continuous software support and curriculum updates for all tech hubs.' }
                        ].map((faq, i) => (
                            <div key={i} className="p-10 bg-white rounded-[45px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <h4 className="text-[13px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center justify-between">
                                    {faq.q}
                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-600 transition-all" />
                                </h4>
                                <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CAUTION MODAL */}
            {showCaution && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-[40px] p-10 lg:p-16 max-w-xl w-full shadow-3xl text-center relative overflow-hidden border border-gray-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16" />
                        <button onClick={() => setShowCaution(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
                            <X size={24} />
                        </button>
                        
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <ShieldCheck size={40} strokeWidth={1.5} />
                        </div>
                        
                        <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-heading mb-6 leading-tight uppercase tracking-tighter">Portal <br/> <span className="text-blue-600">Verification.</span></h2>
                        <p className="text-gray-400 text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.2em] mb-12 leading-loose mx-auto max-w-sm">
                            Institutional consultations and quote requests are protected for verified members. Please login to your portal to continue.
                        </p>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full py-5 bg-blue-600 text-white font-black rounded-full uppercase tracking-widest text-[13px] shadow-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3"
                            >
                                Authorize My Portal <ArrowUpRight size={18} />
                            </button>
                            <button 
                                onClick={() => setShowCaution(false)}
                                className="w-full py-5 bg-white text-gray-400 font-black rounded-full uppercase tracking-widest text-[11px] hover:text-gray-900 transition-colors"
                            >
                                Keep Browsing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactUs;
