import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamifiedProgressBarProps {
  progress: number; // 0-100
  label?: string;
  className?: string;
}

export const GamifiedProgressBar: React.FC<GamifiedProgressBarProps> = ({ progress, label, className }) => {
  return (
    <div className={cn("w-full", className)}>
      {label && <div className="text-sm font-medium text-muted-foreground mb-1.5">{label}</div>}
      <div className="w-full bg-muted/30 rounded-full h-4 border border-border p-0.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-50 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
