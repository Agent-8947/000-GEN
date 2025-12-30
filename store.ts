
import { create } from 'zustand';
import { produce } from 'immer';
import { persist } from 'zustand/middleware';


export const UI_THEME_PRESETS = {
  'Architect': { fonts: "#111827", darkPanel: "#E5E7EB", lightPanel: "#FFFFFF", elements: "#9CA3AF", accents: "#3B82F6" },
  'Onyx': { fonts: "#F9FAFB", darkPanel: "#111111", lightPanel: "#1A1A1A", elements: "#374151", accents: "#60A5FA" },
  'Blueprint': { fonts: "#FFFFFF", darkPanel: "#0F172A", lightPanel: "#1E293B", elements: "#334155", accents: "#38BDF8" }
};

export type ParamType = 'range' | 'color' | 'toggle' | 'select';

export interface DNAParameter {
  id: string;
  name: string;
  type: ParamType;
  value: string;
  min?: number;
  max?: number;
  options?: string[];
}

interface GlobalSetting {
  name: string;
  params: DNAParameter[];
}

interface ContentBlock {
  id: string;
  type: string;
  localOverrides: Record<string, any>;
  isVisible: boolean;
}

interface GridState {
  isPreviewMode: boolean;
  uiTheme: {
    fonts: string;
    darkPanel: string;
    lightPanel: string;
    elements: string;
    accents: string;
    interfaceScale: number;
    uiFontWeight: number;
    uiElementStroke: number;
    uiTextBrightness: number;
    uiBaseFontSize: number;
  };
  canvasKey: number;
  isGlobalOpen: boolean;
  isBlockListOpen: boolean;
  isManagerOpen: boolean;
  isDataPanelOpen: boolean;
  globalSettings: Record<string, GlobalSetting>;
  pages: Record<string, ContentBlock[]>;
  currentPage: string;
  snapshots: { id: string; name: string; timestamp: number }[];
  contentBlocks: ContentBlock[]; // Keep for legacy/compat but point to pages[currentPage]
  selectedBlockId: string | null;
  viewportMode: 'desktop' | 'mobile';
  gridMode: 'off' | 'columns' | 'mobile' | 'rows';
  past: any[];
  future: any[];

  undo: () => void;
  redo: () => void;
  takeHistorySnapshot: () => void;

  setViewport: (mode: 'desktop' | 'mobile') => void;
  cycleGrid: () => void;

  togglePreviewMode: () => void;
  updateUITheme: (key: string, value: any) => void;
  applyThemePreset: (presetName: string) => void;
  toggleSiteTheme: () => void;
  toggleGlobal: () => void;
  toggleBlockList: () => void;
  toggleManager: () => void;
  toggleDataPanel: () => void;
  refreshCanvas: () => void;
  updateGlobal: (glId: string, idx: number, val: string) => void;
  updateParam: (glId: string, paramId: string, value: string) => void;

  // Studio_v2_Core
  setCurrentPage: (name: string) => void;
  addPage: (name: string) => void;
  saveSnapshot: (name?: string) => void;
  loadSnapshot: (id: string) => void;
  optimizeLayout: () => void;

  // DNA_Storage_System
  bulkUpdateDNA: (updates: Record<string, string[]>) => void;

  // Block_Architecture_Engine
  addBlock: (type: string) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  clearCanvas: () => void;
  toggleBlockVisibility: (id: string) => void;
  setSelectedBlock: (id: string | null) => void;
  updateBlockLocal: (id: string, path: string, value: any) => void;

  // IO_Data_Service
  exportProjectData: () => string;
  serializeState: () => Record<string, any>;
  importProjectData: (json: string) => void;
  deserializeState: (input: string | Record<string, any>) => void;
  setGlobalDNA: (data: Record<string, string[]>) => void;

  ioFeedback: boolean;
  triggerIOFeedback: () => void;

  // Deployment Logic
  initNavbarBlock: () => void;
  initHeroBlock: () => void;
  resetVisibility: () => void;
}

export const useStore = create<GridState>()(
  persist(
    (set, get) => ({
      isPreviewMode: false,
      uiTheme: {
        fonts: '#000000',
        darkPanel: '#CBD5E1', // Slate 300 for contrast
        lightPanel: '#F1F5F9', // Slate 100
        elements: '#000000',
        accents: '#000000',
        interfaceScale: 100,
        uiFontWeight: 700,
        uiElementStroke: 1,
        uiTextBrightness: 100,
        uiBaseFontSize: 13
      },
      canvasKey: 0,
      isGlobalOpen: false,
      isBlockListOpen: false,
      isManagerOpen: false,
      isDataPanelOpen: false,
      pages: { 'home': [] },
      currentPage: 'home',
      snapshots: [],
      contentBlocks: [],
      selectedBlockId: null,
      viewportMode: 'desktop',
      gridMode: 'off',
      past: [],
      future: [],

      takeHistorySnapshot: () => {
        const state = get();
        const snapshot = JSON.parse(JSON.stringify({
          pages: state.pages,
          globalSettings: state.globalSettings,
          uiTheme: state.uiTheme
        }));

        set(produce((state: GridState) => {
          state.past.push(snapshot);
          if (state.past.length > 50) state.past.shift(); // Limit history
          state.future = []; // Clear future on new action
        }));
      },

      undo: () => {
        const { past, future, pages, globalSettings, uiTheme } = get();
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        const currentSnapshot = JSON.parse(JSON.stringify({ pages, globalSettings, uiTheme }));

        set({
          pages: previous.pages,
          globalSettings: previous.globalSettings,
          uiTheme: previous.uiTheme,
          contentBlocks: previous.pages[get().currentPage] || [],
          past: newPast,
          future: [currentSnapshot, ...future],
          canvasKey: get().canvasKey + 1
        });
      },

      redo: () => {
        const { past, future, pages, globalSettings, uiTheme } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);
        const currentSnapshot = JSON.parse(JSON.stringify({ pages, globalSettings, uiTheme }));

        set({
          pages: next.pages,
          globalSettings: next.globalSettings,
          uiTheme: next.uiTheme,
          contentBlocks: next.pages[get().currentPage] || [],
          past: [...past, currentSnapshot],
          future: newFuture,
          canvasKey: get().canvasKey + 1
        });
      },

      setViewport: (mode) => set({ viewportMode: mode }),
      setCurrentPage: (name) => set((state) => {
        if (!state.pages[name]) return state;
        return { currentPage: name, contentBlocks: state.pages[name], canvasKey: state.canvasKey + 1 };
      }),
      addPage: (name) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          if (state.pages[name]) return;
          state.pages[name] = [];
        }));
      },
      cycleGrid: () => set((state) => ({
        gridMode: state.gridMode === 'off' ? 'columns' :
          state.gridMode === 'columns' ? 'mobile' :
            state.gridMode === 'mobile' ? 'rows' : 'off'
      })),
      globalSettings: (() => {
        const groups: Record<string, { name: string; params: string[] }> = {
          'GL01': { name: 'Text', params: ["Base Size", "Scale Ratio", "Line Height", "Weight", "Tracking", "Uppercase", "Smoothing", "Font Family"] },
          'GL02': { name: 'Colors', params: ["Base Bg", "Surface", "Accent", "Text Prim", "Text Sec", "Border", "Inversion", "BG Pattern", "Pattern Opacity", "Pattern Size"] },
          'GL03': { name: 'Spacing', params: ["Grid Unit", "Gap", "Pad X", "Pad Y", "Margin", "Container", "Flow"] },
          'GL04': { name: 'Buttons', params: ["Size", "Pad X", "Pad Y", "Typo", "Stroke", "Radius", "Shadow"] },
          'GL05': { name: 'Inputs', params: ["Height", "Radius", "Stroke", "Bg Fill", "Focus", "Placeholder", "Labels"] },
          'GL06': { name: 'Effects & Depth', params: ["Shadow Intensity", "Shadow Blur", "Glass Blur", "Glass Opacity", "Border Width", "Border Opacity", "Inner Glow"] },
          'GL07': { name: 'Radius', params: ["Global", "Inner", "Outer", "Button", "Input", "Card", "Multiplier"] },
          'GL08': { name: 'Icons', params: ["Size", "Stroke", "Optical", "Align", "Set ID", "Style", "Spacing"] },
          'GL09': { name: 'Animation', params: ["Duration", "Easing", "Entrance", "Hover", "Scroll", "Loop", "Physics"] },
          'GL10': { name: 'System Meta', params: ["SEO", "Analytics", "API Root", "Export", "Meta", "Environment", "Status"] },
          'GL11': { name: 'Site Engine', params: ["Site Theme Mode", "Adaptive Scale"] }
        };

        return Object.entries(groups).reduce((acc, [id, group]) => {
          acc[id] = {
            name: group.name,
            params: group.params.map((paramName, j) => {
              const paramId = `P${j + 1}`;
              let type: 'range' | 'color' | 'toggle' | 'select' = 'range';
              let value = '0';
              let min = 0;
              let max = 100;
              let options: string[] | undefined;

              if (id === 'GL02') {
                if (j < 6) type = 'color';
                else if (j === 6) type = 'toggle';
                else if (j === 7) type = 'select';
                else type = 'range';

                const colors = ["#F3F4F6", "#FFFFFF", "#3B82F6", "#111827", "#6B7280", "#E5E7EB", "#FFFFFF"];
                if (j < 7) {
                  value = j < 6 ? colors[j] : 'false';
                } else if (j === 7) {
                  value = "None";
                  options = ["None", "Noise", "Dots", "Checkered"];
                } else if (j === 8 || j === 9) { // Pattern Opacity (P9) and Pattern Size (P10)
                  value = j === 8 ? "10" : "20";
                  type = 'range';
                  min = j === 8 ? 0 : 4;
                  max = 100;
                }
              } else if (id === 'GL01') {
                const spec = [
                  { v: "16", min: 10, max: 24, t: 'range' },    // Base Size
                  { v: "1.25", min: 1.1, max: 2.0, t: 'range' }, // Scale Ratio
                  { v: "1.5", min: 1.0, max: 2.5, t: 'range' },  // Line Height
                  { v: "400", min: 100, max: 900, t: 'range' },  // Weight
                  { v: "-0.01", min: -0.05, max: 0.5, t: 'range' }, // Tracking
                  { v: "false", min: 0, max: 0, t: 'toggle' },   // Uppercase
                  { v: "true", min: 0, max: 0, t: 'toggle' },     // Smoothing
                  { v: "Space Grotesk", min: 0, max: 0, t: 'select', opts: ['Space Grotesk', 'Open Sans', 'Roboto', 'Inter', 'Manrope', 'Agency', 'Ancorli', 'Share Tech', 'Lilex', 'Orbitron', 'Google Sans', 'Code'] } // Font Family
                ];
                const s = spec[j] as any;
                type = s.t;
                value = s.v;
                min = s.min;
                max = s.max;
                options = s.opts;
              } else if (id === 'GL03') {
                const spec = [
                  { v: "8", min: 2, max: 16, t: 'range' },    // Grid Unit
                  { v: "24", min: 0, max: 100, t: 'range' },  // Gap
                  { v: "40", min: 0, max: 120, t: 'range' },  // Pad X
                  { v: "20", min: 0, max: 80, t: 'range' },   // Pad Y
                  { v: "0", min: 0, max: 60, t: 'range' },    // Margin
                  { v: "1200", min: 320, max: 1920, t: 'range' }, // Container
                  { v: "1.0", min: 0.5, max: 2.0, t: 'range' }    // Flow (Mobile Multiplier)
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (id === 'GL04') {
                const spec = [
                  { v: "1.0", min: 0.5, max: 2.0, t: 'range' }, // Size
                  { v: "24", min: 8, max: 64, t: 'range' },    // Pad X
                  { v: "12", min: 4, max: 32, t: 'range' },    // Pad Y
                  { v: "12", min: 8, max: 24, t: 'range' },    // Typo (Font Size)
                  { v: "1", min: 0, max: 4, t: 'range' },      // Stroke
                  { v: "4", min: 0, max: 40, t: 'range' },     // Radius
                  { v: "false", min: 0, max: 0, t: 'toggle' }  // Shadow
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (id === 'GL06') {
                const spec = [
                  { v: "10", min: 0, max: 100, t: 'range' },    // Shadow Intensity
                  { v: "20", min: 0, max: 60, t: 'range' },     // Shadow Blur
                  { v: "0", min: 0, max: 40, t: 'range' },      // Glass Blur
                  { v: "100", min: 0, max: 100, t: 'range' },    // Glass Opacity
                  { v: "0", min: 0, max: 4, t: 'range' },       // Border Width
                  { v: "10", min: 0, max: 100, t: 'range' },    // Border Opacity
                  { v: "0", min: 0, max: 100, t: 'range' }      // Inner Glow
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (id === 'GL07') {
                const spec = [
                  { v: "8", min: 0, max: 40, t: 'range' },     // Global
                  { v: "4", min: 0, max: 40, t: 'range' },     // Inner
                  { v: "12", min: 0, max: 40, t: 'range' },    // Outer
                  { v: "4", min: 0, max: 40, t: 'range' },     // Button
                  { v: "4", min: 0, max: 40, t: 'range' },     // Input
                  { v: "16", min: 0, max: 40, t: 'range' },    // Card
                  { v: "1.0", min: 0.5, max: 2.0, t: 'range' } // Multiplier
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (id === 'GL08') {
                const spec = [
                  { v: "20", min: 12, max: 48, t: 'range' },   // Size
                  { v: "1.5", min: 0.5, max: 3.0, t: 'range' }, // Stroke
                  { v: "0", min: -2, max: 2, t: 'range' },     // Optical
                  { v: "0.5", min: 0, max: 1.0, t: 'range' },  // Align
                  { v: "1", min: 1, max: 10, t: 'range' },     // Set ID
                  { v: "1", min: 1, max: 5, t: 'range' },      // Style (Solid, Outline)
                  { v: "8", min: 0, max: 24, t: 'range' }      // Spacing
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (id === 'GL05') {
                const spec = [
                  { v: "44", min: 32, max: 64, t: 'range' },   // Height
                  { v: "4", min: 0, max: 32, t: 'range' },     // Radius
                  { v: "1", min: 0, max: 3, t: 'range' },     // Stroke
                  { v: "#FFFFFF", min: 0, max: 0, t: 'color' }, // Bg Fill
                  { v: "#3B82F6", min: 0, max: 0, t: 'color' }, // Focus
                  { v: "#9CA3AF", min: 0, max: 0, t: 'color' }, // Placeholder
                  { v: "#374151", min: 0, max: 0, t: 'color' }  // Labels
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (id === 'GL09') {
                const spec = [
                  { v: "0.6", min: 0.1, max: 2.0, t: 'range' },    // Duration
                  { v: "0.1", min: 0, max: 0.5, t: 'range' },      // Stagger
                  { v: "20", min: 0, max: 100, t: 'range' },     // Entrance Y
                  { v: "0.95", min: 0.8, max: 1.1, t: 'range' },   // Scale In
                  { v: "10", min: 0, max: 40, t: 'range' },       // Blur In
                  { v: "1", min: 1, max: 5, t: 'range' },         // Easing ID
                  { v: "0.3", min: 0.1, max: 1.0, t: 'range' }     // Hover Speed
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
              } else if (paramName.toLowerCase().includes('radius') || paramName.toLowerCase().includes('size') || paramName.toLowerCase().includes('height') || paramName.toLowerCase().includes('pad') || paramName.toLowerCase().includes('unit')) {
                value = '12';
                max = 100;
              } else if (paramName.toLowerCase().includes('duration')) {
                value = '0.3';
                max = 2;
                min = 0;
              } else if (id === 'GL11') {
                if (j === 0) { // Site Theme Mode
                  type = 'select';
                  value = 'Light';
                  options = ['Light', 'Dark'];
                } else if (j === 1) { // Adaptive Scale
                  type = 'range';
                  value = '100';
                  min = 50; max = 150;
                }
              }

              return { id: paramId, name: paramName, type, value, min, max, options };
            })
          };
          return acc;
        }, {} as Record<string, GlobalSetting>);
      })(),

      togglePreviewMode: () => set(produce((state: GridState) => {
        const nextMode = !state.isPreviewMode;
        if (nextMode) {
          state.selectedBlockId = null;
          state.isGlobalOpen = false;
          state.isBlockListOpen = false;
          state.isDataPanelOpen = false;
          document.documentElement.requestFullscreen().catch(() => { });
        } else if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        state.isPreviewMode = nextMode;
      })),

      updateUITheme: (key, value) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          (state.uiTheme as any)[key] = value;
        }));
      },

      applyThemePreset: (name) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          const preset = (UI_THEME_PRESETS as any)[name];
          if (preset) {
            state.uiTheme = { ...state.uiTheme, ...preset };
          }
        }));
      },

      toggleSiteTheme: () => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          const currentMode = state.globalSettings['GL11'].params[0].value;
          const newMode = currentMode === 'Light' ? 'Dark' : 'Light';
          state.globalSettings['GL11'].params[0].value = newMode;
          state.canvasKey += 1;

          const isDark = newMode === 'Dark';
          if (isDark) {
            state.globalSettings['GL02'].params[0].value = '#1A1A1A';
            state.globalSettings['GL02'].params[1].value = '#242424';
            state.globalSettings['GL02'].params[2].value = '#60A5FA';
            state.globalSettings['GL02'].params[3].value = '#F9FAFB';
            state.globalSettings['GL02'].params[4].value = '#9CA3AF';
            state.globalSettings['GL02'].params[5].value = '#374151';
            state.globalSettings['GL06'].params[0].value = '5';
            state.globalSettings['GL06'].params[3].value = '20';
          } else {
            state.globalSettings['GL02'].params[0].value = '#FFFFFF';
            state.globalSettings['GL02'].params[1].value = '#F3F4F6';
            state.globalSettings['GL02'].params[2].value = '#3B82F6';
            state.globalSettings['GL02'].params[3].value = '#1A1A1A';
            state.globalSettings['GL02'].params[4].value = '#6B7280';
            state.globalSettings['GL02'].params[5].value = '#E5E7EB';
            state.globalSettings['GL06'].params[0].value = '10';
            state.globalSettings['GL06'].params[3].value = '100';
          }
        }));
      },

      toggleGlobal: () => set(produce((state: GridState) => {
        state.isGlobalOpen = !state.isGlobalOpen;
        if (state.isGlobalOpen) {
          state.isBlockListOpen = false;
          state.isManagerOpen = false;
        }
      })),

      toggleBlockList: () => set(produce((state: GridState) => {
        state.isBlockListOpen = !state.isBlockListOpen;
        if (state.isBlockListOpen) {
          state.isGlobalOpen = false;
          state.isManagerOpen = false;
        }
      })),

      toggleManager: () => set({
        isManagerOpen: !get().isManagerOpen,
        isBlockListOpen: false,
        isGlobalOpen: false
      }),

      toggleDataPanel: () => set(produce((state: GridState) => {
        state.isDataPanelOpen = !state.isDataPanelOpen;
      })),

      refreshCanvas: () => set(produce((state: GridState) => {
        state.canvasKey += 1;
      })),

      saveSnapshot: (name) => set(produce((state: GridState) => {
        const snapshot = {
          id: crypto.randomUUID(),
          name: name || `Snapshot ${new Date().toLocaleTimeString()}`,
          timestamp: Date.now(),
          data: {
            pages: state.pages,
            globalSettings: state.globalSettings,
            uiTheme: state.uiTheme
          }
        };
        state.snapshots.unshift({ id: snapshot.id, name: snapshot.name, timestamp: snapshot.timestamp });
        localStorage.setItem(`studio-snapshot-${snapshot.id}`, JSON.stringify(snapshot));
      })),

      loadSnapshot: (id) => set(produce((state: GridState) => {
        const raw = localStorage.getItem(`studio-snapshot-${id}`);
        if (!raw) return;
        const snapshot = JSON.parse(raw);
        if (snapshot.data.pages) state.pages = snapshot.data.pages;
        if (snapshot.data.globalSettings) state.globalSettings = snapshot.data.globalSettings;
        if (snapshot.data.uiTheme) state.uiTheme = snapshot.data.uiTheme;
        state.contentBlocks = state.pages[state.currentPage] || [];
      })),

      optimizeLayout: () => set(produce((state: GridState) => {
        const globalPadY = state.globalSettings['GL03'].params[3].value;
        Object.values(state.pages).forEach(blocks => {
          blocks.forEach(block => {
            if (block.localOverrides.layout) {
              block.localOverrides.layout.paddingTop = globalPadY;
              block.localOverrides.layout.paddingBottom = globalPadY;
            }
          });
        });
      })),

      updateGlobal: (glId, idx, val) => set(produce((state: GridState) => {
        if (state.globalSettings[glId] && state.globalSettings[glId].params[idx]) {
          state.globalSettings[glId].params[idx].value = val;
        }
      })),

      updateParam: (glId, paramId, value) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          const group = state.globalSettings[glId];
          if (!group) return;
          const param = group.params.find(p => p.id === paramId);
          if (!param) return;

          switch (param.type) {
            case 'range':
              const num = parseFloat(value);
              if (!isNaN(num)) {
                const min = param.min ?? 0;
                const max = param.max ?? 100;
                param.value = Math.max(min, Math.min(max, num)).toString();
              }
              break;
            case 'toggle':
              param.value = value === 'true' || value === '1' ? 'true' : 'false';
              break;
            case 'color':
              if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) param.value = value;
              break;
            case 'select':
              if (param.options?.includes(value)) param.value = value;
              else if (!param.options) param.value = value;
              break;
            default:
              param.value = value;
          }

          if (glId === 'GL11' && paramId === 'P1') {
            const isDark = value === 'Dark';
            if (isDark) {
              state.globalSettings['GL02'].params[0].value = '#1A1A1A';
              state.globalSettings['GL02'].params[1].value = '#242424';
              state.globalSettings['GL02'].params[2].value = '#60A5FA';
              state.globalSettings['GL02'].params[3].value = '#F9FAFB';
              state.globalSettings['GL02'].params[4].value = '#9CA3AF';
              state.globalSettings['GL02'].params[5].value = '#374151';
              state.globalSettings['GL06'].params[0].value = '5';
              state.globalSettings['GL06'].params[3].value = '20';
            } else {
              state.globalSettings['GL02'].params[0].value = '#FFFFFF';
              state.globalSettings['GL02'].params[1].value = '#F3F4F6';
              state.globalSettings['GL02'].params[2].value = '#3B82F6';
              state.globalSettings['GL02'].params[3].value = '#1A1A1A';
              state.globalSettings['GL02'].params[4].value = '#6B7280';
              state.globalSettings['GL02'].params[5].value = '#E5E7EB';
              state.globalSettings['GL06'].params[0].value = '10';
              state.globalSettings['GL06'].params[3].value = '100';
            }
          }
        }));
      },

      bulkUpdateDNA: (updates: Record<string, string[]>) => set(produce((state: GridState) => {
        Object.entries(updates).forEach(([glId, params]) => {
          if (state.globalSettings[glId]) {
            (params as string[]).forEach((val, idx) => {
              if (state.globalSettings[glId].params[idx]) {
                state.globalSettings[glId].params[idx].value = val;
              }
            });
          }
        });
      })),

      addBlock: (type) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          const blocks = state.pages[state.currentPage] || [];
          const defaults: Record<string, any> = {
            'B0101': {
              data: {
                logo: '000-GEN',
                logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '800', letterSpacing: '0.1', lineHeight: '1', uppercase: true },
                showIcon: true, iconType: 'default', customIconUrl: '',
                showActionButton: true, actionButtonText: 'Start Build',
                links: [
                  { id: 'l1', label: 'Architecture', type: 'anchor', value: 'B0201', typo: { useGlobal: true } },
                  { id: 'l2', label: 'DNA Matrix', type: 'anchor', value: 'DNA', typo: { useGlobal: true } }
                ]
              },
              layout: { height: '80px', paddingX: '40', paddingY: '0', sticky: true, zIndex: 1000, variant: 'default' },
              style: { useGlobalDNA: true },
              btnUseGlobal: true,
              btnStyles: { size: "1.0", padX: "24", padY: "12", font: "12", stroke: "1", radius: "4", shadow: "false" },
            },
            'B0102': {
              data: {
                logo: '000-GEN',
                logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '800', letterSpacing: '0.1', lineHeight: '1', uppercase: true },
                showIcon: true, iconType: 'default', customIconUrl: '',
                showActionButton: true, actionButtonText: 'Initialize',
                links: [
                  { id: 'l1', label: 'Core', type: 'anchor', value: 'B0201', typo: { useGlobal: true } },
                  { id: 'l2', label: 'System', type: 'anchor', value: 'DNA', typo: { useGlobal: true } }
                ]
              },
              layout: { height: '70px', paddingX: '30', paddingY: '0', sticky: true, zIndex: 1000, variant: 'floating' },
              style: { useGlobalDNA: true },
              btnUseGlobal: true,
              btnStyles: { size: "0.9", padX: "20", padY: "10", font: "11", stroke: "1", radius: "8", shadow: "false" },
            },
            'B0103': {
              data: {
                logo: 'MAGNETIC',
                logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '900', letterSpacing: '0.2', lineHeight: '1', uppercase: true },
                showIcon: true, iconType: 'default', customIconUrl: '',
                showActionButton: true, actionButtonText: 'Connect',
                links: [
                  { id: 'l1', label: 'Vision', type: 'anchor', value: 'B0201', typo: { useGlobal: true } },
                  { id: 'l2', label: 'Nodes', type: 'anchor', value: 'DNA', typo: { useGlobal: true } }
                ]
              },
              layout: { height: '80px', paddingX: '40', paddingY: '0', sticky: true, zIndex: 1000, variant: 'magnetic' },
              style: { useGlobalDNA: true },
              physics: { strength: '0.5', friction: '0.1' },
              btnUseGlobal: true,
              btnStyles: { size: "1.0", padX: "24", padY: "12", font: "12", stroke: "1", radius: "40", shadow: "false" },
            },
            'B0201': {
              data: {
                title: "ULTIMATE UI SYNCHRONIZATION",
                titleTypo: { useGlobal: true, fontSize: '64', fontWeight: '900', letterSpacing: '-0.04', lineHeight: '0.9', uppercase: true },
                description: "14-Node architectural grid active. System stability: 100%. Synchronizing DNA with global parameters.",
                descriptionTypo: { useGlobal: true, fontSize: '20', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
                primaryBtnText: "Initialize System", primaryBtnVisible: true,
                secondaryBtnText: "View Protocol", secondaryBtnVisible: true
              },
              layout: { height: '85vh', alignment: 'center', paddingTop: '80px' },
              style: { useGlobalDNA: true, bgFill: '', titleColor: '', descColor: '' },
              media: { showImage: false, imageUrl: '', imagePosition: 'right', imageOpacity: 100, imageScale: 100 },
              background: { lockBackground: false, fixedColor: '#FFFFFF' },
              btnUseGlobal: true,
              animation: { useGlobal: true, duration: "0.8", stagger: "0.1", entranceY: "40" }
            },
            'B0202': {
              data: {
                title: "IMMERSIVE VIDEO EXPERIENCE",
                titleTypo: { useGlobal: true, fontSize: '84', fontWeight: '900', letterSpacing: '-0.05', lineHeight: '0.8', uppercase: true },
                description: "Dynamic video masking active. High-fidelity motion architecture initialized.",
                descriptionTypo: { useGlobal: true, fontSize: '20', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
                primaryBtnText: "Explore Motion", primaryBtnVisible: true,
                secondaryBtnText: "Read Specs", secondaryBtnVisible: true
              },
              layout: { height: '100vh', alignment: 'center', paddingTop: '0px' },
              style: { useGlobalDNA: true, bgFill: 'transparent' },
              media: { type: 'video', mask: 'text', videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-183768461_large.mp4', opacity: 100 },
              background: { lockBackground: true, fixedColor: '#000000' },
              btnUseGlobal: true,
              animation: { useGlobal: true, duration: "1.2", stagger: "0.2" }
            },
            'B0203': {
              data: {
                title: "3D NEURAL INTERFACE",
                titleTypo: { useGlobal: true, fontSize: '64', fontWeight: '900', letterSpacing: '-0.02', lineHeight: '1.0', uppercase: true },
                description: "Interactive 3D node orchestration. Real-time mouse response active.",
                objectType: 'sphere',
                splineLink: 'https://prod.spline.design/scene-placeholder'
              },
              layout: { height: '100vh', alignment: 'center', paddingTop: '0px' },
              style: { useGlobalDNA: true, background: 'transparent' },
              media: { show3D: true, interactive: true, sensitivity: 1.0 },
              physics: { strength: 0.5, friction: 0.1 },
              btnUseGlobal: true,
              animation: { useGlobal: true }
            },
            'B0301': {
              data: {
                groups: [
                  { id: 'g1', title: 'Modular Architecture', items: [{ name: 'React 18', level: 95 }, { name: 'Zustand', level: 90 }] },
                  { id: 'g2', title: 'Data Propagation', items: [{ name: 'Immer', level: 85 }, { name: 'DNA Sync', level: 100 }] }
                ]
              },
              layout: { columns: '2', gap: '60', paddingY: '120' },
              style: { useGlobalDNA: true }
            },
            'B0302': {
              data: {
                groups: [
                  { id: 'g1', title: 'Core Stack', items: [{ name: 'Typescript', level: 98 }, { name: 'Vite', level: 95 }] },
                  { id: 'g2', title: 'Design System', items: [{ name: 'Tailwind', level: 90 }, { name: 'Framer', level: 85 }] }
                ]
              },
              layout: { grid: 'bento', gap: '20', paddingY: '120' },
              style: { useGlobalDNA: true, glass: true },
              animation: { useGlobal: true }
            },
            'B0401': {
              data: {
                title: "THE NEURAL INTERFACE PROTOCOL",
                subtitle: "V1.2 SPECIFICATION",
                body: "Our 14-node architecture ensures that every component is strictly bound to the DNA Matrix. By manipulating global genetic parameters, designers can reskin entire applications in seconds while maintaining structural integrity."
              },
              layout: { paddingY: '120', maxWidth: '850', textAlign: 'left' },
              style: { useGlobalDNA: true, fontSize: '18', lineHeight: '1.8' }
            },
            'B0402': {
              data: {
                title: "SMART INDEX ARCHITECTURE",
                sections: [
                  { id: 's1', title: 'Initialization', content: 'Base neural layer setup...' },
                  { id: 's2', title: 'Propagation', content: 'Data flowing through nodes...' },
                  { id: 's3', title: 'Finalization', content: 'Matrix synchronization complete.' }
                ]
              },
              layout: { paddingY: '120', sidebarWidth: '280', sidebarPos: 'left' },
              style: { useGlobalDNA: true, highlightColor: '' },
              animation: { useGlobal: true }
            },
            'B0501': {
              data: {
                items: [
                  { id: 'p1', title: 'Neural Grid Alpha', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80' },
                  { id: 'p2', title: 'Matrix Sync Beta', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80' },
                  { id: 'p3', title: 'Vector Node Gamma', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' }
                ]
              },
              layout: { columns: '3', gap: '30', paddingY: '120' },
              style: { useGlobalDNA: true, useGlobalRadius: true, hoverScale: '1.05' }
            },
            'B0503': {
              data: {
                items: [
                  { id: 'm1', title: 'Tilt Grid Alpha', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80' },
                  { id: 'm2', title: 'Tilt Grid Beta', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80' },
                  { id: 'm3', title: 'Tilt Grid Gamma', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' }
                ]
              },
              layout: { columns: 'masonry', gap: '20', paddingY: '120' },
              style: { useGlobalDNA: true, tiltEffect: true, depth: 30 },
              physics: { strength: 0.8, friction: 0.15 },
              animation: { useGlobal: true }
            },
            'B0601': {
              data: {
                title: 'EVOLUTIONARY ROADMAP',
                items: [
                  { date: '2023', title: 'Alpha Node', desc: 'Core genetic engine finalized.' },
                  { date: '2024', title: 'Matrix Integration', desc: '14-node architecture deployed.' }
                ]
              },
              layout: { paddingY: '120', gap: '60' },
              style: { useGlobalDNA: true }
            },
            'B0602': {
              data: {
                title: 'HORIZONTAL TIMELINE',
                items: [
                  { date: '2021', title: 'Origin', desc: 'Core node conceived.' },
                  { date: '2022', title: 'Expansion', desc: 'Genetic matrix deployed.' },
                  { date: '2023', title: 'Nexus', desc: 'Global synchronization live.' }
                ]
              },
              layout: { paddingY: '160', scrollPath: 'horizontal' },
              style: { useGlobalDNA: true, trackColor: '' },
              animation: { useGlobal: true }
            },
            'B0701': {
              data: {
                title: "SYSTEM FREQUENCY (FAQ)",
                items: [
                  { id: 'f1', question: 'How does DNA Synchronization work?', answer: 'It propagates global parameters across 14 architectural nodes.' },
                  { id: 'f2', question: 'Is the grid modular?', answer: 'Yes, every block is a discrete node within the GEN matrix.' }
                ]
              },
              layout: { paddingY: '120', maxWidth: '800' },
              style: { useGlobalDNA: true, accent: '' },
              animation: { useGlobal: true }
            },
            'B0801': {
              data: {
                stats: [
                  { value: '100%', label: 'Stability' },
                  { value: '14', label: 'Nodes Sync' },
                  { value: '256ms', label: 'Latency' }
                ]
              },
              layout: { paddingY: '120', columns: '3' },
              style: { useGlobalDNA: true }
            },
            'B0901': {
              data: {},
              layout: { height: '120' },
              style: { useGlobalDNA: true }
            },
            'B1001': {
              data: {
                tabs: [
                  { id: 't1', label: 'Architecture', content: 'Node-based modular system.' },
                  { id: 't2', label: 'Propagation', content: 'Real-time state synchronization.' }
                ]
              },
              layout: { paddingY: '120' },
              style: { useGlobalDNA: true, variant: 'solid' },
              animation: { useGlobal: true }
            },
            'B1301': {
              data: { title: 'ESTABLISH LINK', subtitle: 'Direct neural interface connection for project orchestration.' },
              layout: { paddingY: '120' },
              style: { useGlobalDNA: true }
            },
            'B1401': {
              data: { companyName: '000-GEN' },
              layout: { paddingTop: '80', paddingBottom: '80' },
              style: { useGlobalDNA: true }
            },
            'B1501': {
              data: { tags: ['STABLE', 'SYNCHRONIZED', 'MODULAR', 'DNA-BOUND', 'ACTIVE'] },
              layout: { paddingY: '60', gap: '16' },
              style: { useGlobalDNA: true }
            },
            'B1601': {
              data: { title: 'Diagnostic Neural Feed', url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80' },
              layout: { paddingY: '120', aspect: '16/9' },
              style: { useGlobalDNA: true }
            },
            'B1602': {
              data: {
                title: 'MULTI-DEVICE ECOSYSTEM',
                previewUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80'
              },
              layout: { paddingY: '140', stackOffset: '60' },
              style: { useGlobalDNA: true, devices: ['macbook', 'ipad', 'iphone'] },
              animation: { useGlobal: true }
            },
            'B2101': {
              data: { items: [{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }, { id: '3', name: 'Gamma' }] },
              layout: { paddingY: '60' },
              style: { useGlobalDNA: true }
            },
            'B2201': {
              data: {
                items: [
                  { quote: 'The most stable architectural grid ever built.', name: 'Dr. Evelyn Wright', role: 'CTO @ Nexus' },
                  { quote: 'Genetic design changed our entire workflow.', name: 'James Vector', role: 'Design Lead' }
                ]
              },
              layout: { paddingY: '120', columns: '2' },
              style: { useGlobalDNA: true, useGlobalRadius: true }
            },
            'B2202': {
              data: {
                items: [
                  { quote: 'Absolute architectural perfection.', author: 'A. Jensen' },
                  { quote: 'The speed of synchronization is unprecedented.', author: 'M. Vercetti' },
                  { quote: 'DNA-based design is the future.', author: 'S. Kusanagi' }
                ]
              },
              layout: { paddingY: '80', speed: '40', direction: 'left' },
              style: { useGlobalDNA: true, marquee: true },
              animation: { useGlobal: true }
            },
            'B2401': {
              data: { platforms: [{ type: 'github', url: '#' }, { type: 'twitter', url: '#' }, { type: 'linkedin', url: '#' }] },
              layout: { paddingY: '60', position: 'center' },
              style: { useGlobalDNA: true }
            }
          };

          // Semantic Aliases for backward compatibility
          defaults['Navbar'] = defaults['B0101'];
          defaults['Hero'] = defaults['B0201'];
          defaults['Hero_Video'] = defaults['B0202'];
          defaults['Hero_3D'] = defaults['B0203'];
          defaults['Skills'] = defaults['B0301'];
          defaults['Skills_Bento'] = defaults['B0302'];
          defaults['Article'] = defaults['B0401'];
          defaults['Article_Index'] = defaults['B0402'];
          defaults['Portfolio'] = defaults['B0501'];
          defaults['Portfolio_Tilt'] = defaults['B0503'];
          defaults['Timeline'] = defaults['B0601'];
          defaults['Timeline_Horizontal'] = defaults['B0602'];
          defaults['Accordion'] = defaults['B0701'];
          defaults['Stats'] = defaults['B0801'];
          defaults['Spacer'] = defaults['B0901'];
          defaults['Tabs'] = defaults['B1001'];
          defaults['Badges'] = defaults['B1501'];
          defaults['Preview'] = defaults['B1601'];
          defaults['Preview_Multi'] = defaults['B1602'];
          defaults['ContactForm'] = defaults['B1301'];
          defaults['Footer'] = defaults['B1401'];
          defaults['Logos'] = defaults['B2101'];
          defaults['Testimonials'] = defaults['B2201'];
          defaults['Reviews'] = defaults['B2201'];
          defaults['Reviews_Marquee'] = defaults['B2202'];
          defaults['Socials'] = defaults['B2401'];
          defaults['SocialDock'] = defaults['B2401'];
          defaults['RadarChart'] = defaults['B2201']; // Re-mapping old diagnostic to review

          const newBlock: ContentBlock = {
            id: crypto.randomUUID(),
            type,
            localOverrides: defaults[type] || {},
            isVisible: true
          };

          if (!state.pages[state.currentPage]) state.pages[state.currentPage] = [];
          state.pages[state.currentPage].push(newBlock);
          state.contentBlocks = state.pages[state.currentPage];
          state.selectedBlockId = newBlock.id;
          state.canvasKey += 1;
        }));
      },

      removeBlock: (id) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          state.pages[state.currentPage] = state.pages[state.currentPage].filter(b => b.id !== id);
          state.contentBlocks = state.pages[state.currentPage];
          if (state.selectedBlockId === id) state.selectedBlockId = null;
        }));
      },

      moveBlock: (id, direction) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          const blocks = state.pages[state.currentPage] || [];
          const index = blocks.findIndex(b => b.id === id);
          if (index === -1) return;

          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex >= 0 && newIndex < blocks.length) {
            const temp = blocks[index];
            blocks[index] = blocks[newIndex];
            blocks[newIndex] = temp;
          }
          state.contentBlocks = blocks;
        }));
      },

      clearCanvas: () => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          state.pages[state.currentPage] = [];
          state.contentBlocks = [];
          state.canvasKey += 1;
        }));
      },

      toggleBlockVisibility: (id) => set(produce((state: GridState) => {
        const blocks = state.pages[state.currentPage] || [];
        const block = blocks.find(b => b.id === id);
        if (block) block.isVisible = !block.isVisible;
      })),

      setSelectedBlock: (id) => set({ selectedBlockId: id, isBlockListOpen: false, isGlobalOpen: false }),

      updateBlockLocal: (id, path, value) => {
        get().takeHistorySnapshot();
        set(produce((state: GridState) => {
          const blocks = state.pages[state.currentPage] || [];
          const block = blocks.find(b => b.id === id);
          if (!block) return;

          const keys = path.split('.');
          let current = block.localOverrides;
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i + 1];
            const isNextKeyIndex = !isNaN(Number(nextKey));
            if (!current[key]) current[key] = isNextKeyIndex ? [] : {};
            current = current[key];
          }
          current[keys[keys.length - 1]] = value;
          state.contentBlocks = blocks;
        }));
      },

      initNavbarBlock: () => set(produce((state: GridState) => {
        const id = 'B0101-CORE';
        const blocks = state.pages[state.currentPage] || [];
        if (blocks.find(b => b.id === id)) return;
        const navbar: ContentBlock = {
          id, type: 'B0101', isVisible: true,
          localOverrides: {
            textColor: '',
            data: {
              logo: '000-GEN',
              logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '700', letterSpacing: '0', lineHeight: '1.2', uppercase: false },
              showIcon: true, iconType: 'default', customIconUrl: '',
              showActionButton: true, actionButtonText: 'Start Build',
              links: [
                { id: 'l1', label: 'Architecture', type: 'anchor', value: 'B0201', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } },
                { id: 'l3', label: 'Genetic DNA', type: 'anchor', value: 'DNA', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } },
                { id: 'l2', label: 'Open Project', type: 'url', value: 'https://google.com', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } }
              ]
            },
            layout: { height: '80px', paddingX: '40', paddingY: '0', sticky: true, zIndex: 1000 },
            btnUseGlobal: true,
            btnStyles: { size: "1.0", padX: "24", padY: "12", font: "12", stroke: "1", radius: "4", shadow: "false" },
            animation: { useGlobal: true, entranceType: 'slide-down', stickyAnimation: true }
          }
        };
        blocks.unshift(navbar);
        state.contentBlocks = blocks;
      })),

      initHeroBlock: () => set(produce((state: GridState) => {
        const id = 'B0201-CORE';
        const blocks = state.pages[state.currentPage] || [];
        if (blocks.find(b => b.id === id)) return;
        const hero: ContentBlock = {
          id, type: 'B0201', isVisible: true,
          localOverrides: {
            data: {
              title: "DESIGN DRIVEN BY DNA",
              titleTypo: { useGlobal: true, fontSize: '48', fontWeight: '800', letterSpacing: '-0.02', lineHeight: '1.1', uppercase: true },
              description: "Configure your interface through global genetic parameters or local overrides.",
              descriptionTypo: { useGlobal: true, fontSize: '18', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
              primaryBtnText: "Launch System", primaryBtnVisible: true,
              secondaryBtnText: "Read Protocol", secondaryBtnVisible: true
            },
            layout: { height: '85vh', alignment: 'center', paddingTop: '80px' },
            style: { bgFill: '', titleColor: '', descColor: '' },
            media: {
              showImage: true,
              imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=2000',
              imagePosition: 'right', imageOpacity: 100, imageScale: 100, shape: 'square', levitation: false, levitationSpeed: '3'
            },
            background: { lockBackground: false, fixedColor: '#FFFFFF' },
            btnUseGlobal: true,
            btnStyles: { size: "1.0", padX: "28", padY: "16", font: "14", stroke: "1", radius: "6", shadow: "false" },
            animation: { useGlobal: true, duration: "0.8", stagger: "0.15", entranceY: "40" }
          }
        };
        blocks.push(hero);
        state.contentBlocks = blocks;
      })),

      exportProjectData: () => {
        const state = get();
        return JSON.stringify({
          uiTheme: state.uiTheme,
          globalSettings: state.globalSettings,
          pages: state.pages,
          currentPage: state.currentPage
        }, null, 2);
      },

      importProjectData: (json) => set(produce((state: GridState) => {
        try {
          const data = JSON.parse(json);
          if (data.globalSettings) state.globalSettings = data.globalSettings;
          if (data.pages) {
            state.pages = data.pages;
            state.currentPage = data.currentPage || Object.keys(data.pages)[0] || 'home';
            state.contentBlocks = state.pages[state.currentPage] || [];
          }
          if (data.uiTheme) state.uiTheme = data.uiTheme;
        } catch (e) {
          console.error("Failed to import project data:", e);
        }
      })),

      setGlobalDNA: (data: Record<string, string[]>) => set(produce((state: GridState) => {
        Object.entries(data).forEach(([glId, params]) => {
          if (state.globalSettings[glId]) {
            (params as string[]).forEach((val, idx) => {
              if (state.globalSettings[glId].params[idx]) {
                state.globalSettings[glId].params[idx].value = val;
              }
            });
          }
        });
      })),

      resetVisibility: () => set(produce((state: GridState) => {
        Object.keys(state.pages).forEach(page => {
          state.pages[page].forEach(block => { block.isVisible = true; });
        });
        state.contentBlocks = state.pages[state.currentPage] || [];
        state.canvasKey += 1;
        state.uiTheme.uiTextBrightness = 100;
      })),

      serializeState: () => {
        const state = get();
        return { uiTheme: state.uiTheme, globalSettings: state.globalSettings, pages: state.pages, currentPage: state.currentPage };
      },

      deserializeState: (input) => set(produce((state: GridState) => {
        try {
          const data = typeof input === 'string' ? JSON.parse(input) : input;
          if (data.globalSettings) state.globalSettings = data.globalSettings;
          if (data.pages) {
            state.pages = data.pages;
            state.currentPage = data.currentPage || Object.keys(data.pages)[0] || 'home';
            state.contentBlocks = state.pages[state.currentPage] || [];
          }
          if (data.uiTheme) state.uiTheme = data.uiTheme;
        } catch (e) {
          console.error("Failed to deserialize state:", e);
        }
      })),

      ioFeedback: false,
      triggerIOFeedback: () => {
        set({ ioFeedback: true });
        setTimeout(() => set({ ioFeedback: false }), 600);
      },
    }),
    { name: 'constructor-dna-storage' }
  )
);
