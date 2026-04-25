import React from 'react';

export function GoogleMapBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 bg-black">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="20%" cy="30%" r="4" fill="#00f0ff" className="animate-ping" />
        <circle cx="70%" cy="60%" r="4" fill="#7000ff" className="animate-ping" style={{ animationDelay: '1s' }} />
        <circle cx="50%" cy="40%" r="4" fill="#ff003c" className="animate-ping" style={{ animationDelay: '0.5s' }} />
      </svg>
    </div>
  );
}
