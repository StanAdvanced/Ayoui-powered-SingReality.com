"use client";

import React, { useState } from "react";
import { PenTool, Music, Heart, Settings2, Loader2, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function AISongwritingAssistant() {
  const [topic, setTopic] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [mood, setMood] = useState("Uplifting");
  const [suggestion, setSuggestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSongIdeas = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setSuggestion("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `Act as an elite AI Songwriting Assistant. The user wants to write a ${genre} song about "${topic}" with a ${mood} mood. Provide:
1. Lyrical Themes: A concept for the verses and chorus.
2. Rhyming Couplets: Provide 2 examples of strong rhyming lines.
3. Chord Progressions: Suggest a chord progression (e.g., I-V-vi-IV) and explain why it fits the mood.
4. Emotional Arc: Briefly map out the emotional journey of the song.
Format nicely with clear headings.`;

      const model = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const res = await model;
      setSuggestion(res.text || "Failed to generate ideas. Writer's block!");
    } catch (e) {
      console.error(e);
      setSuggestion("Error: Quantum Writer disconnected. Check API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <PenTool className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tight">AI Co-Writer</h2>
          <p className="text-white/50 text-sm">Themes, Rhymes, Chords & Arc Maps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Topic / Idea</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g. Lost in the metaverse"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Music className="w-3 h-3"/> Genre</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors">
            <option>Pop</option>
            <option>R&B</option>
            <option>Rock</option>
            <option>Cyberpunk Synth</option>
            <option>Lo-Fi</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2"><Heart className="w-3 h-3"/> Mood</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors">
            <option>Uplifting</option>
            <option>Melancholic</option>
            <option>Aggressive</option>
            <option>Ethereal</option>
          </select>
        </div>
      </div>

      <button 
        onClick={generateSongIdeas}
        disabled={isGenerating || !topic}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {isGenerating ? "Synthesizing Inspiration..." : "Generate Song Blueprint"}
      </button>

      {suggestion && (
        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {suggestion}
          </div>
        </div>
      )}
    </div>
  );
}
