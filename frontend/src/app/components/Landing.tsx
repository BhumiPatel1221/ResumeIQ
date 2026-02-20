import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

import { Button } from './ui/button';
import { Upload, FileText, Zap, Target, Brain, BarChart3, Users, Shield, Sparkles } from 'lucide-react';
import { Footer } from './layout/Footer';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};



export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const onStart = () => {
    navigate(isAuthenticated ? '/upload' : '/login');
  };

  return (
    <div className="min-h-screen pt-20 overflow-x-hidden">

      {/* ═══════════ HERO SECTION — Split Layout ═══════════ */}
      <section className="relative min-h-[92vh] flex items-center px-6 overflow-hidden">
        {/* Background effects */}
        <div 
          className="absolute top-32 right-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${COLORS.accent} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${COLORS.accentSecondary} 0%, transparent 70%)` }}
        />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2A2E3B] bg-[#151821]/60 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#9E9C96]">AI-Powered Resume Intelligence</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] max-w-xl"
              style={{ fontFamily: FONTS.heading, color: COLORS.text }}
            >
              Your Resume,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF00] to-[#F4EBDD]">
                Matched Intelligently
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-base md:text-lg max-w-lg mb-8 leading-relaxed"
              style={{ color: COLORS.textMuted }}
            >
              Upload your resume, paste a job description, and let our AI deliver instant match scores, 
              skill gap analysis, and personalized optimization tips.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row items-start gap-3 mb-10">
              <Button size="lg" onClick={onStart} className="gap-2 px-8 h-12 text-base">
                <Upload size={18} /> Upload Resume
              </Button>
              <Button variant="outline" size="lg" className="gap-2 px-8 h-12 text-base">
                <Zap size={18} /> Try Demo
              </Button>
            </motion.div>

            {/* Trust Stats Row */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#2A2E3B]/50">
              {[
                { icon: <Users size={16} />, label: '10,000+ Students' },
                { icon: <Brain size={16} />, label: 'AI-Powered Matching' },
                { icon: <Shield size={16} />, label: 'Resume Privacy' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#C6FF00]">{stat.icon}</span>
                  <span className="text-xs font-medium text-[#9E9C96] tracking-wide">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: AI Resume Scanning Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Radial glow behind entire component */}
            <div className="absolute -inset-12 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(198,255,0,0.06) 0%, transparent 70%)' }} />

            <div className="relative flex gap-4">
              {/* ─── Resume Preview Card (Left) ─── */}
              <div className="relative w-[260px] flex-shrink-0">
                <div className="relative bg-[#F5F2E8] rounded-xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden" style={{ minHeight: 380 }}>
                  {/* Resume Content */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="h-3 w-24 bg-[#1A1A2E] rounded-sm mb-1.5" />
                      <div className="h-2 w-36 bg-[#1A1A2E]/30 rounded-sm mb-1" />
                      <div className="h-1.5 w-28 bg-[#1A1A2E]/15 rounded-sm" />
                    </div>

                    <div className="h-[1px] bg-[#1A1A2E]/10" />

                    {/* Experience */}
                    <div>
                      <div className="h-2 w-20 bg-[#1A1A2E]/60 rounded-sm mb-2" />
                      <div className="space-y-3">
                        <div>
                          <div className="h-2 w-32 bg-[#1A1A2E]/40 rounded-sm mb-1" />
                          <div className="h-1.5 w-full bg-[#1A1A2E]/12 rounded-sm mb-0.5" />
                          <div className="h-1.5 w-4/5 bg-[#1A1A2E]/12 rounded-sm" />
                        </div>
                        <div>
                          <div className="h-2 w-28 bg-[#1A1A2E]/40 rounded-sm mb-1" />
                          <div className="h-1.5 w-full bg-[#1A1A2E]/12 rounded-sm mb-0.5" />
                          <div className="h-1.5 w-3/5 bg-[#1A1A2E]/12 rounded-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#1A1A2E]/10" />

                    {/* Skills */}
                    <div>
                      <div className="h-2 w-14 bg-[#1A1A2E]/60 rounded-sm mb-2" />
                      <div className="flex flex-wrap gap-1.5">
                        {[20, 16, 24, 18, 14, 22, 16].map((w, i) => (
                          <div key={i} className="h-4 rounded-full bg-[#1A1A2E]/10 border border-[#1A1A2E]/8" style={{ width: w * 4 }} />
                        ))}
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#1A1A2E]/10" />

                    {/* Education */}
                    <div>
                      <div className="h-2 w-18 bg-[#1A1A2E]/60 rounded-sm mb-2" />
                      <div className="h-2 w-36 bg-[#1A1A2E]/35 rounded-sm mb-1" />
                      <div className="h-1.5 w-24 bg-[#1A1A2E]/15 rounded-sm" />
                    </div>
                  </div>

                  {/* ─── Scanning Beam ─── */}
                  <motion.div
                    className="absolute left-0 right-0 h-[3px] z-20"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, #C6FF00 20%, #C6FF00 80%, transparent 100%)',
                      boxShadow: '0 0 20px 4px rgba(198,255,0,0.4), 0 0 60px 8px rgba(198,255,0,0.15)',
                    }}
                    initial={{ top: 20 }}
                    animate={{ top: [20, 360, 20] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Scan trail gradient */}
                  <motion.div
                    className="absolute left-0 right-0 h-16 z-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(198,255,0,0.08) 0%, transparent 100%)',
                    }}
                    initial={{ top: 20 }}
                    animate={{ top: [20, 360, 20] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* ─── Right Column: Extracted Data ─── */}
              <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                {/* Extracted Skills Panel */}
                <div className="bg-[#151821] border border-[#2A2E3B] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-[#C6FF00]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6FF00]">Skills Detected</span>
                  </div>
                  {['React', 'TypeScript', 'System Design', 'CI/CD'].map((skill, i) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.5, duration: 0.4 }}
                      className="flex items-center gap-2.5"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4 + i * 0.5, type: 'spring', stiffness: 400 }}
                        className="w-5 h-5 rounded-md bg-[#C6FF00]/15 flex items-center justify-center flex-shrink-0"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <motion.path
                            d="M2 5L4.5 7.5L8 3"
                            stroke="#C6FF00"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 1.5 + i * 0.5, duration: 0.3 }}
                          />
                        </svg>
                      </motion.div>
                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>{skill}</span>
                    </motion.div>
                  ))}
                </div>

                {/* AI Processing Indicator */}
                <div className="bg-[#151821] border border-[#2A2E3B] rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 0.3, 0.6].map((d, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#C6FF00]"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{ duration: 1.2, delay: d, repeat: Infinity }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#9E9C96]">Analyzing resume…</span>
                  </div>
                  {/* Subtle pulse glow */}
                  <motion.div
                    className="mt-3 h-[2px] rounded-full bg-[#C6FF00]/20 overflow-hidden"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="h-full w-8 rounded-full bg-[#C6FF00]/50"
                      animate={{ x: [0, 180, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </div>

                {/* Match Progress */}
                <div className="bg-[#151821] border border-[#2A2E3B] rounded-xl px-5 py-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9E9C96]">
                    Matching with Senior Frontend Engineer role…
                  </p>
                  <div className="relative h-2 bg-[#2A2E3B] rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ backgroundColor: '#C6FF00', boxShadow: '0 0 12px rgba(198,255,0,0.4)' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '84%' }}
                      transition={{ duration: 3, delay: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#9E9C96]">Match Progress</span>
                    <motion.span
                      className="text-sm font-bold text-[#C6FF00]"
                      style={{ fontFamily: FONTS.heading }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                    >
                      84%
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent elements */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-14 h-14 rounded-xl bg-[#1E222F] border border-[#2A2E3B] flex items-center justify-center shadow-lg z-20"
            >
              <Sparkles className="text-[#C6FF00]" size={22} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-[#1E222F] border border-[#2A2E3B] flex items-center justify-center shadow-lg z-20"
            >
              <Target className="text-[#F4EBDD]" size={18} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-24 px-6 bg-[#0E0F13] border-y border-[#2A2E3B]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            variants={container}
            className="text-center mb-16"
          >
            <motion.p variants={item} className="text-xs font-semibold tracking-[0.25em] uppercase text-[#C6FF00] mb-4">Simple Process</motion.p>
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold" style={{ fontFamily: FONTS.heading, color: COLORS.text }}>
              Three Steps to Your Dream Job
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#2A2E3B] to-transparent" />

            {[
              { step: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF or DOCX file. Parsed securely in milliseconds.', icon: <Upload size={24} /> },
              { step: '02', title: 'Paste Job Description', desc: 'Copy the job listing you want to target. Our AI understands any format.', icon: <FileText size={24} /> },
              { step: '03', title: 'Get AI Analysis', desc: 'Match score, missing skills, optimization tips, and job recommendations.', icon: <BarChart3 size={24} /> },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative text-center group"
              >
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#151821] border border-[#2A2E3B] flex items-center justify-center mx-auto mb-6 text-[#C6FF00] group-hover:border-[#C6FF00]/50 group-hover:shadow-[0_0_20px_rgba(198,255,0,0.1)] transition-all duration-300">
                  {s.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#C6FF00] uppercase mb-2 block">{s.step}</span>
                <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.text, fontFamily: FONTS.heading }}>{s.title}</h3>
                <p className="text-sm max-w-xs mx-auto" style={{ color: COLORS.textMuted }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
