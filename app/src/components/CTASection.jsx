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
    <section className="py-6 px-4 relative overflow-hidden bg-sm-gray">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-white rounded-[40px] p-8 md:p-16 border border-gray-200 shadow-sm overflow-hidden group">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sm-blue/5 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-sm-blue/10 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-4 py-1 bg-sm-blue text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-blue-500/20">
                {d.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 font-heading mb-6 tracking-tighter uppercase leading-[1.1]">
                {d.headline}
              </h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xl">
                {d.description}
              </p>
            </div>
 
            {/* Right Content - Buttons */}
            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href={`https://wa.me/${d.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-black rounded-full hover:bg-[#128C7E] transition-all active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.4)]"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity" />
                <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest text-white">Connect on WhatsApp</span>
              </a>
              <a
                href={`tel:${d.phone}`}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-gray-200 text-gray-900 font-black rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95"
              >
                <Phone size={20} />
                <span className="text-[10px] uppercase tracking-widest">Call {d.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
