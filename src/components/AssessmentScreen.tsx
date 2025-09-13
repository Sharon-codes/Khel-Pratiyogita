import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { allTestSpecs } from '@/data/tests';
import { Screen } from './common/Screen';
import { GamifiedCard } from './ui/GamifiedCard';
import { GamifiedButton } from './ui/GamifiedButton';
import { Play } from 'lucide-react';

export const AssessmentScreen: React.FC = () => {
  const { startAssessment } = useAppStore();

  return (
    <Screen>
      <div className="text-center mb-8">
        <h1 className="font-display text-5xl text-primary text-glow">Assessment Arena</h1>
        <p className="text-muted-foreground mt-2">Choose your challenge. Prove your skill.</p>
      </div>
      <div className="space-y-6">
        {allTestSpecs.map((spec, index) => (
          <GamifiedCard key={spec.id} delay={index * 0.1}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-white mb-1">{spec.name}</h2>
                <p className="text-muted-foreground text-sm mb-4">{spec.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="capitalize px-3 py-1 bg-secondary/20 text-secondary rounded-full font-semibold">{spec.difficulty}</span>
                  <span className="px-3 py-1 bg-muted/50 rounded-full">{spec.duration}s Duration</span>
                </div>
              </div>
              <GamifiedButton onClick={() => startAssessment(spec)} className="!w-full md:!w-auto">
                <Play className="mr-2" />
                Start
              </GamifiedButton>
            </div>
          </GamifiedCard>
        ))}
      </div>
    </Screen>
  );
};
