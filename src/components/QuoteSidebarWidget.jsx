import React, { useState } from 'react';
import { submitQuote } from '../services/api';

const QuoteSidebarWidget = ({ sourcePage = 'Website' }) => {
  const [quoteForm, setQuoteForm] = useState({ schoolName: '', phone: '', pinCode: '', requirements: '' });
  const [quoteStatus, setQuoteStatus] = useState('');

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteStatus('submitting');
    try {
      await submitQuote({
        name: quoteForm.schoolName,
        phone: quoteForm.phone,
        message: `PIN: ${quoteForm.pinCode}\nRequirements: ${quoteForm.requirements}\nSource: ${sourcePage} Page`
      });
      setQuoteStatus('success');
      setQuoteForm({ schoolName: '', phone: '', pinCode: '', requirements: '' });
      setTimeout(() => setQuoteStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setQuoteStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#003a8c] to-[#001f5c] rounded-[2rem] shadow-[0_10px_40px_rgba(0,58,140,0.3)] mt-8 border border-blue-400/20 flex flex-col relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-150" />
       <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none transition-transform duration-700 group-hover:scale-150" />
       
       <div className="text-center pt-8 pb-4 relative z-10 px-6">
          <div className="mx-auto w-12 h-1.5 bg-gradient-to-r from-[#ffb703] to-[#fca311] rounded-full mb-4 shadow-[0_0_10px_rgba(255,183,3,0.5)]"></div>
          <h4 className="text-[#ffb703] text-[16px] font-black uppercase tracking-[0.15em] drop-shadow-md">GET A QUOTE</h4>
       </div>
       
       <form onSubmit={handleQuoteSubmit} className="p-6 pt-2 flex flex-col gap-4 relative z-10">
          <input 
             type="text" 
             required
             placeholder="School Name" 
             value={quoteForm.schoolName}
             onChange={e => setQuoteForm({...quoteForm, schoolName: e.target.value})}
             className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-[#ffb703] focus:border-transparent placeholder:text-blue-100/60 transition-all shadow-inner"
          />
          <input 
             type="tel" 
             required
             placeholder="Phone Number" 
             value={quoteForm.phone}
             onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})}
             className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-[#ffb703] focus:border-transparent placeholder:text-blue-100/60 transition-all shadow-inner"
          />
          <input 
             type="text" 
             placeholder="Pin Code" 
             value={quoteForm.pinCode}
             onChange={e => setQuoteForm({...quoteForm, pinCode: e.target.value})}
             className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-[#ffb703] focus:border-transparent placeholder:text-blue-100/60 transition-all shadow-inner"
          />
          <textarea 
             required
             placeholder="What are you looking for?" 
             rows="3"
             value={quoteForm.requirements}
             onChange={e => setQuoteForm({...quoteForm, requirements: e.target.value})}
             className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-[#ffb703] focus:border-transparent placeholder:text-blue-100/60 resize-none transition-all shadow-inner"
          />
          <button 
             type="submit" 
             disabled={quoteStatus === 'submitting'}
             className="mt-4 bg-gradient-to-r from-[#ffb703] to-[#fca311] text-[#001f5c] text-[14px] font-black uppercase tracking-[0.1em] rounded-xl py-4 w-full hover:scale-[1.03] shadow-[0_0_20px_rgba(255,183,3,0.3)] hover:shadow-[0_0_30px_rgba(255,183,3,0.5)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
             {quoteStatus === 'submitting' ? 'Submitting...' : quoteStatus === 'success' ? 'Submitted!' : 'SUBMIT REQUEST'}
          </button>
          {quoteStatus === 'error' && <p className="text-red-300 text-xs text-center font-bold mt-2">Failed to submit. Try again.</p>}
       </form>
    </div>
  );
};

export default QuoteSidebarWidget;
