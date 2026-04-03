export default function ResultCard({ code, name, desc, score, mode, visible }) {
  const fake = score > 68;
  const unc  = score >= 45 && score <= 68;
  const cls  = fake ? "v-fake" : unc ? "v-unc" : "v-real";
  const lbl  = fake ? (mode === "signature" ? "Forged" : "Synthetic") : unc ? "Inconclusive" : "Authentic";
  const clr  = fake ? "var(--danger2)" : unc ? "var(--warn2)" : "var(--safe2)";
  const g    = fake ? "rgba(192,80,74,.28)" : unc ? "rgba(176,128,64,.28)" : "rgba(74,158,130,.28)";
  return (
    <div className="result-card">
      <div className="rc-code">
        <span>{code}</span>
        <span className={`rc-verdict ${cls}`}>{lbl}</span>
      </div>
      <div className="rc-name">{name}</div>
      <div
        className="rc-score"
        style={{
          color: clr,
          textShadow: `0 0 18px ${g}`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity .6s ease,transform .6s ease",
        }}
      >
        {score.toFixed(1)}<span style={{ fontSize: 18, color: "var(--fog)", textShadow: "none" }}>%</span>
      </div>
      <div className="rc-desc">{desc}</div>
    </div>
  );
}
