import EmotionCard from '../EmotionCard';

export default function EmotionCardExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
      <EmotionCard emotion="Happy" confidence={0.85} color="hsl(45, 95%, 60%)" delay={0} />
      <EmotionCard emotion="Sad" confidence={0.12} color="hsl(210, 80%, 55%)" delay={0.1} />
      <EmotionCard emotion="Angry" confidence={0.05} color="hsl(0, 85%, 60%)" delay={0.2} />
      <EmotionCard emotion="Valence" confidence={0.08} color="hsl(220, 10%, 50%)" delay={0.3} />
      <EmotionCard emotion="Fear" confidence={0.03} color="hsl(270, 75%, 58%)" delay={0.4} />
      <EmotionCard emotion="Tension" confidence={0.02} color="hsl(150, 70%, 50%)" delay={0.5} />
      <EmotionCard emotion="Energy" confidence={0.15} color="hsl(25, 90%, 60%)" delay={0.6} />
      <EmotionCard emotion="Tender" confidence={0.92} color="hsl(45, 95%, 60%)" isDominant delay={0.7} />

     
    </div>
  );
}
