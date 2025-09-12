import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Coins, Calendar, Trophy, User as UserIcon } from 'lucide-react';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
}

export function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  const nextLevelXP = user.level * 1000;
  const currentXP = user.skillPoints % 1000;
  const progressToNextLevel = (currentXP / nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{user.avatar}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-muted-foreground mb-2">Level {user.level} Athlete</p>
          <Badge className="bg-primary/20 text-primary">
            {user.primarySport.icon} {user.primarySport.name}
          </Badge>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4">Stats Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{user.skillPoints}</div>
                  <div className="text-sm text-muted-foreground">Skill Points</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl font-bold">{user.coins}</div>
                  <div className="text-sm text-muted-foreground">Coins</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{user.streakDays}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-foreground" />
                  <div className="text-2xl font-bold">{user.badges.length}</div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4">Level Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Level {user.level}</span>
                <span className="text-sm text-muted-foreground">
                  {currentXP}/{nextLevelXP} XP
                </span>
              </div>
              <Progress value={progressToNextLevel} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {nextLevelXP - currentXP} XP to next level
              </p>
            </Card>
          </motion.div>

          {/* Selected Sports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4">Your Sports</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {user.selectedSports.map((sport, index) => (
                  <motion.div
                    key={sport.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-3 rounded-lg border text-center ${
                      sport.id === user.primarySport.id 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-card'
                    }`}
                  >
                    <div className="text-2xl mb-2">{sport.icon}</div>
                    <div className="text-sm font-medium">{sport.name}</div>
                    {sport.id === user.primarySport.id && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Primary
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">User ID</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">ABHA ID</span>
                  <span className="text-sm">
                    {user.abhaId || 'Not linked'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm">
                    {user.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="font-bold mb-4">Achievements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {user.badges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-center p-3 bg-card rounded-lg border"
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-sm font-medium">{badge.name}</div>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 text-xs ${
                          badge.rarity === 'legendary' ? 'border-yellow-500 text-yellow-700' :
                          badge.rarity === 'epic' ? 'border-purple-500 text-purple-700' :
                          badge.rarity === 'rare' ? 'border-blue-500 text-blue-700' :
                          'border-gray-500 text-gray-700'
                        }`}
                      >
                        {badge.rarity}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
