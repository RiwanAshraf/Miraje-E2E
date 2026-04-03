<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Miraje — Where Reality Dissolves</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --void:   #04050a;
  --ink:    #080a10;
  --layer:  #0e1018;
  --lift:   #141720;
  --rim:    #1e2230;
  --rim2:   #272c3e;
  --fog:    #353c52;
  --ghost:  #505870;
  --pale:   #8892aa;
  --silver: #c8cedc;
  --paper:  #eef0f5;
  --acc:    #d4c9b0;
  --acc2:   #e8e0cc;
  --danger2:#d96b63;
  --safe2:  #5fbf9e;
  --warn2:  #c89a50;
}

html { scroll-behavior:smooth; }
body {
  background:var(--void);
  color:var(--silver);
  font-family:'Outfit',sans-serif;
  font-weight:300;
  overflow-x:hidden;
  cursor:none;
}

/* ── CURSOR ── */
.cursor {
  position:fixed; width:5px; height:5px;
  background:var(--acc); border-radius:50%;
  pointer-events:none; z-index:9999; mix-blend-mode:screen;
  box-shadow:0 0 8px var(--acc);
  transition:width .18s, height .18s;
}
.cursor-ring {
  position:fixed; width:24px; height:24px;
  border:1px solid rgba(212,201,176,0.28); border-radius:50%;
  pointer-events:none; z-index:9998;
  transition:all .16s ease;
}
.cursor.hov { width:10px; height:10px; }
.cursor-ring.hov { width:42px; height:42px; border-color:rgba(212,201,176,0.5); }

/* ── GRAIN ── */
body::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:900;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity:.35;
}

/* ── HEADER — STATIC, solid, does not scroll with page ── */
header {
  position:static;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 52px; height:64px;
  background:var(--ink);
  border-bottom:1px solid var(--rim);
  animation:headerIn .8s cubic-bezier(.22,1,.36,1) both;
  z-index:200;
}

@keyframes headerIn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }

.brand { display:flex; align-items:baseline; gap:14px; }
.brand-wordmark {
  font-family:'Cormorant Garamond',serif;
  font-size:24px; font-weight:300; letter-spacing:10px; text-transform:uppercase; color:var(--paper);
  position:relative;
}
.brand-wordmark::after {
  content:'MIRAJE'; position:absolute; left:0; top:0; letter-spacing:10px;
  color:var(--acc); opacity:0; filter:blur(8px);
  animation:mirageEcho 9s ease-in-out infinite;
}
@keyframes mirageEcho {
  0%,100%{opacity:0;transform:translateY(0);filter:blur(8px)}
  50%{opacity:0.2;transform:translateY(2px);filter:blur(4px)}
}
.brand-divider { width:1px; height:16px; background:rgba(39,44,62,0.7); }
.brand-tagline { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:3px; color:var(--ghost); text-transform:uppercase; }

nav { display:flex; align-items:center; gap:2px; }
.nav-btn {
  background:none; border:none; font-family:'Outfit',sans-serif;
  font-weight:300; font-size:13px; color:rgba(200,206,220,0.7);
  padding:8px 16px; cursor:none; transition:color .2s; letter-spacing:.5px; position:relative;
}
.nav-btn::after {
  content:''; position:absolute; bottom:3px; left:16px; right:16px;
  height:1px; background:var(--acc); transform:scaleX(0); transform-origin:left;
  transition:transform .32s cubic-bezier(.22,1,.36,1);
}
.nav-btn:hover { color:var(--silver); }
.nav-btn:hover::after, .nav-btn.active::after { transform:scaleX(1); }
.nav-btn.active { color:var(--acc); }

.sys-status {
  display:flex; align-items:center; gap:8px;
  font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--ghost); letter-spacing:1.5px; text-transform:uppercase;
}
.pulse-dot {
  width:5px; height:5px; border-radius:50%;
  background:var(--safe2); box-shadow:0 0 6px var(--safe2);
  animation:pulse 3s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ═══════════════════════════════════════════
   HERO — calc height minus the static header
═══════════════════════════════════════════ */
.hero {
  position:relative;
  width:100%; height:calc(100vh - 64px); min-height:600px;
  overflow:hidden;
}

/* The desert sky — entire background */
.sky {
  position:absolute; inset:0; z-index:0;
  background:linear-gradient(
    to bottom,
    #03040a 0%,
    #070810 20%,
    #0e0d18 42%,
    #16130e 62%,
    #1c1608 78%,
    #1e170a 100%
  );
}

/* Stars canvas — fills sky */
#starCanvas {
  position:absolute; inset:0; z-index:1; pointer-events:none;
}

/* Desert ground plane */
.ground {
  position:absolute; bottom:0; left:0; right:0; z-index:2;
  height:28%;
  background:linear-gradient(to bottom, #1c1508 0%, #120f07 50%, #0c0b06 100%);
}
/* Perspective grid on ground — depth illusion */
.ground::after {
  content:''; position:absolute; inset:0;
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent calc(10% - 1px),
      rgba(212,195,150,0.03) calc(10% - 1px),
      rgba(212,195,150,0.03) 10%
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent calc(20% - 1px),
      rgba(212,195,150,0.02) calc(20% - 1px),
      rgba(212,195,150,0.02) 20%
    );
  mask-image:linear-gradient(to top, rgba(0,0,0,.8), transparent);
  -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,.8), transparent);
}

/* Horizon glow */
.horizon-glow {
  position:absolute; z-index:3; left:0; right:0;
  bottom:28%; height:60px;
  background:linear-gradient(to top,
    transparent 0%,
    rgba(180,140,70,0.05) 30%,
    rgba(210,165,90,0.16) 55%,
    rgba(225,180,100,0.22) 72%,
    rgba(210,165,90,0.1) 85%,
    transparent 100%
  );
  filter:blur(6px);
  animation:hglow 7s ease-in-out infinite alternate;
}
@keyframes hglow { from{opacity:.7;transform:scaleX(1)} to{opacity:1;transform:scaleX(1.06)} }

/* The horizon line — clipped to only appear in the left 55% of the viewport
   so it stays in the open sky area and never crosses over the hero text on the right */
.horizon-line {
  position:absolute; z-index:4; left:0; width:55%; bottom:28%; height:1px;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(210,180,110,0.15) 5%,
    rgba(235,205,145,0.55) 25%,
    rgba(248,220,165,0.9)  50%,
    rgba(235,205,145,0.45) 75%,
    rgba(210,180,110,0.05) 90%,
    transparent 100%
  );
  animation:hline 8s ease-in-out infinite;
}
@keyframes hline { 0%,100%{opacity:.75} 50%{opacity:1} }

/* The lone figure on the horizon */
.figure {
  position:absolute; z-index:5;
  bottom:calc(28% + 1px); left:62%;
  width:2px; height:18px;
  background:linear-gradient(to top, rgba(220,195,150,0.5), transparent);
  filter:blur(.4px);
}
.figure::before {
  content:''; position:absolute; top:-5px; left:-3px;
  width:8px; height:8px; border-radius:50%;
  background:rgba(210,185,148,0.42); filter:blur(.8px);
}

/* The mirage water pool — shimmering false reflection */
.pool {
  position:absolute; z-index:4;
  bottom:28%; left:8%; right:55%; height:20px;
  overflow:hidden;
}
.pool-wave {
  position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, rgba(225,200,145,0.4), rgba(245,220,165,0.6), rgba(225,200,145,0.4), transparent);
  animation:pwave var(--d,3s) ease-in-out infinite var(--delay,0s);
}
@keyframes pwave {
  0%,100%{transform:translateX(0) scaleX(1); opacity:var(--op,.4)}
  40%    {transform:translateX(4px) scaleX(.96); opacity:calc(var(--op,.4)*.45)}
  70%    {transform:translateX(-3px) scaleX(1.03); opacity:var(--op,.4)}
}

/* Heat waves — the illusion rising off the ground */
.heat {
  position:absolute; z-index:4;
  bottom:28%; left:0; right:0; height:90px;
  overflow:hidden; pointer-events:none;
}
.heat-wave {
  position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent 5%,rgba(215,188,130,var(--op,.06)) 35%,rgba(235,208,150,calc(var(--op,.06)*1.6)) 50%,rgba(215,188,130,var(--op,.06)) 65%,transparent 95%);
  animation:hwave var(--d,4s) ease-in-out infinite var(--delay,0s);
}
@keyframes hwave {
  0%  {transform:translateY(0) scaleX(1); opacity:1}
  65% {transform:translateY(-70px) scaleX(1.05); opacity:.2}
  100%{transform:translateY(-95px); opacity:0}
}

/* Reflection bands below horizon */
.reflection {
  position:absolute; z-index:3;
  bottom:18%; left:5%; right:5%; height:10%;
  overflow:hidden;
}
.ref-band {
  position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,rgba(205,178,122,var(--op,.08)),transparent);
  animation:rband var(--d,5s) ease-in-out infinite var(--delay,0s);
}
@keyframes rband {
  0%,100%{transform:scaleX(1) translateX(0); opacity:1}
  50%    {transform:scaleX(.95) translateX(3px); opacity:.35}
}

/* Floating labels on the scene */
.scene-label {
  position:absolute; z-index:6;
  font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2.5px;
  color:rgba(212,201,176,0.3); text-transform:uppercase; pointer-events:none;
}
.sl-tl { top:24px; left:52px; }
.sl-tr { top:24px; right:52px; text-align:right; }
.sl-horizon {
  bottom:calc(28% - 12px); left:25%; transform:translateX(-50%);
  white-space:nowrap; color:rgba(235,210,160,0.38); font-size:7px; letter-spacing:4px;
}
.sl-br { bottom:20px; right:52px; }

/* Gradient fade at the very bottom — seamlessly blends into page content */
.hero-fade {
  position:absolute; bottom:0; left:0; right:0; z-index:7;
  height:40%;
  background:linear-gradient(to top,
    var(--void) 0%,
    rgba(4,5,10,0.97) 20%,
    rgba(4,5,10,0.88) 38%,
    rgba(4,5,10,0.6)  58%,
    rgba(4,5,10,0.2)  78%,
    transparent 100%
  );
}

/* Hero text — absolutely anchored to bottom, never clips top */
.hero-text {
  position:absolute; z-index:8;
  top:38%; left:0; right:0;
  transform:translateY(-50%);
  padding:0 72px;
  display:grid; grid-template-columns:1fr 420px; gap:64px; align-items:center;
  max-width:none;
}

.hero-headline { animation:fadeUp .9s cubic-bezier(.22,1,.36,1) .3s both; }
.hero-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(44px,4.6vw,78px); font-weight:400;
  line-height:.95; letter-spacing:-2px; color:var(--paper); margin-bottom:24px;
}
.hero-title em {
  display:block; font-style:italic; color:var(--acc); letter-spacing:-1.5px; position:relative;
}
.hero-title em::after {
  content:attr(data-text); position:absolute; left:0; top:0;
  font-style:italic; color:var(--acc); opacity:0; filter:blur(14px);
  animation:titleMirage 11s ease-in-out infinite;
}
@keyframes titleMirage {
  0%,100%{opacity:0;transform:translateY(0)} 48%,52%{opacity:.14;transform:translateY(4px) scaleX(1.01)}
}
.hero-desc {
  font-size:15px; color:var(--pale); line-height:1.85; max-width:520px; font-weight:300; margin-bottom:30px;
}
.hero-quote {
  display:flex; gap:14px; align-items:flex-start;
  padding:18px 22px; border-left:1px solid var(--rim2);
  background:linear-gradient(90deg,rgba(212,201,176,0.04),transparent);
}
.hq-mark {
  font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300;
  color:var(--acc); opacity:.35; line-height:1; flex-shrink:0; margin-top:-3px;
}
.hq-text {
  font-family:'Cormorant Garamond',serif; font-size:15px; font-style:italic;
  font-weight:300; color:var(--pale); line-height:1.7;
}

.hero-stats { animation:fadeUp 1s cubic-bezier(.22,1,.36,1) .4s both; }
.stats-block { border:1px solid var(--rim); border-radius:8px; overflow:hidden; }
.stats-row { display:flex; border-bottom:1px solid var(--rim); }
.stats-row:last-child { border-bottom:none; }
.stat {
  flex:1; padding:20px 18px; border-right:1px solid var(--rim);
  position:relative; overflow:hidden; transition:background .3s;
}
.stat:last-child { border-right:none; }
.stat::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
  background:var(--acc); transform:scaleX(0); transform-origin:left;
  transition:transform .4s cubic-bezier(.22,1,.36,1);
}
.stat:hover { background:rgba(212,201,176,0.04); }
.stat:hover::after { transform:scaleX(1); }
.stat-value {
  font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300;
  color:var(--acc); line-height:1; margin-bottom:4px;
}
.stat-label {
  font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2px;
  color:var(--ghost); text-transform:uppercase;
}

/* Scroll indicator */
.scroll-hint {
  position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
  z-index:9; display:flex; flex-direction:column; align-items:center; gap:5px;
  opacity:.3; animation:shint 2.8s ease-in-out infinite;
  pointer-events:none;
}
@keyframes shint { 0%,100%{transform:translateX(-50%) translateY(0)} 55%{transform:translateX(-50%) translateY(7px)} }
.sh-text { font-family:'JetBrains Mono',monospace; font-size:7px; letter-spacing:3px; color:var(--acc); text-transform:uppercase; }
.sh-line { width:1px; height:26px; background:linear-gradient(to bottom,transparent,var(--acc)); }

/* ═══════════════════════════════════════════
   PAGE CONTENT — below the hero
═══════════════════════════════════════════ */
.page { max-width:1300px; margin:0 auto; padding:72px 52px 100px; position:relative; z-index:1; }

/* ── SECTION LABEL ── */
.sec-head {
  font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:3px;
  color:var(--ghost); text-transform:uppercase; margin-bottom:14px;
  display:flex; align-items:center; gap:14px;
}
.sec-head::after { content:''; flex:1; height:1px; background:var(--rim); }

/* ── MODES ── */
.modes {
  display:grid; grid-template-columns:repeat(4,1fr);
  margin-bottom:44px; border:1px solid var(--rim); border-radius:8px;
  overflow:hidden; background:var(--rim); gap:1px;
}
.mode-tile {
  background:var(--ink); padding:22px 18px; cursor:none;
  transition:background .3s; position:relative; overflow:hidden;
}
.mode-tile::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(to bottom,transparent 60%,rgba(212,201,176,0.04) 100%);
  opacity:0; transition:opacity .4s;
}
.mode-tile::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,var(--acc),transparent);
  transform:scaleX(0); transform-origin:left;
  transition:transform .45s cubic-bezier(.22,1,.36,1);
}
.mode-tile:hover { background:rgba(212,201,176,0.025); }
.mode-tile:hover::before { opacity:1; }
.mode-tile:hover::after  { transform:scaleX(1); }
.mode-tile.active { background:rgba(212,201,176,0.038); }
.mode-tile.active::after { transform:scaleX(1); }
.mode-code { font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--acc); letter-spacing:2.5px; margin-bottom:14px; opacity:.55; text-transform:uppercase; }
.mode-name { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:300; color:var(--paper); margin-bottom:6px; }
.mode-desc { font-size:12px; color:var(--ghost); line-height:1.6; font-weight:300; }
.mode-flag { position:absolute; top:14px; right:14px; font-family:'JetBrains Mono',monospace; font-size:7px; letter-spacing:2px; padding:2px 8px; text-transform:uppercase; border:1px solid; }
.flag-live { color:var(--safe2); border-color:rgba(95,191,158,.3); background:rgba(74,158,130,.05); }
.flag-beta { color:var(--warn2); border-color:rgba(200,154,80,.3);  background:rgba(176,128,64,.05); }

/* ── WORKSPACE ── */
.workspace { display:grid; grid-template-columns:1fr 348px; gap:18px; margin-bottom:44px; }

/* ── DROP ZONE ── */
.drop-zone {
  background:var(--ink); border:1px solid var(--rim); border-radius:8px;
  min-height:360px; display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  cursor:none; position:relative; overflow:hidden; transition:border-color .35s;
}
.drop-zone:hover    { border-color:rgba(212,201,176,0.22); }
.drop-zone.drag-over{ border-color:var(--acc); }

.scan-beam {
  position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent 0%,rgba(212,201,176,0.55) 35%,rgba(232,224,204,0.85) 50%,rgba(212,201,176,0.55) 65%,transparent 100%);
  display:none; pointer-events:none; box-shadow:0 0 12px rgba(212,201,176,.3);
}
.scan-beam.on { display:block; animation:beamSweep 2.8s linear infinite; }
@keyframes beamSweep { 0%{top:0%;opacity:0} 6%{opacity:1} 94%{opacity:1} 100%{top:100%;opacity:0} }

.dc { position:absolute; width:16px; height:16px; border-color:var(--acc); border-style:solid; opacity:.2; transition:opacity .3s, width .4s cubic-bezier(.22,1,.36,1), height .4s cubic-bezier(.22,1,.36,1); }
.dc.tl{top:14px;left:14px;border-width:1px 0 0 1px}
.dc.tr{top:14px;right:14px;border-width:1px 1px 0 0}
.dc.bl{bottom:14px;left:14px;border-width:0 0 1px 1px}
.dc.br{bottom:14px;right:14px;border-width:0 1px 1px 0}
.drop-zone:hover .dc { opacity:.7; width:24px; height:24px; }

.drop-inner { text-align:center; padding:40px; }
.drop-mirage {
  width:72px; height:36px; margin:0 auto 28px; position:relative;
}
.dm-line {
  position:absolute; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,var(--acc),transparent);
  animation:wobble 3.2s ease-in-out infinite var(--delay,0s);
}
@keyframes wobble {
  0%,100%{transform:scaleX(1) translateX(0)} 40%{transform:scaleX(.95) translateX(2px)} 70%{transform:scaleX(1.04) translateX(-1px)}
}
.drop-title { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:300; color:var(--pale); margin-bottom:7px; letter-spacing:.5px; }
.drop-sub   { font-size:13px; color:var(--ghost); line-height:1.75; margin-bottom:22px; font-weight:300; }
.drop-fmts  { display:flex; gap:5px; flex-wrap:wrap; justify-content:center; }
.dfmt { font-family:'JetBrains Mono',monospace; font-size:8px; padding:3px 9px; border:1px solid var(--rim2); color:var(--fog); letter-spacing:1.5px; text-transform:uppercase; }
.drop-cta {
  margin-top:22px; background:none; border:1px solid var(--rim2); color:var(--pale);
  font-family:'Outfit',sans-serif; font-size:11px; font-weight:400; padding:10px 26px;
  cursor:none; letter-spacing:2.5px; text-transform:uppercase;
  transition:all .3s; position:relative; overflow:hidden;
}
.drop-cta::before { content:''; position:absolute; inset:0; background:var(--acc); transform:translateX(-100%); transition:transform .4s cubic-bezier(.22,1,.36,1); }
.drop-cta span { position:relative; z-index:1; }
.drop-cta:hover { color:var(--void); border-color:var(--acc); }
.drop-cta:hover::before { transform:translateX(0); }
.preview-img { width:100%; height:100%; object-fit:cover; border-radius:7px; display:none; }

/* ── SIDEBAR ── */
.sidebar { display:flex; flex-direction:column; gap:14px; }
.panel { background:var(--ink); border:1px solid var(--rim); border-radius:8px; overflow:hidden; }
.panel-head { padding:13px 18px; border-bottom:1px solid var(--rim); display:flex; align-items:center; justify-content:space-between; }
.panel-label { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2.5px; color:var(--ghost); text-transform:uppercase; }
.panel-status { display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:8px; color:var(--ghost); letter-spacing:1px; }

/* Verdict ring */
.verdict-body { padding:24px 18px; text-align:center; }
.vring { position:relative; width:110px; height:110px; margin:0 auto 18px; }
.vring svg { transform:rotate(-90deg); }
.vr-bg    { fill:none; stroke:var(--lift); stroke-width:6; }
.vr-track { fill:none; stroke:var(--rim);  stroke-width:6; stroke-dasharray:298; }
.vr-fill  { fill:none; stroke-width:6; stroke-linecap:butt; stroke-dasharray:298; stroke-dashoffset:298; transition:stroke-dashoffset 2.3s cubic-bezier(.22,1,.36,1),stroke .5s; filter:drop-shadow(0 0 5px currentColor); }
.vr-spin  { fill:none; stroke:rgba(212,201,176,0.08); stroke-width:1; stroke-dasharray:4 14; animation:vspin 10s linear infinite; }
@keyframes vspin { from{transform-origin:55px 55px;transform:rotate(0deg)} to{transform:rotate(360deg)} }
.vring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.vr-pct  { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; line-height:1; color:var(--ghost); transition:color .5s, text-shadow .5s; }
.vr-sub  { font-family:'JetBrains Mono',monospace; font-size:7px; letter-spacing:1.5px; color:var(--fog); text-transform:uppercase; margin-top:3px; }
.verdict-word { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:300; letter-spacing:1px; color:var(--pale); margin-bottom:5px; transition:color .5s; }
.verdict-note { font-size:11px; color:var(--ghost); font-weight:300; line-height:1.6; }

/* Metrics */
.metrics-body { padding:18px; display:flex; flex-direction:column; gap:14px; }
.metric { display:flex; flex-direction:column; gap:5px; }
.metric-row { display:flex; justify-content:space-between; align-items:center; }
.metric-name { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:1.5px; color:var(--ghost); text-transform:uppercase; }
.metric-val  { font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--pale); }
.track { height:1px; background:var(--rim2); position:relative; }
.fill  { position:absolute; top:0; left:0; height:100%; transition:width 2.2s cubic-bezier(.22,1,.36,1); }
.fill-dot { position:absolute; right:-2px; top:-2px; width:4px; height:4px; border-radius:50%; background:inherit; box-shadow:0 0 5px currentColor; }

/* Pipeline */
.pipe-body { padding:18px; display:none; flex-direction:column; gap:9px; }
.pipe-body.on { display:flex; }
.pipe-step { display:flex; align-items:center; gap:10px; font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--ghost); transition:color .3s; }
.pipe-step.done    { color:var(--pale); }
.pipe-step.running { color:var(--acc); }
.pipe-mark { width:14px; height:14px; border:1px solid var(--rim2); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:7px; transition:all .3s; }
.pipe-mark.done   { background:var(--acc); border-color:var(--acc); color:var(--void); }
.pipe-mark.active { border-color:var(--acc); color:var(--acc); animation:mPulse .9s ease-in-out infinite; }
@keyframes mPulse { 0%,100%{box-shadow:0 0 3px rgba(212,201,176,.3)} 50%{box-shadow:0 0 10px rgba(212,201,176,.6)} }

/* Run button */
.run-btn {
  background:var(--layer); border:1px solid var(--rim2); color:var(--pale);
  padding:15px; width:100%; font-family:'Outfit',sans-serif; font-size:11px;
  font-weight:500; letter-spacing:3px; text-transform:uppercase; cursor:none;
  transition:all .35s; position:relative; overflow:hidden;
}
.run-btn::before { content:''; position:absolute; inset:0; background:var(--acc); transform:translateY(100%); transition:transform .45s cubic-bezier(.22,1,.36,1); }
.run-btn span { position:relative; z-index:1; transition:color .35s; }
.run-btn:not(:disabled):hover { border-color:var(--acc); }
.run-btn:not(:disabled):hover::before { transform:translateY(0); }
.run-btn:not(:disabled):hover span { color:var(--void); }
.run-btn:disabled { opacity:.25; }

/* Results */
#resultsSection { display:none; margin-bottom:44px; }
.results-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--rim); border:1px solid var(--rim); border-radius:8px; overflow:hidden; }
.result-card { background:var(--ink); padding:26px 22px; transition:background .25s; position:relative; overflow:hidden; }
.result-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:transparent; transition:background .3s; }
.result-card:hover { background:var(--layer); }
.result-card:hover::before { background:var(--acc); }
.rc-code { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2px; color:var(--ghost); text-transform:uppercase; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; }
.rc-verdict { font-family:'JetBrains Mono',monospace; font-size:7px; letter-spacing:2px; padding:2px 8px; border:1px solid; text-transform:uppercase; }
.v-fake { color:var(--danger2); border-color:rgba(192,80,74,.4); background:rgba(192,80,74,.07); }
.v-real { color:var(--safe2);   border-color:rgba(74,158,130,.3); background:rgba(74,158,130,.06); }
.v-unc  { color:var(--warn2);   border-color:rgba(176,128,64,.3); background:rgba(176,128,64,.06); }
.rc-name  { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:300; color:var(--paper); margin-bottom:8px; }
.rc-score { font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:300; line-height:1; margin-bottom:8px; opacity:0; transform:translateY(8px); transition:opacity .6s ease, transform .6s ease; }
.rc-score.show { opacity:1; transform:translateY(0); }
.rc-desc  { font-size:11px; color:var(--ghost); line-height:1.7; font-weight:300; }

/* History */
.table-wrap { background:var(--ink); border:1px solid var(--rim); border-radius:8px; overflow:hidden; }
.t-head { display:grid; grid-template-columns:2.5fr 80px 110px 95px 120px; padding:12px 22px; border-bottom:1px solid var(--rim); font-family:'JetBrains Mono',monospace; font-size:7px; letter-spacing:2px; color:var(--fog); text-transform:uppercase; }
.t-row  { display:grid; grid-template-columns:2.5fr 80px 110px 95px 120px; padding:14px 22px; border-bottom:1px solid var(--rim); align-items:center; transition:background .2s; position:relative; overflow:hidden; }
.t-row::after { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--acc); transform:scaleY(0); transition:transform .28s cubic-bezier(.22,1,.36,1); }
.t-row:last-child { border-bottom:none; }
.t-row:hover { background:var(--layer); }
.t-row:hover::after { transform:scaleY(1); }
.t-file  { display:flex; align-items:center; gap:10px; }
.t-glyph { font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--acc); opacity:.35; width:18px; text-align:center; }
.t-fname { font-size:12px; color:var(--silver); font-weight:400; margin-bottom:1px; }
.t-fsize { font-family:'JetBrains Mono',monospace; font-size:8px; color:var(--ghost); }
.t-type  { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:1.5px; color:var(--fog); text-transform:uppercase; }
.t-conf  { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:300; }
.t-date  { font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--ghost); }

@keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

input[type="file"] { display:none; }

@media (max-width:1024px) {
  header { padding:0 24px; }
  .hero-text { grid-template-columns:1fr; gap:32px; padding:0 28px; top:55%; }
  .scene-label { display:none; }
  .modes { grid-template-columns:repeat(2,1fr); }
  .workspace { grid-template-columns:1fr; }
  .results-grid { grid-template-columns:1fr; }
  .page { padding:48px 24px 80px; }
  .t-head,.t-row { grid-template-columns:2fr 80px 1fr; }
  .t-head>*:nth-child(4),.t-head>*:nth-child(5),
  .t-row>*:nth-child(4),.t-row>*:nth-child(5) { display:none; }
}
</style>
</head>
<body>

<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>

<!-- HEADER — static, solid background, does not follow scroll -->
<header id="header">
  <div class="brand">
    <div class="brand-wordmark">MIRAJE</div>
    <div class="brand-divider"></div>
    <div class="brand-tagline">Where Reality Dissolves</div>
  </div>
  <nav>
    <button class="nav-btn active">Analysis</button>
    <button class="nav-btn">Archive</button>
    <button class="nav-btn">Reports</button>
    <button class="nav-btn">System</button>
  </nav>
  <div class="sys-status">
    <div class="pulse-dot"></div>
    <span>Systems Online</span>
  </div>
</header>

<!-- ═══ HERO — FULL VIEWPORT MINUS HEADER ═══ -->
<div class="hero">

  <!-- Desert sky background -->
  <div class="sky">
    <canvas id="starCanvas"></canvas>
  </div>

  <!-- Ground -->
  <div class="ground"></div>

  <!-- Mirage phenomena -->
  <div class="horizon-glow"></div>
  <div class="horizon-line"></div>
  <div class="figure"></div>

  <div class="pool">
    <div class="pool-wave" style="--d:3.2s;--delay:0s;  --op:.5;  bottom:2px"></div>
    <div class="pool-wave" style="--d:4.1s;--delay:.5s; --op:.32; bottom:7px"></div>
    <div class="pool-wave" style="--d:3.7s;--delay:1s;  --op:.2;  bottom:12px"></div>
    <div class="pool-wave" style="--d:5s;  --delay:1.7s;--op:.1;  bottom:17px"></div>
  </div>

  <div class="heat">
    <div class="heat-wave" style="--d:3.5s;--delay:0s;  --op:.11; bottom:2px"></div>
    <div class="heat-wave" style="--d:4.2s;--delay:.4s; --op:.08; bottom:12px"></div>
    <div class="heat-wave" style="--d:3.9s;--delay:.9s; --op:.07; bottom:22px"></div>
    <div class="heat-wave" style="--d:5.1s;--delay:1.5s;--op:.05; bottom:35px"></div>
    <div class="heat-wave" style="--d:4.6s;--delay:2.1s;--op:.03; bottom:52px"></div>
  </div>

  <div class="reflection">
    <div class="ref-band" style="--d:4s;  --delay:0s;  --op:.15; bottom:2px"></div>
    <div class="ref-band" style="--d:5.5s;--delay:.7s; --op:.1;  bottom:9px"></div>
    <div class="ref-band" style="--d:4.8s;--delay:1.4s;--op:.06; bottom:18px"></div>
    <div class="ref-band" style="--d:6s;  --delay:2s;  --op:.03; bottom:28px"></div>
  </div>

  <!-- Labels floating in scene -->
  <div class="scene-label sl-tl">Optical Illusion</div>
  <div class="scene-label sl-tr">Light · Bending</div>
  <div class="scene-label sl-horizon">— horizon —</div>
  <div class="scene-label sl-br">Desert · Mirage · 28.4°N</div>

  <!-- Fade at bottom blending into page -->
  <div class="hero-fade"></div>

  <!-- Headline + stats float over everything -->
  <div class="hero-text">
    <div class="hero-headline">
      <h1 class="hero-title">
        Nothing<br>is what<br>
        <em data-text="it appears.">it appears.</em>
      </h1>
      <p class="hero-desc">Like a mirage on the horizon — synthetic media deceives the eye. Miraje sees through the distortion, revealing what is real and what was constructed.</p>
      <div class="hero-quote">
        <div class="hq-mark">"</div>
        <div class="hq-text">A mirage is not a lie. It is light, bending. Deepfakes are the same — truth, refracted through a machine.</div>
      </div>
    </div>
    <div class="hero-stats">
      <div class="stats-block">
        <div class="stats-row">
          <div class="stat"><div class="stat-value">99.2%</div><div class="stat-label">Detection Accuracy</div></div>
          <div class="stat"><div class="stat-value">4</div><div class="stat-label">Modalities</div></div>
          <div class="stat"><div class="stat-value">&lt;3s</div><div class="stat-label">Avg. Inference</div></div>
        </div>
        <div class="stats-row">
          <div class="stat"><div class="stat-value">12</div><div class="stat-label">Neural Models</div></div>
          <div class="stat"><div class="stat-value">256-bit</div><div class="stat-label">Encryption</div></div>
          <div class="stat"><div class="stat-value">Zero</div><div class="stat-label">Data Retained</div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="scroll-hint">
    <div class="sh-text">Scroll</div>
    <div class="sh-line"></div>
  </div>

</div><!-- /.hero -->

<!-- ═══ PAGE CONTENT ═══ -->
<main>
<div class="page">

  <div class="sec-head" style="margin-bottom:14px">Detection Mode</div>
  <div class="modes" style="animation:fadeUp .8s cubic-bezier(.22,1,.36,1) both">
    <div class="mode-tile active" onclick="setMode(this,'image')">
      <div class="mode-flag flag-live">Live</div>
      <div class="mode-code">IMG //</div>
      <div class="mode-name">Image</div>
      <div class="mode-desc">AI-generated and manipulated photograph detection via GAN fingerprinting</div>
    </div>
    <div class="mode-tile" onclick="setMode(this,'video')">
      <div class="mode-flag flag-live">Live</div>
      <div class="mode-code">VID //</div>
      <div class="mode-name">Video</div>
      <div class="mode-desc">Frame-by-frame temporal coherence analysis for face swap and synthesis</div>
    </div>
    <div class="mode-tile" onclick="setMode(this,'audio')">
      <div class="mode-flag flag-beta">Beta</div>
      <div class="mode-code">AUD //</div>
      <div class="mode-name">Audio</div>
      <div class="mode-desc">Cloned voice and synthetic speech identification via spectral forensics</div>
    </div>
    <div class="mode-tile" onclick="setMode(this,'signature')">
      <div class="mode-flag flag-beta">Beta</div>
      <div class="mode-code">SIG //</div>
      <div class="mode-name">Signature</div>
      <div class="mode-desc">Handwritten signature forgery detection using stroke dynamics analysis</div>
    </div>
  </div>

  <div class="workspace">
    <div class="drop-zone" id="dropZone"
      ondragover="onDragOver(event)" ondragleave="onDragLeave(event)" ondrop="onDrop(event)"
      onclick="document.getElementById('fi').click()">
      <div class="dc tl"></div><div class="dc tr"></div><div class="dc bl"></div><div class="dc br"></div>
      <div class="scan-beam" id="scanBeam"></div>
      <img class="preview-img" id="previewImg" alt="">
      <div class="drop-inner" id="dropInner">
        <div class="drop-mirage">
          <div class="dm-line" style="--delay:0s;   opacity:.7; top:0"></div>
          <div class="dm-line" style="--delay:.4s;  opacity:.42; top:8px"></div>
          <div class="dm-line" style="--delay:.8s;  opacity:.25; top:16px"></div>
          <div class="dm-line" style="--delay:1.2s; opacity:.14; top:24px"></div>
          <div class="dm-line" style="--delay:1.6s; opacity:.06; top:32px"></div>
        </div>
        <div class="drop-title">Submit for analysis</div>
        <div class="drop-sub">Drag & drop your file here,<br>or select from your device.</div>
        <div class="drop-fmts" id="fmtList">
          <span class="dfmt">JPG</span><span class="dfmt">PNG</span><span class="dfmt">WEBP</span><span class="dfmt">GIF</span>
        </div>
        <button class="drop-cta" onclick="event.stopPropagation();document.getElementById('fi').click()"><span>Browse Files</span></button>
      </div>
    </div>
    <input type="file" id="fi" onchange="onFilePick(event)">

    <div class="sidebar">
      <div class="panel">
        <div class="panel-head">
          <div class="panel-label">Verdict</div>
          <div class="panel-status"><div class="pulse-dot" style="width:4px;height:4px"></div><span>Idle</span></div>
        </div>
        <div class="verdict-body">
          <div class="vring">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle class="vr-bg"    cx="55" cy="55" r="47"/>
              <circle class="vr-track" cx="55" cy="55" r="47"/>
              <circle class="vr-fill"  cx="55" cy="55" r="47" id="vrFill" stroke="var(--rim2)"/>
              <circle class="vr-spin"  cx="55" cy="55" r="52"/>
            </svg>
            <div class="vring-center">
              <div class="vr-pct" id="vrPct">—</div>
              <div class="vr-sub">Synthetic</div>
            </div>
          </div>
          <div class="verdict-word" id="vWord">Awaiting Input</div>
          <div class="verdict-note"  id="vNote">Submit a file to begin</div>
        </div>
      </div>

      <div class="panel" id="pipePanel" style="display:none">
        <div class="panel-head"><div class="panel-label">Pipeline</div></div>
        <div class="pipe-body on" id="pipeBody"></div>
      </div>

      <div class="panel">
        <div class="panel-head"><div class="panel-label">Signal Analysis</div></div>
        <div class="metrics-body" id="metricsBody"></div>
      </div>

      <button class="run-btn" id="runBtn" disabled onclick="runAnalysis()">
        <span id="runLabel">No File Selected</span>
      </button>
    </div>
  </div>

  <div id="resultsSection">
    <div class="sec-head" style="margin-bottom:18px">Subsystem Results</div>
    <div class="results-grid" id="resultsGrid"></div>
  </div>

  <div style="animation:fadeUp .7s cubic-bezier(.22,1,.36,1) .4s both">
    <div class="sec-head" style="margin-bottom:18px">Recent Cases</div>
    <div class="table-wrap">
      <div class="t-head"><div>File</div><div>Type</div><div>Verdict</div><div>Score</div><div>Timestamp</div></div>
      <div class="t-row">
        <div class="t-file"><div class="t-glyph">▣</div><div><div class="t-fname">portrait_edit.jpg</div><div class="t-fsize">2.4 MB</div></div></div>
        <div class="t-type">Image</div>
        <div><span class="rc-verdict v-fake">Synthetic</span></div>
        <div class="t-conf" style="color:var(--danger2)">94.2%</div>
        <div class="t-date">2026-03-06 · 14:22</div>
      </div>
      <div class="t-row">
        <div class="t-file"><div class="t-glyph">▶</div><div><div class="t-fname">interview_clip.mp4</div><div class="t-fsize">48.1 MB</div></div></div>
        <div class="t-type">Video</div>
        <div><span class="rc-verdict v-real">Authentic</span></div>
        <div class="t-conf" style="color:var(--safe2)">97.8%</div>
        <div class="t-date">2026-03-05 · 09:47</div>
      </div>
      <div class="t-row">
        <div class="t-file"><div class="t-glyph">♪</div><div><div class="t-fname">voicemail_03.wav</div><div class="t-fsize">1.2 MB</div></div></div>
        <div class="t-type">Audio</div>
        <div><span class="rc-verdict v-unc">Inconclusive</span></div>
        <div class="t-conf" style="color:var(--warn2)">61.5%</div>
        <div class="t-date">2026-03-05 · 08:11</div>
      </div>
      <div class="t-row">
        <div class="t-file"><div class="t-glyph">✦</div><div><div class="t-fname">contract_sig.png</div><div class="t-fsize">0.8 MB</div></div></div>
        <div class="t-type">Signature</div>
        <div><span class="rc-verdict v-fake">Forged</span></div>
        <div class="t-conf" style="color:var(--danger2)">88.7%</div>
        <div class="t-date">2026-03-04 · 16:55</div>
      </div>
    </div>
  </div>

</div>
</main>

<script>
/* ── STARS ── */
(function(){
  const c = document.getElementById('starCanvas');
  const ctx = c.getContext('2d');
  let W, H;
  function resize(){ W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const stars = Array.from({length:200}, () => ({
    x: Math.random(), y: Math.random() * 0.58,
    r: Math.random() * 1.2 + 0.2,
    op: Math.random() * 0.6 + 0.1,
    speed: Math.random() * 3 + 2,
    phase: Math.random() * Math.PI * 2
  }));

  function draw(){
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() / 1000;
    stars.forEach(s => {
      const o = s.op * (0.6 + 0.4 * Math.sin(t / s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238,240,245,${o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── CURSOR ── */
const cur = document.getElementById('cursor');
const crng = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.left=(mx-3)+'px'; cur.style.top=(my-3)+'px';
});
(function loop(){
  rx+=(mx-rx-12)*.1; ry+=(my-ry-12)*.1;
  crng.style.left=rx+'px'; crng.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('button,.mode-tile,.drop-zone,.stat,.result-card,.t-row').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('hov');crng.classList.add('hov');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('hov');crng.classList.remove('hov');});
});

/* ── DATA ── */
const CFG = {
  image:{
    fmts:['JPG','PNG','WEBP','GIF','BMP','TIFF'],
    metrics:[{n:'GAN Fingerprint',c:'var(--danger2)'},{n:'Frequency Anomaly',c:'var(--acc)'},{n:'Face Landmark Drift',c:'var(--warn2)'},{n:'Compression Traces',c:'var(--safe2)'}],
    steps:['Preprocessing','Feature Extraction','GAN Classifier','Frequency Analysis','Report Generation'],
    results:[{code:'SYS-01',name:'Face Analysis',desc:'Landmark geometry, eye blink patterns & skin texture synthesis markers'},{code:'SYS-02',name:'Frequency Domain',desc:'DCT & Fourier transform artifact detection in latent space'},{code:'SYS-03',name:'Texture Forensics',desc:'Pixel-level GAN fingerprint extraction and classification'}]
  },
  video:{
    fmts:['MP4','MOV','AVI','MKV','WEBM'],
    metrics:[{n:'Temporal Consistency',c:'var(--danger2)'},{n:'Lip-Sync Alignment',c:'var(--acc)'},{n:'Motion Artifacts',c:'var(--warn2)'},{n:'Frame Coherence',c:'var(--safe2)'}],
    steps:['Frame Extraction','Face Tracking','Temporal Analysis','Lip-Sync Check','Report Generation'],
    results:[{code:'SYS-01',name:'Face Swap',desc:'Inter-frame face boundary and blending artifacts across sequence'},{code:'SYS-02',name:'Lip Sync',desc:'Audio-visual alignment consistency and phoneme mapping'},{code:'SYS-03',name:'Motion Flow',desc:'Optical flow coherence and unnatural motion detection'}]
  },
  audio:{
    fmts:['WAV','MP3','FLAC','OGG','M4A','AAC'],
    metrics:[{n:'Spectral Artifacts',c:'var(--danger2)'},{n:'Prosody Score',c:'var(--acc)'},{n:'Voice Embedding Δ',c:'var(--warn2)'},{n:'Breath Naturalness',c:'var(--safe2)'}],
    steps:['Audio Decoding','Spectrogram Analysis','Voice Embedding','Prosody Check','Report Generation'],
    results:[{code:'SYS-01',name:'Voice Cloning',desc:'Latent voice embedding similarity and TTS artifact identification'},{code:'SYS-02',name:'Spectrogram',desc:'MFCC deviation and spectral synthesis marker detection'},{code:'SYS-03',name:'Prosody & Rhythm',desc:'Unnatural stress, pacing and breathing pattern analysis'}]
  },
  signature:{
    fmts:['JPG','PNG','PDF','TIFF','BMP'],
    metrics:[{n:'Stroke Velocity',c:'var(--danger2)'},{n:'Pressure Variance',c:'var(--acc)'},{n:'Tremor Analysis',c:'var(--warn2)'},{n:'Loop Consistency',c:'var(--safe2)'}],
    steps:['Image Preprocessing','Stroke Segmentation','Dynamic Analysis','Template Matching','Report Generation'],
    results:[{code:'SYS-01',name:'Stroke Dynamics',desc:'Velocity, pressure and pen-lift pattern forensic analysis'},{code:'SYS-02',name:'Geometric Match',desc:'Reference template comparison via Dynamic Time Warping'},{code:'SYS-03',name:'Writer Verify',desc:'Neural handwriting style embedding match and comparison'}]
  }
};

let mode='image', fileLoaded=false;

function renderMetrics(defs,vals,labels){
  document.getElementById('metricsBody').innerHTML = defs.map((m,i)=>`
    <div class="metric">
      <div class="metric-row"><span class="metric-name">${m.n}</span><span class="metric-val">${labels[i]}</span></div>
      <div class="track"><div class="fill" style="width:${vals[i]}%;background:${m.c}"><div class="fill-dot"></div></div></div>
    </div>`).join('');
}

function setMode(el,m){
  document.querySelectorAll('.mode-tile').forEach(t=>t.classList.remove('active'));
  el.classList.add('active'); mode=m;
  const cfg=CFG[m];
  document.getElementById('fmtList').innerHTML=cfg.fmts.map(f=>`<span class="dfmt">${f}</span>`).join('');
  renderMetrics(cfg.metrics,[0,0,0,0],['—','—','—','—']);
  resetVerdict();
  document.getElementById('resultsSection').style.display='none';
  document.getElementById('pipePanel').style.display='none';
}

function resetVerdict(){
  const p=document.getElementById('vrPct');
  p.textContent='—'; p.style.color='var(--ghost)'; p.style.textShadow='none';
  const f=document.getElementById('vrFill');
  f.style.strokeDashoffset='298'; f.style.stroke='var(--rim2)'; f.style.filter='none';
  document.getElementById('vWord').textContent='Awaiting Input'; document.getElementById('vWord').style.color='var(--pale)';
  document.getElementById('vNote').textContent='Submit a file to begin';
}
renderMetrics(CFG.image.metrics,[0,0,0,0],['—','—','—','—']);

function onDragOver(e){e.preventDefault();document.getElementById('dropZone').classList.add('drag-over');}
function onDragLeave(){document.getElementById('dropZone').classList.remove('drag-over');}
function onDrop(e){e.preventDefault();document.getElementById('dropZone').classList.remove('drag-over');if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);}
function onFilePick(e){if(e.target.files[0])loadFile(e.target.files[0]);}

function loadFile(file){
  fileLoaded=true;
  document.getElementById('runBtn').disabled=false;
  document.getElementById('runLabel').textContent='Initiate Analysis';
  if(file.type.startsWith('image/')){
    const r=new FileReader();
    r.onload=e=>{
      const img=document.getElementById('previewImg');
      img.src=e.target.result; img.style.display='block';
      document.getElementById('dropInner').style.display='none';
    };
    r.readAsDataURL(file);
  } else {
    document.getElementById('dropInner').querySelector('.drop-title').textContent=file.name;
    document.getElementById('dropInner').querySelector('.drop-sub').textContent=`${(file.size/1024/1024).toFixed(2)} MB — ready`;
  }
  const b=document.getElementById('scanBeam');
  b.classList.add('on'); setTimeout(()=>b.classList.remove('on'),3200);
  resetVerdict();
  document.getElementById('resultsSection').style.display='none';
  document.getElementById('pipePanel').style.display='none';
}

async function runAnalysis(){
  if(!fileLoaded) return;
  const cfg=CFG[mode], btn=document.getElementById('runBtn');
  btn.disabled=true; document.getElementById('runLabel').textContent='Analysing…';
  const panel=document.getElementById('pipePanel'), body=document.getElementById('pipeBody');
  panel.style.display='block';
  body.innerHTML=cfg.steps.map((s,i)=>`
    <div class="pipe-step" id="ps${i}"><div class="pipe-mark" id="pm${i}">0${i+1}</div><span>${s}</span></div>`).join('');
  for(let i=0;i<cfg.steps.length;i++){
    document.getElementById(`ps${i}`).classList.add('running');
    document.getElementById(`pm${i}`).classList.add('active');
    await sleep(360+Math.random()*260);
    document.getElementById(`ps${i}`).classList.replace('running','done');
    document.getElementById(`pm${i}`).classList.remove('active');
    document.getElementById(`pm${i}`).classList.add('done');
    document.getElementById(`pm${i}`).textContent='✓';
  }
  const score=50+Math.random()*46;
  const isFake=score>72, isUnc=score>=50&&score<=72;
  const color=isFake?'var(--danger2)':isUnc?'var(--warn2)':'var(--safe2)';
  const glow=isFake?'rgba(192,80,74,.4)':isUnc?'rgba(176,128,64,.38)':'rgba(74,158,130,.4)';
  const fill=document.getElementById('vrFill');
  fill.style.strokeDashoffset=298-(score/100)*298; fill.style.stroke=color; fill.style.filter=`drop-shadow(0 0 7px ${glow})`;
  const pEl=document.getElementById('vrPct');
  pEl.textContent=score.toFixed(0)+'%'; pEl.style.color=color; pEl.style.textShadow=`0 0 18px ${glow}`;
  document.getElementById('vWord').textContent=isFake?(mode==='signature'?'Forgery Confirmed':'Synthetic Detected'):isUnc?'Inconclusive':'Authentic';
  document.getElementById('vWord').style.color=color;
  document.getElementById('vNote').textContent=`${score.toFixed(1)}% synthetic probability`;
  const mv=cfg.metrics.map(()=>Math.min(97,(isFake?42:8)+Math.random()*(isFake?50:38)));
  renderMetrics(cfg.metrics,mv,mv.map(v=>v.toFixed(1)+'%'));
  const scores=cfg.results.map(()=>Math.min(97,(isFake?48:8)+Math.random()*45));
  document.getElementById('resultsGrid').innerHTML=scores.map((s,i)=>{
    const r=cfg.results[i],fake=s>68,unc=s>=45&&s<=68;
    const cls=fake?'v-fake':unc?'v-unc':'v-real';
    const lbl=fake?(mode==='signature'?'Forged':'Synthetic'):unc?'Inconclusive':'Authentic';
    const clr=fake?'var(--danger2)':unc?'var(--warn2)':'var(--safe2)';
    const g=fake?'rgba(192,80,74,.28)':unc?'rgba(176,128,64,.28)':'rgba(74,158,130,.28)';
    return `<div class="result-card">
      <div class="rc-code"><span>${r.code}</span><span class="rc-verdict ${cls}">${lbl}</span></div>
      <div class="rc-name">${r.name}</div>
      <div class="rc-score" id="rs${i}" style="color:${clr};text-shadow:0 0 18px ${g}">${s.toFixed(1)}<span style="font-size:18px;color:var(--fog);text-shadow:none">%</span></div>
      <div class="rc-desc">${r.desc}</div></div>`;
  }).join('');
  document.getElementById('resultsSection').style.display='block';
  await sleep(80);
  scores.forEach((_,i)=>setTimeout(()=>{ const el=document.getElementById(`rs${i}`); if(el) el.classList.add('show'); },i*180));
  btn.disabled=false; document.getElementById('runLabel').textContent='Re-Analyse File';
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
</script>
</body>
</html>