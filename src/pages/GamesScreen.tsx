import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FogBackground from '@/components/FogBackground';
import { Ghost, Puzzle, Flame, ArrowLeft, Trophy, Star } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import TapTheGhost from '@/components/games/TapTheGhost';
import ShadowPuzzle from '@/components/games/ShadowPuzzle';
import MemoryCandle from '@/components/games/MemoryCandle';

type GameType = 'tap-ghost' | 'shadow-puzzle' | 'memory-candle' | null;

const GamesScreen = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const { gameHistory } = useGameStore();

  const games = [
    {
      id: 'tap-ghost' as GameType,
      name: 'Tap the Ghost',
      description: 'Catch the ghostly wisps before they vanish!',
      icon: Ghost,
      color: 'accent',
      xpRange: '6-10 XP',
    },
    {
      id: 'shadow-puzzle' as GameType,
      name: 'Shadow Puzzle',
      description: 'Arrange the shadow pieces to complete the picture.',
      icon: Puzzle,
      color: 'primary',
      xpRange: '8-10 XP',
    },
    {
      id: 'memory-candle' as GameType,
      name: 'Memory Candle',
      description: 'Remember the flickering pattern of candles.',
      icon: Flame,
      color: 'candle-flame',
      xpRange: '6-10 XP',
    },
  ];

  const getRecentScore = (gameId: string) => {
    const recentGame = gameHistory.find(g => g.gameId === gameId);
    return recentGame?.score;
  };

  const handleGameComplete = () => {
    setActiveGame(null);
  };

  if (activeGame) {
    return (
      <FogBackground intensity="light">
        <div className="min-h-screen pb-24">
          {/* Game Header */}
          <motion.header
            className="flex items-center gap-4 p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveGame(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-spooky text-gradient-spooky">
              {games.find(g => g.id === activeGame)?.name}
            </h1>
          </motion.header>

          {/* Game Content */}
          <AnimatePresence mode="wait">
            {activeGame === 'tap-ghost' && (
              <TapTheGhost onComplete={handleGameComplete} />
            )}
            {activeGame === 'shadow-puzzle' && (
              <ShadowPuzzle onComplete={handleGameComplete} />
            )}
            {activeGame === 'memory-candle' && (
              <MemoryCandle onComplete={handleGameComplete} />
            )}
          </AnimatePresence>
        </div>
      </FogBackground>
    );
  }

  return (
    <FogBackground intensity="light">
      <div className="min-h-screen pb-24 pt-6 px-4">
        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-spooky text-gradient-spooky mb-2">
            Games Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Play games to earn XP and unlock new items!
          </p>
        </motion.header>

        {/* Games Grid */}
        <div className="space-y-4">
          {games.map((game, index) => {
            const Icon = game.icon;
            const recentScore = getRecentScore(game.id!);

            return (
              <motion.button
                key={game.id}
                className="w-full glass-card p-4 text-left group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-xl bg-${game.color}/20 flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-7 h-7 text-${game.color}`} />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <Star className="w-3 h-3" />
                        {game.xpRange}
                      </span>
                      {recentScore !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-accent">
                          <Trophy className="w-3 h-3" />
                          Best: {recentScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Play indicator */}
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-primary border-b-[6px] border-b-transparent ml-1" />
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Game History Summary */}
        {gameHistory.length > 0 && (
          <motion.div
            className="mt-8 glass-card p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Recent Activity
            </h3>
            <div className="space-y-2">
              {gameHistory.slice(0, 3).map((game, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{game.gameName}</span>
                  <span className="text-primary">+{game.xpEarned} XP</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </FogBackground>
  );
};

export default GamesScreen;
