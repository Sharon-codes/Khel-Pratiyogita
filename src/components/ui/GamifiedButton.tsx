import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const GamifiedButton = React.forwardRef<HTMLButtonElement, GamifiedButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn("gamified-button", className)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <span className="shine"></span>
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
GamifiedButton.displayName = "GamifiedButton";
