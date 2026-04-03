"""
ML model loader — loads all models once at FastAPI startup.
Models are stored in module-level variables and injected via FastAPI dependency.
"""
import os
import torch
from torch import nn
from torchvision import transforms
import tensorflow as tf

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ── Device ─────────────────────────────────────────────────────────────────────
DEVICE = torch.device("cpu")


# ── Shared state (populated at startup) ───────────────────────────────────────
class ModelStore:
    vit = None
    cnn_block = None
    fc_layers = None
    image_transform = None
    audio_model = None
    signature_model = None


store = ModelStore()


def load_all_models():
    """Called once during FastAPI lifespan startup."""
    _load_image_model()
    _load_audio_model()
    _load_signature_model()
    print("✅ All models loaded")


# ── Image model (ViT + CNN) ────────────────────────────────────────────────────
def _load_image_model():
    image_path = os.path.join(MODELS_DIR, "image_module.pth")
    if not os.path.exists(image_path):
        print(f"⚠️  Image model not found at {image_path}, skipping.")
        return

    from transformers import ViTModel, ViTConfig
    config = ViTConfig.from_pretrained("google/vit-base-patch16-224-in21k")

    vit = ViTModel.from_pretrained("google/vit-base-patch16-224-in21k", config=config)

    cnn_block = nn.Sequential(
        nn.Conv2d(config.hidden_size, 256, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.Conv2d(256, 128, kernel_size=3, padding=1),
        nn.ReLU(),
        nn.AdaptiveAvgPool2d((8, 8)),
        nn.Flatten(),
    )

    fc_layers = nn.Sequential(
        nn.Linear(128 * 8 * 8 + config.hidden_size, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, 2),
    )

    checkpoint = torch.load(image_path, map_location=DEVICE)
    vit.load_state_dict(checkpoint["vit"])
    cnn_block.load_state_dict(checkpoint["cnn_block"])
    fc_layers.load_state_dict(checkpoint["fc_layers"])

    vit.eval(); cnn_block.eval(); fc_layers.eval()

    store.vit = vit
    store.cnn_block = cnn_block
    store.fc_layers = fc_layers
    store.image_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
    ])
    print("✅ Image model loaded")


# ── Audio model (CNN-LSTM) ─────────────────────────────────────────────────────
def _load_audio_model():
    audio_path = os.path.join(MODELS_DIR, "audio_model.keras")
    if not os.path.exists(audio_path):
        print(f"⚠️  Audio model not found at {audio_path}, skipping.")
        return
    model = tf.keras.models.load_model(audio_path)
    model.trainable = False
    store.audio_model = model
    print("✅ Audio model loaded")


# ── Signature model (MobileNetV2) ──────────────────────────────────────────────
def _load_signature_model():
    sig_path = os.path.join(MODELS_DIR, "signature_forgery_detector.keras")
    if not os.path.exists(sig_path):
        print(f"⚠️  Signature model not found at {sig_path}, skipping.")
        return
    model = tf.keras.models.load_model(sig_path)
    model.trainable = False
    store.signature_model = model
    print("✅ Signature model loaded")
