import React, { useState } from 'react';
import { Search, Loader2, Play, ExternalLink, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '../hooks/useSound';
import { useStore } from '../store/useStore';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

export function YouTubeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setGlobalTrack } = useStore();
  const { playClick, playTransition } = useSound();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    playClick();

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Quantum signal lost. Please retry.');
      const data = await response.json();
      
      if (data.items) {
        setResults(data.items);
      } else {
        setResults([]);
        setError('No neural matches found in the YouTube dimension.');
      }
    } catch (err) {
      console.error('YouTube Search Error:', err);
      setError('Connection to YouTube subspace failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideo = (video: YouTubeVideo) => {
    playTransition();
    setGlobalTrack({
      id: video.id.videoId,
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      youtubeId: video.id.videoId,
      type: 'video'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Search Input Area */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-singularity/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-3xl p-2 focus-within:border-singularity/50 focus-within:bg-white/10 transition-all">
          <Search className="w-6 h-6 ml-4 text-gray-500 group-focus-within:text-singularity transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the YouTube Multiverse for music videos..."
            className="flex-1 bg-transparent border-none outline-none py-4 px-4 text-lg font-display placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-singularity text-black font-bold py-3 px-8 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Music className="w-5 h-5" />
                <span>SEARCH</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full p-8 text-center glass rounded-3xl border-red-500/20"
            >
              <p className="text-red-400 font-mono uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          {results.map((video, i) => (
            <motion.div
              key={video.id.videoId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelectVideo(video)}
              className="glass-card group cursor-pointer rounded-3xl overflow-hidden border border-white/5 hover:border-singularity/50 transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
            >
              <div className="relative aspect-video">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-singularity/90 rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                    <Play className="w-8 h-8 text-black fill-current ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-singularity transition-colors" 
                    dangerouslySetInnerHTML={{ __html: video.snippet.title }} 
                />
                <p className="text-sm text-gray-500 font-mono mb-4 uppercase tracking-wider">{video.snippet.channelTitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-singularity/70 font-bold bg-singularity/5 px-2 py-1 rounded">
                    YOUTUBE STREAM
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-singularity transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isLoading && results.length === 0 && !error && query && (
          <div className="col-span-full py-20 text-center opacity-30">
            <Search className="w-12 h-12 mx-auto mb-4" />
            <p className="font-mono uppercase tracking-widest text-sm">Awaiting neural input...</p>
          </div>
        )}
      </div>
    </div>
  );
}
