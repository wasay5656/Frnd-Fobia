import React from 'react';
import { ArrowRight, Flame, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { MASCOTS } from '../data/mascots';

interface HeroProps {
  onCreateClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCreateClick, onHowItWorksClick }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-14 sm:pt-10 sm:pb-20 bg-grid-pattern">
      {/* Background neon ambient gradients */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-[#ccff00]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-[#ff1493]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Y2K Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Y2K Meme Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black border-2 border-[#ccff00] text-xs font-black text-[#ccff00] mb-5 shadow-[3px_3px_0px_0px_#ccff00] transform -rotate-1">
              <span className="w-2 h-2 rounded-full bg-[#ff1493] animate-ping" />
              <span>THE VIRAL FRIENDSHIP AUDIT</span>
              <span className="text-white/40">|</span>
              <span className="text-white">NO CAP 💯</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] text-white">
              THINK YOUR <br />
              <span className="text-black bg-[#ccff00] px-2 py-0.5 inline-block transform -rotate-1 border-2 border-black shadow-[4px_4px_0px_0px_#ff1493]">
                FRIENDS KNOW YOU?
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-xl mx-auto lg:mx-0 font-semibold leading-relaxed">
              Let's put your friendships to the ultimate test. Create a savage 5-question quiz in 60 seconds and see who pays attention when you talk.
            </p>

            {/* Interactive CTAs - Prominent and immediately clickable on mobile */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onCreateClick}
                className="neo-btn-lime w-full sm:w-auto px-8 py-4 rounded-2xl text-base tracking-wide flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 fill-black group-hover:rotate-12 transition-transform" />
                <span>CREATE YOUR CHALLENGE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#141414] hover:bg-[#1f1f1f] border-2 border-white/20 text-white font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
              >
                <span>HOW IT WORKS</span>
              </button>
            </div>

            {/* Mascot Avatar Sneak Peek Row */}
            <div className="mt-8 pt-6 border-t-2 border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                Audited by our mascots:
              </span>
              <div className="flex items-center -space-x-2">
                {Object.values(MASCOTS).map((m) => (
                  <div
                    key={m.id}
                    className="w-10 h-10 rounded-full border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#ccff00] transform hover:scale-110 transition-transform bg-[#1a1a1a]"
                    title={`${m.name}: ${m.catchphrase}`}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-[#ff1493] ml-2">
                4 Savage Personalities
              </span>
            </div>

          </div>

          {/* Right Column: Y2K Sticker Bomb Scene */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Neo-brutalist Card */}
              <div className="relative rounded-3xl bg-black border-3 border-[#ccff00] p-2 shadow-[8px_8px_0px_0px_#ff1493]">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-[#121212]">
                  <img
                    src="/src/assets/images/hero_y2k_banner_1793894904055.jpg"
                    alt="FRND FOBIA Y2K Social Gaming Experience"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Comic Speech Bubble */}
                  <div className="absolute top-3 left-3 bg-white text-black px-3.5 py-1.5 rounded-2xl rounded-bl-none border-2 border-black font-black text-xs uppercase tracking-tight shadow-[3px_3px_0px_0px_#000]">
                    <span>Are you bestie material? 👀</span>
                  </div>

                  {/* Bottom Reaction Sticker */}
                  <div className="absolute bottom-3 right-3 bg-[#ccff00] text-black px-3.5 py-1.5 rounded-xl border-2 border-black font-black text-xs uppercase tracking-tight shadow-[3px_3px_0px_0px_#ff1493]">
                    <span>🔥 100% Savage Results</span>
                  </div>
                </div>
              </div>

              {/* Floating Suspicious Bestie sticker badge */}
              <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2.5 p-2.5 bg-black border-2 border-[#3b82f6] rounded-2xl shadow-[4px_4px_0px_0px_#2563eb] rotate-[-2deg]">
                <img
                  src={MASCOTS.suspicious_bestie.image}
                  alt="Suspicious Bestie"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-white/20"
                />
                <div>
                  <p className="text-[11px] font-black text-white leading-tight">Suspicious Bestie</p>
                  <p className="text-[10px] text-[#ccff00] font-mono">"Investigating your loyalty"</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
