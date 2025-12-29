
import { create } from 'zustand';
import { produce } from 'immer';
import { persist } from 'zustand/middleware';

interface GlobalSetting {
  name: string;
  params: string[];
}

interface GridState {
  theme: 'light' | 'dark';
  canvasKey: number;
  isGlobalOpen: boolean;
  isBlockListOpen: boolean;
  isDataPanelOpen: boolean;
  globalSettings: Record<string, GlobalSetting>;
  toggleTheme: () => void;
  toggleGlobal: () => void;
  toggleBlockList: () => void;
  toggleDataPanel: () => void;
  refreshCanvas: () => void;
  updateGlobal: (glId: string, idx: number, val: string) => void;
}

export const useStore = create<GridState>()(
  persist(
    (set) => ({
      theme: 'light',
      canvasKey: 0,
      isGlobalOpen: false,
      isBlockListOpen: false,
      isDataPanelOpen: false,
      globalSettings: Array.from({ length: 10 }).reduce((acc, _, i) => {
        const id = `GL${(i + 1).toString().padStart(2, '0')}`;
        acc[id] = { name: `Global ${id}`, params: Array(7).fill('') };
        return acc;
      }, {} as Record<string, GlobalSetting>),
      
      toggleTheme: () => set(produce((state: GridState) => { 
        state.theme = state.theme === 'light' ? 'dark' : 'light';
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
        if (state.globalSettings[glId]) {
          state.globalSettings[glId].params[idx] = val;
        }
      })),
    }),
    { name: 'constructor-dna-storage' }
  )
);
