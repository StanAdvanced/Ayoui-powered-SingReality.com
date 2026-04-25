import React, { useState } from 'react';
import { Search, Play } from 'lucide-react';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
  };
}

export function YouTubeSearch() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const searchVideos = async () => {
    if (!query) return;
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setVideos(data.items || []);
  };

  return (
    <div className="p-6 glass rounded-2xl border border-white/10">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search music videos..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
        />
        <button onClick={searchVideos} className="p-3 bg-singularity rounded-xl">
          <Search className="w-6 h-6 text-white" />
        </button>
      </div>

      {selectedVideo && (
        <div className="mb-6 aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {videos.map((video) => (
          <button
            key={video.id.videoId}
            onClick={() => setSelectedVideo(video.id.videoId)}
            className="text-left p-2 rounded-xl hover:bg-white/5"
          >
            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="rounded-lg mb-2" />
            <p className="text-sm font-medium truncate">{video.snippet.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
