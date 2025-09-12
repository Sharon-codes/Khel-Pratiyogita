import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { SportCard } from './SportCard';
import { sports } from '@/data/sports';
import { Sport, User } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [primarySport, setPrimarySport] = useState<Sport | null>(null);

  const handleSportSelect = (sport: Sport) => {
    if (selectedSports.find(s => s.id === sport.id)) {
      setSelectedSports(prev => prev.filter(s => s.id !== sport.id));
      if (primarySport?.id === sport.id) {
        setPrimarySport(null);
      }
    } else {
      setSelectedSports(prev => [...prev, sport]);
      if (!primarySport) {
        setPrimarySport(sport);
      }
    }
  };

  const handleComplete = () => {
    if (primarySport && selectedSports.length > 0 && name) {
      onComplete({
        name,
        abhaId,
        primarySport,
        selectedSports,
        level: 1,
        skillPoints: 0,
        coins: 100, // Starting coins
        badges: [],
        avatar: '👤',
        streakDays: 0
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.length > 0;
      case 2: return true; // ABHA ID is optional
      case 3: return selectedSports.length > 0 && primarySport;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome, Future Star! 🌟</h2>
                <p className="text-muted-foreground">Let's start your journey to greatness</p>
              </div>
              
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">What should we call you?</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => setStep(2)}
                    disabled={!canProceed()}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Link Your ABHA ID 🆔</h2>
                <p className="text-muted-foreground">
                  Connect to official SAI schemes and get verified
                </p>
              </div>
              
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="abha">ABHA ID (Optional)</Label>
                    <Input
                      id="abha"
                      placeholder="Enter your ABHA ID"
                      value={abhaId}
                      onChange={(e) => setAbhaId(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm mb-3">Don't have an ABHA ID?</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Create ABHA ID
                    </Button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>
                      Continue
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Choose Your Sports 🏆</h2>
                <p className="text-muted-foreground">
                  Select your sports. The first one becomes your primary sport.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {sports.map((sport) => (
                  <SportCard
                    key={sport.id}
                    sport={sport}
                    isSelected={selectedSports.some(s => s.id === sport.id)}
                    onSelect={handleSportSelect}
                  />
                ))}
              </div>

              {primarySport && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/10 rounded-lg border border-primary/20"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      Primary Sport: {primarySport.name}
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleComplete}
                  disabled={!canProceed()}
                >
                  Start Your Journey!
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
