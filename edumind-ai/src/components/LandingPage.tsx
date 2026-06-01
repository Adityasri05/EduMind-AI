'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, ArrowRight, Zap, Target, BookOpen, Compass, RefreshCw, BarChart2, Award } from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onTryVoiceTutor: () => void;
}

export default function LandingPage({ onStartLearning, onTryVoiceTutor }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#030712] text-[#f8fafc] font-sans overflow-x-hidden selection:bg-[#8b5cf6] selection:text-white relative">
      {/* Background radial glowing gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[160px] pointer-events-none" />

      {/* Global CSS style overrides for sleekOutfit typography */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Outfit', 'Inter', sans-serif;
        }
      `}</style>

      {/* Header / Navigation */}
      <header className="border-b border-[#1f2937]/40 backdrop-blur-xl sticky top-0 z-50 bg-[#030712]/75 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">EduMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span></span>
              <span className="text-[10px] text-gray-400 block -mt-1 font-semibold tracking-wider">LEARN SMARTER. GROW FASTER.</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#loops" className="hover:text-purple-400 transition-colors">The 5 Loops</a>
            <a href="#twin" className="hover:text-purple-400 transition-colors">Digital Twin</a>
            <a href="#graph" className="hover:text-purple-400 transition-colors">Knowledge Graph</a>
            <a href="#tutor" className="hover:text-purple-400 transition-colors">AI Tutor</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onStartLearning}
              className="py-2 px-4 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-900/50 text-sm font-semibold transition-all hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={onStartLearning}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-28 md:pt-32 md:pb-40 text-center">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs md:text-sm font-semibold tracking-wide"
          >
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>The World's First Adaptive Learning Intelligence Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.05]"
          >
            Education adapted to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              your unique brain.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            EduMind AI is an AI-native learning companion built on cognitive psychology, active recall, and spaced repetition. It decodes what you know, maps what you don't, and programs the perfect path to mastery.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Zap className="h-5 w-5 fill-white text-white" />
              <span>Initialize Your Digital Twin</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onTryVoiceTutor}
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl border border-gray-800 hover:border-purple-500/30 bg-[#090d16]/70 text-gray-200 hover:text-white font-bold text-lg flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:bg-[#090d16] transition-all"
            >
              <Compass className="h-5 w-5 text-cyan-400 animate-pulse" />
              <span>Interactive Voice Tutor</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* The 5 Loops of Learning (Learn, Practice, Analyze, Improve, Master) */}
      <section id="loops" className="px-4 py-20 bg-[#090d16]/30 border-y border-gray-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              The 5 Loops of Learning
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
              EduMind drives a continuous cycle engineered to eliminate cognitive gaps and maximize retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'Learn', icon: BookOpen, desc: 'Engage in conversational, guided reasoning sessions with your AI Tutor.', color: 'from-purple-600 to-indigo-500' },
              { num: '02', title: 'Practice', icon: RefreshCw, desc: 'Train active recall via adaptive spacing, flashcards, and conceptual quizzes.', color: 'from-cyan-500 to-blue-500' },
              { num: '03', title: 'Analyze', icon: BarChart2, desc: 'Track your memory strength, focus indices, and performance curves in real-time.', color: 'from-emerald-500 to-teal-500' },
              { num: '04', title: 'Improve', icon: Target, desc: 'Locate foundational bottlenecks and address prerequisites highlighted by the graph.', color: 'from-pink-500 to-rose-500' },
              { num: '05', title: 'Master', icon: Award, desc: 'Pass rigorous adaptive barriers to permanently unlock higher conceptual layers.', color: 'from-amber-500 to-orange-500' }
            ].map((loop, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-[#090d16]/80 border border-gray-800/80 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.03] group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-bl ${loop.color} opacity-[0.03] group-hover:opacity-10 transition-opacity`} />
                <div className="text-xs font-bold text-gray-500 mb-6 tracking-widest">{loop.num}</div>
                <div className="h-12 w-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white mb-6 group-hover:bg-purple-600 transition-colors">
                  <loop.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{loop.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{loop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section: Twin and Graph */}
      <section id="twin" className="px-4 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Twin Description */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              <Brain className="h-4 w-4" />
              <span>Cognitive Digital Twin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              A dynamic digital twin that maps your memory decay.
            </h2>
            <p className="text-gray-300 font-light text-lg leading-relaxed">
              Based on the Ebbinghaus forgetting curve, EduMind simulates your brain's memory levels, mapping key focus speeds, attention thresholds, and daily retention rates. It knows when you are about to forget and queues reviews instantly.
            </p>
            <div className="flex gap-8 border-t border-gray-800/40 pt-6">
              <div>
                <span className="block text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">84%</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Average Retention</span>
              </div>
              <div className="border-l border-gray-800/40 pl-8">
                <span className="block text-3xl font-extrabold text-emerald-400">92.4%</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Exam Readiness</span>
              </div>
            </div>
          </div>

          {/* Interactive Showcase Panel */}
          <div className="rounded-3xl border border-gray-800/60 bg-[#090d16]/80 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Cognitive Dashboard</span>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-900 rounded border border-gray-800 text-gray-500 font-mono">ID: Twin-78x</span>
            </div>

            <div className="space-y-6">
              {/* Memory curves */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">Calculus III (Chain Rule)</span>
                  <span className="text-purple-400">42% (Revision Due)</span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">Wave Optics (Diffraction)</span>
                  <span className="text-cyan-400">75% (Stable)</span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-300">Binary Search Trees</span>
                  <span className="text-emerald-400">90% (Mastered)</span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>

            {/* Simulated revision action */}
            <div className="mt-8 pt-6 border-t border-gray-800/40 flex justify-between items-center">
              <div>
                <span className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase">Immediate Action</span>
                <span className="text-sm font-semibold text-white">3 Concepts in Spaced Queue</span>
              </div>
              <button
                onClick={onStartLearning}
                className="py-2 px-4 rounded-xl bg-purple-600 text-xs font-extrabold shadow-md hover:bg-purple-700 transition-colors flex items-center gap-1.5"
              >
                <span>Trigger Recall</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-gray-800/40 py-20 px-4 text-center relative z-10 bg-[#090d16]/10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Step into the future of learning.</h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of students global-wide using AI to study smart, beat the forgetting curve, and achieve ultimate conceptual mastery.
          </p>
          <button
            onClick={onStartLearning}
            className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:bg-gray-100 text-lg"
          >
            Start Learning Free
          </button>
          <p className="text-[11px] text-gray-600 pt-10 font-medium tracking-wider uppercase">
            © 2026 EduMind AI. Built with learning science. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
