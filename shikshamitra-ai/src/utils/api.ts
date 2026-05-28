/**
 * ShikshaMitra AI - Unified API Utilities
 * Handles communication with the FastAPI backend (http://localhost:8000/api/v1).
 * Features automatic dual-mode fallback to premium simulated content
 * if the backend is offline, ensuring a 100% reliable demo.
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';
export const WS_BASE_URL = 'ws://localhost:8000/ws/tutor';

// Simulated database fallback stores
const mockStudentId = 1;
let mockStudentXp = 320;
let mockStudentStreak = 7;
const mockStudentLevel = 3;

const mockDialectGreetings = {
  hindi: 'नमस्ते! मैं आपका शिक्षा मित्र एआई हूँ। आज हम क्या पढ़ेंगे?',
  hinglish: 'Hey there! Main aapka ShikshaMitra AI hoon. Aaj kya padhna chahte ho aap?',
  awadhi: 'प्रणाम भैया! हम अहैं तोहार शिक्षा मित्र एआई। आज का पढ़ब हम सब मिलके?',
  bhojpuri: 'परनाम बाबू! हम रउआ सभके शिक्षा मित्र एआई बानी। आज का पढ़ल जाई?'
};

// Help helper for POST requests
async function postForm(endpoint: string, formData: Record<string, string | Blob>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    data.append(key, value);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function postJson(endpoint: string, body: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function getJson(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  /**
   * Register a new student or login existing student
   */
  async registerStudent(name: string, classLevel: string, dialect: string, email = ''): Promise<any> {
    try {
      const result = await postJson('/auth/register', {
        name,
        phone_number: `${Math.floor(1000000000 + Math.random() * 9000000000)}`, // random phone
        email: email.trim() || null,
        class_level: classLevel,
        preferred_dialect: dialect
      });
      console.log('Backend register success:', result);
      return result;
    } catch (err) {
      console.warn('Backend offline, using fallback registration:', err);
      // Fallback response matching StudentResponse schema
      return {
        id: mockStudentId,
        name,
        class_level: classLevel,
        preferred_dialect: dialect,
        xp: mockStudentXp,
        streak: mockStudentStreak,
        level: mockStudentLevel,
        study_hours: 14.5,
        offline_mode: false,
        created_at: new Date().toISOString()
      };
    }
  },

  /**
   * Send a query to the AI Tutor agent
   */
  async askTutor(studentId: number, messageText: string): Promise<any> {
    try {
      const result = await postForm('/tutor/chat', {
        student_id: String(studentId),
        message_text: messageText
      });
      return result;
    } catch (err) {
      console.warn('Backend tutor chat failed, using local dialect translation agent simulation:', err);
      
      // Simulate dialect-specific tutoring answer
      const q = messageText.toLowerCase();
      let answer = '';
      if (q.includes('trig') || q.includes('त्रिकोण') || q.includes('कोण')) {
        answer = `त्रिकोणमिति (Trigonometry) गणित की वह शाखा है जो त्रिभुज की भुजाओं और कोणों के बीच संबंधों का अध्ययन करती है।\nइसके मुख्य अनुपात: sin θ, cos θ, tan θ.\nयाद रखने की बोर्ड टॉपर ट्रिक: **लाल/कक्का (LAL/KKA)**!`;
      } else if (q.includes('photo') || q.includes('संश्लेषण') || q.includes('plants')) {
        answer = `प्रकाश संश्लेषण (Photosynthesis) वह रासायनिक प्रक्रिया है जिससे हरे पौधे धूप, पानी और CO₂ की मदद से अपना भोजन (ग्लूकोज) बनाते हैं और जीवनदायी ऑक्सीजन गैस मुक्त करते हैं।\nसमीकरण: **6CO₂ + 6H₂O + धूप → C₆H₁₂O₆ + 6O₂**`;
      } else {
        answer = `बहुत सुंदर सवाल पूछा है बाबू! यह आपकी आगामी यूपी बोर्ड परीक्षा के लिए बेहद महत्वपूर्ण है। चलिए इसे एकदम सरल शब्दों में विस्तार से समझते हैं...`;
      }
      
      // Return custom structured mock response matching ChatMessageResponse
      return {
        id: Math.floor(Math.random() * 10000),
        student_id: studentId,
        sender: 'ai',
        message_text: answer,
        sentiment_signal: 'confident',
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Upload notebook photo to OCR & Tutor agent
   */
  async uploadNotebook(studentId: number, file: File): Promise<any> {
    try {
      const result = await postForm('/tutor/upload-notebook', {
        student_id: String(studentId),
        notebook_photo: file
      });
      return result;
    } catch (err) {
      console.warn('Backend notebook upload failed, running local OCR stub:', err);
      return {
        id: Math.floor(Math.random() * 10000),
        student_id: studentId,
        sender: 'ai',
        message_text: `📝 [ नोटबुक फोटो: ${file.name} का विश्लेषण ]\n\nमैंने आपकी नोटबुक की तस्वीर का सफलतापूर्वक विश्लेषण कर लिया है!\n\n**पहचाना गया प्रश्न:** "त्रिकोणमितीय सर्वसमिका sin² A + cos² A = 1 को सिद्ध कीजिए।"\n\n**समाधान (Solution):**\n1. एक समकोण त्रिभुज ABC लीजिए, जिसमें कोण B समकोण है।\n2. पाइथागोरस प्रमेय से: AB² + BC² = AC²\n3. दोनों पक्षों को AC² से विभाजित करने पर: (AB/AC)² + (BC/AC)² = 1\n4. चूंकि AB/AC = cos A और BC/AC = sin A,\nअतः: **sin² A + cos² A = 1**। (इति सिद्धम)`,
        image_url: URL.createObjectURL(file),
        sentiment_signal: 'confident',
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Retrieve adaptive quiz question
   */
  async getQuizQuestion(chapter: string, difficulty = 'medium'): Promise<any> {
    try {
      const result = await getJson(`/quiz/generate?chapter=${encodeURIComponent(chapter)}&difficulty=${difficulty}`);
      return result;
    } catch (err) {
      console.warn('Backend quiz generation failed, using local NCERT pool:', err);
      const pools = [
        {
          id: 101,
          subject: 'Mathematics',
          chapter,
          question_text: 'यदि sin A = 3/5 है, तो cos A का मान क्या होगा? (If sin A = 3/5, find cos A)',
          options: ['4/5', '5/4', '3/4', '1'],
          correct_option: 0,
          explanation_text: 'त्रिकोणमितीय सर्वसमिका sin² A + cos² A = 1 का उपयोग करके: cos² A = 1 - (3/5)² = 16/25. अतः cos A = 4/5.',
          pyq_years: '2024, 2022',
          importance_tag: 'critical',
          difficulty_level: 'easy'
        },
        {
          id: 102,
          subject: 'Science',
          chapter,
          question_text: 'प्रकाश के अपवर्तन के द्वितीय नियम को किस नाम से जाना जाता है? (Snell\'s Law)',
          options: ['ओम का नियम', 'स्नेल का नियम', 'न्यूटन का नियम', 'फैराडे का नियम'],
          correct_option: 1,
          explanation_text: 'स्नेल के नियम के अनुसार, आपतन कोण की ज्या (sin i) और अपवर्तन कोण की ज्या (sin r) का अनुपात नियतांक होता है।',
          pyq_years: '2023, 2021',
          importance_tag: 'very-high',
          difficulty_level: 'medium'
        }
      ];
      return pools[Math.floor(Math.random() * pools.length)];
    }
  },

  /**
   * Submit quiz score and trigger diagnostics
   */
  async submitQuizScore(studentId: number, subject: string, chapter: string, score: number): Promise<any> {
    try {
      const result = await postJson(`/quiz/submit?student_id=${studentId}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}&score=${score}`, {});
      return result;
    } catch (err) {
      console.warn('Backend quiz submission offline, simulating diagnostic rewards:', err);
      mockStudentXp += score >= 80 ? 20 : 5;
      if (score >= 80) mockStudentStreak += 1;
      
      return {
        status: 'success',
        student_xp: mockStudentXp,
        streak_count: mockStudentStreak,
        diagnostic_assessment: {
          subject,
          average_score: score,
          weakness_flag: score < 60,
          confidence_score: Math.round(score * 0.95),
          recommendations: score < 60 
            ? [`आपके ${subject} के अध्याय ${chapter} में कम अंक आए हैं। कृपया एआई ट्यूटर से समझें।`] 
            : ["आपका प्रदर्शन उत्कृष्ट है! बोर्ड मॉडल पेपर हल करना जारी रखें।"]
        }
      };
    }
  },

  /**
   * Retrieve learning analytics records for student
   */
  async getStudentAnalytics(studentId: number): Promise<any> {
    try {
      return await getJson(`/analytics/student/${studentId}`);
    } catch (err) {
      console.warn('Backend analytics offline, returning mock:', err);
      return [
        { subject: 'Mathematics', chapter_name: 'Trigonometry', mastery_percentage: 32, confidence_score: 30, weak_topic_detected: true },
        { subject: 'Science', chapter_name: 'Reflection of Light', mastery_percentage: 75, confidence_score: 80, weak_topic_detected: false },
        { subject: 'English', chapter_name: 'Active/Passive Voice', mastery_percentage: 90, confidence_score: 95, weak_topic_detected: false }
      ];
    }
  },

  /**
   * Get personalized motivational nudge
   */
  async getMotivationNudge(studentId: number): Promise<any> {
    try {
      return await getJson(`/analytics/motivation/${studentId}`);
    } catch (err) {
      console.warn('Backend motivation offline, returning mock nudge:', err);
      const nudges = [
        "अरे वाह भैया! आपका लगातार 7 दिनों का स्टडी स्ट्राइक बन गया है। शेरशाह की तरह दहाड़ते रहें! 🦁",
        "सफलता एक दिन में नहीं मिलती, लेकिन हर दिन की गई छोटी मेहनत बोर्ड में 95% दिलाएगी। पढ़ते रहें!",
        "हजरतगंज (Lucknow) की तंग गलियों से निकलकर बोर्ड परीक्षा के टॉपर बनने का सपना सच होगा। हौसला रखें! 💪"
      ];
      return {
        student_id: studentId,
        streak: mockStudentStreak,
        level: mockStudentLevel,
        xp: mockStudentXp,
        nudge_message: nudges[Math.floor(Math.random() * nudges.length)]
      };
    }
  },

  /**
   * Fetch chapter weakness heatmap
   */
  async getWeaknessHeatmap(studentId: number): Promise<any> {
    try {
      return await getJson(`/analytics/heatmap/${studentId}`);
    } catch (err) {
      console.warn('Backend heatmap offline, returning mock:', err);
      return {
        student_id: studentId,
        heatmap: [
          { subject: "Mathematics", chapter: "त्रिकोणमिति (Trigonometry)", mastery: 32, status: "critical" },
          { subject: "Science", chapter: "प्रकाश परावर्तन (Reflection)", mastery: 72, status: "average" },
          { subject: "Mathematics", chapter: "बीजगणित (Algebra)", mastery: 85, status: "good" },
          { subject: "English", chapter: "Active/Passive Voice", mastery: 90, status: "excellent" },
          { subject: "Science", chapter: "धातु और अधातु (Metals)", mastery: 55, status: "needs_focus" },
        ]
      };
    }
  },

  /**
   * Fetch leaderboard rankings
   */
  async getLeaderboard(): Promise<any> {
    try {
      return await getJson('/analytics/leaderboard');
    } catch (err) {
      console.warn('Backend leaderboard offline, returning mock ranks:', err);
      return [
        { rank: 1, name: "अमन कुमार", xp: 540, streak: 8, level: 4, class_level: "10th" },
        { rank: 2, name: "प्रिया सिंह", xp: 480, streak: 5, level: 3, class_level: "10th" },
        { rank: 3, name: "राहुल यादव", xp: 410, streak: 6, level: 3, class_level: "10th" },
        { rank: 4, name: "शालिनी सिंह", xp: 390, streak: 4, level: 2, class_level: "10th" },
        { rank: 5, name: "संजय सिंह", xp: 320, streak: 7, level: 3, class_level: "10th" }
      ];
    }
  },

  /**
   * Full Voice Tutoring Pipeline
   */
  async voiceTutor(file: File, dialect: string): Promise<any> {
    try {
      const result = await postForm('/voice/voice-tutor', {
        audio_file: file,
        dialect: dialect
      });
      return result;
    } catch (err) {
      console.warn('Backend voice tutor offline, using fallback transcription & answers:', err);
      return {
        student_said: "सर, प्रकाश परावर्तन (Reflection) के नियम क्या हैं?",
        ai_response: mockDialectGreetings[dialect as keyof typeof mockDialectGreetings] || mockDialectGreetings.hinglish,
        dialect: dialect,
        tts_config: {
          lang: 'hi-IN',
          rate: 0.95
        }
      };
    }
  }
};
