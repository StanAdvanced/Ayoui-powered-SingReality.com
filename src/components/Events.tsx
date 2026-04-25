import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, MapPin, Users, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

const events = [
  {
    id: 1,
    title: "Neon Singularity Live",
    date: "April 15, 2026",
    location: "AmazeVR Cinematic Arena (Global)",
    attendees: "2.4M Registered",
    price: 15,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Quantum Echoes World Tour",
    date: "May 1, 2026",
    location: "Decentraland Festival Grounds",
    attendees: "1.1M Registered",
    price: 10,
    image: "https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?q=80&w=2074&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Holographic Harmony",
    date: "June 21, 2026",
    location: "Proto Hologram Spaces (Select Cities)",
    attendees: "500K Registered",
    price: 25,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Events() {
  const { currency } = useStore();
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto pt-24">
      <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to SingReality
      </Link>
      
      <div className="mb-12">
        <h1 className="text-5xl font-display font-black tracking-tighter mb-4">IMMERSIVE <span className="text-gradient">ARENAS</span></h1>
        <p className="text-xl text-gray-400 max-w-2xl">Book your tickets for the most advanced 8K cinematic and holographic concerts on the planet.</p>
      </div>

      <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 snap-x snap-mandatory hide-scrollbar">
        {events.map(event => (
          <div key={event.id} className="glass rounded-3xl overflow-hidden group min-w-[300px] md:min-w-0 snap-center">
            <div className="relative h-48 overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                {event.date}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-singularity" /> {event.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-quantum" /> {event.attendees}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xl font-mono font-bold text-reality">{event.price} {currency}</span>
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                  <Ticket className="w-4 h-4" /> GET TICKET
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
