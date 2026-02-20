import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, FONTS } from '../../constants/theme';
import { Wand2, Lightbulb } from 'lucide-react';

interface SuggestionsProps {
  suggestions: string[];
}

export const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#151821] border border-[#2A2E3B] p-8 rounded-lg">
      <div className="flex items-center gap-3 mb-8">
        <Wand2 className="text-[#C6FF00]" size={20} />
        <h3 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>AI Suggestions</h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-[#2A2E3B] bg-[#0E0F13] p-5 rounded-lg flex gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C6FF00]/10 border border-[#C6FF00]/30 flex items-center justify-center mt-0.5">
              <Lightbulb size={14} className="text-[#C6FF00]" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.text }}>
              {suggestion}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
