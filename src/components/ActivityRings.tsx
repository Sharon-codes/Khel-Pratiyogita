import { ActivityRing } from '@/types';
import { motion } from 'framer-motion';

interface ActivityRingsProps {
  rings: ActivityRing[];
}

export function ActivityRings({ rings }: ActivityRingsProps) {
  return (
    <div className="flex justify-center items-center space-x-4 py-6">
      {rings.map((ring, index) => (
        <motion.div
          key={ring.type}
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2, type: 'spring' }}
        >
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                className="opacity-30"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={ring.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={175.93}
                initial={{ strokeDashoffset: 175.93 }}
                animate={{ 
                  strokeDashoffset: 175.93 - (175.93 * ring.current / ring.target)
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-foreground">
                {Math.round((ring.current / ring.target) * 100)}%
              </span>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs font-medium capitalize">{ring.type}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
