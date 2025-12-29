

import { create } from 'zustand';
import { produce } from 'immer';
import { persist } from 'zustand/middleware';

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
  };
  canvasKey: number;
  isGlobalOpen: boolean;
  isBlockListOpen: boolean;
  isDataPanelOpen: boolean;
  globalSettings: Record<string, GlobalSetting>;
  contentBlocks: ContentBlock[];
  selectedBlockId: string | null;
  viewportMode: 'desktop' | 'mobile';
  gridMode: 'off' | 'columns' | 'mobile' | 'rows';

  setViewport: (mode: 'desktop' | 'mobile') => void;
  cycleGrid: () => void;

  togglePreviewMode: () => void;
  updateUITheme: (key: 'fonts' | 'darkPanel' | 'lightPanel' | 'elements' | 'accents', value: string) => void;
  toggleSiteTheme: () => void;
  toggleGlobal: () => void;
  toggleBlockList: () => void;
  toggleDataPanel: () => void;
  refreshCanvas: () => void;
  updateGlobal: (glId: string, idx: number, val: string) => void;
  updateParam: (glId: string, paramId: string, value: string) => void;

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
}

export const useStore = create<GridState>()(
  persist(
    (set, get) => ({
      isPreviewMode: false,
      uiTheme: {
        fonts: '#111827',
        darkPanel: '#E5E7EB',
        lightPanel: '#FFFFFF',
        elements: '#9CA3AF',
        accents: '#3B82F6'
      },
      canvasKey: 0,
      isGlobalOpen: false,
      isBlockListOpen: false,
      isDataPanelOpen: false,
      contentBlocks: [],
      selectedBlockId: null,
      viewportMode: 'desktop',
      gridMode: 'off',
      setViewport: (mode) => set({ viewportMode: mode }),
      cycleGrid: () => set((state) => ({
        gridMode: state.gridMode === 'off' ? 'columns' :
          state.gridMode === 'columns' ? 'mobile' :
            state.gridMode === 'mobile' ? 'rows' : 'off'
      })),
      globalSettings: (() => {
        const groups: Record<string, { name: string; params: string[] }> = {
          'GL01': { name: 'Space Grotesk System', params: ["Base Size", "Scale Ratio", "Line Height", "Weight", "Tracking", "Uppercase", "Smoothing"] },
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
                  { v: "true", min: 0, max: 0, t: 'toggle' }     // Smoothing
                ];
                const s = spec[j];
                type = s.t as any;
                value = s.v;
                min = s.min;
                max = s.max;
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
        state.isPreviewMode = !state.isPreviewMode;
        if (state.isPreviewMode) {
          state.selectedBlockId = null;
          state.isGlobalOpen = false;
          state.isBlockListOpen = false;
          state.isDataPanelOpen = false;
        }
      })),

      updateUITheme: (key, value) => set(produce((state: GridState) => {
        state.uiTheme[key] = value;
      })),

      toggleSiteTheme: () => set(produce((state: GridState) => {
        const currentMode = state.globalSettings['GL11'].params[0].value;
        const newMode = currentMode === 'Light' ? 'Dark' : 'Light';
        state.globalSettings['GL11'].params[0].value = newMode;
        state.canvasKey += 1;

        // Trigger Site Theme Side Effects (Mirrors GL11 logic in updateParam)
        const isDark = newMode === 'Dark';
        if (isDark) {
          state.globalSettings['GL02'].params[0].value = '#1A1A1A'; // Base Bg
          state.globalSettings['GL02'].params[1].value = '#242424'; // Surface
          state.globalSettings['GL02'].params[2].value = '#60A5FA'; // Accent
          state.globalSettings['GL02'].params[3].value = '#F9FAFB'; // Text Prim
          state.globalSettings['GL02'].params[4].value = '#9CA3AF'; // Text Sec
          state.globalSettings['GL02'].params[5].value = '#374151'; // Border
          state.globalSettings['GL06'].params[0].value = '5';       // Shadow Intensity
          state.globalSettings['GL06'].params[3].value = '20';      // Glass Opacity
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
      })),

      toggleGlobal: () => set(produce((state: GridState) => {
        state.isGlobalOpen = !state.isGlobalOpen;
        if (state.isGlobalOpen) {
          state.isBlockListOpen = false;
        }
      })),

      toggleBlockList: () => set(produce((state: GridState) => {
        state.isBlockListOpen = !state.isBlockListOpen;
        if (state.isBlockListOpen) {
          state.isGlobalOpen = false;
        }
      })),

      toggleDataPanel: () => set(produce((state: GridState) => {
        state.isDataPanelOpen = !state.isDataPanelOpen;
      })),

      refreshCanvas: () => set(produce((state: GridState) => {
        state.canvasKey += 1;
      })),

      updateGlobal: (glId, idx, val) => set(produce((state: GridState) => {
        if (state.globalSettings[glId] && state.globalSettings[glId].params[idx]) {
          state.globalSettings[glId].params[idx].value = val;
        }
      })),

      updateParam: (glId, paramId, value) => set(produce((state: GridState) => {
        const group = state.globalSettings[glId];
        if (!group) return;
        const param = group.params.find(p => p.id === paramId);
        if (!param) return;

        // Validation based on type
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
            if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
              param.value = value;
            }
            break;
          case 'select':
            if (param.options?.includes(value)) {
              param.value = value;
            } else if (!param.options) {
              param.value = value;
            }
            break;
          default:
            param.value = value;
        }

        // AUTO-CALIBRATE: GL11 Side Effects
        if (glId === 'GL11' && paramId === 'P1') {
          const newTheme = value; // 'Light' or 'Dark'
          const isDark = newTheme === 'Dark';

          // State theme removed - site theme logic independent

          if (isDark) {
            state.globalSettings['GL02'].params[0].value = '#1A1A1A'; // Base Bg
            state.globalSettings['GL02'].params[1].value = '#242424'; // Surface
            state.globalSettings['GL02'].params[2].value = '#60A5FA'; // Accent
            state.globalSettings['GL02'].params[3].value = '#F9FAFB'; // Text Prim
            state.globalSettings['GL02'].params[4].value = '#9CA3AF'; // Text Sec
            state.globalSettings['GL02'].params[5].value = '#374151'; // Border
            state.globalSettings['GL06'].params[0].value = '5';       // Shadow Intensity
            state.globalSettings['GL06'].params[3].value = '20';      // Glass Opacity
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
      })),

      // DNA_Storage_System
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

      // Block_Architecture_Engine
      addBlock: (type) => set(produce((state: GridState) => {
        const defaults: Record<string, any> = {
          'B0101': {
            data: {
              logo: '000-GEN',
              logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '700', letterSpacing: '0', lineHeight: '1.2', uppercase: false },
              showIcon: true,
              iconType: 'default',
              customIconUrl: '',
              showActionButton: true,
              actionButtonText: 'Start',
              links: [
                { id: 'l1', label: 'Architecture', type: 'anchor', value: 'B0101', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } },
                { id: 'l2', label: 'External', type: 'url', value: 'https://google.com', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } }
              ]
            },
            layout: { height: '80px', padding: '24px', sticky: true, zIndex: 1000 },
            btnUseGlobal: true,
            btnStyles: {
              size: "1.0",
              padX: "24",
              padY: "12",
              font: "12",
              stroke: "1",
              radius: "4",
              shadow: "false"
            },
            animation: {
              useGlobal: true,
              entranceType: 'slide-down',
              stickyAnimation: true
            }
          },
          'Navbar': {
            data: {
              logo: '000-GEN',
              logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '700', letterSpacing: '0', lineHeight: '1.2', uppercase: false },
              showIcon: true,
              iconType: 'default',
              customIconUrl: '',
              showActionButton: true,
              actionButtonText: 'Start',
              links: [
                { id: 'l1', label: 'Architecture', type: 'anchor', value: 'B0101', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } },
                { id: 'l2', label: 'External', type: 'url', value: 'https://google.com', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } }
              ]
            },
            layout: { height: '80px', paddingX: '40', paddingY: '0', sticky: true, zIndex: 1000 },
            btnUseGlobal: true,
            btnStyles: {
              size: "1.0",
              padX: "24",
              padY: "12",
              font: "12",
              stroke: "1",
              radius: "4",
              shadow: "false"
            },
            animation: {
              useGlobal: true,
              entranceType: 'slide-down',
              stickyAnimation: true
            }
          },
          'Hero': {
            data: {
              title: "DESIGN DRIVEN BY DNA",
              titleTypo: { useGlobal: true, fontSize: '48', fontWeight: '800', letterSpacing: '-0.02', lineHeight: '1.1', uppercase: true },
              description: "Configure your interface through global genetic parameters or local overrides.",
              descriptionTypo: { useGlobal: true, fontSize: '18', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
              primaryBtnText: "Get Started",
              primaryBtnVisible: true,
              secondaryBtnText: "Documentation",
              secondaryBtnVisible: true
            },
            layout: {
              height: '70vh',
              alignment: 'center',
              paddingTop: '80px'
            },
            style: {
              bgFill: '',
              titleColor: '',
              descColor: ''
            },
            media: {
              showImage: false,
              imageUrl: '',
              imagePosition: 'right',
              imageOpacity: 100,
              imageScale: 100,
              shape: 'square',
              levitation: false,
              levitationSpeed: '3'
            },
            background: {
              lockBackground: false,
              fixedColor: '#FFFFFF'
            },
            btnUseGlobal: true,
            btnStyles: {
              size: "1.0",
              padX: "24",
              padY: "12",
              font: "12",
              stroke: "1",
              radius: "4",
              shadow: "false"
            },
            animation: {
              useGlobal: true,
              duration: "0.6",
              stagger: "0.1",
              entranceY: "20"
            }
          },
          'B0201': {
            data: {
              title: "DESIGN DRIVEN BY DNA",
              titleTypo: { useGlobal: true, fontSize: '48', fontWeight: '800', letterSpacing: '-0.02', lineHeight: '1.1', uppercase: true },
              description: "Configure your interface through global genetic parameters or local overrides.",
              descriptionTypo: { useGlobal: true, fontSize: '18', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
              primaryBtnText: "Get Started",
              primaryBtnVisible: true,
              secondaryBtnText: "Documentation",
              secondaryBtnVisible: true
            },
            layout: {
              height: '70vh',
              alignment: 'center',
              paddingTop: '80px'
            },
            style: {
              bgFill: '',
              titleColor: '',
              descColor: ''
            },
            media: {
              showImage: false,
              imageUrl: '',
              imagePosition: 'right',
              imageOpacity: 100,
              shape: 'square',
              levitation: false,
              levitationSpeed: '3'
            },
            background: {
              lockBackground: false,
              fixedColor: '#FFFFFF'
            },
            btnUseGlobal: true,
            btnStyles: {
              size: "1.0",
              padX: "24",
              padY: "12",
              font: "12",
              stroke: "1",
              radius: "4",
              shadow: "false"
            },
            animation: {
              useGlobal: true,
              duration: "0.6",
              stagger: "0.1",
              entranceY: "20"
            }
          },
          'B0301': {
            data: {
              cards: [
                { id: '1', title: 'Modular Architecture', desc: 'Components that snap together with biological precision.', icon: 'box' },
                { id: '2', title: 'Genetic Design', desc: 'Themes inherited through a global DNA parameter system.', icon: 'layers' },
                { id: '3', title: 'Instant Compilation', desc: 'Zero-latency rendering engine for immediate feedback.', icon: 'zap' }
              ]
            },
            layout: {
              columns: '3',
              gap: '32',
              paddingTop: '80',
              paddingBottom: '80'
            },
            style: {
              background: '',
              color: '',
              accent: ''
            }
          }
        };

        const newBlock: ContentBlock = {
          id: crypto.randomUUID(),
          type,
          localOverrides: defaults[type] || {},
          isVisible: true
        };
        state.contentBlocks.push(newBlock);
      })),

      removeBlock: (id) => set(produce((state: GridState) => {
        state.contentBlocks = state.contentBlocks.filter(b => b.id !== id);
        if (state.selectedBlockId === id) state.selectedBlockId = null;
      })),

      moveBlock: (id, direction) => set(produce((state: GridState) => {
        const index = state.contentBlocks.findIndex(b => b.id === id);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < state.contentBlocks.length) {
          const temp = state.contentBlocks[index];
          state.contentBlocks[index] = state.contentBlocks[newIndex];
          state.contentBlocks[newIndex] = temp;
        }
      })),

      clearCanvas: () => set(produce((state: GridState) => {
        state.contentBlocks = [];
      })),

      toggleBlockVisibility: (id) => set(produce((state: GridState) => {
        const block = state.contentBlocks.find(b => b.id === id);
        if (block) {
          block.isVisible = !block.isVisible;
        }
      })),

      setSelectedBlock: (id) => set({ selectedBlockId: id, isBlockListOpen: false, isGlobalOpen: false }),

      updateBlockLocal: (id, path, value) => set(produce((state: GridState) => {
        const block = state.contentBlocks.find(b => b.id === id);
        if (!block) return;

        const keys = path.split('.');
        let current = block.localOverrides;
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          const nextKey = keys[i + 1];
          const isNextKeyIndex = !isNaN(Number(nextKey));

          if (!current[key]) {
            current[key] = isNextKeyIndex ? [] : {};
          }
          current = current[key];
        }
        current[keys[keys.length - 1]] = value;
      })),

      // MASTER_V1.2_SYNC: B0101_Navbar_Core
      initNavbarBlock: () => set(produce((state: GridState) => {
        const id = 'B0101-CORE';
        if (state.contentBlocks.find(b => b.id === id)) return;

        const navbar: ContentBlock = {
          id,
          type: 'B0101',
          isVisible: true,
          localOverrides: {
            textColor: '',
            data: {
              logo: '000-GEN',
              logoTypo: { useGlobal: true, fontSize: '20', fontWeight: '700', letterSpacing: '0', lineHeight: '1.2', uppercase: false },
              showIcon: true,
              iconType: 'default',
              customIconUrl: '',
              showActionButton: true,
              actionButtonText: 'Start Build',
              links: [
                { id: 'l1', label: 'Architecture', type: 'anchor', value: 'B0201', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } },
                { id: 'l3', label: 'Genetic DNA', type: 'anchor', value: 'DNA', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } },
                { id: 'l2', label: 'Open Project', type: 'url', value: 'https://google.com', typo: { useGlobal: true, fontSize: '14', fontWeight: '500', letterSpacing: '0', lineHeight: '1.2', uppercase: false } }
              ]
            },
            layout: { height: '80px', paddingX: '40', paddingY: '0', sticky: true, zIndex: 1000 },
            btnUseGlobal: true,
            btnStyles: {
              size: "1.0",
              padX: "24",
              padY: "12",
              font: "12",
              stroke: "1",
              radius: "4",
              shadow: "false"
            },
            animation: {
              useGlobal: true,
              entranceType: 'slide-down',
              stickyAnimation: true
            }
          }
        };
        state.contentBlocks.unshift(navbar);
      })),

      // MASTER_V1.2_SYNC: B0201_Hero_Core
      initHeroBlock: () => set(produce((state: GridState) => {
        const id = 'B0201-CORE';
        if (state.contentBlocks.find(b => b.id === id)) return;

        const hero: ContentBlock = {
          id,
          type: 'B0201',
          isVisible: true,
          localOverrides: {
            data: {
              title: "DESIGN DRIVEN BY DNA",
              titleTypo: { useGlobal: true, fontSize: '48', fontWeight: '800', letterSpacing: '-0.02', lineHeight: '1.1', uppercase: true },
              description: "Configure your interface through global genetic parameters or local overrides.",
              descriptionTypo: { useGlobal: true, fontSize: '18', fontWeight: '400', letterSpacing: '0', lineHeight: '1.6', uppercase: false },
              primaryBtnText: "Launch System",
              primaryBtnVisible: true,
              secondaryBtnText: "Read Protocol",
              secondaryBtnVisible: true
            },
            layout: { height: '85vh', alignment: 'center', paddingTop: '80px' },
            style: { bgFill: '', titleColor: '', descColor: '' },
            media: {
              showImage: true,
              imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=2000',
              imagePosition: 'right',
              imageOpacity: 100,
              imageScale: 100,
              shape: 'square',
              levitation: false,
              levitationSpeed: '3'
            },
            background: { lockBackground: false, fixedColor: '#FFFFFF' },
            btnUseGlobal: true,
            btnStyles: { size: "1.0", padX: "28", padY: "16", font: "14", stroke: "1", radius: "6", shadow: "false" },
            animation: { useGlobal: true, duration: "0.8", stagger: "0.15", entranceY: "40" }
          }
        };
        state.contentBlocks.push(hero);
      })),

      // IO_Data_Service
      exportProjectData: () => {
        const state = get();
        return JSON.stringify({
          uiTheme: state.uiTheme,
          globalSettings: state.globalSettings,
          contentBlocks: state.contentBlocks
        }, null, 2);
      },

      importProjectData: (json) => set(produce((state: GridState) => {
        try {
          const data = JSON.parse(json);
          if (data.globalSettings) state.globalSettings = data.globalSettings;
          if (data.contentBlocks) state.contentBlocks = data.contentBlocks;
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

      serializeState: () => {
        const state = get();
        return {
          uiTheme: state.uiTheme,
          globalSettings: state.globalSettings,
          contentBlocks: state.contentBlocks
        };
      },

      deserializeState: (input) => set(produce((state: GridState) => {
        try {
          const data = typeof input === 'string' ? JSON.parse(input) : input;
          if (data.globalSettings) state.globalSettings = data.globalSettings;
          if (data.contentBlocks) state.contentBlocks = data.contentBlocks;
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

