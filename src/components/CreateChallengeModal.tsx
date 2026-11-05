import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Share2,
  Sparkles,
  Clock,
  PlusCircle,
  HelpCircle,
  Trophy,
  ExternalLink,
  Flame,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { QUESTION_BANK } from '../data/questionBank';
import { createChallengeApi } from '../services/challengeService';
import { Question, Challenge } from '../types';
import { MASCOTS, MASCOT_LIST } from '../data/mascots';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: (challengeId: string, creatorKey: string) => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
}) => {
  // Steps: 1: Name & Mascot, 2: Select 5 Questions, 3: Set Answers, 4: Lifespan & Preview, 5: Share
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [creatorName, setCreatorName] = useState('');
  const [selectedMascotId, setSelectedMascotId] = useState('the_savage');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>(
    QUESTION_BANK.slice(0, 5)
  );
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [durationHours, setDurationHours] = useState<24 | 48>(24);

  // Custom question editing state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customOptions, setCustomOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);

  // Loading & Submission Result
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdChallenge, setCreatedChallenge] = useState<Challenge | null>(null);
  const [creatorKey, setCreatorKey] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleToggleQuestion = (q: Question) => {
    const exists = selectedQuestions.some((item) => item.id === q.id);
    if (exists) {
      if (selectedQuestions.length <= 1) return; // Keep at least one
      setSelectedQuestions(selectedQuestions.filter((item) => item.id !== q.id));
    } else {
      if (selectedQuestions.length >= 5) {
        // Swap last question
        setSelectedQuestions([...selectedQuestions.slice(0, 4), q]);
      } else {
        setSelectedQuestions([...selectedQuestions, q]);
      }
    }
  };

  const handleAddCustomQuestion = () => {
    if (!customQuestionText.trim()) return;
    if (customOptions.some((opt) => !opt.trim())) return;

    const newQ: Question = {
      id: `custom_${Date.now()}`,
      text: customQuestionText.trim(),
      options: [
        customOptions[0].trim(),
        customOptions[1].trim(),
        customOptions[2].trim(),
        customOptions[3].trim(),
      ],
      category: 'Custom',
      emoji: '✨',
    };

    if (selectedQuestions.length >= 5) {
      setSelectedQuestions([...selectedQuestions.slice(0, 4), newQ]);
    } else {
      setSelectedQuestions([...selectedQuestions, newQ]);
    }

    setCustomQuestionText('');
    setCustomOptions(['', '', '', '']);
    setIsAddingCustom(false);
  };

  const handleSetAnswer = (qIndex: number, optionIndex: number) => {
    const updated = [...correctAnswers];
    updated[qIndex] = optionIndex;
    setCorrectAnswers(updated);
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await createChallengeApi({
        creatorName: creatorName.trim(),
        questions: selectedQuestions,
        correctOptionIndices: correctAnswers,
        durationHours,
      });

      setCreatedChallenge(res.challenge);
      setCreatorKey(res.creatorKey);
      setStep(5);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#CCFF00', '#FF1493', '#3B82F6', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create challenge.');
    } finally {
      setLoading(false);
    }
  };

  const getShareUrl = () => {
    if (!createdChallenge) return window.location.href;
    const base = window.location.origin;
    return `${base}?quiz=${createdChallenge.id}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(
      `😈 Think you REALLY know me? I created my official FRND FOBIA challenge!\n\nTake the 5-question test and let's see if you're a real bestie or a total fraud:\n👉 ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FRND FOBIA: How well do you know ${creatorName}?`,
          text: `Take ${creatorName}'s savage 5-question friendship quiz and prove your score!`,
          url,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border-3 border-black rounded-3xl shadow-[8px_8px_0px_0px_#ccff00] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b-2 border-white/10 flex items-center justify-between shrink-0 bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#ccff00] animate-ping" />
            <h3 className="font-display font-black text-lg text-white tracking-wide">
              CREATE FRND FOBIA CHALLENGE
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Bar */}
        <div className="w-full bg-[#1a1a1a] h-2 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#ccff00] via-[#ff1493] to-[#3b82f6] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Indicator Header */}
        <div className="px-6 py-2.5 bg-black border-b border-white/10 flex items-center justify-between text-xs font-mono font-bold text-slate-300 shrink-0">
          <span className="text-[#ccff00]">STEP {step} OF 5</span>
          <span className="text-white">
            {step === 1 && 'CREATOR NICKNAME & MASCOT'}
            {step === 2 && `PICK 5 QUESTIONS (${selectedQuestions.length}/5)`}
            {step === 3 && 'CHOOSE YOUR SECRET TRUTH'}
            {step === 4 && 'LIFESPAN & FINAL PREVIEW'}
            {step === 5 && 'VIRAL SHARE READY'}
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0c0c0c]">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-black border-2 border-[#ff1493] text-[#ff1493] text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Name and Mascot Selection */}
          {step === 1 && (
            <div className="space-y-6 py-2">
              <div className="text-center max-w-md mx-auto">
                <h4 className="font-display font-black text-2xl sm:text-3xl text-white">
                  WHAT'S YOUR NICKNAME?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                  This will be stamped on your quiz and leaderboard.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#ccff00] mb-2">
                    Your Nickname
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="e.g. Jordan, Maya, Big Boss..."
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#141414] border-2 border-white/30 focus:border-[#ccff00] focus:outline-none text-white font-bold text-base placeholder:text-slate-500 shadow-[3px_3px_0px_0px_#000]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#ff1493] mb-2">
                    Choose Your Mascot Auditor
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MASCOT_LIST.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMascotId(m.id)}
                        className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                          selectedMascotId === m.id
                            ? 'bg-[#181818] border-[#ccff00] shadow-[4px_4px_0px_0px_#ccff00]'
                            : 'bg-[#121212] border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={m.image}
                          alt={m.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover border border-white/20 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-display font-black text-xs text-white truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{m.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select 5 Questions */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-white/10">
                <div>
                  <h4 className="font-display font-black text-xl text-white">
                    SELECT 5 QUESTIONS ({selectedQuestions.length}/5)
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">
                    Pick 5 savage questions or tap customize to write your own!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(!isAddingCustom)}
                  className="px-3.5 py-2 rounded-xl bg-black border-2 border-[#ccff00] text-xs font-black text-[#ccff00] flex items-center gap-1.5 self-start cursor-pointer hover:bg-[#ccff00] hover:text-black transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isAddingCustom ? 'Cancel Custom' : 'Add Custom Question'}</span>
                </button>
              </div>

              {/* Add Custom Question Form */}
              {isAddingCustom && (
                <div className="p-4 rounded-2xl bg-[#141414] border-2 border-[#ff1493] space-y-3 shadow-[4px_4px_0px_0px_#ff1493]">
                  <h5 className="font-black text-sm text-[#ff1493] flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Create Your Custom Question</span>
                  </h5>
                  <input
                    type="text"
                    placeholder="e.g. What is my secret guilty pleasure?"
                    value={customQuestionText}
                    onChange={(e) => setCustomQuestionText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border-2 border-white/20 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((optIdx) => (
                      <input
                        key={optIdx}
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={customOptions[optIdx]}
                        onChange={(e) => {
                          const updated = [...customOptions] as [string, string, string, string];
                          updated[optIdx] = e.target.value;
                          setCustomOptions(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-black border-2 border-white/20 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomQuestion}
                    className="w-full py-2.5 rounded-xl bg-[#ccff00] text-black font-black text-xs uppercase cursor-pointer border-2 border-black"
                  >
                    Save & Include Custom Question
                  </button>
                </div>
              )}

              {/* Question Bank List */}
              <div className="space-y-2.5">
                {QUESTION_BANK.map((q) => {
                  const isSelected = selectedQuestions.some((item) => item.id === q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleToggleQuestion(q)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-black border-[#ccff00] shadow-[4px_4px_0px_0px_#ccff00]'
                          : 'bg-[#141414] border-white/10 hover:border-white/30 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{q.emoji || '💬'}</span>
                        <div>
                          <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {q.text}
                          </p>
                          <span className="text-[10px] font-mono font-bold text-[#ff1493] uppercase">
                            {q.category} · 4 Choices
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${
                          isSelected
                            ? 'bg-[#ccff00] border-black text-black'
                            : 'border-white/30 bg-black'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Pick Creator's Secret Truth */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-white/10">
                <h4 className="font-display font-black text-xl text-white">
                  PICK YOUR SECRET ANSWERS
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Tap the option that represents the REAL you for each question. Answers are sealed on the cloud server!
                </p>
              </div>

              <div className="space-y-6">
                {selectedQuestions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-[#141414] border-2 border-white/20 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#ccff00] text-black font-black text-xs flex items-center justify-center shrink-0 border border-black">
                        {qIdx + 1}
                      </span>
                      <h5 className="font-bold text-sm text-white">{q.text}</h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = correctAnswers[qIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSetAnswer(qIdx, optIdx)}
                            className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isChosen
                                ? 'bg-black border-[#ff1493] text-[#ff1493] shadow-[3px_3px_0px_0px_#ff1493]'
                                : 'bg-black border-white/10 hover:border-white/30 text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isChosen && <CheckCircle2 className="w-4 h-4 text-[#ff1493] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Lifespan & Final Preview */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-black text-xl text-white">
                  CHALLENGE LIFESPAN & REVIEW
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Set how long your friends have before this challenge expires.
                </p>
              </div>

              {/* Expiration Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDurationHours(24)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    durationHours === 24
                      ? 'bg-black border-[#ccff00] shadow-[5px_5px_0px_0px_#ccff00]'
                      : 'bg-[#141414] border-white/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-white">24 Hours</span>
                    <Clock className="w-4 h-4 text-[#ccff00]" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Standard 1-Day Flash Rush (Recommended)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDurationHours(48)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    durationHours === 48
                      ? 'bg-black border-[#ff1493] shadow-[5px_5px_0px_0px_#ff1493]'
                      : 'bg-[#141414] border-white/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-white">48 Hours</span>
                    <Clock className="w-4 h-4 text-[#ff1493]" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Extended 2-Day Weekend Test</p>
                </button>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#141414] border-2 border-white/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Creator:</span>
                  <span className="font-black text-white">{creatorName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Questions Count:</span>
                  <span className="font-black text-[#ccff00]">5 Questions Selected</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Auditor Mascot:</span>
                  <span className="font-black text-[#ff1493]">
                    {MASCOTS[selectedMascotId]?.name || 'The Savage'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Server Security:</span>
                  <span className="font-black text-[#ccff00]">Zero-Trust Firestore Protected</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Viral Share */}
          {step === 5 && createdChallenge && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-[#ccff00] border-2 border-black p-0.5 mx-auto flex items-center justify-center shadow-[5px_5px_0px_0px_#ff1493]">
                <Sparkles className="w-8 h-8 text-black" />
              </div>

              <div>
                <h4 className="font-display font-black text-2xl sm:text-3xl text-white">
                  CHALLENGE GENERATED! 🔥
                </h4>
                <p className="text-sm text-slate-300 mt-1 max-w-sm mx-auto font-medium">
                  Your quiz is live! Share this link to WhatsApp, Instagram Story, or group chats.
                </p>
              </div>

              {/* Share URL Box */}
              <div className="p-3.5 rounded-2xl bg-black border-2 border-white/30 flex items-center justify-between gap-3 text-left">
                <p className="text-xs font-mono text-[#ccff00] truncate flex-1">
                  {getShareUrl()}
                </p>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-xl bg-[#ccff00] text-black font-black text-xs uppercase flex items-center gap-1.5 shrink-0 cursor-pointer border border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Share Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-sm flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_#000] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="neo-btn-pink w-full py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Anywhere</span>
                </button>
              </div>

              {/* Creator Dashboard Access Banner */}
              <div className="p-4 rounded-2xl bg-[#141414] border-2 border-[#3b82f6] text-left space-y-2 shadow-[4px_4px_0px_0px_#2563eb]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#ccff00]" />
                    <span className="font-black text-xs text-white">Your Live Creator Dashboard</span>
                  </div>
                  <span className="text-[10px] text-blue-300 font-bold px-2 py-0.5 rounded bg-blue-900/40 border border-blue-600">
                    Saved to this device
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Watch live attempts, see average scores, and inspect individual breakdowns anytime.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (creatorKey) {
                      onOpenDashboard(createdChallenge.id, creatorKey);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  <span>Open Creator Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 border-t-2 border-white/10 bg-[#141414] flex items-center justify-between shrink-0">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <button
              type="button"
              disabled={!creatorName.trim()}
              onClick={() => setStep(2)}
              className="neo-btn-lime ml-auto px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <span>Next: Pick Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              disabled={selectedQuestions.length !== 5}
              onClick={() => setStep(3)}
              className="neo-btn-lime ml-auto px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <span>Next: Choose Your Truth ({selectedQuestions.length}/5)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={() => setStep(4)}
              className="neo-btn-lime ml-auto px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Review & Expiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateLink}
              className="neo-btn-lime ml-auto px-8 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{loading ? 'Creating...' : 'GENERATE MY LINK'}</span>
            </button>
          )}

          {step === 5 && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
