import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Globe, ArrowRight, Play, Star } from 'lucide-react';

export function PromoBanners() {
  return (
    <div className="w-full space-y-12">
      {/* Hollywood Style Hero Banner */}
      <div className="relative h-[600px] w-full rounded-[4rem] overflow-hidden group shadow-2xl">
         {/* Background Visual Layer */}
         <div className="absolute inset-0 bg-[#050505]">
            <img 
              src="https://images.unsplash.com/photo-1514525253361-bee8a187449b?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 transition-transform duration-1000"
              alt="Concert Experience"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,240,255,0.15)_0%,transparent_50%)]" />
         </div>

         {/* Content Layer */}
         <div className="relative z-10 h-full flex flex-col justify-center px-16 max-w-4xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
               <span className="px-3 py-1 bg-singularity text-black text-[9px] font-black uppercase tracking-widest rounded-md">LIVE EVENT</span>
               <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">SEASON 04 PREMIERE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl font-display font-black italic text-white tracking-tighter leading-none"
            >
              WITNESS THE <br />
              <span className="text-gradient">SINGULARITY</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 font-medium max-w-lg leading-relaxed"
            >
              Experience the world's first global 9D holographic broadcast. Real-time neural sync enabled for all SingReality VIP members.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6"
            >
               <button className="px-10 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-singularity transition-all hover:scale-110 flex items-center gap-3">
                  Join Premiere <Play className="w-4 h-4 fill-current" />
               </button>
               <button className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group">
                  View Schedule <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </motion.div>
         </div>

         {/* Cinematic Bars Overlay */}
         <div className="absolute top-0 left-0 right-0 h-1 bg-singularity/20 blur-sm" />
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-quantum/20 blur-sm" />
      </div>

      {/* Grid of Secondary Promos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { title: "Neuro-Sync v4", desc: "60FPS Neural Rendering Interface", icon: Zap, color: "text-singularity", bg: "bg-singularity/5" },
           { title: "Global Nodes", desc: "Connect with 12M+ virtual nodes", icon: Globe, color: "text-quantum", bg: "bg-quantum/5" },
           { title: "Frontier Vision", desc: "9D Grounding Reality Shift", icon: Sparkles, color: "text-reality", bg: "bg-reality/5" }
         ].map((promo, i) => (
           <motion.div 
             key={promo.title}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={`p-10 rounded-[3rem] border border-white/5 ${promo.bg} group cursor-pointer hover:border-white/10 transition-all`}
           >
              <div className="mb-6 p-4 rounded-2xl bg-black border border-white/10 w-fit group-hover:scale-110 group-hover:rotate-6 transition-all">
                 <promo.icon className={`w-6 h-6 ${promo.color}`} />
              </div>
              <h3 className="text-xl font-display font-black text-white italic tracking-tighter mb-2">{promo.title}</h3>
              <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">{promo.desc}</p>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
