import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { AppScreen } from '@/types';
import { BarChart3, Swords, User as UserIcon, Home } from 'lucide-react';

const navItems: { screen: AppScreen; label: string; icon: React.ElementType }[] = [
  { screen: 'hub', label: 'Hub', icon: Home },
  { screen: 'assessment', label: 'Assess', icon: BarChart3 },
  { screen: 'leaderboard', label: 'Compete', icon: Swords },
  { screen: 'profile', label: 'Profile', icon: UserIcon },
];

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/70 backdrop-blur-xl border-t-2 border-border z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <motion.button
              key={item.screen}
              onClick={() => setScreen(item.screen)}
              className="flex flex-col items-center justify-center w-full h-full text-muted-foreground relative transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
              whileHover={{ color: 'hsl(var(--primary))' }}
            >
              <item.icon size={28} className={`transition-all duration-300 ${isActive ? 'text-primary -translate-y-1' : ''}`} />
              <span className={`text-xs mt-1 transition-all duration-300 ${isActive ? 'text-primary opacity-100' : 'opacity-0'}`}>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute top-0 h-1 w-10 bg-primary rounded-b-full"
                  style={{boxShadow: '0 0 10px hsl(var(--primary))'}}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </nav>
  );
};
