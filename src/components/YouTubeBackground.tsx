import React from 'react';

interface YouTubeBackgroundProps {
  videoId: string;
  opacity?: number;
}

export function YouTubeBackground({ videoId, opacity = 0.3 }: YouTubeBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <iframe
        className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-[177.77vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
