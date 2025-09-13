import { TestSpec } from '@/types';

export const cricketTests: TestSpec[] = [
  {
    id: 'cricket-batting',
    name: 'Batting Assessment',
    description: 'Analyze your batting technique, timing, and shot placement',
    sportId: 'cricket',
    difficulty: 'intermediate',
    duration: 10, // Shortened for simulation
    instructions: [
      'Set up camera 3 meters away at waist height',
      'Take your batting stance facing the camera',
      'Perform 5 straight drives with proper technique',
    ],
    metrics: [
      { key: 'technique_score', name: 'Technique Score', unit: 'points', min: 0, max: 100, required: true },
      { key: 'shot_accuracy', name: 'Shot Accuracy', unit: '%', min: 0, max: 100, required: true },
    ],
    scoring: {
      function: 'linear_asc',
      thresholds: { pass: 60, good: 75, excellent: 90 },
      xpPerPoint: 1.2,
      coinBonus: 15
    },
    badgeUnlock: 'first-assessment',
  },
];
