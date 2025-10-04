import CircularProgress from '../CircularProgress'

export default function CircularProgressExample() {
  return (
    <div className="flex gap-8 p-8 bg-background flex-wrap">
      <CircularProgress
        value={6.54}
        color="hsl(190 80% 60%)"
        label="happy"
      />
      <CircularProgress
        value={4.23}
        color="hsl(120 60% 50%)"
        label="valence"
      />
      <CircularProgress
        value={2.11}
        color="hsl(0 60% 40%)"
        label="anger"
      />
    </div>
  )
}
