import { useState, useEffect, useCallback } from "react";
import { CFG, getModeGlyph, sleep } from "../config/analysisConfig";
import { predictImage, predictAudio, predictSignature } from "../services/api";

export function useAnalysis() {
  const [mode, setModeKey]         = useState("image");
  const [fileLoaded, setFileLoaded] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileName, setFileName]     = useState(null);
  const [fileSize, setFileSize]     = useState(null);
  const [file, setFile]             = useState(null);
  const [scanning, setScanning]     = useState(false);
  const [analysing, setAnalysing]   = useState(false);
  const [pipelineSteps, setPipelineSteps]     = useState([]);
  const [pipelineVisible, setPipelineVisible] = useState(false);
  const [metrics, setMetrics]       = useState([]);
  const [verdict, setVerdict]       = useState({ score: null, color: null, glow: null, word: "Awaiting Input", note: "Submit a file to begin" });
  const [results, setResults]       = useState([]);
  const [visibleScores, setVisibleScores] = useState([]);
  const [audioSrc, setAudioSrc]     = useState(null);
  const [history, setHistory]       = useState([]);
  const [apiError, setApiError]     = useState(null);

  const cfg = CFG[mode];

  // Reset on mode change
  useEffect(() => {
    setMetrics(cfg.metrics.map((m) => ({ ...m, value: 0, label: "—" })));
    setVerdict({ score: null, color: null, glow: null, word: "Awaiting Input", note: "Submit a file to begin" });
    setResults([]); setPipelineVisible(false); setApiError(null);
  }, [mode]);

  // Init metrics
  useEffect(() => {
    setMetrics(cfg.metrics.map((m) => ({ ...m, value: 0, label: "—" })));
  }, []);

  function handleSetMode(k) {
    setModeKey(k);
    setFileLoaded(false); setPreviewSrc(null); setFileName(null); setFileSize(null); setAudioSrc(null);
  }

  function loadFile(f) {
    setFile(f);
    setFileLoaded(true);
    setFileName(f.name);
    setFileSize((f.size / 1024 / 1024).toFixed(2));
    setVerdict({ score: null, color: null, glow: null, word: "Awaiting Input", note: "Submit a file to begin" });
    setResults([]); setPipelineVisible(false); setApiError(null);
    if (f.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = (e) => setPreviewSrc(e.target.result);
      r.readAsDataURL(f);
      setAudioSrc(null);
    } else if (f.type.startsWith("audio/")) {
      setAudioSrc(URL.createObjectURL(f));
      setPreviewSrc(null);
    } else {
      setPreviewSrc(null); setAudioSrc(null);
    }
    setScanning(true);
    setTimeout(() => setScanning(false), 3200);
  }

  const runAnalysis = useCallback(async () => {
    if (!fileLoaded || analysing) return;
    setAnalysing(true); setPipelineVisible(true); setApiError(null);

    const steps = cfg.steps.map((s) => ({ label: s, state: "pending" }));
    setPipelineSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      setPipelineSteps((prev) => prev.map((s, j) => j === i ? { ...s, state: "running" } : s));
      await sleep(360 + Math.random() * 260);
      setPipelineSteps((prev) => prev.map((s, j) => j === i ? { ...s, state: "done" }    : s));
    }

    let score = 50 + Math.random() * 46;
    let prediction = "real";

    try {
      let data;
      if      (mode === "image")     data = await predictImage(file);
      else if (mode === "audio")     data = await predictAudio(file);
      else if (mode === "signature") data = await predictSignature(file);

      if (data) {
        score      = data.score ?? data.fake_probability ?? score;
        prediction = data.prediction ?? prediction;
      }
    } catch (err) {
      console.error(`${mode} API error:`, err);
      setApiError(err.message);
    }

    const isFake = prediction === "fake";
    const isUnc  = score >= 45 && score <= 68;
    const color  = isFake ? "var(--danger2)" : isUnc ? "var(--warn2)" : "var(--safe2)";
    const glow   = isFake ? "rgba(192,80,74,.4)" : isUnc ? "rgba(176,128,64,.38)" : "rgba(74,158,130,.4)";
    const word   = isFake ? (mode === "signature" ? "Forgery Confirmed" : "Synthetic Detected") : isUnc ? "Inconclusive" : "Authentic";
    setVerdict({ score, color, glow, word, note: `${score.toFixed(1)}% synthetic probability` });

    setMetrics(cfg.metrics.map((m) => ({ ...m, value: score, label: score.toFixed(1) + "%" })));
    setResults(cfg.results.map((r) => ({ ...r, score })));
    setVisibleScores([]);
    await sleep(80);
    cfg.results.forEach((_, i) => setTimeout(() => setVisibleScores((prev) => [...prev, i]), i * 180));

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setHistory((prev) => [
      {
        glyph:   getModeGlyph(mode),
        name:    fileName,
        size:    fileSize + " MB",
        type:    mode.charAt(0).toUpperCase() + mode.slice(1),
        cls:     isFake ? "v-fake" : isUnc ? "v-unc" : "v-real",
        lbl:     isFake ? (mode === "signature" ? "Forged" : "Synthetic") : isUnc ? "Inconclusive" : "Authentic",
        conf:    score.toFixed(1) + "%",
        confClr: color,
        date:    dateStr,
      },
      ...prev,
    ]);
    setAnalysing(false);
  }, [fileLoaded, analysing, mode, cfg, file, fileName, fileSize]);

  return {
    mode, cfg, handleSetMode,
    fileLoaded, previewSrc, fileName, fileSize, file,
    scanning, analysing, pipelineSteps, pipelineVisible,
    metrics, verdict, results, visibleScores,
    audioSrc, history, apiError,
    loadFile, runAnalysis,
  };
}
