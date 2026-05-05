
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Video, Mic, MicOff, VideoOff, MessageSquare, Users, X, Bot, ShieldCheck } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
  sender: string;
  content: string;
  timestamp: number;
  isAI?: boolean;
}

export function RealTimeCommunication({ roomId, userId }: { roomId: string, userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMediaPanelOpen, setIsMediaPanelOpen] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to the local server
    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.emit('join-room', roomId);

    socket.on('receive-message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    // Mock AI Moderator Message
    setTimeout(() => {
        setMessages(prev => [...prev, {
            sender: 'AI Moderator',
            content: 'Welcome to the room! I am here to ensure a safe and vibey environment. Frontier rules enabled.',
            timestamp: Date.now(),
            isAI: true
        }]);
    }, 1500);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;

    socketRef.current.emit('send-message', {
      roomId,
      message: inputText
    });

    setMessages(prev => [...prev, {
      sender: userId,
      content: inputText,
      timestamp: Date.now()
    }]);

    setInputText('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-white" />
        {messages.length > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-tighter">Live Arena Chat</h3>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={() => setIsMediaPanelOpen(!isMediaPanelOpen)}
                    className={`p-2 rounded-lg transition-colors ${isMediaPanelOpen ? 'bg-cyan-500 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                >
                    <Video className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Panel (WebRTC Preview Mock) */}
            <AnimatePresence>
                {isMediaPanelOpen && (
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-black/40 border-b border-white/10"
                    >
                        <div className="p-4 flex flex-col gap-3">
                            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-white/5 group">
                                {isVideoOn ? (
                                    <div className="absolute inset-0 bg-cyan-900/20 flex items-center justify-center">
                                         <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Live Stream Initialized</p>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <VideoOff className="w-8 h-8 text-gray-700" />
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[8px] text-white uppercase font-bold">You</div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button 
                                    onClick={() => setIsVideoOn(!isVideoOn)}
                                    className={`p-3 rounded-full border transition-all ${isVideoOn ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]' : 'bg-white/5 border-white/10 text-gray-500'}`}
                                >
                                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                                </button>
                                <button 
                                    onClick={() => setIsMicOn(!isMicOn)}
                                    className={`p-3 rounded-full border transition-all ${isMicOn ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(255,0,255,0.5)]' : 'bg-white/5 border-white/10 text-gray-500'}`}
                                >
                                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === userId ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
                      {msg.sender === userId ? 'You' : msg.sender}
                    </span>
                    {msg.isAI && <ShieldCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.isAI ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-100' :
                    msg.sender === userId ? 'bg-purple-600 text-white rounded-tr-none shadow-lg' : 'bg-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center">
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Send message to Arena..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-600"
                />
                <button 
                    onClick={sendMessage}
                    className="absolute right-2 p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
