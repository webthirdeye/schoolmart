// src/components/ClientLogos.jsx
import { GraduationCap, School, BookOpen, Building2, Award } from 'lucide-react';
import { useCMSBlock } from '../hooks/useCMSBlock';

const ICON_MAP = { GraduationCap, School, BookOpen, Building2, Award };
const COLORS = ['text-blue-600', 'text-orange-600', 'text-purple-600', 'text-red-600', 'text-green-600', 'text-indigo-600', 'text-teal-600', 'text-pink-600', 'text-amber-600', 'text-cyan-600'];
const ICONS_LIST = [GraduationCap, School, BookOpen, Building2, Award];

const DEFAULTS = {
  heading: 'Trusted by Leading Schools',
  subheading: '4000+ partner schools across India',
  clients: [
    { name: 'AVN Vida International School' }, { name: 'Alwar Das Group' },
    { name: 'DRS International School' }, { name: 'Bhashyam Educational Institutions' },
    { name: 'Excel Edge The Value School' }, { name: 'Delhi Public School' },
    { name: 'DAV Public School' }, { name: 'Podar International' },
    { name: 'CMS School' }, { name: 'VIBGYOR Group' },
  ],
  stats: [
    { value: '4000+', label: 'Partner Schools', color: 'text-blue-600' },
    { value: '7+', label: 'Years Experience', color: 'text-green-600' },
    { value: '1200+', label: 'Products', color: 'text-orange-600' },
    { value: '16+', label: 'Panel Architects', color: 'text-purple-600' },
  ],
};

const STAT_COLORS = ['text-sm-blue', 'text-sm-green', 'text-sm-orange', 'text-sm-purple'];

const ClientLogos = () => {
  const { data } = useCMSBlock('home', 'partners', DEFAULTS);
  const d = { ...DEFAULTS, ...data };

  const clients = (d.clients || DEFAULTS.clients)
    .filter(c => c && c.name && c.name.trim() !== '')
    .map((c, i) => ({
      ...c,
      icon: ICON_MAP[c.icon] || ICONS_LIST[i % ICONS_LIST.length],
      color: c.color || COLORS[i % COLORS.length],
    }));

  // Ensure enough items to fill the marquee (at least 20 entries for smooth scroll)
  const minItems = 20;
  const repeats = Math.ceil(minItems / Math.max(clients.length, 1));
  const allClients = Array.from({ length: repeats * 2 }, (_, r) =>
    clients.map((c, i) => ({ ...c, _key: `${r}-${i}` }))
  ).flat();

  const stats = d.stats || DEFAULTS.stats;

  return (
    <section className="py-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3">
        <h2 className="text-2xl font-bold text-center text-gray-800 font-heading">
          {d.heading}
        </h2>
        <p className="text-center text-gray-500 mt-2">
          {d.subheading}
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Scrolling Content */}
        <div className="flex animate-marquee" key={clients.length}>
          {allClients.map((client, index) => {
            const Icon = client.icon;
            return (
              <div
                key={client._key || `${client.name}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center gap-3 group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                  <Icon size={28} className={client.color} />
                </div>
                <span className="text-lg font-semibold text-gray-700 whitespace-nowrap group-hover:text-sm-blue transition-colors duration-300">
                  {client.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4">
              <p
                className="text-4xl font-bold font-heading"
                style={{ color: stat.color && stat.color.startsWith('#') ? stat.color : ['#0057A8','#22C55E','#F97316','#8B5CF6'][i % 4] }}
              >{stat.value}</p>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
