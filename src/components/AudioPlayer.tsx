import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMusicEngine } from '../services/musicEngine';

const ROUTE_GENRES: Record<string, string> = {
  '/': 'Pop',
  '/studio': 'Electronic',
  '/clones': 'Hip-Hop/Rap',
  '/marketplace': 'R&B/Soul',
  '/quantum-lab': 'Experimental',
  '/karaoke': 'Pop',
  '/ai-studio': 'Electronic',
  '/funding': 'Rock',
  '/projects': 'Lo-Fi',
  '/profile': 'Jazz',
  '/portal': 'Classical',
  '/arenas': 'Rock',
  '/live-arena': 'Electronic',
  '/global-map': 'World',
  '/tv': 'Pop'
};

export function AudioPlayer() {
  const location = useLocation();
  const { playGenre, togglePlay, isPlaying, currentTrack, audioElement } = useMusicEngine();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Initial play on first interaction
        const genre = ROUTE_GENRES[location.pathname] || 'Electronic';
        playGenre(genre);
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, location.pathname, playGenre]);

  useEffect(() => {
    if (hasInteracted) {
      const genre = ROUTE_GENRES[location.pathname] || 'Electronic';
      playGenre(genre);
    }
  }, [location.pathname, hasInteracted, playGenre]);

  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4">
      {currentTrack && (
        <div className="hidden md:flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
          <Music className="w-4 h-4 text-singularity animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white max-w-[150px] truncate">{currentTrack.title}</span>
            <span className="text-[10px] text-gray-400 max-w-[150px] truncate">{currentTrack.user.name} • {currentTrack.genre}</span>
          </div>
        </div>
      )}
      <button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        title={isMuted ? "Unmute Background Music" : "Mute Background Music"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-singularity" />}
      </button>
    </div>
  );
}
