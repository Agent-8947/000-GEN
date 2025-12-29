
import React from 'react';
import { useStore } from '../store';
import { Plus, Layout, ArrowUp, ArrowDown, X, Layers, Grid } from 'lucide-react';

export const BlockList: React.FC = () => {
  const {
    addBlock,
    contentBlocks,
    removeBlock,
    moveBlock,
    selectedBlockId,
    setSelectedBlock,
    uiTheme
  } = useStore();

  const hoverBg = 'hover:bg-black/5';

  const registry = [
    { id: 'B0101', type: 'Navbar', label: 'NAVBAR', icon: <Layout size={14} /> },
    { id: 'B0201', type: 'Hero', label: 'HERO', icon: <Layers size={14} /> },
    { id: 'B0301', type: 'Features', label: 'FEATURES', icon: <Grid size={14} /> }
  ];

  return (
    <div
      className="w-[320px] h-full border-r animate-[slideIn_0.3s_ease-out] relative flex flex-col overflow-hidden"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Registry Section (Add) */}
      <div className="p-8 pb-4">
        <h2 className="font-sans font-medium text-[11px] tracking-[0.4em] uppercase opacity-30 select-none flex items-center gap-3 mb-6">
          <Plus size={12} />
          <span>Registry</span>
        </h2>
        <div className="space-y-1">
          {registry.map(item => (
            <button
              key={item.id}
              onClick={() => addBlock(item.type)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${hoverBg} border border-transparent hover:border-blue-500/10`}
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono opacity-20 group-hover:opacity-100 transition-opacity">
                  {item.id}
                </span>
                <span className="text-[13px] font-semibold tracking-[0.1em] opacity-70 group-hover:opacity-100 uppercase transition-all">
                  {item.label}
                </span>
              </div>
              <div className="opacity-20 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                {item.icon}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[1px] my-2" style={{ backgroundColor: uiTheme.elements, opacity: 0.3 }} />

      {/* Management Section (Layers) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-6">
          <h2 className="font-sans font-medium text-[11px] tracking-[0.4em] uppercase opacity-30 select-none flex items-center gap-3">
            <Layers size={12} />
            <span>Architecture</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
          {contentBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 opacity-10">
              <span className="text-[10px] uppercase tracking-widest text-center px-10">No architecture nodes deployed</span>
            </div>
          ) : (
            contentBlocks.map((block, index) => (
              <div
                key={block.id}
                onClick={() => setSelectedBlock(block.id)}
                className="group relative flex flex-col p-6 border-b transition-all cursor-pointer hover:bg-black/5"
                style={{
                  color: selectedBlockId === block.id ? uiTheme.accents : uiTheme.fonts,
                  borderColor: uiTheme.elements
                }}
              >
                <div className="flex items-center justify-between mb-4 text-[10px] font-mono">
                  <span style={{ color: selectedBlockId === block.id ? uiTheme.accents : undefined, opacity: selectedBlockId === block.id ? 1 : 0.2 }}>
                    {block.type}_NODE
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                      disabled={index === 0}
                      className="p-1 hover:text-blue-500 disabled:opacity-30"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                      disabled={index === contentBlocks.length - 1}
                      className="p-1 hover:text-blue-500 disabled:opacity-30"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                      className="p-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-1 h-10 rounded-full ${selectedBlockId === block.id ? '' : 'bg-black/[0.05]'}`}
                    style={{ backgroundColor: selectedBlockId === block.id ? uiTheme.accents : undefined }}
                  />
                  <div className="flex flex-col">
                    <span className={`text-[13px] font-mono font-bold tracking-tight ${selectedBlockId === block.id ? 'opacity-100' : 'opacity-40'}`}>
                      {block.id.slice(0, 8)}
                    </span>
                    <span className="text-[9px] opacity-20 uppercase tracking-[0.2em] mt-0.5">
                      Instance_Active
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        className="p-6 border-t opacity-10 text-[9px] font-mono tracking-widest text-center"
        style={{ borderColor: uiTheme.elements }}
      >
        MGMT_CORE_V1.2
      </div>
    </div>
  );
};
