import { User, ActivityRing } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityRings } from './ActivityRings';
import { motion } from 'framer-motion';
import { Camera, Trophy, User as UserIcon, Zap, Coins } from 'lucide-react';

interface MainHubProps {
  user: User;
  onAssess: () => void;
  onCompete: () => void;
  onProfile: () => void;
}

export function MainHub({ user, onAssess, onCompete, onProfile }: MainHubProps) {
  const activityRings: ActivityRing[] = [
    {
      type: 'practice',
      current: 3,
      target: 5,
      color: 'hsl(var(--primary))'
    },
    {
      type: 'skill',
      current: 850,
      target: 1000,
      color: 'hsl(var(--secondary))'
    },
    {
      type: 'consistency',
      current: user.streakDays,
      target: 7,
      color: 'hsl(var(--accent))'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getSportBackground = () => {
    switch (user.primarySport.id) {
      case 'cricket':
        return 'bg-gradient-to-br from-green-900/20 to-green-700/20';
      case 'basketball':
        return 'bg-gradient-to-br from-orange-900/20 to-orange-700/20';
      case 'badminton':
        return 'bg-gradient-to-br from-purple-900/20 to-purple-700/20';
      case 'athletics':
        return 'bg-gradient-to-br from-blue-900/20 to-blue-700/20';
      case 'longjump':
        return 'bg-gradient-to-br from-yellow-900/20 to-yellow-700/20';
      case 'highjump':
        return 'bg-gradient-to-br from-red-900/20 to-red-700/20';
      default:
        return 'bg-gradient-to-br from-background to-card';
    }
  };

  return (
    <div className={`min-h-screen ${getSportBackground()} transition-all duration-500`}>
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Level {user.level} {user.primarySport.name} Athlete
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-card/50 rounded-full px-3 py-1">
              <Coins className="w-4 h-4 text-secondary" />
              <span className="font-bold">{user.coins}</span>
            </div>
            <div className="flex items-center space-x-1 bg-card/50 rounded-full px-3 py-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-bold">{user.skillPoints}</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur">
            <ActivityRings rings={activityRings} />
          </Card>
        </motion.div>
      </div>

      {/* Content Carousel */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Daily Challenge */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Daily {user.primarySport.name} Challenge
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete today's challenge to earn bonus skill points!
                </p>
                <Badge className="bg-primary/20 text-primary">
                  +50 Skill Points
                </Badge>
              </div>
              <div className="text-4xl">{user.primarySport.icon}</div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onAssess}>
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-bold mb-2">Assess</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a performance test
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onCompete}>
                <div className="text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-secondary" />
                  <h3 className="font-bold mb-2">Compete</h3>
                  <p className="text-sm text-muted-foreground">
                    View leaderboards
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onProfile}>
                <div className="text-center">
                  <UserIcon className="w-12 h-12 mx-auto mb-3 text-accent" />
                  <h3 className="font-bold mb-2">Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    View your progress
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Badges */}
          {user.badges.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold mb-4">Recent Achievements</h3>
              <div className="flex space-x-2 overflow-x-auto">
                {user.badges.slice(0, 3).map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0 text-center"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <p className="text-xs font-medium">{badge.name}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border"
      >
        <div className="flex justify-around py-4">
          <Button variant="ghost" size="lg" onClick={onAssess} className="flex-col space-y-1">
            <Camera className="w-6 h-6" />
            <span className="text-xs">Assess</span>
          </Button>
          <Button variant="ghost" size="lg" onClick={onCompete} className="flex-col space-y-1">
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Compete</span>
          </Button>
          <Button variant="ghost" size="lg" onClick={onProfile} className="flex-col space-y-1">
            <UserIcon className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
