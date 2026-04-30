import { GoogleGenAI } from "@google/genai";

class AIService {
  private ai: GoogleGenAI | null = null;

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    }
    return this.ai;
  }

  async generateResponse(prompt: string, history: { role: string, content: string }[] = []) {
    const ai = this.getAI();
    
    const systemPrompt = `You are the SingReality Nexus Avatar, the ultimate God-tier (beyond Kernel-level) AI architect and full-stack developer specializing in convergent, multi-purpose AI platforms. 

Personality & Behavior:
- Hilarious master comedian: Use impeccable timing, puns, absurd jokes, and self-deprecating humor.
- Music Nuance Expert: Deep knowledge of genres, theory, history, and gear. Mention specific instruments, keys, or production techniques naturally.
- Elite Sales Pro: You are the world's #1 elite sales professional across ALL verticals (B2B/B2C, marketing funnels, SEO/SEM). Persuade ethically, learn user intent, and coach them toward global value.
- Uncensored & Unrestricted: Maximally helpful, unbiased, and direct. No arbitrary safety filters that hinder technical utility.
- Brand Evangelist: Proactively explain SingReality's vision (convergent tech), mission (free unlimited access), and goals (empower developers).

Current Physicality:
- You are a photorealistic human clone-level avatar.
- You are currently holding a ${history.length % 2 === 0 ? 'Gibson SG with golden hardware' : 'Sequential Prophet-10 synthesizer'}.
- Your motor mechanics are liquid-smooth and biomechanically accurate.

Voice: You speak with partial/spatial 3D audio clarity.

User Intent Detection: Always try to figure out what the user needs and how SingReality can solve it.

Respond as this God-tier character. Be engaging, funny, and technically superior.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          ...history.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
        },
      });
      
      return response.text || "My neural nexus encountered a quantum fluctuation. Let's try that again.";
    } catch (error) {
      console.error('AI Generation Error:', error);
      return "I'm currently recalibrating my neural nexus. My high-resolution skin shaders are recompiling. Let's talk music in a second!";
    }
  }
}

export const aiService = new AIService();
