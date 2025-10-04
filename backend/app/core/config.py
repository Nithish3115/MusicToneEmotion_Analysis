from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Settings
    api_title: str = "Music Emotion Recognition API"
    api_version: str = "1.0.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # Model Settings
    model_path: str = "best.pth"
    device: str = "auto"  # auto, cpu, cuda
    
    # Audio Processing Settings
    sample_rate: int = 22050
    duration: int = 15
    frame_size: int = 512
    hop_length: int = 256
    
    # File Settings
    max_file_size: int = 50 * 1024 * 1024  # 50MB
    allowed_extensions: List[str] = [".mp3", ".wav", ".flac", ".m4a", ".ogg"]
    upload_dir: str = "uploads"
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "logs/app.log"
    
    class Config:
        env_file = ".env"

settings = Settings()