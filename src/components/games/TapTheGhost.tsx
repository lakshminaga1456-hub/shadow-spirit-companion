import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { Ghost, Star, Timer } from 'lucide-react';

interface TapTheGhostProps {
  onComplete: () => void;
}

interface GhostEntity {
  id: number;
  x: number;
  y: number;
  size: number;
  points: number;
}

const TapTheGhost = ({ onComplete }: TapTheGhostProps) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [ghosts, setGhosts] = useState<GhostEntity[]>([]);
  const { addXP, addGameScore } = useGameStore();

  const spawnGhost = useCallback(() => {
    const id = Date.now();
    const ghost: GhostEntity = {
      id,
      x: 10 + Math.random() * 70,
      y: 10 + Math.random() * 60,
      size: 40 + Math.random() * 30,
      points: Math.floor(Math.random() * 3) + 1,
    };
    setGhosts(prev => [...prev, ghost]);

    // Remove ghost after delay
    setTimeout(() => {
      setGhosts(prev => prev.filter(g => g.id !== id));
    }, 1500 + Math.random() * 1000);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setGhosts([]);
  };

  const catchGhost = (ghostId: number, points: number) => {
    setGhosts(prev => prev.filter(g => g.id !== ghostId));
    setScore(prev => prev + points);
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    
    // Calculate XP (6-10 based on score)
    const xpEarned = Math.min(10, Math.max(6, Math.floor(score / 5) + 6));
    addXP(xpEarned);
    
    addGameScore({
      gameId: 'tap-ghost',
      gameName: 'Tap the Ghost',
      score,
      xpEarned,
      playedAt: new Date(),
    });
  }, [score, addXP, addGameScore]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  // Ghost spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawner = setInterval(() => {
      if (ghosts.length < 5) {
        spawnGhost();
      }
    }, 800);

    return () => clearInterval(spawner);
  }, [gameState, ghosts.length, spawnGhost]);

  if (gameState === 'ready') {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Ghost className="w-12 h-12 text-accent" />
        </motion.div>
        
        <h2 className="text-2xl font-spooky text-foreground mb-2">
          Tap the Ghost
        </h2>
        <p className="text-muted-foreground text-center mb-6 max-w-xs">
          Tap the ghostly wisps as they appear! Bigger ghosts give more points.
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            30 seconds
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            6-10 XP
          </span>
        </div>

        <Button variant="spooky" size="xl" onClick={startGame}>
          Start Game
        </Button>
      </motion.div>
    );
  }

  if (gameState === 'ended') {
    const xpEarned = Math.min(10, Math.max(6, Math.floor(score / 5) + 6));

    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          👻
        </motion.div>
        
        <h2 className="text-3xl font-spooky text-gradient-spooky mb-2">
          Time's Up!
        </h2>
        
        <div className="glass-card p-6 text-center my-6">
          <p className="text-4xl font-bold text-primary mb-2">{score}</p>
          <p className="text-muted-foreground">Points</p>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-accent">
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
      className="relative h-[70vh] mx-4 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(260 30% 10%) 0%, hsl(260 35% 5%) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          <span className="font-bold">{score}</span>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Timer className="w-4 h-4 text-accent" />
          <span className="font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Game Area */}
      <AnimatePresence>
        {ghosts.map(ghost => (
          <motion.button
            key={ghost.id}
            className="absolute cursor-pointer"
            style={{
              left: `${ghost.x}%`,
              top: `${ghost.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => catchGhost(ghost.id, ghost.points)}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Ghost
                className="text-accent drop-shadow-[0_0_15px_hsl(var(--accent))]"
                style={{ width: ghost.size, height: ghost.size }}
              />
              {ghost.points > 1 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {ghost.points}
                </span>
              )}
            </motion.div>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TapTheGhost;
