import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("min-h-screen bg-background text-foreground pb-24", className)}
    >
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </motion.div>
  );
};
