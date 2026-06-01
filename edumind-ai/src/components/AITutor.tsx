'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, ChatMessage } from '@/store/useStore';
import { api, WS_BASE_URL } from '@/utils/api';
import { Send, Mic, Image, Sparkles, Volume2, Network, BookOpen, Compass, Code, Terminal, Brain } from 'lucide-react';

export default function AITutor() {
  const { chatHistory, language, addChatMessage, addXp, studentId } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentNarratingId, setCurrentNarratingId] = useState<string | null>(null);
  
  // Side panel focus: concept map or formula sheets
  const [activeRightPanel, setActiveRightPanel] = useState<'map' | 'formulas' | 'examples' | 'steps'>('map');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const addChatMessageRef = useRef(addChatMessage);
  addChatMessageRef.current = addChatMessage;

  // Track the last message to render dynamic details in the right panel
  const lastAiMessage = [...chatHistory].reverse().find(m => m.sender === 'ai');

  useEffect(() => {
    if (lastAiMessage) {
      if (lastAiMessage.conceptMap) setActiveRightPanel('map');
      else if (lastAiMessage.formulas) setActiveRightPanel('formulas');
      else if (lastAiMessage.examples) setActiveRightPanel('examples');
      else if (lastAiMessage.steps) setActiveRightPanel('steps');
    }
  }, [lastAiMessage]);

  // WebSocket support with fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sId = studentId || 1;
    const wsUrl = `${WS_BASE_URL}/${sId}`;

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' || data.type === 'welcome') {
            addChatMessageRef.current({
              sender: 'ai',
              text: data.message_text,
              steps: data.steps,
              formulas: data.formulas,
              examples: data.examples,
              conceptMap: data.conceptMap
            });
            setIsTyping(false);
          } else if (data.type === 'typing') {
            setIsTyping(data.is_typing);
          }
        } catch (err) {
          console.error('Failed to parse WS data:', err);
        }
      };

      ws.onerror = () => {
        console.info('WebSocket unavailable. Using REST API fallback.');
      };

      ws.onclose = () => {
        wsRef.current = null;
      };
    } catch {
      console.info('WebSocket connection failed. Using REST API fallback.');
      wsRef.current = null;
    }

    return () => {
      if (ws && ws.readyState !== WebSocket.CLOSED) {
        ws.close();
      }
    };
  }, [studentId]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = async (text: string, imageFile?: File, imageSrc?: string) => {
    if (!text.trim() && !imageFile && !imageSrc) return;

    addChatMessage({
      sender: 'user',
      text: text || '📸 [Attached Note Photo]',
      imageUrl: imageSrc
    });

    setInputText('');
    setIsTyping(true);

    try {
      if (imageFile) {
        const response = await api.uploadNotebook(studentId || 1, imageFile);
        addChatMessage({
          sender: 'ai',
          text: response.message_text,
          steps: response.steps,
          formulas: response.formulas,
          examples: response.examples,
          conceptMap: response.conceptMap
        });
        setIsTyping(false);
        addXp(20);
      } else if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          message_text: text,
          language: language
        }));
        addXp(10);
      } else {
        const response = await api.askTutor(studentId || 1, text);
        addChatMessage({
          sender: 'ai',
          text: response.message_text,
          steps: response.steps,
          formulas: response.formulas,
          examples: response.examples,
          conceptMap: response.conceptMap
        });
        setIsTyping(false);
        addXp(10);
      }
    } catch (err) {
      console.error('Error in handleSend:', err);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (pill: string) => {
    let queryText = '';
    if (pill === 'teach') queryText = 'Teach me Taylor Series Expansion from first-principles.';
    else if (pill === 'test') queryText = 'Test me on wave interference diffraction fringe widths.';
    else if (pill === 'challenge') queryText = 'Challenge me with a tough quantitative math reasoning question!';
    else if (pill === 'visual') queryText = 'Explain visually how Young\'s double slit path difference works.';
    else if (pill === 'examples') queryText = 'Give real-world engineering examples of balanced BSTs.';

    handleSend(queryText);
  };

  // Speech input using webkitSpeechRecognition
  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition is unsupported on your browser. Please try Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const locales: Record<string, string> = {
      english: 'en-US',
      hindi: 'hi-IN',
      spanish: 'es-ES',
      marathi: 'mr-IN',
      bengali: 'bn-IN'
    };
    recognition.lang = locales[language] || 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputText(speechToText);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  // TTS output
  const handleSpeechOutput = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('TTS speech synthesis is unsupported on this browser.');
      return;
    }

    if (currentNarratingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentNarratingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const locales: Record<string, string> = {
      english: 'en-US',
      hindi: 'hi-IN',
      spanish: 'es-ES',
      marathi: 'mr-IN',
      bengali: 'bn-IN'
    };
    utterance.lang = locales[language] || 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setCurrentNarratingId(null);
    setCurrentNarratingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        handleSend('Solve and give structured correction on my handwritten note:', file, src);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Left Chat Container */}
      <div className="lg:col-span-3 flex flex-col bg-[#090d16]/80 border border-[#1f2937]/50 rounded-[2rem] overflow-hidden relative backdrop-blur-xl">
        
        {/* Header */}
        <div className="p-4.5 border-b border-gray-800/60 bg-gray-950/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/25">
              <Brain className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Personal Cognitive Co-pilot</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <span className="text-[10px] text-gray-500">
                Tracking Language: <span className="text-purple-400 capitalize">{language}</span>
              </span>
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-extrabold tracking-widest text-purple-400 uppercase">
            +10 XP / Concept
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <AnimatePresence initial={false}>
            {chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[90%] ${
                  msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-700 text-white font-semibold rounded-tr-none'
                      : 'bg-gray-950/50 border-[#1f2937]/60 text-gray-200 rounded-tl-none font-light'
                  }`}
                >
                  {msg.imageUrl && (
                    <div className="mb-3 max-h-48 rounded-lg overflow-hidden border border-gray-800">
                      <img src={msg.imageUrl} alt="Notebook Note" className="object-cover w-full" />
                    </div>
                  )}
                  <div className="whitespace-pre-line text-sm md:text-base">{msg.text}</div>
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[9px] text-gray-500 font-bold">{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleSpeechOutput(msg.text, msg.id)}
                      className={`text-gray-500 hover:text-purple-400 p-0.5 rounded transition-all ${
                        currentNarratingId === msg.id ? 'text-purple-400 animate-bounce' : ''
                      }`}
                      title="Audio Narrative"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-2.5 text-gray-400 pl-2">
              <div className="h-8 w-8 rounded-lg bg-gray-950 border border-gray-850 flex items-center justify-center text-xs">
                🤖
              </div>
              <div className="flex gap-1.5 py-3 px-4.5 bg-gray-950/40 border border-gray-850 rounded-2xl rounded-tl-none">
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Guided Pills */}
        <div className="px-4.5 py-2.5 border-t border-gray-800/40 bg-gray-950/15 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
          <button
            onClick={() => handleQuickAction('teach')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-800 bg-[#030712]/50 text-xs font-bold text-gray-300 hover:border-purple-500/35 hover:text-purple-400 transition-all flex items-center gap-1.5"
          >
            <Compass className="h-3.5 w-3.5" /> Teach Me
          </button>
          <button
            onClick={() => handleQuickAction('test')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-800 bg-[#030712]/50 text-xs font-bold text-gray-300 hover:border-purple-500/35 hover:text-purple-400 transition-all flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" /> Test Me
          </button>
          <button
            onClick={() => handleQuickAction('challenge')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-800 bg-[#030712]/50 text-xs font-bold text-gray-300 hover:border-purple-500/35 hover:text-purple-400 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 animate-spin" /> Challenge Me
          </button>
          <button
            onClick={() => handleQuickAction('visual')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-800 bg-[#030712]/50 text-xs font-bold text-gray-300 hover:border-purple-500/35 hover:text-purple-400 transition-all flex items-center gap-1.5"
          >
            <Network className="h-3.5 w-3.5" /> Explain Visually
          </button>
          <button
            onClick={() => handleQuickAction('examples')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-800 bg-[#030712]/50 text-xs font-bold text-gray-300 hover:border-purple-500/35 hover:text-purple-400 transition-all flex items-center gap-1.5"
          >
            <Code className="h-3.5 w-3.5" /> Real-World Examples
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-800/40 bg-gray-950/20">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            {/* Image upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 rounded-xl border border-gray-850 hover:border-purple-500/30 bg-gray-950/60 flex items-center justify-center text-gray-555 hover:text-purple-400 transition-all shrink-0"
              title="Upload handwritten note"
            >
              <Image className="h-5 w-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Prompt text area */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Ask me anything: Teach me, Test me..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                className="w-full bg-gray-950/80 border border-gray-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all font-light"
              />
              <button
                onClick={handleSpeechInput}
                className={`absolute right-3 p-1.5 rounded-lg transition-all ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-purple-400'
                }`}
                title="Voice input"
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
            </div>

            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim()}
              className={`h-12 w-12 rounded-xl bg-purple-600 text-white flex items-center justify-center transition-all shrink-0 ${
                !inputText.trim() ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-700 hover:scale-105 active:scale-95'
              }`}
            >
              <Send className="h-4.5 w-4.5 fill-white text-white" />
            </button>
          </div>
        </div>

      </div>

      {/* Right Interactive Reference Sheets & Maps Panel */}
      <div className="lg:col-span-2 flex flex-col bg-[#090d16]/80 border border-[#1f2937]/50 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        
        {/* Navigation Tabs */}
        <div className="p-3 border-b border-gray-800/60 bg-gray-950/15 flex justify-around items-center gap-1">
          {[
            { id: 'map', label: 'Concept Map', icon: Network },
            { id: 'formulas', label: 'Formula Sheet', icon: BookOpen },
            { id: 'steps', label: 'Reasoning Steps', icon: Terminal },
            { id: 'examples', label: 'Real-world Examples', icon: Code }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeRightPanel === tab.id;
            const hasData = lastAiMessage && (
              (tab.id === 'map' && lastAiMessage.conceptMap) ||
              (tab.id === 'formulas' && lastAiMessage.formulas) ||
              (tab.id === 'steps' && lastAiMessage.steps) ||
              (tab.id === 'examples' && lastAiMessage.examples)
            );

            return (
              <button
                key={tab.id}
                onClick={() => setActiveRightPanel(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-[10px] font-extrabold flex flex-col items-center gap-1 transition-all ${
                  isTabActive
                    ? 'bg-purple-500/10 border border-purple-500/25 text-purple-400 font-black'
                    : 'text-gray-500 border border-transparent hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {hasData && <span className="h-1 w-1 bg-cyan-400 rounded-full mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeRightPanel === 'map' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">Active Concept Mapping</h4>
              {lastAiMessage?.conceptMap ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 font-light leading-relaxed">Interactive node links derived from the AI Tutor session:</p>
                  
                  {/* Node List representation */}
                  <div className="space-y-2">
                    {lastAiMessage.conceptMap.nodes.map((node) => (
                      <div key={node.id} className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-850 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-white">{node.label}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          node.status === 'mastered' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : node.status === 'learning' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse'
                            : 'bg-gray-900 text-gray-500'
                        }`}>
                          {node.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 space-y-3 py-16">
                  <Network className="h-10 w-10 text-gray-650" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Prerequisite Tree</h5>
                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed mt-1 font-light">Ask the AI tutor to "Teach me" or "Explain visually" to unlock real-time mapping.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeRightPanel === 'formulas' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-widest font-mono">Formula Panel / Mathematical Cheat Sheets</h4>
              {lastAiMessage?.formulas ? (
                <div className="space-y-3">
                  {lastAiMessage.formulas.map((formula, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-950/60 border border-gray-850 font-mono text-xs text-white leading-relaxed flex flex-col justify-center min-h-[50px] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                      <div className="font-semibold">{formula}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Default Calculus & Physics Reference</span>
                  <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-850 font-mono text-xs text-gray-300 space-y-2">
                    <div className="font-bold text-white">Taylor Series (a = 0):</div>
                    <div>{"f(x) = f(0) + f'(0)x + \\\frac{f''(0)}{2!}x^2 + \\\frac{f'''(0)}{3!}x^3 + ..."}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-850 font-mono text-xs text-gray-300 space-y-2">
                    <div className="font-bold text-white">Young's Slit Fringe Width:</div>
                    <div>{"\\beta = \\frac{D \\lambda}{d}"}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeRightPanel === 'steps' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">Guided Reasoning Steps</h4>
              {lastAiMessage?.steps ? (
                <div className="space-y-3">
                  {lastAiMessage.steps.map((step, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-850 text-xs text-gray-300 leading-normal font-light">
                      {step}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 space-y-3 py-16">
                  <Terminal className="h-10 w-10 text-gray-655" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Step-by-Step Reasoner</h5>
                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed mt-1 font-light">Ask the AI tutor to "Explain step-by-step" to view critical logic chains.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeRightPanel === 'examples' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">Real-World Examples</h4>
              {lastAiMessage?.examples ? (
                <div className="space-y-3">
                  {lastAiMessage.examples.map((ex, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-850 text-xs text-gray-300 leading-normal font-light">
                      💡 {ex}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center text-gray-550 space-y-3 py-16">
                  <Code className="h-10 w-10 text-gray-655" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Example Generator</h5>
                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed mt-1 font-light">Click on "Real-World Examples" or request them to see premium case studies.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
