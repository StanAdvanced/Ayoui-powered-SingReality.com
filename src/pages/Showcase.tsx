import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Upload, 
  Search, 
  Tag, 
  Plus, 
  Filter, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, doc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { SafeCanvas } from '../components/SafeCanvas';
import { ModelViewer } from '../components/ModelViewer';

interface Submission {
  id: string;
  title: string;
  description: string;
  tags: string[];
  userId: string;
  userName: string;
  thumbnail: string;
  likes: string[]; // Array of user IDs
  timestamp: any;
  ual?: string;
}

export default function Showcase() {
  const { user } = useStore();
  const { playClick, playTransition } = useSound();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // New Submission State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newModelUrl, setNewModelUrl] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'showcase'), orderBy('timestamp', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs: Submission[] = [];
      snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'showcase');
    });
    return unsub;
  }, []);

  const handleLike = async (id: string, currentLikes: string[]) => {
    if (!user) return;
    playClick();
    const isLiked = currentLikes.includes(user.uid);
    const subRef = doc(db, 'showcase', id);
    
    try {
      await updateDoc(subRef, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `showcase/${id}`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle) return;
    playTransition();
    setIsUploading(true);

    try {
      await addDoc(collection(db, 'showcase'), {
        title: newTitle,
        description: newDescription,
        modelUrl: newModelUrl || 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/truck.gltf',
        tags: newTags.split(',').map(t => t.trim()).filter(t => t),
        userId: user.uid,
        userName: user.displayName || 'Anonymous Architect',
        thumbnail: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
        likes: [],
        timestamp: serverTimestamp(),
      });
      setNewTitle('');
      setNewDescription('');
      setNewTags('');
      setNewModelUrl('');
      setIsUploading(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'showcase');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="max-w-[1600px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-white/10">
              < Award className="w-4 h-4 text-singularity" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-singularity">Neural Design Showcase V1.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] mb-6">
              CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-quantum">GENESIS</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              The central hub for SingReality's architectural elite. Deploy your layered renderings, gather neural feedback, and rise through the ranks of the global collective.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-singularity transition-colors" />
              <input 
                type="text"
                placeholder="Search the collective..."
                className="bg-white/5 border border-white/10 rounded-full pl-14 pr-8 py-5 text-sm w-80 focus:border-singularity/50 outline-none transition-all placeholder:text-gray-600 font-mono"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { playClick(); setIsUploading(!isUploading); }}
              className="p-5 glass rounded-full hover:bg-white/10 transition-all border border-white/10 text-white"
            >
              <Plus className={`w-6 h-6 transition-transform ${isUploading ? 'rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Upload Modal Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass p-8 rounded-[3rem] border border-white/10 mb-16 max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-singularity via-quantum to-reality" />
              <h2 className="text-2xl font-display font-bold uppercase tracking-widest mb-8 flex items-center gap-4">
                <Upload className="w-6 h-6 text-singularity" /> Deploy New Rendering
              </h2>
              <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Project Title</label>
                    <input 
                      type="text" 
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-singularity outline-none transition-all"
                      placeholder="e.g., Quantum Monastery Echo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Description</label>
                    <textarea 
                      required
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-singularity outline-none transition-all resize-none"
                      placeholder="Describe the emotional and structural intent..."
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">3D Model URL (.GLTF / .OBJ)</label>
                    <input 
                      type="text" 
                      value={newModelUrl}
                      onChange={e => setNewModelUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-singularity outline-none transition-all"
                      placeholder="https://raw.githubusercontent.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Tags (Comma separated)</label>
                    <input 
                      type="text" 
                      value={newTags}
                      onChange={e => setNewTags(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-singularity outline-none transition-all"
                      placeholder="neon, fluid, recursive, memory"
                    />
                  </div>
                  <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-singularity/50 transition-colors">
                    <div className="p-4 rounded-full bg-white/5 group-hover:bg-singularity/10 transition-colors">
                      <Zap className="w-8 h-8 text-gray-500 group-hover:text-singularity transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Sync layer data from Studio</p>
                      <p className="text-[10px] text-gray-600 mt-1 font-mono">Accepts .GLTF / .OBJ / .USDZ</p>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-gradient-to-r from-singularity to-quantum text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                  >
                    Transmit to Collective
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {submissions.map((sub, i) => (
            <motion.div 
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-white/20 transition-all flex flex-col h-[500px]"
            >
              {/* Card Image/Thumbnail */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={sub.thumbnail} 
                  alt={sub.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Overlay Score/Likes */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLike(sub.id, sub.likes); }}
                    className={`p-3 rounded-full backdrop-blur-xl border border-white/10 transition-all flex items-center gap-2 ${user && sub.likes.includes(user.uid) ? 'bg-singularity text-black' : 'bg-black/50 text-white hover:bg-white/10'}`}
                  >
                    <Heart className={`w-4 h-4 ${user && sub.likes.includes(user.uid) ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-black">{sub.likes.length}</span>
                  </button>
                </div>

                <div className="absolute bottom-6 left-6">
                   <div className="flex items-center gap-2 mb-2">
                     <Globe className="w-3 h-3 text-singularity" />
                     <span className="text-[8px] font-mono uppercase tracking-widest text-singularity">Sector: Global Collective</span>
                   </div>
                   <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">{sub.title}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-singularity to-quantum flex items-center justify-center text-[10px] font-black text-black uppercase">
                      {sub.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Architect</p>
                      <p className="text-xs font-bold text-white tracking-tight">{sub.userName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed font-medium">
                    {sub.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-2">
                    {sub.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => { playClick(); setSelectedSubmission(sub); }}
                    className="flex items-center gap-2 text-[10px] font-black text-quantum uppercase tracking-[0.2em] group/btn"
                  >
                    Iterate <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {submissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem] border border-dashed border-white/10">
            <TrendingUp className="w-16 h-16 text-gray-800 mb-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-2">No transmissions found</h3>
            <p className="text-sm text-gray-600 font-mono">Be the first to seed the creative landscape.</p>
          </div>
        )}
      </div>

      {/* Selected Submission Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <div className="w-full max-w-[1400px] h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-singularity uppercase tracking-[0.4em] mb-2">Detailed Neural Analysis</span>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter italic">
                    {selectedSubmission.title}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-6 glass rounded-full hover:bg-white/10 transition-all border border-white/10 text-white uppercase font-black text-[10px] tracking-widest"
                >
                  Terminate x
                </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
                {/* 3D Interaction Window */}
                <div className="flex-1 glass rounded-[3rem] border border-white/10 relative overflow-hidden bg-black/40">
                  <ModelViewer />
                  <div className="absolute top-8 left-8 p-4 glass rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-xl">
                    <Zap className="w-4 h-4 text-reality animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Interactive 3D Simulation Vector</span>
                  </div>
                </div>

                {/* Sidebar Analytics */}
                <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="glass p-8 rounded-[2.5rem] border border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Award className="w-4 h-4 text-singularity" /> Structural Intent
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8">
                      {selectedSubmission.description}
                    </p>
                    <div className="space-y-4">
                      {selectedSubmission.tags.map(tag => (
                        <div key={tag} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-singularity/30 transition-all">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">#{tag}</span>
                          <TrendingUp className="w-4 h-4 text-gray-800 group-hover:text-singularity transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-singularity/5">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Heart className="w-4 h-4 text-singularity" /> Neural Sentiment
                    </h3>
                    <div className="flex items-center justify-between mb-8">
                       <div className="text-center">
                         <div className="text-2xl font-black text-white">{selectedSubmission.likes.length}</div>
                         <div className="text-[8px] text-gray-500 uppercase font-mono tracking-[0.2em]">Resonators</div>
                       </div>
                       <div className="w-px h-10 bg-white/10" />
                       <div className="text-center">
                         <div className="text-2xl font-black text-white">124</div>
                         <div className="text-[8px] text-gray-500 uppercase font-mono tracking-[0.2em]">Interactions</div>
                       </div>
                       <div className="w-px h-10 bg-white/10" />
                       <div className="text-center">
                         <div className="text-2xl font-black text-white">98%</div>
                         <div className="text-[8px] text-gray-500 uppercase font-mono tracking-[0.2em]">Stability</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleLike(selectedSubmission.id, selectedSubmission.likes)}
                      className="w-full py-5 bg-singularity text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                      <Heart className="w-4 h-4 fill-current" /> Ignite Resonance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
