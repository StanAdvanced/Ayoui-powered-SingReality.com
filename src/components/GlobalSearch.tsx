import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, Globe, Mic2, Tv, Map, ShoppingBag, User, Settings, Sparkles, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import { useStore } from '../store/useStore';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category: 'Pages' | 'Features' | 'Social';
}

const SEARCHABLE_ITEMS: SearchResult[] = [
  { id: 'nexus', title: 'Nexus Home', description: 'The quantum singularity of music.', path: '/', icon: <Globe className="w-4 h-4" />, category: 'Pages' },
  { id: 'studio', title: 'Khoral-Flow Studio', description: 'Create, dance, and sing with AI.', path: '/studio', icon: <Mic2 className="w-4 h-4" />, category: 'Pages' },
  { id: 'clones', title: 'Neural Clones', description: 'Manage your AI avatars.', path: '/clones', icon: <User className="w-4 h-4" />, category: 'Pages' },
  { id: 'marketplace', title: 'Marketplace', description: 'Trade unique musical assets.', path: '/marketplace', icon: <ShoppingBag className="w-4 h-4" />, category: 'Pages' },
  { id: 'arenas', title: 'Virtual Arenas', description: 'Live performance and dance zones.', path: '/arenas', icon: <Map className="w-4 h-4" />, category: 'Pages' },
  { id: 'karaoke', title: 'Karaoke Arena', description: 'Global synchronized singing.', path: '/karaoke-arena', icon: <Mic2 className="w-4 h-4" />, category: 'Pages' },
  { id: 'global-map', title: 'Global Map', description: 'Visualize the quantum singularity.', path: '/global-map', icon: <Map className="w-4 h-4" />, category: 'Pages' },
  { id: 'tv', title: 'SingReality TV', description: 'Immersive media and streaming.', path: '/tv', icon: <Tv className="w-4 h-4" />, category: 'Pages' },
  { id: 'quantum-lab', title: 'Quantum Lab', description: 'Advanced AI experimental tools.', path: '/quantum-lab', icon: <Sparkles className="w-4 h-4" />, category: 'Features' },
  { id: 'ai-studio', title: 'AI Song Studio', description: 'Deep neural music generation.', path: '/ai-studio', icon: <Music className="w-4 h-4" />, category: 'Features' },
  { id: 'profile', title: 'User Profile', description: 'Manage your identity and resonance.', path: '/profile', icon: <User className="w-4 h-4" />, category: 'Social' },
  { id: 'funding', title: 'Impact Funding', description: 'Support the nexus evolution.', path: '/funding', icon: <Settings className="w-4 h-4" />, category: 'Features' },
];

export function GlobalSearch() {
  const { isSearchOpen: isOpen, setIsSearchOpen: setIsOpen } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { playClick } = useSound();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredResults = SEARCHABLE_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (result: SearchResult) => {
    playClick();
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      handleSelect(filteredResults[selectedIndex]);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => { playClick(); setIsOpen(true); }}
        className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:bg-white/10 hover:border-singularity/50 transition-all group"
      >
        <Search className="w-4 h-4 group-hover:text-singularity transition-colors" />
        <span className="text-xs font-medium tracking-widest hidden lg:block">SEARCH THE NEXUS...</span>
        <div className="flex items-center gap-1 ml-4 py-0.5 px-1.5 bg-black/50 border border-white/10 rounded text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
          <Command className="w-2 h-2" /> K
        </div>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-singularity/10"
            >
              {/* Search Input */}
              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <Search className="w-6 h-6 text-singularity" />
                <input 
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search across SingReality dimensions..."
                  className="w-full bg-transparent border-none outline-none text-lg font-display placeholder:text-gray-600"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Results Area */}
              <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden p-2">
                {filteredResults.length > 0 ? (
                  <div className="py-2">
                    {/* Group by category */}
                    {['Pages', 'Features', 'Social'].map(category => {
                      const categoryItems = filteredResults.filter(item => item.category === category);
                      if (categoryItems.length === 0) return null;
                      
                      return (
                        <div key={category} className="mb-4 last:mb-0">
                          <div className="px-4 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            {category}
                          </div>
                          {categoryItems.map((item, idx) => {
                            const actualIdx = filteredResults.indexOf(item);
                            const isActive = actualIdx === selectedIndex;
                            
                            return (
                              <button 
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setSelectedIndex(actualIdx)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${isActive ? 'bg-singularity/10 border-white/10 translate-x-1' : 'hover:bg-white/5 border-transparent'}`}
                                style={{ border: '1px solid transparent' }}
                              >
                                <div className={`p-3 rounded-xl ${isActive ? 'bg-singularity text-black' : 'bg-white/5 text-gray-400'} transition-colors`}>
                                  {item.icon}
                                </div>
                                <div>
                                  <div className={`font-bold tracking-tight ${isActive ? 'text-white' : 'text-gray-200'}`}>
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-gray-500 line-clamp-1">
                                    {item.description}
                                  </div>
                                </div>
                                {isActive && (
                                  <motion.div 
                                    layoutId="search-arrow"
                                    className="ml-auto text-singularity"
                                  >
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                  </motion.div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                    <Search className="w-12 h-12 mb-4" />
                    <p className="text-sm font-mono uppercase tracking-widest">No dimensional matches found</p>
                    <p className="text-xs mt-2">Try searching for Studio, Arenas, or Marketplace</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center px-6">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded flex items-center justify-center min-w-[20px]">↵</kbd>
                    <span>SELECT</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded flex items-center justify-center min-w-[20px]">↑↓</kbd>
                    <span>NAVIGATE</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-singularity/50 uppercase tracking-widest">
                  Quantum Search v4.0
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
