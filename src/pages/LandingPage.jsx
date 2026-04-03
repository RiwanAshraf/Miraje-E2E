import StarCanvas from "../components/ui/StarCanvas";

export default function LandingPage() {
  return (
    <div className="hero">
      <div className="sky"><StarCanvas /></div>
      <div className="ground" />
      <div className="horizon-glow" />
      <div className="horizon-line" />
      <div className="figure" />

      <div className="pool">
        {[{ d: "3.2s", delay: "0s", op: 0.5, b: "2px" }, { d: "4.1s", delay: ".5s", op: 0.32, b: "7px" }, { d: "3.7s", delay: "1s", op: 0.2, b: "12px" }, { d: "5s", delay: "1.7s", op: 0.1, b: "17px" }].map((p, i) => (
          <div key={i} className="pool-wave" style={{ "--d": p.d, "--delay": p.delay, "--op": p.op, bottom: p.b }} />
        ))}
      </div>
      <div className="heat">
        {[{ d: "3.5s", dl: "0s", op: 0.11, b: "2px" }, { d: "4.2s", dl: ".4s", op: 0.08, b: "12px" }, { d: "3.9s", dl: ".9s", op: 0.07, b: "22px" }, { d: "5.1s", dl: "1.5s", op: 0.05, b: "35px" }, { d: "4.6s", dl: "2.1s", op: 0.03, b: "52px" }].map((h, i) => (
          <div key={i} className="heat-wave" style={{ "--d": h.d, "--delay": h.dl, "--op": h.op, bottom: h.b }} />
        ))}
      </div>
      <div className="reflection">
        {[{ d: "4s", dl: "0s", op: 0.15, b: "2px" }, { d: "5.5s", dl: ".7s", op: 0.1, b: "9px" }, { d: "4.8s", dl: "1.4s", op: 0.06, b: "18px" }, { d: "6s", dl: "2s", op: 0.03, b: "28px" }].map((r, i) => (
          <div key={i} className="ref-band" style={{ "--d": r.d, "--delay": r.dl, "--op": r.op, bottom: r.b }} />
        ))}
      </div>

      <div className="scene-label sl-tl">Optical Illusion</div>
      <div className="scene-label sl-tr">Light · Bending</div>
      <div className="scene-label sl-horizon">— horizon —</div>
      <div className="scene-label sl-br">Desert · Mirage · 28.4°N</div>
      <div className="hero-fade" />

      <div className="hero-text">
        <div className="hero-headline">
          <h1 className="hero-title">
            Nothing<br />is what<br />
            <em data-text="it appears.">it appears.</em>
          </h1>
          <p className="hero-desc">
            Like a mirage on the horizon — synthetic media deceives the eye. Miraje sees through
            the distortion, revealing what is real and what was constructed.
          </p>
          <div className="hero-quote">
            <div className="hq-mark">"</div>
            <div className="hq-text">
              A mirage is not a lie. It is light, bending. Deepfakes are the same — truth,
              refracted through a machine.
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="sh-text">Scroll</div>
        <div className="sh-line" />
      </div>
    </div>
  );
}
