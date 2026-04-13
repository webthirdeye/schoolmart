// src/components/TopBar.jsx
import { Mail, Phone, Facebook, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMSBlock } from '../hooks/useCMSBlock';

const TopBar = () => {
  const { data } = useCMSBlock('home', 'topbar', {
    email: 'info@schoolmart.in',
    phone1: '+91 9966109191',
    phone2: '+91 9866091111',
    socials: {
      facebook: 'https://www.facebook.com/schoolmart.in',
      twitter: 'https://twitter.com/schoolmarts',
      instagram: 'https://www.instagram.com/schoolmart.in/',
      linkedin: 'https://www.linkedin.com/school/schoolmart-india/',
    }
  });

  const socials = data.socials || {};

  return (
    <div className="text-white py-1.5 px-4 border-b border-white/5 relative z-[70]" style={{ backgroundColor: data.bgColor || '#0057A8' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1">
        {/* Contact Strip */}
        <div className="flex items-center gap-2 md:gap-6">
          <a href={`mailto:${data.email || 'info@schoolmart.in'}`} className="flex items-center gap-1.5 hover:text-sm-yellow transition-all text-[11px] lg:text-[12px] font-bold uppercase tracking-wider">
            <Mail size={11} className="text-sm-yellow" />
            <span className="hidden md:inline">{data.email || 'info@schoolmart.in'}</span>
          </a>
          <a href={`tel:${data.phone1 || '+919966109191'}`} className="flex items-center gap-1.5 hover:text-sm-yellow transition-all text-[11px] lg:text-[12px] font-bold uppercase tracking-wider">
            <Phone size={11} className="text-sm-yellow" />
            <span className="hidden xs:inline">{data.phone1 || '+91 9966109191'}</span>
          </a>
        </div>

        {/* Auth Strip */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 text-[11px] lg:text-[12px] font-black uppercase tracking-widest bg-white/10 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full border border-white/10 transition-all">
            <Link to="/registration" className="hover:text-sm-yellow transition-all whitespace-nowrap">REGISTRATION</Link>
            <span className="text-white/20">|</span>
            <Link to="/my-account" className="hover:text-sm-yellow transition-all whitespace-nowrap font-bold">LOGIN</Link>
          </div>
          
          {/* Social icons */}
          <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4">
            {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sm-yellow transition-all"><Facebook size={12} /></a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sm-yellow transition-all"><Twitter size={12} /></a>}
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sm-yellow transition-all"><Instagram size={12} /></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-sm-yellow transition-all"><Linkedin size={12} /></a>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
