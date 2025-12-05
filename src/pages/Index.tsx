import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './SplashScreen';
import AuthScreen from './AuthScreen';
import HomeScreen from './HomeScreen';
import GamesScreen from './GamesScreen';
import DiaryScreen from './DiaryScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import Navigation from '@/components/Navigation';
import { useGameStore } from '@/stores/gameStore';

type AppState = 'splash' | 'auth' | 'main';
type MainRoute = 'home' | 'games' | 'diary' | 'profile' | 'settings';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentRoute, setCurrentRoute] = useState<MainRoute>('home');
  const { isAuthenticated } = useGameStore();

  // Check auth state after splash
  useEffect(() => {
    if (appState === 'auth' && isAuthenticated) {
      setAppState('main');
    }
  }, [appState, isAuthenticated]);

  const handleSplashComplete = () => {
    if (isAuthenticated) {
      setAppState('main');
    } else {
      setAppState('auth');
    }
  };

  const handleAuthComplete = () => {
    setAppState('main');
  };

  const handleLogout = () => {
    setAppState('auth');
    setCurrentRoute('home');
  };

  const renderMainContent = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeScreen />;
      case 'games':
        return <GamesScreen />;
      case 'diary':
        return <DiaryScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {appState === 'splash' && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {appState === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthScreen onComplete={handleAuthComplete} />
          </motion.div>
        )}

        {appState === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoute}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
            
            <Navigation 
              currentRoute={currentRoute} 
              onNavigate={(route) => setCurrentRoute(route as MainRoute)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
