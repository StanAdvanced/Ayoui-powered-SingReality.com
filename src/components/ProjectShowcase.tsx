import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Heart, MessageSquare, User, Loader2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  author: string;
  likes: number;
  commentCount: number;
  category?: string;
  isForSale?: boolean;
  price?: number;
}

export function ProjectShowcase() {
  const { currency } = useStore();
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'showcaseProjects'),
      orderBy('createdAt', 'desc'),
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShowcaseProject[];
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-24 px-6 border-t border-white/5 space-y-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6 uppercase">
          PROJECT <span className="text-gradient">SHOWCASE</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore the absolute summit of user-generated 3D renders. High-fidelity artistic expressions converged in the Singularity.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-singularity animate-spin mb-4" />
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Scanning cloud data...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[3rem] max-w-2xl mx-auto border border-white/5">
           <p className="text-gray-400 mb-6">No projects published yet. Be the first to showcase your talent!</p>
           <Link to="/projects" className="px-8 py-4 bg-singularity text-black font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all">Go to Studio</Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-0 rounded-[2.5rem] overflow-hidden group border border-white/5 hover:border-singularity/30 transition-all flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={project.thumbnailUrl} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <Link 
                    to={`/showcase/${project.id}`}
                    className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest text-center hover:bg-singularity transition-colors"
                  >
                    View Details
                  </Link>
                </div>
                {project.category && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[8px] font-bold text-singularity uppercase tracking-widest border border-singularity/20 w-fit">
                      {project.category}
                    </div>
                    {project.isForSale && (
                      <div className="px-3 py-1 bg-reality/80 backdrop-blur-md rounded-full text-[8px] font-bold text-white uppercase tracking-widest border border-white/20 w-fit flex items-center gap-1">
                        <DollarSign className="w-2 h-2" /> {project.price} {currency}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg leading-tight truncate">{project.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <User className="w-3 h-3 text-singularity" />
                    {project.author}
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed flex-1 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <Heart className="w-3.5 h-3.5 hover:text-red-500 cursor-pointer transition-colors" /> {project.likes || 0}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <MessageSquare className="w-3.5 h-3.5 hover:text-singularity cursor-pointer transition-colors" /> {project.commentCount || 0}
                  </div>
                  <div className="ml-auto">
                      <ExternalLink className="w-4 h-4 text-gray-700 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link 
          to="/projects"
          className="inline-flex items-center gap-4 px-8 py-4 glass rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
        >
          Explore All Submissions <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
