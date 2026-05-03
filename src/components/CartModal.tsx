import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, CreditCard, Smartphone } from 'lucide-react';
import { useStore } from '../store/useStore';

export function CartModal() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, clearCart, currency } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        clearCart();
        setIsCartOpen(false);
      }, 3000);
    }, 2000);
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-card border-l border-white/10 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-singularity" />
                <h2 className="text-xl font-display font-bold tracking-widest">Your Cart</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingCart className="w-12 h-12 opacity-20" />
                  <p className="font-mono text-sm uppercase tracking-widest">Your cart is empty</p>
                </div>
              ) : checkoutSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-green-400 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Payment Successful!</h3>
                  <p className="text-sm text-gray-400 text-center">Your assets have been securely transferred to your vault.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="text-sm text-gray-400 font-mono">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-singularity font-bold">
                            {currency} {item.price.toLocaleString()}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && !checkoutSuccess && (
              <div className="p-6 border-t border-white/10 bg-black/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-mono uppercase tracking-widest text-sm">Total</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {currency} {total.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 bg-singularity text-black font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isCheckingOut ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" /> Checkout with Stripe
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-3 bg-[#003087] text-white font-bold rounded-xl hover:bg-[#002060] transition-colors flex items-center justify-center gap-2"
                    >
                      PayPal
                    </button>
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" /> Pay
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center gap-4 opacity-50">
                  {/* Payment Logos */}
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 object-contain invert" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 object-contain" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-5 object-contain" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5 object-contain invert" />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
