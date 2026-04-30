import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, MonitorPlay, Mic2, Tv, Sparkles, Users, Radio, Globe2, Music, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SlideData {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  icon: any;
}

interface BannerProps {
  title: string;
  slides: SlideData[];
  primaryLink: string;
  accentColor: string;
  links: { label: string; path: string; icon: any }[];
}

function ShowcaseBanner({ title, slides, primaryLink, accentColor, links }: BannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Autonomous sliding
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex-1 group perspective-1000"
    >
      {/* Outer framing with 1cm equivalent blur/glass padding (p-4) */}
      <div className="relative p-4 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out hover:scale-[1.02] transform-gpu">
        
        {/* Showcase Lighting Overlay on the frame itself */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${accentColor} opacity-20 mix-blend-overlay pointer-events-none rounded-[2.5rem]`} />
        
        {/* Inner High Fidelity Frame (The pristine, sharp display block) */}
        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-[1.5rem] overflow-hidden bg-black shadow-[inset_0_0_30px_rgba(0,0,0,1)] border border-black/50 cursor-pointer"
             onClick={() => navigate(primaryLink)}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover opacity-80" 
                referrerPolicy="no-referrer"
              />
              {/* Dynamic lighting gradients over the imagery */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl"
              >
                {(() => {
                  const SlideIcon = slide.icon;
                  return (
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 ${accentColor.replace('from-', 'text-').split(' ')[0]} shadow-[0_0_15px_currentColor]`}>
                        <SlideIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">{title}</span>
                    </div>
                  );
                })()}
                <h3 className="text-3xl md:text-5xl font-display font-black leading-tight mb-3 drop-shadow-2xl">
                  {slide.title}
                </h3>
                <p className="text-sm md:text-lg text-gray-300 font-light drop-shadow-xl max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          <div className="absolute top-6 right-6 flex gap-2 z-20">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>

        </div>

        {/* Action Bar / Invisible Flow Dropdown */}
        <div className="relative mt-4 flex items-center justify-between px-4 z-30">
          <button 
            onClick={() => navigate(primaryLink)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-gray-300 transition-colors"
          >
            Launch Experience <Play className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
            >
              Navigation Flow <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* The Invisible Flow Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-4 w-64 bg-[#111]/90 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
                >
                  <div className="p-2">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest p-3 pb-2">Related Modules</div>
                    {links.map((link, idx) => {
                      const LinkIcon = link.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => { navigate(link.path); setIsDropdownOpen(false); }}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-sm text-gray-200 group"
                        >
                          <LinkIcon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                          {link.label}
                          <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const TV_SLIDES: SlideData[] = [
  {
    id: "tv-1",
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1920&auto=format&fit=crop", // Screen array
    title: "Global 24/7 Live Broadcasts",
    subtitle: "Tune into high-fidelity neural streams from the world's most elite virtual stages.",
    icon: Globe2
  },
  {
    id: "tv-2",
    image: "https://images.unsplash.com/photo-1540039155732-d674d6e3f0be?q=80&w=1920&auto=format&fit=crop", // Concert lights
    title: "Holographic Neural Performances",
    subtitle: "Experience hyper-realistic 3D rendering of artists powered by quantum resonance.",
    icon: Sparkles
  },
  {
    id: "tv-3",
    image: "https://images.unsplash.com/photo-1470229722913-7c090b332da8?q=80&w=1920&auto=format&fit=crop", // Crowd
    title: "Multi-Million Viewer Concurrency",
    subtitle: "Zero-latency synchronization connects you with fans worldwide in real-time.",
    icon: Users
  }
];

const KARAOKE_SLIDES: SlideData[] = [
  {
    id: "kar-1",
    image: "https://images.unsplash.com/photo-1516280440502-a2fc994606cf?q=80&w=1920&auto=format&fit=crop", // Singer
    title: "Step Into The Spotlight",
    subtitle: "Your personal virtual stage awaits. High-end DSP audio processing makes every take perfect.",
    icon: Mic2
  },
  {
    id: "kar-2",
    image: "https://images.unsplash.com/photo-1493225457124-a1a2a5f0f353?q=80&w=1920&auto=format&fit=crop", // Stage red
    title: "Live Audience Feedback",
    subtitle: "Feel the energy. Real-time bio-rhythmic reactions and holographic audience integration.",
    icon: Radio
  },
  {
    id: "kar-3",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop", // Headphones/Mic
    title: "Duet globally, latency free.",
    subtitle: "WebRTC quantum routing ensures you stay locked in the pocket with singers worldwide.",
    icon: Music
  }
];

export function ShowcaseBanners() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 py-24 relative z-20">
      <div className="flex flex-col md:flex-row gap-8">
        <ShowcaseBanner 
          title="SingReality TV"
          slides={TV_SLIDES}
          primaryLink="/tv"
          accentColor="from-[#00fff0] via-[#00a2ff] to-[#0055ff]"
          links={[
            { label: "Trending Channels", path: "/tv", icon: Tv },
            { label: "Creator Studio", path: "/studio", icon: MonitorPlay },
            { label: "Live Arenas", path: "/arenas", icon: Globe2 }
          ]}
        />
        <ShowcaseBanner 
          title="Karaoke Arena"
          slides={KARAOKE_SLIDES}
          primaryLink="/karaoke-arena"
          accentColor="from-[#ff00a0] via-[#ff5500] to-[#ffaa00]"
          links={[
            { label: "Join Open Stage", path: "/karaoke-arena", icon: Mic2 },
            { label: "Voice Engine", path: "/quantum-lab", icon: Sparkles },
            { label: "Browse Backing Tracks", path: "/marketplace", icon: Music }
          ]}
        />
      </div>
    </section>
  );
}
