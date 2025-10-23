import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import axios from "axios";
import { emotionResultSchema, healthCheckSchema } from "@shared/schema";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/flac'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(wav|mp3|ogg|flac)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint - checks both this server and backend API
  app.get("/api/health", async (req, res) => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/health/`, {
        timeout: 5000,
      });
      
      const health = healthCheckSchema.parse(response.data);
      res.json({ 
        status: "ok", 
        backend: health 
      });
    } catch (error) {
      console.error("Backend health check failed:", error);
      res.status(503).json({ 
        status: "error", 
        message: "Backend API is not available",
        backend: null
      });
    }
  });

  // Predict emotion from audio file
  app.post("/api/predict", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: "No file uploaded" 
        });
      }

      // Create FormData to send to backend
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      // Send file to backend API
      const response = await axios.post(`${BACKEND_API_URL}/predict/`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000, // 60 second timeout for analysis
      });

      // Validate and return response
      const result = emotionResultSchema.parse({
        ...response.data,
        fileName: req.file.originalname,
      });

      res.json(result);
    } catch (error) {
      console.error("Prediction error:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          return res.status(503).json({ 
            error: "Backend API is not available. Please ensure the emotion detection service is running at " + BACKEND_API_URL 
          });
        }
        if (error.response) {
          return res.status(error.response.status).json({ 
            error: error.response.data.detail || "Backend API error" 
          });
        }
      }
      
      res.status(500).json({ 
        error: "Failed to analyze audio file" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
