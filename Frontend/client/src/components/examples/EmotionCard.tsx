import EmotionCard from '../EmotionCard'

export default function EmotionCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-background">
      <EmotionCard emotion="happy" score={6.54} color="hsl(190 80% 60%)" />
      <EmotionCard emotion="energy" score={6.12} color="hsl(40 100% 60%)" />
      <EmotionCard emotion="valence" score={5.23} color="hsl(120 60% 50%)" />
      <EmotionCard emotion="tender" score={4.76} color="hsl(330 70% 65%)" />
    </div>
  )
}
