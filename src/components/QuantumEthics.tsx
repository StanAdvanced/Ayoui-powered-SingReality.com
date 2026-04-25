import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Globe, Cpu, ArrowLeft } from 'lucide-react';

export default function QuantumEthics() {
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto pt-24">
      <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to SingReality
      </Link>
      
      <div className="mb-16 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-singularity to-quantum rounded-full flex items-center justify-center mx-auto mb-8 glow">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-display font-black tracking-tighter mb-6">QUANTUM <span className="text-gradient">ETHICS</span></h1>
        <p className="text-xl text-gray-400 font-light leading-relaxed">
          Our commitment to the SIOQGSHOTS Philosophy: Ensuring that the future of generative music, holographic convergence, and AGI-driven creativity remains human-centric, fair, and transparent.
        </p>
      </div>

      <div className="space-y-8">
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Heart className="text-singularity w-6 h-6"/> Human-in-the-Loop Certification</h2>
          <p className="text-gray-400 leading-relaxed">
            We believe AI should amplify human creativity, not replace it. Every asset generated on SingReality receives a "Proof of Artistry" score, tracking the level of human curation, editing, and emotional input. Tracks with high human interaction are prioritized in our global arenas.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Globe className="text-quantum w-6 h-6"/> Clean Data & Training Residuals</h2>
          <p className="text-gray-400 leading-relaxed">
            Our generative models (including VoiceVault and StemForge) are trained exclusively on ethically sourced, opt-in datasets. Original sound designers, vocalists, and musicians receive "Training Residuals"—automated royalty payouts via smart contracts whenever their sonic DNA influences a new generation.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Cpu className="text-reality w-6 h-6"/> Bias-Free Convergence</h2>
          <p className="text-gray-400 leading-relaxed">
            As we scale to 6 billion users across 195 countries, our AI algorithms are rigorously audited using frameworks like AIF360 to ensure cultural, linguistic, and musical representation is equitable. The global sing-a-long must be a stage for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
