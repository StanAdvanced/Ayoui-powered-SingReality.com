import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export function WaitlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { playSuccess, playClick } = useSound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      playSuccess();
      setSubmitted(true);
      // In a real app, you'd send this to a backend
      console.log('Waitlist signup:', email);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass rounded-[2.5rem] border border-white/10 p-12 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {!submitted ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-singularity/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-singularity/30">
                  <Sparkles className="w-10 h-10 text-singularity" />
                </div>
                <h2 className="text-4xl font-display font-black tracking-tighter mb-4 uppercase">
                  Join the <span className="text-gradient">Waitlist</span>
                </h2>
                <p className="text-gray-400 mb-10 leading-relaxed">
                  Be the first to experience the quantum singularity of music. Early access members get exclusive NFT drops and lifetime Resonance bonuses.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-singularity transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={playClick}
                    className="w-full py-4 bg-white text-black rounded-2xl font-bold tracking-widest uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                  >
                    Activate Access <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-6">
                  Zero spam. Only quantum updates.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-display font-black tracking-tighter mb-4 uppercase">
                  You're <span className="text-green-500">In.</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Welcome to the revolution. We've sent a confirmation to <span className="text-white font-bold">{email}</span>.
                </p>
                <button
                  onClick={onClose}
                  className="px-10 py-4 glass rounded-2xl font-bold tracking-widest uppercase hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
