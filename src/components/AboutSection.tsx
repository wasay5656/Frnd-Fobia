import React from 'react';
import { Flame, Skull, Zap, HeartHandshake } from 'lucide-react';
import { MASCOTS } from '../data/mascots';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-14 sm:py-20 border-t-2 border-white/10 bg-[#090909]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff1493]/10 border border-[#ff1493]/30 text-xs font-black text-[#ff1493] mb-2 uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>THE GEN-Z MANIFESTO</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
            WHY WE BUILT FRND FOBIA
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
            Because superficial friendships deserve a playful audit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            <p>
              We live in a world where everyone has 1,200 mutual followers, 40 unread group chats, and yet when you ask someone what your biggest pet peeve is, they look at you like you just spoke Ancient Greek.
            </p>
            <p>
              <strong className="text-[#ccff00] font-black">FRND FOBIA</strong> was designed to settle the score: <span className="text-white font-bold bg-black px-1.5 py-0.5 border border-white/20">“Do your friends actually know who you are, or are they just along for the ride?”</span>
            </p>
            <p>
              From late-night 2 AM habits to the excuses you use when you're too lazy to leave your bed, we turned friendship into a high-stakes, hilarious quiz game where scores don’t lie.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#ff1493]">
              <Skull className="w-6 h-6 text-[#ff1493] mb-3" />
              <h4 className="font-display font-black text-base text-white">Savage Honesty</h4>
              <p className="text-xs text-slate-300 mt-1 font-medium">No polite sugar-coating. Either they know you or they get exposed.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#ccff00]">
              <Zap className="w-6 h-6 text-[#ccff00] mb-3" />
              <h4 className="font-display font-black text-base text-white">Zero Sign-Up</h4>
              <p className="text-xs text-slate-300 mt-1 font-medium">No passwords, spam emails, or app store downloads needed.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#3b82f6]">
              <HeartHandshake className="w-6 h-6 text-[#3b82f6] mb-3" />
              <h4 className="font-display font-black text-base text-white">Real Besties</h4>
              <p className="text-xs text-slate-300 mt-1 font-medium">Celebrate the genuine real ones who get 5/5 and deserve the crown.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#ffffff]">
              <Flame className="w-6 h-6 text-white mb-3" />
              <h4 className="font-display font-black text-base text-white">Viral Friendly</h4>
              <p className="text-xs text-slate-300 mt-1 font-medium">One-tap sharing for WhatsApp, Snapchat, and Instagram Stories.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
