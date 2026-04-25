import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Mark */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0 rounded-full bg-gradient-to-br from-[#FF7A00] via-[#FF007A] to-[#7000FF] flex items-center justify-center shadow-lg`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-3/5 h-3/5 text-[#1A0B2E] fill-[#1A0B2E]"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
          <line x1="8" x2="16" y1="22" y2="22" />
          {/* Horizontal band across the mic to match the specific logo style */}
          <rect x="9" y="8" width="6" height="3" rx="1" fill="#FF007A" stroke="none" />
        </svg>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col justify-center relative">
        {/* Small red accent dot */}
        <div className="absolute -left-2 top-2 w-1 h-1.5 bg-[#FF2A2A] rounded-full transform -rotate-12" />
        <span className={`${textClasses[size]} font-bold leading-none text-[#1A0B2E] dark:text-white tracking-tight`}>
          Sing
        </span>
        <span className={`${textClasses[size]} font-bold leading-none text-[#1A0B2E] dark:text-white tracking-tight`}>
          Reality
        </span>
      </div>
    </div>
  );
}
