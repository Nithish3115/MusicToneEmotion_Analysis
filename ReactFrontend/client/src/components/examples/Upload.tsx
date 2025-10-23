import Upload from '../../pages/Upload';
import { Toaster } from 'react-hot-toast';

export default function UploadExample() {
  return (
    <>
      <Upload />
      <Toaster position="top-right" />
    </>
  );
}
