import { create } from 'zustand';

export interface AudiusTrack {
  id: string;
  title: string;
  user: {
    name: string;
  };
  genre: string;
  duration: number;
  play_count: number;
  repost_count: number;
  favorite_count: number;
}

interface MusicEngineState {
  pinnedTracks: Record<string, AudiusTrack>;
  currentTrack: AudiusTrack | null;
  isPlaying: boolean;
  volume: number;
  host: string | null;
  audioElement: HTMLAudioElement | null;
  initHost: () => Promise<string>;
  pinLatestTrack: (genre: string) => Promise<void>;
  playGenre: (genre: string) => Promise<void>;
  setVolume: (vol: number) => void;
  togglePlay: () => void;
}

export const useMusicEngine = create<MusicEngineState>((set, get) => ({
  pinnedTracks: {},
  currentTrack: null,
  isPlaying: false,
  volume: 0.15, // Comfortable background volume
  host: null,
  audioElement: null,

  initHost: async () => {
    let { host } = get();
    if (host) return host;
    
    // Known stable discovery provider hosts
    const stableHosts = [
      'https://discoveryprovider.audius.co',
      'https://discoveryprovider2.audius.co',
      'https://discoveryprovider3.audius.co'
    ];
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch('https://api.audius.co', { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error('Audius API fetch failed');
      const data = await res.json();
      const hosts = data.data;
      if (hosts && hosts.length > 0) {
          host = hosts[Math.floor(Math.random() * hosts.length)];
      } else {
          host = stableHosts[0];
      }
      set({ host });
      return host as string;
    } catch (error) {
      console.warn('Failed to fetch Audius host list, falling back to stable host', error);
      host = stableHosts[0];
      set({ host });
      return host as string;
    }
  },

  pinLatestTrack: async (genre: string) => {
    const host = await get().initHost();
    try {
      // Fast Pinning Engine: Retrieve latest trending assets in real-time
      const url = `${host}/v1/tracks/trending?app_name=SingReality&genre=${encodeURIComponent(genre)}&limit=10`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.data && json.data.length > 0) {
        // Algorithms aggregated and sum formulas to build the call pin retrieve
        // We calculate a 'viral score' using a sum formula of engagement metrics
        const tracksWithScores = json.data.map((track: any) => {
          const playCount = track.play_count || 0;
          const repostCount = track.repost_count || 0;
          const favoriteCount = track.favorite_count || 0;
          
          // Sum formula for viral aggregation
          const viralScore = (playCount * 1) + (repostCount * 5) + (favoriteCount * 3);
          
          return { ...track, viralScore };
        });

        // Sort by highest viral score to get the top listed most virally played song
        tracksWithScores.sort((a: any, b: any) => b.viralScore - a.viralScore);
        
        const topTrack = tracksWithScores[0];

        set((state) => ({
          pinnedTracks: {
            ...state.pinnedTracks,
            [genre]: topTrack
          }
        }));
      }
    } catch (error) {
      console.error(`Failed to pin track for genre ${genre}`, error);
    }
  },

  playGenre: async (genre: string) => {
    // Upgrade the assets each time the page is opened
    await get().pinLatestTrack(genre);
    
    const track = get().pinnedTracks[genre];
    if (!track) return;

    const host = await get().initHost();
    const streamUrl = `${host}/v1/tracks/${track.id}/stream?app_name=SingReality`;

    let { audioElement, volume } = get();
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.loop = true;
      // Add event listeners for state sync
      audioElement.addEventListener('play', () => set({ isPlaying: true }));
      audioElement.addEventListener('pause', () => set({ isPlaying: false }));
      set({ audioElement });
    }

    if (get().currentTrack?.id !== track.id) {
      audioElement.src = streamUrl;
      audioElement.volume = volume;
      try {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        set({ currentTrack: track });
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.warn("Autoplay prevented or error occurred:", e.message);
        }
        set({ currentTrack: track });
      }
    } else if (!get().isPlaying) {
      try {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.warn("Autoplay prevented or error occurred:", e.message);
        }
      }
    }
  },

  setVolume: (vol: number) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = vol;
    }
    set({ volume: vol });
  },

  togglePlay: () => {
    const { audioElement, isPlaying } = get();
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play().catch(e => console.error(e));
      }
    }
  }
}));
