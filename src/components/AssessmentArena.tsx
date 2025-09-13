import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { testEngine } from '@/engine/testEngine';
import { X, Pause, Play, Check, AlertTriangle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GamifiedButtonV2 } from './ui/GamifiedButtonV2';

const ArenaOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col p-4 md:p-8 z-20">
    {children}
  </div>
);

const Countdown: React.FC<{ count: number }> = ({ count }) => (
  <motion.div key="countdown" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="text-9xl font-display text-white text-glow">
    {count}
  </motion.div>
);

const Instruction: React.FC<{ text: string }> = ({ text }) => (
  <motion.div key="instruction" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-3xl font-semibold text-center text-white bg-black/30 p-4 rounded-lg">
    {text}
  </motion.div>
);

const Analyzing: React.FC = () => (
  <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
    <div className="w-24 h-24 relative mb-4">
      <motion.div className="absolute inset-0 border-4 border-primary/50 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}/>
      <motion.div className="absolute inset-2 border-4 border-secondary/50 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}/>
      <div className="absolute inset-0 flex items-center justify-center"><Target className="w-10 h-10 text-white" /></div>
    </div>
    <h2 className="text-2xl font-bold text-white">Analyzing Performance</h2>
    <p className="text-muted-foreground">AI modules processing biometric data...</p>
  </motion.div>
);

const RecordingUI: React.FC<{ remainingTime: number; duration: number; onPause: () => void; }> = ({ remainingTime, duration, onPause }) => (
  <>
    <div className="absolute top-4 right-4 flex gap-2">
      <div className="bg-red-500/80 text-white font-mono text-lg px-4 py-2 rounded-lg flex items-center gap-2">
        <motion.div className="w-3 h-3 bg-white rounded-full" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <span>{(remainingTime / 1000).toFixed(1)}s</span>
      </div>
      <GamifiedButtonV2 onClick={onPause} className="!p-0 w-12 h-12" variant="secondary"><Pause /></GamifiedButtonV2>
    </div>
    <div className="absolute bottom-4 left-4 right-4">
      <div className="w-full bg-white/10 rounded-full h-2.5">
        <motion.div className="bg-gradient-to-r from-red-500 to-orange-500 h-2.5 rounded-full" style={{ width: `${(remainingTime / (duration * 1000)) * 100}%` }} />
      </div>
    </div>
  </>
);

export const AssessmentArena: React.FC = () => {
  const { user, activeTestSpec, completeAssessment, setScreen } = useAppStore();
  const [countdown, setCountdown] = useState(3);
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [status, setStatus] = useState<'countdown' | 'instructions' | 'recording' | 'paused' | 'analyzing'>('countdown');
  const [remainingTime, setRemainingTime] = useState(0);
  const [feedback, setFeedback] = useState<{id: number, text: string, icon: React.ElementType} | null>(null);

  useEffect(() => {
    if (!activeTestSpec || !user) {
      setScreen('assessment');
      return;
    }

    let timer: NodeJS.Timeout;

    if (status === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (status === 'countdown' && countdown === 0) {
      setStatus('instructions');
    } else if (status === 'instructions' && instructionIndex < activeTestSpec.instructions.length) {
      timer = setTimeout(() => setInstructionIndex(i => i + 1), 2500);
    } else if (status === 'instructions' && instructionIndex >= activeTestSpec.instructions.length) {
      setStatus('recording');
      testEngine.dispatch({ type: 'START', testId: activeTestSpec.id, userId: user.id }, activeTestSpec);
    } else if (status === 'recording') {
      // Simulate AI feedback
      if (Math.random() < 0.1 && !feedback) {
        const feedbacks = [{text: "Great Form!", icon: Check}, {text: "Adjust Angle!", icon: AlertTriangle}];
        const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        setFeedback({id: Date.now(), ...randomFeedback});
        setTimeout(() => setFeedback(null), 2000);
      }
    }

    return () => clearTimeout(timer);
  }, [status, countdown, instructionIndex, activeTestSpec, user, setScreen, feedback]);
  
  useEffect(() => {
    const unsubscribe = testEngine.subscribe(attempt => {
      if (!attempt) {
        setScreen('assessment');
        return;
      }
      setRemainingTime(testEngine.getRemainingTime());
      if (attempt.state === 'completed' && status !== 'analyzing') {
        setStatus('analyzing');
        setTimeout(() => completeAssessment(attempt), 3000); // Simulate analysis time
      }
    });

    return unsubscribe;
  }, [completeAssessment, setScreen, status]);

  const handleCancel = () => {
    testEngine.dispatch({ type: 'CANCEL' });
  };

  const handlePause = () => {
    testEngine.dispatch({ type: 'PAUSE' });
    setStatus('paused');
  };
  
  const handleResume = () => {
    testEngine.dispatch({ type: 'RESUME' });
    setStatus('recording');
  };

  if (!activeTestSpec) return null;

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gray-800 bg-cover bg-center opacity-30" 
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop)'}}
        animate={{ scale: 1.1 }}
        transition={{ duration: activeTestSpec.duration + 5, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-black/50 p-3 rounded-lg flex items-center gap-2"
          >
            <feedback.icon className={cn("w-5 h-5", feedback.icon === Check ? "text-green-400" : "text-yellow-400")} />
            <span>{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ArenaOverlay>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white text-glow">{activeTestSpec.name}</h1>
            <p className="text-muted-foreground">{activeTestSpec.sportId.charAt(0).toUpperCase() + activeTestSpec.sportId.slice(1)} Assessment</p>
          </div>
          <GamifiedButtonV2 onClick={handleCancel} className="!p-0 w-12 h-12"><X /></GamifiedButtonV2>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'countdown' && <Countdown count={countdown} />}
            {status === 'instructions' && <Instruction text={activeTestSpec.instructions[instructionIndex]} />}
            {status === 'analyzing' && <Analyzing />}
            {status === 'paused' && (
              <motion.div key="paused" initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col items-center gap-4">
                <h2 className="text-4xl font-bold">PAUSED</h2>
                <GamifiedButtonV2 onClick={handleResume}><Play className="mr-2"/> Resume</GamifiedButtonV2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {status === 'recording' && <RecordingUI remainingTime={remainingTime} duration={activeTestSpec.duration} onPause={handlePause} />}
      </ArenaOverlay>
    </div>
  );
};
