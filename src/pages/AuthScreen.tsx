import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/stores/gameStore';
import { Ghost, Mail, Lock, User, Sparkles } from 'lucide-react';
import FogBackground from '@/components/FogBackground';

interface AuthScreenProps {
  onComplete: () => void;
}

const AuthScreen = ({ onComplete }: AuthScreenProps) => {
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { loginAsGuest, setUser } = useGameStore();

  const handleGuestLogin = () => {
    loginAsGuest();
    onComplete();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, simulate login/signup
    setUser({
      id: `user_${Date.now()}`,
      email,
      username: username || email.split('@')[0],
      isGuest: false,
      createdAt: new Date(),
    });
    onComplete();
  };

  return (
    <FogBackground intensity="light">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4"
              animate={{ 
                boxShadow: [
                  '0 0 20px hsl(var(--primary) / 0.3)',
                  '0 0 40px hsl(var(--primary) / 0.5)',
                  '0 0 20px hsl(var(--primary) / 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Ghost className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-spooky text-gradient-spooky">
              Shadow Companion
            </h1>
          </motion.div>

          {/* Welcome Mode */}
          {mode === 'welcome' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Button
                variant="spooky"
                size="xl"
                className="w-full"
                onClick={handleGuestLogin}
              >
                <Sparkles className="w-5 h-5" />
                Play as Guest
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-4 text-muted-foreground">
                    or save your progress
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setMode('login')}
              >
                <Mail className="w-4 h-4" />
                Sign in with Email
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full text-muted-foreground"
                onClick={() => setMode('signup')}
              >
                Create new account
              </Button>
            </motion.div>
          )}

          {/* Login Mode */}
          {mode === 'login' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                    required
                  />
                </div>
              </div>

              <Button variant="spooky" size="lg" className="w-full" type="submit">
                Sign In
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setMode('welcome')}
                  className="text-muted-foreground"
                >
                  Back
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  onClick={() => setMode('signup')}
                >
                  Create account
                </Button>
              </div>
            </motion.form>
          )}

          {/* Signup Mode */}
          {mode === 'signup' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button variant="spooky" size="lg" className="w-full" type="submit">
                Create Account
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setMode('welcome')}
                  className="text-muted-foreground"
                >
                  Back
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  onClick={() => setMode('login')}
                >
                  Already have an account?
                </Button>
              </div>
            </motion.form>
          )}

          {/* Footer */}
          <motion.p
            className="mt-8 text-center text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A spooky but safe experience for all ages
          </motion.p>
        </motion.div>
      </div>
    </FogBackground>
  );
};

export default AuthScreen;
