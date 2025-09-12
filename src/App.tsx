import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MainHub } from './components/MainHub';
import { AssessmentScreen } from './components/AssessmentScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { User, Assessment } from './types';
import { faker } from '@faker-js/faker';
import './App.css';

type AppState = 'welcome' | 'onboarding' | 'hub' | 'assessment' | 'leaderboard' | 'profile';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [user, setUser] = useState<User | null>(null);

  // Simulate Firebase environment variables
  const firebaseConfig = {
    __app_id: 'khel-pratiyogita-app',
    __firebase_config: JSON.stringify({
      apiKey: 'demo-api-key',
      authDomain: 'khel-pratiyogita.firebaseapp.com',
      projectId: 'khel-pratiyogita',
      storageBucket: 'khel-pratiyogita.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:demo-app-id'
    }),
    __initial_auth_token: 'demo-auth-token'
  };

  useEffect(() => {
    // Simulate checking for existing user session
    const savedUser = localStorage.getItem('khel-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt)
        });
        setAppState('hub');
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('khel-user');
      }
    }

    // Simulate Firebase initialization
    console.log('Firebase Config:', firebaseConfig);
  }, []);

  const handleOnboardingComplete = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: faker.string.uuid(),
      createdAt: new Date()
    };
    
    setUser(newUser);
    
    // Simulate saving to Firebase/localStorage
    localStorage.setItem('khel-user', JSON.stringify(newUser));
    
    setAppState('hub');
    
    // Simulate Firebase analytics
    console.log('User registered:', newUser.id);
  };

  const handleAssessmentComplete = (assessment: Assessment) => {
    if (!user) return;

    // Update user stats
    const updatedUser: User = {
      ...user,
      skillPoints: user.skillPoints + assessment.skillPoints,
      coins: user.coins + assessment.coins,
      // Simulate leveling up
      level: Math.floor((user.skillPoints + assessment.skillPoints) / 1000) + 1
    };

    setUser(updatedUser);
    localStorage.setItem('khel-user', JSON.stringify(updatedUser));
    
    // Simulate saving assessment to Firebase
    console.log('Assessment completed:', assessment);
    
    setAppState('hub');
  };

  // Render loading state only for screens that require an authenticated user
  const requiresUser = appState === 'hub' || appState === 'assessment' || appState === 'leaderboard' || appState === 'profile';
  if (requiresUser && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {appState === 'welcome' && (
        <WelcomeScreen onGetStarted={() => setAppState('onboarding')} />
      )}
      
      {appState === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      {appState === 'hub' && user && (
        <MainHub 
          user={user}
          onAssess={() => setAppState('assessment')}
          onCompete={() => setAppState('leaderboard')}
          onProfile={() => setAppState('profile')}
        />
      )}
      
      {appState === 'assessment' && user && (
        <AssessmentScreen 
          user={user}
          onBack={() => setAppState('hub')}
          onComplete={handleAssessmentComplete}
        />
      )}
      
      {appState === 'leaderboard' && user && (
        <LeaderboardScreen 
          user={user}
          onBack={() => setAppState('hub')}
        />
      )}
      
      {appState === 'profile' && user && (
        <ProfileScreen 
          user={user}
          onBack={() => setAppState('hub')}
        />
      )}
    </>
  );
}

export default App;
