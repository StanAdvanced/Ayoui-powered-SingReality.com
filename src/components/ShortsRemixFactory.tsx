import React, { useState } from 'react';
import { Youtube, Layers, Scissors, Check, Play, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export function ShortsRemixFactory() {
    const [status, setStatus] = useState(0);

    const startRemix = () => {
        setStatus(1);
        setTimeout(() => setStatus(2), 2000);
        setTimeout(() => setStatus(3), 4000);
        setTimeout(() => setStatus(4), 6000);
        setTimeout(() => setStatus(5), 8000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 md:px-12 relative overflow-hidden font-inter">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4 mb-16">
                    <Youtube className="w-16 h-16 text-red-500 mx-auto" />
                    <h1 className="text-4xl md:text-5xl font-heading font-black">
                        YouTube Shorts Auto-Remix
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Grok Multi-Agent 4.20 autonomously monitors your live performances. It identifies the 15-second viral hook, generates stylized B-roll via Gemini 2.5 Flash, edits it, and auto-publishes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                        <div className="bg-black/50 aspect-video rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1540039155732-d674d6e3f0be?q=80&w=800&auto=format&fit=crop" className="opacity-50 absolute inset-0 object-cover w-full h-full" alt="Stage" />
                            <div className="z-10 flex flex-col items-center">
                                <Play className="w-12 h-12 text-white/50" />
                                <p className="text-white/50 font-bold mt-2">Live Performance Recording</p>
                            </div>
                        </div>

                        <button 
                            onClick={startRemix}
                            disabled={status > 0}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Settings className={`w-5 h-5 ${status > 0 && status < 5 ? 'animate-spin' : ''}`} />
                            {status === 0 ? 'Initialize Auto-Remix' : status === 5 ? 'Process Completed' : 'Remixing...'}
                        </button>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {[
                                { text: "Scanning audio for viral hook (Content ID Match)", icon: Scissors, state: 1 },
                                { text: "Gemini 2.5 Flash generating storyboard B-roll", icon: Layers, state: 2 },
                                { text: "Compositing AR overlays & AI Visuals (FFmpeg)", icon: Play, state: 3 },
                                { text: "Uploading to YouTube Shorts endpoints", icon: Youtube, state: 4 },
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-500
                                        ${status > step.state ? 'bg-green-500 border-green-500 text-black' : 
                                            status === step.state ? 'bg-red-500 border-red-500 text-white animate-pulse' : 
                                            'bg-transparent border-gray-700 text-gray-700'}`}>
                                        {status > step.state ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-sm ${status >= step.state ? 'text-gray-200' : 'text-gray-600'}`}>{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center relative">
                        <div className="w-[300px] h-[533px] bg-black border-4 border-gray-800 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center">
                            {status < 3 && (
                                <div className="text-gray-600 font-mono text-xs text-center px-6">
                                    Waiting for Remix...<br/>
                                    Agent Swarm standing by.
                                </div>
                            )}
                            {status >= 3 && (
                                <div className="absolute inset-0 bg-red-900/40 z-0 animate-pulse"></div>
                            )}
                            {status >= 4 && (
                                <div className="absolute inset-0 flex items-center justify-center flex-col z-10 px-4 text-center">
                                    <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 object-cover w-full h-full opacity-60" alt="Generated" />
                                    <div className="z-10 bg-black/60 p-4 rounded-xl backdrop-blur-md">
                                        <h3 className="text-xl font-bold text-white mb-2 font-heading">Neon Dreams (Remix)</h3>
                                        <p className="text-xs text-gray-300">Auto-generated via Grok 4.20 & Gemini Vision.</p>
                                        <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                                            <span>VIEWS: 0</span>
                                            <span>UPLOADING...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {status === 5 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-2 rounded-full font-bold text-sm z-20 flex items-center gap-2 shadow-lg shadow-green-500/50">
                                    <Check className="w-4 h-4" /> Published to Shorts
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
