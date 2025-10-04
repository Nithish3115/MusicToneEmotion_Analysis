from app.models.preprocessing import PreprocessingPipeline
import os

# Test the preprocessing directly
audio_path = "/home/nithish/Desktop/MusicEmotionDetection-main/backend/test_data/Valence.mp3"

print(f"Testing file: {audio_path}")
print(f"File exists: {os.path.exists(audio_path)}")
print(f"File size: {os.path.getsize(audio_path)} bytes")

try:
    pipeline = PreprocessingPipeline()
    print("Pipeline initialized")
    
    # Use the new single file method
    result = pipeline.process_single_file(audio_path)
    print(f"Result type: {type(result)}")
    
    if result is not None:
        print(f"Shape: {result.shape}")
        print(f"Min/Max: {result.min():.4f} / {result.max():.4f}")
    else:
        print("Result is None")
    
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()