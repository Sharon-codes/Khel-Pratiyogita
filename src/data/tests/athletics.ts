import { TestSpec } from '@/types';

export const athleticsTests: TestSpec[] = [
  {
    id: 'athletics-sprint-40m',
    name: '40m Sprint',
    description: 'Test your acceleration and sprint technique over 40 meters',
    sportId: 'athletics',
    difficulty: 'beginner',
    duration: 8, // Shortened for simulation
    instructions: [
      'Position camera at starting line, angled view',
      'Run at maximum effort to finish line',
      'Maintain good form throughout'
    ],
    metrics: [
      { key: 'time_seconds', name: 'Sprint Time', unit: 'seconds', min: 4.0, max: 8.0, required: true },
      { key: 'form_score', name: 'Running Form', unit: 'points', min: 0, max: 100, required: true }
    ],
    scoring: {
      function: 'linear_desc',
      thresholds: { pass: 7.5, good: 6.5, excellent: 5.5 },
      xpPerPoint: 1.5,
      coinBonus: 20
    },
    badgeUnlock: 'first-assessment',
  },
];
