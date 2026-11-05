import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { MASCOTS } from '../data/mascots';

const PREVIEW_QUESTIONS = [
  {
    title: "What's my biggest red flag? 🚩",
    mascotId: 'the_savage',
    options: [
      { text: "Takes 3 to 5 business days to reply", isSecretMatch: false, reaction: "Painfully true, but not my #1 😭" },
      { text: "Overthinking scenarios that never happen", isSecretMatch: true, reaction: "BINGO! You actually know my soul 🏆" },
      { text: "Starting drama then saying 'anyway'", isSecretMatch: false, reaction: "Nah I don't start drama, drama finds me 👀" },
      { text: "Believing I can fix toxic people", isSecretMatch: false, reaction: "Ouch. That was 2023 era 💀" },
    ]
  },
  {
    title: "What makes me angry instantly? 🤬",
    mascotId: 'suspicious_bestie',
    options: [
      { text: "Leaving me on 'Delivered' while active", isSecretMatch: true, reaction: "ACTUAL RAGE MODE ACTIVATED 🔥" },
      { text: "People walking 0.5x speed in hallways", isSecretMatch: false, reaction: "Annoying, but not the worst 🐢" },
      { text: "Cancelling plans at the last minute", isSecretMatch: false, reaction: "Honestly sometimes I'm secretly relieved 🛌" },
      { text: "Being told 'it's not that deep'", isSecretMatch: false, reaction: "It IS that deep though! 😤" },
    ]
  }
];

export const ChallengePreview: React.FC = () => {
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQ = PREVIEW_QUESTIONS[activeQIndex];
  const mascot = MASCOTS[currentQ.mascotId] || MASCOTS.the_savage;

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setActiveQIndex((prev) => (prev + 1) % PREVIEW_QUESTIONS.length);
  };

  return (
    <section className="py-14 sm:py-20 border-t-2 border-white/10 bg-[#090909]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-black text-[#ccff00] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE TEST DRIVE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            TRY IT YOURSELF
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto font-medium">
            Tap an answer below to test how our savage mascots evaluate your guess in real-time.
          </p>
        </div>

        {/* Y2K Neo-brutalist Quiz Card */}
        <div className="relative max-w-xl mx-auto bg-[#111111] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#ccff00]">
          
          {/* Card Top Strip with Mascot Avatar */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={mascot.image}
                alt={mascot.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl border border-white/20 object-cover"
              />
              <div>
                <span className="font-bold text-sm text-white block leading-tight">Alex's Challenge</span>
                <span className="text-[10px] font-mono text-[#ccff00] font-bold">Vibe Check Demo</span>
              </div>
            </div>

            <span className="font-mono text-xs font-bold px-2 py-1 bg-black border border-white/20 rounded-md text-[#ff1493]">
              Q{activeQIndex + 1} OF {PREVIEW_QUESTIONS.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="mt-6 mb-6">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#ff1493] block mb-1">
              Sample Question
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
              {currentQ.title}
            </h3>
          </div>

          {/* 4 Answer Choice Buttons */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              let style = "bg-[#181818] border-2 border-white/20 hover:border-[#ccff00] text-slate-200 hover:text-white";

              if (selectedOption !== null) {
                if (isChosen && opt.isSecretMatch) {
                  style = "bg-black border-2 border-[#ccff00] text-[#ccff00] shadow-[4px_4px_0px_0px_#ccff00]";
                } else if (isChosen && !opt.isSecretMatch) {
                  style = "bg-black border-2 border-[#ff1493] text-[#ff1493] shadow-[4px_4px_0px_0px_#ff1493]";
                } else if (opt.isSecretMatch) {
                  style = "bg-[#161616] border-2 border-[#ccff00]/40 text-[#ccff00]/70";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full min-h-[52px] p-3.5 sm:p-4 rounded-xl text-left font-bold text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black border border-white/30 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {selectedOption !== null && (
                    <span className="shrink-0">
                      {opt.isSecretMatch ? (
                        <CheckCircle2 className="w-5 h-5 text-[#ccff00]" />
                      ) : isChosen ? (
                        <XCircle className="w-5 h-5 text-[#ff1493]" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mascot Speech Bubble Roast Feedback */}
          {selectedOption !== null && (
            <div className="mt-6 p-4 rounded-2xl bg-black border-2 border-white/20 flex items-start gap-3 animate-fade-in shadow-[4px_4px_0px_0px_#ff1493]">
              <img
                src={mascot.image}
                alt={mascot.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/30"
              />
              <div className="flex-1">
                <span className="text-[10px] font-mono font-bold text-[#ff1493] uppercase block">
                  {mascot.name} says:
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  "{currentQ.options[selectedOption].reaction}"
                </p>
                <button
                  onClick={handleNext}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] text-black font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {selectedOption === null && (
            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400 font-mono italic">Tap an answer to see the reaction</span>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
