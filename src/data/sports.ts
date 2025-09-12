import { Sport } from '@/types';

export const sports: Sport[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    gradient: 'sport-gradient-cricket',
    description: 'Master batting, bowling, and fielding techniques',
    tests: [
      {
        id: 'cricket-batting',
        name: 'Batting Assessment',
        description: 'Analyze your batting technique and timing',
        sportId: 'cricket',
        difficulty: 'intermediate',
        duration: 120,
        instructions: [
          'Set up camera 3 meters away at waist height',
          'Place the reference ruler visible in frame',
          'Take your batting stance',
          'Perform 5 straight drives'
        ]
      },
      {
        id: 'cricket-bowling',
        name: 'Bowling Action',
        description: 'Perfect your bowling action and accuracy',
        sportId: 'cricket',
        difficulty: 'intermediate',
        duration: 90,
        instructions: [
          'Position camera parallel to bowling crease',
          'Ensure full run-up is visible',
          'Bowl 6 deliveries at the stumps',
          'Maintain consistent line and length'
        ]
      }
    ]
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    gradient: 'sport-gradient-basketball',
    description: 'Develop shooting, dribbling, and court vision',
    tests: [
      {
        id: 'basketball-shooting',
        name: 'Free Throw',
        description: 'Test your shooting accuracy and form',
        sportId: 'basketball',
        difficulty: 'beginner',
        duration: 60,
        instructions: [
          'Position camera behind the free throw line',
          'Take 10 consecutive free throws',
          'Focus on consistent shooting form',
          'Ensure the hoop is visible in frame'
        ]
      }
    ]
  },
  {
    id: 'badminton',
    name: 'Badminton',
    icon: '🏸',
    gradient: 'sport-gradient-badminton',
    description: 'Perfect your smashes, drops, and footwork',
    tests: [
      {
        id: 'badminton-smash',
        name: 'Smash Power',
        description: 'Measure your smash speed and accuracy',
        sportId: 'badminton',
        difficulty: 'intermediate',
        duration: 90,
        instructions: [
          'Set camera at court center, side angle',
          'Perform 8 overhead smashes',
          'Focus on racket head speed',
          'Aim for cross-court targets'
        ]
      }
    ]
  },
  {
    id: 'athletics',
    name: 'Athletics',
    icon: '🏃‍♂️',
    gradient: 'sport-gradient-athletics',
    description: 'Sprint, endurance, and track performance',
    tests: [
      {
        id: 'athletics-sprint',
        name: '100m Sprint Start',
        description: 'Analyze your sprint starting technique',
        sportId: 'athletics',
        difficulty: 'intermediate',
        duration: 30,
        instructions: [
          'Position camera at starting line angle',
          'Perform 3 sprint starts',
          'Focus on reaction time and acceleration',
          'Run for first 20 meters only'
        ]
      }
    ]
  },
  {
    id: 'longjump',
    name: 'Long Jump',
    icon: '🏃‍♀️',
    gradient: 'sport-gradient-longjump',
    description: 'Master the approach, takeoff, and landing',
    tests: [
      {
        id: 'longjump-technique',
        name: 'Jump Technique',
        description: 'Perfect your takeoff and flight technique',
        sportId: 'longjump',
        difficulty: 'advanced',
        duration: 120,
        instructions: [
          'Camera positioned perpendicular to runway',
          'Mark takeoff board clearly',
          'Perform 3 practice jumps',
          'Focus on takeoff angle and landing'
        ]
      }
    ]
  },
  {
    id: 'highjump',
    name: 'High Jump',
    icon: '⬆️',
    gradient: 'sport-gradient-highjump',
    description: 'Perfect your approach and clearance technique',
    tests: [
      {
        id: 'highjump-technique',
        name: 'Clearance Technique',
        description: 'Analyze your bar clearance and form',
        sportId: 'highjump',
        difficulty: 'advanced',
        duration: 150,
        instructions: [
          'Position camera to capture full approach',
          'Set bar at comfortable height',
          'Perform 3 jump attempts',
          'Focus on Fosbury Flop technique'
        ]
      }
    ]
  }
];
