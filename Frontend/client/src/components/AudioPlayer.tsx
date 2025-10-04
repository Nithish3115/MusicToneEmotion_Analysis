import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioFile: File | null;
  filename: string;
}

export default function AudioPlayer({ audioFile, filename }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isAudioContextSetup = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string>('');

  // Create audio URL from file
  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioFile]);

  // Setup audio context (only once per audio element)
  const setupAudioContext = async () => {
    const audio = audioRef.current;
    if (!audio || isAudioContextSetup.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      isAudioContextSetup.current = true;
      console.log('Audio context setup completed');
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  };

  // Main animation function
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (isPlaying && analyserRef.current) {
      // Draw live waveform
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const barWidth = rect.width / bufferLength;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#06b6d4');
      ctx.fillStyle = gradient;

      // Draw bars
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * rect.height * 0.8;
        const x = i * barWidth;
        const y = (rect.height - barHeight) / 2;
        
        ctx.fillRect(x, y, barWidth - 1, Math.max(barHeight, 2));
      }
    } else {
      // Draw static waveform
      const barCount = 64;
      const barWidth = rect.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = (Math.sin(i * 0.3) * 0.4 + 0.6) * rect.height * 0.5;
        const x = i * barWidth;
        const y = (rect.height - barHeight) / 2;
        
        // Progress coloring
        const progress = duration > 0 ? currentTime / duration : 0;
        if ((i / barCount) <= progress) {
          const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
          gradient.addColorStop(0, '#8b5cf6');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#06b6d4');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = 'rgb(71, 85, 105)';
        }
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }
    }

    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start/stop animation based on audio loading
  useEffect(() => {
    if (audioUrl) {
      // Start continuous animation
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl, isPlaying, currentTime, duration]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      // Setup audio context when audio is ready
      if (!isAudioContextSetup.current) {
        setupAudioContext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Setup audio context if not done yet
        if (!isAudioContextSetup.current) {
          await setupAudioContext();
        }
        
        // Resume audio context if suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!audioFile || !audioUrl) {
    return null;
  }

  return (
    <Card className="p-6" data-testid="card-audio-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="space-y-4">
        {/* Waveform Visualization */}
        <div className="relative h-32 bg-slate-900 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            onClick={handleCanvasClick}
            style={{ display: 'block' }}
          />
          <div className="absolute top-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="default"
            onClick={togglePlay}
            className="h-12 w-12 rounded-full"
            data-testid="button-play-pause"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          <div className="flex-1 space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
              data-testid="slider-progress"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              data-testid="button-mute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24 cursor-pointer"
              data-testid="slider-volume"
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground truncate text-center" data-testid="text-audio-filename">
          🎵 {filename}
        </div>
      </div>
    </Card>
  );
}