import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Award, Zap, Building2, Phone, Search, Users, ExternalLink } from 'lucide-react';

const JOBS = [
  {
    role: 'Academic Consultant',
    type: 'Full Time',
    location: 'Hyderabad / REMOTE',
    dept: 'Institutional Growth',
    desc: 'Advising schools on academic transformation and NEP implementation strategies.',
  },
  {
    role: 'Product Designer (Institutional)',
    type: 'Full Time',
    location: 'Bangalore',
    dept: 'Design Lab',
    desc: 'Creating next-gen furniture and spatial layouts for modern K-12 campuses.',
  },
  {
    role: 'Technical Project Manager',
    type: 'Full Time',
    location: 'Delhi NCR',
    dept: 'Infrastructure',
    desc: 'Managing turnkey school setup projects from site survey to final handover.',
  },
];

const JobOpenings = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* COMPACT CAREERS HERO */}
      <section className="bg-gray-900 py-16 px-6 relative overflow-hidden text-white border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-sm-blue/5 skew-x-12 -mr-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sm-blue/20 text-sm-blue rounded-full mb-6 border border-sm-blue/20">
               <Briefcase size={14} />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] font-heading text-sm-blue">Careers v2025</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Join the <br />
              <span className="text-sm-blue italic font-serif lowercase tracking-normal text-6xl">Growth</span> Engine.
            </h1>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose max-w-sm mb-10">
               We're looking for visionary consultants, designers, and engineers to redefine Indian education infrastructure.
            </p>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-sm-blue text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-all shadow-xl shadow-blue-500/10 active:scale-95 duration-500">
                 View Open Roles (12+)
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white/5 p-10 rounded-[50px] border border-white/10 backdrop-blur-md">
             <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-sm-blue/20 rounded-xl flex items-center justify-center text-sm-blue"><Users size={20} /></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Global Team</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-sm-blue/20 rounded-xl flex items-center justify-center text-sm-blue"><Award size={20} /></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Equity Packages</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* JOB LISTING: Compact High-Density Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
           {JOBS.map((job, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[30px] p-8 flex flex-col md:flex-row items-center justify-between group hover:border-sm-blue transition-all">
                 <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                       <span className="text-sm-blue text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full">{job.dept}</span>
                       <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-sm-blue transition-colors">{job.role}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                       <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    </div>
                 </div>
                 <div className="mt-8 md:mt-0 flex flex-col items-end gap-3">
                    <button className="px-10 py-4 bg-gray-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sm-blue transition-all flex items-center gap-3">
                       Apply Now <ExternalLink size={14} />
                    </button>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">v2025-04 Posting</span>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* FOOTER STRIP */}
      <section className="py-20 px-6 bg-gray-50 flex flex-col items-center justify-center text-center">
         <h4 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-8">Don't see a role that fits?</h4>
         <button className="px-12 py-5 border-2 border-gray-900 text-gray-900 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-2xl active:scale-95 duration-500">
            Submit Open Application
         </button>
      </section>
    </main>
  );
};

export default JobOpenings;
