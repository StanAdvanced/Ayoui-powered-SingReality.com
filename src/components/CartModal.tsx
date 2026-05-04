import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, CreditCard, Smartphone, CheckCircle, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import * as Tone from 'tone';

export function CartModal() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, clearCart, currency } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Audio pathways
  const synthRef = useRef<Tone.PolySynth | null>(null);
  
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.MembraneSynth).toDestination();
    
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const playSuccessSound = () => {
    if (Tone.context.state !== 'running') Tone.start();
    synthRef.current?.triggerAttackRelease(["C4", "E4", "G4", "C5"], "4n");
  };

  const playRemoveSound = () => {
    if (Tone.context.state !== 'running') Tone.start();
    synthRef.current?.triggerAttackRelease("C3", "8n");
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate payment processing with "structural corridors"
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      playSuccessSound();
      setTimeout(() => {
        setCheckoutSuccess(false);
        clearCart();
        setIsCartOpen(false);
      }, 4000);
    }, 2500);
  };

  const handleRemove = (id: string) => {
    playRemoveSound();
    removeFromCart(id);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-all duration-500"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 shadow-[0_0_50px_rgba(208,255,0,0.1)] z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-singularity/10 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-singularity/10 rounded-lg border border-singularity/20">
                  <ShoppingCart className="w-6 h-6 text-singularity" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold tracking-widest text-white">NEXUS VAULT</h2>
                  <p className="text-xs font-mono text-singularity opacity-70">Secured Crypto-Chamber</p>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-gray-500 gap-4"
                >
                  <Activity className="w-16 h-16 opacity-30 text-singularity animate-pulse" />
                  <p className="font-mono text-sm uppercase tracking-widest text-center">No structural pathways<br/>detected in vault.</p>
                </motion.div>
              ) : checkoutSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-green-400 gap-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 relative"
                  >
                    <div className="absolute inset-0 rounded-full border border-green-400 animate-ping opacity-20" />
                    <CheckCircle className="w-12 h-12" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold font-display tracking-wider text-white">NEURAL LINK ESTABLISHED</h3>
                    <p className="text-sm text-gray-400 font-mono">Assets securely transferred across the blockchain to your personal node.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-singularity/30 transition-colors group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-singularity transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                        <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-white text-sm md:text-base leading-tight pr-8">{item.title}</h3>
                            <p className="text-xs text-singularity font-mono mt-1 flex items-center gap-1">
                              <Activity className="w-3 h-3" /> Core x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-white font-bold tracking-tight">
                              {currency}{item.price.toLocaleString()}
                            </span>
                            <button 
                              onClick={() => handleRemove(item.id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cartItems.length > 0 && !checkoutSuccess && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 border-t border-white/10 bg-black relative"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-singularity/50 to-transparent" />
                
                <div className="flex justify-between items-end mb-6">
                  <div className="space-y-1">
                    <span className="text-gray-500 font-mono uppercase tracking-widest text-xs block">Estimated Energy</span>
                    <span className="text-sm font-mono text-gray-400">Gas Fees: Calculated</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 font-mono text-xs uppercase tracking-widest block mb-1">Total Payload</span>
                    <span className="text-3xl font-bold font-mono text-singularity">
                      {currency}{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 bg-singularity text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(208,255,0,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none relative overflow-hidden"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center gap-2">
                        <Activity className="w-5 h-5 animate-spin" /> SYNCHRONIZING PATHWAYS...
                      </span>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full hover:animate-[shimmer_1s_infinite]" />
                        <CreditCard className="w-5 h-5" /> INITIATE SECURE TRANSFER
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-3 bg-[#003087] text-white font-bold rounded-xl hover:bg-[#002060] transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      PayPal
                    </button>
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Smartphone className="w-4 h-4" /> Nexus Pay
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center gap-6 opacity-30 filter grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 object-contain invert" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 object-contain" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-5 object-contain" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5 object-contain invert" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
