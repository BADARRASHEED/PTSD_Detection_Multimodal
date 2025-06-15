import os
# from moviepy.editor import VideoFileClip
from moviepy import VideoFileClip


def extract_audio_from_video(video_path: str, output_folder: str) -> str:
    """
    Extracts audio from a given video file and saves it as a .wav file.

    Args:
        video_path (str): Full path to the input .mp4 video
        output_folder (str): Directory to save the extracted .wav file

    Returns:
        str: Path to the saved .wav file, or None if extraction failed
    """
    try:
        os.makedirs(output_folder, exist_ok=True)

        video_name = os.path.splitext(os.path.basename(video_path))[0]
        audio_path = os.path.join(output_folder, f"{video_name}.wav")

        clip = VideoFileClip(video_path)
        clip.audio.write_audiofile(audio_path)
        clip.close()

        return audio_path

    except Exception as e:
        print(f"❌ Error extracting audio from {video_path}: {e}")
        return None


"""

== Example usage ==

from ml.utils.extract_audio import extract_audio_from_video

audio_path = extract_audio_from_video(
    video_path="uploaded_video.mp4",
    output_folder="temp/audio"
)

"""
