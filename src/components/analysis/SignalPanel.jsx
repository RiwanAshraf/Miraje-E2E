import MetricBar from "../ui/MetricBar";
import VerdictRing from "../ui/VerdictRing";

export default function SignalPanel({ metrics, verdict, analysing, fileLoaded, onRun, pipelineVisible, pipelineSteps, PipelinePanelComp }) {
  return (
    <div className="sidebar">
      {/* Verdict panel */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-label">Verdict</div>
          <div className="panel-status">
            <div className="pulse-dot" style={{ width: 4, height: 4 }} />
            <span>{analysing ? "Processing" : "Idle"}</span>
          </div>
        </div>
        <div className="verdict-body">
          <VerdictRing score={verdict.score} color={verdict.color} glow={verdict.glow} />
          <div className="verdict-word" style={{ color: verdict.color || "var(--pale)" }}>{verdict.word}</div>
          <div className="verdict-note">{verdict.note}</div>
        </div>
      </div>

      {/* Pipeline panel */}
      {pipelineVisible && PipelinePanelComp}

      {/* Signal analysis metrics */}
      <div className="panel">
        <div className="panel-head"><div className="panel-label">Signal Analysis</div></div>
        <div className="metrics-body">
          {metrics.map((m, i) => (
            <MetricBar key={i} name={m.n} color={m.c} value={m.value || 0} label={m.label || "—"} />
          ))}
        </div>
      </div>

      {/* Run button */}
      <button className="run-btn" disabled={!fileLoaded || analysing} onClick={onRun}>
        <span>{!fileLoaded ? "No File Selected" : analysing ? "Analysing…" : "Initiate Analysis"}</span>
      </button>
    </div>
  );
}
