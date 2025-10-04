import ErrorMessage from '../ErrorMessage'

export default function ErrorMessageExample() {
  const handleRetry = () => {
    console.log('Retry clicked')
  }

  return (
    <div className="p-8 bg-background">
      <ErrorMessage 
        message="Failed to analyze the audio file. Please check your connection and try again."
        onRetry={handleRetry}
      />
    </div>
  )
}
