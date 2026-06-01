from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas_db import Student, SpacedRepetitionCard, StudyCircle
from app.schemas.validation import StudentCreate, StudentResponse
import random

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=StudentResponse)
def register_student(student_in: StudentCreate, db: Session = Depends(get_db)):
    phone_number = student_in.phone_number if student_in.phone_number else None
    email = student_in.email if student_in.email else None

    # Check if student already registered
    if phone_number:
        existing = db.query(Student).filter(Student.phone_number == phone_number).first()
        if existing:
            return existing

    new_student = Student(
        name=student_in.name,
        phone_number=phone_number,
        email=email,
        class_level=student_in.class_level,
        preferred_dialect=student_in.preferred_dialect,
        board=student_in.board,
        learning_goal=student_in.learning_goal,
        preferred_language=student_in.preferred_language,
        learning_style=student_in.learning_style,
        retention_score=student_in.retention_score,
        readiness_score=student_in.readiness_score,
        xp=450,
        streak=5,
        level=4,
        study_hours=18.2,
        offline_mode=False
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # --- SEED HIGH-FIDELITY DEMO DATA FOR THE NEW STUDENT ---
    
    # 1. Seed Spaced Repetition Cards
    spaced_items = [
        {"concept": "Taylor Series Expansion", "subject": "Mathematics", "strength": 42, "due": "Now"},
        {"concept": "Maxwell's Equations", "subject": "Physics", "strength": 58, "due": "Now"},
        {"concept": "Pointer Arithmetic & Memory Leaks", "subject": "Computer Science", "strength": 30, "due": "Now"},
        {"concept": "De Moivre's Theorem", "subject": "Mathematics", "strength": 72, "due": "4 hours"},
        {"concept": "Kinematics in 2D", "subject": "Physics", "strength": 89, "due": "2 days"}
    ]
    for item in spaced_items:
        card = SpacedRepetitionCard(
            student_id=new_student.id,
            concept=item["concept"],
            subject=item["subject"],
            memory_strength=item["strength"],
            next_review_due=item["due"]
        )
        db.add(card)

    # 2. Seed Study Circles (Only if table is empty to prevent duplicates)
    existing_circles = db.query(StudyCircle).first()
    if not existing_circles:
        circles = [
            {"name": "STEM Pioneers", "members": 142, "activity": "Calculus Quiz active", "joined": True},
            {"name": "Elite Coders Club", "members": 389, "activity": "React optimization challenge", "joined": False},
            {"name": "AI & Neural Nets", "members": 89, "activity": "Transformer networks discussion", "joined": False},
            {"name": "Acoustics & Waves", "members": 54, "activity": "Harmonics lab notes shared", "joined": True}
        ]
        for c in circles:
            circle = StudyCircle(
                name=c["name"],
                members_count=c["members"],
                activity=c["activity"],
                joined_by_student=c["joined"]
            )
            db.add(circle)

    db.commit()
    return new_student

@router.get("/student/{student_id}", response_model=StudentResponse)
def get_student_profile(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student
