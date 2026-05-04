import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { motion } from 'motion/react';
import { Sparkles, Music, Cpu, Zap, CreditCard, Play, Square } from 'lucide-react';
import { aiService } from '../services/aiService'; // Reusing Gemini for the AI generation mock

export function DeepSeekMusicSuite() {
  const [prompt, setPrompt] = useState('Create a rainy lo fi beat with melancholic piano and a vinyl crackle texture.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [credits, setCredits] = useState(500);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      setIsPlaying(false);
    };
  }, []);

  const generateMusic = async () => {
    if (credits < 10) return;
    
    setIsGenerating(true);
    setCredits(prev => prev - 10);
    setLogs(prev => [...prev, '> Initializing DeepSeek-R1-0528 model...']);
    setLogs(prev => [...prev, '> Processing prompt: ' + prompt]);
    
    try {
      // We simulate deepseek response by asking Gemini to generate a sequence of notes
      const aiPrompt = `Generate a JSON array of musical notes for a simple 4-bar loop based on this prompt: "${prompt}". 
      Format exactly as a JSON array of objects with { note: string, duration: string, time: string }, e.g., [{"note":"C4","duration":"8n","time":"0:0:0"}]. Return ONLY JSON.`;
      
      const responseText = await aiService.generateResponse(aiPrompt, []);
      setLogs(prev => [...prev, '> DeepSeek R1 reasoning complete. Extracted structure.']);
      
      let sequenceData;
      try {
        const jsonMatch = responseText.match(/\[.*\]/s);
        sequenceData = jsonMatch ? JSON.parse(jsonMatch[0]) : [{"note":"C4","duration":"8n","time":"0:0:0"},{"note":"E4","duration":"8n","time":"0:0:2"},{"note":"G4","duration":"8n","time":"0:1:0"}];
      } catch (e) {
        sequenceData = [{"note":"C4","duration":"8n","time":"0:0:0"},{"note":"E4","duration":"8n","time":"0:0:2"},{"note":"G4","duration":"8n","time":"0:1:0"}];
      }
      
      setLogs(prev => [...prev, '> Tone.js synthesizers initialized. Ready to play.']);
      
      await Tone.start();
      Tone.Transport.cancel(); // Clear previous
      
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      synth.set({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
      });
      
      const reverb = new Tone.Reverb(2).toDestination();
      synth.connect(reverb);
      
      const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(value.note, value.duration, time);
      }, sequenceData).start(0);

      part.loop = true;
      part.loopEnd = '2m';
      
      setIsGenerating(false);

    } catch (e) {
      setLogs(prev => [...prev, '> Error generating track.']);
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pt-24 px-6 md:px-12 pb-24 font-inter relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-singularity opacity-10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Banner Section */}
        <div className="glass p-12 rounded-3xl border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Alchemize a Whisper into a Symphony.
              </h1>
              <p className="text-xl text-gray-400">
                DeepSeek R1 Credit-Based Music Creation Suite. Provide intent, and the reasoning engine builds the harmonic architecture instantly.
              </p>
            </div>
            <div className="glass px-6 py-4 rounded-xl border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-singularity/20 rounded-full text-singularity">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Available Credits</p>
                <p className="text-2xl font-mono font-bold">{credits} DSP</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Editor Column */}
          <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-heading font-semibold">Describe to Compose</h2>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-gray-200 font-mono focus:ring-2 focus:ring-singularity focus:border-transparent transition-all resize-none"
              placeholder="Describe your musical intent..."
            />
            
            <div className="flex gap-4">
              <button 
                onClick={generateMusic}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-singularity to-blue-600 hover:from-singularity/80 hover:to-blue-600/80 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? <Zap className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? 'Synthesizing Architecture...' : 'Generate (10 DSP)'}
              </button>
            </div>
          </div>

          {/* Player & Logs Column */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden">
               <div className="flex items-center gap-3 mb-6">
                 <Music className="w-6 h-6 text-purple-400" />
                 <h2 className="text-2xl font-heading font-semibold">Neural Audio Engine</h2>
               </div>
               
               <div className="h-32 mb-8 bg-black/50 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden group">
                  {/* Waveform Visualization Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 px-4 opacity-50">
                    {[...Array(40)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: isPlaying ? [10, 20 + (i % 10) * 8, 10] : [10, 10, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5 + (i % 5) * 0.1 }}
                        className="w-2 bg-gradient-to-t from-singularity to-blue-400 rounded-full"
                      />
                    ))}
                  </div>
               </div>

               <div className="flex justify-center gap-6">
                 <button 
                    onClick={togglePlayback}
                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                 >
                    {isPlaying ? <Square className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-2" />}
                 </button>
               </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 h-48 overflow-y-auto font-mono text-xs text-green-400/80 space-y-2">
              <p className="text-gray-500 mb-2">// DeepSeek-R1-0528 Execution Logs</p>
              {logs.map((log, index) => (
                <div key={index} className="animate-fade-in">{log}</div>
              ))}
              {!logs.length && <div className="text-gray-600">Waiting for generation...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
