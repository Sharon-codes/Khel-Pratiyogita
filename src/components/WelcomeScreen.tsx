import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { GamifiedButtonV2 } from '@/components/ui/GamifiedButtonV2';
import { Rocket } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setScreen } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-hero-gradient" />
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="relative"
      >
        <h1 className="font-display text-7xl md:text-9xl text-white/10 tracking-widest uppercase">
          Khel
        </h1>
        <h1 className="font-display text-7xl md:text-9xl text-primary text-glow absolute top-0 left-0 w-full uppercase">
          Khel
        </h1>
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="font-display text-4xl md:text-5xl text-white/80 mt-[-1.5rem] mb-6 uppercase tracking-wider"
      >
        Pratiyogita
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="text-lg text-muted-foreground max-w-md"
      >
        The Future of Athletic Performance. Unleash your potential.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="mt-16"
      >
        <GamifiedButtonV2
          onClick={() => setScreen('onboarding')}
          className="animate-pulse-glow"
        >
          <Rocket className="mr-3 h-5 w-5" />
          Begin Your Ascent
        </GamifiedButtonV2>
      </motion.div>
    </div>
  );
};
