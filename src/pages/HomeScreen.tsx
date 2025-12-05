import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ShadowCharacter from '@/components/ShadowCharacter';
import XPBar from '@/components/XPBar';
import FogBackground from '@/components/FogBackground';
import { useGameStore, getRandomMysteriousLine } from '@/stores/gameStore';
import { Sparkles, Moon, Flame } from 'lucide-react';

const HomeScreen = () => {
  const { shadow, user, todayLine, setTodayLine, addXP, festivalMode } = useGameStore();

  // Daily open XP bonus
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastDailyVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      addXP(5);
      localStorage.setItem('lastDailyVisit', today);
    }
  }, [addXP]);

  // Set today's mysterious line
  useEffect(() => {
    if (!todayLine) {
      setTodayLine(getRandomMysteriousLine());
    }
  }, [todayLine, setTodayLine]);

  return (
    <FogBackground intensity={festivalMode ? 'heavy' : 'medium'}>
      <div className="min-h-screen pb-24 pt-6 px-4">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h2 className="text-xl font-bold text-foreground">
              {user?.username || 'Shadow Friend'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {festivalMode && (
              <motion.div
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Flame className="w-3 h-3" />
                Festival!
              </motion.div>
            )}
            <Moon className="w-5 h-5 text-muted-foreground" />
          </div>
        </motion.header>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <XPBar />
        </motion.div>

        {/* Main Shadow Character */}
        <motion.div
          className="flex flex-col items-center justify-center py-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div className="relative">
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
                transform: 'scale(1.5)',
              }}
              animate={{
                scale: [1.5, 1.7, 1.5],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <ShadowCharacter size="lg" interactive />
          </div>

          {/* Mood indicator */}
          <motion.div
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>
              Your shadow feels{' '}
              <span className="text-primary font-medium">{shadow.mood}</span>
            </span>
          </motion.div>

          {/* Tap hint */}
          <motion.p
            className="mt-2 text-xs text-muted-foreground/60"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap to interact
          </motion.p>
        </motion.div>

        {/* Today's Mysterious Line */}
        {todayLine && (
          <motion.div
            className="glass-card p-4 mx-auto max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Flame className="w-4 h-4 text-accent" />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Today's Whisper</p>
                <p className="text-sm text-foreground italic">"{todayLine}"</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="glass-card p-3 text-center">
            <p className="text-2xl font-spooky text-primary">{shadow.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-2xl font-spooky text-accent">{shadow.unlockedSkins.length}</p>
            <p className="text-xs text-muted-foreground">Skins</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-2xl font-spooky text-candle-flame">{shadow.unlockedBackgrounds.length}</p>
            <p className="text-xs text-muted-foreground">Scenes</p>
          </div>
        </motion.div>
      </div>
    </FogBackground>
  );
};

export default HomeScreen;
