import { useState } from 'react'
import FileUpload from '../FileUpload'

export default function FileUploadExample() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name)
    setIsUploading(true)
    
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)
      
      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsUploading(false)
          setProgress(0)
        }, 500)
      }
    }, 200)
  }

  return (
    <div className="p-8 bg-background">
      <FileUpload 
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
        uploadProgress={progress}
      />
    </div>
  )
}
