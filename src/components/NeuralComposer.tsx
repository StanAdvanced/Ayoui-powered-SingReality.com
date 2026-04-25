import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { generateSparkRecipe } from '../services/geminiService';
import { playSpark, SparkRecipe } from '../lib/audioEngine';

export default function NeuralComposer() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<SparkRecipe | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const newRecipe = await generateSparkRecipe(prompt);
    if (newRecipe) {
      setRecipe(newRecipe);
    }
    setIsGenerating(false);
  };

  const handlePlay = async () => {
    if (recipe) {
      await playSpark(recipe);
    }
  };

  return (
    <div className="glass p-6 rounded-3xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-quantum"/> Neural Composer
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Generate royalty-free musical sparks using Gemini and Tone.js.
      </p>
      
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Describe a vibe (e.g., Cyberpunk rainy night)" 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-quantum outline-none text-sm"
        />
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-quantum text-white font-bold py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isGenerating ? 'Generating Spark...' : 'Generate Spark'}
        </button>

        {recipe && (
          <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-mono text-singularity uppercase tracking-widest">Synth: {recipe.synthType}</span>
                <span className="text-xs font-mono text-reality ml-4 uppercase tracking-widest">BPM: {recipe.tempo}</span>
              </div>
              <button onClick={handlePlay} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <Play className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="h-32 overflow-y-auto font-mono text-xs text-gray-400 space-y-1">
              {recipe.notes.map((n, i) => (
                <div key={i} className="flex justify-between">
                  <span>Note: {n.note}</span>
                  <span>Time: {n.time}</span>
                  <span>Dur: {n.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
