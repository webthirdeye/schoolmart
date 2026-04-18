// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Lock, UserCheck, ShieldCheck, Mail, ArrowRight, Sparkles, Building2, Key } from 'lucide-react';
import { login, verifyOtp, resendOtp } from '../services/api';
import { useCMSPage } from '../hooks/useCMSBlock';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Password, 2: OTP
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { blocks } = useCMSPage('login');
  const dHero = blocks?.login_hero || {};
  const dFields = blocks?.login_fields || {};

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(formData.email, formData.password);
      if (res.otpRequired) {
        setStep(2);
        setMessage('Security code sent to your email.');
      } else {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/member/dashboard');
        }
      }
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
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(formData.email);
      setMessage('OTP resent successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-10 lg:pt-16 pb-12 overflow-hidden relative">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-100/20 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
         
         {/* UNIQUE LOGIN STORY */}
         <div className="flex-1 text-center lg:text-left hidden lg:block">
            <span className="inline-block px-5 py-2 bg-emerald-50 text-emerald-600 font-black rounded-full mb-8 text-[13px] uppercase tracking-widest border border-emerald-100 shadow-sm">
               <ShieldCheck size={16} className="inline mr-2" /> {dHero.badge || 'Secure Institutional Portal'}
            </span>
            <h1 className="text-6xl lg:text-9xl font-black text-gray-900 font-heading leading-[0.85] tracking-tighter mb-8 uppercase" dangerouslySetInnerHTML={{ __html: dHero.heading || 'Welcome <br/> <span class="text-sm-blue italic font-serif opacity-80 decoration-sm-blue decoration-4 underline underline-offset-[20px]">Back.</span>' }} />
            <p className="text-lg text-gray-500 leading-relaxed max-w-sm mb-10 font-medium">
               {dHero.description || 'Manage your project timelines, view your quotation history, and access exclusive design resources from one dashboard.'}
            </p>

            <div className="flex items-center gap-6 mt-16">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-xl hover:scale-110 transition-transform cursor-pointer">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Member" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">{dHero.memberTitle || 'Member Circle'}</h4>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">{dHero.memberSubtitle || '15k+ Institutions Online'}</p>
               </div>
            </div>
         </div>

         {/* HIGHLIGHT LOGIN BOX */}
         <div className="w-full lg:w-[480px] relative">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-600 rounded-full blur-[140px] opacity-10 animate-pulse" />
            <div className="bg-white rounded-[40px] lg:rounded-[60px] p-8 lg:p-14 shadow-3xl relative border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
               <div className="absolute top-0 left-0 right-0 h-4 bg-gray-900" />
               <div className="text-center mb-8 lg:mb-10">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-900 text-white rounded-[30px] lg:rounded-[35px] flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-2xl transition-transform">
                     {step === 1 ? <UserCheck size={step === 1 ? 32 : 36} /> : <Key size={32} />}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-gray-900 font-heading tracking-tight mb-2 uppercase tracking-[0.2em] leading-none">
                    {step === 1 ? (dFields.formTitle || 'SIGN IN') : '2FA VERIFY'}
                  </h2>
                  <p className="text-gray-400 text-[11px] lg:text-[12px] font-bold uppercase tracking-widest">
                    {step === 1 ? (dFields.formSubtitle || 'Everything a school needs is within reach.') : 'Enter the code from your email'}
                  </p>
               </div>
               
               {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[12px] font-black uppercase tracking-widest mb-6 text-center border border-red-100">{error}</div>}
               {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-[12px] font-black uppercase tracking-widest mb-6 text-center border border-emerald-100">{message}</div>}

               {step === 1 ? (
                 <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-0.5 group">
                       <label className="text-[12px] lg:text-sm font-bold text-gray-900 uppercase ml-4 tracking-wider transition-colors group-focus-within:text-sm-blue">
                         {dFields.emailLabel || 'Work Email'}
                       </label>
                       <div className="relative">
                          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder={dFields.emailPlaceholder || "example@institutional.in"} className="w-full bg-white px-6 lg:px-8 py-3.5 lg:py-4 rounded-2xl lg:rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all placeholder:text-gray-200 font-bold text-sm shadow-sm" />
                          <Mail size={18} className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-sm-blue transition-colors" />
                       </div>
                    </div>
                    
                    <div className="space-y-0.5 group">
                       <div className="flex items-center justify-between px-4 mb-0.5">
                          <label className="text-[12px] lg:text-sm font-bold text-gray-900 uppercase tracking-wider transition-colors group-focus-within:text-sm-blue">
                            {dFields.passwordLabel || 'Security Key'}
                          </label>
                          <Link to="/forgot-password" className="text-[11px] font-black text-sm-blue hover:text-gray-900 uppercase tracking-widest transition-colors">Forgot?</Link>
                       </div>
                       <div className="relative">
                          <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="********" className="w-full bg-white px-6 lg:px-8 py-3.5 lg:py-4 rounded-2xl lg:rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all placeholder:text-gray-200 font-bold text-sm shadow-sm" />
                          <Lock size={18} className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-sm-blue transition-colors" />
                       </div>
                    </div>
 
                    <div className="pt-2">
                       <button disabled={loading} className="w-full py-4 lg:py-5 bg-gray-900 text-white font-black rounded-2xl lg:rounded-3xl shadow-3xl hover:bg-[#004a8e] transition-all uppercase tracking-[0.3em] text-[12px] lg:text-[13px] flex items-center justify-center gap-3 active:scale-[0.98]">
                          {loading ? 'Authorizing...' : (dFields.submitLabel || 'Authorize Portal')} <ArrowRight size={18} />
                       </button>
                    </div>
                 </form>
               ) : (
                 <form className="space-y-6 lg:space-y-8" onSubmit={handleVerify}>
                    <div className="relative group text-center">
                       <p className="text-[12px] lg:text-[13px] text-gray-500 font-medium mb-4 lg:mb-6 leading-relaxed">Security code sent to <br/><span className="text-gray-900 font-bold">{formData.email}</span></p>
                       <input type="text" maxLength="6" placeholder="000000" required value={otp} onChange={e => setOtp(e.target.value)} className="w-full bg-white px-6 py-5 lg:py-6 rounded-2xl lg:rounded-3xl border-2 border-gray-100 focus:border-sm-blue outline-none transition-all text-center text-2xl lg:text-3xl font-black tracking-[8px] lg:tracking-[10px] placeholder:text-gray-200 shadow-sm" />
                    </div>
                    
                    <button disabled={loading} className="w-full py-4 lg:py-5 bg-sm-blue text-white font-black rounded-2xl lg:rounded-3xl shadow-3xl hover:bg-gray-900 transition-all uppercase tracking-[0.3em] text-[12px] lg:text-[13px] flex items-center justify-center gap-3 active:scale-[0.98]">
                       {loading ? 'Verifying...' : 'Verify Identity'} <ShieldCheck size={18} />
                    </button>
                    
                    <button type="button" onClick={handleResend} className="w-full text-center text-[11px] lg:text-[12px] font-black text-gray-400 hover:text-sm-blue uppercase tracking-widest">Resend Security Code</button>
                 </form>
               )}
               
               <div className="text-center mt-10 lg:mt-12 bg-gray-50 p-6 rounded-[35px] border border-gray-100 group cursor-pointer hover:bg-sm-blue transition-all">
                  <p className="text-gray-400 group-hover:text-white/60 text-[11px] lg:text-[12px] uppercase font-bold tracking-widest mb-1 transition-colors">New Institution?</p>
                  <Link to="/registration" className="text-[12px] lg:text-[13px] font-black group-hover:text-white text-sm-blue uppercase tracking-widest transition-colors flex items-center justify-center gap-2"> Create School Account <Sparkles size={14} /></Link>
               </div>
            </div>
         </div>

      </div>
    </main>
  );
};

export default Login;
