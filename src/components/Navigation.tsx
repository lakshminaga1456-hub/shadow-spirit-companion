import { motion } from 'framer-motion';
import { Home, Gamepad2, BookOpen, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const Navigation = ({ currentRoute, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'games', icon: Gamepad2, label: 'Games' },
    { id: 'diary', icon: BookOpen, label: 'Diary' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
    >
      <div className="mx-4 mb-4">
        <div className="glass-card flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                whileTap={{ scale: 0.9 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className={cn(
                    'w-5 h-5 relative z-10',
                    isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary))]'
                  )} />
                </motion.div>

                <span className={cn(
                  'text-[10px] font-medium relative z-10',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>

                {/* Glow effect for active item */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
