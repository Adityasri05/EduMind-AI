import { create } from 'zustand';
import { api } from '@/utils/api';

export type Dialect = 'hindi' | 'hinglish' | 'awadhi' | 'bhojpuri';
export type ClassLevel = '9th' | '10th' | '11th' | '12th';
export type UserRole = 'student' | 'parent' | 'teacher' | 'guest';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  voiceUrl?: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface PlannerTask {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface AppState {
  // Authentication & Onboarding
  studentId: number | null;
  userRole: UserRole;
  isLoggedIn: boolean;
  studentName: string;
  classLevel: ClassLevel;
  selectedDialect: Dialect;
  selectedSubjects: string[];
  
  // Gamification & Progress
  xp: number;
  streak: number;
  level: number;
  studyHours: number;
  offlineMode: boolean;
  
  // AI Tutor Conversations
  chatHistory: ChatMessage[];
  
  // Quiz states
  quizScore: number;
  currentQuizIndex: number;

  // Study Planner
  tasks: PlannerTask[];

  // Actions
  setLoggedIn: (loggedIn: boolean) => void;
  setUserRole: (role: UserRole) => void;
  setOnboardingData: (name: string, classLvl: ClassLevel, dialect: Dialect, subjects: string[]) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  toggleOfflineMode: () => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  toggleTaskCompletion: (taskId: string) => void;
  addTask: (title: string, subject: string, priority: 'high' | 'medium' | 'low') => void;
}

const dialectConversationalGreetings = {
  hindi: 'नमस्ते! मैं आपका शिक्षा मित्र एआई हूँ। आज हम क्या पढ़ेंगे?',
  hinglish: 'Hey there! Main aapka ShikshaMitra AI hoon. Aaj kya padhna chahte ho aap?',
  awadhi: 'प्रणाम भैया! हम अहैं तोहार शिक्षा मित्र एआई। आज का पढ़ब हम सब मिलके?',
  bhojpuri: 'परनाम बाबू! हम रउआ सभके शिक्षा मित्र एआई बानी। आज का पढ़ल जाई?'
};

export const useStore = create<AppState>((set) => ({
  studentId: null,
  userRole: 'guest',
  isLoggedIn: false,
  studentName: 'अमन कुमार (Aman)',
  classLevel: '10th',
  selectedDialect: 'hinglish',
  selectedSubjects: ['Mathematics', 'Science', 'English', 'Social Science'],
  xp: 320,
  streak: 7,
  level: 3,
  studyHours: 14.5,
  offlineMode: false,
  chatHistory: [
    {
      id: 'welcome',
      sender: 'ai',
      text: dialectConversationalGreetings['hinglish'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  quizScore: 0,
  currentQuizIndex: 0,
  tasks: [
    { id: '1', title: 'त्रिकोणमिति (Trigonometry) के 5 PYQs हल करें', subject: 'Mathematics', completed: false, priority: 'high' },
    { id: '2', title: 'प्रकाश परावर्तन (Reflection of Light) के नियम पढ़ें', subject: 'Science', completed: true, priority: 'high' },
    { id: '3', title: 'UP Board Model Paper Section A हल करें', subject: 'English', completed: false, priority: 'medium' },
    { id: '4', title: '1857 की क्रांति के मुख्य कारणों का रिवीज़न', subject: 'Social Science', completed: false, priority: 'low' },
  ],

  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  
  setUserRole: (role) => set({ userRole: role }),

  setOnboardingData: async (name, classLvl, dialect, subjects) => {
    let student;
    try {
      student = await api.registerStudent(name, classLvl, dialect);
    } catch (err) {
      console.warn('Backend offline during onboarding, using local defaults:', err);
      student = {
        id: 1,
        name: name || 'अमन कुमार',
        class_level: classLvl,
        preferred_dialect: dialect,
        xp: 320,
        streak: 7,
        level: 3,
        study_hours: 14.5,
      };
    }
    const welcomeGreeting = dialectConversationalGreetings[dialect] || dialectConversationalGreetings['hinglish'];
    set({
      studentId: student.id,
      studentName: student.name,
      classLevel: student.class_level as ClassLevel,
      selectedDialect: student.preferred_dialect as Dialect,
      selectedSubjects: subjects,
      isLoggedIn: true,
      xp: student.xp,
      streak: student.streak,
      level: student.level,
      studyHours: student.study_hours,
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
    const nextLevelThreshold = state.level * 200;
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
        text: dialectConversationalGreetings[state.selectedDialect] || dialectConversationalGreetings['hinglish'],
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
  }))
}));
