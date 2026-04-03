export default function HistoryTable({ history }) {
  return (
    <div style={{ animation: "fadeUp .7s cubic-bezier(.22,1,.36,1) .4s both" }}>
      <div className="sec-head" style={{ marginBottom: 18 }}>Recent Cases</div>
      <div className="table-wrap">
        <div className="t-head">
          <div>File</div><div>Type</div><div>Verdict</div><div>Score</div><div>Timestamp</div>
        </div>
        {history.length === 0 ? (
          <div style={{ padding: "20px", color: "var(--fog)", textAlign: "center" }}>No cases analysed yet</div>
        ) : (
          history.map((r, i) => (
            <div key={i} className="t-row">
              <div className="t-file">
                <div className="t-glyph">{r.glyph}</div>
                <div>
                  <div className="t-fname">{r.name}</div>
                  <div className="t-fsize">{r.size}</div>
                </div>
              </div>
              <div className="t-type">{r.type}</div>
              <div><span className={`rc-verdict ${r.cls}`}>{r.lbl}</span></div>
              <div className="t-conf" style={{ color: r.confClr }}>{r.conf}</div>
              <div className="t-date">{r.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
