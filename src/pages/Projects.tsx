import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Folder, Layers, History, Share2, Trash2, ExternalLink, Loader2, DollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ModelViewer } from '../components/ModelViewer';
import { GoogleMapBackground } from '../components/GoogleMapBackground';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  deadline?: string;
  modelUrl: string;
  ownerId: string;
  createdAt: any;
  layers?: string[];
  versions?: { id: string; name: string; modelUrl: string; timestamp: any }[];
  isMonetized?: boolean;
  assets?: { name: string; url: string; type: string; timestamp: any }[];
}

export function Projects() {
  const { user, currency } = useStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'Planning' | 'In Progress' | 'Review' | 'Completed'>('Planning');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newModelUrl, setNewModelUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    // Fetch profile containing projects
    fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.projects) {
          setProjects(data.projects);
        } else {
          setProjects([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProjectName) return;

    if (newModelUrl && !newModelUrl.toLowerCase().endsWith('.glb') && !newModelUrl.toLowerCase().endsWith('.gltf')) {
      setUrlError('Invalid URL format. Must end with .glb or .gltf');
      return;
    }
    setUrlError(null);

    setIsCreating(true);
    try {
      const newProj = {
        name: newProjectName,
        description: newProjectDescription,
        status: newProjectStatus,
        deadline: newProjectDeadline,
        modelUrl: newModelUrl || '',
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        layers: ['Base Layer'],
        versions: newModelUrl ? [{ id: 'v1', name: 'v1.0.0', modelUrl: newModelUrl, timestamp: new Date().toISOString() }] : [],
        isMonetized: false,
        assets: []
      };
      
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/user/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ project: newProj })
      });
      const data = await res.json();
      
      if (data.projects) {
        setProjects(data.projects);
      }
      setNewProjectName('');
      setNewProjectDescription('');
      setNewModelUrl('');
      setNewProjectDeadline('');
      setNewProjectStatus('Planning');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (selectedProject?.id === id) setSelectedProject(null);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleRevertVersion = async (version: { modelUrl: string }) => {
    if (!selectedProject) return;
    const updated = { ...selectedProject, modelUrl: version.modelUrl };
    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const [newVersionName, setNewVersionName] = useState('');

  const handleSaveVersion = async () => {
    if (!selectedProject || !newVersionName) return;
    const newVersion = {
      id: Date.now().toString(),
      name: newVersionName,
      modelUrl: selectedProject.modelUrl,
      timestamp: new Date().toISOString()
    };
    const updated = { ...selectedProject, versions: [...(selectedProject.versions || []), newVersion] };
    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setNewVersionName('');
  };

  const handleMonetize = async () => {
    if (!selectedProject) return;
    const price = window.prompt(`Enter price in ${currency} to list on Marketplace:`, "100");
    if (price && !isNaN(Number(price))) {
      try {
        const updated = { ...selectedProject, isMonetized: true, price: Number(price) };
        setSelectedProject(updated);
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        alert(`Project listed on Marketplace for ${price} ${currency}!`);
      } catch (error) {
        console.error('Failed to monetize project:', error);
      }
    }
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    alert("File uploads require Cloud Storage. Please use an external URL.");
  };


  const handleUpdateStatus = async (status: string) => {
    if (!selectedProject) return;
    const updated = { ...selectedProject, status: status as any };
    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
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
                required
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm"
              />
              <textarea 
                placeholder="Description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows={2}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm resize-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Status</label>
                  <select 
                    value={newProjectStatus}
                    onChange={(e) => setNewProjectStatus(e.target.value as any)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm text-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Deadline</label>
                  <input 
                    type="date"
                    value={newProjectDeadline}
                    onChange={(e) => setNewProjectDeadline(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm [color-scheme:dark]"
                  />
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Model URL (Optional GLB/GLTF)"
                value={newModelUrl}
                onChange={(e) => {
                  setNewModelUrl(e.target.value);
                  setUrlError(null);
                }}
                className={`w-full bg-black/50 border ${urlError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-singularity transition-colors text-sm`}
              />
              {urlError && <p className="text-red-500 text-xs">{urlError}</p>}
              <button 
                type="submit"
                disabled={isCreating || !newProjectName}
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
                    <span className="text-sm font-bold truncate flex items-center gap-2 group-hover:text-singularity transition-colors">
                      <div className={`w-2 h-2 rounded-full ${project.status === 'Completed' ? 'bg-green-500' : project.status === 'Review' ? 'bg-yellow-500' : project.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'}`} />
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
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-display font-black tracking-tighter uppercase">
                      {selectedProject.name}
                    </h1>
                    <select 
                      value={selectedProject.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest outline-none bg-black border ${
                        selectedProject.status === 'Completed' ? 'border-green-500 text-green-500' : 
                        selectedProject.status === 'Review' ? 'border-yellow-500 text-yellow-500' : 
                        selectedProject.status === 'In Progress' ? 'border-blue-500 text-blue-500' : 
                        'border-gray-500 text-gray-500'
                      }`}
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{selectedProject.description}</p>
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-500 flex flex-wrap gap-4">
                    <span>ID: {selectedProject.id}</span>
                    <span>Created: {selectedProject.createdAt ? new Date(selectedProject.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                    {selectedProject.deadline && <span>Deadline: <span className="text-red-400">{selectedProject.deadline}</span></span>}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
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
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-8">
                  {selectedProject.modelUrl ? (
                    <div className="aspect-square xl:aspect-auto xl:h-[500px]">
                      <ModelViewer />
                    </div>
                  ) : (
                    <div className="h-64 glass-card rounded-[3rem] flex items-center justify-center border-dashed">
                      <p className="text-gray-500 font-mono text-sm">NO 3D MODEL ASSIGNED YET</p>
                    </div>
                  )}

                  {/* ASSETS SECTION */}
                  <div className="glass-card rounded-[2rem] p-8">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Folder className="w-5 h-5 text-quantum" /> DESIGN ASSETS
                        </h3>
                        <label className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          {uploadingAsset ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          {uploadingAsset ? `${Math.round(uploadProgress)}%` : 'UPLOAD ASSET'}
                          <input type="file" className="hidden" onChange={handleAssetUpload} />
                        </label>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedProject.assets?.map((asset, idx) => (
                           <a 
                             key={idx} 
                             href={asset.url} 
                             target="_blank" 
                             rel="noreferrer"
                             className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition flex flex-col items-center text-center gap-2 group"
                           >
                              <div className="w-12 h-12 flex items-center justify-center bg-black/50 rounded-lg group-hover:scale-110 transition-transform">
                                {asset.type.startsWith('image/') ? (
                                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <Folder className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 truncate w-full break-all">{asset.name}</span>
                           </a>
                        ))}
                        {(!selectedProject.assets || selectedProject.assets.length === 0) && (
                          <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                            No assets uploaded yet. Add images, audio, or documents to your project.
                          </div>
                        )}
                     </div>
                  </div>
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
