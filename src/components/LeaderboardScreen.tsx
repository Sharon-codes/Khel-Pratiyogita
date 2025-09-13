import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { leaderboardService } from '@/services/leaderboard';
import { sports } from '@/data/sports';
import { Screen } from './common/Screen';
import { GamifiedCard } from './ui/GamifiedCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Crown, Shield } from 'lucide-react';

export const LeaderboardScreen: React.FC = () => {
  const { user } = useAppStore();
  const [activeSport, setActiveSport] = useState(sports[0].id);

  const leaderboard = useMemo(() => {
    return leaderboardService.getLeaderboard(activeSport);
  }, [activeSport]);

  return (
    <Screen>
      <div className="text-center mb-8">
        <h1 className="font-display text-5xl text-primary text-glow">Hall of Fame</h1>
        <p className="text-muted-foreground mt-2">See how you rank against the best.</p>
      </div>
      <Tabs defaultValue={activeSport} onValueChange={setActiveSport}>
        <TabsList className="grid w-full grid-cols-4">
          {sports.map(sport => (
            <TabsTrigger key={sport.id} value={sport.id} className="text-2xl">{sport.icon}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeSport} className="mt-6">
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <GamifiedCard
                key={entry.userId}
                delay={index * 0.05}
                className={`p-3 !rounded-lg ${entry.userId === user?.id ? '!border-primary' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold w-10 text-center flex items-center justify-center">
                    {entry.rank === 1 && <Crown className="text-yellow-400" />}
                    {entry.rank > 1 && entry.rank}
                  </div>
                  <div className="text-3xl bg-muted p-2 rounded-full">{entry.avatar.base === 'avatar-01' ? '🏃' : '🤸'}</div>
                  <div className="flex-grow">
                    <div className="font-semibold text-white">{entry.username}</div>
                    {entry.isRival && entry.userId !== user?.id && <div className="text-xs text-orange-400 flex items-center gap-1"><Shield size={12} /> Rival</div>}
                  </div>
                  <div className="text-xl font-bold text-primary">{entry.score}</div>
                </div>
              </GamifiedCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Screen>
  );
};
