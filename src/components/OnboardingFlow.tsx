import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/appStore';
import { sports } from '@/data/sports';
import { baseAvatars, defaultAvatar } from '@/data/avatars';
import { GamifiedButtonV2 } from './ui/GamifiedButtonV2';
import { GamifiedCardV2 } from './ui/GamifiedCardV2';
import { GamifiedProgressBar } from './ui/GamifiedProgressBar';
import { ArrowRight, Check, CheckCircle, User, Link as LinkIcon, Award, PartyPopper } from 'lucide-react';

const steps = ['Avatar', 'Name', 'ABHA', 'Sports', 'Confirm'];

export const OnboardingFlow: React.FC = () => {
  const { createUser, setError, setToast } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    abhaId: '',
    selectedSports: [] as string[],
    primarySport: '',
    avatar: defaultAvatar,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!formData.name.trim()) { setError('Please enter your name'); return; }
    if (formData.selectedSports.length === 0) { setError('Please select at least one sport'); return; }
    setIsSubmitting(true);
    try {
      await createUser({
        name: formData.name.trim(),
        abhaId: formData.abhaId.trim() || undefined,
        selectedSports: formData.selectedSports,
        primarySport: formData.primarySport || formData.selectedSports[0],
        avatar: formData.avatar,
      });
    } catch (error) {
      setError('Failed to create profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSportToggle = (sportId: string) => {
    const newSelected = formData.selectedSports.includes(sportId)
      ? formData.selectedSports.filter(id => id !== sportId)
      : [...formData.selectedSports, sportId];
    
    const primarySport = newSelected.length > 0 ? newSelected[0] : '';
    setFormData({ ...formData, selectedSports: newSelected, primarySport });
    if(newSelected.length === 1) {
        const sport = sports.find(s => s.id === primarySport);
        setToast(`Great! Your journey as a ${sport?.name} athlete begins now!`);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep]) {
      case 'Name': return formData.name.trim().length > 2;
      case 'Sports': return formData.selectedSports.length > 0;
      default: return true;
    }
  };

  const StepWrapper: React.FC<{ children: React.ReactNode; icon: React.ElementType; title: string; subtitle: string }> = ({ children, icon: Icon, title, subtitle }) => (
    <GamifiedCardV2 className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl text-white">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </GamifiedCardV2>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-grid">
      <div className="w-full max-w-lg mb-8">
        <GamifiedProgressBar progress={((currentStep + 1) / steps.length) * 100} label={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="w-full">
          {steps[currentStep] === 'Avatar' && (
            <StepWrapper icon={User} title="Create Your Identity" subtitle="Choose an avatar that represents you.">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {baseAvatars.map(avatar => (
                  <motion.button key={avatar.id} onClick={() => setFormData({...formData, avatar: { ...formData.avatar, base: avatar.id }})}
                    className={`p-4 rounded-xl border-2 transition-all text-center relative bg-card/50 ${formData.avatar.base === avatar.id ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary/50'}`}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <div className="text-6xl mb-2">{avatar.icon}</div>
                    <div className="text-foreground font-semibold text-sm">{avatar.name}</div>
                    {formData.avatar.base === avatar.id && <CheckCircle className="absolute top-2 right-2 text-primary bg-background rounded-full" />}
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}
          {steps[currentStep] === 'Name' && (
            <StepWrapper icon={User} title="What's Your Name, Athlete?" subtitle="This will be displayed on leaderboards.">
              <Label htmlFor="name" className="text-muted-foreground">Athlete Name</Label>
              <Input id="name" type="text" placeholder="e.g., 'The Flash' Arjun" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2 bg-input text-foreground placeholder:text-muted-foreground text-lg h-12" autoFocus />
            </StepWrapper>
          )}
          {steps[currentStep] === 'ABHA' && (
            <StepWrapper icon={LinkIcon} title="Link ABHA ID (Optional)" subtitle="Securely connect to official SAI schemes.">
              <Label htmlFor="abha" className="text-muted-foreground">ABHA ID</Label>
              <Input id="abha" type="text" placeholder="Your ABHA ID" value={formData.abhaId} onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })} className="mt-2 bg-input text-foreground placeholder:text-muted-foreground h-12" />
              <a href="https://abha.abdm.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary mt-3 inline-block hover:underline">What is ABHA? Create one here.</a>
            </StepWrapper>
          )}
          {steps[currentStep] === 'Sports' && (
            <StepWrapper icon={Award} title="Choose Your Disciplines" subtitle="Select your sports. The first choice is your primary.">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sports.map((sport) => (
                  <motion.button key={sport.id} onClick={() => handleSportToggle(sport.id)}
                    className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden bg-card/50 ${formData.selectedSports.includes(sport.id) ? 'border-primary ring-2 ring-primary scale-105' : 'border-border hover:border-primary/50'}`}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {formData.selectedSports.includes(sport.id) && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center"><Check size={16} /></div>
                    )}
                    <div className="text-5xl mb-2">{sport.icon}</div>
                    <div className="text-foreground font-semibold">{sport.name}</div>
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}
          {steps[currentStep] === 'Confirm' && (
            <StepWrapper icon={PartyPopper} title="Setup Complete!" subtitle="Your journey begins now.">
              <div className="text-center space-y-4 py-8">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type: 'spring', stiffness: 200}} className="text-8xl">🏆</motion.div>
                <p className="text-3xl text-white">Welcome, <strong className="text-primary text-glow">{formData.name}</strong>!</p>
                <div className="bg-muted/30 rounded-lg p-4 mt-4 inline-block">
                  <p className="text-sm text-muted-foreground">Starter Pack Unlocked:</p>
                  <div className="flex justify-center gap-6 mt-2 text-xl">
                    <span className="text-coin font-bold">💰 100</span>
                    <span className="text-xp font-bold">⭐ Level 1</span>
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8 w-full max-w-lg">
        <GamifiedButtonV2 variant="secondary" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}>Back</GamifiedButtonV2>
        <GamifiedButtonV2 onClick={handleNext} disabled={!canProceed() || isSubmitting}>
          {isSubmitting ? 'Loading...' : (steps[currentStep] === 'Confirm' ? 'Enter the Arena' : 'Continue')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </GamifiedButtonV2>
      </div>
    </div>
  );
};
