import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { formatImgUrl } from '../utils/formatters';

const CatalogueCard = ({ work, isSelected, onClick, onAction, actionText, themeColor = 'bg-[#004a8e]', ringColor = 'ring-blue-500', textColor = 'text-[#004a8e]', showExplore = true }) => {
  const isNonRoutable = work.ctaLink?.toLowerCase() === 'none';

  return (
    <div className={`group ${isNonRoutable ? '' : 'cursor-pointer'}`}>
      <div 
        className={`relative overflow-hidden rounded-[30px] border border-gray-100 group aspect-[4/5] transition-all duration-500 bg-white ${isSelected ? `ring-4 ${ringColor} shadow-2xl scale-[1.02]` : 'hover:scale-[1.01] hover:shadow-lg'}`}
        onClick={isNonRoutable ? undefined : onClick}
      >
        <div className="flex flex-col h-full">
          {/* Image Container */}
          <div className="flex-[2] w-full bg-gray-50 relative overflow-hidden flex items-center justify-center">
            <img 
              src={formatImgUrl(work.image || work.images?.[0] || work.img || "")} 
              alt={work.name || work.title} 
              className={`w-full h-full object-cover transition-all duration-700 ${isNonRoutable ? '' : 'group-hover:scale-110'}`} 
            />
            {/* FLOATING ACTION ICON */}
            {!isNonRoutable && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10">
                 <div className={`w-8 h-8 rounded-full ${themeColor} shadow-xl flex items-center justify-center text-white`}>
                    <ArrowUpRight size={14} />
                 </div>
              </div>
            )}
          </div>
          
          {/* Content Area - Clean and Minimal */}
          <div className="flex-[1.5] px-6 pb-6 pt-4 flex flex-col justify-between bg-white border-t border-gray-50/50">
             <div className="flex-1 overflow-hidden flex flex-col">
                {work.subcategory && (
                  <span className={`text-[11px] font-black tracking-[0.15em] uppercase block mb-1 leading-tight text-emerald-500 shrink-0`}>
                    {work.subcategory}
                  </span>
                )}
                {/* Ignore 'Unnamed Card' if it has a description to match purely descriptive layouts */}
                {!(work.name === 'Unnamed Card' && work.description) && (
                  <h3 className={`text-[13px] lg:text-[15px] font-black text-gray-900 uppercase tracking-tighter leading-tight transition-colors mb-2 shrink-0 ${isNonRoutable ? '' : 'group-hover:text-sm-blue'}`}>
                    {work.name || work.title}
                  </h3>
                )}
                {/* Descriptive Text Fallback */}
                {work.description && (
                  <p className="text-gray-600 font-medium text-[12px] lg:text-[14px] leading-relaxed line-clamp-[6] overflow-hidden">
                    {work.description}
                  </p>
                )}
             </div>
             
             <div className="flex items-center justify-between gap-2 shrink-0 mt-4">
                {actionText && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       onAction && onAction(e);
                     }}
                     className={`px-5 py-2.5 ${themeColor} text-white rounded-lg text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-md`}
                   >
                     {actionText}
                   </button>
                )}
                
                {showExplore && !isNonRoutable && (
                   <span className="text-[11px] text-gray-300 font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 ml-auto">
                      Explore <ArrowRight size={10} className="text-gray-300" />
                   </span>
                )}
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CatalogueCard;
