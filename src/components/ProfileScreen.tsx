import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Screen } from './common/Screen';
import { GamifiedButton } from './ui/GamifiedButton';
import { GamifiedCard } from './ui/GamifiedCard';
import { badges } from '@/data/badges';
import { sports } from '@/data/sports';
import { baseAvatars } from '@/data/avatars';
import { LevelBar } from './ui/LevelBar';
import { Flame, BarChart, Award } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAppStore();

  if (!user) return null;

  const avatarIcon = baseAvatars.find(a => a.id === user.avatar.base)?.icon || '👤';

  return (
    <Screen>
      <GamifiedCard className="text-center mb-8">
        <div className="w-28 h-28 rounded-full bg-muted p-2 mx-auto mb-4 text-6xl flex items-center justify-center border-4 border-primary">
          {avatarIcon}
        </div>
        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
        <p className="text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        <div className="mt-4 px-4">
          <LevelBar level={user.level} xp={user.xp % 100} xpForNextLevel={100} />
        </div>
      </GamifiedCard>

      <GamifiedCard className="mb-6">
        <h2 className="font-display text-3xl text-primary text-glow mb-4">Career Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <BarChart className="mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-white">{user.totalAssessments}</div>
            <div className="text-sm text-muted-foreground">Tests</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <Flame className="mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-white">{user.streakDays}</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <Award className="mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{user.badges.length}</div>
            <div className="text-sm text-muted-foreground">Badges</div>
          </div>
        </div>
      </GamifiedCard>
      
      <GamifiedCard className="mb-6">
        <h2 className="font-display text-3xl text-primary text-glow mb-4">Unlocked Badges</h2>
        <div className="flex flex-wrap gap-4">
          {badges.map(badge => (
            <div key={badge.id} title={badge.name} className={`text-center p-2 rounded-lg transition-all ${user.badges.includes(badge.id) ? 'grayscale-0' : 'grayscale opacity-40'}`}>
              <div className="text-5xl">{badge.icon}</div>
            </div>
          ))}
        </div>
      </GamifiedCard>

      <GamifiedButton onClick={signOut} className="w-full !bg-destructive/50 !border-destructive">
        Sign Out & Clear Data
      </GamifiedButton>
    </Screen>
  );
};
