import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import FileUpload from '@/components/FileUpload';
import EmotionCard from '@/components/EmotionCard';
import ThemeToggle from '@/components/ThemeToggle';
import { uploadAudioFile, checkApiHealth, PredictionResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // 🔥 ADDED
  const { toast } = useToast();

  // API Health Check
  const { data: healthData, isError: healthError } = useQuery({
    queryKey: ['api-health'],
    queryFn: checkApiHealth,
    retry: 3,
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadAudioFile,
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Analysis completed in ${data.processing_time}s`,
      });
      setResults(data);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    setUploadedFile(file); // 🔥 ADDED
    uploadMutation.mutate(file);
  };

  const resetResults = () => {
    setResults(null);
    setUploadedFile(null); // 🔥 ADDED
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎵 Music Emotion Recognition
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Upload an audio file to analyze its emotional characteristics
          </p>
          
          {/* API Status */}
          <div className="flex justify-center">
            {healthError ? (
              <Badge variant="destructive" className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3" />
                API Offline
              </Badge>
            ) : (
              <Badge className="flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                <CheckCircle2 className="h-3 w-3" />
                API Connected
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8">
          {!results ? (
            <>
              <FileUpload
                onFileSelect={handleFileSelect}
                isUploading={uploadMutation.isPending}
                uploadProgress={50}
              />
              
              <div className="text-center max-w-2xl">
                <p className="text-gray-600 dark:text-gray-300">
                  Supported formats: MP3, WAV, FLAC, M4A, OGG (Max 50MB)
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 🔥 ADDED AUDIO PLAYER */}
              {uploadedFile && (
                <AudioPlayer 
                  audioFile={uploadedFile} 
                  filename={results.filename}
                />
              )}

              {/* Results using your existing EmotionCard components */}
              <div className="w-full max-w-6xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">🎭 Emotion Analysis Results</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Analysis for: <span className="font-medium text-gray-900 dark:text-gray-100">{results.filename}</span> 
                    <span className="ml-4">Processing time: {results.processing_time}s</span>
                  </p>
                </div>
                
                {/* Emotion Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {Object.entries(results.emotions).map(([emotion, score]) => (
                    <EmotionCard
                      key={emotion}
                      emotion={emotion}
                      score={score}
                      maxScore={7.83}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={resetResults}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800"
              >
                Analyze Another File
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}