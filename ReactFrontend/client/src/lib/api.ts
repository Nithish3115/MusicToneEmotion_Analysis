import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Backend response structure (what backend actually returns)
interface BackendResponse {
  success: boolean;
  filename: string;
  emotions: {
    valence: number;
    energy: number;
    tension: number;
    anger: number;
    fear: number;
    happy: number;
    sad: number;
    tender: number;
  };
  processing_time: number;
  message: string;
}

// Frontend expected structure
export interface PredictionResponse {
  predictions: {
    valence: number;
    energy: number;
    tension: number;
    anger: number;
    fear: number;
    happy: number;
    sad: number;
    tender: number;
  };
  dominant_emotion: string;
  second_dominant_emotion: string;
  processing_time: number;
}

export const api = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/`);
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async predictEmotion(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post<BackendResponse>(
        `${API_BASE_URL}/predict/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('=== BACKEND RESPONSE DEBUG ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Emotions from backend:', response.data.emotions);
      console.log('==============================');
  
      const backendData = response.data;
      
      // Check if data exists
      if (!backendData || !backendData.emotions) {
        throw new Error('Invalid response from backend - no emotions found');
      }

      const emotions = backendData.emotions;
  
      // Find top 2 dominant emotions (highest absolute values)
      const emotionEntries = Object.entries(emotions).filter(
        ([key]) => ['valence', 'energy', 'tension', 'anger', 'fear', 'happy', 'sad', 'tender'].includes(key)
      ) as [string, number][];
      
      console.log('Emotion entries:', emotionEntries);
      
      if (emotionEntries.length === 0) {
        throw new Error('No emotion data found in response');
      }

      // Sort by absolute value (descending) to get strongest emotions
      const sortedEmotions = emotionEntries.sort((a, b) => 
        Math.abs(b[1]) - Math.abs(a[1])
      );

      const dominantEmotion = sortedEmotions[0][0];
      const secondDominantEmotion = sortedEmotions.length > 1 ? sortedEmotions[1][0] : dominantEmotion;
  
      console.log('Primary dominant emotion:', dominantEmotion, '(value:', sortedEmotions[0][1], ')');
      console.log('Secondary dominant emotion:', secondDominantEmotion, '(value:', sortedEmotions[1]?.[1], ')');
  
      // Transform to match frontend expectations
      const transformedResponse: PredictionResponse = {
        predictions: {
          valence: Number(emotions.valence) || 0,
          energy: Number(emotions.energy) || 0,
          tension: Number(emotions.tension) || 0,
          anger: Number(emotions.anger) || 0,
          fear: Number(emotions.fear) || 0,
          happy: Number(emotions.happy) || 0,
          sad: Number(emotions.sad) || 0,
          tender: Number(emotions.tender) || 0,
        },
        dominant_emotion: dominantEmotion,
        second_dominant_emotion: secondDominantEmotion,
        processing_time: backendData.processing_time || 0
      };
  
      console.log('Transformed response:', transformedResponse);
      console.log('Predictions object:', transformedResponse.predictions);
      
      return transformedResponse;
  
    } catch (error: any) {
      console.error('Prediction error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.detail || 'Failed to analyze audio');
      }
      throw new Error('Network error. Please check if backend is running.');
    }
  }
};