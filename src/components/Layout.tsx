import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Mic2, 
  User, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  Globe, 
  Coins, 
  ShoppingCart, 
  Search, 
  Cpu, 
  Tv, 
  Radio, 
  Code2, 
  ShoppingBag,
  HandCoins,
  Award,
  Maximize2,
  Layers as LayersIcon,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';
import { InteractiveBackground } from './InteractiveBackground';
import { LiveCollaboration } from './LiveCollaboration';
import { useSound } from '../hooks/useSound';
import { narrationEngine } from '../services/narrationEngine';
import { NexusPlayer } from './NexusPlayer';
import { EnterpriseNexusPortal } from './EnterpriseNexusPortal';
import { GlobalAvatar } from './GlobalAvatar';

import { CartModal } from './CartModal';
import { DJVerseOverlay } from './DJVerseOverlay';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

const CURRENCIES = [
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'QNT', name: 'Quantum' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Yen' },
  { code: 'GBP', name: 'Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'SGD', name: 'Singapore Dollar' },
];

import { Logo } from './Logo';
import { UserAvatar } from './UserAvatar';
import { GlobalSearch } from './GlobalSearch';
import { CinematicBackscreen } from './CinematicBackscreen';
import { Music2 } from 'lucide-react';
import WebAgentInterface from './WebAgentInterface';
import LiveAgentChat from './LiveAgentChat';

import { AdvancedFrontierModal } from './AdvancedFrontierModal';

export function Layout({ children, onReplayIntro }: { children: React.ReactNode, onReplayIntro?: () => void }) {
  const store = useStore();
  const { isAuthReady } = store;
  
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    logout, 
    resonance, 
    currency, 
    setCurrency, 
    cartItems, 
    setIsCartOpen, 
    setIsSearchOpen,
    bgEnabled,
    setBgEnabled
  } = store;
  const { playClick, playTransition } = useSound();

  // Audit: Identify 3D-Heavy Routes
  const isHighComputePath = ['/studio', '/studio-pro', '/live-arena', '/karaoke-arena', '/arenas', '/global-map'].includes(location.pathname);
  
  useEffect(() => {
    // Automatically throttle backgrounds on high-compute paths
    if (isHighComputePath) {
      setBgEnabled(false);
    } else {
      setBgEnabled(true);
    }
  }, [location.pathname, isHighComputePath, setBgEnabled]);
  
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  // Autonomous Narration Logic
  useEffect(() => {
    playTransition();
    
    // Sync narration engine voice
    narrationEngine.currentVoice = store.narrationVoice;
    
    // Audit: Autonomous "God-tier" narration of page context
    const pageTitle = document.title || 'SingReality';
    const currentPath = location.pathname === '/' ? 'Nexus' : location.pathname.slice(1).replace(/-/g, ' ');
    
    const narrationText = `Entering ${currentPath}. SingReality is converging your reality with the quantum singularity of music. Explore our ${currentPath} and transcend the ordinary.`;
    
    // Kernel Nuance: Automatic delivery without user interference
    narrationEngine.narrate(narrationText, true, store.narrationVoice);

    return () => narrationEngine.stop();
  }, [location.pathname, store.narrationVoice]);

  const links = [
    { name: 'Gallery', path: '/showcase', icon: Award },
    { name: 'Studio', path: '/studio', icon: LayersIcon },
    { name: 'Studio Pro', path: '/studio-pro', icon: Maximize2 },
    { name: 'Karaoke', path: '/karaoke-arena', icon: Mic2 },
    { name: 'Quantum Lab', path: '/quantum-lab', icon: Cpu },
    { name: 'SingReality TV', path: '/tv', icon: Tv },
    { name: 'Arenas', path: '/arenas', icon: Radio },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Nexus', path: '/', icon: Globe },
  ];

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-singularity animate-spin" />
          <p className="text-singularity/50 font-mono text-[10px] uppercase tracking-widest animate-pulse">
            Establishing Quantum Link...
          </p>
        </div>
      </div>
    );
  }

  const handleSwipe = (e: any, info: any) => {
    const threshold = 100;
    const currentIndex = links.findIndex(l => l.path === location.pathname);
    
    if (info.offset.x > threshold && currentIndex > 0) {
      // Swipe Right -> Previous Page
      navigate(links[currentIndex - 1].path);
    } else if (info.offset.x < -threshold && currentIndex < links.length - 1) {
      // Swipe Left -> Next Page
      navigate(links[currentIndex + 1].path);
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden touch-pan-y selection:bg-singularity/30 selection:text-white">
      {/* Global Atmosphere */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="atmosphere absolute inset-0" />
        <div className="noise-overlay" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-singularity/10 rounded-full blur-[120px] animate-morph" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-quantum/10 rounded-full blur-[120px] animate-morph" style={{ animationDelay: '-4s' }} />
      </div>

      {bgEnabled && !isHighComputePath && <CinematicBackscreen />}
      <LiveCollaboration />
      <CartModal />
      <NexusPlayer />
      <AdvancedFrontierModal isOpen={isAdvancedModalOpen} onClose={() => setIsAdvancedModalOpen(false)} />
      <EnterpriseNexusPortal />
      <DJVerseOverlay />
      {bgEnabled && !isHighComputePath && <GlobalAvatar />}

      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 pt-[env(safe-area-inset-top)]">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 lg:hidden py-8 px-6 space-y-6"
            >
              {links.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => { playClick(); setIsOpen(false); }}
                  className={`flex items-center gap-4 text-xl font-bold tracking-widest uppercase hover:text-singularity transition-colors ${location.pathname === link.path ? 'text-singularity' : 'text-white'}`}
                >
                  {link.icon && <link.icon className="w-5 h-5 opacity-50" />}
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => { playClick(); setIsOpen(false); }}
                      className="flex items-center gap-4 text-gray-400 hover:text-white"
                    >
                      <UserAvatar user={user} size="sm" showActivityRing={false} />
                      <span className="font-bold uppercase tracking-widest text-sm">Profile</span>
                    </Link>
                    <button 
                      onClick={() => { playClick(); logout(); setIsOpen(false); }}
                      className="flex items-center gap-4 text-red-500"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold uppercase tracking-widest text-sm">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => { playClick(); setIsOpen(false); }}
                    className="flex items-center gap-4 text-white"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-sm">Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full bg-black/80 border-b border-white/5 py-1.5 px-6 flex justify-center items-center gap-6 overflow-hidden">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest hidden sm:block">Secure Checkout Supported:</span>
          <div className="flex items-center gap-4 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3 object-contain invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-3 object-contain" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" onClick={playClick} className="flex items-center gap-3 group shrink-0">
            <Logo size="md" />
          </Link>

          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <GlobalSearch />
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-8 grow justify-center px-12">
            {links.map(link => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={playClick}
                className={`flex flex-col items-center gap-1.5 group transition-all ${location.pathname === link.path ? 'text-singularity' : 'text-gray-400 hover:text-white'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${location.pathname === link.path ? 'bg-singularity/10 shadow-[0_0_20px_rgba(0,184,212,0.2)]' : 'group-hover:bg-white/5'}`}>
                  {link.icon && <link.icon className="w-4 h-4 xl:w-5 xl:h-5" />}
                </div>
                <span className="text-[9px] xl:text-[10px] font-black tracking-widest uppercase leading-none opacity-80">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { playClick(); setIsCartOpen(true); }}
              className="relative p-2 glass rounded-full hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-singularity text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <button 
                onClick={() => { playClick(); setIsAdvancedModalOpen(true); }}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00F0FF] hover:text-[#FF0055] transition-colors bg-black/50 px-3 py-1.5 rounded-full border border-[#00F0FF]/30 glow-text"
              >
                MEGA SUMF APIS
              </button>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-2 text-xs font-mono text-singularity font-bold">
                ℟ {resonance.toLocaleString()}
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <button 
                onClick={() => { playClick(); setShowSettings(!showSettings); }}
                className="flex items-center gap-2 text-xs font-mono text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-3 h-3 text-quantum" /> SETTINGS
              </button>
              
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-16 right-20 w-64 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Narration Voice</label>
                      <select 
                        value={store.narrationVoice}
                        onChange={(e) => store.setNarrationVoice(e.target.value as any)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg p-2 text-sm focus:outline-none focus:border-singularity"
                      >
                        <option value="alloy">Alloy (Neutral)</option>
                        <option value="nova">Nova (Bright)</option>
                        <option value="shimmer">Shimmer (Exciting)</option>
                        <option value="echo">Echo (Calm)</option>
                        <option value="fable">Fable (Storyteller)</option>
                        <option value="onyx">Onyx (Deep)</option>
                        <option value="Puck">Puck (Gemini Default)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Language</label>
                      <select 
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg p-2 text-sm focus:outline-none focus:border-singularity"
                      >
                        {LANGUAGES.map(l => (
                          <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/profile" onClick={playClick} className="block hover:scale-105 transition-transform">
                  <UserAvatar user={user} size="md" />
                </Link>
                <button 
                  onClick={() => { playClick(); logout(); }}
                  className="p-2 glass rounded-full hover:bg-red-500/10 text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                onClick={playClick}
                className="hidden md:flex px-6 py-2 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform items-center gap-2 min-h-[44px]"
              >
                <LogIn className="w-4 h-4" /> LOGIN
              </Link>
            )}

            <button 
              className="lg:hidden text-white min-w-[44px] min-h-[44px] flex items-center justify-center p-2 glass rounded-full mr-2" 
              onClick={() => { playClick(); setIsOpen(false); setIsSearchOpen(true); }}
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              className="lg:hidden text-white min-w-[44px] min-h-[44px] flex items-center justify-center" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Swipeable Main Content */}
      <motion.main 
        style={{ x, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={handleSwipe}
        className="flex-1 pt-20 relative z-10 cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      <footer className="border-t border-white/5 py-12 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Mic2 className="w-5 h-5" />
            <span className="font-display font-bold tracking-widest">SINGREALITY © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            {onReplayIntro && (
              <button 
                onClick={() => { playClick(); onReplayIntro(); }}
                className="text-[10px] font-mono text-gray-500 hover:text-singularity transition-colors uppercase tracking-[0.3em]"
              >
                Replay Masterpiece Intro
              </button>
            )}
            <div className="flex items-center gap-4 opacity-30">
              <div className="w-2 h-2 bg-singularity rounded-full animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Nexus Stable</span>
            </div>
          </div>
        </div>
      </footer>
      <WebAgentInterface />
      <LiveAgentChat />
    </div>
  );
}
