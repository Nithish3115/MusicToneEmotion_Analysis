import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/AudioPlayer";
import EmotionCard from "@/components/EmotionCard";
import { Download, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Emotion colors matching your backend's 8 emotions
const emotionColors: Record<string, string> = {
  valence: "hsl(120 60% 50%)",
  energy: "hsl(40 100% 60%)",
  tension: "hsl(0 70% 55%)",
  anger: "hsl(0 60% 40%)",
  fear: "hsl(270 60% 50%)",
  happy: "hsl(190 80% 60%)",
  sad: "hsl(220 60% 45%)",
  tender: "hsl(330 70% 65%)",
};

interface EmotionResults {
  predictions: {
    valence: number;
    energy: number;
    tension: number;
    anger: number;
    fear: number;
    happy: number;
    sad: number;
    tender: number;
  };
  dominant_emotion: string;
  second_dominant_emotion?: string;
  processing_time?: number;
  audioUrl?: string;
  fileName?: string;
}

// Helper function to normalize values from backend range to 0-1
const normalizeValue = (value: number | undefined | null): number => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  
  // Backend returns values roughly in range -3 to 5
  // Normalize to 0-1 for display
  const min = -3;
  const max = 5;
  const normalized = (value - min) / (max - min);
  return Math.max(0, Math.min(1, normalized));
};

export default function Results() {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<EmotionResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from location state (passed from Upload page)
    const state = window.history.state;
    console.log('Results page received state:', state);
    
    if (state?.results) {
      console.log('Results data:', state.results);
      console.log('Predictions:', state.results.predictions);
      setResults(state.results);
      setLoading(false);
    } else {
      // No results available, redirect to upload
      toast.error('No analysis results found');
      setLocation('/upload');
    }
  }, [setLocation]);

  const handleDownload = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Results downloaded successfully!');
    console.log('Downloaded results:', results);
  };

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  // Check if predictions exist
  if (!results.predictions) {
    console.error('No predictions found in results:', results);
    toast.error('Invalid results data');
    setLocation('/upload');
    return null;
  }

  // Transform predictions into emotion cards format with normalization
  const emotions = Object.entries(results.predictions)
    .map(([emotion, rawValue]) => {
      const normalizedConfidence = normalizeValue(rawValue as number);
      return {
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        confidence: normalizedConfidence,
        rawValue: rawValue as number,
        color: emotionColors[emotion] || 'hsl(220, 10%, 50%)',
      };
    })
    .sort((a, b) => Math.abs(b.rawValue) - Math.abs(a.rawValue)); // Sort by absolute value

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Analysis Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Emotion detection complete with confidence scores
          </p>
          {results.processing_time && (
            <p className="text-sm text-muted-foreground mt-2">
              ⚡ Analyzed in {results.processing_time.toFixed(2)}s
            </p>
          )}
        </motion.div>

        <div className="space-y-12">
          {/* Audio Player Section */}
          {results.audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <AudioPlayer 
                audioUrl={results.audioUrl} 
                fileName={results.fileName || 'Audio File'} 
              />
            </motion.div>
          )}

          {/* All 8 Emotions Grid - 4x2 layout */}
          <div>
            <h2 className="text-2xl font-heading font-semibold text-center mb-8">
              Detected Emotions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {emotions.map((emotion, index) => (
                <EmotionCard
                  key={emotion.emotion}
                  {...emotion}
                  delay={0.1 + index * 0.05}
                />
              ))}
            </div>
          </div>

          {/* Emotion Breakdown Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-semibold text-center mb-8">
              Detailed Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold mb-4">Primary Dimensions</h3>
                {['valence', 'energy', 'tension'].map(emotion => {
                  const rawValue = results.predictions[emotion as keyof typeof results.predictions];
                  
                  // Safe check for undefined/null
                  if (rawValue === undefined || rawValue === null) {
                    return null;
                  }
                  
                  const normalizedValue = normalizeValue(rawValue);
                  return (
                    <div key={emotion} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: emotionColors[emotion] }}
                      />
                      <span className="capitalize flex-1">{emotion}</span>
                      <div className="text-right">
                        <span className="font-mono text-sm block">
                          {(normalizedValue * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (raw: {Number(rawValue).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold mb-4">Discrete Emotions</h3>
                {['anger', 'fear', 'happy', 'sad', 'tender'].map(emotion => {
                  const rawValue = results.predictions[emotion as keyof typeof results.predictions];
                  
                  // Safe check for undefined/null
                  if (rawValue === undefined || rawValue === null) {
                    return null;
                  }
                  
                  const normalizedValue = normalizeValue(rawValue);
                  return (
                    <div key={emotion} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: emotionColors[emotion] }}
                      />
                      <span className="capitalize flex-1">{emotion}</span>
                      <div className="text-right">
                        <span className="font-mono text-sm block">
                          {(normalizedValue * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (raw: {Number(rawValue).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/upload">
              <Button
                size="lg"
                variant="outline"
                className="px-8"
                data-testid="button-analyze-another"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Analyze Another File
              </Button>
            </Link>

            <Button
              size="lg"
              onClick={handleDownload}
              className="px-8 bg-gradient-to-r from-primary to-chart-2"
              data-testid="button-download-results"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Results
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}