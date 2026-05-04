import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { syncKaraokeSession } from '../services/karaokeService';
import { 
  Mic2, Users, Zap, Play, Pause, Volume2, VolumeX, SkipForward,
  Sparkles, Rocket, Music, Star, Share2, ListMusic, Headset
} from 'lucide-react';
import { YouTubeBackground } from './YouTubeBackground';
import { useMusicEngine } from '../services/musicEngine';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { narrationEngine } from '../services/narrationEngine';
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
  const { togglePlay, isPlaying, audioElement, currentTrack, volume, setVolume, playGenre } = useMusicEngine();
  const { karaokeTheme, setKaraokeTheme } = useStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      syncKaraokeSession(sessionId, (data) => {
        setNetworkTime(data.currentTime);
      });
    }
  }, [sessionId]);

  // Autoplay removed for initial landing experience
  useEffect(() => {
    // If we want autonomous start, we can trigger it based on user interaction or specifically selected top 10.
  }, []);

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

        {/* Realistic Jukebox Zoom Overlay */}
        <AnimatePresence>
          {jukeboxOpen && (
            <motion.div 
              initial={{ scale: 0.1, opacity: 0, y: 300 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.1, opacity: 0, y: 300 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
            >
              <div className="w-full max-w-4xl h-[80vh] rounded-[3rem] border-[8px] border-[#8b5a2b] bg-[#221] shadow-[0_0_100px_rgba(255,100,0,0.4)] relative flex flex-col overflow-hidden">
                {/* Jukebox styling details */}
                <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-[#ffed4a]/50 to-transparent" />
                <div className="absolute top-2 w-full flex justify-between px-12">
                  <div className="w-24 h-24 rounded-full border-[6px] border-[#555] bg-gradient-to-tr from-gray-900 to-gray-600 shadow-inner" />
                  <div className="w-24 h-24 rounded-full border-[6px] border-[#555] bg-gradient-to-tr from-gray-900 to-gray-600 shadow-inner" />
                </div>
                
                <div className="flex-1 mt-20 p-8 glass-card border border-white/10 m-8 rounded-3xl overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">Top 10 Global Tracks</h2>
                    <button onClick={() => setJukeboxOpen(false)} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full font-bold text-white transition-colors uppercase tracking-widest text-sm">Close</button>
                  </div>
                  <div className="space-y-4">
                    {YOUTUBE_TOP_10.map((song, i) => (
                      <div key={song.id} 
                           onClick={() => { setVideoId(song.id); setJukeboxOpen(false); }}
                           className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5 hover:bg-white/10 hover:border-singularity/50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center font-black font-mono text-xl text-singularity opacity-50 group-hover:opacity-100">{i + 1}</div>
                          <div>
                            <div className="font-bold text-white text-lg group-hover:text-singularity transition-colors">{song.title}</div>
                            <div className="text-sm text-gray-400 font-mono">{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                          <Users className="w-3 h-3 text-quantum" />
                          <span className="text-xs font-mono text-gray-300">{song.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
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
                opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.05
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Music className="w-32 h-32 text-pink-500" />
              <Star className="w-24 h-24 text-yellow-500" />
              <Sparkles className="w-40 h-40 text-cyan-500" />
            </motion.div>
            
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
            {/* Controls & Track Info with Avatar */}
            <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-6 relative">
              {/* Avatar Glowing Head Sync */}
              <div className="absolute top-4 right-4 flex flex-col items-center">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.8)] z-10"
                  animate={{ 
                    scale: beatPulse,
                    boxShadow: isPlaying ? `0 0 ${20 * beatPulse}px rgba(208,255,0,${beatPulse * 0.8})` : '0 0 10px rgba(0,0,0,0.5)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Headset className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-[10px] uppercase font-bold text-singularity mt-2 bg-black/50 px-2 py-1 rounded">Your Host</div>
              </div>

              <div className="relative mt-8">
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

            {/* Music Crowdfunding Integration */}
            <MusicCrowdfunding />
          </div>
        </div>
      </div>
    </div>
  );
}
