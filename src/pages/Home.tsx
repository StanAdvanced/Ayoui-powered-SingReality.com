import React, { useState, Suspense, useEffect, Component, ReactNode } from 'react';
import { motion } from 'motion/react';
import { Play, Globe2, Cpu, Sparkles, ArrowRight, Search, Zap, Users, TrendingUp, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import { useSound } from '../hooks/useSound';
import { useStore } from '../store/useStore';
import { AvatarChat } from '../components/AvatarChat';
import { isWebGLAvailable } from '../lib/webgl';
import { CinematicBanner } from '../components/CinematicBanner';
import { YouTubeBackground } from '../components/YouTubeBackground';
import { ConcertEffects } from '../components/ConcertEffects';
import { WaitlistModal } from '../components/WaitlistModal';
import { ShowcaseBanners } from '../components/ShowcaseBanners';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { PromoBanners } from '../components/PromoBanners';
import { DJVerseLiveFeed } from '../components/DJVerseLiveFeed';

class CanvasErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('Canvas Error:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAvatarTalking, setAvatarTalking } = useStore();
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { playClick } = useSound();

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  return (
    <div className="relative min-h-screen">
      <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.1} />
      <ConcertEffects />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <div className="relative z-10">
      
      {/* Avatar Chat Interface */}
      <AvatarChat onTalkingChange={setAvatarTalking} />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24">
        
        <div className="max-w-7xl w-full relative z-10">
          <CinematicBanner />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-[0.85] mb-12">
              WHAT A TIME <br />
              <span className="text-gradient">TO BE LIVE!</span>
            </h1>

            {/* Global Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-singularity/20 to-quantum/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass rounded-2xl p-2 flex items-center gap-4 border border-white/10 focus-within:border-singularity/50 transition-all">
                <Search className="w-6 h-6 text-gray-500 ml-4" />
                <input 
                  type="text" 
                  placeholder="Search 33M+ Psyche-Resonant Conduits..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-lg font-light py-3 placeholder:text-gray-600"
                />
                <button 
                  onClick={playClick}
                  className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => { playClick(); setIsWaitlistOpen(true); }}
                className="group relative px-10 py-5 bg-white text-black rounded-2xl font-bold text-sm tracking-widest uppercase overflow-hidden transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <Play className="w-4 h-4 fill-black" />
                Activate Conduit
              </button>
              <Link 
                to="/marketplace" 
                onClick={playClick}
                className="px-10 py-5 bg-gradient-to-r from-singularity/20 to-quantum/20 border border-singularity/50 rounded-2xl font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-3 backdrop-blur-xl"
              >
                <Zap className="w-4 h-4 text-singularity" />
                Upgrade Arena
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* High-Fidelity Showcase Marketing Banners */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
            DJ-VERSE <span className="text-gradient">STREAMING LIVE</span>
          </h2>
          <p className="text-gray-400 font-mono text-xs tracking-[0.4em] uppercase">Universal Neural High-Fidelity Distribution</p>
        </div>
        <DJVerseLiveFeed />
      </section>

      <ShowcaseBanners />

      <PromoBanners />

      {/* Project Showcase Gallery */}
      <ProjectShowcase />

      {/* Global Stats Section */}
      <section className="py-24 border-y border-white/5 glass">
        <div className="max-w-7xl mx-auto flex overflow-x-auto pb-8 -mx-6 px-6 md:grid md:grid-cols-4 gap-12 text-center snap-x snap-mandatory hide-scrollbar">
          {[
            { label: "Early Access Beta", value: "Phase 1", icon: Users, color: "text-singularity" },
            { label: "Resonance Engine", value: "Active", icon: Zap, color: "text-quantum" },
            { label: "Global Community", value: "Live", icon: Globe2, color: "text-reality" },
            { label: "Ethical AI", value: "100%", icon: TrendingUp, color: "text-white" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[200px] md:min-w-0 snap-center"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-4 ${stat.color} opacity-50`} />
              <div className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-2">{stat.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Engine Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6">
            THE <span className="text-gradient">CORE ENGINE</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            SingReality converges millions in real-time virtual harmony, translated to local currencies and languages across 195 countries.
          </p>
        </div>
        <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:grid md:grid-cols-3 gap-8 snap-x snap-mandatory hide-scrollbar">
          {[
            {
              icon: Globe2,
              title: "Quantum Sync",
              desc: "Proprietary WebRTC + Quantum routing ensures zero-latency duets across continents. Real-time translation for 100+ languages.",
              color: "text-singularity",
              img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop"
            },
            {
              icon: Cpu,
              title: "Neural Generation",
              desc: "20+ production-ready AI models for instant melody, lyric, and stem generation. Powered by Gemini 3 Flash and Magenta.js.",
              color: "text-quantum",
              img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1920&auto=format&fit=crop"
            },
            {
              icon: Sparkles,
              title: "Holographic 8K",
              desc: "PS6-inspired fluid rendering for hyper-realistic virtual arenas and avatars. Immersive spatial audio with frequency-tuned depth.",
              color: "text-reality",
              img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-0 rounded-[3rem] overflow-hidden group hover:bg-white/[0.05] transition-colors border border-white/5 min-w-[640px] md:min-w-0 snap-center"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={feature.img} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                <feature.icon className={`absolute bottom-8 left-10 w-12 h-12 ${feature.color}`} />
              </div>
              <div className="p-10 pt-4">
                <h3 className="text-3xl font-display font-bold mb-6">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-base">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-quantum font-bold uppercase tracking-widest text-xs mb-6">
              <ShieldCheck className="w-4 h-4" /> Quantum-Secure Infrastructure
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-8 leading-[0.9]">
              ETHICAL <span className="text-gradient">PROVENANCE</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Our platform is built on zero-trust models with dark web threat fusion. 
              We ensure 100% transparent royalty splits and ethically sourced training data.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-2xl font-bold mb-2">100%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Royalty Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">0.0ms</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Latency Jitter</div>
              </div>
            </div>
            <Link 
              to="/portal" 
              onClick={playClick}
              className="inline-flex items-center gap-2 text-singularity font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm"
            >
              View Security Protocol <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-video rounded-[3rem] overflow-hidden glass-card border-none relative group">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop" 
                alt="Security" 
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
