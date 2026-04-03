export default function MetricBar({ name, color, value, label }) {
  return (
    <div className="metric">
      <div className="metric-row">
        <span className="metric-name">{name}</span>
        <span className="metric-val">{label}</span>
      </div>
      <div className="track">
        <div className="fill" style={{ width: `${value}%`, background: color }}>
          <div className="fill-dot" style={{ background: color }} />
        </div>
      </div>
    </div>
  );
}
