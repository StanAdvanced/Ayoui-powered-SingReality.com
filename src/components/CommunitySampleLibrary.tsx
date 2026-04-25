import React, { useState } from 'react';
import { Download, Upload, Search, Music, Tags, User, Play, Pause } from 'lucide-react';

export function CommunitySampleLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const MOCK_SAMPLES = [
    { id: '1', title: 'Cyberpunk Synth Loop', type: 'WAV', author: '@NeonDreamer', tags: ['Synth', 'Cyberpunk', 'Loop'], downloads: 1205, bpm: 120 },
    { id: '2', title: 'Acoustic Guitar Riff', type: 'WAV', author: '@WoodStrings', tags: ['Acoustic', 'Guitar', 'Riff', 'Chill'], downloads: 840, bpm: 85 },
    { id: '3', title: 'Future Bass Drum Kit', type: 'MIDI', author: '@BeatMakerX', tags: ['Drums', 'Future Bass', 'Punchy'], downloads: 3200, bpm: 150 },
    { id: '4', title: 'Ethereal Pad Progression', type: 'MIDI', author: '@CloudNine', tags: ['Pad', 'Ambient', 'Chords'], downloads: 410, bpm: 90 },
  ];

  return (
    <div className="w-full glass-card p-6 md:p-10 rounded-[3rem] border border-white/10 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Community Sample Library</h2>
          <p className="text-gray-400 mt-2">Discover, download, and share high-quality WAV and MIDI samples.</p>
        </div>
        
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold tracking-widest uppercase hover:opacity-90 flex items-center justify-center gap-2 shrink-0">
          <Upload className="w-5 h-5" />
          Upload Sample
        </button>
      </div>

      <div className="flex bg-black/40 border border-white/10 rounded-2xl p-2 items-center focus-within:border-cyan-500/50 transition-colors">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text"
          placeholder="Search by genre, instrument, mood, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none text-white px-4 py-2 outline-none"
        />
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 border border-white/10">WAV</span>
          <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 border border-white/10">MIDI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_SAMPLES.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))).map(sample => (
          <div key={sample.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => setPlayingId(playingId === sample.id ? null : sample.id)}
                  className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-black transition-all"
                >
                  {playingId === sample.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                <div>
                  <h3 className="font-bold text-white text-lg line-clamp-1">{sample.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{sample.author}</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-bold border border-purple-500/30">
                {sample.type}
              </div>
            </div>
            
            <div className="flex items-end justify-between mt-2">
              <div className="flex flex-wrap gap-2">
                {sample.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded-md text-gray-300">
                    <Tags className="w-3 h-3" /> {tag}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded-md text-gray-300">
                    <Music className="w-3 h-3" /> {sample.bpm} BPM
                </span>
              </div>
              
              <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors shrink-0" title="Download Sample (Royalty Free)">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
