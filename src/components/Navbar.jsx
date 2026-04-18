// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Armchair, Building2, Laptop, Palette, BookOpen, Trophy, Calculator, FlaskConical, Library } from 'lucide-react';
import { useCMSBlock } from '../hooks/useCMSBlock';

const ICON_MAP = { Armchair, Building2, Laptop, Palette, BookOpen, Trophy, Calculator, FlaskConical, Library };

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const location = useLocation();

  // Fetch navbar data from CMS
  const { data: navCMS } = useCMSBlock('home', 'navbar', {});
  const { data: tickerCMS } = useCMSBlock('home', 'ticker', { items: [] });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Corporate',
      path: '/corporate',
      dropdown: [
        { name: 'About Us', path: '/aboutus' },
        { name: 'Manufacturing', path: '/manufacturing' },
      ]
    },
    { name: 'Catalogues', path: '/catalogues' },
    { name: 'Environments', path: '/environments' },
    { name: 'SHOP', path: 'https://schoolmart.store', external: true },
    { name: 'GUIDES', path: '/guides' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  // Use CMS categories if available, else static fallback
  const staticCategories = [
    { name: 'FURNITURE', path: '/furniture', icon: 'Armchair' },
    { name: 'ARCHITECTURE', path: '/school-building-design', icon: 'Building2' },
    { name: 'DIGITAL INFRA', path: '/digital', icon: 'Laptop' },
    { name: 'SCHOOL DESIGNS', path: '/design', icon: 'Palette' },
    { name: 'LIBRARIES', path: '/libraries', icon: 'BookOpen' },
    { name: 'SPORTS', path: '/sports', icon: 'Trophy' },
    { name: 'MATHEMATICS', path: '/gamified-math-labs', icon: 'Calculator' },
    { name: 'SCIENCE', path: '/science-is-fun', icon: 'FlaskConical' },
    { name: 'LABS', path: '/labs', icon: 'Library' },
  ];
  const cmsCategories = navCMS?.categories;
  const categories = (cmsCategories?.length ? cmsCategories : staticCategories).map(cat => ({
    ...cat,
    icon: ICON_MAP[cat.icon] || BookOpen,
    color: 'bg-sm-gray',
  }));

  return (
    <>
      <nav
        className={`bg-sm-green sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="h-full flex items-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="SCHOOL MART" 
                className="h-full w-auto block select-none"
                style={{ clipPath: 'inset(0 14% 0 14%)', imageRendering: '-webkit-optimize-contrast' }}
              />
              <span className="text-[8px] opacity-20 absolute bottom-0 left-0">v2.0-CLEAN</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.dropdown ? (
                    <>
                      <Link
                        to={link.path}
                        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium text-white uppercase tracking-wide hover:bg-white/10 rounded-md transition-all duration-300 ${isActive(link.path) ? 'bg-white/20' : ''
                          }`}
                      >
                        {link.name}
                        <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                      </Link>

                      {/* Dropdown Container with Hover Bridge */}
                      <div className="absolute top-full left-0 w-52 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                        <div className="bg-white rounded-[20px] shadow-2xl py-3 border border-gray-100 overflow-hidden">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="block px-6 py-2.5 text-[13px] font-black text-gray-400 hover:text-sm-blue hover:bg-gray-50 transition-all duration-200 uppercase tracking-widest"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-white uppercase tracking-wide hover:bg-white/10 rounded-md transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-4 py-2 text-sm font-medium text-white uppercase tracking-wide hover:bg-white/10 rounded-md transition-colors duration-200 ${isActive(link.path) ? 'bg-white/20' : ''
                        }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Identity Icon - Personalized for Member/Admin */}
              {(() => {
                const userStr = localStorage.getItem('user');
                const user = (userStr && userStr !== 'undefined') ? JSON.parse(userStr) : null;
                return user ? (
                  <Link 
                    to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                    className="ml-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-sm-green transition-all shadow-xl group border border-white/20"
                    title="My Dashboard"
                  >
                    <User size={20} className="group-hover:scale-110 transition-transform" />
                  </Link>
                ) : null;
              })()}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
               {(() => {
                  const userStr = localStorage.getItem('user');
                  const user = (userStr && userStr !== 'undefined') ? JSON.parse(userStr) : null;
                  return user ? (
                    <Link 
                      to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"
                    >
                      <User size={20} />
                    </Link>
                  ) : null;
               })()}
               <button
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 className="p-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
               >
                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-sm-green border-t border-white/20 animate-slide-down">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setIsCorporateOpen(!isCorporateOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-white font-medium uppercase tracking-wide hover:bg-white/10 rounded-md"
                      >
                        {link.name}
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isCorporateOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isCorporateOpen && (
                        <div className="pl-4 mt-1 space-y-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-white font-medium uppercase tracking-wide hover:bg-white/10 rounded-md"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-white font-medium uppercase tracking-wide hover:bg-white/10 rounded-md ${isActive(link.path) ? 'bg-white/20' : ''
                        }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Top News Ticker - Moved below Green Bar */}
      <div className="bg-sm-navy border-t-2 border-sm-yellow overflow-hidden h-7 flex items-center relative z-40">
        {/* Slanted Label */}
        <div className="absolute left-0 top-0 bottom-0 bg-gray-100 px-6 flex items-center gap-2 z-20 shadow-xl" style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0% 100%)' }}>
          <div className="w-4 h-4 rounded-full border-2 border-sm-blue flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sm-blue" />
          </div>
          <span className="text-sm-blue font-black text-[12px] uppercase tracking-wider whitespace-nowrap">Latest Updates</span>
        </div>

        {/* Scrolling Ticker */}
        <div className="flex-1 overflow-hidden ml-40 h-full relative">
          <div className="ticker-wrapper h-full flex items-center gap-20 whitespace-nowrap">
            {(tickerCMS?.items?.length ? tickerCMS.items : [
              "Digital Transformation Summit: 15 May 2026",
              "New AI-Powered Learning Stations now available for pre-order",
              "Join our upcoming Campus Design Webinar on 15th April 2026",
              "Annual Sports Meet Registrations closing soon",
              "New Sustainable Furniture Catalogue Launched"
            ]).map((text, i) => (
              <span key={`original-${i}`} className="text-white text-[12px] font-bold uppercase tracking-widest">{text}</span>
            ))}
            {/* Duplicated for seamless loop */}
            {(tickerCMS?.items?.length ? tickerCMS.items : [
              "Digital Transformation Summit: 15 May 2026",
              "New AI-Powered Learning Stations now available for pre-order",
              "Join our upcoming Campus Design Webinar on 15th April 2026",
              "Annual Sports Meet Registrations closing soon",
              "New Sustainable Furniture Catalogue Launched"
            ]).map((text, i) => (
              <span key={`duplicate-${i}`} className="text-white text-[12px] font-bold uppercase tracking-widest">{text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-y-4 gap-x-2 pb-2 sm:pb-0">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="flex flex-col items-center group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${cat.color} border border-gray-100 flex items-center justify-center mb-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    <Icon size={20} className="text-gray-600 group-hover:text-sm-blue" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-gray-700 text-center uppercase tracking-tight whitespace-nowrap group-hover:text-sm-blue transition-colors duration-200">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
