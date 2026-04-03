/* ── ANALYSIS CONFIG ── */
export const CFG = {
  image: {
    fmts: ["JPG", "PNG", "WEBP", "GIF", "BMP", "TIFF"],
    metrics: [
      { n: "GAN Fingerprint",     c: "var(--danger2)" },
      { n: "Frequency Anomaly",   c: "var(--acc)"     },
      { n: "Face Landmark Drift", c: "var(--warn2)"   },
      { n: "Compression Traces",  c: "var(--safe2)"   },
    ],
    steps: ["Preprocessing", "Feature Extraction", "GAN Classifier", "Frequency Analysis", "Report Generation"],
    results: [
      { code: "SYS-01", name: "Face Analysis",     desc: "Landmark geometry, eye blink patterns & skin texture synthesis markers" },
      { code: "SYS-02", name: "Frequency Domain",  desc: "DCT & Fourier transform artifact detection in latent space" },
      { code: "SYS-03", name: "Texture Forensics", desc: "Pixel-level GAN fingerprint extraction and classification" },
    ],
  },
  video: {
    fmts: ["MP4", "MOV", "AVI", "MKV", "WEBM"],
    metrics: [
      { n: "Temporal Consistency", c: "var(--danger2)" },
      { n: "Lip-Sync Alignment",   c: "var(--acc)"     },
      { n: "Motion Artifacts",     c: "var(--warn2)"   },
      { n: "Frame Coherence",      c: "var(--safe2)"   },
    ],
    steps: ["Frame Extraction", "Face Tracking", "Temporal Analysis", "Lip-Sync Check", "Report Generation"],
    results: [
      { code: "SYS-01", name: "Face Swap",    desc: "Inter-frame face boundary and blending artifacts across sequence" },
      { code: "SYS-02", name: "Lip Sync",     desc: "Audio-visual alignment consistency and phoneme mapping" },
      { code: "SYS-03", name: "Motion Flow",  desc: "Optical flow coherence and unnatural motion detection" },
    ],
  },
  audio: {
    fmts: ["WAV", "MP3", "FLAC", "OGG", "M4A", "AAC"],
    metrics: [
      { n: "Spectral Artifacts",  c: "var(--danger2)" },
      { n: "Prosody Score",       c: "var(--acc)"     },
      { n: "Voice Embedding Δ",   c: "var(--warn2)"   },
      { n: "Breath Naturalness",  c: "var(--safe2)"   },
    ],
    steps: ["Audio Decoding", "Spectrogram Analysis", "Voice Embedding", "Prosody Check", "Report Generation"],
    results: [
      { code: "SYS-01", name: "Voice Cloning", desc: "Latent voice embedding similarity and TTS artifact identification" },
      { code: "SYS-02", name: "Spectrogram",   desc: "MFCC deviation and spectral synthesis marker detection" },
      { code: "SYS-03", name: "Prosody & Rhythm", desc: "Unnatural stress, pacing and breathing pattern analysis" },
    ],
  },
  signature: {
    fmts: ["JPG", "PNG", "PDF", "TIFF", "BMP"],
    metrics: [
      { n: "Stroke Velocity",  c: "var(--danger2)" },
      { n: "Pressure Variance",c: "var(--acc)"     },
      { n: "Tremor Analysis",  c: "var(--warn2)"   },
      { n: "Loop Consistency", c: "var(--safe2)"   },
    ],
    steps: ["Image Preprocessing", "Stroke Segmentation", "Dynamic Analysis", "Template Matching", "Report Generation"],
    results: [
      { code: "SYS-01", name: "Stroke Dynamics",  desc: "Velocity, pressure and pen-lift pattern forensic analysis" },
      { code: "SYS-02", name: "Geometric Match",  desc: "Reference template comparison via Dynamic Time Warping" },
      { code: "SYS-03", name: "Writer Verify",    desc: "Neural handwriting style embedding match and comparison" },
    ],
  },
};

export function getModeGlyph(m) {
  return m === "image" ? "▣" : m === "video" ? "▶" : m === "audio" ? "♪" : "✦";
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
