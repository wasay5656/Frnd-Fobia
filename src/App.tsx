import React, { useEffect, useState } from 'react';
import { testConnection } from './services/firebase';
import { fetchChallengeApi } from './services/challengeService';
import { Challenge, SubmissionResultResponse } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MascotShowcase } from './components/MascotShowcase';
import { ChallengePreview } from './components/ChallengePreview';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { AdSenseBanner } from './components/AdSenseBanner';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { FriendQuizView } from './components/FriendQuizView';
import { QuizResultsView } from './components/QuizResultsView';
import { CreatorDashboard } from './components/CreatorDashboard';
import { MyChallengesModal } from './components/MyChallengesModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & View State
  const [currentSection, setCurrentSection] = useState<'home' | 'how-it-works' | 'mascots' | 'about'>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMyQuizzesOpen, setIsMyQuizzesOpen] = useState(false);

  // Active Friend Quiz Mode
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Challenge | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Results State
  const [quizResult, setQuizResult] = useState<SubmissionResultResponse | null>(null);
  const [submittedFriendName, setSubmittedFriendName] = useState<string>('');

  // Active Dashboard Mode
  const [activeDashboard, setActiveDashboard] = useState<{
    challengeId: string;
    creatorKey: string;
  } | null>(null);

  // Initial Boot Connection Test and URL Parameter Routing
  useEffect(() => {
    testConnection();

    const params = new URLSearchParams(window.location.search);
    const quizParam = params.get('quiz');
    const dashboardParam = params.get('dashboard');
    const keyParam = params.get('key');

    if (dashboardParam && keyParam) {
      setActiveDashboard({ challengeId: dashboardParam, creatorKey: keyParam });
    } else if (quizParam) {
      loadQuiz(quizParam);
    }
  }, []);

  const loadQuiz = async (id: string) => {
    setActiveQuizId(id);
    setQuizLoading(true);
    setQuizError(null);
    setQuizResult(null);

    try {
      const challenge = await fetchChallengeApi(id);
      setActiveQuiz(challenge);
    } catch (err: any) {
      setQuizError(err.message || 'Could not load challenge. It may have expired or been removed.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleOpenDashboard = (challengeId: string, creatorKey: string) => {
    setActiveDashboard({ challengeId, creatorKey });
    setActiveQuizId(null);
    setQuizResult(null);
    window.history.pushState({}, '', `?dashboard=${challengeId}&key=${creatorKey}`);
  };

  const handleReturnHome = () => {
    setActiveQuizId(null);
    setActiveQuiz(null);
    setQuizResult(null);
    setActiveDashboard(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (section: 'home' | 'how-it-works' | 'mascots' | 'about') => {
    setCurrentSection(section);
    if (activeQuizId || activeDashboard || quizResult) {
      handleReturnHome();
    }

    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'mascots') {
      const el = document.getElementById('mascots');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-slate-100 flex flex-col selection:bg-[#ccff00] selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        onCreateClick={() => setIsCreateModalOpen(true)}
        onMyQuizzesClick={() => setIsMyQuizzesOpen(true)}
        onNavigate={handleNavigation}
        currentSection={currentSection}
      />

      <main className="flex-1">
        
        {/* VIEW 1: CREATOR DASHBOARD VIEW */}
        {activeDashboard ? (
          <CreatorDashboard
            challengeId={activeDashboard.challengeId}
            creatorKey={activeDashboard.creatorKey}
            onBackToHome={handleReturnHome}
            onCreateNew={() => {
              setActiveDashboard(null);
              setIsCreateModalOpen(true);
            }}
          />
        ) : quizResult && activeQuiz ? (
          /* VIEW 2: QUIZ RESULTS VIEW */
          <QuizResultsView
            creatorName={activeQuiz.creatorName}
            friendName={submittedFriendName}
            result={quizResult}
            onCreateOwn={() => {
              setQuizResult(null);
              setActiveQuizId(null);
              setIsCreateModalOpen(true);
            }}
            onRetake={() => {
              setQuizResult(null);
            }}
          />
        ) : activeQuizId ? (
          /* VIEW 3: FRIEND QUIZ TAKER EXPERIENCE */
          <div className="py-8">
            {quizLoading ? (
              <div className="max-w-md mx-auto py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#ccff00] border-2 border-black flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <span className="font-display font-black text-black text-xl">FF</span>
                </div>
                <h3 className="font-display font-black text-2xl text-white">LOADING FRIENDSHIP TEST...</h3>
                <p className="text-xs font-mono text-[#ccff00] mt-1 font-bold">Summoning questions & vibe check auditors</p>
              </div>
            ) : quizError || !activeQuiz ? (
              <div className="max-w-md mx-auto py-16 px-4 text-center">
                <div className="p-4 rounded-2xl bg-black border-2 border-[#ff1493] text-[#ff1493] text-sm font-bold mb-4">
                  {quizError || 'This challenge is no longer available.'}
                </div>
                <button
                  onClick={handleReturnHome}
                  className="neo-btn-lime px-6 py-2.5 rounded-xl text-xs uppercase font-black"
                >
                  Go to Homepage
                </button>
              </div>
            ) : (
              <FriendQuizView
                challenge={activeQuiz}
                onSubmitted={(result, friend) => {
                  setSubmittedFriendName(friend);
                  setQuizResult(result);
                }}
                onCreateOwn={() => {
                  setActiveQuizId(null);
                  setIsCreateModalOpen(true);
                }}
              />
            )}
          </div>
        ) : (
          /* VIEW 4: MAIN HOMEPAGE LANDING EXPERIENCE */
          <>
            <Hero
              onCreateClick={() => setIsCreateModalOpen(true)}
              onHowItWorksClick={() => handleNavigation('how-it-works')}
            />

            {/* Reserved Monetization Ad Slot on Homepage */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSenseBanner slotId="1122334455" format="horizontal" />
            </div>

            <MascotShowcase />

            <ChallengePreview />

            <HowItWorks />

            <AboutSection />
          </>
        )}

      </main>

      {/* Footer with working Privacy, Terms, and Contact modals */}
      <Footer
        onNavigate={handleNavigation}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {/* Create Challenge Step-by-Step Modal */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOpenDashboard={handleOpenDashboard}
      />

      {/* My Saved Quizzes & Dashboards Modal */}
      <MyChallengesModal
        isOpen={isMyQuizzesOpen}
        onClose={() => setIsMyQuizzesOpen(false)}
        onOpenDashboard={handleOpenDashboard}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />

    </div>
  );
}
