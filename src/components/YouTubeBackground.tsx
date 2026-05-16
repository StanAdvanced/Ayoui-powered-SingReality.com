import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface YouTubeBackgroundProps {
  videoId: string;
  opacity?: number;
  playing?: boolean;
  volume?: number;
  seekTarget?: number;
  onProgress?: (state: { playedSeconds: number }) => void;
  onEnded?: () => void;
}

export function YouTubeBackground({ videoId, opacity = 0.3, playing = true, volume = 0.8, seekTarget, onProgress, onEnded }: YouTubeBackgroundProps) {
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (seekTarget !== undefined && playerRef.current) {
        playerRef.current.seekTo(seekTarget, 'seconds');
    }
  }, [seekTarget]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        width="100vw"
        height="100vh"
        style={{ minWidth: '177.77vh', minHeight: '56.25vw' }}
        playing={playing}
        volume={volume}
        muted={false}
        loop={false}
        controls={false}
        playsinline
        onProgress={onProgress}
        onEnded={onEnded}
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              controls: 0,
              showinfo: 0,
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />
    </div>
  );
}
