import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, StopCircle, CreditCard, Coins } from 'lucide-react';
import * as Tone from 'tone';
import { useStore } from '../../store/useStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../firebase';

// Reusable Stripe Checkout Component
const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { clientSecret } = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500 }) // $5 for 50 credits
      }).then(res => res.json());

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <CardElement options={{
          style: {
            base: {
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': { color: '#888' }
            },
            invalid: { color: '#ff4444', iconColor: '#ff4444' }
          }
        }} />
      </div>
      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="px-6 py-3 bg-singularity text-black rounded-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay $5.00'}
      </button>
    </form>
  );
};

export function DescribeToCompose() {
  const [prompt, setPrompt] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [melody, setMelody] = useState<{ note: string; duration: string }[] | null>(null);
  const [showBilling, setShowBilling] = useState(false);
  
  const { credits, setCredits, user } = useStore();
  const COMPOSITION_COST = 10;
  
  // Create a stripe promise only if we have a key
  const [stripePromise] = useState(() => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock'));

  // Sync credits from firestore
  useEffect(() => {
    async function syncCredits() {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (typeof data.credits === 'number') {
            setCredits(data.credits);
          }
        }
      } catch (e) {
        console.error("Failed to sync credits", e);
      }
    }
    syncCredits();
  }, [user?.uid, setCredits]);

  const updateCreditsInFirestore = async (newAmount: number) => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, { credits: newAmount }, { merge: true });
      } else {
        await updateDoc(userRef, { credits: newAmount });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleCompose = async () => {
    if (credits < COMPOSITION_COST) {
      setShowBilling(true);
      return;
    }

    if (!prompt.trim()) return;

    setIsComposing(true);
    try {
      const res = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMelody(data.melody);
      
      const newCredits = credits - COMPOSITION_COST;
      setCredits(newCredits);
      await updateCreditsInFirestore(newCredits);

    } catch (error) {
      console.error(error);
      alert("Failed to compose melody. Please try again.");
    } finally {
      setIsComposing(false);
    }
  };

  const handlePlay = async () => {
    if (!melody) return;
    
    await Tone.start();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    
    setIsPlaying(true);
    
    let now = Tone.now();
    melody.forEach(({ note, duration }) => {
      synth.triggerAttackRelease(note, duration, now);
      now += Tone.Time(duration).toSeconds();
    });

    setTimeout(() => {
      setIsPlaying(false);
    }, (now - Tone.now()) * 1000);
  };

  const handlePaymentSuccess = async () => {
    const newCredits = credits + 50;
    setCredits(newCredits);
    await updateCreditsInFirestore(newCredits);
    
    setShowBilling(false);
    alert('Payment successful! Added 50 credits.');
  };

  return (
    <div className="glass p-8 rounded-[2rem] border border-singularity/30 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
        <Coins className="w-5 h-5 text-singularity" />
        <span className="font-mono font-bold">{credits} Credits</span>
        <button 
          onClick={() => setShowBilling(!showBilling)}
          className="ml-4 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Buy More
        </button>
      </div>

      <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 mt-4">
        <Sparkles className="w-6 h-6 text-singularity" />
        Describe-to-Compose
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Generate custom MIDI melodies using DeepSeek R1. Cost: {COMPOSITION_COST} credits.
      </p>

      {showBilling ? (
        <div className="bg-black/50 p-6 rounded-xl border border-white/5 mb-6">
          <h4 className="font-bold flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4 text-quantum" /> Load Credits</h4>
          <p className="text-xs text-gray-400 mb-4">Get 50 Credits for $5.00 via Stripe.</p>
          <Elements stripe={stripePromise}>
             <CheckoutForm onSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cyberpunk synthwave lead that sounds mysterious and fast..."
            className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-singularity outline-none resize-none font-mono text-sm"
          />
          <div className="flex gap-4">
            <button
              onClick={handleCompose}
              disabled={isComposing || !prompt.trim()}
              className="px-8 py-4 bg-singularity text-black rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
            >
              {isComposing ? (
                <span className="animate-pulse">Reasoning (DeepSeek R1)...</span>
              ) : (
                <>Generate Melody (-{COMPOSITION_COST} Credits)</>
              )}
            </button>
            {melody && (
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="px-6 py-4 glass rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                {isPlaying ? <StopCircle className="w-5 h-5 text-singularity animate-pulse" /> : <Play className="w-5 h-5 text-singularity" />}
                {isPlaying ? 'Playing...' : 'Preview Audio'}
              </button>
            )}
          </div>
          {melody && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-white/5 font-mono text-xs text-gray-400 max-h-32 overflow-y-auto">
              Generated JSON: {JSON.stringify(melody)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
