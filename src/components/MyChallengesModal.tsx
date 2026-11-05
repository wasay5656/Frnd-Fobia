import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Trophy, Clock, Trash2, Plus, Sparkles } from 'lucide-react';
import { getStoredCreatedChallenges, StoredChallengeRef } from '../services/challengeService';

interface MyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: (challengeId: string, creatorKey: string) => void;
  onCreateNew: () => void;
}

export const MyChallengesModal: React.FC<MyChallengesModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
  onCreateNew,
}) => {
  const [quizzes, setQuizzes] = useState<StoredChallengeRef[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuizzes(getStoredCreatedChallenges());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0c0c0c] border-3 border-black rounded-3xl shadow-[8px_8px_0px_0px_#ccff00] overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="px-6 py-4 border-b-2 border-white/10 flex items-center justify-between shrink-0 bg-[#141414]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ccff00]" />
            <h3 className="font-display font-black text-lg text-white">
              MY SAVED QUIZZES
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#0c0c0c]">
          {quizzes.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-black border-2 border-[#ccff00] flex items-center justify-center mx-auto text-[#ccff00] shadow-[3px_3px_0px_0px_#ccff00]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-display font-black text-lg text-white">No Quizzes Created Yet!</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto font-medium">
                Create your first FRND FOBIA challenge in 60 seconds and invite your besties.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="neo-btn-lime mt-2 px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map((q) => {
                const isExpired = new Date() > new Date(q.expiresAt);
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-[#141414] border-2 border-white/20 hover:border-[#ccff00] transition-all flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#000]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-white">{q.creatorName}'s Challenge</h4>
                        {isExpired ? (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black text-[#ff1493] border border-[#ff1493]">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black text-[#ccff00] border border-[#ccff00]">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                        Created {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenDashboard(q.id, q.creatorKey);
                      }}
                      className="px-3 py-2 rounded-xl bg-black hover:bg-[#1a1a1a] border border-[#ccff00] text-[#ccff00] hover:text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                    >
                      <span>Dashboard</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 border-t-2 border-white/10 bg-[#141414] flex justify-between items-center shrink-0">
          <button
            onClick={() => {
              onClose();
              onCreateNew();
            }}
            className="text-xs font-black text-[#ccff00] hover:text-white flex items-center gap-1 uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Another Quiz</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
