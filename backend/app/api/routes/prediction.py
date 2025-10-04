from fastapi import APIRouter, File, UploadFile, HTTPException
import tempfile
import os
import time
from app.core.model_handler import ModelHandler
from app.core.audio_processor import AudioProcessor

router = APIRouter(prefix="/predict", tags=["prediction"])

# Global instances (we'll improve this later with dependency injection)
model_handler = ModelHandler()
audio_processor = AudioProcessor()

@router.post("/")
async def predict_emotion(file: UploadFile = File(...)):
    """
    Predict emotions from uploaded audio file
    
    Returns 8 emotion scores: valence, energy, tension, anger, fear, happy, sad, tender
    Each score is in the range 1.0 to 7.83
    """
    start_time = time.time()
    
    print(f"\n🎵 Processing file: {file.filename}")
    
    # Validate file type
    supported_extensions = ('.mp3', '.wav', '.flac', '.m4a', '.ogg')
    if not file.filename.lower().endswith(supported_extensions):
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported audio format. Please upload files with extensions: {supported_extensions}"
        )
    
    # Check if model is loaded
    if not model_handler.is_loaded():
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    temp_file_path = None
    try:
        # Save uploaded file temporarily
        file_extension = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            temp_file_path = tmp_file.name
        
        print(f"📁 Saved temp file: {temp_file_path}")
        
        # Process audio to spectrogram
        print("🔄 Converting audio to spectrogram...")
        spectrogram = audio_processor.process_audio(temp_file_path)
        
        # Get emotion predictions
        print("🧠 Running model prediction...")
        emotions = model_handler.predict(spectrogram)
        
        processing_time = round(time.time() - start_time, 2)
        
        print(f"✅ Prediction completed in {processing_time}s")
        print(f"🎭 Emotions: {emotions}")
        
        return {
            "success": True,
            "filename": file.filename,
            "emotions": emotions,
            "processing_time": processing_time,
            "message": "Emotion prediction completed successfully"
        }
        
    except Exception as e:
        print(f"❌ Error processing {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            print(f"🗑️ Cleaned up temp file")