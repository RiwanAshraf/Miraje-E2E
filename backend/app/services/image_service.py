import torch
from PIL import Image
from app.models.loader import store, DEVICE


def predict(file_stream) -> dict:
    """Run image deepfake prediction. Returns dict with prediction and probabilities."""
    if store.vit is None:
        raise RuntimeError("Image model not loaded")

    image = Image.open(file_stream).convert("RGB")
    image = store.image_transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        vit_out     = store.vit(pixel_values=image)
        cls_token   = vit_out.last_hidden_state[:, 0, :]
        patch_tokens = vit_out.last_hidden_state[:, 1:, :]
        patch_tokens = patch_tokens.permute(0, 2, 1)
        patch_tokens = patch_tokens.view(patch_tokens.size(0), patch_tokens.size(1), 14, 14)
        cnn_features = store.cnn_block(patch_tokens)
        combined     = torch.cat([cnn_features, cls_token], dim=1)
        logits       = store.fc_layers(combined)
        probs        = torch.softmax(logits, dim=1)
        fake_prob    = probs[0][1].item() * 100
        real_prob    = probs[0][0].item() * 100

    return {
        "prediction":      "fake" if fake_prob > real_prob else "real",
        "fake_probability": round(fake_prob, 2),
        "real_probability": round(real_prob, 2),
        "score":            round(fake_prob, 2),
    }
