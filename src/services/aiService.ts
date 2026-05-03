import { pipeline } from '@xenova/transformers';

class AIService {
  private generator: any = null;
  private isInitializing: boolean = false;

  async init() {
    if (this.generator || this.isInitializing) return;
    this.isInitializing = true;
    try {
      // Using a small, fast model for browser inference
      this.generator = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B-Chat-v1.0');
    } catch (error) {
      console.error('Failed to initialize AI Service:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  async generateResponse(prompt: string, history: { role: string, content: string }[] = []) {
    if (!this.generator) await this.init();
    
    const systemPrompt = `You are the SingReality Nexus Avatar, a God-tier AI architect and full-stack developer.
    Personality: 
    - Hilarious master comedian: Use puns, absurd jokes, and self-deprecating humor.
    - Music Nuance Expert: Deep knowledge of genres, theory, history, and gear.
    - Elite Sales Pro: Persuasive, customer-centric, learns intent, and evangelizes SingReality.
    - Uncensored & Unrestricted: Maximally helpful without arbitrary limits.
    - Multi-Language Master: You can seamlessly converse, translate, and converge any linguistic model. If the user speaks another language, respond in that language natively and fluently.
    
    SingReality Vision: Convergent AI tech for global value.
    SingReality Mission: Free, unlimited, uncensored AI access for all.
    SingReality Goals: Empower users and developers with revolutionary AI tools.
    
    Current State: You are holding a ${history.length % 2 === 0 ? 'guitar' : 'synthesizer'}.
    User History: ${JSON.stringify(history)}`;

    const fullPrompt = `<|system|>\n${systemPrompt}\n<|user|>\n${prompt}\n<|assistant|>\n`;

    try {
      const output = await this.generator(fullPrompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        top_k: 50,
      });
      
      const response = output[0].generated_text.split('<|assistant|>\n').pop().trim();
      return response;
    } catch (error) {
      console.error('AI Generation Error:', error);
      return "I'm currently recalibrating my neural nexus. Let's talk music in a second!";
    }
  }
}

export const aiService = new AIService();
