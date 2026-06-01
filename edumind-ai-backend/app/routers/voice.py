from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas_db import Student
from app.services.voice import VoiceService, OCRService
from app.services.agents import TutorAgent
import datetime

router = APIRouter(prefix="/voice", tags=["Voice & Image Processing"])

@router.post("/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: str = Form(default="english")
):
    """Transcribe a voice recording to text using Whisper or simulation."""
    audio_bytes = await audio_file.read()
    transcript = VoiceService.transcribe_audio(audio_bytes, language, mime_type=audio_file.content_type or "audio/webm")

    return {
        "filename": audio_file.filename,
        "language": language,
        "transcript": transcript
    }

@router.post("/synthesize")
async def synthesize_speech(
    text: str = Form(...),
    language: str = Form(default="english")
):
    """Get TTS voice configuration parameters for client-side synthesis."""
    result = VoiceService.synthesize_speech(text, language)
    return result

@router.post("/ocr")
async def extract_notebook_text(
    notebook_image: UploadFile = File(...)
):
    """Extract text from a notebook or textbook photo using OCR."""
    image_bytes = await notebook_image.read()
    extracted_text = OCRService.extract_text_from_image(image_bytes)

    return {
        "filename": notebook_image.filename,
        "extracted_text": extracted_text
    }

@router.post("/voice-tutor")
async def voice_tutor_session(
    audio_file: UploadFile = File(...),
    language: str = Form(default="english"),
    student_id: int = Form(default=None),
    db: Session = Depends(get_db)
):
    """
    Full voice tutoring pipeline:
    1. Transcribe student's voice question
    2. Generate AI tutor response in target language
    3. Return TTS config for playback
    """
    goal = "engineering"
    lang = language
    if student_id:
        student = db.query(Student).filter(Student.id == student_id).first()
        if student:
            goal = student.learning_goal
            lang = student.preferred_language

    # Step 1: Transcribe
    audio_bytes = await audio_file.read()
    transcript = VoiceService.transcribe_audio(audio_bytes, lang, mime_type=audio_file.content_type or "audio/webm")

    # Step 2: Generate AI answer
    ai_response = TutorAgent.answer_query(transcript, language=lang, goal=goal)

    # Step 3: TTS config
    tts_config = VoiceService.synthesize_speech(ai_response["message_text"], lang)

    return {
        "student_said": transcript,
        "ai_response": ai_response["message_text"],
        "language": lang,
        "tts_config": tts_config["voice_config"]
    }
