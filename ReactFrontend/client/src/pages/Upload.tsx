import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from '@/lib/api';

export default function Upload() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log('File selected for upload:', file.name);
    toast.success(`File selected: ${file.name}`);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an audio file first');
      return;
    }

    setIsAnalyzing(true);
    console.log('Starting analysis for:', selectedFile.name);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Analyzing emotions in your audio...');
      
      // Call the backend API
      const results = await api.predictEmotion(selectedFile);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      console.log('Analysis results:', results);
      
      // Create audio URL for playback
      const audioUrl = URL.createObjectURL(selectedFile);
      
      // Navigate to results page with data
      setLocation('/results', {
        state: {
          results: {
            ...results,
            audioUrl: audioUrl,
            fileName: selectedFile.name
          }
        }
      });
      
      toast.success('Analysis complete!');
      
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast.error(error.message || 'Failed to analyze audio. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Upload Your Audio
          </h1>
          <p className="text-muted-foreground text-lg">
            Select an audio file to analyze emotions using our AI model
          </p>
        </motion.div>

        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <LoadingSpinner size="lg" text="Analyzing emotions in your audio..." />
            <p className="text-sm text-muted-foreground mt-4">
              This may take a few seconds...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <FileUploader onFileSelect={handleFileSelect} />

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-secondary/50 rounded-lg"
              >
                <p className="text-sm font-medium">
                  Selected: <span className="text-primary">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </motion.div>
            )}

            <div className="flex justify-center">
              <Button
                size="lg"
                disabled={!selectedFile || isAnalyzing}
                onClick={handleAnalyze}
                className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-chart-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                data-testid="button-analyze"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Supported formats: WAV, MP3, OGG, FLAC
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 50MB
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                💡 Tip: High-quality audio files produce better results
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}