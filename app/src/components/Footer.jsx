// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const brandHelp = [
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

  const schoolHelp = [
    { name: 'Shipping Policy', path: '/p/shipping-policy' },
    { name: 'Cancellation Policy', path: '/p/cancellation-policy' },
    { name: 'Replacement & Return', path: '/p/replacement-return' },
    { name: 'Payment Policy', path: '/p/payments' },
    { name: 'Order Rejection Policy', path: '/p/order-rejection-policy' },
  ];

  const businessLinks = [
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

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - About Us */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#004a8e] font-heading">Identity</h3>
            <div className="text-[13px] text-gray-500 space-y-4 leading-relaxed font-medium">
              <p>
                <Link to="/" className="text-[#004a8e] hover:text-sm-blue transition-colors duration-200 font-bold border-b border-[#004a8e]/20">
                  schoolmart.in
                </Link>{' '}
                is a consortium of architects, designers, school innovators who strive to bring the learning outcome through latest infrastructure and edtech.
              </p>
              <p>
                We help schools in setting up new schools, expanding to new schools, design to execution, new environments, labs, libraries, sports infra etc.
              </p>
              <p className="pt-2">
                <span className="text-sm-blue font-black uppercase tracking-widest text-[10px] block mb-2">Heritage</span>
                An initiative of thirdeye group. Helping <span className="text-[#004a8e] font-black">4000+</span> partner schools build excellence since <span className="text-[#004a8e] font-black">7 years</span>.
              </p>
            </div>
          </div>

          {/* Column 2 - Brand & Seller Help */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#004a8e] mb-8 font-heading">Partner Support</h3>
            <ul className="space-y-4">
              {brandHelp.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-[11px] text-gray-400 hover:text-sm-blue hover:translate-x-1 inline-block transition-all duration-200 font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - School Help */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#004a8e] mb-8 font-heading">Institutional</h3>
            <ul className="space-y-4">
              {schoolHelp.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-[11px] text-gray-400 hover:text-sm-blue hover:translate-x-1 inline-block transition-all duration-200 font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Business */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#004a8e] mb-8 font-heading">Corporate</h3>
            <ul className="space-y-4">
              {businessLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-[11px] text-gray-400 hover:text-sm-blue hover:translate-x-1 inline-block transition-all duration-200 font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trending Section */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 font-heading">Strategic Insights</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {trendingLinks.map((item) => (
              <span 
                key={item} 
                className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-sm-blue cursor-pointer transition-colors duration-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            © 2016-2023, Third Eye Retail Pvt. Ltd.
          </div>
          
          <div className="flex items-center gap-10">
            <Link to="/p/privacy-policy" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#004a8e] transition-colors duration-200">
              Privacy Protocol
            </Link>
            <Link to="/p/terms-of-use" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#004a8e] transition-colors duration-200">
              Service Terms
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/schoolmart.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#004a8e] hover:text-white transition-all duration-300"
            >
              <Facebook size={18} />
            </a>
            <a 
              href="https://twitter.com/schoolmarts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#004a8e] hover:text-white transition-all duration-300"
            >
              <Twitter size={18} />
            </a>
            <a 
              href="https://www.youtube.com/channel/UCgKY_Kf8jH1hoP3p0I0tiRA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#004a8e] hover:text-white transition-all duration-300"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
