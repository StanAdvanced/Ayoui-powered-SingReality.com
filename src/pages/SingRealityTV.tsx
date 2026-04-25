import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, Tv, Sparkles, Search, Tag, ExternalLink } from 'lucide-react';
import { YouTubeBackground } from '../components/YouTubeBackground';
import { useStore, GlobalTrack } from '../store/useStore';
import { useSound } from '../hooks/useSound';

const YOUTUBE_VIDEOS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', tags: ['lofi', 'chill', 'beats'] },
  { id: '5qap5aO4i9A', title: 'Synthwave Radio', tags: ['synthwave', 'electronic', 'retro'] },
  { id: 'DWcJFNfaw9c', title: 'Cyberpunk Ambient', tags: ['cyberpunk', 'ambient', 'dark'] },
  { id: 'XpS_6-O9_3s', title: 'Quantum Visuals', tags: ['visuals', 'abstract', 'ai'] },
  { id: 'wA0C0uRxSaE', title: 'Future Bass Mix', tags: ['future bass', 'edm', 'energy'] },
  { id: '7NOSDKb0HlU', title: 'Ambient Space Music', tags: ['ambient', 'space', 'relax'] },
  { id: 'MCkTebktHVc', title: 'Electronic Dance Mix', tags: ['edm', 'dance', 'party'] },
  { id: '5yXQJBU8A28', title: 'Chillstep Mix', tags: ['chillstep', 'dubstep', 'relax'] },
  { id: '21qNxnCS8WU', title: 'Vaporwave Mix', tags: ['vaporwave', 'chill', 'retro'] },
  { id: 'lTRiuFIWV54', title: 'Cyberpunk 2077 Mix', tags: ['cyberpunk', 'gaming', 'mix'] },
  { id: 'hHjGUZjv-80', title: 'Dark Synthwave', tags: ['synthwave', 'dark', 'electronic'] },
  { id: 'MVPTGNGiI-4', title: 'Retrowave Mix', tags: ['retrowave', 'synth', 'retro'] },
  { id: '4xDzrJKXOOY', title: 'Synth Pop', tags: ['pop', 'synth', 'vocal'] },
  { id: 'kgx4WGK0oNU', title: 'Jazz Hop', tags: ['jazz', 'lofi', 'beats'] },
  { id: '5qap5aO4i9A', title: 'Chillwave', tags: ['chillwave', 'indie', 'electronic'] },
  { id: 'jfKfPfyJRdk', title: 'Study Beats', tags: ['study', 'lofi', 'focus'] },
  { id: 'DWcJFNfaw9c', title: 'Sci-Fi Ambient', tags: ['scifi', 'ambient', 'space'] },
  { id: 'XpS_6-O9_3s', title: 'AI Generated Art', tags: ['ai', 'visuals', 'art'] },
  { id: 'wA0C0uRxSaE', title: 'Gaming Mix', tags: ['gaming', 'edm', 'focus'] },
  { id: '7NOSDKb0HlU', title: 'Deep Space', tags: ['space', 'relax', 'ambient'] },
];

export function SingRealityTV() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { setGlobalTrack } = useStore();
  const { playClick, playTransition } = useSound();

  const handleLaunchToNexusPlayer = (video: any) => {
    playTransition();
    setGlobalTrack({
      id: video.id,
      title: video.title,
      artist: "SingReality Broadcaster",
      youtubeId: video.id,
      type: 'video'
    });
  };

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    YOUTUBE_VIDEOS.forEach(v => v.tags.forEach(t => tags.add(t.toLowerCase())));
    return Array.from(tags).sort();
  }, []);

  const filteredVideos = useMemo(() => {
    return YOUTUBE_VIDEOS.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag ? video.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()) : true;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen relative">
      <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.15} />
      <div className="min-h-screen pt-24 px-6 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-singularity/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-singularity/30 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            <Tv className="w-10 h-10 text-singularity" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-widest uppercase">
            SingReality <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-quantum">TV</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            24/7 Quantum Broadcasting. Tune into the multiverse of AI-generated music, live performances, and neural visualizers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6 max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search channels, genres, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-singularity/50 focus:bg-white/10 transition-all placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all glass hover:bg-white/10 ${!selectedTag ? 'bg-white/20 border-white/30 text-white' : 'text-gray-400'}`}
            >
              All Channels
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all glass hover:bg-white/10 flex items-center gap-1 ${tag === selectedTag ? 'bg-singularity/20 border-singularity/30 text-singularity' : 'text-gray-400'}`}
              >
                <Tag className="w-3 h-3" /> {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video, i) => (
            <motion.div
              key={video.id + i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleLaunchToNexusPlayer(video)}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-singularity/50 transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] active:scale-95"
            >
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  src={`https://www.youtube.com/embed/${video.id}?controls=0&showinfo=0&rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center backdrop-blur-[2px] group-hover:backdrop-blur-none">
                  <Play className="w-12 h-12 text-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-singularity opacity-0 group-hover:opacity-100 mt-3 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Launch Nexus Player
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-sm truncate mb-3 group-hover:text-singularity transition-colors">{video.title}</h3>
                
                {/* Tags mapping */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {video.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[10px] text-singularity font-bold tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-singularity animate-pulse" />
                    <span>Live Broadcasting</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredVideos.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">No transmissions found</h3>
              <p className="text-gray-400">Try adjusting your search query or tag filters in the quantum matrix.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
