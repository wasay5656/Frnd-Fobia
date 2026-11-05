import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Challenge, SubmissionResultResponse } from '../types';
import { submitChallengeApi } from '../services/challengeService';
import { MASCOTS } from '../data/mascots';

interface FriendQuizViewProps {
  challenge: Challenge;
  onSubmitted: (result: SubmissionResultResponse, friendName: string) => void;
  onCreateOwn: () => void;
}

export const FriendQuizView: React.FC<FriendQuizViewProps> = ({
  challenge,
  onSubmitted,
  onCreateOwn,
}) => {
  const [friendName, setFriendName] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([-1, -1, -1, -1, -1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check expiration
  const isExpired =
    challenge.status === 'expired' || new Date() > new Date(challenge.expiresAt);

  const currentQ = challenge.questions[currentQuestionIdx];
  const progressPercent = Math.round(((currentQuestionIdx + 1) / 5) * 100);

  // Pick a dynamic mascot per question to keep the vibe fresh
  const mascotKeys = ['suspicious_bestie', 'the_savage', 'drama_queen', 'the_chill_one', 'the_savage'];
  const currentMascot = MASCOTS[mascotKeys[currentQuestionIdx]] || MASCOTS.the_savage;

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIdx] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestionIdx] === -1) return;
    if (currentQuestionIdx < 4) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswers.some((ans) => ans === -1)) {
      setSubmitError('Please answer all 5 questions before submitting!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitChallengeApi(challenge.id, {
        friendName: friendName.trim(),
        selectedAnswers,
      });

      onSubmitted(result, friendName.trim());
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isExpired) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-black border-2 border-[#ff1493] flex items-center justify-center mx-auto mb-4 text-[#ff1493] shadow-[4px_4px_0px_0px_#ff1493]">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-3xl text-white">
          THIS CHALLENGE HAS EXPIRED ⏳
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto font-medium">
          {challenge.creatorName}'s challenge ran out of time. Don't worry, you can create your own test and challenge them back right now!
        </p>
        <button
          onClick={onCreateOwn}
          className="neo-btn-lime mt-6 px-8 py-3.5 rounded-2xl text-sm uppercase tracking-wider cursor-pointer"
        >
          CREATE YOUR OWN CHALLENGE
        </button>
      </div>
    );
  }

  // Pre-Quiz Nickname Entry Step
  if (!started) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-[#121212] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#ccff00] text-center relative overflow-hidden">
          
          {/* Mascot Header Avatar */}
          <div className="w-20 h-20 rounded-2xl border-2 border-black overflow-hidden mx-auto mb-4 shadow-[4px_4px_0px_0px_#ff1493] bg-black">
            <img
              src={MASCOTS.suspicious_bestie.image}
              alt="Suspicious Bestie"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-[#ccff00] text-xs font-black text-[#ccff00] mb-3 uppercase">
            <Flame className="w-3.5 h-3.5 text-[#ff1493]" />
            <span>FRIENDSHIP AUDIT INCOMING</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight">
            CAN YOU SURVIVE <br />
            <span className="text-[#ccff00] bg-black px-2 py-0.5 inline-block border border-black shadow-[3px_3px_0px_0px_#ff1493] mt-1">
              {challenge.creatorName.toUpperCase()}'S
            </span>{' '}
            TEST?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-sm mx-auto font-medium">
            {challenge.creatorName} selected 5 savage questions to see who really pays attention. Your final score will be posted to their live leaderboard!
          </p>

          <div className="mt-8 text-left space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#ccff00] mb-1.5">
                Enter Your Nickname
              </label>
              <input
                type="text"
                maxLength={30}
                placeholder="What do they call you?"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-black border-2 border-white/30 focus:border-[#ccff00] focus:outline-none text-white font-bold text-base placeholder:text-slate-500 shadow-[3px_3px_0px_0px_#000]"
                autoFocus
              />
            </div>

            <button
              disabled={!friendName.trim()}
              onClick={() => setStarted(true)}
              className="neo-btn-lime w-full py-4 rounded-2xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>START FRIENDSHIP TEST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span>5 Questions</span>
            <span>·</span>
            <span>Server Sealed</span>
            <span>·</span>
            <span>Live Scoreboard</span>
          </div>
        </div>
      </div>
    );
  }

  // Active Question Card Step (1 of 5)
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      
      {/* Top Header & Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-mono font-bold">
          <span className="text-[#ccff00]">QUESTION {currentQuestionIdx + 1} OF 5</span>
          <span className="text-[#ff1493]">{progressPercent}% COMPLETED</span>
        </div>
        <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-white/20">
          <div
            className="h-full bg-gradient-to-r from-[#ccff00] via-[#ff1493] to-[#3b82f6] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card with Y2K Neo-brutalist Styling */}
      <div className="bg-[#121212] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#ccff00]">
        
        {submitError && (
          <div className="mb-4 p-3 rounded-xl bg-black border-2 border-[#ff1493] text-[#ff1493] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ff1493]" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Mascot Mood Indicator */}
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
          <img
            src={currentMascot.image}
            alt={currentMascot.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-lg object-cover border border-white/20"
          />
          <span className="text-xs font-mono font-bold text-slate-400">
            {currentMascot.name} is watching your answer 👀
          </span>
        </div>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-wider font-black text-[#ff1493] block mb-1">
            Testing your knowledge of {challenge.creatorName}
          </span>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
            {currentQ.text}
          </h3>
        </div>

        {/* 4 Choices */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQuestionIdx] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-[56px] p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-black border-[#ccff00] text-[#ccff00] shadow-[4px_4px_0px_0px_#ccff00] ring-1 ring-[#ccff00]'
                    : 'bg-[#181818] border-white/20 hover:border-white/50 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 border-2 ${
                      isSelected
                        ? 'bg-[#ccff00] border-black text-black'
                        : 'border-white/30 bg-black text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-[#ccff00] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Controls: Back and Next / Submit */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          {currentQuestionIdx > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border-2 border-white/20 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentQuestionIdx < 4 ? (
            <button
              type="button"
              disabled={selectedAnswers[currentQuestionIdx] === -1}
              onClick={handleNext}
              className="neo-btn-lime ml-auto px-6 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={selectedAnswers[currentQuestionIdx] === -1 || isSubmitting}
              onClick={handleSubmit}
              className="neo-btn-pink ml-auto px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating Truth...' : 'Submit Answers 🚀'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
