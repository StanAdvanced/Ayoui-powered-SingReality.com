import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface UserAvatarProps {
  user: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  role?: 'user' | 'seller' | 'admin';
  showActivityRing?: boolean;
}

export function UserAvatar({ user, size = 'md', role = 'user', showActivityRing = true }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };

  const seed = user?.uid || user?.id || 'default';
  
  // Use high-end Unsplash portraits or sophisticated bottts for futuristic vibe if no photo provided
  // We use user's photoURL, but fallback to a sleek, designer-focused DiceBear notionists/shapes or Unsplash aesthetic.
  const fallbackUrl = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&backgroundColor=000000`;
  const avatarUrl = user?.photoURL || fallbackUrl;

  // Role-based styling variations
  const isSeller = role === 'seller';
  
  // Subtle gradient border colors
  const subtleGradient = isSeller 
    ? 'from-[#FFD700]/60 via-[#FFA500]/20 to-transparent' 
    : 'from-white/30 via-white/10 to-white/5';
    
  const badgeColor = isSeller ? 'bg-[#FFD700]' : 'bg-[#00ff88]';

  return (
    <div className={`relative ${sizeClasses[size]} group cursor-pointer`}>
      {/* Animated Glow Ring */}
      {showActivityRing && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute -inset-1.5 rounded-full border border-dashed ${isSeller ? 'border-[#FFD700]/50' : 'border-singularity/50'} opacity-70 group-hover:opacity-100 transition-opacity`}
        />
      )}
      
      {/* Subtle Gradient Border Frame */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${subtleGradient} p-[1px]`}>
        <div className="w-full h-full rounded-full bg-[#111] overflow-hidden relative">
          <img 
            src={avatarUrl} 
            alt={user?.displayName || 'User Avatar'} 
            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
               (e.target as HTMLImageElement).src = fallbackUrl;
            }}
          />
          {/* Apple-style Glass Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20 mix-blend-overlay rounded-full pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] rounded-full pointer-events-none" />
        </div>
      </div>
      
      {/* Status / Role Badge */}
      <div className={`absolute bottom-0 right-0 w-[28%] h-[28%] min-w-[12px] min-h-[12px] ${badgeColor} rounded-full border-[2px] border-[#111] flex items-center justify-center shadow-lg`}>
        {isSeller && <Star className="w-[60%] h-[60%] text-black fill-black" />}
      </div>
    </div>
  );
}
