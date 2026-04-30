import { 
  Music, 
  Mic2, 
  Cpu, 
  Globe2, 
  Wallet, 
  Gamepad2, 
  Tv, 
  Code2, 
  Layers as LayersIcon,
  Sparkles,
  Zap,
  Activity,
  BrainCircuit,
  Bot
} from 'lucide-react';

export interface PageMediaAsset {
  path: string;
  title: string;
  description: string;
  backgroundMedia: {
    type: 'video' | 'image' | 'gradient';
    url: string;
    brightness?: number;
    blur?: number;
  };
  audioScapes: {
    ambient: string;
    oneShots?: string[];
  };
  themeColor: string;
  voiceScript?: string;
}

export const PAGE_MEDIA_REGISTRY: Record<string, PageMediaAsset> = {
  '/': {
    path: '/',
    title: 'THE NEXUS',
    description: 'The core of SingReality convergence.',
    backgroundMedia: {
      type: 'video',
      url: 'https://player.vimeo.com/external/462002591.sd.mp4?s=4044ee7890f5c15e9e0d1656f50b86a0327f3299&profile_id=164',
      brightness: 0.3
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13efed7.mp3?filename=deep-space-ambient-112179.mp3'
    },
    themeColor: '#00f0ff',
    voiceScript: 'Welcome to the Nexus. Here, your musical potential reaches its infinite peak.'
  },
  '/studio': {
    path: '/studio',
    title: 'KHORAL-FLOW STUDIO',
    description: 'Neural synesthesia design lab.',
    backgroundMedia: {
      type: 'video',
      url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=231db6214ed06e75294a289389945a0b779a1f9e&profile_id=164',
      brightness: 0.2
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73562a0487.mp3?filename=lofi-chill-medium-version-12a-11531.mp3'
    },
    themeColor: '#ff0055',
    voiceScript: 'Studio activated. Every frequency is yours to command.'
  },
  '/studio-pro': {
    path: '/studio-pro',
    title: 'STUDIO PRO',
    description: 'Enterprise-grade neural workflow.',
    backgroundMedia: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2000&auto=format&fit=crop',
      brightness: 0.2
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_99b36d0a79.mp3?filename=dark-ambient-atmospheric-track-124564.mp3'
    },
    themeColor: '#bc13fe',
    voiceScript: 'Studio Pro sequence initiated. Quantum compute resources allocated.'
  },
  '/arenas': {
    path: '/arenas',
    title: 'LIVE ARENAS',
    description: 'Global performance hubs.',
    backgroundMedia: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop',
      brightness: 0.5
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_5a855903b4.mp3?filename=crowd-ambience-11003.mp3'
    },
    themeColor: '#00ff9d',
    voiceScript: 'Arenas are live. The crowd is waiting for your frequency.'
  },
  '/quantum-lab': {
    path: '/quantum-lab',
    title: 'QUANTUM LAB',
    description: 'Hyper-dimensional sound warping.',
    backgroundMedia: {
      type: 'video',
      url: 'https://player.vimeo.com/external/174383144.sd.mp4?s=6a541334c253459e74659f1c713833ebc1a76a06&profile_id=164',
      brightness: 0.2
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2021/04/16/audio_40788647c0.mp3?filename=quantum-glitch-1234.mp3'
    },
    themeColor: '#0070ff',
    voiceScript: 'Quantum Lab access granted. Reality warping algorithms online.'
  },
  '/clones': {
    path: '/clones',
    title: 'NEURAL CLONES',
    description: 'Your autonomous digital twin band.',
    backgroundMedia: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=2000&auto=format&fit=crop',
      brightness: 0.3
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2022/11/02/audio_108ad42e88.mp3?filename=robot-voice-ambient-12499.mp3'
    },
    themeColor: '#ffdd00',
    voiceScript: 'Neural clones synchronized. Your digital collective is ready.'
  },
  '/marketplace': {
    path: '/marketplace',
    title: 'RESONANCE MARKET',
    description: 'Trade assets in the neural economy.',
    backgroundMedia: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop',
      brightness: 0.3
    },
    audioScapes: {
      ambient: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_65908b8b0e.mp3?filename=cyber-mall-ambient-112180.mp3'
    },
    themeColor: '#ff9900',
    voiceScript: 'Marketplace online. Resonance liquidity at peak levels.'
  }
};

export const getMediaAssetForPath = (path: string): PageMediaAsset => {
  // Try exact match
  if (PAGE_MEDIA_REGISTRY[path]) return PAGE_MEDIA_REGISTRY[path];
  
  // Try sub-path match (e.g. /marketplace/item-id)
  const baseRoot = '/' + path.split('/')[1];
  if (PAGE_MEDIA_REGISTRY[baseRoot]) return PAGE_MEDIA_REGISTRY[baseRoot];
  
  // Default fallback
  return PAGE_MEDIA_REGISTRY['/'];
};
