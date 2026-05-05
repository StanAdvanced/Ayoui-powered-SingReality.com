import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, Award, Music, Trophy, Edit2, Save, X, Camera, BarChart2, AlertCircle, Cpu, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { soundService } from '../services/soundService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { YouTubeBackground } from '../components/YouTubeBackground';
import { handleFirestoreError, OperationType } from '../firebase';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
  preferredMusicGenres?: string[];
  singingHistory?: { song: string; date: any; score: number }[];
  rewards?: { name: string; icon: string }[];
}

import { UserAvatar } from '../components/UserAvatar';

export function Profile() {
  const { user, isAuthReady, resonance, biometricSync, setBiometricSync } = useStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    photoURL: '',
    preferredMusicGenres: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setError(null);
      const path = `users/${user.uid}`;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data() as UserProfile;
          setProfile(data);
          setEditForm({
            displayName: data.displayName || '',
            bio: data.bio || '',
            photoURL: data.photoURL || '',
            preferredMusicGenres: data.preferredMusicGenres?.join(', ') || ''
          });
        } else {
          setError("Profile not found in our neural database.");
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
        setError("Failed to sync with the neural network.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isAuthReady]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `profile_images/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setEditForm(prev => ({ ...prev, photoURL: downloadURL }));
      soundService.playSuccess();
    } catch (err) {
      console.error("Error uploading image:", err);
      soundService.playError();
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    soundService.playClick();
    const path = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedData = {
        displayName: editForm.displayName,
        bio: editForm.bio,
        photoURL: editForm.photoURL,
        preferredMusicGenres: editForm.preferredMusicGenres.split(',').map(g => g.trim()).filter(g => g !== '')
      };
      await updateDoc(userRef, updatedData);
      setProfile({ ...profile, ...updatedData });
      setIsEditing(false);
      soundService.playSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
      soundService.playError();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (biometricSync.active) {
      const interval = setInterval(() => {
        const jitterHR = Math.floor(Math.random() * 5) - 2;
        const jitterStress = (Math.random() * 0.04) - 0.02;
        
        setBiometricSync({
          heartRate: Math.min(180, Math.max(60, biometricSync.heartRate + jitterHR)),
          stressLevel: Math.min(1, Math.max(0, biometricSync.stressLevel + jitterStress))
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [biometricSync.active, biometricSync.heartRate, biometricSync.stressLevel]);

  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.15} />
        <div className="relative z-10 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-singularity mx-auto mb-4" />
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-gray-400">Syncing Neural Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.15} />
        <div className="relative z-10 text-center glass p-12 rounded-[3rem] border border-white/10">
          <AlertCircle className="w-12 h-12 text-reality mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-8">Please activate your conduit to view your neural profile.</p>
          <button 
            onClick={() => useStore.getState().login()}
            className="px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all"
          >
            Activate Conduit
          </button>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.15} />
        <div className="relative z-10 text-center glass p-12 rounded-[3rem] border border-white/10">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Neural Sync Error</h2>
          <p className="text-gray-400 mb-8">{error || "The profile could not be retrieved from the singularity."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 glass rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  // Analytics Calculations
  const history = profile.singingHistory || [];
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) 
    : 0;
  
  const chartData = history.map((h, i) => ({
    name: `Session ${i + 1}`,
    score: h.score
  }));

  return (
    <div className="min-h-screen relative">
      <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.15} />
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
      <div className="glass-card rounded-[3rem] p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-6 right-6">
          {!isEditing ? (
            <button 
              onClick={() => { soundService.playClick(); setIsEditing(true); }}
              className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
            >
              <Edit2 className="w-5 h-5 text-gray-400" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => { soundService.playClick(); setIsEditing(false); setEditForm({ displayName: profile.displayName || '', bio: profile.bio || '', photoURL: profile.photoURL || '', preferredMusicGenres: profile.preferredMusicGenres?.join(', ') || '' }); }}
                className="p-3 glass rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="p-3 bg-singularity text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group cursor-pointer w-32 h-32" onClick={() => isEditing && fileInputRef.current?.click()}>
            <div className={uploadingImage ? 'opacity-50' : ''}>
              <UserAvatar 
                user={isEditing ? { ...profile, photoURL: editForm.photoURL } : profile} 
                size="xl" 
              />
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                {uploadingImage ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Display Name</label>
                  <input 
                    type="text" 
                    value={editForm.displayName}
                    onChange={e => setEditForm({...editForm, displayName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-singularity outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Avatar URL</label>
                  <input 
                    type="text" 
                    value={editForm.photoURL}
                    onChange={e => setEditForm({...editForm, photoURL: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-singularity outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Bio</label>
                  <textarea 
                    value={editForm.bio}
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-singularity outline-none min-h-[100px] resize-none"
                    placeholder="Tell the singularity about yourself..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Preferred Genres</label>
                  <input 
                    type="text" 
                    value={editForm.preferredMusicGenres}
                    onChange={e => setEditForm({...editForm, preferredMusicGenres: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-singularity outline-none"
                    placeholder="Pop, Rock, Jazz..."
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-2">{profile.displayName || 'Anonymous Artist'}</h1>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                <p className="text-gray-300 max-w-lg mb-4">{profile.bio || 'No bio provided yet.'}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredMusicGenres?.map((genre, i) => (
                    <span key={i} className="px-3 py-1 bg-singularity/20 text-singularity rounded-full text-xs font-bold uppercase">{genre}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="glass-card rounded-[2rem] p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Music className="w-5 h-5 text-singularity" /> Singing History</h2>
          <div className="space-y-4">
            {profile.singingHistory && profile.singingHistory.length > 0 ? profile.singingHistory.map((history, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-singularity/30 transition-colors">
                <div>
                  <div className="font-semibold">{history.song}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {history.date?.seconds ? new Date(history.date.seconds * 1000).toLocaleDateString() : 'Recent Session'}
                  </div>
                </div>
                <span className="text-singularity font-mono font-bold">{history.score} pts</span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No singing history yet.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy className="w-5 h-5 text-quantum" /> Earned Rewards</h2>
          <div className="grid grid-cols-2 gap-4">
            {profile.rewards && profile.rewards.length > 0 ? profile.rewards.map((reward, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl text-center">
                <div className="text-4xl mb-2">{reward.icon}</div>
                <div className="text-sm font-bold">{reward.name}</div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm col-span-2">No rewards earned yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-singularity" /> 
              Neural Biometric Integration
            </h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Connect your physical essence to the Nexus</p>
          </div>
          
          <button 
            onClick={() => {
              const newState = !biometricSync.active;
              setBiometricSync({ active: newState });
              if (newState) soundService.playSuccess();
              else soundService.playTransition();
            }}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
              biometricSync.active 
                ? 'bg-singularity text-black shadow-[0_0_20px_rgba(0,255,159,0.4)]' 
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {biometricSync.active ? (
              <><Zap className="w-4 h-4 animate-pulse" /> Sync Active</>
            ) : (
              <><Activity className="w-4 h-4" /> Initialize Sync</>
            )}
          </button>
        </div>

        {biometricSync.active && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 glass rounded-2xl border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Neural Heart Rate</div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-display font-bold text-white leading-none">
                  {biometricSync.heartRate}
                </div>
                <div className="text-sm text-reality font-bold uppercase tracking-widest pb-1 animate-pulse">BPM</div>
              </div>
              <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-singularity"
                  initial={{ width: 0 }}
                  animate={{ width: `${(biometricSync.heartRate / 200) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 glass rounded-2xl border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Singularity Stress Factor</div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-display font-bold text-white leading-none">
                  {(biometricSync.stressLevel * 100).toFixed(0)}
                </div>
                <div className="text-sm text-quantum font-bold uppercase tracking-widest pb-1">%</div>
              </div>
              <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-quantum"
                  initial={{ width: 0 }}
                  animate={{ width: `${biometricSync.stressLevel * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-[2rem] p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-singularity" /> Advanced Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white/5 rounded-xl text-center">
            <div className="text-3xl font-display font-bold text-singularity mb-2">{averageScore}</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest">Average Score</div>
          </div>
          <div className="p-6 bg-white/5 rounded-xl text-center">
            <div className="text-3xl font-display font-bold text-quantum mb-2">{resonance.toLocaleString()}</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest">Total Resonance</div>
          </div>
          <div className="p-6 bg-white/5 rounded-xl text-center">
            <div className="text-3xl font-display font-bold text-reality mb-2">
              {profile.preferredMusicGenres?.[0] || 'N/A'}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest">Top Genre</div>
          </div>
        </div>

        <div className="h-64 w-full">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} />
                <YAxis stroke="#ffffff50" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Line type="monotone" dataKey="score" stroke="#00f0ff" strokeWidth={3} dot={{ fill: '#00f0ff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Not enough data for trend analysis.
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Award className="w-5 h-5 text-singularity" /> My NFT Collectibles</h2>
          <button onClick={() => window.location.href = '/nft-collectibles'} className="px-4 py-2 border border-white/20 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-colors">
            View Marketplace
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 1, title: 'VR Festival Ticket 2026', type: 'Ticket', image: 'https://images.unsplash.com/photo-1470229722913-7c090b332da8?auto=format&fit=crop&w=400&q=80' },
            { id: 2, title: 'Neural Synth Bass', type: 'Stem', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' },
            { id: 3, title: 'Genesis Track #102', type: 'Music', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80' },
            { id: 4, title: 'Cyberpunk Skin', type: 'Avatar', image: 'https://images.unsplash.com/photo-1516280440502-a2fc994606cf?auto=format&fit=crop&w=400&q=80' },
          ].map(nft => (
            <div key={nft.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
              <img src={nft.image} alt={nft.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] uppercase font-bold text-singularity tracking-widest mb-1">{nft.type}</span>
                <span className="font-bold text-sm text-white truncate">{nft.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
