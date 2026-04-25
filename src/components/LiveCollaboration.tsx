import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Send, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Cursor {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  text: string;
  timestamp: number;
}

export function LiveCollaboration({ projectId = 'global' }: { projectId?: string }) {
  const { user } = useStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const myColor = useRef(`hsl(${Math.random() * 360}, 100%, 50%)`);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to collaboration server', socket?.id);
      newSocket.emit('join-project', projectId);
    });

    newSocket.on('project-cursor-update', (cursor: Cursor) => {
      setCursors(prev => ({ ...prev, [cursor.id]: cursor }));
    });

    newSocket.on('cursor-remove', (id: string) => {
      setCursors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    newSocket.on('project-chat-message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg].slice(-50));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!socket || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    socket.emit('project-cursor-move', {
      projectId,
      x,
      y,
      color: myColor.current,
      name: user?.displayName || 'Anonymous'
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;
    
    const msg = {
      id: Math.random().toString(36).substring(7),
      userId: user?.uid || 'anon',
      name: user?.displayName || 'Anonymous',
      text: inputValue,
      timestamp: Date.now()
    };
    
    socket.emit('project-chat-message', {
      projectId,
      message: msg
    });
    setInputValue('');
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-50 pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {/* Render Remote Cursors */}
      {Object.values(cursors).map(cursor => (
        <div
          key={cursor.id}
          className="absolute pointer-events-none transition-all duration-75 ease-linear"
          style={{
            left: `${cursor.x * 100}%`,
            top: `${cursor.y * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={cursor.color} stroke="white" strokeWidth="2">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
          <div 
            className="absolute left-6 top-6 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}

      {/* Chat Overlay */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex flex-col items-end">
        {chatOpen && (
          <div className="w-80 h-96 glass-card rounded-2xl mb-4 flex flex-col overflow-hidden border border-white/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> Live Arena Chat</h3>
              <span className="text-xs text-singularity">{Object.keys(cursors).length + 1} Online</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
              {[...messages].reverse().map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.userId === user?.uid ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-500 mb-1">{msg.name}</span>
                  <div className={`px-3 py-2 rounded-xl text-sm ${msg.userId === user?.uid ? 'bg-singularity text-black' : 'bg-white/10 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2 bg-black/50">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-singularity"
              />
              <button type="submit" className="p-2 bg-singularity text-black rounded-xl hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
        
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-singularity text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
