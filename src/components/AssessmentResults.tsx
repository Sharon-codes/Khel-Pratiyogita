import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useAppStore } from '@/store/appStore';
import { GamifiedButtonV2 } from './ui/GamifiedButtonV2';
import { GamifiedCardV2 } from './ui/GamifiedCardV2';
import { AnimatedNumber } from './common/AnimatedNumber';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { badges } from '@/data/badges';
import { Badge, TestSpec } from '@/types';
import { getTestSpec } from '@/data/tests';
import ReactECharts from 'echarts-for-react';
import { GamifiedProgressBar } from './ui/GamifiedProgressBar';
import { Award, CheckCircle, Repeat } from 'lucide-react';

export const AssessmentResults: React.FC = () => {
  const { user, lastAssessmentResult, finishAssessmentView, startAssessment, updateUser } = useAppStore();
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const oldXP = user && lastAssessmentResult ? user.xp - lastAssessmentResult.xpEarned : 0;
  const oldLevel = Math.floor(oldXP / 100) + 1;
  const levelUp = user && oldLevel < user.level;

  useEffect(() => {
    if (!lastAssessmentResult || !user) {
      finishAssessmentView();
      return;
    }

    const spec = getTestSpec(lastAssessmentResult.testId);
    if (spec?.badgeUnlock && !user.badges.includes(spec.badgeUnlock)) {
      const newBadge = badges.find(b => b.id === spec.badgeUnlock);
      if (newBadge) {
        setUnlockedBadge(newBadge);
        updateUser({ badges: [...user.badges, newBadge.id] });
        setTimeout(() => setShowModal(true), 1500);
      }
    }
  }, [lastAssessmentResult, user, updateUser, finishAssessmentView]);

  if (!lastAssessmentResult || !user) return null;
  const spec = getTestSpec(lastAssessmentResult.testId) as TestSpec;

  const isNewBest = (lastAssessmentResult.score || 0) > (user.personalBests[spec.id] || 0);

  const chartOption = {
    radar: {
      indicator: spec.metrics.map(m => ({ name: m.name, max: m.max })),
      shape: 'circle',
      splitNumber: 4,
      axisName: { color: 'hsl(var(--foreground))', fontSize: 10 },
      splitLine: { lineStyle: { color: 'hsl(var(--border))' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'hsl(var(--muted))' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: spec.metrics.map(m => lastAssessmentResult.metrics[m.key] || m.min),
        name: 'Your Performance',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: 'hsl(var(--primary))' },
        itemStyle: { color: 'hsl(var(--primary))' },
        areaStyle: { color: 'hsla(var(--primary), 0.2)' }
      }]
    }],
    tooltip: { trigger: 'item' }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-grid">
      <Confetti recycle={false} numberOfPieces={levelUp ? 500 : 200} gravity={0.1} />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full max-w-md text-center space-y-4">
        <motion.div initial={{y: -30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.3}} className="font-display text-6xl text-primary text-glow">{levelUp ? 'LEVEL UP!' : 'Results In'}</motion.div>
        
        <GamifiedCardV2 delay={0.4}>
          <div className="text-sm text-muted-foreground">Overall Score</div>
          <div className="font-display text-8xl text-primary text-glow">
            <AnimatedNumber from={0} to={lastAssessmentResult.score || 0} />
          </div>
          {isNewBest && <div className="font-semibold text-xp flex items-center justify-center gap-2"><Award size={16}/> New Personal Best!</div>}
        </GamifiedCardV2>
        
        <GamifiedCardV2 delay={0.5}>
          <h3 className="font-bold text-lg text-white mb-2">Performance Breakdown</h3>
          <ReactECharts option={chartOption} style={{ height: '250px' }} theme="dark" />
        </GamifiedCardV2>

        <GamifiedCardV2 delay={0.6}>
          <h3 className="font-bold text-lg text-white mb-4">Rewards</h3>
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">XP Earned</div>
              <div className="text-2xl font-bold text-xp">+<AnimatedNumber from={0} to={lastAssessmentResult.xpEarned || 0} /></div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Coins Earned</div>
              <div className="text-2xl font-bold text-coin">+<AnimatedNumber from={0} to={lastAssessmentResult.coinsEarned || 0} /></div>
            </div>
          </div>
          <GamifiedProgressBar progress={(user.xp % 100)} label={`Level ${user.level} Progress`} />
        </GamifiedCardV2>

        <motion.div initial={{y:20, opacity: 0}} animate={{y:0, opacity: 1}} transition={{delay: 0.8}} className="flex gap-4">
            <GamifiedButtonV2 onClick={() => startAssessment(spec)} className="w-full" variant="secondary">
                <Repeat className="mr-2 h-4 w-4" />
                Retake
            </GamifiedButtonV2>
            <GamifiedButtonV2 onClick={finishAssessmentView} className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Done
            </GamifiedButtonV2>
        </motion.div>
      </motion.div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="!bg-card/80 backdrop-blur-xl !border-primary">
          <DialogHeader className="text-center items-center">
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type: 'spring'}} className="text-8xl mb-4">{unlockedBadge?.icon}</motion.div>
            <DialogTitle className="font-display text-4xl text-primary text-glow">Badge Unlocked!</DialogTitle>
            <DialogDescription className="text-lg mt-2">
              You've earned the <strong className="text-white">"{unlockedBadge?.name}"</strong> badge.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
