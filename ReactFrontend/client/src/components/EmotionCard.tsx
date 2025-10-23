import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from "framer-motion";

interface EmotionCardProps {
  emotion: string;
  confidence: number;
  color: string;
  isDominant?: boolean;
  delay?: number;
}

export default function EmotionCard({ emotion, confidence, color, isDominant = false, delay = 0 }: EmotionCardProps) {
  const percentage = Math.round(confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        className={`p-6 flex flex-col items-center gap-4 ${isDominant ? 'border-2 col-span-2 md:col-span-1' : ''}`}
        style={isDominant ? { borderColor: color } : {}}
        data-testid={`card-emotion-${emotion.toLowerCase()}`}
      >
        <div className={`${isDominant ? 'w-32 h-32' : 'w-24 h-24'}`}>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: color,
              textColor: 'hsl(var(--foreground))',
              trailColor: 'hsl(var(--muted))',
              pathTransitionDuration: 1,
              textSize: '1.5rem',
            })}
          />
        </div>
        <div className="text-center">
          <h3 className={`font-heading font-semibold ${isDominant ? 'text-2xl' : 'text-lg'}`} data-testid={`text-emotion-${emotion.toLowerCase()}`}>
            {emotion}
          </h3>
          {isDominant && (
            <p className="text-sm text-muted-foreground mt-1">Dominant Emotion</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
