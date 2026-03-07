from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torch import nn
from transformers import ViTModel, ViTConfig
from torchvision import transforms
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

device = torch.device("cpu")

# ── Load architecture ──────────────────────────────────────────────────────────
config = ViTConfig.from_pretrained("google/vit-base-patch16-224-in21k")
vit = ViTModel(config)          # ← do NOT use from_pretrained here;
                                 #   your checkpoint already contains trained weights

cnn_block = nn.Sequential(
    nn.Conv2d(config.hidden_size, 256, kernel_size=3, padding=1), nn.ReLU(),
    nn.Conv2d(256, 128, kernel_size=3, padding=1), nn.ReLU(),
    nn.AdaptiveAvgPool2d((8, 8)), nn.Flatten()
)

fc_layers = nn.Sequential(
    nn.Linear(128 * 8 * 8 + config.hidden_size, 512), nn.ReLU(),
    nn.Dropout(0.3), nn.Linear(512, 2)
)

# ── Load checkpoint ────────────────────────────────────────────────────────────
checkpoint = torch.load("image_module.pth", map_location=device)
vit.load_state_dict(checkpoint['vit'])
cnn_block.load_state_dict(checkpoint['cnn_block'])
fc_layers.load_state_dict(checkpoint['fc_layers'])

vit.to(device).eval()
cnn_block.to(device).eval()
fc_layers.to(device).eval()

# ── Sanity-check: print mean of last FC layer weights ─────────────────────────
for name, param in fc_layers.named_parameters():
    print(f"[checkpoint check] {name}: mean={param.data.mean().item():.6f}")

# ── ImageFolder alphabetical order: fake=0, real=1 ────────────────────────────
CLASS_NAMES = ["fake", "real"]

# ── Transform (must match training exactly) ───────────────────────────────────
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img = Image.open(io.BytesIO(file.read())).convert('RGB')
    tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        out = vit(tensor)
        cls = out.last_hidden_state[:, 0, :]          # CLS token
        patches = out.last_hidden_state[:, 1:, :]     # patch tokens

        B, N, C = patches.shape
        h = w = int(N ** 0.5)
        grid = patches.transpose(1, 2).reshape(B, C, h, w)

        cnn_feat = cnn_block(grid)
        combined = torch.cat((cls, cnn_feat), dim=1)
        logits = fc_layers(combined)
        probs = torch.softmax(logits, dim=1)

    # Use CLASS_NAMES to look up the correct index — same as Colab
    fake_idx = CLASS_NAMES.index("fake")   # 0
    real_idx = CLASS_NAMES.index("real")   # 1

    fake_prob = probs[0][fake_idx].item()
    real_prob = probs[0][real_idx].item()
    predicted_class = CLASS_NAMES[torch.argmax(probs, dim=1).item()]

    print(f"Prediction: {predicted_class} | Fake: {fake_prob*100:.2f}% | Real: {real_prob*100:.2f}%")

    return jsonify({
        'prediction': predicted_class,
        'score': round(fake_prob * 100, 1),
        'fake_prob': round(fake_prob * 100, 2),
        'real_prob': round(real_prob * 100, 2),
    })


if __name__ == '__main__':
    app.run(port=5000, debug=True)