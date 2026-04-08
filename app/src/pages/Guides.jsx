// src/pages/Guides.jsx
import React, { useState } from 'react';
import { BookOpen, Award, Download, FileText } from 'lucide-react';
import { useCMSPage } from '../hooks/useCMSBlock';

const DEFAULT_CONTENT = {
  hero: {
    badge: 'Knowledge Base 2025',
    titleHtml: 'Policy. Strategy. <span class="text-sm-blue italic font-serif lowercase tracking-normal">for</span> Compliance.',
    subtitle: 'Deep-dive into our institutional strategy handbooks and regulatory frameworks.',
  },
  actionStrip: [
    { titleHtml: 'NEP 2024 <br/> Implementation Kit.', btnText: 'Download PDF', color: 'dark' },
    { titleHtml: 'Certification <br/> & Standards BIFMA.', color: 'light' },
    { titleHtml: 'Custom Institutional Portfolio.', btnText: 'Request Curation', color: 'light' },
  ],
  resourceList: [
    { t: 'Safety Master-Guide', c: 'Logistics' },
    { t: 'Spatial Planning', c: 'Design' },
    { t: 'Color Psychology', c: 'Interiors' },
    { t: 'NEP 2020 Implementation Roadmap', c: 'Policy' },
    { t: 'CBSE Affiliation Checklist', c: 'Compliance' },
    { t: 'Smart Campus Technology Blueprint', c: 'Technology' },
  ],
};

const Guides = () => {
  const { blocks, loading } = useCMSPage('guides');
  const d = blocks?.guides_page_content || DEFAULT_CONTENT;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-sm-blue font-bold tracking-widest uppercase">Loading Guides...</div>
  );

  return (
    <main className="min-h-screen bg-white pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* HERO STRIP */}
        <section className="bg-gray-900 rounded-b-[40px] px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-1/4 h-full bg-sm-blue/5 skew-x-12 -mr-20 pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-sm-blue" />
              <span className="text-sm-blue text-[10px] font-black uppercase tracking-[0.3em]">{d.hero?.badge}</span>
            </div>
            <h1
              className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-3 leading-tight"
              dangerouslySetInnerHTML={{ __html: d.hero?.titleHtml }}
            />
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose max-w-lg">
              {d.hero?.subtitle}
            </p>
          </div>
          <button className="px-8 py-3.5 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-xl relative z-10">
            Browse Library
          </button>
        </section>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {(d.actionStrip || []).map((card, i) => (
            <div
              key={i}
              className={`p-8 rounded-[35px] border flex flex-col justify-between group hover:shadow-xl transition-all min-h-[150px]
                ${card.color === 'dark' ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-100'}`}
            >
              <h3
                className={`text-[11px] font-black uppercase tracking-widest leading-relaxed mb-6 ${card.color === 'dark' ? 'text-sm-blue' : 'text-gray-400 group-hover:text-sm-blue'}`}
                dangerouslySetInnerHTML={{ __html: card.titleHtml }}
              />
              <button
                className={`w-full py-3 font-black rounded-xl text-[9px] uppercase tracking-widest transition-all
                  ${card.color === 'dark' ? 'bg-sm-blue text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-sm-blue group-hover:text-white'}`}
              >
                {card.btnText || 'Read More'}
              </button>
            </div>
          ))}
        </div>

        {/* SECTION HEADER */}
        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            Institutional <span className="text-sm-blue italic font-serif lowercase tracking-normal text-md ml-2">Knowledge Base</span>
          </h2>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{d.resourceList?.length} Manuals</span>
        </div>

        {/* RESOURCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(d.resourceList || []).map((work, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col group hover:shadow-xl transition-all">
              <span className="text-sm-blue text-[9px] font-black uppercase tracking-widest mb-2">{work.c}</span>
              <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tight mb-4 group-hover:text-sm-blue transition-colors line-clamp-2 min-h-[2.5rem]">
                {work.t}
              </h3>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-sm-blue flex items-center gap-2">
                  Download PDF <Download size={12} />
                </button>
                <span className="text-[10px] font-black text-gray-900 uppercase">2025 v1</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
};

export default Guides;
