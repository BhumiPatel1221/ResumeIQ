import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS } from '../constants/theme';
import { runAnalysis } from '../services/api';
import { toast } from 'sonner';
import { useAnalysisFlow } from '../context/AnalysisFlowContext';

export const Analyzing: React.FC = () => {
  const navigate = useNavigate();
  const { resumeId, jobDescription, setAnalysisResult } = useAnalysisFlow();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!resumeId || !jobDescription) {
      navigate('/upload', { replace: true });
      return;
    }

    const analyze = async () => {
      try {
        const res = await runAnalysis(resumeId, jobDescription);
        setAnalysisResult(res.data.analysis);
        navigate('/results', { replace: true });
      } catch (err: any) {
        toast.error(err.message || 'Analysis failed. Please try again.');
        navigate('/job-input');
      }
    };

    analyze();
  }, [resumeId, jobDescription, setAnalysisResult, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0F13]">
      <div className="relative">
        {/* Glow */}
        <div 
          className="absolute inset-0 blur-[80px] opacity-30"
          style={{ background: `radial-gradient(circle, ${COLORS.accent} 0%, transparent 70%)` }}
        />
        
        {/* Rotating Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="relative w-64 h-64 border border-[#2A2E3B] rounded-full flex items-center justify-center"
        >
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border border-[#C6FF00]/30 rounded-full border-t-[#C6FF00] border-r-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-4 h-4 bg-[#C6FF00] rounded-full shadow-[0_0_20px_#C6FF00]"
            />
          </div>
        </motion.div>
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-3xl font-bold"
        style={{ fontFamily: FONTS.heading, color: COLORS.text }}
      >
        Analyzing your resume...
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-sm tracking-widest uppercase"
        style={{ color: COLORS.textMuted }}
      >
        Matching Skills • Comparing Experience • Optimizing Format
      </motion.p>
      
      <div className="mt-8 w-64 h-1 bg-[#2A2E3B] overflow-hidden rounded-full">
        <motion.div 
          className="h-full bg-[#C6FF00]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
