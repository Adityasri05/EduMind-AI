from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas_db import Student, LearningAnalytics, SpacedRepetitionCard, StudyCircle
from app.schemas.validation import QuizQuestionResponse, SpacedRepetitionCardResponse, StudyCircleResponse
from app.services.agents import QuizGeneratorAgent, DiagnosticAgent
from typing import List
import random

router = APIRouter(prefix="/quiz", tags=["Adaptive Quizzes & Active Recall"])

@router.get("/generate", response_model=QuizQuestionResponse)
def get_adaptive_question(chapter: str, difficulty: str = "medium"):
    # Generate question from Agent logic
    q_data = QuizGeneratorAgent.generate_question(chapter, difficulty)
    
    mock_id = random.randint(1000, 9999)
    return QuizQuestionResponse(
        id=mock_id,
        subject=q_data["subject"],
        chapter=q_data["chapter"],
        question_text=q_data["question_text"],
        options=q_data["options"],
        correct_option=q_data["correct_option"],
        explanation_text=q_data["explanation_text"],
        pyq_years="2023, 2024",
        importance_tag=q_data["importance_tag"],
        difficulty_level=q_data["difficulty_level"]
    )

@router.post("/submit")
def submit_quiz_score(
    student_id: int,
    subject: str,
    chapter: str,
    score: int, # 0 to 100
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Save to learning analytics
    analysis_record = db.query(LearningAnalytics).filter(
        LearningAnalytics.student_id == student_id,
        LearningAnalytics.chapter_name == chapter
    ).first()

    # Diagnostic Agent run to assess strengths/weaknesses
    assessment = DiagnosticAgent.analyze_performance(subject, [score])

    if not analysis_record:
        analysis_record = LearningAnalytics(
            student_id=student_id,
            subject=subject,
            chapter_name=chapter,
            mastery_percentage=score,
            confidence_score=assessment["confidence_score"],
            weak_topic_detected=assessment["weakness_flag"],
            accuracy_rate=score,
            revision_priority="high" if assessment["weakness_flag"] else "low"
        )
        db.add(analysis_record)
    else:
        analysis_record.accuracy_rate = int((analysis_record.accuracy_rate + score) / 2)
        analysis_record.mastery_percentage = score
        analysis_record.confidence_score = assessment["confidence_score"]
        analysis_record.weak_topic_detected = assessment["weakness_flag"]
        analysis_record.revision_priority = "high" if assessment["weakness_flag"] else "low"

    # Reward XP
    student.xp += 25 if score >= 80 else 5
    if score >= 80:
        student.streak += 1

    # Update dynamic readiness and retention scores
    student.readiness_score = int(min(100, max(20, student.readiness_score + (5 if score >= 80 else -8))))
    student.retention_score = int(min(100, max(25, student.retention_score + (3 if score >= 80 else -5))))

    # Find the corresponding spaced card and update memory strength
    card = db.query(SpacedRepetitionCard).filter(
        SpacedRepetitionCard.student_id == student_id,
        SpacedRepetitionCard.concept.like(f"%{chapter}%")
    ).first()
    if card:
        card.memory_strength = int(min(100, max(10, card.memory_strength + (20 if score >= 80 else -15))))
        card.next_review_due = "1 day" if score >= 80 else "Now"

    db.commit()
    
    return {
        "status": "success",
        "student_xp": student.xp,
        "streak_count": student.streak,
        "diagnostic_assessment": assessment
    }

# --- SPACED REPETITION CARD API ENDPOINTS ---

@router.get("/spaced-cards/{student_id}", response_model=List[SpacedRepetitionCardResponse])
def get_spaced_cards(student_id: int, db: Session = Depends(get_db)):
    """Fetch student's spaced repetition cards queue."""
    cards = db.query(SpacedRepetitionCard).filter(SpacedRepetitionCard.student_id == student_id).all()
    return cards

@router.post("/spaced-cards/review")
def review_spaced_card(card_id: int, know_it: bool, db: Session = Depends(get_db)):
    """Update spaced repetition card memory strength on active recall reviews."""
    card = db.query(SpacedRepetitionCard).filter(SpacedRepetitionCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Spaced repetition card not found")

    student = db.query(Student).filter(Student.id == card.student_id).first()

    old_strength = card.memory_strength
    new_strength = min(100, old_strength + 25) if know_it else max(10, old_strength - 15)
    
    card.memory_strength = new_strength
    card.next_review_due = "1 day" if know_it else "Now"
    card.last_reviewed = datetime.datetime.utcnow().strftime("%I:%M %p")

    # Reward XP
    if student:
        student.xp += 15
        student.retention_score = int(min(100, max(20, student.retention_score + (4 if know_it else -6))))

    db.commit()
    return {
        "status": "success",
        "new_strength": new_strength,
        "next_review_due": card.next_review_due
    }

# --- STUDY CIRCLES API ENDPOINTS ---

@router.get("/study-circles", response_model=List[StudyCircleResponse])
def get_study_circles(db: Session = Depends(get_db)):
    """Fetch all study circles."""
    circles = db.query(StudyCircle).all()
    return circles

@router.post("/study-circles/toggle")
def toggle_study_circle(circle_id: int, db: Session = Depends(get_db)):
    """Join or leave a community study circle."""
    circle = db.query(StudyCircle).filter(StudyCircle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Study circle not found")

    circle.joined_by_student = not circle.joined_by_student
    circle.members_count += 1 if circle.joined_by_student else -1
    
    db.commit()
    return {
        "status": "success",
        "joined": circle.joined_by_student,
        "members_count": circle.members_count
    }
