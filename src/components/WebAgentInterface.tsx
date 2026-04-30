import React, { useState } from "react";
import { Search, Map as MapIcon, Globe, Sparkles, Navigation, Send } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";

export default function WebAgentInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: 'Neural Agent Online. I can search the web, fetch map coordinates, and triangulate global data. What is your directive?' }
  ]);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");
    setIsSearching(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an elite Google AI Agent with Web Search and Maps capabilities. Answer the following query as if you just performed a quantum search across real-time networks: ${userMessage}`
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "No data recovered." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Quantum Web Link failed. Check API connectivity." }]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <Globe className="w-6 h-6" />
      </button>

      {/* Agent Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-black/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="p-4 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-b border-cyan-500/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="text-cyan-400 w-5 h-5" />
                <h3 className="font-bold text-white text-sm uppercase tracking-widest">Global Web Agent</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-50' 
                      : 'bg-white/5 border border-white/10 text-white/90'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isSearching && (
                <div className="flex gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl w-fit">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search web or maps..." 
                className="flex-1 bg-black/50 border border-white/10 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" disabled={isSearching || !input} className="p-2 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
