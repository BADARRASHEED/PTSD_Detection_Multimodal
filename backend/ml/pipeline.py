import os
from ml.utils.extract_audio import extract_audio_from_video
from ml.utils.extract_frames import extract_faces_from_video
from ml.utils.spectrogram import process_audio_file
from ml.utils.transcribe import transcribe_and_save
from ..models.predictor import predict_fusion_model


def process_video(video_path: str) -> str:
    """
    Full pipeline: video → audio → frames + spectrogram + transcript → model → prediction

    Args:
        video_path (str): Path to uploaded .mp4 video file

    Returns:
        str: Prediction result ("PTSD" or "No PTSD")
    """
    # === FOLDER SETUP ===
    base_name = os.path.splitext(os.path.basename(video_path))[0]

    audio_dir = "temp/audio"
    frame_dir = "temp/frames"
    spec_dir = "temp/spectrogram_patches"
    text_dir = "temp/transcripts"

    # === STEP 1: Extract Audio ===
    audio_path = extract_audio_from_video(video_path, audio_dir)

    # === STEP 2: Extract Face Frames ===
    frame_paths = extract_faces_from_video(
        video_path=video_path,
        output_folder=frame_dir
    )

    # === STEP 3: Generate Spectrogram Patches ===
    process_audio_file(audio_path, spec_dir)

    # === STEP 4: Transcribe & Save Text ===
    transcript_path = transcribe_and_save(audio_path, text_dir)

    # === STEP 5: Read Transcription Text ===
    with open(transcript_path, "r", encoding="utf-8") as f:
        transcript = f.read()

    # === STEP 6: Run Multimodal Prediction ===
    result = predict_fusion_model(
        spectrogram_folder=spec_dir,
        frame_folder=frame_dir,
        transcript_text=transcript
    )

    return result
