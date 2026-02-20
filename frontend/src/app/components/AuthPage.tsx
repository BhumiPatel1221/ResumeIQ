import React, { useState } from 'react';
import { motion } from 'motion/react';
import { COLORS, FONTS } from '../constants/theme';
import { Button } from './ui/button';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ResumeIQLogo } from './brand/ResumeIQLogo';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (mode === 'register') {
        if (!name.trim()) { toast.error('Name is required'); setLoading(false); return; }
        res = await registerUser(name, email, password);
        toast.success('Account created successfully!');
      } else {
        res = await loginUser(email, password);
        toast.success('Welcome back!');
      }

      // Save token & user in context
      login(res.data.token, res.data.user);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <ResumeIQLogo size="lg" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#151821] border border-[#2A2E3B] rounded-xl p-8"
        >
          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{ fontFamily: FONTS.heading, color: COLORS.text }}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: COLORS.textMuted }}>
            {mode === 'login'
              ? 'Sign in to continue analyzing resumes'
              : 'Join ResumeIQ and supercharge your job search'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (register only) */}
            {mode === 'register' && (
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.textMuted }}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0E0F13] border border-[#2A2E3B] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C6FF00] transition-colors"
                  style={{ color: COLORS.text }}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.textMuted }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0E0F13] border border-[#2A2E3B] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C6FF00] transition-colors"
                style={{ color: COLORS.text }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.textMuted }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#0E0F13] border border-[#2A2E3B] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C6FF00] transition-colors"
                style={{ color: COLORS.text }}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center text-sm" style={{ color: COLORS.textMuted }}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold hover:underline"
                  style={{ color: COLORS.accent }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold hover:underline"
                  style={{ color: COLORS.accent }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
