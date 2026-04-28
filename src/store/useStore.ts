import { create } from 'zustand';
import { monitoringService } from '../services/monitoringService';
import { VoiceName } from '../lib/tts';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  token?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface GlobalTrack {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  type?: 'audio' | 'video';
}

interface AppState {
  user: User | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  
  // Auth Actions
  login: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  // Global Nexus Player Data 
  globalTrack: GlobalTrack | null;
  setGlobalTrack: (track: GlobalTrack | null) => void;
  isPlayerOpen: boolean;
  setPlayerOpen: (isOpen: boolean) => void;
  
  // Intelligence at Scale - B2B API Portal
  isEnterprisePortalOpen: boolean;
  setEnterprisePortalOpen: (isOpen: boolean) => void;
  
  // Narration Voice
  narrationVoice: VoiceName;
  setNarrationVoice: (voice: VoiceName) => void;
  
  // Settings
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Project State (for 3D Viewer & Layers)
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  addLayer: (name: string, url?: string) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  
  // History State for Undo/Redo
  layerHistory: Layer[][];
  layerHistoryIndex: number;
  undoLayerAction: () => void;
  redoLayerAction: () => void;
  
  // Real-time Collaboration
  activeUsers: { id: string; name: string; color: string; cursor: { x: number; y: number; z: number } }[];
  updateCursor: (userId: string, position: { x: number; y: number; z: number }) => void;
  
  // Avatar State
  currentInstrument: 'guitar' | 'synth';
  setInstrument: (instrument: 'guitar' | 'synth') => void;
  isAvatarTalking: boolean;
  setAvatarTalking: (isTalking: boolean) => void;

  // Karaoke State
  karaokeTheme: 'fun' | 'serious' | 'cosmic' | 'retro';
  setKaraokeTheme: (theme: 'fun' | 'serious' | 'cosmic' | 'retro') => void;
  currentKaraokeSong: { id: string; title: string; youtubeId: string } | null;
  setCurrentKaraokeSong: (song: { id: string; title: string; youtubeId: string } | null) => void;
  karaokeQueue: { id: string; title: string; youtubeId: string }[];
  addToKaraokeQueue: (song: { id: string; title: string; youtubeId: string }) => void;
  removeFromKaraokeQueue: (id: string) => void;

  // SingReality Singularity State
  resonance: number;
  addResonance: (amount: number) => void;

  // Currency State
  currency: string;
  setCurrency: (currency: string) => void;

  // Shopping Cart State
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  
  // Search State
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;

  // Graphics & Performance
  bgEnabled: boolean;
  setBgEnabled: (enabled: boolean) => void;
  graphicsRes: 'low' | 'high';
  setGraphicsRes: (res: 'low' | 'high') => void;

  // Biometric State
  biometricSync: {
    active: boolean;
    heartRate: number;
    stressLevel: number;
    lastUpdate: number;
  };
  setBiometricSync: (data: Partial<AppState['biometricSync']>) => void;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  url?: string; // URL of the 3D model
  objects: string[]; // IDs of 3D objects
  color?: string;
  opacity?: number;
  materialProps?: any;
  isHologram?: boolean;
}

const initialLayers: Layer[] = [
  { id: '1', name: 'Base Layer', visible: true, url: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/truck.gltf', objects: [], color: '#00f0ff', opacity: 0.6, materialProps: {}, isHologram: true }
];

export const useStore = create<AppState>((set, get) => {
  const pushToHistory = (newLayers: Layer[]) => {
    const history = get().layerHistory;
    const index = get().layerHistoryIndex;
    const newHistory = history.slice(0, index + 1);
    newHistory.push([...newLayers]); // Deep clone layer array if needed, object references are fine here.
    set({ layerHistory: newHistory, layerHistoryIndex: newHistory.length - 1, layers: newLayers });
  };

  return {
    user: null,
    isAuthReady: true, // we can set to true immediately since no firebase init
    setUser: (user) => set({ user }),
    setAuthReady: (isAuthReady) => set({ isAuthReady }),

    globalTrack: null,
    setGlobalTrack: (globalTrack) => set({ globalTrack, isPlayerOpen: true }),
    isPlayerOpen: false,
    setPlayerOpen: (isPlayerOpen) => set({ isPlayerOpen }),
    
    isEnterprisePortalOpen: false,
    setEnterprisePortalOpen: (isEnterprisePortalOpen) => set({ isEnterprisePortalOpen }),
    
    narrationVoice: 'Puck', // Default to Puck mapped or default Gen voice
    setNarrationVoice: (voice: VoiceName) => {
      // Also update the narrationEngine dynamically if available
      import('../services/narrationEngine').then(m => m.narrationEngine.currentVoice = voice);
      set({ narrationVoice: voice });
    },
    
    login: async () => {
      // Mocked out because oauth requires separate backend handling, falling back to a quick demo user instead
      try {
        const email = "demo@example.com";
        const pass = "password";
        // Attempt login, if not exist, sign up
        try {
          await get().loginWithEmail(email, pass);
        } catch {
          await get().signUpWithEmail(email, pass, "Demo User");
        }
      } catch (error) {
        monitoringService.error('Login failed', error as Error);
        throw error;
      }
    },
    
    loginWithFacebook: async () => {
      // Not implemented without Firebase
    },
    
    loginWithEmail: async (email, pass) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        localStorage.setItem('auth_token', data.token);
        set({ user: { uid: data.user.id, email: data.user.email, displayName: data.user.name, photoURL: null, token: data.token } });
      } catch (error) {
        monitoringService.error('Email login failed', error as Error);
        throw error;
      }
    },
    
    signUpWithEmail: async (email, pass, name) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass, name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        localStorage.setItem('auth_token', data.token);
        set({ user: { uid: data.user.id, email: data.user.email, displayName: data.user.name, photoURL: null, token: data.token } });
      } catch (error) {
        monitoringService.error('Sign up failed', error as Error);
        throw error;
      }
    },
    
    resetPassword: async (email) => {
      throw new Error("Local auth doesn't support password reset yet.");
    },
    
    logout: async () => {
      try {
        localStorage.removeItem('auth_token');
        set({ user: null });
      } catch (error) {
        monitoringService.error('Logout failed', error as Error);
        throw error;
      }
    },
    
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    
    layers: initialLayers,
    layerHistory: [initialLayers],
    layerHistoryIndex: 0,
    
    setLayers: (layers: Layer[]) => {
      pushToHistory(layers);
    },
    
    addLayer: (name, url) => {
      const state = get();
      const newLayers = [...state.layers, { 
        id: Math.random().toString(36).substr(2, 9), 
        name, 
        visible: true, 
        url: url || 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/truck.gltf',
        objects: [], 
        color: '#ffffff',
        opacity: 1,
        materialProps: {}, 
        isHologram: false 
      }];
      pushToHistory(newLayers);
    },
    
    removeLayer: (id) => {
      const state = get();
      const newLayers = state.layers.filter(l => l.id !== id);
      pushToHistory(newLayers);
    },
    
    toggleLayerVisibility: (id) => {
      const state = get();
      const newLayers = state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
      pushToHistory(newLayers);
    },
    
    reorderLayers: (startIndex, endIndex) => {
      const state = get();
      const result = Array.from(state.layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      pushToHistory(result);
    },
    
    undoLayerAction: () => {
      const state = get();
      if (state.layerHistoryIndex > 0) {
        const newIndex = state.layerHistoryIndex - 1;
        set({ layers: state.layerHistory[newIndex], layerHistoryIndex: newIndex });
      }
    },

    redoLayerAction: () => {
      const state = get();
      if (state.layerHistoryIndex < state.layerHistory.length - 1) {
        const newIndex = state.layerHistoryIndex + 1;
        set({ layers: state.layerHistory[newIndex], layerHistoryIndex: newIndex });
      }
    },
    
    activeUsers: [],
    updateCursor: (userId, position) => set((state) => ({
      activeUsers: state.activeUsers.map(u => u.id === userId ? { ...u, cursor: position } : u)
    })),
    
    currentInstrument: 'guitar',
    setInstrument: (currentInstrument) => set({ currentInstrument }),
    isAvatarTalking: false,
    setAvatarTalking: (isAvatarTalking) => set({ isAvatarTalking }),

    karaokeTheme: 'fun',
    setKaraokeTheme: (karaokeTheme) => set({ karaokeTheme }),
    currentKaraokeSong: null,
    setCurrentKaraokeSong: (currentKaraokeSong) => set({ currentKaraokeSong }),
    karaokeQueue: [],
    addToKaraokeQueue: (song) => set((state) => ({ karaokeQueue: [...state.karaokeQueue, song] })),
    removeFromKaraokeQueue: (id) => set((state) => ({ karaokeQueue: state.karaokeQueue.filter(s => s.id !== id) })),

    resonance: 14729881, // Starting with a high number from the lore
    addResonance: (amount) => set((state) => ({ resonance: state.resonance + amount })),

    currency: 'AUD',
    setCurrency: (currency) => set({ currency }),

    cartItems: [],
    isCartOpen: false,
    addToCart: (item) => set((state) => {
      const existing = state.cartItems.find(i => i.id === item.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isCartOpen: true
        };
      }
      return { cartItems: [...state.cartItems, { ...item, quantity: 1 }], isCartOpen: true };
    }),
    removeFromCart: (id) => set((state) => ({
      cartItems: state.cartItems.filter(i => i.id !== id)
    })),
    clearCart: () => set({ cartItems: [] }),
    setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    
    isSearchOpen: false,
    setIsSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

    bgEnabled: true,
    setBgEnabled: (bgEnabled) => set({ bgEnabled }),
    graphicsRes: 'high',
    setGraphicsRes: (graphicsRes) => set({ graphicsRes }),

    biometricSync: {
      active: false,
      heartRate: 72,
      stressLevel: 0.2,
      lastUpdate: Date.now()
    },
    setBiometricSync: (data) => set((state) => ({ 
      biometricSync: { ...state.biometricSync, ...data, lastUpdate: Date.now() } 
    })),
  };
});
