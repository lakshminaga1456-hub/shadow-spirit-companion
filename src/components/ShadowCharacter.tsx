import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

interface ShadowCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const ShadowCharacter = ({ size = 'lg', interactive = true }: ShadowCharacterProps) => {
  const controls = useAnimation();
  const [tapCount, setTapCount] = useState(0);
  const { shadow, recordInteraction, updateMood, addXP } = useGameStore();
  const [isNightMode, setIsNightMode] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
  };

  const eyeSize = {
    sm: 'w-3 h-4',
    md: 'w-5 h-6',
    lg: 'w-8 h-10',
  };

  // Check for night mode (after 7 PM)
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsNightMode(hour >= 19 || hour < 6);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Idle animation
  useEffect(() => {
    const idleAnimation = async () => {
      while (true) {
        await controls.start({
          y: [0, -15, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 3, ease: 'easeInOut' },
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };
    idleAnimation();
  }, [controls]);

  // Handle tap interaction
  const handleTap = useCallback(async () => {
    if (!interactive) return;

    setTapCount(prev => prev + 1);
    recordInteraction();

    // Reaction animation
    await controls.start({
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -5, 5, -3, 0],
      transition: { duration: 0.5 },
    });

    // Change mood based on interaction
    if (tapCount > 10) {
      updateMood('excited');
    } else if (tapCount > 5) {
      updateMood('playful');
    }

    // Small XP reward for interaction (once per 10 taps)
    if (tapCount % 10 === 0 && tapCount > 0) {
      addXP(2);
    }
  }, [controls, interactive, recordInteraction, tapCount, updateMood, addXP]);

  // Get skin-based styling
  const getSkinStyle = () => {
    switch (shadow.currentSkin) {
      case 'ghost':
        return 'bg-gradient-to-b from-accent/30 to-accent/10';
      case 'pumpkin':
        return 'bg-gradient-to-b from-primary to-candle-flame';
      case 'bat':
        return 'bg-gradient-to-b from-secondary to-background';
      case 'witch':
        return 'bg-gradient-to-b from-accent to-primary/50';
      default:
        return 'bg-gradient-to-b from-foreground/80 to-foreground/40';
    }
  };

  const getMoodEyes = () => {
    switch (shadow.mood) {
      case 'excited':
        return { scaleY: 1.2, animate: true };
      case 'playful':
        return { scaleY: 1, animate: true };
      case 'sleepy':
        return { scaleY: 0.3, animate: false };
      default:
        return { scaleY: 1, animate: false };
    }
  };

  const moodEyes = getMoodEyes();

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} cursor-pointer select-none`}
      animate={controls}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      onClick={handleTap}
    >
      {/* Main shadow body */}
      <motion.div
        className={`absolute inset-0 rounded-full ${getSkinStyle()} shadow-creature`}
        style={{
          filter: isNightMode 
            ? 'drop-shadow(0 0 40px hsl(var(--primary) / 0.6))' 
            : 'drop-shadow(0 0 30px hsl(var(--primary) / 0.4))',
        }}
      >
        {/* Blob shape overlay */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="shadowGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse
            cx="50"
            cy="55"
            rx="45"
            ry="40"
            fill="url(#shadowGradient)"
          />
        </svg>
      </motion.div>

      {/* Eyes container */}
      <div className="absolute inset-0 flex items-center justify-center gap-6 pt-4">
        {/* Left eye */}
        <motion.div
          className={`${eyeSize[size]} bg-primary rounded-full relative overflow-hidden`}
          animate={moodEyes.animate ? {
            scaleY: [moodEyes.scaleY, moodEyes.scaleY * 0.8, moodEyes.scaleY],
          } : undefined}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ scaleY: moodEyes.scaleY }}
        >
          {/* Eye glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-candle-flame/50 to-transparent" />
          {/* Pupil */}
          <motion.div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-background rounded-full"
            animate={{ y: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Right eye */}
        <motion.div
          className={`${eyeSize[size]} bg-primary rounded-full relative overflow-hidden`}
          animate={moodEyes.animate ? {
            scaleY: [moodEyes.scaleY, moodEyes.scaleY * 0.8, moodEyes.scaleY],
          } : undefined}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
          style={{ scaleY: moodEyes.scaleY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-candle-flame/50 to-transparent" />
          <motion.div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-background rounded-full"
            animate={{ y: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
          />
        </motion.div>
      </div>

      {/* Floating particles around shadow */}
      {interactive && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/40"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </>
      )}

      {/* Night mode glow effect */}
      {isNightMode && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default ShadowCharacter;
