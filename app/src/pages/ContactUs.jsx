// src/pages/ContactUs.jsx
import { useState } from 'react';
import { MapPin, Send, Clock, MessageSquare, Video, Calendar, Sparkles } from 'lucide-react';
import { submitQuote } from '../services/api';
import { useCMSPage } from '../hooks/useCMSBlock';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Connect with Experts',
    titleHtml: 'Let\'s Build \n The Future \n <span class="text-sm-blue italic font-serif tracking-[0.05em]">Together.</span>',
    subtitle: 'From architectural blueprints to furniture installations, we assist you in every step.',
    email: 'info@schoolmart.in',
    phone: '+91 888 444 1234',
  },
  quoteBox: {
    title: 'GET A QUOTE',
    subtitle: 'Tailored Solutions for Your School',
    btnText: 'Connect',
  },
  accessCards: [
    { i: 'Video', t: 'Video Consultation', d: 'Schedule a virtual tour.', c: 'bg-emerald-50 text-emerald-600' },
    { i: 'Calendar', t: 'Site Visit', d: 'Invite our experts.', c: 'bg-orange-50 text-orange-600' },
    { i: 'MapPin', t: 'Registered Hub', d: 'Visit our flagship office.', c: 'bg-blue-50 text-blue-600' },
    { i: 'Clock', t: '24/7 Support', d: 'Round the clock assistance.', c: 'bg-purple-50 text-purple-600' },
  ],
  faq: {
    title: 'Common Queries.',
    subtitle: 'Institutional Service & Support FAQ',
    items: [
      { q: 'Pan-India Installation Support?', a: 'Yes, we maintain a robust service network across 22 states for seamless on-site assembly.' },
      { q: 'Typical Project Lead Times?', a: 'Standard production cycles range from 4-6 weeks depending on the scale of furniture & tech.' },
      { q: 'NEP 2020 Compliance Status?', a: 'Our entire catalog is 100% aligned with NEP 2020 guidelines and global safety protocols.' },
      { q: 'Institutional Site Planning?', a: 'Our design experts offer end-to-end architectural layouts and ergonomics consulting.' },
      { q: 'Bulk Procurement Discounts?', a: 'We offer tiered pricing for large-scale institutional projects and government tenders.' },
      { q: 'Software & Content Updates?', a: 'Digital solution clients receive quarterly OTA updates for all curriculum-aligned software.' },
    ]
  }
};

const ICONS = { Video, Calendar, MapPin, Clock, MessageSquare, Sparkles, Send };

const ContactUs = () => {
  const [form, setForm] = useState({ schoolName: '', phone: '', pinCode: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  
  const { blocks, loading } = useCMSPage('contact-us');
  const d = blocks?.contact_page_content || DEFAULT_CONTENT;

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitQuote({ schoolName: form.schoolName, pinCode: form.pinCode, phone: form.phone, message: form.message });
      setStatus('success');
      setForm({ schoolName: '', phone: '', pinCode: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sm-blue"></div></div>;

  return (
    <main className="min-h-screen bg-gray-50 pt-10 pb-12 overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100 rounded-full blur-3xl opacity-10 -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-100 rounded-full blur-3xl opacity-10 -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
           <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 bg-blue-50 text-sm-blue font-black rounded-full mb-6 text-[10px] uppercase tracking-widest shadow-sm border border-blue-100"><MessageSquare size={14} className="inline mr-2" /> {d.hero?.badge}</span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-heading leading-tight mb-6 tracking-tighter uppercase whitespace-pre-line" dangerouslySetInnerHTML={{ __html: d.hero?.titleHtml }} />
              <p className="text-base text-gray-500 leading-relaxed max-w-lg mb-8 font-medium">
                 {d.hero?.subtitle}
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-left">
                 <div className="group border-l-4 border-gray-100 pl-4 py-1 hover:border-sm-blue transition-all">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Strategy</p>
                    <a href={`mailto:${d.hero?.email}`} className="text-lg font-black text-gray-900 group-hover:text-sm-blue transition-colors">{d.hero?.email}</a>
                 </div>
                 <div className="group border-l-4 border-gray-100 pl-4 py-1 hover:border-sm-blue transition-all">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hotline Call</p>
                    <a href={`tel:${d.hero?.phone?.replace(/\s+/g, '')}`} className="text-lg font-black text-gray-900 group-hover:text-sm-blue transition-colors">{d.hero?.phone}</a>
                 </div>
              </div>
           </div>

           {/* GET A QUOTE HIGHLIGHT BOX */}
           <div className="w-full lg:w-[400px] relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-2xl opacity-5 animate-pulse" />
              <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-2xl relative border border-gray-100 overflow-hidden transform group hover:-rotate-1 transition-transform">
                 <div className="absolute top-0 left-0 right-0 h-2 bg-sm-blue" />
                 <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 font-heading tracking-tight mb-1 uppercase tracking-widest">{d.quoteBox?.title}</h2>
                    <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">{d.quoteBox?.subtitle}</p>
                 </div>
                 
                 <form className="space-y-4" onSubmit={handleQuoteSubmit}>
                    <div className="relative group">
                       <input required type="text" placeholder="Institutional Name" value={form.schoolName} onChange={e => setForm({...form, schoolName: e.target.value})} disabled={status==='loading' || status==='success'} className="w-full bg-gray-50 px-5 py-3.5 rounded-2xl border border-gray-50 focus:border-sm-blue focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium text-[11px] uppercase tracking-widest disabled:opacity-50" />
                       <Sparkles size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-sm-blue transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <input required type="text" placeholder="Contact No." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} disabled={status==='loading' || status==='success'} className="w-full bg-gray-50 px-5 py-3.5 rounded-2xl border border-gray-50 focus:border-sm-blue focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium text-[11px] uppercase tracking-widest disabled:opacity-50" />
                       <input required type="text" placeholder="City" value={form.pinCode} onChange={e => setForm({...form, pinCode: e.target.value})} disabled={status==='loading' || status==='success'} className="w-full bg-gray-50 px-5 py-3.5 rounded-2xl border border-gray-50 focus:border-sm-blue focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium text-[11px] uppercase tracking-widest disabled:opacity-50" />
                    </div>
                    <textarea required rows="3" placeholder="Requirement Details..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} disabled={status==='loading' || status==='success'} className="w-full bg-gray-50 px-5 py-3.5 rounded-[25px] border border-gray-50 focus:border-sm-blue focus:bg-white outline-none transition-all resize-none placeholder:text-gray-300 font-medium text-[11px] uppercase tracking-widest disabled:opacity-50"></textarea>
                    
                    {status === 'success' && <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium text-center">Thanks! We will connect soon.</div>}
                    {status === 'error' && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium text-center">{errorMsg}</div>}

                    <button disabled={status==='loading' || status==='success'} className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-sm-blue transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                       {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent' : d.quoteBox?.btnText} {status !== 'loading' && status !== 'success' && <Send size={14} />}
                    </button>
                 </form>
              </div>
           </div>
        </div>

        {/* INTERACTIVE ACCESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
           {(d.accessCards || []).map((card, i) => {
             const Icon = ICONS[card.i] || Sparkles;
             return (
               <div key={i} className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-50 group hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer">
                  <div className={`w-14 h-14 ${card.c} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                     <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight uppercase tracking-tight">{card.t}</h3>
                  <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{card.d}</p>
               </div>
             );
           })}
        </div>

        {/* FAQ SECTION */}
        <div className="bg-white rounded-[40px] overflow-hidden p-10 lg:p-14 relative border border-gray-100 shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-sm-blue opacity-5 rounded-full blur-3xl animate-pulse" />
           
           <div className="relative z-10 text-center mb-12">
              <h4 className="text-3xl font-black font-heading mb-2 tracking-tight uppercase text-gray-900">{d.faq?.title}</h4>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.3em]">{d.faq?.subtitle}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 relative z-10">
              {(d.faq?.items || []).map((faq, i) => (
                 <div key={i} className="bg-gray-50 rounded-[25px] p-8 border border-gray-100 group hover:border-sm-blue transition-all">
                    <h5 className="text-[12px] font-black uppercase text-gray-900 mb-3 tracking-tighter flex items-center gap-3">
                       <Sparkles size={14} className="text-sm-blue group-hover:rotate-45 transition-transform" />
                       {faq.q}
                    </h5>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">{faq.a}</p>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </main>
  );
};

export default ContactUs;
