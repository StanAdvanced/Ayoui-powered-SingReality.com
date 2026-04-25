import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Legal() {
  const location = useLocation();
  const isPrivacy = location.pathname === '/privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto pt-24">
      <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to SingReality
      </Link>
      
      <div className="glass p-12 rounded-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-singularity" />
          </div>
          <h1 className="text-4xl font-display font-bold">{title}</h1>
        </div>
        
        <div className="space-y-6 text-gray-400 leading-relaxed">
          <p>Last updated: March 27, 2026</p>
          <p>Welcome to SingReality. By accessing our platform, holographic arenas, and quantum marketplace, you agree to the following {title.toLowerCase()}.</p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Data Convergence & Holographic Privacy</h3>
          <p>Your biometric data, vocal DNA, and holographic likeness are encrypted using post-quantum cryptography. We do not sell your neural patterns to third parties.</p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Smart Contract Royalties</h3>
          <p>All marketplace transactions, ticket sales, and training residuals are governed by immutable smart contracts. Payouts are processed automatically to your connected wallet or fiat account.</p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. AGI Moderation</h3>
          <p>Our arenas are moderated by AGI to ensure a safe, inclusive environment for our 6 billion users. Hate speech, unauthorized voice cloning, and temporal griefing are strictly prohibited.</p>
        </div>
      </div>
    </div>
  );
}
