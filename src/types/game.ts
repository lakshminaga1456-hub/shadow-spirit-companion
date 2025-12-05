export interface User {
  id: string;
  email: string;
  username: string;
  isGuest: boolean;
  createdAt: Date;
}

export interface ShadowState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentSkin: string;
  currentBackground: string;
  unlockedSkins: string[];
  unlockedBackgrounds: string[];
  mood: 'happy' | 'playful' | 'sleepy' | 'excited';
  lastInteraction: Date;
}

export interface DiaryEntry {
  id: string;
  date: Date;
  line: string;
  isFavorite: boolean;
}

export interface GameScore {
  gameId: string;
  gameName: string;
  score: number;
  xpEarned: number;
  playedAt: Date;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  isUnlocked: boolean;
  previewUrl: string;
}

export interface Background {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  isUnlocked: boolean;
  previewUrl: string;
}

export interface GameSession {
  id: string;
  gameType: 'tap-ghost' | 'shadow-puzzle' | 'memory-candle';
  startedAt: Date;
  endedAt?: Date;
  score: number;
  xpAwarded: number;
}

export type AppRoute = 'splash' | 'auth' | 'home' | 'games' | 'profile' | 'settings' | 'diary';
