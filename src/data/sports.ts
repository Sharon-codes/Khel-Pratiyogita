import { Sport } from '@/types';

export const sports: Sport[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    gradient: 'sport-gradient-cricket',
    description: 'Master batting, bowling, and fielding techniques',
    skillTree: {
      id: 'st-cricket',
      name: 'Path of the Cricketer',
      tiers: [
        {
          level: 1,
          skills: [
            { id: 'c-skill-1', name: 'Solid Stance', description: 'Improved balance score', icon: 'T' },
          ],
        },
        {
          level: 5,
          skills: [
            { id: 'c-skill-2', name: 'Eagle Eye', description: 'Better timing analysis', icon: 'T' },
          ],
        },
      ],
    },
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    gradient: 'sport-gradient-basketball',
    description: 'Develop shooting, dribbling, and court vision',
    skillTree: {
      id: 'st-basketball',
      name: 'Way of the Hooper',
      tiers: [
        {
          level: 1,
          skills: [
            { id: 'b-skill-1', name: 'Steady Hands', description: 'Improved free throw score', icon: 'T' },
          ],
        },
      ],
    },
  },
  {
    id: 'athletics',
    name: 'Athletics',
    icon: '🏃‍♂️',
    gradient: 'sport-gradient-athletics',
    description: 'Sprint, endurance, and track performance',
    skillTree: {
      id: 'st-athletics',
      name: 'The Sprinting Path',
      tiers: [
        {
          level: 1,
          skills: [
            { id: 'a-skill-1', name: 'Explosive Start', description: 'Faster reaction time', icon: 'T' },
          ],
        },
      ],
    },
  },
  {
    id: 'longjump',
    name: 'Long Jump',
    icon: '🏃‍♀️',
    gradient: 'sport-gradient-longjump',
    description: 'Master the approach, takeoff, and landing',
    skillTree: {
      id: 'st-longjump',
      name: 'Flight School',
      tiers: [
        {
          level: 1,
          skills: [
            { id: 'lj-skill-1', name: 'Perfect Takeoff', description: 'Better jump angle', icon: 'T' },
          ],
        },
      ],
    },
  },
];
