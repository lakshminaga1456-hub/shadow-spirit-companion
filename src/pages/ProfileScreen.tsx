import { motion } from 'framer-motion';
import FogBackground from '@/components/FogBackground';
import ShadowCharacter from '@/components/ShadowCharacter';
import XPBar from '@/components/XPBar';
import { useGameStore } from '@/stores/gameStore';
import { User, Palette, Image, Trophy, Star, Lock } from 'lucide-react';

const ProfileScreen = () => {
  const { 
    user, 
    shadow, 
    gameHistory,
    availableSkins, 
    availableBackgrounds,
    setSkin,
    setBackground,
  } = useGameStore();

  const totalXPEarned = gameHistory.reduce((sum, g) => sum + g.xpEarned, 0);
  const gamesPlayed = gameHistory.length;

  return (
    <FogBackground intensity="light">
      <div className="min-h-screen pb-24 pt-6 px-4">
        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-spooky text-gradient-spooky mb-1">
            Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize your shadow companion
          </p>
        </motion.header>

        {/* User Info */}
        <motion.div
          className="glass-card p-4 flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">
              {user?.username || 'Shadow Friend'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.isGuest ? 'Guest Player' : user?.email}
            </p>
          </div>
        </motion.div>

        {/* Shadow Preview */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ShadowCharacter size="md" interactive={false} />
        </motion.div>

        {/* XP & Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <XPBar />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card p-3 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{gamesPlayed}</p>
            <p className="text-xs text-muted-foreground">Games</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Star className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{totalXPEarned}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Palette className="w-5 h-5 text-candle-flame mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">
              {shadow.unlockedSkins.length + shadow.unlockedBackgrounds.length}
            </p>
            <p className="text-xs text-muted-foreground">Unlocked</p>
          </div>
        </motion.div>

        {/* Skins Selection */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Palette className="w-4 h-4" />
            Shadow Skins
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {availableSkins.map((skin) => {
              const isUnlocked = shadow.unlockedSkins.includes(skin.id);
              const isActive = shadow.currentSkin === skin.id;

              return (
                <motion.button
                  key={skin.id}
                  className={`flex-shrink-0 w-20 rounded-xl p-3 text-center transition-all ${
                    isActive
                      ? 'bg-primary/20 border-2 border-primary'
                      : isUnlocked
                      ? 'glass-card hover:bg-secondary/80'
                      : 'glass-card opacity-60'
                  }`}
                  onClick={() => isUnlocked && setSkin(skin.id)}
                  whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                  disabled={!isUnlocked}
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-secondary flex items-center justify-center">
                    {isUnlocked ? (
                      <span className="text-xl">👻</span>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">
                    {skin.name}
                  </p>
                  {!isUnlocked && (
                    <p className="text-[10px] text-muted-foreground">
                      Lvl {skin.unlockLevel}
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Backgrounds Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Image className="w-4 h-4" />
            Backgrounds
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {availableBackgrounds.map((bg) => {
              const isUnlocked = shadow.unlockedBackgrounds.includes(bg.id);
              const isActive = shadow.currentBackground === bg.id;

              return (
                <motion.button
                  key={bg.id}
                  className={`flex-shrink-0 w-24 rounded-xl p-3 text-center transition-all ${
                    isActive
                      ? 'bg-accent/20 border-2 border-accent'
                      : isUnlocked
                      ? 'glass-card hover:bg-secondary/80'
                      : 'glass-card opacity-60'
                  }`}
                  onClick={() => isUnlocked && setBackground(bg.id)}
                  whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                  disabled={!isUnlocked}
                >
                  <div className="w-12 h-8 mx-auto mb-2 rounded bg-secondary flex items-center justify-center">
                    {isUnlocked ? (
                      <span className="text-lg">🏚️</span>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground truncate">
                    {bg.name}
                  </p>
                  {!isUnlocked && (
                    <p className="text-[10px] text-muted-foreground">
                      Lvl {bg.unlockLevel}
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </FogBackground>
  );
};

export default ProfileScreen;
