// Karaoke Service
// Manages real-time karaoke sessions and synchronization

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
}

export const joinKaraokeSession = async (sessionId: string, userId: string) => {
  // Mock logic
  console.log(`User ${userId} joined session ${sessionId}`);
};

export const syncKaraokeSession = (sessionId: string, callback: (data: KaraokeState) => void) => {
  const storageKey = `karaoke_${sessionId}`;
  
  // Initialize if empty
  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, JSON.stringify({
      queue: [],
      currentSong: null,
      participants: ['Guest']
    }));
  }

  const broadcastChannel = new BroadcastChannel(storageKey);
  
  const pushState = () => {
     const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
     callback({ currentTime: Date.now(), ...data });
  };

  broadcastChannel.onmessage = (e) => {
    if (e.data === 'update') {
       pushState();
    }
  };

  pushState();

  const t = setInterval(() => {
    pushState();
  }, 1000);

  return () => {
    clearInterval(t);
    broadcastChannel.close();
  };
};

export const updateKaraokeQueue = (sessionId: string, queue: Song[]) => {
    const storageKey = `karaoke_${sessionId}`;
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    data.queue = queue;
    localStorage.setItem(storageKey, JSON.stringify(data));
    new BroadcastChannel(storageKey).postMessage('update');
};

export const updateCurrentSong = (sessionId: string, song: Song | null) => {
    const storageKey = `karaoke_${sessionId}`;
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    data.currentSong = song;
    localStorage.setItem(storageKey, JSON.stringify(data));
    new BroadcastChannel(storageKey).postMessage('update');
};
