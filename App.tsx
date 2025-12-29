
import React from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { GlobalSettings } from './components/GlobalSettings';
import { BlockList } from './components/BlockList';
import { DataPanel } from './components/DataPanel';
import { Canvas } from './components/Canvas';
import { X } from 'lucide-react';

import { PropertyInspector, RightSidebar } from './components/PropertyInspector';


export default function App() {
  const {
    canvasKey,
    isGlobalOpen,
    isBlockListOpen,
    isDataPanelOpen,
    selectedBlockId,
    initNavbarBlock,
    initHeroBlock,
    globalSettings,
    isPreviewMode,
    togglePreviewMode,
    uiTheme
  } = useStore();

  React.useEffect(() => {
    initNavbarBlock();
    initHeroBlock();
    // Force Site Theme Logic (Already handled in store middleware)
  }, [initNavbarBlock, initHeroBlock]);

  // Editor Interface
  const appBg = ''; // Deprecated, using dynamic styles

  return (
    <div
      className="h-screen w-full flex transition-colors duration-500 overflow-hidden selection:bg-blue-500/20"
      style={{
        backgroundColor: uiTheme.lightPanel,
        color: uiTheme.fonts
      }}
    >
      <style>{`
        @keyframes canvasFlash {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .canvas-animate-flash {
          animation: canvasFlash 0.4s ease-out forwards;
        }
      `}</style>

      {/* PREVIEW MODE OVERLAY */}
      {isPreviewMode && (
        <button
          onClick={togglePreviewMode}
          className="fixed top-6 right-6 z-[100] p-3 rounded-full transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-110"
          style={{ backgroundColor: uiTheme.accents, color: '#FFFFFF' }}
        >
          <X size={24} />
        </button>
      )}

      {/* LEFT SIDEBAR: Navigation (Hidden in Preview) */}
      {!isPreviewMode && <Sidebar />}

      {/* LEFT EXPANDABLE PANELS */}
      {!isPreviewMode && isGlobalOpen && <GlobalSettings />}
      {!isPreviewMode && isBlockListOpen && <BlockList />}

      {/* CENTRAL AREA: Workspace Canvas */}
      <main
        key={canvasKey}
        className={`flex-1 relative transition-colors duration-500 canvas-animate-flash`}
      >
        <Canvas />
      </main>

      {/* RIGHT EXPANDABLE PANELS */}
      {!isPreviewMode && isDataPanelOpen && <DataPanel />}
      {!isPreviewMode && selectedBlockId && <PropertyInspector />}

      {/* RIGHT SIDEBAR: Utility (Hidden in Preview) */}
      {!isPreviewMode && <RightSidebar />}
    </div>
  );
}
