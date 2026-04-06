import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, ChevronRight } from 'lucide-react';
import { useCMSBlock } from '../hooks/useCMSBlock';

const PATH_MAP = {
  'SCHOOLS FOR SALE / LEASE': '/school-sale',
  'SCHOOLS FOR SALE/LEASE': '/school-sale',
  'FUNDRAISING': '/partnerships',
  'FUND RAISING': '/partnerships',
  'PARTNERSHIPS': '/partnerships',
  'WORKSHOPS': '/workshops',
  'SETTING UP A SCHOOL IN INDIA': '/setup-guide',
  'DIGITIZATION': '/digital',
  'PRODUCT CATALOG 2025': '/catalogues',
  'LOOKBOOK': '/catalogues',
  'LIBRARY TRENDS': '/libraries',
  'JOB OPENINGS': '/contact-us',
  'JOIN AS INFLUENCERS': '/contact-us',
};

const SidebarWidget = ({ title, items: itemsProp = [], type = 'resources' }) => {
  const isTrending = type === 'trending';
  const blockSlug = isTrending ? 'sidebar_trending' : 'sidebar_resources';
  const { data: globalData } = useCMSBlock('home', blockSlug);
  
  // Use passed items if not empty, else use home blocks
  const items = (itemsProp && itemsProp.length > 0) ? itemsProp : (globalData?.items || []);

  if (!items || items.length === 0) return null;
  
  const Icon = isTrending ? TrendingUp : FileText;
  const headerBg = 'bg-sm-blue'; // Consistent with SchoolMart turquoise

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 mb-6 group/widget hover:shadow-md transition-shadow">
      <div className={`${headerBg} px-6 py-4 flex items-center gap-3`}>
        <Icon size={16} className="text-white" />
        <h3 className="text-white text-[12px] font-black uppercase tracking-[0.2em] leading-none">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {items.map((item, i) => {
          const label = typeof item === 'string' ? item : item.label;
          let path = typeof item === 'string' || !item.path ? '#' : item.path;
          
          if (path === '#') {
             const key = label.toUpperCase();
             // Find matching key in PATH_MAP
             Object.keys(PATH_MAP).forEach(k => {
                if (key.includes(k)) path = PATH_MAP[k];
             });
             
             // Dynamic Fallback: if STILL #, create a slug from label
             if (path === '#') {
                const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                path = `/p/${slug}`;
             }
          }

          return (
            <Link 
              key={i} 
              to={path} 
              className="flex items-center justify-between px-6 py-4 group hover:bg-gray-50 transition-all active:bg-gray-100"
            >
              <span className="text-[10px] font-black uppercase text-gray-900 group-hover:text-sm-blue transition-colors leading-tight">
                {label}
              </span>
              <ChevronRight size={14} className="text-gray-200 group-hover:text-sm-blue group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarWidget;
