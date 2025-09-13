import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const GamifiedButtonV2 = React.forwardRef<HTMLButtonElement, GamifiedButtonProps>(
  ({ children, className, variant = 'primary', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-300 rounded-lg group overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
          variant === 'primary' ? 'bg-primary/80 focus:ring-primary' : 'bg-secondary/80 focus:ring-secondary',
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        whileHover={{ scale: 1.05, boxShadow: `0 0 20px hsl(var(--${variant === 'primary' ? 'primary' : 'secondary'}) / 0.5)` }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Background Shine */}
        <div className={cn(
          "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 transform -translate-x-full group-hover:translate-x-full",
        )} />
        {/* Inner Border */}
        <div className="absolute inset-0.5 rounded-md bg-background/80" />
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
GamifiedButtonV2.displayName = "GamifiedButtonV2";
