// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Footer = () => {
  const { data: settings, loading } = useSiteSettings('footer');

  const brand = settings.brand || {
    name: 'schoolmart.in',
    tagline: 'consortium of architects, designers, school innovators',
    description: 'We help schools in setting up new schools, expanding to new schools, design to execution, new environments, labs, libraries, sports infra etc.'
  };

  const STATIC_BRAND_HELP = [
    { name: 'How it works', path: '/p/how-it-works' },
    { name: 'Sell on schoolmart', path: '/p/sell-on-schoolmart' },
    { name: 'Pricing', path: '/p/pricing' },
    { name: 'Seller Help', path: '/p/seller-help' },
    { name: 'Shipping Policy', path: '/p/shipping-policy' },
    { name: 'Cancellation Policy', path: '/p/cancellation-policy' },
    { name: 'Replacement & Return', path: '/p/replacement-return' },
    { name: 'Order Rejection Policy', path: '/p/order-rejection-policy' },
    { name: 'Payments', path: '/p/payments' },
  ];

  const STATIC_SCHOOL_HELP = [
    { name: 'Shipping Policy', path: '/p/shipping-policy' },
    { name: 'Cancellation Policy', path: '/p/cancellation-policy' },
    { name: 'Replacement & Return', path: '/p/replacement-return' },
    { name: 'Payment Policy', path: '/p/payments' },
    { name: 'Order Rejection Policy', path: '/p/order-rejection-policy' },
  ];

  const STATIC_BUSINESS_LINKS = [
    { name: 'About Us', path: '/aboutus' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Report Issue', path: '/p/report-issue' },
    { name: 'Blog', path: '/p/blog' },
    { name: 'Delivery Locations', path: '/p/delivery-locations' },
  ];

  const trendingLinks = [
    'NEP READY ULTRA MODERN LABS',
    'STEM LAB DESIGN',
    'FUTURISTIC SCHOOL ARCHITECTURE',
    'MINI SPORTS ACADEMIES',
    'THEME SCHOOL DESIGNS',
    'DIGITISATION OF ENTIRE CAMPUS',
    'INTERACTIVE MATH WALLS',
    'SMART SCIENCE ROOMS',
    'SCIENCE LAB DESIGN',
    'ART & CRAFT ROOMS',
    '2D/3D ANIMATED VIDEOS',
    'AUGMENTED REALITY CONTENT',
  ];

  // Map CMS columns or use fallbacks
  const columns = settings.columns?.length ? settings.columns : [
    { title: 'Partner Support', links: STATIC_BRAND_HELP },
    { title: 'Institutional', links: STATIC_SCHOOL_HELP },
    { title: 'Corporate', links: STATIC_BUSINESS_LINKS }
  ];

  const contact = settings.contact || {
    email: 'info@schoolmart.in',
    phone1: '+91 9966109191',
    whatsapp: '919966109191'
  };

  const social = settings.social || {
    facebook: 'https://www.facebook.com/schoolmart.in',
    twitter: 'https://twitter.com/schoolmarts',
    youtube: 'https://www.youtube.com/channel/UCgKY_Kf8jH1hoP3p0I0tiRA'
  };

  const copyright = settings.copyright || '© 2016-2023, Third Eye Retail Pvt. Ltd.';
  const bottomLinks = settings.bottomLinks?.length ? settings.bottomLinks : [
    { label: 'Privacy Protocol', path: '/p/privacy-policy' },
    { label: 'Service Terms', path: '/p/terms-of-use' }
  ];

  // Theme Colors
  const bgColor = settings.bgColor || '#0f172a';
  const textColor = settings.textColor || '#9ca3af';
  const headingColor = settings.headingColor || '#38bdf8';
  const bottomBarColor = settings.bottomBarColor || '#0a0f1c';

  return (
    <footer 
      className="border-t border-white/5" 
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - Identity */}
          <div className="space-y-6">
            <h3 
              className="text-sm font-black uppercase tracking-[0.2em] font-heading"
              style={{ color: headingColor }}
            >
              Identity
            </h3>
            <div className="text-[13px] space-y-4 leading-relaxed font-medium">
              <p>
                <Link 
                  to="/" 
                  className="font-bold border-b transition-colors duration-200"
                  style={{ color: headingColor, borderColor: `${headingColor}33` }}
                >
                  {brand.name}
                </Link>{' '}
                {brand.tagline}. {brand.description}
              </p>
              <div className="pt-4 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block mb-2">Heritage</span>
                <p className="text-[12px]">An initiative of thirdeye group. Helping <span className="text-white font-black">4000+</span> partner schools build excellence since <span className="text-white font-black">7 years</span>.</p>
              </div>
            </div>
          </div>

          {/* CMS Columns */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <h3 
                className="text-sm font-black uppercase tracking-[0.2em] mb-8 font-heading"
                style={{ color: headingColor }}
              >
                {col.title}
              </h3>
              <ul className="space-y-4">
                {(col.links || []).map((link) => (
                  <li key={link.name || link.label}>
                    <Link 
                      to={link.path} 
                      className="text-[11px] hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-bold uppercase tracking-widest"
                      style={{ color: textColor }}
                    >
                      {link.name || link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trending Section */}
        <div className="mt-16 pt-12 border-t border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-6 font-heading">Strategic Insights</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {trendingLinks.map((item) => (
              <span 
                key={item} 
                className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60 hover:text-white hover:opacity-100 cursor-pointer transition-all duration-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t border-white/5 py-8"
        style={{ backgroundColor: bottomBarColor }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
            {copyright}
          </div>
          
          <div className="flex items-center gap-10">
            {bottomLinks.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path} 
                className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 hover:text-white transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-sky-500 hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-sky-500 hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-sky-500 hover:text-white transition-all duration-300">
                <Youtube size={18} />
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-sky-500 hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-sky-500 hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
