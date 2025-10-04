from pydantic import BaseModel
from typing import Dict

class EmotionScores(BaseModel):
    valence: float
    energy: float
    tension: float
    anger: float
    fear: float
    happy: float
    sad: float
    tender: float

class PredictionResponse(BaseModel):
    success: bool
    filename: str
    emotions: EmotionScores
    processing_time: float
    message: str = "Emotion prediction completed successfully"