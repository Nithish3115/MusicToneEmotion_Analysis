import { z } from "zod";

// Emotion analysis result type from backend API
export const emotionResultSchema = z.object({
  emotion: z.string(),
  confidence: z.number(),
  all_predictions: z.record(z.string(), z.number()),
  fileName: z.string().optional(),
  audioUrl: z.string().optional(),
});

export type EmotionResult = z.infer<typeof emotionResultSchema>;

// API response schemas
export const healthCheckSchema = z.object({
  status: z.string(),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;
