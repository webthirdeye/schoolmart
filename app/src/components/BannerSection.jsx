// src/components/BannerSection.jsx
import { Link } from 'react-router-dom';
import SchoolReel from './SchoolReel';
import { useCMSBlock } from '../hooks/useCMSBlock';
import VideoPlayer from './ui/VideoPlayer';

const DEFAULTS = {
  badge: 'Price · Quality · Range Promise',
  headline1: 'FURNITURE',
  headline2: 'QUICK DELIVERY',
  subline1: 'Order Now',
  subline2: 'Kindergarten · Highschools · Labs · Libraries',
  cta1: { label: 'Shop Furniture →', path: '/furniture' },
  cta2: { label: 'View Catalogue', path: '/catalogues' },
};

const BannerSection = () => {
  const { data } = useCMSBlock('home', 'hero', DEFAULTS);
  const d = { ...DEFAULTS, ...data };

  return (
    <section className="pt-2 md:pt-4 pb-4 px-4 overflow-hidden relative bg-sm-gray">
      <div className="max-w-7xl mx-auto">
        <div 
          className="relative rounded-[40px] overflow-hidden shadow-sm border border-gray-200"
          style={{ background: d.bgColor || 'linear-gradient(to right, #ffffff, #f8f9fa, #f1f3f5)' }}
        >
          <div className="flex flex-col lg:flex-row items-stretch min-h-[320px]">

            {/* Left — Text Content */}
            <div className="flex-1 p-10 lg:p-14 z-10 flex flex-col justify-center">
              <p className="text-[10px] font-black text-sm-orange uppercase tracking-[0.3em] mb-4">
                {d.badge}
              </p>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 font-heading leading-[1] mb-2 uppercase tracking-tighter">
                {d.headline1}
              </h2>
              <h2
                className="text-4xl lg:text-6xl font-black font-heading leading-[1] mb-8 uppercase tracking-tighter"
                style={{ color: '#F97316' }}
              >
                {d.headline2}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={d.cta1?.path || '/furniture'}
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-sm-blue transition-all duration-300 text-[10px] uppercase tracking-widest shadow-xl shadow-gray-200"
                >
                  {d.cta1?.label || 'Get Started →'}
                </Link>
                <Link
                  to={d.cta2?.path || '/catalogues'}
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white border border-gray-200 text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all duration-300 text-[10px] uppercase tracking-widest"
                >
                  {d.cta2?.label || 'Institutional Catalogues'}
                </Link>
              </div>
            </div>

            {/* Right — School Reel / Image / Video */}
            <div className="flex-1 p-4 lg:p-5 flex items-center">
              <div className="w-full relative h-[260px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/40">
                {d.mediaType === 'video' ? (
                  <VideoPlayer 
                    src={d.mediaUrl} 
                    className="w-full h-full object-cover" 
                  />
                ) : d.mediaType === 'image' ? (
                  <img 
                    src={d.mediaUrl} 
                    className="w-full h-full object-cover" 
                    alt="Hero Banner" 
                  />
                ) : (
                  <SchoolReel slides={d.slides} />
                )}
              </div>
            </div>
          </div>

          {/* Decorative left accent bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 rounded-l-2xl" />
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
