'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore, SpacedRepetitionCard, StudyCircle } from '@/store/useStore';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Sparkles, Brain, Award, Zap, Clock, AlertTriangle, RefreshCw, Users, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { 
    studentName, 
    learningGoal, 
    learningStyle, 
    xp, 
    streak, 
    level, 
    studyHours, 
    retentionScore, 
    readinessScore, 
    revisionQueue,
    studyCircles,
    reviewSpacedCard,
    toggleStudyCircle
  } = useStore();

  // Radar data representing cognitive facets of the Digital Twin
  const digitalTwinRadarData = [
    { facet: 'Memory Strength', score: retentionScore, fullMark: 100 },
    { facet: 'Focus Speed', score: 88, fullMark: 100 },
    { facet: 'Active Recall Acc.', score: readinessScore, fullMark: 100 },
    { facet: 'Concept Coverage', score: 72, fullMark: 100 },
    { facet: 'Consistency', score: 95, fullMark: 100 },
  ];

  // Simulated retention historical trajectory
  const trajectoryData = [
    { day: 'Day 1', retention: 50, readiness: 45 },
    { day: 'Day 2', retention: 62, readiness: 58 },
    { day: 'Day 3', retention: 70, readiness: 69 },
    { day: 'Day 4', retention: 78, readiness: 74 },
    { day: 'Day 5', retention: retentionScore, readiness: readinessScore },
  ];

  // Filter queue for cards due for revision
  const dueCards = revisionQueue.filter(card => card.nextReviewDue === 'Now');

  return (
    <div className="space-y-6">
      
      {/* Welcome & Streak Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Learner Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#090d16]/80 to-purple-950/20 border border-[#1f2937]/50 relative overflow-hidden flex flex-col justify-between min-h-[170px] backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-purple-500/10 blur-[40px] pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-extrabold tracking-widest uppercase">
              <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
              <span>Cognitive Twin Hub — Active</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              Greetings, {studentName}! 👋
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl font-light">
              Your digital twin is currently simulating your retention decay. You have a target exam goal configured for <span className="text-purple-400 font-bold capitalize">{learningGoal} Mastery</span> using a preferred <span className="text-cyan-400 font-bold capitalize">{learningStyle}</span> interface.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onNavigate('tutor')}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-105"
            >
              <Brain className="h-4 w-4" />
              Engage AI Tutor
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="py-2.5 px-5 rounded-xl bg-[#090d16] border border-gray-800 hover:border-purple-500/30 text-gray-300 font-semibold text-xs flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Explore Knowledge Graph</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Level & Streak Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl relative"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Milestones</span>
            <span className="py-1 px-3.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-extrabold tracking-wider">
              LEVEL {level}
            </span>
          </div>

          <div className="flex justify-between items-center my-4">
            {/* Streak */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Zap className="h-5.5 w-5.5 fill-purple-500" />
              </div>
              <div>
                <span className="block text-xl font-black text-white">{streak} days</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Daily Streak</span>
              </div>
            </div>
            {/* XP */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Award className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="block text-xl font-black text-white">{xp}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total XP</span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-wider">
              <span>{xp} XP</span>
              <span>{level * 250} XP Threshold</span>
            </div>
            <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                style={{ width: `${Math.min(100, (xp / (level * 250)) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spaced Repetition Critical Alert */}
      {retentionScore < 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4.5 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-start gap-3 backdrop-blur-md"
        >
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-400">Cognitive Risk Detected: Memory Strengths in Critical Decay</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed font-light">
              Your current average retention has fallen below optimal levels ({retentionScore}%). Several concepts require urgent active recall drills to prevent neural decay.
            </p>
            <button
              onClick={() => onNavigate('quiz')}
              className="mt-2.5 text-xs font-extrabold text-purple-400 flex items-center gap-1 hover:underline"
            >
              <span>Launch Practice Loop Now</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Analytics Visualizers (Digital Twin & Curves) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Twin */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl"
        >
          <div>
            <h3 className="text-base font-bold text-white">Digital Twin Spectrum</h3>
            <p className="text-xs text-gray-500 mt-0.5">Real-time simulation of cognitive facets</p>
          </div>
          <div className="h-64 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={digitalTwinRadarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="facet" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#4b5563', fontSize: 8 }} />
                <Radar name="Learner Twin" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Trajectory Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-white">Comprehension Trajectory</h3>
              <p className="text-xs text-gray-500 mt-0.5">Daily memory curves & preparedness score trends</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-bold bg-[#030712] border border-[#1f2937] px-3 py-1.5 rounded-xl">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>{studyHours} hrs logged</span>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="retention" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRetention)" strokeWidth={2} name="Memory Retention %" />
                <Area type="monotone" dataKey="readiness" stroke="#06b6d4" fillOpacity={1} fill="url(#colorReadiness)" strokeWidth={2} name="Exam Preparedness %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Spaced Repetition Retention Queue & Social circles row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Retention Queue (Spaced Repetition) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <RefreshCw className="h-4.5 w-4.5 text-purple-400" />
                <span>Spaced Repetition Queue</span>
              </h3>
              <span className="text-[10px] bg-purple-500/10 border border-purple-500/25 text-purple-300 font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider">
                Average Strength: {retentionScore}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-light">Train active recall: review cards due immediately to defeat forgetting curves.</p>
          </div>

          <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {dueCards.length === 0 ? (
              <div className="py-8 text-center text-gray-500 space-y-2">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <div className="text-xs font-semibold text-white">All Clear! Memory curves are fully stabilized.</div>
                <div className="text-[10px] font-light">New revision triggers in 4 hours. Explore new concepts in the graph!</div>
              </div>
            ) : (
              dueCards.map((card) => (
                <div 
                  key={card.id} 
                  className="p-4 rounded-2xl bg-gray-950/60 border border-gray-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/20 transition-colors"
                >
                  <div>
                    <span className="text-[9px] bg-[#030712] border border-gray-800 text-gray-400 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">{card.subject}</span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{card.concept}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-gray-500">Current Strength:</span>
                      <span className={`text-[10px] font-extrabold ${card.memoryStrength < 40 ? 'text-red-400' : 'text-amber-400'}`}>{card.memoryStrength}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => reviewSpacedCard(card.id, false)}
                      className="py-1.5 px-3 rounded-lg border border-red-500/25 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-400 text-[10px] font-extrabold transition-all"
                    >
                      Struggling ❌
                    </button>
                    <button
                      onClick={() => reviewSpacedCard(card.id, true)}
                      className="py-1.5 px-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white text-emerald-400 text-[10px] font-extrabold transition-all"
                    >
                      Recalled it! ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Community Study Circles Widget */}
        <div className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-cyan-400" />
              <span>Study Circles & Challenges</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-light">Collaborate, share review notes, and compete in weekly cohorts.</p>
          </div>

          <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {studyCircles.map((circle) => (
              <div 
                key={circle.id}
                className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-850 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{circle.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-500 font-medium">
                    <span>{circle.members} online</span>
                    <span>•</span>
                    <span className="text-purple-400 truncate">{circle.activity}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleStudyCircle(circle.id)}
                  className={`py-1.5 px-3 rounded-lg text-[9px] font-extrabold shrink-0 transition-all ${
                    circle.joined
                      ? 'border border-gray-800 bg-[#030712] text-gray-400 hover:text-red-400 hover:border-red-500/20'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-[#030712]'
                  }`}
                >
                  {circle.joined ? 'Leave' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
