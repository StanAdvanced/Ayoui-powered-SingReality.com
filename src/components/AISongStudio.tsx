import React, { useState, useEffect } from 'react';
import { AISongSincvEngine, BiometricData } from '../services/aisongSincvEngine';
import { motion } from 'framer-motion';
import { Brain, Zap, Music, Play, Pause, Sparkles, Volume2, Save, FolderOpen, Loader2, Trash2 } from 'lucide-react';
import { generateBgmRecipe, generateSpeech } from '../services/geminiService';
import { playSpark, SparkRecipe } from '../lib/audioEngine';
import { YouTubeBackground } from './YouTubeBackground';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { useStore } from '../store/useStore';

interface SavedSession {
  id: string;
  bgmPrompt: string;
  bgmRecipe: SparkRecipe;
  biometricData: BiometricData;
  createdAt: Timestamp;
}

export function AISongStudio() {
  const { user } = useStore();
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [biometricData, setBiometricData] = useState<BiometricData>({
    heartRate: 70,
    alphaWave: 0.5,
    thetaWave: 0.5,
    timestamp: Date.now()
  });

  const [bgmPrompt, setBgmPrompt] = useState('');
  const [isGeneratingBgm, setIsGeneratingBgm] = useState(false);
  const [bgmRecipe, setBgmRecipe] = useState<SparkRecipe | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  useEffect(() => {
    if (isSynthesizing) {
      const engine = AISongSincvEngine.getInstance();
      const interval = setInterval(() => {
        const newData = {
          heartRate: 70 + Math.random() * 10,
          alphaWave: Math.random(),
          thetaWave: Math.random(),
          timestamp: Date.now()
        };
        setBiometricData(newData);
        engine.synthesize(newData);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSynthesizing]);

  const handleToggle = async () => {
    const engine = AISongSincvEngine.getInstance();
    if (isSynthesizing) {
      engine.stopSynthesis();
      setIsSynthesizing(false);
    } else {
      setIsSynthesizing(true);
      await engine.startSynthesis();
      await engine.synthesize(biometricData);
    }
  };

  const handleGenerateBgm = async () => {
    if (!bgmPrompt) return;
    setIsGeneratingBgm(true);
    const newRecipe = await generateBgmRecipe(bgmPrompt, biometricData);
    if (newRecipe) {
      setBgmRecipe(newRecipe);
    }
    setIsGeneratingBgm(false);
  };

  const handlePlayBgm = async () => {
    if (bgmRecipe) {
      await playSpark(bgmRecipe);
    }
  };

  const handleSpeakBgmDescription = async () => {
    if (bgmRecipe) {
      const description = `The background music is set to ${bgmRecipe.synthType} synthesis style at a tempo of ${bgmRecipe.tempo} beats per minute. ${bgmRecipe.notes.length} musical notes are scheduled in the sequence.`;
      const audioBase64 = await generateSpeech(description);
      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const buffer = audioContext.createBuffer(1, bytes.length / 2, 24000);
        const channelData = buffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);
        
        for (let i = 0; i < buffer.length; i++) {
            channelData[i] = dataView.getInt16(i * 2, true) / 32768;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      } else {
        // Fallback to Browser SpeechSynthesis if Gemini TTS fails (e.g. 403 Permission Denied)
        console.warn("Gemini TTS failed or unauthorized. Falling back to native SpeechSynthesis.");
        const utterance = new SpeechSynthesisUtterance(description);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const saveSession = async () => {
    if (!user || !bgmRecipe) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'aiSongStudioSessions'), {
        userId: user.uid,
        bgmPrompt,
        bgmRecipe,
        biometricData,
        createdAt: serverTimestamp(),
      });
      alert('Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadSessions = async () => {
    if (!user) return;
    setIsLoadingSessions(true);
    try {
      const q = query(
        collection(db, 'aiSongStudioSessions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedSession[];
      setSavedSessions(sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteDoc(doc(db, 'aiSongStudioSessions', id));
      setSavedSessions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const selectSession = (session: SavedSession) => {
    setBgmPrompt(session.bgmPrompt);
    setBgmRecipe(session.bgmRecipe);
    setBiometricData(session.biometricData);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative">
      <YouTubeBackground videoId="DWcJFNfaw9c" opacity={0.2} />
      <div className="min-h-screen p-12 relative z-10">
      <h1 className="text-6xl font-display font-black tracking-tighter mb-12">
        AISong <span className="text-gradient">Sincv Engine</span>
      </h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div className="glass-card p-12 rounded-[3rem] border border-white/5">
            <Brain className="w-16 h-16 text-singularity mb-8" />
            <h2 className="text-3xl font-bold mb-4">Neural Flow State</h2>
            <p className="text-gray-400 mb-8">Real-time biometric modulation of latent space audio diffusion.</p>
            <button 
              onClick={handleToggle}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 ${isSynthesizing ? 'bg-red-500' : 'bg-singularity text-black'}`}
            >
              {isSynthesizing ? <Pause /> : <Play />} {isSynthesizing ? 'Stop Synthesis' : 'Start Studio'}
            </button>
          </div>

          <div className="glass-card p-12 rounded-[3rem] border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-quantum"/> AI Background Music
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    if (!isMenuOpen) loadSessions();
                  }}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  title="Load Saved Sessions"
                >
                  <FolderOpen className="w-5 h-5" />
                </button>
                {bgmRecipe && (
                  <button 
                    onClick={saveSession}
                    disabled={isSaving || !user}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30"
                    title="Save Current Session"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>

            {isMenuOpen && (
              <div className="mb-8 p-6 bg-black/40 rounded-2xl border border-white/10">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Saved Neural States</h4>
                {isLoadingSessions ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-singularity" />
                  </div>
                ) : savedSessions.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4 italic">No saved sessions found.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {savedSessions.map((session) => (
                      <div 
                        key={session.id}
                        onClick={() => selectSession(session)}
                        className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-singularity/50 transition-all cursor-pointer group flex justify-between items-center"
                      >
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[200px] mb-1">{session.bgmPrompt}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {session.createdAt?.toDate ? session.createdAt.toDate().toLocaleString() : 'Just now'}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => deleteSession(session.id, e)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-gray-400 mb-6">
              Generate dynamic background music based on a prompt and your current biometric state.
            </p>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Describe a vibe (e.g., Cyberpunk rainy night)" 
                value={bgmPrompt}
                onChange={e => setBgmPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-quantum outline-none text-sm"
              />
              <button 
                onClick={handleGenerateBgm}
                disabled={isGeneratingBgm}
                className="w-full bg-quantum text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGeneratingBgm ? 'Generating BGM...' : 'Generate BGM'}
              </button>

              {bgmRecipe && (
                <div className="mt-6 p-6 bg-black/30 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-xs font-mono text-singularity uppercase tracking-widest block mb-1">Synth: {bgmRecipe.synthType}</span>
                      <span className="text-xs font-mono text-reality uppercase tracking-widest block">BPM: {bgmRecipe.tempo}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handlePlayBgm} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                          <Play className="w-5 h-5 ml-1" />
                        </button>
                        <button onClick={handleSpeakBgmDescription} className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                          <Volume2 className="w-5 h-5" />
                        </button>
                    </div>
                  </div>
                  <div className="h-32 overflow-y-auto font-mono text-xs text-gray-400 space-y-2 pr-2">
                    {bgmRecipe.notes.map((n, i) => (
                      <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                        <span className="w-1/3">Note: <span className="text-white">{n.note}</span></span>
                        <span className="w-1/3 text-center">Time: <span className="text-white">{n.time}</span></span>
                        <span className="w-1/3 text-right">Dur: <span className="text-white">{n.duration}</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[3rem] border border-white/5 font-mono text-sm h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-6">Biometric Stream</h3>
          <div className="space-y-6 text-gray-400">
             <div>
              <div className="flex justify-between mb-2">
                <span>Heart Rate</span>
                <span className="text-white">{biometricData?.heartRate?.toFixed(1) || '0.0'} BPM</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <motion.div 
                  className="h-full bg-red-500 rounded-full"
                  animate={{ width: `${((biometricData?.heartRate || 0) / 150) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span>Alpha Wave</span>
                <span className="text-white">{biometricData?.alphaWave?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <motion.div 
                  className="h-full bg-quantum rounded-full"
                  animate={{ width: `${(biometricData?.alphaWave || 0) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Theta Wave</span>
                <span className="text-white">{biometricData?.thetaWave?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <motion.div 
                  className="h-full bg-singularity rounded-full"
                  animate={{ width: `${(biometricData?.thetaWave || 0) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
