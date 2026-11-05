import React, { useState } from 'react';
import { Flame, Sparkles, HelpCircle, Info, BookmarkCheck, Users, Menu, X } from 'lucide-react';

interface NavbarProps {
  onCreateClick: () => void;
  onMyQuizzesClick: () => void;
  onNavigate: (section: 'home' | 'how-it-works' | 'mascots' | 'about') => void;
  currentSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onCreateClick,
  onMyQuizzesClick,
  onNavigate,
  currentSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b-2 border-black border-b-[#ccff00]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Original FRND FOBIA Logo / Wordmark */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          {/* Logo Badge with Electric Lime & Hot Pink Y2K Sticker Style */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#ff1493] group-hover:rotate-6 transition-transform">
              <span className="font-display font-black text-black text-xl leading-none">FF</span>
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#ff1493] border-2 border-black animate-ping" />
          </div>

          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-[#ccff00] transition-colors leading-none">
              FRND FOBIA
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#ff1493] uppercase">
              VIBE CHECK
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-[#ccff00] transition-colors cursor-pointer ${
              currentSection === 'home' ? 'text-[#ccff00] border-b-2 border-[#ccff00] pb-0.5' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`hover:text-[#ccff00] transition-colors cursor-pointer ${
              currentSection === 'how-it-works' ? 'text-[#ccff00] border-b-2 border-[#ccff00] pb-0.5' : ''
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('mascots')}
            className={`hover:text-[#ccff00] transition-colors cursor-pointer ${
              currentSection === 'mascots' ? 'text-[#ccff00] border-b-2 border-[#ccff00] pb-0.5' : ''
            }`}
          >
            Mascots
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`hover:text-[#ccff00] transition-colors cursor-pointer ${
              currentSection === 'about' ? 'text-[#ccff00] border-b-2 border-[#ccff00] pb-0.5' : ''
            }`}
          >
            About
          </button>
          <button
            onClick={onMyQuizzesClick}
            className="hover:text-[#ff1493] transition-colors cursor-pointer flex items-center gap-1.5 text-blue-400 font-bold"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>My Quizzes</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateClick}
            className="neo-btn-lime px-4 sm:px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>CREATE CHALLENGE</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#141414] border border-white/20 text-white hover:text-[#ccff00]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d0d] border-b-2 border-[#ccff00] px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>Home</span>
            <span className="text-xs text-[#ccff00]">01</span>
          </button>
          <button
            onClick={() => {
              onNavigate('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>How It Works</span>
            <span className="text-xs text-[#ff1493]">02</span>
          </button>
          <button
            onClick={() => {
              onNavigate('mascots');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>Meet The Mascots</span>
            <span className="text-xs text-blue-400">03</span>
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>About</span>
            <span className="text-xs text-slate-400">04</span>
          </button>
          <button
            onClick={() => {
              onMyQuizzesClick();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-[#ccff00] bg-white/5 border border-[#ccff00]/40 flex items-center gap-2"
          >
            <BookmarkCheck className="w-4 h-4 text-[#ccff00]" />
            <span>My Saved Quizzes & Dashboards</span>
          </button>
        </div>
      )}
    </header>
  );
};
