

import React from 'react';
import { CircleDot, Plus, Layout, Image, Grid, Square, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store';

export const Sidebar: React.FC = () => {
  const {
    isGlobalOpen,
    toggleGlobal,
    isBlockListOpen,
    toggleBlockList,
    contentBlocks,
    selectedBlockId,
    setSelectedBlock,
    toggleBlockVisibility,
    uiTheme
  } = useStore();

  const activeColor = 'text-blue-500';
  const inactiveColor = 'text-gray-400 hover:text-black';
  const borderColor = 'border-gray-200';

  const getBlockIcon = (type: string) => {
    if (type === 'B0101' || type === 'Navbar') return <Layout size={18} strokeWidth={2} />;
    if (type === 'B0201' || type === 'Hero') return <Image size={18} strokeWidth={2} />;
    if (type === 'B0301' || type === 'Features') return <Grid size={18} strokeWidth={2} />;
    return <Square size={18} strokeWidth={2} />;
  };

  return (
    <aside
      className="w-[60px] h-full border-r z-50 flex flex-col items-center py-6 transition-colors duration-500"
      style={{
        backgroundColor: uiTheme.lightPanel,
        borderColor: uiTheme.elements,
        color: uiTheme.fonts
      }}
    >
      <div className="mb-8 flex flex-col items-center gap-6 w-full">
        {/* Master Logo Button */}
        <button
          onClick={toggleGlobal}
          className="p-1.5 transition-all duration-300 relative group flex items-center justify-center"
          style={{ color: isGlobalOpen ? uiTheme.accents : uiTheme.elements }}
        >
          <CircleDot size={26} strokeWidth={1.5} />
          {isGlobalOpen && <div className="absolute left-0 w-[2px] h-6" style={{ backgroundColor: uiTheme.accents }} />}
        </button>

        {/* Add Block Button */}
        <button
          onClick={toggleBlockList}
          className="p-1.5 transition-all duration-300 relative group flex items-center justify-center"
          style={{ color: isBlockListOpen ? uiTheme.accents : uiTheme.elements }}
        >
          <Plus size={30} strokeWidth={1} />
          {isBlockListOpen && <div className="absolute left-0 w-[2px] h-6" style={{ backgroundColor: uiTheme.accents }} />}
        </button>

        <div className="w-8 h-[1px] opacity-30 my-2" style={{ backgroundColor: uiTheme.elements }} />

        {/* Layers / Active Blocks List */}
        <div className="flex flex-col gap-3 w-full items-center overflow-y-auto max-h-[60vh] custom-scrollbar px-2">
          {contentBlocks.map((block) => (
            <div key={block.id} className="relative group w-full flex justify-center">
              <button
                onClick={() => setSelectedBlock(selectedBlockId === block.id ? null : block.id)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:brightness-95"
                style={{
                  color: selectedBlockId === block.id ? uiTheme.accents : uiTheme.elements,
                  opacity: selectedBlockId === block.id ? 1 : 0.6,
                  backgroundColor: selectedBlockId === block.id ? `${uiTheme.accents}10` : 'transparent'
                }}
                title={block.type}
              >
                {getBlockIcon(block.type)}
              </button>

              {/* Quick Toggle Visibility */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBlockVisibility(block.id);
                }}
                className="absolute -right-1 -top-1 p-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 border"
                style={{
                  backgroundColor: uiTheme.lightPanel,
                  borderColor: uiTheme.elements
                }}
              >
                {block.isVisible ? <Eye size={10} /> : <EyeOff size={10} className="text-red-500" />}
              </button>

              {selectedBlockId === block.id && (
                <div
                  className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full shadow-sm"
                  style={{ backgroundColor: uiTheme.accents }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

