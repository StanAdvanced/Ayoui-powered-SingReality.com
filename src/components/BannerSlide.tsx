import { motion } from 'framer-motion';

export function BannerSlide() {
  const words = ["SINGREALITY", "A.I.", "GLOBAL", "NEXUS", "AVATAR", "SYNTHESIS", "REVOLUTION", "SOUNDSCAPES"];
  
  return (
    <div className="w-full overflow-hidden bg-singularity/10 border-y border-singularity/20 py-3 whitespace-nowrap absolute top-0 z-50">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
        className="inline-flex items-center gap-8 px-4"
      >
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <span key={i} className="text-xl font-heading font-black text-white/50 tracking-[0.2em] uppercase">
            {word} <span className="text-singularity ml-8">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
