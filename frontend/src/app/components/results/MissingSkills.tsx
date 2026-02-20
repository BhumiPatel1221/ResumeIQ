import React from 'react';
import { motion } from 'motion/react';
import { COLORS, FONTS } from '../../constants/theme';
import { TriangleAlert, ChevronDown } from 'lucide-react';

interface MissingSkillsProps {
  skills: string[];
}

export const MissingSkills: React.FC<MissingSkillsProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="bg-[#151821] border border-[#2A2E3B] p-8 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#C6FF00]">✓</span>
          <h3 className="text-xl font-bold" style={{ fontFamily: FONTS.heading }}>No Missing Skills!</h3>
        </div>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Your resume covers all the skills mentioned in the job description.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#151821] border border-[#2A2E3B] p-8 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <TriangleAlert className="text-[#FFD700]" size={20} />
        <h3 className="text-xl font-bold" style={{ fontFamily: FONTS.heading }}>Missing Skills</h3>
      </div>

      <div className="space-y-4">
        {skills.map((skill, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-[#2A2E3B] bg-[#1E222F] p-4 rounded hover:border-[#FFD700]/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-[#F5F2E8]">{skill}</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
                Gap
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
