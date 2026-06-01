'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, Award, AlertTriangle, Sparkles, Brain, CheckCircle, Target, ArrowRight, Lightbulb } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AnalyticsDashboard() {
  const { learningGoal, retentionScore, readinessScore } = useStore();

  const subjectMastery = [
    { name: 'Taylor Series Expansion', score: 42, weight: 'High', color: 'bg-red-500', recommendation: 'Review derivatives prerequisites' },
    { name: 'Wave Optics (Diffraction)', score: 75, weight: 'Critical', color: 'bg-cyan-500', recommendation: 'Verify path differences ratios' },
    { name: 'Linear Algebra (BST Search)', score: 92, weight: 'Medium', color: 'bg-emerald-500', recommendation: 'Node stabilized. Ready for advanced layers' },
    { name: 'Organic Hydrocarbons', score: 58, weight: 'High', color: 'bg-yellow-500', recommendation: 'Trigger Spaced Flashcard drills' }
  ];

  const predictiveReadinessData = [
    { week: 'Week 1', score: 45, confidence: 38 },
    { week: 'Week 2', score: 58, confidence: 52 },
    { week: 'Week 3', score: 67, confidence: 64 },
    { week: 'Week 4', score: 74, confidence: 71 },
    { week: 'Week 5', score: readinessScore, confidence: retentionScore }
  ];

  const distributionData = [
    { range: '0-20%', concepts: 1 },
    { range: '21-40%', concepts: 1 },
    { range: '41-60%', concepts: 3 },
    { range: '61-80%', concepts: 8 },
    { range: '81-100%', concepts: 14 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Readiness index card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex items-center justify-between backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400" />
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-gray-500 tracking-widest uppercase">Exam Preparedness Score</span>
            <span className="block text-3xl font-black text-white">{readinessScore}%</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> +8.4% improvement this week
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Target className="h-5.5 w-5.5" />
          </div>
        </motion.div>

        {/* Retention index card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex items-center justify-between backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500" />
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-gray-500 tracking-widest uppercase">Memory Strength Index</span>
            <span className="block text-3xl font-black text-white">{retentionScore}%</span>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Forgetting curves: Stable</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
            <Brain className="h-5.5 w-5.5 animate-pulse" />
          </div>
        </motion.div>

        {/* Bottlenecks alarm card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex items-center justify-between backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500" />
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-gray-500 tracking-widest uppercase">Active Bottlenecks</span>
            <span className="block text-3xl font-black text-white">1 Critical Risk</span>
            <span className="text-[10px] text-red-400 font-bold">Taylor Series under active decay</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
        </motion.div>
      </div>

      {/* Analytics Visualization and smartest AI suggestions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Topic breakdown list */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 space-y-4 backdrop-blur-xl"
        >
          <div>
            <h3 className="text-base font-bold text-white">Concept Mastery Breakdowns</h3>
            <p className="text-xs text-gray-500 mt-0.5">Real-time mastery index computed by cognitive sensors</p>
          </div>
          <div className="space-y-4 pr-1">
            {subjectMastery.map((topic, i) => (
              <div key={i} className="p-3 bg-gray-950/40 rounded-2xl border border-gray-850 space-y-2">
                <div className="flex justify-between text-xs font-bold items-center">
                  <div>
                    <span className="text-white font-semibold">{topic.name}</span>
                    <span className="text-[9px] bg-gray-900 text-gray-500 border border-gray-800 px-2 py-0.5 rounded ml-2 uppercase font-extrabold tracking-wider">{topic.weight} Weight</span>
                  </div>
                  <span className={`text-xs font-bold ${topic.score < 50 ? 'text-red-400' : 'text-emerald-400'}`}>{topic.score}%</span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full ${topic.color} rounded-full`} style={{ width: `${topic.score}%` }} />
                </div>
                <div className="text-[9px] text-gray-500 font-light italic flex items-center gap-1">
                  <Lightbulb className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span>Recommendation: {topic.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* smart recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl"
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              <span>AI Smart Bottleneck Recommendations</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Automated pathway adjustments to optimize curriculum success</p>
          </div>

          <div className="space-y-4 my-4">
            <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 font-extrabold text-xs shrink-0 border border-red-500/10">
                01
              </div>
              <div className="space-y-0.5">
                <span className="block text-xs font-extrabold text-red-400">Reconstruct Derivatives foundation</span>
                <span className="block text-[10px] text-gray-400 font-light leading-normal">
                  Your probability of scoring above 85% in Taylor Series is currently in critical decay due to weak prerequisite mappings in calculus derivatives. Ask the tutor to "Teach me Derivatives."
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-extrabold text-xs shrink-0 border border-purple-500/10">
                02
              </div>
              <div className="space-y-0.5">
                <span className="block text-xs font-extrabold text-purple-400">Restabilize double slit path ratios</span>
                <span className="block text-[10px] text-gray-400 font-light leading-normal">
                  Fringe widths accuracy is currently sitting at 58% on adaptive testing loops. Trigger an active recall practice quiz to stabilize index values.
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold rounded-2xl text-xs tracking-wider uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10">
            <span>Execute AI Recommended Repairs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Trajectories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Historical preparedness */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 backdrop-blur-xl"
        >
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">Comprehension Readiness Trajectory</h3>
            <p className="text-xs text-gray-500 mt-0.5">Weekly preparedness scores mapped against attention indexes</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictiveReadinessData}>
                <defs>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReadiness)" name="Readiness Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Concept distribution graph */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-3xl bg-[#090d16]/80 border border-[#1f2937]/50 backdrop-blur-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-bold text-white">Confidence Spread</h3>
            <p className="text-xs text-gray-500 mt-0.5">Spread of active conceptual nodes</p>
          </div>
          <div className="h-44 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <XAxis dataKey="range" stroke="#4b5563" fontSize={9} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '8px' }} />
                <Bar dataKey="concepts" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Nodes count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-550 text-center font-light pt-2 italic">
            Visualizing concept concentration layers inside memory caches.
          </div>
        </motion.div>

      </div>

    </div>
  );
}
