import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Settings, Music, Disc, Mic2, Wand2 } from 'lucide-react';
import * as Tone from 'tone';

export function ProductionPipeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const togglePlayback = async () => {
    if (!isPlaying) {
      await Tone.start();
      
      // Warm up sequence
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      const now = Tone.now();
      synth.triggerAttackRelease(["C4", "E4", "G4"], "8n", now);
      synth.triggerAttackRelease(["D4", "F4", "A4"], "8n", now + 0.5);
      synth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "4n", now + 1);
      
      setIsPlaying(true);
      setInterval(() => {
         setActiveStep(prev => (prev + 1) % 4);
      }, 500);

      setTimeout(() => {
          setIsPlaying(false);
          setActiveStep(0);
      }, 2500);

    } else {
      setIsPlaying(false);
      setActiveStep(0);
    }
  };

  const pipelineNodes = [
    { name: "Brainstorm", desc: "Let AI write your lyrics & chords", icon: <Wand2 /> },
    { name: "Record", desc: "Sing your heart out", icon: <Mic2 /> },
    { name: "Produce", desc: "Tone.js generative beats", icon: <Settings /> },
    { name: "Master", desc: "Ready for Spotify & TikTok", icon: <Disc /> },
  ];

  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full p-6 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden"
    >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-singularity/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl relative z-10 mb-16">
            <div className="w-20 h-20 bg-gradient-to-tr from-singularity to-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.3)] transform rotate-3">
               <Music className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase mb-4">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-blue-500">Hit Factory</span></h2>
            <p className="text-gray-400 font-light text-base leading-relaxed">
                Step up to the mic. You don't need a million dollars to sound like a star. Using our convergent Gen-AI pipeline, we'll compose, produce, and master your next viral hit in minutes.
            </p>
        </div>

        <div className="flex gap-4 md:gap-8 justify-center mb-16 relative z-10 w-full max-w-4xl px-4">
            {pipelineNodes.map((node, i) => (
                <div key={i} className={`flex-1 flex flex-col items-center text-center gap-4 transition-all duration-300 ${activeStep === i && isPlaying ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${activeStep === i && isPlaying ? 'bg-singularity/20 border-singularity text-singularity shadow-[0_0_20px_rgba(0,212,255,0.5)]' : 'glass border-white/10 text-gray-400'}`}>
                        {node.icon}
                    </div>
                    <div>
                        <span className="font-bold text-xs uppercase tracking-widest block text-white mb-1">{node.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono hidden md:block">{node.desc}</span>
                    </div>
                </div>
            ))}
        </div>

        <button 
            onClick={togglePlayback}
            className={`relative z-10 flex items-center justify-center gap-3 px-12 py-6 rounded-2xl font-bold uppercase tracking-widest transition-all ${isPlaying ? 'bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-white text-black hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}
        >
            {isPlaying ? (
                <><Square className="fill-current w-5 h-5" /> Stop Session</>
            ) : (
                <><Play className="fill-current w-5 h-5" /> Start Recording Session</>
            )}
        </button>
    </motion.div>
  );
}
