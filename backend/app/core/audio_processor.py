import numpy as np
from models.preprocessing import PreprocessingPipeline
import os

class AudioProcessor:
    def __init__(self):
        print("Initializing audio processor...")
        try:
            self.preprocessing_pipeline = PreprocessingPipeline()
            print("✅ Audio processor initialized")
        except Exception as e:
            print(f"❌ Failed to initialize preprocessing pipeline: {str(e)}")
            raise
    
    def process_audio(self, audio_path: str) -> np.ndarray:
        """
        Process audio file to spectrogram format expected by model
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            np.ndarray: Spectrogram of shape (1, 256, 1292) or similar
        """
        try:
            print(f"Processing audio file: {audio_path}")
            
            # Check if file exists
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
            # Check file size
            file_size = os.path.getsize(audio_path)
            print(f"File size: {file_size} bytes")
            
            # Use the single file processing method
            print("Calling preprocessing pipeline...")
            spectrogram = self.preprocessing_pipeline.process_single_file(audio_path)
            
            print(f"Preprocessing returned: {type(spectrogram)}")
            
            if spectrogram is None:
                raise ValueError("Preprocessing pipeline returned None")
            
            print(f"Spectrogram shape after preprocessing: {spectrogram.shape}")
            print(f"Spectrogram dtype: {spectrogram.dtype}")
            print(f"Spectrogram min/max: {spectrogram.min():.4f} / {spectrogram.max():.4f}")
            
            # Ensure correct shape for model input
            if len(spectrogram.shape) == 2:
                # Add channel dimension: (256, 1292) -> (1, 256, 1292)
                spectrogram = np.expand_dims(spectrogram, axis=0)
                print(f"Added channel dimension: {spectrogram.shape}")
            
            return spectrogram
            
        except Exception as e:
            print(f"❌ Audio processing error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise RuntimeError(f"Audio processing failed: {str(e)}")