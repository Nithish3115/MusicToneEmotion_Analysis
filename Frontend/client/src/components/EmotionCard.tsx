import { Card } from "@/components/ui/card";
import CircularProgress from "./CircularProgress";

interface EmotionCardProps {
  emotion: string;
  score: number;
  color: string;
}

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

export default function EmotionCard({ emotion, score, color }: EmotionCardProps) {
  const emotionColor = color || emotionColors[emotion.toLowerCase()] || "hsl(258 77% 64%)";

  return (
    <Card 
      className="p-6 flex items-center justify-center hover-elevate transition-transform" 
      data-testid={`card-emotion-${emotion}`}
    >
      <CircularProgress
        value={score}
        color={emotionColor}
        label={emotion}
      />
    </Card>
  );
}
