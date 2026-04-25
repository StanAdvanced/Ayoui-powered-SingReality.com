import React from 'react';
import { motion } from 'motion/react';
import { Database, Music, Drum, Mic2, Code } from 'lucide-react';

const assets = [
  {
    title: "Tone.js Synthesis Engine",
    type: "Audio Engine",
    icon: Music,
    description: "A Web Audio framework for creating interactive music in the browser. Powers our zero-latency Neural Composer with FM, AM, and Polyphonic synthesis.",
    capabilities: ["Real-time synthesis", "Effects chain (Reverb, Delay, Distortion)", "Precise timing"]
  },
  {
    title: "Gemini 3 Flash Preview",
    type: "Generative AI",
    icon: Code,
    description: "Google's state-of-the-art multimodal AI. Used to generate structured musical 'Sparks' (JSON recipes) that are fed into our audio engine.",
    capabilities: ["Melody generation", "Rhythm structuring", "Vibe translation"]
  },
  {
    title: "Magenta.js (Upcoming)",
    type: "Neural Network",
    icon: Database,
    description: "Open-source machine learning models for music and art generation. Will power advanced harmonization and drum pattern generation.",
    capabilities: ["MusicRNN", "DrumKit RNN", "Groove generation"]
  },
  {
    title: "SingReality VoiceVault",
    type: "Vocal Processing",
    icon: Mic2,
    description: "Our proprietary ethical vocal identity exchange framework. Built on open-source WebRTC and AudioWorklet technologies for real-time processing.",
    capabilities: ["Zero-latency duets", "Pitch shifting", "Formant preservation"]
  }
];

export default function NeuralAssets() {
  return (
    <section id="assets" className="py-32 px-8 relative z-10 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
          OPEN-SOURCE <span className="text-gradient">ASSETS</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          A catalog of the free, open-source AI music libraries and APIs powering the SingReality ecosystem. No API keys required for end-users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assets.map((asset, i) => (
          <motion.div 
            key={asset.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-3xl group hover:border-singularity/50 transition-all"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-singularity group-hover:text-black transition-all">
                <asset.icon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono text-singularity uppercase tracking-widest mb-2 block">{asset.type}</span>
                <h3 className="text-2xl font-bold mb-3">{asset.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{asset.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Generative Capabilities:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {asset.capabilities.map(cap => (
                      <li key={cap} className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
