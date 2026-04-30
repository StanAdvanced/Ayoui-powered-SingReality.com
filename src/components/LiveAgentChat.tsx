import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, User, Headset, Mic, MicOff, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'agent', text: "Hi! I'm Aura, your AI Service Specialist. Let me know if you need any help with SingReality Marketplace, Developer tools, or Karaoke.", type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isAvatarMode, setIsAvatarMode] = useState(false);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: input, type: 'text' }]);
    setInput('');
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: "I've created a ticket #TK-830 for your request. An enterprise human agent will take over if needed, but I'm here to solve it quickly!", 
        type: 'text' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden text-sm"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                    <Headset className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a1a]" />
                </div>
                <div>
                  <div className="text-white font-bold text-xs">Live Support</div>
                  <div className="text-[9px] text-cyan-400 uppercase tracking-widest">AI Specialist Mode</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsAvatarMode(!isAvatarMode)} className="text-gray-400 hover:text-white transition-colors" title="Toggle Visual Avatar">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Avatar Video Feed (Simulated) */}
            <AnimatePresence>
              {isAvatarMode && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 160, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-black relative border-b border-white/10 overflow-hidden"
                >
                  {/* Simulate 3D Avatar Feed */}
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-luminosity" alt="Avatar Space" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 rounded-full bg-cyan-500/20 animate-pulse border border-cyan-500/50 flex items-center justify-center backdrop-blur-md">
                       <Headset className="w-8 h-8 text-cyan-300" />
                     </div>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1 bg-cyan-400 animate-bounce" style={{ height: `${Math.random() * 10 + 5}px`, animationDelay: `${i*0.1}s`}} />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="p-4 h-[300px] overflow-y-auto flex flex-col gap-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-500/20 text-cyan-50 rounded-br-sm border border-cyan-500/30'
                      : 'bg-white/5 text-gray-200 rounded-bl-sm border border-white/10'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`p-2 rounded-full transition-colors ${isVoiceMode ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <form onSubmit={sendMessage} className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isVoiceMode ? "Listening..." : "Type your message..."}
                  className="w-full bg-white/5 rounded-full px-4 py-2 text-xs text-white border border-white/10 focus:border-cyan-500/50 outline-none"
                  disabled={isVoiceMode}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400 p-1 hover:scale-110 transition-transform">
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center text-white border border-white/20 relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-[#050510] flex items-center justify-center text-[8px] font-bold">1</span>
        )}
      </motion.button>
    </div>
  );
}
