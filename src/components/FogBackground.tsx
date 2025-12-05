import { motion } from 'framer-motion';

interface FogBackgroundProps {
  intensity?: 'light' | 'medium' | 'heavy';
  children?: React.ReactNode;
}

const FogBackground = ({ intensity = 'medium', children }: FogBackgroundProps) => {
  const opacityMap = {
    light: 0.15,
    medium: 0.25,
    heavy: 0.4,
  };

  const baseOpacity = opacityMap[intensity];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(260 30% 8%) 0%, 
            hsl(260 35% 5%) 50%,
            hsl(260 40% 3%) 100%
          )`,
        }}
      />

      {/* Stars layer */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, hsl(45 100% 90%) 0%, hsl(45 50% 70%) 100%)',
          boxShadow: '0 0 60px hsl(45 100% 80% / 0.4), 0 0 100px hsl(45 100% 70% / 0.2)',
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Fog layer 1 - slow drift */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 10% 90%, hsl(260 20% 30% / ${baseOpacity}) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 90% 80%, hsl(260 15% 35% / ${baseOpacity * 0.8}) 0%, transparent 45%)
          `,
        }}
        animate={{
          x: ['-5%', '5%', '-5%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fog layer 2 - medium drift */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 30% 85%, hsl(260 25% 25% / ${baseOpacity * 0.7}) 0%, transparent 55%),
            radial-gradient(ellipse 60% 35% at 70% 75%, hsl(260 20% 28% / ${baseOpacity * 0.6}) 0%, transparent 50%)
          `,
        }}
        animate={{
          x: ['3%', '-8%', '3%'],
          y: ['0%', '-2%', '0%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fog layer 3 - fast wisps */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 20% at 20% 95%, hsl(260 30% 35% / ${baseOpacity * 0.5}) 0%, transparent 60%),
            radial-gradient(ellipse 35% 25% at 80% 90%, hsl(260 25% 32% / ${baseOpacity * 0.4}) 0%, transparent 55%)
          `,
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating ghost particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`ghost-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              bottom: '10%',
            }}
            animate={{
              y: [0, -200 - Math.random() * 200],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 2,
              ease: 'easeOut',
            }}
          >
            <div 
              className="w-4 h-6 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.3) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(260 40% 3% / 0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FogBackground;
