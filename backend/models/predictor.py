import os
import torch
import torch.nn as nn
from torchvision import transforms, models
from transformers import BertTokenizer, BertForSequenceClassification
from PIL import Image
from fusion_model import PTSDVideoTransformer, FusionHead, LateFusion  # Assumes you modularized the model
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

# ─── Class names and tokenizer ───
CLASS_NAMES = ["NO PTSD", "PTSD"]
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# ─── Global caches for models ───
_VIDEO_MODEL = None
_AUDIO_MODEL = None
_TEXT_MODEL = None
_FUSION_MODEL = None

# ─── Image transforms ───
img_tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

def load_video_model():
    """Load the video model once and return the cached instance."""
    global _VIDEO_MODEL
    if _VIDEO_MODEL is None:
        model = PTSDVideoTransformer(num_classes=NUM_CLASSES)
        ckpt = torch.load(CKPT_VIDEO, map_location=DEVICE)
        model.load_state_dict(ckpt, strict=False)
        _VIDEO_MODEL = model.to(DEVICE).eval()
    return _VIDEO_MODEL

def load_audio_model():
    """Load the audio model once and return the cached instance."""
    global _AUDIO_MODEL
    if _AUDIO_MODEL is None:
        model = models.efficientnet_v2_l(weights=None)
        model.classifier[-1] = nn.Linear(model.classifier[-1].in_features, NUM_CLASSES)
        ckpt = torch.load(CKPT_AUDIO, map_location=DEVICE)
        model.load_state_dict(ckpt, strict=False)
        _AUDIO_MODEL = model.to(DEVICE).eval()
    return _AUDIO_MODEL

def load_text_model():
    """Load the text model once and return the cached instance."""
    global _TEXT_MODEL
    if _TEXT_MODEL is None:
        model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=NUM_CLASSES)
        ckpt = torch.load(CKPT_TEXT, map_location=DEVICE)
        model.load_state_dict(ckpt, strict=False)
        _TEXT_MODEL = model.to(DEVICE).eval()
    return _TEXT_MODEL

def load_fusion_model():
    """Load the fusion model and its components once and return the cache."""
    global _FUSION_MODEL
    if _FUSION_MODEL is None:
        vm = load_video_model()
        am = load_audio_model()
        tm = load_text_model()
        model = LateFusion(vm, tm, am, NUM_CLASSES)
        fusion_ckpt = torch.load(CKPT_FUSION, map_location=DEVICE)
        model.load_state_dict(fusion_ckpt, strict=False)
        _FUSION_MODEL = model.to(DEVICE).eval()
    return _FUSION_MODEL

def load_video_frames(frame_folder):
    frame_paths = sorted([os.path.join(frame_folder, f) for f in os.listdir(frame_folder)
                          if f.endswith('.jpg') or f.endswith('.png')])
    if len(frame_paths) < SEQ_LEN:
        frame_paths += [frame_paths[-1]] * (SEQ_LEN - len(frame_paths))
    frame_paths = frame_paths[:SEQ_LEN]
    frames = [img_tf(Image.open(p).convert('RGB')) for p in frame_paths]
    return torch.stack(frames, dim=1)  # Shape: [3, SEQ_LEN, 224, 224]

def load_spectrograms(spec_folder, prefix):
    spec_paths = sorted([os.path.join(spec_folder, f) for f in os.listdir(spec_folder)
                         if f.startswith(prefix) and f.endswith('.png')])
    if len(spec_paths) < SEQ_LEN:
        spec_paths += [spec_paths[-1]] * (SEQ_LEN - len(spec_paths))
    spec_paths = spec_paths[:SEQ_LEN]
    specs = [img_tf(Image.open(p).convert('RGB')) for p in spec_paths]
    return torch.stack(specs, dim=1)  # Shape: [3, SEQ_LEN, 224, 224]

def predict_fusion_model(spectrogram_folder, frame_folder, transcript_text):
    model = load_fusion_model()

    # === VIDEO ===
    vid = load_video_frames(frame_folder).unsqueeze(0).to(DEVICE)  # [1, 3, SEQ_LEN, 224, 224]

    # === AUDIO ===
    patient_id = os.path.basename(frame_folder)
    aud = load_spectrograms(spectrogram_folder, prefix=patient_id).unsqueeze(0).to(DEVICE)

    # === TEXT ===
    enc = tokenizer(transcript_text, return_tensors='pt',
                    padding='max_length', truncation=True, max_length=MAX_TEXT_LEN)
    ids = enc['input_ids'].to(DEVICE)
    mask = enc['attention_mask'].to(DEVICE)

    # === Predict ===
    with torch.no_grad():
        logits = model(vid, aud, ids, mask)
        pred = torch.argmax(logits, dim=1).item()
    return CLASS_NAMES[pred]

# Initialize models on module import
load_fusion_model()
