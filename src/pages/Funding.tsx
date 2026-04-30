import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, TrendingUp, HandCoins, ArrowRight, Share2, Globe, Zap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { CreateCampaignModal } from '../components/CreateCampaignModal';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { GoogleMapBackground } from '../components/GoogleMapBackground';

const CAMPAIGNS = [
  {
    id: 1,
    title: "The First Quantum-Holographic Album",
    creator: "Nova Echo",
    goal: 50000,
    raised: 32450,
    backers: "1,240",
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a7?q=80&w=800&auto=format&fit=crop",
    category: "Album Production",
    roi: "15% Est."
  },
  {
    id: 6,
    title: "Global Karaoke Duet Anthology",
    creator: "Smule Collective",
    goal: 30000,
    raised: 28000,
    backers: "3,100",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
    category: "Community Duets",
    roi: "Exclusive Duet Access"
  },
  {
    id: 2,
    title: "Global Singularity World Tour",
    creator: "Vocalis AI",
    goal: 100000,
    raised: 12000,
    backers: "450",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    category: "Live Events",
    roi: "22% Est."
  },
  {
    id: 3,
    title: "OpenTune Weighted Weights Registry",
    creator: "SonicCommons DAO",
    goal: 500000,
    raised: 420000,
    backers: "12,400",
    image: "https://images.unsplash.com/photo-1558494949-ef8b56821fa1?q=80&w=800&auto=format&fit=crop",
    category: "Public Infrastructure",
    roi: "Community Owned"
  },
  {
    id: 4,
    title: "Polyphony P2P Render Farm",
    creator: "Nodal Systems",
    goal: 200000,
    raised: 185000,
    backers: "5,100",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    category: "Cloud Compute",
    roi: "Token Utility"
  },
  {
    id: 5,
    title: "Neural VST Open Source Library",
    creator: "SynthLabs",
    goal: 25000,
    raised: 24800,
    backers: "890",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    category: "Software",
    roi: "N/A (Open Source)"
  }
];

export function Funding() {
  const { user, currency } = useStore();
  const [showModal, setShowModal] = useState(false);

  const handleCreateCampaign = async (data: any) => {
    if (!user) return;
    await addDoc(collection(db, 'campaigns'), {
      ...data,
      creatorId: user.uid,
      createdAt: serverTimestamp(),
      raised: 0,
      backers: 0
    });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen relative">
      <GoogleMapBackground />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {showModal && <CreateCampaignModal onClose={() => setShowModal(false)} onCreate={handleCreateCampaign} />}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 text-singularity font-bold uppercase tracking-widest text-[10px] mb-4">
            <Globe className="w-3 h-3" /> 195 Countries Connected
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6 uppercase">
            CROWD <span className="text-gradient">FUNDING</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Empower the next generation of musical pioneers. Support groundbreaking AI-driven projects 
            and earn exclusive rewards, NFT royalties, and early access.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 glass rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
            My Backings
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3"
          >
            <HandCoins className="w-4 h-4" /> Start Campaign
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-8 -mx-6 px-6 lg:grid lg:grid-cols-3 gap-8 snap-x snap-mandatory hide-scrollbar">
        {CAMPAIGNS.map((campaign, i) => {
          const progress = (campaign.raised / campaign.goal) * 100;
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-[3rem] overflow-hidden group border border-white/5 hover:border-white/20 transition-all min-w-[320px] lg:min-w-0 snap-center"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={campaign.image} 
                  alt={campaign.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 px-4 py-2 glass rounded-full text-[10px] font-mono uppercase tracking-widest border border-white/10">
                  {campaign.category}
                </div>
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-quantum uppercase tracking-widest border border-quantum/30">
                  ROI: {campaign.roi}
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-2 leading-tight">{campaign.title}</h3>
                <p className="text-sm text-gray-500 mb-8 font-mono uppercase tracking-widest">by {campaign.creator}</p>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Raised: <span className="text-singularity">{campaign.raised.toLocaleString()} {currency}</span></span>
                    <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Goal: {campaign.goal.toLocaleString()} {currency}</span>
                  </div>
                  <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden p-[2px] border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-singularity to-quantum rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-quantum" /> <span className="font-bold text-white">{campaign.backers}</span> Backers
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-reality" /> <span className="font-bold text-white">{Math.round(progress)}%</span> Funded
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex-1 py-5 bg-white text-black rounded-2xl font-bold text-xs tracking-widest uppercase hover:scale-105 transition-all">
                    Back Project
                  </button>
                  <button className="p-5 glass rounded-2xl hover:bg-white/10 transition-all border border-white/10">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Creator */}
      <section className="mt-32 glass-card rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 overflow-hidden relative border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-l from-singularity/50 to-transparent blur-[120px]" />
        </div>
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 text-singularity font-bold uppercase tracking-widest text-[10px] mb-8">
            <Zap className="w-4 h-4" /> Featured Creator Spotlight
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-10 leading-[0.85]">
            THE <span className="text-gradient">FUTURE</span> OF INDIE MUSIC
          </h2>
          <p className="text-2xl text-gray-400 mb-12 leading-relaxed font-light italic">
            "SingReality has completely changed how I fund my world tours. My fans aren't just listeners; 
            they're stakeholders in my creative journey."
          </p>
          <div className="flex items-center gap-6">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
              alt="Creator" 
              className="w-20 h-20 rounded-3xl object-cover border-2 border-singularity shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-bold text-2xl">Aria Quantum</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">Global Holographic Artist • Sydney</div>
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="aspect-square rounded-[3.5rem] overflow-hidden glass-card border-none relative group">
            <img 
              src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop" 
              alt="Performance" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Verified Creator</span>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
