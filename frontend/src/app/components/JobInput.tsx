import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS } from '../constants/theme';
import { Button } from './ui/button';
import { Sparkles, Info, Trash2 } from 'lucide-react';
import { useAnalysisFlow } from '../context/AnalysisFlowContext';

export const JobInput: React.FC = () => {
  const navigate = useNavigate();
  const { setJobDescription } = useAnalysisFlow();
  const [text, setText] = useState('');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 px-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-200px)] min-h-[600px]">
        
        {/* Left Column: Input */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: FONTS.heading }}>Job Description</h2>
            <button 
              onClick={() => setText('')}
              className="text-sm flex items-center gap-2 text-[#9E9C96] hover:text-[#FF4D4D] transition-colors"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
          
          <div className="flex-1 relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the job description here (Responsibilities, Requirements, Skills...)"
              className="w-full h-full bg-[#151821] border border-[#2A2E3B] p-6 resize-none focus:outline-none focus:border-[#C6FF00] transition-colors rounded-lg text-lg leading-relaxed placeholder:text-[#9E9C96]/30"
              style={{ color: COLORS.text, fontFamily: FONTS.body }}
            />
            <div className="absolute bottom-4 right-4 text-xs text-[#9E9C96] bg-[#151821] px-2 py-1 rounded">
              {text.length} characters
            </div>
          </div>
        </div>

        {/* Right Column: Tips */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-[#1E222F] border border-[#2A2E3B] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-[#C6FF00]">
              <Sparkles size={18} />
              <span className="font-bold uppercase tracking-wider text-xs">AI Tips</span>
            </div>
            <ul className="space-y-4 text-sm" style={{ color: COLORS.textMuted }}>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] mt-2 flex-shrink-0" />
                Include the full "Responsibilities" section for context.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] mt-2 flex-shrink-0" />
                Make sure "Required Skills" are clearly visible.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] mt-2 flex-shrink-0" />
                Don't worry about formatting; our AI parses raw text.
              </li>
            </ul>
          </div>

          <div className="mt-auto space-y-4">
             <Button 
               size="lg" 
               fullWidth 
               onClick={() => {
               setJobDescription(text);
               navigate('/analyzing');
             }}
               disabled={text.length < 50}
               className={text.length < 50 ? 'opacity-50 cursor-not-allowed' : ''}
             >
               Analyze Resume
             </Button>
             <Button 
               variant="outline" 
               size="lg" 
               fullWidth 
               onClick={() => navigate('/upload')}
             >
               Back
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
