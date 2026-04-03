import { useEffect, useRef } from "react";

export default function Cursor() {
  const curRef  = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (curRef.current) { curRef.current.style.left = (mx - 3) + "px"; curRef.current.style.top = (my - 3) + "px"; }
    };
    document.addEventListener("mousemove", onMove);
    function loop() {
      rx += (mx - rx - 12) * 0.1; ry += (my - ry - 12) * 0.1;
      if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(loop);
    }
    loop();
    const hoverEls = () => document.querySelectorAll("button,.mode-tile,.drop-zone,.stat,.result-card,.t-row");
    const addHov = () =>
      hoverEls().forEach((el) => {
        el.addEventListener("mouseenter", () => { curRef.current?.classList.add("hov"); ringRef.current?.classList.add("hov"); });
        el.addEventListener("mouseleave", () => { curRef.current?.classList.remove("hov"); ringRef.current?.classList.remove("hov"); });
      });
    setTimeout(addHov, 500);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={curRef}  className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
