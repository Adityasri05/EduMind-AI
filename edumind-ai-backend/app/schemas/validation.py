from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

# --- Student schemas ---
class StudentBase(BaseModel):
    name: str
    class_level: str = "10th"
    preferred_dialect: str = "hinglish"
    board: str = "up"
    
    # EduMind AI Profile Vectors
    learning_goal: str = "engineering"
    preferred_language: str = "english"
    learning_style: str = "visual"
    retention_score: float = 84.0
    readiness_score: float = 78.0

class StudentCreate(StudentBase):
    phone_number: Optional[str] = None
    email: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    xp: int
    streak: int
    level: int
    study_hours: float
    offline_mode: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Chat schemas ---
class ChatMessageBase(BaseModel):
    sender: str # user, ai
    message_text: str
    voice_url: Optional[str] = None
    image_url: Optional[str] = None

class ChatMessageCreate(ChatMessageBase):
    sentiment_signal: Optional[str] = None

# Support dynamic visual double-panel tutoring response payloads
class ChatMessageResponse(ChatMessageBase):
    id: int
    timestamp: datetime.datetime
    steps: Optional[List[str]] = None
    formulas: Optional[List[str]] = None
    examples: Optional[List[str]] = None
    conceptMap: Optional[dict] = None

    class Config:
        from_attributes = True

# --- Analytics schemas ---
class AnalyticsResponse(BaseModel):
    id: int
    student_id: int
    subject: str
    chapter_name: str
    mastery_percentage: int
    confidence_score: int
    weak_topic_detected: bool
    accuracy_rate: int
    time_spent_seconds: int
    revision_priority: str

    class Config:
        from_attributes = True

# --- Quiz schemas ---
class QuizQuestionResponse(BaseModel):
    id: int
    subject: str
    chapter: str
    question_text: str
    options: List[str]
    correct_option: int
    explanation_text: str
    pyq_years: Optional[str] = None
    importance_tag: str
    difficulty_level: str

# --- Study Plan schemas ---
class StudyPlanCreate(BaseModel):
    title: str
    subject: str
    priority: str = "medium"

class StudyPlanResponse(StudyPlanCreate):
    id: int
    completed: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Spaced Repetition schemas ---
class SpacedRepetitionCardResponse(BaseModel):
    id: int
    student_id: int
    concept: str
    subject: str
    memory_strength: int
    next_review_due: str
    last_reviewed: Optional[str] = None

    class Config:
        from_attributes = True

# --- Study Circle schemas ---
class StudyCircleResponse(BaseModel):
    id: int
    name: str
    members_count: int
    activity: str
    joined_by_student: bool

    class Config:
        from_attributes = True
