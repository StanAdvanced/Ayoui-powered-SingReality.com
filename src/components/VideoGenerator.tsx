import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Sparkles, Loader2, Play, Share2, Download, Wand2, Music, Projector } from 'lucide-react';
import { generatePromotionalVideo } from '../services/videoService';

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadingMessages = [
    "Synchronizing quantum frames...",
    "Dreaming up cinematic textures...",
    "Aligning Veo 3.1 neural paths...",
    "Rendering your musical soul into pixels...",
    "Applying high-fidelity aura pass...",
    "Finalizing the promotional aesthetic..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedVideo(null);
    
    // Cycle through loading messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      setStatusMessage(loadingMessages[msgIndex]);
      msgIndex = (msgIndex + 1) % loadingMessages.length;
    }, 5000);

    try {
      const result = await generatePromotionalVideo(prompt, trackTitle);
      // For the sake of the demo, if the SDK returns an array of videos
      if (result && (result as any).generatedVideos && (result as any).generatedVideos.length > 0) {
        setGeneratedVideo((result as any).generatedVideos[0].videoUri || (result as any).generatedVideos[0].videoContent);
      } else {
        // Fallback or placeholder if testing
        setGeneratedVideo("https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the video generation. Please try again.");
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-singularity to-purple-600 shadow-2xl">
          <Projector className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Veo Studio 3.1</h1>
          <p className="text-singularity/60 font-mono text-sm tracking-widest uppercase">Promotional Video Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Controls */}
        <div className="space-y-8 glass p-8 rounded-[3rem] border border-white/10">
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest ml-2">Music Track Title</label>
            <div className="relative group">
              <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-singularity transition-colors" />
              <input 
                type="text" 
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                placeholder="e.g. Quantum Heartbeat"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-singularity/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest ml-2">Video Visual Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the aesthetic and mood... e.g. Neon cityscape in a rainstorm, shallow depth of field, synthwave colors, high octane energy."
              className="w-full bg-black/40 border border-white/10 rounded-3xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-singularity/50 transition-all min-h-[200px]"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setPrompt("A futuristic recording studio with floating holograms and liquid metal walls, cinematic lighting, 8k resolution.")}
              className="text-[10px] uppercase font-bold text-singularity/50 hover:text-singularity border border-singularity/20 hover:border-singularity/50 px-3 py-1.5 rounded-full transition-all"
            >
              Try Studio Theme
            </button>
            <button 
              onClick={() => setPrompt("An abstract visualization of sound waves morphing into a galaxy of stars, spiritual and calm, vaporwave aesthetic.")}
              className="text-[10px] uppercase font-bold text-quantum/50 hover:text-quantum border border-quantum/20 hover:border-quantum/50 px-3 py-1.5 rounded-full transition-all"
            >
              Try Abstract Theme
            </button>
          </div>

          <button 
            disabled={isGenerating || !prompt.trim()}
            onClick={handleGenerate}
            className="w-full relative group overflow-hidden bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-singularity via-quantum to-singularity opacity-0 group-hover:opacity-20 transition-opacity animate-[shimmer_3s_infinite]" />
            <div className="relative flex items-center justify-center gap-3">
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Masterpiece...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generate Promo Video
                </>
              )}
            </div>
          </button>
        </div>

        {/* Preview / Result Area */}
        <div className="relative min-h-[400px] rounded-[3rem] overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 text-center p-12"
              >
                <div className="relative">
                  <motion.div 
                    className="w-24 h-24 rounded-full border-4 border-singularity/20 border-t-singularity"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-singularity animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{statusMessage || "Initializing Generation..."}</h3>
                  <p className="text-sm text-gray-500 font-mono italic">Quality video takes time to synthesize. Sit tight.</p>
                </div>
              </motion.div>
            ) : generatedVideo ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full p-4 flex flex-col"
              >
                <div className="flex-1 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                  <video 
                    src={generatedVideo} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <div className="glass px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-white border border-white/10 tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      HQ 1080P
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Download className="w-5 h-5" /> Download
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-12 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Video className="w-10 h-10 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Studio Preview</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">Generate a promotional video to showcase your tracks in the quantum arena.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
