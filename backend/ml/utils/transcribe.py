import os
import whisper
import re

# Load the Whisper model once
model = whisper.load_model("base")


def preprocess_text(text: str) -> str:
    """
    Clean raw Whisper transcript text.

    Args:
        text (str): Original transcript text

    Returns:
        str: Cleaned lowercase text with special characters removed
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return text.strip()


def transcribe_and_save(audio_path: str, save_dir: str) -> str:
    """
    Transcribe a given audio file using Whisper, clean it,
    and save the transcript as a .txt file.

    Args:
        audio_path (str): Path to input .wav audio
        save_dir (str): Directory to save the .txt transcript

    Returns:
        str: Path to saved .txt transcript file
    """
    try:
        result = model.transcribe(audio_path)
        cleaned_text = preprocess_text(result["text"])

        os.makedirs(save_dir, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(audio_path))[0]
        transcript_path = os.path.join(save_dir, f"{base_name}.txt")

        with open(transcript_path, "w", encoding="utf-8") as f:
            f.write(cleaned_text)

        return transcript_path

    except Exception as e:
        msg = str(e).lower()
        if isinstance(e, FileNotFoundError) or "ffmpeg" in msg or "ffprobe" in msg:
            print("FFmpeg not found – please install FFmpeg and ensure it’s on your PATH.")
        print(f"❌ Error transcribing {audio_path}: {e}")
        raise


"""
== Example usage ===

from ml.utils.transcribe import transcribe_and_save

transcript_path = transcribe_and_save(
    audio_path="temp/audio/uploaded_video.wav",
    save_dir="temp/transcripts"
)

# Optional: read transcript string from saved file
with open(transcript_path, "r", encoding="utf-8") as f:
    transcript = f.read()

    
"""
