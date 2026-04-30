import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ShoppingCart, Cpu, Waves, Sliders, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { YouTubeBackground } from '../components/YouTubeBackground';

const CLONES = [
  {
    id: 'clone-1',
    name: 'Juno-106 Neural',
    type: 'Analog Poly Synth',
    price: 149,
    description: 'A perfect neural capture of the legendary 1984 analog polysynth. Warm, lush pads and iconic chorus.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200',
    tags: ['Analog', 'Vintage', 'Pads']
  },
  {
    id: 'clone-2',
    name: 'Prophet-V AI',
    type: 'Polysynthesizer',
    price: 199,
    description: 'The unmistakable sound of the late 70s. Fat brass, sync leads, and complex modulations captured via NeRF.',
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1516280440502-62b1685b678c?auto=format&fit=crop&q=80&w=200',
    tags: ['Classic', 'Fat', 'Brass']
  },
  {
    id: 'clone-3',
    name: 'Moog Sub-37 Clone',
    type: 'Paraphonic Analog',
    price: 179,
    description: 'Gritty, aggressive bass and screaming leads. The multi-drive circuit modeled with 99.9% accuracy.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    tags: ['Bass', 'Aggressive', 'Lead']
  },
  {
    id: 'clone-4',
    name: 'DX7 FM Matrix',
    type: 'FM Synthesizer',
    price: 129,
    description: 'Crystal clear bells, electric pianos, and punchy basses from the 80s FM powerhouse.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&q=80&w=200',
    tags: ['FM', 'Digital', '80s']
  },
  {
    id: 'clone-5',
    name: 'CS-80 Vangelis',
    type: 'Polyphonic Analog',
    price: 249,
    description: 'The holy grail of synthesizers. Expressive, massive, and cinematic. Polyphonic aftertouch fully supported.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=200',
    tags: ['Cinematic', 'Expressive', 'Rare']
  },
  {
    id: 'clone-6',
    name: 'TR-808 Neural Drum',
    type: 'Drum Machine',
    price: 99,
    description: 'The boom that changed music. Every circuit nuance, accent, and decay modeled perfectly.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5222b?auto=format&fit=crop&q=80&w=200',
    tags: ['Drums', 'Hip-Hop', 'Electronic']
  },
  {
    id: 'clone-7',
    name: 'MS-20 Filter Bank',
    type: 'Semi-Modular',
    price: 119,
    description: 'Screaming filters and raw oscillators. Patch panel fully functional in the digital realm.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=200',
    tags: ['Modular', 'Raw', 'Filters']
  },
  {
    id: 'clone-8',
    name: 'Fairlight CMI',
    type: 'Sampler/Synth',
    price: 189,
    description: 'The dawn of digital sampling. Lo-fi grit and iconic factory library included.',
    image: 'https://images.unsplash.com/photo-1516280440502-62b1685b678c?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=200',
    tags: ['Sampler', 'Lo-Fi', 'Retro']
  },
  {
    id: 'clone-9',
    name: 'ARP 2600 AI',
    type: 'Semi-Modular',
    price: 169,
    description: 'The sound of R2-D2 and countless classic records. Deep sound design capabilities.',
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200',
    tags: ['Sound Design', 'Modular', 'Classic']
  },
  {
    id: 'clone-10',
    name: 'Wavestation Neural',
    type: 'Vector Synth',
    price: 139,
    description: 'Evolving soundscapes and rhythmic sequences. Wave sequencing reimagined with AI.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    avatar: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&q=80&w=200',
    tags: ['Digital', 'Pads', 'Sequences']
  }
];

export function NeuralClones() {
  const { addToCart, currency } = useStore();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="min-h-screen relative">
      <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.15} />
      <div className="min-h-screen pt-24 pb-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-singularity/10 border border-singularity/20 text-singularity text-sm font-bold tracking-widest mb-6"
          >
            <Cpu className="w-4 h-4" />
            NEURAL VST CLONES
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6"
          >
            Experience the Soul of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-quantum">
              Vintage Hardware
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-mono"
          >
            Our Neural VSTs are AI clones of legendary synthesizers, captured through high-fidelity neural radiance fields. Perfect emulation, zero latency.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Waves, title: "Component-Level Accuracy", desc: "Every capacitor and resistor modeled via deep learning." },
            { icon: Sliders, title: "Infinite Polyphony", desc: "Break the hardware limits. Play massive chords without voice stealing." },
            { icon: Zap, title: "Zero Latency", desc: "Optimized for real-time performance in any major DAW." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/5"
            >
              <div className="w-12 h-12 rounded-full bg-singularity/20 flex items-center justify-center mb-4 text-singularity">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Clones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLONES.map((clone, index) => (
            <motion.div
              key={clone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-singularity/50 transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={clone.image} 
                  alt={clone.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Avatar Profile Image */}
                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <img src={clone.avatar} alt="Creator" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-mono text-gray-300">Neural Profile</span>
                </div>

                <button 
                  onClick={() => handlePlay(clone.id)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-singularity/20 backdrop-blur-md flex items-center justify-center border border-singularity/50 text-singularity opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-singularity/40"
                >
                  <Play className={`w-6 h-6 ${playingId === clone.id ? 'animate-pulse' : ''}`} fill="currentColor" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{clone.name}</h3>
                    <p className="text-sm text-singularity font-mono">{clone.type}</p>
                  </div>
                  <div className="text-xl font-bold font-mono">
                    {currency} {clone.price}
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
                  {clone.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {clone.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => addToCart({ id: clone.id, title: clone.name, price: clone.price, image: clone.image })}
                  className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-singularity transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
      </div>
    </div>
  );
}
