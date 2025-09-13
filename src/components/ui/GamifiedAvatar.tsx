import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/types';
import { baseAvatars } from '@/data/avatars';

interface GamifiedAvatarProps {
  avatar: UserAvatar;
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GamifiedAvatar: React.FC<GamifiedAvatarProps> = ({ avatar, level, size = 'md', className }) => {
  const avatarIcon = baseAvatars.find(a => a.id === avatar.base)?.icon || '👤';

  const sizeClasses = {
    sm: { container: 'w-16 h-16', icon: 'text-3xl', level: 'w-6 h-6 text-xs bottom-0' },
    md: { container: 'w-24 h-24', icon: 'text-5xl', level: 'w-10 h-10 text-base -bottom-2' },
    lg: { container: 'w-32 h-32', icon: 'text-7xl', level: 'w-12 h-12 text-lg -bottom-3' },
  };

  return (
    <div className={cn("relative", sizeClasses[size].container, className)}>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-border-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
        <span className={cn("transition-transform duration-300 group-hover:scale-110", sizeClasses[size].icon)}>
          {avatarIcon}
        </span>
      </div>
      <motion.div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 bg-xp text-black font-bold rounded-full border-4 border-background flex items-center justify-center",
          sizeClasses[size].level
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      >
        {level}
      </motion.div>
    </div>
  );
};
