import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
}

export default function FileUploader({ onFileSelect, acceptedFormats = ['.wav', '.mp3', '.ogg', '.flac'] }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
    console.log('File selected:', file.name);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('File removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card
        className={`p-12 border-2 border-dashed transition-all ${
          isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover-elevate'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className={`p-6 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 ${isDragging ? 'scale-110' : ''} transition-transform`}>
            <Upload className="w-16 h-16 text-primary" />
          </div>
          
          <div>
            <h3 className="text-xl font-heading font-semibold mb-2">
              {isDragging ? 'Drop your audio file here' : 'Upload Audio File'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your audio file here, or click to browse
            </p>
            <Button 
              onClick={handleBrowseClick}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-primary to-chart-2"
              data-testid="button-browse"
            >
              Browse Files
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Supported formats: {acceptedFormats.join(', ').toUpperCase()}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            data-testid="input-file"
          />
        </div>
      </Card>

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6" data-testid="card-file-preview">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-primary/10">
                <File className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate" data-testid="text-filename">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                data-testid="button-remove-file"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
