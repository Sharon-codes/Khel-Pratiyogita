import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GamifiedCard: React.FC<GamifiedCardProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      className={cn("gamified-card rounded-xl p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};
