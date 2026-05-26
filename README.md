# 🚀 ShikshaMitra AI
### Developed by Team **TechOrbiters**

**ShikshaMitra AI** is India's first AI-powered vernacular coaching and learning ecosystem tailored specifically for UP Board students. Operating in native languages and regional dialects (Hindi, Hinglish, Awadhi, Bhojpuri), ShikshaMitra AI removes the language barrier in quality education, detects individual learning gaps, and generates adaptive study paths.

---

## 💡 Project Idea & Features
Students studying in UP Board schools often face a lack of premium-quality resources in their local dialects. ShikshaMitra AI bridges this gap through a multi-agent system and conversational voice tutor.

* **🎙️ Voice Tutor**: A voice-based interactive learning module that listens to student queries and explains complex topics in local dialects.
* **🤖 Multi-Agent Orchestration**: Powered by 6 specialized backend agents (Tutor, Diagnostic, Quiz Gen, Exam Strategy, Motivation, and Translation).
* **📝 Adaptive Diagnostic Quizzes**: Dynamically generated quizzes that detect learning gaps (e.g., identifies weak subtopics in Mathematics) and adjust difficulty.
* **🔍 PYQ Intelligence (RAG)**: Search and retrieve context from Previous Years' Questions (PYQs) using a Vector database (ChromaDB) to recommend targeted practice questions.
* **📊 Multi-Role Portals**: Custom dashboards for **Students** (learning & streaks), **Teachers** (student metrics & quiz reports), and **Parents** (weekly summary, motivation, and alerts).

---

## 🛠️ Planned Tech Stack

### Frontend (Next.js App)
* **Core Framework**: React 19 / Next.js 16 (App Router, TypeScript)
* **Styling & Animations**: Tailwind CSS v4 & Framer Motion (for smooth micro-animations & transitions)
* **State Management**: Zustand (lightweight, decoupled global state)
* **Data Visualization**: Recharts (for Student performance tracking, Teacher dashboards, and Parent analytics)
* **User Feedback**: Canvas-Confetti (gamified celebration system)

### Backend (FastAPI Application)
* **Core Framework**: FastAPI (high-performance ASGI Python framework)
* **Real-time Communication**: WebSockets (low-latency duplex voice/text tutoring)
* **Vector Search / RAG**: ChromaDB (for indexing and retrieving Previous Years' Questions)
* **Database & ORM**: SQLAlchemy (SQLite for development / PostgreSQL support for production)
* **AI Engine & Agents**: Google Gemini API (`google-generativeai`) & OpenAI API (`openai`)
* **Authentication**: JWT tokens (via `python-jose` and `passlib[bcrypt]`)

### Containerization & Deployment
* **Docker**: Configured Dockerfiles for isolated deployment

---

## 📂 Project Structure
```text
Agentic Premier League/
├── shikshamitra-ai/          # Frontend Next.js Project
│   ├── src/
│   │   ├── app/              # Next.js App Router (Layout & Pages)
│   │   ├── components/       # UI Dashboards & Modules (AITutor, AdaptiveQuiz, etc.)
│   │   ├── store/            # State management (Zustand store)
│   │   └── utils/            # Axios API wrappers
│   └── package.json
│
├── shikshamitra-ai-backend/  # Backend Python FastAPI Project
│   ├── app/
│   │   ├── models/           # DB Schema definitions & models
│   │   ├── routers/          # API endpoints (auth, quiz, analytics, voice, planner)
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # Multi-Agent logic & voice processing
│   ├── Dockerfile
│   └── requirements.txt
│
└── README.md                 # Root Repository documentation
```

---

## 🚀 Running the Project Locally

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd shikshamitra-ai-backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix/macOS:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   * Swagger documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../shikshamitra-ai
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   * The web interface will be available at [http://localhost:3000](http://localhost:3000)

---

### 🌟 Dev Team: **TechOrbiters**
*Building AI solutions that empower vernacular learners.*
