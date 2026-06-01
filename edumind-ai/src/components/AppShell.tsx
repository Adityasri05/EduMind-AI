'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  Sparkles,
  Zap,
  Calendar,
  HelpCircle,
  FileText,
  Users,
  Wifi,
  WifiOff,
  User,
  Heart,
  Settings,
  MessageSquare,
  Network,
  Award,
  Eye,
  Sliders,
  Volume2,
  LogOut,
  Brain
} from 'lucide-react';

import StudentDashboard from './StudentDashboard';
import LearningGraph from './LearningGraph';
import AITutor from './AITutor';
import AdaptiveQuiz from './AdaptiveQuiz';
import AnalyticsDashboard from './AnalyticsDashboard';
import StudyPlanner from './StudyPlanner';
import VoiceTutor from './VoiceTutor';

interface AppShellProps {
  onLogout: () => void;
}

export default function AppShell({ onLogout }: AppShellProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAccessDrawer, setShowAccessDrawer] = useState(false);
  const { 
    xp, 
    streak, 
    level, 
    offlineMode, 
    toggleOfflineMode, 
    studentName, 
    learningGoal,
    accessibilitySettings,
    toggleAccessibilitySetting 
  } = useStore();

  const navigationItems = [
    { id: 'dashboard', label: 'Learner Twin', icon: Brain },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'tutor', label: 'AI Tutor UX', icon: MessageSquare },
    { id: 'quiz', label: 'Active Recall', icon: HelpCircle },
    { id: 'analytics', label: 'Insights Center', icon: FileText },
    { id: 'voice', label: 'Voice Companion', icon: Volume2 },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderActiveComponent = () => {
    if (accessibilitySettings.reducedMotion) {
      // Direct render without animations
      return renderComponentOnly();
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderComponentOnly()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderComponentOnly = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard onNavigate={handleTabChange} />;
      case 'graph':
        return <LearningGraph onNavigate={handleTabChange} />;
      case 'tutor':
        return <AITutor />;
      case 'quiz':
        return <AdaptiveQuiz />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'voice':
        return <VoiceTutor />;
      case 'planner':
        return <StudyPlanner />;
      default:
        return <StudentDashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#030712] text-[#f8fafc] flex flex-col transition-all duration-300
      ${accessibilitySettings.dyslexiaMode ? 'font-dyslexia' : ''}
      ${accessibilitySettings.highContrast ? 'theme-high-contrast' : ''}
      ${accessibilitySettings.largeText ? 'text-lg font-medium tracking-wide' : 'text-sm'}
    `}>
      
      {/* Offline Status Bar */}
      {offlineMode && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5 z-50">
          <WifiOff className="h-4 w-4 animate-pulse" />
          <span>Low-bandwidth offline mode active: Local caches loaded. Syncing on reconnect.</span>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-[#1f2937]/40 bg-[#090d16]/60 sticky top-0 z-45 backdrop-blur-md px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block">EduMind <span className="text-purple-400">AI</span></span>
              <span className="text-[9px] text-gray-500 block -mt-1 font-bold tracking-widest uppercase">Adaptive Intelligence</span>
            </div>
          </div>

          {/* Gamification / Widgets */}
          <div className="flex items-center gap-3">
            {/* Streak widget */}
            <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/25 text-purple-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-purple-400 text-purple-400" />
              <span>{streak}d Streak</span>
            </div>

            {/* XP widget */}
            <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm">
              <span>{xp} XP</span>
            </div>

            {/* Offline Simulator */}
            <button
              onClick={toggleOfflineMode}
              className={`p-2 rounded-xl border transition-all ${
                offlineMode
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-[#090d16] border-gray-800 text-gray-400 hover:text-[#f8fafc]'
              }`}
              title="Simulate Offline Cache Mode"
            >
              {offlineMode ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            </button>

            {/* Floating Accessibility Toggle */}
            <button
              onClick={() => setShowAccessDrawer(!showAccessDrawer)}
              className={`p-2 rounded-xl bg-[#090d16] border transition-all hover:scale-105 ${
                showAccessDrawer ? 'border-purple-500 text-purple-400' : 'border-gray-800 text-gray-400 hover:text-[#f8fafc]'
              }`}
              title="Open Accessibility Controls"
            >
              <Sliders className="h-4 w-4" />
            </button>

            {/* Log Out Avatar */}
            <button
              onClick={onLogout}
              className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-105 transition-all text-white border border-gray-800 relative group overflow-hidden"
              title="Sign Out"
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <LogOut className="h-3 w-3 text-white" />
              </div>
              {studentName ? studentName.charAt(0).toUpperCase() : 'A'}
            </button>
          </div>

        </div>
      </header>

      {/* Main Structural Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex relative">
        
        {/* Desktop Left Sidebar */}
        <aside className="w-64 border-r border-[#1f2937]/40 bg-[#090d16]/10 p-6 space-y-6 shrink-0 hidden md:block">
          <div className="space-y-2">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block pl-2">System Loops</span>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3.5 text-left text-xs font-bold transition-all relative overflow-hidden group ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-purple-500/10'
                        : 'text-gray-400 hover:text-[#f8fafc] hover:bg-[#090d16]/50'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-purple-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-gray-800/40">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-900/20 to-cyan-900/10 border border-purple-500/10 text-xs relative overflow-hidden">
              <span className="text-[9px] font-extrabold tracking-wider uppercase text-purple-400 block mb-1">Interactive Diagnostic</span>
              <p className="text-gray-400 leading-normal font-light">Your cognitive twin has 3 spaced revision items due. Solve flashcards to restore curve strength.</p>
            </div>
          </div>
        </aside>

        {/* Content Shell */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {renderActiveComponent()}
        </main>

      </div>

      {/* Floating Accessibility Drawer */}
      <AnimatePresence>
        {showAccessDrawer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setShowAccessDrawer(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm bg-[#090d16] border-l border-[#1f2937] p-6 flex flex-col justify-between relative z-10 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4.5 w-4.5 text-purple-400" />
                    <h3 className="text-base font-extrabold tracking-tight">Accessibility Drawer</h3>
                  </div>
                  <button
                    onClick={() => setShowAccessDrawer(false)}
                    className="p-1 rounded-lg bg-gray-900 hover:bg-gray-850 text-gray-400 border border-gray-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-5">
                  <span className="text-[10px] text-gray-500 font-extrabold tracking-wider uppercase block">Hot-Toggle Adaptations</span>

                  {/* Dyslexia Mode Toggle */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => toggleAccessibilitySetting('dyslexiaMode')}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        accessibilitySettings.dyslexiaMode
                          ? 'border-purple-500 bg-purple-500/10 text-white font-extrabold'
                          : 'border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Dyslexia-Friendly Layout</span>
                        <span className="text-[9px] text-gray-500 font-normal mt-0.5">Applies heavy weights and spaced typography.</span>
                      </div>
                      <div className={`h-4.5 w-4.5 rounded-full border transition-all flex items-center justify-center ${accessibilitySettings.dyslexiaMode ? 'border-purple-500 bg-purple-500' : 'border-gray-600'}`}>
                        {accessibilitySettings.dyslexiaMode && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  </div>

                  {/* High Contrast Mode Toggle */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => toggleAccessibilitySetting('highContrast')}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        accessibilitySettings.highContrast
                          ? 'border-purple-500 bg-purple-500/10 text-white font-extrabold'
                          : 'border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">High Contrast Borders</span>
                        <span className="text-[9px] text-gray-500 font-normal mt-0.5">Enforces high border visibility and solid backdrops.</span>
                      </div>
                      <div className={`h-4.5 w-4.5 rounded-full border transition-all flex items-center justify-center ${accessibilitySettings.highContrast ? 'border-purple-500 bg-purple-500' : 'border-gray-600'}`}>
                        {accessibilitySettings.highContrast && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  </div>

                  {/* Large Text Toggle */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => toggleAccessibilitySetting('largeText')}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        accessibilitySettings.largeText
                          ? 'border-purple-500 bg-purple-500/10 text-white font-extrabold'
                          : 'border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Dynamic Large Text Scale</span>
                        <span className="text-[9px] text-gray-500 font-normal mt-0.5">Scales textual vectors for superior legibility.</span>
                      </div>
                      <div className={`h-4.5 w-4.5 rounded-full border transition-all flex items-center justify-center ${accessibilitySettings.largeText ? 'border-purple-500 bg-purple-500' : 'border-gray-600'}`}>
                        {accessibilitySettings.largeText && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  </div>

                  {/* Reduced Motion Toggle */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => toggleAccessibilitySetting('reducedMotion')}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        accessibilitySettings.reducedMotion
                          ? 'border-purple-500 bg-purple-500/10 text-white font-extrabold'
                          : 'border-gray-800 bg-gray-950/40 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Reduced Motion</span>
                        <span className="text-[9px] text-gray-500 font-normal mt-0.5">Turns off sliding, spring, and hover transitions.</span>
                      </div>
                      <div className={`h-4.5 w-4.5 rounded-full border transition-all flex items-center justify-center ${accessibilitySettings.reducedMotion ? 'border-purple-500 bg-purple-500' : 'border-gray-600'}`}>
                        {accessibilitySettings.reducedMotion && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Profile meta card */}
                <div className="p-4 bg-gray-950 rounded-2xl border border-gray-850 space-y-2 text-xs">
                  <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block">Cognitive Twin Meta</span>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Learner Name:</span>
                    <span className="text-white font-bold">{studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Track:</span>
                    <span className="text-purple-400 font-bold capitalize">{learningGoal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Level:</span>
                    <span className="text-cyan-400 font-bold">Level {level}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-4 border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-400 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect Digital Twin</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#090d16]/95 border-t border-gray-800/80 backdrop-blur-md px-2 py-1 flex justify-around items-center md:hidden">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2 flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-purple-500 scale-105 font-extrabold' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[8px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
