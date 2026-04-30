import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { syncKaraokeSession } from '../services/karaokeService';
import { 
  Mic2, Users, Zap, Play, Pause, Volume2, VolumeX, SkipForward,
  Sparkles, Rocket, Music, Star, Share2
} from 'lucide-react';
import { YouTubeBackground } from './YouTubeBackground';
import { useMusicEngine } from '../services/musicEngine';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { narrationEngine } from '../services/narrationEngine';
import { VoiceSelector } from './VoiceSelector';
import { GlobalSingALong } from './GlobalSingALong';
import { MusicCrowdfunding } from './MusicCrowdfunding';

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

export function KaraokeRoom() {
  const { sessionId } = useParams();
  const [networkTime, setNetworkTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoId, setVideoId] = useState('jfKfPfyJRdk');
  const { playGenre, togglePlay, isPlaying, audioElement, currentTrack, volume, setVolume } = useMusicEngine();
  const { karaokeTheme, setKaraokeTheme, narrationVoice } = useStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      syncKaraokeSession(sessionId, (data) => {
        setNetworkTime(data.currentTime);
      });
    }
  }, [sessionId]);

  // Autoplay music on mount
  useEffect(() => {
    playGenre('Pop');
  }, [playGenre]);

  // Fetch YouTube video dynamically based on the current track
  useEffect(() => {
    if (currentTrack) {
      const query = `${currentTrack.title || 'Karaoke'} ${currentTrack.user?.name || ''} official music video`;
      fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            setVideoId(data.items[0].id.videoId);
          }
        })
        .catch(err => console.error("Error fetching YouTube video:", err));
    }
  }, [currentTrack]);

  // Sync lyrics with audio element
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    updateTime();
    return () => cancelAnimationFrame(animationFrameId);
  }, [audioElement]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeLyric = lyricsContainerRef.current.querySelector('.active-lyric');
      if (activeLyric) {
        activeLyric.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime]);

  const activeIndex = PREDEFINED_LYRICS.reduce((acc, lyric, index) => {
    if (currentTime >= lyric.time) return index;
    return acc;
  }, 0);

  const currentThemeData = THEMES.find(t => t.id === karaokeTheme) || THEMES[0];

  useEffect(() => {
    // Audit: Autonomous narration for karaoke room
    const narrationText = `Entering Karaoke Room. Current theme is ${currentThemeData.name}. Prepare to sing your soul out in the quantum flow.`;
    narrationEngine.narrate(narrationText, true, narrationVoice);

    return () => narrationEngine.stop();
  }, [karaokeTheme, narrationVoice]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${currentThemeData.atmosphere}`}>
      <YouTubeBackground videoId={videoId} opacity={0.15} />
      
      {/* Dynamic Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-white/20`}
            initial={{ x: Math.random() * 100 + '%', y: '110%' }}
            animate={{ 
              y: '-10%',
              opacity: [0, 0.5, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 10 
            }}
          />
        ))}
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

            <div className="flex gap-4 glass px-6 py-3 rounded-full text-sm font-mono">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-singularity" />
                <span>150M+ Nodes</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-quantum" />
                <span>4.2ms Latency</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lyrics Display */}
          <div className="lg:col-span-8 glass-card p-8 rounded-[3rem] border border-white/10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
            
            <div 
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto hide-scrollbar py-32 px-4 space-y-8 text-center"
            >
              {PREDEFINED_LYRICS.map((lyric, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;
                
                return (
                  <div 
                    key={index}
                    className={`transition-all duration-500 transform ${
                      isActive 
                        ? 'active-lyric text-4xl md:text-6xl font-black text-white glow-text scale-110' 
                        : isPast
                          ? 'text-2xl md:text-3xl font-bold text-white/30 scale-95'
                          : 'text-2xl md:text-3xl font-bold text-white/10 scale-90'
                    }`}
                  >
                    {lyric.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar - Integrations & Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Controls & Track Info */}
            <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${currentThemeData.color} opacity-20 blur-3xl rounded-full`} />
                <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center relative overflow-hidden glass">
                  <Mic2 className={`w-12 h-12 text-singularity ${isPlaying ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white truncate max-w-[200px] mx-auto">
                  {currentTrack?.title || "Loading Track..."}
                </h3>
                <p className="text-gray-400 font-mono text-sm">
                  {currentTrack?.user?.name || "Audius Network"}
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
                    onClick={() => playGenre('Pop')}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                    title="Next Random Track"
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

              <div className="w-full h-[1px] bg-white/10 my-2" />

              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Network Sync</div>
                <div className="text-lg font-mono font-bold text-quantum glow-text">
                  {new Date(networkTime).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Global Chat/Translate Integration */}
            <GlobalSingALong />

            {/* AI Voice Selection */}
            <VoiceSelector />

            {/* Music Crowdfunding Integration */}
            <MusicCrowdfunding />
          </div>
        </div>
      </div>
    </div>
  );
}
