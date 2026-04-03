export default function PipelinePanel({ steps }) {
  return (
    <div className="panel">
      <div className="panel-head"><div className="panel-label">Pipeline</div></div>
      <div className="pipe-body">
        {steps.map((s, i) => (
          <div key={i} className={`pipe-step${s.state === "done" ? " done" : s.state === "running" ? " running" : ""}`}>
            <div className={`pipe-mark${s.state === "done" ? " done" : s.state === "running" ? " active" : ""}`}>
              {s.state === "done" ? "✓" : `0${i + 1}`}
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
