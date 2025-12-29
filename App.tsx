
import React from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { GlobalSettings } from './components/GlobalSettings';
import { BlockList } from './components/BlockList';
import { DataPanel } from './components/DataPanel';
import { Canvas } from './components/Canvas';
import { RightSidebar } from './components/PropertyInspector';

export default function App() {
  const { theme, canvasKey, isGlobalOpen, isBlockListOpen, isDataPanelOpen } = useStore();

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-black';
  const appBg = isDark ? 'bg-[#0A0A0A]' : 'bg-white';
  
  /** 
   * Canvas logic: 
   * Light Mode: #E2E4E9 (Light Graphite)
   * Dark Mode: #1D1B16 (Deep Dark Graphite)
   */
  const canvasBg = isDark ? 'bg-[#1D1B16]' : 'bg-[#E2E4E9]';

  return (
    <div className={`${appBg} ${textColor} h-screen w-full flex transition-colors duration-500 overflow-hidden font-sans selection:bg-gray-500/30`}>
      <style>{`
        @keyframes canvasFlash {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .canvas-animate-flash {
          animation: canvasFlash 0.4s ease-out forwards;
        }
      `}</style>

      {/* LEFT SIDEBAR: Navigation & Master Toggle (60px) */}
      <Sidebar />

      {/* LEFT EXPANDABLE PANELS */}
      {isGlobalOpen && <GlobalSettings />}
      {isBlockListOpen && <BlockList />}

      {/* CENTRAL AREA: Workspace Canvas with selective reload logic */}
      <main 
        key={canvasKey}
        className={`flex-1 relative ${canvasBg} transition-colors duration-500 canvas-animate-flash`}
      >
        <Canvas />
      </main>

      {/* RIGHT EXPANDABLE PANELS */}
      {isDataPanelOpen && <DataPanel />}

      {/* RIGHT SIDEBAR: Utility & Theme Control (60px) */}
      <RightSidebar />
      
      {/* Subtle Grainy Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] contrast-125 brightness-125 z-[100]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
}
