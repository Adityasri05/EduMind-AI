"""
Voice processing service for EduMind AI.
Handles speech-to-text (Gemini) and text-to-speech pipelines.
Falls back to simulation stubs when API keys are not configured.
"""

from app.config import settings

class VoiceService:
    """Handles voice-based tutoring: STT transcription and TTS synthesis."""

    @staticmethod
    def transcribe_audio(audio_bytes: bytes, language: str = "english", mime_type: str = "audio/webm") -> str:
        """
        Transcribe audio bytes to text using Gemini API or simulation.
        """
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                
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
            except Exception:
                pass

        # Simulation fallback for demo mode
        simulated_transcripts = {
            "english": "Explain the fringe width formula in Young's double slit interference experiment.",
            "hindi": "कृपया यंग के द्वि-स्लिट हस्तक्षेप प्रयोग में फ्रिंज चौड़ाई का सूत्र समझाएं।",
            "spanish": "Explique la fórmula del ancho de la franja en el experimento de Young.",
            "marathi": "यंगच्या दुहेरी स्लिट हस्तक्षेप प्रयोगातील फ्रिंज रुंदीचे सूत्र स्पष्ट करा.",
            "bengali": "ইয়ং-এর ডাবল স্লিট ব্যতিচার পরীক্ষায় ফ্রিঞ্জ প্রস্থের সূত্রটি ব্যাখ্যা করো।"
        }
        return simulated_transcripts.get(language.lower(), simulated_transcripts["english"])

    @staticmethod
    def synthesize_speech(text: str, language: str = "english") -> dict:
        """
        Convert text to speech audio parameters.
        """
        voice_configs = {
            "english": {"lang": "en-US", "rate": 1.0, "pitch": 1.0, "voice_name": "Google US English"},
            "hindi": {"lang": "hi-IN", "rate": 0.95, "pitch": 1.0, "voice_name": "Google हिन्दी"},
            "spanish": {"lang": "es-ES", "rate": 0.98, "pitch": 1.0, "voice_name": "Google Español"},
            "marathi": {"lang": "mr-IN", "rate": 0.93, "pitch": 0.98, "voice_name": "Marathi Voice"},
            "bengali": {"lang": "bn-IN", "rate": 0.94, "pitch": 1.0, "voice_name": "Bengali Voice"}
        }

        lang_key = language.lower() if language else "english"
        config = voice_configs.get(lang_key, voice_configs["english"])

        return {
            "text": text,
            "language": lang_key,
            "voice_config": config,
            "engine": "web_speech_api",
            "note": "Audio synthesis is handled client-side via Web Speech API. This endpoint returns voice parameters."
        }


class OCRService:
    """Handles notebook photo OCR extraction and question detection."""

    @staticmethod
    def extract_text_from_image(image_bytes: bytes) -> str:
        """
        Extract text from a notebook/textbook image.
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
                        "If it contains a math problem, identify the problem clearly. ",
                        image
                    ]
                )
                return response.text
            except Exception:
                pass

        return (
            "Question: Derive the path difference formula in Young's double slit interference setup. "
            "(OCR Simulation - Gemini Vision API key not configured)"
        )
