export interface Asset {
  id: string;
  name: string;
  category: 'furniture' | 'architecture' | 'characters' | 'materials';
  url: string;
  thumbnail: string;
}

export const ASSETS: Asset[] = [
  { 
    id: 'f1', 
    name: 'Modern Chair', 
    category: 'furniture', 
    url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'a1', 
    name: 'Minimalist Arch', 
    category: 'architecture', 
    url: 'https://images.unsplash.com/photo-1518005020251-582c7b846519?q=80&w=800&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1518005020251-582c7b846519?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'c1', 
    name: 'Cyberpunk NPC', 
    category: 'characters', 
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'm1', 
    name: 'Neon Texture', 
    category: 'materials', 
    url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop', 
    thumbnail: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=200&auto=format&fit=crop' 
  },
];
