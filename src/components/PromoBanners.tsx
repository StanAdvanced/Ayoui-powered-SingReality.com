import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Trophy, Flame, ChevronRight, Zap } from 'lucide-react';

const PROMOS = [
  {
    title: "DJ-VERSE EXCLUSIVE",
    desc: "Unlock the Ultra-Rare Anyma-inspired mixing kit for your next global arena performance.",
    color: "from-purple-600 to-blue-600",
    icon: Zap,
    link: "/marketplace",
    cta: "Activate Now"
  },
  {
    title: "ARENA PASS: PRO",
    desc: "100% royalty-free tracks and exclusive master templates for global dominance.",
    color: "from-orange-600 to-red-600",
    icon: Flame,
    link: "/funding",
    cta: "Join Pro"
  },
  {
    title: "QUANTUM SINGULARITY",
    desc: "The world tour is here. Deploy your neural clone and monetize your talent 24/7.",
    color: "from-singularity to-quantum",
    icon: Trophy,
    link: "/neural-clones",
    cta: "Deploy Now"
  }
];

export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full py-24 px-4 max-w-7xl mx-auto">
      {PROMOS.map((promo, i) => (
        <motion.div
          key={i}
          className="relative group p-10 rounded-[3.5rem] bg-zinc-950 border border-white/5 overflow-hidden flex flex-col justify-between h-[420px] shadow-2xl transition-all hover:border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -15 }}
        >
          {/* Animated Background Gradients */}
          <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700`} />
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-white/5 blur-[120px] rounded-full group-hover:bg-white/10 transition-colors" />

          <div className="relative z-10">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${promo.color} flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
            >
              <promo.icon className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-singularity transition-all duration-300 uppercase">
              {promo.title}
            </h3>
            
            <p className="text-white/40 text-base leading-relaxed font-medium group-hover:text-white/70 transition-colors">
              {promo.desc}
            </p>
          </div>

          <Link 
            to={promo.link}
            className="relative z-10 flex items-center justify-between py-6 px-10 bg-white/5 hover:bg-white text-white hover:text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-300 border border-white/10"
          >
            {promo.cta}
            <ChevronRight className="w-6 h-6" />
          </Link>
          
          {/* Hover Glow Effect */}
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${promo.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
        </motion.div>
      ))}
    </div>
  );
}
