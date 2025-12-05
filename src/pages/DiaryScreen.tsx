import { useEffect } from 'react';
import { motion } from 'framer-motion';
import FogBackground from '@/components/FogBackground';
import { useGameStore, getRandomMysteriousLine } from '@/stores/gameStore';
import { BookOpen, Heart, Sparkles, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const DiaryScreen = () => {
  const { diary, todayLine, setTodayLine, addDiaryEntry, toggleFavorite } = useGameStore();

  // Generate today's line if not exists and save to diary
  useEffect(() => {
    const today = new Date().toDateString();
    const todayEntry = diary.find(e => new Date(e.date).toDateString() === today);
    
    if (!todayEntry) {
      const line = todayLine || getRandomMysteriousLine();
      if (!todayLine) setTodayLine(line);
      
      addDiaryEntry({
        id: `diary_${Date.now()}`,
        date: new Date(),
        line,
        isFavorite: false,
      });
    }
  }, [diary, todayLine, setTodayLine, addDiaryEntry]);

  return (
    <FogBackground intensity="light">
      <div className="min-h-screen pb-24 pt-6 px-4">
        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <BookOpen className="w-5 h-5 text-accent" />
            </motion.div>
            <h1 className="text-3xl font-spooky text-gradient-ghost">
              Shadow Diary
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Mysterious whispers collected through time...
          </p>
        </motion.header>

        {/* Today's Entry */}
        {todayLine && (
          <motion.div
            className="glass-card p-5 mb-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="flex items-start gap-3 relative z-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-accent" />
              </motion.div>
              <div>
                <p className="text-xs text-accent font-medium mb-2">Today's Whisper</p>
                <p className="text-foreground italic text-lg leading-relaxed">
                  "{todayLine}"
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Diary Entries */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Past Whispers
          </h2>

          {diary.length === 0 ? (
            <motion.div
              className="glass-card p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">
                Your diary awaits its first whisper...
              </p>
            </motion.div>
          ) : (
            diary.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="glass-card p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {format(new Date(entry.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-foreground/90 italic">
                      "{entry.line}"
                    </p>
                  </div>
                  <motion.button
                    className={`p-2 rounded-full transition-colors ${
                      entry.isFavorite 
                        ? 'bg-destructive/20 text-destructive' 
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => toggleFavorite(entry.id)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart 
                      className="w-4 h-4" 
                      fill={entry.isFavorite ? 'currentColor' : 'none'}
                    />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Favorites section */}
        {diary.filter(e => e.isFavorite).length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-destructive" />
              Favorite Whispers
            </h2>
            <div className="flex flex-wrap gap-2">
              {diary
                .filter(e => e.isFavorite)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-xs text-foreground/80"
                  >
                    {entry.line.slice(0, 30)}...
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </FogBackground>
  );
};

export default DiaryScreen;
