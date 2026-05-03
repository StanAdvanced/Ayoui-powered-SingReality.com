import { GoogleGenAI, Modality } from "@google/genai";
import { SparkRecipe } from "../lib/audioEngine";
import { BiometricData } from "./aisongSincvEngine";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// ...
export async function generateSpeech(text: string): Promise<string | null> {
  try {
    return await withRetry(async () => {
      console.log(`[TTS] Requesting speech for: "${text.slice(0, 30)}..." using model: gemini-3.1-flash-tts-preview`);
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
          },
        },
      });
      
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) {
        console.warn("[TTS] No audio data in response parts.");
      }
      return audioData || null;
    });
  } catch (error: any) {
    if (error?.status === 403) {
      console.error("TTS Generation Error (403): Permission Denied. This usually means the 'gemini-3.1-flash-tts-preview' model is not enabled for your API key or region. Please ensure your project has the correct permissions.");
    } else {
      console.error("Error generating speech:", error);
    }
    return null;
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error?.status === 429) {
      console.warn(`Rate limit exceeded, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function generateLyrics(prompt: string) {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate futuristic, high-energy karaoke lyrics for a song titled: ${prompt}. The song is for SingReality, a quantum-powered global sing-a-long platform. Focus on themes of convergence, digital harmony, and the future of music.`,
        config: {
          systemInstruction: "You are a world-class songwriter for SingReality, specializing in futuristic, high-tech, and emotionally resonant lyrics.",
        },
      });
      return response.text || "The singularity is calling... (lyrics generation failed)";
    });
  } catch (error) {
    console.error("Error generating lyrics:", error);
    return "The singularity is calling... (lyrics generation failed)";
  }
}

export async function generateAvatar(prompt: string, baseImage?: string): Promise<string | null> {
  try {
    return await withRetry(async () => {
      const parts: any[] = [
        {
          text: `A futuristic, highly detailed 3D avatar for a virtual performer in a holographic karaoke arena. Style: cyberpunk, neon, hyper-realistic, 8K, cinematic lighting. Details: ${prompt}`,
        },
      ];

      if (baseImage) {
        const match = baseImage.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          parts.unshift({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/jpeg;base64,${part.inlineData.data}`;
        }
      }
      return null;
    });
  } catch (error) {
    console.error("Error generating avatar:", error);
    return null;
  }
}

export async function generateBgmRecipe(prompt: string, biometrics: BiometricData): Promise<SparkRecipe | null> {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a background music sequence based on this vibe: "${prompt}".
        Additionally, integrate the following biometric data to dynamically adjust the music:
        - Heart Rate: ${biometrics.heartRate.toFixed(1)} BPM (Influence the tempo, e.g., higher HR = faster tempo)
        - Alpha Wave: ${biometrics.alphaWave.toFixed(2)} (Influence the synth type or note density, e.g., higher alpha = more relaxing/ambient)
        - Theta Wave: ${biometrics.thetaWave.toFixed(2)} (Influence the duration or rhythm)
        
        Return ONLY a valid JSON object matching this schema:
        {
          "synthType": "FM" | "AM" | "Poly" | "Membrane",
          "tempo": number,
          "notes": [
            { "note": "C4", "duration": "8n", "time": "0:0:0" },
            { "note": "E4", "duration": "8n", "time": "0:0:2" }
          ]
        }
        Use standard Tone.js time formats (bars:beats:sixteenths like "0:0:0", "0:1:0") and durations ("8n", "4n", "16n").
        Keep the sequence between 4 to 8 bars long.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text;
      if (text) {
        return JSON.parse(text) as SparkRecipe;
      }
      return null;
    });
  } catch (error) {
    console.error("Error generating BGM recipe:", error);
    return null;
  }
}

export async function generateSparkRecipe(prompt: string): Promise<SparkRecipe | null> {
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short musical sequence (a "Spark") based on this vibe: "${prompt}".
        Return ONLY a valid JSON object matching this schema:
        {
          "synthType": "FM" | "AM" | "Poly" | "Membrane",
          "tempo": number (e.g., 120),
          "notes": [
            { "note": "C4", "duration": "8n", "time": "0:0:0" },
            { "note": "E4", "duration": "8n", "time": "0:0:2" }
          ]
        }
        Use standard Tone.js time formats (bars:beats:sixteenths like "0:0:0", "0:1:0") and durations ("8n", "4n", "16n").
        Keep the sequence between 2 to 4 bars long.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text;
      if (text) {
        return JSON.parse(text) as SparkRecipe;
      }
      return null;
    });
  } catch (error) {
    console.error("Error generating spark recipe:", error);
    return null;
  }
}
