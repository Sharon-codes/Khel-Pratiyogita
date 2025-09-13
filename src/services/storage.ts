import { z } from 'zod';
import { UserProfile, UserProfileSchema, TestAttempt, TestAttemptSchema, SCHEMA_VERSION } from '@/types';

const log = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[Storage] ${message}`, data);
  }
};

class StorageService {
  private readonly USER_KEY = 'khel_user_profile';
  private readonly ATTEMPTS_KEY = 'khel_test_attempts';
  private readonly LEADERBOARD_KEY = 'khel_leaderboard';

  // User profile management
  saveUserProfile(user: UserProfile): void {
    try {
      const validated = UserProfileSchema.parse(user);
      localStorage.setItem(this.USER_KEY, JSON.stringify(validated));
      log('User profile saved', validated.name);
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw new Error('Invalid user profile data');
    }
  }

  getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Handle schema migrations
      if (!parsed.schemaVersion || parsed.schemaVersion < SCHEMA_VERSION) {
        const migrated = this.migrateUserProfile(parsed);
        this.saveUserProfile(migrated);
        return migrated;
      }

      return UserProfileSchema.parse(parsed);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      this.clearUserProfile();
      return null;
    }
  }

  clearUserProfile(): void {
    localStorage.removeItem(this.USER_KEY);
    log('User profile cleared');
  }

  // Test attempts management
  saveTestAttempt(attempt: TestAttempt): void {
    try {
      const validated = TestAttemptSchema.parse(attempt);
      const attempts = this.getAllTestAttempts();
      const existingIndex = attempts.findIndex(a => a.id === attempt.id);
      
      if (existingIndex >= 0) {
        attempts[existingIndex] = validated;
      } else {
        attempts.push(validated);
      }
      
      localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
      log('Test attempt saved', attempt.id);
    } catch (error) {
      console.error('Failed to save test attempt:', error);
      throw new Error('Invalid test attempt data');
    }
  }

  getTestAttempt(id: string): TestAttempt | null {
    const attempts = this.getAllTestAttempts();
    return attempts.find(a => a.id === id) || null;
  }

  getAllTestAttempts(): TestAttempt[] {
    try {
      const data = localStorage.getItem(this.ATTEMPTS_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return z.array(TestAttemptSchema).parse(parsed);
    } catch (error) {
      console.error('Failed to load test attempts:', error);
      localStorage.removeItem(this.ATTEMPTS_KEY);
      return [];
    }
  }

  removeTestAttempt(id: string): void {
    const attempts = this.getAllTestAttempts().filter(a => a.id !== id);
    localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
    log('Test attempt removed', id);
  }

  // Leaderboard management
  saveLeaderboardData(sportId: string, entries: any[]): void {
    try {
      const allData = this.getAllLeaderboardData();
      allData[sportId] = entries;
      localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(allData));
      log('Leaderboard data saved', sportId);
    } catch (error) {
      console.error('Failed to save leaderboard data:', error);
    }
  }

  getLeaderboardData(sportId: string): any[] {
    try {
      const allData = this.getAllLeaderboardData();
      return allData[sportId] || [];
    } catch (error) {
      console.error('Failed to load leaderboard data:', error);
      return [];
    }
  }

  private getAllLeaderboardData(): Record<string, any[]> {
    try {
      const data = localStorage.getItem(this.LEADERBOARD_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  // Schema migration
  private migrateUserProfile(oldProfile: any): UserProfile {
    log('Migrating user profile from older version');
    
    const migrated = {
      ...oldProfile,
      schemaVersion: SCHEMA_VERSION,
      xp: oldProfile.skillPoints || 0,
      personalBests: oldProfile.personalBests || {},
      totalAssessments: oldProfile.totalAssessments || 0,
      questsCompleted: oldProfile.questsCompleted || 0,
      lastActiveDate: oldProfile.lastActiveDate || new Date().toISOString()
    };

    // Remove old fields
    delete migrated.skillPoints;
    
    return UserProfileSchema.parse(migrated);
  }

  // Utility methods
  clearAllData(): void {
    localStorage.clear();
    log('All data cleared');
  }

  exportData(): string {
    const data = {
      user: this.getUserProfile(),
      attempts: this.getAllTestAttempts(),
      leaderboard: this.getAllLeaderboardData(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }
}

export const storage = new StorageService();
