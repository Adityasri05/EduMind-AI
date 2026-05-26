from fastapi import APIRouter, UploadFile, File, Form
from app.services.voice import VoiceService, OCRService
from app.services.agents import TutorAgent, DialectTranslationAgent

router = APIRouter(prefix="/voice", tags=["Voice & Image Processing"])


@router.post("/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: str = Form(default="hi")
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
    dialect: str = Form(default="hindi")
):
    """Get TTS voice configuration parameters for client-side synthesis."""
    result = VoiceService.synthesize_speech(text, dialect)
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
    dialect: str = Form(default="hinglish")
):
    """
    Full voice tutoring pipeline:
    1. Transcribe student's voice question
    2. Generate AI tutor response in target dialect
    3. Return TTS config for playback
    """
    # Step 1: Transcribe
    audio_bytes = await audio_file.read()
    transcript = VoiceService.transcribe_audio(audio_bytes, "hi", mime_type=audio_file.content_type or "audio/webm")

    # Step 2: Generate AI answer
    ai_response = TutorAgent.answer_query(transcript, dialect)

    # Step 3: TTS config
    tts_config = VoiceService.synthesize_speech(ai_response, dialect)

    return {
        "student_said": transcript,
        "ai_response": ai_response,
        "dialect": dialect,
        "tts_config": tts_config["voice_config"]
    }


@router.post("/translate")
async def translate_text(
    text: str = Form(...),
    target_dialect: str = Form(default="awadhi")
):
    """Translate educational text into a target vernacular dialect."""
    translated = DialectTranslationAgent.translate(text, target_dialect)
    return {
        "original": text,
        "target_dialect": target_dialect,
        "translated": translated
    }
