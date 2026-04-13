// src/components/CTASection.jsx
import { MessageCircle, Phone } from 'lucide-react';
import { useCMSBlock } from '../hooks/useCMSBlock';

const DEFAULTS = {
  badge: 'Direct Consultation',
  headline: 'Ready to scale your campus?',
  description: 'At SchoolMart, we provide end-to-end expertise in guiding you to set up your new campus project. From spatial planning to high-density procurement, we help you maximize ROI and institutional growth.',
  whatsappNumber: '919966109191',
  phone: '+91 9966109191',
};

const CTASection = () => {
  const { data } = useCMSBlock('home', 'cta_whatsapp', DEFAULTS);
  const d = { ...DEFAULTS, ...data };

  return (
    <section className="py-12 px-4 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-[50px] p-8 md:p-14 border border-gray-100 shadow-sm overflow-hidden group transition-all duration-700 hover:shadow-2xl"
          style={{ backgroundColor: d.bgColor || undefined }}
        >
          {/* If no custom bgColor, show the default soft gradient */}
          {!d.bgColor && (
            <div className="absolute inset-0 bg-gray-50/50 rounded-[50px]" />
          )}
          {/* Premium Background Accents */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sm-blue/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-sm-blue/10 transition-all duration-1000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -ml-48 -mb-48 opacity-40" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white text-sm-blue rounded-full text-[12px] font-black uppercase tracking-[0.3em] mb-6 shadow-sm border border-blue-50/50">
                <div className="w-2 h-2 rounded-full bg-sm-blue animate-pulse" />
                {d.badge}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 font-heading mb-6 tracking-tighter uppercase leading-[0.95]">
                {d.headline}
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-widest leading-loose max-w-xl">
                {d.description}
              </p>
            </div>
 
            {/* Right Content - Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 shrink-0">
              <a
                href={`https://wa.me/${d.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-[#25D366] text-white font-black rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(37,211,102,0.25)]"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
                <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[13px] uppercase tracking-[0.2em] text-white font-black">{d.whatsappLabel || 'Connect on WhatsApp'}</span>
              </a>
              <a
                href={`tel:${d.phone}`}
                className="flex items-center justify-center gap-4 px-10 py-5 bg-white border border-gray-200 text-gray-900 font-black rounded-2xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95 shadow-sm"
              >
                <Phone size={22} />
                <span className="text-[13px] uppercase tracking-[0.2em] font-black">{d.phoneLabel || 'Call Support'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
