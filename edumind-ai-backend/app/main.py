from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, tutor, quiz, planner, analytics, voice
from app.services.agents import TutorAgent
import json

# Initialize database schemas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scalable Adaptive Learning Operating System (EduMind AI)"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Core routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(tutor.router, prefix=settings.API_V1_STR)
app.include_router(quiz.router, prefix=settings.API_V1_STR)
app.include_router(planner.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(voice.router, prefix=settings.API_V1_STR)

@app.get("/")
def get_root():
    return {
        "status": "active",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, student_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[student_id] = websocket

    def disconnect(self, student_id: int):
        if student_id in self.active_connections:
            del self.active_connections[student_id]

    async def send_personal_message(self, message: dict, student_id: int):
        if student_id in self.active_connections:
            await self.active_connections[student_id].send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/tutor/{student_id}")
async def websocket_endpoint(websocket: WebSocket, student_id: int):
    from app.database import SessionLocal
    from app.models.schemas_db import Student

    await manager.connect(student_id, websocket)
    
    # Fetch student track preferences for customized welcome greeting
    db = SessionLocal()
    student = db.query(Student).filter(Student.id == student_id).first()
    
    welcome_messages = {
        "english": "Welcome to EduMind AI! I am your personal cognitive companion. What would you like to master today? (Realtime Active) ⚡",
        "hindi": "EduMind AI में आपका स्वागत है! मैं आपका व्यक्तिगत शिक्षण साथी हूँ। आज आप किस विषय में महारत हासिल करना चाहेंगे? (Realtime Active) ⚡",
        "spanish": "¡Bienvenido a EduMind AI! Soy tu compañero cognitivo personal. ¿Qué te gustaría dominar hoy? (Realtime Active) ⚡",
        "marathi": "EduMind AI मध्ये आपले स्वागत आहे! मी तुमचा वैयक्तिक शिक्षण सोबती आहे. आज तुम्हाला कोणत्या विषयात प्रभुत्व मिळवायचे आहे? (Realtime Active) ⚡",
        "bengali": "EduMind AI-তে আপনাকে স্বাগত! আমি আপনার ব্যক্তিগত শেখার সঙ্গী। आज আপনি কোন বিষয়ে দক্ষতা অর্জন করতে চান? (Realtime Active) ⚡"
    }
    
    welcome_text = "Welcome to EduMind AI! I am your personal cognitive companion. What would you like to master today? (Realtime Active) ⚡"
    lang = "english"
    goal = "engineering"
    if student:
        lang = student.preferred_language.lower() if student.preferred_language else "english"
        welcome_text = welcome_messages.get(lang, welcome_messages["english"])
        goal = student.learning_goal if student.learning_goal else "engineering"
        
    db.close()
    
    await manager.send_personal_message({
        "sender": "ai",
        "message_text": welcome_text,
        "type": "welcome"
    }, student_id)
    
    try:
        while True:
            # Wait for student socket messages
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Broadcast typing indicator
            await manager.send_personal_message({
                "type": "typing",
                "is_typing": True
            }, student_id)
            
            # Fetch AI responses from the TutorAgent
            query = payload.get("message_text", "")
            
            ai_response = TutorAgent.answer_query(query, language=lang, goal=goal)
            
            # Send final response over sockets containing rich elements
            await manager.send_personal_message({
                "sender": "ai",
                "message_text": ai_response["message_text"],
                "steps": ai_response.get("steps"),
                "formulas": ai_response.get("formulas"),
                "examples": ai_response.get("examples"),
                "conceptMap": ai_response.get("conceptMap"),
                "type": "message"
            }, student_id)
            
    except WebSocketDisconnect:
        manager.disconnect(student_id)
