import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Share2,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  MessageCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { SubmissionResultResponse } from '../types';
import { RESULT_CATEGORIES } from '../data/questionBank';
import { MASCOTS, Mascot } from '../data/mascots';
import { AdSenseBanner } from './AdSenseBanner';

interface QuizResultsViewProps {
  creatorName: string;
  friendName: string;
  result: SubmissionResultResponse;
  onCreateOwn: () => void;
  onRetake: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  creatorName,
  friendName,
  result,
  onCreateOwn,
  onRetake,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [cardDownloaded, setCardDownloaded] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    if (result.score >= 3) {
      try {
        confetti({
          particleCount: result.score === 5 ? 120 : 60,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#CCFF00', '#FF1493', '#3B82F6', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    }
  }, [result.score]);

  // Determine category & mascot
  let categoryTheme = RESULT_CATEGORIES.score0_1;
  let mascot: Mascot = MASCOTS.the_savage;

  if (result.score >= 5) {
    categoryTheme = RESULT_CATEGORIES.score5;
    mascot = MASCOTS.the_chill_one;
  } else if (result.score === 4) {
    categoryTheme = RESULT_CATEGORIES.score4;
    mascot = MASCOTS.drama_queen;
  } else if (result.score >= 2) {
    categoryTheme = RESULT_CATEGORIES.score2_3;
    mascot = MASCOTS.suspicious_bestie;
  } else {
    categoryTheme = RESULT_CATEGORIES.score0_1;
    mascot = MASCOTS.the_savage;
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `💀 I scored ${result.score}/5 (${result.percentage}%) on ${creatorName}'s FRND FOBIA quiz!\n` +
      `Verdict: "${result.resultCategory}"\n\n` +
      `Think you can beat my score? Test yourself here:\n${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FRND FOBIA Score: ${result.score}/5 on ${creatorName}'s Quiz`,
          text: `I just scored ${result.score}/5 on ${creatorName}'s friendship quiz! Verdict: ${result.resultCategory}`,
          url: window.location.origin,
        });
      } catch {
        handleCopyShare();
      }
    } else {
      handleCopyShare();
    }
  };

  const handleCopyShare = () => {
    const text = `I scored ${result.score}/5 on ${creatorName}'s FRND FOBIA test! "${result.resultCategory}" — ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // High-Resolution 9:16 Instagram Story / WhatsApp Status Card Generator in Y2K Aesthetic
  const generateStoryCard = () => {
    setGeneratingCard(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setGeneratingCard(false);
      return;
    }

    // 1. Deep Black Background
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Y2K Grid Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1080; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1920);
      ctx.stroke();
    }
    for (let y = 0; y < 1920; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // 3. Top Brand Wordmark Box
    ctx.fillStyle = '#CCFF00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(140, 120, 800, 140, 32);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 68px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('FRND FOBIA', 540, 215);

    // Subtitle sticker
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.roundRect(280, 290, 520, 70, 20);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('OFFICIAL FRIENDSHIP AUDIT', 540, 338);

    // 4. Central Score Card (Neo-brutalist)
    ctx.fillStyle = '#141414';
    ctx.strokeStyle = '#CCFF00';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(100, 420, 880, 1080, 48);
    ctx.fill();
    ctx.stroke();

    // Friend tested by Creator
    ctx.font = '700 38px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(`${friendName} tested by ${creatorName}`, 540, 500);

    // Massive Score
    ctx.font = '900 240px "Outfit", sans-serif';
    ctx.fillStyle = '#CCFF00';
    ctx.fillText(`${result.score}/5`, 540, 760);

    // Percentage
    ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(`${result.percentage}% ACCURACY`, 540, 860);

    // Result Category Badge
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(160, 930, 760, 140, 28);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FF1493';
    ctx.fillText(result.resultCategory, 540, 1018);

    // Mascot Speech / Message
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    const words = result.resultMessage.split(' ');
    let line1 = '';
    let line2 = '';
    words.forEach((w) => {
      if ((line1 + ' ' + w).length < 32) {
        line1 += ' ' + w;
      } else {
        line2 += ' ' + w;
      }
    });
    ctx.fillText(line1.trim(), 540, 1160);
    if (line2) {
      ctx.fillText(line2.trim(), 540, 1215);
    }

    // Question checkboxes
    for (let i = 0; i < 5; i++) {
      const isCorrect = result.answersBreakdown?.[i]?.isCorrect ?? false;
      const x = 270 + i * 135;
      const y = 1350;
      ctx.fillStyle = isCorrect ? '#CCFF00' : '#FF1493';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(isCorrect ? '✓' : '✗', x, y + 12);
    }

    // 5. Footer Call-to-action
    ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#CCFF00';
    ctx.fillText('NOW IT\'S YOUR TURN. EXPOSE YOUR FRIENDS!', 540, 1620);

    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Play free at frndfobia.com · No Sign-Up', 540, 1680);

    // Download image
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `FRND_FOBIA_${friendName}_Score_${result.score}of5.png`;
    link.href = dataUrl;
    link.click();

    setGeneratingCard(false);
    setCardDownloaded(true);
    setTimeout(() => setCardDownloaded(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      
      {/* Main Results Container with Y2K Neo-brutalist Styling */}
      <div className="bg-[#121212] border-3 border-black rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_#ccff00] text-center relative overflow-hidden">
        
        {/* Mascot Big Reaction Spotlight */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-3 border-black overflow-hidden shadow-[5px_5px_0px_0px_#ff1493] bg-black mb-3">
            <img
              src={mascot.image}
              alt={mascot.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-white/20 text-xs font-mono font-bold text-[#ccff00] uppercase">
            <span>AUDITED BY {mascot.name.toUpperCase()}</span>
          </div>

          {/* Mascot Speech Bubble Quote */}
          <div className="mt-3 p-3 rounded-2xl bg-black border-2 border-[#ff1493] text-xs sm:text-sm font-bold text-white max-w-md shadow-[3px_3px_0px_0px_#ff1493]">
            {categoryTheme.mascotQuote}
          </div>
        </div>

        {/* Giant Score Badge */}
        <div className="relative my-4">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto flex items-center justify-center p-1 bg-[#ccff00] border-3 border-black shadow-[6px_6px_0px_0px_#ff1493]">
            <div className="w-full h-full bg-black rounded-full flex flex-col items-center justify-center border border-black">
              <span className="font-display font-black text-4xl sm:text-6xl text-white">
                {result.score}
                <span className="text-xl sm:text-2xl text-[#ccff00] font-bold">/5</span>
              </span>
              <span className="text-[11px] font-mono font-black text-[#ff1493]">
                {result.percentage}% ACCURACY
              </span>
            </div>
          </div>
        </div>

        {/* Savage Category Verdict */}
        <div className="mt-6 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#ff1493] block mb-1">
            Friendship Vibe Check Verdict
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            {result.resultCategory}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed font-medium">
            {result.resultMessage}
          </p>
        </div>

        {/* Viral Share Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-sm flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_#000] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            <span>Share to WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="neo-btn-pink w-full py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
            <span>Share My Results</span>
          </button>
        </div>

        {/* Story Card PNG Generator Button */}
        <div className="mt-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={generateStoryCard}
            disabled={generatingCard}
            className="w-full py-3 rounded-xl bg-black hover:bg-[#1a1a1a] border-2 border-[#ccff00] text-[#ccff00] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#ccff00]"
          >
            <Download className="w-4 h-4" />
            <span>
              {generatingCard
                ? 'Rendering High-Res Story Card...'
                : cardDownloaded
                ? 'Story Card Downloaded! 📸'
                : 'Download Instagram & WhatsApp Story Card (PNG)'}
            </span>
          </button>
        </div>

        {/* Breakdown of Questions */}
        {result.answersBreakdown && result.answersBreakdown.length > 0 && (
          <div className="mt-10 pt-8 border-t-2 border-white/10 text-left">
            <h4 className="font-display font-black text-lg text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#ccff00]" />
              <span>How You Answered {creatorName}'s Truth</span>
            </h4>

            <div className="space-y-3">
              {result.answersBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 text-xs flex items-start justify-between gap-3 ${
                    item.isCorrect
                      ? 'bg-black border-[#ccff00] text-slate-200'
                      : 'bg-black border-[#ff1493] text-slate-200'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-sm text-white">{item.questionText}</p>
                    <p className="text-xs text-slate-400">
                      Your answer: <span className="font-bold text-white">{item.friendSelectedOption}</span>
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    {item.isCorrect ? (
                      <span className="px-2.5 py-1 rounded-md bg-[#ccff00] text-black font-black text-[10px] uppercase border border-black">
                        NAILED IT ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-[#ff1493] text-white font-black text-[10px] uppercase border border-black">
                        EXPOSED ✗
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIRAL ENGINE PROMINENT CTA: "NOW IT'S YOUR TURN. EXPOSE YOUR FRIENDS!" */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-black border-3 border-[#ccff00] text-center space-y-4 shadow-[6px_6px_0px_0px_#ff1493]">
          <div className="w-12 h-12 rounded-2xl bg-[#ccff00] border-2 border-black flex items-center justify-center mx-auto text-black shadow-[3px_3px_0px_0px_#000]">
            <Flame className="w-6 h-6 fill-black" />
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            NOW IT'S YOUR TURN. <br />
            <span className="text-[#ccff00]">EXPOSE YOUR FRIENDS!</span>
          </h3>

          <p className="text-sm text-slate-300 max-w-md mx-auto font-medium">
            Think {creatorName} knows you any better? Create your own 5-question challenge in 60 seconds and put them on the spot.
          </p>

          <button
            type="button"
            onClick={onCreateOwn}
            className="neo-btn-lime w-full sm:w-auto px-10 py-4 rounded-2xl text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            <span>CREATE YOUR CHALLENGE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Reserved AdSense Area */}
        <AdSenseBanner slotId="8899221100" format="horizontal" className="mt-8" />

      </div>
    </div>
  );
};
