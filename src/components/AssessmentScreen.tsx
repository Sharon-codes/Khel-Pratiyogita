import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Test, Assessment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ArrowLeft, CheckCircle, Zap, Coins } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface AssessmentScreenProps {
  user: User;
  onBack: () => void;
  onComplete: (assessment: Assessment) => void;
}

export function AssessmentScreen({ user, onBack, onComplete }: AssessmentScreenProps) {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [results, setResults] = useState<Assessment | null>(null);

  const availableTests = user.selectedSports.flatMap(sport => sport.tests);

  const startRecording = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsRecording(true);
          
          // Simulate recording duration
          setTimeout(() => {
            setIsRecording(false);
            setIsProcessing(true);
            processVideo();
          }, 5000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const processVideo = () => {
    // Simulate AI processing
    setTimeout(() => {
      const mockAssessment: Assessment = {
        id: faker.string.uuid(),
        userId: user.id,
        testId: selectedTest!.id,
        score: Math.floor(faker.number.float({ min: 65, max: 95 }) * 10) / 10,
        skillPoints: faker.number.int({ min: 50, max: 150 }),
        coins: faker.number.int({ min: 20, max: 80 }),
        timestamp: new Date(),
        videoMetadata: {
          duration: faker.number.int({ min: 30, max: 120 }),
          frameRate: 30,
          resolution: '1920x1080'
        },
        metrics: {
          technique: faker.number.float({ min: 7, max: 10 }),
          power: faker.number.float({ min: 6, max: 9 }),
          accuracy: faker.number.float({ min: 7, max: 10 }),
          consistency: faker.number.float({ min: 6, max: 9 })
        }
      };
      
      setResults(mockAssessment);
      setIsProcessing(false);
      setShowResults(true);
    }, 3000);
  };

  const handleComplete = () => {
    if (results) {
      onComplete(results);
    }
  };

  if (showResults && results) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background p-6 flex items-center justify-center"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Amazing Performance!</h2>
            <p className="text-muted-foreground">Your results are in</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {results.score}/100
                </div>
                <p className="text-muted-foreground">Overall Score</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold">+{results.skillPoints}</div>
                  <div className="text-xs text-muted-foreground">Skill Points</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <Coins className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <div className="font-bold">+{results.coins}</div>
                  <div className="text-xs text-muted-foreground">Coins</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Performance Breakdown</h3>
                {Object.entries(results.metrics).map(([metric, value]) => (
                  <div key={metric} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{metric}</span>
                      <span>{value.toFixed(1)}/10</span>
                    </div>
                    <Progress value={(value / 10) * 100} />
                  </div>
                ))}
              </div>

              <Button className="w-full" onClick={handleComplete}>
                Continue
              </Button>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
          />
          <h3 className="text-xl font-bold mb-2">AI Processing Your Performance</h3>
          <p className="text-muted-foreground">Analyzing video and calculating scores...</p>
        </motion.div>
      </div>
    );
  }

  if (isRecording || countdown > 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        {/* Camera Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Recording Indicator */}
        {isRecording && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute top-6 left-6 flex items-center space-x-2"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-white font-semibold">REC</span>
          </motion.div>
        )}

        {/* Countdown */}
        {countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="text-8xl font-bold text-white"
          >
            {countdown}
          </motion.div>
        )}

        {/* Instructions Overlay */}
        {selectedTest && isRecording && (
          <div className="absolute bottom-20 left-6 right-6">
            <Card className="p-4 bg-black/80 backdrop-blur border-white/20">
              <p className="text-white text-center">
                {selectedTest.instructions[0]}
              </p>
            </Card>
          </div>
        )}

        {/* Stop Recording Button */}
        {isRecording && (
          <Button
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
            variant="destructive"
            size="lg"
            onClick={() => {
              setIsRecording(false);
              setIsProcessing(true);
              processVideo();
            }}
          >
            Stop Recording
          </Button>
        )}
      </div>
    );
  }

  if (selectedTest) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTest(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{selectedTest.name}</h2>
            <p className="text-muted-foreground mb-4">{selectedTest.description}</p>
            
            <Badge className="mb-4">
              {selectedTest.difficulty} • {selectedTest.duration}s
            </Badge>

            <div className="space-y-4">
              <h3 className="font-semibold">Instructions:</h3>
              <ol className="space-y-2">
                {selectedTest.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Ready to Record?</h3>
            <p className="text-muted-foreground mb-6">
              Make sure you have good lighting and your device is stable
            </p>
            <Button size="lg" onClick={startRecording} className="w-full">
              Start Assessment
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Choose Your Assessment</h2>
          <p className="text-muted-foreground">
            Select a test to measure your performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedTest(test)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{test.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {test.description}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {user.selectedSports.find(s => s.id === test.sportId)?.icon}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{test.difficulty}</Badge>
                    <Badge variant="outline">{test.duration}s</Badge>
                  </div>
                  <Button size="sm">
                    Select
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
