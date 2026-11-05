import React from 'react';
import { Sparkles, MessageSquareQuote } from 'lucide-react';
import { MASCOT_LIST } from '../data/mascots';

export const MascotShowcase: React.FC = () => {
  return (
    <section id="mascots" className="py-14 sm:py-20 border-t-2 border-white/10 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-black text-[#ccff00] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE OFFICIAL BOARD OF AUDITORS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            MEET THE MASCOTS
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
            The four internet personalities determining whether your bestie is legit or belongs in the group chat spam folder.
          </p>
        </div>

        {/* 4 Mascots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MASCOT_LIST.map((mascot) => (
            <div
              key={mascot.id}
              className="group relative rounded-3xl bg-[#141414] border-2 border-white/20 p-5 hover:border-[#ccff00] hover:shadow-[6px_6px_0px_0px_#ccff00] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Character Illustration Frame */}
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#080808] border-2 border-black mb-4 shadow-[3px_3px_0px_0px_#000]">
                  <img
                    src={mascot.image}
                    alt={mascot.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-black ${mascot.badgeBg}`}>
                    {mascot.role}
                  </span>
                </div>

                {/* Name & Catchphrase */}
                <h3 className="font-display font-black text-xl text-white">
                  {mascot.name}
                </h3>

                {/* Comic Speech Bubble */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-black border border-white/10 text-xs text-[#ccff00] font-mono leading-relaxed flex items-start gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-[#ff1493] shrink-0 mt-0.5" />
                  <span>{mascot.catchphrase}</span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-normal">
                  {mascot.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Vibe Audit</span>
                <span className="font-bold text-white">100% Genuine</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
