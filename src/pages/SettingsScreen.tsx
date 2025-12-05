import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import FogBackground from '@/components/FogBackground';
import { useGameStore } from '@/stores/gameStore';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  LogOut, 
  Trash2, 
  Info,
  Moon,
  Bell,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface SettingsScreenProps {
  onLogout: () => void;
}

const SettingsScreen = ({ onLogout }: SettingsScreenProps) => {
  const { user, whisperMode, toggleWhisperMode, logout } = useGameStore();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const settingsGroups = [
    {
      title: 'Sound',
      items: [
        {
          icon: whisperMode ? Volume2 : VolumeX,
          label: 'Whisper Mode',
          description: 'Spooky ambient sounds',
          action: (
            <Switch
              checked={whisperMode}
              onCheckedChange={toggleWhisperMode}
            />
          ),
        },
      ],
    },
    {
      title: 'Display',
      items: [
        {
          icon: Moon,
          label: 'Dark Theme',
          description: 'Always enabled for the spooky experience',
          action: (
            <Switch checked={true} disabled />
          ),
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Daily whisper reminders',
          action: (
            <Switch checked={false} disabled />
          ),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          label: 'Version',
          description: 'Shadow Companion v1.0.0',
          action: null,
        },
        {
          icon: Shield,
          label: 'Safety',
          description: 'Spooky but safe for all ages',
          action: null,
        },
      ],
    },
  ];

  return (
    <FogBackground intensity="light">
      <div className="min-h-screen pb-24 pt-6 px-4">
        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Settings className="w-5 h-5 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-spooky text-gradient-spooky">
              Settings
            </h1>
          </div>
        </motion.header>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h2>
              <div className="glass-card divide-y divide-border/50">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.action}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Account Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Account
          </h2>
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user?.username || 'Shadow Friend'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.isGuest ? 'Playing as guest' : user?.email}
                </p>
              </div>
              {user?.isGuest && (
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Save Progress
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Data
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground">
            Made with 👻 for spooky fun
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Safe and friendly for all ages
          </p>
        </motion.footer>
      </div>
    </FogBackground>
  );
};

export default SettingsScreen;
