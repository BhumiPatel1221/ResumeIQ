import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { COLORS, FONTS } from '../constants/theme';
import { Button } from './ui/button';
import { Upload, FileText, X, Check, File, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadResume } from '../services/api';
import { useAnalysisFlow } from '../context/AnalysisFlowContext';

export const UploadResume: React.FC = () => {
  const navigate = useNavigate();
  const { setResumeId: setFlowResumeId } = useAnalysisFlow();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf'];
    if (validTypes.includes(selectedFile.type)) {
      handleRealUpload(selectedFile);
    } else {
      toast.error('Invalid file type. Please upload a PDF file.');
    }
  };

  const handleRealUpload = async (selectedFile: File) => {
    setFile(null);
    setUploadProgress(0);
    setUploading(true);
    setUploadedResumeId(null);

    // Show progress animation while uploading
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + 10;
      });
    }, 200);

    try {
      const res = await uploadResume(selectedFile);
      clearInterval(interval);
      setUploadProgress(100);
      setFile(selectedFile);
      setUploadedResumeId(res.data.resume.id);
      toast.success('Resume uploaded and parsed successfully!');
    } catch (err: any) {
      clearInterval(interval);
      setUploadProgress(0);
      toast.error(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadedResumeId(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-32 px-6 flex flex-col items-center max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: FONTS.heading }}>Upload Your Resume</h2>
        <p style={{ color: COLORS.textMuted }}>Supported format: PDF (Max 5MB)</p>
      </div>

      <div className="w-full relative">
        {!file && uploadProgress === 0 && (
          <div 
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg h-80 flex flex-col items-center justify-center cursor-pointer
              transition-all duration-300 group relative overflow-hidden
              ${isDragging ? 'border-[#C6FF00] bg-[#151821]' : 'border-[#2A2E3B] bg-[#0E0F13] hover:border-[#9E9C96]'}
            `}
          >
            <div className={`absolute inset-0 bg-[#C6FF00] opacity-0 group-hover:opacity-5 transition-opacity ${isDragging ? 'opacity-10' : ''}`} />
            
            <div className="p-6 rounded-full bg-[#1E222F] mb-6 border border-[#2A2E3B] group-hover:scale-110 transition-transform duration-300">
              <Upload className={`w-8 h-8 ${isDragging ? 'text-[#C6FF00]' : 'text-[#9E9C96]'}`} />
            </div>
            
            <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>
              Click to upload or drag and drop
            </p>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              PDF or DOCX (Max 5MB)
            </p>
            
            <input 
              type="file" 
              ref={inputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Uploading State */}
        {uploadProgress > 0 && uploadProgress < 100 && !file && (
          <div className="border border-[#2A2E3B] bg-[#151821] rounded-lg h-80 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1 w-full bg-[#2A2E3B] overflow-hidden">
                <motion.div 
                  className="h-full bg-[#C6FF00]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* File Preview State */}
        {file && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="border border-[#C6FF00] bg-[#151821] rounded-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#1E222F] rounded border border-[#2A2E3B]">
                <FileText className="w-8 h-8 text-[#C6FF00]" />
              </div>
              <div>
                <h4 className="font-bold text-lg" style={{ color: COLORS.text }}>{file.name}</h4>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-2 hover:bg-[#2A2E3B] rounded-full transition-colors"
            >
              <X className="text-[#9E9C96] hover:text-[#FF4D4D]" />
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-12 w-full flex justify-end">
        <Button 
          size="lg" 
          onClick={() => {
            if (uploadedResumeId) {
              setFlowResumeId(uploadedResumeId);
              navigate('/job-input');
            }
          }}
          disabled={!file || !uploadedResumeId || uploading}
          className="w-full md:w-auto min-w-[200px]"
        >
          {uploading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          {uploading ? 'Uploading...' : 'Continue'}
        </Button>
      </div>
    </motion.div>
  );
};
