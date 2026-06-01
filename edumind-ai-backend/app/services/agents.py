"""
EduMind AI — Multi-Agent Intelligence Layer
All agents powered by Gemini 2.5 Flash Lite.
Graceful fallback to premium offline stubs when API is unavailable.
"""

from google import genai
from google.genai import types
from app.config import settings
import random
import json
import logging

logger = logging.getLogger("edumind.agents")

# ---------------------------------------------------------------------------
# Gemini Client Initialization
# ---------------------------------------------------------------------------
client = None
MODEL_ID = "gemini-2.5-flash-lite"

if settings.GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        logger.info("Gemini client initialized successfully with model %s", MODEL_ID)
    except Exception as e:
        logger.error("Failed to initialize Gemini client: %s", e)
        client = None


def _call_gemini(prompt: str, response_json: bool = False) -> str | None:
    """Helper to call Gemini with a prompt. Returns text or None on failure."""
    if not client:
        return None
    try:
        config = None
        if response_json:
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        res = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=config,
        )
        return res.text
    except Exception as e:
        logger.warning("Gemini API call failed: %s", e)
        return None


def _parse_json_safe(text: str | None, fallback: dict | list | None = None):
    """Safely parse JSON from Gemini response text."""
    if not text:
        return fallback
    try:
        # Strip markdown code fences if present
        cleaned = text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            lines = lines[1:]  # remove opening fence
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            cleaned = "\n".join(lines)
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError) as e:
        logger.warning("Failed to parse JSON from Gemini: %s", e)
        return fallback


# ---------------------------------------------------------------------------
# Premium offline corpus (fallback when Gemini unavailable)
# ---------------------------------------------------------------------------
PREMIUM_CORPUS = {
    "calculus": {
        "text": "### Taylor Series Expansion\nA **Taylor Series** is a representation of a function as an infinite sum of terms calculated from the values of its derivatives at a single point.\n\nIt allows us to approximate complex transcendental functions (like $e^x$, $\\sin x$, $\\ln x$) using simple polynomials.",
        "steps": [
            "1. Identify the function f(x) and the expansion center point 'a'.",
            "2. Calculate successive derivatives: f'(x), f''(x), f'''(x), ...",
            "3. Evaluate the function and its derivatives at the center point 'a'.",
            "4. Construct the polynomial terms using the formula: [f^(n)(a) / n!] * (x - a)^n",
            "5. Sum the terms to find the approximation."
        ],
        "formulas": [
            "f(x) = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\frac{f'''(a)}{3!}(x-a)^3 + ...",
            "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n"
        ],
        "examples": [
            "Sine Expansion (a=0): sin(x) = x - x^3/3! + x^5/5! - x^7/7! + ...",
            "Exponential (a=0): e^x = 1 + x + x^2/2! + x^3/3! + ..."
        ],
        "concept_map": {
            "nodes": [
                {"id": "1", "label": "Calculus III", "x": 100, "y": 150, "status": "mastered"},
                {"id": "2", "label": "Derivatives", "x": 250, "y": 80, "status": "mastered"},
                {"id": "3", "label": "Power Series", "x": 250, "y": 220, "status": "learning"},
                {"id": "4", "label": "Taylor Series", "x": 400, "y": 150, "status": "learning"},
                {"id": "5", "label": "Maclaurin Expansion", "x": 550, "y": 150, "status": "locked"}
            ],
            "links": [
                {"source": "1", "target": "2"},
                {"source": "1", "target": "3"},
                {"source": "2", "target": "4"},
                {"source": "3", "target": "4"},
                {"source": "4", "target": "5"}
            ]
        }
    },
    "optics": {
        "text": "### Double Slit Diffraction & Interference\nWhen coherent light passes through two parallel narrow slits, it creates an interference pattern of alternating bright and dark bands (fringes) on a screen, demonstrating the **wave nature of light**.",
        "steps": [
            "1. Light waves emerge from the dual slits in phase (coherent).",
            "2. The waves travel different path lengths to reach a point on the screen.",
            "3. The Path Difference (Δ) determines whether they interfere constructively or destructively.",
            "4. Constructive interference occurs when Δ = nλ (Bright fringe).",
            "5. Destructive interference occurs when Δ = (n + 1/2)λ (Dark fringe)."
        ],
        "formulas": [
            "Path Difference: \\Delta = d \\sin \\theta",
            "Fringe Width: \\beta = \\frac{D \\lambda}{d}",
            "Bright Fringe Position: y_n = n \\frac{D \\lambda}{d}"
        ],
        "examples": [
            "Young's Original Experiment (1801) using sunlight and needleholes.",
            "Rainbow colors observed in thin oil films on water due to interference."
        ],
        "concept_map": {
            "nodes": [
                {"id": "1", "label": "Wave Theory", "x": 100, "y": 150, "status": "mastered"},
                {"id": "2", "label": "Superposition", "x": 250, "y": 80, "status": "mastered"},
                {"id": "3", "label": "Coherence", "x": 250, "y": 220, "status": "mastered"},
                {"id": "4", "label": "Interference", "x": 400, "y": 150, "status": "learning"},
                {"id": "5", "label": "Diffraction", "x": 550, "y": 150, "status": "locked"}
            ],
            "links": [
                {"source": "1", "target": "2"},
                {"source": "1", "target": "3"},
                {"source": "2", "target": "4"},
                {"source": "3", "target": "4"},
                {"source": "4", "target": "5"}
            ]
        }
    },
    "coding": {
        "text": "### Balanced Binary Search Trees\nIn computer science, a **balanced BST** (like an AVL or Red-Black Tree) maintains a height of O(log N) through structural rotations, guaranteeing optimal logarithmic searches, insertions, and deletions.",
        "steps": [
            "1. Evaluate node balance factors recursively during insertion.",
            "2. Identify structural imbalances: Left-Left, Left-Right, Right-Right, Right-Left.",
            "3. Execute single or double rotations (left/right pivoting) to restore balance.",
            "4. Update heights of modified subtrees."
        ],
        "formulas": [
            "Tree Height: H \\le 1.44 \\log_2(N + 2)",
            "Search Time Complexity: O(\\log N)",
            "Rotation Cost: O(1)"
        ],
        "examples": [
            "Database index mapping engines (e.g. SQLite, PostgreSQL indexing systems).",
            "High-speed route matching trees in virtual routers."
        ],
        "concept_map": {
            "nodes": [
                {"id": "1", "label": "Data Structures", "x": 100, "y": 150, "status": "mastered"},
                {"id": "2", "label": "Binary Trees", "x": 250, "y": 80, "status": "mastered"},
                {"id": "3", "label": "BST", "x": 250, "y": 220, "status": "mastered"},
                {"id": "4", "label": "Balanced AVL", "x": 400, "y": 150, "status": "learning"},
                {"id": "5", "label": "B-Trees", "x": 550, "y": 150, "status": "locked"}
            ],
            "links": [
                {"source": "1", "target": "2"},
                {"source": "1", "target": "3"},
                {"source": "2", "target": "4"},
                {"source": "3", "target": "4"},
                {"source": "4", "target": "5"}
            ]
        }
    }
}


# ═══════════════════════════════════════════════════════════════════════════
# TUTOR AGENT — Primary AI teaching companion
# ═══════════════════════════════════════════════════════════════════════════
class TutorAgent:
    """Intelligent co-pilot that answers queries with rich double-panel payloads."""

    @staticmethod
    def answer_query(query: str, language: str = "english", image_data: bytes = None, goal: str = "engineering") -> dict:
        # ── Try Gemini first for a rich structured answer ──
        if client and not image_data:
            gemini_prompt = (
                f"You are EduMind AI, a world-class adaptive learning tutor.\n"
                f"Student goal: {goal}\n"
                f"Preferred language: {language}\n"
                f"Student query: \"{query}\"\n\n"
                f"Respond in {language} language with a JSON object containing:\n"
                f'{{"message_text": "<detailed markdown explanation>",\n'
                f' "steps": ["step 1", "step 2", ...],\n'
                f' "formulas": ["formula 1 in LaTeX", ...],\n'
                f' "examples": ["real-world example 1", ...],\n'
                f' "conceptMap": {{"nodes": [{{"id": "1", "label": "Topic", "x": 100, "y": 150, "status": "mastered|learning|locked"}}], '
                f'"links": [{{"source": "1", "target": "2"}}]}}}}\n\n'
                f"Rules:\n"
                f"- message_text must be rich markdown with headers, bold, and bullet points\n"
                f"- steps must have 3-6 clear learning steps\n"
                f"- formulas should use LaTeX notation\n"
                f"- examples should be practical real-world applications\n"
                f"- conceptMap should show 3-5 prerequisite concept nodes\n"
                f"Return ONLY valid JSON, no markdown fences."
            )
            raw = _call_gemini(gemini_prompt, response_json=True)
            parsed = _parse_json_safe(raw)
            if parsed and isinstance(parsed, dict) and "message_text" in parsed:
                logger.info("TutorAgent: Gemini structured response for query '%s'", query[:50])
                return {
                    "message_text": parsed.get("message_text", ""),
                    "steps": parsed.get("steps", []),
                    "formulas": parsed.get("formulas", []),
                    "examples": parsed.get("examples", []),
                    "conceptMap": parsed.get("conceptMap"),
                }

        # ── Gemini for image/notebook analysis ──
        if client and image_data:
            try:
                img_prompt = (
                    f"You are EduMind AI, a world-class tutor analyzing a student's notebook photo.\n"
                    f"Student goal: {goal}, Language: {language}.\n"
                    f"Analyze the handwritten content. Identify any math problems, solutions, or notes.\n"
                    f"If there are errors, correct them kindly and explain the right approach.\n"
                    f"Respond in {language} with a JSON object:\n"
                    f'{{"message_text": "<markdown analysis>", "steps": [...], "formulas": [...], "examples": [...]}}\n'
                    f"Return ONLY valid JSON."
                )
                res = client.models.generate_content(
                    model=MODEL_ID,
                    contents=[
                        types.Part.from_bytes(data=image_data, mime_type="image/jpeg"),
                        img_prompt,
                    ],
                    config=types.GenerateContentConfig(response_mime_type="application/json"),
                )
                parsed = _parse_json_safe(res.text)
                if parsed and isinstance(parsed, dict) and "message_text" in parsed:
                    logger.info("TutorAgent: Gemini image analysis completed")
                    return {
                        "message_text": parsed.get("message_text", ""),
                        "steps": parsed.get("steps", []),
                        "formulas": parsed.get("formulas", []),
                        "examples": parsed.get("examples", []),
                        "conceptMap": parsed.get("conceptMap"),
                    }
            except Exception as e:
                logger.warning("TutorAgent image analysis failed: %s", e)

        # ── Fallback: match premium offline corpus ──
        q = query.lower()
        matched_key = None
        if any(kw in q for kw in ["taylor", "series", "calculus", "math", "derivative"]):
            matched_key = "calculus"
        elif any(kw in q for kw in ["wave", "slit", "diffraction", "physics", "optics", "fringe"]):
            matched_key = "optics"
        elif any(kw in q for kw in ["tree", "bst", "coding", "structure", "algorithm", "sort"]):
            matched_key = "coding"

        if matched_key:
            corpus = PREMIUM_CORPUS[matched_key]
            return {
                "message_text": corpus["text"],
                "steps": corpus["steps"],
                "formulas": corpus["formulas"],
                "examples": corpus["examples"],
                "conceptMap": corpus["concept_map"],
            }

        # ── Generic fallback ──
        return {
            "message_text": (
                f"### Personalized Adaptive Lesson ✨\n"
                f"I'm ready to co-pilot your **{goal}** track. Ask me to "
                f"*Teach you*, *Test you*, *Challenge you*, or *Explain visually*!\n\n"
                f"**Topic focus:** {query}"
            ),
            "steps": [
                "1. Outline foundational prerequisite concepts.",
                "2. Analyze core active logic.",
                "3. Drill down into implementation parameters.",
                "4. Validate via active recall exercises.",
            ],
            "formulas": ["Comprehension = \\frac{Active\\ Recall}{Forgetting\\ Intervals}"],
            "examples": ["EduMind active recall loop decay models."],
            "conceptMap": None,
        }


# ═══════════════════════════════════════════════════════════════════════════
# DIAGNOSTIC AGENT — Identifies knowledge gaps
# ═══════════════════════════════════════════════════════════════════════════
class DiagnosticAgent:
    """Calculates active learning gaps and generates preparedness metrics."""

    @staticmethod
    def analyze_performance(subject: str, scores: list) -> dict:
        avg_score = sum(scores) / len(scores) if scores else 78.0
        weakness_flag = avg_score < 60

        # ── Try Gemini for intelligent gap analysis ──
        if client:
            prompt = (
                f"You are EduMind AI's Diagnostic Agent. Analyze this student's performance:\n"
                f"Subject: {subject}\n"
                f"Quiz scores: {scores}\n"
                f"Average score: {avg_score:.1f}%\n\n"
                f"Return a JSON object:\n"
                f'{{"subject": "{subject}", "average_score": <int>, "weakness_flag": <bool>, '
                f'"confidence_score": <int 0-100>, '
                f'"recommendations": ["recommendation 1", "recommendation 2", ...], '
                f'"weak_topics": ["topic1", ...], '
                f'"strength_topics": ["topic1", ...]}}\n'
                f"Provide 2-4 specific, actionable recommendations. Return ONLY valid JSON."
            )
            raw = _call_gemini(prompt, response_json=True)
            parsed = _parse_json_safe(raw)
            if parsed and isinstance(parsed, dict) and "recommendations" in parsed:
                logger.info("DiagnosticAgent: Gemini analysis for %s", subject)
                return parsed

        # ── Fallback ──
        recommendations = []
        if weakness_flag:
            recommendations.append(
                f"Your proficiency in {subject} is currently below threshold levels. "
                f"We suggest triggering 'Teach Me' in our AI Tutor."
            )
            recommendations.append(
                f"Focus on spaced repetition drills for {subject} fundamentals."
            )
        else:
            recommendations.append(
                "Excellent comprehension! You have unlocked the next conceptual node in your AI Learning Graph."
            )

        return {
            "subject": subject,
            "average_score": int(avg_score),
            "weakness_flag": weakness_flag,
            "confidence_score": int(avg_score * 0.95),
            "recommendations": recommendations,
        }


# ═══════════════════════════════════════════════════════════════════════════
# QUIZ GENERATOR AGENT — Generates adaptive questions
# ═══════════════════════════════════════════════════════════════════════════
class QuizGeneratorAgent:
    """Generates adaptive questions using Gemini AI."""

    @staticmethod
    def generate_question(chapter: str, difficulty: str) -> dict:
        # ── Try Gemini for dynamic question generation ──
        if client:
            prompt = (
                f"You are EduMind AI's Quiz Generator. Generate ONE multiple-choice question.\n"
                f"Chapter/Topic: {chapter}\n"
                f"Difficulty: {difficulty}\n\n"
                f"Return a JSON object:\n"
                f'{{"subject": "<subject area>", "chapter": "{chapter}", '
                f'"question_text": "<the question>", '
                f'"options": ["option A", "option B", "option C", "option D"], '
                f'"correct_option": <index 0-3>, '
                f'"explanation_text": "<detailed step-by-step explanation>", '
                f'"importance_tag": "critical|important|moderate", '
                f'"difficulty_level": "{difficulty}"}}\n'
                f"Make the question challenging but fair. The explanation must be educational. "
                f"Return ONLY valid JSON."
            )
            raw = _call_gemini(prompt, response_json=True)
            parsed = _parse_json_safe(raw)
            if parsed and isinstance(parsed, dict) and "question_text" in parsed:
                logger.info("QuizGeneratorAgent: Gemini question for %s (%s)", chapter, difficulty)
                # Ensure correct_option is an int
                parsed["correct_option"] = int(parsed.get("correct_option", 0))
                parsed["difficulty_level"] = difficulty
                return parsed

        # ── Fallback pool ──
        pools = [
            {
                "subject": "Mathematics",
                "chapter": "Taylor Series",
                "question_text": "What is the coefficient of the x^3 term in the Taylor Series expansion of f(x) = e^(2x) centered at a = 0?",
                "options": ["4/3", "8/3", "2/3", "8"],
                "correct_option": 0,
                "explanation_text": "The n-th term of Taylor series is (f^(n)(a) / n!) * x^n. For f(x) = e^(2x), f'''(x) = 8e^(2x). At a = 0, f'''(0) = 8. So the coefficient is 8 / 3! = 8 / 6 = 4/3.",
                "importance_tag": "critical",
                "difficulty_level": difficulty,
            },
            {
                "subject": "Physics",
                "chapter": "Wave Optics",
                "question_text": "In a Young's Double Slit Experiment, if the distance between the slits is halved and the screen distance is doubled, what happens to the fringe width?",
                "options": ["It remains unchanged", "It is doubled", "It is quadrupled", "It is halved"],
                "correct_option": 2,
                "explanation_text": "Fringe width β = Dλ/d. If D becomes 2D and d becomes d/2, then β' = (2D)λ / (d/2) = 4 (Dλ/d) = 4β. It is quadrupled.",
                "importance_tag": "critical",
                "difficulty_level": difficulty,
            },
            {
                "subject": "Computer Science",
                "chapter": "Algorithms",
                "question_text": "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (like an AVL tree) of size N?",
                "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                "correct_option": 1,
                "explanation_text": "In a balanced BST, the height of the tree is strictly kept at O(log N). Thus, searching takes O(log N) in the worst case.",
                "importance_tag": "critical",
                "difficulty_level": difficulty,
            },
        ]
        return random.choice(pools)


# ═══════════════════════════════════════════════════════════════════════════
# EXAM STRATEGY AGENT — Generates study plans
# ═══════════════════════════════════════════════════════════════════════════
class ExamStrategyAgent:
    """Generates structured target schedules and sprint reviews using Gemini."""

    @staticmethod
    def get_strategy_timeline(days_remaining: int, goal: str = "engineering") -> list:
        # ── Try Gemini for personalized study plan ──
        if client:
            prompt = (
                f"You are EduMind AI's Exam Strategy Agent. Create a study plan.\n"
                f"Days remaining: {days_remaining}\n"
                f"Student goal: {goal}\n\n"
                f"Return a JSON array of study blocks:\n"
                f'[{{"day": "Day 1-3", "task": "<specific study task>", "priority": "high|medium|low"}}, ...]\n'
                f"Create 4-6 blocks covering the full timeline. "
                f"Tasks should be specific and actionable for a {goal} track. "
                f"Return ONLY a valid JSON array."
            )
            raw = _call_gemini(prompt, response_json=True)
            parsed = _parse_json_safe(raw)
            if parsed and isinstance(parsed, list) and len(parsed) > 0:
                logger.info("ExamStrategyAgent: Gemini plan for %d days (%s)", days_remaining, goal)
                return parsed

        # ── Fallback ──
        return [
            {"day": "Day 1-3", "task": f"Derivatives & Taylor expansions active recall drills for {goal}.", "priority": "high"},
            {"day": "Day 4-6", "task": "Wave superposition path differences calculations practice.", "priority": "high"},
            {"day": "Day 7-9", "task": "BST rotation operations manual trace and execution checks.", "priority": "medium"},
            {"day": "Day 10-12", "task": "Full simulated adaptive mock examinations review.", "priority": "high"},
        ]


# ═══════════════════════════════════════════════════════════════════════════
# MOTIVATION AGENT — Engagement and nudges
# ═══════════════════════════════════════════════════════════════════════════
class MotivationAgent:
    """Keeps the student engaged with high-fidelity nudges and goal metrics."""

    LANDMARKS = {
        "engineering": "MIT and top global tech schools",
        "medical": "Harvard Medical and premium research institutes",
        "coding": "Elite software houses and Silicon Valley hubs",
        "high_school": "Top tier academic honors lists",
        "languages": "Global linguistic boards and literature panels",
    }

    @staticmethod
    def get_motivational_nudge(streak: int, last_score: int, goal: str = "engineering", language: str = "english") -> str:
        # ── Try Gemini for personalized motivation ──
        if client:
            prompt = (
                f"You are EduMind AI's Motivation Agent. Generate a SHORT motivational message (2-3 sentences max).\n"
                f"Student's learning streak: {streak} days\n"
                f"Last quiz score: {last_score}%\n"
                f"Goal: {goal}\n"
                f"Language: {language}\n\n"
                f"Be warm, encouraging, and specific. Use 1-2 emojis. "
                f"If the score is low, be supportive not discouraging. "
                f"Respond in {language} language. Return ONLY the message text, no JSON."
            )
            raw = _call_gemini(prompt)
            if raw and len(raw.strip()) > 10:
                logger.info("MotivationAgent: Gemini nudge generated")
                return raw.strip()

        # ── Fallback ──
        loc = MotivationAgent.LANDMARKS.get(goal, MotivationAgent.LANDMARKS["engineering"])

        if last_score < 50:
            return (
                "No worries! Mistakes are the first step to ultimate mastery. "
                "Let's trigger a concept map lesson with the AI Tutor to repair it! 💪"
            )

        nudges = [
            f"Incredible! You have built a {streak}-day cognitive learning streak. Your neural pathways are strengthening! 🧠",
            "Consistent spacing is key: Your revision queue has items due. Revise now to prevent memory decay!",
            f"Your dream of joining {loc} is closer than ever. Keep your retention curve stabilized! 🚀",
        ]
        return random.choice(nudges)
