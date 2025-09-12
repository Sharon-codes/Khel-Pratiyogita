export interface User {
  id: string;
  name: string;
  abhaId?: string;
  primarySport: Sport;
  selectedSports: Sport[];
  level: number;
  skillPoints: number;
  coins: number;
  badges: Badge[];
  avatar: string;
  streakDays: number;
  createdAt: Date;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  description: string;
  tests: Test[];
}

export interface Test {
  id: string;
  name: string;
  description: string;
  sportId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  instructions: string[];
}

export interface Assessment {
  id: string;
  userId: string;
  testId: string;
  score: number;
  skillPoints: number;
  coins: number;
  timestamp: Date;
  videoMetadata?: {
    duration: number;
    frameRate: number;
    resolution: string;
  };
  metrics: {
    [key: string]: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  unlockedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  sport: string;
}

export interface ActivityRing {
  type: 'practice' | 'skill' | 'consistency';
  current: number;
  target: number;
  color: string;
}
