import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Ticket, Mic2, Globe, Zap, Play, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GoogleMapBackground } from '../components/GoogleMapBackground';
import { YouTubeBackground } from '../components/YouTubeBackground';
import { PromoBanners } from '../components/PromoBanners';

export function Arenas() {
  const navigate = useNavigate();
  const { currency } = useStore();
  const events = [
    {
      id: 1,
      title: "Neon Singularity Live",
      date: "April 15, 2026",
      location: "AmazeVR Cinematic Arena (Global)",
      attendees: "2.4M Registered",
      price: 15,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
      status: "Live",
      videoId: "jfKfPfyJRdk"
    },
    {
      id: 2,
      title: "Quantum Echoes World Tour",
      date: "May 1, 2026",
      location: "Decentraland Festival Grounds",
      attendees: "1.1M Registered",
      price: 10,
      image: "https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?q=80&w=2074&auto=format&fit=crop",
      status: "Upcoming",
      videoId: "5qap5aO4i9A"
    },
    {
      id: 3,
      title: "Holographic Harmony",
      date: "June 21, 2026",
      location: "Proto Hologram Spaces (Select Cities)",
      attendees: "500K Registered",
      price: 25,
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
      status: "Upcoming",
      videoId: "DWcJFNfaw9c"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <GoogleMapBackground />
      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden mb-24 glass-card border-none p-12 md:p-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop" 
            alt="Arena Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] font-bold uppercase tracking-widest mb-8 animate-pulse">
            <Radio className="w-3 h-3" /> Live Global Sing-a-long
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-8 leading-[0.85]">
            THE WORLD IS <span className="text-gradient">YOUR STAGE</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Join millions in real-time virtual harmony. Our quantum-optimized arenas support 
            zero-latency duets across 195 countries, translated into 100+ languages.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/live-arena')}
              className="px-10 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center gap-3"
            >
              <Mic2 className="w-5 h-5" /> Join Live Arena
            </button>
            <button 
              onClick={() => navigate('/global-map')}
              className="px-10 py-5 glass rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <Globe className="w-5 h-5" /> View Global Map
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Upcoming <span className="text-gradient">Experiences</span></h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">All</button>
          <button className="px-4 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Holographic</button>
          <button className="px-4 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">VR/AR</button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 snap-x snap-mandatory hide-scrollbar">
        {events.map((event, i) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[2.5rem] overflow-hidden group border border-white/5 hover:border-white/20 transition-all min-w-[300px] md:min-w-0 snap-center"
          >
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <YouTubeBackground videoId={event.videoId} opacity={0.4} />
              </div>
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10 opacity-50" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold border border-white/10 uppercase tracking-widest z-20">
                {event.date}
              </div>
              {event.status === 'Live' && (
                <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse z-20">
                  Live
                </div>
              )}
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-singularity/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-singularity" />
                  </div>
                  {event.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-8 h-8 rounded-lg bg-quantum/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-quantum" />
                  </div>
                  {event.attendees}
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-2xl font-mono font-bold text-reality">{event.price} {currency}</span>
                <button className="bg-white text-black px-8 py-4 rounded-xl font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2 uppercase tracking-widest">
                  <Ticket className="w-4 h-4" /> Get Ticket
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24">
        <PromoBanners />
      </div>
    </div>
  );
}
