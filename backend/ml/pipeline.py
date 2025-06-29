import os
from ml.utils.extract_audio import extract_audio_from_video
from ml.utils.extract_frames import extract_faces_from_video
from ml.utils.spectrogram import process_audio_file
from ml.utils.transcribe import transcribe_and_save
from models.predictor import predict_fusion_model


def process_video(video_path: str, work_dir: str) -> str:
    """Run the entire prediction pipeline for a single video.

    All intermediate artifacts are stored inside ``work_dir`` which should be a
    unique temporary directory for the current request.

    Args:
        video_path: Path to the uploaded ``.mp4`` video file.
        work_dir: Temporary directory where intermediate data will be written.

    Returns:
        Prediction string ("PTSD" or "NO PTSD").
    """
    # === FOLDER SETUP ===
    base_name = os.path.splitext(os.path.basename(video_path))[0]

    # All intermediate data lives inside the provided work_dir
    audio_dir = os.path.join(work_dir, "audio")
    frame_dir = os.path.join(work_dir, "frames")
    spec_dir = os.path.join(work_dir, "spectrogram_patches")
    text_dir = os.path.join(work_dir, "transcripts")

    # ensure directory exists; the utility functions will create
    # their respective subfolders as needed
    os.makedirs(work_dir, exist_ok=True)

    # Create subfolders for this request
    for d in [audio_dir, frame_dir, spec_dir, text_dir]:
        os.makedirs(d, exist_ok=True)

    # === STEP 1: Extract Audio ===
    try:
        audio_path = extract_audio_from_video(video_path, audio_dir)
    except Exception as e:
        raise RuntimeError(f"Audio extraction failed for {video_path}: {e}") from e
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
