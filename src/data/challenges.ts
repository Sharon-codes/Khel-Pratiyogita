import { Quest } from '@/types';

export const getDailyChallenges = (sportId: string): Quest[] => {
  const commonChallenges: Quest[] = [
    {
      id: 'daily-login',
      type: 'daily',
      title: 'Train Today',
      description: 'Complete one assessment session.',
      target: 1,
      progress: 0,
      xpReward: 50,
      coinReward: 10,
      isCompleted: false,
      expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    },
  ];

  const sportSpecificChallenges: Record<string, Quest> = {
    cricket: {
      id: 'daily-cricket-drive',
      type: 'daily',
      title: 'Cover Drive Practice',
      description: 'Score over 70 in the Batting Assessment.',
      target: 70,
      progress: 0,
      xpReward: 75,
      coinReward: 20,
      isCompleted: false,
      expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    },
    athletics: {
      id: 'daily-athletics-sprint',
      type: 'daily',
      title: 'Speed Burst',
      description: 'Complete the 40m Sprint test.',
      target: 1,
      progress: 0,
      xpReward: 60,
      coinReward: 15,
      isCompleted: false,
      expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    },
  };

  const challenges = [...commonChallenges];
  if (sportSpecificChallenges[sportId]) {
    challenges.push(sportSpecificChallenges[sportId]);
  }

  return challenges;
};
