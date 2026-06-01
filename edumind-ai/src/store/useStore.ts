import { create } from 'zustand';
import { api } from '@/utils/api';

export type UserRole = 'student' | 'parent' | 'teacher' | 'guest';
export type LearningStyle = 'visual' | 'auditory' | 'reading_writing' | 'kinesthetic';
export type LearningGoal = 'engineering' | 'medical' | 'high_school' | 'coding' | 'languages';
export type Language = 'english' | 'hindi' | 'spanish' | 'marathi' | 'bengali';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  voiceUrl?: string;
  imageUrl?: string;
  conceptMap?: {
    nodes: Array<{ id: string; label: string; x: number; y: number; status: 'mastered' | 'learning' | 'locked' }>;
    links: Array<{ source: string; target: string }>;
  };
  steps?: string[];
  formulas?: string[];
  examples?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SpacedRepetitionCard {
  id: string;
  concept: string;
  subject: string;
  memoryStrength: number; // 0 - 100
  nextReviewDue: string;  // e.g. "Now", "2 hours", "1 day"
  lastReviewed?: string;
}

export interface StudyCircle {
  id: string;
  name: string;
  members: number;
  activity: string;
  joined: boolean;
}

export interface PlannerTask {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AccessibilitySettings {
  dyslexiaMode: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
}

interface AppState {
  // Authentication & Onboarding
  studentId: number | null;
  userRole: UserRole;
  isLoggedIn: boolean;
  studentName: string;
  learningStyle: LearningStyle;
  learningGoal: LearningGoal;
  language: Language;
  selectedSubjects: string[];
  
  // Gamification & Progress
  xp: number;
  streak: number;
  level: number;
  studyHours: number;
  retentionScore: number; // 0-100
  readinessScore: number; // 0-100
  offlineMode: boolean;
  
  // Active Modules Data
  chatHistory: ChatMessage[];
  quizScore: number;
  currentQuizIndex: number;
  tasks: PlannerTask[];
  revisionQueue: SpacedRepetitionCard[];
  studyCircles: StudyCircle[];
  
  // Accessibility
  accessibilitySettings: AccessibilitySettings;

  // Actions
  setLoggedIn: (loggedIn: boolean) => void;
  setUserRole: (role: UserRole) => void;
  setOnboardingData: (
    name: string,
    goal: LearningGoal,
    lang: Language,
    style: LearningStyle,
    subjects: string[]
  ) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  toggleOfflineMode: () => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  toggleTaskCompletion: (taskId: string) => void;
  addTask: (title: string, subject: string, priority: 'high' | 'medium' | 'low') => void;
  toggleAccessibilitySetting: (key: keyof AccessibilitySettings) => void;
  reviewSpacedCard: (id: string, knowIt: boolean) => void;
  toggleStudyCircle: (id: string) => void;
}

export const welcomeMessages: Record<Language, string> = {
  english: "Welcome to EduMind AI! I am your personal cognitive companion. What would you like to master today?",
  hindi: "EduMind AI में आपका स्वागत है! मैं आपका व्यक्तिगत शिक्षण साथी हूँ। आज आप किस विषय में महारत हासिल करना चाहेंगे?",
  spanish: "¡Bienvenido a EduMind AI! Soy tu compañero cognitivo personal. ¿Qué te gustaría dominar hoy?",
  marathi: "EduMind AI मध्ये आपले स्वागत आहे! मी तुमचा वैयक्तिक शिक्षण सोबती आहे. आज तुम्हाला कोणत्या विषयात प्रभुत्व मिळवायचे आहे?",
  bengali: "EduMind AI-তে আপনাকে স্বাগত! আমি আপনার ব্যক্তিগত শেখার সঙ্গী। আজ আপনি কোন বিষয়ে দক্ষতা অর্জন করতে চান?"
};

export const useStore = create<AppState>((set) => ({
  studentId: null,
  userRole: 'guest',
  isLoggedIn: false,
  studentName: 'Aria Carter',
  learningStyle: 'visual',
  learningGoal: 'engineering',
  language: 'english',
  selectedSubjects: ['Mathematics', 'Physics', 'Computer Science'],
  xp: 450,
  streak: 5,
  level: 4,
  studyHours: 18.2,
  retentionScore: 84,
  readinessScore: 78,
  offlineMode: false,
  
  chatHistory: [
    {
      id: 'welcome',
      sender: 'ai',
      text: welcomeMessages['english'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  
  quizScore: 0,
  currentQuizIndex: 0,
  
  tasks: [
    { id: '1', title: 'Complete Calculus III Chain Rule Concept Check', subject: 'Mathematics', completed: false, priority: 'high' },
    { id: '2', title: 'Solve Wave Optics diffraction pattern questions', subject: 'Physics', completed: true, priority: 'high' },
    { id: '3', title: 'Code Binary Search Tree DFS traversal in JavaScript', subject: 'Computer Science', completed: false, priority: 'medium' },
  ],
  
  revisionQueue: [
    { id: 'rev-1', concept: 'Taylor Series Expansion', subject: 'Mathematics', memoryStrength: 42, nextReviewDue: 'Now' },
    { id: 'rev-2', concept: 'Maxwell\'s Equations', subject: 'Physics', memoryStrength: 58, nextReviewDue: 'Now' },
    { id: 'rev-3', concept: 'Pointer Arithmetic & Memory Leaks', subject: 'Computer Science', memoryStrength: 30, nextReviewDue: 'Now' },
    { id: 'rev-4', concept: 'De Moivre\'s Theorem', subject: 'Mathematics', memoryStrength: 72, nextReviewDue: '4 hours' },
    { id: 'rev-5', concept: 'Kinematics in 2D', subject: 'Physics', memoryStrength: 89, nextReviewDue: '2 days' }
  ],
  
  studyCircles: [
    { id: 'circle-1', name: 'STEM Pioneers', members: 142, activity: 'Calculus Quiz active', joined: true },
    { id: 'circle-2', name: 'Elite Coders Club', members: 389, activity: 'React optimization challenge', joined: false },
    { id: 'circle-3', name: 'AI & Neural Nets', members: 89, activity: 'Transformer networks discussion', joined: false },
    { id: 'circle-4', name: 'Acoustics & Waves', members: 54, activity: 'Harmonics lab notes shared', joined: true }
  ],
  
  accessibilitySettings: {
    dyslexiaMode: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false
  },

  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  
  setUserRole: (role) => set({ userRole: role }),

  setOnboardingData: async (name, goal, lang, style, subjects) => {
    let student;
    try {
      student = await api.registerStudent(name, goal, lang, style);
    } catch (err) {
      console.warn('Backend offline during onboarding, using local defaults:', err);
      student = {
        id: Math.floor(1000 + Math.random() * 9000),
        name: name || 'Aria Carter',
        learning_goal: goal,
        preferred_language: lang,
        learning_style: style,
        xp: 450,
        streak: 5,
        level: 4,
        study_hours: 18.2,
      };
    }
    
    const welcomeGreeting = welcomeMessages[lang] || welcomeMessages['english'];
    set({
      studentId: student.id,
      studentName: student.name,
      learningGoal: goal,
      language: lang,
      learningStyle: style,
      selectedSubjects: subjects,
      isLoggedIn: true,
      xp: student.xp || 450,
      streak: student.streak || 5,
      level: student.level || 4,
      studyHours: student.study_hours || 18.2,
      chatHistory: [
        {
          id: 'welcome-onboarding',
          sender: 'ai',
          text: welcomeGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    });
  },

  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const nextLevelThreshold = state.level * 250;
    if (newXp >= nextLevelThreshold) {
      return { xp: newXp - nextLevelThreshold, level: state.level + 1 };
    }
    return { xp: newXp };
  }),

  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

  toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [
      ...state.chatHistory,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  })),

  clearChat: () => set((state) => ({
    chatHistory: [
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: welcomeMessages[state.language] || welcomeMessages['english'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  })),

  toggleTaskCompletion: (taskId) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t)
  })),

  addTask: (title, subject, priority) => set((state) => ({
    tasks: [
      ...state.tasks,
      {
        id: Math.random().toString(36).substring(7),
        title,
        subject,
        completed: false,
        priority
      }
    ]
  })),

  toggleAccessibilitySetting: (key) => set((state) => ({
    accessibilitySettings: {
      ...state.accessibilitySettings,
      [key]: !state.accessibilitySettings[key]
    }
  })),

  reviewSpacedCard: (id, knowIt) => set((state) => {
    const updatedQueue = state.revisionQueue.map((card) => {
      if (card.id === id) {
        const currentStrength = card.memoryStrength;
        const newStrength = knowIt 
          ? Math.min(100, currentStrength + 25) 
          : Math.max(10, currentStrength - 15);
        return {
          ...card,
          memoryStrength: newStrength,
          nextReviewDue: knowIt ? '1 day' : 'Now',
          lastReviewed: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return card;
    });

    // Calculate new average retention score based on queue
    const activeStrengths = updatedQueue.map(c => c.memoryStrength);
    const avgRetention = activeStrengths.length > 0 
      ? Math.round(activeStrengths.reduce((a, b) => a + b, 0) / activeStrengths.length) 
      : state.retentionScore;

    return {
      revisionQueue: updatedQueue,
      retentionScore: avgRetention
    };
  }),

  toggleStudyCircle: (id) => set((state) => ({
    studyCircles: state.studyCircles.map((c) => 
      c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c
    )
  }))
}));
