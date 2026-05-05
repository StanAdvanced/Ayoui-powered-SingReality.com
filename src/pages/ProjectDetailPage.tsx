import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, User, Send, Calendar, Tag, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { ModelViewer } from '../components/ModelViewer';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any;
}

export function ProjectDetailPage() {
  const { id } = useParams();
  const { user, currency } = useStore();
  const [project, setProject] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      const docRef = doc(db, 'showcaseProjects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    fetchProject();

    const q = query(
      collection(db, 'showcaseComments'),
      where('projectId', '==', id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[]);
    });

    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    if (!id || !project) return;
    const docRef = doc(db, 'showcaseProjects', id);
    await updateDoc(docRef, { likes: increment(1) });
    setProject((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
  };

  const handleBuy = async () => {
    if (!id || !project || !user) return;
    if (project.userId === user.uid) {
      alert("You already own this reality segment.");
      return;
    }

    setPurchasing(true);
    try {
      // 1. Create Transaction Record
      await addDoc(collection(db, 'nftTransactions'), {
        projectId: id,
        sellerId: project.userId,
        buyerId: user.uid,
        price: project.price,
        timestamp: serverTimestamp()
      });

      // 2. Update Ownership in Showcase
      const projectRef = doc(db, 'showcaseProjects', id);
      await updateDoc(projectRef, {
        userId: user.uid,
        isForSale: false
      });

      // 3. Update Ownership in Main Project (Optional, for full consistency)
      const mainProjectRef = doc(db, 'projects', project.projectId);
      await updateDoc(mainProjectRef, { ownerId: user.uid });

      setProject((prev: any) => ({ ...prev, userId: user.uid, isForSale: false }));
      alert(`Success! You are now the legal owner of ${project.name}. NFT id: ${project.nftTokenId}`);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Reality acquisition failed. Insufficient neural balance or connection lost.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'showcaseComments'), {
        projectId: id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        text: newComment,
        createdAt: serverTimestamp()
      });
      
      const projectRef = doc(db, 'showcaseProjects', id);
      await updateDoc(projectRef, { commentCount: increment(1) });
      
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-singularity animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
        <h1 className="text-4xl font-display font-black mb-4 uppercase">PROJECT <span className="text-gradient">NOT FOUND</span></h1>
        <p className="text-gray-400 mb-8">This reality transition target does not exist or has been archived.</p>
        <Link to="/showcase" className="px-8 py-4 bg-white text-black font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Showcase
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/showcase" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Showcase
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Visuals */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/10 glass-card relative group">
              <ModelViewer projectId={project.projectId} />
              <div className="absolute top-6 right-6 flex gap-3">
                 <button className="p-4 glass rounded-2xl hover:bg-white/10 transition-all">
                    <Shield className="w-5 h-5 text-singularity" />
                 </button>
              </div>
            </div>

            <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-4">{project.name}</h1>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <User className="w-4 h-4 text-singularity" /> {project.author}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Calendar className="w-4 h-4 text-quantum" /> {new Date(project.createdAt?.seconds * 1000).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Tag className="w-4 h-4 text-reality" /> {project.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {project.isForSale && project.userId !== user?.uid && (
                    <button 
                      onClick={handleBuy}
                      disabled={purchasing}
                      className="px-8 py-4 bg-singularity text-black font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                    >
                      {purchasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      ACQUIRE NFT • {project.price} {currency}
                    </button>
                  )}
                  {project.nftTokenId && (
                    <div className="hidden md:flex items-center gap-2 px-6 py-4 glass-card rounded-2xl border border-singularity/20">
                       <Tag className="w-3 h-3 text-singularity" />
                       <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: {project.nftTokenId}</span>
                    </div>
                  )}
                  <button 
                    onClick={handleLike}
                    className="flex items-center gap-3 px-8 py-4 glass rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 group"
                  >
                    <Heart className={`w-5 h-5 group-hover:text-red-500 transition-colors ${project.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    {project.likes || 0}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Project Integrity & Description</h3>
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  {project.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar & Comments */}
          <div className="space-y-8">
            <div className="glass-card rounded-[3rem] p-8 border border-white/5 flex flex-col h-[800px]">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <MessageSquare className="w-6 h-6 text-singularity" /> Collective Intel
              </h2>

              <div className="flex-1 overflow-y-auto mb-8 space-y-6 pr-2 scrollbar-none">
                {comments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <MessageSquare className="w-12 h-12 mb-4" />
                    <p className="text-xs font-mono lowercase tracking-widest">No transmissions recorded yet. Initiating silence...</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <motion.div 
                      key={comment.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={comment.userPhoto || 'https://ui-avatars.com/api/?name=Anon'} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white">{comment.userName}</p>
                           <p className="text-[8px] text-gray-500 font-mono">{new Date(comment.createdAt?.seconds * 1000).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5">
                        <p className="text-xs text-gray-300 leading-relaxed">{comment.text}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {user ? (
                <form onSubmit={handleSubmitComment} className="relative">
                  <textarea 
                    placeholder="Contribute to the dialogue..."
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 pr-16 text-sm outline-none focus:border-singularity transition-colors min-h-[120px] resize-none"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <button 
                    disabled={submitting || !newComment.trim()}
                    className="absolute bottom-6 right-6 p-4 bg-singularity text-black rounded-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              ) : (
                <div className="p-6 glass rounded-[2rem] text-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Identity Verification Required</p>
                  <Link to="/auth" className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                    Login to Comment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
