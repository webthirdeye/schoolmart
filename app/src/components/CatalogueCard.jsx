import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { formatImgUrl } from '../utils/formatters';

const CatalogueCard = ({ work, isSelected, onClick, themeColor = 'bg-emerald-600', ringColor = 'ring-emerald-500', textColor = 'text-emerald-400' }) => {
  return (
    <div className="group">
      <div 
        className={`relative overflow-hidden rounded-[30px] shadow-lg group cursor-pointer aspect-[4/5] transition-all duration-500 bg-white ${isSelected ? `ring-4 ${ringColor} shadow-2xl scale-[1.02]` : 'hover:scale-[1.01]'}`}
        onClick={onClick}
      >
        <img 
          src={formatImgUrl(work.image || work.images?.[0] || work.img || "")} 
          alt={work.name || work.title} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
        />
        
        {/* LIGHTWEIGHT STYLED OVERLAY - FOCUSED ON BOTTOM */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-base lg:text-lg font-black text-white uppercase tracking-tighter leading-tight mb-2 group-hover:text-emerald-400 transition-colors">
            {work.name || work.title}
          </h3>
          <div className="flex items-center gap-2">
            {work.subcategory && (
              <span className={`text-[9px] ${textColor} font-extrabold tracking-widest uppercase bg-white/10 px-2 py-1 rounded backdrop-blur-md border border-white/10`}>
                {work.subcategory}
              </span>
            )}
            <div className="flex-grow h-[1px] bg-white/10" />
            <span className="text-[9px] text-white/50 font-black uppercase tracking-widest group-hover:text-white transition-all flex items-center gap-1 shrink-0">
              Explore <ArrowRight size={10} />
            </span>
          </div>
        </div>
        
        {/* FLOATING ACTION ICON */}
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
          <div className={`w-10 h-10 rounded-full ${themeColor} shadow-xl flex items-center justify-center text-white`}>
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCard;
