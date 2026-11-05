import React from 'react';
import { Target, Share2, Eye, ShieldCheck, Zap } from 'lucide-react';
import { MASCOTS } from '../data/mascots';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Build Your Trap',
      desc: 'Pick 5 spicy questions from our red-flag and secret vault. Mark your true answer with zero fear of leaks.',
      icon: Target,
      tag: '60 Seconds',
      color: 'border-[#ccff00] shadow-[5px_5px_0px_0px_#ccff00]',
      mascot: MASCOTS.the_savage
    },
    {
      num: '02',
      title: 'Drop The Link',
      desc: 'Share your challenge URL directly to WhatsApp Status, Instagram Stories, or group chats with 1-tap.',
      icon: Share2,
      tag: 'Viral Ready',
      color: 'border-[#ff1493] shadow-[5px_5px_0px_0px_#ff1493]',
      mascot: MASCOTS.drama_queen
    },
    {
      num: '03',
      title: 'Expose The Truth',
      desc: 'Watch the live Creator Dashboard as friends guess. See who passed the vibe check and who got roasted.',
      icon: Eye,
      tag: 'Live Scores',
      color: 'border-[#3b82f6] shadow-[5px_5px_0px_0px_#2563eb]',
      mascot: MASCOTS.suspicious_bestie
    }
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 border-t-2 border-white/10 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#ccff00] bg-black px-3 py-1 rounded-full border border-[#ccff00]/40">
            SIMPLE 3-STEP GAMEPLAY
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-3">
            HOW FRND FOBIA WORKS
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
            Zero sign-up friction. No passwords or app downloads required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`relative bg-[#121212] border-2 rounded-3xl p-7 transition-transform hover:-translate-y-1 ${s.color}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-black border-2 border-white/20 flex items-center justify-center text-[#ccff00]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-black text-4xl text-white/30">
                    {s.num}
                  </span>
                </div>

                <div className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black text-[#ccff00] border border-[#ccff00]/40 mb-3">
                  {s.tag}
                </div>

                <h3 className="font-display font-black text-xl text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {s.desc}
                </p>

                {/* Mascot Mini Stamp */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2.5">
                  <img
                    src={s.mascot.image}
                    alt={s.mascot.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover border border-white/20"
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Monitored by {s.mascot.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Sealed Answers Trust Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#121212] border-2 border-black max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#ccff00]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-[#ccff00] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Military-Grade Answer Secrecy</p>
              <p className="text-xs text-slate-300 font-medium">
                Correct answers are isolated on the server. Friends cannot inspect element, view network tabs, or cheat.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-black text-black bg-[#ccff00] px-3 py-1.5 rounded-lg border border-black shadow-[2px_2px_0px_0px_#000] whitespace-nowrap">
            Zero Cheating
          </span>
        </div>

      </div>
    </section>
  );
};
