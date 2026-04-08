import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  TrendingUp, 
  ChevronRight, 
  Smartphone, 
  Building2, 
  Zap, 
  Armchair, 
  Calculator, 
  CheckCircle2, 
  Palette, 
  Library, 
  Briefcase, 
  Users 
} from 'lucide-react';
import { useCMSBlock } from '../hooks/useCMSBlock';

const PATH_MAP = {
  'SCHOOLS FOR SALE / LEASE': '/school-sale',
  'SCHOOLS FOR SALE/LEASE': '/school-sale',
  'FUNDRAISING': '/fundraising',
  'FUND RAISING': '/fundraising',
  'PARTNERSHIPS': '/partnerships',
  'WORKSHOPS': '/workshops',
  'SETTING UP A SCHOOL IN INDIA': '/p/setup-school-india',
  'COMPLETE GUIDE TO DIGITIZATION': '/p/digitization-guide',
  'DIGITIZATION': '/p/digitization-guide',
  'PRODUCT CATALOG 2025': '/p/product-catalog-2025',
  'HOW TO SETUP COMPOSITE SKILL LAB': '/p/skill-lab-guide',
  'HOW TO SETUP COMPOSITE SKILL LAB?': '/p/skill-lab-guide',
  'LOOKBOOK': '/p/play-furniture-lookbook',
  'LOOKBOOK – PLAY FURNITURE': '/p/play-furniture-lookbook',
  'GAMIFIED MATH RESOURCES': '/p/gamified-math-resources',
  'COMPLETED PROJECTS': '/p/completed-projects',
  '20 STUNNING SCHOOL DESIGN IDEAS': '/p/school-design-ideas',
  'LIBRARY TRENDS': '/p/library-trends',
  'JOB OPENINGS': '/p/job-openings',
  'JOIN AS INFLUENCERS': '/p/influencers',
};

// Map items to icons as seen in the user screenshot
const ICON_MAP = {
  'COMPLETE GUIDE TO DIGITIZATION': Smartphone,
  'SETTING UP A SCHOOL IN INDIA': Building2,
  'PRODUCT CATALOG 2025': FileText,
  'HOW TO SETUP COMPOSITE SKILL LAB?': Zap,
  'HOW TO SETUP COMPOSITE SKILL LAB': Zap,
  'LOOKBOOK – PLAY FURNITURE': Armchair,
  'LOOKBOOK': Armchair,
  'GAMIFIED MATH RESOURCES': Calculator,
  'COMPLETED PROJECTS': CheckCircle2,
  '20 STUNNING SCHOOL DESIGN IDEAS': Palette,
  'LIBRARY TRENDS': Library,
  'JOB OPENINGS': Briefcase,
  'JOIN AS INFLUENCERS': Users,
};

const SidebarWidget = ({ title, items: itemsProp = [], type = 'resources' }) => {
  const isTrending = type === 'trending';
  const blockSlug = isTrending ? 'sidebar_trending' : 'sidebar_resources';
  const { data: globalData } = useCMSBlock('home', blockSlug);

  const items = (itemsProp && itemsProp.length > 0) ? itemsProp : (globalData?.items || []);

  if (!items || items.length === 0) return null;

  const headerBg = 'bg-sm-blue'; // Consistent with SchoolMart turquoise

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 mb-6 flex flex-col">
      <div className={`${headerBg} px-6 py-4 flex items-center gap-3`}>
        {isTrending ? <TrendingUp size={16} className="text-white" /> : <FileText size={16} className="text-white" />}
        <h3 className="text-white text-[12px] font-black uppercase tracking-[0.2em] leading-none">
          {title}
        </h3>
      </div>
      <div className="flex flex-col py-2">
        {items.map((item, i) => {
          const label = typeof item === 'string' ? item : (item.label || '');
          const upperLabel = label.toUpperCase();
          let path = typeof item === 'string' || !item.path ? '#' : item.path;

          const ItemIcon = ICON_MAP[upperLabel] || FileText;

          if (path === '#') {
            Object.keys(PATH_MAP).forEach(k => {
              if (upperLabel.includes(k)) path = PATH_MAP[k];
            });
            if (path === '#') {
              const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              path = `/p/${slug}`;
            }
          }

          return (
            <Link
              key={i}
              to={path}
              className="px-6 py-4 flex items-center justify-between group transition-all border-b border-gray-50 last:border-0 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                 <ItemIcon size={14} className="text-gray-400 group-hover:text-sm-blue transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-tight text-gray-700 group-hover:text-gray-950 transition-colors">
                    {label}
                 </span>
              </div>
              <ChevronRight size={14} className="text-gray-200 group-hover:text-sm-blue transition-all group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarWidget;
