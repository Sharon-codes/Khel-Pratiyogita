import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/appStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MainHub } from './components/MainHub';
import { AssessmentScreen } from './components/AssessmentScreen';
import { AssessmentArena } from './components/AssessmentArena';
import { AssessmentResults } from './components/AssessmentResults';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/common/BottomNav';

const App: React.FC = () => {
  const { currentScreen, isLoading, initialize, user, error, toast } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen />;
      case 'onboarding': return <OnboardingFlow />;
      case 'hub': return <MainHub />;
      case 'assessment': return <AssessmentScreen />;
      case 'assessment-arena': return <AssessmentArena />;
      case 'assessment-results': return <AssessmentResults />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <WelcomeScreen />;
    }
  };
  
  const showNav = user && ['hub', 'assessment', 'leaderboard', 'profile'].includes(currentScreen);

  return (
    <main className="bg-background min-h-screen">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg z-[100] shadow-lg text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={currentScreen} className="relative z-10">
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </main>
  );
};

export default App;
