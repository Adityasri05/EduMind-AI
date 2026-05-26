try:
    import google.generativeai as genai
except ImportError:
    genai = None

from app.config import settings
import random
import json

# Initialize Gemini API if key is supplied
if genai and settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
else:
    model = None

# Custom stubs matching dialect tones
DIALECT_ANSWERS = {
    "awadhi": {
        "trig": "अरे भैया! त्रिकोणमिति क मतलब होत है तीन कोणन क नाप। त्रिभुज क लम्ब, आधार अउर कर्ण क सम्बंध समझ लेंव: sin A = लम्ब/कर्ण। सूत्र याद रक्खे क देसी नुस्खा: लाल/कक्का!",
        "light": "भौजी! प्रकाश क परावर्तन बहुत सरल है। जब रोशनी कवनो चमकदार देवाल (surface) से टकराके वापस लौटत है, त ओका परावर्तन कहित हैं।",
        "default": "वाह भैया! का गजब क बात पूछेव है। ई सवाल तोहार बोर्ड परीक्षा मा बार-बार पूझा जात है। एका अच्छे से तैयार कइ लेंव।"
      },
    "bhojpuri": {
        "trig": "त्रिकोणमिति के मतलब होला तीन गो कोण के नाप-जोख। लम्ब, आधार आ कर्ण के संबंध सीखें: sin A = लम्ब/कर्ण। याद रखे खातिर बढ़िया ट्रिक बा: लाल/कक्का!",
        "light": "बाबू! प्रकाश के अपवर्तन आ परावर्तन त बहुते नीक अध्याय बा। जब रोशनी कवनो चमकीला सतह से टकरा के वापस आवेला, ओकरा के परावर्तन कहल जाला।",
        "default": "अरे बाबू! रउआ त बहुते नीक सवाल पुछनी ह। ई सवाल यूपी बोर्ड परीक्षा में बार-बार आवेला। आवा एकरा के आसान भाखा में समझल जाओ।"
      },
    "hinglish": {
        "trig": "Hey there! Trigonometry mean trikonmiti. Triangle ke angles aur sides ke relations ko study karna. Sin A = Perpendicular/Hypotenuse (L/K). Easy trick to remember is LAL/KKA!",
        "light": "Reflection of Light means jab light ray kisi shiny surface se takrake wapas bounce back hoti hai. Simple, isn't it?",
        "default": "Great question! This is super important for UP Board exams. Let's make it very easy to understand step-by-step."
      },
    "hindi": {
        "trig": "त्रिकोणमिति गणित की वह शाखा है जो त्रिभुज की भुजाओं और कोणों के बीच संबंधों का अध्ययन करती है। sin A = लम्ब/कर्ण। याद रखने की सर्वमान्य विधि: लाल/कक्का!",
        "light": "प्रकाश का परावर्तन: जब प्रकाश की किरण किसी चिकनी सतह से टकराकर पुनः उसी माध्यम में लौट जाती है, तो इस घटना को प्रकाश का परावर्तन कहते हैं।",
        "default": "बहुत अच्छा प्रश्न है! आपकी बोर्ड परीक्षा (UP Board) के लिए यह काफी महत्वपूर्ण है। आइए इसे विस्तार से समझते हैं।"
      }
}

class DialectTranslationAgent:
    """Translates educational terms and explanations into targeted local dialects (Awadhi, Bhojpuri)."""
    @staticmethod
    def translate(text: str, target_dialect: str) -> str:
        if model:
            try:
                prompt = f"Translate the following educational explanation into a warm, encouraging, colloquial {target_dialect} tone suitable for a UP Board student. Keep math terms in brackets. Text: {text}"
                response = model.generate_content(prompt)
                return response.text
            except Exception:
                pass
        
        # Local fallback if Gemini fails or is not configured
        if "trig" in text.lower() or "त्रिकोणमिति" in text:
            return DIALECT_ANSWERS.get(target_dialect, DIALECT_ANSWERS["hinglish"])["trig"]
        elif "light" in text.lower() or "प्रकाश" in text:
            return DIALECT_ANSWERS.get(target_dialect, DIALECT_ANSWERS["hinglish"])["light"]
        return DIALECT_ANSWERS.get(target_dialect, DIALECT_ANSWERS["hinglish"])["default"]

class TutorAgent:
    """Tutors students in academic content conversationally using target dialects."""
    @staticmethod
    def answer_query(query: str, dialect: str, image_data: bytes = None) -> str:
        if model:
            try:
                prompt = f"You are ShikshaMitra AI, a friendly, encouraging UP Board coach. Reply to this query: '{query}' in a conversational {dialect} dialect. Explain concepts step-by-step."
                if image_data:
                    # Multimodal analysis stubs
                    response = model.generate_content([prompt, image_data])
                else:
                    response = model.generate_content(prompt)
                return response.text
            except Exception:
                pass
        
        # Fallback simulation
        return DialectTranslationAgent.translate(query, dialect)

class DiagnosticAgent:
    """Calculates learning gaps and flags student weaknesses."""
    @staticmethod
    def analyze_performance(subject: str, quiz_scores: list) -> dict:
        avg_score = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0
        weakness_detected = avg_score < 60
        
        recommendations = []
        if weakness_detected:
            recommendations.append(f"आपके {subject} के अध्याय 'त्रिकोणमिति' में कम अंक आए हैं। कृपया एआई ट्यूटर से सूत्र समझें।")
        else:
            recommendations.append("आपका प्रदर्शन उत्कृष्ट है! बोर्ड मॉडल पेपर 2 हल करना जारी रखें।")
            
        return {
            "subject": subject,
            "average_score": avg_score,
            "weakness_flag": weakness_detected,
            "confidence_score": int(avg_score * 0.95),
            "recommendations": recommendations
        }

class QuizGeneratorAgent:
    """Generates adaptive quiz questions based on difficulty levels and NCERT syllabus."""
    @staticmethod
    def generate_question(chapter: str, difficulty: str) -> dict:
        # Predefined database of dynamic questions to ensure robust demo without API limits
        questions_pool = [
            {
                "question": "sin A = 3/5 है, तो cos A का मान ज्ञात करें।",
                "options": ["4/5", "5/4", "3/4", "1"],
                "correct_option": 0,
                "explanation": "sin² A + cos² A = 1 का उपयोग करने पर cos A = 4/5."
            },
            {
                "question": "अवतल दर्पण (Concave Mirror) का उपयोग कहाँ होता है?",
                "options": ["गाड़ी की हेडलाइट में", "गाड़ी के साइड मिरर में", "रोड लाइट में", "इनमे से कोई नहीं"],
                "correct_option": 0,
                "explanation": "अवतल दर्पण प्रकाश को समानांतर किरणों के रूप में केंद्रित करता है, इसलिए हेडलाइट में उपयोग किया जाता है."
            }
        ]
        
        selected = random.choice(questions_pool)
        return {
            "subject": "Mathematics" if "sin" in selected["question"] else "Science",
            "chapter": chapter,
            "question_text": selected["question"],
            "options": selected["options"],
            "correct_option": selected["correct_option"],
            "explanation_text": selected["explanation"],
            "importance_tag": "critical",
            "difficulty_level": difficulty
        }

class ExamStrategyAgent:
    """Curates emergency schedules like Boards in 20 Days crash plans."""
    @staticmethod
    def get_strategy_timeline(days_remaining: int) -> list:
        if days_remaining <= 20:
            return [
                {"day": "Day 1-5", "task": "बीजगणित और त्रिकोणमिति के सूत्र रिवीज़न + 5 PYQs"},
                {"day": "Day 6-10", "task": "प्रकाश परावर्तन और रासायनिक समीकरणों का अभ्यास"},
                {"day": "Day 11-15", "task": "अंग्रेजी ग्रामर और निबंध लेखन अभ्यास"},
                {"day": "Day 16-20", "task": "यूपी बोर्ड पिछले 3 वर्षों के मॉडल पेपर हल करना"}
            ]
        return [
            {"day": "Week 1", "task": "पूरे NCERT सिलेबस के संक्षिप्त नोट्स बनाएं"},
            {"day": "Week 2", "task": "कमजोर अध्यायों पर एआई डाउट क्लियरिंग करें"}
        ]

class MotivationAgent:
    """Keeps the student engaged with positive reinforcement and custom streak prompts."""
    @staticmethod
    def get_motivational_nudge(streak: int, last_score: int) -> str:
        nudges = [
            f"अरे वाह! आपका लगातार {streak} दिनों का स्टडी स्ट्राइक बन गया है। शेरशाह की तरह दहाड़ते रहें! 🦁",
            "सफलता एक दिन में नहीं मिलती, लेकिन हर दिन की गई छोटी मेहनत बोर्ड में 95% दिलाएगी। पढ़ते रहें!",
            "हजरतगंज (Lucknow) की तंग गलियों से निकलकर बोर्ड परीक्षा के टॉपर बनने का सपना सच होगा। हौसला रखें!"
        ]
        
        if last_score < 50:
            return "कोई बात नहीं! गलतियों से ही असली टॉपर सीखता है। आवा, एआई ट्यूटर के साथ दोबारा समझित हन! 💪"
        return random.choice(nudges)
