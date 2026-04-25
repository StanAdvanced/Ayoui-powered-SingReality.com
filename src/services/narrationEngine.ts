import { generateSpeech, playRawAudio, stopAudio, VoiceName } from '../lib/tts';

interface SpeechRequest {
  text: string;
  voiceName: VoiceName;
}

class NarrationEngine {
  private isNarrating: boolean = false;
  private queue: SpeechRequest[] = [];
  public currentVoice: VoiceName = 'Puck'; // default exciting voice

  async narrate(text: string, priority: boolean = false, voiceName: VoiceName = this.currentVoice) {
    if (priority) {
      stopAudio();
      this.queue = [];
    }

    this.queue.push({ text, voiceName });
    if (this.isNarrating) return;

    return this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isNarrating = false;
      return;
    }

    this.isNarrating = true;
    const request = this.queue.shift()!;
    
    try {
      const audioData = await generateSpeech(request.text, request.voiceName);
      if (audioData) {
        await playRawAudio(audioData);
      }
    } catch (error) {
      console.error('Narration Error:', error);
    }

    return this.processQueue();
  }

  stop() {
    stopAudio();
    this.queue = [];
    this.isNarrating = false;
  }
}

export const narrationEngine = new NarrationEngine();
