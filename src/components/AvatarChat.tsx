import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Mic, Volume2, Sparkles, Music, Zap, Globe, MicOff } from 'lucide-react';
import { aiService } from '../services/aiService';
import { knowledgebaseService } from '../services/knowledgebaseService';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import * as Tone from 'tone';
import { generateSpeech, playRawAudio } from '../lib/tts';
import { narrationEngine } from '../services/narrationEngine';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AvatarChat({ onTalkingChange }: { onTalkingChange: (isTalking: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<'Comedian' | 'Expert' | 'Mission Lead'>('Mission Lead');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome! I'm your SingReality partner, currently in 'Mission Lead' mode. How can we revolutionize your creativity today?" }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const isMounted = useRef(true);
  const { user } = useStore();
  const { playSuccess, playClick } = useSound();

  const synth = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    isMounted.current = true;
    synth.current = new Tone.PolySynth().toDestination();
    
    // Audit: Initial "God-tier" greeting on load
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsOpen(true);
      }
    }, 2000); 

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setInput(prev => prev ? prev + ' ' + finalTranscript : finalTranscript);
          }
        };

        recognition.current.onerror = (event: any) => {
          if (event.error === 'no-speech') {
            console.warn("Speech recognition: No speech detected, resetting.");
          } else {
            console.error("Speech recognition error:", event.error);
          }
          setIsListening(false);
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      synth.current?.dispose();
      narrationEngine.stop();
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAssistantResponse = async (text: string) => {
    if (!isMounted.current) return;
    
    // Show message immediately for responsiveness
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    
    setIsSpeaking(true);
    onTalkingChange(true);
    
    // Use the narration engine, possibly adjust voice based on persona
    await narrationEngine.narrate(text, true, persona === 'Comedian' ? 'Aoede' : 'alloy');
    
    if (isMounted.current) {
      setIsSpeaking(false);
      onTalkingChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    if (isListening && recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }

    const userMessage = input.trim();
    playClick(); // Play audio feedback for user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsGenerating(true);

    const context = `You are a SingReality partner in ${persona} mode. Adapt your responses accordingly.`;
    const response = await aiService.generateResponse(context + "\n\nUser: " + userMessage, messages);
    await handleAssistantResponse(response);
    await knowledgebaseService.logInteraction({
      userId: user?.uid,
      userMessage,
      assistantResponse: response,
      persona
    });
    setIsGenerating(false);
  };

  const toggleListening = () => {
    if (!recognition.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      try {
        recognition.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-singularity rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform"
        >
          <MessageSquare className="w-8 h-8 text-black" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
            1
          </div>
        </motion.button>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-[400px] h-[600px] glass rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-2 mb-4">
                  {(['Comedian', 'Expert', 'Mission Lead'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPersona(p)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${
                        persona === p ? 'bg-singularity text-black' : 'bg-white/10 text-gray-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">Nexus Avatar</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Online • God-Tier</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-singularity text-black font-medium rounded-tr-none' 
                      : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-singularity rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-singularity rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-singularity rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { icon: Music, label: 'Theory' },
                { icon: Zap, label: 'Quantum' },
                { icon: Globe, label: 'Vision' },
                { icon: MessageSquare, label: 'Ideology' }
              ].map(action => (
                <button 
                  key={action.label}
                  onClick={() => setInput(action.label)}
                  className="flex-shrink-0 px-3 py-1.5 glass rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <action.icon className="w-3 h-3 text-singularity" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-6 bg-white/5 border-t border-white/5">
              <div className="relative flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  className={`flex-1 bg-black/50 border border-white/10 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-singularity transition-all text-sm ${isListening ? 'border-singularity/50 bg-singularity/5' : ''}`}
                />
                
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute left-3 p-2 rounded-xl transition-colors ${
                    isListening 
                      ? 'text-singularity animate-pulse' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <button 
                  type="submit"
                  disabled={isGenerating || !input.trim()}
                  className="absolute right-2 p-3 bg-singularity text-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                  title="Send message"
                >
                   <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
