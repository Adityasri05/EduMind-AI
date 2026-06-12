# 🚀 EduMind AI
### Developed by **Aditya Srivastav**

**EduMind AI** is the world's first AI-native adaptive learning intelligence platform. Inspired by modern learning science and cognitive psychology, EduMind AI acts as a personal learning companion that understands what a learner knows, identifies gaps, builds retention via spaced repetition, and guides students towards their academic goals.

---

## 💡 Project Idea & Features
EduMind AI provides a high-fidelity learning experience powered by a premium multi-agent tutoring system, dynamic spaced recall systems, and beautiful dashboards.

* **🎙️ Voice Tutor**: A voice-based interactive learning module that listens to student queries and explains complex topics.
* **🤖 Multi-Agent Orchestration**: Powered by specialized backend agents (TutorAgent, SpacedRepetitionEngine, ExamReadinessEngine, DiagnosticAgent).
* **📝 Adaptive Diagnostic Quizzes**: Dynamically generated quizzes that detect learning gaps and adjust difficulty.
* **🔍 RAG Concept Mapping**: Search and retrieve context to construct prerequisite knowledge maps.
* **📊 Multi-Role Portals**: Custom dashboards for **Students** (learning & streaks), **Teachers** (student metrics & reports), and **Parents** (weekly summary, alerts).


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
* **Docker**: Configured Dockerfiles for isolated deployment.



  
---

## 📂 Project Structure
```text
Agentic Premier League/
├── edumind-ai/          # Frontend Next.js Project
│   ├── src/
│   │   ├── app/              # Next.js App Router (Layout & Pages)
│   │   ├── components/       # UI Dashboards & Modules (AITutor, AdaptiveQuiz, etc.)
│   │   ├── store/            # State management (Zustand store)
│   │   └── utils/            # Axios API wrappers
│   └── package.json
│
├── edumind-ai-backend/  # Backend Python FastAPI Project
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
   cd edumind-ai-backend
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
   cd ../edumind-ai
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
