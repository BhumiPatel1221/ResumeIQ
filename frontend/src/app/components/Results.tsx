import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { MatchScore } from './results/MatchScore';
import { MissingSkills } from './results/MissingSkills';
import { Suggestions } from './results/Suggestions';
import { COLORS } from '../constants/theme';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';
import { useAnalysisFlow } from '../context/AnalysisFlowContext';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult, resetFlow } = useAnalysisFlow();

  if (!analysisResult) {
    navigate('/upload', { replace: true });
    return null;
  }

  const data = analysisResult;

  const handleStartOver = () => {
    resetFlow();
    navigate('/upload');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Score & Skills */}
        <div className="lg:col-span-1 space-y-8">
          <MatchScore score={data.matchScore} matchedSkills={data.matchedSkills} />
          <MissingSkills skills={data.missingSkills} />
        </div>

        {/* Right Column: Suggestions */}
        <div className="lg:col-span-2 space-y-12">
           <Suggestions suggestions={data.suggestions} />

           <div className="flex justify-center">
             <Button size="lg" variant="outline" onClick={handleStartOver} className="gap-2">
               <RotateCcw size={18} /> Analyze Another Resume
             </Button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
