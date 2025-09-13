import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
}

export const GamifiedCardV2: React.FC<GamifiedCardProps> = ({ children, className, delay = 0, interactive = false }) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl p-6 bg-card/50 backdrop-blur-lg border border-border overflow-hidden",
        interactive && "transition-all duration-300 hover:border-primary/80 hover:bg-card/80",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Animated Border */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Inner content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
