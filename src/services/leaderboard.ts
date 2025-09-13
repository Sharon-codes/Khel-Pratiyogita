import { LeaderboardEntry, UserProfile } from '@/types';
import { storage } from './storage';

// Deterministic seed generator for consistent "random" data
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  integer(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Pre-defined athlete names for consistent leaderboards
const ATHLETE_NAMES = [
  'Arjun Singh', 'Priya Sharma', 'Rahul Kumar', 'Sneha Patel', 'Vikram Reddy',
  'Anita Gupta', 'Rohit Agarwal', 'Kavya Iyer', 'Suresh Nair', 'Meera Joshi',
  'Amit Verma', 'Pooja Das', 'Kiran Rao', 'Deepak Shah', 'Ritu Bansal',
  'Ajay Mishra', 'Swati Kulkarni', 'Manish Tiwari', 'Neha Chopra', 'Sanjay Bhatt'
];

const AVATARS = ['🏃‍♂️', '🏃‍♀️', '🏋️‍♂️', '🏋️‍♀️', '🤸‍♂️', '🤸‍♀️', '🚴‍♂️', '🚴‍♀️'];

export class LeaderboardService {
  private generateDeterministicEntries(sportId: string, count: number = 50): LeaderboardEntry[] {
    const seed = this.hashString(sportId);
    const random = new SeededRandom(seed);
    
    const entries: LeaderboardEntry[] = [];
    
    for (let i = 0; i < count; i++) {
      const nameIndex = random.integer(0, ATHLETE_NAMES.length - 1);
      const avatarIndex = random.integer(0, AVATARS.length - 1);
      const baseScore = random.integer(60, 95);
      const variance = random.integer(-5, 5);
      
      entries.push({
        userId: `user_${sportId}_${i}`,
        username: ATHLETE_NAMES[nameIndex],
        avatar: AVATARS[avatarIndex],
        score: Math.max(0, Math.min(100, baseScore + variance)),
        rank: i + 1,
        sport: sportId,
        timestamp: new Date(Date.now() - random.integer(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
        isRival: false
      });
    }
    
    // Sort by score descending and assign ranks
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    return entries;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getLeaderboard(sportId: string, timeframe: 'weekly' | 'all-time' = 'all-time'): LeaderboardEntry[] {
    const cacheKey = `${sportId}_${timeframe}`;
    let entries = storage.getLeaderboardData(cacheKey);
    
    if (entries.length === 0) {
      entries = this.generateDeterministicEntries(sportId);
      storage.saveLeaderboardData(cacheKey, entries);
    }
    
    // Mark rivals (users with similar scores to current user)
    const currentUser = storage.getUserProfile();
    if (currentUser) {
      const userBest = currentUser.personalBests[sportId] || 0;
      entries.forEach(entry => {
        entry.isRival = Math.abs(entry.score - userBest) <= 5;
      });
    }
    
    return entries;
  }

  updateUserScore(sportId: string, userId: string, score: number): void {
    const cacheKey = `${sportId}_all-time`;
    let entries = storage.getLeaderboardData(cacheKey);
    
    if (entries.length === 0) {
      entries = this.generateDeterministicEntries(sportId);
    }
    
    // Remove existing user entry
    entries = entries.filter(e => e.userId !== userId);
    
    // Add user's new score
    const user = storage.getUserProfile();
    if (user) {
      entries.push({
        userId,
        username: user.name,
        avatar: user.avatar,
        score,
        rank: 0, // Will be calculated after sorting
        sport: sportId,
        timestamp: new Date().toISOString(),
        isRival: false
      });
    }
    
    // Re-sort and update ranks
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    storage.saveLeaderboardData(cacheKey, entries);
  }

  getUserRank(sportId: string, userId: string): number {
    const entries = this.getLeaderboard(sportId);
    const userEntry = entries.find(e => e.userId === userId);
    return userEntry?.rank || 0;
  }

  getTopPlayers(sportId: string, limit: number = 10): LeaderboardEntry[] {
    return this.getLeaderboard(sportId).slice(0, limit);
  }

  getRivals(sportId: string, userId: string): LeaderboardEntry[] {
    const entries = this.getLeaderboard(sportId);
    return entries.filter(e => e.isRival && e.userId !== userId).slice(0, 5);
  }
}

export const leaderboardService = new LeaderboardService();
