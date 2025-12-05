import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShadowCharacter from '@/components/ShadowCharacter';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 500);
    const taglineTimer = setTimeout(() => setShowTagline(true), 1200);
    const completeTimer = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: `
            radial-gradient(circle at 50% 40%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, hsl(var(--accent) / 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, hsl(var(--primary) / 0.08) 0%, transparent 35%)
          `,
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Shadow character */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 20,
          delay: 0.2,
        }}
        className="relative z-10"
      >
        <ShadowCharacter size="lg" interactive={false} />
      </motion.div>

      {/* Title */}
      <AnimatePresence>
        {showTitle && (
          <motion.h1
            className="mt-8 text-5xl md:text-6xl font-spooky text-gradient-spooky glow-text relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Shadow Companion
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Tagline */}
      <AnimatePresence>
        {showTagline && (
          <motion.p
            className="mt-4 text-lg text-muted-foreground text-center px-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Your spooky friend awaits...
          </motion.p>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <motion.div
        className="absolute bottom-20 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SplashScreen;
