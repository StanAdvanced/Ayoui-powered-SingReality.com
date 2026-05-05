import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../components/QuantumJukebox";
import { getStreamingLogs } from "./streamingLogs";

export async function getJukeboxSuggestions(queueTitles: string[]): Promise<Partial<Song>[]> {
  try {
    const logs = getStreamingLogs();
    const logSummary = logs.map(l => `Action: ${l.action}`).join(', ');

    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
    
    const genAI = new GoogleGenAI(apiKey);
    const model = (genAI as any).getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const response = await model.generateContent({
        contents: [{
            role: 'user',
            parts: [{
                text: `You are an expert DJ for a high-tech Karaoke Room. 
Current Queue: ${queueTitles.join(', ') || 'Empty'}.
Recent Activity Summary: ${logSummary}.
Based on this vibe, suggest 5 high-energy tracks.
Return JSON array of {title, artist}.`
            }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        artist: { type: Type.STRING }
                    },
                    required: ["title", "artist"]
                }
            }
        }
    });

    const text = response.response.text();
    if (text) {
       return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch AI suggestions", error);
    return [];
  }
}
