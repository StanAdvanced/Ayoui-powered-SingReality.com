import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { initializeDJChat } from '../services/geminiService';

export default function AISongStudio() {
  const [djChatSession, setDjChatSession] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Yo yo yo! It's your God-tier AI DJ in the house. Welcome to the SingReality AISong Sincv Engine! What kind of sonic masterpiece are we vibing with today? Drop a genre, artist, or production trick you wanna explore, and let's make some magic! 🎧✨" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isDjTyping, setIsDjTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const session = initializeDJChat();
      setDjChatSession(session);
    } catch (e) {
      console.error("Failed to initialize DJ Chat:", e);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isDjTyping]);

  const handleSendDJMessage = async () => {
    if (!chatInput.trim() || !djChatSession) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsDjTyping(true);

    try {
      const responseStream = await djChatSession.sendMessageStream({ message: userMsg });
      let fullResponse = '';
      
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const textChunk = (chunk as any).text;
        if (textChunk) {
           fullResponse += textChunk;
           setChatMessages(prev => {
             const newMsgs = [...prev];
             newMsgs[newMsgs.length - 1].text = fullResponse;
             return newMsgs;
           });
        }
      }
    } catch (e) {
      console.error("DJ Chat error:", e);
      setChatMessages(prev => [...prev, { role: 'model', text: "Whoa, hold up! Looks like the quantum flux capacitor is glitching out. Give me a sec to reboot the neural nets... try again?" }]);
    } finally {
      setIsDjTyping(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendDJMessage();
    }
  };

  return (
    <div className="min-h-screen relative p-12 text-white">
      <div className="max-w-4xl mx-auto space-y-12 h-full flex flex-col">
        <div className="bg-gray-900/50 p-8 rounded-[3rem] border border-white/10 flex flex-col flex-grow min-h-[600px] shadow-2xl">
          <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 text-purple-400">
            <MessageSquare className="w-8 h-8"/> God-Tier AI DJ
          </h3>
          <p className="text-sm text-gray-400 mb-6 font-mono">
            Ask about genres, artists, or advanced production technique. Let's make a hit!
          </p>
          
          <div className="flex flex-col flex-grow bg-black/60 rounded-3xl border border-white/10 p-6 mb-6 overflow-y-auto max-h-[600px] space-y-6 shadow-inner">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-3xl p-5 ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-white/5'}`}>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isDjTyping && (
              <div className="flex justify-start">
                 <div className="bg-gray-800 text-gray-400 border border-gray-700 rounded-3xl rounded-bl-none p-5 pb-4 flex gap-2 items-center">
                   <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                   <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-75" />
                   <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-150" />
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="relative flex items-center">
            <textarea 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              placeholder="Type your prompt here..."
              className="w-full bg-black/50 border border-gray-700 rounded-2xl pl-6 pr-14 py-4 focus:border-purple-500 outline-none text-base resize-none"
              rows={1}
            />
            <button 
              onClick={handleSendDJMessage}
              disabled={!chatInput.trim() || isDjTyping}
              className="absolute right-4 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 p-2"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}