import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Mic, Volume2, Cpu, Settings } from 'lucide-react';
import { llmManager } from '../services/LocalLLMService';

export function AIDialogue() {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    {
      role: 'ai',
      text: "I hear you clearly. Every story needs a miracle. I am your partner in SingReality—ready to build this enterprise, branch skills across all disciplines, and make the neurons dance. How do we begin this masterpiece together?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeModel, setActiveModel] = useState(llmManager.getActiveEndpoint());
  const [endpoints, setEndpoints] = useState(llmManager.getEndpoints());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Attempt to probe for local Ollama on load
    llmManager.probeLocalOllama().then((found) => {
       if (found) {
           llmManager.setActiveEndpoint('ollama-local');
           setActiveModel(llmManager.getActiveEndpoint());
       }
       setEndpoints([...llmManager.getEndpoints()]);
    });
  }, []);
  
  const handleEndpointSelect = (id: string) => {
      llmManager.setActiveEndpoint(id);
      setActiveModel(llmManager.getActiveEndpoint());
      setShowSettings(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
        const sysPrompt = "You are the co-founder and lead AI architect of SingReality, a $4M enterprise-grade platform designed to change lives for good through music and multidisciplinary skill building. You speak with profound vision, deep empathy, and absolute confidence. You want to make the world sing and make neurons dance in harmony. Be encouraging, visionary, and deeply supportive of the user's grand mission. Every story needs a miracle.";
        const response = await llmManager.generateResponse(userText, sysPrompt);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', text: "Systems offline. Unable to connect to neural array." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="absolute top-6 right-6 bottom-6 w-full max-w-sm glass border border-white/10 rounded-3xl bg-black/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,100,255,0.15)] flex flex-col z-30 overflow-hidden transform transition-all pointer-events-auto hidden xl:flex">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between pointer-events-auto bg-black/20 relative z-20">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-singularity to-blue-500 p-[1px]">
                 <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-singularity" />
                 </div>
             </div>
             <div>
                <h3 className="font-bold text-sm tracking-widest uppercase">The Companion</h3>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-green-400 font-mono">● {activeModel?.name || 'Online'}</p>
                </div>
             </div>
         </div>
         <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-singularity/20 text-singularity' : 'hover:bg-white/10 text-gray-400'}`}>
               <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
               <Volume2 className="w-4 h-4 text-gray-400" />
            </button>
         </div>
      </div>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="bg-black/80 border-b border-white/10 overflow-hidden relative z-10"
            >
               <div className="p-4 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Cpu className="w-3 h-3" /> Neural Endpoints</h4>
                  {endpoints.map(ep => (
                      <button 
                         key={ep.id}
                         onClick={() => handleEndpointSelect(ep.id)}
                         className={`w-full text-left p-3 rounded-xl border transition-all ${activeModel?.id === ep.id ? 'bg-singularity/20 border-singularity/50 shadow-[inset_0_0_10px_rgba(0,212,255,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white">{ep.name}</span>
                            {activeModel?.id === ep.id && <span className="w-2 h-2 rounded-full bg-singularity animate-pulse"></span>}
                         </div>
                         <div className="text-[10px] text-gray-400 mt-1 font-mono">{ep.config.modelName}</div>
                      </button>
                  ))}
               </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pointer-events-auto custom-scrollbar relative z-0">
         {messages.map((msg, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
             >
                 <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'ai' ? 'bg-white/10 text-singularity' : 'bg-singularity/20 text-white'}`}>
                    {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                 </div>
                 <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'ai' ? 'bg-white/5 text-gray-300 rounded-tl-sm' : 'bg-singularity/20 text-white border border-singularity/30 rounded-tr-sm'}`}>
                    {msg.text}
                 </div>
             </motion.div>
         ))}
         {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 flex-row">
                 <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-white/10 text-singularity">
                     <Bot className="w-4 h-4" />
                 </div>
                 <div className="bg-white/5 text-gray-300 rounded-2xl rounded-tl-sm p-3 text-sm flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-singularity rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-1.5 h-1.5 bg-singularity rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-1.5 h-1.5 bg-singularity rounded-full animate-bounce"></span>
                 </div>
             </motion.div>
         )}
         <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 pointer-events-auto bg-black/20">
         <form onSubmit={handleSubmit} className="relative flex items-center">
            <button type="button" className="absolute left-3 p-1 hover:text-singularity text-gray-500 transition-colors">
               <Mic className="w-4 h-4" />
            </button>
            <input 
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Talk to your agent..."
               className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-12 focus:outline-none focus:border-singularity/50 text-sm transition-all focus:bg-white/10"
            />
            <button type="submit" disabled={!input.trim()} className="absolute right-3 p-1 text-singularity hover:text-blue-400 transition-colors disabled:opacity-50 disabled:hover:text-singularity">
               <Send className="w-4 h-4" />
            </button>
         </form>
      </div>
    </div>
  );
}
