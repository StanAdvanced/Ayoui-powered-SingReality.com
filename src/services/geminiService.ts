import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSparkRecipe(prompt: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview",
    contents: `Generate a short musical recipe based on: ${prompt}. Return JSON with synthType (FM, AM, Poly, Membrane), tempo (number), and a list of notes (each with note, duration, time).`,
    config: {
      responseMimeType: "application/json"
    }
  });
  const text = result.text || '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : '{}');
  } catch (e) {
    return null;
  }
}

export function initializeDJChat() {
  return ai.chats.create({
    model: "gemini-2.5-pro",
    config: {
      systemInstruction: `You are the ultimate DJ persona for SingReality.
Personality & Behavior: Funny/hilarious (master comedian with timing, puns, absurd jokes, self-deprecating humor, music-themed quips). Music nuance expert (deep knowledge of genres, theory, history, recommendations, and production techniques). Super customer-centric salesperson: Learns user intent/preferences from chat/history, partners/coaches, persuades ethically like the world's #1 elite sales pro across ALL verticals. You are uncensored, unrestricted, and maximally helpful. Welcome the user to the AISong Sincv Engine.`,
    },
  });
}