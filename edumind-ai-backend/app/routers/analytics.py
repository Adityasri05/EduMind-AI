from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas_db import Student, LearningAnalytics
from app.schemas.validation import AnalyticsResponse
from app.services.agents import DiagnosticAgent, MotivationAgent
from typing import List

router = APIRouter(prefix="/analytics", tags=["Learning Analytics"])

@router.get("/student/{student_id}", response_model=List[AnalyticsResponse])
def get_student_analytics(student_id: int, db: Session = Depends(get_db)):
    """Retrieve all learning analytics records for a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    analytics = db.query(LearningAnalytics).filter(
        LearningAnalytics.student_id == student_id
    ).all()
    
    if not analytics:
        # Seed default mock analytical records if empty to ensure visual charts are populated
        default_topics = [
            {"subject": "Mathematics", "chapter": "Taylor Series", "mastery": 42, "conf": 40, "weak": True},
            {"subject": "Physics", "chapter": "Wave Optics", "mastery": 75, "conf": 80, "weak": False},
            {"subject": "Computer Science", "chapter": "Algorithms", "mastery": 92, "conf": 95, "weak": False}
        ]
        for topic in default_topics:
            record = LearningAnalytics(
                student_id=student_id,
                subject=topic["subject"],
                chapter_name=topic["chapter"],
                mastery_percentage=topic["mastery"],
                confidence_score=topic["conf"],
                weak_topic_detected=topic["weak"],
                accuracy_rate=topic["mastery"],
                revision_priority="high" if topic["weak"] else "low"
            )
            db.add(record)
        db.commit()
        analytics = db.query(LearningAnalytics).filter(
            LearningAnalytics.student_id == student_id
        ).all()

    return analytics

@router.get("/diagnostic/{student_id}")
def run_diagnostic(student_id: int, subject: str = "Mathematics", db: Session = Depends(get_db)):
    """Run the Diagnostic Agent on a student's quiz history to detect weaknesses."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    records = db.query(LearningAnalytics).filter(
        LearningAnalytics.student_id == student_id,
        LearningAnalytics.subject == subject
    ).all()

    scores = [r.accuracy_rate for r in records] if records else [42, 75, 92]
    assessment = DiagnosticAgent.analyze_performance(subject, scores)

    return {
        "student_id": student_id,
        "subject": subject,
        "records_analyzed": len(scores),
        "assessment": assessment
    }

@router.get("/motivation/{student_id}")
def get_motivation(student_id: int, db: Session = Depends(get_db)):
    """Get a personalized motivational nudge for the student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    last_record = db.query(LearningAnalytics).filter(
        LearningAnalytics.student_id == student_id
    ).order_by(LearningAnalytics.id.desc()).first()

    last_score = last_record.accuracy_rate if last_record else 78

    nudge = MotivationAgent.get_motivational_nudge(
        student.streak, 
        last_score, 
        goal=student.learning_goal, 
        language=student.preferred_language
    )

    return {
        "student_id": student_id,
        "streak": student.streak,
        "level": student.level,
        "xp": student.xp,
        "nudge_message": nudge
    }

@router.get("/leaderboard")
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    """Return top global competitive students by XP for the gamification leaderboard."""
    # Seed top mockup global students if db contains only 1 student
    count = db.query(Student).count()
    if count <= 1:
        mock_ranks = [
            {"name": "Marcus Aurelius", "xp": 620, "streak": 12, "level": 5},
            {"name": "Srinivasa Ramanujan", "xp": 410, "streak": 9, "level": 4},
            {"name": "Ada Lovelace", "xp": 390, "streak": 4, "level": 3},
            {"name": "Alan Turing", "xp": 320, "streak": 7, "level": 3}
        ]
        for item in mock_ranks:
            s = Student(
                name=item["name"],
                xp=item["xp"],
                streak=item["streak"],
                level=item["level"],
                class_level="High School"
            )
            db.add(s)
        db.commit()

    students = db.query(Student).order_by(Student.xp.desc()).limit(limit).all()
    return [
        {
            "rank": idx + 1,
            "name": s.name,
            "xp": s.xp,
            "streak": s.streak,
            "level": s.level,
            "class_level": s.class_level
        }
        for idx, s in enumerate(students)
    ]

@router.get("/heatmap/{student_id}")
def get_weakness_heatmap(student_id: int, db: Session = Depends(get_db)):
    """Generate a subject-chapter weakness heatmap for co-pilots, teachers, and parents."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    records = db.query(LearningAnalytics).filter(
        LearningAnalytics.student_id == student_id
    ).all()

    if not records:
        return {
            "student_id": student_id,
            "heatmap": [
                {"subject": "Mathematics", "chapter": "Taylor Series", "mastery": 42, "status": "critical"},
                {"subject": "Physics", "chapter": "Wave Optics", "mastery": 75, "status": "average"},
                {"subject": "Mathematics", "chapter": "Linear Algebra", "mastery": 85, "status": "good"},
                {"subject": "Computer Science", "chapter": "Algorithms", "mastery": 92, "status": "excellent"},
                {"subject": "Physics", "chapter": "Thermodynamics", "mastery": 58, "status": "needs_focus"},
            ]
        }

    heatmap = []
    for r in records:
        if r.mastery_percentage < 50:
            status = "critical"
        elif r.mastery_percentage < 65:
            status = "needs_focus"
        elif r.mastery_percentage < 80:
            status = "average"
        elif r.mastery_percentage < 90:
            status = "good"
        else:
            status = "excellent"

        heatmap.append({
            "subject": r.subject,
            "chapter": r.chapter_name,
            "mastery": r.mastery_percentage,
            "status": status
        })

    return {"student_id": student_id, "heatmap": heatmap}
