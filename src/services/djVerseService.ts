import { GoogleGenAI } from "@google/genai";
import { narrationEngine } from "./narrationEngine";
import { GlobalTrack } from "../store/useStore";

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

  public async generateTrackCommentary(track: GlobalTrack, userActivity: string = "vibing") {
    if (!this.genAI) {
      const fallback = `DJ-VERSE: Playing ${track.title} - Let's get it!`;
      this.state.currentMessage = fallback;
      return fallback;
    }
    
    this.state.isTalking = true;
    try {
      const prompt = `
        You are DJ-VERSE, the world's most advanced AI DJ for SingReality.
        Persona: High-energy, futuristic, a mix of Anyma, Tiesto, and a sentient AGI.
        Current Track: "${track.title}" by ${track.artist}.
        User Activity: ${userActivity}.
        Current Mood setting: ${this.state.mood}.
        Current Theme: ${this.state.theme}.

        Analyze the song title and artist. Guess the genre, tempo (BPM), and vibe.
        Then, generate a short (max 20 words), high-impact DJ shoutout about this track.
        Use music industry slang (drop, resonance, soul, frequency, pulse, sync).
        The commentary should sound like it's happening live between tracks or over a transition.
        Mention how SingReality's quantum power makes this ${track.title} experience unique.
      `;

      const model = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const result = await model.generateContent(prompt);
      const message = result.response.text().trim() || "DJ-VERSE: RESONANCE SECURED.";
      
      this.state.currentMessage = message;
      // Use the narration engine to speak it
      await narrationEngine.narrate(message, true);
      
      return message;
    } catch (error) {
      console.error("DJ-verse Track Commentary Error:", error);
      return "DJ-VERSE: KEEP THE ENERGY ALIVE!";
    } finally {
      this.state.isTalking = false;
    }
  }

  public async generateActivityCommentary(activity: string) {
    if (!this.genAI) return;
    
    this.state.isTalking = true;
    try {
      const prompt = `
        You are DJ-VERSE. The user just performed this activity: "${activity}".
        Generate a very short (max 10 words) hyped reaction.
        Keep it futuristic and energetic.
      `;
      const model = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const result = await model.generateContent(prompt);
      const message = result.response.text().trim();
      this.state.currentMessage = message;
      narrationEngine.narrate(message, true);
    } catch (error) {
      console.error("DJ-verse Activity Commentary Error:", error);
    } finally {
      this.state.isTalking = false;
    }
  }

  public setMood(mood: string) {
    this.state.mood = mood;
  }

  public setTheme(theme: string) {
    this.state.theme = theme;
  }

  public getState() {
    return this.state;
  }
}

export const djVerseService = new DJVerseService();
