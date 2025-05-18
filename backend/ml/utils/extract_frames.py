import cv2
import os
from mtcnn.mtcnn import MTCNN


def extract_faces_from_video(
    video_path: str,
    output_folder: str,
    frame_interval: float = 0.5,
    max_frames: int = 120,
    resize_to: tuple = (224, 224),
) -> list:
    """
    Extract face frames from a video using MTCNN and save them resized to 224x224.

    Args:
        video_path (str): Path to the input video file (.mp4 or .mkv)
        output_folder (str): Folder where output face frames will be saved
        frame_interval (float): Seconds between consecutive frames to capture
        max_frames (int): Maximum number of frames to extract
        resize_to (tuple): Size (width, height) to resize cropped face to

    Returns:
        List[str]: List of saved face frame image paths
    """
    os.makedirs(output_folder, exist_ok=True)
    detector = MTCNN()
    cap = cv2.VideoCapture(video_path)
    saved_paths = []

    if not cap.isOpened():
        raise IOError(f"❌ Cannot open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    captured = 0

    while captured < max_frames:
        frame_index = int(frame_count * fps * frame_interval)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ret, frame = cap.read()
        if not ret:
            break

        results = detector.detect_faces(frame)
        if results:
            for idx, result in enumerate(results):
                x, y, w, h = result["box"]
                cropped = frame[y : y + h, x : x + w]
                resized = cv2.resize(cropped, resize_to)

                # Simplified filename: frame_0.jpg, frame_1.jpg, ...
                filename = f"frame_{captured}.jpg"
                save_path = os.path.join(output_folder, filename)

                cv2.imwrite(save_path, resized)
                saved_paths.append(save_path)
                captured += 1

        frame_count += 1

    cap.release()
    return saved_paths


"""

== Example Usage ==

from ml.utils.extract_frames import extract_faces_from_video

frame_paths = extract_faces_from_video(
    video_path="uploaded_video.mp4",
    output_folder="temp/frames"
)

"""
