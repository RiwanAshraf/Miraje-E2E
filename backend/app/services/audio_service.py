import os
import tempfile
import librosa
import numpy as np
from app.models.loader import store

SAMPLE_RATE   = 16000
DURATION      = 2
N_MELS        = 128
N_FFT         = 2048
HOP_LENGTH    = 512
TARGET_LENGTH = SAMPLE_RATE * DURATION


def _extract_features(path: str) -> np.ndarray:
    audio, sr = librosa.load(path, sr=SAMPLE_RATE)
    if len(audio) >= TARGET_LENGTH:
        audio = audio[:TARGET_LENGTH]
    else:
        audio = np.pad(audio, (0, TARGET_LENGTH - len(audio)))

    mel = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=N_MELS, n_fft=N_FFT, hop_length=HOP_LENGTH)
    log_mel = librosa.power_to_db(mel, ref=np.max)
    rng = log_mel.max() - log_mel.min()
    log_mel = (log_mel - log_mel.min()) / (rng + 1e-8)
    return log_mel[..., np.newaxis].astype(np.float32)


def predict(file_bytes: bytes) -> dict:
    """Run audio deepfake prediction. Returns dict with prediction and probabilities."""
    if store.audio_model is None:
        raise RuntimeError("Audio model not loaded")

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        features = _extract_features(tmp_path)
        features = features[np.newaxis, ...]
        raw = float(store.audio_model.predict(features, verbose=0)[0][0])
        fake_prob = (1 - raw) * 100
        return {
            "prediction":      "fake" if fake_prob > 50 else "real",
            "fake_probability": round(fake_prob, 2),
            "real_probability": round(100 - fake_prob, 2),
            "score":            round(fake_prob, 2),
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
