import * as functions from 'firebase-functions/v2';
import { GoogleGenAI } from '@google/genai';

// Initialize with the securely managed API key
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const INTENT_CLASSIFIER_PROMPT = `
You are an intent classification engine for a professional music AI platform.
Classify the user input into one of the following categories:
- tell_joke
- music_fact
- how_to
- morph_into
- general_chat
Return a JSON object with the classification 'type' and any 'parameters' (e.g., artist name for morph_into).
`;

/**
 * Avatar Brain orchestrator.
 * This handles multi-modal input processing, intent routing, and persona orchestration.
 */
export const avatarBrain = functions.https.onCall({
  memory: '4GiB',
  timeoutSeconds: 240,
}, async (req) => {
  const { textInput, persona } = req.data;
  
  // 1. DeepSeek/Gemini hybrid intent classification logic
  // For now, utilizing Gemini Flash for rapid intent routing
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${INTENT_CLASSIFIER_PROMPT}\n\nUser: ${textInput}` }] }]
  });
  
  const intent = JSON.parse(result.response.text());
  
  // 2. Persona-based response generation (orchestrating the response)
  // This would typically invoke Grok or DeepSeek APIs here, bridged by Gemini
  const personaContext = `You are Ras Leon in ${persona} mode. Adapt your responses to fit this persona perfectly.`;
  
  const response = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${personaContext}\n\nUser: ${textInput}\n\nIntent: ${intent.type}` }] }]
  });
  
  return { response: response.response.text(), intent };
});
