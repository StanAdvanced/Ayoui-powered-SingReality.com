import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Mic2, Users, Zap, Play, Pause, Volume2, VolumeX, SkipForward,
  Sparkles, Rocket, Music, Star, ListMusic, Bot, MessageSquare, Send, Loader2, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoGenerator } from './VideoGenerator';

const YOUTUBE_TOP_10 = [
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', views: '1.4B' },
  { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', views: 'Live' },
  { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi', views: '8B' },
];

const THEMES = [
  { id: 'fun', name: 'Fun', icon: Sparkles, color: 'from-pink-500 to-purple-500', atmosphere: 'bg-pink-500/10' },
  { id: 'serious', name: 'Serious', icon: Mic2, color: 'from-blue-600 to-indigo-900', atmosphere: 'bg-blue-900/20' },
];

export function KaraokeRoom() {
  const { sessionId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [karaokeTheme, setKaraokeTheme] = useState('fun');
  const [videoId, setVideoId] = useState('jfKfPfyJRdk');
  const [currentSong, setCurrentSong] = useState(YOUTUBE_TOP_10[0]);
  const [showGenerator, setShowGenerator] = useState(false);

  const currentThemeData = THEMES.find(t => t.id === karaokeTheme) || THEMES[0];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${currentThemeData.atmosphere}`}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {/* Placeholder for Video Background */}
        <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-white/20 text-4xl font-black italic">QUANTUM ARENA: {sessionId}</p>
        </div>
      </div>

      <div className="min-h-screen p-6 md:p-12 relative z-10 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${currentThemeData.color} shadow-lg`}>
              <currentThemeData.icon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-singularity to-quantum">
              SingReality: {sessionId || 'Solo Session'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowGenerator(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest bg-white text-black hover:bg-singularity transition-all transform hover:scale-105"
            >
                <Video className="w-5 h-5" />
                VEO STUDIO
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 glass-card p-8 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
            {showGenerator ? (
                <div className="w-full">
                    <button onClick={() => setShowGenerator(false)} className="mb-4 text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2">
                        ← BACK TO STAGE
                    </button>
                    <VideoGenerator />
                </div>
            ) : (
                <div className="text-center space-y-8 max-w-2xl">
                    <div className="p-12 rounded-[3rem] border-4 border-dashed border-white/10 relative group">
                        <Mic2 className="w-20 h-20 text-singularity mx-auto mb-6 group-hover:scale-110 transition-transform" />
                        <h2 className="text-5xl font-black text-white italic glow-text">READY TO SING?</h2>
                        <p className="text-gray-400 mt-4">Upload your track or pick from the Jukebox to start the human-AI synthesis.</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
