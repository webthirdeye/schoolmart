import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, UserPlus, Sparkles, ShieldCheck, Mail, Phone, Lock, Building2, Globe, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { register, verifyOtp, resendOtp } from '../services/api';
import { useCMSPage } from '../hooks/useCMSBlock';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    phone: '',
    authorisedPerson: '',
    address: '',
    pincode: '',
    schoolType: '',
    password: '',
    message: '',
    selectedServices: []
  });
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { blocks } = useCMSPage('registration');
  const hero = blocks?.registration_hero || {};
  const fieldData = blocks?.registration_fields || {};
  const srvData = blocks?.registration_services || {};
  const typeData = blocks?.registration_school_types || {};
  const featData = blocks?.registration_features || {};

  const services = srvData.services?.length ? srvData.services : [
    "School design architecture services green schools",
    "Project management planning to completion",
    "Existing school refurbishmentredesign",
    "kindergarden furniture",
    "High school Furniture",
    "Premium furniture for International schools",
    "Hostel furniture",
    "Tablets with pre loaded content CBSE ICSE State",
    "SmartTech Computer Labs",
    "GPRS for buses student tracking",
    "Auggmented Reality Libraries",
    "AI based School content",
    "Mathematica",
    "Discovery Pod",
    "Mini and Mega Auditoriums",
    "Phygital Libraries",
    "Phygital Science labs",
    "Art Music Enviroments",
    "Animated play Interactive walls",
    "School sports acaedemy",
    "Pools aqua complex",
    "Surface Sports Tennis basketball",
    "Cricket baseball pitches",
    "Artificial turf Synthetic Acrylic surfaces",
    "Playscapes Childhood activity",
    "School funding JV & operations",
    "School buy and sell services"
  ];

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Robust mapping: ensure email, name, and password are at the top level
      const submissionData = { ...formData };
      
      // Attempt to recover from dynamic fields if top-level is missing
      if (!submissionData.email || submissionData.email === '') {
        const emailKey = Object.keys(formData).find(k => k.toLowerCase().includes('email'));
        if (emailKey) submissionData.email = formData[emailKey];
      }
      if (!submissionData.schoolName || submissionData.schoolName === '') {
        const nameKey = Object.keys(formData).find(k => k.toLowerCase().includes('name'));
        if (nameKey) submissionData.schoolName = formData[nameKey];
      }
      if (!submissionData.password || submissionData.password === '') {
        const passKey = Object.keys(formData).find(k => k.toLowerCase().includes('password'));
        if (passKey) submissionData.password = formData[passKey];
      }

      console.log('FRONTEND SUBMITTING:', { 
         email: submissionData.email, 
         name: submissionData.schoolName, 
         keys: Object.keys(formData) 
      });

      const res = await register({
        ...submissionData,
        name: submissionData.schoolName || 'Institution User'
      });
      if (res.error) throw new Error(res.error);
      setShowOtp(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(formData.email, otp);
      if (res.error) throw new Error(res.error);
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-[60px] shadow-3xl text-center max-w-lg w-full border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-emerald-500" />
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Account Created!</h2>
          <p className="text-gray-500 font-medium mb-8 italic">Your institutional profile is active. Please use your email to login.</p>
          <Link to="/login" className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-sm-blue transition-all uppercase text-[12px] tracking-widest shadow-xl">
            Login Now <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  if (showOtp) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-[60px] shadow-3xl text-center max-w-lg w-full border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-sm-blue" />
          <div className="w-20 h-20 bg-blue-50 text-sm-blue rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Verify Email</h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Enter the 6-digit code sent to<br/><span className="text-sm-blue lowercase">{formData.email}</span></p>
          
          <form onSubmit={handleVerify} className="space-y-6">
            <input 
              type="text" 
              placeholder="Enter Code" 
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full bg-gray-50 px-8 py-5 rounded-3xl border-2 border-transparent focus:border-sm-blue outline-none text-center text-3xl font-black tracking-[0.5em] transition-all"
            />
            {error && <p className="text-red-500 text-xs font-black uppercase tracking-widest">{error}</p>}
            <button disabled={loading} className="w-full py-5 bg-sm-blue text-white font-black rounded-3xl shadow-xl hover:bg-gray-900 transition-all uppercase tracking-widest text-sm">
              {loading ? 'Verifying...' : 'Verify & Complete'}
            </button>
          </form>

          <button 
            onClick={() => resendOtp(formData.email)}
            className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-sm-blue transition-colors"
          >
            Didn't receive code? Resend
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-8 lg:pt-16 pb-12 overflow-hidden relative">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-100/20 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
         
         {/* UNIQUE STORY SIDEBAR */}
         <div className="w-full lg:w-1/4 text-center lg:text-left pt-2 lg:pt-6 lg:sticky lg:top-24">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-sm-blue font-black rounded-full mb-4 lg:mb-6 text-[12px] lg:text-[13px] uppercase tracking-widest shadow-sm border border-blue-100">
               <UserPlus size={14} className="inline mr-2 lg:size-4" /> {hero.badge || 'Partner Network'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 font-heading leading-[0.85] tracking-tighter mb-4 lg:mb-8 uppercase" dangerouslySetInnerHTML={{ __html: hero.heading || 'Join <br/> The <span class="text-sm-blue italic font-serif opacity-80">Circle.</span>' }} />
            <p className="text-sm lg:text-base text-gray-500 leading-relaxed mb-6 lg:mb-8 font-medium px-4 lg:px-0">
               {hero.description || 'Get exclusive access to architectural blueprints, customized institutional catalogs, and early-bird campus planning consultancy.'}
            </p>

            <div className="hidden lg:grid grid-cols-1 gap-4 text-left">
               {(hero.statCards?.length ? hero.statCards : [
                 { title: 'Pre-Approved', subtitle: 'Pricing for Schools' },
                 { title: 'Priority', subtitle: 'Architect Meetings' }
               ]).map((st, i) => (
                 <div key={i} className="group border-l-4 border-gray-100 pl-6 py-1 hover:border-sm-blue transition-all">
                    <h4 className="text-lg font-black text-gray-900 mb-1 leading-none uppercase">{st.title}</h4>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{st.subtitle}</p>
                 </div>
               ))}
            </div>
         </div>

         {/* HIGHLIGHT REGISTRATION BOX - EXPANDED */}
         <div className="w-full lg:flex-1 relative mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-blue-600 rounded-[40px] lg:rounded-[60px] blur-[80px] opacity-10 animate-pulse" />
            <div className="bg-white rounded-[40px] lg:rounded-[60px] p-5 md:p-10 shadow-3xl relative border border-gray-100 overflow-hidden">
               <div className="absolute top-0 left-0 right-0 h-3 lg:h-4 bg-gray-900" />
               <div className="mb-6 lg:mb-8">
                  <h2 className="text-lg lg:text-xl font-black text-gray-900 font-heading tracking-tight mb-1 uppercase tracking-[0.1em]">
                    {fieldData.formTitle || 'Partner school Registration Form.'}
                  </h2>
                  <p className="text-gray-400 text-[8px] lg:text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                    {fieldData.formSubtitle || 'Please Select the services and get information on new products discounts and seasonal offers'}
                  </p>
               </div>
               
               {error && (
                  <div className={`p-6 md:p-8 rounded-[35px] text-[12px] font-black uppercase tracking-widest mb-8 text-center border-2 animate-in slide-in-from-top-4 duration-500 shadow-2xl ${
                    error.toLowerCase().includes('exists') || error.toLowerCase().includes('already') 
                    ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-orange-200/20' 
                    : 'bg-red-50 text-red-600 border-red-200 shadow-red-200/20'
                  }`}>
                    <div className="flex flex-col items-center gap-3">
                       {(error.toLowerCase().includes('exists') || error.toLowerCase().includes('already')) && (
                          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-2">
                             <ShieldCheck size={24} />
                          </div>
                       )}
                       <span className="leading-relaxed max-w-sm mx-auto">{error}</span>
                       {(error.toLowerCase().includes('exists') || error.toLowerCase().includes('already')) && (
                         <Link to="/login" className="mt-4 px-8 py-3 bg-orange-600 text-white rounded-full text-[11px] hover:bg-gray-900 transition-all flex items-center gap-2">
                            Go to Login Portal <ArrowRight size={14} />
                         </Link>
                       )}
                    </div>
                  </div>
               )}

               <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
                  {/* Fields Section */}
                  <div className="xl:col-span-5 space-y-3 lg:space-y-4">
                    <h3 className="text-base lg:text-xl font-black text-sm-blue uppercase tracking-tight flex items-center gap-2 lg:gap-3">
                      <Building2 size={20} className="lg:size-6" /> {fieldData.sectionHeading || 'Institutional Info'}
                    </h3>
                    
                    <div className="space-y-2.5 pt-1">
                      {/* Dynamic CMS Fields */}
                      {(fieldData.fields || []).map((field, i) => {
                         const fieldKey = field.label;
                         // Smart mapping to sync with auth keys
                         const handleChange = (val) => {
                            const updates = { [fieldKey]: val };
                            const lowerLabel = fieldKey.toLowerCase();
                            if (lowerLabel.includes('name')) updates.schoolName = val;
                            if (lowerLabel.includes('email') || field.type === 'email') updates.email = val;
                            if (lowerLabel.includes('password') || field.type === 'password') updates.password = val;
                            setFormData(prev => ({ ...prev, ...updates }));
                         };

                         return (
                          <div key={i} className="space-y-1">
                             <label className="text-[11px] lg:text-sm font-bold text-gray-900 uppercase ml-6 tracking-wider opacity-60">
                               {fieldKey} {field.required && <span className="text-red-500">*</span>}
                             </label>
                             {field.type === 'textarea' ? (
                               <textarea 
                                 placeholder={field.placeholder} 
                                 required={field.required}
                                 value={formData[fieldKey] || ''} 
                                 onChange={e => handleChange(e.target.value)} 
                                 className="w-full bg-white px-6 py-3.5 rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all placeholder:text-gray-200 font-medium text-sm resize-none shadow-sm"
                                 rows={3}
                               />
                             ) : field.type === 'select' ? (
                               <div className="relative">
                                 <select 
                                   required={field.required}
                                   className="w-full bg-white px-6 py-3.5 rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all text-sm font-medium appearance-none shadow-sm cursor-pointer pr-12"
                                   value={formData[fieldKey] || ''}
                                   onChange={e => handleChange(e.target.value)}
                                 >
                                   <option value="" disabled>{field.placeholder || `Select ${fieldKey}`}</option>
                                   {(field.options || []).map((opt, idx) => (
                                     <option key={idx} value={opt}>{opt}</option>
                                   ))}
                                 </select>
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDown size={18} strokeWidth={2.5} />
                                 </div>
                               </div>
                             ) : (
                               <input 
                                 type={field.type || 'text'} 
                                 placeholder={field.placeholder} 
                                 required={field.required}
                                 value={formData[fieldKey] || ''} 
                                 onChange={e => handleChange(e.target.value)} 
                                 className="w-full bg-white px-6 py-3.5 rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all placeholder:text-gray-200 font-medium text-sm shadow-sm" 
                               />
                             )}
                          </div>
                       )})}

                      {/* Fallback Static fields if CMS is empty */}
                      {!(fieldData.fields?.length) && (
                        <>
                          <div className="space-y-1">
                            <label className="text-[11px] lg:text-sm font-bold text-gray-900 uppercase ml-6 tracking-wider opacity-60">Phone Number</label>
                            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white px-6 py-3.5 rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all placeholder:text-gray-200 font-medium text-sm shadow-sm" />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] lg:text-sm font-bold text-gray-900 uppercase ml-6 tracking-wider opacity-60">Type of school</label>
                            <div className="relative">
                              <select 
                                className="w-full bg-white px-6 py-3.5 rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all text-sm font-medium appearance-none shadow-sm cursor-pointer pr-12"
                                value={formData.schoolType}
                                onChange={e => setFormData({...formData, schoolType: e.target.value})}
                              >
                                <option value="" disabled>Select school type</option>
                                {(typeData.options?.length ? typeData.options : [
                                  "International school", "CBSE School", "ICSE School", "STATE Board School", "College University", "Business Educational Partners"
                                ]).map((opt, i) => (
                                  <option key={i} value={opt}>{opt}</option>
                                ))}
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                 <ChevronDown size={18} strokeWidth={2.5} />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Services Grid Section */}
                  <div className="xl:col-span-1 border-l border-gray-100 hidden xl:block"></div>
                  
                  <div className="xl:col-span-6 space-y-4 lg:space-y-6 mt-6 xl:mt-0 pt-6 xl:pt-0 border-t xl:border-t-0 border-gray-100">
                    <h3 className="text-base lg:text-xl font-black text-sm-blue uppercase tracking-tight flex items-center gap-2 lg:gap-3">
                       <CheckCircle2 size={20} className="lg:size-6" /> {srvData.heading || 'Select Services'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 pt-2">
                      {services.map((service, idx) => (
                        <label key={idx} className="flex items-center gap-3 lg:gap-4 cursor-pointer group">
                          <div className="relative flex items-center justify-center shrink-0">
                            <input 
                              type="checkbox" 
                              className="peer sr-only"
                              checked={formData.selectedServices.includes(service)}
                              onChange={() => handleServiceToggle(service)}
                            />
                            <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-gray-300 rounded lg:rounded-lg bg-white peer-checked:bg-sm-blue peer-checked:border-sm-blue transition-all group-hover:border-sm-blue shadow-sm"></div>
                            <CheckCircle2 size={12} className="lg:size-[14px] absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[12px] lg:text-[13px] font-black text-gray-600 leading-tight uppercase tracking-tight group-hover:text-sm-blue transition-colors">
                            {service}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-8 lg:mt-12 flex justify-center lg:justify-end">
                      <button disabled={loading} className="w-full lg:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-[#004a8e] text-white font-black rounded-2xl lg:rounded-3xl shadow-3xl hover:bg-gray-900 transition-all uppercase tracking-[0.2em] text-[12px] lg:text-[13px] flex items-center justify-center gap-3 active:scale-[0.98]">
                        {loading ? 'Processing...' : (fieldData.submitLabel || 'SUBMIT')} <Send size={18} />
                      </button>
                    </div>
                  </div>
               </form>
            </div>
         </div>
      </div>

      {/* DASHBOARD-STYLE PREVIEW BENTO (Unique for Registration) */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
           {(featData.cards?.length ? featData.cards : [
             { icon: 'ShieldCheck', title: 'Data Privacy', description: 'Your institutional data is protected by bank-level encryption.', c: 'bg-white text-gray-900' },
             { icon: 'Globe', title: 'Network Access', description: 'Discover the list of our 1500+ institutional members.', c: 'bg-white text-gray-900' },
             { icon: 'Sparkles', title: 'Exclusive Docs', description: 'Download 200+ case studies and architectural PDFs.', c: 'bg-white text-gray-900' },
             { icon: 'ArrowRight', title: 'Direct Entry', description: 'Fast-track your first order with simplified workflow.', c: 'bg-white text-gray-900' },
           ]).map((card, i) => {
             const Icon = { ShieldCheck, Globe, Sparkles, ArrowRight }[card.icon] || ShieldCheck;
             return (
             <div key={i} className={`p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-3xl transition-all hover:-translate-y-4 cursor-pointer flex flex-col items-center text-center ${card.c || 'bg-white text-gray-900'}`}>
                <div className={`w-20 h-20 bg-gray-50 group-hover:bg-sm-blue group-hover:text-white rounded-[30px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                   <Icon size={32} />
                </div>
                <h3 className="text-lg font-black font-heading mb-2 leading-tight uppercase tracking-tight">{card.title}</h3>
                <p className="text-gray-400 text-[12px] font-bold uppercase tracking-widest leading-relaxed">{card.description}</p>
             </div>
           )})}
        </div>
      </div>
    </main>
  );
};

export default Registration;
