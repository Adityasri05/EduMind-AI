'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Calendar, Clock, Star, Flame, CheckSquare, Plus, Trash2 } from 'lucide-react';

export default function StudyPlanner() {
  const { tasks, toggleTaskCompletion, addTask } = useStore();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Mathematics');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('high');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle, taskSubject, taskPriority);
    setTaskTitle('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Target Timeline Countdown Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-950/40 to-cyan-900/10 border border-purple-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Structured Goal Planner — Active</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Upcoming Adaptive Review Milestone
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-lg font-light">
            Follow your customized active revision checklist below. Consistent daily recall intervals ensure memory curve stabilization.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex gap-2 relative z-10 shrink-0">
          <div className="p-3 bg-gray-950/90 border border-gray-850 rounded-2xl text-center min-w-[70px]">
            <span className="block text-2xl font-black text-purple-400">12</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Days</span>
          </div>
          <div className="p-3 bg-gray-950/90 border border-gray-850 rounded-2xl text-center min-w-[70px]">
            <span className="block text-2xl font-black text-cyan-400">06</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Hrs</span>
          </div>
          <div className="p-3 bg-gray-950/90 border border-gray-850 rounded-2xl text-center min-w-[70px]">
            <span className="block text-2xl font-black text-emerald-400">32</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Mins</span>
          </div>
        </div>
      </motion.div>

      {/* Main planner grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Task lists & metrics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 p-6 rounded-[2rem] bg-[#090d16]/80 border border-[#1f2937]/50 space-y-6 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white">Active Revision Checklist</h3>
              <p className="text-xs text-gray-500 mt-0.5">Custom focus objectives logged by your co-pilot</p>
            </div>
            {/* Completion percentage */}
            <div className="text-right shrink-0">
              <span className="block text-xl font-black text-purple-400">{completionPercentage}%</span>
              <span className="text-[9px] text-gray-550 font-bold uppercase tracking-wider">Comprehension Done</span>
            </div>
          </div>

          {/* Simple task items */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompletion(task.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  task.completed
                    ? 'border-gray-950 bg-gray-950/20 text-gray-500 line-through opacity-60'
                    : 'border-gray-850 bg-gray-950/40 hover:border-purple-500/25'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                    task.completed ? 'border-purple-500 bg-purple-500' : 'border-gray-800'
                  }`}>
                    {task.completed && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-200">{task.title}</span>
                    <span className="block text-[9px] text-gray-550 font-extrabold uppercase tracking-wider mt-0.5">{task.subject}</span>
                  </div>
                </div>

                {/* Priority matrix indicator */}
                {!task.completed && (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    task.priority === 'medium' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {task.priority}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add tasks form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-[2rem] bg-[#090d16]/80 border border-[#1f2937]/50 flex flex-col justify-between backdrop-blur-xl"
        >
          <div>
            <h3 className="text-base font-bold text-white">Create New Task</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-light">Plan manual review triggers</p>
          </div>

          <form onSubmit={handleAddTask} className="space-y-4 my-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Objective Details</label>
              <input
                type="text"
                placeholder="e.g. Expand sin(x) Taylor terms..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-850 focus:border-purple-500 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-600 outline-none transition-all font-light"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subject Track</label>
              <select
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                className="w-full bg-gray-950 border border-gray-850 focus:border-purple-500 rounded-xl py-3 px-3 text-xs text-gray-300 outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['high', 'medium', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTaskPriority(p)}
                    className={`py-2 text-[10px] font-bold rounded-xl border capitalize transition-all ${
                      taskPriority === p
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 font-bold'
                        : 'border-gray-800 bg-[#090d16] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 text-white font-extrabold rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10"
            >
              <Plus className="h-4 w-4" />
              <span>Log Objective</span>
            </button>
          </form>
        </motion.div>
      </div>

    </div>
  );
}
