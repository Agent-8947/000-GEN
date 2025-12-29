
import React from 'react';
import { useStore } from '../store';

export const DataPanel: React.FC = () => {
  const { uiTheme } = useStore();

  return (
    <div
      className="w-[320px] h-full border-l animate-[slideInRight_0.3s_ease-out] transition-colors duration-500 relative flex flex-col"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* 
        STERILE DATA VOID: 
        Unified IO space. Monochrome container with 1px borders.
        Ready for import/export architecture implementation.
      */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden opacity-0 pointer-events-none">
        {/* Hidden Logical Containers (Background Data Processing) */}
        <div id="io-export-vault" className="hidden" aria-hidden="true" />
        <div id="io-import-vault" className="hidden" aria-hidden="true" />
      </div>

      {/* Decorative Header (Empty) */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: uiTheme.elements }}>
        <div className="h-1 w-8 bg-gray-500/20 rounded-full" />
      </div>
    </div>
  );
};
