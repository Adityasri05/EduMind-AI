'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Onboarding from '@/components/Onboarding';
import AppShell from '@/components/AppShell';

export default function Home() {
  const [view, setView] = useState<'landing' | 'onboarding' | 'app'>('landing');

  const handleStartLearning = () => {
    setView('onboarding');
  };

  const handleTryVoiceTutor = () => {
    // Fast-track onboarding for Voice Tutor trial with default options
    setView('app');
  };

  const handleOnboardingComplete = () => {
    setView('app');
  };

  const handleLogout = () => {
    setView('landing');
  };

  return (
    <main className="min-h-screen bg-[#090d16]">
      {view === 'landing' && (
        <LandingPage
          onStartLearning={handleStartLearning}
          onTryVoiceTutor={handleTryVoiceTutor}
        />
      )}
      {view === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {view === 'app' && (
        <AppShell onLogout={handleLogout} />
      )}
    </main>
  );
}
