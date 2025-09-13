import { create } from 'zustand';
import { AppState, AppScreen, UserProfile, TestSpec, TestAttempt, UserAvatar } from '@/types';
import { storage } from '@/services/storage';
import { defaultAvatar } from '@/data/avatars';

interface AppStore extends AppState {
  setScreen: (screen: AppScreen) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setError: (error: string | null) => void;
  setToast: (toast: string | null) => void;
  
  createUser: (userData: { name: string; abhaId?: string; avatar: UserAvatar; primarySport: string; selectedSports: string[] }) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => void;
  
  startAssessment: (spec: TestSpec) => void;
  completeAssessment: (attempt: TestAttempt) => void;
  finishAssessmentView: () => void;

  initialize: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentScreen: 'welcome',
  isLoading: true,
  user: null,
  activeTestSpec: null,
  lastAssessmentResult: null,
  error: null,
  toast: null,

  setScreen: (screen) => set({ currentScreen: screen }),
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  setToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => set({ toast: null }), 3000);
    }
  },

  createUser: async (userData) => {
    try {
      const user: UserProfile = {
        id: `user_${Date.now()}`,
        name: userData.name,
        abhaId: userData.abhaId,
        avatar: userData.avatar,
        primarySport: userData.primarySport,
        selectedSports: userData.selectedSports,
        level: 1,
        xp: 0,
        coins: 100,
        badges: [],
        streakDays: 0,
        personalBests: {},
        totalAssessments: 0,
        questsCompleted: 0,
        createdAt: new Date().toISOString(),
        skillTree: {},
        schemaVersion: 2,
      };

      storage.saveUserProfile(user);
      set({ user, currentScreen: 'hub' });
    } catch (error) {
      set({ error: 'Failed to create user profile' });
      throw error;
    }
  },

  updateUser: async (updates) => {
    const { user } = get();
    if (!user) throw new Error('No user to update');

    try {
      const updatedUser = { ...user, ...updates };
      storage.saveUserProfile(updatedUser);
      set({ user: updatedUser });
    } catch (error) {
      set({ error: 'Failed to update user profile' });
      throw error;
    }
  },

  signOut: () => {
    storage.clearAllData();
    set({
      user: null,
      currentScreen: 'welcome',
      activeTestSpec: null,
      lastAssessmentResult: null,
      error: null,
    });
  },
  
  startAssessment: (spec) => {
    set({ activeTestSpec: spec, currentScreen: 'assessment-arena' });
  },

  completeAssessment: (attempt) => {
    set({ lastAssessmentResult: attempt, currentScreen: 'assessment-results' });
  },
  
  finishAssessmentView: () => {
    set({ lastAssessmentResult: null, activeTestSpec: null, currentScreen: 'hub' });
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = storage.getUserProfile();
      if (user) {
        set({ user, currentScreen: 'hub' });
      } else {
        set({ currentScreen: 'welcome' });
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      set({ error: 'Failed to load app data', currentScreen: 'welcome' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
