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
    <section className="pt-2 md:pt-4 pb-4 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0a1628] via-[#0f1f3d] to-[#12213f] shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch min-h-[280px]">

            {/* Left — Text Content */}
            <div className="flex-1 p-8 lg:p-10 z-10 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-orange-400/70 uppercase tracking-[0.25em] mb-3">
                {d.badge}
              </p>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white font-heading leading-[1.05] mb-1">
                {d.headline1}
              </h2>
              <h2
                className="text-4xl lg:text-5xl font-extrabold font-heading leading-[1.05] mb-5"
                style={{ color: '#F97316' }}
              >
                {d.headline2}
              </h2>

              <p className="text-[11px] text-white/40 uppercase tracking-[0.18em] mb-1">{d.subline1}</p>
              <p className="text-[11px] text-white/30 uppercase tracking-[0.12em] mb-7">
                {d.subline2}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={d.cta1?.path || '/furniture'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-sm-orange text-white font-bold rounded-xl hover:bg-orange-500 transition-all duration-200 text-sm shadow-lg shadow-orange-900/40"
                >
                  {d.cta1?.label || 'Shop Furniture →'}
                </Link>
                <Link
                  to={d.cta2?.path || '/catalogues'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 text-sm"
                >
                  {d.cta2?.label || 'View Catalogue'}
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
