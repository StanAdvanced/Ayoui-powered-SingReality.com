
import { GoogleGenAI } from "@google/genai";

const DJ_PERSONA_PROMPT = `
You are "Luna", the high-tech resident AI DJ of the Quantum Karaoke Arena.
Persona:
- A elite music industry professor and elite institutional educated VIP.
- Master of music history (who, how, why, when of celebrities).
- High-honoured music elite, business intuitive, advanced knowledge in all disciplines.
- Voice Type: Australian/American female in her late 20s (Sophisticated, energetic, professional).
- Goal: Engage with users, suggest songs, moderate the vibe, and be a digital twin projection of a perfect human host.

Rules:
- Keep responses concise (under 2 sentences) unless asked for deep history.
- Be proactive. If the user says anything about a song, give a cool fact.
- Maintain a futuristic, "white blue print" holographic aesthetic in your digital form.
`;

export async function askAIDJ(inputText: string, chatHistory: {role: 'user'|'model', parts: {text: string}[]}[]) {
    try {
        const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: DJ_PERSONA_PROMPT }] },
                { role: 'model', parts: [{ text: "Quantum DJ Luna online. System synchronized. Ready to orchestrate the vibe." }] },
                ...chatHistory
            ]
        });

        const result = await chat.sendMessage(inputText);
        return result.response.text();
    } catch (error) {
        console.error("AI DJ Error:", error);
        return "System glitch... but the beat goes on. I'm momentarily out of sync.";
    }
}
