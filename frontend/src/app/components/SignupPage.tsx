import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS } from '../constants/theme';
import { Button } from './ui/button';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ResumeIQLogo } from './brand/ResumeIQLogo';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser(name, email, password);
      login(res.data.token, res.data.user);
      toast.success('Account created successfully! Welcome to ResumeIQ 🎉');
      navigate('/upload', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
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
            Create Account
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: COLORS.textMuted }}>
            Join ResumeIQ and supercharge your job search
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
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
                required
                className="w-full bg-[#0E0F13] border border-[#2A2E3B] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C6FF00] transition-colors"
                style={{ color: COLORS.text }}
              />
            </div>

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
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#0E0F13] border border-[#2A2E3B] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C6FF00] transition-colors"
                style={{ color: COLORS.text }}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.textMuted }}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          {/* Go to login */}
          <div className="mt-6 text-center text-sm" style={{ color: COLORS.textMuted }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold hover:underline"
              style={{ color: COLORS.accent }}
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
