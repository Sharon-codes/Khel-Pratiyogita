import React from 'react';
import { motion } from 'framer-motion';

interface LevelBarProps {
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export const LevelBar: React.FC<LevelBarProps> = ({ level, xp, xpForNextLevel }) => {
  const progress = (xp / xpForNextLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-semibold">
        <span className="text-white">Level {level}</span>
        <span className="text-xp">{xp} / {xpForNextLevel} XP</span>
      </div>
      <div className="w-full bg-muted rounded-full h-4 border-2 border-border p-0.5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-xp"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
