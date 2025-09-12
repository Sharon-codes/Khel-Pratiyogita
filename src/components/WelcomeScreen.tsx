import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
            Khel Pratiyogita
          </h1>
          <p className="text-lg text-muted-foreground">
            From Gully ka Khiladi to National Star
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl"
      >
        <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur">
          <Trophy className="w-12 h-12 text-primary mb-3" />
          <h3 className="font-semibold mb-2">AI-Powered Assessment</h3>
          <p className="text-sm text-muted-foreground text-center">
            Advanced on-device AI analyzes your performance in real-time
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur">
          <Zap className="w-12 h-12 text-secondary mb-3" />
          <h3 className="font-semibold mb-2">Gamified Journey</h3>
          <p className="text-sm text-muted-foreground text-center">
            Unlock badges, earn coins, and climb the leaderboards
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur">
          <Target className="w-12 h-12 text-accent mb-3" />
          <h3 className="font-semibold mb-2">SAI Recognition</h3>
          <p className="text-sm text-muted-foreground text-center">
            Get discovered by Sports Authority of India scouts
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Button 
          size="lg" 
          className="text-lg px-12 py-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl"
          onClick={onGetStarted}
        >
          Get Started
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-sm text-muted-foreground mt-8 max-w-md"
      >
        Join thousands of aspiring athletes on their journey to greatness. 
        Your sports career starts here.
      </motion.p>
    </div>
  );
}
