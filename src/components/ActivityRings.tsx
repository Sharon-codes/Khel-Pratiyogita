import React from 'react';
import { motion } from 'framer-motion';
import { ActivityRingData } from '@/types';
import { useAppStore } from '@/store/appStore';
import { Flame, Star, Target } from 'lucide-react';

interface ActivityRingProps {
  ring: ActivityRingData;
  size: number;
  strokeWidth: number;
  delay: number;
}

const Ring: React.FC<ActivityRingProps> = ({ ring, size, strokeWidth, delay }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(ring.current / ring.target, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
      <defs>
        <linearGradient id={`gradient-${ring.type}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ring.color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={ring.color} stopOpacity="1" />
        </linearGradient>
        <filter id={`glow-${ring.type}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="text-muted/10" stroke="currentColor" fill="transparent" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke={`url(#gradient-${ring.type})`} fill="transparent"
        strokeLinecap="round" strokeDasharray={circumference} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `url(#glow-${ring.type})` }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeInOut", delay }}
      />
    </svg>
  );
};

export const ActivityRings: React.FC = () => {
  const { user } = useAppStore();

  const rings: ActivityRingData[] = [
    { type: 'practice', label: 'Practice', current: user?.totalAssessments || 0, target: 1, color: 'hsl(var(--primary))' },
    { type: 'skill', label: 'Skill', current: (user?.xp || 0) % 100, target: 100, color: 'hsl(var(--xp))' },
    { type: 'consistency', label: 'Streak', current: user?.streakDays || 0, target: 7, color: 'hsl(var(--secondary))' },
  ];

  const icons = {
    practice: <Target className="text-primary" />,
    skill: <Star className="text-xp" />,
    consistency: <Flame className="text-secondary" />,
  }

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {rings.map((ring, index) => (
        <Ring key={ring.type} ring={ring} size={192 - index * 56} strokeWidth={16} delay={index * 0.2} />
      ))}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <div className="text-center">
            {icons.practice}
            <p className="text-xs">{user?.totalAssessments || 0}/1</p>
          </div>
          <div className="text-center">
            {icons.consistency}
            <p className="text-xs">{user?.streakDays || 0}/7</p>
          </div>
        </div>
        <div className="text-center">
          {icons.skill}
          <p className="text-xs">{(user?.xp || 0) % 100}/100</p>
        </div>
      </div>
    </div>
  );
};
