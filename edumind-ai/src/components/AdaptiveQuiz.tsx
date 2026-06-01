'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, SpacedRepetitionCard } from '@/store/useStore';
import { api } from '@/utils/api';
import { HelpCircle, Award, CheckCircle, XCircle, ArrowRight, Lightbulb, Loader2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  subject: string;
  chapter: string;
}

export default function AdaptiveQuiz() {
  const { addXp, streak, incrementStreak, studentId, revisionQueue, reviewSpacedCard } = useStore();

  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards'>('quiz');

  // Quiz States
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  // Flashcard States
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchQuestion = async () => {
    setQuizLoading(true);
    try {
      const q = await api.getQuizQuestion('Taylor Series');
      let parsedOptions = q.options;
      if (typeof q.options === 'string') {
        try {
          parsedOptions = JSON.parse(q.options);
        } catch {
          parsedOptions = q.options.split(',');
        }
      }
      
      setCurrentQuestion({
        id: String(q.id),
        question: q.question_text,
        options: parsedOptions,
        correctAnswer: q.correct_option,
        explanation: q.explanation_text,
        hint: q.importance_tag === 'critical' ? 'Recall Taylor expansions formula around center a = 0!' : 'Double check formula details.',
        subject: q.subject,
        chapter: q.chapter
      });
      setDiagnostics(null);
    } catch (err) {
      console.error('Quiz fetch error:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit adaptive quiz scores
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleQuizSubmit = async () => {
    if (selectedOption === null || isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981']
      });
      addXp(25);
      incrementStreak();
    } else {
      addXp(5);
    }

    try {
      const res = await api.submitQuizScore(
        studentId || 1,
        currentQuestion.subject,
        currentQuestion.chapter,
        isCorrect ? 100 : 0
      );
      setDiagnostics(res.diagnostic_assessment);
    } catch (err) {
      console.error('Error submitting quiz score:', err);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    fetchQuestion();
  };

  // Flashcards reviews
  const activeFlashcards = revisionQueue;

  const handleFlashcardRating = (cardId: string, knowIt: boolean) => {
    setIsFlipped(false);
    reviewSpacedCard(cardId, knowIt);
    addXp(15);

    if (knowIt) {
      confetti({
        particleCount: 40,
        spread: 30,
        colors: ['#10b981', '#06b6d4']
      });
    }

    // Advance index smoothly
    setTimeout(() => {
      if (currentCardIndex < activeFlashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0); // loop back
      }
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Selector Tabs */}
      <div className="flex bg-[#090d16]/90 p-1.5 rounded-2xl border border-gray-800/80">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'quiz'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Adaptive Quizzes
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'flashcards'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Spaced Recall Flashcards ({activeFlashcards.length})
        </button>
      </div>

      {activeTab === 'quiz' ? (
        /* QUIZ RENDER */
        <div className="bg-[#090d16]/80 border border-[#1f2937]/50 rounded-[2rem] p-6 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-cyan-400" />
          
          {quizLoading ? (
            <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-gray-500">
              <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-purple-300">Generating Cognitive Question...</p>
            </div>
          ) : !currentQuestion ? (
            <div className="p-8 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-gray-300 font-semibold">Failed to assemble question. Please check connectivity.</p>
              <button onClick={fetchQuestion} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold">
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* Quiz Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-800/40">
                <div className="space-y-0.5">
                  <span className="text-[9px] bg-purple-500/10 border border-purple-500/25 text-purple-300 font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {currentQuestion.subject} Unit
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{currentQuestion.chapter} Active Test</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-xl shadow-sm">
                  <Award className="h-3.5 w-3.5" />
                  <span>+25 XP</span>
                </div>
              </div>

              {/* Question */}
              <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-850">
                <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Hint */}
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/5 hover:bg-cyan-500/10 px-3.5 py-2 rounded-xl border border-cyan-500/10 transition-colors"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>{showHint ? 'Hide Concept Clue' : 'Show Concept Clue'}</span>
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs text-cyan-200/90 leading-relaxed font-light overflow-hidden"
                    >
                      <strong>Concept Clue:</strong> {currentQuestion.hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, index) => {
                  let optionStyles = 'border-gray-800 bg-[#090d16]/30 text-gray-400 hover:border-gray-700';

                  if (selectedOption === index) {
                    optionStyles = 'border-purple-500 bg-purple-500/10 text-white font-extrabold';
                  }

                  if (isAnswered) {
                    if (index === currentQuestion.correctAnswer) {
                      optionStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-extrabold';
                    } else if (selectedOption === index) {
                      optionStyles = 'border-red-500 bg-red-500/10 text-red-400 font-extrabold';
                    } else {
                      optionStyles = 'border-gray-900 bg-gray-950/30 text-gray-600';
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${optionStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                          selectedOption === index ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-800 text-gray-500'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm font-semibold">{option}</span>
                      </div>

                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && selectedOption === index && index !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit / Next */}
              <div className="flex gap-4 pt-4 border-t border-gray-850">
                {!isAnswered ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedOption === null}
                    className={`w-full py-4 rounded-2xl bg-purple-600 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center transition-all ${
                      selectedOption === null ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-750 hover:scale-[1.01] active:scale-95'
                    }`}
                  >
                    Verify Answer Selection
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                  >
                    <span>Fetch Next Adaptive Concept</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Diagnostics & Explanation */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Explanation */}
                    <div className="p-4 rounded-2xl border border-gray-850 bg-gray-950/40 space-y-2">
                      <h5 className={`text-xs font-bold uppercase tracking-wider ${selectedOption === currentQuestion.correctAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
                        {selectedOption === currentQuestion.correctAnswer ? 'Correct! Conceptual proof:' : 'Conceptual Correction:'}
                      </h5>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {currentQuestion.explanation}
                      </p>
                    </div>

                    {/* AI Diagnostics */}
                    {diagnostics && (
                      <div className="p-4.5 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-2">
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
                          <span>Dynamic Diagnostics Report</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs py-1">
                          <div>
                            <span className="text-gray-500 font-bold block uppercase tracking-wider text-[8px]">Comprehension Score</span>
                            <span className="text-base text-white font-black">{diagnostics.average_score}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold block uppercase tracking-wider text-[8px]">Confidence Vector</span>
                            <span className="text-base text-purple-400 font-black">{diagnostics.confidence_score}%</span>
                          </div>
                        </div>
                        {diagnostics.recommendations.map((rec: string, idx: number) => (
                          <p key={idx} className="text-xs text-gray-300 leading-normal font-light">
                            💡 {rec}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      ) : (
        /* FLASHCARDS RENDER */
        <div className="space-y-6">
          {activeFlashcards.length === 0 ? (
            <div className="p-12 text-center rounded-[2rem] border border-gray-800/80 bg-[#090d16]/80 space-y-3">
              <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Active Recall Deck Stabilized!</h4>
              <p className="text-xs text-gray-500 font-light">Your Learner Digital Twin reports zero cards requiring spaced intervals right now.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Card Meta */}
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                <span>Recall exercise {currentCardIndex + 1} of {activeFlashcards.length}</span>
                <span className="text-purple-400">Targeting Memory Decay</span>
              </div>

              {/* 3D Flippable Card */}
              <div 
                className="perspective-1000 w-full h-72 cursor-pointer relative"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full absolute rounded-[2rem] border border-[#1f2937]/50 bg-[#090d16]/90 shadow-2xl p-8 flex flex-col justify-between items-center text-center overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* FRONT SIDE */}
                  <div 
                    className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-[9px] bg-purple-500/10 border border-purple-500/25 text-purple-300 font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider shrink-0">
                      {activeFlashcards[currentCardIndex].subject} Concept
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white px-4 leading-snug my-auto">
                      {activeFlashcards[currentCardIndex].concept}
                    </h3>
                    <span className="text-[10px] text-gray-550 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" /> Click to Flip Card
                    </span>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center bg-purple-950/20"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span className="text-[9px] bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider shrink-0">
                      Decay Level: {activeFlashcards[currentCardIndex].memoryStrength}%
                    </span>
                    
                    <div className="my-auto space-y-3">
                      <h4 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Automated Active Retrieval Guidance</h4>
                      <p className="text-sm font-semibold text-white leading-relaxed px-4">
                        Recall formula expansions or principal proof models for <strong className="text-purple-400">{activeFlashcards[currentCardIndex].concept}</strong>. Do you know it from memory?
                      </p>
                    </div>

                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider shrink-0">
                      Tap again to return to card front
                    </span>
                  </div>

                </motion.div>
              </div>

              {/* Rate Recall Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleFlashcardRating(activeFlashcards[currentCardIndex].id, false)}
                  className="flex-1 py-4 bg-red-500/10 border border-red-500/35 hover:bg-red-500 text-red-400 hover:text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  ✕ Struggling / Decay High
                </button>
                <button
                  onClick={() => handleFlashcardRating(activeFlashcards[currentCardIndex].id, true)}
                  className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/35 hover:bg-emerald-500 text-emerald-400 hover:text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  ✓ Recalled it / Restored
                </button>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
