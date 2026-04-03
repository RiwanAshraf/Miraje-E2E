const MODES = [
  { key: "image",     code: "IMG //", name: "Image",     desc: "AI-generated and manipulated photograph detection via GAN fingerprinting",       flag: "Live" },
  { key: "video",     code: "VID //", name: "Video",     desc: "Frame-by-frame temporal coherence analysis for face swap and synthesis",           flag: "Live" },
  { key: "audio",     code: "AUD //", name: "Audio",     desc: "Cloned voice and synthetic speech identification via spectral forensics",           flag: "Beta" },
  { key: "signature", code: "SIG //", name: "Signature", desc: "Handwritten signature forgery detection using stroke dynamics analysis",            flag: "Beta" },
];

export default function ModeSelector({ mode, onSetMode }) {
  return (
    <div className="modes">
      {MODES.map((m) => (
        <div
          key={m.key}
          className={`mode-tile${mode === m.key ? " active" : ""}`}
          onClick={() => onSetMode(m.key)}
        >
          <div className={`mode-flag ${m.flag === "Live" ? "flag-live" : "flag-beta"}`}>{m.flag}</div>
          <div className="mode-code">{m.code}</div>
          <div className="mode-name">{m.name}</div>
          <div className="mode-desc">{m.desc}</div>
        </div>
      ))}
    </div>
  );
}
