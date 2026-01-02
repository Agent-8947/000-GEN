
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
    isManagerOpen,
    isDataPanelOpen,
    selectedBlockId,
    initNavbarBlock,
    initHeroBlock,
    globalSettings,
    isPreviewMode,
    togglePreviewMode,
    uiTheme
  } = useStore();

  // LPAI-2.0.0: useContrastCheck Engine
  const useContrastCheck = () => {
    React.useEffect(() => {
      const bg = uiTheme.lightPanel;
      const text = uiTheme.fonts;

      const getLuminance = (hex: string) => {
        const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map(v => parseInt(v, 16) / 255) || [0, 0, 0];
        const [r, g, b] = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      const l1 = getLuminance(bg);
      const l2 = getLuminance(text);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

      if (ratio < 4.5) {
        console.warn(`%c [LPAI-CONTRAST] UI Contrast Low: ${ratio.toFixed(2)} %c Targets: 4.5+`, "color: white; background: #e11d48; padding: 2px 5px; border-radius: 2px;", "color: #e11d48;");
      } else {
        console.log(`%c [LPAI-CONTRAST] PASS: ${ratio.toFixed(2)}`, "color: #10b981; font-weight: bold;");
      }
    }, [uiTheme]);
  };

  useContrastCheck();

  const { resetVisibility } = useStore();

  React.useEffect(() => {
    initNavbarBlock();
    initHeroBlock();
    resetVisibility(); // Emergency Recovery: Force all nodes to be visible
  }, [initNavbarBlock, initHeroBlock, resetVisibility]);

  // UI Theme -> CSS Variables & Scale Sync
  React.useEffect(() => {
    const root = document.documentElement;
    const safeBg = uiTheme.lightPanel === 'transparent' ? '#FFFFFF' : uiTheme.lightPanel;
    const safeText = uiTheme.fonts === 'transparent' ? '#111827' : uiTheme.fonts;

    root.style.setProperty('--ui-bg', safeBg);
    root.style.setProperty('--ui-text', safeText);
    root.style.setProperty('--ui-accent', uiTheme.accents);
    root.style.setProperty('--ui-panel', uiTheme.darkPanel);
    root.style.setProperty('--ui-elements', uiTheme.elements);

    // Step 4: Sync interfaceScale to document root
    root.style.fontSize = `${uiTheme.interfaceScale}%`;

    // LPAI-1.2.9: Weight Controls
    root.style.setProperty('--ui-font-weight', uiTheme.uiFontWeight.toString());
    root.style.setProperty('--ui-stroke-width', `${uiTheme.uiElementStroke}px`);

    // LPAI-1.3.0: Typo Visibility
    root.style.setProperty('--ui-text-contrast', (uiTheme.uiTextBrightness / 100).toString());
    root.style.setProperty('--ui-base-fs', `${uiTheme.uiBaseFontSize}px`);
  }, [uiTheme]);

  // DNA Matrix Synchronization (LPAI-1.5.0)
  React.useEffect(() => {
    const root = document.documentElement;

    // GL01: Typography Mapping
    const gl01 = globalSettings['GL01'].params;
    const fontName = gl01[7]?.value || 'Space Grotesk';
    const mapping: Record<string, string> = {
      'Code': "'JetBrains Mono', monospace",
      'Google Sans': "'Google Sans', 'Product Sans', sans-serif",
      'Share Tech': "'Share Tech', sans-serif",
      'Orbitron': "'Orbitron', sans-serif",
      'Agency': "'Agency FB', sans-serif",
      'Ancorli': "'Ancorli', sans-serif",
      'Lilex': "'Lilex', monospace"
    };
    const fontFamily = mapping[fontName] || `'${fontName}', sans-serif`;
    root.style.setProperty('--dna-font-family', fontFamily);

    // GL02: Colors -> CSS Variables
    const gl02 = globalSettings['GL02'].params;
    root.style.setProperty('--dna-bg', gl02[0].value);
    root.style.setProperty('--dna-surface', gl02[1].value);
    root.style.setProperty('--dna-accent', gl02[2].value);
    root.style.setProperty('--dna-text-prim', gl02[3].value);
    root.style.setProperty('--dna-text-sec', gl02[4].value);
    root.style.setProperty('--dna-border', gl02[5].value);

    // GL02: Pattern Sync
    const patternOpacity = (parseFloat(gl02[8]?.value || '10') / 100).toString();
    const patternSize = `${gl02[9]?.value || '20'}px`;
    root.style.setProperty('--dna-pattern-opacity', patternOpacity);
    root.style.setProperty('--dna-pattern-size', patternSize);
    root.style.setProperty('--dna-pattern-color', gl02[3].value); // Base on Text Prim

    // GL10: Site Engine (Theme Trigger)
    const siteTheme = globalSettings['GL10']?.params[6]?.value || 'Dark';
    root.setAttribute('data-theme', siteTheme.toLowerCase());

    // Global Radius Multiplier (GL07)
    const gl07 = globalSettings['GL07'].params;
    root.style.setProperty('--dna-radius', `${gl07[0].value}px`);

  }, [globalSettings]);

  // Editor Interface
  const appBg = ''; // Deprecated, using dynamic styles

  // Production Mode Check
  if ((window as any).__PROD_MODE__) {
    return (
      <main
        key={canvasKey}
        className="w-full min-h-screen relative overflow-x-hidden transition-colors duration-500"
        style={{
          backgroundColor: 'var(--dna-bg)',
          color: 'var(--dna-text-prim)'
        }}
      >
        {/* Global Styles Injection for Production */}
        <style>{`
          .custom-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          .custom-scrollbar::-webkit-scrollbar { display: none; }
          /* Ensure DNA variables are respected */
          body { background-color: var(--dna-bg); color: var(--dna-text-prim); font-family: var(--dna-font-family); }
          /* Hide editor UI elements in production */
          aside, 
          .sidebar, 
          .right-sidebar, 
          .global-settings, 
          .block-list, 
          .property-inspector, 
          .data-panel,
          button {
            display: none !important;
          }
        `}</style>

        <Canvas />
        <div id="portal-root" className="fixed inset-0 pointer-events-none z-[9999]" />
      </main>
    );
  }

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
        
        /* LPAI-1.3.0: Typo Visibility Application */
        aside, .data-panel, .global-settings, .block-list, .property-inspector {
          font-size: var(--ui-base-fs) !important;
        }
        
        aside, .data-panel, .global-settings, .block-list, .property-inspector,
        aside button, aside span, .property-inspector span, .property-inspector h2 {
          color: color-mix(in srgb, var(--ui-text), transparent calc(100% - var(--ui-text-contrast) * 100%));
        }
        
        /* Scale typography based on base FS */
        .text-xs { font-size: calc(var(--ui-base-fs) * 0.85); }
        .text-sm { font-size: var(--ui-base-fs); }
        .text-base { font-size: calc(var(--ui-base-fs) * 1.1); }

        .custom-scrollbar {
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media print {
          aside, 
          .sidebar, 
          .right-sidebar, 
          .global-settings, 
          .block-list, 
          .property-inspector, 
          .data-panel,
          button {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
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
      {!isPreviewMode && (isBlockListOpen || isManagerOpen) && <BlockList />}

      {/* CENTRAL AREA: Workspace Canvas */}
      <main
        key={canvasKey}
        className={`flex-1 relative transition-colors duration-500`}
      >
        <Canvas />
      </main>

      {/* RIGHT EXPANDABLE PANELS */}
      {!isPreviewMode && isDataPanelOpen && <DataPanel />}
      {!isPreviewMode && selectedBlockId && <PropertyInspector />}

      {/* RIGHT SIDEBAR: Utility (Hidden in Preview) */}
      {!isPreviewMode && <RightSidebar />}

      {/* PORTAL ROOT for high-z floating elements */}
      <div id="portal-root" className="fixed inset-0 pointer-events-none z-[9999]" />
    </div>
  );
}
