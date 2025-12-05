import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ShadowState, DiaryEntry, GameScore, Skin, Background } from '@/types/game';

interface GameStore {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Shadow state
  shadow: ShadowState;
  
  // Diary
  diary: DiaryEntry[];
  todayLine: string | null;
  
  // Game history
  gameHistory: GameScore[];
  
  // Settings
  whisperMode: boolean;
  festivalMode: boolean;
  
  // Skins & Backgrounds
  availableSkins: Skin[];
  availableBackgrounds: Background[];
  
  // Actions
  setUser: (user: User | null) => void;
  loginAsGuest: () => void;
  logout: () => void;
  
  addXP: (amount: number) => void;
  setSkin: (skinId: string) => void;
  setBackground: (backgroundId: string) => void;
  unlockItem: (type: 'skin' | 'background', id: string) => void;
  
  addDiaryEntry: (entry: DiaryEntry) => void;
  toggleFavorite: (entryId: string) => void;
  setTodayLine: (line: string) => void;
  
  addGameScore: (score: GameScore) => void;
  
  toggleWhisperMode: () => void;
  setFestivalMode: (active: boolean) => void;
  
  updateMood: (mood: ShadowState['mood']) => void;
  recordInteraction: () => void;
}

const MYSTERIOUS_LINES = [
  "The shadows whisper secrets only you can hear...",
  "Tonight, the veil between worlds grows thin.",
  "Your shadow dances when you're not looking.",
  "The moon remembers your name.",
  "Something stirs in the darkness... it's friendly.",
  "The ghosts are throwing a party in your honor.",
  "Your courage lights candles in haunted halls.",
  "The night creatures speak well of you.",
  "Ancient magic flows through your fingertips.",
  "The stars have aligned for your adventure.",
  "Whispers in the wind carry your legend.",
  "The midnight hour holds no fear for you.",
  "Shadows gather to protect their companion.",
  "The full moon grants you mysterious powers.",
  "Echoes of forgotten spells surround you.",
];

const DEFAULT_SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Shadow', description: 'The original shadow companion', unlockLevel: 1, isUnlocked: true, previewUrl: '' },
  { id: 'ghost', name: 'Ghostly Wisp', description: 'A translucent ethereal form', unlockLevel: 3, isUnlocked: false, previewUrl: '' },
  { id: 'pumpkin', name: 'Pumpkin Spirit', description: 'Jack-o-lantern infused', unlockLevel: 5, isUnlocked: false, previewUrl: '' },
  { id: 'bat', name: 'Bat Shadow', description: 'Wings of the night', unlockLevel: 8, isUnlocked: false, previewUrl: '' },
  { id: 'witch', name: 'Witch\'s Familiar', description: 'Mystical and magical', unlockLevel: 10, isUnlocked: false, previewUrl: '' },
];

const DEFAULT_BACKGROUNDS: Background[] = [
  { id: 'haunted-house', name: 'Haunted House', description: 'A spooky mansion', unlockLevel: 1, isUnlocked: true, previewUrl: '' },
  { id: 'graveyard', name: 'Midnight Graveyard', description: 'Rest among the spirits', unlockLevel: 2, isUnlocked: false, previewUrl: '' },
  { id: 'forest', name: 'Dark Forest', description: 'Ancient trees hide secrets', unlockLevel: 4, isUnlocked: false, previewUrl: '' },
  { id: 'castle', name: 'Vampire Castle', description: 'Gothic grandeur', unlockLevel: 6, isUnlocked: false, previewUrl: '' },
  { id: 'pumpkin-patch', name: 'Pumpkin Patch', description: 'Halloween harvest', unlockLevel: 9, isUnlocked: false, previewUrl: '' },
];

const calculateXPForLevel = (level: number): number => {
  return Math.floor(50 * Math.pow(1.5, level - 1));
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      shadow: {
        level: 1,
        xp: 0,
        xpToNextLevel: calculateXPForLevel(1),
        currentSkin: 'classic',
        currentBackground: 'haunted-house',
        unlockedSkins: ['classic'],
        unlockedBackgrounds: ['haunted-house'],
        mood: 'happy',
        lastInteraction: new Date(),
      },
      
      diary: [],
      todayLine: null,
      
      gameHistory: [],
      
      whisperMode: true,
      festivalMode: false,
      
      availableSkins: DEFAULT_SKINS,
      availableBackgrounds: DEFAULT_BACKGROUNDS,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      loginAsGuest: () => {
        const guestUser: User = {
          id: `guest_${Date.now()}`,
          email: '',
          username: `Shadow${Math.floor(Math.random() * 9999)}`,
          isGuest: true,
          createdAt: new Date(),
        };
        set({ user: guestUser, isAuthenticated: true });
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      addXP: (amount) => {
        const { shadow, availableSkins, availableBackgrounds } = get();
        let newXP = shadow.xp + amount;
        let newLevel = shadow.level;
        let xpNeeded = shadow.xpToNextLevel;
        
        // Level up logic
        while (newXP >= xpNeeded) {
          newXP -= xpNeeded;
          newLevel++;
          xpNeeded = calculateXPForLevel(newLevel);
        }
        
        // Check for unlocks
        const newUnlockedSkins = [...shadow.unlockedSkins];
        const newUnlockedBackgrounds = [...shadow.unlockedBackgrounds];
        
        availableSkins.forEach(skin => {
          if (skin.unlockLevel <= newLevel && !newUnlockedSkins.includes(skin.id)) {
            newUnlockedSkins.push(skin.id);
          }
        });
        
        availableBackgrounds.forEach(bg => {
          if (bg.unlockLevel <= newLevel && !newUnlockedBackgrounds.includes(bg.id)) {
            newUnlockedBackgrounds.push(bg.id);
          }
        });
        
        set({
          shadow: {
            ...shadow,
            xp: newXP,
            level: newLevel,
            xpToNextLevel: xpNeeded,
            unlockedSkins: newUnlockedSkins,
            unlockedBackgrounds: newUnlockedBackgrounds,
          },
        });
      },
      
      setSkin: (skinId) => set((state) => ({
        shadow: { ...state.shadow, currentSkin: skinId }
      })),
      
      setBackground: (backgroundId) => set((state) => ({
        shadow: { ...state.shadow, currentBackground: backgroundId }
      })),
      
      unlockItem: (type, id) => set((state) => ({
        shadow: {
          ...state.shadow,
          ...(type === 'skin' 
            ? { unlockedSkins: [...state.shadow.unlockedSkins, id] }
            : { unlockedBackgrounds: [...state.shadow.unlockedBackgrounds, id] }
          ),
        }
      })),
      
      addDiaryEntry: (entry) => set((state) => ({
        diary: [entry, ...state.diary]
      })),
      
      toggleFavorite: (entryId) => set((state) => ({
        diary: state.diary.map(e => 
          e.id === entryId ? { ...e, isFavorite: !e.isFavorite } : e
        )
      })),
      
      setTodayLine: (line) => set({ todayLine: line }),
      
      addGameScore: (score) => set((state) => ({
        gameHistory: [score, ...state.gameHistory]
      })),
      
      toggleWhisperMode: () => set((state) => ({ whisperMode: !state.whisperMode })),
      
      setFestivalMode: (active) => set({ festivalMode: active }),
      
      updateMood: (mood) => set((state) => ({
        shadow: { ...state.shadow, mood }
      })),
      
      recordInteraction: () => set((state) => ({
        shadow: { ...state.shadow, lastInteraction: new Date() }
      })),
    }),
    {
      name: 'shadow-companion-storage',
    }
  )
);

// Helper to get a random mysterious line
export const getRandomMysteriousLine = (): string => {
  return MYSTERIOUS_LINES[Math.floor(Math.random() * MYSTERIOUS_LINES.length)];
};
