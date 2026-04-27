import React from 'react';
import { ArrowRight } from 'lucide-react';

const GuideCard = ({ 
  title, 
  category, 
  description, 
  cardDescription,
  image,
  visualText, 
  visualSubtext = "FOR VISIONARY SCHOOL FOUNDERS AND PRINCIPALS",
  visualColor = "bg-[#8B5CF6]", // Purple
  accentColor = "bg-[#FACC15]", // Yellow
  onClick 
}) => {
  const displayDescription = cardDescription || description;

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer break-inside-avoid mb-6 overflow-hidden rounded-[30px] border border-gray-100 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Graphic Header */}
      <div className="relative">
        <div className={`${visualColor} p-8 pt-12 pb-8 min-h-[240px] flex flex-col justify-end relative overflow-hidden`}>
          {image && (
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={image} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
          )}
          <h2 className="text-white text-3xl lg:text-4xl font-black leading-[0.9] tracking-tighter lowercase max-w-[90%] relative z-10 drop-shadow-sm">
            {visualText || title}
          </h2>
        </div>
        <div className={`${accentColor} px-8 py-3 border-t border-white/10 relative z-10`}>
          <p className="text-[9px] lg:text-[10px] font-black tracking-[0.1em] text-gray-900/80 uppercase">
            {visualSubtext}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 pb-10">
        <h3 className="text-[17px] lg:text-[19px] font-black text-gray-900 uppercase tracking-tighter leading-tight mb-4 group-hover:text-sm-blue transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-[13px] lg:text-[14px] font-bold uppercase tracking-tight leading-relaxed line-clamp-3">
          {displayDescription}
        </p>
        
        <div className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-sm-blue opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
          Read Full Guide <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
