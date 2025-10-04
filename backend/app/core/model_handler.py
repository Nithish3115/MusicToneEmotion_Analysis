import torch
import numpy as np
from models.torch_models import Audio2EmotionModel

class ModelHandler:
    def __init__(self):
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.emotion_labels = ['valence', 'energy', 'tension', 'anger', 'fear', 'happy', 'sad', 'tender']
        print(f"Using device: {self.device}")
    
    def load_model(self, weights_path: str = "best.pth"):
        """Load the Audio2EmotionModel with trained weights"""
        try:
            print(f"Loading model from {weights_path}...")
            
            # Initialize your model
            self.model = Audio2EmotionModel()
            
            # Load weights
            state_dict = torch.load(weights_path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            
            # Set to evaluation mode and move to device
            self.model.eval()
            self.model.to(self.device)
            
            print(f"✅ Model loaded successfully on {self.device}")
            
        except Exception as e:
            print(f"❌ Failed to load model: {str(e)}")
            self.model = None
            raise
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def rescale(self, prediction, scaler_min=1, scaler_max=7.83):
        """Rescale predictions back to original range (1 to 7.83)"""
        return prediction * (scaler_max - scaler_min) + scaler_min
    
    def predict(self, spectrogram: np.ndarray) -> dict:
        """
        Predict emotions from spectrogram
        
        Args:
            spectrogram: numpy array of shape (1, 256, 1292) or (256, 1292)
            
        Returns:
            dict: emotion scores for all 8 dimensions
        """
        if not self.is_loaded():
            raise RuntimeError("Model not loaded")
        
        try:
            print(f"Input spectrogram shape: {spectrogram.shape}")
            
            # Ensure correct shape (B, C, H, W) = (1, 1, 256, 1292)
            if len(spectrogram.shape) == 2:
                # Shape is (256, 1292), add batch and channel dimensions
                input_tensor = torch.FloatTensor(spectrogram).unsqueeze(0).unsqueeze(0)
            elif len(spectrogram.shape) == 3:
                # Shape is (1, 256, 1292), add batch dimension
                input_tensor = torch.FloatTensor(spectrogram).unsqueeze(0)
            else:
                # Already has batch dimension
                input_tensor = torch.FloatTensor(spectrogram)
            
            print(f"Model input tensor shape: {input_tensor.shape}")
            
            # Move to device
            input_tensor = input_tensor.to(self.device)
            
            # Make prediction
            with torch.no_grad():
                prediction = self.model(input_tensor)  # [B, 8]
                prediction = prediction.cpu().numpy()
                
                # Handle batch dimension
                if prediction.shape[0] == 1:
                    prediction = prediction[0]  # Get first batch item
            
            print(f"Raw prediction: {prediction}")
            
            # Rescale predictions to original range (1 to 7.83)
            emotions_rescaled = self.rescale(prediction)
            print(f"Rescaled emotions: {emotions_rescaled}")
            
            # Create emotion dictionary
            emotion_scores = {
                label: round(float(score), 2) 
                for label, score in zip(self.emotion_labels, emotions_rescaled)
            }
            
            return emotion_scores
            
        except Exception as e:
            print(f"❌ Prediction error: {str(e)}")
            raise RuntimeError(f"Prediction failed: {str(e)}")