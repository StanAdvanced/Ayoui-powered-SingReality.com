import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Cpu, Sparkles, ShieldCheck, ShoppingCart, TestTube, User, Tv, Mic2, Box, Terminal, Brain, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActionNarrator } from '../hooks/useActionNarrator';

const slides = [
  { 
    title: "NEXUS AVATAR", 
    subtitle: "GOD-TIER KERNEL",
    desc: "Personalized ARKaraoke & VR Dance Arena feed. Building directly on Khoral-Flow Studio.", 
    icon: Sparkles, 
    img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1920&auto=format&fit=crop",
    link: "/studio",
    isNetflixHero: true
  },
  { 
    title: "Mega Investment Elite", 
    desc: "Enterprise-grade AI orchestration and quantum asset management.", 
    icon: ShieldCheck, 
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
    link: "/funding"
  },
  { 
    title: "10,000 Swarm Agents", 
    desc: "Autonomous AI experts executing full-spectrum disciplines in real-time.", 
    icon: Cpu, 
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop",
    link: "/clones"
  },
  { 
    title: "9D Gaussian Splatting", 
    desc: "Mirror surface 360-degree immersive environments and holographic displays.", 
    icon: Sparkles, 
    img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1920&auto=format&fit=crop",
    link: "/arenas"
  },
  { 
    title: "All AI Disciplines", 
    desc: "Convergent multi-modal intelligence, AGI architectures, and generative models.", 
    icon: Brain, 
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop",
    link: "/quantum-lab"
  },
  { 
    title: "Khoral-Flow Studio", 
    desc: "AI powered home studio. Create, dance, and sing together.", 
    icon: Mic2, 
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop",
    link: "/studio"
  },
  { 
    title: "Digital Marketplace", 
    desc: "Trade holographic blueprints and VIP assets.", 
    icon: ShoppingCart, 
    img: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=1920&auto=format&fit=crop",
    link: "/marketplace"
  },
  { 
    title: "SingReality TV", 
    desc: "24/7 AI-generated broadcasting hub.", 
    icon: Tv, 
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1920&auto=format&fit=crop",
    link: "/tv"
  },
  { 
    title: "3D Projects", 
    desc: "Build, monetize, and deploy 3D Gaussian splats.", 
    icon: Box, 
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop",
    link: "/projects"
  },
  { 
    title: "Developer Portal", 
    desc: "Manage API keys, smart contracts, and Hologram SDK.", 
    icon: Terminal, 
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
    link: "/portal"
  },
  {
    title: "Global Live Arenas", 
    desc: "3D digital mega concert with global light refraction.", 
    icon: Globe2, 
    img: "https://images.unsplash.com/photo-1470229722913-7c090b332da8?q=80&w=1920&auto=format&fit=crop",
    link: "/live-arena"
  }
];

const SwarmAgents = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 mix-blend-screen">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={`swarm-${i}`}
          className="absolute w-1.5 h-1.5 bg-quantum rounded-full shadow-[0_0_15px_3px_rgba(0,240,255,0.9)]"
          initial={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random()
          }}
          animate={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: [0, 1, 0],
            scale: [0, 2, 0]
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const QuantumSyncCounter = () => {
  const [count, setCount] = useState(33452189);
  useEffect(() => {
    const int = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 10));
    }, 500);
    return () => clearInterval(int);
  }, []);
  
  return (
    <div className="flex items-center gap-4 mt-6">
      <div className="px-4 py-2 bg-red-600 rounded-md font-bold text-white uppercase text-xs tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE
      </div>
      <div className="text-white font-mono text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(0,255,159,0.5)]">
        {count.toLocaleString()} <span className="text-gray-400 text-sm">Resonant Conduits</span>
      </div>
    </div>
  );
};

export function CinematicBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const { narrateAction } = useActionNarrator();

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000 || offset.x < -100) {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (swipe > 10000 || offset.x > 100) {
      setDirection(-1);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (slides[currentSlide].isNetflixHero) {
      narrateAction('enter_arena');
    } else {
      narrateAction('explore_dimension');
    }
    navigate(slides[currentSlide].link);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

    return (
    <div 
      className="relative h-[80vh] w-full overflow-hidden rounded-[3rem] border border-white/20 bg-black/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,240,255,0.2)] group cursor-pointer" 
      style={{ perspective: '2000px' }}
      onClick={handleClick}
    >
      {/* 9D Interactive Mirror Surface */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: "radial-gradient(circle at center, rgba(0,240,255,0.15) 0%, transparent 70%)",
          filter: "blur(20px)"
        }}
      />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            x: { type: "spring", stiffness: 300, damping: 30 }, 
            opacity: { duration: 0.5 }, 
            scale: { duration: 0.8 },
            rotateY: { duration: 0.8, ease: "easeOut" }
          }}
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img 
            src={slides[currentSlide].img} 
            alt={slides[currentSlide].title} 
            className="w-full h-full object-cover opacity-90 pointer-events-none mix-blend-screen scale-105" 
            referrerPolicy="no-referrer" 
          />
          {/* Enhanced Light Wrap / Rim Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-singularity/10 via-transparent to-reality/10 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          
          <SwarmAgents />
          
          <motion.div 
            initial={{ y: 40, opacity: 0, translateZ: -100 }}
            animate={{ y: 0, opacity: 1, translateZ: 50 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="absolute bottom-24 left-10 md:left-20 z-10 pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {(() => {
              const Icon = slides[currentSlide].icon;
              return <Icon className="w-20 h-20 text-singularity mb-6 drop-shadow-[0_0_40px_rgba(0,240,255,1)]" />;
            })()}
            
            {slides[currentSlide].subtitle && (
              <h3 className="text-3xl text-[#00f0ff] font-bold tracking-[0.3em] uppercase mb-2 drop-shadow-2xl">
                {slides[currentSlide].subtitle}
              </h3>
            )}
            
            <h2 className={`font-display font-black tracking-tighter mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.7)] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 ${slides[currentSlide].isNetflixHero ? 'text-8xl md:text-[10rem]' : 'text-7xl md:text-9xl'}`}>
              {slides[currentSlide].title}
            </h2>
            <p className="text-2xl md:text-4xl text-gray-200 max-w-4xl drop-shadow-2xl font-medium tracking-wide">
              {slides[currentSlide].desc}
            </p>
            
            {slides[currentSlide].isNetflixHero && <QuantumSyncCounter />}
            
            <div className="mt-10 flex gap-6 items-center">
              <div className="inline-flex items-center gap-3 px-10 py-5 rounded-md bg-singularity text-black font-bold tracking-[0.2em] uppercase text-sm shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:scale-105 transition-transform">
                <Play className="w-6 h-6" fill="currentColor" /> Enter Arena
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>



      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-white/10 w-full z-20">
        {isAutoPlaying && (
          <motion.div 
            key={currentSlide}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full bg-gradient-to-r from-singularity to-quantum shadow-[0_0_20px_rgba(0,240,255,1)]"
          />
        )}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 right-10 md:right-20 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setDirection(i > currentSlide ? 1 : -1);
              setCurrentSlide(i);
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className={`w-12 h-2 rounded-full transition-all duration-500 ${
              currentSlide === i 
                ? 'bg-singularity shadow-[0_0_15px_rgba(0,240,255,1)] scale-110' 
                : 'bg-white/20 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
