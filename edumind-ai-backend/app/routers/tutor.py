from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas_db import Student, AIConversation
from app.schemas.validation import ChatMessageResponse
from app.services.agents import TutorAgent
import datetime

router = APIRouter(prefix="/tutor", tags=["AI Tutor Chat"])

@router.post("/chat", response_model=ChatMessageResponse)
async def ask_tutor(
    student_id: int = Form(...),
    message_text: str = Form(...),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 1. Log student query in db
    user_msg = AIConversation(
        student_id=student_id,
        sender="user",
        message_text=message_text,
        sentiment_signal="confused"
    )
    db.add(user_msg)

    # 2. Query the Agent layer
    ai_response = TutorAgent.answer_query(
        message_text, 
        language=student.preferred_language, 
        goal=student.learning_goal
    )
    
    # 3. Log AI response in db
    ai_msg = AIConversation(
        student_id=student_id,
        sender="ai",
        message_text=ai_response["message_text"],
        sentiment_signal="confident"
    )
    db.add(ai_msg)
    
    # Reward XP
    student.xp += 10
    next_lvl_threshold = student.level * 250
    if student.xp >= next_lvl_threshold:
        student.xp -= next_lvl_threshold
        student.level += 1
        
    db.commit()
    db.refresh(ai_msg)
    
    # Return enriched double-panel payload
    return {
        "id": ai_msg.id,
        "sender": ai_msg.sender,
        "message_text": ai_msg.message_text,
        "voice_url": ai_msg.voice_url,
        "image_url": ai_msg.image_url,
        "timestamp": ai_msg.timestamp,
        "steps": ai_response.get("steps"),
        "formulas": ai_response.get("formulas"),
        "examples": ai_response.get("examples"),
        "conceptMap": ai_response.get("conceptMap")
    }

@router.post("/upload-notebook", response_model=ChatMessageResponse)
async def upload_notebook(
    student_id: int = Form(...),
    notebook_photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Read image contents
    contents = await notebook_photo.read()
    
    # Log user action
    user_msg = AIConversation(
        student_id=student_id,
        sender="user",
        message_text=f"📝 [ Notebook Photo: {notebook_photo.filename} ]",
        image_url=notebook_photo.filename
    )
    db.add(user_msg)

    # Invoke TutorAgent
    ai_response = TutorAgent.answer_query(
        "Attached notebook solution analysis.", 
        language=student.preferred_language, 
        image_data=contents, 
        goal=student.learning_goal
    )
    
    ai_msg = AIConversation(
        student_id=student_id,
        sender="ai",
        message_text=ai_response["message_text"],
        sentiment_signal="confident"
    )
    db.add(ai_msg)
    
    student.xp += 15
    db.commit()
    db.refresh(ai_msg)
    
    return {
        "id": ai_msg.id,
        "sender": ai_msg.sender,
        "message_text": ai_msg.message_text,
        "voice_url": ai_msg.voice_url,
        "image_url": ai_msg.image_url,
        "timestamp": ai_msg.timestamp,
        "steps": ai_response.get("steps"),
        "formulas": ai_response.get("formulas"),
        "examples": ai_response.get("examples"),
        "conceptMap": ai_response.get("conceptMap")
    }
