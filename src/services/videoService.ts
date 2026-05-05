import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePromotionalVideo(prompt: string, trackTitle?: string) {
  try {
    const finalPrompt = trackTitle 
      ? `Create a cinematic promotional music video for the track "${trackTitle}". Visual style: ${prompt}. Highly dynamic, emotional, and visually stunning.`
      : prompt;

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: finalPrompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    // Note: In a real app, we might need to poll for the operation result if it takes a while,
    // but the SDK handles the wait for simple generateVideos calls usually or returns a pollable operation.
    // According to gemini-api skill, it can take a few minutes.
    
    return operation;
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
}
