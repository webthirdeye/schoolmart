// src/components/QuickView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { X, FileText, Download, ExternalLink, MessageSquare, Info, BarChart3, Clock, CheckCircle2 } from 'lucide-react';

import { useSiteSettings } from '../hooks/useSiteSettings';

const QuickView = ({ isOpen, onClose, data }) => {
  const { data: globalUI } = useSiteSettings('product_ui');

  if (!isOpen || !data) return null;

  // Labels & Links Logic: Product Override > Global Default > Hardcoded Fallback
  const executionTitle = data.executionTitle || globalUI.executionTitle || "Execution Strategy";
  const featuresTitle = data.featuresTitle || globalUI.featuresTitle || "Key Features & Technical Specs";
  const ctaLabel = data.ctaLabel || globalUI.ctaLabel || "Request Quote";
  const ctaLink = data.ctaLink || globalUI.ctaLink || "/registration";
  const chatLabel = data.chatLabel || globalUI.chatLabel || "Chat";
  const chatLink = data.chatLink || globalUI.chatLink || "https://wa.me/919966109191";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[30px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sm-blue flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Info size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">{data.title || data.t || data.name}</h2>
              <p className="text-[10px] font-bold text-sm-blue uppercase tracking-[0.2em] mt-1.5">{data.cat || data.c || data.subcategory || data.category || 'Resource Overview'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="flex flex-col lg:flex-row min-h-full">
            {/* Left — Visual Showcase (40%) */}
            <div className="lg:w-2/5 p-6 lg:p-8 bg-gray-50 border-r border-gray-100 space-y-6">
              <div className="aspect-[4/5] rounded-[25px] overflow-hidden shadow-2xl border-4 border-white bg-white flex items-center justify-center p-2">
                <img 
                  src={data.img || data.image || data.images?.[0]} 
                  alt={data.title || data.name} 
                  className="w-full h-full object-contain transition-transform duration-700 hover:scale-110"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                 {data.images?.length > 1 ? (
                   data.images.slice(1, 4).map((imgUrl, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm group cursor-pointer p-2 flex items-center justify-center">
                         <img src={imgUrl} className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                   ))
                 ) : (
                   [1,2,3].map(i => (
                      <div key={i} className="aspect-square rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm group cursor-pointer p-2 flex items-center justify-center">
                         <img src={data.img || data.images?.[0]} className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                   ))
                 )}
              </div>
            </div>

            {/* Right — Infographical Details (60%) */}
            <div className="lg:w-3/5 p-6 lg:p-10 space-y-10">
               {/* INFOGRAPHIC GRID */}
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                     <BarChart3 size={18} className="text-sm-blue mb-3" />
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{data.stats?.[0]?.label || 'Impact Scale'}</h4>
                     <p className="text-sm font-black text-gray-900 uppercase">{data.stats?.[0]?.value || '98% Efficient'}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                     <Clock size={18} className="text-emerald-600 mb-3" />
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{data.stats?.[1]?.label || 'Install Time'}</h4>
                     <p className="text-sm font-black text-gray-900 uppercase">{data.stats?.[1]?.value || '24-48 Hours'}</p>
                  </div>
                  <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50">
                     <CheckCircle2 size={18} className="text-purple-600 mb-3" />
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{data.stats?.[2]?.label || 'Standard'}</h4>
                     <p className="text-sm font-black text-gray-900 uppercase">{data.stats?.[2]?.value || 'NEP Certified'}</p>
                  </div>
               </div>

               {/* DESCRIPTION DENSE */}
               <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                     <span className="w-8 h-1 bg-sm-blue rounded-full" />
                     {executionTitle}
                  </h3>
                  <p className="text-gray-500 text-sm leading-loose">
                    {data.description || 'This module represents our commitment to institutional excellence. Designed specifically for long-term durability and ergonomic support, it ensures that learning environments remain dynamic and adaptive. Every unit is constructed using sustainable materials and undergoes rigorous quality checks to meet global safety standards. Integration includes full spatial planning and logistical support.'}
                  </p>
               </div>

               {/* RESOURCES & DOWNLOADS - PACKED */}
               <div className="bg-gray-50 rounded-[25px] p-8 text-gray-900 border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sm-blue/5 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] mb-6 text-sm-blue flex items-center gap-2">
                    <FileText size={14} /> {featuresTitle}
                  </h3>
                  <div className="space-y-3">
                     {(data.resources?.length > 0 && data.resources.some(r => r.name)) ? data.resources.filter(r => r.name).map((file, idx) => (
                       <div key={idx} onClick={() => file.url && window.open(file.url, '_blank')} className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-sm-blue transition-all cursor-pointer group/file">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-sm-blue/10 flex items-center justify-center text-sm-blue group-hover/file:bg-sm-blue group-hover/file:text-white transition-colors">
                                <Download size={14} />
                             </div>
                             <div>
                                <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">{file.name}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-black">{file.size}</p>
                             </div>
                          </div>
                          <ExternalLink size={14} className="text-gray-300 group-hover/file:text-sm-blue" />
                       </div>
                     )) : [
                       { name: 'Ergonomic High-Density Support', size: 'Premium Build' },
                       { name: '100% NEP 2020 Compliant', size: 'Standardized' },
                       { name: 'Anti-Microbial Surface Coating', size: 'Safe & Hygienic' }
                     ].map((file, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group/file">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-sm-blue/20 flex items-center justify-center text-sm-blue group-hover/file:bg-sm-blue group-hover/file:text-white transition-colors">
                                <Download size={14} />
                             </div>
                             <div>
                                <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">{file.name}</p>
                                <p className="text-[9px] text-gray-400 uppercase font-black">{file.size}</p>
                             </div>
                          </div>
                          <ExternalLink size={14} className="text-gray-300 group-hover/file:text-gray-900" />
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-8 flex gap-3">
                    <a 
                      href={ctaLink}
                      className="flex-1 py-3 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue shadow-xl shadow-gray-200 active:scale-95 transition-all text-center flex items-center justify-center"
                    >
                      {ctaLabel}
                    </a>
                    <a 
                      href={chatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <MessageSquare size={14} /> {chatLabel}
                    </a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
