# EduMind AI Backend (FastAPI)

Welcome to the **AI Agentic Backend for EduMind AI**, the world's first AI-native adaptive learning intelligence platform.

---

## ⚡ Tech Stack

- **Framework:** FastAPI
- **Database ORM:** SQLAlchemy (SQLite by default, switches instantly to PostgreSQL if `DATABASE_URL` is supplied)
- **Real-time:** Python WebSockets
- **AI Integrations:** Google Gemini API / OpenAI API (stubs/vernacular simulations fallback if no key is configured)
- **Containerization:** Docker

---

## 🚀 Running Locally

### 1. Set up Virtual Environment
```bash
# In the backend directory:
python -m venv venv
source venv/Scripts/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Spin up Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Visit the interactive Swagger UI at **[http://localhost:8000/docs](http://localhost:8000/docs)** to test the dynamic endpoints!

---

## 🤖 Intelligent AI Agents Layer

This backend implements 6 core agents inside `app/services/agents.py`:
1. **Tutor Agent:** Responds to queries in targeted local dialects (Pure Hindi, Hinglish, Awadhi, Bhojpuri). Supports multimodal stubs.
2. **Diagnostic Agent:** Scours quiz marks and identifies student's weak chapters (like Trigonometry at 32%).
3. **Quiz Generator Agent:** Curates dynamic topic-wise MCQ questions.
4. **Exam Strategy Agent:** Schedules customized studies countdown timelines ("Boards in 20 Days").
5. **Motivation Agent:** Feeds daily positive nudges based on streaks and study frequencies.
6. **Dialect Translation Agent:** Translates text to the selected vernacular target (Awadhi/Bhojpuri).
