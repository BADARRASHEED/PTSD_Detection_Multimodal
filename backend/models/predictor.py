import os
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import joblib

from .fusion_model import PTSDVideoTransformer, FusionHead, LateFusion

import warnings

warnings.filterwarnings("ignore")

# ─── Constants ───
NUM_CLASSES = 2
SEQ_LEN = 50
MAX_TEXT_LEN = 128
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ─── Checkpoint paths (you can modify if stored elsewhere) ───
CKPT_VIDEO = "checkpoints/best_tublett_embedding_model.pth"
CKPT_AUDIO = "checkpoints/best_effnet_vit_ensemble.pth"
CKPT_TEXT = "checkpoints/ensemble_model.pth"
CKPT_FUSION = "checkpoints/best_fusion_model.pth"

# ─── Class names ───
CLASS_NAMES = ["NO PTSD", "PTSD"]

# ─── Global caches for models ───
_VIDEO_MODEL = None
_AUDIO_MODEL = None
_TEXT_MODEL = None
_FUSION_MODEL = None

# ─── Image transforms ───
img_tf = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)


# ─── TorchTextEnsembleModel definition (copied from your notebook, slightly cleaned) ───
class TorchTextEnsembleModel(nn.Module):
    def __init__(self, joblib_path, device="cpu", out_dim=128):
        super().__init__()
        self.device = device
        # This joblib file contains: vectorizer, lr_model, xgb_meta
        self.ensemble = joblib.load(joblib_path)
        self.vectorizer = self.ensemble["vectorizer"]
        self.lr_model = self.ensemble["lr_model"]
        self.xgb_meta = self.ensemble["xgb_meta"]
        self.text_proj = nn.Linear(1, out_dim)

    def forward(self, texts):
        with torch.no_grad():
            X_tfidf = self.vectorizer.transform(texts)
            lr_probs = self.lr_model.predict_proba(X_tfidf)[:, 1]
            meta_X = np.stack([lr_probs, lr_probs], axis=1)
            meta_probs = self.xgb_meta.predict_proba(meta_X)[:, 1]
            out = torch.tensor(
                meta_probs, dtype=torch.float32, device=self.device
            ).unsqueeze(1)
        out = self.text_proj(out)
        return out  # [B, 128]


import numpy as np


def load_video_model():
    global _VIDEO_MODEL
    if _VIDEO_MODEL is None:
        model = PTSDVideoTransformer(num_classes=NUM_CLASSES)
        ckpt = torch.load(CKPT_VIDEO, map_location=DEVICE, weights_only=False)
        model.load_state_dict(ckpt, strict=False)
        _VIDEO_MODEL = model.to(DEVICE).eval()
    return _VIDEO_MODEL


def load_audio_model():
    global _AUDIO_MODEL
    if _AUDIO_MODEL is None:
        model = models.efficientnet_v2_l(weights=None)
        model.classifier[-1] = nn.Linear(model.classifier[-1].in_features, NUM_CLASSES)
        ckpt = torch.load(CKPT_AUDIO, map_location=DEVICE, weights_only=False)
        model.load_state_dict(ckpt, strict=False)
        _AUDIO_MODEL = model.to(DEVICE).eval()
    return _AUDIO_MODEL


def load_text_model():
    global _TEXT_MODEL
    if _TEXT_MODEL is None:
        # NOTE: This path should point to your joblib file (ensemble with TFIDF, LR, XGB)
        # The text model outputs a feature vector that will be fused with the
        # video and audio branches. We only need a vector of size
        # ``NUM_CLASSES`` for the fusion head, so set ``out_dim`` accordingly.
        model = TorchTextEnsembleModel(
            joblib_path=CKPT_TEXT, device=DEVICE, out_dim=NUM_CLASSES
        )
        _TEXT_MODEL = model.to(DEVICE).eval()
    return _TEXT_MODEL


def load_fusion_model():
    global _FUSION_MODEL
    if _FUSION_MODEL is None:
        vm = load_video_model()
        am = load_audio_model()
        tm = load_text_model()
        model = LateFusion(vm, tm, am, NUM_CLASSES)
        fusion_ckpt = torch.load(CKPT_FUSION, map_location=DEVICE, weights_only=False)
        model.load_state_dict(fusion_ckpt, strict=False)
        _FUSION_MODEL = model.to(DEVICE).eval()
    return _FUSION_MODEL


def load_video_frames(frame_folder):
    frame_paths = sorted(
        [
            os.path.join(frame_folder, f)
            for f in os.listdir(frame_folder)
            if f.endswith(".jpg") or f.endswith(".png")
        ]
    )
    if len(frame_paths) < SEQ_LEN:
        frame_paths += [frame_paths[-1]] * (SEQ_LEN - len(frame_paths))
    frame_paths = frame_paths[:SEQ_LEN]
    frames = [img_tf(Image.open(p).convert("RGB")) for p in frame_paths]
    return torch.stack(frames, dim=1)  # [3, SEQ_LEN, 224, 224]


def load_spectrograms(spec_folder, prefix):
    spec_paths = sorted(
        [
            os.path.join(spec_folder, f)
            for f in os.listdir(spec_folder)
            if f.startswith(prefix) and f.endswith(".png")
        ]
    )
    if not spec_paths:
        raise RuntimeError(
            f"No spectrograms found in {spec_folder} with prefix '{prefix}'"
        )
    if len(spec_paths) < SEQ_LEN:
        spec_paths += [spec_paths[-1]] * (SEQ_LEN - len(spec_paths))
    spec_paths = spec_paths[:SEQ_LEN]
    specs = [img_tf(Image.open(p).convert("RGB")) for p in spec_paths]
    return torch.stack(specs, dim=1)  # [3, SEQ_LEN, 224, 224]


def predict_fusion_model(spectrogram_folder, frame_folder, transcript_text, base_name):
    model = load_fusion_model()

    # === VIDEO ===
    vid = load_video_frames(frame_folder).unsqueeze(0).to(DEVICE)

    # === AUDIO ===
    aud = (
        load_spectrograms(spectrogram_folder, prefix=base_name).unsqueeze(0).to(DEVICE)
    )

    # === TEXT ===
    text_model = load_text_model()
    text_feat = text_model([transcript_text])  # Pass as a list

    # === Predict ===
    with torch.no_grad():
        logits = model(vid, aud, text_feat)
        pred = torch.argmax(logits, dim=1).item()
    return CLASS_NAMES[pred]


# Models will be lazily loaded by ``predict_fusion_model``
