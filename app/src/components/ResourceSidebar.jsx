import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronRight, 
  FileText, 
  Smartphone, 
  Armchair, 
  Building2, 
  CheckCircle2, 
  Zap, 
  Calculator, 
  Palette, 
  Library, 
  Briefcase, 
  Users 
} from 'lucide-react';

const RESOURCES = [
  { name: 'Complete Guide to Digitization', path: '/p/digitization-guide', icon: <Smartphone size={14} /> },
  { name: 'Setting Up A School In India', path: '/p/setup-school-india', icon: <Building2 size={14} /> },
  { name: 'Product Catalog 2025', path: '/p/product-catalog-2025', icon: <FileText size={14} /> },
  { name: 'How to setup Composite Skill Lab?', path: '/p/skill-lab-guide', icon: <Zap size={14} /> },
  { name: 'Lookbook – Play Furniture', path: '/p/play-furniture-lookbook', icon: <Armchair size={14} /> },
  { name: 'Gamified Math Resources', path: '/p/gamified-math-resources', icon: <Calculator size={14} /> },
  { name: 'Completed Projects', path: '/p/completed-projects', icon: <CheckCircle2 size={14} /> },
  { name: '20 Stunning School Design Ideas', path: '/p/school-design-ideas', icon: <Palette size={14} /> },
  { name: 'Library Trends', path: '/p/library-trends', icon: <Library size={14} /> },
  { name: 'Job Openings', path: '/p/job-openings', icon: <Briefcase size={14} /> },
  { name: 'Join as Influencers', path: '/p/influencers', icon: <Users size={14} /> },
];

const ResourceSidebar = () => {
  return (
    <div className="w-full lg:w-72 shrink-0 space-y-4 sticky top-24">
      <div className="bg-white rounded-[25px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-sm-blue px-6 py-4 flex items-center gap-3">
             <FileText size={18} className="text-white" />
             <h3 className="text-white font-black uppercase text-[12px] tracking-widest">Resources</h3>
          </div>
          <div className="flex flex-col py-2">
             {RESOURCES.map((r, i) => (
                <NavLink
                  key={i}
                  to={r.path}
                  className={({ isActive }) => 
                    `px-6 py-4 flex items-center justify-between group transition-all border-b border-gray-50 last:border-0 ${
                      isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                     <span className="text-gray-400 group-hover:text-sm-blue transition-colors">
                        {r.icon}
                     </span>
                     <span className="text-[10px] font-black uppercase tracking-tight text-gray-700 group-hover:text-gray-950 transition-colors">
                        {r.name}
                     </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-sm-blue transition-all group-hover:translate-x-1" />
                </NavLink>
             ))}
          </div>
      </div>
      
      {/* Search Sidebar Widget */}
      <div className="bg-gray-900 rounded-[25px] p-6 text-white group">
         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-sm-blue mb-4">Request 2025 Lookbook</h4>
         <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-6">Explore 200+ school building designs & resources.</p>
         <button className="w-full py-3 bg-white text-gray-900 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-sm-blue hover:text-white transition-all shadow-xl">Download PDF</button>
      </div>
    </div>
  );
};

export default ResourceSidebar;
