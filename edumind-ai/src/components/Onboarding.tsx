'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, LearningGoal, LearningStyle, Language } from '@/store/useStore';
import { ArrowRight, User, Globe, GraduationCap, Brain, Check, ShieldAlert } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { setOnboardingData } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<LearningGoal>('engineering');
  const [lang, setLang] = useState<Language>('english');
  const [style, setStyle] = useState<LearningStyle>('visual');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);

  const goalsList: { id: LearningGoal; label: string; desc: string }[] = [
    { id: 'engineering', label: 'Engineering & STEM', desc: 'Focus on advanced Calculus, Physics, and analytical logic.' },
    { id: 'coding', label: 'Coding & Software', desc: 'Algorithms, data structures, and practical software engineering.' },
    { id: 'medical', label: 'Medical & Life Sciences', desc: 'Biomedical systems, organic chemistry, and life processes.' },
    { id: 'high_school', label: 'High School General', desc: 'Core secondary education subjects and exam readiness.' },
    { id: 'languages', label: 'Languages & Humanities', desc: 'Global literature, grammar, structure, and communication.' },
  ];

  const languagesList: { id: Language; label: string; region: string }[] = [
    { id: 'english', label: 'English (Global)', region: 'International Standard' },
    { id: 'hindi', label: 'Hindi (हिंदी)', region: 'India & South Asia' },
    { id: 'spanish', label: 'Spanish (Español)', region: 'Europe & Americas' },
    { id: 'marathi', label: 'Marathi (मराठी)', region: 'Regional India' },
    { id: 'bengali', label: 'Bengali (বাংলা)', region: 'Regional India & Bangladesh' },
  ];

  const stylesList: { id: LearningStyle; label: string; desc: string; icon: string }[] = [
    { id: 'visual', label: 'Visual Explorer', desc: 'I digest information best through Concept Maps, interactive diagrams, and charts.', icon: '👁️' },
    { id: 'auditory', label: 'Auditory Learner', desc: 'I absorb principles via voice summaries, interactive podcasts, and audio tutoring.', icon: '🎧' },
    { id: 'reading_writing', label: 'Reading & Synthesis', desc: 'I prefer detailed code blocks, formulas reference sheets, and textual writeups.', icon: '📝' },
    { id: 'kinesthetic', label: 'Kinesthetic Challenger', desc: 'I learn by solving active quizzes, running algorithms, and interactive simulators.', icon: '⚡' },
  ];

  const subjectsList = [
    { id: 'Mathematics', label: 'Mathematics (Calculus, Algebra, Geometry)' },
    { id: 'Physics', label: 'Physics (Optics, Mechanics, Waves)' },
    { id: 'Computer Science', label: 'Computer Science (Algorithms, BST, React)' },
    { id: 'Chemistry', label: 'Chemistry (Organic, Thermodynamics)' },
    { id: 'Biology', label: 'Biology (Genetics, Life Processes)' }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setOnboardingData(name || 'Aria Carter', goal, lang, style, selectedSubjects);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSubject = (subId: string) => {
    if (selectedSubjects.includes(subId)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subId));
    } else {
      setSelectedSubjects([...selectedSubjects, subId]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#030712] text-[#f8fafc] relative">
      {/* Background neon elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl bg-[#090d16]/80 border border-[#1f2937]/50 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        {/* Sleek top colored line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-cyan-400" />

        {/* Step Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
            <span className="text-xs text-purple-400 font-extrabold tracking-widest uppercase">
              Digital Twin Setup — Step {step} of 5
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-purple-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Contents */}
        <div className="relative z-10 min-h-[330px]">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Initialize your cognitive profile.
                </h2>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Enter your name to start configuring your Learner Digital Twin. EduMind AI will use this to personalize review timers and predict learning bottlenecks.
                </p>
              </div>

              <div className="relative mt-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Aria Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-950/60 border border-[#1f2937] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-2xl py-4.5 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all font-semibold"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Select your learning goal.
                </h2>
                <p className="text-sm text-gray-400 font-light">
                  Choose the academic or professional path you want to program.
                </p>
              </div>

              <div className="space-y-2.5 mt-4 max-h-[280px] overflow-y-auto pr-1">
                {goalsList.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                      goal === g.id
                        ? 'border-purple-500 bg-purple-500/10 text-white shadow-lg'
                        : 'border-gray-800 bg-[#090d16]/30 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <GraduationCap className={`h-6 w-6 shrink-0 ${goal === g.id ? 'text-purple-400' : 'text-gray-600'}`} />
                    <div>
                      <div className="text-sm font-bold">{g.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Select primary language.
                </h2>
                <p className="text-sm text-gray-400 font-light">
                  Choose the language you prefer for AI conversations and learning loops.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {languagesList.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      lang === l.id
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-gray-800 bg-[#090d16]/30 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <Globe className={`h-5 w-5 ${lang === l.id ? 'text-purple-400' : 'text-gray-600'}`} />
                    <div>
                      <div className="text-sm font-bold">{l.label}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">{l.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Define your learning style.
                </h2>
                <p className="text-sm text-gray-400 font-light">
                  EduMind adapts its visualizers, text blocks, and quizzes to match your style.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {stylesList.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                      style === s.id
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-gray-800 bg-[#090d16]/30 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-2xl">{s.icon}</span>
                      {style === s.id && <span className="h-2 w-2 rounded-full bg-purple-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{s.label}</div>
                      <div className="text-[10px] text-gray-500 mt-1 leading-normal font-light">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Choose your subjects.
                </h2>
                <p className="text-sm text-gray-400 font-light">
                  Select at least two subjects to set up in your initial cognitive map.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                {subjectsList.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubject(sub.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-gray-800 bg-[#090d16]/30 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-sm font-bold">{sub.label}</span>
                      <div
                        className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-700'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="flex gap-4 mt-8 pt-4 border-t border-[#1f2937]/50 relative z-10">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-bold rounded-2xl transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className={`flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all ${
              step === 1 && !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{step === 5 ? 'Launch Platform!' : 'Continue'}</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
