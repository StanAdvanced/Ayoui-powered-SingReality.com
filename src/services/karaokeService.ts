// Karaoke Service
// Manages real-time karaoke sessions and synchronization

import { socket } from './socket';

export interface Song {
  id: string;
  title: string;
  artist: string;
  views: string;
}

export interface KaraokeState {
  currentTime: number;
  queue: Song[];
  participants: string[];
  currentSong: Song | null;
  isPlaying: boolean;
}

export const joinKaraokeSession = async (sessionId: string, userId: string) => {
  socket.emit('join-arena', sessionId);
};

export const syncKaraokeSession = (sessionId: string, callback: (data: KaraokeState) => void) => {
  socket.emit('join-arena', sessionId);
  
  // Listen for state push
  const handleUpdate = (data: KaraokeState) => {
    callback(data);
  };
  
  socket.on('karaoke-state-update', handleUpdate);

  // Periodic request to sync in case of missed updates
  socket.emit('request-karaoke-state', sessionId);

  return () => {
    socket.off('karaoke-state-update', handleUpdate);
  };
};

export const updateKaraokePlayback = (sessionId: string, data: { currentTime: number, isPlaying: boolean }) => {
    socket.emit('update-karaoke-playback', { sessionId, ...data });
};

export const updateKaraokeQueue = (sessionId: string, queue: Song[]) => {
    socket.emit('update-karaoke-queue', { sessionId, queue });
};

export const updateCurrentSong = (sessionId: string, song: Song | null) => {
    socket.emit('update-karaoke-song', { sessionId, song });
};

