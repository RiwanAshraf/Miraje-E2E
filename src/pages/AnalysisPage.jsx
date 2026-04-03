import { useAnalysis } from "../hooks/useAnalysis";
import ModeSelector  from "../components/analysis/ModeSelector";
import DropZone      from "../components/analysis/DropZone";
import SignalPanel   from "../components/analysis/SignalPanel";
import PipelinePanel from "../components/analysis/PipelinePanel";
import ResultCard    from "../components/ui/ResultCard";
import HistoryTable  from "../components/analysis/HistoryTable";

export default function AnalysisPage() {
  const {
    mode, cfg, handleSetMode,
    fileLoaded, previewSrc, fileName, fileSize,
    scanning, analysing, pipelineSteps, pipelineVisible,
    metrics, verdict, results, visibleScores,
    audioSrc, history, apiError,
    loadFile, runAnalysis,
  } = useAnalysis();

  return (
    <main>
      <div className="page">
        <div className="sec-head" style={{ marginBottom: 14 }}>Detection Mode</div>

        <ModeSelector mode={mode} onSetMode={handleSetMode} />

        {apiError && (
          <div className="api-error-banner">
            ⚠ API Error: {apiError} — results may be simulated.
          </div>
        )}

        <div className="workspace">
          <DropZone
            mode={mode}
            cfg={cfg}
            fileLoaded={fileLoaded}
            fileName={fileName}
            fileSize={fileSize}
            previewSrc={previewSrc}
            audioSrc={audioSrc}
            scanning={scanning}
            onDrop={loadFile}
            onFilePick={loadFile}
          />

          <SignalPanel
            metrics={metrics}
            verdict={verdict}
            analysing={analysing}
            fileLoaded={fileLoaded}
            onRun={runAnalysis}
            pipelineVisible={pipelineVisible}
            pipelineSteps={pipelineSteps}
            PipelinePanelComp={pipelineVisible && <PipelinePanel steps={pipelineSteps} />}
          />
        </div>

        {results.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div className="sec-head" style={{ marginBottom: 18 }}>Subsystem Results</div>
            <div className="results-grid">
              {results.map((r, i) => (
                <ResultCard key={i} {...r} mode={mode} visible={visibleScores.includes(i)} />
              ))}
            </div>
          </div>
        )}

        <HistoryTable history={history} />
      </div>
    </main>
  );
}
