import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Star, Sparkles } from 'lucide-react';

interface XPBarProps {
  compact?: boolean;
}

const XPBar = ({ compact = false }: XPBarProps) => {
  const { shadow } = useGameStore();
  const progress = (shadow.xp / shadow.xpToNextLevel) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-primary">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-bold text-sm">{shadow.level}</span>
        </div>
        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-candle-flame"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3">
      {/* Level display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-5 h-5 text-primary fill-current" />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground">Level</p>
            <p className="text-xl font-bold font-spooky text-primary">{shadow.level}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-muted-foreground">XP</p>
          <p className="text-sm font-medium">
            <span className="text-primary">{shadow.xp}</span>
            <span className="text-muted-foreground"> / {shadow.xpToNextLevel}</span>
          </p>
        </div>
      </div>

      {/* XP bar */}
      <div className="relative">
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--candle-flame)) 50%, hsl(var(--primary)) 100%)',
              backgroundSize: '200% 100%',
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${progress}%`,
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
            }}
            transition={{ 
              width: { duration: 0.5, ease: 'easeOut' },
              backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                backgroundSize: '50% 100%',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Sparkle at end of bar */}
        {progress > 10 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${Math.min(progress, 98)}% - 8px)` }}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-candle-flame" />
          </motion.div>
        )}
      </div>

      {/* Next level preview */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3" />
        <span>{shadow.xpToNextLevel - shadow.xp} XP to level {shadow.level + 1}</span>
      </div>
    </div>
  );
};

export default XPBar;
