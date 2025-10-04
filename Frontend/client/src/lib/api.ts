const API_BASE_URL = 'http://localhost:8000';

export interface EmotionScores {
  valence: number;
  energy: number;
  tension: number;
  anger: number;
  fear: number;
  happy: number;
  sad: number;
  tender: number;
}

export interface PredictionResponse {
  success: boolean;
  filename: string;
  emotions: EmotionScores;
  processing_time: number;
  message: string;
}

export interface ApiError {
  detail: string;
}

export const uploadAudioFile = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/predict/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

export const checkApiHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health/`);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  
  return response.json();
};