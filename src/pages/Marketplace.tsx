import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Tag, Download, Play, Heart, Share2, Mic2, Layers, Zap, Cpu, TrendingUp, Star, Globe, Database, Network, Search, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { YouTubeSearch } from '../components/marketplace/YouTubeSearch';
import { CinematicBackscreen } from '../components/CinematicBackscreen';
import { UserAvatar } from '../components/UserAvatar';
import { PromoBanners } from '../components/PromoBanners';

const ASSETS = [
  {
    id: 17,
    title: "DJ-VERSE ANYMA PACK",
    creator: "DJ-VERSE",
    price: 99,
    image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800&auto=format&fit=crop",
    type: "Signature Kit",
    category: "Signature",
    genre: "Electronic",
    isPromoted: true
  },
  {
    id: 18,
    title: "TIESTO ARENA SFX",
    creator: "TIESTO",
    price: 75,
    image: "https://images.unsplash.com/photo-1470229722913-7c090b332da8?q=80&w=800&auto=format&fit=crop",
    type: "Stem Pack",
    category: "Signature",
    genre: "Electronic",
    isPromoted: true
  },
  {
    id: 19,
    title: "PRO ARENA MASTERCLASS",
    creator: "Singularity Academy",
    price: 150,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
    type: "Education",
    category: "Software",
    genre: "All"
  },
  {
    id: 20,
    title: "8K STREAMING LICENCE",
    creator: "NetworkX",
    price: 25,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    type: "License",
    category: "Software",
    genre: "All"
  },
  {
    id: 1,
    title: "Cyberpunk Bass Engine",
    creator: "NeuralSynth",
    price: 45,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
    type: "Neural VST",
    category: "Audio",
    genre: "Electronic"
  },
  {
    id: 2,
    title: "Ethereal Vocal DNA",
    creator: "Luna AI",
    price: 120,
    image: "https://images.unsplash.com/photo-1516280440502-a2fc994606cf?q=80&w=800&auto=format&fit=crop",
    type: "Vocal Identity",
    category: "Audio",
    genre: "Pop"
  },
  {
    id: 3,
    title: "8K Arena Reverb",
    creator: "SpatialLabs",
    price: 30,
    image: "https://images.unsplash.com/photo-1470229722913-7c090b332da8?q=80&w=800&auto=format&fit=crop",
    type: "Environment",
    category: "Audio",
    genre: "All"
  },
  {
    id: 4,
    title: "Quantum Drum Kit",
    creator: "BeatBot",
    price: 25,
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop",
    type: "Stem Pack",
    category: "Audio",
    genre: "Hip-Hop"
  },
  {
    id: 5,
    title: "Neon DJ Deck",
    creator: "3DForge",
    price: 15,
    image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800&auto=format&fit=crop",
    type: "3D Model",
    category: "Furniture",
    genre: "All"
  },
  {
    id: 6,
    title: "Stadium Stage Arch",
    creator: "Architex",
    price: 80,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
    type: "3D Model",
    category: "Architecture",
    genre: "All"
  },
  {
    id: 7,
    title: "Acoustic Guitar Pro",
    creator: "StringMaster",
    price: 55,
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop",
    type: "3D Model",
    category: "Instruments",
    genre: "Rock"
  },
  {
    id: 8,
    title: "Vinyl Record Texture",
    creator: "MatMaster",
    price: 10,
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=800&auto=format&fit=crop",
    type: "Texture",
    category: "Materials",
    genre: "All"
  },
  {
    id: 9,
    title: "Lo-Fi Beats Vol. 1",
    creator: "ChillVibes",
    price: 20,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    type: "Stem Pack",
    category: "Audio",
    genre: "Hip-Hop"
  },
  {
    id: 10,
    title: "Grand Piano 3D",
    creator: "Keys3D",
    price: 65,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop",
    type: "3D Model",
    category: "Instruments",
    genre: "Classical"
  },
  {
    id: 11,
    title: "Concert Crowd Noise",
    creator: "AtmosFX",
    price: 12,
    image: "https://images.unsplash.com/photo-1540039155732-d674d6e3f0be?q=80&w=800&auto=format&fit=crop",
    type: "Environment",
    category: "Audio",
    genre: "All"
  },
  {
    id: 12,
    title: "Vintage Mic Model",
    creator: "Retro3D",
    price: 25,
    image: "https://images.unsplash.com/photo-1520166012956-add9ba083586?q=80&w=800&auto=format&fit=crop",
    type: "3D Model",
    category: "Instruments",
    genre: "Pop"
  },
  {
    id: 13,
    title: "Synthwave Presets",
    creator: "NeonSound",
    price: 35,
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop",
    type: "Neural VST",
    category: "Audio",
    genre: "Electronic"
  },
  {
    id: 14,
    title: "Speaker Stack",
    creator: "BassDrop",
    price: 40,
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop",
    type: "3D Model",
    category: "Furniture",
    genre: "All"
  },
  {
    id: 15,
    title: "Gold Record Texture",
    creator: "BlingMats",
    price: 15,
    image: "https://images.unsplash.com/photo-1602722053020-af31042989d5?q=80&w=800&auto=format&fit=crop",
    type: "Texture",
    category: "Materials",
    genre: "All"
  },
  {
    id: 16,
    title: "Opera House Reverb",
    creator: "SpatialLabs",
    price: 45,
    image: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?q=80&w=800&auto=format&fit=crop",
    type: "Environment",
    category: "Audio",
    genre: "Classical"
  }
];

const CATEGORIES = ["All", "Audio", "Signature", "Software", "Instruments", "Furniture", "Architecture", "Materials"];
const GENRES = ["All", "Electronic", "Pop", "Hip-Hop", "Rock", "Classical"];

const BLUEPRINTS = [
  {
    id: 'voicevault',
    title: "VoiceVault",
    subtitle: "Ethical Vocal Identity Exchange",
    description: "License legendary Vocal DNA via high-fidelity RVC v5 models. Secure, legal, and royalty-synced.",
    icon: Mic2,
    color: "text-singularity",
    bg: "bg-singularity/10"
  },
  {
    id: 'stemforge',
    title: "StemForge",
    subtitle: "Generative Prompt-to-MultiTrack",
    description: "Generate fully editable MIDI and Audio stems that drop directly into your DAW. 24-bit WAV precision.",
    icon: Layers,
    color: "text-quantum",
    bg: "bg-quantum/10"
  },
  {
    id: 'opentune',
    title: "OpenTune",
    subtitle: "The Public Domain Model Registry",
    description: "The 'Hugging Face' for musical weights. Free 'Idea' API and 100% legal transparency for data training sets.",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-400/10"
  },
  {
    id: 'soniccommons',
    title: "SonicCommons",
    subtitle: "The Unsplash of Audio Stems",
    description: "Massive library of AI-generated, human-curated audio seeds. No royalties, no attribution required. Visual-Audio pairing enabled.",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    id: 'polyphony',
    title: "Polyphony P2P",
    subtitle: "Decentralized GPU Orchestration",
    description: "Community-powered computation. Rent your NPU for rewards and render massive musical projects with zero central server cost.",
    icon: Network,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    id: 'lyriclog',
    title: "LyricLog Open-Oracle",
    subtitle: "Multimodal Songwriting API",
    description: "Free songwriting reasoning engine. JSON schema outputs for chords, lyrics, and emotional mapping without API keys.",
    icon: PenTool,
    color: "text-orange-400",
    bg: "bg-orange-400/10"
  },
  {
    id: 'echopulse',
    title: "EchoPulse",
    subtitle: "Adaptive Music API",
    description: "Elastic music engines for games and VR. Real-time emotion mapping and zero-copyright strikes.",
    icon: Zap,
    color: "text-reality",
    bg: "bg-reality/10"
  },
  {
    id: 'synthgene',
    title: "SynthGene",
    subtitle: "Neural Sound Design",
    description: "Marketplace for Neural VSTs. Clones of vintage hardware captured through neural radiance fields.",
    icon: Cpu,
    color: "text-white",
    bg: "bg-white/10"
  }
];

export function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { currency } = useStore();
  const navigate = useNavigate();

  const filteredAssets = ASSETS.filter(asset => {
    const matchesCategory = activeCategory === "All" || asset.category === activeCategory;
    const matchesType = activeType === "All" || asset.type === activeType;
    const matchesGenre = activeGenre === "All" || asset.genre === activeGenre;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         asset.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen relative">
      <CinematicBackscreen opacity={0.5} pageType="marketplace" />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 uppercase">
            ASSET <span className="text-gradient">LIBRARY</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Download and import high-fidelity 3D models, textures, and neural audio assets for your virtual studio.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-6 py-4 glass rounded-2xl text-sm border border-white/10 focus:border-singularity outline-none transition-all w-64"
            />
          </div>
          <button className="px-8 py-4 bg-white text-black rounded-2xl text-sm font-bold hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest">
            <Tag className="w-4 h-4" /> List Asset
          </button>
        </div>
      </div>

      <YouTubeSearch />

      {/* Top Sellers Highlight */}
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFA500]">Elite Sellers</span>
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {Array.from(new Set(ASSETS.map(a => a.creator))).slice(0, 8).map((creator, i) => (
            <motion.div 
              key={creator}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 min-w-[100px] snap-center cursor-pointer group"
            >
              <UserAvatar user={{ displayName: creator, uid: creator }} size="lg" role="seller" showActivityRing={true} />
              <div className="text-center">
                <p className="text-xs font-bold text-white group-hover:text-[#FFD700] transition-colors">{creator}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories and Filters */}
      <div className="space-y-4 mb-12 mt-12 bg-black/20 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Structural Category</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-singularity text-black shadow-[0_0_15px_rgba(208,255,0,0.3)]' : 'glass hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-px w-full bg-white/5" />
        
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Asset Type</h3>
          <div className="flex flex-wrap gap-2">
            {["All", "Neural VST", "3D Model", "Texture", "Stem Pack", "Environment"].map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeType === type ? 'bg-quantum text-black shadow-[0_0_15px_rgba(0,224,255,0.3)]' : 'glass hover:bg-white/10'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />
        
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-bold">Music Genre</h3>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeGenre === genre ? 'bg-reality text-white shadow-[0_0_15px_rgba(255,0,122,0.3)]' : 'glass hover:bg-white/10'}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {BLUEPRINTS.map((bp) => (
          <motion.div
            key={bp.id}
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] group cursor-pointer border border-white/5 hover:border-white/20 transition-all"
          >
            <div className={`w-14 h-14 ${bp.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <bp.icon className={`w-7 h-7 ${bp.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{bp.title}</h3>
            <p className={`text-[10px] font-mono uppercase tracking-widest ${bp.color} mb-4`}>{bp.subtitle}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{bp.description}</p>
          </motion.div>
        ))}
      </div>

      <PromoBanners />

      {/* Trending Assets */}
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-singularity" /> Trending Neural Assets
        </h2>
        <button className="text-sm text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-24">
        {filteredAssets.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-[2rem] overflow-hidden group"
          >
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={asset.image} 
                alt={asset.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current" />
                </button>
                <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 glass rounded-full text-[10px] font-mono uppercase tracking-widest">
                {asset.type}
              </div>
            </div>
            <div className="p-6 cursor-pointer flex flex-col h-[200px]" onClick={() => navigate(`/marketplace/${asset.id}`)}>
              <h3 className="text-lg font-bold mb-3 group-hover:text-singularity transition-colors">{asset.title}</h3>
              <div className="flex items-center gap-3 mb-4">
                <UserAvatar user={{ displayName: asset.creator, uid: asset.creator, id: asset.creator }} size="sm" role="seller" showActivityRing={false} />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{asset.creator}</span>
              </div>
              <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
                <span className="text-xl font-mono font-bold text-singularity">{asset.price} {currency}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Add to wishlist */ }}
                    className="p-2 glass rounded-lg hover:bg-singularity hover:text-black transition-all"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      useStore.getState().addToCart({
                        id: asset.id.toString(),
                        title: asset.title,
                        price: asset.price,
                        image: asset.image
                      });
                    }}
                    className="p-2 glass rounded-lg hover:bg-singularity hover:text-black transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Section */}
      <section className="mt-24 relative rounded-[3rem] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1514525253361-bee8718a74a7?q=80&w=2000&auto=format&fit=crop" 
          alt="Featured" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 p-12 md:p-24 glass-card border-none">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-6">
              NEURAL <span className="text-gradient">VST CLONES</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the soul of vintage hardware. Our Neural VSTs are AI clones of legendary synthesizers, 
              captured through high-fidelity neural radiance fields.
            </p>
            <button 
              onClick={() => navigate('/clones')}
              className="px-10 py-5 bg-singularity text-black rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all"
            >
              EXPLORE CLONES
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
