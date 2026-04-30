import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, ExternalLink, Play, Eye, ThumbsUp } from 'lucide-react';
import { searchVideos } from '../services/YouTubeService';

export function YouTubeFeatured() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      const results = await searchVideos('futuristic cinematic AI music', 3);
      setVideos(results);
      setLoading(false);
    }
    loadVideos();
  }, []);

  if (loading) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="text-3xl font-display font-black uppercase tracking-tighter flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-600" />
            GlassVerse <span className="text-gradient">Primary Feed</span>
          </h3>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-2">Converged Multimedia Synchronization</p>
        </div>
        <div className="h-[1px] flex-1 mx-8 bg-white/10 hidden md:block" />
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-singularity hover:text-white transition-colors"
        >
          View Full Archive <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {videos.map((video, i) => (
          <motion.div
            key={video.id.videoId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="glass-card group overflow-hidden rounded-3xl border border-white/5 hover:border-singularity/30 transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={video.snippet.thumbnails.high.url} 
                alt={video.snippet.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={`https://youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-singularity/80 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </a>
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                HD_ENCODE_4K
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-bold line-clamp-2 mb-3 leading-tight group-hover:text-singularity transition-colors">
                {video.snippet.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Optimized View
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> Top Rated
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
