import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AnalysisResult } from '../App';

interface AnalysisFlowState {
  resumeId: string | null;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  setResumeId: (id: string | null) => void;
  setJobDescription: (desc: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  resetFlow: () => void;
}

const AnalysisFlowContext = createContext<AnalysisFlowState>({
  resumeId: null,
  jobDescription: '',
  analysisResult: null,
  setResumeId: () => {},
  setJobDescription: () => {},
  setAnalysisResult: () => {},
  resetFlow: () => {},
});

export const useAnalysisFlow = () => useContext(AnalysisFlowContext);

export const AnalysisFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const resetFlow = useCallback(() => {
    setResumeId(null);
    setJobDescription('');
    setAnalysisResult(null);
  }, []);

  return (
    <AnalysisFlowContext.Provider
      value={{
        resumeId,
        jobDescription,
        analysisResult,
        setResumeId,
        setJobDescription,
        setAnalysisResult,
        resetFlow,
      }}
    >
      {children}
    </AnalysisFlowContext.Provider>
  );
};
