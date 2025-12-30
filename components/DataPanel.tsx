
import React from 'react';
import { useStore } from '../store';
import { Printer, Code, FileCode, Archive, X } from 'lucide-react';

export const DataPanel: React.FC = () => {
  const { uiTheme, toggleDataPanel, exportProjectData } = useStore();

  const handleExportJSON = () => {
    const data = exportProjectData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-dna-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    // Basic Static HTML Generation
    const data = exportProjectData();
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DNA Project Export</title>
    <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f0f0; }
        .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <h1>DNA Core Static Export</h1>
        <p>This is a placeholder for the full landing page export.</p>
        <p>Project state is embedded in this file.</p>
    </div>
    <script id="dna-state" type="application/json">${data}</script>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `static-snapshot.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportZIP = () => {
    alert("ZIP Generation requires jszip library. Generating standalone HTML instead.");
    handleExportHTML();
  };

  return (
    <div
      className="w-[360px] h-full border-l animate-[slideInRight_0.3s_ease-out] transition-colors duration-500 relative flex flex-col overflow-hidden data-panel"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts,
        borderLeftWidth: 'var(--ui-stroke-width)'
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .mono-font { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
      `}</style>

      {/* Header */}
      <div
        className="p-6 border-b flex items-center justify-between"
        style={{ borderColor: uiTheme.elements, borderBottomWidth: 'var(--ui-stroke-width)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mono-font">Production Hub</span>
        <button
          onClick={toggleDataPanel}
          className="p-2 hover:opacity-100 opacity-20 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar">

        {/* PRODUCTION OUTPUT SECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-[1px] flex-1 bg-current opacity-10" />
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mono-font">Production Output</h3>
            <div className="h-[1px] w-4 bg-current opacity-10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Snapshot PDF */}
            <button
              onClick={() => window.print()}
              className="flex flex-col items-start gap-4 p-4 border transition-all hover:bg-black/[0.03] group"
              style={{ borderColor: uiTheme.elements, borderWidth: 'var(--ui-stroke-width)' }}
            >
              <Printer size={18} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-widest mono-font">Snapshot</div>
                <div className="text-[9px] opacity-30 uppercase mono-font">PDF Print</div>
              </div>
            </button>

            {/* Source JSON */}
            <button
              onClick={handleExportJSON}
              className="flex flex-col items-start gap-4 p-4 border transition-all hover:bg-black/[0.03] group"
              style={{ borderColor: uiTheme.elements, borderWidth: 'var(--ui-stroke-width)' }}
            >
              <Code size={18} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-widest mono-font">Source</div>
                <div className="text-[9px] opacity-30 uppercase mono-font">JSON Data</div>
              </div>
            </button>

            {/* Static HTML */}
            <button
              onClick={handleExportHTML}
              className="flex flex-col items-start gap-4 p-4 border transition-all hover:bg-black/[0.03] group"
              style={{ borderColor: uiTheme.elements, borderWidth: 'var(--ui-stroke-width)' }}
            >
              <FileCode size={18} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-widest mono-font">Static</div>
                <div className="text-[9px] opacity-30 uppercase mono-font">HTML File</div>
              </div>
            </button>

            {/* Hosting ZIP */}
            <button
              onClick={handleExportZIP}
              className="flex flex-col items-start gap-4 p-4 border transition-all hover:bg-black/[0.03] group"
              style={{ borderColor: uiTheme.elements, borderWidth: 'var(--ui-stroke-width)' }}
            >
              <Archive size={18} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-widest mono-font">Hosting</div>
                <div className="text-[9px] opacity-30 uppercase mono-font">Full ZIP</div>
              </div>
            </button>
          </div>
        </section>

        {/* SYSTEM STATUS (Decorative) */}
        <section className="mt-auto space-y-3 opacity-20">
          <div className="flex items-center justify-between text-[8px] mono-font tracking-widest uppercase">
            <span>Core Engine</span>
            <span>Stable</span>
          </div>
          <div className="w-full h-[1px] bg-current" />
          <div className="flex items-center justify-between text-[8px] mono-font tracking-widest uppercase">
            <span>Buffer Sync</span>
            <span>100%</span>
          </div>
        </section>

      </div>
    </div>
  );
};
