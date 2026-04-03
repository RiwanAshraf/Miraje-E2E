import { useRef } from "react";

export default function DropZone({ mode, cfg, fileLoaded, fileName, fileSize, previewSrc, audioSrc, scanning, onDrop, onFilePick }) {
  const fileRef = useRef(null);

  function onDragOver(e) { e.preventDefault(); }
  function handleDrop(e) { e.preventDefault(); if (e.dataTransfer.files[0]) onDrop(e.dataTransfer.files[0]); }
  function handlePick(e) { if (e.target.files[0]) onFilePick(e.target.files[0]); }

  return (
    <>
      <div
        className="drop-zone"
        onDragOver={onDragOver}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <div className="dc tl" /><div className="dc tr" /><div className="dc bl" /><div className="dc br" />
        {scanning && <div className="scan-beam" />}

        {previewSrc ? (
          <img className="preview-img" src={previewSrc} alt="preview" />
        ) : audioSrc ? (
          <div className="drop-inner">
            <div className="drop-title">{fileName}</div>
            <div className="drop-sub">{fileSize} MB — ready</div>
            <audio
              controls
              src={audioSrc}
              style={{ width: "100%", marginTop: "16px", accentColor: "var(--acc)", filter: "invert(1) hue-rotate(180deg)" }}
            />
          </div>
        ) : (
          <div className="drop-inner">
            <div className="drop-mirage">
              {[{ d: "0s", op: 0.7, t: "0" }, { d: ".4s", op: 0.42, t: "8px" }, { d: ".8s", op: 0.25, t: "16px" }, { d: "1.2s", op: 0.14, t: "24px" }, { d: "1.6s", op: 0.06, t: "32px" }].map((l, i) => (
                <div key={i} className="dm-line" style={{ "--delay": l.d, opacity: l.op, top: l.t }} />
              ))}
            </div>
            <div className="drop-title">{fileName ? fileName : "Submit for analysis"}</div>
            <div className="drop-sub">
              {fileSize ? `${fileSize} MB — ready` : "Drag & drop your file here,\nor select from your device."}
            </div>
            <div className="drop-fmts">{cfg.fmts.map((f) => <span key={f} className="dfmt">{f}</span>)}</div>
            <button className="drop-cta" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
              <span>Browse Files</span>
            </button>
          </div>
        )}
      </div>
      <input type="file" ref={fileRef} onChange={handlePick} style={{ display: "none" }} />
    </>
  );
}
