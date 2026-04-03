export default function VerdictRing({ score, color, glow }) {
  const offset = score != null ? 298 - (score / 100) * 298 : 298;
  return (
    <div className="vring">
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
        <circle className="vr-bg"    cx="55" cy="55" r="47" />
        <circle className="vr-track" cx="55" cy="55" r="47" />
        <circle className="vr-fill"  cx="55" cy="55" r="47"
          style={{ strokeDashoffset: offset, stroke: color || "var(--rim2)", filter: glow ? `drop-shadow(0 0 7px ${glow})` : "none" }} />
        <circle className="vr-spin"  cx="55" cy="55" r="52" />
      </svg>
      <div className="vring-center">
        <div className="vr-pct" style={{ color: color || "var(--ghost)", textShadow: glow ? `0 0 18px ${glow}` : "none" }}>
          {score != null ? `${score.toFixed(0)}%` : "—"}
        </div>
        <div className="vr-sub">Synthetic</div>
      </div>
    </div>
  );
}
