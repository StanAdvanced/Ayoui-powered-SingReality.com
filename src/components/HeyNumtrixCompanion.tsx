import React, { useState } from 'react';
import { MessageSquare, Mic, Send, Bot, Sparkles, X } from 'lucide-react';
import { generateSpeech, playRawAudio } from '../lib/tts';
import { aiService } from '../services/aiService';

export function HeyNumtrixCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Greetings, Citizen. I am HeyNumtrix, your LGM Self-Learning Intelligence. How may I assist your journey in the SingReality Network today?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await aiService.generateChatResponse([
        { role: 'system', content: 'You are HeyNumtrix, a wise, musical, and helpful AI companion in the Numtrixian Chronicles.' },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ]);

      const reply = response || 'The frequencies are clouded right now. Let us try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      
      const audioContent = await generateSpeech(reply, 'en-US-Journey-F');
      if (audioContent) {
        await playRawAudio(audioContent);
      }
    } catch (error) {
      console.error('LGM Intelligence Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform group"
      >
        <Bot className="w-8 h-8 text-white group-hover:animate-pulse" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-8 right-8 w-96 glass rounded-3xl border border-purple-500/30 overflow-hidden flex flex-col shadow-2xl">
      <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">HeyNumtrix</h3>
            <p className="text-xs text-purple-400">LGM Self-Learning Intel</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="h-96 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white/10 text-white/90 rounded-bl-none'}`}>
              <p className="text-sm shadow-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white/90 p-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-black/40 border-t border-white/10">
        <div className="flex items-center gap-2 relative">
          <button type="button" className="p-3 text-white/50 hover:text-purple-400 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask HeyNumtrix..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
