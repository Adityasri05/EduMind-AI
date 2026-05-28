'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { api } from '@/utils/api';
import { AlertCircle, HelpCircle, Award, CheckCircle, XCircle, ArrowRight, Lightbulb, Loader2 } from 'lucide-react';
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
  const { addXp, streak, incrementStreak, studentId } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const q = await api.getQuizQuestion('Trigonometry');
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
        hint: q.importance_tag === 'critical' ? 'पाइथागोरस त्रिक (Pythagorean Triplets) याद करें: 3, 4, 5!' : 'सूत्रों का दोबारा ध्यान से रिवीज़न करें।',
        subject: q.subject,
        chapter: q.chapter
      });
      setDiagnostics(null);
    } catch (err) {
      console.error('Quiz fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = async () => {
    if (selectedOption === null || isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#3b82f6', '#22c55e']
      });
      addXp(20);
      incrementStreak();
    } else {
      addXp(5);
    }

    try {
      // Send score to backend for live diagnostics assessment
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

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    fetchQuestion();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-gray-400 bg-[#111827] border border-gray-800 rounded-3xl">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-4" />
        <p className="text-sm font-semibold">एआई नया प्रश्न तैयार कर रहा है (Generating Question)...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center bg-[#111827] border border-gray-800 rounded-3xl">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-300 font-semibold mb-4">प्रश्न लोड करने में असमर्थ।</p>
        <button onClick={fetchQuestion} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold">
          दोबारा प्रयास करें
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#111827] border border-gray-800 rounded-3xl space-y-6">
      {/* Quiz Progress header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-805">
        <div className="space-y-0.5">
          <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">यूपी बोर्ड मॉडल टेस्ट (UP Board MCQ)</span>
          <h3 className="text-sm font-bold text-white">{currentQuestion.subject} - {currentQuestion.chapter}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-xl">
          <Award className="h-3.5 w-3.5" />
          <span>+20 XP Correct</span>
        </div>
      </div>

      {/* Question */}
      <div className="p-5 rounded-2xl bg-gray-950/40 border border-gray-850">
        <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {currentQuestion.question}
        </h4>
      </div>

      {/* Hint Alert */}
      <div className="relative">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/5 hover:bg-orange-500/10 px-3.5 py-2 rounded-xl transition-all"
        >
          <Lightbulb className="h-4 w-4" />
          {showHint ? 'संकेत छुपाएं (Hide Hint)' : 'संकेत दिखाएं (Show Hint)'}
        </button>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5 text-xs text-orange-200/90 leading-relaxed overflow-hidden"
            >
              <strong>टिप:</strong> {currentQuestion.hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          let optionStyles = 'border-gray-800 bg-[#1f2937]/35 text-gray-300 hover:border-gray-700';

          if (selectedOption === index) {
            optionStyles = 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold';
          }

          if (isAnswered) {
            if (index === currentQuestion.correctAnswer) {
              optionStyles = 'border-green-500 bg-green-500/10 text-green-400 font-bold';
            } else if (selectedOption === index) {
              optionStyles = 'border-red-500 bg-red-500/10 text-red-400 font-bold';
            } else {
              optionStyles = 'border-gray-900 bg-gray-900/30 text-gray-600';
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
                <div className={`h-7 w-7 rounded-lg border flex items-center justify-center text-xs font-bold ${
                  selectedOption === index ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-700 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm font-semibold">{option}</span>
              </div>

              {isAnswered && index === currentQuestion.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isAnswered && selectedOption === index && index !== currentQuestion.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Button Row */}
      <div className="flex gap-4 pt-4 border-t border-gray-805">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center transition-all ${
              selectedOption === null ? 'opacity-40 cursor-not-allowed' : 'hover:bg-orange-600 hover:scale-[1.01]'
            }`}
          >
            उत्तर की जांच करें (Check Answer)
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
          >
            <span>अगला प्रश्न (Next Question)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Explanation & Diagnostics block */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Answer Explanation */}
            <div className="p-4 rounded-2xl border border-gray-800 bg-gray-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={selectedOption === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}>
                  {selectedOption === currentQuestion.correctAnswer ? '🎉 शानदार! सही उत्तर' : '⚠️ गलत उत्तर! सीखें:'}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                {currentQuestion.explanation}
              </p>
            </div>

            {/* Diagnostic Report */}
            {diagnostics && (
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  📈 एआई डायग्नोस्टिक असेसमेंट (AI Diagnostic Report)
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold py-1">
                  <div>
                    <span className="text-gray-500">औसत शुद्धता (Accuracy):</span>
                    <span className="block text-sm text-white font-bold">{diagnostics.average_score}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">आत्मविश्वास स्कोर (Confidence):</span>
                    <span className="block text-sm text-blue-400 font-bold">{diagnostics.confidence_score}%</span>
                  </div>
                </div>
                {diagnostics.recommendations.map((rec: string, idx: number) => (
                  <p key={idx} className="text-xs text-orange-200 leading-relaxed">
                    💡 <strong>सलाह:</strong> {rec}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
