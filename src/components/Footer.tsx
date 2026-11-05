import React, { useState } from 'react';
import { Flame, ShieldCheck, Mail, FileText, X } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: 'home' | 'how-it-works' | 'mascots' | 'about') => void;
  onCreateClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onCreateClick }) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  return (
    <footer className="w-full border-t-2 border-white/10 bg-[#050505] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-white/10">
          
          {/* Brand lockup */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#ff1493]">
              <span className="font-display font-black text-black text-lg">FF</span>
            </div>
            <div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                FRND FOBIA
              </span>
              <p className="text-xs text-slate-400 font-medium">
                How well do your friends REALLY know you?
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-[#ccff00] cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('how-it-works')} className="hover:text-[#ccff00] cursor-pointer">
              How It Works
            </button>
            <button onClick={() => onNavigate('mascots')} className="hover:text-[#ccff00] cursor-pointer">
              Mascots
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#ccff00] cursor-pointer">
              About
            </button>
            <button onClick={onCreateClick} className="text-[#ccff00] hover:underline cursor-pointer font-black">
              Create Quiz
            </button>
          </div>

        </div>

        {/* Legal & Info Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} FRND FOBIA. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="hover:text-[#ccff00] cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="hover:text-[#ccff00] cursor-pointer"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveLegalModal('contact')}
              className="hover:text-[#ccff00] cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {activeLegalModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121212] border-3 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#ccff00] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <h3 className="font-display font-black text-lg text-white">PRIVACY POLICY</h3>
              <button onClick={() => setActiveLegalModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto space-y-3 text-xs text-slate-300 font-medium leading-relaxed">
              <p>
                <strong>1. Information Collection:</strong> FRND FOBIA does not require registration, email addresses, or phone numbers. Only the creator's chosen nickname, question selections, and friend submission nicknames are stored for challenge scoring.
              </p>
              <p>
                <strong>2. Data Retention & Expiration:</strong> All challenges have an automatic expiration timer (24 to 48 hours).
              </p>
              <p>
                <strong>3. Server Security:</strong> Answers are protected using Firestore security rules and processed strictly on server instances.
              </p>
              <p>
                <strong>4. Cookies & Local Storage:</strong> We use browser localStorage solely to help creators return to their live quiz dashboard on their device.
              </p>
            </div>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="neo-btn-lime w-full py-2.5 rounded-xl text-xs uppercase mt-2 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeLegalModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121212] border-3 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#ff1493] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <h3 className="font-display font-black text-lg text-white">TERMS OF SERVICE</h3>
              <button onClick={() => setActiveLegalModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto space-y-3 text-xs text-slate-300 font-medium leading-relaxed">
              <p>
                <strong>1. Acceptance:</strong> By accessing FRND FOBIA, you agree to these Terms. The platform is designed purely for fun social games between friends.
              </p>
              <p>
                <strong>2. User Conduct:</strong> You agree not to post harassing, defamatory, or abusive content in customized questions or nicknames.
              </p>
              <p>
                <strong>3. Disclaimer:</strong> Results are intended for entertainment and playful amusement. Scores do not constitute legal advice or formal relationship audits!
              </p>
            </div>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="neo-btn-pink w-full py-2.5 rounded-xl text-xs uppercase mt-2 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeLegalModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121212] border-3 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#3b82f6] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-black border-2 border-[#3b82f6] flex items-center justify-center mx-auto text-[#3b82f6]">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-xl text-white">GET IN TOUCH</h3>
            <p className="text-xs text-slate-300 font-medium">
              Have feedback, partnership inquiries, or viral mascot ideas? Reach out to the FRND FOBIA team:
            </p>
            <div className="p-3 rounded-xl bg-black border border-white/20 font-mono text-xs text-[#ccff00]">
              support@frndfobia.com
            </div>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="neo-btn-cobalt w-full py-2.5 rounded-xl text-xs uppercase cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </footer>
  );
};
