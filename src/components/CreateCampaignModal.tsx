import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface RewardTier {
  name: string;
  amount: number;
  description: string;
}

export function CreateCampaignModal({ onClose, onCreate }: { onClose: () => void; onCreate: (data: any) => void }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [rewards, setRewards] = useState<RewardTier[]>([]);
  const { currency } = useStore();

  const addReward = () => setRewards([...rewards, { name: '', amount: 0, description: '' }]);
  const updateReward = (index: number, field: keyof RewardTier, value: string | number) => {
    const newRewards = [...rewards];
    newRewards[index] = { ...newRewards[index], [field]: value };
    setRewards(newRewards);
  };
  const removeReward = (index: number) => setRewards(rewards.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="glass-card rounded-[3rem] p-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">START CAMPAIGN</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="space-y-6">
          <input type="text" placeholder="Campaign Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3" />
          <input type="number" placeholder={`Goal (${currency})`} value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3" />
          
          <div>
            <h3 className="font-bold mb-4">Reward Tiers</h3>
            {rewards.map((reward, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" placeholder="Name" value={reward.name} onChange={(e) => updateReward(i, 'name', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2" />
                <input type="number" placeholder="Amount" value={reward.amount} onChange={(e) => updateReward(i, 'amount', Number(e.target.value))} className="w-24 bg-black/50 border border-white/10 rounded-xl px-4 py-2" />
                <button onClick={() => removeReward(i)} className="text-red-500"><Trash2 /></button>
              </div>
            ))}
            <button onClick={addReward} className="text-xs text-singularity flex items-center gap-2 mt-2"><Plus className="w-4 h-4" /> ADD TIER</button>
          </div>
          
          <button onClick={() => onCreate({ name, goal, rewards })} className="w-full py-4 bg-singularity text-black rounded-2xl font-bold">CREATE</button>
        </div>
      </div>
    </div>
  );
}
