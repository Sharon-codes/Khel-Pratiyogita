import { z } from 'zod';

// Schema version for migrations
export const SCHEMA_VERSION = 2; // Incremented version

// Enums and constants
export type TestState = 'idle' | 'running' | 'paused' | 'completed' | 'confirmed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type QuestType = 'daily' | 'weekly' | 'seasonal';
export type ScoreFunction = 'linear_asc' | 'linear_desc' | 'threshold_based';

// Zod schemas for validation
export const UserAvatarSchema = z.object({
  base: z.string(),
  accessories: z.array(z.string()).default([]),
});

export const UserProfileSchema = z.object({
  schemaVersion: z.number().default(SCHEMA_VERSION),
  id: z.string(),
  name: z.string().min(1),
  abhaId: z.string().optional(),
  primarySport: z.string(),
  selectedSports: z.array(z.string()),
  level: z.number().min(1).default(1),
  xp: z.number().min(0).default(0),
  coins: z.number().min(0).default(0),
  badges: z.array(z.string()).default([]),
  avatar: UserAvatarSchema,
  streakDays: z.number().min(0).default(0),
  lastActiveDate: z.string().optional(),
  personalBests: z.record(z.string(), z.number()).default({}),
  createdAt: z.string().default(() => new Date().toISOString()),
  totalAssessments: z.number().min(0).default(0),
  questsCompleted: z.number().min(0).default(0),
  skillTree: z.record(z.string(), z.array(z.string())).default({}), // sportId: [unlockedSkillId]
});

export const TestSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  sportId: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().positive(),
  instructions: z.array(z.string()),
  metrics: z.array(z.object({
    key: z.string(),
    name: z.string(),
    unit: z.string(),
    min: z.number(),
    max: z.number(),
    required: z.boolean().default(true)
  })),
  scoring: z.object({
    function: z.enum(['linear_asc', 'linear_desc', 'threshold_based']),
    thresholds: z.object({
      pass: z.number(),
      good: z.number(),
      excellent: z.number()
    }),
    xpPerPoint: z.number().default(1),
    coinBonus: z.number().default(0)
  }),
  badgeUnlock: z.string().optional(),
});

export const TestAttemptSchema = z.object({
  id: z.string(),
  testId: z.string(),
  userId: z.string(),
  state: z.enum(['idle', 'running', 'paused', 'completed', 'confirmed']),
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  pausedDuration: z.number().default(0),
  metrics: z.record(z.string(), z.number()).default({}),
  score: z.number().min(0).max(100).optional(),
  xpEarned: z.number().min(0).default(0),
  coinsEarned: z.number().min(0).default(0),
  timestamp: z.string().default(() => new Date().toISOString())
});

export const LeaderboardEntrySchema = z.object({
  userId: z.string(),
  username: z.string(),
  avatar: UserAvatarSchema,
  score: z.number(),
  rank: z.number(),
  sport: z.string(),
  timestamp: z.string(),
  isRival: z.boolean().default(false)
});

export const QuestSchema = z.object({
  id: z.string(),
  type: z.enum(['daily', 'weekly', 'seasonal']),
  title: z.string(),
  description: z.string(),
  target: z.number(),
  progress: z.number().default(0),
  xpReward: z.number(),
  coinReward: z.number(),
  isCompleted: z.boolean().default(false),
  expiresAt: z.string()
});

// TypeScript types derived from schemas
export type UserAvatar = z.infer<typeof UserAvatarSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type TestSpec = z.infer<typeof TestSpecSchema>;
export type TestAttempt = z.infer<typeof TestAttemptSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type Quest = z.infer<typeof QuestSchema>;

// Legacy types for compatibility
export interface Sport {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  description: string;
  skillTree: SkillTree;
}

export interface SkillTree {
  id: string;
  name: string;
  tiers: SkillTier[];
}

export interface SkillTier {
  level: number;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  requirement: string;
  unlockedAt?: Date;
}

export interface ActivityRingData {
  type: 'practice' | 'skill' | 'consistency';
  label: string;
  current: number;
  target: number;
  color: string;
}

// App state types
export type AppScreen = 'welcome' | 'onboarding' | 'hub' | 'assessment' | 'assessment-arena' | 'assessment-results' | 'leaderboard' | 'profile';

export interface AppState {
  currentScreen: AppScreen;
  isLoading: boolean;
  user: UserProfile | null;
  activeTestSpec: TestSpec | null;
  lastAssessmentResult: TestAttempt | null;
  error: string | null;
  toast: string | null;
}
