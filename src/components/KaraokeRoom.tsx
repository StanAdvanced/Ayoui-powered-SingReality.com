import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { syncKaraokeSession, updateKaraokeQueue, updateCurrentSong, Song } from '../services/karaokeService';
import { 
  Mic2, Users, Zap, Play, Pause, Volume2, VolumeX, SkipForward,
  Sparkles, Rocket, Music, Star, Share2, ListMusic, Headset,
  Plus, ChevronUp, ChevronDown, Trash2, Bot, History, MessageSquare, Send, Loader2
} from 'lucide-react';
import { YouTubeBackground } from './YouTubeBackground';
import { useMusicEngine } from '../services/musicEngine';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { narrationEngine } from '../services/narrationEngine';
import { AIDJAvatar } from './AIDJAvatar';
import { SafeCanvas } from './SafeCanvas';
import { Environment, OrbitControls } from '@react-three/drei';
import { QuantumJukebox } from './QuantumJukebox';
import { GlobalSingALong } from './GlobalSingALong';
import { MusicCrowdfunding } from './MusicCrowdfunding';
import { RealTimeCommunication } from './RealTimeCommunication';
import { askAIDJ } from '../services/aiDJService';

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
  const [isKaraokePlaying, setIsKaraokePlaying] = useState(true);
  const { karaokeTheme, setKaraokeTheme } = useStore();
  const [karaokeVolume, setKaraokeVolume] = useState(0.8);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const [isDJSpeaking, setIsDJSpeaking] = useState(false);
  const [currentKaraokeSong, setCurrentKaraokeSong] = useState<Song | null>(null);
  const [karaokeQueue, setKaraokeQueue] = useState<Song[]>([]);

  // New States: Search History & AI DJ Chat
  const [searchHistory, setSearchHistory] = useState<Song[]>([]);
  const [djChatOpen, setDjChatOpen] = useState(false);
  const [djMessages, setDjMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [djInput, setDjInput] = useState('');
  const [isDJLoading, setIsDJLoading] = useState(false);

  // Load Search History
  useEffect(() => {
    const saved = localStorage.getItem('singreality_search_history');
    if (saved) setSearchHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (song: Song) => {
    const newHistory = [song, ...searchHistory.filter(s => s.id !== song.id)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('singreality_search_history', JSON.stringify(newHistory));
  };

  const handleDJChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!djInput.trim() || isDJLoading) return;

    const userMessage = djInput.trim();
    setDjInput('');
    setDjMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsDJLoading(true);

    try {
      const history = djMessages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));

      const response = await askAIDJ(userMessage, history);
      setDjMessages(prev => [...prev, { role: 'model', text: response }]);
      // Auto-narrate DJ response
      narrationEngine.narrate(response, true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDJLoading(false);
    }
  };

  // Monitor Speech API for speaking state
  useEffect(() => {
    const checkSpeech = setInterval(() => {
      setIsDJSpeaking(window.speechSynthesis.speaking);
    }, 100);
    return () => clearInterval(checkSpeech);
  }, []);

  const [seekTarget, setSeekTarget] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (sessionId) {
      const cleanup = syncKaraokeSession(sessionId, (data) => {
        setNetworkTime(data.currentTime);
        if (data.currentTime !== undefined && Math.abs(data.currentTime - currentTime) > 2.5) {
          setCurrentTime(data.currentTime);
          setSeekTarget(data.currentTime);
        }
        if (data.isPlaying !== undefined) setIsKaraokePlaying(data.isPlaying);
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
  }, [sessionId, currentKaraokeSong?.id, currentTime]);

  const toggleKaraokePlay = () => {
    const newPlayState = !isKaraokePlaying;
    setIsKaraokePlaying(newPlayState);
    if (sessionId) {
      updateKaraokePlayback(sessionId, { currentTime, isPlaying: newPlayState });
    }
  };

  const handleVideoProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
    // Simulate a beat detection algorithm using modulo math and time
    const beatInterval = 60 / 120; // Assuming 120 BPM
    const beatPhase = (state.playedSeconds % beatInterval) / beatInterval;
    setBeatPulse(isKaraokePlaying ? 1 + Math.max(0, 1 - beatPhase * 4) * 0.3 : 1);
    
    if (sessionId && Math.floor(state.playedSeconds) % 5 === 0) {
      // Sync every 5 seconds loosely
      updateKaraokePlayback(sessionId, { currentTime: state.playedSeconds, isPlaying: isKaraokePlaying });
    }
  };

  const addToQueue = (song: typeof YOUTUBE_TOP_10[0]) => {
    saveToHistory(song); // Save to history when adding to queue
    const newQueue = [...karaokeQueue, song];
    if (sessionId) updateKaraokeQueue(sessionId, newQueue);
    else setKaraokeQueue(newQueue);
  };

  const addPriorityToQueue = (song: typeof YOUTUBE_TOP_10[0]) => {
    saveToHistory(song); // Save to history when adding priority
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
      <YouTubeBackground 
        videoId={videoId} 
        opacity={0.3} 
        playing={isKaraokePlaying}
        volume={karaokeVolume}
        seekTarget={seekTarget}
        onProgress={handleVideoProgress}
        onEnded={playNextInQueue}
      />
      
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

        {/* Global UI Overlays */}
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
                   saveToHistory(song);
                   setCurrentKaraokeSong(song);
                   setVideoId(song.id);
                   setJukeboxOpen(false);
                }}
                onClose={() => setJukeboxOpen(false)}
                isPlaying={isPlaying}
             />
          )}
        </AnimatePresence>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Main Stage (Lyrics) */}
          <div className="lg:col-span-8 glass-card p-8 rounded-[3rem] border border-white/10 flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
            
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
                        ? 'active-lyric text-4xl md:text-6xl font-black text-white glow-text font-sans' 
                        : isPast
                          ? 'text-2xl md:text-3xl font-bold text-white/30 font-sans'
                          : 'text-2xl md:text-3xl font-bold text-white/10 font-sans'
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

          {/* Right Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-6 relative min-h-[300px]">
              <div className="absolute inset-0 z-0 pointer-events-none">
                <SafeCanvas camera={{ position: [0, 0, 5], fov: 45 }}>
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
                <button 
                  onClick={() => setDjChatOpen(true)}
                  className="mt-4 pointer-events-auto px-6 py-2 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Consult Luna
                </button>
              </div>
            </div>

            <AnimatePresence>
              {djChatOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed bottom-32 right-8 w-96 h-[500px] z-[100] glass rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col overflow-hidden bg-black/90 backdrop-blur-3xl"
                >
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">Luna Chat</h4>
                        <span className="text-[10px] font-mono text-cyan-400">Quantum Intelligence Engine</span>
                      </div>
                    </div>
                    <button onClick={() => setDjChatOpen(false)} className="text-gray-500 hover:text-white">
                      <ChevronDown className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {djMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <Bot className="w-12 h-12 text-gray-700 mb-4" />
                        <p className="text-xs text-gray-500 font-mono italic">
                          "System synchronized. Ask me about song history, the current vibe, or request a quantum curation."
                        </p>
                      </div>
                    ) : (
                      djMessages.map((msg, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={i} 
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-mono leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-singularity text-black rounded-tr-none' 
                              : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                          }`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isDJLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                          <span className="text-[10px] text-gray-400">Quantum Processing...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleDJChat} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                    <input 
                      type="text" 
                      value={djInput}
                      onChange={(e) => setDjInput(e.target.value)}
                      placeholder="Type your transmission..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-quantum outline-none focus:border-quantum/50"
                    />
                    <button 
                      type="submit"
                      disabled={!djInput.trim() || isDJLoading}
                      className="p-3 bg-quantum text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 text-center space-y-1 bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5 w-full mt-4">
              <h3 className="text-lg font-bold text-white truncate px-4 font-sans">
                {currentKaraokeSong?.title || "Connecting..."}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono uppercase">
                 {currentKaraokeSong?.artist || "Quantuam Arena"}
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 w-full px-4">
              <div className="flex items-center gap-6">
                <button 
                  onClick={toggleKaraokePlay}
                  className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  {isKaraokePlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <button 
                  onClick={playNextInQueue}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-4 w-full">
                <button onClick={() => setKaraokeVolume(karaokeVolume === 0 ? 0.8 : 0)}>
                  {karaokeVolume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-400" />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={karaokeVolume}
                  onChange={(e) => setKaraokeVolume(parseFloat(e.target.value))}
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

            <GlobalSingALong />

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

            <MusicCrowdfunding />
          </div>
        </div>

        <RealTimeCommunication 
          roomId={sessionId || 'local-arena-demo'} 
          userId={localStorage.getItem('viewer_name') || 'Viewer_' + Math.floor(Math.random()*1000)} 
        />
      </div>
    </div>
  );
}
