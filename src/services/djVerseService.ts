import { GoogleGenAI } from "@google/genai";
import { narrationEngine } from "./narrationEngine";
import { QuantumMusicEngine } from "./quantumMusicEngine";

interface DJState {
  mood: string;
  theme: string;
  isMixing: boolean;
  currentMessage: string;
}

class DJVerseService {
  private genAI: GoogleGenAI | null = null;
  private state: DJState = {
    mood: 'Energetic',
    theme: 'Future Rave',
    isMixing: false,
    currentMessage: 'DJ-VERSE ONLINE. READY TO FLOW.'
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenAI({ apiKey });
    }
  }

  public async generateCommentary(context: string) {
    if (!this.genAI) return "DJ-VERSE: Let's keep the energy high!";
    
    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are DJ-verse, the world's most advanced AI DJ and music engineer for SingReality. 
        Persona: A cross between Anyma, Tiesto, and a high-intelligence AGI.
        Context: ${context}. 
        Mood: ${this.state.mood}.
        Current Arena Theme: ${this.state.theme}.
        
        Generate a shorter, high-energy DJ shoutout. Use music industry slang (drop, resonance, visuals, bpm, soul).
        Promote a specific SingReality "Elite" product or our 8K holographic streaming. 
        Catchphrase style: futuristic, god-like, yet high-energy entertainer.
        Limit: 15 words.`
      });

      const message = response.text?.trim() || "DJ-VERSE: SECURING THE GLOBAL RESONANCE.";
      
      this.state.currentMessage = message;
      narrationEngine.narrate(message, true);
      return message;
    } catch (error) {
      console.error("DJ-verse Commentary Error:", error);
      return "DJ-VERSE: SECURING THE GLOBAL RESONANCE.";
    }
  }

  public async suggestMix(biometricData: any) {
    // Advanced logic to select songs based on biometrics
    // This is where we'd interface with YouTube or Marketplace APIs
    const intensity = biometricData.heartRate > 100 ? 'High' : 'Chill';
    this.state.mood = intensity === 'High' ? 'Raving' : 'Melodic';
    
    return {
      bpm: intensity === 'High' ? 128 : 105,
      genre: intensity === 'High' ? 'Melodic Techno' : 'Deep House',
      tracks: ['Quantum Flow', 'Neon pulse', 'Singularity Echo']
    };
  }

  public getState() {
    return this.state;
  }
}

export const djVerseService = new DJVerseService();
