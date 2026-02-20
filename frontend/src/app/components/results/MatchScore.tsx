import React from 'react';
import { motion } from 'motion/react';
import { COLORS, FONTS } from '../../constants/theme';
import { Sparkles } from 'lucide-react';

/* ── Animated skill progress bar ─────────────────────────────── */
const SkillBar: React.FC<{ name: string; pct: number; color: string; delay: number }> = ({
  name, pct, color, delay,
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium" style={{ color: COLORS.text }}>{name}</span>
      <span className="text-sm font-bold tabular-nums" style={{ color: COLORS.textMuted }}>{pct}%</span>
    </div>
    <div className="relative h-[6px] w-full rounded-full bg-[#2A2E3B] overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}55` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay }}
      />
    </div>
  </div>
);

/* ── Resume-scan background SVG + animated scan line ─────────── */
const ResumeScanOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {/* wireframe resume page */}
    <svg
      viewBox="0 0 160 210"
      fill="none"
      className="absolute right-6 top-4 w-[120px] h-auto opacity-[0.04]"
    >
      <rect x="4" y="4" width="152" height="202" rx="6" stroke="#C6FF00" strokeWidth="1.2" />
      <rect x="16" y="16" width="80" height="8" rx="2" fill="#C6FF00" />
      <rect x="16" y="28" width="50" height="4" rx="1" fill="#C6FF00" opacity="0.5" />
      <rect x="16" y="46" width="128" height="1" fill="#C6FF00" opacity="0.3" />
      <rect x="16" y="56" width="90" height="5" rx="1" fill="#C6FF00" opacity="0.6" />
      <rect x="16" y="65" width="110" height="3" rx="1" fill="#C6FF00" opacity="0.3" />
      <rect x="16" y="86" width="128" height="1" fill="#C6FF00" opacity="0.3" />
      <rect x="16" y="96" width="70" height="5" rx="1" fill="#C6FF00" opacity="0.6" />
      <rect x="16" y="105" width="120" height="3" rx="1" fill="#C6FF00" opacity="0.3" />
      <rect x="16" y="130" width="128" height="1" fill="#C6FF00" opacity="0.3" />
      <rect x="16" y="140" width="40" height="5" rx="1" fill="#C6FF00" opacity="0.5" />
      <rect x="62" y="140" width="60" height="5" rx="2" fill="#C6FF00" opacity="0.35" />
      <rect x="16" y="152" width="40" height="5" rx="1" fill="#C6FF00" opacity="0.5" />
      <rect x="62" y="152" width="50" height="5" rx="2" fill="#C6FF00" opacity="0.35" />
      <rect x="16" y="164" width="40" height="5" rx="1" fill="#C6FF00" opacity="0.5" />
      <rect x="62" y="164" width="30" height="5" rx="2" fill="#C6FF00" opacity="0.35" />
      <circle cx="136" cy="142" r="2.5" fill="#C6FF00" opacity="0.6" />
      <circle cx="136" cy="154" r="2.5" fill="#C6FF00" opacity="0.6" />
      <circle cx="136" cy="166" r="2.5" fill="#C6FF00" opacity="0.6" />
      <line x1="138" y1="142" x2="152" y2="130" stroke="#C6FF00" strokeWidth="0.6" opacity="0.4" />
      <line x1="138" y1="154" x2="152" y2="154" stroke="#C6FF00" strokeWidth="0.6" opacity="0.4" />
      <line x1="138" y1="166" x2="152" y2="178" stroke="#C6FF00" strokeWidth="0.6" opacity="0.4" />
    </svg>

    {/* scan line */}
    <motion.div
      className="absolute right-6 w-[120px] h-[2px]"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, #C6FF00 40%, #C6FF00 60%, transparent 100%)',
        boxShadow: '0 0 10px 2px rgba(198,255,0,0.3)',
      }}
      initial={{ top: 16 }}
      animate={{ top: [16, 190, 16] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

/* ── Main component ──────────────────────────────────────────── */
interface MatchScoreProps {
  score: number;
  matchedSkills: string[];
}

export const MatchScore: React.FC<MatchScoreProps> = ({ score, matchedSkills }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return COLORS.success;
    if (s >= 60) return COLORS.warning;
    return COLORS.error;
  };

  const color = getColor(score);

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-[#2A2E3B] bg-[#151821]"
      style={{ boxShadow: `0 0 40px rgba(198,255,0,0.04), inset 0 1px 0 rgba(198,255,0,0.06)` }}
    >
      {/* scan background */}
      <ResumeScanOverlay />

      {/* glow blob */}
      <div
        className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-[90px] opacity-[0.08] pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* AI sparkle icon – top right */}
      <motion.div
        className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-[#1E222F] border border-[#2A2E3B] flex items-center justify-center z-10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles size={18} className="text-[#C6FF00]" />
      </motion.div>

      <div className="relative z-[1] p-8 space-y-7">
        {/* ── Top row: ring + job info ── */}
        <div className="flex items-center gap-6">
          {/* Score ring */}
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" className="transform -rotate-90">
              <defs>
                <filter id="scoreGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="70" cy="70" r={radius} stroke="#2A2E3B" strokeWidth="10" fill="transparent" />
              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                stroke={color}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                strokeLinecap="round"
                filter="url(#scoreGlow)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="text-3xl font-bold"
                style={{ fontFamily: FONTS.heading, color: COLORS.text }}
              >
                {score}%
              </motion.span>
            </div>
          </div>

          {/* Job info */}
          <div className="min-w-0">
            <h3
              className="text-2xl font-bold leading-tight mb-1"
              style={{ fontFamily: FONTS.heading, color: COLORS.text }}
            >
              {score >= 80 ? 'Strong Match' : score >= 60 ? 'Good Match' : 'Needs Work'}
            </h3>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              {matchedSkills.length} skills matched
            </p>
          </div>
        </div>

        {/* ── Matched skill tags ── */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-bold" style={{ color: COLORS.textMuted }}>Matched Skills</h4>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-[#C6FF00]/40 text-[#C6FF00] bg-[#C6FF00]/5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
