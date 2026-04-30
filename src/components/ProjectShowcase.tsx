import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  author: string;
  likes: number;
  comments: number;
}

const SAMPLE_PROJECTS: ShowcaseProject[] = [
  {
    id: '1',
    name: 'Neo-Tokyo Arena',
    description: 'A futuristic Colosseum designed for massive holographic concerts and real-time duets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1920&auto=format&fit=crop',
    author: 'ZeroLayer',
    likes: 1240,
    comments: 89
  },
  {
    id: '2',
    name: 'Biolume Valley',
    description: 'A synesthetic terrain where every plant reacts to the user\'s vocal frequency.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920&auto=format&fit=crop',
    author: 'QuantumFlow',
    likes: 850,
    comments: 42
  },
  {
    id: '3',
    name: 'CyberVocaloid X',
    description: 'High-fidelity neural clone optimized for experimental J-Pop and liquid metal choreography.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=1920&auto=format&fit=crop',
    author: 'NeuralArchitect',
    likes: 2100,
    comments: 156
  },
  {
    id: '4',
    name: 'Aether Resonance',
    description: 'A quantum visualizer that translates deep space signals into geometric 3D art.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop',
    author: 'StellarMod',
    likes: 670,
    comments: 24
  }
];

export function ProjectShowcase() {
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SAMPLE_PROJECTS.map((project, i) => (
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
                  to={`/marketplace/${project.id}`}
                  className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest text-center hover:bg-singularity transition-colors"
                >
                  View Details
                </Link>
              </div>
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
                  <Heart className="w-3.5 h-3.5 hover:text-red-500 cursor-pointer transition-colors" /> {project.likes}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <MessageSquare className="w-3.5 h-3.5 hover:text-singularity cursor-pointer transition-colors" /> {project.comments}
                </div>
                <div className="ml-auto">
                    <ExternalLink className="w-4 h-4 text-gray-700 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
