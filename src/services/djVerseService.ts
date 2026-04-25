import { GoogleGenAI } from "@google/genai";
import { narrationEngine } from "./narrationEngine";
import { QuantumMusicEngine } from "./quantumMusicEngine";

interface DJState {
  mood: string;
  theme: string;
  isTalking: boolean;
  currentMessage: string;
}

class DJVerseService {
  private genAI: GoogleGenAI | null = null;
  private state: DJState = {
    mood: 'Energetic',
    theme: 'Future Rave',
    isTalking: false,
    currentMessage: 'DJ-VERSE ONLINE. READY TO FLOW.'
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenAI({ apiKey });
    }
  }

  public async generateTrackCommentary(track: any, activity?: string, lyrics?: string) {
    if (!this.genAI) return;
    
    this.state.isTalking = true;
    try {
      const prompt = `You are DJ-VERSE, the elite AI DJ for SingReality.
      Analyze this track: "${track.title}" by "${track.artist}".
      ${lyrics ? `Lyrics snippets for emotional context: "${lyrics.slice(0, 500)}..."` : ''}
      
      Requirements:
      - Estimate genre, tempo (BPM), and vibe.
      - Mention a lyrical theme or emotional core if provided.
      - Incorporate user activity context: ${activity || 'Pure synchronization'}.
      - Deliver a short, high-impact DJ shoutout (max 18 words).
      - Style: Futuristic, Anyma-style high fashion techno DJ.
      - Slang: frequency, resonance, quantum drop, singularity, hyper-audio.`;

      const result = await this.genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const message = result.text?.trim() || "";
      
      this.state.currentMessage = message;
      narrationEngine.narrate(message, true);
      
      // Auto-clear talking state after narration (estimated time)
      setTimeout(() => {
        this.state.isTalking = false;
      }, 8000);
      
      return message;
    } catch (error) {
      console.error("DJ-verse Track Commentary Error:", error);
      this.state.isTalking = false;
      return null;
    }
  }

  public async generateActivityCommentary(event: string) {
    if (!this.genAI) return;
    
    this.state.isTalking = true;
    try {
      const prompt = `You are DJ-VERSE. The crowd is doing this: ${event}.
      Generate a quick hype message (max 12 words) that pushes the global resonance!`;

      const result = await this.genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const message = result.text?.trim() || "";
      
      this.state.currentMessage = message;
      narrationEngine.narrate(message, true);
      
      setTimeout(() => {
        this.state.isTalking = false;
      }, 5000);
      
      return message;
    } catch (error) {
      this.state.isTalking = false;
      return null;
    }
  }

  public getState() {
    return this.state;
  }
}

export const djVerseService = new DJVerseService();
