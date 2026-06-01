from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    
    # Backwards compatibility vernacular properties
    class_level = Column(String, default="10th")
    preferred_dialect = Column(String, default="hinglish")
    board = Column(String, default="up")
    
    # EduMind AI Profile Vectors
    learning_goal = Column(String, default="engineering") # engineering, coding, medical, high_school, languages
    preferred_language = Column(String, default="english") # english, hindi, spanish, marathi, bengali
    learning_style = Column(String, default="visual") # visual, auditory, reading_writing, kinesthetic
    retention_score = Column(Float, default=84.0)
    readiness_score = Column(Float, default=78.0)
    
    xp = Column(Integer, default=450)
    streak = Column(Integer, default=5)
    level = Column(Integer, default=4)
    study_hours = Column(Float, default=18.2)
    offline_mode = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    analytics = relationship("LearningAnalytics", back_populates="student", cascade="all, delete-orphan")
    chats = relationship("AIConversation", back_populates="student", cascade="all, delete-orphan")
    plans = relationship("StudyPlan", back_populates="student", cascade="all, delete-orphan")
    spaced_cards = relationship("SpacedRepetitionCard", back_populates="student", cascade="all, delete-orphan")

class LearningAnalytics(Base):
    __tablename__ = "learning_analytics"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject = Column(String, index=True)
    chapter_name = Column(String, index=True)
    mastery_percentage = Column(Integer, default=50) # 0 to 100
    confidence_score = Column(Integer, default=60) # 0 to 100
    weak_topic_detected = Column(Boolean, default=False)
    accuracy_rate = Column(Integer, default=70) # 0 to 100
    time_spent_seconds = Column(Integer, default=0)
    revision_priority = Column(String, default="medium") # high, medium, low

    student = relationship("Student", back_populates="analytics")

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    sender = Column(String) # user, ai
    message_text = Column(Text)
    voice_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    sentiment_signal = Column(String, nullable=True) # happy, confused, frustrated, confident
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="chats")

class QuestionBank(Base):
    __tablename__ = "question_bank"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    chapter = Column(String, index=True)
    question_text = Column(Text)
    options = Column(Text) # JSON-separated values
    correct_option = Column(Integer) # Index 0 to 3
    explanation_text = Column(Text)
    pyq_years = Column(String, nullable=True) # e.g. "2024, 2022"
    importance_tag = Column(String, default="high") # critical, very-high, high
    difficulty_level = Column(String, default="medium") # easy, medium, hard
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String)
    subject = Column(String)
    completed = Column(Boolean, default=False)
    priority = Column(String, default="medium") # high, medium, low
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="plans")

class SpacedRepetitionCard(Base):
    __tablename__ = "spaced_repetition_cards"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    concept = Column(String, index=True)
    subject = Column(String, index=True)
    memory_strength = Column(Integer, default=50) # 0 to 100
    next_review_due = Column(String, default="Now") # "Now", "4 hours", "1 day", "2 days"
    last_reviewed = Column(String, nullable=True)

    student = relationship("Student", back_populates="spaced_cards")

class StudyCircle(Base):
    __tablename__ = "study_circles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    members_count = Column(Integer, default=0)
    activity = Column(String)
    joined_by_student = Column(Boolean, default=False)
