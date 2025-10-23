import FileUploader from '../FileUploader';

export default function FileUploaderExample() {
  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
  };

  return (
    <div className="p-8">
      <FileUploader onFileSelect={handleFileSelect} />
    </div>
  );
}
