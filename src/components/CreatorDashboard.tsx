import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Users,
  Percent,
  Clock,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Flame,
  Award,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { CreatorDashboardData } from '../types';
import { fetchCreatorDashboardApi } from '../services/challengeService';
import { MASCOTS } from '../data/mascots';

interface CreatorDashboardProps {
  challengeId: string;
  creatorKey: string;
  onBackToHome: () => void;
  onCreateNew: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  challengeId,
  creatorKey,
  onBackToHome,
  onCreateNew,
}) => {
  const [data, setData] = useState<CreatorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetchCreatorDashboardApi(challengeId, creatorKey);
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load creator dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // Auto-refresh every 20 seconds for live friend submissions
    const interval = setInterval(loadDashboard, 20000);
    return () => clearInterval(interval);
  }, [challengeId, creatorKey]);

  const getShareUrl = () => {
    return `${window.location.origin}?quiz=${challengeId}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `😈 How well do you REALLY know me? Take my FRND FOBIA quiz and try to top my leaderboard:\n${getShareUrl()}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading && !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#ccff00] border-2 border-black flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Sparkles className="w-7 h-7 text-black fill-black" />
        </div>
        <h3 className="font-display font-black text-2xl text-white">SYNCING CREATOR DASHBOARD...</h3>
        <p className="text-xs font-mono text-[#ccff00] mt-1 font-bold">Connecting to live Firestore scoreboard</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-2xl bg-black border-2 border-[#ff1493] text-[#ff1493] text-sm font-bold mb-4">
          {errorMsg || 'Could not load challenge dashboard.'}
        </div>
        <button
          onClick={onBackToHome}
          className="neo-btn-lime px-6 py-2.5 rounded-xl text-xs uppercase font-black"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const { challenge, attempts, stats } = data;
  const isExpired = new Date() > new Date(challenge.expiresAt);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2.5 rounded-xl bg-black border-2 border-white/20 text-slate-300 hover:text-white hover:border-[#ccff00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ccff00] animate-ping" />
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                {challenge.creatorName}'s Leaderboard
              </h1>
            </div>
            <p className="text-xs font-mono font-bold text-[#ccff00] mt-0.5">
              LIVE CREATOR DASHBOARD · AUTO-REFRESHING
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboard}
            className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#1e1e1e] border-2 border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ccff00]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onCreateNew}
            className="neo-btn-lime px-4 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
          >
            + New Quiz
          </button>
        </div>
      </div>

      {/* Share Header Strip with Y2K Box */}
      <div className="p-5 rounded-3xl bg-[#121212] border-3 border-black shadow-[6px_6px_0px_0px_#ccff00] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-black uppercase text-[#ccff00]">Your Live Challenge URL</span>
            {isExpired ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black text-[#ff1493] border border-[#ff1493]">
                EXPIRED
              </span>
            ) : (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black text-[#ccff00] border border-[#ccff00]">
                ACTIVE (ACCEPTING ATTEMPTS)
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-white truncate mt-1 max-w-md">
            {getShareUrl()}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleCopyLink}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-black hover:bg-[#1a1a1a] border-2 border-white/30 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#ccff00]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer border-2 border-black shadow-[3px_3px_0px_0px_#000]"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#ccff00]">
          <div className="flex items-center justify-between text-[#ccff00] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Total Attempts</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="font-display font-black text-3xl text-white">{stats.totalAttempts}</p>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">Friends Tested</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#ff1493]">
          <div className="flex items-center justify-between text-[#ff1493] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Average Score</span>
            <Percent className="w-4 h-4" />
          </div>
          <p className="font-display font-black text-3xl text-[#ff1493]">
            {stats.averageScore} / 5
          </p>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">Group Average</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#3b82f6]">
          <div className="flex items-center justify-between text-[#3b82f6] mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Highest Score</span>
            <Trophy className="w-4 h-4" />
          </div>
          <p className="font-display font-black text-3xl text-white">{stats.highestScore} / 5</p>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">Leaderboard Record</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border-2 border-black shadow-[4px_4px_0px_0px_#ffffff]">
          <div className="flex items-center justify-between text-white mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Perfect 5/5s</span>
            <Award className="w-4 h-4 text-[#ccff00]" />
          </div>
          <p className="font-display font-black text-3xl text-[#ccff00]">{stats.legendaryCount}</p>
          <span className="text-[11px] font-mono text-slate-400 mt-1 block">Certified Besties</span>
        </div>

      </div>

      {/* Leaderboard Table / Feed */}
      <div className="bg-[#121212] border-3 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_#ff1493]">
        
        <div className="p-5 sm:p-6 border-b-2 border-white/10 flex items-center justify-between bg-black">
          <div>
            <h3 className="font-display font-black text-lg text-white">FRIEND LEADERBOARD</h3>
            <p className="text-xs text-slate-400 font-mono">Ranked by score & accuracy</p>
          </div>
          <span className="text-xs font-mono font-black text-[#ccff00] px-2.5 py-1 rounded bg-[#181818] border border-white/20">
            {attempts.length} SUBMISSIONS
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-black border-2 border-[#ccff00] flex items-center justify-center mx-auto mb-3 shadow-[4px_4px_0px_0px_#ccff00]">
              <img
                src={MASCOTS.suspicious_bestie.image}
                alt="Suspicious Bestie"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover"
              />
            </div>
            <h4 className="font-display font-black text-xl text-white">NO FRIENDS HAVE ATTEMPTED YET!</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto font-medium">
              Share your challenge link to your WhatsApp Status, Instagram, or group chat to start collecting scores!
            </p>
            <button
              onClick={handleWhatsAppShare}
              className="mt-5 px-6 py-2.5 rounded-xl bg-[#25D366] text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
            >
              Share on WhatsApp Now
            </button>
          </div>
        ) : (
          <div className="divide-y-2 divide-white/10">
            {attempts.map((att, idx) => {
              const isTop = idx === 0 && att.score >= 4;
              return (
                <div
                  key={att.id || idx}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-black/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-xl font-display font-black text-xs flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
                        idx === 0
                          ? 'bg-[#ccff00] text-black'
                          : idx === 1
                          ? 'bg-[#ff1493] text-white'
                          : idx === 2
                          ? 'bg-[#3b82f6] text-white'
                          : 'bg-[#1e1e1e] text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-white">{att.friendName}</h4>
                        {isTop && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#ccff00] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                            👑 TOP BESTIE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {att.resultCategory} · {new Date(att.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-xl text-white">
                      {att.score}
                      <span className="text-xs text-[#ccff00] font-bold">/5</span>
                    </span>
                    <span className="block text-[10px] font-mono font-black text-[#ff1493]">
                      {att.percentage}% ACCURACY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
