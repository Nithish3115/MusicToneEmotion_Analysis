import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import axios from "axios";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/mpeg',
      'audio/wav',
      'audio/flac',
      'audio/x-m4a',
      'audio/ogg',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP3, WAV, FLAC, M4A, and OGG files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Emotion prediction endpoint
  app.post("/api/predict", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      const startTime = Date.now();

      // TODO: Replace with actual API endpoint
      const API_BASE_URL = process.env.EMOTION_API_URL || 'YOUR_API_URL_HERE';
      
      // Check if API URL is configured
      if (API_BASE_URL === 'YOUR_API_URL_HERE') {
        // Return mock data for demonstration
        const mockResponse = {
          success: true,
          filename: req.file.originalname,
          emotions: {
            valence: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            energy: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            tension: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            anger: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            fear: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            happy: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            sad: parseFloat((Math.random() * 7 + 1).toFixed(2)),
            tender: parseFloat((Math.random() * 7 + 1).toFixed(2)),
          },
          processing_time: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
          message: "Emotion prediction completed successfully (MOCK DATA - Configure EMOTION_API_URL environment variable)"
        };
        
        return res.json(mockResponse);
      }

      // Create FormData for the external API
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      // Call the external emotion recognition API
      const response = await axios.post(`${API_BASE_URL}/predict/`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 120000, // 2 minutes timeout
      });

      const processingTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

      // Return the response from the external API
      res.json({
        success: true,
        filename: req.file.originalname,
        emotions: response.data.emotions,
        processing_time: response.data.processing_time || processingTime,
        message: response.data.message || "Emotion prediction completed successfully"
      });

    } catch (error: any) {
      console.error('Prediction error:', error.message);
      
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 50MB limit"
        });
      }

      if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({
          success: false,
          message: error.response?.data?.message || "Failed to analyze audio file"
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || "An error occurred during emotion analysis"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      apiConfigured: process.env.EMOTION_API_URL !== undefined && process.env.EMOTION_API_URL !== 'YOUR_API_URL_HERE',
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
