import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let W, H, raf;
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random() * 0.58,
      r: Math.random() * 1.2 + 0.2,
      op: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 3 + 2,
      phase: Math.random() * Math.PI * 2,
    }));
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() / 1000;
      stars.forEach((s) => {
        const o = s.op * (0.6 + 0.4 * Math.sin(t / s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238,240,245,${o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}
