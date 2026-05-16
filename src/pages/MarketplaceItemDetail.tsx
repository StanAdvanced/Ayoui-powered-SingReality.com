import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, ShoppingCart, Zap, TrendingUp, Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { analyzeAcousticFeatures } from '../services/acousticAnalytics';
import { useStore } from '../store/useStore';
import { YouTubeBackground } from '../components/YouTubeBackground';
import { narrationEngine } from '../services/narrationEngine';
import { UserAvatar } from '../components/UserAvatar';

export function MarketplaceItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, currency, setIsCartOpen } = useStore();
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // In a real app, fetch item details by ID
  const item = { 
    id: id || '1', 
    title: "Cyberpunk Bass Engine", 
    artistName: "Stanley Phani",
    albumName: "Quantum Echoes",
    releaseYear: "2026",
    price: 45, 
    description: "High-fidelity neural VST clone with advanced spectral synthesis and biometric feedback integration.",
    category: "Neural VST",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
    youtubeId: "XpS_6-O9_3s"
  };
  
  const metrics = analyzeAcousticFeatures(item);

  useEffect(() => {
    // Audit: Autonomous narration for item details
    const narrationText = `Viewing ${item.title} by ${item.artistName}. This ${item.category} features ${item.description} It has a success probability of ${metrics.successProbability} percent.`;
    narrationEngine.narrate(narrationText, true);

    return () => narrationEngine.stop();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleBuyNow = () => {
    addToCart({ id: item.id, title: item.title, price: item.price, image: item.image });
    setIsCartOpen(true);
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
    event.target.setVolume(volume);
  };

  const togglePlayback = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    if (playerRef.current) {
      playerRef.current.setVolume(vol);
      if (vol > 0) setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative">
      <YouTubeBackground videoId={item.youtubeId} opacity={0.1} />
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col">
            <div className="mb-6">
              <span className="px-3 py-1 bg-singularity/20 text-singularity text-[10px] font-bold uppercase tracking-widest rounded-full border border-singularity/30">
                {item.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-8 tracking-tight">{item.title}</h1>
            
            {/* World-Class Seller Profile Block */}
            <div className="flex items-center gap-5 mb-8 p-6 glass rounded-3xl border border-white/5 shadow-2xl bg-gradient-to-r from-black/60 to-transparent">
              <UserAvatar 
                user={{ displayName: item.artistName, uid: item.artistName, id: item.artistName }} 
                size="lg" 
                role="seller" 
                showActivityRing={true} 
              />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl font-bold text-white tracking-wider uppercase">{item.artistName}</span>
                  <div className="px-2 py-0.5 bg-[#FFD700]/10 text-[#FFD700] rounded-md text-[9px] font-black uppercase tracking-widest border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.15)] flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> Elite Seller
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-mono tracking-wide">{item.albumName} <span className="mx-2 text-white/20">•</span> {item.releaseYear}</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed text-lg font-light">{item.description}</p>
            
            {/* Acoustic Success Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass p-4 rounded-xl text-center border border-white/5 shadow-xl hover:bg-white/10 transition-all group/metric">
                <Music className="w-5 h-5 mx-auto mb-2 text-singularity group-hover/metric:scale-110 transition-transform" />
                <div className="text-xl font-bold text-white">{metrics.vocalRangeOctaves}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-tighter font-medium">Octaves</div>
              </div>
              <div className="glass p-4 rounded-xl text-center border border-white/5 shadow-xl hover:bg-white/10 transition-all group/metric">
                <Zap className="w-5 h-5 mx-auto mb-2 text-quantum group-hover/metric:scale-110 transition-transform" />
                <div className="text-xl font-bold text-white">{metrics.dynamicClimaxScore}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-tighter font-medium">Climax</div>
              </div>
              <div className="glass p-4 rounded-xl text-center border border-white/5 shadow-xl hover:bg-white/10 transition-all group/metric">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-reality group-hover/metric:scale-110 transition-transform" />
                <div className="text-xl font-bold text-white">{metrics.successProbability}%</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-tighter font-medium">Success</div>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart({ id: item.id, title: item.title, price: item.price, image: item.image })}
                  className="flex-1 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button className="p-4 glass rounded-xl hover:bg-white/10 transition-colors border border-white/5"><Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" /></button>
                <button className="p-4 glass rounded-xl hover:bg-white/10 transition-colors border border-white/5"><Share2 className="w-5 h-5 text-gray-400 hover:text-singularity transition-colors" /></button>
              </div>
              
              <button 
                onClick={handleBuyNow}
                className="w-full px-8 py-4 bg-gradient-to-r from-singularity to-quantum text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                <Zap className="w-5 h-5 fill-black" /> Buy Now - {currency} {item.price}
              </button>
              
              {/* Payment Ecosystem Injection */}
              <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-6 glass rounded-2xl border border-white/5 opacity-40 hover:opacity-100 transition-all">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 w-full text-center mb-1">Global Secure Checkout</div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3 md:h-4 brightness-200" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 md:h-4 brightness-200" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Afterpay_logo.svg" alt="Afterpay" className="h-3 md:h-4 brightness-200" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-3 md:h-4 brightness-200" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Alipay_logo.svg" alt="Alipay" className="h-3 md:h-4 brightness-200" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="glass p-4 rounded-[2.5rem] border border-white/10 shadow-2xl relative group overflow-hidden">
              <div className="aspect-video rounded-[2rem] overflow-hidden relative mb-6">
                <YouTube
                  videoId={item.youtubeId}
                  onReady={onPlayerReady}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  opts={{
                    playerVars: {
                      autoplay: 0,
                      controls: 0,
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                    },
                  }}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              </div>

              {/* Custom Player Controls */}
              <div className="space-y-6 px-2">
                {/* Seek Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-singularity"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={togglePlayback}
                      className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                    </button>
                    
                    <div className="flex items-center gap-3 group/volume">
                      <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-quantum"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-singularity animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Preview</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-singularity/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                <div className="w-1 h-1 bg-singularity rounded-full animate-pulse" />
                Neural Stem Preview
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Vocal Stem", quality: "Lossless AI", duration: "0:45" },
                  { name: "Bass Engine", quality: "Neural 32-bit", duration: "1:12" },
                  { name: "Atmosphere", quality: "Quantum Spatial", duration: "0:58" }
                ].map((stem, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-singularity/10 transition-colors shadow-inner">
                      <Music className="w-5 h-5 text-gray-500 group-hover:text-singularity transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white group-hover:text-singularity transition-colors">{stem.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stem.quality}</div>
                    </div>
                    <div className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">{stem.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
