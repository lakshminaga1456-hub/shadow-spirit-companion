import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { Flame, Star, Brain } from 'lucide-react';

interface MemoryCandleProps {
  onComplete: () => void;
}

const MemoryCandle = ({ onComplete }: MemoryCandleProps) => {
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'input' | 'ended'>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(-1);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const { addXP, addGameScore } = useGameStore();

  const CANDLES = 4;

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * CANDLES));
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    startLevel(1);
  };

  const startLevel = (lvl: number) => {
    const newSequence = generateSequence(lvl + 2);
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setCurrentShowIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setCurrentShowIndex(-1);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    setGameState('input');
  };

  const handleCandleClick = (index: number) => {
    if (gameState !== 'input') return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check if correct so far
    const isCorrect = newPlayerSequence.every(
      (val, idx) => val === sequence[idx]
    );

    if (!isCorrect) {
      endGame();
      return;
    }

    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      const pointsEarned = level * 10;
      setScore(prev => prev + pointsEarned);

      if (level >= 5) {
        endGame(true);
      } else {
        setLevel(prev => prev + 1);
        setTimeout(() => startLevel(level + 1), 1000);
      }
    }
  };

  const endGame = (won = false) => {
    setGameState('ended');

    // Calculate XP
    const xpEarned = Math.min(10, Math.max(6, level + 5));
    addXP(xpEarned);

    addGameScore({
      gameId: 'memory-candle',
      gameName: 'Memory Candle',
      score,
      xpEarned,
      playedAt: new Date(),
    });
  };

  if (gameState === 'ready') {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-candle-flame/20 flex items-center justify-center mb-6"
          animate={{ 
            boxShadow: [
              '0 0 20px hsl(35 100% 55% / 0.3)',
              '0 0 40px hsl(35 100% 55% / 0.5)',
              '0 0 20px hsl(35 100% 55% / 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-12 h-12 text-candle-flame" />
        </motion.div>
        
        <h2 className="text-2xl font-spooky text-foreground mb-2">
          Memory Candle
        </h2>
        <p className="text-muted-foreground text-center mb-6 max-w-xs">
          Watch the candles flicker and repeat the pattern. The sequence grows longer each round!
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            5 Levels
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            6-10 XP
          </span>
        </div>

        <Button variant="spooky" size="xl" onClick={startGame}>
          Light the Candles
        </Button>
      </motion.div>
    );
  }

  if (gameState === 'ended') {
    const xpEarned = Math.min(10, Math.max(6, level + 5));

    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          {level >= 5 ? '🏆' : '🕯️'}
        </motion.div>
        
        <h2 className="text-3xl font-spooky text-gradient-spooky mb-2">
          {level >= 5 ? 'Perfect Memory!' : 'Game Over'}
        </h2>
        
        <div className="glass-card p-6 text-center my-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold text-primary">{level}</p>
              <p className="text-sm text-muted-foreground">Level</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-candle-flame">{score}</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-accent">
            <Star className="w-5 h-5" />
            <span className="font-semibold">+{xpEarned} XP earned!</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onComplete}>
            Back to Games
          </Button>
          <Button variant="spooky" onClick={startGame}>
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Stats */}
      <div className="flex gap-4 mb-8">
        <div className="glass-card px-4 py-2">
          <span className="text-sm text-muted-foreground">Level: </span>
          <span className="font-bold text-primary">{level}</span>
        </div>
        <div className="glass-card px-4 py-2">
          <span className="text-sm text-muted-foreground">Score: </span>
          <span className="font-bold text-candle-flame">{score}</span>
        </div>
      </div>

      {/* Status */}
      <motion.p
        className="text-lg font-medium mb-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {gameState === 'showing' ? 'Watch the pattern...' : 'Repeat the pattern!'}
      </motion.p>

      {/* Candles */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: CANDLES }).map((_, index) => {
          const isLit = currentShowIndex === index;
          const colors = [
            'hsl(32 100% 50%)', // Primary orange
            'hsl(150 100% 40%)', // Ghost green
            'hsl(0 70% 45%)', // Blood moon red
            'hsl(260 60% 60%)', // Purple
          ];

          return (
            <motion.button
              key={index}
              className="relative w-24 h-32 cursor-pointer"
              onClick={() => handleCandleClick(index)}
              whileTap={gameState === 'input' ? { scale: 0.95 } : undefined}
              disabled={gameState !== 'input'}
            >
              {/* Candle base */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-20 rounded-t-lg"
                style={{
                  background: `linear-gradient(180deg, ${colors[index]}40 0%, ${colors[index]}20 100%)`,
                  border: `2px solid ${colors[index]}60`,
                }}
              />

              {/* Flame */}
              <AnimatePresence>
                {isLit && (
                  <motion.div
                    className="absolute top-2 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <motion.div
                      className="w-8 h-12 rounded-full"
                      style={{
                        background: `radial-gradient(ellipse at bottom, ${colors[index]} 0%, transparent 70%)`,
                        boxShadow: `0 0 30px ${colors[index]}, 0 0 60px ${colors[index]}80`,
                      }}
                      animate={{
                        scaleX: [1, 0.8, 1.1, 1],
                        scaleY: [1, 1.2, 0.9, 1],
                      }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wick */}
              <div 
                className="absolute top-8 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-foreground/30"
              />

              {/* Glow when lit */}
              {isLit && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `radial-gradient(circle, ${colors[index]}30 0%, transparent 70%)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      {gameState === 'input' && (
        <div className="mt-8 flex gap-2">
          {sequence.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index < playerSequence.length
                  ? 'bg-accent'
                  : 'bg-secondary'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MemoryCandle;
