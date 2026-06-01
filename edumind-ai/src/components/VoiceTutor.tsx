'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { api } from '@/utils/api';
import { Mic, Volume2, Square, RefreshCw, Sliders, Info, Volume1 } from 'lucide-react';

export default function VoiceTutor() {
  const { language, addXp, studentId } = useStore();
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('Tap the microphone to start your voice learning session...');
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = React.useRef<any>(null);

  const handleMicPress = () => {
    if (status === 'speaking') {
      window.speechSynthesis.cancel();
      setStatus('idle');
      setTranscript('Tap the microphone to start your voice learning session...');
      setAiResponse('');
      return;
    }

    if (status === 'listening') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition is unsupported on your browser. Please try Google Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;
    
    const locales: Record<string, string> = {
      english: 'en-US',
      hindi: 'hi-IN',
      spanish: 'es-ES',
      marathi: 'mr-IN',
      bengali: 'bn-IN'
    };
    rec.lang = locales[language] || 'en-US';

    rec.onstart = () => {
      setStatus('listening');
      setTranscript('Listening for your voice triggers...');
      setAiResponse('');
    };

    rec.onresult = async (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      
      try {
        const response = await api.askTutor(studentId || 1, speechToText);
        setAiResponse(response.message_text);
        setStatus('speaking');
        addXp(15);
        triggerUtterance(response.message_text);
      } catch (err) {
        console.error('Error fetching voice response:', err);
        setAiResponse('Apologies! I encountered an error. Please try again.');
        setStatus('speaking');
      }
    };

    rec.onerror = () => {
      setStatus('idle');
      setTranscript('Tap the microphone to start your voice learning session...');
    };

    rec.onend = () => {
      setStatus((currentStatus) => {
        if (currentStatus === 'listening') {
          return 'idle';
        }
        return currentStatus;
      });
    };

    rec.start();
  };

  const triggerUtterance = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is unsupported on this browser.');
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
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#090d16]/80 border border-[#1f2937]/50 rounded-[2rem] min-h-[500px] text-center relative overflow-hidden backdrop-blur-xl">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Voice Status Badge */}
      <div className="mb-8">
        <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
          status === 'listening' ? 'border-red-500/30 bg-red-500/10 text-red-400 animate-pulse' :
          status === 'speaking' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
          'border-gray-850 bg-gray-950/60 text-gray-500'
        }`}>
          {status === 'listening' ? '🔴 AI listening...' : status === 'speaking' ? '🔊 AI speaking...' : '🎙️ Voice Companion ready'}
        </span>
      </div>

      {/* Waveform Visualizer */}
      <div className="h-24 flex items-center justify-center gap-1.5 mb-10 w-full max-w-xs">
        {status === 'listening' || status === 'speaking' ? (
          <>
            <div className="h-12 w-2 rounded-full bg-purple-500 animate-wave-1" />
            <div className="h-16 w-2 rounded-full bg-purple-400 animate-wave-2" />
            <div className="h-20 w-2 rounded-full bg-cyan-400 animate-wave-3" />
            <div className="h-16 w-2 rounded-full bg-purple-400 animate-wave-4" />
            <div className="h-12 w-2 rounded-full bg-purple-500 animate-wave-5" />
          </>
        ) : (
          <div className="h-1 w-48 bg-gray-900 rounded-full" />
        )}
      </div>

      {/* Glowing mic button */}
      <div className="relative mb-10">
        {status === 'listening' && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"
          />
        )}
        {status === 'speaking' && (
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
          />
        )}
        <button
          onClick={handleMicPress}
          className={`h-28 w-28 rounded-full flex items-center justify-center text-white relative z-10 transition-all ${
            status === 'listening' ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-xl shadow-red-500/20 hover:scale-105' :
            status === 'speaking' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/20 hover:scale-105' :
            'bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 hover:scale-105 hover:border-purple-500/50'
          }`}
        >
          {status === 'listening' ? (
            <Square className="h-9 w-9 fill-white" />
          ) : (
            <Mic className="h-10 w-10 fill-white/10 text-purple-400" />
          )}
        </button>
      </div>

      {/* Dialogue displays */}
      <div className="space-y-4 max-w-md w-full px-4 mb-6">
        {/* User transcript */}
        <div className="p-4 rounded-2xl bg-gray-950/40 border border-gray-850 text-sm font-semibold text-gray-300">
          <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1 text-left">Your Speech Transcript:</span>
          <p className="text-left leading-relaxed font-light">{transcript}</p>
        </div>

        {/* AI voice answer */}
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/25 text-sm font-semibold text-purple-200"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase">AI Companion Response:</span>
              <button
                onClick={() => triggerUtterance(aiResponse)}
                className="text-purple-400 hover:text-purple-300 p-0.5 rounded transition-all"
                title="Play Audio"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-left leading-relaxed font-light">{aiResponse}</p>
          </motion.div>
        )}
      </div>

      {/* Speed controls */}
      {status === 'speaking' && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => triggerUtterance(aiResponse)}
            className="px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-850 hover:border-purple-500/20 text-xs font-bold text-gray-300 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Repeat Utterance</span>
          </button>
        </div>
      )}
    </div>
  );
}
