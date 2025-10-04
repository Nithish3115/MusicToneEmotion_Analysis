import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Music, FileAudio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const ACCEPTED_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/flac': ['.flac'],
  'audio/x-m4a': ['.m4a'],
  'audio/ogg': ['.ogg'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function FileUpload({ onFileSelect, isUploading = false, uploadProgress = 0 }: FileUploadProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError("");
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError("File size must be less than 50MB");
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError("Please upload a valid audio file (MP3, WAV, FLAC, M4A, OGG)");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
  });

  return (
    <Card 
      className={`p-8 transition-all ${
        isDragActive 
          ? "border-primary border-2 bg-primary/5 scale-[1.02]" 
          : "border-dashed border-2"
      } ${isUploading ? "opacity-60" : ""}`}
      data-testid="card-file-upload"
    >
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center min-h-64 cursor-pointer"
      >
        <input {...getInputProps()} data-testid="input-file" />
        
        {isUploading ? (
          <div className="w-full max-w-md space-y-4">
            <div className="flex justify-center">
              <FileAudio className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" data-testid="progress-upload" />
              <p className="text-center text-sm text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              {isDragActive ? (
                <Music className="w-12 h-12 text-primary" />
              ) : (
                <Upload className="w-12 h-12 text-primary" />
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {isDragActive ? "Drop your audio file here" : "Upload Audio File"}
            </h3>
            
            <p className="text-muted-foreground mb-4 text-center max-w-md">
              Drag and drop your audio file here, or click to browse
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {['MP3', 'WAV', 'FLAC', 'M4A', 'OGG'].map((format) => (
                <span 
                  key={format}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                >
                  {format}
                </span>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Maximum file size: 50MB
            </p>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-center" data-testid="text-upload-error">
                  {error}
                </p>
              </div>
            )}

            <Button 
              variant="outline" 
              className="mt-4"
              data-testid="button-browse-file"
            >
              Browse Files
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
