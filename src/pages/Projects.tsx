import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Folder, Layers, History, Share2, Trash2, ExternalLink, Loader2, DollarSign, Coins } from 'lucide-react';
import { useStore } from '../store/useStore';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { ModelViewer } from '../components/ModelViewer';
import { GoogleMapBackground } from '../components/GoogleMapBackground';
import { useNavigate } from 'react-router-dom';
import { monitoringService } from '../services/monitoringService';

interface Project {
  id: string;
  name: string;
  modelUrl: string;
  ownerId: string;
  createdAt: any;
  layers?: string[];
  versions?: { id: string; name: string; modelUrl: string; timestamp: any }[];
  isMonetized?: boolean;
}

export function Projects() {
  const { user, currency } = useStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newModelUrl, setNewModelUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      setUrlError('Invalid file format. Must be .glb or .gltf');
      return;
    }
    setUrlError(null);

    setUploadingFile(true);
    try {
      const storageRef = ref(storage, `models/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setNewModelUrl(downloadURL);
      if (!newProjectName) setNewProjectName(file.name.replace(/\.[^/.]+$/, ""));
      monitoringService.success('3D model uploaded successfully');
    } catch (error) {
      console.error('Failed to upload model:', error);
      setUrlError('Failed to upload model to singularity storage.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProjectName || !newModelUrl) return;

    if (!newModelUrl.toLowerCase().endsWith('.glb') && !newModelUrl.toLowerCase().endsWith('.gltf')) {
      setUrlError('Invalid URL format. Must end with .glb or .gltf');
      return;
    }
    setUrlError(null);

    setIsCreating(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name: newProjectName,
        modelUrl: newModelUrl,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        layers: ['Base Layer'],
        versions: [{ id: 'v1', name: 'v1.0.0', modelUrl: newModelUrl, timestamp: serverTimestamp() }],
        isMonetized: false
      });
      setNewProjectName('');
      setNewModelUrl('');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        if (selectedProject?.id === id) setSelectedProject(null);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleRevertVersion = async (version: { modelUrl: string }) => {
    if (!selectedProject) return;
    await updateDoc(doc(db, 'projects', selectedProject.id), {
      modelUrl: version.modelUrl
    });
  };

  const [newVersionName, setNewVersionName] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishData, setPublishData] = useState({ 
    description: '', 
    category: 'Architecture',
    isNft: false,
    price: 100
  });

  const handlePublish = async () => {
    if (!selectedProject || !user) return;
    setIsPublishing(true);
    try {
      const showcaseRef = collection(db, 'showcaseProjects');
      await addDoc(showcaseRef, {
        projectId: selectedProject.id,
        userId: user.uid,
        creatorId: user.uid,
        name: selectedProject.name,
        description: publishData.description || selectedProject.name,
        category: publishData.category,
        thumbnailUrl: selectedProject.modelUrl.includes('unsplash') ? selectedProject.modelUrl : 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop', // Fallback thumbnail
        author: user.displayName || 'Anonymous',
        likes: 0,
        commentCount: 0,
        isForSale: publishData.isNft,
        price: publishData.isNft ? publishData.price : 0,
        nftTokenId: publishData.isNft ? `SNGR-${Math.random().toString(36).substring(2, 9).toUpperCase()}` : null,
        createdAt: serverTimestamp()
      });
      alert(publishData.isNft ? 'Project minted as NFT and published!' : 'Project published to Showcase!');
    } catch (error) {
      console.error('Failed to publish project:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!selectedProject || !newVersionName) return;
    const newVersion = {
      id: Date.now().toString(),
      name: newVersionName,
      modelUrl: selectedProject.modelUrl,
      timestamp: serverTimestamp()
    };
    await updateDoc(doc(db, 'projects', selectedProject.id), {
      versions: [...(selectedProject.versions || []), newVersion]
    });
    setNewVersionName('');
  };

  const handleMonetize = async () => {
    if (!selectedProject) return;
    const price = window.prompt(`Enter price in ${currency} to list on Marketplace:`, "100");
    if (price && !isNaN(Number(price))) {
      try {
        await updateDoc(doc(db, 'projects', selectedProject.id), {
          isMonetized: true,
          price: Number(price)
        });
        // In a real app, also create a marketplace listing document here
        alert(`Project listed on Marketplace for ${price} ${currency}!`);
      } catch (error) {
        console.error('Failed to monetize project:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-display font-black mb-4">ACCESS <span className="text-gradient">DENIED</span></h1>
        <p className="text-gray-400">Please login to manage your 3D projects.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <GoogleMapBackground />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-4 uppercase">PROJECT <span className="text-gradient">MANAGEMENT</span></h1>
          <p className="text-gray-400 font-light">Organize, version, and inspect your 3D assets in the Singularity cloud.</p>
        </div>
        <button 
          onClick={() => setSelectedProject(null)}
          className="px-6 py-3 glass rounded-full text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Folder className="w-4 h-4" /> ALL PROJECTS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Project List & Create */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[2rem] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-singularity" /> NEW PROJECT
            </h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input 
                type="text" 
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm"
              />
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Model URL (GLB/GLTF)"
                    value={newModelUrl}
                    onChange={(e) => {
                      setNewModelUrl(e.target.value);
                      setUrlError(null);
                    }}
                    className={`flex-1 bg-black/50 border ${urlError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm`}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".glb,.gltf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center min-w-[44px]"
                  >
                    {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin text-singularity" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center italic">Or upload GLB/GLTF directly</p>
              </div>

              {urlError && <p className="text-red-500 text-xs">{urlError}</p>}
              <button 
                type="submit"
                disabled={isCreating || uploadingFile || !newProjectName || !newModelUrl}
                className="w-full py-3 bg-singularity text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CREATE PROJECT'}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[2rem] p-6 max-h-[500px] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">MY PROJECTS</h2>
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-singularity" />
                </div>
              ) : projects.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No projects found.</p>
              ) : (
                projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group ${selectedProject?.id === project.id ? 'bg-singularity text-black' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <span className="text-sm font-bold truncate flex items-center gap-2">
                      {project.name}
                      {project.isMonetized && <DollarSign className="w-3 h-3 text-green-500" />}
                    </span>
                    <Trash2 
                      className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${selectedProject?.id === project.id ? 'text-black' : 'text-red-500'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                    />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main View: Project Details & 3D Viewer */}
        <div className="lg:col-span-3">
          {selectedProject ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-display font-black tracking-tighter uppercase mb-2">
                    {selectedProject.name}
                  </h1>
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-500">
                    ID: {selectedProject.id} • Created: {new Date(selectedProject.createdAt?.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate(`/studio?projectId=${selectedProject.id}`)}
                    className="px-8 py-3 bg-white text-black font-bold rounded-xl text-xs tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    OPEN IN STUDIO
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="p-3 glass rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 3D Viewer */}
                <div className="xl:col-span-2 aspect-square xl:aspect-auto xl:h-[600px]">
                  <ModelViewer projectId={selectedProject.id} />
                </div>

                {/* Project Controls */}
                <div className="space-y-6">
                  <div className="glass-card rounded-[2rem] p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-quantum" /> LAYERS
                    </h3>
                    <div className="space-y-3">
                      {selectedProject.layers?.map((layer, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                          <span className="text-sm font-medium">{layer}</span>
                          <div className="w-4 h-4 rounded-full bg-singularity" />
                        </div>
                      ))}
                      <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-xs text-gray-400 hover:border-singularity hover:text-singularity transition-all">
                        + ADD LAYER
                      </button>
                    </div>
                  </div>

                  <div className="glass-card rounded-[2rem] p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <History className="w-5 h-5 text-reality" /> VERSIONS
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="Version Name"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-singularity transition-colors text-sm"
                      />
                      <button 
                        onClick={handleSaveVersion}
                        className="px-4 py-2 bg-singularity text-black font-bold rounded-xl hover:opacity-90 transition-opacity text-xs"
                      >
                        SAVE
                      </button>
                    </div>
                    <div className="space-y-3">
                      {selectedProject.versions?.map((version) => (
                        <div key={version.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                          <span className="text-sm font-mono">{version.name}</span>
                          <button 
                            onClick={() => handleRevertVersion(version)}
                            className="text-[10px] text-singularity hover:text-white uppercase"
                          >
                            REVERT
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-white text-black rounded-2xl font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" /> SHARE
                      </button>
                      <button className="p-4 glass rounded-2xl hover:bg-white/10 transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {!selectedProject.isMonetized ? (
                      <button 
                        onClick={handleMonetize}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-5 h-5" /> Monetize Project
                      </button>
                    ) : (
                      <div className="w-full py-4 glass text-green-500 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 border border-green-500/30">
                        <DollarSign className="w-5 h-5" /> Listed on Marketplace
                      </div>
                    )}

                    <div className="glass-card rounded-2xl p-6 border border-singularity/20">
                      <h4 className="text-xs font-bold text-singularity uppercase tracking-widest mb-4">Showcase Publication</h4>
                      <textarea 
                        placeholder="Add a description for the showcase..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-xs mb-3 min-h-[80px]"
                        value={publishData.description}
                        onChange={e => setPublishData(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <select 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-xs mb-3"
                        value={publishData.category}
                        onChange={e => setPublishData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option>Architecture</option>
                        <option>Character Art</option>
                        <option>Environment</option>
                        <option>Sci-Fi</option>
                        <option>Abstract</option>
                      </select>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2">
                             <Coins className="w-4 h-4 text-reality" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Mint as NFT</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={publishData.isNft}
                            onChange={e => setPublishData(prev => ({ ...prev, isNft: e.target.checked }))}
                            className="w-4 h-4 accent-singularity"
                          />
                        </div>
                        
                        {publishData.isNft && (
                          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price ({currency})</span>
                            <input 
                               type="number"
                               value={publishData.price}
                               onChange={e => setPublishData(prev => ({ ...prev, price: Number(e.target.value) }))}
                               className="flex-1 bg-transparent text-right outline-none text-xs font-mono font-bold"
                            />
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="w-full py-3 bg-singularity text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                      >
                         {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                         {publishData.isNft ? 'MINT & PUBLISH' : 'PUBLISH TO SHOWCASE'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] glass-card rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
                <Folder className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">SELECT A PROJECT</h2>
              <p className="text-gray-500 max-w-md">
                Choose a project from the sidebar to inspect its 3D depth data, manage layers, and collaborate with your team.
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
