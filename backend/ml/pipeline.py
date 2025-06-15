import os
from ml.utils.extract_audio import extract_audio_from_video
from ml.utils.extract_frames import extract_faces_from_video
from ml.utils.spectrogram import process_audio_file
from ml.utils.transcribe import transcribe_and_save
from models.predictor import predict_fusion_model


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
    if not audio_path:
        raise RuntimeError(f"Audio extraction failed for {video_path}")

    # === STEP 2: Extract Face Frames ===
    try:
        frame_paths = extract_faces_from_video(
            video_path=video_path, output_folder=frame_dir
        )
    except Exception as e:
        raise RuntimeError(f"Face extraction failed for {video_path}: {e}")
    if not frame_paths:
        raise RuntimeError(f"No faces extracted from {video_path}")

    # === STEP 3: Generate Spectrogram Patches ===
    try:
        process_audio_file(audio_path, spec_dir)
    except Exception as e:
        raise RuntimeError(f"Spectrogram generation failed for {video_path}: {e}")

    # === STEP 4: Transcribe & Save Text ===
    transcript_path = transcribe_and_save(audio_path, text_dir)
    if not transcript_path or not os.path.exists(transcript_path):
        raise RuntimeError(f"Transcription failed for {video_path}")

    # === STEP 5: Read Transcription Text ===
    with open(transcript_path, "r", encoding="utf-8") as f:
        transcript = f.read()

    # === STEP 6: Run Multimodal Prediction ===
    result = predict_fusion_model(
        spectrogram_folder=spec_dir,
        frame_folder=frame_dir,
        transcript_text=transcript,
        base_name=base_name,
    )

    return result
