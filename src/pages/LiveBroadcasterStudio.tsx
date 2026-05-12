import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Video, Mic, Share, Play, Power, Volume2, Shield } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required' as any
    });
    if (error) {
      setErrorMessage(error.message as string);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <button type="submit" disabled={!stripe} className="px-6 py-2 bg-singularity text-white font-bold rounded-lg hover:bg-singularity/80">
        Submit Payment
      </button>
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </form>
  );
}

export function LiveBroadcasterStudio() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [roomId, setRoomId] = useState('nexus-live-stage');
  const [views, setViews] = useState(0);

  // Stripe Monetization State
  const [showTipModal, setShowTipModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const s = io((import.meta as any).env.VITE_APP_URL || 'http://localhost:3000');
    setSocket(s);

    s.on('connect', () => console.log('Connected to Broadcaster server'));
    s.on('receive-message', () => setViews((v) => v + 1)); // Mock viewers increase upon receiving events

    return () => {
      s.disconnect();
    };
  }, []);

  const handleStartStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsLive(true);
      socket?.emit('join-broadcast', roomId);
      // Further WebRTC PC negotiation logic omitted for brevity
    } catch (err) {
      console.error('Failed to get media devices:', err);
    }
  };

  const handleStopStream = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsLive(false);
  };

  const initTipping = async () => {
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 5 }), // $5 tip
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowTipModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black diamond-crystal tracking-tight">AI OBS Broadcaster Studio</h1>
            <p className="text-white/60">Stream ultra-realistic Gaussian Splat clones directly to the SingReality Metaverse.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={isLive ? handleStopStream : handleStartStream}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isLive ? 'bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500/30' : 'bg-singularity text-white hover:bg-singularity/80'}`}
            >
              {isLive ? <Power className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {isLive ? 'End Stream' : 'Go Live'}
            </button>
            <button onClick={initTipping} className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full font-bold hover:bg-green-500/30">
              $ Tip Creator
            </button>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Main Stage */}
          <div className="lg:col-span-2 glass rounded-[2rem] border border-white/10 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/50'}`}>
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
              {isLive && (
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-singularity" /> {views} viewers
                </span>
              )}
            </div>
            {isLive ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black/40">
                <Video className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-white/40">Start streaming or connect OBS virtual camera.</p>
              </div>
            )}
          </div>

          {/* Tools & Chat */}
          <div className="flex flex-col gap-6">
            <div className="glass p-6 rounded-[2rem] border border-white/10 h-1/2 flex flex-col">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-singularity" /> Stream Console
              </h2>
              <div className="flex-1 overflow-y-auto space-y-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-white/40 mb-1">Stream Key</div>
                  <div className="font-mono text-sm blur-sm hover:blur-none transition-all cursor-pointer">live_sk_singreality_0932x</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Latency Mode</div>
                    <div className="text-sm">Ultra-Low (WebRTC)</div>
                  </div>
                  <Share className="w-4 h-4 text-white/40" />
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-white/40 mb-1">Audio Source</div>
                  <div className="text-sm flex items-center gap-2"><Volume2 className="w-4 h-4" /> Loopback Audio 1</div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-[2rem] border border-white/10 flex-1 flex flex-col relative overflow-hidden">
              <h2 className="text-xl font-bold mb-4">Live Chat</h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                <div className="text-sm"><span className="text-singularity font-bold">System:</span> Welcome to Live Chat!</div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-singularity" />
                <button className="p-2 bg-singularity rounded-full"><Share className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTipModal && clientSecret && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="bg-[#1A1A1A] max-w-md w-full rounded-2xl p-6 border border-white/10 relative">
            <button onClick={() => setShowTipModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">x</button>
            <h2 className="text-2xl font-bold mb-6">Support Creator</h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm onSuccess={() => setShowTipModal(false)} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
