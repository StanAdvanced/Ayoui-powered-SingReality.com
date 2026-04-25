import React, { useState } from 'react';
import { HandCoins, Gift, Rocket, ChevronRight, CheckCircle2 } from 'lucide-react';

export function MusicCrowdfunding() {
  const [pledgeMode, setPledgeMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const TIER = [
    { amount: 5, label: "Fan", perk: "Shoutout" },
    { amount: 25, label: "Supporter", perk: "Exclusive Duet" },
    { amount: 100, label: "Producer", perk: "Stem Access" }
  ];

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <HandCoins className="w-5 h-5 text-quantum opacity-80" />
          <h3 className="font-bold text-sm tracking-widest uppercase text-white">Back the Artist</h3>
        </div>
        <div className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
          Goal: 85%
        </div>
      </div>

      {!pledgeMode ? (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-white/70 leading-relaxed">
            Support the creator's next album. Receive exclusive AI stems and Web3 royalties.
          </p>
          <button 
            onClick={() => setPledgeMode(true)}
            className="w-full py-3 bg-gradient-to-r from-quantum to-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" /> Pledge Support
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {TIER.map(t => (
              <button 
                key={t.amount}
                onClick={() => setSelectedAmount(t.amount)}
                className={`p-2 rounded border flex flex-col items-center gap-1 transition-all ${
                  selectedAmount === t.amount 
                    ? 'border-quantum bg-quantum/20' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="font-bold text-white">${t.amount}</span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest">{t.label}</span>
              </button>
            ))}
          </div>

          <button 
            disabled={!selectedAmount}
            className="w-full mt-2 py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {selectedAmount ? `Checkout $${selectedAmount}` : 'Select Tier'}
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Real-world integrations layout wrapper */}
          <div className="flex items-center justify-center gap-3 pt-2 opacity-60">
            <span className="text-[9px] font-mono uppercase">Powered by</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-2.5 invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-2.5" />
            <span className="text-[8px] font-bold tracking-widest uppercase border border-white/20 rounded px-1">Afterpay</span>
          </div>
        </div>
      )}
    </div>
  );
}
