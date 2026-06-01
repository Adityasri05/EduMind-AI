from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas_db import Student, StudyPlan
from app.schemas.validation import StudyPlanCreate, StudyPlanResponse
from app.services.agents import ExamStrategyAgent
from typing import List

router = APIRouter(prefix="/planner", tags=["Study Planner"])

@router.get("/strategy/{days_remaining}")
def get_emergency_strategy(days_remaining: int, student_id: int = None, db: Session = Depends(get_db)):
    goal = "engineering"
    if student_id:
        student = db.query(Student).filter(Student.id == student_id).first()
        if student and student.learning_goal:
            goal = student.learning_goal
            
    timeline = ExamStrategyAgent.get_strategy_timeline(days_remaining, goal=goal)
    return {
        "days_remaining": days_remaining,
        "is_emergency_mode": days_remaining <= 20,
        "recommended_timeline": timeline
    }

@router.post("/tasks", response_model=StudyPlanResponse)
def create_study_task(
    student_id: int,
    task_in: StudyPlanCreate,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_task = StudyPlan(
        student_id=student_id,
        title=task_in.title,
        subject=task_in.subject,
        priority=task_in.priority,
        completed=False
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/tasks/{student_id}", response_model=List[StudyPlanResponse])
def get_student_tasks(student_id: int, db: Session = Depends(get_db)):
    tasks = db.query(StudyPlan).filter(StudyPlan.student_id == student_id).all()
    return tasks

@router.post("/tasks/{task_id}/toggle", response_model=StudyPlanResponse)
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(StudyPlan).filter(StudyPlan.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    db.commit()
    db.refresh(task)
    return task
