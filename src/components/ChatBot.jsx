// src/components/ChatBot.jsx — Super Edition
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, ExternalLink, Minimize2, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generate unique session ID
const getSessionId = () => {
  let id = sessionStorage.getItem('sm_chat_session');
  if (!id) {
    id = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('sm_chat_session', id);
  }
  return id;
};

const SUGGESTED_STARTERS = [
  { text: "We're setting up a new CBSE school for 800 students", icon: "🏫" },
  { text: "What labs do we need for CBSE affiliation?", icon: "🔬" },
  { text: "Our budget is ₹40 lakhs — what's possible?", icon: "💰" },
  { text: "We need to modernize our library", icon: "📚" },
];

const DEFAULT_GREETING = "👋 Hello! I'm **Arjun**, SchoolMart's Senior Infrastructure Consultant with 20+ years of experience.\n\nI've helped design and furnish **500+ campuses** across India. Whether you're building from scratch or upgrading, I'll give you the same expert advice I give to our biggest clients.\n\n**What are you working on?**";

const TypingIndicator = () => (
  <div className="flex items-end gap-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004a8e] to-[#0066cc] flex items-center justify-center flex-shrink-0 shadow-md">
      <Bot size={14} className="text-white" />
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1.5 items-center h-5">
        <span className="w-2 h-2 bg-[#004a8e]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-[#004a8e]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-[#004a8e]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const MessageBubble = ({ msg }) => {
  const isBot = msg.role === 'bot';

  const formatText = (text) => {
    return text.split('\n').map((line, i, arr) => {
      // Bold markdown
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline links like [text](/path)
      formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline font-semibold hover:text-[#0066cc]">$1</a>');
      return (
        <span key={`line-${i}`}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={`flex items-end gap-2 mb-4 ${isBot ? '' : 'flex-row-reverse'} animate-[fadeInUp_0.3s_ease-out]`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
        isBot ? 'bg-gradient-to-br from-[#004a8e] to-[#0066cc]' : 'bg-gradient-to-br from-gray-200 to-gray-300'
      }`}>
        {isBot ? <Bot size={14} className="text-white" /> : <User size={14} className="text-gray-600" />}
      </div>

      <div className={`max-w-[82%] flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Message bubble */}
        <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
          isBot
            ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
            : 'bg-gradient-to-br from-[#004a8e] to-[#003875] text-white rounded-br-sm'
        }`}>
          {formatText(msg.text)}
        </div>

        {/* Suggested page links (bot messages only) */}
        {isBot && msg.suggestedLinks?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {msg.suggestedLinks.map((link) => (
              <Link
                key={link.slug}
                to={link.slug}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#004a8e] bg-blue-50 border border-blue-100 rounded-full px-3 py-1 hover:bg-[#004a8e] hover:text-white transition-all duration-200"
              >
                {link.label}
                <ExternalLink size={8} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Lead Capture Inline Prompt ──
const LeadCaptureCard = ({ onSubmit, onSkip }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() || phone.trim()) {
      onSubmit({ name: name.trim(), phone: phone.trim(), schoolName: schoolName.trim(), email: email.trim() });
    }
  };

  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004a8e] to-[#0066cc] flex items-center justify-center flex-shrink-0 shadow-md">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="max-w-[85%] bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl rounded-bl-sm p-4 shadow-sm">
        <p className="text-[12px] font-bold text-gray-800 mb-3">I'd love to personalize my recommendations for you. Mind sharing a few details?</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#004a8e] transition-colors"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#004a8e] transition-colors"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#004a8e] transition-colors"
          />
          <input
            type="text"
            placeholder="School / Institution Name"
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
            className="w-full text-[12px] bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#004a8e] transition-colors"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 text-[11px] font-bold bg-[#004a8e] text-white rounded-lg py-2 hover:bg-[#003a7a] transition-colors"
            >
              Continue →
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="text-[11px] text-gray-400 hover:text-gray-600 px-3 transition-colors"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ChatBot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadInfo, setLeadInfo] = useState(null);
  const [sessionId] = useState(getSessionId);
  const [pulseCount, setPulseCount] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── Initialize with page-aware greeting ──
  useEffect(() => {
    if (messages.length === 0) {
      const fetchGreeting = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/chat/greeting?page=${location.pathname}`);
          const data = await res.json();
          setMessages([{
            role: 'bot',
            text: data.greeting || DEFAULT_GREETING,
            suggestedLinks: [],
          }]);
        } catch {
          setMessages([{ role: 'bot', text: DEFAULT_GREETING, suggestedLinks: [] }]);
        }
      };
      fetchGreeting();
    }
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [messages, isOpen, showLeadCapture]);

  // ── Attention pulse (gentle nudge after 15 seconds on page) ──
  useEffect(() => {
    if (pulseCount < 2) {
      const timer = setTimeout(() => {
        if (!isOpen) {
          setHasNewMessage(true);
          setPulseCount(p => p + 1);
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pulseCount]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    const userMsg = { role: 'user', text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Build history for API (exclude the initial greeting)
    const history = updatedMessages.slice(1, -1).map(m => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history,
          sessionId,
          currentPage: location.pathname,
          leadInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorText = data?.error || 'Our advisor is temporarily busy. Please try again in a moment.';
        setMessages(prev => [...prev, { role: 'bot', text: errorText, suggestedLinks: [] }]);
        return;
      }

      const botMsg = {
        role: 'bot',
        text: data.reply || "I'm sorry, I didn't catch that. Could you rephrase?",
        suggestedLinks: data.suggestedLinks || [],
      };

      setMessages(prev => [...prev, botMsg]);

      // Show lead capture after 3 exchanges if not already captured
      if (data.shouldCaptureLeads && !leadCaptured && !showLeadCapture) {
        setTimeout(() => setShowLeadCapture(true), 1500);
      }

      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm temporarily unavailable. Please visit our [Contact Us](/contact-us) page or call us directly.",
        suggestedLinks: [{ slug: '/contact-us', label: 'Contact Us' }],
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, sessionId, location.pathname, leadInfo, leadCaptured, showLeadCapture, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeadSubmit = (info) => {
    setLeadInfo(info);
    setLeadCaptured(true);
    setShowLeadCapture(false);
    // Add a thank-you message
    setMessages(prev => [...prev, {
      role: 'bot',
      text: `Thank you, **${info.name || 'there'}**! ${info.schoolName ? `I'll keep **${info.schoolName}** in mind as I recommend solutions.` : ''} Our project team will also prepare some personalized options for you.\n\nNow, let's continue — where were we?`,
      suggestedLinks: [],
    }]);
  };

  const handleLeadSkip = () => {
    setLeadCaptured(true); // Don't ask again
    setShowLeadCapture(false);
  };

  const userMessageCount = messages.filter(m => m.role === 'user').length;

  return (
    <>
      {/* ── Floating Bubble ── */}
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={`fixed bottom-6 right-6 z-[9998] group transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100'}`}
        aria-label="Open SchoolMart AI Advisor"
      >
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-[#004a8e] to-[#0066cc] rounded-full shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_0_8px_rgba(0,74,142,0.12)]">
            <MessageCircle size={24} className="text-white" />
          </div>
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">1</span>
            </span>
          )}
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-[11px] font-medium rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
              💬 Chat with our School Expert
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
            </div>
          </div>
        </div>
      </button>

      {/* ── Chat Window ── */}
      <div className={`fixed bottom-6 right-6 z-[9999] w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-gray-200/60 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
        isOpen && !isMinimized
          ? 'opacity-100 scale-100 h-[600px] max-h-[85vh]'
          : isOpen && isMinimized
          ? 'opacity-100 scale-100 h-[64px]'
          : 'opacity-0 scale-90 h-0 pointer-events-none'
      }`}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#004a8e] to-[#0055a5] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-[14px] leading-tight">Arjun</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <p className="text-blue-200 text-[10px] font-medium uppercase tracking-wider">Senior Advisor · Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(m => !m)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 size={12} className="text-white" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-gray-50/80 to-white scroll-smooth">
              {messages.map((msg, i) => (
                <MessageBubble key={`msg-${i}`} msg={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              {showLeadCapture && !leadCaptured && (
                <LeadCaptureCard onSubmit={handleLeadSubmit} onSkip={handleLeadSkip} />
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Starter Suggestions (show only at start) ── */}
            {userMessageCount === 0 && (
              <div className="px-3 pb-2 flex-shrink-0 bg-white border-t border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest py-2 px-1">Popular Questions</p>
                <div className="grid grid-cols-2 gap-1.5 pb-2">
                  {SUGGESTED_STARTERS.map((s, i) => (
                    <button
                      key={`starter-${i}`}
                      onClick={() => sendMessage(s.text)}
                      className="text-left text-[10px] text-gray-700 font-medium bg-gray-50 hover:bg-[#004a8e] hover:text-white rounded-xl px-3 py-2.5 transition-all duration-150 border border-gray-100 hover:border-transparent group"
                    >
                      <span className="text-[14px] block mb-1">{s.icon}</span>
                      <span className="line-clamp-2">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Input ── */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={leadInfo?.name ? `Ask anything, ${leadInfo.name.split(' ')[0]}...` : "Tell us what you're building..."}
                disabled={isLoading}
                className="flex-1 text-[13px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#004a8e] focus:ring-2 focus:ring-[#004a8e]/10 transition-all placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-gradient-to-br from-[#004a8e] to-[#0055a5] rounded-xl flex items-center justify-center hover:from-[#003a7a] hover:to-[#004a8e] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
                aria-label="Send message"
              >
                {isLoading
                  ? <Loader2 size={16} className="text-white animate-spin" />
                  : <Send size={16} className="text-white" />
                }
              </button>
            </div>

            {/* ── Footer ── */}
            <p className="text-center text-[8px] text-gray-300 pb-2 font-medium bg-white flex-shrink-0 tracking-wide">
              Powered by SchoolMart AI · Responses are advisory
            </p>
          </>
        )}
      </div>

      {/* ── Custom Animation Styles ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
