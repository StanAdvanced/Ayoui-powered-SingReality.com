import React, { useState } from 'react';
import { Search, Loader2, Music } from 'lucide-react';

export function MusicSearch({ onSelect }: { onSelect: (video: any) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for a song..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-singularity outline-none transition-all placeholder:text-gray-600"
        />
        <button 
          onClick={handleSearch}
          className="absolute right-2 top-2 p-2 rounded-lg bg-singularity/20 hover:bg-singularity/40 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4 text-singularity"/>}
        </button>
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto no-scrollbar">
          {results.map((item: any) => (
            <button
              key={item.id.videoId}
              onClick={() => onSelect(item)}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
            >
              <img src={item.snippet.thumbnails.default.url} className="w-12 h-12 rounded-lg object-cover" alt="" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-white truncate w-full">{item.snippet.title}</span>
                <span className="text-[10px] text-gray-400 truncate">{item.snippet.channelTitle}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
