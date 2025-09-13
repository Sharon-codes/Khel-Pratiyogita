import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Screen } from './common/Screen';
import { GamifiedCardV2 } from './ui/GamifiedCardV2';
import { ActivityRings } from './ActivityRings';
import { GamifiedButtonV2 } from './ui/GamifiedButtonV2';
import { ContentCarousel } from './common/ContentCarousel';
import { getDailyChallenges } from '@/data/challenges';
import { badges } from '@/data/badges';
import { ArrowRight, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SwiperSlide } from 'swiper/react';
import { GamifiedAvatar } from './ui/GamifiedAvatar';
import { GamifiedProgressBar } from './ui/GamifiedProgressBar';

export const MainHub: React.FC = () => {
  const { user, setScreen } = useAppStore();

  if (!user) return null;

  const dailyChallenges = getDailyChallenges(user.primarySport);
  const backgroundClass = `bg-hub-${user.primarySport}`; // You can define these in index.css if you want specific backgrounds

  return (
    <Screen className={cn("bg-grid", backgroundClass)}>
      <div className="bg-background/80 backdrop-blur-sm -m-4 p-4 pb-24 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl text-white">Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Ready to dominate today?</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
            <div className="bg-card/80 px-4 py-2 rounded-lg text-center">
              <div className="font-bold text-coin flex items-center gap-2">💰 <span className="text-lg">{user.coins}</span></div>
            </div>
            <GamifiedButtonV2 onClick={() => setScreen('profile')} className="!p-0 h-12 w-12 !rounded-full"><Settings /></GamifiedButtonV2>
          </motion.div>
        </header>

        <GamifiedCardV2 className="mb-6" delay={0.1} interactive>
          <div className="flex items-center gap-6">
            <GamifiedAvatar avatar={user.avatar} level={user.level} size="md" />
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <GamifiedProgressBar progress={(user.xp % 100)} label={`Level ${user.level} Progress`} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">{user.xp % 100} / 100 XP to next level</div>
            </div>
          </div>
        </GamifiedCardV2>

        <GamifiedCardV2 className="mb-6 text-center" delay={0.2}>
          <h3 className="text-2xl text-primary text-glow mb-4">Today's Activity</h3>
          <div className="flex items-center justify-center">
            <ActivityRings />
          </div>
        </GamifiedCardV2>

        <div className="mb-6">
          <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl text-secondary text-glow-secondary mb-4">Missions & Challenges</motion.h3>
          <ContentCarousel>
            {dailyChallenges.map(challenge => (
              <SwiperSlide key={challenge.id}>
                <GamifiedCardV2 interactive className="h-full !bg-gradient-to-br !from-primary/20 !to-secondary/20">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-xl text-white">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">{challenge.description}</p>
                    </div>
                    <GamifiedButtonV2 onClick={() => setScreen('assessment')} className="w-full !py-2 !text-base">
                      Start <ArrowRight className="ml-2 h-4 w-4" />
                    </GamifiedButtonV2>
                  </div>
                </GamifiedCardV2>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <GamifiedCardV2 interactive className="h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-bold text-xl text-white">Unlock Badges</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">Show off your skills!</p>
                    <div className="flex gap-4">
                      {badges.slice(0, 3).map(b => <div key={b.id} className="text-5xl opacity-30 hover:opacity-100 transition-opacity cursor-pointer">{b.icon}</div>)}
                    </div>
                  </div>
                </div>
              </GamifiedCardV2>
            </SwiperSlide>
          </ContentCarousel>
        </div>
      </div>
    </Screen>
  );
};
