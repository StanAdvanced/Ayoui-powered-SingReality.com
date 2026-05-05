import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../components/QuantumJukebox";
import { getStreamingLogs } from "./streamingLogs";

export async function getJukeboxSuggestions(queueTitles: string[]): Promise<Partial<Song>[]> {
  try {
    const logs = getStreamingLogs();
    const logSummary = logs.map(l => `Action: ${l.action}`).join(', ');

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert DJ for a high-tech Karaoke Room. 
Current Queue: ${queueTitles.join(', ') || 'Empty'}.
Recent Activity Summary: ${logSummary}.
Based on this vibe, suggest 5 high-energy tracks.
Return JSON array of {title, artist}.`,
        config: {
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

    if (response.text) {
       return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch AI suggestions", error);
    return [];
  }
}
