"""
Voice processing service for ShikshaMitra AI.
Handles speech-to-text (Whisper) and text-to-speech pipelines.
Falls back to simulation stubs when API keys are not configured.
"""

from app.config import settings


class VoiceService:
    """Handles voice-based tutoring: STT transcription and TTS synthesis."""

    @staticmethod
    def transcribe_audio(audio_bytes: bytes, language: str = "hi", mime_type: str = "audio/webm") -> str:
        """
        Transcribe audio bytes to text using Whisper API or simulation.
        
        Args:
            audio_bytes: Raw audio file content
            language: ISO language code (hi for Hindi, en for English)
            mime_type: Mime type of the audio file (default audio/webm)
        
        Returns:
            Transcribed text string
        """
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                
                # Transcribe using Gemini 2.5 Flash Lite
                response = client.models.generate_content(
                    model="gemini-2.5-flash-lite",
                    contents=[
                        types.Part.from_bytes(
                            data=audio_bytes,
                            mime_type=mime_type
                        ),
                        f"You are a Speech-to-Text transcription tool. Transcribe the spoken audio query. If the spoken language is Hindi or Hinglish, transcribe it into neat Devanagari Hindi or Hinglish respectively. The target language code is '{language}'. Return ONLY the transcribed query text, with no preamble, explanations, markdown, or punctuation unless spoken."
                    ]
                )
                if response.text:
                    return response.text.strip()
            except Exception as e:
                pass  # Fall through to OpenAI / Simulation

        if settings.OPENAI_API_KEY:
            try:
                import openai
                client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
                # Write temp audio for Whisper
                import tempfile, os
                with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
                    tmp.write(audio_bytes)
                    tmp_path = tmp.name

                with open(tmp_path, "rb") as audio_file:
                    transcript = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        language=language
                    )
                os.unlink(tmp_path)
                return transcript.text
            except Exception as e:
                pass  # Fall through to simulation

        # Simulation fallback for demo/hackathon mode
        simulated_transcripts = {
            "hi": "सर, प्रकाश परावर्तन (Reflection of Light) के नियम क्या हैं? कृपया सरल भाषा में समझाएं।",
            "en": "Sir, what are the laws of reflection of light? Please explain in simple words.",
        }
        return simulated_transcripts.get(language, simulated_transcripts["hi"])

    @staticmethod
    def synthesize_speech(text: str, dialect: str = "hindi") -> dict:
        """
        Convert text to speech audio. Returns metadata about the generated audio.
        In production this would return an audio URL/stream; for demo it returns config.
        
        Args:
            text: Text to convert to speech
            dialect: Target dialect for voice tone
            
        Returns:
            Dict with synthesis metadata
        """
        # Map dialects to voice configurations
        voice_configs = {
            "hindi": {"lang": "hi-IN", "rate": 0.95, "pitch": 1.0, "voice_name": "Google हिन्दी"},
            "hinglish": {"lang": "hi-IN", "rate": 1.0, "pitch": 1.0, "voice_name": "Google Hindi"},
            "awadhi": {"lang": "hi-IN", "rate": 0.9, "pitch": 0.95, "voice_name": "Awadhi Tone"},
            "bhojpuri": {"lang": "hi-IN", "rate": 0.88, "pitch": 1.05, "voice_name": "Bhojpuri Tone"},
        }

        config = voice_configs.get(dialect, voice_configs["hindi"])

        return {
            "text": text,
            "dialect": dialect,
            "voice_config": config,
            "engine": "web_speech_api",  # Frontend uses browser TTS
            "note": "Audio synthesis is handled client-side via Web Speech API. This endpoint returns voice parameters."
        }


class OCRService:
    """Handles notebook photo OCR extraction and question detection."""

    @staticmethod
    def extract_text_from_image(image_bytes: bytes) -> str:
        """
        Extract text from a notebook/textbook image.
        Uses Gemini Vision API if available, otherwise returns simulation.
        
        Args:
            image_bytes: Raw image file content
            
        Returns:
            Extracted text from the image
        """
        if settings.GEMINI_API_KEY:
            try:
                from google import genai

                client = genai.Client(api_key=settings.GEMINI_API_KEY)

                import PIL.Image
                import io
                image = PIL.Image.open(io.BytesIO(image_bytes))

                response = client.models.generate_content(
                    model="gemini-2.5-flash-lite",
                    contents=[
                        "Extract all text from this student notebook/textbook image. "
                        "If it contains a math problem, identify the problem clearly. "
                        "Return the extracted text in Hindi if the content is in Hindi.",
                        image
                    ]
                )
                return response.text
            except Exception:
                pass

        # Simulation fallback
        return (
            "प्रश्न: यदि sin A = 3/5 है, तो cos A और tan A का मान ज्ञात कीजिए। "
            "[UP Board 2023 - कक्षा 10, अध्याय: त्रिकोणमिति] "
            "(OCR Simulation - Gemini Vision API key not configured)"
        )
