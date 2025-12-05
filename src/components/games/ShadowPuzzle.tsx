import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { Puzzle, Star, RotateCcw } from 'lucide-react';

interface ShadowPuzzleProps {
  onComplete: () => void;
}

const GRID_SIZE = 3;
const WINNING_ARRANGEMENT = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const ShadowPuzzle = ({ onComplete }: ShadowPuzzleProps) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const { addXP, addGameScore } = useGameStore();

  const shuffleTiles = () => {
    let shuffled = [...WINNING_ARRANGEMENT];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ensure puzzle is solvable
    if (!isSolvable(shuffled)) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  };

  const isSolvable = (puzzle: number[]) => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length - 1; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const startGame = () => {
    setGameState('playing');
    setTiles(shuffleTiles());
    setMoves(0);
    setStartTime(Date.now());
  };

  const getEmptyIndex = () => tiles.indexOf(0);

  const canMove = (index: number) => {
    const emptyIndex = getEmptyIndex();
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;
    const tileRow = Math.floor(index / GRID_SIZE);
    const tileCol = index % GRID_SIZE;

    return (
      (Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
      (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow)
    );
  };

  const moveTile = (index: number) => {
    if (!canMove(index)) return;

    const emptyIndex = getEmptyIndex();
    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);
    setMoves(prev => prev + 1);

    // Check win
    if (JSON.stringify(newTiles) === JSON.stringify(WINNING_ARRANGEMENT)) {
      endGame();
    }
  };

  const endGame = () => {
    const time = Math.floor((Date.now() - startTime) / 1000);
    setTimeTaken(time);
    setGameState('ended');

    // Calculate XP (8-10 based on moves and time)
    const efficiency = Math.max(0, 100 - moves - time);
    const xpEarned = Math.min(10, Math.max(8, Math.floor(efficiency / 10) + 8));
    addXP(xpEarned);

    addGameScore({
      gameId: 'shadow-puzzle',
      gameName: 'Shadow Puzzle',
      score: Math.max(0, 1000 - moves * 10 - time * 5),
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
          className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6"
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Puzzle className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h2 className="text-2xl font-spooky text-foreground mb-2">
          Shadow Puzzle
        </h2>
        <p className="text-muted-foreground text-center mb-6 max-w-xs">
          Slide the tiles to arrange them in order. The empty space lets you move adjacent tiles.
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <Puzzle className="w-4 h-4" />
            3x3 Grid
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            8-10 XP
          </span>
        </div>

        <Button variant="spooky" size="xl" onClick={startGame}>
          Start Puzzle
        </Button>
      </motion.div>
    );
  }

  if (gameState === 'ended') {
    const efficiency = Math.max(0, 100 - moves - timeTaken);
    const xpEarned = Math.min(10, Math.max(8, Math.floor(efficiency / 10) + 8));

    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          🎉
        </motion.div>
        
        <h2 className="text-3xl font-spooky text-gradient-spooky mb-2">
          Puzzle Solved!
        </h2>
        
        <div className="glass-card p-6 text-center my-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold text-primary">{moves}</p>
              <p className="text-sm text-muted-foreground">Moves</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">{timeTaken}s</p>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary">
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
      <div className="flex gap-4 mb-6">
        <div className="glass-card px-4 py-2">
          <span className="text-sm text-muted-foreground">Moves: </span>
          <span className="font-bold text-primary">{moves}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={startGame}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Puzzle Grid */}
      <div 
        className="grid gap-2 p-4 rounded-2xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          background: 'linear-gradient(145deg, hsl(260 25% 12%), hsl(260 30% 8%))',
        }}
      >
        {tiles.map((tile, index) => (
          <motion.button
            key={index}
            className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-spooky transition-all ${
              tile === 0
                ? 'bg-transparent'
                : canMove(index)
                ? 'bg-secondary hover:bg-secondary/80 cursor-pointer shadow-glow'
                : 'bg-secondary/50 cursor-default'
            }`}
            onClick={() => moveTile(index)}
            whileTap={tile !== 0 && canMove(index) ? { scale: 0.95 } : undefined}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {tile !== 0 && (
              <span className={tile === index + 1 ? 'text-accent' : 'text-foreground'}>
                {tile}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Tap tiles next to the empty space to move them
      </p>
    </motion.div>
  );
};

export default ShadowPuzzle;
