import { Badge } from '@/types';

export const badges: Badge[] = [
  {
    id: 'first-assessment',
    name: 'First Step',
    description: 'Complete your first assessment',
    icon: '🎯',
    rarity: 'common',
    requirement: 'Complete 1 assessment'
  },
  {
    id: 'week-streak',
    name: 'Dedicated Athlete',
    description: 'Practice for 7 consecutive days',
    icon: '🔥',
    rarity: 'rare',
    requirement: 'Login for 7 consecutive days'
  },
  {
    id: 'cricket-master',
    name: 'Cricket Legend',
    description: 'Score 90+ in all cricket assessments',
    icon: '🏏',
    rarity: 'epic',
    requirement: 'Score 90+ in all cricket tests'
  },
  {
    id: 'multi-sport',
    name: 'All-Rounder',
    description: 'Complete assessments in 3 different sports',
    icon: '🌟',
    rarity: 'epic',
    requirement: 'Complete tests in 3 sports'
  },
  {
    id: 'leaderboard-top10',
    name: 'Rising Star',
    description: 'Reach top 10 in any sport leaderboard',
    icon: '⭐',
    rarity: 'legendary',
    requirement: 'Reach top 10 in leaderboard'
  }
];
