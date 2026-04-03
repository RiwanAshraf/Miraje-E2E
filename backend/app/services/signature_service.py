import os
import tempfile
import numpy as np
import cv2
from app.models.loader import store


def _extract_features(path: str) -> np.ndarray:
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Cannot read signature image")
    img = cv2.resize(img, (128, 128))
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    img = img.astype(np.float32) / 255.0
    return np.expand_dims(img, 0)


def predict(file_bytes: bytes) -> dict:
    """Run signature forgery prediction. Returns dict with prediction and probabilities."""
    if store.signature_model is None:
        raise RuntimeError("Signature model not loaded")

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        features = _extract_features(tmp_path)
        prob_genuine = float(store.signature_model.predict(features, verbose=0)[0][0])
        forged_prob  = (1 - prob_genuine) * 100
        return {
            "prediction":      "fake" if forged_prob > 50 else "real",
            "fake_probability": round(forged_prob, 2),
            "real_probability": round(prob_genuine * 100, 2),
            "score":            round(forged_prob, 2),
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
