import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { syncKaraokeSession, updateKaraokeQueue, updateCurrentSong, Song } from '../services/karaokeService';
import { 
  Mic2, Users, Zap, Play, Pause, Volume2, VolumeX, SkipForward,
  Sparkles, Rocket, Music, Star, Share2, ListMusic, Headset,
  Plus, ChevronUp, ChevronDown, Trash2, Bot
} from 'lucide-react';
import { YouTubeBackground } from './YouTubeBackground';
import { useMusicEngine } from '../services/musicEngine';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { narrationEngine } from '../services/narrationEngine';
import { AIDJAvatar, useAIDJVoice } from './AIDJAvatar';
import { SafeCanvas } from './SafeCanvas';
import { Environment, OrbitControls } from '@react-three/drei';
import { QuantumJukebox } from './QuantumJukebox';
import { GlobalSingALong } from './GlobalSingALong';
import { MusicCrowdfunding } from './MusicCrowdfunding';
import { RealTimeCommunication } from './RealTimeCommunication';

const PREDEFINED_LYRICS = [
  { time: 0, text: "♪ (Instrumental Intro) ♪" },
  { time: 10, text: "Welcome to the SingReality Karaoke Room" },
  { time: 15, text: "Where the quantum beats meet the human soul" },
  { time: 20, text: "Feel the resonance in every single note" },
  { time: 25, text: "We're diving deep into the digital flow" },
  { time: 30, text: "♪ (Chorus) ♪" },
  { time: 32, text: "Sing it loud, let the holograms glow" },
  { time: 37, text: "From the Nexus to the global show" },
  { time: 42, text: "10,000 agents working in the background" },
  { time: 47, text: "This is the future of the sound" },
  { time: 52, text: "♪ (Instrumental Break) ♪" },
  { time: 62, text: "Upload your mind, let the avatar speak" },
  { time: 67, text: "We're reaching peaks that are so unique" },
  { time: 72, text: "Gaussian splatting all around the stage" },
  { time: 77, text: "Turning the page to a brand new age" },
  { time: 82, text: "♪ (Chorus) ♪" },
  { time: 84, text: "Sing it loud, let the holograms glow" },
  { time: 89, text: "From the Nexus to the global show" },
  { time: 94, text: "10,000 agents working in the background" },
  { time: 99, text: "This is the future of the sound" },
  { time: 104, text: "♪ (Outro) ♪" },
];

const THEMES = [
  { id: 'fun', name: 'Fun', icon: Sparkles, color: 'from-pink-500 to-purple-500', atmosphere: 'bg-pink-500/10' },
  { id: 'serious', name: 'Serious', icon: Mic2, color: 'from-blue-600 to-indigo-900', atmosphere: 'bg-blue-900/20' },
  { id: 'cosmic', name: 'Out of this World', icon: Rocket, color: 'from-purple-900 via-black to-blue-900', atmosphere: 'bg-purple-900/30' },
  { id: 'retro', name: 'Retro', icon: Music, color: 'from-orange-500 to-red-600', atmosphere: 'bg-orange-500/10' },
];

const YOUTUBE_TOP_10 = [
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', views: '1.4B' },
  { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', views: 'Live' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', views: '8B' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', views: '6B' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson', views: '5B' },
  { id: '09R8_2nJtjg', title: 'Sugar', artist: 'Maroon 5', views: '3.9B' },
  { id: 'fRh_vgS2dFE', title: 'Sorry', artist: 'Justin Bieber', views: '3.7B' },
  { id: 'RgKAFK5djSk', title: 'See You Again', artist: 'Wiz Khalifa', views: '6B' },
  { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele', views: '3.1B' },
  { id: 'CevxZvSJLk8', title: 'Roar', artist: 'Katy Perry', views: '3.8B' }
];

export function KaraokeRoom() {
  const { sessionId } = useParams();
  const [networkTime, setNetworkTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoId, setVideoId] = useState('jfKfPfyJRdk');
  const [jukeboxOpen, setJukeboxOpen] = useState(false);
  const [beatPulse, setBeatPulse] = useState(1);
  const { togglePlay, isPlaying, audioElement, volume, setVolume } = useMusicEngine();
  const { karaokeTheme, setKaraokeTheme } = useStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const [isDJSpeaking, setIsDJSpeaking] = useState(false);
  const [currentKaraokeSong, setCurrentKaraokeSong] = useState<Song | null>(null);
  const [karaokeQueue, setKaraokeQueue] = useState<Song[]>([]);

  // Monitor Speech API for speaking state
  useEffect(() => {
    const checkSpeech = setInterval(() => {
      setIsDJSpeaking(window.speechSynthesis.speaking);
    }, 100);
    return () => clearInterval(checkSpeech);
  }, []);

  useEffect(() => {
    if (sessionId) {
      const cleanup = syncKaraokeSession(sessionId, (data) => {
        setNetworkTime(data.currentTime);
        if (data.queue) setKaraokeQueue(data.queue);
        if (data.currentSong) {
            if (data.currentSong.id !== currentKaraokeSong?.id) {
                setVideoId(data.currentSong.id);
            }
            setCurrentKaraokeSong(data.currentSong);
        }
      });
      return cleanup;
    }
  }, [sessionId, currentKaraokeSong?.id]);

  const addToQueue = (song: typeof YOUTUBE_TOP_10[0]) => {
    const newQueue = [...karaokeQueue, song];
    if (sessionId) updateKaraokeQueue(sessionId, newQueue);
    else setKaraokeQueue(newQueue);
  };

  const addPriorityToQueue = (song: typeof YOUTUBE_TOP_10[0]) => {
    const newQueue = [song, ...karaokeQueue];
    if (sessionId) updateKaraokeQueue(sessionId, newQueue);
    else setKaraokeQueue(newQueue);
  };

  const removeFromQueue = (index: number) => {
    const newQueue = karaokeQueue.filter((_, i) => i !== index);
    if (sessionId) updateKaraokeQueue(sessionId, newQueue);
    else setKaraokeQueue(newQueue);
  };

  const moveInQueue = (index: number, direction: 'up' | 'down') => {
    const newQueue = [...karaokeQueue];
    if (direction === 'up' && index > 0) {
      [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
    } else if (direction === 'down' && index < newQueue.length - 1) {
      [newQueue[index + 1], newQueue[index]] = [newQueue[index], newQueue[index + 1]];
    }
    if (sessionId) updateKaraokeQueue(sessionId, newQueue);
    else setKaraokeQueue(newQueue);
  };

  const playNextInQueue = () => {
    if (karaokeQueue.length > 0) {
      const nextSong = karaokeQueue[0];
      if (sessionId) {
         updateCurrentSong(sessionId, nextSong);
         const newQueue = karaokeQueue.slice(1);
         updateKaraokeQueue(sessionId, newQueue);
      } else {
         setVideoId(nextSong.id);
         setCurrentKaraokeSong(nextSong);
         setKaraokeQueue(prev => prev.slice(1));
      }
    } else {
      const randomSong = YOUTUBE_TOP_10[Math.floor(Math.random() * YOUTUBE_TOP_10.length)];
      if (sessionId) {
         updateCurrentSong(sessionId, randomSong);
      } else {
         setVideoId(randomSong.id);
         setCurrentKaraokeSong(randomSong);
      }
    }
  };

  useEffect(() => {
    if (!sessionId) {
       const persists = localStorage.getItem('jukebox_persist_optin') === 'true';
       if (persists) {
          const savedStr = localStorage.getItem('jukebox_state_optin_data');
          if (savedStr) {
             const saved = JSON.parse(savedStr);
             if (saved.queue) setKaraokeQueue(saved.queue);
             if (saved.currentSong) {
                setCurrentKaraokeSong(saved.currentSong);
                setVideoId(saved.currentSong.id);
             }
             return;
          }
       } else {
          // Clear if opted out
          localStorage.removeItem('jukebox_state_optin_data');
       }

       if (!currentKaraokeSong && YOUTUBE_TOP_10.length > 0) {
          setCurrentKaraokeSong(YOUTUBE_TOP_10[0]);
          setVideoId(YOUTUBE_TOP_10[0].id);
       }
    }
  }, []); // Run on mount

  // Sync to localstorage if opted in
  useEffect(() => {
     if (!sessionId) {
        const persists = localStorage.getItem('jukebox_persist_optin') === 'true';
        if (persists && currentKaraokeSong) {
           localStorage.setItem('jukebox_state_optin_data', JSON.stringify({
              queue: karaokeQueue,
              currentSong: currentKaraokeSong
           }));
        }
     }
  }, [karaokeQueue, currentKaraokeSong, sessionId]);

  // Sync lyrics and beat pulse with audio element
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
        // Simulate a beat detection algorithm using modulo math and time
        const beatInterval = 60 / 120; // Assuming 120 BPM
        const beatPhase = (audioElement.currentTime % beatInterval) / beatInterval;
        setBeatPulse(isPlaying ? 1 + Math.max(0, 1 - beatPhase * 4) * 0.3 : 1);
      } else {
        setBeatPulse(1);
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    updateTime();
    return () => cancelAnimationFrame(animationFrameId);
  }, [audioElement, isPlaying]);

  const activeIndex = PREDEFINED_LYRICS.reduce((acc, lyric, index) => {
    if (currentTime >= lyric.time) return index;
    return acc;
  }, 0);

  // Auto-scroll lyrics
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeLyricNode = lyricsContainerRef.current.querySelector('.active-lyric');
      if (activeLyricNode) {
        activeLyricNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  const currentThemeData = THEMES.find(t => t.id === karaokeTheme) || THEMES[0];

  useEffect(() => {
    // Audit: Autonomous narration for karaoke room
    const narrationText = `Entering Karaoke Room. Current theme is ${currentThemeData.name}. Prepare to sing your soul out in the quantum flow.`;
    narrationEngine.narrate(narrationText, true);

    return () => narrationEngine.stop();
  }, [karaokeTheme]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${currentThemeData.atmosphere}`}>
      {/* 9D Cinematography & Autonomously Synced YouTube Video */}
      <YouTubeBackground videoId={videoId} opacity={0.3} />
      
      {/* Dynamic Visualizer Particles Based on Intensity */}
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen">
        {Array.from({ length: 30 }).map((_, i) => {
          const moveSpeed = isPlaying ? 2 + Math.random() * 3 : 15;
          return (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-singularity/80' : 'bg-quantum/80'}`}
              initial={{ x: Math.random() * 100 + 'vw', y: '110vh' }}
              animate={{ 
                y: '-10vh',
                scale: [beatPulse, beatPulse * (Math.random() * 1.5 + 1), beatPulse],
                opacity: isPlaying ? [0, 0.8, 0] : [0, 0.2, 0]
              }}
              transition={{ 
                duration: moveSpeed + Math.random() * 10, 
                repeat: Infinity, 
                delay: Math.random() * 10 
              }}
            />
          );
        })}
      </div>

      <div className="min-h-screen p-6 md:p-12 relative z-10 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${currentThemeData.color} shadow-lg`}>
              <currentThemeData.icon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-singularity to-quantum">
              Karaoke Session: {sessionId}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex gap-2 glass p-1.5 rounded-2xl border border-white/5">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setKaraokeTheme(theme.id as any)}
                  className={`p-2 rounded-xl transition-all ${karaokeTheme === theme.id ? `bg-gradient-to-br ${theme.color} text-white shadow-lg` : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  title={theme.name}
                >
                  <theme.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <button 
              onClick={() => setJukeboxOpen(!jukeboxOpen)}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest bg-[#ffdd00] text-black shadow-[0_0_20px_rgba(255,221,0,0.5)] hover:bg-white transition-all transform hover:scale-105 z-20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/50 w-full transform -skew-x-12 -translate-x-full opacity-50 animate-[shimmer_2s_infinite]" />
              <ListMusic className="w-5 h-5" />
              JUKEBOX
            </button>
          </div>
        </div>

        {/* Advanced 9D/Gaussian Splat Enhanced Jukebox */}
        <AnimatePresence>
          {jukeboxOpen && (
             <QuantumJukebox 
                topTracks={YOUTUBE_TOP_10}
                queue={karaokeQueue}
                onAdd={addToQueue}
                onAddPriority={addPriorityToQueue}
                onRemove={removeFromQueue}
                onMove={moveInQueue}
                onPlayNow={(song) => {
                   setCurrentKaraokeSong(song);
                   setVideoId(song.id);
                   setJukeboxOpen(false);
                }}
                onClose={() => setJukeboxOpen(false)}
                isPlaying={isPlaying}
             />
          )}
        </AnimatePresence>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lyrics Display & Arcade Animations */}
          <div className="lg:col-span-8 glass-card p-8 rounded-[3rem] border border-white/10 flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
            
            {/* Arcade Japanese Cartoonish Background Icons */}
            <motion.div 
              className="absolute inset-0 z-0 opacity-10 pointer-events-none flex flex-wrap items-center justify-center gap-12"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: isPlaying ? [0.1, 0.2, 0.1] : [0.05, 0.05, 0.05]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Music className="w-32 h-32 text-pink-500" />
              <Star className="w-24 h-24 text-yellow-500" />
              <Sparkles className="w-40 h-40 text-cyan-500" />
            </motion.div>
            
            <div 
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto hide-scrollbar py-[40vh] px-4 space-y-12 text-center scroll-smooth"
            >
              {PREDEFINED_LYRICS.map((lyric, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;
                
                return (
                  <motion.div 
                    key={index}
                    className={`transition-all duration-700 transform relative py-4 px-8 rounded-2xl ${
                      isActive 
                        ? 'active-lyric text-4xl md:text-6xl font-black text-white glow-text' 
                        : isPast
                          ? 'text-2xl md:text-3xl font-bold text-white/30'
                          : 'text-2xl md:text-3xl font-bold text-white/10'
                    }`}
                    animate={{
                      scale: isActive ? 1.1 : isPast ? 0.95 : 0.9,
                      opacity: isActive ? 1 : isPast ? 0.3 : 0.1,
                      y: isActive ? 0 : isPast ? -10 : 10
                    }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-singularity/20 to-transparent -z-10 rounded-2xl"
                        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    {lyric.text}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar - Integrations & Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* AI Resident DJ Avatar Section */}
            <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-6 relative min-h-[300px]">
              <div className="absolute inset-0 z-0">
                <SafeCanvas camera={{ position: [0, 0, 5], fov: 45 }}>
                   <ambientLight intensity={0.5} />
                   <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
                   <AIDJAvatar isSpeaking={isDJSpeaking} currentVibe={karaokeQueue.length > 5 ? 'High Energy' : 'Chill'} />
                   <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                   <Environment preset="city" />
                </SafeCanvas>
              </div>

              <div className="relative z-10 w-full flex flex-col items-center pointer-events-none mt-[200px]">
                <div className="text-[10px] uppercase font-black text-cyan-400 bg-black/80 px-3 py-1 rounded-full border border-cyan-500/30 tracking-widest shadow-[0_0_15px_rgba(0,255,255,0.3)] flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isDJSpeaking ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                  Luna: Resident Quantum DJ
                </div>
              </div>
              
              <div className="relative z-10 text-center space-y-1 bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5 w-full mt-4">
                <h3 className="text-lg font-bold text-white truncate px-4">
                  {currentKaraokeSong?.title || "Connecting..."}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono uppercase">
                   {currentKaraokeSong?.artist || "Quantuam Arena"}
                </p>
              </div>

              {/* Playback Controls */}
              <div className="flex flex-col items-center gap-6 w-full px-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                  <button 
                    onClick={playNextInQueue}
                    className={`w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors`}
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="flex items-center gap-4 w-full">
                  <button onClick={() => setVolume(volume === 0 ? 0.15 : 0)}>
                    {volume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-400" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/10 my-4" />

              {karaokeQueue.length > 0 && (
                <div className="w-full text-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] text-singularity flex items-center justify-center gap-1 uppercase tracking-widest mb-1">
                    <ListMusic className="w-3 h-3" /> Up Next
                  </div>
                  <div className="text-sm font-bold text-white truncate px-2">{karaokeQueue[0].title}</div>
                  <div className="text-xs text-gray-400 truncate px-2">{karaokeQueue[0].artist}</div>
                  <div className="text-[9px] text-gray-500 uppercase mt-1">+{karaokeQueue.length - 1} more in queue</div>
                </div>
              )}

              <div className="text-center mt-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Network Sync</div>
                <div className="text-lg font-mono font-bold text-quantum glow-text">
                  {new Date(networkTime).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Global Chat/Translate Integration */}
            <GlobalSingALong />

            {/* AI Vibe Status (Simulated Frontier Analysis) */}
            <div className="glass-card p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
                <Bot className="w-4 h-4" /> AI Vibe Analysis
              </div>
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <div className="text-[10px] text-gray-500 uppercase">Current Vibe</div>
                  <div className="text-sm font-bold text-white uppercase tracking-tighter">
                    {karaokeQueue.length > 5 ? 'High Energy Chaos' : 'Chill Acoustic Flow'}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] text-gray-500 uppercase">Synchronicity</div>
                  <div className="text-sm font-bold text-quantum">98.4%</div>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,1)]" 
                    animate={{ width: ['20%', '80%', '40%', '98%'] }} 
                    transition={{ repeat: Infinity, duration: 10 }}
                />
              </div>
            </div>

            {/* Music Crowdfunding Integration */}
            <MusicCrowdfunding />
          </div>
        </div>
      </div>

      {/* Real-Time Communication (Text/Voice/Video Chat) */}
      <RealTimeCommunication 
        roomId={sessionId || 'local-arena-demo'} 
        userId={localStorage.getItem('viewer_name') || 'Viewer_' + Math.floor(Math.random()*1000)} 
      />
    </div>
  );
}
