import { GoogleGenAI, Modality } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiClient;
}

export type VoiceName = 'Puck' | 'Aoede' | 'Charon' | 'Kore' | 'Fenrir' | 'alloy' | 'nova' | 'shimmer' | 'echo' | 'fable' | 'onyx';

const OAI_TO_GEMINI_MAP: Record<string, string> = {
  'alloy': 'Puck',
  'nova': 'Aoede',
  'shimmer': 'Kore',
  'echo': 'Charon',
  'fable': 'Puck', // Duplicate mapping as a fallback
  'onyx': 'Fenrir'
};

export async function generateSpeech(text: string, voiceName: VoiceName = 'Puck'): Promise<string | undefined> {
  try {
    // Map OpenAI names to Gemini names if needed
    const mappedVoice = OAI_TO_GEMINI_MAP[voiceName] || voiceName;
    
    // Audit: Using the highest fidelity TTS model available in the Gemini ecosystem
    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: mappedVoice,
              // Kernel Nuance: Ensure the highest possible fidelity and natural prosody
            },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Gemini TTS quota exceeded. Falling back to browser TTS.");
    } else {
      console.error("TTS Generation Error:", error);
    }
    // Fallback to browser TTS if Gemini API fails
    await fallbackTTS(text);
    return undefined;
  }
}

// Fallback using Web Speech API - Upgraded for "Elite" feel
function fallbackTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Clear queue
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      // Audit: Select the most "human-cloned" sounding local voices
      const preferredVoice = voices.find(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        v.name.includes('Premium') ||
        v.lang === 'en-US'
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower for "God-tier" gravitas
      utterance.pitch = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech API not supported.");
      resolve();
    }
  });
}

let sharedAudioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export function stopAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
    currentSource = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playRawAudio(base64Audio: string) {
  stopAudio();
  if (!base64Audio) return;
  
  // Clean potential data URI prefix
  const cleanBase64 = base64Audio.replace(/^data:audio\/[a-zA-Z0-9+-]+;base64,/, '');

  let binary;
  try {
    binary = atob(cleanBase64);
  } catch(e) {
    console.error("Invalid base64 string", e);
    return;
  }

  const bytes = new Uint8Array(binary.length);
  if (bytes.length === 0) {
    console.warn("Audio buffer is empty");
    return;
  }
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  
  // Ensure context is running (required by some browsers after user interaction)
  if (sharedAudioContext.state === 'suspended') {
    await sharedAudioContext.resume();
  }

  let audioBuffer: AudioBuffer;
  try {
    // Attempt built-in browser decoding (supports MP3, WebM, WAV, etc.)
    audioBuffer = await sharedAudioContext.decodeAudioData(bytes.buffer);
  } catch (err) {
    console.warn("Browser decodeAudioData failed, falling back to raw PCM 16-bit 24kHz Mono parsing", err);
    
    // Safety check for empty buffer
    if (bytes.length < 2) {
        console.warn("Buffer too small for PCM parsing");
        return;
    }

    audioBuffer = sharedAudioContext.createBuffer(1, Math.floor(bytes.length / 2), 24000);
    const channelData = audioBuffer.getChannelData(0);
    
    // Create a new buffer specifically because decodeAudioData might have detached the previous ArrayBuffer
    const fallbackBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      fallbackBytes[i] = binary.charCodeAt(i);
    }
    const view = new DataView(fallbackBytes.buffer);
    for (let i = 0; i < Math.floor(fallbackBytes.length / 2); i++) {
      channelData[i] = view.getInt16(i * 2, true) / 32768;
    }
  }
  
  return new Promise<void>((resolve) => {
    const source = sharedAudioContext!.createBufferSource();
    currentSource = source;
    source.buffer = audioBuffer;
    source.connect(sharedAudioContext!.destination);
    source.onended = () => {
      if (currentSource === source) currentSource = null;
      resolve();
    };
    // Schedule start at Tone.now() or just now with a tiny offset buffer
    const startTime = sharedAudioContext!.currentTime + 0.05; // 50ms buffer
    source.start(startTime);
  });
}
