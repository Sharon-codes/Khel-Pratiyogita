import { Sport } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SportCardProps {
  sport: Sport;
  isSelected?: boolean;
  onSelect?: (sport: Sport) => void;
  disabled?: boolean;
}

export function SportCard({ sport, isSelected, onSelect, disabled }: SportCardProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'ring-2 ring-primary shadow-lg transform scale-105' 
            : 'hover:shadow-md'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && onSelect?.(sport)}
      >
        <div className={`h-32 ${sport.gradient} relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">{sport.icon}</span>
          </div>
          {isSelected && (
            <motion.div 
              className="absolute top-2 right-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Badge className="bg-primary text-primary-foreground">Selected</Badge>
            </motion.div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{sport.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{sport.description}</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{sport.tests.length} Tests</Badge>
            {onSelect && (
              <Button 
                size="sm" 
                variant={isSelected ? "default" : "outline"}
                disabled={disabled}
              >
                {isSelected ? 'Selected' : 'Select'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
