import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { User, LeaderboardEntry } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface LeaderboardScreenProps {
  user: User;
  onBack: () => void;
}

export function LeaderboardScreen({ user, onBack }: LeaderboardScreenProps) {
  const [selectedSport, setSelectedSport] = useState(user.primarySport.id);

  // Generate mock leaderboard data
  const generateLeaderboard = (sportId: string): LeaderboardEntry[] => {
    const entries: LeaderboardEntry[] = [];
    
    // Add current user
    entries.push({
      userId: user.id,
      username: user.name,
      avatar: user.avatar,
      score: faker.number.float({ min: 80, max: 95 }),
      rank: faker.number.int({ min: 5, max: 15 }),
      sport: sportId
    });

    // Add other users
    for (let i = 1; i <= 20; i++) {
      if (i === entries[0].rank) continue; // Skip user's rank
      
      entries.push({
        userId: faker.string.uuid(),
        username: faker.person.firstName(),
        avatar: faker.helpers.arrayElement(['👤', '🏃‍♂️', '🏃‍♀️', '🤾‍♂️', '🤾‍♀️']),
        score: faker.number.float({ min: 60, max: 99 }),
        rank: i,
        sport: sportId
      });
    }

    return entries.sort((a, b) => a.rank - b.rank);
  };

  const leaderboardData = generateLeaderboard(selectedSport);
  const userEntry = leaderboardData.find(entry => entry.userId === user.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2: return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3: return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default: return 'from-card to-card border-border';
    }
  };

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
          <h2 className="text-3xl font-bold mb-2">Leaderboards 🏆</h2>
          <p className="text-muted-foreground">
            See how you rank against other athletes
          </p>
        </motion.div>

        {userEntry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className={`p-4 bg-gradient-to-r ${getRankColor(userEntry.rank)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-background/20 rounded-full">
                    {getRankIcon(userEntry.rank)}
                  </div>
                  <div>
                    <p className="font-bold">Your Rank</p>
                    <p className="text-sm text-muted-foreground">
                      {userEntry.score.toFixed(1)} points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">#{userEntry.rank}</p>
                  <p className="text-xs text-muted-foreground">of 1000+</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <Tabs value={selectedSport} onValueChange={setSelectedSport}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {user.selectedSports.slice(0, 3).map((sport) => (
              <TabsTrigger key={sport.id} value={sport.id} className="text-xs">
                {sport.icon} {sport.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {user.selectedSports.map((sport) => (
            <TabsContent key={sport.id} value={sport.id}>
              <div className="space-y-3">
                {generateLeaderboard(sport.id).slice(0, 10).map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`p-4 transition-all ${
                        entry.userId === user.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-lg">{entry.avatar}</span>
                            </div>
                            <div>
                              <p className="font-semibold">
                                {entry.username}
                                {entry.userId === user.id && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    You
                                  </Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.score.toFixed(1)} points
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {entry.rank <= 3 && (
                          <Badge 
                            className={`${
                              entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-700' :
                              entry.rank === 2 ? 'bg-gray-400/20 text-gray-700' :
                              'bg-amber-600/20 text-amber-700'
                            }`}
                          >
                            {entry.rank === 1 ? 'Champion' :
                             entry.rank === 2 ? 'Runner-up' : 'Third Place'}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
