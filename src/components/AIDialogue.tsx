import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Send, Mic, Volume2 } from 'lucide-react';

export function AIDialogue() {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    {
      role: 'ai',
      text: "Yo! Welcome to the nexus. I'm your SingReality companion, tuned to the hyper-frequencies of global stardom. Ready to melt some minds?"
    }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getMockResponse(input) }]);
    }, 1000);
  };

  const getMockResponse = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes('music') || lower.includes('create')) {
        return "That's the spirit. Our generative engines map directly to your neural intent. Less clicking, more manifesting. Let's make a platinum streak right here, right now.";
    }
    if (lower.includes('sales') || lower.includes('money') || lower.includes('monetize')) {
        return "Cash flow is just energy flow, right? We've got automated distribution funnels hooking into global TikTok and local radios across Tokyo simultaneously. I'll make sure you're properly indexed for maximum impact.";
    }
    if (lower.includes('hello') || lower.includes('hi')) {
       return "Hey again! Let me know if you want to dive into the Studio or configure your distribution pipelines.";
    }
    return "Fascinating point. Let's channel that energy into the pipeline. Look around the Hub—this is your control center for total artistic domination.";
  }

  return (
    <div className="absolute top-6 right-6 bottom-6 w-full max-w-sm glass border border-white/10 rounded-3xl bg-black/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,100,255,0.15)] flex flex-col z-30 overflow-hidden transform transition-all pointer-events-auto hidden xl:flex">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between pointer-events-auto bg-black/20">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-singularity to-blue-500 p-[1px]">
                 <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-singularity" />
                 </div>
             </div>
             <div>
                <h3 className="font-bold text-sm tracking-widest uppercase">The Companion</h3>
                <p className="text-[10px] text-green-400 font-mono">● Online</p>
             </div>
         </div>
         <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Volume2 className="w-4 h-4 text-gray-400" />
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pointer-events-auto custom-scrollbar">
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
