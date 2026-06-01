'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Zap, Play, CheckCircle2, Lock, Sparkles, BookOpen, ChevronRight, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface LearningGraphProps {
  onNavigate: (tab: string) => void;
}

interface Node {
  id: string;
  label: string;
  category: 'Math' | 'Physics' | 'CS';
  mastery: number; // 0 - 100
  attempts: number;
  confidence: 'High' | 'Medium' | 'Low';
  prerequisites: string[];
  recommendation: string;
  locked: boolean;
  x: number; // relative placement %
  y: number;
}

export default function LearningGraph({ onNavigate }: LearningGraphProps) {
  const { addChatMessage } = useStore();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodes: Node[] = [
    // Mathematics / Calculus
    { id: 'calc-3', label: 'Calculus III', category: 'Math', mastery: 95, attempts: 12, confidence: 'High', prerequisites: [], recommendation: 'Completed. Mastery standards achieved.', locked: false, x: 20, y: 20 },
    { id: 'deriv', label: 'Derivatives', category: 'Math', mastery: 85, attempts: 8, confidence: 'High', prerequisites: ['calc-3'], recommendation: 'Completed. Node fully stable.', locked: false, x: 40, y: 15 },
    { id: 'power-ser', label: 'Power Series', category: 'Math', mastery: 68, attempts: 5, confidence: 'Medium', prerequisites: ['calc-3'], recommendation: 'Moderate decay. Review polynomial derivations.', locked: false, x: 40, y: 35 },
    { id: 'taylor-ser', label: 'Taylor Series Expansion', category: 'Math', mastery: 42, attempts: 3, confidence: 'Medium', prerequisites: ['deriv', 'power-ser'], recommendation: 'Urgent! Active recall threshold critical. Review sin(x) / cos(x) expansions.', locked: false, x: 65, y: 25 },
    { id: 'maclaurin', label: 'Maclaurin Expansion', category: 'Math', mastery: 0, attempts: 0, confidence: 'Low', prerequisites: ['taylor-ser'], recommendation: 'Prerequisites locked. Master Taylor Series first.', locked: true, x: 85, y: 25 },

    // Wave Optics
    { id: 'wave-th', label: 'Wave Theory Foundations', category: 'Physics', mastery: 90, attempts: 9, confidence: 'High', prerequisites: [], recommendation: 'Node stabilized.', locked: false, x: 20, y: 60 },
    { id: 'superpos', label: 'Superposition Principle', category: 'Physics', mastery: 88, attempts: 6, confidence: 'High', prerequisites: ['wave-th'], recommendation: 'Node stabilized.', locked: false, x: 40, y: 55 },
    { id: 'coherence', label: 'Wave Coherence', category: 'Physics', mastery: 72, attempts: 4, confidence: 'Medium', prerequisites: ['wave-th'], recommendation: 'Review temporal vs spatial coherence vectors.', locked: false, x: 40, y: 75 },
    { id: 'interf', label: 'Double Slit Interference', category: 'Physics', mastery: 58, attempts: 3, confidence: 'Medium', prerequisites: ['superpos', 'coherence'], recommendation: 'Active recall required. Revise fringe width β proportional ratios.', locked: false, x: 65, y: 65 },
    { id: 'diffract', label: 'Diffraction Grating', category: 'Physics', mastery: 0, attempts: 0, confidence: 'Low', prerequisites: ['interf'], recommendation: 'Node locked. Complete Interference pathways first.', locked: true, x: 85, y: 65 }
  ];

  const handleLearnNode = (node: Node) => {
    // Add dynamic automated chatbot prompt
    addChatMessage({
      sender: 'user',
      text: `Teach me about ${node.label} from a first-principles perspective. Please give visual concept breakdowns and formula sheets!`
    });
    // Navigate straight to tutor loop!
    onNavigate('tutor');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-extrabold uppercase tracking-widest">
            <Network className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
            <span>Loop 04 — Knowledge Graph</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Interactive Prerequisite Concept Map</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">Explore active branches, locate bottlenecks, and trigger targeted path updates.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-emerald-500" /> Mastered</div>
          <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" /> Active learning</div>
          <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full bg-gray-800" /> Locked</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Visual Graph Area */}
        <div className="xl:col-span-3 h-[520px] rounded-3xl border border-[#1f2937]/50 bg-[#090d16]/80 relative overflow-hidden backdrop-blur-xl group">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* SVG Links between nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* We draw explicit paths for defined prerequisites */}
            {nodes.map(node => {
              return node.prerequisites.map(prereqId => {
                const source = nodes.find(n => n.id === prereqId);
                if (!source) return null;
                
                // Construct beautiful curves
                const startX = `${source.x}%`;
                const startY = `${source.y}%`;
                const endX = `${node.x}%`;
                const endY = `${node.y}%`;

                return (
                  <g key={`${source.id}-${node.id}`}>
                    <path
                      d={`M ${source.x * 5.2 + 20} ${source.y * 4.8 + 20} Q ${(source.x + node.x) * 2.6 + 20} ${(source.y + node.y) * 2.4 + 20} ${node.x * 5.2 + 20} ${node.y * 4.8 + 20}`}
                      fill="none"
                      stroke={node.locked ? '#1f2937' : '#8b5cf6'}
                      strokeWidth={1.5}
                      strokeDasharray={node.locked ? '4,4' : 'none'}
                      opacity={node.locked ? 0.3 : 0.6}
                    />
                  </g>
                );
              });
            })}
          </svg>

          {/* Dynamic Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            let statusColor = 'bg-gray-850 border-gray-800 text-gray-500';
            if (!node.locked) {
              statusColor = node.mastery >= 80 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                : 'bg-purple-950/40 border-purple-500/60 text-purple-300';
            }

            return (
              <motion.button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                whileHover={{ scale: node.locked ? 1 : 1.05 }}
                className={`absolute p-3 rounded-2xl border text-left flex flex-col justify-between gap-1 shadow-lg backdrop-blur-md z-10 transition-colors ${statusColor} ${
                  isSelected ? 'ring-2 ring-purple-400' : ''
                }`}
                style={{ 
                  left: `calc(${node.x}% - 60px)`, 
                  top: `calc(${node.y}% - 35px)`,
                  width: '140px',
                  height: '75px'
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest opacity-60">{node.category}</span>
                  {node.locked ? <Lock className="h-3 w-3 opacity-40" /> : <span className="text-[9px] font-bold">{node.mastery}%</span>}
                </div>
                <h4 className="text-xs font-bold leading-tight truncate w-full text-white">{node.label}</h4>
                <div className="h-1.5 w-full bg-gray-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${node.mastery}%` }} />
                </div>
              </motion.button>
            );
          })}

          <div className="absolute bottom-4 left-4 p-3 bg-gray-950/80 border border-gray-850 rounded-xl text-[10px] font-medium text-gray-500">
            💡 Click on any concept node to analyze dependencies & launch structured AI lessons.
          </div>
        </div>

        {/* Selected Node Drawer / Info Panel */}
        <div className="xl:col-span-1 rounded-3xl border border-[#1f2937]/50 bg-[#090d16]/80 p-6 flex flex-col justify-between backdrop-blur-xl min-h-[380px]">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] bg-purple-500/10 border border-purple-500/25 text-purple-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedNode.category} Concept Node
                    </span>
                    <h3 className="text-lg font-black text-white mt-2 leading-tight">{selectedNode.label}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-gray-950/65 rounded-xl border border-gray-850">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Mastery %</span>
                      <span className="text-base font-extrabold text-white">{selectedNode.mastery}%</span>
                    </div>
                    <div className="p-3 bg-gray-950/65 rounded-xl border border-gray-850">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Attempts</span>
                      <span className="text-base font-extrabold text-white">{selectedNode.attempts} drills</span>
                    </div>
                    <div className="p-3 bg-gray-950/65 rounded-xl border border-gray-850">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Confidence</span>
                      <span className={`text-base font-extrabold ${selectedNode.confidence === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedNode.confidence}</span>
                    </div>
                    <div className="p-3 bg-gray-950/65 rounded-xl border border-gray-850">
                      <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Status</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                        {selectedNode.locked ? (
                          <>
                            <Lock className="h-3.5 w-3.5 text-red-400" />
                            <span>Locked</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Available</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-950/80 rounded-2xl border border-gray-850 space-y-1">
                    <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Prediction & Recommendations
                    </span>
                    <p className="text-xs text-gray-400 leading-normal font-light">
                      {selectedNode.recommendation}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    disabled={selectedNode.locked}
                    onClick={() => handleLearnNode(selectedNode)}
                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                      selectedNode.locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Engage Conceptual Tutor</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-gray-550 space-y-3 py-10">
                <div className="h-12 w-12 rounded-2xl bg-gray-950 border border-gray-850 flex items-center justify-center text-gray-500">
                  <Network className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Concept Inspector</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[200px] leading-normal font-light">Select any node in the knowledge graph to inspect conceptual prerequisites.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
